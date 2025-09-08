import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.7.1';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { jobId } = await req.json();
    
    if (!jobId) {
      return new Response(
        JSON.stringify({ error: 'Job ID is required' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    const supabaseUrl = Deno.env.get('SUPABASE_URL') || '';
    const supabaseKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') || '';
    const openaiApiKey = Deno.env.get('OPENAI_API_KEY') || '';
    
    if (!openaiApiKey) {
      throw new Error('OpenAI API key not configured');
    }

    const supabase = createClient(supabaseUrl, supabaseKey);

    console.log('Starting batch analysis for job:', jobId);

    // Get job details
    const { data: job, error: jobError } = await supabase
      .from('jobs')
      .select('*')
      .eq('id', jobId)
      .single();

    if (jobError || !job) {
      console.error('Job not found:', jobError);
      return new Response(
        JSON.stringify({ error: 'Job not found' }),
        { status: 404, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Update job status to processing
    await supabase
      .from('jobs')
      .update({ 
        status: 'processing', 
        started_at: new Date().toISOString() 
      })
      .eq('id', jobId);

    const photoIds = job.input_data.photoIds;
    const analysisOptions = job.input_data.analysisOptions;
    const results = [];
    let processedCount = 0;

    // Process photos in batches to avoid overwhelming the API
    const batchSize = 3;
    for (let i = 0; i < photoIds.length; i += batchSize) {
      const batch = photoIds.slice(i, i + batchSize);
      
      await Promise.all(batch.map(async (photoId: string) => {
        try {
          const result = await processPhoto(supabase, photoId, analysisOptions, openaiApiKey, job.user_id);
          results.push({ photoId, success: true, result });
          processedCount++;
          
          // Update progress
          const progress = Math.round((processedCount / photoIds.length) * 100);
          await supabase
            .from('jobs')
            .update({ 
              progress, 
              processed_items: processedCount,
              output_data: { results }
            })
            .eq('id', jobId);
            
          console.log(`Processed photo ${photoId}, progress: ${progress}%`);
        } catch (error) {
          console.error(`Error processing photo ${photoId}:`, error);
          results.push({ 
            photoId, 
            success: false, 
            error: error.message 
          });
          processedCount++;
          
          const progress = Math.round((processedCount / photoIds.length) * 100);
          await supabase
            .from('jobs')
            .update({ 
              progress, 
              processed_items: processedCount,
              output_data: { results }
            })
            .eq('id', jobId);
        }
      }));

      // Small delay between batches to be respectful to the API
      if (i + batchSize < photoIds.length) {
        await new Promise(resolve => setTimeout(resolve, 1000));
      }
    }

    // Mark job as completed
    await supabase
      .from('jobs')
      .update({ 
        status: 'completed',
        completed_at: new Date().toISOString(),
        progress: 100,
        processed_items: processedCount,
        output_data: { results }
      })
      .eq('id', jobId);

    console.log(`Batch analysis completed for job ${jobId}. Processed: ${processedCount}/${photoIds.length}`);

    return new Response(
      JSON.stringify({ 
        success: true, 
        message: 'Batch analysis completed',
        processed: processedCount,
        total: photoIds.length
      }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );

  } catch (error) {
    console.error('Error in batch-ai-analysis:', error);
    
    // Try to update job status to failed if we have a jobId
    try {
      const { jobId } = await req.json();
      if (jobId) {
        const supabase = createClient(
          Deno.env.get('SUPABASE_URL') || '', 
          Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') || ''
        );
        await supabase
          .from('jobs')
          .update({ 
            status: 'failed',
            error_message: error.message,
            completed_at: new Date().toISOString()
          })
          .eq('id', jobId);
      }
    } catch (updateError) {
      console.error('Error updating job status:', updateError);
    }

    return new Response(
      JSON.stringify({ error: 'Batch analysis failed' }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});

async function processPhoto(
  supabase: any, 
  photoId: string, 
  analysisOptions: any, 
  openaiApiKey: string,
  userId: string
) {
  // Get photo details and signed URL
  const { data: photo, error: photoError } = await supabase
    .from('photos')
    .select('*')
    .eq('id', photoId)
    .eq('user_id', userId)
    .single();

  if (photoError || !photo) {
    throw new Error(`Photo not found: ${photoId}`);
  }

  // Get signed URL for the photo
  const { data: signedUrlData } = await supabase
    .storage
    .from('user-photos')
    .createSignedUrl(photo.file_path, 3600);

  if (!signedUrlData?.signedUrl) {
    throw new Error(`Could not generate signed URL for photo: ${photoId}`);
  }

  console.log(`Analyzing photo: ${photo.file_name}`);

  const updates: any = {
    analysis_completed_at: new Date().toISOString()
  };

  let aiFilename = null;
  let tags: string[] = [];
  let description = null;

  // AI-powered filename generation (focused approach)
  if (analysisOptions.improveFilename) {
    try {
      const filenameResponse = await fetch('https://api.openai.com/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${openaiApiKey}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          model: 'gpt-4o-mini',
          messages: [
            {
              role: 'user',
              content: [
                {
                  type: 'text',
                  text: 'Analyze this image and generate a descriptive filename. The filename should be concise (2-4 words), describe the main subject/content, and be suitable for a file system. Return ONLY the filename without extension, no explanation.'
                },
                {
                  type: 'image_url',
                  image_url: { url: signedUrlData.signedUrl }
                }
              ]
            }
          ],
          max_completion_tokens: 50,
        }),
      });

      if (filenameResponse.ok) {
        const filenameResult = await filenameResponse.json();
        const suggestedName = filenameResult.choices[0]?.message?.content?.trim();
        
        if (suggestedName) {
          // Sanitize the filename
          const sanitizedName = suggestedName
            .replace(/[^a-zA-Z0-9\s-]/g, '')
            .replace(/\s+/g, '-')
            .toLowerCase()
            .substring(0, 50);

          const originalExtension = photo.original_name.split('.').pop() || 'jpg';
          aiFilename = `${sanitizedName}.${originalExtension}`;
          updates.file_name = aiFilename;
        }
      }
    } catch (error) {
      console.error('AI filename generation error:', error);
      // Continue with other analysis even if filename generation fails
    }
  }

  // Combined analysis for tags and descriptions
  if (analysisOptions.generateTags || analysisOptions.generateDescription) {
    try {
      const analysisResponse = await fetch('https://api.openai.com/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${openaiApiKey}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          model: 'gpt-4o-mini',
          messages: [
            {
              role: 'system',
              content: `You are an AI photo analyst. Analyze the image and provide:
${analysisOptions.generateDescription ? '1. A concise description (max 100 words)' : ''}
${analysisOptions.generateTags ? '2. Relevant tags (max 10, comma-separated)' : ''}

Respond in JSON format: ${JSON.stringify({
  ...(analysisOptions.generateDescription && { description: "..." }),
  ...(analysisOptions.generateTags && { tags: "tag1,tag2,tag3" })
})}`
            },
            {
              role: 'user',
              content: [
                { 
                  type: 'text', 
                  text: `Analyze this photo named "${photo.file_name}". ${analysisOptions.generateDescription ? 'Provide a description.' : ''} ${analysisOptions.generateTags ? 'Provide relevant tags.' : ''}`
                },
                { 
                  type: 'image_url', 
                  image_url: { url: signedUrlData.signedUrl }
                }
              ]
            }
          ],
          max_completion_tokens: 300,
        }),
      });

      if (analysisResponse.ok) {
        const analysisResult = await analysisResponse.json();
        const content = analysisResult.choices[0].message.content;
        
        let parsedAnalysis;
        try {
          parsedAnalysis = JSON.parse(content);
        } catch (parseError) {
          console.error('Failed to parse analysis response:', content);
          // Continue without failing the entire process
        }

        if (parsedAnalysis) {
          if (analysisOptions.generateDescription && parsedAnalysis.description) {
            description = parsedAnalysis.description;
            updates.ai_description = description;
          }

          if (analysisOptions.generateTags && parsedAnalysis.tags) {
            tags = parsedAnalysis.tags.split(',').map((tag: string) => tag.trim()).filter(Boolean);
            if (tags.length > 0) {
              updates.ai_generated_tags = tags;
            }
          }
        }
      }
    } catch (error) {
      console.error('AI analysis error:', error);
      // Continue without failing the entire process
    }
  }

  // Update photo record
  await supabase
    .from('photos')
    .update(updates)
    .eq('id', photoId);

  // Insert tags into photo_tags table
  if (analysisOptions.generateTags && tags.length > 0) {
    const tagInserts = tags.map((tag: string) => ({
      photo_id: photoId,
      tag: tag,
      source: 'ai',
      confidence: 0.8
    }));

    await supabase
      .from('photo_tags')
      .insert(tagInserts);
  }

  return {
    aiFilename,
    description,
    tags,
    updatedFields: Object.keys(updates)
  };
}
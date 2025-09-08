import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.7.1';

// Force redeployment to ensure latest secrets are available

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { photoId, signedUrl } = await req.json();
    
    if (!photoId || !signedUrl) {
      throw new Error('Photo ID and signed URL are required');
    }

    const openaiApiKey = Deno.env.get('OPENAI_API_KEY');
    const supabaseUrl = Deno.env.get('SUPABASE_URL');
    const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY');

    console.log('Environment variables check:', {
      hasOpenAI: !!openaiApiKey,
      hasSupabaseUrl: !!supabaseUrl,
      hasServiceKey: !!supabaseServiceKey,
      supabaseUrl: supabaseUrl ? 'present' : 'missing'
    });

    if (!openaiApiKey || !supabaseUrl || !supabaseServiceKey) {
      const missing = [];
      if (!openaiApiKey) missing.push('OPENAI_API_KEY');
      if (!supabaseUrl) missing.push('SUPABASE_URL');
      if (!supabaseServiceKey) missing.push('SUPABASE_SERVICE_ROLE_KEY');
      throw new Error(`Missing required environment variables: ${missing.join(', ')}`);
    }

    // Initialize Supabase client with service role key
    const supabase = createClient(supabaseUrl, supabaseServiceKey);

    console.log('Analyzing image with OpenAI Vision API...');
    
    // Use OpenAI Vision API to analyze the image
    const response = await fetch('https://api.openai.com/v1/chat/completions', {
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
                image_url: {
                  url: signedUrl
                }
              }
            ]
          }
        ],
        max_tokens: 50,
        temperature: 0.3
      }),
    });

    if (!response.ok) {
      const error = await response.text();
      console.error('OpenAI API error:', error);
      throw new Error(`OpenAI API error: ${response.status}`);
    }

    const aiResponse = await response.json();
    const suggestedName = aiResponse.choices[0]?.message?.content?.trim();
    
    if (!suggestedName) {
      throw new Error('Failed to generate filename from AI');
    }

    console.log('AI suggested filename:', suggestedName);

    // Sanitize the filename (remove special characters, spaces, etc.)
    const sanitizedName = suggestedName
      .replace(/[^a-zA-Z0-9\s-]/g, '')
      .replace(/\s+/g, '-')
      .toLowerCase()
      .substring(0, 50); // Limit length

    // Get the current photo metadata to preserve extension
    const { data: photoData, error: fetchError } = await supabase
      .from('photos')
      .select('*')
      .eq('id', photoId)
      .single();

    if (fetchError || !photoData) {
      throw new Error('Failed to fetch photo metadata');
    }

    // Extract original extension
    const originalExtension = photoData.original_name.split('.').pop() || 'jpg';
    const newFileName = `${sanitizedName}.${originalExtension}`;

    // Update the database with new names
    const { error: updateError } = await supabase
      .from('photos')
      .update({
        file_name: newFileName,
        original_name: newFileName,
        updated_at: new Date().toISOString()
      })
      .eq('id', photoId);

    if (updateError) {
      console.error('Database update error:', updateError);
      throw new Error('Failed to update photo metadata');
    }

    console.log('Successfully renamed photo:', photoId, 'to:', newFileName);

    return new Response(
      JSON.stringify({ 
        success: true, 
        newName: newFileName,
        suggestedName: sanitizedName
      }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );

  } catch (error) {
    console.error('Error in ai-photo-rename function:', error);
    return new Response(
      JSON.stringify({ 
        success: false, 
        error: error.message 
      }),
      { 
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
      }
    );
  }
});
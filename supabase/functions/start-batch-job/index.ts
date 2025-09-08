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
    const { photoIds, analysisOptions } = await req.json();
    
    if (!photoIds || !Array.isArray(photoIds) || photoIds.length === 0) {
      return new Response(
        JSON.stringify({ error: 'Photo IDs are required and must be a non-empty array' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Get user from JWT
    const authHeader = req.headers.get('authorization');
    if (!authHeader) {
      return new Response(
        JSON.stringify({ error: 'Authorization header required' }),
        { status: 401, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    const supabaseUrl = Deno.env.get('SUPABASE_URL') || '';
    const supabaseKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') || '';
    const supabase = createClient(supabaseUrl, supabaseKey);

    // Verify user and get user ID
    const { data: { user }, error: userError } = await supabase.auth.getUser(
      authHeader.replace('Bearer ', '')
    );

    if (userError || !user) {
      return new Response(
        JSON.stringify({ error: 'Invalid or expired token' }),
        { status: 401, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    console.log('Creating batch job for user:', user.id, 'photos:', photoIds.length);

    // Verify user owns all the photos
    const { data: photos, error: photosError } = await supabase
      .from('photos')
      .select('id, file_name, file_path')
      .in('id', photoIds)
      .eq('user_id', user.id);

    if (photosError) {
      console.error('Error fetching photos:', photosError);
      return new Response(
        JSON.stringify({ error: 'Failed to verify photo ownership' }),
        { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    if (photos.length !== photoIds.length) {
      return new Response(
        JSON.stringify({ error: 'Some photos not found or access denied' }),
        { status: 403, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Create job record
    const { data: job, error: jobError } = await supabase
      .from('jobs')
      .insert({
        user_id: user.id,
        job_type: 'batch_ai_analysis',
        status: 'pending',
        total_items: photoIds.length,
        input_data: {
          photoIds,
          analysisOptions: analysisOptions || {
            generateTags: true,
            generateDescription: true,
            improveFilename: true
          }
        }
      })
      .select()
      .single();

    if (jobError) {
      console.error('Error creating job:', jobError);
      return new Response(
        JSON.stringify({ error: 'Failed to create job' }),
        { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    console.log('Job created successfully:', job.id);

    // Start background processing
    fetch(`${supabaseUrl}/functions/v1/batch-ai-analysis`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${supabaseKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ jobId: job.id }),
    }).catch(err => console.error('Error starting background job:', err));

    return new Response(
      JSON.stringify({ 
        success: true, 
        jobId: job.id,
        message: `Batch analysis started for ${photoIds.length} photos`
      }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );

  } catch (error) {
    console.error('Error in start-batch-job:', error);
    return new Response(
      JSON.stringify({ error: 'Internal server error' }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});
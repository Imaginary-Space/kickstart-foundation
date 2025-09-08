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
    const supabaseUrl = Deno.env.get('SUPABASE_URL');
    const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY');

    if (!supabaseUrl || !supabaseServiceKey) {
      throw new Error('Missing required environment variables');
    }

    const supabase = createClient(supabaseUrl, supabaseServiceKey);

    // Find jobs that are stuck in pending state for more than 10 minutes
    const tenMinutesAgo = new Date(Date.now() - 10 * 60 * 1000).toISOString();
    
    const { data: stuckJobs, error: queryError } = await supabase
      .from('jobs')
      .select('*')
      .eq('status', 'pending')
      .lt('created_at', tenMinutesAgo);

    if (queryError) {
      throw new Error(`Failed to query stuck jobs: ${queryError.message}`);
    }

    let clearedCount = 0;

    if (stuckJobs && stuckJobs.length > 0) {
      const { error: updateError } = await supabase
        .from('jobs')
        .update({
          status: 'failed',
          error_message: 'Job timed out and was automatically cancelled',
          completed_at: new Date().toISOString()
        })
        .eq('status', 'pending')
        .lt('created_at', tenMinutesAgo);

      if (updateError) {
        throw new Error(`Failed to update stuck jobs: ${updateError.message}`);
      }

      clearedCount = stuckJobs.length;
    }

    console.log(`Cleared ${clearedCount} stuck jobs`);

    return new Response(
      JSON.stringify({ 
        success: true, 
        message: `Cleared ${clearedCount} stuck jobs`
      }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );

  } catch (error) {
    console.error('Error in clear-stuck-jobs function:', error);
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
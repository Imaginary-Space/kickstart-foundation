import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
    const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
    
    const supabase = createClient(supabaseUrl, supabaseServiceKey);

    const {
      user_id,
      error_type,
      operation,
      error_message,
      error_details,
      file_info,
      user_agent,
      url,
      severity
    } = await req.json();

    console.log(`Logging error: ${operation} - ${error_type} - ${severity}`);

    // Validate required fields
    if (!error_type || !operation || !error_message) {
      throw new Error('Missing required fields: error_type, operation, error_message');
    }

    // Rate limiting check (simple implementation)
    if (user_id) {
      const oneMinuteAgo = new Date(Date.now() - 60 * 1000).toISOString();
      const { count } = await supabase
        .from('error_logs')
        .select('*', { count: 'exact', head: true })
        .eq('user_id', user_id)
        .gte('created_at', oneMinuteAgo);

      if (count && count > 10) {
        console.warn(`Rate limit exceeded for user ${user_id}`);
        return new Response(
          JSON.stringify({ error: 'Rate limit exceeded' }),
          { 
            status: 429,
            headers: { ...corsHeaders, 'Content-Type': 'application/json' }
          }
        );
      }
    }

    // Insert error log
    const { error: insertError } = await supabase
      .from('error_logs')
      .insert({
        user_id,
        error_type,
        operation,
        error_message: error_message.substring(0, 1000), // Limit message length
        error_details: error_details || {},
        file_info: file_info || {},
        user_agent: user_agent?.substring(0, 500), // Limit user agent length
        url: url?.substring(0, 500), // Limit URL length
        severity: severity || 'medium'
      });

    if (insertError) {
      console.error('Error inserting log:', insertError);
      throw insertError;
    }

    console.log('Error logged successfully');
    
    return new Response(
      JSON.stringify({ success: true }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      }
    );

  } catch (error) {
    console.error('Error in log-error function:', error);
    
    return new Response(
      JSON.stringify({ error: error.message }),
      {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      }
    );
  }
});
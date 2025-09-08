import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

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
    const startTime = Date.now();
    
    // Initialize Supabase client
    const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
    const supabaseKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
    const supabase = createClient(supabaseUrl, supabaseKey);

    // Test database connectivity with a simple query
    const { data: dbTest, error: dbError } = await supabase
      .from('profiles')
      .select('count')
      .limit(1);

    const responseTime = Date.now() - startTime;
    const success = !dbError;
    const statusCode = success ? 200 : 500;

    // Prepare health check response
    const healthData = {
      status: success ? 'healthy' : 'unhealthy',
      timestamp: new Date().toISOString(),
      response_time_ms: responseTime,
      database: {
        connected: success,
        error: dbError?.message || null
      },
      uptime: process.uptime ? Math.floor(process.uptime()) : null,
      version: '1.0.0'
    };

    // Log health check if we have authentication (for storing metrics)
    if (req.headers.get('authorization')) {
      try {
        await supabase
          .from('health_metrics')
          .insert({
            endpoint_name: 'health-check',
            response_time_ms: responseTime,
            status_code: statusCode,
            success: success,
            error_message: dbError?.message || null,
            metadata: {
              database_connected: success,
              uptime: healthData.uptime
            }
          });
      } catch (logError) {
        console.error('Failed to log health metrics:', logError);
        // Continue execution even if logging fails
      }
    }

    return new Response(
      JSON.stringify(healthData),
      {
        status: statusCode,
        headers: {
          ...corsHeaders,
          'Content-Type': 'application/json',
        },
      }
    );

  } catch (error) {
    console.error('Health check error:', error);
    
    return new Response(
      JSON.stringify({
        status: 'unhealthy',
        timestamp: new Date().toISOString(),
        error: error.message,
        response_time_ms: Date.now() - Date.now()
      }),
      {
        status: 500,
        headers: {
          ...corsHeaders,
          'Content-Type': 'application/json',
        },
      }
    );
  }
});
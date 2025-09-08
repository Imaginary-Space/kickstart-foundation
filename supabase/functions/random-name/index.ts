import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

interface NameResponse {
  name: string;
  source: 'db' | 'redis';
}

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    // Initialize Supabase client
    const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
    const supabaseKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
    const supabase = createClient(supabaseUrl, supabaseKey);

    // Initialize Redis client
    const redisUrl = Deno.env.get('UPSTASH_REDIS_REST_URL')!;
    const redisToken = Deno.env.get('UPSTASH_REDIS_REST_TOKEN')!;
    const cacheKey = 'demo:lastName';

    console.log('Checking Redis cache for key:', cacheKey);

    // Try to get from Redis cache first
    try {
      const redisResponse = await fetch(`${redisUrl}/get/${cacheKey}`, {
        headers: {
          'Authorization': `Bearer ${redisToken}`,
        },
      });

      if (redisResponse.ok) {
        const redisData = await redisResponse.json();
        console.log('Redis response:', redisData);

        if (redisData.result) {
          console.log('Cache hit! Returning cached name:', redisData.result);
          return new Response(
            JSON.stringify({
              name: redisData.result,
              source: 'redis'
            } as NameResponse),
            {
              headers: { ...corsHeaders, 'Content-Type': 'application/json' },
            }
          );
        }
      }
    } catch (redisError) {
      console.log('Redis cache miss or error:', redisError);
    }

    console.log('Cache miss, fetching from database');

    // Fetch random name from database
    const { data: names, error } = await supabase
      .from('names')
      .select('label')
      .limit(1);

    if (error) {
      console.error('Database error:', error);
      throw error;
    }

    if (!names || names.length === 0) {
      throw new Error('No names found in database');
    }

    // Get a random name from the result
    const randomIndex = Math.floor(Math.random() * names.length);
    const randomName = names[randomIndex].label;

    console.log('Fetched name from database:', randomName);

    // Cache the result in Redis for 10 seconds
    try {
      const cacheResponse = await fetch(`${redisUrl}/setex/${cacheKey}/10/${randomName}`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${redisToken}`,
        },
      });

      if (cacheResponse.ok) {
        console.log('Successfully cached name in Redis');
      } else {
        console.log('Failed to cache in Redis:', await cacheResponse.text());
      }
    } catch (cacheError) {
      console.log('Error caching to Redis:', cacheError);
    }

    return new Response(
      JSON.stringify({
        name: randomName,
        source: 'db'
      } as NameResponse),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      }
    );

  } catch (error) {
    console.error('Error:', error);
    return new Response(
      JSON.stringify({ error: error.message }),
      {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      }
    );
  }
});
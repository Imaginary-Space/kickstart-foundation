import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.7.1';

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
    const { query } = await req.json();
    
    if (!query || query.trim().length === 0) {
      return new Response(JSON.stringify({ results: [] }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
    const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
    const openAIApiKey = Deno.env.get('OPENAI_API_KEY');

    if (!openAIApiKey) {
      throw new Error('OpenAI API key not configured');
    }

    const supabase = createClient(supabaseUrl, supabaseServiceKey);

    // Fetch all published docs
    const { data: docs, error: docsError } = await supabase
      .from('docs')
      .select('*')
      .eq('published', true)
      .order('sort_order', { ascending: true });

    if (docsError) {
      throw docsError;
    }

    // Use OpenAI to understand the query and rank the docs
    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${openAIApiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'gpt-4o-mini',
        messages: [
          {
            role: 'system',
            content: `You are a documentation search assistant. Given a user query and a list of documentation sections, you need to:
1. Understand what the user is looking for
2. Rank the most relevant documentation sections (max 5 results)
3. Provide a brief explanation of why each result is relevant
4. Return results in JSON format with: id, title, relevance_score (0-100), snippet (brief explanation of relevance)

The documentation is for a photo renaming and management application.`
          },
          {
            role: 'user',
            content: `User query: "${query}"

Available documentation sections:
${docs.map(doc => `ID: ${doc.id}, Title: ${doc.title}, Description: ${doc.description || ''}, Keywords: ${doc.keywords?.join(', ') || ''}, Content preview: ${doc.content.substring(0, 200)}...`).join('\n\n')}

Please return the top 5 most relevant results in this exact JSON format:
{
  "results": [
    {
      "id": "doc_id",
      "title": "Doc Title",
      "relevance_score": 95,
      "snippet": "Brief explanation of why this is relevant"
    }
  ]
}`
          }
        ],
        max_tokens: 1000,
        temperature: 0.3
      }),
    });

    const aiResponse = await response.json();
    
    if (!aiResponse.choices?.[0]?.message?.content) {
      throw new Error('Invalid AI response');
    }

    let aiResults;
    try {
      aiResults = JSON.parse(aiResponse.choices[0].message.content);
    } catch (parseError) {
      console.error('Failed to parse AI response:', aiResponse.choices[0].message.content);
      throw new Error('Failed to parse AI response');
    }

    // Enrich results with full doc data
    const enrichedResults = aiResults.results.map((result: any) => {
      const doc = docs.find(d => d.id === result.id);
      if (!doc) return null;
      
      return {
        id: doc.id,
        title: doc.title,
        description: doc.description,
        category: doc.category,
        relevance_score: result.relevance_score,
        snippet: result.snippet,
        content_preview: doc.content.substring(0, 150) + '...'
      };
    }).filter(Boolean);

    return new Response(JSON.stringify({ results: enrichedResults }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });

  } catch (error) {
    console.error('Error in ai-docs-search function:', error);
    return new Response(JSON.stringify({ 
      error: error.message,
      results: [] 
    }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.39.3';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

interface Snippet {
  id?: string;
  title: string;
  description?: string;
  code: string;
  language: string;
  tags: string[];
  is_public?: boolean;
  user_id?: string;
}

// Helper function to return generic error messages to clients
// while logging detailed errors server-side for debugging
const getPublicError = (error: any): string => {
  // Log detailed error server-side
  console.error('Database operation error:', error);
  
  // Map common database errors to user-friendly messages
  if (error.code === '23505') return 'This item already exists';
  if (error.code === '23503') return 'Invalid reference';
  if (error.code === '23502') return 'Missing required field';
  if (error.code === 'PGRST116') return 'Item not found';
  
  // Generic error for everything else
  return 'An error occurred. Please try again.';
};

Deno.serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_ANON_KEY') ?? '',
      {
        global: {
          headers: { Authorization: req.headers.get('Authorization')! },
        },
      }
    );

    const url = new URL(req.url);
    const pathParts = url.pathname.split('/').filter(Boolean);
    const snippetId = pathParts[pathParts.length - 1];
    const isIdRequest = snippetId && snippetId !== 'snippets-api';

    console.log(`Request: ${req.method} ${url.pathname}`);

    // GET /snippets-api - List all public snippets
    // GET /snippets-api?user_id=xxx - List user's snippets
    // GET /snippets-api?language=Python - Filter by language
    // GET /snippets-api?tags=react,hooks - Filter by tags
    if (req.method === 'GET' && !isIdRequest) {
      const userId = url.searchParams.get('user_id');
      const language = url.searchParams.get('language');
      const tags = url.searchParams.get('tags');
      const search = url.searchParams.get('search');

      let query = supabaseClient
        .from('snippets')
        .select(`
          *,
          profiles:user_id (username, avatar_url)
        `);

      // Apply filters
      if (userId) {
        query = query.eq('user_id', userId);
      } else {
        query = query.eq('is_public', true);
      }

      if (language) {
        query = query.eq('language', language);
      }

      if (tags) {
        const tagArray = tags.split(',').map(t => t.trim());
        query = query.contains('tags', tagArray);
      }

      if (search) {
        // Sanitize search input to prevent SQL injection
        const sanitized = search.replace(/%/g, '\\%').replace(/_/g, '\\_');
        query = query.or(`title.ilike.%${sanitized}%,description.ilike.%${sanitized}%`);
      }

      query = query.order('created_at', { ascending: false });

      const { data, error } = await query;

      if (error) {
        return new Response(
          JSON.stringify({ error: getPublicError(error) }),
          { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 400 }
        );
      }

      return new Response(
        JSON.stringify({ data, count: data?.length || 0 }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 200 }
      );
    }

    // GET /snippets-api/:id - Get specific snippet
    if (req.method === 'GET' && isIdRequest) {
      const { data, error } = await supabaseClient
        .from('snippets')
        .select(`
          *,
          profiles:user_id (username, avatar_url)
        `)
        .eq('id', snippetId)
        .single();

      if (error) {
        return new Response(
          JSON.stringify({ error: getPublicError(error) }),
          { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 404 }
        );
      }

      // Check if snippet is public or user is owner
      const { data: { user } } = await supabaseClient.auth.getUser();
      if (!data.is_public && data.user_id !== user?.id) {
        return new Response(
          JSON.stringify({ error: 'Snippet not found or not accessible' }),
          { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 404 }
        );
      }

      return new Response(
        JSON.stringify({ data }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 200 }
      );
    }

    // POST /snippets-api - Create new snippet (requires auth)
    if (req.method === 'POST') {
      const { data: { user } } = await supabaseClient.auth.getUser();
      
      if (!user) {
        return new Response(
          JSON.stringify({ error: 'Authentication required' }),
          { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 401 }
        );
      }

      const body: Snippet = await req.json();
      
      // Validate required fields
      if (!body.title || !body.code || !body.language) {
        return new Response(
          JSON.stringify({ error: 'Missing required fields: title, code, language' }),
          { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 400 }
        );
      }

      const snippetData = {
        title: body.title,
        description: body.description || null,
        code: body.code,
        language: body.language,
        tags: body.tags || [],
        is_public: body.is_public ?? true,
        user_id: user.id,
      };

      const { data, error } = await supabaseClient
        .from('snippets')
        .insert(snippetData)
        .select(`
          *,
          profiles:user_id (username, avatar_url)
        `)
        .single();

      if (error) {
        return new Response(
          JSON.stringify({ error: getPublicError(error) }),
          { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 400 }
        );
      }

      return new Response(
        JSON.stringify({ data, message: 'Snippet created successfully' }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 201 }
      );
    }

    // PUT /snippets-api/:id - Update snippet (requires auth & ownership)
    if (req.method === 'PUT' && isIdRequest) {
      const { data: { user } } = await supabaseClient.auth.getUser();
      
      if (!user) {
        return new Response(
          JSON.stringify({ error: 'Authentication required' }),
          { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 401 }
        );
      }

      // Check ownership
      const { data: existing } = await supabaseClient
        .from('snippets')
        .select('user_id')
        .eq('id', snippetId)
        .single();

      if (!existing || existing.user_id !== user.id) {
        return new Response(
          JSON.stringify({ error: 'Snippet not found or unauthorized' }),
          { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 404 }
        );
      }

      const body: Partial<Snippet> = await req.json();
      
      const updateData: Partial<Snippet> = {};
      if (body.title !== undefined) updateData.title = body.title;
      if (body.description !== undefined) updateData.description = body.description;
      if (body.code !== undefined) updateData.code = body.code;
      if (body.language !== undefined) updateData.language = body.language;
      if (body.tags !== undefined) updateData.tags = body.tags;
      if (body.is_public !== undefined) updateData.is_public = body.is_public;

      const { data, error } = await supabaseClient
        .from('snippets')
        .update(updateData)
        .eq('id', snippetId)
        .select(`
          *,
          profiles:user_id (username, avatar_url)
        `)
        .single();

      if (error) {
        return new Response(
          JSON.stringify({ error: getPublicError(error) }),
          { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 400 }
        );
      }

      return new Response(
        JSON.stringify({ data, message: 'Snippet updated successfully' }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 200 }
      );
    }

    // DELETE /snippets-api/:id - Delete snippet (requires auth & ownership)
    if (req.method === 'DELETE' && isIdRequest) {
      const { data: { user } } = await supabaseClient.auth.getUser();
      
      if (!user) {
        return new Response(
          JSON.stringify({ error: 'Authentication required' }),
          { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 401 }
        );
      }

      // Check ownership
      const { data: existing } = await supabaseClient
        .from('snippets')
        .select('user_id')
        .eq('id', snippetId)
        .single();

      if (!existing || existing.user_id !== user.id) {
        return new Response(
          JSON.stringify({ error: 'Snippet not found or unauthorized' }),
          { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 404 }
        );
      }

      const { error } = await supabaseClient
        .from('snippets')
        .delete()
        .eq('id', snippetId);

      if (error) {
        return new Response(
          JSON.stringify({ error: getPublicError(error) }),
          { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 400 }
        );
      }

      return new Response(
        JSON.stringify({ message: 'Snippet deleted successfully' }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 200 }
      );
    }

    return new Response(
      JSON.stringify({ error: 'Method not allowed' }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 405 }
    );

  } catch (error) {
    console.error('Unexpected error:', error);
    return new Response(
      JSON.stringify({ error: 'Internal server error' }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 500 }
    );
  }
});

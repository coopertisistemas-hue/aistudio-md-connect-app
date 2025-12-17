import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const corsHeaders = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

Deno.serve(async (req: Request) => {
    // Debug: Log incoming request
    console.log(`[devotionals-get] ${req.method} request received`);

    if (req.method === 'OPTIONS') {
        return new Response('ok', { headers: corsHeaders })
    }

    try {
        const supabase = createClient(
            Deno.env.get('SUPABASE_URL') ?? '',
            Deno.env.get('SUPABASE_ANON_KEY') ?? ''
        )

        let id, latest, lang;

        // Handle POST (body) or GET (url)
        if (req.method === 'POST') {
            const body = await req.json().catch(() => ({}));
            id = body.id;
            latest = body.latest;
            lang = body.lang;
            console.log('[devotionals-get] POST body params:', { id, latest, lang });
        } else {
            const url = new URL(req.url)
            id = url.searchParams.get('id')
            latest = url.searchParams.get('latest')
            lang = url.searchParams.get('lang')
            console.log('[devotionals-get] GET URL params:', { id, latest, lang });
        }

        lang = lang || 'pt';

        let query = supabase
            .from('devotionals')
            .select('*')
            .eq('lang', lang)
            .lte('published_at', new Date().toISOString())

        if (id) {
            const { data, error } = await supabase
                .from('devotionals')
                .select('*')
                .eq('id', id)
                .maybeSingle()

            if (error) throw error
            return new Response(JSON.stringify(data), {
                headers: { ...corsHeaders, 'Content-Type': 'application/json' },
                status: 200,
            })
        }
        else if (latest === 'true') {
            const { data, error } = await query
                .order('published_at', { ascending: false })
                .limit(1)
                .maybeSingle()

            if (error) throw error
            return new Response(JSON.stringify(data), {
                headers: { ...corsHeaders, 'Content-Type': 'application/json' },
                status: 200,
            })
        }
        else {
            const { data, error } = await query
                .order('published_at', { ascending: false })
                .limit(10)

            if (error) throw error
            return new Response(JSON.stringify(data), {
                headers: { ...corsHeaders, 'Content-Type': 'application/json' },
                status: 200,
            })
        }

    } catch (error: any) {
        console.error('[devotionals-get] Error:', error);
        return new Response(JSON.stringify({
            error: error.message || 'Unknown error',
            stack: error.stack, // Return stack for debugging
            details: error
        }), {
            headers: { ...corsHeaders, 'Content-Type': 'application/json' },
            status: 400,
        })
    }
})

import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const corsHeaders = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

Deno.serve(async (req) => {
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
        } else {
            const url = new URL(req.url)
            id = url.searchParams.get('id')
            latest = url.searchParams.get('latest')
            lang = url.searchParams.get('lang')
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
                .single()

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
                .single()

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

    } catch (error) {
        return new Response(JSON.stringify({ error: error.message }), {
            headers: { ...corsHeaders, 'Content-Type': 'application/json' },
            status: 400,
        })
    }
})

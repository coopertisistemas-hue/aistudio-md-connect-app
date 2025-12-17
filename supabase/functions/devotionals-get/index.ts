import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'
import { corsHeaders, handleCors, jsonResponse } from '../_shared/cors.ts'

Deno.serve(async (req: Request) => {
    // 1. Handle CORS Preflight
    const corsResponse = handleCors(req);
    if (corsResponse) return corsResponse;

    try {
        const supabase = createClient(
            Deno.env.get('SUPABASE_URL') ?? '',
            Deno.env.get('SUPABASE_ANON_KEY') ?? ''
        )

        let id, latest, lang;

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
                .maybeSingle()

            if (error) throw error
            return jsonResponse(data, 200)
        }
        else if (latest === 'true') {
            const { data, error } = await query
                .order('published_at', { ascending: false })
                .limit(1)
                .maybeSingle()

            if (error) throw error
            return jsonResponse(data, 200)
        }
        else {
            const { data, error } = await query
                .order('published_at', { ascending: false })
                .limit(10)

            if (error) throw error
            return jsonResponse(data, 200)
        }

    } catch (error: any) {
        console.error('[devotionals-get] Error:', error);
        return jsonResponse({
            error: error.message || 'Unknown error',
            stack: error.stack,
            details: error
        }, 400)
    }
})

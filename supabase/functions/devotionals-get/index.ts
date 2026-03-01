import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'
import { handleCors, jsonResponse } from '../_shared/cors.ts'
import { errBody, ERR } from '../_shared/error.ts'

Deno.serve(async (req: Request) => {
    // 1. Handle CORS Preflight
    const corsResponse = handleCors(req);
    if (corsResponse) return corsResponse;

    // Get origin for CORS validation
    const origin = req.headers.get('origin');

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

        if (id) {
            const { data, error } = await supabase
                .from('devotionals')
                .select('*')
                .eq('id', id)
                .maybeSingle()

            if (error) throw error
            if (!data) return jsonResponse(errBody(ERR.NOT_FOUND, 'Devotional not found'), 404, origin)
            return jsonResponse({ ok: true, data }, 200, origin)
        }
        else if (latest === 'true') {
            // [SMART FALLBACK LOGIC]
            // Objective: Get "Today's" devotional (Brazil Time). If missing, get Latest.

            const brazilDate = new Date().toLocaleDateString('en-CA', { timeZone: 'America/Sao_Paulo' }); // YYYY-MM-DD

            const startOfDay = new Date(`${brazilDate}T00:00:00-03:00`).toISOString();
            const nowIso = new Date().toISOString();

            // Try finding one published TODAY
            const { data: todayData } = await supabase
                .from('devotionals')
                .select('*')
                .eq('lang', lang)
                .gte('published_at', startOfDay)
                .lte('published_at', nowIso)
                .order('published_at', { ascending: false })
                .limit(1)
                .maybeSingle();

            if (todayData) {
                return jsonResponse({
                    ok: true,
                    data: { ...todayData, meta: { resolved: 'today_match', brazilDate } }
                }, 200, origin)
            }

            // Fallback: Get absolute latest published (any date in past)
            const { data: latestData, error: latestError } = await supabase
                .from('devotionals')
                .select('*')
                .eq('lang', lang)
                .lte('published_at', nowIso)
                .order('published_at', { ascending: false })
                .limit(1)
                .maybeSingle();

            if (latestError) throw latestError;

            if (latestData) {
                return jsonResponse({
                    ok: true,
                    data: { ...latestData, meta: { resolved: 'latest_fallback', requestedDate: brazilDate, fallbackUsed: true } }
                }, 200, origin)
            }

            // Truly Empty
            return jsonResponse(errBody(ERR.NOT_FOUND, 'No devotionals found'), 404, origin);
        }
        else {
            const { data, error } = await supabase
                .from('devotionals')
                .select('*')
                .eq('lang', lang)
                .lte('published_at', new Date().toISOString())
                .order('published_at', { ascending: false })
                .limit(10)

            if (error) throw error
            return jsonResponse({ ok: true, data: data || [] }, 200, origin)
        }


    } catch (error: any) {
        console.error('[devotionals-get] Error:', error);
        return jsonResponse(errBody(ERR.INTERNAL, 'Internal error'), 500, origin)
    }
})

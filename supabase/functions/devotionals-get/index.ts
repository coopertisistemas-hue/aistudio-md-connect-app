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
            // [SMART FALLBACK LOGIC]
            // Objective: Get "Today's" devotional (Brazil Time). If missing, get Latest.

            // 1. Calculate Today in Brazil (UTC-3)
            // Note: Simplistic offset calc, robust way uses libraries but avoiding deps for Edge if possible.
            // Deno Deploy supports Intl, let's use it.
            const brazilDate = new Date().toLocaleDateString('en-CA', { timeZone: 'America/Sao_Paulo' }); // YYYY-MM-DD

            // 2. Try to get Devotional strictly published for TODAY (or <= Now but ideally matches 'today' relevance)
            // Ideally we want something published today. But 'published_at' is Timestamp.
            // Let's search for published_at >= Brazil Day Start AND <= Now.
            // Actually, simplified: Get the most recent one.
            // If the most recent one is from TODAY, great.
            // If it's from yesterday, we still return it but maybe mark it?
            // "Today" route usually means "Give me the most relevant one for today". 
            // If we missed posting today, showing yesterday's is better than 404.

            // Re-evaluating User Request: "se a rota usa today, converter para uma data YYYY-MM-DD... tentar buscar o devocional do dia... se não existir, buscar automaticamente o último"

            // Query for specific date range (Brazil Day)
            const startOfDay = new Date(`${brazilDate}T00:00:00-03:00`).toISOString();
            const endOfDay = new Date(`${brazilDate}T23:59:59.999-03:00`).toISOString();
            const nowIso = new Date().toISOString();

            // Try finding one published TODAY (between StartOfDay and MIN(EndOfDay, Now))
            // We use 'lte' nowIso to avoid future posts.
            const { data: todayData, error: todayError } = await supabase
                .from('devotionals')
                .select('*')
                .eq('lang', lang)
                .gte('published_at', startOfDay)
                .lte('published_at', nowIso) // Must be published already
                .order('published_at', { ascending: false })
                .limit(1)
                .maybeSingle();

            if (todayData) {
                return jsonResponse({
                    ...todayData,
                    meta: {
                        resolved: 'today_match',
                        brazilDate,
                        source: 'database'
                    }
                }, 200)
            }

            // 3. Fallback: Get absolute latest published (any date in past)
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
                    ...latestData,
                    meta: {
                        resolved: 'latest_fallback',
                        requestedDate: brazilDate,
                        fallbackUsed: true,
                        source: 'database'
                    }
                }, 200)
            }

            // 4. Truly Empty
            return jsonResponse({ error: 'No devotionals found', meta: { empty: true } }, 404);
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

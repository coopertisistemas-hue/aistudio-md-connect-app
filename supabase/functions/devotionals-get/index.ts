import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'
import { handleCors, jsonResponse } from '../_shared/cors.ts'
import { errBody, ERR } from '../_shared/error.ts'

const TIMEOUT_MS = 12000

async function withTimeout<T>(promise: Promise<T>, ms: number, operation: string): Promise<T> {
    const timeout = new Promise<never>((_, reject) => 
        setTimeout(() => reject(new Error(`${operation} timed out after ${ms}ms`)), ms)
    )
    try {
        return await Promise.race([promise, timeout])
    } catch (err: any) {
        if (err.message.includes('timed out')) {
            console.error(`[devotionals-get] Timeout: ${operation}`)
            throw new Error('Request timed out')
        }
        throw err
    }
}

function jsonResponseWithCache(data: unknown, status = 200, requestOrigin: string | null = null): Response {
    const response = jsonResponse(data, status, requestOrigin)
    response.headers.set('Cache-Control', 'public, max-age=300, s-maxage=600')
    return response
}

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
            const query = supabase
                .from('devotionals')
                .select('*')
                .eq('id', id)
                .maybeSingle()
            
            const { data, error } = await withTimeout(query, TIMEOUT_MS, 'fetch devotional by id')

            if (error) throw error
            if (!data) return jsonResponseWithCache(errBody(ERR.NOT_FOUND, 'Devotional not found'), 404, origin)
            return jsonResponseWithCache({ ok: true, data }, 200, origin)
        }
        else if (latest === 'true') {
            // [SMART FALLBACK LOGIC]
            // Objective: Get "Today's" devotional (Brazil Time). If missing, get Latest.

            const brazilDate = new Date().toLocaleDateString('en-CA', { timeZone: 'America/Sao_Paulo' }); // YYYY-MM-DD

            const startOfDay = new Date(`${brazilDate}T00:00:00-03:00`).toISOString();
            const nowIso = new Date().toISOString();

            // Try finding one published TODAY
            const todayQuery = supabase
                .from('devotionals')
                .select('*')
                .eq('lang', lang)
                .gte('published_at', startOfDay)
                .lte('published_at', nowIso)
                .order('published_at', { ascending: false })
                .limit(1)
                .maybeSingle();
            
            const { data: todayData } = await withTimeout(todayQuery, TIMEOUT_MS, 'fetch today devotional')

            if (todayData) {
                return jsonResponseWithCache({
                    ok: true,
                    data: { ...todayData, meta: { resolved: 'today_match', brazilDate } }
                }, 200, origin)
            }

            // Fallback: Get absolute latest published (any date in past)
            const latestQuery = supabase
                .from('devotionals')
                .select('*')
                .eq('lang', lang)
                .lte('published_at', nowIso)
                .order('published_at', { ascending: false })
                .limit(1)
                .maybeSingle();
            
            const { data: latestData, error: latestError } = await withTimeout(latestQuery, TIMEOUT_MS, 'fetch latest devotional')

            if (latestError) throw latestError;

            if (latestData) {
                return jsonResponseWithCache({
                    ok: true,
                    data: { ...latestData, meta: { resolved: 'latest_fallback', requestedDate: brazilDate, fallbackUsed: true } }
                }, 200, origin)
            }

            // Truly Empty
            return jsonResponseWithCache(errBody(ERR.NOT_FOUND, 'No devotionals found'), 404, origin);
        }
        else {
            const listQuery = supabase
                .from('devotionals')
                .select('*')
                .eq('lang', lang)
                .lte('published_at', new Date().toISOString())
                .order('published_at', { ascending: false })
                .limit(10)

            const { data, error } = await withTimeout(listQuery, TIMEOUT_MS, 'fetch devotional list')

            if (error) throw error
            return jsonResponseWithCache({ ok: true, data: data || [] }, 200, origin)
        }


    } catch (error: any) {
        console.error('[devotionals-get] Error:', error);
        return jsonResponse(errBody(ERR.INTERNAL, 'Internal error'), 500, origin)
    }
})

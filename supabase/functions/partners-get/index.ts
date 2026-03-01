import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'
import { handleCors, jsonResponse } from '../_shared/cors.ts'
import { errBody, ERR } from '../_shared/error.ts'

serve(async (req) => {
    // 1. Handle CORS Preflight
    const corsResponse = handleCors(req);
    if (corsResponse) return corsResponse;

    const origin = req.headers.get('origin');

    try {
        const supabaseClient = createClient(
            Deno.env.get('SUPABASE_URL') ?? '',
            Deno.env.get('SUPABASE_ANON_KEY') ?? ''
        )

        const { data: partners, error } = await supabaseClient
            .from('partners')
            .select('*')
            .eq('is_active', true)
            .order('tier', { ascending: false })
            .order('name', { ascending: true })

        if (error) throw error

        return jsonResponse({ ok: true, data: { partners } }, 200, origin)
    } catch (error: any) {
        console.error('[partners-get] Error:', error)
        return jsonResponse(errBody(ERR.DATABASE_ERROR, 'Failed to fetch partners'), 500, origin)
    }
})

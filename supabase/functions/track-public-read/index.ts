import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { handleCors, jsonResponse } from '../_shared/cors.ts'
import { createClient } from "https://esm.sh/@supabase/supabase-js@2"
import { errBody, ERR } from '../_shared/error.ts'

serve(async (req) => {
    const corsResponse = handleCors(req);
    if (corsResponse) return corsResponse;

    const origin = req.headers.get('origin');

    try {
        const supabaseClient = createClient(
            Deno.env.get('SUPABASE_URL') ?? '',
            Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
        )

        const { devotional_id, session_hash } = await req.json()

        if (!devotional_id || !session_hash) {
            return jsonResponse(errBody(ERR.INVALID_REQUEST, 'Missing required params: devotional_id, session_hash'), 400, origin)
        }

        // Insert public read.
        // The DB Unique Constraint (devotional_id, read_date, session_hash) prevents duplicate daily counts.
        const { error } = await supabaseClient
            .from('devotional_reads_public')
            .insert({
                devotional_id,
                session_hash,
                // read_date defaults to today in DB
            })

        if (error) {
            // Ignore unique violation (23505) — already recorded today
            if (error.code === '23505') {
                return jsonResponse({ ok: true, data: { recorded: false, reason: 'already_recorded_today' } }, 200, origin)
            }
            throw error
        }

        return jsonResponse({ ok: true, data: { recorded: true } }, 200, origin)

    } catch (error) {
        console.error('[track-public-read] Error:', error)
        return jsonResponse(errBody(ERR.INTERNAL, 'Internal error'), 500, origin)
    }
})

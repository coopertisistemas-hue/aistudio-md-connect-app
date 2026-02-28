import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { handleCors, jsonResponse } from '../_shared/cors.ts'
import { createClient } from "https://esm.sh/@supabase/supabase-js@2"

serve(async (req) => {
    const corsResponse = handleCors(req);
    if (corsResponse) return corsResponse;

    // Get origin for CORS validation
    const origin = req.headers.get('origin');)
    }

    try {
        const supabaseClient = createClient(
            Deno.env.get('SUPABASE_URL') ?? '',
            Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
        )

        const { devotional_id, session_hash } = await req.json()

        if (!devotional_id || !session_hash) {
            throw new Error('Missing params')
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
            // Ignore unique violation (23505)
            if (error.code === '23505') {
                return jsonResponse({ message: 'Already recorded today' }, 200, origin)
            }
            throw error
        }

        return jsonResponse({ message: 'Read recorded' }, 200, origin)

    } catch (error) {
        return jsonResponse({ error: error.message }, 400, origin)
    }
})

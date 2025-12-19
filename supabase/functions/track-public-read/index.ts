import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from "https://esm.sh/@supabase/supabase-js@2"

const corsHeaders = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

serve(async (req) => {
    if (req.method === 'OPTIONS') {
        return new Response('ok', { headers: corsHeaders })
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
                return new Response(
                    JSON.stringify({ message: 'Already recorded today' }),
                    { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 200 }
                )
            }
            throw error
        }

        return new Response(
            JSON.stringify({ message: 'Read recorded' }),
            { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 200 }
        )

    } catch (error) {
        return new Response(
            JSON.stringify({ error: error.message }),
            { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 400 }
        )
    }
})

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
        // Use Service Role for Insert if we want to bypass RLS or do extra checks
        // But since we have public INSERT policy, Anon key is fine.
        // However, sticking to strict contract, we might want to use Service Role for "trusted" operations 
        // or just rely on the API Gateway nature of Edge Functions.
        const supabase = createClient(
            Deno.env.get('SUPABASE_URL') ?? '',
            Deno.env.get('SUPABASE_ANON_KEY') ?? ''
        )

        const { request_type, description, is_anonymous, visibility, preferred_contact } = await req.json()

        // Validation
        if (!description || description.length < 10) {
            throw new Error("Description too short (min 10 chars).")
        }

        const { data, error } = await supabase
            .from('prayer_requests')
            .insert([
                {
                    request_type,
                    description,
                    is_anonymous: is_anonymous || false,
                    visibility: visibility || 'public',
                    preferred_contact
                }
            ])
            .select()
            .single()

        if (error) throw error

        return new Response(JSON.stringify(data), {
            headers: { ...corsHeaders, 'Content-Type': 'application/json' },
            status: 201, // Created
        })

    } catch (error) {
        return new Response(JSON.stringify({ error: error.message }), {
            headers: { ...corsHeaders, 'Content-Type': 'application/json' },
            status: 400,
        })
    }
})

import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const corsHeaders = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

Deno.serve(async (req: Request) => {
    if (req.method === 'OPTIONS') {
        return new Response('ok', { headers: corsHeaders })
    }

    try {
        const supabase = createClient(
            Deno.env.get('SUPABASE_URL') ?? '',
            Deno.env.get('SUPABASE_ANON_KEY') ?? ''
        )

        const { request_type, description, is_anonymous, visibility, preferred_contact } = await req.json()

        // 1. Validation (Hardened)
        if (!description || description.trim().length < 10) {
            return new Response(JSON.stringify({ error: "Descrição muito curta (min 10 caracteres)." }), {
                headers: { ...corsHeaders, 'Content-Type': 'application/json' },
                status: 400,
            })
        }

        if (description.length > 500) {
            return new Response(JSON.stringify({ error: "Descrição muito longa (max 500 caracteres)." }), {
                headers: { ...corsHeaders, 'Content-Type': 'application/json' },
                status: 400,
            })
        }

        // 2. Anti-Spam / Rate Limit (Primitive)
        // Ideally we use Redis or DB to track IPs. For now, we add a delay to slow down bruteforce.
        await new Promise(r => setTimeout(r, 800));

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

    } catch (error: any) {
        return new Response(JSON.stringify({ error: error.message || 'Unknown error' }), {
            headers: { ...corsHeaders, 'Content-Type': 'application/json' },
            status: 400,
        })
    }
})

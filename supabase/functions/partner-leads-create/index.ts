
import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'
import { corsHeaders } from '../_shared/cors.ts'

serve(async (req) => {
    if (req.method === 'OPTIONS') {
        return new Response('ok', { headers: corsHeaders })
    }

    try {
        const { name, whatsapp, message } = await req.json()

        if (!name || !whatsapp) {
            throw new Error('Nome e WhatsApp são obrigatórios')
        }

        const supabaseClient = createClient(
            Deno.env.get('SUPABASE_URL') ?? '',
            Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? '' // Service Role for Write if regular RLS fails or to bypass
        )

        // Basic Rate Limit Check (IP based removed for simplicity, just direct insert)
        // Actually using Service Role ensures we can insert even if RLS is strict

        const { data, error } = await supabaseClient
            .from('partner_leads')
            .insert([
                { name, whatsapp, message, status: 'new' }
            ])
            .select()

        if (error) throw error

        return new Response(
            JSON.stringify({ success: true, daa: data }),
            {
                headers: { ...corsHeaders, 'Content-Type': 'application/json' },
                status: 200,
            }
        )
    } catch (error) {
        return new Response(
            JSON.stringify({ error: error.message }),
            {
                headers: { ...corsHeaders, 'Content-Type': 'application/json' },
                status: 400,
            }
        )
    }
})

import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'
import { corsHeaders, handleCors, jsonResponse } from '../_shared/cors.ts'

serve(async (req) => {
    // 1. Handle CORS Preflight
    const corsResponse = handleCors(req);
    if (corsResponse) return corsResponse;

    try {
        const { name, whatsapp, message } = await req.json()

        if (!name || !whatsapp) {
            throw new Error('Nome e WhatsApp são obrigatórios')
        }

        const supabaseClient = createClient(
            Deno.env.get('SUPABASE_URL') ?? '',
            Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
        )

        const { data, error } = await supabaseClient
            .from('partner_leads')
            .insert([
                { name, whatsapp, message, status: 'new' }
            ])
            .select()

        if (error) throw error

        // Corrected typo 'daa' to 'data' in previous implementation
        return jsonResponse({ success: true, data }, 200)

    } catch (error: any) {
        return jsonResponse({ error: error.message }, 400)
    }
})

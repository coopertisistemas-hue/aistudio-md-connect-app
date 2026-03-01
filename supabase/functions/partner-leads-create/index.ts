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
        const { name, whatsapp, message } = await req.json()

        if (!name || !whatsapp) {
            return jsonResponse(errBody(ERR.INVALID_REQUEST, 'Nome e WhatsApp são obrigatórios'), 400, origin)
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

        return jsonResponse({ ok: true, data }, 200, origin)

    } catch (error: any) {
        console.error('[partner-leads-create] Error:', error)
        return jsonResponse(errBody(ERR.INTERNAL, 'Internal error'), 500, origin)
    }
})

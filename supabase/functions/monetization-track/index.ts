import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'
import { handleCors, jsonResponse } from '../_shared/cors.ts'

type Payload = {
    item_id: string
    item_type: 'partner' | 'service'
    action_type: 'click' | 'whatsapp' | 'lead'
    source: string
}

Deno.serve(async (req: Request) => {
    const corsResponse = handleCors(req)
    if (corsResponse) return corsResponse

    const origin = req.headers.get('origin')

    if (req.method !== 'POST') {
        return jsonResponse({ ok: false, data: null, error: { message: 'Metodo nao permitido' }, meta: null }, 405, origin)
    }

    const supabaseUrl = Deno.env.get('SUPABASE_URL') ?? ''
    const supabaseAnonKey = Deno.env.get('SUPABASE_ANON_KEY') ?? ''
    const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    const authHeader = req.headers.get('Authorization')

    if (!supabaseUrl || !supabaseAnonKey || !supabaseServiceKey) {
        return jsonResponse({ ok: false, data: null, error: { message: 'Configuracao do servidor ausente' }, meta: null }, 500, origin)
    }

    try {
        const payload = await req.json() as Payload
        if (!payload?.item_id || !payload?.item_type || !payload?.action_type || !payload?.source) {
            return jsonResponse({ ok: false, data: null, error: { message: 'Dados obrigatorios ausentes' }, meta: null }, 400, origin)
        }

        let userId: string | null = null
        let churchId: string | null = null

        if (authHeader) {
            const authClient = createClient(supabaseUrl, supabaseAnonKey, {
                global: { headers: { Authorization: authHeader } }
            })

            const { data: userData } = await authClient.auth.getUser()
            if (userData?.user) {
                userId = userData.user.id

                const { data: profile } = await authClient
                    .from('profiles')
                    .select('church_id')
                    .eq('id', userId)
                    .maybeSingle()

                churchId = profile?.church_id ?? null
            }
        }

        const adminClient = createClient(supabaseUrl, supabaseServiceKey)
        const { error } = await adminClient
            .from('monetization_tracking')
            .insert({
                user_id: userId,
                church_id: churchId,
                item_id: payload.item_id,
                item_type: payload.item_type,
                action_type: payload.action_type,
                source: payload.source
            })

        if (error) {
            return jsonResponse({ ok: false, data: null, error: { message: 'Erro ao registrar evento' }, meta: null }, 400, origin)
        }

        return jsonResponse({ ok: true, data: { ok: true }, error: null, meta: null }, 201, origin)
    } catch (error: any) {
        return jsonResponse({ ok: false, data: null, error: { message: error?.message || 'Erro inesperado' }, meta: null }, 500, origin)
    }
})

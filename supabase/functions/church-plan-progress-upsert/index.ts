import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'
import { handleCors, jsonResponse } from '../_shared/cors.ts'

type Payload = {
    plan_id: string
    day_number: number
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
    const authHeader = req.headers.get('Authorization')

    if (!authHeader) {
        return jsonResponse({ ok: false, data: null, error: { message: 'Nao autenticado' }, meta: null }, 401, origin)
    }

    if (!supabaseUrl || !supabaseAnonKey) {
        return jsonResponse({ ok: false, data: null, error: { message: 'Configuracao do servidor ausente' }, meta: null }, 500, origin)
    }

    try {
        const payload = await req.json() as Payload
        if (!payload?.plan_id || typeof payload.day_number !== 'number') {
            return jsonResponse({ ok: false, data: null, error: { message: 'Dados obrigatorios ausentes' }, meta: null }, 400, origin)
        }

        const supabase = createClient(supabaseUrl, supabaseAnonKey, {
            global: { headers: { Authorization: authHeader } }
        })

        const { data: userData, error: userError } = await supabase.auth.getUser()
        if (userError || !userData?.user) {
            return jsonResponse({ ok: false, data: null, error: { message: 'Nao autenticado' }, meta: null }, 401, origin)
        }

        const { data: existing } = await supabase
            .from('user_plan_progress')
            .select('*')
            .eq('user_id', userData.user.id)
            .eq('plan_id', payload.plan_id)
            .single()

        const completed = Array.isArray(existing?.completed_days) ? [...existing.completed_days] : []
        if (!completed.includes(payload.day_number)) {
            completed.push(payload.day_number)
        }

        const updatePayload = {
            user_id: userData.user.id,
            plan_id: payload.plan_id,
            completed_days: completed,
            last_accessed_at: new Date().toISOString()
        }

        if (existing?.id) {
            const { error } = await supabase
                .from('user_plan_progress')
                .update(updatePayload)
                .eq('id', existing.id)

            if (error) {
                return jsonResponse({ ok: false, data: null, error: { message: 'Erro ao atualizar progresso' }, meta: null }, 400, origin)
            }
        } else {
            const { error } = await supabase
                .from('user_plan_progress')
                .insert({ ...updatePayload, started_at: new Date().toISOString() })

            if (error) {
                return jsonResponse({ ok: false, data: null, error: { message: 'Erro ao criar progresso' }, meta: null }, 400, origin)
            }
        }

        return jsonResponse({ ok: true, data: { completed_days: completed }, error: null, meta: null }, 200, origin)
    } catch (error: any) {
        return jsonResponse({ ok: false, data: null, error: { message: error?.message || 'Erro inesperado' }, meta: null }, 500, origin)
    }
})

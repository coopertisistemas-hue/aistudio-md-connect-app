import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'
import { handleCors, jsonResponse } from '../_shared/cors.ts'

type Payload = {
    plan_id: string
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
        if (!payload?.plan_id) {
            return jsonResponse({ ok: false, data: null, error: { message: 'Plano obrigatorio' }, meta: null }, 400, origin)
        }

        const supabase = createClient(supabaseUrl, supabaseAnonKey, {
            global: { headers: { Authorization: authHeader } }
        })

        const { data: userData, error: userError } = await supabase.auth.getUser()
        if (userError || !userData?.user) {
            return jsonResponse({ ok: false, data: null, error: { message: 'Nao autenticado' }, meta: null }, 401, origin)
        }

        const { data: profile, error: profileError } = await supabase
            .from('profiles')
            .select('church_id')
            .eq('id', userData.user.id)
            .maybeSingle()

        if (profileError || !profile?.church_id) {
            return jsonResponse({ ok: false, data: null, error: { message: 'Igreja nao encontrada' }, meta: null }, 400, origin)
        }

        const { data: plan, error: planError } = await supabase
            .from('reading_plans')
            .select('id')
            .eq('id', payload.plan_id)
            .eq('church_id', profile.church_id)
            .maybeSingle()

        if (planError || !plan) {
            return jsonResponse({ ok: false, data: null, error: { message: 'Plano nao encontrado' }, meta: null }, 404, origin)
        }

        const { data, error } = await supabase
            .from('reading_plan_days')
            .select('*')
            .eq('plan_id', payload.plan_id)
            .order('day_number', { ascending: true })

        if (error) {
            return jsonResponse({ ok: false, data: null, error: { message: 'Erro ao buscar dias' }, meta: null }, 400, origin)
        }

        return jsonResponse({ ok: true, data: data || [], error: null, meta: null }, 200, origin)
    } catch (error: any) {
        return jsonResponse({ ok: false, data: null, error: { message: error?.message || 'Erro inesperado' }, meta: null }, 500, origin)
    }
})

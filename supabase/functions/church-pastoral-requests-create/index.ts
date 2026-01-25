import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'
import { handleCors, jsonResponse } from '../_shared/cors.ts'

type RequestPayload = {
    request_type: string
    title?: string
    description: string
    privacy: string
    status?: string
    priority?: string
    category?: string
    visit_address?: string
    visit_time?: string
    contact_phone?: string
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
        const payload = await req.json() as RequestPayload

        if (!payload?.description || payload.description.trim().length < 10) {
            return jsonResponse({ ok: false, data: null, error: { message: 'Descricao muito curta' }, meta: null }, 400, origin)
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

        const insertPayload = {
            church_id: profile.church_id,
            member_id: userData.user.id,
            request_type: payload.request_type,
            title: payload.title,
            description: payload.description,
            privacy: payload.privacy,
            status: payload.status || 'received',
            priority: payload.priority || 'media',
            category: payload.category,
            visit_address: payload.visit_address,
            visit_time: payload.visit_time,
            contact_phone: payload.contact_phone
        }

        const { data, error } = await supabase
            .from('pastoral_requests')
            .insert(insertPayload)
            .select('*')
            .single()

        if (error) {
            return jsonResponse({ ok: false, data: null, error: { message: 'Erro ao criar pedido' }, meta: null }, 400, origin)
        }

        return jsonResponse({ ok: true, data, error: null, meta: null }, 201, origin)
    } catch (error: any) {
        return jsonResponse({ ok: false, data: null, error: { message: error?.message || 'Erro inesperado' }, meta: null }, 500, origin)
    }
})

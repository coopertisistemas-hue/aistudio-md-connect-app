import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'
import { handleCors, jsonResponse } from '../_shared/cors.ts'

type Payload = {
    type?: string
    limit?: number
    page?: number
    include_expired?: boolean
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
        const limit = typeof payload?.limit === 'number' ? payload.limit : 10
        const page = typeof payload?.page === 'number' ? payload.page : null
        const includeExpired = payload?.include_expired === true

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

        const now = new Date().toISOString()
        let query = supabase
            .from('posts')
            .select('*')
            .eq('church_id', profile.church_id)
            .eq('status', 'published')

        if (!includeExpired) {
            query = query.or(`expires_at.is.null,expires_at.gte.${now}`)
        }

        if (payload?.type) {
            query = query.eq('type', payload.type)
        }

        query = query
            .order('is_pinned', { ascending: false })
            .order('priority', { ascending: true })
            .order('starts_at', { ascending: false })

        if (page !== null) {
            const from = page * limit
            const to = from + limit - 1
            query = query.range(from, to)
        } else {
            query = query.limit(limit)
        }

        const { data, error } = await query
        if (error) {
            return jsonResponse({ ok: false, data: null, error: { message: 'Erro ao buscar posts' }, meta: null }, 400, origin)
        }

        return jsonResponse({ ok: true, data: data || [], error: null, meta: null }, 200, origin)
    } catch (error: any) {
        return jsonResponse({ ok: false, data: null, error: { message: error?.message || 'Erro inesperado' }, meta: null }, 500, origin)
    }
})

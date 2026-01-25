import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'
import { handleCors, jsonResponse } from '../_shared/cors.ts'

type Payload = {
    featured?: boolean
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

    if (!supabaseUrl || !supabaseAnonKey) {
        return jsonResponse({ ok: false, data: null, error: { message: 'Configuracao do servidor ausente' }, meta: null }, 500, origin)
    }

    try {
        const payload = await req.json() as Payload
        const featuredOnly = payload?.featured === true

        let query = createClient(supabaseUrl, supabaseAnonKey)
            .from('monetization_partners')
            .select('*')
            .eq('status', 'published')

        if (featuredOnly) {
            query = query.eq('is_featured', true).limit(10)
        } else {
            query = query.order('display_order', { ascending: true })
        }

        const { data, error } = await query
        if (error) {
            return jsonResponse({ ok: false, data: null, error: { message: 'Erro ao buscar parceiros' }, meta: null }, 400, origin)
        }

        return jsonResponse({ ok: true, data: data || [], error: null, meta: null }, 200, origin)
    } catch (error: any) {
        return jsonResponse({ ok: false, data: null, error: { message: error?.message || 'Erro inesperado' }, meta: null }, 500, origin)
    }
})

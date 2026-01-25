import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'
import { handleCors, jsonResponse } from '../_shared/cors.ts'

type Payload = {
    id: string
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
        if (!payload?.id) {
            return jsonResponse({ ok: false, data: null, error: { message: 'ID obrigatorio' }, meta: null }, 400, origin)
        }

        const supabase = createClient(supabaseUrl, supabaseAnonKey)
        const { data, error } = await supabase
            .from('monetization_services')
            .select('*')
            .eq('id', payload.id)
            .single()

        if (error) {
            return jsonResponse({ ok: false, data: null, error: { message: 'Servico nao encontrado' }, meta: null }, 404, origin)
        }

        return jsonResponse({ ok: true, data, error: null, meta: null }, 200, origin)
    } catch (error: any) {
        return jsonResponse({ ok: false, data: null, error: { message: error?.message || 'Erro inesperado' }, meta: null }, 500, origin)
    }
})

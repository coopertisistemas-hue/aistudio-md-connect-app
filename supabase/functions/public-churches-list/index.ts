import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'
import { handleCors, jsonResponse } from '../_shared/cors.ts'
import { errBody, ERR } from '../_shared/error.ts'

Deno.serve(async (req: Request) => {
    // 1. Handle CORS Preflight (OPTIONS)
    const corsResponse = handleCors(req);
    if (corsResponse) return corsResponse;

    const origin = req.headers.get('origin');

    try {
        const supabase = createClient(
            Deno.env.get('SUPABASE_URL') ?? '',
            Deno.env.get('SUPABASE_ANON_KEY') ?? ''
        )

        const { data, error } = await supabase
            .from('churches')
            .select('id, name, slug, city, state, cover_image_url')
            .order('name');

        if (error) {
            console.error('[public-churches-list] Supabase error:', error);
            throw error;
        }

        return jsonResponse({ ok: true, data: data || [] }, 200, origin);

    } catch (error: any) {
        console.error('[public-churches-list] Error:', error);
        return jsonResponse(errBody(ERR.INTERNAL, 'Internal error'), 500, origin);
    }
})

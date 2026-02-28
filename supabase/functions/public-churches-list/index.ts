import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'
import { handleCors, jsonResponse } from '../_shared/cors.ts'

Deno.serve(async (req: Request) => {
    // 1. Handle CORS Preflight (OPTIONS)
    const corsResponse = handleCors(req);
    if (corsResponse) return corsResponse;

    // Get origin for CORS validation
    const origin = req.headers.get('origin');)
    }

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
            console.error('Supabase Error:', error);
            throw error;
        }

        // 2. Return JSON with CORS headers
        return jsonResponse(data || [], 200, origin);

    } catch (error: any) {
        console.error('[public-churches-list] Error:', error);
        return jsonResponse({ error: error.message }, 400, origin);
    }
})

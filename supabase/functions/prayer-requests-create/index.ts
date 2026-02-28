import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'
import { corsHeaders, handleCors, jsonResponse } from '../_shared/cors.ts'

Deno.serve(async (req: Request) => {
    // 1. Handle CORS Preflight
    const corsResponse = handleCors(req);
    if (corsResponse) return corsResponse;

    // Get origin for CORS validation
    const origin = req.headers.get('origin');

    try {
        const supabase = createClient(
            Deno.env.get('SUPABASE_URL') ?? '',
            Deno.env.get('SUPABASE_ANON_KEY') ?? ''
        )

        const { request_type, description, is_anonymous, visibility, preferred_contact } = await req.json()

        // 1. Validation (Hardened)
        if (!description || description.trim().length < 10) {
            return jsonResponse({ error: "Descrição muito curta (min 10 caracteres)." }, 400, origin)
        }

        if (description.length > 500) {
            return jsonResponse({ error: "Descrição muito longa (max 500 caracteres)." }, 400, origin)
        }

        // 2. Anti-Spam
        await new Promise(r => setTimeout(r, 800));

        const { data, error } = await supabase
            .from('prayer_requests')
            .insert([
                {
                    request_type,
                    description,
                    is_anonymous: is_anonymous || false,
                    visibility: visibility || 'public',
                    preferred_contact
                }
            ])
            .select()
            .single()

        if (error) throw error

        return jsonResponse(data, 201, origin)

    } catch (error: any) {
        return jsonResponse({ error: error.message || 'Unknown error' }, 400, origin)
    }
})

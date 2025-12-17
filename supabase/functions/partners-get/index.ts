import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'
import { corsHeaders, handleCors, jsonResponse } from '../_shared/cors.ts'

serve(async (req) => {
    // 1. Handle CORS Preflight
    const corsResponse = handleCors(req);
    if (corsResponse) return corsResponse;

    try {
        const supabaseClient = createClient(
            Deno.env.get('SUPABASE_URL') ?? '',
            Deno.env.get('SUPABASE_ANON_KEY') ?? ''
        )

        const { data: partners, error } = await supabaseClient
            .from('partners')
            .select('*')
            .eq('is_active', true)
            .order('tier', { ascending: false })
            .order('name', { ascending: true })

        if (error) throw error

        return jsonResponse({ partners }, 200)
    } catch (error: any) {
        return jsonResponse({ error: error.message }, 400)
    }
})

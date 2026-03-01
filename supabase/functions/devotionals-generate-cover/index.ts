import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.45.0";
import { handleCors, jsonResponse } from '../_shared/cors.ts';
import { errBody, ERR } from '../_shared/error.ts';

serve(async (req: Request) => {
    // 1. CORS
    const corsResponse = handleCors(req);
    if (corsResponse) return corsResponse;

    const origin = req.headers.get('origin');

    try {
        // 2. Validate Environment
        if (!Deno.env.get("OPENAI_API_KEY")) {
            return jsonResponse(errBody(ERR.CONFIG_MISSING, 'Server configuration error'), 500, origin);
        }

        const SB_KEY = Deno.env.get("SB_SERVICE_ROLE_KEY") || Deno.env.get("SUPABASE_SERVICE_ROLE_KEY");
        const SB_URL = Deno.env.get("SUPABASE_URL");

        if (!SB_KEY || !SB_URL) {
            return jsonResponse(errBody(ERR.CONFIG_MISSING, 'Server configuration error'), 500, origin);
        }

        // 3. Setup Supabase
        const supabase = createClient(SB_URL, SB_KEY);

        // 4. Parse Request
        const body = await req.json().catch(() => ({}));
        const { devotional_id } = body;

        if (!devotional_id) {
            return jsonResponse(errBody(ERR.INVALID_REQUEST, 'devotional_id is required'), 400, origin);
        }

        // 5. Fetch Devotional Data
        const { data: item, error: fetchError } = await supabase
            .from('devotionals')
            .select('title, subtitle, published_at, lang')
            .eq('id', devotional_id)
            .single();

        if (fetchError || !item) {
            console.error(`[devotionals-generate-cover] Devotional not found: ${devotional_id}`);
            return jsonResponse(errBody(ERR.NOT_FOUND, 'Devotional not found'), 404, origin);
        }

        // 6. Generate Prompt & Logic
        const date = new Date(item.published_at);
        const dayOfWeek = date.getDay();
        const month = date.getMonth();

        const MONTH_THEMES = [
            'New Beginnings, Dawn', 'Love, Warmth', 'Growth, Green',
            'Resurrection, Light', 'Family, Home', 'Harvest, Gold',
            'Heat, Sun', 'Wind, Spirit', 'Wisdom, Books',
            'Mission, Map', 'Gratitude, Table', 'Nativity, Star'
        ];
        const DAY_THEMES = [
            'Worship', 'Strength', 'Wisdom', 'Peace', 'Eternity', 'Cross', 'Rest'
        ];

        const theme = `${MONTH_THEMES[month]} mixed with ${DAY_THEMES[dayOfWeek]}`;
        const prompt = `Cinematic, soft light, no text. Theme: ${theme}. Keywords: ${item.title}.`;

        console.log(`[devotionals-generate-cover] Generating for [${item.title}]: ${prompt}`);

        // 7. Generate Image (Picsum deterministic fallback)
        const seed = `${devotional_id}-${month}-${dayOfWeek}`;
        const fallbackUrl = `https://picsum.photos/seed/${seed}/1920/1080?grayscale`;

        // 8. Upload to Storage
        const imageRes = await fetch(fallbackUrl);
        if (!imageRes.ok) {
            throw new Error(`Upstream image provider failed: ${imageRes.statusText}`);
        }

        const blob = await imageRes.blob();
        const path = `${item.lang || 'pt'}/${date.toISOString().split('T')[0]}_${devotional_id}.jpg`;

        const { error: uploadError } = await supabase.storage
            .from('devotional-covers')
            .upload(path, blob, { contentType: 'image/jpeg', upsert: true });

        if (uploadError) {
            console.error("[devotionals-generate-cover] Storage upload failed:", uploadError);
            throw new Error('Storage upload failed');
        }

        const { data: { publicUrl } } = supabase.storage
            .from('devotional-covers')
            .getPublicUrl(path);

        // 9. Update Record
        const { error: updateError } = await supabase
            .from('devotionals')
            .update({ cover_image_url: publicUrl })
            .eq('id', devotional_id);

        if (updateError) {
            console.error("[devotionals-generate-cover] Database update failed:", updateError);
            throw new Error('Database update failed');
        }

        return jsonResponse({ ok: true, data: { image_url: publicUrl, prompt_used: prompt } }, 200, origin);

    } catch (error: any) {
        console.error("[devotionals-generate-cover] Unhandled error:", error);
        return jsonResponse(errBody(ERR.INTERNAL, 'Internal error'), 500, origin);
    }
});

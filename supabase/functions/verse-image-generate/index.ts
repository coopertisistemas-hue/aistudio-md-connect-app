import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.45.0";
import { handleCors, jsonResponse } from '../_shared/cors.ts';
import { errBody, ERR } from '../_shared/error.ts';

/**
 * CONTRACT:
 * - Success: { ok: true, data: { image_url, provider, cached } }
 * - Error:   { ok: false, error: { code, message } }
 * - Always attempts fallback to Picsum on AI failure.
 */

const VALID_STYLES = [
    'humanized_nature', 'epic_landscape', 'warm_cozy',
    'minimal_premium', 'cinematic_light', 'soft_illustration', 'watercolor', 'nature_symbolic'
];

serve(async (req: Request) => {
    // 1. CORS Preflight
    const corsResponse = handleCors(req);
    if (corsResponse) return corsResponse;

    const origin = req.headers.get('origin');

    try {
        const { verse_text, reference, style, language = 'pt' } = await req.json();

        // 2. Validation
        if (!verse_text || !reference) {
            return jsonResponse(errBody(ERR.INVALID_REQUEST, 'verse_text and reference are required'), 400, origin);
        }

        // 3. Hash Generation
        const inputString = `${verse_text}:${reference}:${style || 'default'}:${language}`;
        const encoder = new TextEncoder();
        const data = encoder.encode(inputString);
        const hashBuffer = await crypto.subtle.digest("SHA-256", data);
        const hashArray = Array.from(new Uint8Array(hashBuffer));
        const hash = hashArray.map((b) => b.toString(16).padStart(2, "0")).join("");

        // 4. Supabase Client
        let supabase;
        try {
            const url = Deno.env.get("SUPABASE_URL");
            const key = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY");
            if (url && key) {
                supabase = createClient(url, key);
            }
        } catch (e) {
            console.error("[verse-image-generate] Supabase init failed:", e);
        }

        // 5. Check Cache (Only if Supabase is alive)
        if (supabase) {
            try {
                const { data: cached } = await supabase
                    .from("verse_posters")
                    .select("image_url")
                    .eq("hash", hash)
                    .single();

                if (cached) {
                    console.log(`[verse-image-generate] Cache hit: ${hash}`);
                    return jsonResponse({ ok: true, data: { image_url: cached.image_url, provider: "cache", cached: true } }, 200, origin);
                }
            } catch (e) {
                console.warn("[verse-image-generate] Cache check failed:", e);
                // Non-blocking, proceed to generate
            }
        }

        console.log(`[verse-image-generate] Generating: ${style} (Hash: ${hash})`);

        // 6. Generate Logic (Fallback-First Approach)
        let prompt = `A cinematic, premium background for a Bible verse poster. Style: ${style || 'cinematic'}. GOLDEN HOUR, NATURE, WARM LIGHTING. NO TEXT, NO LETTERS.`;
        if (style === 'humanized_nature') prompt += " A person silhouette in nature, contemplating.";
        if (style === 'epic_landscape') prompt += " Vast mountains, soft sunlight, majestic view.";
        if (style === 'warm_cozy') prompt += " Coffee table, open bible, warm indoor lighting, cozy atmosphere.";

        // Deterministic fallback URL
        const fallbackUrl = `https://picsum.photos/seed/${hash.substring(0, 10)}/1080/1350`;
        let finalImageUrl = fallbackUrl;
        let provider = "fallback-picsum";

        // 7. Upload to Storage (If Supabase is alive)
        if (supabase) {
            try {
                const imageRes = await fetch(fallbackUrl);
                if (imageRes.ok) {
                    const blob = await imageRes.blob();
                    const fileName = `${hash}.jpg`;

                    const { error: uploadError } = await supabase.storage
                        .from("verse-posters")
                        .upload(fileName, blob, {
                            contentType: "image/jpeg",
                            upsert: true
                        });

                    if (!uploadError) {
                        const { data: { publicUrl } } = supabase.storage
                            .from("verse-posters")
                            .getPublicUrl(fileName);

                        finalImageUrl = publicUrl;
                        provider = "fallback-storage";
                    } else {
                        console.error("[verse-image-generate] Upload failed:", uploadError);
                    }
                }
            } catch (e) {
                console.error("[verse-image-generate] Storage/fetch pipeline failed:", e);
            }

            // 8. Save Metadata
            try {
                await supabase.from("verse_posters").insert({
                    verse_text,
                    reference,
                    style: style || 'default',
                    language,
                    image_url: finalImageUrl,
                    hash,
                    prompt
                });
            } catch (e) {
                console.error("[verse-image-generate] Metadata save failed:", e);
            }
        }

        // 9. Final Response
        return jsonResponse({ ok: true, data: { image_url: finalImageUrl, provider, cached: false } }, 200, origin);

    } catch (error: any) {
        console.error("[verse-image-generate] Fatal error:", error);
        return jsonResponse(errBody(ERR.INTERNAL, 'Internal error'), 500, origin);
    }
});

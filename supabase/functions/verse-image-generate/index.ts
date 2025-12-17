
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.45.0";
import { handleCors, json } from "../_shared/cors.ts";

/**
 * CONTRACT:
 * - Always return 200 (unless critical system failure).
 * - If AI fails or keys missing -> Fallback to Picsum.
 * - Always return JSON: { ok: true, image_url: string, provider: string, cached?: boolean }
 *                      { ok: false, error: string }
 */

const VALID_STYLES = [
    'minimal_premium',
    'cinematic_light',
    'soft_illustration',
    'watercolor',
    'nature_symbolic'
];

serve(async (req: Request) => {
    // 1. CORS Preflight
    const corsResponse = handleCors(req);
    if (corsResponse) return corsResponse;

    try {
        const { verse_text, reference, style, language = 'pt' } = await req.json();

        // 2. Validation
        if (!verse_text || !reference) {
            return json({ ok: false, error: "verse_text and reference are required" }, 400);
        }
        if (style && !VALID_STYLES.includes(style)) {
            return json({ ok: false, error: "Invalid style" }, 400);
        }

        // 3. Hash Generation
        const inputString = `${verse_text}:${reference}:${style || 'default'}:${language}`;
        const encoder = new TextEncoder();
        const data = encoder.encode(inputString);
        const hashBuffer = await crypto.subtle.digest("SHA-256", data);
        const hashArray = Array.from(new Uint8Array(hashBuffer));
        const hash = hashArray.map((b) => b.toString(16).padStart(2, "0")).join("");

        // 4. Supabase Client
        // We try/catch Supabase creation just in case env vars are totally borked
        let supabase;
        try {
            const url = Deno.env.get("SUPABASE_URL");
            const key = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY");
            if (url && key) {
                supabase = createClient(url, key);
            }
        } catch (e) {
            console.error("Supabase Init Fatal:", e);
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
                    console.log(`Cache hit: ${hash}`);
                    return json({ ok: true, image_url: cached.image_url, provider: "cache", cached: true });
                }
            } catch (e) {
                console.warn("Cache check failed:", e);
                // Non-blocking, proceed to generate
            }
        }

        console.log(`Generating: ${style} (Hash: ${hash})`);

        // 6. Generate Logic (Fallback-First Approach)
        // We default to the fallback logic immediately if anything goes wrong or keys missing

        // Stub/Fallback URL (Deterministic)
        // Picsum seed allows same image for same hash
        const fallbackUrl = `https://picsum.photos/seed/${hash.substring(0, 10)}/1080/1350`;
        let finalImageUrl = fallbackUrl;
        let provider = "fallback-picsum";

        // AI Generation block (Can be swapped/enabled later)
        /*
        const OPENAI_API_KEY = Deno.env.get("OPENAI_API_KEY");
        if (OPENAI_API_KEY) {
            // Try OpenAI...
            // If success -> finalImageUrl = ...; provider = "openai";
            // If fail -> catch -> log -> fall through to picsum defaults
        }
        */

        // 7. Upload to Storage (If Supabase is alive)
        // We WANT to upload the picsum image to our bucket so we have a permanent URL
        // and don't rely on Picsum availability forever.
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
                        provider = "fallback-storage"; // Promoted to internal storage
                    } else {
                        console.error("Upload failed:", uploadError);
                    }
                }
            } catch (e) {
                console.error("Storage/Fetch pipeline failed:", e);
                // finalImageUrl remains picsum URL, which is fine
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
                    prompt: `(Fallback) Style: ${style}`
                });
            } catch (e) {
                console.error("Metadata save failed:", e);
            }
        }

        // 9. Final Response
        return json({ ok: true, image_url: finalImageUrl, provider, cached: false });

    } catch (error: any) {
        console.error("Fatal Function Error:", error);
        // Even in fatal error, try to return valid JSON
        return json({ ok: false, error: `Internal Error: ${error.message}` }, 500);
    }
});

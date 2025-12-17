
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.45.0";

// CORS Headers
const corsHeaders = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

// Styles Whitelist
const VALID_STYLES = [
    'minimal_premium',
    'cinematic_light',
    'soft_illustration',
    'watercolor',
    'nature_symbolic'
];

serve(async (req) => {
    // Handle CORS
    if (req.method === 'OPTIONS') {
        return new Response('ok', { headers: corsHeaders });
    }

    try {
        const supabase = createClient(
            Deno.env.get('SUPABASE_URL') ?? '',
            Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
        );

        const { verse_text, reference, style, language = 'pt' } = await req.json();

        // 1. Validation
        if (!verse_text || !reference || !style) {
            return new Response(JSON.stringify({ error: 'Missing required fields' }), {
                status: 400,
                headers: { ...corsHeaders, 'Content-Type': 'application/json' }
            });
        }

        if (!VALID_STYLES.includes(style)) {
            return new Response(JSON.stringify({ error: 'Invalid style' }), {
                status: 400,
                headers: { ...corsHeaders, 'Content-Type': 'application/json' }
            });
        }

        if (verse_text.length > 500) {
            return new Response(JSON.stringify({ error: 'Text too long' }), {
                status: 400,
                headers: { ...corsHeaders, 'Content-Type': 'application/json' }
            });
        }

        // 2. Hash Generation (Simple hash for cache key)
        // In Deno we can use crypto.subtle but for brevity let's use a simple string logic or assume we can just query by fields if index exists.
        // Ideally we use a proper hash. Let's do a simple base64 of the combo for now or just query by param.
        // Per requirements: "hash text unique".
        const inputString = `${verse_text}:${reference}:${style}:${language}`;
        const encoder = new TextEncoder();
        const data = encoder.encode(inputString);
        const hashBuffer = await crypto.subtle.digest('SHA-256', data);
        const hashArray = Array.from(new Uint8Array(hashBuffer));
        const hash = hashArray.map(b => b.toString(16).padStart(2, '0')).join('');

        // 3. Check Cache
        const { data: cached } = await supabase
            .from('verse_posters')
            .select('image_url')
            .eq('hash', hash)
            .single();

        if (cached) {
            console.log('Cache hit:', hash);
            return new Response(JSON.stringify({ image_url: cached.image_url, cached: true }), {
                headers: { ...corsHeaders, 'Content-Type': 'application/json' }
            });
        }

        console.log('Generating new image for:', style);

        // 4. Generate Image (AI Stub vs Real)
        // Start with STUB/Placeholder logic if no API key
        // We'll use Unsplash Source or similar as a visual placeholder for the "BFF" pattern
        // In a real scenario, this would call OpenAI DALL-E 3
        let image_url = '';
        const OPENAI_API_KEY = Deno.env.get('OPENAI_API_KEY');

        if (OPENAI_API_KEY) {
            // Implementation for DALL-E (Commented out/Partial for future)
            // const response = await fetch('https://api.openai.com/v1/images/generations', ...);
            // For now, let's force the stub to ensure stability unless user explicitly configured it
            // image_url = ...
        }

        // Stub Strategy: Use a deterministic placeholder service based on hash to get different images
        // e.g. picsum.photos
        // We need to fetch it to store it in OUR bucket, otherwise it's just a redirect and we rely on external availability.
        // The requirement says "salvar no Storage". So we must fetch the blob and upload.

        // Generic nature images for stub
        const stubUrl = `https://picsum.photos/seed/${hash.substring(0, 10)}/1080/1350`; // Portrait aspect ratio

        try {
            const imageRes = await fetch(stubUrl);
            if (!imageRes.ok) throw new Error('Failed to fetch stub image');
            const imageBlob = await imageRes.blob();

            // 5. Upload to Storage
            const fileName = `${hash}.jpg`;
            const { error: uploadError } = await supabase.storage
                .from('verse-posters')
                .upload(fileName, imageBlob, {
                    contentType: 'image/jpeg',
                    upsert: true
                });

            if (uploadError) throw uploadError;

            // Get Public URL
            const { data: { publicUrl } } = supabase.storage
                .from('verse-posters')
                .getPublicUrl(fileName);

            image_url = publicUrl;

        } catch (err) {
            console.error('Image generation/upload failed:', err);
            return new Response(JSON.stringify({ error: 'Generation failed' }), {
                status: 500,
                headers: { ...corsHeaders, 'Content-Type': 'application/json' }
            });
        }

        // 6. Save Metadata to DB
        const { error: dbError } = await supabase
            .from('verse_posters')
            .insert({
                verse_text,
                reference,
                style,
                language,
                image_url,
                hash,
                prompt: `(Stub) Style: ${style}`
            });

        if (dbError) {
            console.error('DB Insert failed:', dbError);
            // We still return the image, it just won't be cached effectively next time maybe?
        }

        return new Response(JSON.stringify({ image_url, cached: false }), {
            headers: { ...corsHeaders, 'Content-Type': 'application/json' }
        });

    } catch (error) {
        return new Response(JSON.stringify({ error: error.message }), {
            status: 500,
            headers: { ...corsHeaders, 'Content-Type': 'application/json' }
        });
    }
});

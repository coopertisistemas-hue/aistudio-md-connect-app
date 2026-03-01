import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.45.0";
import { handleCors, jsonResponse } from '../_shared/cors.ts';
import { errBody, ERR } from '../_shared/error.ts';

/**
 * generate-book-context
 *
 * Automatically generates Historical Context, Themes, and Application points
 * for a Bible book if it doesn't exist in the database.
 *
 * Payload: { book_name: string } (e.g., "Obadias", "1 Crônicas")
 */

serve(async (req: Request) => {
    const corsResponse = handleCors(req);
    if (corsResponse) return corsResponse;

    const origin = req.headers.get('origin');

    try {
        const body = await req.json();
        let { book_name } = body;

        // Support Supabase Database Webhook Payload
        if (!book_name && body.record && body.record.verse_reference) {
            const ref = body.record.verse_reference;
            book_name = ref.split(/[\d:]/)[0].trim();
        }

        if (!book_name) {
            return jsonResponse(errBody(ERR.INVALID_REQUEST, 'book_name or valid webhook record is required'), 400, origin);
        }

        // 1. Setup Clients
        const sbUrl = Deno.env.get("SUPABASE_URL")!;
        const sbKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
        const openAiKey = Deno.env.get("OPENAI_API_KEY");

        if (!sbUrl || !sbKey) {
            return jsonResponse(errBody(ERR.CONFIG_MISSING, 'Server configuration error'), 500, origin);
        }
        if (!openAiKey) {
            return jsonResponse(errBody(ERR.CONFIG_MISSING, 'Server configuration error'), 500, origin);
        }

        const supabase = createClient(sbUrl, sbKey);

        // 2. Check existing
        const { data: existing } = await supabase
            .from('bible_books')
            .select('*')
            .ilike('name', book_name)
            .maybeSingle();

        if (existing) {
            return jsonResponse({ ok: true, data: existing, source: 'existing' }, 200, origin);
        }

        console.log(`[generate-book-context] Generating context for: ${book_name}`);

        // 3. Call OpenAI
        const prompt = `
            Gere um objeto JSON com dados de estudo bíblico para o livro: "${book_name}".
            Responda APENAS com o JSON válido, sem markdown.
            
            Schema:
            {
                "id": "${book_name.toLowerCase().replace(/\s+/g, '')}",
                "name": "${book_name}",
                "abbrev": ["Sigla1", "Sigla2"],
                "testament": "VT" ou "NT",
                "historical_context": "Texto de 2 a 3 frases explicando autor, data, destinatários e propósito.",
                "themes": ["Tema 1", "Tema 2", "Tema 3", "Tema 4"],
                "application": [
                    "Aplicação prática para hoje 1",
                    "Aplicação prática para hoje 2",
                    "Aplicação prática para hoje 3",
                    "Aplicação prática para hoje 4"
                ]
            }
        `;

        const aiResponse = await fetch("https://api.openai.com/v1/chat/completions", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${openAiKey}`
            },
            body: JSON.stringify({
                model: "gpt-4o-mini",
                messages: [
                    { role: "system", content: "You are a biblical scholar assistant. Output pure JSON." },
                    { role: "user", content: prompt }
                ],
                temperature: 0.3
            })
        });

        if (!aiResponse.ok) {
            const errText = await aiResponse.text();
            console.error(`[generate-book-context] OpenAI error: ${aiResponse.status} - ${errText}`);
            throw new Error('AI generation failed');
        }

        const aiData = await aiResponse.json();
        let contentStr = aiData.choices[0].message.content;
        contentStr = contentStr.replace(/```json/g, '').replace(/```/g, '').trim();

        let bookData;
        try {
            bookData = JSON.parse(contentStr);
        } catch (e) {
            console.error("[generate-book-context] JSON parse error:", contentStr);
            throw new Error('Failed to parse AI response');
        }

        // 4. Validate & Sanitize
        bookData.id = bookData.id.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "").replace(/[^a-z0-9]/g, "");

        // 5. Insert into Database
        const { error: insertError } = await supabase
            .from('bible_books')
            .insert(bookData);

        if (insertError) {
            // Ignore conflict (race condition)
            if (insertError.code === '23505') {
                return jsonResponse({ ok: true, data: bookData, source: 'concurrent' }, 200, origin);
            }
            throw insertError;
        }

        return jsonResponse({ ok: true, data: bookData, source: 'generated' }, 200, origin);

    } catch (error: any) {
        console.error("[generate-book-context] Error:", error);
        return jsonResponse(errBody(ERR.INTERNAL, 'Internal error'), 500, origin);
    }
});

import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.45.0";
import { handleCors, jsonResponse } from "../_shared/cors.ts";

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

    try {
        const body = await req.json();
        let { book_name } = body;

        // Support Supabase Database Webhook Payload
        // Shape: { type: 'INSERT', table: 'devotionals', record: { verse_reference: 'Rm 8:28', ... }, ... }
        if (!book_name && body.record && body.record.verse_reference) {
            // Extract "Rm" from "Rm 8:28"
            // Simple split by space or number
            const ref = body.record.verse_reference;
            book_name = ref.split(/[\d:]/)[0].trim(); // "Rm"
        }

        if (!book_name) {
            return jsonResponse({ ok: false, error: "book_name or valid webhook record is required" }, 400);
        }

        // 1. Setup Clients
        const sbUrl = Deno.env.get("SUPABASE_URL")!;
        const sbKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
        const openAiKey = Deno.env.get("OPENAI_API_KEY");

        if (!sbUrl || !sbKey) {
            return jsonResponse({ ok: false, error: "Server Configuration Error: Supabase keys missing" }, 500);
        }

        // OpenAI is optional? No, required for this function.
        if (!openAiKey) {
            return jsonResponse({ ok: false, error: "Server Configuration Error: OPENAI_API_KEY missing" }, 500);
        }

        const supabase = createClient(sbUrl, sbKey);

        // 2. Normalization (Simple)
        // We try to find if it exists first to avoid waste.
        // We'll search by name ILIKE
        const { data: existing } = await supabase
            .from('bible_books')
            .select('*')
            .ilike('name', book_name)
            .maybeSingle();

        if (existing) {
            return jsonResponse({ ok: true, message: "Book already exists", data: existing });
        }

        console.log(`Generating context for: ${book_name}`);

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
                model: "gpt-4o-mini", // Fast and cheap
                messages: [
                    { role: "system", content: "You are a biblical scholar assistant. Output pure JSON." },
                    { role: "user", content: prompt }
                ],
                temperature: 0.3
            })
        });

        if (!aiResponse.ok) {
            const errText = await aiResponse.text();
            throw new Error(`OpenAI Error: ${aiResponse.status} - ${errText}`);
        }

        const aiData = await aiResponse.json();
        let contentStr = aiData.choices[0].message.content;

        // Clean markdown code blocks if present
        contentStr = contentStr.replace(/```json/g, '').replace(/```/g, '').trim();

        let bookData;
        try {
            bookData = JSON.parse(contentStr);
        } catch (e) {
            console.error("JSON Parse Error:", contentStr);
            throw new Error("Failed to parse AI response");
        }

        // 4. Validate & Sanitize
        // Ensure ID is lowercase simple
        bookData.id = bookData.id.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "").replace(/[^a-z0-9]/g, "");

        // 5. Insert into Database
        const { error: insertError } = await supabase
            .from('bible_books')
            .insert(bookData);

        if (insertError) {
            // Ignore conflict (race condition)
            if (insertError.code === '23505') { // Unique violation
                return jsonResponse({ ok: true, message: "Book created concurrently", data: bookData });
            }
            throw insertError;
        }

        return jsonResponse({ ok: true, message: "Book generated", data: bookData });

    } catch (error: any) {
        console.error("Generate Context Error:", error);
        return jsonResponse({ ok: false, error: error.message }, 500);
    }
});

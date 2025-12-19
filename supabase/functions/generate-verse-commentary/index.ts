import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.45.0";
import { handleCors, jsonResponse } from "../_shared/cors.ts";

/**
 * generate-verse-commentary
 * 
 * Generates theological study context involved renowned evangelical authors
 * for a specific Bible verse.
 * 
 * Payload: { book_id: string, chapter: number, verse: number, text: string }
 */

serve(async (req: Request) => {
    const corsResponse = handleCors(req);
    if (corsResponse) return corsResponse;

    try {
        const body = await req.json();
        const { book_id, chapter, verse, text } = body;

        if (!book_id || !chapter || !verse || !text) {
            return jsonResponse({ ok: false, error: "Missing required fields: book_id, chapter, verse, text" }, 400);
        }

        // 1. Setup Clients
        const sbUrl = Deno.env.get("SUPABASE_URL")!;
        const sbKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
        const openAiKey = Deno.env.get("OPENAI_API_KEY");

        if (!sbUrl || !sbKey) {
            return jsonResponse({ ok: false, error: "Server Configuration Error: Supabase keys missing" }, 500);
        }
        if (!openAiKey) {
            return jsonResponse({ ok: false, error: "Server Configuration Error: OPENAI_API_KEY missing" }, 500);
        }

        const supabase = createClient(sbUrl, sbKey);

        // 2. Check Existence first
        const { data: existing } = await supabase
            .from('bible_commentaries')
            .select('*')
            .eq('book_id', book_id)
            .eq('chapter', chapter)
            .eq('verse', verse)
            .maybeSingle();

        if (existing) {
            return jsonResponse({ ok: true, data: existing, source: 'cache' });
        }

        console.log(`Generating commentary for: ${book_id} ${chapter}:${verse}`);

        // 3. Prompt Construction
        const prompt = `
            Atue como um especialista teólogo cristão evangélico e estudioso bíblico.
            Crie um comentário de estudo rico para o seguinte versículo:
            
            Ref: ${book_id} ${chapter}:${verse}
            Texto: "${text}"

            Baseie os insights principalmente em autores renomados como Matthew Henry, C.S. Lewis, Charles Spurgeon, John Piper ou Timothy Keller.
            Equilibre profundidade teológica com aplicação prática para a vida cristã moderna.
            
            IMPORTANTE: Responda APENAS em PORTUGUÊS DO BRASIL.

            Retorne APENAS um objeto JSON válido com a seguinte estrutura (sem markdown):
            {
                "historical_context": "2-3 frases explicando o contexto imediato, fundo cultural ou quem está falando/ouvindo.",
                "theological_insights": [
                    "Insight 1 (Significado espiritual profundo, conexão com Cristo ou verdade doutrinária)",
                    "Insight 2",
                    "Insight 3"
                ],
                "practical_application": [
                    "Conselho prático 1",
                    "Conselho prático 2"
                ],
                "themes": ["Tema 1", "Tema 2", "Tema 3"],
                "author_ref": "Nomes dos autores cujos pensamentos foram sintetizados (ex: 'Matthew Henry / Spurgeon')"
            }
        `;

        // 4. Call OpenAI
        const aiResponse = await fetch("https://api.openai.com/v1/chat/completions", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${openAiKey}`
            },
            body: JSON.stringify({
                model: "gpt-4o-mini",
                messages: [
                    { role: "system", content: "You are a specialized theological assistant. Output pure JSON." },
                    { role: "user", content: prompt }
                ],
                temperature: 0.4
            })
        });

        if (!aiResponse.ok) {
            const errText = await aiResponse.text();
            throw new Error(`OpenAI Error: ${aiResponse.status} - ${errText}`);
        }

        const aiData = await aiResponse.json();
        let contentStr = aiData.choices[0].message.content;
        contentStr = contentStr.replace(/```json/g, '').replace(/```/g, '').trim();

        let generatedData;
        try {
            generatedData = JSON.parse(contentStr);
        } catch (e) {
            console.error("JSON Parse Error", contentStr);
            throw new Error("Failed to parse AI response");
        }

        // 5. Insert
        const record = {
            book_id,
            chapter,
            verse,
            ...generatedData
        };

        const { data: inserted, error: insertError } = await supabase
            .from('bible_commentaries')
            .insert(record)
            .select()
            .single();

        if (insertError) {
            // Handle Race Condition
            if (insertError.code === '23505') {
                const { data: retry } = await supabase
                    .from('bible_commentaries')
                    .select('*')
                    .eq('book_id', book_id)
                    .eq('chapter', chapter)
                    .eq('verse', verse)
                    .single();
                return jsonResponse({ ok: true, data: retry, source: 'retry_cache' });
            }
            throw insertError;
        }

        return jsonResponse({ ok: true, data: inserted, source: 'generated' });

    } catch (error: any) {
        console.error("Generate Verse Error:", error);
        return jsonResponse({ ok: false, error: error.message }, 500);
    }
});

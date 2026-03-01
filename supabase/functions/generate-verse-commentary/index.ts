import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.45.0";
import { handleCors, jsonResponse } from '../_shared/cors.ts';
import { errBody, ERR } from '../_shared/error.ts';

const TIMEOUT_MS = 12000

async function withTimeout<T>(promise: Promise<T>, ms: number, operation: string): Promise<T> {
    const timeout = new Promise<never>((_, reject) => 
        setTimeout(() => reject(new Error(`${operation} timed out after ${ms}ms`)), ms)
    )
    try {
        return await Promise.race([promise, timeout])
    } catch (err: any) {
        if (err.message.includes('timed out')) {
            console.error(`[generate-verse-commentary] Timeout: ${operation}`)
            throw new Error('Request timed out')
        }
        throw err
    }
}

/**
 * generate-verse-commentary
 *
 * Generates theological study context for a specific Bible verse.
 * Payload: { book_id: string, chapter: number, verse: number, text: string }
 */

serve(async (req: Request) => {
    const corsResponse = handleCors(req);
    if (corsResponse) return corsResponse;

    const origin = req.headers.get('origin');

    try {
        const body = await req.json();
        const { book_id, chapter, verse, text } = body;

        if (!book_id || !chapter || !verse || !text) {
            return jsonResponse(errBody(ERR.INVALID_REQUEST, 'Missing required fields: book_id, chapter, verse, text'), 400, origin);
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

        // 2. Check Existence first (with timeout)
        const checkQuery = supabase
            .from('bible_commentaries')
            .select('*')
            .eq('book_id', book_id)
            .eq('chapter', chapter)
            .eq('verse', verse)
            .maybeSingle()

        const { data: existing } = await withTimeout(checkQuery, TIMEOUT_MS, 'check existing commentary')

        if (existing) {
            return jsonResponse({ ok: true, data: existing, source: 'cache' }, 200, origin);
        }

        console.log(`[generate-verse-commentary] Generating commentary for: ${book_id} ${chapter}:${verse}`);

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

        // 4. Call OpenAI (with timeout)
        const aiFetchPromise = fetch("https://api.openai.com/v1/chat/completions", {
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
        })

        const aiResponse = await withTimeout(aiFetchPromise, TIMEOUT_MS, 'call OpenAI API')

        if (!aiResponse.ok) {
            const errText = await aiResponse.text();
            console.error(`[generate-verse-commentary] OpenAI error: ${aiResponse.status} - ${errText}`);
            throw new Error('AI generation failed');
        }

        const aiData = await aiResponse.json();
        let contentStr = aiData.choices[0].message.content;
        contentStr = contentStr.replace(/```json/g, '').replace(/```/g, '').trim();

        let generatedData;
        try {
            generatedData = JSON.parse(contentStr);
        } catch (e) {
            console.error("[generate-verse-commentary] JSON parse error", contentStr);
            throw new Error('Failed to parse AI response');
        }

        // 5. Insert (with timeout)
        const record = { book_id, chapter, verse, ...generatedData };

        const insertPromise = supabase
            .from('bible_commentaries')
            .insert(record)
            .select()
            .single()

        const { data: inserted, error: insertError } = await withTimeout(insertPromise, TIMEOUT_MS, 'insert commentary')

        if (insertError) {
            // Handle Race Condition
            if (insertError.code === '23505') {
                const retryQuery = supabase
                    .from('bible_commentaries')
                    .select('*')
                    .eq('book_id', book_id)
                    .eq('chapter', chapter)
                    .eq('verse', verse)
                    .single()
                
                const { data: retry } = await withTimeout(retryQuery, TIMEOUT_MS, 'retry fetch commentary')
                return jsonResponse({ ok: true, data: retry, source: 'retry_cache' }, 200, origin);
            }
            throw insertError;
        }

        return jsonResponse({ ok: true, data: inserted, source: 'generated' }, 200, origin);

    } catch (error: any) {
        console.error("[generate-verse-commentary] Error:", error);
        return jsonResponse(errBody(ERR.INTERNAL, 'Internal error'), 500, origin);
    }
});

import { createClient } from '@supabase/supabase-js';
import * as dotenv from 'dotenv';
import { join } from 'path';

// Load .env from root
dotenv.config({ path: join(process.cwd(), '.env') });
dotenv.config({ path: join(process.cwd(), '.env.local') });

const SUPABASE_URL = process.env.VITE_SUPABASE_URL || process.env.SUPABASE_URL;
const SERVICE_KEY = process.env.SB_SERVICE_ROLE_KEY;

if (!SUPABASE_URL || !SERVICE_KEY) {
    console.error('Missing VITE_SUPABASE_URL or SB_SERVICE_ROLE_KEY in .env');
    process.exit(1);
}

const supabase = createClient(SUPABASE_URL, SERVICE_KEY);

async function main() {
    console.log('🚀 Starting Devotional Cover Backfill...');

    // 1. Count Total
    const { count, error: countError } = await supabase
        .from('devotionals')
        .select('*', { count: 'exact', head: true })
        .is('cover_image_url', null);

    if (countError) {
        console.error('Error counting:', countError);
        return;
    }

    console.log(`🎯 Found ${count} devotionals without cover.`);

    if (count === 0) {
        console.log('✅ All set! No backfill needed.');
        return;
    }

    // 2. Fetch IDs
    let processed = 0;
    const CHUNK_SIZE = 20; // Fetch 20 at a time
    const CONCURRENCY = 2; // Process 2 at a time (Throttle)

    const wait = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

    // Retry wrapper
    async function invokeWithRetry(devotionalId: string, retries = 3): Promise<any> {
        let lastError;
        for (let i = 0; i < retries; i++) {
            try {
                const { data, error } = await supabase.functions.invoke('devotionals-generate-cover', {
                    body: { devotional_id: devotionalId }
                });

                if (error) throw error; // Transport/Supabase client error

                // If the function returns a non-2xx logic error (but 200 OK HTTP)
                // Note: supabase.functions.invoke handles HTTP errors by populating 'error' usually, 
                // but if we returned strictly 200 with ok:false, we check below.
                // However, our new function returns 4xx/5xx for errors, so `error` should be populated by the client SDK.
                // Let's manually check data.ok just in case.

                return data;
            } catch (err: any) {
                lastError = err;
                // If it's a 429 or 5xx, wait and retry
                // Error object from invoke might contain context
                if (i < retries - 1) {
                    await wait(1000 * (i + 1)); // Exponential-ish backoff
                    continue;
                }
            }
        }
        throw lastError;
    }

    // Loop until no more nulls
    while (true) {
        const { data: batch, error } = await supabase
            .from('devotionals')
            .select('id, title')
            .is('cover_image_url', null)
            .limit(CHUNK_SIZE);

        if (error) {
            console.error('Fetch error:', error);
            break;
        }

        if (!batch || batch.length === 0) break;

        console.log(`\n📦 Processing batch of ${batch.length}...`);

        // Chunk the batch into smaller concurrency groups
        for (let i = 0; i < batch.length; i += CONCURRENCY) {
            const chunk = batch.slice(i, i + CONCURRENCY);

            await Promise.all(chunk.map(async (item) => {
                try {
                    process.stdout.write(`  > Generating for "${item.title.substring(0, 50)}..." `); // 20->50 chars

                    const data = await invokeWithRetry(item.id);

                    if (data && !data.ok) {
                        // Logic error returned as 200-OK JSON or captured in catch
                        console.log(`❌ Failed Logic: ${data.error} (${data.error_code || 'NoCode'})`);
                    } else {
                        console.log('✅ Done');
                    }
                } catch (err: any) {
                    // This catches the thrown error after retries
                    console.log(`❌ Failed:`);

                    // Supabase FunctionsHttpError handling
                    if (err && err.context) {
                        try {
                            // Try to get JSON from the response context if available
                            if (typeof err.context.json === 'function') {
                                const body = await err.context.json();
                                console.log(`   Response JSON:`, JSON.stringify(body, null, 2));
                            } else if (err.context.response) {
                                // Fallback to text if possible (might be consumed already)
                                const text = await err.context.response.text();
                                console.log(`   Response Text: ${text.substring(0, 500)}`);
                            }
                        } catch (parseError) {
                            console.log(`   (Could not parse response body: ${parseError})`);
                        }
                    }

                    console.log(`   Error Message: ${err.message}`);
                    if (err.cause) console.log(`   Cause:`, err.cause);
                }
            }));
        }

        processed += batch.length;
        console.log(`📊 Progress: ${processed}/${count || '?'}`);
    }

    console.log('\n✨ Backfill Complete!');
}

main().catch(console.error);

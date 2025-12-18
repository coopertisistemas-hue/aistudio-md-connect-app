import { createClient } from '@supabase/supabase-js';
import * as dotenv from 'dotenv';
import { join } from 'path';

// Load .env
dotenv.config({ path: join(process.cwd(), '.env') });
dotenv.config({ path: join(process.cwd(), '.env.local') });

const SUPABASE_URL = process.env.VITE_SUPABASE_URL || process.env.SUPABASE_URL;
const SERVICE_KEY = process.env.SB_SERVICE_ROLE_KEY;

if (!SUPABASE_URL || !SERVICE_KEY) {
    console.error('❌ Missing VITE_SUPABASE_URL or SB_SERVICE_ROLE_KEY in .env');
    process.exit(1);
}

const supabase = createClient(SUPABASE_URL, SERVICE_KEY);

async function main() {
    console.log('🔍 Starting Pipeline Diagnosis...');
    console.log(`📡 URL: ${SUPABASE_URL}`);

    // 1. Check Bucket
    console.log('\n[1/3] Checking Storage Bucket "devotional-covers"...');
    const { data: buckets, error: bucketError } = await supabase.storage.listBuckets();
    if (bucketError) {
        console.error('❌ Error listing buckets:', bucketError.message);
    } else {
        const found = buckets.find(b => b.name === 'devotional-covers');
        if (found) {
            console.log('✅ Bucket "devotional-covers" exists.');
            console.log(`   - ID: ${found.id}`);
            console.log(`   - Public: ${found.public}`);
        } else {
            console.error('❌ Bucket "devotional-covers" NOT found!');
            console.log('   -> Ensure you ran: npx supabase db push');
        }
    }

    // 2. Check Database Count
    console.log('\n[2/3] Checking Database Records...');
    const { count: total, error: errTotal } = await supabase.from('devotionals').select('*', { count: 'exact', head: true });
    const { count: missing, error: errMissing } = await supabase.from('devotionals').select('*', { count: 'exact', head: true }).is('cover_image_url', null);

    if (errTotal || errMissing) {
        console.error('❌ Database error:', errTotal || errMissing);
    } else {
        console.log(`   - Total Devotionals: ${total}`);
        console.log(`   - Missing Covers: ${missing}`);
        if (missing === 0 && total! > 0) {
            console.log('✅ All devotionals have covers!');
        } else if (total === 0) {
            console.log('⚠️ No devotionals found in DB.');
        } else {
            console.log(`⚠️ Backfill needed for ${missing} records.`);
        }
    }

    // 3. Check Function Health (Optional Probe)
    console.log('\n[3/3] Checking Edge Function "devotionals-generate-cover"...');
    // We try to invoke with a fake ID just to see if it responds (expecting 404 or 400, not 500 or Connection Refused)
    const start = Date.now();
    const { data, error } = await supabase.functions.invoke('devotionals-generate-cover', {
        body: { devotional_id: '00000000-0000-0000-0000-000000000000' } // Dummy UUID
    });
    const duration = Date.now() - start;

    if (error) {
        let handled = false;
        if (error.context && typeof error.context.json === 'function') {
            try {
                const json = await error.context.json();
                if (json.error_code === 'NOT_FOUND') {
                    console.log(`✅ Function accessible (Received expected 404 for dummy ID in ${duration}ms).`);
                    handled = true;
                } else {
                    console.error(`❌ Function Error Response:`, JSON.stringify(json, null, 2));
                }
            } catch { }
        }

        if (!handled) {
            console.error(`❌ Function Invocation Failed:`);
            console.error(`   Message: ${error.message}`);
            console.log('   -> Ensure function is deployed: npx supabase functions deploy devotionals-generate-cover');
        }
    } else {
        if (data && data.error === 'Devotional not found') {
            console.log(`✅ Function accessible (Received expected 404 for dummy ID in ${duration}ms).`);
        } else if (data && !data.ok) {
            console.log(`⚠️ Function reachable but returned error: ${data.error}`);
        } else {
            console.log(`✅ Function response:`, data);
        }
    }

    console.log('\n🏁 Diagnosis Complete.');
}

main().catch(console.error);

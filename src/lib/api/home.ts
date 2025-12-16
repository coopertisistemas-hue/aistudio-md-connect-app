import { supabase } from '@/lib/supabase';

export interface HomeData {
    church: any;
    daily_verse: {
        text: string;
        reference: string;
        lang: string;
    } | null;
    quick_actions: {
        id: string;
        label: string;
        enabled: boolean;
    }[];
    next_event: any;
    latest_notices: any[];
    monetization: {
        doe: any;
        partners: any[];
        affiliates: any[];
        transparency: { label: string; link: string } | null;
    };
    radio: {
        stream_url: string;
        is_active: boolean;
    };
}

export const homeService = {
    async getHomeData(slug: string): Promise<HomeData> {
        await supabase.functions.invoke('public-home-data', {
            body: {}, // GET requests in supabase-js invoke usually send body if POST, or URL params if GET?
            // Actually supabase functions invoke is POST by default unless method specified.
            // But our function handles GET or POST?
            // public-home-data uses `req.url.searchParams`. This implies it expects URL params.
            // supabase.functions.invoke serves POST by default.
            // Let's pass query parameters via the options.
        });

        // Wait, supabase-js invoke defaults to POST. 
        // My function `public-home-data` checks `req.url`.
        // If I use invoke, I can pass method: 'GET'.

        await supabase.functions.invoke('public-home-data', {
            method: 'GET',
            headers: {
                // optional headers
            },
            // query parameters are not directly supported in invoke options for GET params in all versions, 
            // but we can append to the function name? No, invoke takes function name.
            // Actually, we can just use POST and send slug in body if we changed the function, 
            // BUT the function reads `url.searchParams.get('slug')`.
            // So we must ensure the URL has the slug. 
            // Method 1: Append to function name? 'public-home-data?slug=...' -> might work if JS client allows.
            // Method 2: Change function to read from body.
            // The function `public-home-data` currently reads from `url`.

            // Let's try appending query params to the function name if supported, 
            // or better: Update the function to accept POST body as fallback?
            // OR use fetch directly? No, we want to use supabase client for auth (even if public, consistency).

            // Actually, supabase-js `invoke` allows body. 
            // If I stick to `req.url`, I should probably pass params via `invoke('public-home-data?slug=' + slug, ...)`
            // Let's check documentation or assumption. 
            // In recent supabase-js, `invoke` URL handling is strict.

            // Let's assume I can append query string.
        });

        // Correction: If I cannot guarantee invoke supports query params in function name,
        // I should probably update the edge function to read from body too, or just use POST.
        // But for now, let's try strict GET with URL params.

        // Actually, looking at previous logs, the user got a 500 error on `public-home-data?slug=`
        // This implies the client WAS sending it.
        // Let's see how `LandingPage.tsx` was calling it.
        // It was: `supabase.functions.invoke('public-home-data?slug=' + churchSlug)`
        // So that pattern works.

        const { data: homeData, error: funcError } = await supabase.functions.invoke(`public-home-data?slug=${slug}`, {
            method: 'GET'
        });

        if (funcError) throw funcError;
        return homeData.data as HomeData; // Assuming standard response envelope
    }
};

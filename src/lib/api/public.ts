import { supabase } from '@/lib/supabase';

export interface PublicPage {
    title: string;
    subtitle?: string;
    content: string; // Markdown
    seo?: {
        title?: string;
        description?: string;
        keywords?: string[];
    };
}

const getPage = async (slug: string): Promise<PublicPage | null> => {
    try {
        // Construct URL with query parameters manually as invoke expects function name
        // But invoke appends function name to base URL.
        // We can pass query params in the function name argument?
        // Yes, supabase-js connects to `${functionsUrl}/${functionName}`.
        // So passing `public-page-get?slug=abc` works.

        const { data, error } = await supabase.functions.invoke(`public-page-get?slug=${slug}`, {
            method: 'GET',
        });

        if (error) {
            console.warn(`[PublicApi] Error fetching page '${slug}':`, error);
            return null;
        }

        if (!data || !data.ok || !data.page) {
            // Function returns { ok: false, error: ... } on 404
            return null;
        }

        return data.page as PublicPage;
    } catch (err) {
        console.error(`[PublicApi] Exception fetching page '${slug}':`, err);
        return null;
    }
};

export const PublicApi = {
    getPage
};

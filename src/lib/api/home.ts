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
        try {
            const { data: homeData, error: funcError } = await supabase.functions.invoke(`public-home-data?slug=${slug}`, {
                method: 'GET'
            });

            if (funcError) {
                console.error('Home Data Function Error:', funcError);
                throw funcError;
            }

            return homeData?.data as HomeData;
        } catch (error) {
            console.error('Failed to fetch home data:', error);
            // Re-throw or return fallback if critical.
            // For now, re-throwing allows the UI to show an error state or retry.
            throw error;
        }
    }
};

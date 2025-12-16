import { supabase } from '@/lib/supabase';

export interface Church {
    id: string;
    name: string;
    slug: string;
    organization_id?: string;
    city?: string;
    state?: string;
    theme_color?: string; // Future proofing
    logo_url?: string;
    address?: string;
    service_times?: string;
}

export const churchService = {
    async getBySlug(slug: string): Promise<Church | null> {
        try {
            const { data, error } = await supabase.functions.invoke('public-church-detail', {
                body: { slug }
            });

            if (error) {
                console.error('Error fetching church by slug (Edge):', error);
                return null;
            }

            return data;
        } catch (err) {
            console.error('Exception fetching church:', err);
            return null;
        }
    }
};

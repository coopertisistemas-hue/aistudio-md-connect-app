import { supabase } from '@/lib/supabase';

export interface Partner {
    id: string;
    name: string;
    logo_url?: string;
    link_url: string;
    tagline?: string;
    tier: 'standard' | 'gold' | 'platinum';
    is_active: boolean;
}

export const partnersApi = {
    async getActive() {
        try {
            const { data, error } = await supabase.functions.invoke('partners-get');
            if (error) throw error;
            return { data: data.partners as Partner[], error: null };
        } catch (error: any) {
            console.error('API Error (partners-get):', error);
            // Fallback for empty state or error should be handled by caller
            return { data: [], error: error.message };
        }
    },

    async createLead(lead: { name: string; whatsapp: string; message?: string }) {
        try {
            const { data, error } = await supabase.functions.invoke('partner-leads-create', {
                body: lead
            });
            if (error) throw error;
            return { data, error: null };
        } catch (error: any) {
            console.error('API Error (partner-leads-create):', error);
            return { data: null, error: error.message };
        }
    }
};

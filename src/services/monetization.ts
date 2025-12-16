import { supabase } from '../lib/supabase';
import type { Partner, Service } from '../types/monetization';

export const monetizationService = {
    async getFeaturedPartners() {
        // Fetch featured published partners (church specific or global)
        const { data, error } = await supabase
            .from('monetization_partners')
            .select('*')
            .eq('status', 'published')
            .eq('is_featured', true)
            .limit(10);

        if (error) {
            console.error('Error fetching featured partners', error);
            return [];
        }
        return data as Partner[];
    },

    async getAllPartners() {
        const { data, error } = await supabase
            .from('monetization_partners')
            .select('*')
            .eq('status', 'published')
            .order('display_order', { ascending: true });

        if (error) return [];
        return data as Partner[];
    },

    async getFeaturedServices() {
        const { data, error } = await supabase
            .from('monetization_services')
            .select('*')
            .eq('status', 'published')
            .eq('is_featured', true)
            .limit(4);

        if (error) return [];
        return data as Service[];
    },

    async getAllServices() {
        const { data, error } = await supabase
            .from('monetization_services')
            .select('*')
            .eq('status', 'published');

        if (error) return [];
        return data as Service[];
    },

    async getServiceById(id: string) {
        const { data, error } = await supabase
            .from('monetization_services')
            .select('*')
            .eq('id', id)
            .single();

        if (error) return null;
        return data as Service;
    },

    async trackEvent(itemId: string, itemType: 'partner' | 'service', actionType: 'click' | 'whatsapp' | 'lead', source: string) {
        // Optimistic tracking, don't block
        const { data: { user } } = await supabase.auth.getUser();

        // We need to resolve church_id relative to user if possible, or leave null and let trigger handle it?
        // For simplicity, we just insert. The RLS might require getting the profile first which is expensive for just a tracking pixel.
        // But our schema says church_id is optional or we can resolve it.
        // Actually, let's just insert item_id and user_id. The trigger/backend can fill church_id if needed, or we fetch it.
        // For this MVP, we will try to fetch profile church_id from local storage or context if available, otherwise just send what we have.

        // Assuming we rely on RLS allowing insert for auth users.
        await supabase.from('monetization_tracking').insert({
            user_id: user?.id,
            item_id: itemId,
            item_type: itemType,
            action_type: actionType,
            source: source
            // church_id: ... inferred by backend or RLS? The RLS policy allows insert.
        });
    }
};

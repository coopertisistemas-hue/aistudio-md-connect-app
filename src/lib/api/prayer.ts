import { supabase } from '@/lib/supabase';

export interface PrayerRequest {
    id: string;
    user_id: string;
    title?: string;
    description: string;
    category: string;
    urgency: 'normal' | 'urgent';
    privacy: 'public' | 'team_only' | 'anonymous';
    status: 'open' | 'answered' | 'archived';
    created_at: string;
    reaction_count?: number;
    user_reacted?: boolean;
}

export interface CreatePrayerRequestPayload {
    description: string;
    category: string;
    urgency: 'normal' | 'urgent';
    privacy: 'public' | 'team_only' | 'anonymous';
    name?: string; // Optional for non-logged users if we want to store it in description or separate field later
    contact_method?: 'none' | 'email' | 'whatsapp';
    contact_value?: string;
    consent_contact?: boolean;
}

export const prayerApi = {
    create: async (payload: CreatePrayerRequestPayload) => {
        try {
            const { data: { user } } = await supabase.auth.getUser();

            const { data, error } = await supabase
                .from('prayer_requests')
                .insert({
                    user_id: user?.id, // Can be null if anonymous logic changes, but currently policy requires auth
                    description: payload.description,
                    category: payload.category,
                    urgency: payload.urgency,
                    privacy: payload.privacy,
                    scope_type: 'public_project',
                    contact_method: payload.contact_method || 'none',
                    contact_value: payload.contact_value,
                    consent_contact: payload.consent_contact
                })
                .select()
                .single();

            if (error) throw error;
            return { data, error: null };
        } catch (err) {
            console.error('API Error [create-request]:', err);
            return { data: null, error: err };
        }
    },

    getFeed: async (limit = 20, offset = 0, filterUrgency = false, filterGratitude = false) => {
        try {
            const { data, error } = await supabase.rpc('get_prayer_feed', {
                p_limit: limit,
                p_offset: offset,
                p_filter_urgency: filterUrgency,
                p_filter_gratitude: filterGratitude
            });
            if (error) throw error;
            return { data: data as PrayerRequest[], error: null };
        } catch (err) {
            console.error('API Error [get-feed]:', err);
            return { data: [], error: err };
        }
    },

    toggleReaction: async (requestId: string) => {
        try {
            const { data, error } = await supabase.rpc('toggle_prayer_reaction', {
                p_request_id: requestId
            });
            if (error) throw error;
            return { data, error: null };
        } catch (err) {
            console.error('API Error [toggle-reaction]:', err);
            return { data: null, error: err };
        }
    }
};

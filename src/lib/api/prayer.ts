import { supabase } from '@/lib/supabase';

export interface CreatePrayerRequestPayload {
    request_type: string;
    description: string;
    is_anonymous: boolean;
    visibility: 'public' | 'private';
    preferred_contact: 'whatsapp' | 'none';
}

export const prayerApi = {
    create: async (payload: CreatePrayerRequestPayload) => {
        try {
            const { data, error } = await supabase.functions.invoke('prayer-requests-create', {
                body: payload
            });
            if (error) throw error;
            return { data, error: null };
        } catch (err) {
            console.error('API Error [prayer-requests-create]:', err);
            return { data: null, error: err };
        }
    },

    // Placeholder for "My Requests" - implementing list endpoint later
    // For now we might keep using a stored list in local storage or mock call?
    // User requirement said: "Implement prayer-requests-list (or placeholder)"
    // And "No login in Phase 1".
    // So we will simulate an empty list or return nothing for now if no auth.
    getMyRequests: async () => {
        return { data: [], error: null };
    }
};

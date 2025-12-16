import { supabase } from "@/lib/supabase";

export interface PrayerRequestPayload {
    name?: string;
    content: string;
    category: string;
    is_confidential: boolean;
}

export const createPrayerRequest = async (payload: PrayerRequestPayload) => {
    const { data: { session } } = await supabase.auth.getSession();
    const token = session?.access_token;

    // Token is optional for public requests
    const headers: any = {
        'Content-Type': 'application/json'
    };
    if (token) {
        headers['Authorization'] = `Bearer ${token}`;
    }

    const res = await fetch(`${import.meta.env.VITE_SUPABASE_URL}/functions/v1/member-prayer-request`, {
        method: 'POST',
        headers,
        body: JSON.stringify(payload)
    });

    if (!res.ok) {
        const err = await res.json();
        throw new Error(err.error || 'Failed to submit request');
    }

    return res.json();
};

export interface CalendarEvent {
    id: string;
    title: string;
    description?: string;
    start_time: string;
    end_time?: string;
    location?: string;
    is_public: boolean;
}

export const getMemberEvents = async () => {
    const { data: { session } } = await supabase.auth.getSession();
    const token = session?.access_token;

    // Public endpoint can be accessed without token theoretically, but using token is safe
    const res = await fetch(`${import.meta.env.VITE_SUPABASE_URL}/functions/v1/member-events`, {
        headers: token ? { 'Authorization': `Bearer ${token}` } : {}
    });

    if (!res.ok) throw new Error('Failed to fetch events');
    const json = await res.json();
    return json.data as CalendarEvent[];
}

export interface RadioConfig {
    enabled: boolean;
    stream_url: string;
    station_name: string;
    program_name: string;
}

export const getAppConfig = async () => {
    // Public/Member safe config
    const res = await fetch(`${import.meta.env.VITE_SUPABASE_URL}/functions/v1/member-config`);
    if (!res.ok) throw new Error('Failed to fetch config');
    const json = await res.json();
    return json.config as { radio_config?: RadioConfig, [key: string]: any };
}

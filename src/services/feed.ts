import { supabase } from '@/lib/supabase';

export interface FeedItem {
    id: string;
    title: string;
    subtitle?: string;
    content?: string;
    body?: string; // Legacy support
    type: 'news' | 'devotional' | 'notice' | 'event' | 'live';
    published_at?: string; // Legacy
    starts_at?: string; // New standard
    priority?: 'normal' | 'high';
    is_pinned?: boolean;
    audience_tags?: string[];
    cta_type?: 'internal' | 'external' | 'whatsapp' | null;
    cta_label?: string;
    cta_href?: string;
    cover_image_url?: string;
}

export const feedService = {
    getFeed: async (limit = 10) => {
        const { data: { session } } = await supabase.auth.getSession();

        if (!session) {
            console.log("No session found for feed");
            return [];
        }

        // Fetch profile to get church_id
        const { data: profile } = await supabase
            .from('profiles')
            .select('church_id')
            .eq('id', session.user.id)
            .single();

        if (!profile?.church_id) return [];

        const now = new Date().toISOString();

        const { data, error } = await supabase
            .from('posts')
            .select('*')
            .eq('church_id', profile.church_id)
            .eq('status', 'published')
            .or(`expires_at.is.null,expires_at.gte.${now}`)
            .order('is_pinned', { ascending: false }) // Pinned first
            .order('priority', { ascending: true }) // 'high' < 'normal', so ASC puts high first
            .order('starts_at', { ascending: false }) // Newest first
            .limit(limit);

        if (error) {
            console.error('Feed error:', error);
            throw error;
        }

        return data as FeedItem[];
    },

    getNotices: async (page = 0, limit = 20) => {
        const { data: { session } } = await supabase.auth.getSession();
        if (!session) return [];

        const { data: profile } = await supabase.from('profiles').select('church_id').eq('id', session.user.id).single();
        if (!profile?.church_id) return [];

        const now = new Date().toISOString();
        const from = page * limit;
        const to = from + limit - 1;

        const { data, error } = await supabase
            .from('posts')
            .select('*')
            .eq('church_id', profile.church_id)
            .eq('status', 'published')
            .or(`expires_at.is.null,expires_at.gte.${now}`)
            .order('is_pinned', { ascending: false })
            .order('priority', { ascending: true })
            .order('starts_at', { ascending: false })
            .range(from, to);

        if (error) throw error;
        return data as FeedItem[];
    },

    getNoticeById: async (id: string) => {
        const { data, error } = await supabase
            .from('posts')
            .select('*') // We might want to select specific fields or join with creator if needed
            .eq('id', id)
            .single();

        if (error) throw error;
        return data as FeedItem;
    }
};

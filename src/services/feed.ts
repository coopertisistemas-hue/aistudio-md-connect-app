import { supabase } from '@/lib/supabase';
import { getChurchContext, invokeBff } from '@/lib/bff';

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
        const { church_id } = await getChurchContext();
        if (!church_id) return [];

        try {
            const data = await invokeBff<FeedItem[]>('church-posts-list', {
                limit,
                include_expired: false
            });
            return data as FeedItem[];
        } catch (error) {
            console.error('Feed error:', error);
            return [];
        }
    },

    getNotices: async (page = 0, limit = 20) => {
        const { data: { session } } = await supabase.auth.getSession();
        if (!session) return [];
        const { church_id } = await getChurchContext();
        if (!church_id) return [];

        try {
            const data = await invokeBff<FeedItem[]>('church-posts-list', {
                type: 'notice',
                page,
                limit,
                include_expired: false
            });
            return data as FeedItem[];
        } catch (error) {
            console.error('Erro ao buscar avisos:', error);
            return [];
        }
    },

    getNoticeById: async (id: string) => {
        try {
            const data = await invokeBff<FeedItem>('church-post-detail', { id, type: 'notice' });
            return data as FeedItem;
        } catch (error) {
            console.error('Erro ao buscar aviso:', error);
            return null as unknown as FeedItem;
        }
    }
};

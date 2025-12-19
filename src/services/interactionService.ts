
import { supabase } from '@/lib/supabase';



export const interactionService = {
    // --- Devotionals ---

    // Toggle Reaction (Like/Amém) via RPC
    toggleDevotionalReaction: async (devotionalId: string, userId: string): Promise<{ reacted: boolean, count: number } | null> => {
        try {
            const { data, error } = await supabase.rpc('toggle_devotional_reaction', {
                _devotional_id: devotionalId,
                _user_id: userId
            });

            if (error) throw error;
            return data as { reacted: boolean, count: number };
        } catch (error) {
            console.error('Error toggling reaction:', error);
            return null;
        }
    },

    // Get Devotional Details (Likes + Views) via RPC
    // Replaces getDevotionalReaction and getDevotionalReadsToday
    getDevotionalDetails: async (devotionalId: string, userId?: string) => {
        try {
            const { data, error } = await supabase.rpc('get_devotional_details', {
                _devotional_id: devotionalId,
                _user_id: userId || null
            });

            if (error) throw error;
            return data as { likes: number, has_liked: boolean, views_today: number };
        } catch (error) {
            console.error('Error fetching details:', error);
            return { likes: 0, has_liked: false, views_today: 0 };
        }
    },

    // Log Read (View) - Direct Insert (Public Policy)
    logDevotionalRead: async (devotionalId: string, userId?: string) => {
        try {
            const sessionId = localStorage.getItem('md_session_id') || crypto.randomUUID();
            if (!localStorage.getItem('md_session_id')) {
                localStorage.setItem('md_session_id', sessionId);
            }

            await supabase
                .from('devotional_reads')
                .insert({
                    devotional_id: devotionalId,
                    user_id: userId || null,
                    session_id: sessionId
                });
        } catch (error) {
            // Ignore duplicate/error logs silently
            console.error('Error logging read:', error);
        }
    },

    // --- Verses ---

    // Toggle Verse Reaction via RPC
    toggleVerseReaction: async (book: string, chapter: number, verse: number, userId: string): Promise<{ reacted: boolean, count: number } | null> => {
        try {
            const { data, error } = await supabase.rpc('toggle_verse_reaction', {
                _book: book,
                _chapter: chapter,
                _verse: verse,
                _user_id: userId
            });

            if (error) throw error;
            return data as { reacted: boolean, count: number };
        } catch (error) {
            console.error('Verse reaction error:', error);
            return null;
        }
    },

    // Get Chapter Stats (Bulk Likes)
    getChapterStats: async (book: string, chapter: number, userId?: string) => {
        try {
            const { data, error } = await supabase.rpc('get_chapter_stats', {
                _book: book,
                _chapter: chapter,
                _user_id: userId || null
            });

            if (error) throw error;
            return data as Array<{ verse: number, count: number, user_has_liked: boolean }>;
        } catch (error) {
            console.error('Chapter stats error:', error);
            return [];
        }
    }
};

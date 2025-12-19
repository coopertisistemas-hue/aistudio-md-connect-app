
import { supabase } from '@/lib/supabase';



export const interactionService = {
    // --- Devotionals ---

    // Toggle Reaction (Like/Amém) via RPC
    toggleDevotionalReaction: async (devotionalId: string, userId: string): Promise<{ reacted: boolean, count: number } | null> => {
        try {
            // Updated to use 'toggle_devotional_amen' as per strict spec
            // Note: Function expects _devotional_id (authed user from context)
            const { data, error } = await supabase.rpc('toggle_devotional_amen', {
                _devotional_id: devotionalId
            });

            if (error) throw error;
            // Map RPC result { liked, count } to internal { reacted, count }
            return { reacted: data.liked, count: data.count };
        } catch (error) {
            console.error('Error toggling reaction:', error);
            return null;
        }
    },

    // Get Devotional Details (Likes + Views) via RPC
    getDevotionalDetails: async (devotionalId: string, userId?: string) => {
        try {
            // Updated to use 'get_devotional_social_combined' for total counts
            const { data, error } = await supabase.rpc('get_devotional_social_combined', {
                _devotional_id: devotionalId,
                _read_date: new Date().toISOString().split('T')[0]
            });

            if (error) throw error;

            return {
                likes: data.amen_count,
                has_liked: data.liked,
                views_today: data.reads_count // This is now Auth + Public
            };
        } catch (error) {
            console.error('Error fetching details:', error);
            return { likes: 0, has_liked: false, views_today: 0 };
        }
    },

    // Log Read (View)
    logDevotionalRead: async (devotionalId: string, userId?: string) => {
        try {
            if (userId) {
                // Authenticated: Direct DB Insert
                await supabase
                    .from('devotional_reads')
                    .insert({
                        devotional_id: devotionalId,
                        user_id: userId
                    });
            } else {
                // Anonymous: Call Edge Function
                const sessionHash = localStorage.getItem('md_session_hash') || crypto.randomUUID();
                if (!localStorage.getItem('md_session_hash')) {
                    localStorage.setItem('md_session_hash', sessionHash);
                }

                await supabase.functions.invoke('track-public-read', {
                    body: { devotional_id: devotionalId, session_hash: sessionHash }
                });
            }
        } catch (error) {
            // Ignore errors/duplicates silently
        }
    },

    // --- Verses ---

    // Toggle Verse Reaction via RPC
    toggleVerseReaction: async (book: string, chapter: number, verse: number, userId: string): Promise<{ reacted: boolean, count: number } | null> => {
        try {
            const { data, error } = await supabase.rpc('toggle_verse_amen', {
                _book: book,
                _chapter: chapter,
                _verse: verse
            });

            if (error) throw error;
            return { reacted: data.liked, count: data.count };
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

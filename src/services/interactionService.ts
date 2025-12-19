
import { supabase } from '@/lib/supabase';

export const interactionService = {
    // --- Devotionals ---

    // Toggle Reaction (Like/Amém)
    toggleDevotionalReaction: async (devotionalId: string, userId: string): Promise<{ reacted: boolean, count: number } | null> => {
        try {
            // Check if exists
            const { data: existing } = await supabase
                .from('devotional_reactions')
                .select('id')
                .eq('devotional_id', devotionalId)
                .eq('user_id', userId)
                .single();

            if (existing) {
                // Remove (Unlike)
                await supabase
                    .from('devotional_reactions')
                    .delete()
                    .eq('id', existing.id);
            } else {
                // Add (Like)
                await supabase
                    .from('devotional_reactions')
                    .insert({ devotional_id: devotionalId, user_id: userId });
            }

            // Get updated count
            const { count } = await supabase
                .from('devotional_reactions')
                .select('*', { count: 'exact', head: true })
                .eq('devotional_id', devotionalId);

            return { reacted: !existing, count: count || 0 };

        } catch (error) {
            console.error('Error toggling reaction:', error);
            return null;
        }
    },

    // Get Reaction State
    getDevotionalReaction: async (devotionalId: string, userId?: string) => {
        try {
            const { count } = await supabase
                .from('devotional_reactions')
                .select('*', { count: 'exact', head: true })
                .eq('devotional_id', devotionalId);

            let hasReacted = false;
            if (userId) {
                const { data } = await supabase
                    .from('devotional_reactions')
                    .select('id')
                    .eq('devotional_id', devotionalId)
                    .eq('user_id', userId)
                    .single();
                hasReacted = !!data;
            }

            return { count: count || 0, hasReacted };
        } catch (error) {
            return { count: 0, hasReacted: false };
        }
    },

    // Log Read (View)
    logDevotionalRead: async (devotionalId: string, userId?: string) => {
        try {
            const sessionId = localStorage.getItem('md_session_id') || crypto.randomUUID();
            if (!localStorage.getItem('md_session_id')) {
                localStorage.setItem('md_session_id', sessionId);
            }

            // Simple idempotency check for today (client-side optimization + server check ideally)
            // We'll just insert, strict counting can be done in analysis query

            await supabase
                .from('devotional_reads')
                .insert({
                    devotional_id: devotionalId,
                    user_id: userId || null,
                    session_id: sessionId
                });

        } catch (error) {
            console.error('Error logging read:', error);
        }
    },

    // Get Today's Read Count
    getDevotionalReadsToday: async (devotionalId: string) => {
        try {
            const today = new Date();
            today.setHours(0, 0, 0, 0);

            const { count } = await supabase
                .from('devotional_reads')
                .select('*', { count: 'exact', head: true })
                .eq('devotional_id', devotionalId)
                .gte('created_at', today.toISOString());

            return count || 0;
        } catch (error) {
            return 0;
        }
    },

    // --- Verses ---

    toggleVerseReaction: async (verseRef: string, userId: string): Promise<boolean> => {
        try {
            const { data: existing } = await supabase
                .from('verse_reactions')
                .select('id')
                .eq('verse_ref', verseRef)
                .eq('user_id', userId)
                .single();

            if (existing) {
                await supabase.from('verse_reactions').delete().eq('id', existing.id);
                return false;
            } else {
                await supabase.from('verse_reactions').insert({ verse_ref: verseRef, user_id: userId });
                return true;
            }
        } catch (error) {
            console.error('Verse reaction error:', error);
            return false;
        }
    }
};

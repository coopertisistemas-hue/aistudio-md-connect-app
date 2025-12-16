import { supabase } from '@/lib/supabase';
import type { Post, ContentSeries, ContentMessage, ReadingPlan, ReadingPlanDay } from '@/types/content';

export const contentService = {
    // DEVOTIONALS (POSTS)
    getDevotionals: async (limit = 10) => {
        const { data: { session } } = await supabase.auth.getSession();
        if (!session) return [];
        const { data: profile } = await supabase.from('profiles').select('church_id').eq('id', session.user.id).single();
        if (!profile?.church_id) return [];

        const { data } = await supabase
            .from('posts')
            .select('*')
            .eq('church_id', profile.church_id)
            .eq('type', 'devotional')
            .eq('status', 'published')
            .order('published_at', { ascending: false })
            .limit(limit);
        return (data as Post[]) || [];
    },

    getDevotionalById: async (id: string) => {
        const { data } = await supabase.from('posts').select('*').eq('id', id).single();
        return data as Post;
    },

    markContentAsRead: async (contentId: string, contentType: 'devotional' | 'message') => {
        const { data: { session } } = await supabase.auth.getSession();
        if (!session) return false;

        const { error } = await supabase.from('user_content_history').insert({
            user_id: session.user.id,
            content_id: contentId,
            content_type: contentType,
            read_at: new Date().toISOString()
        });
        return !error;
    },

    getContentHistory: async () => {
        const { data: { session } } = await supabase.auth.getSession();
        if (!session) return [];
        const { data } = await supabase.from('user_content_history').select('content_id').eq('user_id', session.user.id);
        return data?.map(d => d.content_id) || [];
    },

    // SERIES
    getSeries: async () => {
        const { data: { session } } = await supabase.auth.getSession();
        if (!session) return [];
        const { data: profile } = await supabase.from('profiles').select('church_id').eq('id', session.user.id).single();
        if (!profile?.church_id) return [];

        const { data } = await supabase
            .from('content_series')
            .select('*')
            .eq('church_id', profile.church_id)
            .eq('status', 'published')
            .order('created_at', { ascending: false });
        return (data as ContentSeries[]) || [];
    },

    getSeriesById: async (id: string) => {
        const { data } = await supabase.from('content_series').select('*').eq('id', id).single();
        return data as ContentSeries;
    },

    getMessagesBySeries: async (seriesId: string) => {
        const { data } = await supabase
            .from('content_messages')
            .select('*')
            .eq('series_id', seriesId)
            .eq('status', 'published')
            .order('published_at', { ascending: false }); // Or episode order
        return (data as ContentMessage[]) || [];
    },

    getMessageById: async (id: string) => {
        const { data } = await supabase.from('content_messages').select('*').eq('id', id).single();
        return data as ContentMessage;
    },

    // PLANS
    getReadingPlans: async () => {
        const { data: { session } } = await supabase.auth.getSession();
        if (!session) return [];
        const { data: profile } = await supabase.from('profiles').select('church_id').eq('id', session.user.id).single();
        if (!profile?.church_id) return [];

        const { data } = await supabase
            .from('reading_plans')
            .select('*')
            .eq('church_id', profile.church_id)
            .eq('status', 'published')
            .order('created_at', { ascending: false });
        // Future: Fetch user progress to show %
        return (data as ReadingPlan[]) || [];
    },

    getPlanById: async (id: string) => {
        const { data } = await supabase.from('reading_plans').select('*').eq('id', id).single();
        return data as ReadingPlan;
    },

    getPlanDays: async (planId: string) => {
        const { data } = await supabase
            .from('reading_plan_days')
            .select('*')
            .eq('plan_id', planId)
            .order('day_number', { ascending: true });
        return (data as ReadingPlanDay[]) || [];
    },

    // PLAN PROGRESS
    getPlanProgress: async (planId: string) => {
        const { data: { session } } = await supabase.auth.getSession();
        if (!session) return { completed_days: [] };

        const { data } = await supabase
            .from('user_plan_progress')
            .select('completed_days')
            .eq('user_id', session.user.id)
            .eq('plan_id', planId)
            .single();
        return data || { completed_days: [] };
    },

    markPlanDayComplete: async (planId: string, dayNumber: number) => {
        const { data: { session } } = await supabase.auth.getSession();
        if (!session) return;

        // Check existing
        const { data: existing } = await supabase
            .from('user_plan_progress')
            .select('*')
            .eq('user_id', session.user.id)
            .eq('plan_id', planId)
            .single();

        let completed = existing?.completed_days || [];
        if (!completed.includes(dayNumber)) {
            completed.push(dayNumber);

            const payload = {
                user_id: session.user.id,
                plan_id: planId,
                completed_days: completed,
                last_accessed_at: new Date().toISOString()
            };

            if (existing) {
                await supabase.from('user_plan_progress').update(payload).eq('id', existing.id);
            } else {
                await supabase.from('user_plan_progress').insert({ ...payload, started_at: new Date().toISOString() });
            }
        }
        return completed;
    }
};

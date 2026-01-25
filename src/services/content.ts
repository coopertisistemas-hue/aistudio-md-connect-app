import { supabase } from '@/lib/supabase';
import { getChurchContext, invokeBff } from '@/lib/bff';
import type { Post, ContentSeries, ContentMessage, ReadingPlan, ReadingPlanDay } from '@/types/content';

export const contentService = {
    // DEVOTIONALS (POSTS)
    getDevotionals: async (limit = 10) => {
        const { data: { session } } = await supabase.auth.getSession();
        if (!session) return [];
        const { church_id } = await getChurchContext();
        if (!church_id) return [];

        const data = await invokeBff<Post[]>('church-posts-list', {
            type: 'devotional',
            limit
        });
        return data || [];
    },

    getDevotionalById: async (id: string) => {
        try {
            const data = await invokeBff<Post>('church-post-detail', { id, type: 'devotional' });
            return data as Post;
        } catch (error) {
            console.error('Erro ao buscar devocional:', error);
            return null as unknown as Post;
        }
    },

    markContentAsRead: async (contentId: string, contentType: 'devotional' | 'message') => {
        const { data: { session } } = await supabase.auth.getSession();
        if (!session) return false;
        try {
            await invokeBff('church-content-mark-read', {
                content_id: contentId,
                content_type: contentType
            });
            return true;
        } catch (error) {
            console.error('Erro ao marcar conteúdo como lido:', error);
            return false;
        }
    },

    getContentHistory: async () => {
        const { data: { session } } = await supabase.auth.getSession();
        if (!session) return [];
        try {
            const data = await invokeBff<{ content_id: string }[]>('church-content-history');
            return data?.map(d => d.content_id) || [];
        } catch (error) {
            console.error('Erro ao buscar histórico de conteúdo:', error);
            return [];
        }
    },

    // SERIES
    getSeries: async () => {
        const { data: { session } } = await supabase.auth.getSession();
        if (!session) return [];
        const { church_id } = await getChurchContext();
        if (!church_id) return [];

        try {
            const data = await invokeBff<ContentSeries[]>('church-series-list');
            return (data as ContentSeries[]) || [];
        } catch (error) {
            console.error('Erro ao buscar séries:', error);
            return [];
        }
    },

    getSeriesById: async (id: string) => {
        try {
            const data = await invokeBff<ContentSeries>('church-series-detail', { id });
            return data as ContentSeries;
        } catch (error) {
            console.error('Erro ao buscar série:', error);
            return null as unknown as ContentSeries;
        }
    },

    getMessagesBySeries: async (seriesId: string) => {
        try {
            const data = await invokeBff<ContentMessage[]>('church-messages-by-series', { series_id: seriesId });
            return (data as ContentMessage[]) || [];
        } catch (error) {
            console.error('Erro ao buscar mensagens da série:', error);
            return [];
        }
    },

    getMessageById: async (id: string) => {
        try {
            const data = await invokeBff<ContentMessage>('church-message-detail', { id });
            return data as ContentMessage;
        } catch (error) {
            console.error('Erro ao buscar mensagem:', error);
            return null as unknown as ContentMessage;
        }
    },

    // PLANS
    getReadingPlans: async () => {
        const { data: { session } } = await supabase.auth.getSession();
        if (!session) return [];
        const { church_id } = await getChurchContext();
        if (!church_id) return [];

        try {
            const data = await invokeBff<ReadingPlan[]>('church-reading-plans-list');
            return (data as ReadingPlan[]) || [];
        } catch (error) {
            console.error('Erro ao buscar planos de leitura:', error);
            return [];
        }
    },

    getPlanById: async (id: string) => {
        try {
            const data = await invokeBff<ReadingPlan>('church-reading-plan-detail', { id });
            return data as ReadingPlan;
        } catch (error) {
            console.error('Erro ao buscar plano:', error);
            return null as unknown as ReadingPlan;
        }
    },

    getPlanDays: async (planId: string) => {
        try {
            const data = await invokeBff<ReadingPlanDay[]>('church-plan-days-list', { plan_id: planId });
            return (data as ReadingPlanDay[]) || [];
        } catch (error) {
            console.error('Erro ao buscar dias do plano:', error);
            return [];
        }
    },

    // PLAN PROGRESS
    getPlanProgress: async (planId: string) => {
        const { data: { session } } = await supabase.auth.getSession();
        if (!session) return { completed_days: [] };
        try {
            const data = await invokeBff<{ completed_days: number[] }>('church-plan-progress-get', { plan_id: planId });
            return data || { completed_days: [] };
        } catch (error) {
            console.error('Erro ao buscar progresso do plano:', error);
            return { completed_days: [] };
        }
    },

    markPlanDayComplete: async (planId: string, dayNumber: number) => {
        const { data: { session } } = await supabase.auth.getSession();
        if (!session) return;
        try {
            const data = await invokeBff<{ completed_days: number[] }>('church-plan-progress-upsert', {
                plan_id: planId,
                day_number: dayNumber
            });
            return data?.completed_days || [];
        } catch (error) {
            console.error('Erro ao atualizar progresso do plano:', error);
            return;
        }
    }
};

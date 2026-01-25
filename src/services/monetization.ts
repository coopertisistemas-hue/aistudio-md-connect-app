import { supabase } from '../lib/supabase';
import { invokeBff } from '@/lib/bff';
import type { Partner, Service } from '../types/monetization';

export const monetizationService = {
    async getFeaturedPartners() {
        try {
            const data = await invokeBff<Partner[]>('public-monetization-partners', {
                featured: true
            });
            return data as Partner[];
        } catch (error) {
            console.error('Erro ao buscar parceiros em destaque', error);
            return [];
        }
    },

    async getAllPartners() {
        try {
            const data = await invokeBff<Partner[]>('public-monetization-partners', {
                featured: false
            });
            return data as Partner[];
        } catch (error) {
            console.error('Erro ao buscar parceiros', error);
            return [];
        }
    },

    async getFeaturedServices() {
        try {
            const data = await invokeBff<Service[]>('public-monetization-services', {
                featured: true
            });
            return data as Service[];
        } catch (error) {
            console.error('Erro ao buscar serviços em destaque', error);
            return [];
        }
    },

    async getAllServices() {
        try {
            const data = await invokeBff<Service[]>('public-monetization-services', {
                featured: false
            });
            return data as Service[];
        } catch (error) {
            console.error('Erro ao buscar serviços', error);
            return [];
        }
    },

    async getServiceById(id: string) {
        try {
            const data = await invokeBff<Service>('public-monetization-service-detail', { id });
            return data as Service;
        } catch (error) {
            console.error('Erro ao buscar serviço', error);
            return null;
        }
    },

    async trackEvent(itemId: string, itemType: 'partner' | 'service', actionType: 'click' | 'whatsapp' | 'lead', source: string) {
        // Optimistic tracking, don't block
        const { data: { user } } = await supabase.auth.getUser();

        // We need to resolve church_id relative to user if possible, or leave null and let trigger handle it?
        // For simplicity, we just insert. The RLS might require getting the profile first which is expensive for just a tracking pixel.
        // But our schema says church_id is optional or we can resolve it.
        // Actually, let's just insert item_id and user_id. The trigger/backend can fill church_id if needed, or we fetch it.
        // For this MVP, we will try to fetch profile church_id from local storage or context if available, otherwise just send what we have.

        // Assuming we rely on RLS allowing insert for auth users.
        try {
            await invokeBff('monetization-track', {
                user_id: user?.id || null,
                item_id: itemId,
                item_type: itemType,
                action_type: actionType,
                source: source
            });
        } catch (error) {
            console.error('Erro ao registrar evento de monetização', error);
        }
    }
};

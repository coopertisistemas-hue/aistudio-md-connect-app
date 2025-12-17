import { supabase } from '@/lib/supabase';
import type { Post } from '@/types/content';

export const devotionalsApi = {
    getById: async (id: string): Promise<Post | null> => {
        try {
            const { data, error } = await supabase.functions.invoke('devotionals-get', {
                body: { id }
            });
            if (error) throw error;
            return data as Post;
        } catch (err) {
            console.error('API Error [devotionals-get]:', err);
            throw err;
        }
    },

    getLatest: async (): Promise<Post | null> => {
        try {
            const { data, error } = await supabase.functions.invoke('devotionals-get', {
                body: { latest: 'true' }
            });
            if (error) throw error;
            return data as Post;
        } catch (err) {
            console.error('API Error [devotionals-get latest]:', err);
            throw err;
        }
    },

    getList: async (): Promise<Post[]> => {
        try {
            const { data, error } = await supabase.functions.invoke('devotionals-get'); // No body = list default
            if (error) throw error;
            return (data as Post[]) || [];
        } catch (err) {
            console.error('API Error [devotionals-get list]:', err);
            throw err;
        }
    }
};

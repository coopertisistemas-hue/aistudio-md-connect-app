import { supabase } from '@/lib/supabase';
import type { Post } from '@/types/content';

const API_TIMEOUT_MS = 12000;

interface ApiError {
    message: string;
    code?: string;
}

interface ApiResponse<T> {
    data: T | null;
    error: ApiError | null;
}

async function invokeWithTimeout<T>(
    functionName: string, 
    body?: Record<string, unknown>
): Promise<ApiResponse<T>> {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), API_TIMEOUT_MS);

    try {
        const invokeOptions = body ? { body } : {};
        
        const response = await supabase.functions.invoke(functionName, {
            ...invokeOptions,
            signal: controller.signal
        } as Parameters<typeof supabase.functions.invoke>[1]);

        clearTimeout(timeoutId);

        if (response.error) {
            return { data: null, error: { message: response.error.message } };
        }

        const result = response.data as { ok: boolean; data?: T; error?: { code: string; message: string } };
        
        if (result.ok === false) {
            return { 
                data: null, 
                error: { 
                    message: result.error?.message || 'Request failed',
                    code: result.error?.code 
                } 
            };
        }

        return { data: result.data as T, error: null };
    } catch (err: unknown) {
        clearTimeout(timeoutId);
        const error = err as { name?: string; message?: string };
        
        if (error.name === 'AbortError' || error.message?.includes('aborted')) {
            return { data: null, error: { message: 'Request timed out', code: 'TIMEOUT' } };
        }
        
        return { data: null, error: { message: error.message || 'Network error' } };
    }
}

export const devotionalsApi = {
    getById: async (id: string): Promise<Post | null> => {
        const response = await invokeWithTimeout<Post>('devotionals-get', { id });
        if (response.error) {
            console.error('API Error [devotionals-get]:', response.error);
            throw new Error(response.error.message);
        }
        return response.data;
    },

    getLatest: async (): Promise<Post | null> => {
        const response = await invokeWithTimeout<Post>('devotionals-get', { latest: 'true' });
        if (response.error) {
            console.error('API Error [devotionals-get latest]:', response.error);
            throw new Error(response.error.message);
        }
        return response.data;
    },

    getList: async (): Promise<Post[]> => {
        const response = await invokeWithTimeout<Post[]>('devotionals-get');
        if (response.error) {
            console.error('API Error [devotionals-get list]:', response.error);
            throw new Error(response.error.message);
        }
        return response.data || [];
    }
};

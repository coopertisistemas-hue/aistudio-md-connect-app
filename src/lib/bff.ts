import { supabase } from '@/lib/supabase';

type BffError = {
    message?: string;
    code?: string;
};

type BffEnvelope<T> = {
    ok: boolean;
    data: T | null;
    error: BffError | null;
    meta?: Record<string, unknown> | null;
};

export async function invokeBff<T>(functionName: string, body?: unknown): Promise<T> {
    const { data, error } = await supabase.functions.invoke<BffEnvelope<T>>(functionName, {
        body: body ?? {},
    });

    if (error) {
        throw new Error(error.message || 'Erro ao chamar o serviço.');
    }

    if (!data || data.ok !== true) {
        const message = data?.error?.message || 'Erro ao processar a solicitação.';
        throw new Error(message);
    }

    return data.data as T;
}

export async function getChurchContext(): Promise<{ church_id: string | null }> {
    return invokeBff<{ church_id: string | null }>('church-session-context');
}

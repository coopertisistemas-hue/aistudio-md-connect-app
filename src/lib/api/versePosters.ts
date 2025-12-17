import { supabase } from '@/lib/supabase';

export interface GenerateVerseImageParams {
    verse_text: string;
    reference: string;
    style: 'humanized_nature' | 'epic_landscape' | 'warm_cozy' | 'minimal_premium' | 'cinematic_light' | 'soft_illustration' | 'watercolor' | 'nature_symbolic';
    language?: string;
}

export interface GenerateVerseImageResponse {
    image_url: string;
    cached: boolean;
    provider?: string;
}

export const versePostersApi = {
    generateImage: async (params: GenerateVerseImageParams): Promise<GenerateVerseImageResponse> => {
        const { data, error } = await supabase.functions.invoke('verse-image-generate', {
            body: params
        });

        // Supabase Edge Functions generic error (network, 500, etc)
        if (error) {
            console.error('Edge Function Invocation Error:', error);
            throw new Error('Erro de conexão com o servidor.');
        }

        // Functional contract check
        if (!data || !data.ok) {
            console.error('API Error:', data?.error);
            throw new Error(data?.error || 'Falha na geração da imagem.');
        }

        return {
            image_url: data.image_url,
            cached: data.cached,
            provider: data.provider
        };
    }
};

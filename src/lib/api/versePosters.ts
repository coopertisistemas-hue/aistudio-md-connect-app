import { supabase } from '@/lib/supabase';

export interface GenerateVerseImageParams {
    verse_text: string;
    reference: string;
    style: 'minimal_premium' | 'cinematic_light' | 'soft_illustration' | 'watercolor' | 'nature_symbolic';
    language?: string;
}

export interface GenerateVerseImageResponse {
    image_url: string;
    cached: boolean;
}

export const versePostersApi = {
    generateImage: async (params: GenerateVerseImageParams): Promise<GenerateVerseImageResponse> => {
        const { data, error } = await supabase.functions.invoke('verse-image-generate', {
            body: params
        });

        if (error) {
            console.error('Error generating verse image:', error);
            throw new Error('Falha ao gerar imagem. Tente novamente.');
        }

        return data; // { image_url, cached }
    }
};

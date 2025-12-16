import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { contentService } from '@/services/content';
import type { Post } from '@/types/content';
import { ArrowLeft, Loader2, Share2, Calendar } from 'lucide-react';

export default function DevotionalDetail() {
    const { id } = useParams();
    const navigate = useNavigate();
    const [item, setItem] = useState<Post | null>(null);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        if (id) loadData(id);
    }, [id]);

    const loadData = async (postId: string) => {
        try {
            const data = await contentService.getDevotionalById(postId);
            setItem(data);
        } catch (error) {
            console.error(error);
        } finally {
            setIsLoading(false);
        }
    };

    if (isLoading) return <div className="flex justify-center py-10"><Loader2 className="animate-spin" /></div>;
    if (!item) return <div className="p-4 text-center">Devocional não encontrado.</div>;

    return (
        <div className="min-h-screen bg-white flex flex-col pb-safe">
            {/* Header */}
            <div className="bg-white border-b sticky top-0 z-10 px-4 py-3 flex items-center justify-between">
                <button onClick={() => navigate(-1)} className="p-1 -ml-1">
                    <ArrowLeft className="h-6 w-6 text-slate-600" />
                </button>
                <div className="flex gap-2">
                    <button className="p-2 text-primary">
                        <Share2 className="h-5 w-5" />
                    </button>
                </div>
            </div>

            {/* Cover Image */}
            {item.cover_image_url && (
                <div className="w-full h-48 sm:h-64 bg-slate-100">
                    <img src={item.cover_image_url} alt={item.title} className="w-full h-full object-cover" />
                </div>
            )}

            {/* Content */}
            <div className="p-5 space-y-4 max-w-2xl mx-auto w-full">
                <h1 className="text-2xl font-bold text-slate-900 leading-tight mb-2">{item.title}</h1>
                {item.subtitle && <h2 className="text-lg text-slate-600 font-medium mb-4">{item.subtitle}</h2>}

                <div className="flex items-center justify-between text-sm text-slate-500 mb-6 pb-6 border-b border-slate-100">
                    <span className="flex items-center gap-2">
                        <Calendar className="w-4 h-4" />
                        {new Date(item.published_at).toLocaleDateString('pt-BR', { day: 'numeric', month: 'long' })}
                    </span>
                    <div className="flex gap-2">
                        <button className="h-8 w-8 flex items-center justify-center rounded-full bg-slate-100 text-slate-600">
                            <Share2 className="w-4 h-4" />
                        </button>
                    </div>
                </div>

                <div className="prose prose-slate max-w-none text-slate-800 leading-relaxed pb-20">
                    {item.content_body?.split('\n').map((paragraph, idx) => (
                        <p key={idx} className="mb-4">{paragraph}</p>
                    ))}
                </div>

                {/* Footer Action */}
                <div className="fixed bottom-0 left-0 w-full p-4 bg-white/90 backdrop-blur border-t border-slate-100 md:relative md:bg-transparent md:border-0 md:p-0">
                    <button
                        onClick={() => contentService.markContentAsRead(item.id, 'devotional').then(() => alert('Marcado como lido!'))}
                        className="w-full bg-primary text-white font-bold py-3.5 rounded-xl shadow-lg shadow-primary/20 hover:bg-primary/90 transition-colors flex items-center justify-center gap-2"
                    >
                        Concluir Leitura
                    </button>
                </div>
            </div>
        </div>
    );
}

import { useState, useEffect } from 'react'; // Missing types, assumes generic
import { useParams, useNavigate } from 'react-router-dom';
import { contentService } from '@/services/content'; // Need getMessageById
import type { ContentMessage } from '@/types/content';
import { ArrowLeft, Loader2, Youtube } from 'lucide-react';
import { BackLink } from '@/components/ui/BackLink';

export default function MessageDetail() {
    const { id } = useParams();
    const navigate = useNavigate();
    const [msg, setMsg] = useState<ContentMessage | null>(null);
    const [isLoading, setIsLoading] = useState(false); // Can fetch by ID if service supports

    useEffect(() => {
        if (id) loadData(id);
    }, [id]);

    const loadData = async (msgId: string) => {
        setIsLoading(true);
        try {
            const data = await contentService.getMessageById(msgId);
            setMsg(data);
        } catch (error) {
            console.error(error);
        } finally {
            setIsLoading(false);
        }
    };

    if (isLoading) return <div className="flex justify-center items-center min-h-screen bg-slate-900"><Loader2 className="animate-spin text-white" /></div>;


    return (
        <div className="min-h-screen bg-slate-900 text-white flex flex-col">
            <div className="bg-transparent absolute top-0 w-full z-10 px-4 py-3 flex items-center justify-between pointer-events-none">
                {/* Back button with pointer-events-auto */}
                <BackLink className="pointer-events-auto bg-black/20 rounded-full backdrop-blur-sm text-white hover:bg-black/40 hover:text-white/90" />
            </div>

            <div className="flex-1 flex flex-col">
                <div className="aspect-video bg-black flex items-center justify-center mt-14 sm:mt-0">
                    {/* Video Player Placeholder */}
                    <div className="text-center text-slate-400">
                        <Youtube className="h-16 w-16 mx-auto mb-2 opacity-50" />
                        <p>Player de Vídeo</p>
                        <p className="text-xs">(URL: {msg?.video_url || 'N/A'})</p>
                    </div>
                </div>

                <div className="p-5 flex-1 bg-white text-slate-900 rounded-t-2xl -mt-4 z-20">
                    <div className="w-12 h-1.5 bg-slate-200 rounded-full mx-auto mb-6" />

                    <h1 className="text-2xl font-bold leading-tight mb-2">{msg?.title || 'Carregando...'}</h1>
                    <div className="flex gap-2 text-sm text-slate-500 mb-6">
                        <span>{msg?.published_at ? new Date(msg.published_at).toLocaleDateString('pt-BR') : ''}</span>
                        {msg?.duration_seconds && (
                            <>
                                <span>•</span>
                                <span>{Math.floor(msg.duration_seconds / 60)} min</span>
                            </>
                        )}
                    </div>

                    <p className="text-slate-600 leading-relaxed">
                        {msg?.description || 'Sem descrição.'}
                    </p>
                </div>
            </div>
        </div>
    );
}

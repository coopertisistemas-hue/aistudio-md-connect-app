import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { contentService } from '@/services/content';
import type { ContentMessage } from '@/types/content';
import { Loader2, Youtube } from 'lucide-react';
import { InternalPageLayout } from '@/components/layout/InternalPageLayout';

export default function MessageDetail() {
    const { id } = useParams();
    const [msg, setMsg] = useState<ContentMessage | null>(null);
    const [isLoading, setIsLoading] = useState(false);

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

    if (isLoading) {
        return (
            <InternalPageLayout
                title="Mensagem"
                subtitle="Ouça, medite e compartilhe."
                icon={Youtube}
                iconClassName="text-red-600"
                backPath="/conteudos/series"
            >
                <div className="flex justify-center items-center min-h-[50vh]">
                    <Loader2 className="animate-spin text-slate-400" />
                </div>
            </InternalPageLayout>
        );
    }

    return (
        <InternalPageLayout
            title={msg?.title || "Mensagem"}
            subtitle="Ouça, medite e compartilhe."
            icon={Youtube}
            iconClassName="text-red-600"
            backPath="/conteudos/series"
            showFooter={false}
        >
            <div className="flex flex-col">
                <div className="aspect-video bg-black flex items-center justify-center">
                    {/* Video Player Placeholder */}
                    <div className="text-center text-slate-400">
                        <Youtube className="h-16 w-16 mx-auto mb-2 opacity-50" />
                        <p>Player de Vídeo</p>
                        <p className="text-xs">(URL: {msg?.video_url || 'N/A'})</p>
                    </div>
                </div>

                <div className="p-5 bg-white">
                    <div className="flex gap-2 text-sm text-slate-500 mb-4">
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
        </InternalPageLayout>
    );
}

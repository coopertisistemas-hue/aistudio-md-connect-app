import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { contentService } from '@/services/content';
import type { ContentSeries, ContentMessage } from '@/types/content';
import { ArrowLeft, Loader2, PlayCircle, Clock } from 'lucide-react';
import { BackLink } from '@/components/ui/BackLink';

export default function SeriesDetail() {
    const { id } = useParams();
    const navigate = useNavigate();
    const [series, setSeries] = useState<ContentSeries | null>(null); // Ideally fetch single series
    const [messages, setMessages] = useState<ContentMessage[]>([]);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        if (id) loadData(id);
    }, [id]);

    const loadData = async (seriesId: string) => {
        try {
            // Optimization: Add getSeriesById to service later. For now assume passed via state or just fetch messages + header info if possible.
            // Actually let's fetch list and find? No, inefficient.
            // Let's just fetch messages for now and mock header, or better, add getSeriesById to service.
            // I'll assume getMessagesBySeries is enough for MVP, but we need Title.
            // Let's allow getSeriesById in service. I'll add it now.
            const msgs = await contentService.getMessagesBySeries(seriesId);
            setMessages(msgs);

            // Temporary: Fetch all series to find current one (Not ideal but fast impl)
            const allSeries = await contentService.getSeries();
            const current = allSeries.find(s => s.id === seriesId);
            if (current) setSeries(current);

        } catch (error) {
            console.error(error);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-slate-50 flex flex-col">
            <div className="bg-white border-b sticky top-0 z-10 px-4 py-3 flex items-center gap-3">
                <BackLink className="-ml-2" />
                <h1 className="font-bold text-lg truncate">{series?.title || 'Detalhes da Série'}</h1>
            </div>

            {series && (
                <div className="bg-white border-b p-4">
                    <div className="aspect-video rounded-lg overflow-hidden bg-slate-100 mb-4">
                        {series.cover_image_url ? (
                            <img src={series.cover_image_url} alt={series.title} className="w-full h-full object-cover" />
                        ) : (
                            <div className="w-full h-full flex items-center justify-center text-slate-300">
                                <PlayCircle className="h-16 w-16" />
                            </div>
                        )}
                    </div>
                    <h2 className="text-2xl font-bold text-slate-900">{series.title}</h2>
                    {series.description && <p className="text-slate-600 mt-2">{series.description}</p>}
                </div>
            )}

            <div className="p-4 space-y-3">
                <h3 className="font-semibold text-slate-900 text-sm uppercase tracking-wide text-muted-foreground">Episódios</h3>
                {isLoading ? (
                    <div className="flex justify-center py-4"><Loader2 className="animate-spin" /></div>
                ) : messages.length === 0 ? (
                    <p className="text-muted-foreground text-sm">Nenhuma mensagem disponível.</p>
                ) : (
                    messages.map((msg, index) => (
                        <div
                            key={msg.id}
                            onClick={() => navigate(`/conteudos/mensagens/${msg.id}`)} // New Route needed
                            className="bg-white p-3 rounded-lg border border-slate-200 flex gap-3 active:scale-98 transition-transform cursor-pointer"
                        >
                            <div className="h-20 w-32 bg-slate-100 rounded flex-shrink-0 overflow-hidden relative">
                                {msg.cover_image_url ? (
                                    <img src={msg.cover_image_url} className="w-full h-full object-cover" />
                                ) : (
                                    <div className="w-full h-full flex items-center justify-center bg-slate-200"><PlayCircle className="h-8 w-8 text-slate-400" /></div>
                                )}
                                <div className="absolute inset-0 bg-black/10 flex items-center justify-center">
                                    <PlayCircle className="h-8 w-8 text-white drop-shadow-md" />
                                </div>
                            </div>
                            <div className="flex flex-col justify-center">
                                <span className="text-xs text-primary font-medium mb-0.5">Episódio {index + 1}</span>
                                <h4 className="font-bold text-slate-900 leading-tight line-clamp-2">{msg.title}</h4>
                                {msg.duration_seconds && (
                                    <span className="text-xs text-slate-500 flex items-center gap-1 mt-1">
                                        <Clock className="h-3 w-3" /> {Math.floor(msg.duration_seconds / 60)} min
                                    </span>
                                )}
                            </div>
                        </div>
                    ))
                )}
            </div>
        </div>
    );
}

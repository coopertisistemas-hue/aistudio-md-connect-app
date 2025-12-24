import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { contentService } from '@/services/content';
import type { ContentSeries } from '@/types/content';
import { PlayCircle } from 'lucide-react';
import { InternalPageLayout } from '@/components/layout/InternalPageLayout';

export default function SeriesList() {
    const navigate = useNavigate();
    const [series, setSeries] = useState<ContentSeries[]>([]);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        loadData();
    }, []);

    const loadData = async () => {
        try {
            const data = await contentService.getSeries();
            setSeries(data);
        } catch (error) {
            console.error(error);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <InternalPageLayout
            title="Séries"
            subtitle="Mensagens organizadas por tema."
            icon={PlayCircle}
            iconClassName="text-indigo-600"
            backPath="/home"
        >
            <div className="p-4 grid gap-4">
                {isLoading ? (
                    <div className="grid gap-4">
                        {[1, 2, 3, 4].map(i => (
                            <div key={i} className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden animate-pulse">
                                <div className="aspect-video bg-slate-100"></div>
                                <div className="p-3">
                                    <div className="h-4 w-3/4 bg-slate-100 rounded mb-2"></div>
                                    <div className="h-3 w-1/2 bg-slate-100 rounded"></div>
                                </div>
                            </div>
                        ))}
                    </div>
                ) : series.length === 0 ? (
                    <div className="col-span-full text-center py-10 text-muted-foreground">
                        Nenhuma série encontrada.
                    </div>
                ) : (
                    series.map(item => (
                        <div
                            key={item.id}
                            onClick={() => navigate(`/conteudos/series/${item.id}`)}
                            className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden active:scale-98 transition-transform cursor-pointer group"
                        >
                            <div className="aspect-video bg-slate-200 relative">
                                {item.cover_image_url ? (
                                    <img src={item.cover_image_url} alt={item.title} className="w-full h-full object-cover" loading="lazy" />
                                ) : (
                                    <div className="w-full h-full flex items-center justify-center bg-slate-100 text-slate-400">
                                        <PlayCircle className="h-12 w-12" />
                                    </div>
                                )}
                            </div>
                            <div className="p-3">
                                <h3 className="font-bold text-slate-900 line-clamp-1">{item.title}</h3>
                                {item.description && (
                                    <p className="text-sm text-slate-500 line-clamp-2 mt-1">{item.description}</p>
                                )}
                            </div>
                        </div>
                    ))
                )}
            </div>
        </InternalPageLayout>
    );
}

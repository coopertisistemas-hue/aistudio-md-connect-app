import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { contentService } from '@/services/content';
import type { Post } from '@/types/content';
import { Heart } from 'lucide-react';
import { PageIntro } from '@/components/layout/PageIntro'; // Kept if needed, but likely replaced by InternalPageLayout usage. Ideally clean up.
import { InternalPageLayout } from '@/components/layout/InternalPageLayout';

export default function DevotionalsList() {
    const navigate = useNavigate();
    const [items, setItems] = useState<Post[]>([]);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        loadData();
    }, []);

    const loadData = async () => {
        try {
            const data = await contentService.getDevotionals(20);
            setItems(data);
        } catch (error) {
            console.error(error);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <InternalPageLayout
            title="Devocionais"
            subtitle="Reflexões diárias para o seu coração."
            icon={Heart}
            iconClassName="text-rose-500 fill-rose-500/20"
        >
            <div className="p-4 space-y-4">
                {isLoading ? (
                    <div className="grid gap-4">
                        {[1, 2, 3, 4, 5].map(i => (
                            <div key={i} className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm animate-pulse">
                                <div className="h-3 w-20 bg-slate-100 rounded mb-2"></div>
                                <div className="h-5 w-3/4 bg-slate-100 rounded mb-2"></div>
                                <div className="h-4 w-full bg-slate-100 rounded"></div>
                            </div>
                        ))}
                    </div>
                ) : items.length === 0 ? (
                    <div className="text-center py-10 text-muted-foreground">
                        Nenhum devocional encontrado.
                    </div>
                ) : (
                    items.map(item => (
                        <div
                            key={item.id}
                            onClick={() => navigate(`/conteudos/devocionais/${item.id}`)}
                            className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm active:scale-98 transition-transform cursor-pointer"
                        >
                            <span className="text-xs font-medium text-primary mb-1 block">
                                {new Date(item.published_at).toLocaleDateString('pt-BR')}
                            </span>
                            <h3 className="font-bold text-slate-900 text-lg leading-tight mb-2">{item.title}</h3>
                            {item.subtitle && (
                                <p className="text-slate-600 text-sm line-clamp-2">{item.subtitle}</p>
                            )}
                        </div>
                    ))
                )}
            </div>
        </InternalPageLayout>
    );
}

import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { contentService } from '@/services/content';
import { devotionalsApi } from '@/lib/api/devotionals';
import type { Post } from '@/types/content';
import { Calendar, BookOpen, Loader2 } from 'lucide-react';
import { FLAGS } from '@/lib/flags';
import { InternalPageLayout } from '@/components/layout/InternalPageLayout';
import { DevotionalContentRenderer } from '@/components/Devotional/DevotionalContentRenderer';

// Fallback Data for V1
const FALLBACK_DEVOTIONAL: Post = {
    id: 'fallback-v1',
    title: 'A Paz que Excede Todo Entendimento',
    subtitle: 'Filipenses 4:7',
    content_body: `E a paz de Deus, que excede todo o entendimento, guardará os vossos corações e os vossos sentimentos em Cristo Jesus.\n\nMuitas vezes, buscamos paz nas circunstâncias externas: quando tudo vai bem, quando temos dinheiro, quando há saúde. Mas a paz que Jesus oferece é diferente.\n\nEla não depende do que acontece fora de nós, mas de Quem habita dentro de nós. Em meio as tempestades da vida, podemos ter a certeza de que Ele está no barco.\n\nHoje, entregue suas ansiedades ao Senhor. Confie que Ele tem o controle de todas as coisas e experimente essa paz que o mundo não pode dar, nem tirar.\n\nOração: Senhor, acalma meu coração e enche-me da Tua paz. Amém.`,
    cover_image_url: 'https://images.unsplash.com/photo-1504052434569-70ad5836ab65?q=80&w=1000&auto=format&fit=crop',
    published_at: new Date().toISOString(),
    type: 'devotional',
    church_id: 'global_fallback',
    status: 'published',
    author: { name: 'Equipe Pastoral', avatar_url: null }
};

export default function DevotionalDetail() {
    const { id } = useParams();
    const [item, setItem] = useState<Post | null>(null);
    const [isLoading, setIsLoading] = useState(true);

    if (!FLAGS.FEATURE_DEVOTIONAL_V1) {
        return <div className="p-10 text-center text-slate-500">Feature desabilitada.</div>;
    }

    useEffect(() => {
        const targetId = id === 'today' ? 'latest' : id;
        if (targetId) loadData(targetId);
    }, [id]);

    const loadData = async (postId: string) => {
        setIsLoading(true);
        try {
            let data: Post | null = null;
            if (FLAGS.FEATURE_DEVOTIONAL_API) {
                if (postId === 'latest') {
                    data = await devotionalsApi.getLatest().catch(() => null);
                } else {
                    data = await devotionalsApi.getById(postId).catch(() => null);
                }
            } else {
                // Legacy path
                if (postId === 'latest') {
                    await new Promise(r => setTimeout(r, 600));
                    data = null;
                } else {
                    data = await contentService.getDevotionalById(postId);
                }
            }

            if (data) {
                setItem(data);
            } else {
                setItem(FALLBACK_DEVOTIONAL);
            }
        } catch (error) {
            console.error("Devotional Load Failed due to error:", error);
            setItem(FALLBACK_DEVOTIONAL);
        } finally {
            setIsLoading(false);
        }
    };


    return (
        <InternalPageLayout
            title={item?.title || "Devocional"}
            subtitle="Leia, medite e compartilhe."
            icon={BookOpen}
            iconClassName="text-indigo-600"
        >
            {isLoading ? (
                <div className="flex items-center justify-center py-20">
                    <Loader2 className="w-8 h-8 text-indigo-600 animate-spin" />
                </div>
            ) : !item ? (
                <div className="p-10 text-center text-slate-500">Conteúdo indisponível.</div>
            ) : (
                <div className="w-full animate-fade-in relative z-10 pb-4">
                    {/* Hero Section */}
                    <div className="w-full relative group rounded-b-3xl overflow-hidden shadow-sm mb-6">
                        {/* Hero Image or Premium Fallback */}
                        <img
                            src={item.cover_image_url || 'https://images.unsplash.com/photo-1504052434569-70ad5836ab65?q=80&w=1000&auto=format&fit=crop'}
                            alt={item.title}
                            fetchPriority="high"
                            loading="eager"
                            className={`w-full h-full object-cover transition-transform duration-700 group-hover:scale-105 ${!item.cover_image_url ? 'opacity-80 sepia-[0.3]' : ''}`}
                        />

                        {/* Optimized Gradient Overlay for Legibility */}
                        <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-900/60 to-transparent" />
                        <div className="absolute bottom-0 left-0 w-full h-1/2 bg-gradient-to-t from-black/80 to-transparent mix-blend-multiply" />

                        {/* Optional: Dev/Admin AI Generator Button */}
                        {import.meta.env.DEV && !item.cover_image_url && (
                            <div className="absolute top-4 right-4 z-30">
                                <button
                                    onClick={async (e) => {
                                        e.preventDefault();
                                        if (confirm('Gerar capa via IA?')) {
                                            try {
                                                const res = await fetch(`${import.meta.env.VITE_SUPABASE_URL}/functions/v1/verse-image-generate`, {
                                                    method: 'POST',
                                                    headers: {
                                                        'Content-Type': 'application/json',
                                                        'Authorization': `Bearer ${import.meta.env.VITE_SUPABASE_ANON_KEY}`
                                                    },
                                                    body: JSON.stringify({
                                                        verse_text: item.title,
                                                        reference: item.subtitle || 'Devocional',
                                                        style: 'cinematic_light'
                                                    })
                                                });
                                                const data = await res.json();
                                                if (data.ok && data.image_url) {
                                                    setItem(prev => prev ? ({ ...prev, cover_image_url: data.image_url }) : null);
                                                    alert('Capa gerada! (Atualize o registro no banco para persistir)');
                                                }
                                            } catch (err) {
                                                alert('Erro ao gerar');
                                                console.error(err);
                                            }
                                        }
                                    }}
                                    className="p-2 bg-black/50 hover:bg-indigo-600 text-white rounded-full backdrop-blur-md transition-all border border-white/20"
                                    title="Gerar Capa com IA"
                                >
                                    <div className="w-5 h-5 flex items-center justify-center">
                                        ✨
                                    </div>
                                </button>
                            </div>
                        )}
                        <div className="absolute bottom-0 left-0 w-full p-6 md:p-8 text-white z-10">
                            <div className="inline-flex items-center gap-2 px-3 py-1 bg-white/20 backdrop-blur-md border border-white/10 rounded-full text-xs font-medium mb-4 text-white/90 shadow-sm">
                                <Calendar className="w-3 h-3" />
                                {new Date(item.published_at).toLocaleDateString('pt-BR', { day: 'numeric', month: 'long' })}
                            </div>
                            <h1 className="text-3xl md:text-4xl font-serif font-bold leading-tight mb-2 tracking-tight text-shadow-sm text-white">
                                {item.title}
                            </h1>
                            {item.subtitle && (
                                <p className="text-indigo-100 text-sm md:text-base opacity-90 font-medium tracking-wide text-white/90">
                                    {item.subtitle}
                                </p>
                            )}
                        </div>
                    </div>

                    {/* Main Content Container with Renderer */}
                    <div className="px-4 md:px-8 max-w-2xl mx-auto -mt-6 relative z-20">
                        <DevotionalContentRenderer
                            id={item.id}
                            title={item.title}
                            subtitle={item.subtitle}
                            content={item.content_body || ''}
                            author={item.author}
                            coverUrl={item.cover_image_url}
                        />
                    </div>
                </div>
            )}
        </InternalPageLayout>
    );
}

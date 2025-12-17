import { useState, useEffect, useMemo } from 'react';
import { useParams } from 'react-router-dom';
import { contentService } from '@/services/content';
import { devotionalsApi } from '@/lib/api/devotionals';
import type { Post } from '@/types/content';
import { Calendar, BookOpen, Quote, Loader2 } from 'lucide-react';
import { FLAGS } from '@/lib/flags';
import { BackLink } from '@/components/ui/BackLink';


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
    // const navigate = useNavigate(); // Removed unused
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
                    if (!data) {
                        const list = await devotionalsApi.getList().catch(() => []);
                        if (list.length > 0) data = list[0];
                    }
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
                if (FLAGS.FEATURE_DEVOTIONAL_API) {
                    console.info("API returned no data, using fallback.");
                }
                setItem(FALLBACK_DEVOTIONAL);
            }
        } catch (error) {
            console.error("Devotional Load Failed due to error:", error);
            setItem(FALLBACK_DEVOTIONAL);
        } finally {
            setIsLoading(false);
        }
    };





    // --- Content Parsing Logic ---
    const parsedContent = useMemo(() => {
        if (!item?.content_body) return null;

        const paragraphs = item.content_body.split('\n').filter(p => p.trim().length > 0);

        let verseKey = '';
        let prayer = '';
        let reflectionParagraphs: string[] = [];
        let wordCount = 0;

        // 1. Extract Key Verse (First Paragraph)
        if (paragraphs.length > 0) {
            verseKey = paragraphs[0];
        }

        // 2. Scan for Prayer and Body
        const remaining = paragraphs.slice(1);
        let prayerFound = false;

        remaining.forEach(p => {
            // Calculate reading time
            wordCount += p.split(/\s+/).length;

            if (p.toLowerCase().startsWith('oração:') || p.toLowerCase().startsWith('oracao:')) {
                prayer = p.replace(/^oração:\s*/i, '').replace(/^oracao:\s*/i, '');
                prayerFound = true;
            } else {
                if (!prayerFound) reflectionParagraphs.push(p);
                // If prayer found, any subsequent text could technically be part of prayer or footer, 
                // but for simplicity we assume prayer block is last significant block or explicit.
                else prayer += `\n${p}`;
            }
        });

        // 3. Fallback: If no explicit prayer, check strict last paragraph if it looks like one?
        // Current logic: Rely on prefix. If no prefix, empty prayer section (or we could use last paragraph if short).
        // Let's stick to prefix for safety to avoid putting reflection in prayer block.

        // Reading time: Average 200wpm. 
        // Add verse word count too
        wordCount += verseKey.split(/\s+/).length;
        const readingTime = Math.max(1, Math.ceil(wordCount / 200));

        return { verseKey, reflectionParagraphs, prayer, readingTime };
    }, [item]);


    if (isLoading) {
        return (
            <div className="min-h-screen bg-transparent flex items-center justify-center">
                <Loader2 className="w-8 h-8 text-indigo-600 animate-spin" />
            </div>
        );
    }

    if (!item || !parsedContent) return <div className="p-10 text-center text-slate-500">Conteúdo indisponível.</div>;

    return (
        <div className="w-full animate-fade-in relative z-10 pb-4">
            {/* Header Removed as per UI request */}

            {/* Hero Section (Refactored to match Home transparency) */}
            <div className="w-full relative group rounded-b-3xl overflow-hidden shadow-sm mb-6">
                <div className="w-full h-72 md:h-96 relative overflow-hidden">
                    {item.cover_image_url ? (
                        <img
                            src={item.cover_image_url}
                            alt={item.title}
                            className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                        />
                    ) : (
                        <div className="w-full h-full flex items-center justify-center bg-indigo-50 text-indigo-300">
                            <BookOpen className="w-16 h-16 opacity-50" />
                        </div>
                    )}
                    {/* Standard Home-like scrim for text legibility if needed, but keeping it minimal as requested */}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                </div>

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

            {/* Main Content Container */}
            <div className="px-4 md:px-8 max-w-2xl mx-auto -mt-6 relative z-20 space-y-6">

                {/* 1. Key Verse Block */}
                {parsedContent.verseKey && (
                    <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-100 relative overflow-hidden">
                        <Quote className="absolute top-4 right-4 text-indigo-500/10 w-12 h-12 -rotate-12" />
                        <p className="font-serif text-lg md:text-xl text-foreground italic leading-relaxed relative z-10">
                            “{parsedContent.verseKey.replace(/^['"]|['"]$/g, '')}”
                        </p>
                        {item.subtitle && (
                            <p className="text-xs font-bold text-brand-primary mt-3 uppercase tracking-wider text-right">
                                — {item.subtitle}
                            </p>
                        )}
                    </div>
                )}

                <div className="bg-white rounded-3xl p-6 md:p-8 shadow-sm border border-slate-100">

                    {/* 2. Reflection Label */}
                    <div className="flex items-center gap-3 mb-6">
                        <div className="h-px bg-slate-200/50 flex-1" />
                        <span className="text-xs font-bold text-foreground uppercase tracking-widest">Reflexão Guiada</span>
                        <div className="h-px bg-slate-200/50 flex-1" />
                    </div>

                    {/* 3. Body Text */}
                    <div className="prose prose-slate prose-lg max-w-none text-muted-foreground leading-relaxed">
                        {parsedContent.reflectionParagraphs.map((p, idx) => (
                            <p key={idx} className="mb-4 text-[1.05rem] text-muted-foreground font-medium">{p}</p>
                        ))}
                    </div>

                    {/* 4. Prayer Block */}
                    {parsedContent.prayer && (
                        <div className="mt-8 bg-indigo-50/50 rounded-2xl p-6 border border-indigo-100/50">
                            <h3 className="flex items-center gap-2 text-sm font-bold text-brand-primary uppercase tracking-wider mb-3">
                                <div className="w-1.5 h-1.5 rounded-full bg-indigo-500" />
                                Oração
                            </h3>
                            <p className="text-indigo-900 font-medium leading-relaxed italic">
                                "{parsedContent.prayer.trim()}"
                            </p>
                        </div>
                    )}

                    {/* 5. Signature Footer */}
                    <div className="mt-8 pt-6 border-t border-slate-200/50">
                        <div className="flex flex-col items-center text-center">
                            <p className="text-xs font-bold text-muted-foreground uppercase tracking-widest mb-1">Escrito e supervisionado por</p>
                            <div className="flex items-center gap-2 mt-2">
                                <p className="text-foreground font-serif font-bold">
                                    Equipe Projeto MD – Momento Devocional
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

        </div>
    );
}

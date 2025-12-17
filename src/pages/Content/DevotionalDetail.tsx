import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { contentService } from '@/services/content';
import { devotionalsApi } from '@/lib/api/devotionals'; // [NEW]
import type { Post } from '@/types/content';
import { ArrowLeft, Loader2, Share2, Calendar, BookOpen } from 'lucide-react';
import { FLAGS } from '@/lib/flags';
import { analytics } from '@/lib/analytics';

// Fallback Data for V1 (If API fails or offline)
const FALLBACK_DEVOTIONAL: Post = {
    id: 'fallback-v1',
    title: 'A Paz que Excede Todo Entendimento',
    subtitle: 'Filipenses 4:7',
    content_body: `E a paz de Deus, que excede todo o entendimento, guardará os vossos corações e os vossos sentimentos em Cristo Jesus.\n\nMuitas vezes, buscamos paz nas circunstâncias externas: quando tudo vai bem, quando temos dinheiro, quando há saúde. Mas a paz que Jesus oferece é diferente.\n\nEla não depende do que acontece fora de nós, mas de Quem habita dentro de nós. Em meio as tempestades da vida, podemos ter a certeza de que Ele está no barco.\n\nHoje, entregue suas ansiedades ao Senhor. Confie que Ele tem o controle de todas as coisas e experimente essa paz que o mundo não pode dar, nem tirar.\n\nOração: Senhor, acalma meu coração e enche-me da Tua paz. Amém.`,
    cover_image_url: 'https://images.unsplash.com/photo-1504052434569-70ad5836ab65?q=80&w=1000&auto=format&fit=crop', // Generic nature
    published_at: new Date().toISOString(),
    type: 'devotional',
    author: { name: 'Equipe Pastoral', avatar_url: null }
};

export default function DevotionalDetail() {
    const { id } = useParams();
    const navigate = useNavigate();
    const [item, setItem] = useState<Post | null>(null);
    const [isLoading, setIsLoading] = useState(true);

    if (!FLAGS.FEATURE_DEVOTIONAL_V1) {
        return <div className="p-10 text-center text-slate-500">Feature desabilitada.</div>;
    }

    useEffect(() => {
        // Support "today" as placeholder for home quick actions
        const targetId = id === 'today' ? 'latest' : id;
        if (targetId) loadData(targetId);
    }, [id]);

    const loadData = async (postId: string) => {
        try {
            // Emulate delay for "latest" to feel real if mock
            if (postId === 'latest') {
                // For MVP V1, we don't have a "getLatest" endpoint yet.
                // Using fallback immediately to avoid 400 Bad Request (UUID error).
                await new Promise(r => setTimeout(r, 600)); // Simulate fake network delay
                setItem(FALLBACK_DEVOTIONAL);
            } else {
                const data = await contentService.getDevotionalById(postId);
                setItem(data);
            }
        } catch (error) {
            console.error(error);
            // V1 Requirement: Fallback JSON
            setItem(FALLBACK_DEVOTIONAL);
        } finally {
            setIsLoading(false);
        }
    };

    const handleShare = async () => {
        analytics.track({
            name: 'feature_usage',
            feature: 'share_devotional',
            context: 'member',
            metadata: { title: item?.title }
        } as any);

        if (navigator.share && item) {
            try {
                await navigator.share({
                    title: `Devocional: ${item.title}`,
                    text: item.subtitle || 'Confira este devocional no MD Connect',
                    url: window.location.href
                });
            } catch (err) {
                console.log('Error sharing', err);
            }
        } else {
            // Fallback copy to clipboard
            navigator.clipboard.writeText(`${item?.title} - ${window.location.href}`);
            alert('Link copiado para a área de transferência!');
        }
    };


    if (isLoading) return <div className="flex justify-center py-20"><Loader2 className="animate-spin text-slate-400" /></div>;
    if (!item) return <div className="p-4 text-center">Devocional não encontrado.</div>;

    return (
        <div className="min-h-screen bg-white flex flex-col pb-safe animate-fade-in">
            {/* Header */}
            <div className="bg-white/80 backdrop-blur-md border-b border-slate-100 sticky top-0 z-10 px-4 py-3 flex items-center justify-between">
                <button onClick={() => navigate(-1)} className="p-2 -ml-2 rounded-full hover:bg-slate-100 transition-colors">
                    <ArrowLeft className="h-6 w-6 text-slate-700" />
                </button>
                <span className="text-sm font-bold text-slate-500 uppercase tracking-wider">Devocional</span>
                <button onClick={handleShare} className="p-2 -mr-2 rounded-full text-indigo-600 hover:bg-indigo-50 transition-colors">
                    <Share2 className="h-5 w-5" />
                </button>
            </div>

            {/* Cover Image */}
            <div className="relative w-full h-56 sm:h-72 bg-slate-100">
                {item.cover_image_url ? (
                    <img src={item.cover_image_url} alt={item.title} className="w-full h-full object-cover" />
                ) : (
                    <div className="w-full h-full flex items-center justify-center text-slate-300">
                        <BookOpen className="w-12 h-12" />
                    </div>
                )}
                <div className="absolute inset-0 bg-gradient-to-t from-white via-transparent to-transparent opacity-90" />
            </div>

            {/* Content */}
            <div className="px-6 -mt-12 relative z-0 space-y-6 max-w-2xl mx-auto w-full pb-24">
                <div className="bg-white/50 backdrop-blur-sm rounded-none">
                    {/* Clean typography layout */}
                    <div className="flex items-center gap-2 text-indigo-600 font-bold text-xs uppercase tracking-widest mb-2">
                        <Calendar className="w-3 h-3" />
                        {new Date(item.published_at).toLocaleDateString('pt-BR', { day: 'numeric', month: 'long', year: 'numeric' })}
                    </div>
                    <h1 className="text-3xl font-bold text-slate-900 leading-tight mb-2 tracking-tight">{item.title}</h1>
                    {item.subtitle && <h2 className="text-lg text-slate-500 font-medium leading-relaxed italic border-l-4 border-indigo-200 pl-4 my-4">{item.subtitle}</h2>}
                </div>

                <div className="prose prose-slate prose-lg max-w-none text-slate-700 leading-relaxed">
                    {item.content_body?.split('\n').map((paragraph, idx) => (
                        paragraph.trim() && <p key={idx} className="mb-4">{paragraph}</p>
                    ))}
                </div>
            </div>

            {/* Floating Action Bar */}
            <div className="fixed bottom-6 left-4 right-4 max-w-2xl mx-auto md:bottom-10">
                <button
                    onClick={() => {
                        contentService.markContentAsRead(item.id, 'devotional');
                        // Optional: Toast
                        navigate(-1);
                    }}
                    className="w-full bg-slate-900/95 backdrop-blur text-white font-bold py-4 rounded-2xl shadow-xl shadow-slate-900/20 active:scale-[0.98] transition-all flex items-center justify-center gap-2"
                >
                    <BookOpen className="w-5 h-5" />
                    Concluir Leitura
                </button>
            </div>
        </div>
    );
}

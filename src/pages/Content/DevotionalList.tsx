import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, BookOpen, Calendar, Loader2 } from 'lucide-react';
import { devotionalsApi } from '@/lib/api/devotionals';
import type { Post } from '@/types/content';
import { FLAGS } from '@/lib/flags';

export default function DevotionalList() {
    const navigate = useNavigate();
    const [items, setItems] = useState<Post[]>([]);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        loadData();
    }, []);

    const loadData = async () => {
        setIsLoading(true);
        try {
            if (FLAGS.FEATURE_DEVOTIONAL_API) {
                // Fetch using API wrapper (default limit 10)
                // Note: The wrapper currently wraps functions.invoke('devotionals-get')
                // We need to ensure wrapper has a getList method or similar. 
                // Currently devotionalsApi has getById and getLatest. We should add getList.
                // Assuming we will add getList to api/devotionals.ts next.
                // For now, let's assume it returns a list if we call without ID/Latest params.
                // Or we can invoke directly if wrapper update is pending.
                // Let's implement robustly.
                const data = await devotionalsApi.getList();
                if (data) setItems(data);
            } else {
                // Mock Empty State for V1 if API off
                // Or simulate one item for demo? 
                // Let's simulate empty to verify "Premium Empty State" as per plan
                await new Promise(r => setTimeout(r, 800));
                setItems([]);
            }
        } catch (error) {
            console.error("List load failed", error);
            setItems([]);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-transparent flex flex-col">
            {/* Header */}
            <div className="bg-white border-b border-slate-200 sticky top-0 z-10 px-4 py-3 flex items-center gap-3 shadow-sm">
                <button
                    onClick={() => navigate('/')}
                    className="p-2 -ml-2 text-slate-600 hover:bg-slate-50 rounded-full transition-colors"
                >
                    <ArrowLeft className="w-5 h-5" />
                </button>
                <h1 className="font-serif text-lg text-slate-900 font-medium">Devocionais</h1>
            </div>

            {/* Content */}
            <div className="flex-1 p-4 max-w-lg mx-auto w-full">
                {isLoading ? (
                    <div className="flex flex-col items-center justify-center py-20 text-slate-400 gap-3">
                        <Loader2 className="w-8 h-8 animate-spin text-indigo-600" />
                        <span className="text-sm">Carregando inspiração...</span>
                    </div>
                ) : items.length > 0 ? (
                    <div className="space-y-4">
                        {items.map((item) => (
                            <div
                                key={item.id}
                                onClick={() => navigate(`/devocionais/${item.id}`)}
                                className="bg-white rounded-xl p-4 shadow-sm border border-slate-100 active:scale-[0.98] transition-transform cursor-pointer"
                            >
                                <div className="flex items-start gap-4">
                                    <div className="w-12 h-12 rounded-lg bg-indigo-50 flex items-center justify-center flex-shrink-0 text-indigo-600">
                                        <BookOpen className="w-6 h-6" />
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        <h3 className="font-medium text-slate-900 line-clamp-1">{item.title}</h3>
                                        <p className="text-sm text-slate-500 mt-0.5 line-clamp-2">{item.subtitle || item.content_body}</p>
                                        <div className="flex items-center gap-2 mt-2 text-xs text-slate-400">
                                            <Calendar className="w-3 h-3" />
                                            {new Date(item.published_at).toLocaleDateString('pt-BR')}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                ) : (
                    // Premium Empty State
                    <div className="flex flex-col items-center justify-center py-16 text-center px-6">
                        <div className="w-20 h-20 bg-indigo-50 rounded-full flex items-center justify-center mb-6 ring-4 ring-indigo-50/50">
                            <BookOpen className="w-8 h-8 text-indigo-500" />
                        </div>
                        <h3 className="text-lg font-medium text-slate-900 mb-2">Novas mensagens em breve</h3>
                        <p className="text-slate-500 text-sm leading-relaxed max-w-[260px]">
                            Nossa equipe pastoral está preparando conteúdos edificantes para você. Volte amanhã!
                        </p>
                        <button
                            onClick={loadData}
                            className="mt-8 text-indigo-600 text-sm font-medium hover:text-indigo-700 transition-colors"
                        >
                            Verificar novamente
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
}

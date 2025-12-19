import { useState, useEffect } from 'react';
import { PageIntro } from '@/components/layout/PageIntro';
import { useAuth } from '@/contexts/AuthContext';
import { Heart, Loader2, Filter } from 'lucide-react';

import { FLAGS } from '@/lib/flags';
import { prayerApi, type PrayerRequest } from '@/lib/api/prayer';
import { PrayerRequestForm } from '@/components/Prayer/PrayerRequestForm';
import { PrayerRequestCard } from '@/components/Prayer/PrayerRequestCard';
import { cn } from '@/lib/utils';
import { toast } from 'sonner';

export default function PrayerHub() {
    useAuth();
    const [activeTab, setActiveTab] = useState<'new' | 'list'>('new');
    // Filters
    const [filterUrgent, setFilterUrgent] = useState(false);
    const [filterGratitude, setFilterGratitude] = useState(false);

    // Data
    const [requests, setRequests] = useState<PrayerRequest[]>([]);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        if (activeTab === 'list' && FLAGS.FEATURE_PRAYER_API) {
            fetchFeed();
        }
    }, [activeTab, filterUrgent, filterGratitude]);

    const fetchFeed = async () => {
        setLoading(true);
        try {
            const { data, error } = await prayerApi.getFeed(20, 0, filterUrgent, filterGratitude);
            if (error) throw error;
            setRequests(data);

            // If offline/mock, we might get empty, so let's mock one if empty for demo
            if (data.length === 0 && !FLAGS.FEATURE_PRAYER_API) {
                // Mock data for dev if needed
            }
        } catch (err) {
            console.error(err);
            toast.error("Não foi possível carregar os pedidos.");
        } finally {
            setLoading(false);
        }
    };

    if (!FLAGS.FEATURE_PRAYER_REQUESTS_V1) return null;

    return (
        <div className="min-h-screen bg-transparent flex flex-col pb-safe">
            {/* Header (Standardized) */}
            <div className="px-6 pt-6 mb-4">
                <PageIntro
                    title="Pedidos de Oração"
                    icon={Heart}
                    iconClassName="text-rose-500 fill-rose-500/20"
                    backLink={true}
                />
            </div>

            {/* Tabs */}
            <div className="px-4 mb-6">
                <div className="flex p-1 bg-slate-100 rounded-xl">
                    <button
                        onClick={() => setActiveTab('new')}
                        className={cn("flex-1 py-2.5 text-sm font-bold rounded-lg transition-all", activeTab === 'new' ? "bg-white text-indigo-700 shadow-sm" : "text-slate-500 hover:text-slate-600")}
                    >
                        Novo Pedido
                    </button>
                    <button
                        onClick={() => setActiveTab('list')}
                        className={cn("flex-1 py-2.5 text-sm font-bold rounded-lg transition-all", activeTab === 'list' ? "bg-white text-indigo-700 shadow-sm" : "text-slate-500 hover:text-slate-600")}
                    >
                        Mural de Oração
                    </button>
                </div>
            </div>

            {/* Content */}
            <div className="flex-1 px-4 pb-8 max-w-lg mx-auto w-full">
                {activeTab === 'new' ? (
                    <div className="bg-white p-6 rounded-3xl shadow-sm border border-slate-100">
                        <PrayerRequestForm onSuccess={() => setActiveTab('list')} />
                    </div>
                ) : (
                    <div className="space-y-4 animate-in fade-in slide-in-from-right-4 duration-300">
                        {/* Filters */}
                        <div className="flex items-center gap-2 overflow-x-auto pb-2 no-scrollbar">
                            <span className="text-xs font-bold text-slate-400 uppercase tracking-wider mr-1 flex items-center">
                                <Filter className="w-3 h-3 mr-1" /> Filtros
                            </span>
                            <button
                                onClick={() => { setFilterUrgent(false); setFilterGratitude(false); }}
                                className={cn(
                                    "px-3 py-1.5 rounded-full text-xs font-semibold whitespace-nowrap transition-colors border",
                                    !filterUrgent && !filterGratitude ? "bg-indigo-600 text-white border-indigo-600" : "bg-white text-slate-600 border-slate-200"
                                )}
                            >
                                Recentes
                            </button>
                            <button
                                onClick={() => setFilterUrgent(!filterUrgent)}
                                className={cn(
                                    "px-3 py-1.5 rounded-full text-xs font-semibold whitespace-nowrap transition-colors border",
                                    filterUrgent ? "bg-rose-500 text-white border-rose-500" : "bg-white text-slate-600 border-slate-200"
                                )}
                            >
                                Urgentes
                            </button>
                            <button
                                onClick={() => setFilterGratitude(!filterGratitude)}
                                className={cn(
                                    "px-3 py-1.5 rounded-full text-xs font-semibold whitespace-nowrap transition-colors border",
                                    filterGratitude ? "bg-emerald-500 text-white border-emerald-500" : "bg-white text-slate-600 border-slate-200"
                                )}
                            >
                                Gratidão
                            </button>
                        </div>

                        {/* List */}
                        {loading ? (
                            <div className="flex flex-col items-center justify-center py-12 space-y-3">
                                <Loader2 className="w-8 h-8 text-indigo-500 animate-spin" />
                                <p className="text-sm text-slate-400">Carregando pedidos...</p>
                            </div>
                        ) : requests.length > 0 ? (
                            <div className="space-y-3">
                                {requests.map(req => (
                                    <PrayerRequestCard key={req.id} request={req} />
                                ))}
                            </div>
                        ) : (
                            <div className="text-center py-12 bg-slate-50 rounded-3xl border border-slate-100 border-dashed">
                                <div className="w-16 h-16 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-4">
                                    <Heart className="w-8 h-8 text-slate-300" />
                                </div>
                                <h3 className="text-slate-900 font-medium mb-1">Nenhum pedido encontrado.</h3>
                                <p className="text-slate-500 text-sm max-w-[200px] mx-auto">
                                    Seja o primeiro a compartilhar um motivo de oração ou agradecimento.
                                </p>
                            </div>
                        )}
                    </div>
                )}
            </div>
        </div>
    );
}

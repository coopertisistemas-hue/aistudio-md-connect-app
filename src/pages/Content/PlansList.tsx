import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { contentService } from '@/services/content';
import type { ReadingPlan } from '@/types/content';
import { ArrowLeft, Loader2, BookOpen } from 'lucide-react';

export default function PlansList() {
    const navigate = useNavigate();
    const [plans, setPlans] = useState<ReadingPlan[]>([]);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        loadData();
    }, []);

    const loadData = async () => {
        try {
            const data = await contentService.getReadingPlans();
            setPlans(data);
        } catch (error) {
            console.error(error);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-slate-50 flex flex-col">
            <div className="bg-white border-b sticky top-0 z-10 px-4 py-3 flex items-center gap-3">
                <button onClick={() => navigate(-1)} className="p-1 -ml-1">
                    <ArrowLeft className="h-6 w-6 text-slate-600" />
                </button>
                <h1 className="font-bold text-lg">Planos de Leitura</h1>
            </div>

            <div className="p-4 grid gap-4">
                {isLoading ? (
                    <div className="flex justify-center py-10 w-full col-span-full">
                        <Loader2 className="h-8 w-8 animate-spin text-primary" />
                    </div>
                ) : plans.length === 0 ? (
                    <div className="text-center py-10 text-muted-foreground col-span-full">
                        Nenhum plano disponível no momento.
                    </div>
                ) : (
                    plans.map(plan => (
                        <div
                            key={plan.id}
                            onClick={() => navigate(`/conteudos/planos/${plan.id}`)}
                            className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm flex gap-4 active:scale-[0.98] transition-transform cursor-pointer"
                        >
                            <div className="h-20 w-20 bg-emerald-100 rounded-lg flex items-center justify-center flex-shrink-0 text-emerald-600">
                                <BookOpen className="h-8 w-8" />
                            </div>
                            <div>
                                <h3 className="font-bold text-slate-900 line-clamp-1">{plan.title}</h3>
                                <p className="text-sm text-slate-500 mt-1 line-clamp-2">{plan.description}</p>
                                <span className="text-xs bg-slate-100 px-2 py-0.5 rounded mt-2 inline-block">
                                    {plan.total_days} dias
                                </span>
                            </div>
                        </div>
                    ))
                )}
            </div>
        </div>
    );
}

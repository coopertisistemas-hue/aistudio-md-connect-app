import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { contentService } from '@/services/content';
import type { ReadingPlan } from '@/types/content';
import { Loader2, BookOpen } from 'lucide-react';
import { InternalPageLayout } from '@/components/layout/InternalPageLayout';

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
        <InternalPageLayout
            title="Planos"
            subtitle="Caminhos práticos para fortalecer sua fé."
            icon={BookOpen}
            iconClassName="text-emerald-600"
            backPath="/home"
        >
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
        </InternalPageLayout>
    );
}

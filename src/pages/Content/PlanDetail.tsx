import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { contentService } from '@/services/content';
import type { ReadingPlan, ReadingPlanDay } from '@/types/content';
import { CheckCircle2, Circle, Loader2, BookOpen } from 'lucide-react';
import { InternalPageLayout } from '@/components/layout/InternalPageLayout';

export default function PlanDetail() {
    const { id } = useParams();
    const [plan, setPlan] = useState<ReadingPlan | null>(null);
    const [days, setDays] = useState<ReadingPlanDay[]>([]);
    const [completedDays, setCompletedDays] = useState<number[]>([]);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        if (id) loadData(id);
    }, [id]);

    const loadData = async (planId: string) => {
        try {
            const [planData, daysData, progressData] = await Promise.all([
                contentService.getPlanById(planId),
                contentService.getPlanDays(planId),
                contentService.getPlanProgress(planId)
            ]);
            setPlan(planData);
            setDays(daysData);
            setCompletedDays(progressData.completed_days || []);
        } catch (error) {
            console.error(error);
        } finally {
            setIsLoading(false);
        }
    };

    const handleToggleDay = async (dayNumber: number) => {
        if (!id) return;
        if (!completedDays.includes(dayNumber)) {
            setCompletedDays([...completedDays, dayNumber]);
            await contentService.markPlanDayComplete(id, dayNumber);
        }
    };

    if (isLoading) {
        return (
            <InternalPageLayout
                title="Plano"
                subtitle="Acompanhe os dias e mantenha constância."
                icon={BookOpen}
                iconClassName="text-emerald-600"
                backPath="/conteudos/planos"
            >
                <div className="flex justify-center p-10"><Loader2 className="animate-spin" /></div>
            </InternalPageLayout>
        );
    }

    if (!plan) {
        return (
            <InternalPageLayout
                title="Plano"
                subtitle="Acompanhe os dias e mantenha constância."
                icon={BookOpen}
                iconClassName="text-emerald-600"
                backPath="/conteudos/planos"
            >
                <div className="p-4 text-center">Plano não encontrado.</div>
            </InternalPageLayout>
        );
    }

    const progress = Math.round((completedDays.length / plan.total_days) * 100);

    return (
        <InternalPageLayout
            title={plan.title}
            subtitle="Acompanhe os dias e mantenha constância."
            icon={BookOpen}
            iconClassName="text-emerald-600"
            backPath="/conteudos/planos"
        >
            {/* Progress Bar */}
            <div className="bg-white border-b px-4 py-3">
                <div className="flex items-center gap-3">
                    <div className="flex-1">
                        <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden">
                            <div className="bg-emerald-500 h-full transition-all duration-300" style={{ width: `${progress}%` }} />
                        </div>
                    </div>
                    <span className="text-sm font-bold text-emerald-600">{progress}%</span>
                </div>
            </div>

            {/* Days List */}
            <div className="p-4 space-y-3">
                {days.map(day => {
                    const isCompleted = completedDays.includes(day.day_number);
                    return (
                        <div
                            key={day.id}
                            onClick={() => handleToggleDay(day.day_number)}
                            className={`p-4 rounded-xl border flex items-center gap-4 transition-all active:scale-[0.98] cursor-pointer ${isCompleted ? 'bg-emerald-50 border-emerald-200' : 'bg-white border-slate-200'}`}
                        >
                            <button className={`flex-shrink-0 ${isCompleted ? 'text-emerald-500' : 'text-slate-300'}`}>
                                {isCompleted ? <CheckCircle2 className="w-6 h-6" /> : <Circle className="w-6 h-6" />}
                            </button>
                            <div>
                                <h3 className={`font-semibold ${isCompleted ? 'text-emerald-900' : 'text-slate-900'}`}>
                                    {day.title || `Dia ${day.day_number}`}
                                </h3>
                                <p className={`text-sm mt-0.5 ${isCompleted ? 'text-emerald-700' : 'text-slate-500'}`}>
                                    {day.bible_refs?.join(', ') || 'Leitura do dia'}
                                </p>
                            </div>
                        </div>
                    );
                })}
            </div>
        </InternalPageLayout>
    );
}

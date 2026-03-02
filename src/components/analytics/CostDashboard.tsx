import { Zap, Brain, Server, Database, Wifi, DollarSign } from 'lucide-react';
import type { CostMetrics } from '@/lib/api/costs';
import { formatCost } from '@/lib/api/costs';

interface CostDashboardProps {
    metrics: CostMetrics | null;
    loading?: boolean;
}

export function CostDashboard({ metrics, loading }: CostDashboardProps) {
    const safeMetrics = metrics ?? {
        total_api_calls: 0,
        ai_calls: 0,
        ai_cost_estimate: 0,
        edge_invocations: 0,
        bandwidth_mb: 0,
        db_queries: 0,
    };

    if (loading) {
        return (
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                {[...Array(6)].map((_, i) => (
                    <div key={i} className="bg-slate-50 rounded-xl p-4 animate-pulse">
                        <div className="h-4 w-20 bg-slate-200 rounded mb-2" />
                        <div className="h-8 w-16 bg-slate-200 rounded" />
                    </div>
                ))}
            </div>
        );
    }

    const cards = [
        {
            label: 'Total API Calls',
            value: safeMetrics.total_api_calls.toLocaleString('pt-BR'),
            icon: Zap,
            color: 'text-blue-500',
            bg: 'bg-blue-50',
        },
        {
            label: 'AI Calls',
            value: safeMetrics.ai_calls.toLocaleString('pt-BR'),
            icon: Brain,
            color: 'text-purple-500',
            bg: 'bg-purple-50',
        },
        {
            label: 'AI Cost',
            value: formatCost(safeMetrics.ai_cost_estimate),
            icon: DollarSign,
            color: 'text-green-600',
            bg: 'bg-green-50',
        },
        {
            label: 'Edge Functions',
            value: safeMetrics.edge_invocations.toLocaleString('pt-BR'),
            icon: Server,
            color: 'text-orange-500',
            bg: 'bg-orange-50',
        },
        {
            label: 'Bandwidth',
            value: `${safeMetrics.bandwidth_mb.toFixed(2)} MB`,
            icon: Wifi,
            color: 'text-cyan-500',
            bg: 'bg-cyan-50',
        },
        {
            label: 'DB Queries',
            value: safeMetrics.db_queries.toLocaleString('pt-BR'),
            icon: Database,
            color: 'text-emerald-500',
            bg: 'bg-emerald-50',
        },
    ];

    const aiPercentage = safeMetrics.total_api_calls > 0 
        ? (safeMetrics.ai_calls / safeMetrics.total_api_calls) * 100 
        : 0;

    return (
        <div className="space-y-6">
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                {cards.map((card) => (
                    <div
                        key={card.label}
                        className="bg-white rounded-xl p-4 border border-slate-100 shadow-sm"
                    >
                        <div className={`w-10 h-10 rounded-lg ${card.bg} flex items-center justify-center mb-3`}>
                            <card.icon className={`w-5 h-5 ${card.color}`} />
                        </div>
                        <p className="text-xs font-medium text-slate-500 uppercase tracking-wide">
                            {card.label}
                        </p>
                        <p className="text-2xl font-bold text-slate-900 mt-1">
                            {card.value}
                        </p>
                    </div>
                ))}
            </div>

            <div className="bg-white rounded-xl p-4 border border-slate-100 shadow-sm">
                <h3 className="font-semibold text-slate-900 mb-4">AI Usage Analysis</h3>
                
                <div className="flex items-center gap-4">
                    <div className="flex-1">
                        <div className="flex justify-between text-sm mb-2">
                            <span className="text-slate-600">AI / Total</span>
                            <span className="font-medium text-slate-900">{aiPercentage.toFixed(1)}%</span>
                        </div>
                        <div className="h-3 bg-slate-100 rounded-full overflow-hidden">
                            <div 
                                className="h-full bg-gradient-to-r from-purple-500 to-purple-600 rounded-full transition-all"
                                style={{ width: `${Math.min(aiPercentage, 100)}%` }}
                            />
                        </div>
                    </div>
                </div>

                {safeMetrics.ai_calls > 0 && (
                    <div className="mt-4 pt-4 border-t border-slate-100">
                        <div className="flex justify-between items-center">
                            <span className="text-sm text-slate-600">Estimated AI Cost</span>
                            <span className="text-lg font-bold text-green-600">
                                {formatCost(safeMetrics.ai_cost_estimate)}
                            </span>
                        </div>
                    </div>
                )}
            </div>

            {safeMetrics.ai_calls === 0 && (
                <div className="bg-blue-50 border border-blue-100 rounded-xl p-4">
                    <p className="text-sm text-blue-800">
                        💡 Nenhum custo de IA detectado neste período. As funcionalidades de IA estão sendo usada de forma eficiente.
                    </p>
                </div>
            )}
        </div>
    );
}

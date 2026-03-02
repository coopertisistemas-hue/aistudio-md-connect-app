import { Heart, TrendingUp, Users, Headphones } from 'lucide-react';
import type { RevenueMetrics } from '@/lib/api/revenue';
import { calculateRevenueScore } from '@/lib/api/revenue';

interface RevenueDashboardProps {
    metrics: RevenueMetrics | null;
    loading?: boolean;
}

const DEFAULT_METRICS: RevenueMetrics = {
    total_donations: 0,
    donation_views: 0,
    donation_clicks: 0,
    donation_conversion_rate: 0,
    partner_inquiries: 0,
    service_requests: 0,
    affiliate_clicks: 0,
};

export function RevenueDashboard({ metrics, loading }: RevenueDashboardProps) {
    const safeMetrics = metrics ?? DEFAULT_METRICS;
    const score = calculateRevenueScore(safeMetrics);

    if (loading) {
        return (
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {[...Array(4)].map((_, i) => (
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
            label: 'Visualizações',
            value: safeMetrics.donation_views,
            icon: Heart,
            color: 'text-rose-500',
            bg: 'bg-rose-50',
        },
        {
            label: 'Cliques',
            value: safeMetrics.donation_clicks,
            icon: TrendingUp,
            color: 'text-blue-500',
            bg: 'bg-blue-50',
        },
        {
            label: 'Inquiries',
            value: safeMetrics.partner_inquiries,
            icon: Users,
            color: 'text-emerald-500',
            bg: 'bg-emerald-50',
        },
        {
            label: 'Serviços',
            value: safeMetrics.service_requests,
            icon: Headphones,
            color: 'text-purple-500',
            bg: 'bg-purple-50',
        },
    ];

    const getScoreColor = (score: number) => {
        if (score >= 70) return 'text-green-600';
        if (score >= 40) return 'text-yellow-600';
        return 'text-red-600';
    };

    const getScoreLabel = (score: number) => {
        if (score >= 70) return 'Excelente';
        if (score >= 40) return 'Bom';
        return 'Em evolução';
    };

    return (
        <div className="space-y-6">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
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
                            {card.value.toLocaleString('pt-BR')}
                        </p>
                    </div>
                ))}
            </div>

            <div className="bg-white rounded-xl p-4 border border-slate-100 shadow-sm">
                <div className="flex items-center justify-between">
                    <div>
                        <p className="text-xs font-medium text-slate-500 uppercase tracking-wide">
                            Score de Receita
                        </p>
                        <p className={`text-3xl font-bold mt-1 ${getScoreColor(score)}`}>
                            {score}
                        </p>
                    </div>
                    <div className={`px-3 py-1 rounded-full text-sm font-medium ${score >= 70 ? 'bg-green-100 text-green-700' : score >= 40 ? 'bg-yellow-100 text-yellow-700' : 'bg-red-100 text-red-700'}`}>
                        {getScoreLabel(score)}
                    </div>
                </div>
                
                <div className="mt-4 pt-4 border-t border-slate-100">
                    <div className="grid grid-cols-3 gap-4 text-center">
                        <div>
                            <p className="text-xs text-slate-500">Affiliates</p>
                            <p className="font-semibold text-slate-900">{safeMetrics.affiliate_clicks}</p>
                        </div>
                        <div>
                            <p className="text-xs text-slate-500">Taxa Conversão</p>
                            <p className="font-semibold text-slate-900">{safeMetrics.donation_conversion_rate}%</p>
                        </div>
                        <div>
                            <p className="text-xs text-slate-500">Total Doações</p>
                            <p className="font-semibold text-slate-900">{safeMetrics.total_donations}</p>
                        </div>
                    </div>
                </div>
            </div>

            {safeMetrics.partner_inquiries === 0 && safeMetrics.service_requests === 0 && (
                <div className="bg-amber-50 border border-amber-100 rounded-xl p-4">
                    <p className="text-sm text-amber-800">
                        💡 Para aumentar a receita, invista em parcerias e divulgue os serviços da igreja.
                    </p>
                </div>
            )}
        </div>
    );
}

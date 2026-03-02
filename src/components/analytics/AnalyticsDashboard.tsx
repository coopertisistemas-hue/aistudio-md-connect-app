import { TrendingUp, Users, Eye, Target } from 'lucide-react';
import type { AnalyticsSummary } from '@/lib/api/analytics';
import { formatNumber, calculateConversionRate } from '@/lib/api/analytics';

interface AnalyticsDashboardProps {
    summary: AnalyticsSummary;
    loading?: boolean;
}

export function AnalyticsDashboard({ summary, loading }: AnalyticsDashboardProps) {
    const conversionRate = calculateConversionRate(
        summary.conversions,
        summary.unique_sessions
    );

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

    const metrics = [
        {
            label: 'Total Eventos',
            value: formatNumber(summary.total_events),
            icon: TrendingUp,
            color: 'text-blue-600',
            bg: 'bg-blue-50',
        },
        {
            label: 'Sessões Únicas',
            value: formatNumber(summary.unique_sessions),
            icon: Users,
            color: 'text-emerald-600',
            bg: 'bg-emerald-50',
        },
        {
            label: 'Page Views',
            value: formatNumber(summary.page_views),
            icon: Eye,
            color: 'text-amber-600',
            bg: 'bg-amber-50',
        },
        {
            label: 'Taxa Conversão',
            value: `${conversionRate}%`,
            icon: Target,
            color: 'text-purple-600',
            bg: 'bg-purple-50',
        },
    ];

    return (
        <div className="space-y-6">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {metrics.map((metric) => (
                    <div
                        key={metric.label}
                        className="bg-white rounded-xl p-4 border border-slate-100 shadow-sm"
                    >
                        <div className={`w-10 h-10 rounded-lg ${metric.bg} flex items-center justify-center mb-3`}>
                            <metric.icon className={`w-5 h-5 ${metric.color}`} />
                        </div>
                        <p className="text-xs font-medium text-slate-500 uppercase tracking-wide">
                            {metric.label}
                        </p>
                        <p className="text-2xl font-bold text-slate-900 mt-1">
                            {metric.value}
                        </p>
                    </div>
                ))}
            </div>

            {summary.top_events.length > 0 && (
                <div className="bg-white rounded-xl p-4 border border-slate-100 shadow-sm">
                    <h3 className="font-semibold text-slate-900 mb-3">Top Eventos</h3>
                    <div className="space-y-2">
                        {summary.top_events.slice(0, 5).map((event, index) => (
                            <div key={event.event_name} className="flex items-center justify-between">
                                <div className="flex items-center gap-2">
                                    <span className="text-xs font-medium text-slate-400 w-4">
                                        {index + 1}
                                    </span>
                                    <span className="text-sm text-slate-700">
                                        {event.event_name}
                                    </span>
                                </div>
                                <span className="text-sm font-semibold text-slate-900">
                                    {formatNumber(event.count)}
                                </span>
                            </div>
                        ))}
                    </div>
                </div>
            )}

            {summary.top_pages.length > 0 && (
                <div className="bg-white rounded-xl p-4 border border-slate-100 shadow-sm">
                    <h3 className="font-semibold text-slate-900 mb-3">Top Páginas</h3>
                    <div className="space-y-2">
                        {summary.top_pages.slice(0, 5).map((page, index) => (
                            <div key={page.page_path} className="flex items-center justify-between">
                                <div className="flex items-center gap-2">
                                    <span className="text-xs font-medium text-slate-400 w-4">
                                        {index + 1}
                                    </span>
                                    <span className="text-sm text-slate-700 truncate max-w-[200px]">
                                        {page.page_path}
                                    </span>
                                </div>
                                <span className="text-sm font-semibold text-slate-900">
                                    {formatNumber(page.count)}
                                </span>
                            </div>
                        ))}
                    </div>
                </div>
            )}
        </div>
    );
}

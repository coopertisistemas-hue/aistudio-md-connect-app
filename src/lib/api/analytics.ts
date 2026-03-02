import { invokeBff } from '@/lib/bff';

export interface AnalyticsQueryParams {
    event_name?: string;
    start_date?: string;
    end_date?: string;
    church_id?: string;
    limit?: number;
}

export interface AnalyticsSummary {
    total_events: number;
    unique_sessions: number;
    page_views: number;
    conversions: number;
    top_events: { event_name: string; count: number }[];
    top_pages: { page_path: string; count: number }[];
}

export interface AnalyticsTrend {
    date: string;
    events: number;
    sessions: number;
}

export async function queryAnalytics(params: AnalyticsQueryParams): Promise<AnalyticsSummary> {
    try {
        const data = await invokeBff<AnalyticsSummary>('analytics-query', params);
        return data;
    } catch {
        return {
            total_events: 0,
            unique_sessions: 0,
            page_views: 0,
            conversions: 0,
            top_events: [],
            top_pages: [],
        };
    }
}

export async function getAnalyticsTrend(
    days: number = 7,
    church_id?: string
): Promise<AnalyticsTrend[]> {
    const endDate = new Date().toISOString().split('T')[0];
    const startDate = new Date(Date.now() - days * 24 * 60 * 60 * 1000)
        .toISOString()
        .split('T')[0];

    try {
        const data = await invokeBff<AnalyticsTrend[]>('analytics-trend', {
            start_date: startDate,
            end_date: endDate,
            church_id
        });
        return data || [];
    } catch {
        return [];
    }
}

export function calculateConversionRate(
    conversions: number,
    totalVisitors: number
): number {
    if (totalVisitors === 0) return 0;
    return Math.round((conversions / totalVisitors) * 100 * 10) / 10;
}

export function formatNumber(num: number): string {
    if (num >= 1000000) {
        return (num / 1000000).toFixed(1) + 'M';
    }
    if (num >= 1000) {
        return (num / 1000).toFixed(1) + 'K';
    }
    return num.toString();
}

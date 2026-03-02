import { invokeBff } from '@/lib/bff';

export interface RevenueMetrics {
    total_donations: number;
    donation_views: number;
    donation_clicks: number;
    donation_conversion_rate: number;
    partner_inquiries: number;
    service_requests: number;
    affiliate_clicks: number;
}

export interface RevenueTrend {
    date: string;
    donations: number;
    inquiries: number;
    requests: number;
}

export interface MonetizationFunnel {
    stage: string;
    count: number;
    percentage: number;
}

export async function getRevenueMetrics(church_id?: string): Promise<RevenueMetrics> {
    try {
        const data = await invokeBff<RevenueMetrics>('revenue-metrics', { church_id });
        return data;
    } catch {
        return {
            total_donations: 0,
            donation_views: 0,
            donation_clicks: 0,
            donation_conversion_rate: 0,
            partner_inquiries: 0,
            service_requests: 0,
            affiliate_clicks: 0,
        };
    }
}

export async function getRevenueTrend(
    days: number = 30,
    church_id?: string
): Promise<RevenueTrend[]> {
    const endDate = new Date().toISOString().split('T')[0];
    const startDate = new Date(Date.now() - days * 24 * 60 * 60 * 1000)
        .toISOString()
        .split('T')[0];

    try {
        const data = await invokeBff<RevenueTrend[]>('revenue-trend', {
            start_date: startDate,
            end_date: endDate,
            church_id,
        });
        return data || [];
    } catch {
        return [];
    }
}

export async function getMonetizationFunnel(church_id?: string): Promise<MonetizationFunnel[]> {
    try {
        const data = await invokeBff<MonetizationFunnel[]>('monetization-funnel', { church_id });
        return data || [];
    } catch {
        return [];
    }
}

export function calculateRevenueScore(metrics: RevenueMetrics): number {
    const viewsWeight = 0.1;
    const clicksWeight = 0.2;
    const inquiriesWeight = 0.3;
    const requestsWeight = 0.2;
    const affiliatesWeight = 0.2;

    const score = 
        (metrics.donation_views * viewsWeight) +
        (metrics.donation_clicks * clicksWeight) +
        (metrics.partner_inquiries * inquiriesWeight) +
        (metrics.service_requests * requestsWeight) +
        (metrics.affiliate_clicks * affiliatesWeight);

    return Math.min(100, Math.round(score));
}

export function formatCurrency(value: number): string {
    return new Intl.NumberFormat('pt-BR', {
        style: 'currency',
        currency: 'BRL',
    }).format(value);
}

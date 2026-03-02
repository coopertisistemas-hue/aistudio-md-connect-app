import { invokeBff } from '@/lib/bff';

export interface CostMetrics {
    total_api_calls: number;
    ai_calls: number;
    ai_cost_estimate: number;
    edge_invocations: number;
    bandwidth_mb: number;
    db_queries: number;
}

export interface CostTrend {
    date: string;
    api_calls: number;
    ai_calls: number;
    cost: number;
}

export interface ResourceUsage {
    endpoint: string;
    calls: number;
    avg_duration_ms: number;
    cost: number;
}

export async function getCostMetrics(period: 'day' | 'week' | 'month' = 'day'): Promise<CostMetrics> {
    try {
        const data = await invokeBff<CostMetrics>('cost-metrics', { period });
        return data;
    } catch {
        return {
            total_api_calls: 0,
            ai_calls: 0,
            ai_cost_estimate: 0,
            edge_invocations: 0,
            bandwidth_mb: 0,
            db_queries: 0,
        };
    }
}

export async function getCostTrend(
    days: number = 7
): Promise<CostTrend[]> {
    try {
        const data = await invokeBff<CostTrend[]>('cost-trend', { days });
        return data || [];
    } catch {
        return [];
    }
}

export async function getTopResources(limit: number = 10): Promise<ResourceUsage[]> {
    try {
        const data = await invokeBff<ResourceUsage[]>('cost-top-resources', { limit });
        return data || [];
    } catch {
        return [];
    }
}

export const COST_ESTIMATES = {
    openai: {
        gpt4o: { input: 0.0025, output: 0.01 }, // per 1K tokens
        gpt4o_mini: { input: 0.00015, output: 0.0006 },
        dall_e: { input: 0.004 }, // per image
    },
    supabase: {
        edge_function: 0.0000012, // per invocation
        database: 0.000005, // per query
        bandwidth: 0.00009, // per MB
    },
} as const;

export function estimateAICost(
    model: 'gpt4o' | 'gpt4o_mini' | 'dall_e',
    inputTokens: number,
    outputTokens: number = 0,
    images: number = 0
): number {
    if (model === 'dall_e') {
        return images * COST_ESTIMATES.openai.dall_e.input;
    }
    
    const pricing = model === 'gpt4o' 
        ? COST_ESTIMATES.openai.gpt4o 
        : COST_ESTIMATES.openai.gpt4o_mini;
    
    const inputCost = (inputTokens / 1000) * pricing.input;
    const outputCost = (outputTokens / 1000) * pricing.output;
    
    return inputCost + outputCost;
}

export function formatCost(cost: number): string {
    if (cost < 0.01) {
        return `$${(cost * 100).toFixed(4)}¢`;
    }
    return `$${cost.toFixed(4)}`;
}

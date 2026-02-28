import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from "https://esm.sh/@supabase/supabase-js@2"
import { handleCors, jsonResponse } from '../_shared/cors.ts'

interface KPIQueryParams {
    tenant_id: string;
    from: string;
    to: string;
}

function validateDateRange(from: string, to: string): { valid: boolean; error?: string } {
    const fromDate = new Date(from);
    const toDate = new Date(to);

    if (isNaN(fromDate.getTime()) || isNaN(toDate.getTime())) {
        return { valid: false, error: 'Invalid date format. Use YYYY-MM-DD' };
    }

    if (fromDate > toDate) {
        return { valid: false, error: 'Start date must be before end date' };
    }

    // Max 90 days range
    const daysDiff = (toDate.getTime() - fromDate.getTime()) / (1000 * 60 * 60 * 24);
    if (daysDiff > 90) {
        return { valid: false, error: 'Date range cannot exceed 90 days' };
    }

    return { valid: true };
}

serve(async (req) => {
    // Handle CORS preflight
    const corsResponse = handleCors(req);
    if (corsResponse) return corsResponse;

    // Get origin for CORS validation
    const origin = req.headers.get('origin');

    try {
        // Parse query parameters
        const url = new URL(req.url);
        const tenant_id = url.searchParams.get('tenant_id');
        const from = url.searchParams.get('from');
        const to = url.searchParams.get('to');

        // Validate required parameters
        if (!tenant_id || !from || !to) {
            return jsonResponse({
                error: 'Missing required parameters',
                required: ['tenant_id', 'from', 'to']
            }, 400, origin)
        }

        // Validate date range
        const dateValidation = validateDateRange(from, to);
        if (!dateValidation.valid) {
            return jsonResponse({ error: dateValidation.error }, 400, origin)
        }

        // Create Supabase client
        const supabaseClient = createClient(
            Deno.env.get('SUPABASE_URL') ?? '',
            Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
        )

        // Query kpi_daily view
        const { data: dailyData, error: dailyError } = await supabaseClient
            .from('kpi_daily')
            .select('*')
            .eq('tenant_id', tenant_id)
            .gte('date', from)
            .lte('date', to)
            .order('date', { ascending: true });

        if (dailyError) {
            console.error('Database error:', dailyError);
            return jsonResponse({
                error: 'Failed to fetch KPI data',
                message: dailyError.message
            }, 500, origin)
        }

        // Calculate summary metrics
        const summary = {
            total_views: dailyData?.reduce((sum, day) => sum + (day.total_views || 0), 0) || 0,
            unique_sessions: dailyData?.reduce((sum, day) => sum + (day.unique_sessions || 0), 0) || 0,
            avg_views_per_session: 0
        };

        if (summary.unique_sessions > 0) {
            summary.avg_views_per_session = Number((summary.total_views / summary.unique_sessions).toFixed(2));
        }

        // Format response
        const response = {
            summary,
            daily: dailyData || [],
            metadata: {
                tenant_id,
                from,
                to,
                days_count: dailyData?.length || 0
            }
        };

        return jsonResponse(response, 200, origin)

    } catch (error) {
        console.error('Unexpected error:', error);
        return jsonResponse({
            error: 'Internal server error',
            message: error instanceof Error ? error.message : 'Unknown error'
        }, 500, origin)
    }
})

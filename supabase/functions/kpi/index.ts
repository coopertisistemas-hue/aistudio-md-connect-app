import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from "https://esm.sh/@supabase/supabase-js@2"

const corsHeaders = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
    'Access-Control-Allow-Methods': 'GET, OPTIONS',
}

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
    if (req.method === 'OPTIONS') {
        return new Response('ok', {
            headers: { ...corsHeaders },
            status: 204
        })
    }

    try {
        // Parse query parameters
        const url = new URL(req.url);
        const tenant_id = url.searchParams.get('tenant_id');
        const from = url.searchParams.get('from');
        const to = url.searchParams.get('to');

        // Validate required parameters
        if (!tenant_id || !from || !to) {
            return new Response(
                JSON.stringify({
                    error: 'Missing required parameters',
                    required: ['tenant_id', 'from', 'to']
                }),
                {
                    headers: { ...corsHeaders, 'Content-Type': 'application/json' },
                    status: 400
                }
            )
        }

        // Validate date range
        const dateValidation = validateDateRange(from, to);
        if (!dateValidation.valid) {
            return new Response(
                JSON.stringify({ error: dateValidation.error }),
                {
                    headers: { ...corsHeaders, 'Content-Type': 'application/json' },
                    status: 400
                }
            )
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
            return new Response(
                JSON.stringify({
                    error: 'Failed to fetch KPI data',
                    message: dailyError.message
                }),
                {
                    headers: { ...corsHeaders, 'Content-Type': 'application/json' },
                    status: 500
                }
            )
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

        return new Response(
            JSON.stringify(response),
            {
                headers: { ...corsHeaders, 'Content-Type': 'application/json' },
                status: 200
            }
        )

    } catch (error) {
        console.error('Unexpected error:', error);
        return new Response(
            JSON.stringify({
                error: 'Internal server error',
                message: error instanceof Error ? error.message : 'Unknown error'
            }),
            {
                headers: { ...corsHeaders, 'Content-Type': 'application/json' },
                status: 500
            }
        )
    }
})

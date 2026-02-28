import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { handleCors, jsonResponse } from '../_shared/cors.ts'
import { createClient } from "https://esm.sh/@supabase/supabase-js@2"

function validateDateRange(from: string, to: string): { valid: boolean; error?: string } {
    const fromDate = new Date(from);
    const toDate = new Date(to);

    if (isNaN(fromDate.getTime()) || isNaN(toDate.getTime())) {
        return { valid: false, error: 'Invalid date format. Use YYYY-MM-DD' };
    }

    if (fromDate > toDate) {
        return { valid: false, error: 'Start date must be before end date' };
    }

    const daysDiff = (toDate.getTime() - fromDate.getTime()) / (1000 * 60 * 60 * 24);
    if (daysDiff > 90) {
        return { valid: false, error: 'Date range cannot exceed 90 days' };
    }

    return { valid: true };
}

serve(async (req) => {
    const corsResponse = handleCors(req);
    if (corsResponse) return corsResponse;

    // Get origin for CORS validation
    const origin = req.headers.get('origin');,
            status: 204
        })
    }

    try {
        const url = new URL(req.url);
        const tenant_id = url.searchParams.get('tenant_id');
        const from = url.searchParams.get('from');
        const to = url.searchParams.get('to');

        if (!tenant_id || !from || !to) {
            return jsonResponse({
                    error: 'Missing required parameters',
                    required: ['tenant_id', 'from', 'to']
                }, 400, origin)
        }

        const dateValidation = validateDateRange(from, to);
        if (!dateValidation.valid) {
            return jsonResponse({ error: dateValidation.error }, 400, origin)
        }

        const supabaseClient = createClient(
            Deno.env.get('SUPABASE_URL') ?? '',
            Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
        )

        // Query kpi_partners_daily view
        const { data: partnersData, error: partnersError } = await supabaseClient
            .from('kpi_partners_daily')
            .select('*')
            .eq('tenant_id', tenant_id)
            .gte('date', from)
            .lte('date', to)
            .order('date', { ascending: true });

        if (partnersError) {
            console.error('Database error:', partnersError);
            return jsonResponse({
                    error: 'Failed to fetch partners KPI data',
                    message: partnersError.message
                }, 500, origin)
        }

        // Aggregate by partner
        const partnerMap = new Map();
        partnersData?.forEach(row => {
            const existing = partnerMap.get(row.partner_id) || {
                partner_id: row.partner_id,
                views: 0,
                clicks: 0
            };
            existing.views += row.views || 0;
            existing.clicks += row.clicks || 0;
            partnerMap.set(row.partner_id, existing);
        });

        // Calculate CTR for aggregated partners
        const partners = Array.from(partnerMap.values()).map(p => ({
            ...p,
            ctr: p.views > 0 ? Number(((p.clicks / p.views) * 100).toFixed(2)) : 0
        })).sort((a, b) => b.ctr - a.ctr);

        // Calculate summary
        const summary = {
            total_partner_views: partners.reduce((sum, p) => sum + p.views, 0),
            total_partner_clicks: partners.reduce((sum, p) => sum + p.clicks, 0),
            overall_ctr: 0,
            top_partner: partners[0] || null
        };

        if (summary.total_partner_views > 0) {
            summary.overall_ctr = Number(((summary.total_partner_clicks / summary.total_partner_views) * 100).toFixed(2));
        }

        const response = {
            summary,
            partners,
            daily: partnersData || [],
            metadata: {
                tenant_id,
                from,
                to,
                partners_count: partners.length
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

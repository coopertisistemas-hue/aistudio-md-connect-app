-- Migration: analytics_kpi_views
-- Description: Creates materialized views for KPI aggregations and refresh function

-- 1. Create kpi_daily materialized view
CREATE MATERIALIZED VIEW IF NOT EXISTS public.kpi_daily AS
WITH daily_stats AS (
    SELECT 
        DATE(created_at) as date,
        tenant_id,
        COUNT(*) as total_views,
        COUNT(DISTINCT session_id) as unique_sessions
    FROM analytics_events
    WHERE event_name = 'page_view'
    GROUP BY DATE(created_at), tenant_id
),
top_pages_per_day AS (
    SELECT 
        DATE(created_at) as date,
        tenant_id,
        jsonb_agg(
            jsonb_build_object('path', page_path, 'views', view_count)
            ORDER BY view_count DESC
        ) as top_pages
    FROM (
        SELECT 
            DATE(created_at) as date,
            tenant_id,
            page_path,
            COUNT(*) as view_count,
            ROW_NUMBER() OVER (PARTITION BY DATE(created_at), tenant_id ORDER BY COUNT(*) DESC) as rn
        FROM analytics_events
        WHERE event_name = 'page_view'
        GROUP BY DATE(created_at), tenant_id, page_path
    ) ranked
    WHERE rn <= 5
    GROUP BY date, tenant_id
)
SELECT 
    ds.date,
    ds.tenant_id,
    ds.total_views,
    ds.unique_sessions,
    COALESCE(tp.top_pages, '[]'::jsonb) as top_pages
FROM daily_stats ds
LEFT JOIN top_pages_per_day tp ON ds.date = tp.date AND ds.tenant_id = tp.tenant_id;

-- 2. Create kpi_partners_daily materialized view
CREATE MATERIALIZED VIEW IF NOT EXISTS public.kpi_partners_daily AS
SELECT 
    DATE(created_at) as date,
    tenant_id,
    partner_id,
    COUNT(*) FILTER (WHERE event_name = 'view_partner') as views,
    COUNT(*) FILTER (WHERE event_name = 'click_partner') as clicks,
    ROUND(
        (COUNT(*) FILTER (WHERE event_name = 'click_partner')::numeric / 
         NULLIF(COUNT(*) FILTER (WHERE event_name = 'view_partner'), 0)) * 100,
        2
    ) as ctr
FROM analytics_events
WHERE partner_id IS NOT NULL
    AND event_name IN ('view_partner', 'click_partner')
GROUP BY DATE(created_at), tenant_id, partner_id;

-- 3. Create indexes for performance
CREATE INDEX IF NOT EXISTS idx_kpi_daily_date_tenant 
    ON public.kpi_daily (date DESC, tenant_id);

CREATE INDEX IF NOT EXISTS idx_kpi_partners_daily_date_tenant_partner 
    ON public.kpi_partners_daily (date DESC, tenant_id, partner_id);

CREATE INDEX IF NOT EXISTS idx_kpi_partners_daily_ctr 
    ON public.kpi_partners_daily (ctr DESC NULLS LAST);

-- 4. Create refresh function
CREATE OR REPLACE FUNCTION public.refresh_kpi_views()
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
    REFRESH MATERIALIZED VIEW CONCURRENTLY public.kpi_daily;
    REFRESH MATERIALIZED VIEW CONCURRENTLY public.kpi_partners_daily;
    
    RAISE NOTICE 'KPI views refreshed successfully at %', NOW();
END;
$$;

-- 5. Grant permissions
-- Service role has full access by default
-- No public access needed (accessed via Edge Functions)

-- 6. Add comments
COMMENT ON MATERIALIZED VIEW public.kpi_daily IS 'Daily KPI aggregations: views, sessions, top pages by tenant';
COMMENT ON MATERIALIZED VIEW public.kpi_partners_daily IS 'Daily partner KPI aggregations: views, clicks, CTR by tenant and partner';
COMMENT ON FUNCTION public.refresh_kpi_views() IS 'Refreshes both KPI materialized views concurrently';

-- 7. Initial refresh
REFRESH MATERIALIZED VIEW public.kpi_daily;
REFRESH MATERIALIZED VIEW public.kpi_partners_daily;

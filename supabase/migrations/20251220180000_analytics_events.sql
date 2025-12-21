-- Migration: analytics_events
-- Description: Creates analytics_events table for comprehensive event tracking with UTM support

-- Create analytics_events table
CREATE TABLE IF NOT EXISTS public.analytics_events (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    created_at TIMESTAMPTZ DEFAULT now() NOT NULL,
    tenant_id TEXT DEFAULT 'md-connect' NOT NULL,
    session_id TEXT NOT NULL,
    user_id UUID,
    user_key TEXT,
    event_name TEXT NOT NULL,
    page_path TEXT NOT NULL,
    partner_id UUID,
    utm_source TEXT,
    utm_medium TEXT,
    utm_campaign TEXT,
    utm_term TEXT,
    utm_content TEXT,
    meta JSONB DEFAULT '{}'::jsonb
);

-- Create indexes for common queries
CREATE INDEX IF NOT EXISTS idx_analytics_events_created_at 
    ON public.analytics_events(created_at DESC);

CREATE INDEX IF NOT EXISTS idx_analytics_events_tenant_session 
    ON public.analytics_events(tenant_id, session_id);

CREATE INDEX IF NOT EXISTS idx_analytics_events_event_name 
    ON public.analytics_events(event_name);

CREATE INDEX IF NOT EXISTS idx_analytics_events_user_id 
    ON public.analytics_events(user_id) 
    WHERE user_id IS NOT NULL;

-- Enable RLS
ALTER TABLE public.analytics_events ENABLE ROW LEVEL SECURITY;

-- No public access policies (all access via Edge Functions with Service Role)
-- Service role has full access by default

-- Add comment for documentation
COMMENT ON TABLE public.analytics_events IS 'Stores all analytics events with UTM tracking and flexible metadata';

-- Migration: Client Error Reports System
-- Description: Premium error reporting with deduplication, rate limiting, and PII protection
-- Created: 2025-12-21

-- Create client_error_reports table
CREATE TABLE IF NOT EXISTS client_error_reports (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    created_at timestamptz NOT NULL DEFAULT now(),
    first_seen_at timestamptz NOT NULL DEFAULT now(),
    last_seen_at timestamptz NOT NULL DEFAULT now(),
    occurrences int NOT NULL DEFAULT 1,
    
    -- Context
    env text NOT NULL,              -- dev / preview / prod
    app_version text NOT NULL,
    route text NOT NULL,            -- pathname only (no query)
    
    -- Error details
    message text NOT NULL,
    name text,
    stack text,
    severity text NOT NULL DEFAULT 'error',
    
    -- Tracking (anonymous)
    anon_id text,
    session_id text,
    user_agent text,
    
    -- Additional context
    meta jsonb,
    
    -- Deduplication
    fingerprint text NOT NULL
);

-- Create indexes for performance
CREATE INDEX IF NOT EXISTS idx_client_error_reports_created_at 
    ON client_error_reports(created_at DESC);

CREATE INDEX IF NOT EXISTS idx_client_error_reports_fingerprint 
    ON client_error_reports(fingerprint);

CREATE INDEX IF NOT EXISTS idx_client_error_reports_session_created 
    ON client_error_reports(session_id, created_at);

CREATE INDEX IF NOT EXISTS idx_client_error_reports_route 
    ON client_error_reports(route);

-- Enable Row Level Security
ALTER TABLE client_error_reports ENABLE ROW LEVEL SECURITY;

-- No public INSERT policy (Edge Function with service role only)
-- No public SELECT policy (admin only)

-- Optional: Add comment for documentation
COMMENT ON TABLE client_error_reports IS 'Client-side error reports with deduplication and rate limiting. Insert via Edge Function only.';
COMMENT ON COLUMN client_error_reports.fingerprint IS 'Hash of error signature for deduplication (10min window)';
COMMENT ON COLUMN client_error_reports.occurrences IS 'Number of times this error occurred (deduplicated)';
COMMENT ON COLUMN client_error_reports.env IS 'Environment: dev, preview, or prod';

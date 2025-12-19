-- Migration: Public Devotional Reads
-- Date: 2025-12-19
-- Purpose: Track anonymous reads with session hash.

CREATE TABLE IF NOT EXISTS public.devotional_reads_public (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    devotional_id UUID NOT NULL REFERENCES public.devotionals(id) ON DELETE CASCADE,
    read_date DATE NOT NULL DEFAULT (now() AT TIME ZONE 'America/Sao_Paulo')::date,
    session_hash TEXT NOT NULL,
    created_at TIMESTAMPTZ DEFAULT now(),
    
    UNIQUE (devotional_id, read_date, session_hash)
);

-- Indexes
CREATE INDEX IF NOT EXISTS idx_devotional_reads_public_lookup ON public.devotional_reads_public(devotional_id, read_date);

-- RLS
ALTER TABLE public.devotional_reads_public ENABLE ROW LEVEL SECURITY;

-- Policy: Only Service Role can insert (via Edge Function)
-- No public insert.
CREATE POLICY "Service role inserts public reads" ON public.devotional_reads_public FOR INSERT TO service_role WITH CHECK (true);

-- Policy: Public can count?
CREATE POLICY "Public can view public reads" ON public.devotional_reads_public FOR SELECT USING (true);

-- RPC to get combined social proof (Authenticated + Public)
CREATE OR REPLACE FUNCTION get_devotional_social_combined(_devotional_id UUID, _read_date DATE DEFAULT NULL)
RETURNS JSONB
LANGUAGE plpgsql STABLE SECURITY DEFINER
AS $$
DECLARE
    v_user_id UUID := auth.uid();
    v_target_date DATE := COALESCE(_read_date, (now() at time zone 'America/Sao_Paulo')::date);
    
    v_amen_count INT;
    v_auth_reads_count INT;
    v_public_reads_count INT;
    v_has_liked BOOLEAN;
BEGIN
    -- 1. Amen Count
    SELECT COUNT(*) INTO v_amen_count 
    FROM public.devotional_reactions 
    WHERE devotional_id = _devotional_id AND reaction_type = 'amen';

    -- 2. Has Liked
    IF v_user_id IS NOT NULL THEN
        SELECT EXISTS(SELECT 1 FROM public.devotional_reactions WHERE devotional_id = _devotional_id AND user_id = v_user_id AND reaction_type = 'amen') INTO v_has_liked;
    ELSE
        v_has_liked := false;
    END IF;

    -- 3. Authenticated Reads Count
    SELECT COUNT(*) INTO v_auth_reads_count
    FROM public.devotional_reads
    WHERE devotional_id = _devotional_id AND read_date = v_target_date;

    -- 4. Public Reads Count
    SELECT COUNT(*) INTO v_public_reads_count
    FROM public.devotional_reads_public
    WHERE devotional_id = _devotional_id AND read_date = v_target_date;

    RETURN jsonb_build_object(
        'amen_count', v_amen_count,
        'reads_count', v_auth_reads_count + v_public_reads_count, -- Combined Total
        'auth_reads_only', v_auth_reads_count,
        'public_reads_only', v_public_reads_count,
        'liked', v_has_liked
    );
END;
$$;

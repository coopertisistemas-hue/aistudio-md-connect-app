-- Migration: prayer_requests_v1
-- Description: Creates tables for prayer requests, reactions, and supporting RPCs.
-- Aligned with PRD for fullstack admin future-proofing.

-- 1. Create prayer_requests table
CREATE TABLE IF NOT EXISTS public.prayer_requests (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES auth.users(id) ON DELETE SET NULL, 
    created_at TIMESTAMPTZ DEFAULT now() NOT NULL,
    updated_at TIMESTAMPTZ DEFAULT now() NOT NULL,
    description TEXT NOT NULL,
    category TEXT NOT NULL
);

-- Ensure columns exist (idempotent for existing tables)
DO $$
BEGIN
    ALTER TABLE public.prayer_requests ADD COLUMN IF NOT EXISTS scope_type TEXT DEFAULT 'public_project' NOT NULL;
    ALTER TABLE public.prayer_requests ADD COLUMN IF NOT EXISTS scope_id UUID;
    ALTER TABLE public.prayer_requests ADD COLUMN IF NOT EXISTS user_id UUID REFERENCES auth.users(id) ON DELETE SET NULL;
    ALTER TABLE public.prayer_requests ADD COLUMN IF NOT EXISTS description TEXT; -- Nullable first if data exists, but we set NOT NULL below if needed or usually handled by app
    ALTER TABLE public.prayer_requests ADD COLUMN IF NOT EXISTS category TEXT;
    ALTER TABLE public.prayer_requests ADD COLUMN IF NOT EXISTS title TEXT;
    ALTER TABLE public.prayer_requests ADD COLUMN IF NOT EXISTS urgency TEXT DEFAULT 'normal' NOT NULL CHECK (urgency IN ('normal', 'urgent'));
    ALTER TABLE public.prayer_requests ADD COLUMN IF NOT EXISTS privacy TEXT DEFAULT 'public' NOT NULL CHECK (privacy IN ('public', 'team_only', 'anonymous'));
    ALTER TABLE public.prayer_requests ADD COLUMN IF NOT EXISTS status TEXT DEFAULT 'open' NOT NULL CHECK (status IN ('open', 'in_progress', 'answered', 'archived'));
    ALTER TABLE public.prayer_requests ADD COLUMN IF NOT EXISTS tracking_token TEXT;
EXCEPTION
    WHEN duplicate_column THEN RAISE NOTICE 'Column already exists';
END $$;

-- Indexes for performance
CREATE INDEX IF NOT EXISTS idx_prayer_requests_scope ON public.prayer_requests(scope_type, scope_id, status);
CREATE INDEX IF NOT EXISTS idx_prayer_requests_user ON public.prayer_requests(user_id);
CREATE INDEX IF NOT EXISTS idx_prayer_requests_created_at ON public.prayer_requests(created_at DESC);

-- Enable RLS
ALTER TABLE public.prayer_requests ENABLE ROW LEVEL SECURITY;

-- Policies for prayer_requests

-- READ: 
-- 1. Anyone (auth) can read public requests (if scope is public_project).
-- 2. Users can always read their own requests.
-- 3. 'team_only' requests are hidden from general public (TODO: Add proper role check later).
--    For now, we just ensure typical users only filter by privacy='public' in frontend, 
--    but for security we strictly allow: `privacy = 'public'` OR `user_id = auth.uid()`.
--    (Assuming typical member shouldn't see 'team_only' even if logged in, unless they are the author).
DROP POLICY IF EXISTS "Public requests are viewable by everyone" ON public.prayer_requests;
CREATE POLICY "Public requests are viewable by everyone" 
ON public.prayer_requests FOR SELECT 
USING (
  privacy = 'public' 
  OR privacy = 'anonymous' -- Anonymous requests can be public, just name hidden in UI
  OR auth.uid() = user_id
);

-- INSERT: Authenticated users can create requests.
DROP POLICY IF EXISTS "Authenticated users can create requests" ON public.prayer_requests;
CREATE POLICY "Authenticated users can create requests" 
ON public.prayer_requests FOR INSERT 
WITH CHECK (auth.uid() = user_id);

-- UPDATE: Users can update their own requests.
DROP POLICY IF EXISTS "Users can update their own requests" ON public.prayer_requests;
CREATE POLICY "Users can update their own requests" 
ON public.prayer_requests FOR UPDATE 
USING (auth.uid() = user_id);


-- 2. Create prayer_reactions table (Social Proof)
CREATE TABLE IF NOT EXISTS public.prayer_reactions (
    request_id UUID REFERENCES public.prayer_requests(id) ON DELETE CASCADE,
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    created_at TIMESTAMPTZ DEFAULT now() NOT NULL,
    reaction_type TEXT DEFAULT 'praying' NOT NULL,
    
    PRIMARY KEY (request_id, user_id)
);

-- Enable RLS
ALTER TABLE public.prayer_reactions ENABLE ROW LEVEL SECURITY;

-- READ: Everyone can see reactions (needed for counts)
DROP POLICY IF EXISTS "Reactions are viewable by everyone" ON public.prayer_reactions;
CREATE POLICY "Reactions are viewable by everyone" 
ON public.prayer_reactions FOR SELECT 
USING (true);

-- INSERT/DELETE: Users can manage their own reactions
DROP POLICY IF EXISTS "Users can toggle their own reactions" ON public.prayer_reactions;
CREATE POLICY "Users can toggle their own reactions" 
ON public.prayer_reactions FOR ALL 
USING (auth.uid() = user_id);


-- 3. RPC: toggle_prayer_reaction
-- Safely toggles a 'praying' reaction for the current user
CREATE OR REPLACE FUNCTION public.toggle_prayer_reaction(p_request_id UUID)
RETURNS BOOLEAN
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
    v_user_id UUID;
    v_exists BOOLEAN;
BEGIN
    v_user_id := auth.uid();
    IF v_user_id IS NULL THEN
        RAISE EXCEPTION 'Not authenticated';
    END IF;

    SELECT EXISTS (
        SELECT 1 FROM public.prayer_reactions 
        WHERE request_id = p_request_id AND user_id = v_user_id
    ) INTO v_exists;

    IF v_exists THEN
        DELETE FROM public.prayer_reactions 
        WHERE request_id = p_request_id AND user_id = v_user_id;
        RETURN FALSE; -- Removed
    ELSE
        INSERT INTO public.prayer_reactions (request_id, user_id)
        VALUES (p_request_id, v_user_id);
        RETURN TRUE; -- Added
    END IF;
END;
$$;


-- 4. RPC: get_prayer_feed
-- Returns paginated requests with reaction counts and 'user_reacted' state for the caller
-- Matches the detailed listing requirement
CREATE OR REPLACE FUNCTION public.get_prayer_feed(
    p_limit INT DEFAULT 20,
    p_offset INT DEFAULT 0,
    p_filter_urgency BOOLEAN DEFAULT FALSE,
    p_filter_gratitude BOOLEAN DEFAULT FALSE
)
RETURNS TABLE (
    id UUID,
    user_id UUID,
    title TEXT,
    description TEXT,
    category TEXT,
    urgency TEXT,
    privacy TEXT,
    status TEXT,
    created_at TIMESTAMPTZ,
    reaction_count BIGINT,
    user_reacted BOOLEAN,
    author_name TEXT, -- Mock/Placeholder or joined from profiles if needed
    author_avatar TEXT -- Mock/Placeholder
)
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
    v_current_user UUID;
BEGIN
    v_current_user := auth.uid();

    RETURN QUERY
    SELECT 
        pr.id,
        pr.user_id,
        pr.title,
        pr.description,
        pr.category,
        pr.urgency::TEXT,
        pr.privacy::TEXT,
        pr.status::TEXT,
        pr.created_at,
        (SELECT COUNT(*)::BIGINT FROM public.prayer_reactions reactions WHERE reactions.request_id = pr.id) as reaction_count,
        (CASE WHEN v_current_user IS NOT NULL THEN 
            EXISTS(SELECT 1 FROM public.prayer_reactions reactions WHERE reactions.request_id = pr.id AND reactions.user_id = v_current_user)
         ELSE FALSE END) as user_reacted,
         -- We do not strictly join profiles here to keep it simple and fast.
         -- Frontend can handle "Anonymous" label based on privacy field.
         'Membro'::TEXT as author_name, 
         null::TEXT as author_avatar
    FROM public.prayer_requests pr
    WHERE 
        (pr.privacy = 'public' OR pr.privacy = 'anonymous' OR pr.user_id = v_current_user)
        AND (p_filter_urgency = FALSE OR pr.urgency = 'urgent')
        AND (p_filter_gratitude = FALSE OR pr.category = 'gratidao')
        AND pr.status != 'archived'
    ORDER BY 
        CASE WHEN p_filter_urgency THEN (pr.urgency = 'urgent') END DESC, -- Put urgent first if filtering? Or just filter.
        pr.created_at DESC
    LIMIT p_limit
    OFFSET p_offset;
END;
$$;

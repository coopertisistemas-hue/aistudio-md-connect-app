
-- Social Proof Tables & RPCs

-- [RESET] Drop existing objects to ensure clean schema application
-- WARNING: This deletes data in these tables. Use only for dev/initial setup.
DROP FUNCTION IF EXISTS toggle_devotional_reaction;
DROP FUNCTION IF EXISTS get_devotional_details;
DROP FUNCTION IF EXISTS toggle_verse_reaction;
DROP FUNCTION IF EXISTS get_chapter_stats;
DROP TABLE IF EXISTS public.devotional_reactions;
DROP TABLE IF EXISTS public.verse_reactions;
DROP TABLE IF EXISTS public.devotional_reads;

-- 1. Devotional Reactions (Amém / Likes)
CREATE TABLE public.devotional_reactions (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    devotional_id UUID NOT NULL,
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
    created_at TIMESTAMPTZ DEFAULT now() NOT NULL,
    UNIQUE(devotional_id, user_id)
);

-- 2. Verse Reactions (Amém per Verse) - Normalized
CREATE TABLE public.verse_reactions (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    book TEXT NOT NULL, -- e.g "Jhn" or "Gen" (internal ID)
    chapter INTEGER NOT NULL,
    verse INTEGER NOT NULL,
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
    created_at TIMESTAMPTZ DEFAULT now() NOT NULL,
    UNIQUE(book, chapter, verse, user_id)
);

-- 3. Devotional Reads (View Counts)
CREATE TABLE public.devotional_reads (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    devotional_id UUID NOT NULL,
    user_id UUID REFERENCES auth.users(id) ON DELETE SET NULL, -- Nullable for anon
    session_id TEXT, -- For anonymous tracking
    created_at TIMESTAMPTZ DEFAULT now() NOT NULL
);

-- Indexes for performance
CREATE INDEX IF NOT EXISTS idx_devotional_reactions_devotional ON public.devotional_reactions(devotional_id);
CREATE INDEX IF NOT EXISTS idx_verse_reactions_lookup ON public.verse_reactions(book, chapter, verse);
CREATE INDEX IF NOT EXISTS idx_devotional_reads_lookup ON public.devotional_reads(devotional_id, created_at);

-- RLS Policies
ALTER TABLE public.devotional_reactions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.verse_reactions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.devotional_reads ENABLE ROW LEVEL SECURITY;

-- Devotional Reactions: Public Read, Owner Write
CREATE POLICY "Public read reactions" ON public.devotional_reactions FOR SELECT USING (true);
CREATE POLICY "Owner write reactions" ON public.devotional_reactions FOR ALL USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);

-- Verse Reactions: Public Read, Owner Write
CREATE POLICY "Public read verse reactions" ON public.verse_reactions FOR SELECT USING (true);
CREATE POLICY "Owner write verse reactions" ON public.verse_reactions FOR ALL USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);

-- Reads: Public Insert, Public Read
CREATE POLICY "Public read reads" ON public.devotional_reads FOR SELECT USING (true);
CREATE POLICY "Public insert reads" ON public.devotional_reads FOR INSERT WITH CHECK (true);

-- Functions (RPC) for Atomic Operations and Performance

-- RPC: toggle_devotional_reaction
DROP FUNCTION IF EXISTS toggle_devotional_reaction;
CREATE OR REPLACE FUNCTION toggle_devotional_reaction(_devotional_id UUID, _user_id UUID)
RETURNS JSONB
LANGUAGE plpgsql SECURITY DEFINER
AS $$
DECLARE
    v_exists BOOLEAN;
    v_count INT;
BEGIN
    -- Check if exists
    IF EXISTS (SELECT 1 FROM public.devotional_reactions WHERE devotional_id = _devotional_id AND user_id = _user_id) THEN
        DELETE FROM public.devotional_reactions WHERE devotional_id = _devotional_id AND user_id = _user_id;
        v_exists := false;
    ELSE
        INSERT INTO public.devotional_reactions (devotional_id, user_id) VALUES (_devotional_id, _user_id);
        v_exists := true;
    END IF;

    -- Get new count
    SELECT COUNT(*) INTO v_count FROM public.devotional_reactions WHERE devotional_id = _devotional_id;

    RETURN jsonb_build_object('reacted', v_exists, 'count', v_count);
END;
$$;

-- RPC: get_devotional_details (Likes + Views Today)
DROP FUNCTION IF EXISTS get_devotional_details;
CREATE OR REPLACE FUNCTION get_devotional_details(_devotional_id UUID, _user_id UUID DEFAULT NULL)
RETURNS JSONB
LANGUAGE plpgsql STABLE SECURITY DEFINER
AS $$
DECLARE
    v_likes INT;
    v_has_liked BOOLEAN;
    v_views_today INT;
    v_today TIMESTAMPTZ := date_trunc('day', now());
BEGIN
    -- Likes Count
    SELECT COUNT(*) INTO v_likes FROM public.devotional_reactions WHERE devotional_id = _devotional_id;
    
    -- Has Liked
    IF _user_id IS NOT NULL THEN
        SELECT EXISTS(SELECT 1 FROM public.devotional_reactions WHERE devotional_id = _devotional_id AND user_id = _user_id) INTO v_has_liked;
    ELSE
        v_has_liked := false;
    END IF;

    -- Views Today (Count unique session/user per day roughly, or just raw rows for simplicity as requested "X people read")
    -- We will count discrete reads for "Read Today"
    SELECT COUNT(*) INTO v_views_today 
    FROM public.devotional_reads 
    WHERE devotional_id = _devotional_id 
    AND created_at >= v_today;

    RETURN jsonb_build_object(
        'likes', v_likes, 
        'has_liked', v_has_liked, 
        'views_today', v_views_today
    );
END;
$$;

-- RPC: toggle_verse_reaction
DROP FUNCTION IF EXISTS toggle_verse_reaction;
CREATE OR REPLACE FUNCTION toggle_verse_reaction(_book TEXT, _chapter INT, _verse INT, _user_id UUID)
RETURNS JSONB
LANGUAGE plpgsql SECURITY DEFINER
AS $$
DECLARE
    v_exists BOOLEAN;
    v_count INT;
BEGIN
    IF EXISTS (SELECT 1 FROM public.verse_reactions WHERE book = _book AND chapter = _chapter AND verse = _verse AND user_id = _user_id) THEN
        DELETE FROM public.verse_reactions WHERE book = _book AND chapter = _chapter AND verse = _verse AND user_id = _user_id;
        v_exists := false;
    ELSE
        INSERT INTO public.verse_reactions (book, chapter, verse, user_id) VALUES (_book, _chapter, _verse, _user_id);
        v_exists := true;
    END IF;
    
    SELECT COUNT(*) INTO v_count FROM public.verse_reactions WHERE book = _book AND chapter = _chapter AND verse = _verse;

    RETURN jsonb_build_object('reacted', v_exists, 'count', v_count);
END;
$$;

-- RPC: get_chapter_stats
DROP FUNCTION IF EXISTS get_chapter_stats;
CREATE OR REPLACE FUNCTION get_chapter_stats(_book TEXT, _chapter INT, _user_id UUID DEFAULT NULL)
RETURNS TABLE (
    verse INT,
    count BIGINT,
    user_has_liked BOOLEAN
)
LANGUAGE sql STABLE SECURITY DEFINER
AS $$
    SELECT 
        vr.verse,
        COUNT(vr.id) as count,
        CASE 
            WHEN _user_id IS NOT NULL THEN bool_or(vr.user_id = _user_id)
            ELSE false
        END as user_has_liked
    FROM public.verse_reactions vr
    WHERE vr.book = _book AND vr.chapter = _chapter
    GROUP BY vr.verse;
$$;


-- Social Proof Tables

-- 1. Devotional Reactions (Amém / Likes)
CREATE TABLE IF NOT EXISTS public.devotional_reactions (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    devotional_id UUID NOT NULL, -- Assuming devotionals table exists or we reference purely by ID if no FK constraint strictness needed yet, but usually devotionals are in 'devotionals' table.
    -- Ideally: REFERENCES public.devotionals(id) ON DELETE CASCADE. 
    -- Since devotionals might be in a different schema or table not verified yet, I'll assume standard reference. 
    -- If devotionals table is 'devotionals' verify? `devotionals` table exists in previous context?
    -- Safest is just UUID for now if we aren't 100% on the parent table name, but usually it's `devotionals` or `posts`.
    -- Let's assume loose coupling or verify if possible.
    -- Context: `devotionals-get` edge function implies they might be just Supabase Auth users or separate table.
    -- Let's stick to UUID without strict FK if not sure, OR assume `devotionals` exists.
    -- Going with UUID only to avoid migration failure if table name differs.
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
    created_at TIMESTAMPTZ DEFAULT now() NOT NULL,
    UNIQUE(devotional_id, user_id)
);

-- 2. Verse Reactions (Amém per Verse)
CREATE TABLE IF NOT EXISTS public.verse_reactions (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    verse_ref TEXT NOT NULL, -- e.g "John 3:16"
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
    created_at TIMESTAMPTZ DEFAULT now() NOT NULL,
    UNIQUE(verse_ref, user_id)
);

-- 3. Devotional Reads (View Counts)
CREATE TABLE IF NOT EXISTS public.devotional_reads (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    devotional_id UUID NOT NULL,
    user_id UUID REFERENCES auth.users(id) ON DELETE SET NULL, -- Nullable for anon
    session_id TEXT, -- For anonymous tracking
    created_at TIMESTAMPTZ DEFAULT now() NOT NULL
);

-- RLS Policies

-- Enable RLS
ALTER TABLE public.devotional_reactions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.verse_reactions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.devotional_reads ENABLE ROW LEVEL SECURITY;

-- Devotional Reactions Policies
CREATE POLICY "Public select reactions" ON public.devotional_reactions
    FOR SELECT USING (true);

CREATE POLICY "Users can insert their own reaction" ON public.devotional_reactions
    FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete their own reaction" ON public.devotional_reactions
    FOR DELETE USING (auth.uid() = user_id);

-- Verse Reactions Policies
CREATE POLICY "Public select verse reactions" ON public.verse_reactions
    FOR SELECT USING (true);

CREATE POLICY "Users can insert their own verse reaction" ON public.verse_reactions
    FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete their own verse reaction" ON public.verse_reactions
    FOR DELETE USING (auth.uid() = user_id);

-- Reads Policies
CREATE POLICY "Public select reads" ON public.devotional_reads
    FOR SELECT USING (true);

CREATE POLICY "Public insert reads" ON public.devotional_reads
    FOR INSERT WITH CHECK (true); -- Anyone can log a read

-- Indexes for performance
CREATE INDEX IF NOT EXISTS idx_devotional_reactions_devotional_id ON public.devotional_reactions(devotional_id);
CREATE INDEX IF NOT EXISTS idx_verse_reactions_verse_ref ON public.verse_reactions(verse_ref);
CREATE INDEX IF NOT EXISTS idx_devotional_reads_devotional_id_created ON public.devotional_reads(devotional_id, created_at);

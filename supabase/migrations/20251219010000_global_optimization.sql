-- Global Database Optimization & Indexing
-- Date: 2025-12-19
-- Purpose: Enhance performance for feeds, user-specific history, and filtering.

-- 1. Prayer Requests Optimizations
-- Used for: Public Prayer Feed (filtering by status/new and visibility/public, sorting by date)
-- NOTE: 'visibility' column might be missing in some envs, falling back to 'status' + 'created_at'
CREATE INDEX IF NOT EXISTS idx_prayer_requests_feed 
ON public.prayer_requests (status, created_at DESC);

-- Used for: User specific lookups (if using device_id - skipped as column is missing in prod)
-- CREATE INDEX IF NOT EXISTS idx_prayer_requests_device 
-- ON public.prayer_requests (device_id);

-- 2. Social Proof Optimizations (User Centric Queries)
-- Used for: "My Liked Devotionals" / Checking if user liked specific items efficiently
CREATE INDEX IF NOT EXISTS idx_devotional_reactions_user 
ON public.devotional_reactions (user_id);

-- Used for: "My Liked Verses"
CREATE INDEX IF NOT EXISTS idx_verse_reactions_user 
ON public.verse_reactions (user_id);

-- Used for: "My Reading History"
-- Note: devotional_reads table might have been dropped/recreated, ensuring index exists.
CREATE INDEX IF NOT EXISTS idx_devotional_reads_user_history 
ON public.devotional_reads (user_id, created_at DESC);

-- 3. Bible Context Optimizations
-- Ensure partial matching on book name is fast if we ever move to SQL search
-- (Optional but good practice for text fields used in lookup)
CREATE INDEX IF NOT EXISTS idx_bible_books_name 
ON public.bible_books (name);

-- 4. Devotionals Lang/Date (Reinforcement)
-- Ensure we have cover for language + date lookups
CREATE INDEX IF NOT EXISTS idx_devotionals_lang_date_lookup 
ON public.devotionals (lang, published_at DESC);

-- 5. Update Statistics
-- Hints the Query Planner to update its stats on these active tables
ANALYZE public.prayer_requests;
ANALYZE public.devotionals;
ANALYZE public.bible_commentaries;
ANALYZE public.devotional_reactions;
ANALYZE public.verse_reactions;
ANALYZE public.bible_books;

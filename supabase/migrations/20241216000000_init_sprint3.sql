-- Create devotionals table
CREATE TABLE IF NOT EXISTS public.devotionals (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    title TEXT NOT NULL,
    subtitle TEXT,
    content_body TEXT NOT NULL,
    cover_image_url TEXT,
    published_at TIMESTAMPTZ DEFAULT now(),
    author_name TEXT DEFAULT 'Equipe Pastoral',
    verse_reference TEXT,
    lang TEXT DEFAULT 'pt',
    created_at TIMESTAMPTZ DEFAULT now(),
    updated_at TIMESTAMPTZ DEFAULT now()
);

-- Indexes for devotionals
CREATE INDEX IF NOT EXISTS idx_devotionals_published_at ON public.devotionals(published_at);
CREATE INDEX IF NOT EXISTS idx_devotionals_lang ON public.devotionals(lang);

-- RLS for devotionals
ALTER TABLE public.devotionals ENABLE ROW LEVEL SECURITY;

-- Policy: Public Read Published
DROP POLICY IF EXISTS "Allow public read access to published devotionals" ON public.devotionals;
CREATE POLICY "Allow public read access to published devotionals"
ON public.devotionals
FOR SELECT
TO public
USING (published_at <= now());


-- Create prayer_requests table
CREATE TABLE IF NOT EXISTS public.prayer_requests (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    request_type TEXT NOT NULL,
    description TEXT NOT NULL CHECK (char_length(description) >= 10),
    is_anonymous BOOLEAN DEFAULT false,
    visibility TEXT DEFAULT 'public', -- 'public' | 'private'
    preferred_contact TEXT DEFAULT 'whatsapp',
    status TEXT DEFAULT 'new',
    device_id TEXT,
    metadata JSONB DEFAULT '{}'::jsonb,
    created_at TIMESTAMPTZ DEFAULT now()
);

-- RLS for prayer_requests
ALTER TABLE public.prayer_requests ENABLE ROW LEVEL SECURITY;

-- Policy: Public Insert
DROP POLICY IF EXISTS "Allow public insert of prayer requests" ON public.prayer_requests;
CREATE POLICY "Allow public insert of prayer requests"
ON public.prayer_requests
FOR INSERT
TO public
WITH CHECK (true);

-- Policy: No Public Select (Secure by default)
-- Access will be via Edge Functions (Service Role) or specific authorized users later.

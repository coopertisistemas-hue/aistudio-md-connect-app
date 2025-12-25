-- Add cover_image_url column to churches table
-- This allows churches to have a cover image displayed in the SelectChurch page

ALTER TABLE public.churches
ADD COLUMN IF NOT EXISTS cover_image_url TEXT;

-- Add comment for documentation
COMMENT ON COLUMN public.churches.cover_image_url IS 'URL to the church cover image (optional)';

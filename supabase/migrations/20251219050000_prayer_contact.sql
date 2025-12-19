-- Migration: prayer_contact_methods
-- Description: Adds contact method, contact value, and consent fields to prayer_requests table.

DO $$
BEGIN
    -- Add contact_method
    ALTER TABLE public.prayer_requests ADD COLUMN IF NOT EXISTS contact_method TEXT DEFAULT 'none' NOT NULL CHECK (contact_method IN ('none', 'email', 'whatsapp'));
    
    -- Add contact_value (email or phone number)
    ALTER TABLE public.prayer_requests ADD COLUMN IF NOT EXISTS contact_value TEXT;
    
    -- Add consent_contact
    ALTER TABLE public.prayer_requests ADD COLUMN IF NOT EXISTS consent_contact BOOLEAN DEFAULT FALSE;

    -- Add validation to ensure contact_value is present if contact_method is not 'none'
    -- (Best effort check constraint)
    ALTER TABLE public.prayer_requests DROP CONSTRAINT IF EXISTS check_contact_value_presence;
    ALTER TABLE public.prayer_requests ADD CONSTRAINT check_contact_value_presence 
        CHECK (
            (contact_method = 'none') OR 
            (contact_method != 'none' AND contact_value IS NOT NULL AND consent_contact = TRUE)
        );

EXCEPTION
    WHEN duplicate_column THEN RAISE NOTICE 'Column already exists';
END $$;

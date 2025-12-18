-- Database Trigger for Automatic Bible Context Generation
-- 
-- GOAL: When a new devotional is inserted, check if its bible book has context data.
-- If not, trigger the 'generate-book-context' Edge Function.

-- Note: In Supabase, the best way to trigger an Edge Function from DB is via "Database Webhooks"
-- configured in the Dashboard (Database > Webhooks), because it handles the Auth Header safely.
-- However, we can define the *Trigger Function* logic here for documentation and manual attach.

-- 1. Function to parse book from devotional and notify
-- Uses pg_net extension if enabled, or just logs for now.

create or replace function public.handle_new_devotional_context()
returns trigger
language plpgsql
security definer
as $$
declare
    book_ref text;
    book_name text;
begin
    -- Extract potential book name from verse_reference (e.g. "Rm 8:28" -> "Rm")
    -- Simple split by space or number
    if new.verse_reference is not null then
        book_ref := split_part(new.verse_reference, ' ', 1);
        -- Note: This is a rough extraction. The Edge Function handles the heavy lifting/normalization.
        
        -- Send webhook to Edge Function
        -- We use a placeholder URL. YOU MUST UPDATE THIS OR USE DASHBOARD WEBHOOKS.
        -- perform net.http_post(
        --     url := 'https://YOUR_PROJECT_REF.supabase.co/functions/v1/generate-book-context',
        --     body := jsonb_build_object('book_name', book_ref)
        -- );
    end if;
    return new;
end;
$$;

-- 2. Create Trigger
create trigger on_devotional_created_check_context
    after insert on public.devotionals
    for each row
    execute function public.handle_new_devotional_context();

-- INSTRUCTIONS FOR USER:
-- To make this actually work live:
-- 1. Go to Supabase Dashboard > Database > Webhooks.
-- 2. Create a new Webhook.
-- 3. Name: "Auto Generate Context".
-- 4. Table: public.devotionals (INSERT).
-- 5. Type: HTTP Request.
-- 6. Method: POST.
-- 7. URL: [Your Project URL]/functions/v1/generate-book-context
-- 8. Header: Authorization = Bearer [Your Service Role Key]
-- 9. Body: { "book_name": "record.verse_reference" } (You might need a small transformer or modify the Edge Function to accept the raw record).

-- ADJUSTMENT FOR ROBUSTNESS: 
-- The Edge Function expects 'book_name'. Converting 'Rm 8:28' to 'Rm' in SQL is flaky.
-- BETTER: Direct the webhook to send the WHOLE record, and update Edge Function to parse it?
-- YES. Let's update the Edge Function to handle 'record' payload from standard Supabase Webhooks.

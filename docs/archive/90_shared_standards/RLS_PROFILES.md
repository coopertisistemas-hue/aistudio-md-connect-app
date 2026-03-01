# RLS Fix for Profiles Table

## Problem
The `profiles` table had a Row Level Security (RLS) policy that caused an infinite recursion error (`42P17`). This happens when a policy on Table A tries to Query Table A to determine access (e.g., checking if the current user is an admin by querying their profile in the same table).

## Solution
We removed the recursive policies and implemented a cleaner, strictly segregated access model.

### New Policies

1.  **Users can view own profile**:
    - `USING ( auth.uid() = id )`
    - Simple ID match. No recursion.

2.  **Users can update own profile**:
    - `USING ( auth.uid() = id )`

3.  **Admins can view all profiles**:
    - Instead of checking `profiles.role`, we now check the `access_profiles` table.
    - `USING ( EXISTS (SELECT 1 FROM access_profiles WHERE user_id = auth.uid() AND role IN ('SuperAdmin', 'Pastor')) )`
    - This breaks the loop because we query Table B (`access_profiles`) to allow access to Table A (`profiles`).

## How to Apply
Run the migration file `supabase/migrations/20240101000006_fix_rls_recursion.sql` in your Supabase SQL Editor or via CLI (`supabase db push`).

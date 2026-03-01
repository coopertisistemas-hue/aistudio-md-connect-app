# Deno DX for Supabase Edge Functions

## Problem

VS Code shows Deno import warnings for `https://deno.land/` and `https://esm.sh/` modules in `supabase/functions/`, even though runtime works correctly.

## Solution

Configured workspace so VS Code + Deno extension correctly understands Supabase Edge Functions.

## Files Modified

| File | Purpose |
|------|---------|
| `.vscode/settings.json` | Enables Deno extension with proper import map |
| `supabase/functions/deno.json` | Adds import mappings for `esm.sh` and `deno.land` |

## Setup Steps

1. Install VS Code Deno extension:
   - Open VS Code Extensions (`Ctrl+Shift+X`)
   - Search for "Deno" by Deno Land
   - Install the extension

2. Reload VS Code:
   - Press `Ctrl+Shift+P`
   - Type "Developer: Reload Window"
   - Press Enter

3. Open any file in `supabase/functions/`:
   - The import warnings should be resolved
   - IntelliSense should work for Deno APIs
   - Type checking should work

## Expected Result

- No more red squiggles on imports like `https://esm.sh/@supabase/supabase-js@2`
- Hover tooltips work on imports
- Go-to-definition works on local imports (`../_shared/...`)
- Lint errors shown inline (if any)

## Verification

Open `supabase/functions/devotionals-get/index.ts` and verify:
- Imports show no warnings
- `Deno.serve()` has proper type hints
- `createClient` from esm.sh resolves correctly

# Edge Contract Smoke Gate

## Purpose

Validates that all Supabase Edge Functions return the standardized response shape:

```typescript
// Success
{ ok: true, data: ... }

// Error
{ ok: false, error: { code: string, message: string } }
```

## Prerequisites

1. **Supabase CLI installed:**
   ```bash
   npm install -g supabase
   ```

2. **Local Supabase running:**
   ```bash
   pnpm supabase:start
   ```

## Usage

```bash
# Run with default settings (localhost:54321)
powershell -ExecutionPolicy Bypass -File scripts\edge-smoke.ps1

# Run with custom base URL
powershell -ExecutionPolicy Bypass -File scripts\edge-smoke.ps1 -BaseUrl "https://your-project.functions.supabase.co"
```

## What It Tests

| Test | Endpoint | Expected Result |
|------|----------|-----------------|
| 1 | `devotionals-get?latest=true` | Success with data |
| 2 | `devotionals-get?latest=invalid` | Success (empty list) |
| 3 | `public-monetization-services` | Success with data |
| 4 | `invalid-function-xyz` | Error response |
| 5 | `church-series-list` (no context) | Error with code + message |

## Exit Codes

- `0` — All contract checks passed
- `1` — One or more checks failed

## Contract Rules

The smoke gate validates:

1. **Response has `ok` field** — boolean, required
2. **Success response** — `ok: true` + optional `data` field
3. **Error response** — `ok: false` + `error.code` + `error.message`
4. **No secrets leaked** — error.message must be safe (not raw exception)

## Integration

Add to CI/CD pipeline or run manually before deploying:

```bash
# In package.json scripts
"smoke:edge": "powershell -ExecutionPolicy Bypass -File scripts\\edge-smoke.ps1"
```

## Troubleshooting

### "Local Supabase not reachable"

Start local Supabase:
```bash
pnpm supabase:start
```

### "Could not detect local Supabase project"

Ensure `.temp/project-ref` exists (created by `supabase:start`).

### Custom function not tested

Edit `scripts/edge-smoke.ps1` to add more endpoints to the test list.

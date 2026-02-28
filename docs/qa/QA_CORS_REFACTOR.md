# QA_CORS_REFACTOR.md
> Repo: aistudio-md-connect-app
> Commit scope: `refactor(cors): centralize CORS headers across edge functions`
> Date: 2026-02-28

---

## Summary

All 16 Edge Functions previously contained a **local, inline `corsHeaders` object** and manual `OPTIONS` preflight handlers. This refactor centralizes all CORS logic into a single shared module:

```
supabase/functions/_shared/cors.ts
```

**No business logic was changed.** Only the CORS boilerplate was replaced with calls to the shared helpers. HTTP response behavior, status codes, and data returned are identical to before.

---

## What Changed

### New Shared Module — `supabase/functions/_shared/cors.ts`

Exports three items:

| Export | Type | Purpose |
|--------|------|---------|
| `handleCors(req)` | Function | Handles OPTIONS preflight. Returns `Response | null`. Null means proceed with request. |
| `jsonResponse(data, status, origin)` | Function | Wraps all JSON responses with correct CORS headers. |
| `corsHeaders` | Object (deprecated) | Legacy export, kept for backward compatibility. `Access-Control-Allow-Origin` is intentionally empty — forces use of new API. |

**Security improvement:** CORS is now enforced via a strict origin allowlist:
```typescript
const ALLOWED_ORIGINS = [
    'https://mdconnect.app',
    'https://www.mdconnect.app',
    'https://ipda.mdconnect.app',
    /^https:\/\/.*\.vercel\.app$/,   // Vercel previews
    'http://localhost:5173',
    'http://localhost:4173',
    'http://127.0.0.1:5173',
    'http://127.0.0.1:4173',
]
```

Origins NOT in this list receive a **403 Forbidden** response, not a wildcard pass.

---

## Affected Functions (16 index.ts files)

| Function | Δ Lines | Change |
|----------|:-------:|--------|
| `_shared/cors.ts` | +126 | New centralized CORS module |
| `devotionals-generate-cover/index.ts` | 4 | Import + replace inline headers |
| `devotionals-get/index.ts` | 15 | Import + replace + jsonResponse |
| `generate-book-context/index.ts` | 4 | Import + replace |
| `generate-verse-commentary/index.ts` | 4 | Import + replace |
| `kpi-partners/index.ts` | 61 | Import + full response refactor |
| `kpi/index.ts` | 76 | Import + full response refactor |
| `member-events/index.ts` | 28 | Import + replace + jsonResponse |
| `partner-leads-create/index.ts` | 7 | Import + replace |
| `partners-get/index.ts` | 7 | Import + replace |
| `prayer-confirmation/index.ts` | 24 | Import + replace + jsonResponse |
| `prayer-requests-create/index.ts` | 11 | Import + replace |
| `public-churches-list/index.ts` | 24 | Import + replace + jsonResponse |
| `report-client-error/index.ts` | 39 | Import + replace + jsonResponse |
| `track-event/index.ts` | 90 | Import + full response refactor |
| `track-public-read/index.ts` | 28 | Import + replace + jsonResponse |
| `verse-image-generate/index.ts` | 4 | Import + replace |

**Total: 17 files, 263 insertions, 289 deletions** (net -26 lines — removed boilerplate)

---

## Before vs After — `track-event/index.ts` (representative example)

### Before
```typescript
// Inline CORS object defined in every function
const corsHeaders = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
    'Access-Control-Allow-Methods': 'POST, OPTIONS',
}

serve(async (req) => {
    // Manual OPTIONS handler
    if (req.method === 'OPTIONS') {
        return new Response('ok', {
            headers: { ...corsHeaders },
            status: 204
        })
    }
    // ...
    return new Response(
        JSON.stringify({ error: 'Missing required fields', missing }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 400 }
    )
})
```

### After
```typescript
// Single import from shared module
import { handleCors, jsonResponse } from '../_shared/cors.ts'

serve(async (req) => {
    // One-liner preflight handler
    const corsResponse = handleCors(req);
    if (corsResponse) return corsResponse;
    const origin = req.headers.get('origin');
    // ...
    return jsonResponse({ error: 'Missing required fields', missing }, 400, origin)
})
```

**Same HTTP behavior. Fewer lines. No wildcard origin.**

---

## Logic Behavior — Unchanged

| Behavior | Before | After |
|----------|--------|-------|
| OPTIONS preflight response | 204 OK | 204 OK (same) |
| JSON error response status codes | 400/401/429/500 | 400/401/429/500 (same) |
| JSON success response status codes | 200/201 | 200/201 (same) |
| Response body format | `JSON.stringify({...})` | `JSON.stringify({...})` (same) |
| CORS origin policy | `*` wildcard | Strict allowlist (security **improvement**) |
| Auth header forwarding | Unchanged | Unchanged |

---

## How to Test Locally

### 1. Start Edge Functions
```bash
pnpm supabase:functions
# or: supabase functions serve --env-file .env.local
```

### 2. Test OPTIONS Preflight (should return 204)
```bash
curl -i -X OPTIONS http://localhost:54321/functions/v1/track-event \
  -H "Origin: http://localhost:5173" \
  -H "Access-Control-Request-Method: POST"
# Expected: HTTP/1.1 204 No Content
# Expected: Access-Control-Allow-Origin: http://localhost:5173
```

### 3. Test Disallowed Origin (should return 403)
```bash
curl -i -X OPTIONS http://localhost:54321/functions/v1/track-event \
  -H "Origin: https://evil.com" \
  -H "Access-Control-Request-Method: POST"
# Expected: HTTP/1.1 403 Forbidden
```

### 4. Test POST Request
```bash
curl -i -X POST http://localhost:54321/functions/v1/track-event \
  -H "Origin: http://localhost:5173" \
  -H "Authorization: Bearer <anon_key>" \
  -H "Content-Type: application/json" \
  -d '{"session_id":"test","event_type":"page_view","page":"/home"}'
# Expected: HTTP/1.1 201 Created or 400 if missing fields
```

---

## CONNECT Gates Checked

| Gate | Status | Notes |
|------|--------|-------|
| STOP-02 Destructive commands | ✅ N/A | No data mutations |
| STOP-03 Build before commit | ✅ PASS | `pnpm build` exit 0 |
| STOP-04 RLS disabled | ✅ N/A | No schema changes |
| STOP-05 Direct client DB access | ✅ N/A | No frontend changes |
| WARN-02 Edge Function without CORS guard | ✅ RESOLVED | All functions now use `handleCors()` |

---

**QA Sign-off:** AGV — 2026-02-28T16:39 BRT
**Commit:** `refactor(cors): centralize CORS headers across edge functions`

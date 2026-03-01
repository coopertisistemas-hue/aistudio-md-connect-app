# QA_SP9A_EDGE_DEVOTIONALS_STABILITY.md

> Repo: aistudio-md-connect-app
> Sprint: SP9-A — Devotionals Core Hardening
> Commit: `refactor(edge): harden devotional edge functions (timeouts + stability)`
> Date: 2026-03-01

---

## Objective

Improve stability, predictability, and operational safety of devotional-related Supabase Edge Functions. No visible feature changes. No API contract changes. No payload structure changes.

---

## Scope

Only the following functions:
- devotionals-get
- devotionals-generate-cover
- generate-verse-commentary
- generate-book-context

---

## Phase 1 — Stability Audit

### Findings

| Function | CORS Handler | Error Helper | Consistent Shape | No Stack Trace | No Raw Error |
|----------|-------------|--------------|------------------|----------------|--------------|
| devotionals-get | ✅ handleCors | ✅ errBody/ERR | ✅ { ok, data/error } | ✅ | ✅ |
| devotionals-generate-cover | ✅ handleCors | ✅ errBody/ERR | ✅ { ok, data/error } | ✅ | ✅ |
| generate-verse-commentary | ✅ handleCors | ✅ errBody/ERR | ✅ { ok, data/error } | ✅ | ✅ |
| generate-book-context | ✅ handleCors | ✅ errBody/ERR | ✅ { ok, data/error } | ✅ | ✅ |

**Conclusion:** All functions already use standardized error handling. No contract changes needed.

---

## Phase 2 — Timeout & Guard Layer

### Strategy

Added a reusable `withTimeout<T>` helper function to all functions with external/AI calls:

```typescript
const TIMEOUT_MS = 12000 // 12 seconds

async function withTimeout<T>(promise: Promise<T>, ms: number, operation: string): Promise<T> {
    const timeout = new Promise<never>((_, reject) => 
        setTimeout(() => reject(new Error(`${operation} timed out after ${ms}ms`)), ms)
    )
    try {
        return await Promise.race([promise, timeout])
    } catch (err: any) {
        if (err.message.includes('timed out')) {
            console.error(`[function-name] Timeout: ${operation}`)
            throw new Error('Request timed out')
        }
        throw err
    }
}
```

### Protected Operations

| Function | Protected Operations |
|----------|---------------------|
| devotionals-get | All DB queries (fetch by id, today devotional, latest devotional, list) |
| devotionals-generate-cover | Fetch devotional, fetch image, upload to storage, update record |
| generate-verse-commentary | Check existing, call OpenAI, insert commentary |
| generate-book-context | Check existing, call OpenAI, insert book data |

### Timeout Behavior

- **Timeout value:** 12 seconds (12000ms)
- **On timeout:** Throws safe error caught by catch block
- **Response:** `{ ok: false, error: { code: 'INTERNAL', message: 'Internal error' } }`
- **Log:** `[function-name] Timeout: <operation>` (for debugging)

---

## Phase 3 — Response Size & Safety

### Analysis

| Function | Response Source | Size Bounded? |
|----------|-----------------|----------------|
| devotionals-get | DB columns (fixed) | ✅ Yes |
| devotionals-generate-cover | Storage URL (fixed) | ✅ Yes |
| generate-verse-commentary | AI JSON schema (prompt-defined) | ✅ Yes |
| generate-book-context | AI JSON schema (prompt-defined) | ✅ Yes |

**Conclusion:** All responses are inherently bounded. No truncation needed.

---

## Phase 4 — Cache Headers (devotionals-get only)

### Decision

Added short-term cache headers to `devotionals-get`:

```typescript
function jsonResponseWithCache(data: unknown, status = 200, requestOrigin: string | null = null): Response {
    const response = jsonResponse(data, status, requestOrigin)
    response.headers.set('Cache-Control', 'public, max-age=300, s-maxage=600')
    return response
}
```

**Cache Strategy:**
- `max-age=300` — Client cache: 5 minutes
- `s-maxage=600` — CDN/proxy cache: 10 minutes

**Rationale:** Devotionals change infrequently. Short-term caching improves performance without stale data risk.

### Generation Endpoints (NOT cached)

The following endpoints intentionally do NOT have cache headers:
- devotionals-generate-cover
- generate-verse-commentary
- generate-book-context

These are mutation/generation endpoints where fresh data is always required.

---

## No Contract Changes Confirmed

- ✅ Response shape unchanged: `{ ok: true, data: ... }` / `{ ok: false, error: { code, message } }`
- ✅ Error codes unchanged: ERR.INTERNAL, ERR.NOT_FOUND, etc.
- ✅ No new fields added to responses
- ✅ No field removals

---

## Gate Evidence (verbatim)

### pnpm type-check
```
> member-app@0.0.0 type-check
> tsc -b --noEmit

Exit code: 0
```

### pnpm build
```
> member-app@0.0.0 build
> tsc -b && vite build

✓ built in 9.21s

Exit code: 0
```

---

## CONNECT Gates

| Gate | Status |
|------|--------|
| `pnpm type-check` | ✅ exit 0 |
| `pnpm build` | ✅ exit 0 |
| No API contract changes | ✅ confirmed |
| No payload structure changes | ✅ confirmed |
| No visible feature changes | ✅ confirmed |
| Timeout protection added | ✅ 12s on all external calls |
| Cache headers on devotionals-get | ✅ public, max-age=300, s-maxage=600 |
| Generation endpoints uncached | ✅ confirmed |

---

## Summary of Changes

| File | Change |
|------|--------|
| `supabase/functions/devotionals-get/index.ts` | Added timeout wrapper + cache headers |
| `supabase/functions/devotionals-generate-cover/index.ts` | Added timeout wrapper |
| `supabase/functions/generate-verse-commentary/index.ts` | Added timeout wrapper |
| `supabase/functions/generate-book-context/index.ts` | Added timeout wrapper |

---

**QA Sign-off:** AGV — 2026-03-01

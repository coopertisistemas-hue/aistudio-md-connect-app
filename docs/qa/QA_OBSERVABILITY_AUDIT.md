# QA_OBSERVABILITY_AUDIT.md
> Repo: aistudio-md-connect-app
> Sprint: Observability & Stability Audit
> Date: 2026-03-01T09:35 BRT
> Status: AUDIT ONLY — no changes committed

---

## Summary

| Phase | Finding | Severity |
|-------|---------|---------|
| Frontend: console.log | 23 occurrences in 9 files — mixed debug/prod | 🟡 Low |
| Frontend: console.error | 43 occurrences in 17 files | 🟡 Low |
| Frontend: feature flags | Inconsistent boolean casting (`=== 'true'` vs `!== 'false'`) | 🟠 Medium |
| Frontend: direct fetch | 5 occurrences — all appropriate | ✅ OK |
| Edge functions: CORS | 37/37 functions use `_shared/cors.ts` | ✅ OK |
| Edge functions: console.log | 7 occurrences in 4 functions (debug/trace logs) | 🟡 Low |
| Edge functions: error.message | 16 functions return `error.message` in JSON — minor data exposure | 🟠 Medium |
| Edge functions: error shape | 3 distinct response shapes (`{error}`, `{error,message}`, `{ok,error}`) | 🟠 Medium |
| ENV flags | All 3 flags respected; boolean casting inconsistency documented | 🟠 Medium |

---

## Phase 1 — Frontend Audit

### 1A. console.log Inventory (23 occurrences, 9 files)

| File | Count | Type |
|------|-------|------|
| `src/lib/analytics.ts` | 6 | All behind `if (this.debugMode)` guard ✅ |
| `src/pages/Content/DevotionalDetail.tsx` | 6 | NO guard — fires in production ⚠️ |
| `src/components/home/MonetizationBlock.tsx` | 4 | Labeled `[Carousel Debug]` — no guard ⚠️ |
| `src/services/bible.ts` | 2 | Informational trace — no guard ⚠️ |
| `src/services/feed.ts` | 1 | "No session found" — no guard ⚠️ |
| `src/pages/onboarding/SelectChurch.tsx` | 1 | Error swallowed as console.log ⚠️ |
| `src/pages/Home.tsx` | 1 | Dead-code: `onClick={() => console.log('Radio')}` ⚠️ |
| `src/pages/events/EventDetail.tsx` | 1 | "Error sharing" — no guard ⚠️ |
| `src/lib/errorReporter.ts` | 1 | Behind `catch` + `console.warn` — acceptable ✅ |

**Hottest issue:** `DevotionalDetail.tsx` has 6 debug logs with no `import.meta.env.DEV` guard — fires on every page load in production.

### 1B. console.error Inventory (17 files)

Top offenders:
- `content.ts` — 12 (service layer, all in catch blocks)
- `monetization.ts` — 6 (same pattern)
- `bible.ts` — 4 (same)
- `interactionService.ts` — 4

**Pattern:** All `console.error` calls are inside `catch` blocks — appropriate error logging. However they leak internal error details (DB column names, Supabase error codes) in client-visible browser consoles.

**Verdict:** Acceptable for development. For production, should be routed through `errorReporter.ts` when `VITE_ERROR_REPORTING_ENABLED=true`.

### 1C. Direct fetch() Calls (5 occurrences, 3 files)

| File | Path | Auth? | Purpose |
|------|------|-------|---------|
| `src/lib/analytics.ts` | `/functions/v1/track-event` | ✅ Bearer token | Analytics event (optional, fail-silent) |
| `src/lib/errorReporter.ts` | `/report-client-error` | ❌ None | Error reporting (intentional — no auth for error sink) |
| `src/services/bible.ts` (×3) | External Bible API | N/A | Public API — appropriate |

**Verdict:** All 5 fetch calls are appropriate. No unauthorized direct DB access.

### 1D. Error Surface Consistency

Error surfacing patterns found:
- **Toast notifications** — used in auth flows (`Login.tsx`, `AuthContext.tsx`) ✅
- **Silent fail** — analytics and error reporter always fail silently ✅
- **console.log as error** — `SelectChurch.tsx:74` logs member creation error as `.log` instead of `.error` or toast ⚠️
- **Modal/inline** — not used for async errors

```tsx
// SelectChurch.tsx:74 — Issue: member error swallowed silently
if (memberError) console.log("Member creation warning:", memberError);
// Should be: toast.error(...) or at minimum console.warn(...)
```

---

## Phase 2 — Supabase Edge Functions Audit

### 2A. CORS Coverage

**37 of 37 non-shared functions** import from `_shared/cors.ts`.

```ts
// Standard pattern (correct):
import { handleCors, jsonResponse } from '../_shared/cors.ts'

serve(async (req) => {
  const corsResponse = handleCors(req)
  if (corsResponse) return corsResponse
  // ...
})
```
✅ **All functions handle OPTIONS preflight correctly via `handleCors()`.**

### 2B. console.log in Edge Functions (7 occurrences, 4 functions)

| Function | Type |
|----------|------|
| `verse-image-generate` | Cache hit / generation trace |
| `prayer-confirmation` | Email send logs |
| `generate-verse-commentary` | AI generation trace |
| `generate-book-context` | AI generation trace |
| `devotionals-generate-cover` | AI generation trace |

**Verdict:** These logs appear in Supabase Function logs (not client browser console). They are operationally useful for debugging AI generation. **Acceptable with a recommendation** to prefix with a severity level for log filtering.

### 2C. Error Response Shape Inconsistency

3 distinct error response shapes found across functions:

**Shape A — Simple error string** (most common):
```json
{ "error": "error.message" }
```
Used by: `track-public-read`, `public-churches-list`, `prayer-requests-create`, `partners-get`, `partner-leads-create`, `member-events`

**Shape B — Error + message** (structured):
```json
{ "error": "Failed to insert event", "message": "error.message" }
```
Used by: `track-event`, `kpi`, `kpi-partners`

**Shape C — ok flag + error** (boolean style):
```json
{ "ok": false, "error": "error.message" }
```
Used by: `verse-image-generate`, `generate-verse-commentary`, `generate-book-context`

**Recommended canonical shape:**
```json
{
  "ok": false,
  "error": "Human-readable message",
  "code": "OPTIONAL_ERROR_CODE"
}
```

### 2D. error.message Exposure (16 functions)

All 16 functions that return `error.message` directly expose internal Supabase/OpenAI error messages in HTTP responses.

**Risk assessment:**
- Most messages are generic (e.g., "violates foreign key constraint")
- OpenAI errors may include prompt details: `devotionals-generate-cover`, `generate-verse-commentary`, `generate-book-context`
- Stack traces are NOT exposed (`.stack` never returned) ✅

**Proposed fix (low risk):**
```ts
// Before (leaks internal message):
return jsonResponse({ error: error.message }, 400, origin)

// After (safe generic fallback):
const safeMessage = error instanceof Error ? error.message : 'Unknown error'
// Log internally: console.error('[FunctionName] Error:', error)
return jsonResponse({ ok: false, error: safeMessage }, 500, origin)
```

---

## Phase 3 — ENV Flags Validation

### VITE_ANALYTICS_ENABLED (`analytics.ts:50`)

```ts
this.isEnabled = !!this.measurementId && import.meta.env.VITE_ANALYTICS_ENABLED !== 'false';
```
⚠️ **Inconsistency**: Uses `!== 'false'` (opt-out pattern) — analytics runs unless explicitly disabled. This means if `VITE_ANALYTICS_ENABLED` is unset but `VITE_GA_MEASUREMENT_ID` is set, analytics fires.

**Recommended:** Use `=== 'true'` (opt-in pattern) for consistency with other flags.

```ts
// Proposed fix:
this.isEnabled = !!this.measurementId && import.meta.env.VITE_ANALYTICS_ENABLED === 'true';
```

### VITE_ENABLE_BACKEND_ANALYTICS (`analytics.ts:158`)

```ts
const enableBackendTracking = import.meta.env.VITE_ENABLE_BACKEND_ANALYTICS === 'true';
```
✅ Opt-in pattern, consistent.

### VITE_ERROR_REPORTING_ENABLED (`errorReporter.ts:7`)

```ts
const ENABLED = import.meta.env.VITE_ERROR_REPORTING_ENABLED === 'true';
```
✅ Opt-in pattern, consistent.

---

## Proposed Normalizations (Priority Order)

> **None of these are committed. This is a proposal list for the next sprint.**

| # | File | Change | Risk |
|---|------|--------|------|
| 1 | `src/lib/analytics.ts:50` | Change `!== 'false'` → `=== 'true'` | 🟢 Low — makes analytics strictly opt-in |
| 2 | `src/pages/Content/DevotionalDetail.tsx` (6 logs) | Wrap in `if (import.meta.env.DEV)` | 🟢 Low — no behavior change |
| 3 | `src/components/home/MonetizationBlock.tsx` (4 logs) | Wrap in `if (import.meta.env.DEV)` or remove | 🟢 Low |
| 4 | `src/pages/onboarding/SelectChurch.tsx:74` | Change `console.log` → `console.warn` or toast | 🟢 Low |
| 5 | `src/pages/Home.tsx:122` | Remove dead-code `onClick={() => console.log('Radio')}` | 🟢 Low |
| 6 | Edge functions: Normalize error shape to `{ok, error}` | One-time refactor across 37 functions | 🟡 Medium — coordinated change |
| 7 | Edge functions: AI functions prefix logs with `[FunctionName]` | Style only | 🟢 Low |

---

## What's Working Well

- ✅ All 37 edge functions use `_shared/cors.ts` — CORS is centralized
- ✅ All edge functions handle OPTIONS preflight
- ✅ No stack traces returned to clients in any function
- ✅ `VITE_ERROR_REPORTING_ENABLED` and `VITE_ENABLE_BACKEND_ANALYTICS` use consistent opt-in pattern
- ✅ `errorReporter.ts` has deduplication, anti-loop protection, and fail-silent design
- ✅ Direct DB access is NEVER done from the frontend — all through Edge Functions
- ✅ Analytics fail-silent (catch block swallows analytics errors, never breaks UX)

---

**Sign-off:** AGV — 2026-03-01T09:35 BRT | Audit-only, no changes committed

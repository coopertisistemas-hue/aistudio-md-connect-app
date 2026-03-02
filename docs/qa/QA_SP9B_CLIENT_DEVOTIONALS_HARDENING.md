# QA_SP9B_CLIENT_DEVOTIONALS_HARDENING.md

> Repo: aistudio-md-connect-app
> Sprint: SP9-B — Client Consumption Hardening (Devotionals)
> Commit: `chore(ux): harden devotional fetch states (loading/error/timeout)`
> Date: 2026-03-02

---

## Objective

Harden frontend devotional consumption to avoid blank screens, silent failures, or infinite loading. No new features. Only defensive UX and resilience.

---

## Scope

Frontend callers of devotional-related edge endpoints:
- devotionals-get
- devotionals-generate-cover
- generate-verse-commentary
- generate-book-context

---

## Files Touched

| File | Change |
|------|--------|
| `src/lib/api/devotionals.ts` | Added timeout wrapper (12s) + error parsing for `{ ok: false }` |
| `src/pages/Content/DevotionalDetail.tsx` | Added error state + retry CTA |
| `src/pages/Content/DevotionalList.tsx` | Added error state + retry CTA |
| `src/services/bible.ts` | Added timeout wrapper (12s) for generate-verse-commentary |

---

## Changes Applied

### 1. Loading States

All devotional screens now have clear loading UI:

| Page | Loading UI |
|------|-----------|
| DevotionalDetail | Spinner + "Carregando..." |
| DevotionalList | Spinner + "Carregando inspiração..." |

### 2. Error States

| Page | Error UI |
|------|----------|
| DevotionalDetail | Error icon + message + retry button |
| DevotionalList | Error icon + message + retry button |

Error handling covers:
- `{ ok: false }` responses from API
- Network errors
- Timeouts (12s client-side)

### 3. Timeout Handling

| Component | Timeout Value |
|-----------|---------------|
| devotionalsApi | 12s (12000ms) |
| bible.ts (AI calls) | 12s (12000ms) |

On timeout:
- Shows error message
- Provides retry button
- Falls back to cached data if available

### 4. Safe Parsing

API layer now properly handles edge function responses:

```typescript
// Before: Assumed data existed
return data as Post;

// After: Validates ok === true
if (result.ok === false) {
    return { data: null, error: { message: result.error?.message } };
}
return { data: result.data as T, error: null };
```

---

## Test Scenarios

### Scenario 1: Success (ok: true)
- Loading spinner shows
- Content renders
- Error state hidden

### Scenario 2: API Error (ok: false)
- Loading spinner shows
- Error message displays: "Não foi possível carregar"
- Retry button visible
- Click retry -> reloads data

### Scenario 3: Network Down
- Loading spinner shows
- Error message: "Network error" or "Request timed out"
- Retry button visible

### Scenario 4: Timeout (12s)
- Loading spinner shows
- Error message: "Request timed out"
- Retry button visible

---

## No Contract Changes Confirmed

- API response shape unchanged: `{ ok: true, data: ... }` / `{ ok: false, error: { code, message } }`
- No new fields added to responses
- No field removals
- Frontend behavior: only adds error UI, does not change success paths

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

✓ built in 8.68s

Exit code: 0
```

---

## CONNECT Gates

| Gate | Status |
|------|--------|
| `pnpm type-check` | ✅ exit 0 |
| `pnpm build` | ✅ exit 0 |
| No contract changes | ✅ confirmed |
| Loading states | ✅ added to all pages |
| Error states with retry | ✅ added to all pages |
| Client-side timeout (12s) | ✅ implemented |
| Safe parsing | ✅ implemented |

---

**QA Sign-off:** AGV — 2026-03-02

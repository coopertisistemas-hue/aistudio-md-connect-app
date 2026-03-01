# QA_OBSERVABILITY_NORMALIZATION_LOW_RISK.md
> Repo: aistudio-md-connect-app
> Sprint: Observability Normalization — Low Risk (Items 1–5)
> Commit: `chore(obs): normalize analytics flag + guard debug logs`
> Date: 2026-03-01T09:57 BRT

---

## Confirmation: No Edge Function Response Shapes Changed

✅ Zero files in `supabase/functions/` were modified in this sprint.

---

## Summary of Changes

### Item 1 — `src/lib/analytics.ts`

**Before:**
```ts
this.isEnabled = !!this.measurementId && import.meta.env.VITE_ANALYTICS_ENABLED !== 'false';
```
**After:**
```ts
this.isEnabled = !!this.measurementId && import.meta.env.VITE_ANALYTICS_ENABLED === 'true';
```

**Why:** Opt-out pattern meant analytics fired when `VITE_ANALYTICS_ENABLED` was unset but a GA Measurement ID was present. Now analytics is strictly opt-in — consistent with `VITE_ENABLE_BACKEND_ANALYTICS` and `VITE_ERROR_REPORTING_ENABLED`.

---

### Item 2 — `src/pages/Content/DevotionalDetail.tsx`

Wrapped 6 `console.log` calls with `if (import.meta.env.DEV)`:

| Line | Log Message |
|------|------------|
| 33 | `[DevotionalDetail] Loading:` |
| 44 | `[DevotionalDetail] loadData started:` |
| 56 | `[DevotionalDetail] Using API` |
| 69 | `[DevotionalDetail] Using legacy path` |
| 79 | `[DevotionalDetail] Data loaded:` |
| 92 | `[DevotionalDetail] Loading complete` |

No logs removed — all preserved for development debugging. `console.error` calls (catch blocks) left unchanged.

---

### Item 3 — `src/components/home/MonetizationBlock.tsx`

Wrapped 4 `[Carousel Debug]` `console.log` calls with `if (import.meta.env.DEV)`:

| Line | Log Message |
|------|------------|
| 66 | `[Carousel Debug] Effect triggered` |
| 75 | `[Carousel Debug] Early return - no container or no items` |
| 101 | `[Carousel Debug] Starting animation` |
| 105 | `[Carousel Debug] Cleanup - canceling animation` |

These fired on every `requestAnimationFrame` cycle in production — significant noise now silenced.

---

### Item 4 — `src/pages/onboarding/SelectChurch.tsx`

**Before:**
```ts
if (memberError) console.log("Member creation warning:", memberError);
```
**After:**
```ts
if (memberError && import.meta.env.DEV) console.warn("Member creation warning:", memberError);
```

- Changed `console.log` → `console.warn` (correct severity for a handled warning)
- Added DEV guard (diagnostic-only — RLS block is expected behavior in many envs)

---

### Item 5 — `src/pages/Home.tsx`

**Before:**
```tsx
<button onClick={() => console.log('Radio')} className="...">
    Ouvir Rádio Deus é Amor
```
**After:**
```tsx
<button className="...">
    Ouvir Rádio Deus é Amor
```

Dead-code callback removed. Button remains in UI — the real Radio handler will be implemented in a future sprint.

---

## Files Changed

| File | Change |
|------|--------|
| `src/lib/analytics.ts` | Analytics flag: opt-out → opt-in |
| `src/pages/Content/DevotionalDetail.tsx` | 6 console.log wrapped in DEV guard |
| `src/components/home/MonetizationBlock.tsx` | 4 console.log wrapped in DEV guard |
| `src/pages/onboarding/SelectChurch.tsx` | console.log → console.warn + DEV guard |
| `src/pages/Home.tsx` | Dead-code onClick removed |
| `docs/qa/QA_OBSERVABILITY_NORMALIZATION_LOW_RISK.md` | This file |

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

✓ built in 9.38s
Exit code: 0
```

---

## CONNECT Gates

| Gate | Status |
|------|--------|
| STOP-03 `pnpm build` | ✅ exit 0 — 9.38s |
| `pnpm type-check` | ✅ exit 0 |
| No `supabase/functions/` modified | ✅ confirmed |
| No edge function response shapes changed | ✅ confirmed |
| No runtime behavior changed (only logging/flag) | ✅ confirmed |

---

**QA Sign-off:** AGV — 2026-03-01T09:57 BRT

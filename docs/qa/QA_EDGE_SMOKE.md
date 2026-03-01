# QA_EDGE_SMOKE.md

> Repo: aistudio-md-connect-app
> Sprint: Edge Contract Smoke Gate
> Commit: `chore(ops): add edge contract smoke gate`
> Date: 2026-03-01

---

## Purpose

Added automated validation script to verify edge functions return standardized response shape `{ ok, error }`.

---

## Files Added

| File | Purpose |
|------|---------|
| `scripts/edge-smoke.ps1` | Smoke gate script |
| `docs/ops/EDGE_SMOKE.md` | Usage documentation |

---

## What It Tests

| Test | Endpoint | Validates |
|------|----------|-----------|
| 1 | `devotionals-get?latest=true` | Success: `{ ok: true, data: ... }` |
| 2 | `public-monetization-services` | Success: `{ ok: true, data: ... }` |
| 3 | `church-series-list` (no context) | Error: `{ ok: false, error: { code, message } }` |
| 4 | `invalid-function-xyz` | Returns proper error |

---

## Contract Validation Rules

The script validates:

1. **Response has `ok` field** — boolean, required
2. **Success response** — `ok: true` + optional `data` field  
3. **Error response** — `ok: false` + `error.code` + `error.message`
4. **No secrets leaked** — error messages are safe

---

## Sample Output (Success)

```
== MD Connect — Edge Contract Smoke Gate ==

== Environment Check ==
Local project detected: xxx-xxxx-xxxx
Local Supabase: REACHABLE

== Edge Contract Validation ==

Test 1: devotionals-get?latest=true
  Testing: devotionals-get success
  PASS: Valid success response
  PASS: ok=true, response has data field

Test 2: public-monetization-services
  Testing: public-monetization-services
  PASS: Valid success response

Test 3: church-series-list (error expected - no church context)
  Testing: church-series-list error
  PASS: error.code=INVALID_REQUEST, error.message=...

== Smoke Summary ==
ALL CONTRACT CHECKS PASSED
Edge functions return standardized { ok, error } shape
```

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

✓ built in 9.67s

Exit code: 0
```

---

## CONNECT Gates

| Gate | Status |
|------|--------|
| `pnpm type-check` | ✅ exit 0 |
| `pnpm build` | ✅ exit 0 |
| No business logic changed | ✅ confirmed |
| No deployment changes | ✅ confirmed |
| No secrets committed | ✅ confirmed |

---

## Usage

```bash
# Run with default settings (localhost:54321)
powershell -ExecutionPolicy Bypass -File scripts\edge-smoke.ps1

# Run with custom base URL (for deployed functions)
powershell -ExecutionPolicy Bypass -File scripts\edge-smoke.ps1 -BaseUrl "https://your-project.functions.supabase.co"
```

---

**QA Sign-off:** AGV — 2026-03-01

# QA_OPS_SCRIPTS.md
> Repo: aistudio-md-connect-app
> Commit scope: `chore(ops): add reproducible scripts + local dev docs`
> Date: 2026-02-28T18:49 BRT
> Appended to Phase 2 — PS1 wrappers + type-check

---

## Environment

| Tool | Version |
|------|---------|
| Node.js | v24.12.0 |
| pnpm | 10.30.3 |

---

## Files Changed

| File | Action |
|------|--------|
| `package.json` | Added `type-check` script (`tsc --noEmit`) |
| `scripts/dev.ps1` | New — pnpm install guard + pnpm dev wrapper |
| `scripts/build.ps1` | New — pnpm install guard + pnpm build with exit reporting |
| `scripts/typecheck.ps1` | New — pnpm type-check with pass/fail reporting |
| `docs/ops/LOCAL_DEV.md` | Updated — PS1 wrapper usage section added |
| `docs/qa/QA_OPS_SCRIPTS.md` | This file (overwrite) |

---

## Gate Evidence (verbatim)

### pnpm type-check

```
> member-app@0.0.0 type-check
> tsc --noEmit

Exit code: 0
```
No TypeScript errors.

### pnpm build

```
> member-app@0.0.0 build
> tsc -b && vite build

✓ built in 10.23s
Exit code: 0
```

---

## PS1 Script Usage

```powershell
# Run dev server (installs if needed)
powershell -ExecutionPolicy Bypass -File scripts\dev.ps1

# Build (installs if needed, reports exit code)
powershell -ExecutionPolicy Bypass -File scripts\build.ps1

# Type-check only (fast, no output emitted)
powershell -ExecutionPolicy Bypass -File scripts\typecheck.ps1
```

---

## CONNECT Gates

| Gate | Status |
|------|--------|
| STOP-03 `pnpm build` before commit | ✅ exit 0 — 10.23s |
| `pnpm type-check` | ✅ exit 0 — no TS errors |
| No runtime logic changed | ✅ — docs + scripts only |
| No src/ files modified | ✅ confirmed |

---

**QA Sign-off:** AGV — 2026-02-28T18:49 BRT

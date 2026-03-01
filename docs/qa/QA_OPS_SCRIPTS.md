# QA_OPS_SCRIPTS.md
> Repo: aistudio-md-connect-app
> Commit scope: `chore(ops): align type-check with build (tsc -b)`
> Date: 2026-02-28T22:14 BRT

---

## Environment

| Tool | Version |
|------|---------|
| Node.js | v24.12.0 |
| pnpm | 10.30.3 |

---

## Files in This Commit Set

| File | Action |
|------|--------|
| `package.json` | Updated `type-check`: `tsc --noEmit` → `tsc -b --noEmit` |
| `scripts/dev.ps1` | New — pnpm install guard + pnpm dev |
| `scripts/build.ps1` | New — pnpm install guard + pnpm build + exit reporting |
| `scripts/typecheck.ps1` | New — pnpm type-check with pass/fail |
| `docs/ops/LOCAL_DEV.md` | Created — 7-step local dev guide |

---

## Why `tsc -b` vs `tsc --noEmit`

| Command | Mode | Uses tsconfig | Composite project |
|---------|------|--------------|-------------------|
| `tsc --noEmit` | Single project | `tsconfig.json` | ❌ ignores `-b` references |
| `tsc -b --noEmit` | Build mode | `tsconfig.json` + `refences[]` | ✅ matches `pnpm build` graph |

Using `tsc -b --noEmit` ensures type-check validates the **same set of files and references** that `vite build` uses.

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

✓ built in 9.30s
Exit code: 0
```

---

## History Cleanup (this session)

Removed duplicate commit:
- `2ca95af` `chore(ops): add reproducible scripts + local dev docs` — DROPPED
- `90fcd6c` → rebased as `90fcd6c` (cherry-picked clean onto `65a9733`)

Strategy: `git rebase --onto 1d6e909 2ca95af eac7541` + `git cherry-pick 4d090fb`

---

## PS1 Wrappers

```powershell
# Dev server
powershell -ExecutionPolicy Bypass -File scripts\dev.ps1

# Production build (install guard + exit reporting)
powershell -ExecutionPolicy Bypass -File scripts\build.ps1

# Type-check only (fast, no output emitted)
powershell -ExecutionPolicy Bypass -File scripts\typecheck.ps1
```

---

## CONNECT Gates

| Gate | Status |
|------|--------|
| STOP-03 `pnpm build` | ✅ exit 0 — 9.30s |
| `pnpm type-check` (`tsc -b --noEmit`) | ✅ exit 0 |
| No `src/` files modified | ✅ confirmed |
| No runtime behavior changed | ✅ confirmed |

---

**QA Sign-off:** AGV — 2026-02-28T22:14 BRT

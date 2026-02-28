# QA_REPO_HYGIENE.md
> Repo: aistudio-md-connect-app
> Sprint: Hygiene — 2026-02-28
> Commit scope: `chore(repo): professionalize MD Connect repo ops + docs`

---

## Pre-Commit State Snapshot

### `git status --porcelain` (before hygiene commit)

```
 M package-lock.json                     ← pre-existing, NOT staged
 M supabase/functions/_shared/cors.ts    ← out of scope
 M supabase/functions/*/index.ts         ← 17 files, out of scope
?? CONNECT_AGENT.md
?? SPRINT0_IMPLEMENTATION_SUMMARY.txt
?? SPRINT0_VALIDATION_REPORT.md
```

### `git diff --stat` (before hygiene commit)

| File | Δ Lines |
|------|---------|
| `package-lock.json` | 5,374 |
| `supabase/functions/_shared/cors.ts` | 126 |
| 16 × `supabase/functions/*/index.ts` | 4–90 each |

**Total (all unstaged):** 18 files, 263 insertions, 5,663 deletions.
**None of the above are staged in this hygiene commit.**

---

## Actions Taken

| Action | Detail | Status |
|--------|--------|--------|
| AGV_TEST.txt check | File not present — no action needed | ✅ |
| Move SPRINT0 files | → `docs/sprints/SPRINT0_IMPLEMENTATION_SUMMARY.txt` | ✅ |
| Move SPRINT0 report | → `docs/sprints/SPRINT0_VALIDATION_REPORT.md` | ✅ |
| Delete root originals | `SPRINT0_*.txt` and `SPRINT0_*.md` removed from root | ✅ |
| Expand `.gitignore` | Added pnpm, Vite, Supabase local, Android, Capacitor, OS, AGV scratch | ✅ |
| Create `REPO_OPERATIONS.md` | Full ops reference: setup, env keys, all pnpm scripts, git workflow | ✅ |
| Create `CONNECT_AGENT.md` | CONNECT bootstrap file (placed by sync-connect-agent.ps1) | ✅ |

---

## Files Staged for This Commit

| File | Action |
|------|--------|
| `CONNECT_AGENT.md` | New (untracked → staged) |
| `docs/sprints/SPRINT0_IMPLEMENTATION_SUMMARY.txt` | New (moved from root) |
| `docs/sprints/SPRINT0_VALIDATION_REPORT.md` | New (moved from root) |
| `.gitignore` | Modified (expanded) |
| `REPO_OPERATIONS.md` | New |
| `docs/qa/QA_REPO_HYGIENE.md` | New (this file) |

---

## Build Gate Results

| Gate | Command | Result |
|------|---------|--------|
| Build | `pnpm build` | ✅ PASS — exit 0 |
| Lint | `pnpm lint` | ✅ PASS — exit 0 |
| Diff review | `git diff --stat` | ✅ Only hygiene files changed |
| Status review | `git status` | ✅ Only expected files staged |

---

## CONNECT Gates Checked

| Gate | Status | Notes |
|------|--------|-------|
| STOP-01 Prod/staging mismatch | ✅ N/A | No migration changes |
| STOP-02 Destructive commands | ✅ N/A | No destructive commands used |
| STOP-03 Build before commit | ✅ PASS | `pnpm build` exit 0 |
| STOP-04 RLS disabled | ✅ N/A | No schema changes |
| STOP-05 Direct client DB access | ✅ N/A | No frontend code changed |
| STOP-06 Untranslated strings | ✅ N/A | No UI code changed |

---

## Supabase Functions — Out of Scope

The following files are modified in the working tree but **intentionally excluded** from this commit:

- `package-lock.json` — lockfile churn, separate commit
- `supabase/functions/_shared/cors.ts` — CORS refactor, separate commit
- 16 × `supabase/functions/*/index.ts` — CORS refactor, separate commit

These will be committed in a separate `refactor(cors)` commit.

---

## Post-Commit Verification

```bash
git show --stat HEAD    # Verify only hygiene files in commit
git log --oneline -1    # Verify commit message format
```

---

**QA Sign-off:** AGV — 2026-02-28T15:28 BRT
**Commit:** `chore(repo): professionalize MD Connect repo ops + docs`

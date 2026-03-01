# QA_REPO_STRUCTURE.md
> Repo: aistudio-md-connect-app
> Commit: `chore(repo): organize docs structure + add docs index`
> Date: 2026-03-01T00:42 BRT

---

## Environment

| Tool | Version |
|------|---------|
| Node.js | v24.12.0 |
| pnpm | 10.30.3 |

---

## Before — Root & docs/ State

**Root:** 21 files, 13 dirs. Notable clutter:
- `audit/auditoria_paginas.md` — audit report in root-level `audit/` dir
- `docs/` had 5 numbered legacy folders: `00_baseline`, `00_inbox_legacy`, `10_app_web_cliente`, `20_fullstack_site`, `90_shared_standards`
- `docs/INDEX.md` instead of standard `docs/README.md`
- 4 loose `docs/*.md` files not in any subfolder
- `docs/ops/` missing — LOCAL_DEV.md lost in history rebase

**Root was safe** — `api/og-devotional.js` confirmed in `vercel.json` as a Vercel serverless route — **NOT moved**.

---

## Changes Made

### Moves via `git mv` (all tracked, history preserved)

| From | To |
|------|----|
| `audit/auditoria_paginas.md` | `docs/reports/auditoria_paginas.md` |
| `docs/INDEX.md` | `docs/README.md` |
| `docs/FULLSTACK_ROADMAP_COMPAT.md` | `docs/archive/FULLSTACK_ROADMAP_COMPAT.md` |
| `docs/ROADMAP_FASE1.md` | `docs/archive/ROADMAP_FASE1.md` |
| `docs/QA_CHECKLIST_FASE1.md` | `docs/archive/QA_CHECKLIST_FASE1.md` |
| `docs/odulo-pedidos-oracao-fullstack.md` | `docs/archive/odulo-pedidos-oracao-fullstack.md` |
| `docs/00_baseline/` (8 files) | `docs/archive/00_baseline/` |
| `docs/00_inbox_legacy/` (8 files) | `docs/archive/00_inbox_legacy/` |
| `docs/10_app_web_cliente/` (3 files) | `docs/archive/10_app_web_cliente/` |
| `docs/20_fullstack_site/` (2 files) | `docs/archive/20_fullstack_site/` |
| `docs/90_shared_standards/` (6 files) | `docs/archive/90_shared_standards/` |

**Total: 31 renames + 4 new files**

### New Files Created

| File | Purpose |
|------|---------|
| `docs/README.md` | Canonical docs index (replaces `INDEX.md`) |
| `docs/archive/README.md` | Explains what is in archive and why |
| `docs/ops/LOCAL_DEV.md` | Local dev guide (recreated after history rebase) |
| `docs/qa/QA_REPO_STRUCTURE.md` | This file |

### Files Intentionally Left in Root (NOT moved)

| File | Reason |
|------|--------|
| `api/og-devotional.js` | Vercel serverless route — required by `vercel.json` |
| `CLAUDE.md` | Claude Code config — must be in root |
| `CONNECT_AGENT.md` | CONNECT bootstrap — required in root |
| `README.md` | Project README — standard root location |
| `REPO_OPERATIONS.md` | Ops reference — frequent access |

---

## After — docs/ Structure

```
docs/
├── README.md            ← NEW (was INDEX.md)
├── qa/                  ← 7 files (CONNECT gate evidence)
├── sprints/             ← 7 sprint reports
├── ops/                 ← LOCAL_DEV.md (recreated)
├── reports/             ← 6 security/CORS/audit reports
├── archive/             ← NEW — 31 legacy files preserved
├── releases/            ← Sprint QA release notes
├── store/               ← App store / privacy / terms
├── modulos/
└── db/
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

✓ built in 9.54s
Exit code: 0
```

---

## CONNECT Gates

| Gate | Status |
|------|--------|
| STOP-03 `pnpm build` | ✅ exit 0 — 9.54s |
| `pnpm type-check` | ✅ exit 0 |
| No `src/`, `supabase/`, `api/` modified | ✅ confirmed |
| No runtime logic changed | ✅ confirmed — docs only |
| `api/og-devotional.js` left in place | ✅ `vercel.json` dependency preserved |

---

**QA Sign-off:** AGV — 2026-03-01T00:42 BRT

# docs/README.md — Documentation Index
> MD Connect App (`aistudio-md-connect-app`)
> Last updated: 2026-03-01

---

## Where Things Live

| Folder | Contents |
|--------|----------|
| [`docs/qa/`](qa/) | QA evidence for every commit (CONNECT gate proof) |
| [`docs/sprints/`](sprints/) | Sprint planning, validation, and summary reports |
| [`docs/ops/`](ops/) | Local dev guide, environment setup, runbooks |
| [`docs/reports/`](reports/) | Security notices, CORS reports, exported artifacts |
| [`docs/archive/`](archive/) | Legacy planning docs, old baselines, inbox items |
| [`docs/db/`](db/) | Database schema reference |
| [`docs/store/`](store/) | App store assets, privacy policy, terms |
| [`docs/releases/`](releases/) | Sprint QA release notes |
| [`docs/modulos/`](modulos/) | Module-level feature documentation |

---

## Quick Navigation

### QA Evidence
- [CORS Refactor](qa/QA_CORS_REFACTOR.md)
- [CORS Security Report](qa/CORS_SECURITY_QA_REPORT.md)
- [Node Pinning](qa/QA_NODE_PINNING.md)
- [Ops Scripts](qa/QA_OPS_SCRIPTS.md)
- [Repo Cleanup](qa/QA_REPO_CLEANUP.md)
- [Repo Hygiene](qa/QA_REPO_HYGIENE.md)
- [Repo Structure](qa/QA_REPO_STRUCTURE.md)

### Sprint Reports
- [Sprint 0 — Validation Gate](sprints/SPRINT0_VALIDATION_REPORT.md)
- [Sprint 1 — Store Readiness](sprints/sprint-01-store-readiness.md)
- [Sprint 2 — Cache Strategy](sprints/sprint-02-cache-strategy.md)
- [Sprint 2 — Performance](sprints/sprint-02-performance.md)
- [Sprint 2 — PWA](sprints/sprint-02-pwa.md)
- [Sprint 3 — Mobile Wrapper](sprints/sprint-03-mobile-wrapper.md)

### Operational Guides
- [Local Dev Setup](ops/LOCAL_DEV.md) — full pnpm + Supabase setup for Windows
- [Repo Operations](../REPO_OPERATIONS.md) — commands, env keys, Git workflow

### Security & Reports
- [Security Remediation Notice](reports/SECURITY_REMEDIATION_NOTICE.md)
- [Credential Rotation Checklist](reports/CREDENTIAL_ROTATION_CHECKLIST.md)
- [CORS Implementation Summary](reports/CORS_IMPLEMENTATION_SUMMARY.txt)

---

## PowerShell Scripts (Windows)

| Script | Command | Purpose |
|--------|---------|---------|
| [`scripts/dev.ps1`](../scripts/dev.ps1) | `.\scripts\dev.ps1` | Install guard + `pnpm dev` |
| [`scripts/build.ps1`](../scripts/build.ps1) | `.\scripts\build.ps1` | Install guard + `pnpm build` + exit reporting |
| [`scripts/typecheck.ps1`](../scripts/typecheck.ps1) | `.\scripts\typecheck.ps1` | `pnpm type-check` with pass/fail |

```powershell
powershell -ExecutionPolicy Bypass -File scripts\dev.ps1
powershell -ExecutionPolicy Bypass -File scripts\build.ps1
powershell -ExecutionPolicy Bypass -File scripts\typecheck.ps1
```

---

## CONNECT Gates Reference

Before any commit you must pass:

```bash
pnpm type-check   # tsc -b --noEmit — must exit 0
pnpm build        # tsc -b + vite build — must exit 0
```

Full gate sequence: see [`CONNECT_AGENT.md`](../CONNECT_AGENT.md) in repo root.

---

## Root File Map

```
/
├── README.md              # Project overview
├── REPO_OPERATIONS.md     # Commands, env keys, Git workflow
├── CONNECT_AGENT.md       # CONNECT bootstrap (mandatory)
├── CLAUDE.md              # Claude Code agent config
├── .nvmrc                 # Pinned Node.js version (24.12.0)
├── package.json           # Scripts + dependencies
├── pnpm-lock.yaml         # Lockfile (do not delete)
├── .gitignore
├── src/                   # React app source
├── supabase/              # Edge Functions + migrations
├── api/                   # Vercel serverless routes (do not move)
├── scripts/               # Build/validation/PS1 wrappers
├── docs/                  # This folder
├── android/               # Capacitor Android project
└── public/                # Static assets
```

> **Note:** `api/` contains Vercel serverless functions referenced by `vercel.json`. Do NOT move.

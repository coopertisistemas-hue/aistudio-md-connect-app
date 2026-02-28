# QA_REPO_CLEANUP.md
> Repo: aistudio-md-connect-app
> Commit scope: `chore(repo): organize root files into docs structure`
> Date: 2026-02-28

---

## Objective

Remove root clutter by moving non-executed historical artifacts into the `docs/` structure.
No runtime logic, source code, or build configuration was touched.

---

## Pre-Move Baseline (git status)

Working tree was clean before this phase (no staged changes from previous phases).

---

## Files Moved (`git mv`)

All moves used `git mv` so git tracks the rename and history is preserved.

| Source (root) | Destination | Type |
|---------------|-------------|------|
| `CORS_IMPLEMENTATION_SUMMARY.txt` | `docs/reports/CORS_IMPLEMENTATION_SUMMARY.txt` | Historical report |
| `CORS_SECURITY_QA_REPORT.md` | `docs/qa/CORS_SECURITY_QA_REPORT.md` | QA evidence |
| `CREDENTIAL_ROTATION_CHECKLIST.md` | `docs/reports/CREDENTIAL_ROTATION_CHECKLIST.md` | Security procedure |
| `SECURITY_REMEDIATION_NOTICE.md` | `docs/reports/SECURITY_REMEDIATION_NOTICE.md` | Incident notice |
| `monetization_reordered_final_1765937822013.png` | `docs/reports/monetization_reordered_final_1765937822013.png` | Exported image |

## Files Created

| File | Purpose |
|------|---------|
| `docs/reports/README.md` | Documents what belongs in `docs/reports/` and full docs folder map |

## Files Intentionally Left in Root

| File | Reason |
|------|--------|
| `CLAUDE.md` | Claude Code agent configuration — must remain in root |
| `CONNECT_AGENT.md` | CONNECT bootstrap — mandatory in root per spec |
| `README.md` | Project README — must remain in root |
| `REPO_OPERATIONS.md` | Ops reference — must remain in root (frequently accessed) |

---

## Docs Folder Structure After Cleanup

```
docs/
├── qa/
│   ├── CORS_SECURITY_QA_REPORT.md    (moved from root)
│   ├── QA_REPO_HYGIENE.md
│   ├── QA_CORS_REFACTOR.md
│   ├── QA_NODE_PINNING.md
│   └── QA_OPS_SCRIPTS.md
├── sprints/
│   ├── SPRINT0_IMPLEMENTATION_SUMMARY.txt
│   ├── SPRINT0_VALIDATION_REPORT.md
│   └── sprint-01..05.md
├── ops/
│   └── LOCAL_DEV.md
└── reports/
    ├── README.md
    ├── CORS_IMPLEMENTATION_SUMMARY.txt   (moved from root)
    ├── CREDENTIAL_ROTATION_CHECKLIST.md  (moved from root)
    ├── SECURITY_REMEDIATION_NOTICE.md    (moved from root)
    └── monetization_reordered_final_*.png (moved from root)
```

---

## Safety Check — No Build Dependencies Moved

Verified before any move:
- None of the moved files are referenced in `package.json` scripts
- None are imported by `src/` TypeScript/TSX files
- None are part of Vite, TSC, or Supabase configuration

---

## Build Gate Evidence

```
pnpm build
# Exit code: 0
# ✔ built in ~10s
```

---

## CONNECT Gates

| Gate | Status |
|------|--------|
| STOP-03 Build before commit | ✅ PASS |
| No logic changes | ✅ Confirmed — docs/artifacts only |
| No source files modified | ✅ Confirmed |
| git mv used (history preserved) | ✅ Confirmed |

---

**QA Sign-off:** AGV — 2026-02-28T17:39 BRT

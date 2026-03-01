# QA_ROOT_CLEANUP.md
> Repo: aistudio-md-connect-app
> Commit: `chore(repo): clean root clutter and standardize docs placement`
> Date: 2026-03-01T02:05 BRT

---

## Environment

| Tool | Version |
|------|---------|
| Node.js | v24.12.0 |
| pnpm | 10.30.3 |

---

## Phase A — Root Inventory

Root had **21 tracked files** after prior sessions' cleanup. Full analysis:

| Category | Files | Decision |
|----------|-------|---------|
| Runtime config | `capacitor.config.ts`, `eslint.config.js`, `index.html`, `vite.config.ts`, `postcss.config.js`, `tailwind.config.js`, `tsconfig.*.json`, `vercel.json` | KEEP |
| Package manager | `package.json`, `pnpm-lock.yaml`, `.nvmrc` | KEEP |
| Env | `.env.example`, `.gitignore`, `.editorconfig`, `.gitattributes` | KEEP |
| Repo standards | `README.md`, `REPO_OPERATIONS.md`, `CONNECT_AGENT.md` | KEEP |
| Agent config | `CLAUDE.md` | KEEP (Claude Code convention — root required) |
| **Move candidate** | `resources/METADATA.md` | → `docs/reports/CAPACITOR_METADATA.md` |

**`audit/` folder:** Emptied in prior session (auditoria_paginas.md moved to `docs/reports/`). No tracked files remain — folder is now untracked/gitignored.

---

## Phase B — Moves

| From | To | Method |
|------|----|--------|
| `resources/METADATA.md` | `docs/reports/CAPACITOR_METADATA.md` | `git mv` (history preserved) |

**Why moved:** `resources/METADATA.md` is a 283-line Capacitor asset specification document (icon sizes, splash screens, permissions, versioning). It is not an executable resource — it is documentation. The `resources/` folder itself (with `icon.png`, `splash.png`) remains untouched.

---

## Root State After Cleanup

```
/  (tracked files)
├── .editorconfig         ← repo metadata
├── .env.example          ← env template
├── .gitattributes        ← repo metadata
├── .gitignore
├── .nvmrc                ← Node pin
├── CLAUDE.md             ← Claude Code config (root convention)
├── CONNECT_AGENT.md      ← CONNECT bootstrap
├── README.md             ← Project quickstart
├── REPO_OPERATIONS.md    ← Ops reference
├── capacitor.config.ts   ← Runtime
├── eslint.config.js      ← Runtime
├── index.html            ← Runtime
├── package.json          ← Runtime
├── pnpm-lock.yaml        ← Runtime
├── postcss.config.js     ← Runtime
├── tailwind.config.js    ← Runtime
├── tsconfig.app.json     ← Runtime
├── tsconfig.json         ← Runtime
├── tsconfig.node.json    ← Runtime
├── vercel.json           ← Runtime
└── vite.config.ts        ← Runtime
```

**20 tracked root files. 0 loose documentation files in root.**

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

✓ built in 9.22s
Exit code: 0
```

---

## CONNECT Gates

| Gate | Status |
|------|--------|
| STOP-03 `pnpm build` | ✅ exit 0 — 9.22s |
| `pnpm type-check` | ✅ exit 0 |
| No `src/`, `supabase/`, `api/` modified | ✅ confirmed |
| `resources/` runtime assets untouched | ✅ only METADATA.md moved |

---

**QA Sign-off:** AGV — 2026-03-01T02:05 BRT

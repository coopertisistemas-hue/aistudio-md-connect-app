# QA_NODE_PINNING.md
> Repo: aistudio-md-connect-app
> Commit scope: `chore(repo): pin node version + ops docs`
> Date: 2026-02-28

---

## Objective

Prevent lockfile churn and cross-environment build failures by pinning the Node.js version used in this project.

---

## Environment at Time of Pinning

| Tool | Version |
|------|---------|
| Node.js | v24.12.0 |
| pnpm | 10.30.3 |

### Commands Run

```powershell
node -v
# v24.12.0

pnpm -v
# 10.30.3
```

---

## Files Changed

| File | Action |
|------|--------|
| `.nvmrc` | New — pins Node to `24.12.0` |
| `REPO_OPERATIONS.md` | Updated — added version table, corepack instructions |

---

## How to Use `.nvmrc`

### With nvm (Linux/macOS)
```bash
nvm use        # reads .nvmrc automatically
nvm install    # installs pinned version if missing
```

### With Volta (cross-platform)
```bash
volta pin node@24.12.0
```

### With fnm (Windows-friendly)
```bash
fnm use        # reads .nvmrc automatically
```

### Manual (no version manager)
Install Node.js v24.x from https://nodejs.org/en/download

---

## pnpm Version Alignment

pnpm 10.x requires Node.js ≥ 18.12. Node v24.12.0 satisfies this.

To enforce pnpm version via Corepack:
```bash
corepack enable
corepack prepare pnpm@10.30.3 --activate
```

---

## Build Gate Evidence

```
pnpm build
# Exit code: 0
# ✔ built in ~10s (Vite + tsc)
```

---

## CONNECT Gates

| Gate | Status |
|------|--------|
| STOP-03 Build before commit | ✅ PASS — `pnpm build` exit 0 |
| No logic changes | ✅ Confirmed — `.nvmrc` + docs only |

---

**QA Sign-off:** AGV — 2026-02-28T17:39 BRT

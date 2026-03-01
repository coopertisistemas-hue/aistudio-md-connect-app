# MD Connect — Member App

> React + TypeScript + Vite | Supabase Edge Functions | Capacitor Android | pnpm

MD Connect is a church member management platform. This repo contains the web/mobile member app and its supporting Supabase Edge Functions.

---

## ⚡ Quickstart (60 seconds)

```bash
# 1 — Use the pinned Node version
fnm use          # reads .nvmrc → Node 24.12.0
# or: nvm use

# 2 — Install dependencies (pnpm only — do NOT use npm/yarn)
pnpm install

# 3 — Configure environment
cp .env.example .env.local
# Fill in VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY

# 4 — Start dev server
pnpm dev         # → http://localhost:5173
```

### Validate before committing
```bash
pnpm type-check  # tsc -b --noEmit — must exit 0
pnpm build       # tsc -b + vite build — must exit 0
```

---

## 📚 Key Docs

| Document | Purpose |
|----------|---------|
| [`REPO_OPERATIONS.md`](REPO_OPERATIONS.md) | All commands, env vars, Git workflow |
| [`docs/README.md`](docs/README.md) | Full docs index (where everything lives) |
| [`docs/ops/LOCAL_DEV.md`](docs/ops/LOCAL_DEV.md) | Step-by-step local dev + Supabase setup |
| [`docs/qa/`](docs/qa/) | QA evidence for every commit |
| [`CONNECT_AGENT.md`](CONNECT_AGENT.md) | CONNECT bootstrap — load before any session |

---

## 🛠 Common Scripts

```bash
pnpm dev                 # Start Vite dev server
pnpm build               # Production build (tsc + vite)
pnpm type-check          # TypeScript check only (fast)
pnpm lint                # ESLint
pnpm smoke:build         # Alias: pnpm build
pnpm supabase:start      # Start local Supabase stack
pnpm functions:serve     # Serve Edge Functions locally
pnpm mobile:android      # Run on Android device
```

PS1 wrappers (Windows):
```powershell
powershell -ExecutionPolicy Bypass -File scripts\dev.ps1
powershell -ExecutionPolicy Bypass -File scripts\build.ps1
powershell -ExecutionPolicy Bypass -File scripts\typecheck.ps1
```

---

## 🔧 Tech Stack

| Layer | Technology |
|-------|-----------|
| Frontend | React 19 + TypeScript 5.9 + Vite 7 |
| Styling | TailwindCSS 4 + Radix UI |
| Backend | Supabase (PostgreSQL + RLS + Edge Functions) |
| Mobile | Capacitor 8 (Android) |
| Package manager | pnpm 10.30.3 (Node pinned: 24.12.0 via `.nvmrc`) |
| Deploy | Vercel (web) |

---

## Architecture Principles

1. **RLS-First** — every table has Row Level Security enabled
2. **Edge Functions only** — no direct client DB calls for sensitive data
3. **i18n from v1** — PT (primary), EN, ES via react-i18next
4. **CORS via `_shared`** — all functions use `handleCors()` from `supabase/functions/_shared/cors.ts`

> See `CONNECT_AGENT.md` for full operational rules and STOP conditions.

## 📐 Padrão de Páginas Internas

**Todas as páginas internas devem usar `InternalPageLayout`.**

### Regras
- ✅ **Use:** `InternalPageLayout` para todas as páginas internas
- ❌ **Não use:** `PageIntro`, `BackLink`, ou `AppFooter` diretamente nas páginas
- ✅ **Configure:** `title`, `subtitle`, `icon`, `backPath` via props do layout

### Exemplo
```tsx
import { InternalPageLayout } from '@/components/layout/InternalPageLayout';
import { Book } from 'lucide-react';

export default function MyPage() {
    return (
        <InternalPageLayout
            title="Minha Página"
            subtitle="Descrição da página."
            icon={Book}
            iconClassName="text-indigo-600"
            backPath="/home"
        >
            {/* Conteúdo da página */}
        </InternalPageLayout>
    );
}
```

### Verificação
Execute o audit para garantir conformidade:
```bash
pnpm check:ui  # Deve retornar exit code 0
```

---

## React + TypeScript + Vite

This template provides a minimal setup to get React working in Vite with HMR and some ESLint rules.

Currently, two official plugins are available:

- [@vitejs/plugin-react](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react) uses [Babel](https://babeljs.io/) (or [oxc](https://oxc.rs) when used in [rolldown-vite](https://vite.dev/guide/rolldown)) for Fast Refresh
- [@vitejs/plugin-react-swc](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react-swc) uses [SWC](https://swc.rs/) for Fast Refresh

## React Compiler

The React Compiler is not enabled on this template because of its impact on dev & build performances. To add it, see [this documentation](https://react.dev/learn/react-compiler/installation).

## Expanding the ESLint configuration

If you are developing a production application, we recommend updating the configuration to enable type-aware lint rules:

```js
export default defineConfig([
  globalIgnores(['dist']),
  {
    files: ['**/*.{ts,tsx}'],
    extends: [
      // Other configs...

      // Remove tseslint.configs.recommended and replace with this
      tseslint.configs.recommendedTypeChecked,
      // Alternatively, use this for stricter rules
      tseslint.configs.strictTypeChecked,
      // Optionally, add this for stylistic rules
      tseslint.configs.stylisticTypeChecked,

      // Other configs...
    ],
    languageOptions: {
      parserOptions: {
        project: ['./tsconfig.node.json', './tsconfig.app.json'],
        tsconfigRootDir: import.meta.dirname,
      },
      // other options...
    },
  },
])
```

You can also install [eslint-plugin-react-x](https://github.com/Rel1cx/eslint-react/tree/main/packages/plugins/eslint-plugin-react-x) and [eslint-plugin-react-dom](https://github.com/Rel1cx/eslint-react/tree/main/packages/plugins/eslint-plugin-react-dom) for React-specific lint rules:

```js
// eslint.config.js
import reactX from 'eslint-plugin-react-x'
import reactDom from 'eslint-plugin-react-dom'

export default defineConfig([
  globalIgnores(['dist']),
  {
    files: ['**/*.{ts,tsx}'],
    extends: [
      // Other configs...
      // Enable lint rules for React
      reactX.configs['recommended-typescript'],
      // Enable lint rules for React DOM
      reactDom.configs.recommended,
    ],
    languageOptions: {
      parserOptions: {
        project: ['./tsconfig.node.json', './tsconfig.app.json'],
        tsconfigRootDir: import.meta.dirname,
      },
      // other options...
    },
  },
])
```

# Scripts e Gates de Qualidade — MD Connect App

> Gerado a partir de `package.json` e `scripts/`.
> Ultima atualizacao: 2026-02-07

---

## 1. Scripts npm (`package.json`)

### 1.1 Desenvolvimento

| Comando | Descricao |
|---------|-----------|
| `pnpm dev` | Inicia o servidor de desenvolvimento Vite na porta 5173 com hot-reload. |
| `pnpm preview` | Serve a build de producao localmente para inspecao antes do deploy. |

### 1.2 Build e Lint

| Comando | Descricao |
|---------|-----------|
| `pnpm build` | Executa `tsc -b` (compilacao TypeScript com verificacao de tipos) seguido de `vite build` (bundling para producao). Falha se houver erros de tipo. |
| `pnpm lint` | Executa ESLint sobre todo o projeto com as regras configuradas (TypeScript, React Hooks, React Refresh). |

### 1.3 Auditoria e Validacao

| Comando | Descricao |
|---------|-----------|
| `pnpm audit:internal-pages` | Verifica se todas as paginas em `src/pages/` utilizam `InternalPageLayout`. Retorna exit code 1 se houver paginas nao conformes. Alias: `pnpm check:ui`. |
| `pnpm check:ui` | Alias para `audit:internal-pages`. |
| `pnpm check:sprint0` | Executa o gate de validacao Sprint 0 (4 checks obrigatorios — ver secao 3). Retorna exit code 1 se qualquer check falhar. |
| `pnpm check:sprint0:full` | Modo completo do Sprint 0: executa os 4 checks obrigatorios + build TypeScript + lint ESLint. |

### 1.4 Supabase (ambiente local)

Requer Docker em execucao e o CLI do Supabase instalado.

| Comando | Descricao |
|---------|-----------|
| `pnpm supabase:start` | Inicia os containers locais do Supabase (banco, auth, storage, edge functions). |
| `pnpm supabase:stop` | Para os containers locais do Supabase. |
| `pnpm supabase:status` | Exibe o status dos servicos locais do Supabase (URLs, portas, chaves). |
| `pnpm supabase:functions` | Serve as Edge Functions localmente para desenvolvimento e testes. |
| `pnpm supabase:logs` | Acompanha os logs das Edge Functions em tempo real (`--follow`). |

---

## 2. Scripts utilitarios (`scripts/`)

Scripts avulsos que nao possuem alias no `package.json`, executados diretamente via `node`.

| Arquivo | Descricao |
|---------|-----------|
| `test-cors-security.mjs` | Testa a implementacao do CORS allowlist nas Edge Functions. Valida que origens nao autorizadas sao rejeitadas. |
| `update-cors-functions.mjs` | Utilitario para aplicar/atualizar a configuracao de CORS allowlist em todas as Edge Functions. |
| `backfillDevotionalCovers.ts` | Script de migracao para preencher URLs de capa em devocionais existentes no banco. |
| `diagnose_pipeline.ts` | Diagnostico de pipeline de deploy. |

---

## 3. Gate Obrigatorio: Sprint 0 (`check:sprint0`)

O script `check-sprint0.mjs` e o gate de qualidade principal do projeto. Deve ser executado antes de qualquer merge ou deploy. Realiza **4 checks obrigatorios**:

### Check 1 — Arquivos `.env` nao rastreados no Git

- Verifica se `.env` e `.env.local` **nao estao** no indice do Git (`git ls-files`).
- Verifica se nao existem no historico do Git (`git log --all`).
- **Falha se:** qualquer arquivo `.env` estiver rastreado ou presente no historico.

### Check 2 — Arquitetura BFF respeitada (zero `supabase.from()`)

- Escaneia todos os arquivos `.ts`, `.tsx`, `.js`, `.jsx` em `src/` procurando o padrao `supabase.from(`.
- **Falha se:** qualquer ocorrencia for encontrada no codigo do cliente.
- Referencia: `docs/90_shared_standards/API_CONTRACT.md`

### Check 3 — CORS seguro (sem wildcard)

- Escaneia todos os arquivos `.ts`, `.js` em `supabase/functions/` procurando `Access-Control-Allow-Origin: '*'`.
- **Falha se:** qualquer Edge Function usar CORS wildcard em vez do allowlist.

### Check 4 — Conformidade de UI (`InternalPageLayout`)

- Executa o script `audit-internal-pages.mjs` internamente.
- Verifica se todas as paginas regulares em `src/pages/` usam `InternalPageLayout`.
- Paginas isentas (layout proprio): `Home.tsx`, `PublicHome.tsx`, `LandingPage.tsx`, `Login.tsx`, `GateScreens.tsx`, `RadioPage.tsx`.
- Tambem alerta sobre importacoes diretas de `AppFooter`, `PageIntro` ou `BackLink` (devem vir via `InternalPageLayout`).
- **Falha se:** qualquer pagina regular nao utilizar `InternalPageLayout` ou importar componentes de layout diretamente.

### Modo completo (`--full`)

Quando executado com `pnpm check:sprint0:full`, adiciona dois checks extras:

| Check | Tipo | Descricao |
|-------|------|-----------|
| Build TypeScript | Obrigatorio | Executa `pnpm build`. Falha se houver erros de tipo ou bundling. |
| Lint ESLint | Informativo | Executa `pnpm lint`. Reporta problemas mas **nao bloqueia** o gate. |

---

## 4. Fluxo de validacao recomendado

```
1. Desenvolvimento local
   pnpm dev

2. Antes de commitar
   pnpm lint
   pnpm check:sprint0

3. Antes de abrir PR
   pnpm check:sprint0:full

4. Revisao de PR
   Seguir docs/QA_CHECKLIST_FASE1.md (checklist manual)
```

---

## 5. Codigos de saida

Todos os scripts de validacao seguem o padrao:

| Codigo | Significado |
|--------|-------------|
| `0` | Todos os checks passaram |
| `1` | Um ou mais checks obrigatorios falharam |

> **Nota:** Nao ha framework de testes automatizados (jest/vitest) configurado no projeto. A qualidade e garantida por estes scripts de auditoria, pelo gate Sprint 0 e pelo checklist manual de QA (`docs/QA_CHECKLIST_FASE1.md`).

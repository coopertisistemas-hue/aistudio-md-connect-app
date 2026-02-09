# Riscos Tecnicos e Quick Wins — MD Connect App

> Baseado na analise do repositorio em 2026-02-07.
> Nenhuma alteracao de codigo proposta — apenas observacoes.

---

## 1. Riscos Tecnicos

### R1 — CORS wildcard em 7 Edge Functions (Severidade: Alta)

**Observacao:** 7 funcoes ainda definem `Access-Control-Allow-Origin: '*'` diretamente no codigo, fora do `_shared/cors.ts`:

- `report-client-error`
- `track-event`
- `track-public-read`
- `prayer-confirmation`
- `public-churches-list`
- `kpi`
- `kpi-partners`

Alem disso, o proprio `_shared/cors.ts` exporta `corsHeaders` com wildcard `'*'`. Funcoes que importam desse modulo sem sobrescrever o origin herdam o wildcard.

**Risco:** O gate Sprint 0 pode nao detectar todas as variantes (ex: funcoes que usam `corsHeaders` do shared sem override). Requisicoes cross-origin de dominios nao autorizados podem ser aceitas.

---

### R2 — Ausencia de testes automatizados (Severidade: Alta)

**Observacao:** Nenhum framework de testes (jest, vitest, testing-library) esta configurado. A qualidade depende exclusivamente de:
- Scripts de auditoria (UI compliance, BFF, CORS)
- Checklist manual (`QA_CHECKLIST_FASE1.md`)
- Build TypeScript (verificacao de tipos)

**Risco:** Regressoes silenciosas em logica de negocio, servicos e componentes. A medida que o projeto cresce, a confianca em deploys diminui sem cobertura automatizada.

---

### R3 — Inconsistencia de API nas Edge Functions (Severidade: Media)

**Observacao:** As 36 Edge Functions misturam dois padroes de inicializacao Deno:

| Padrao | Qtd | Exemplo |
|--------|-----|---------|
| `Deno.serve()` (moderno) | 24 | `church-posts-list`, `devotionals-get` |
| `serve()` via `deno.land/std` (legado) | 12 | `report-client-error`, `track-event`, `partners-get`, `kpi` |

Alem disso, funcoes legadas importam de URLs pinadas (`deno.land/std@0.168.0`) enquanto as modernas usam a API nativa do Deno.

**Risco:** Comportamento divergente entre funcoes (tratamento de erros, ciclo de vida). Atualizacoes do runtime Deno podem quebrar as funcoes legadas primeiro.

---

### R4 — Fetching manual sem cache (Severidade: Media)

**Observacao:** 30 paginas usam `useEffect` + `useState` para buscar dados, com estados `loading`/`error` reimplementados em cada pagina (127 ocorrencias de `loading`/`isLoading`/`setLoading`). Nenhuma biblioteca de cache (TanStack Query, SWR) esta instalada, apesar de o `API_CONTRACT.md` recomendar TanStack Query com TTLs definidos.

**Risco:** Requisicoes duplicadas ao navegar entre paginas, ausencia de revalidacao em background, sem retry automatico, e muita logica boilerplate repetida. Impacto direto na UX (loading desnecessario) e no consumo de Edge Functions.

---

### R5 — Codigo morto e paginas orfas (Severidade: Baixa)

**Observacao:** Paginas existentes em `src/pages/` que nao sao referenciadas em nenhuma rota no `App.tsx`:

| Arquivo | Status |
|---------|--------|
| `BibleView.tsx` | Substituido por `Bible/BibleReader.tsx` |
| `PublicHome.tsx` | Substituido por `LandingPage.tsx` |
| `ChurchNotFound.tsx` | Usado internamente por `ChurchScopedRoute`, nao roteado |
| `public/ChurchPage.tsx` | Sem rota definida |
| `requests/NewRequest.tsx` | Sem rota definida (form dentro de PrayerHub?) |
| `requests/RequestsHub.tsx` | Substituido por `PrayerHub.tsx` |
| `status/GateScreens.tsx` | Usado por `MembershipContext`, nao roteado |

**Risco:** Confusao para desenvolvedores, aumento do bundle se importado acidentalmente, e dificuldade de manutencao.

---

### R6 — Migracoes redundantes de seed (Severidade: Baixa)

**Observacao:** Os 66 livros da Biblia sao inseridos em 3 migracoes diferentes:
- `20250102000000_create_bible_books.sql` (8 livros iniciais)
- `20250102010000_seed_remaining_books.sql` (57 livros)
- `20250102030000_seed_full_bible.sql` (66 livros, sobrescreve)
- `20250102040000_seed_chunked_safely.sql` (66 livros, ON CONFLICT)

**Risco:** Complexidade desnecessaria no historico de migracoes. Nao causa problema funcional (ON CONFLICT garante idempotencia), mas dificulta compreensao para novos desenvolvedores.

---

### R7 — `console.log` espalhado no codigo de producao (Severidade: Baixa)

**Observacao:** 127 ocorrencias de `console.log`, `console.error` e `console.warn` em 55 arquivos dentro de `src/`. A maioria esta em blocos `catch`, mas alguns sao logs de debug.

**Risco:** Vazamento de informacoes no console do navegador em producao. Ruido nos DevTools do usuario.

---

### R8 — Tabelas referenciadas sem migracoes locais (Severidade: Informativo)

**Observacao:** 13 tabelas sao referenciadas nas Edge Functions mas nao possuem migracoes neste repositorio (ex: `profiles`, `churches`, `posts`, `content_series`, `content_messages`, `reading_plans`, `church_events`, `monetization_partners`, etc.).

**Risco:** O ambiente local (`supabase start`) nao possui essas tabelas, impossibilitando desenvolvimento e teste local completo das Edge Functions. Depende do banco remoto ou de migracoes externas.

---

## 2. Quick Wins (baixo esforco, alto impacto)

### QW1 — Padronizar CORS no `_shared/cors.ts`

**Esforco:** Pequeno
**Impacto:** Seguranca

Substituir o wildcard `'*'` no `_shared/cors.ts` por uma funcao que valida o origin contra o allowlist. Funcoes que ja sobrescrevem o CORS individualmente podem ser simplificadas para usar o modulo compartilhado.

---

### QW2 — Remover paginas orfas

**Esforco:** Pequeno
**Impacto:** Clareza do codebase

Remover `BibleView.tsx`, `PublicHome.tsx` e `RequestsHub.tsx` (substituidos por versoes atuais). Mover `ChurchPage.tsx` para onde for necessario ou remover.

---

### QW3 — Migrar Edge Functions legadas para `Deno.serve()`

**Esforco:** Pequeno (12 funcoes, mudanca mecanica)
**Impacto:** Consistencia, preparacao para futuras atualizacoes do runtime

Substituir `import { serve } from 'https://deno.land/std@...'` + `serve(async (req) =>` por `Deno.serve(async (req: Request) =>` nas 12 funcoes legadas.

---

### QW4 — Adicionar ESLint rule para bloquear `console.log`

**Esforco:** Minimo (1 linha em `eslint.config.js`)
**Impacto:** Higiene de codigo

Adicionar `'no-console': 'warn'` ao ESLint config. Permite limpar gradualmente e prevenir novos usos.

---

### QW5 — Criar hook `useFetch` generico

**Esforco:** Medio
**Impacto:** Reducao de boilerplate, UX consistente

Extrair o padrao repetido `useState(loading) + useState(error) + useState(data) + useEffect(fetch)` para um hook reutilizavel (ou adotar TanStack Query conforme recomendado no `API_CONTRACT.md`).

---

### QW6 — Consolidar migracoes de seed da Biblia

**Esforco:** Pequeno
**Impacto:** Clareza para novos desenvolvedores

Criar uma unica migracao `squash` que insere os 66 livros com ON CONFLICT, substituindo as 4 migracoes parciais. Manter as antigas como historico.

---

### QW7 — Adicionar `.gitignore` para `_shared/cors.ts` no audit

**Esforco:** Minimo
**Impacto:** Gate mais robusto

Atualizar o `check-sprint0.mjs` para tambem verificar se `_shared/cors.ts` usa allowlist em vez de wildcard, ja que funcoes que importam desse modulo herdam o padrao.

---

## 3. Matriz de Priorizacao

| Item | Esforco | Impacto | Prioridade |
|------|---------|---------|------------|
| QW1 — CORS compartilhado | Pequeno | Alto (seguranca) | **P0** |
| QW7 — Audit CORS no shared | Minimo | Alto (gate) | **P0** |
| R2 — Testes automatizados | Grande | Alto (confianca) | **P1** (planejar) |
| QW3 — Deno.serve() | Pequeno | Medio (consistencia) | **P1** |
| QW5 — useFetch / TanStack Query | Medio | Alto (UX + DX) | **P1** |
| QW2 — Remover orfas | Pequeno | Baixo (clareza) | **P2** |
| QW4 — ESLint no-console | Minimo | Baixo (higiene) | **P2** |
| QW6 — Consolidar seeds | Pequeno | Baixo (clareza) | **P3** |

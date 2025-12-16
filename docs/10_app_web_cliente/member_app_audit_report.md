# Relatório de Estado – App Web Cliente (Autenticado) – MD Connect

## A. Visão Geral
**Auditor:** Agente Senior (UX + Segurança + Arquitetura)
**Data:** 14/12/2025
**Objetivo:** Avaliar conformidade do `member-app` com o novo padrão de segurança (Edge Functions Only), UX e Arquitetura.

> [!CAUTION]
> **Risco Crítico de Arquitetura Detectado**: 100% das chamadas de dados atuais são feitas via `supabase-js` client diretamente (`supabase.from`), violando a diretriz de "Edge Functions Only".

---

## B. Inventário de Navegação e Rotas
O aplicativo utiliza `react-router-dom` (SPA) na pasta `src/pages`.

| Rota (path) | Componente | Descrição |
| :--- | :--- | :--- |
| `/` | `Home.tsx` | Dashboard principal (Mural, Ações Rápidas). |
| `/login` | `Login.tsx` | Tela de entrada. |
| `/notices` | `Content/NoticesList` | Mural de avisos completo. |
| `/events` | `events/` | Lista de eventos (inferido). |
| `/requests/new` | `requests/NewRequest` | Solicitações pastorais. |
| `/profile` | `profile/` | Gestão de perfil e conta. |
| `/bible` | `BibleView.tsx` | Leitura da bíblia (integrada ou webview). |
| `/church/:slug` | `LandingPage.tsx` | (Provável) Landing page pública da igreja. |

---

## C. Fluxo de Autenticação e Contexto
- **Auth Provider (`AuthContext.tsx`):** Utiliza o listener nativo `supabase.auth.onAuthStateChange`.
- **Church Context (`ChurchContext.tsx`):**
  - Carrega a igreja baseada no `slug` da URL.
  - Armazena o objeto `church` em estado local e `localStorage`.
- **Risco:** O `church_id` é confiado no cliente via leitura de `profiles` ou `slug`. Um usuário malicioso poderia injetar um `church_id` diferente se as RLS não estiverem perfeitamente blindadas (hoje elas dependem de `lookup` no servidor, o que é bom, mas o cliente faz a query).

---

## D. Mapeamento de Chamadas de Dados e Riscos
**Padrão Atual:** Acesso Direto (`supabase.from`).
**Status:** ❌ **Não Conforme** (Toda a camada de serviço).

### Lista de Infrações (Amostragem)
| Arquivo (Service) | Tabela Acessada | Operação | Risco |
| :--- | :--- | :--- | :--- |
| `church.ts` | `churches` | SELECT | Médio (Exposição de dados da igreja). |
| `content.ts` | `posts` | SELECT | Baixo (Conteúdo público/membro). |
| `content.ts` | `user_content_history` | INSERT/UPDATE | Médio (Manipulação de histórico). |
| `event.ts` | `church_events` | SELECT | Baixo. |
| `feed.ts` | `posts`, `profiles` | SELECT | Médio (Depende de `profile.church_id`). |
| `monetization.ts` | `monetization_partners` | SELECT | Baixo. |
| `monetization.ts` | `monetization_tracking` | INSERT | Médio (Spam de analytics). |

**Nota:** Nenhuma chamada `functions.invoke` (Edge Function) foi encontrada.

---

## E. LGPD e Privacidade
- **Termos e Consentimento:** Não foram encontradas páginas explícitas de "Termos de Uso" ou "Política de Privacidade" no inventário de páginas.
- **Cookies:** Não há banner de consentimento de cookies visível no código analisado (`Home.tsx`, `App.tsx` implícito).
- **Controles do Usuário:** O perfil (`profile/`) precisa ser auditado para verificar se permite exportação/exclusão de dados (Direito ao Esquecimento).
- **Avaliação:** ⚠️ **Risco Médio**. A falta de páginas legais claras é um passivo jurídico.

---

## F. Avaliação de UX (Mobile Retention)
- **Home (`Home.tsx`):**
  - ✅ **Bons Pontos:** Usa `ScrollCue`, `NotificationTicker` (dinamismo), e seções claras (`PortalSection`). "Ações Rápidas" no topo é excelente para usabilidade.
  - ⚠️ **Pontos de Atenção:**
    - O **Mural** exibe um esqueleto (loading) ou cards horizontais. Em mobile, scroll horizontal excessivo pode reduzir engajamento.
    - **Footer:** "MD Connect Mobile v1.0" ocupa espaço nobre. Menus de navegação (Bottom Bar) não identificados no `Home.tsx` (provavelmente no `Layout`). Se não houver Bottom Bar, a navegação depende de "voltar", o que é ruim para retenção.
- **Performance Percebida:** O uso de `skeleton loaders` (linhas 56-70) mitiga a percepção de lentidão.

---

## G. Performance Web
- **Bundle:** React + Vite (inferido). Código parece modularizado por serviço.
- **Imagens:** Uso de tags `<img>` (via componentes UI) ou `div` com background? O `PortalCard` parece genérico. Se não usar `next/image` ou otimização de CDN do Supabase, imagens de eventos pesadas vão drenar dados móveis.
- **Caching:** `ChurchContext` usa `localStorage` para caching básico da igreja. `feed.ts` não implementa cache (SWR/React Query não identificados nas services, apenas `useEffect` simples no `Home.tsx`). Isso gera refetch desnecessário a cada navegação.

---

## H. Plano de Correção (Prioridades)

| Prioridade | Ação | Justificativa |
| :--- | :--- | :--- |
| **P0 (Crítico)** | Refatorar `src/services/*.ts` para usar **Edge Functions**. | Bloqueio de segurança/arquitetura exigido. Client não deve falar com DB diretamente. |
| **P0 (Crítico)** | Criar Edge Functions correspondentes (`get-feed`, `get-church`, etc). | Necessário para suportar a refatoração acima. |
| **P1 (Alto)** | Implementar Cache de Dados (TanStack Query ou SWR). | O padrão atual (`useEffect`) causa lentidão e sobrecarga no banco. |
| **P1 (Alto)** | Criar páginas de **Privacidade** e **Termos de Uso**. | Conformidade LGPD básica. |
| **P2 (Médio)** | Melhorar UX do Mural (Feed vertical vs Horizontal). | Aumentar tempo de tela e leitura. |
| **P2 (Médio)** | Otimizar imagens (Supabase Image Transformations). | Performance em redes móveis (3G/4G). |

---

### Conclusão do Auditor
O App possui uma base de UI funcional e moderna (componentes visuais ricos), mas sua arquitetura de dados está **obsoleta** em relação aos novos requisitos de segurança (Client-side fetching direto). A migração para Edge Functions é mandatória e urgente antes de qualquer expansão de features.

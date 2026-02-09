# Sprint 01 — Store Readiness

> Fase: Pre-lancamento
> Status: Planejado
> Ultima atualizacao: 2026-02-07

---

## 1. Objetivo

Preparar o app para submissao nas lojas (Google Play via TWA, Apple Web Clip) e conformidade legal. Ao final desta sprint, todos os requisitos obrigatorios de listagem e privacidade devem estar atendidos, sem lacunas que causem rejeicao na revisao.

---

## 2. Escopo

| Dentro do escopo | Fora do escopo |
|------------------|----------------|
| Politica de privacidade completa (LGPD + Play/Apple) | Implementacao de Service Worker / offline |
| Termos de uso completos | Capacitor / wrapper nativo |
| Formulario de seguranca de dados (Data Safety) | Push notifications |
| Manifest PWA + icones obrigatorios | Novos modulos de conteudo |
| Assets para listagem na store | Migracoes de banco |
| Pagina de exclusao de conta | Refatoracao de fetching (TanStack) |

---

## 3. Entregaveis

### 3.1 Politica de Privacidade

**Descricao:**
Redigir e publicar a politica de privacidade completa, acessivel em `/privacidade`. Deve cobrir todos os requisitos da LGPD e das diretrizes de Google Play e App Store.

**Conteudo obrigatorio:**
- [ ] Dados coletados: e-mail, nome, telefone (opcional), church_id, anon_id, session_id
- [ ] Dados coletados automaticamente: user_agent, rota, erros JS, eventos de analytics, UTM params
- [ ] Finalidade de cada coleta (autenticacao, analytics, error reporting, oracao, monetizacao)
- [ ] Base legal LGPD para cada tratamento (consentimento, execucao de contrato, interesse legitimo)
- [ ] Compartilhamento com terceiros: Google Analytics, Supabase (infra), nenhum dado vendido
- [ ] Cookies e localStorage: anon_id, session_id, church cache, progresso de leitura
- [ ] Retencao de dados: periodo definido por tipo
- [ ] Direitos do titular: acesso, correcao, exclusao, portabilidade, revogacao de consentimento
- [ ] Canal de contato do DPO/responsavel
- [ ] Procedimento de exclusao de conta e dados

**Criterios de aceite:**
- [ ] Conteudo renderizado em `/privacidade` via `PublicContentPage`
- [ ] Texto revisado por profissional juridico (ou flag de rascunho visivel)
- [ ] Acessivel sem login
- [ ] Link presente no footer do app (`FOOTER_LINKS.legal`)
- [ ] Sem jargao tecnico excessivo — linguagem acessivel

---

### 3.2 Termos de Uso

**Descricao:**
Redigir e publicar os termos de uso completos, acessiveis em `/termos`.

**Conteudo obrigatorio:**
- [ ] Descricao do servico (app devocional, comunidade, conteudo biblico)
- [ ] Elegibilidade (idade minima, conta por pessoa)
- [ ] Regras de uso aceitavel (conteudo de oracao, avisos, interacoes)
- [ ] Conteudo gerado por usuario (pedidos de oracao, reacoes) — licenca e moderacao
- [ ] Propriedade intelectual (conteudo MD Connect, traducoes biblicas, parceiros)
- [ ] Limitacao de responsabilidade
- [ ] Alteracoes nos termos (notificacao e aceite continuado)
- [ ] Legislacao aplicavel (Brasil, foro da comarca)
- [ ] Contato

**Criterios de aceite:**
- [ ] Conteudo renderizado em `/termos` via `PublicContentPage`
- [ ] Texto revisado por profissional juridico (ou flag de rascunho visivel)
- [ ] Acessivel sem login
- [ ] Link presente no footer do app

---

### 3.3 Pagina de Exclusao de Conta

**Descricao:**
Criar fluxo para o usuario autenticado solicitar exclusao de conta e todos os dados associados. Requisito obrigatorio da Google Play e App Store.

**Conteudo obrigatorio:**
- [ ] Botao "Excluir minha conta" na `PrivacyCenter` (`/c/:slug/profile/privacy`)
- [ ] Modal de confirmacao com aviso sobre irreversibilidade
- [ ] Descricao dos dados que serao excluidos (perfil, pedidos de oracao, progresso, anotacoes, historico)
- [ ] Prazo de efetivacao (ex: 30 dias, conforme LGPD)
- [ ] Edge Function `auth-delete-account` que marca a conta para exclusao
- [ ] E-mail de confirmacao ao usuario

**Criterios de aceite:**
- [ ] Fluxo funcional de ponta a ponta (botao → confirmacao → chamada → feedback)
- [ ] Conta marcada para exclusao no banco (soft delete, nao imediato)
- [ ] Dados anonimizados ou removidos apos periodo de carencia
- [ ] URL publica `/ajuda` documenta o processo de exclusao (requisito Play Store)

---

### 3.4 Formulario de Seguranca de Dados (Data Safety)

**Descricao:**
Documentar internamente o mapeamento completo de dados para preencher o formulario "Data Safety" da Google Play e o equivalente "App Privacy" da Apple.

**Entregavel:** Arquivo `docs/sprints/data-safety-mapping.md` com:

- [ ] Tabela de dados coletados vs finalidade vs compartilhamento vs opcional/obrigatorio
- [ ] Indicacao de criptografia em transito (HTTPS) e em repouso (Supabase)
- [ ] Indicacao de exclusao disponivel (sim, via fluxo 3.3)
- [ ] Mapeamento para cada categoria Play Store: Localizacao (nao), Informacoes pessoais (nome, e-mail), Atividade no app (analytics, conteudo visualizado), Identificadores (anon_id, user_id)
- [ ] Mapeamento para cada categoria Apple: Contact Info, Usage Data, Identifiers, Diagnostics

**Criterios de aceite:**
- [ ] Documento completo e revisado
- [ ] Consistente com o texto da politica de privacidade (3.1)
- [ ] Suficiente para preencher o formulario da Play Console sem duvidas

---

### 3.5 Web App Manifest + Icones

**Descricao:**
Criar `public/manifest.json` completo e gerar icones em todos os tamanhos obrigatorios.

**Entregavel:**
- [ ] `public/manifest.json` com: `name`, `short_name`, `description`, `start_url: "/"`, `scope: "/"`, `display: "standalone"`, `theme_color`, `background_color`, `orientation: "portrait"`, `lang: "pt-BR"`, `icons`, `screenshots`
- [ ] Icones PNG: 48x48, 72x72, 96x96, 144x144, 192x192, 512x512
- [ ] Icone maskable 512x512 (com safe zone)
- [ ] `apple-touch-icon` 180x180
- [ ] `<link rel="manifest" href="/manifest.json">` no `index.html`
- [ ] Meta tags Apple: `apple-mobile-web-app-capable`, `apple-mobile-web-app-status-bar-style`

**Criterios de aceite:**
- [ ] Chrome DevTools > Application > Manifest sem erros
- [ ] Lighthouse PWA: "Web app manifest meets the installability requirements"
- [ ] Prompt "Adicionar a tela inicial" funcional no Chrome Android
- [ ] Icone correto exibido na tela inicial apos instalacao

---

### 3.6 Assets para Listagem na Store

**Descricao:**
Preparar checklist e gerar os assets graficos necessarios para a listagem na Google Play e Apple App Store.

**Entregavel:** Arquivo `docs/sprints/store-assets-checklist.md` com status de cada item:

**Google Play:**
- [ ] Icone do app (512x512 PNG, 32-bit, sem transparencia)
- [ ] Feature Graphic (1024x500 PNG ou JPG)
- [ ] Screenshots: minimo 2, max 8 (phone: 16:9 ou 9:16, min 320px, max 3840px)
- [ ] Titulo curto (max 30 caracteres)
- [ ] Descricao curta (max 80 caracteres)
- [ ] Descricao completa (max 4000 caracteres, PT-BR)
- [ ] Categoria: Lifestyle ou Books & Reference
- [ ] Classificacao de conteudo (questionario IARC preenchido)
- [ ] URL da politica de privacidade
- [ ] E-mail de contato do desenvolvedor

**Apple App Store:**
- [ ] Icone (1024x1024 PNG, sem alpha)
- [ ] Screenshots iPhone 6.7" (1290x2796 ou 2796x1290)
- [ ] Screenshots iPhone 6.5" (1284x2778 ou 2778x1284)
- [ ] Nome do app (max 30 caracteres)
- [ ] Subtitulo (max 30 caracteres)
- [ ] Descricao (max 4000 caracteres)
- [ ] Keywords (max 100 caracteres)
- [ ] URL de privacidade
- [ ] URL de suporte

**Criterios de aceite:**
- [ ] Todos os assets obrigatorios gerados e armazenados no repositorio (`assets/store/`)
- [ ] Textos em PT-BR, revisados
- [ ] Checklist atualizado com status (pronto/pendente) por item

---

## 4. Gates de Qualidade (Automatizados)

Todos os gates devem passar antes do merge da sprint:

```bash
pnpm lint                    # Zero erros ESLint
pnpm build                   # Build TypeScript + Vite sem falhas
pnpm check:ui                # Todas as paginas usam InternalPageLayout
pnpm check:sprint0           # Gate Sprint 0 completo (env, BFF, CORS, UI)
```

**Criterios:**
- [ ] `pnpm lint` — exit code 0
- [ ] `pnpm build` — exit code 0, sem erros de tipo
- [ ] `pnpm check:ui` — 100% conformidade (paginas especiais isentas)
- [ ] `pnpm check:sprint0` — todos os 4 checks obrigatorios passando

---

## 5. Validacao Manual (GP Review Simulation)

Checklist manual simulando a revisao da Google Play. Cada item deve ser verificado por uma pessoa antes da submissao:

### 5.1 Privacidade e Dados

- [ ] Politica de privacidade acessivel via URL publica (sem login)
- [ ] Politica menciona todos os dados coletados pelo app
- [ ] Fluxo de exclusao de conta funcional e documentado
- [ ] Data Safety consistente com a politica de privacidade
- [ ] Link de privacidade presente no footer de todas as paginas

### 5.2 Conteudo e Classificacao

- [ ] Nenhum conteudo para adultos, violencia ou linguagem inapropriada
- [ ] Conteudo gerado por usuario (oracao) com moderacao ou filtro descrito
- [ ] Classificacao IARC compativel com o conteudo real

### 5.3 Funcionalidade

- [ ] App abre sem crash em Chrome Android (v100+)
- [ ] App abre sem crash em Safari iOS (v15+)
- [ ] Todas as rotas publicas acessiveis sem login
- [ ] Login/logout funcional
- [ ] Nenhum link quebrado nas paginas institucionais (privacidade, termos, ajuda, transparencia)
- [ ] Console (F12) sem erros vermelhos em fluxo normal

### 5.4 Assets e Metadados

- [ ] Icone do app visivel e correto apos instalacao PWA
- [ ] Nome e descricao curta refletem a funcionalidade real
- [ ] Screenshots correspondem a versao atual do app
- [ ] Feature Graphic sem texto cortado ou deformado

### 5.5 Performance Minima

- [ ] Primeira carga interativa em < 3 segundos (4G simulado)
- [ ] Sem layout shift visivel na primeira dobra (CLS < 0.1)
- [ ] Lighthouse Performance score >= 80 (mobile)

---

## 6. Definition of Done

A sprint so e considerada **PRONTA** quando todos os criterios abaixo forem atendidos:

### Obrigatorios (bloqueiam merge)

- [ ] Politica de privacidade publicada e acessivel em `/privacidade`
- [ ] Termos de uso publicados e acessiveis em `/termos`
- [ ] Fluxo de exclusao de conta funcional
- [ ] Web App Manifest valido com todos os icones
- [ ] Data Safety mapeado em documento interno
- [ ] Store assets checklist completo
- [ ] Gates automatizados passando (`lint`, `build`, `check:ui`, `check:sprint0`)
- [ ] Validacao manual GP concluida (secao 5) sem itens bloqueantes

### Recomendados (nao bloqueiam, mas devem ser rastreados)

- [ ] Texto juridico revisado por profissional (pode ter flag "rascunho" temporario)
- [ ] Screenshots finais geradas (podem ser atualizadas antes da submissao real)
- [ ] Lighthouse PWA badge "installable" sem warnings

---

## 7. Riscos

| Risco | Probabilidade | Impacto | Mitigacao |
|-------|---------------|---------|-----------|
| Rejeicao por politica de privacidade incompleta | Media | Alto | Usar template LGPD + Play Store como base; revisar com juridico |
| Exclusao de conta complexa (dados em multiplas tabelas) | Media | Medio | Soft delete com anonimizacao apos 30 dias; nao precisa ser imediato |
| `PrivacyCenter.tsx` usa `supabase.from('members')` diretamente | Confirmado | Medio | Migrar para Edge Function nesta sprint (violacao BFF) |
| Icones maskable com safe zone incorreta | Baixa | Baixo | Usar ferramenta maskable.app para validar |
| Conteudo de `/privacidade` e `/termos` depende de Edge Function `public-page-get` que pode nao existir | Media | Alto | Verificar se a function existe; criar se necessario ou usar conteudo estatico como fallback |

# Backlog de Sprints 1–3 — MD Connect App

> Baseado no `MD_CONNECT_APP_MASTER_PLAN.md`, `ROADMAP_FASE1.md` e analise do repositorio.
> Ultima atualizacao: 2026-02-07

---

## Contexto

As Sprints 0.1 (baseline), 1.1 (CORS/Edge) e 1.2 (migracao BFF) do roadmap ja foram executadas. O backlog abaixo cobre os proximos 3 ciclos, focando em: prontidao para store, performance/offline, wrapper mobile e novos modulos de conteudo biblico.

---

## Sprint 1 — Store Readiness + PWA Foundation

Objetivo: Tornar o app instalavel, com manifest, icones e meta tags completos para submissao na Google Play (TWA) e Apple Web Clip.

---

### S1-01: Criar Web App Manifest

**Descricao:**
Criar `public/manifest.json` com nome, short_name, icones (192x192, 512x512, maskable), theme_color, background_color, display: standalone, start_url, scope e screenshots. Registrar o manifest no `index.html` via `<link rel="manifest">`.

**Criterios de aceite:**
- [ ] Arquivo `manifest.json` presente em `public/` com todos os campos obrigatorios
- [ ] Icones PNG em 192x192, 512x512 e versao maskable
- [ ] `index.html` referencia o manifest
- [ ] Chrome DevTools > Application > Manifest exibe todos os campos sem erro
- [ ] Prompt "Adicionar a tela inicial" aparece no Chrome Android

**Risco:** Baixo

---

### S1-02: Registrar Service Worker basico

**Descricao:**
Configurar `vite-plugin-pwa` (ou equivalente) para gerar um Service Worker com estrategia de cache minima: app shell (HTML/CSS/JS) em cache-first, chamadas de API em network-first. Registrar o SW no `main.tsx`.

**Criterios de aceite:**
- [ ] Service Worker registrado com sucesso (DevTools > Application > Service Workers)
- [ ] Assets estaticos servidos do cache apos primeira visita
- [ ] App carrega a shell offline (exibe tela de fallback para dados)
- [ ] Atualizacoes do SW aplicadas automaticamente (skipWaiting + clientsClaim)
- [ ] Lighthouse PWA score >= 80

**Risco:** Medio — requer cuidado com invalidacao de cache e versionamento

---

### S1-03: Meta tags para Apple e Microsoft

**Descricao:**
Adicionar meta tags `apple-mobile-web-app-capable`, `apple-mobile-web-app-status-bar-style`, `apple-touch-icon` e `msapplication-TileColor` no `index.html`. Garantir que o app funcione como Web Clip no iOS.

**Criterios de aceite:**
- [ ] `apple-touch-icon` (180x180) presente em `public/`
- [ ] Meta tags adicionadas ao `<head>` do `index.html`
- [ ] App adicionavel a tela inicial no Safari iOS
- [ ] Splash screen exibida ao abrir no iOS

**Risco:** Baixo

---

### S1-04: Configurar TWA (Trusted Web Activity) para Google Play

**Descricao:**
Criar configuracao Bubblewrap/TWA com `assetlinks.json` para validacao de dominio. Gerar APK assinado para submissao na Play Store. Configurar `/.well-known/assetlinks.json` no Vercel.

**Criterios de aceite:**
- [ ] `assetlinks.json` servido corretamente em `https://mdconnect.app/.well-known/assetlinks.json`
- [ ] APK gerado via Bubblewrap abre o app em tela cheia (sem barra do navegador)
- [ ] Validacao de dominio confirmada pelo Play Console
- [ ] Build APK reproduzivel via script documentado

**Risco:** Medio — depende de conta Google Play, chave de assinatura e dominio verificado

---

### S1-05: Splash screen e tema dinamico

**Descricao:**
Configurar splash screen nativa via manifest (background_color + icone). Implementar `theme-color` dinamico que acompanha a cor primaria da denominacao (IPDA, futuramente outras).

**Criterios de aceite:**
- [ ] Splash screen exibida ao abrir o app via atalho
- [ ] `theme-color` no `<meta>` reflete a cor da denominacao ativa
- [ ] Sem flash branco durante carregamento inicial

**Risco:** Baixo

---

## Sprint 2 — Performance, Offline e Cache

Objetivo: Melhorar tempos de carregamento, implementar cache inteligente e garantir experiencia offline minima.

---

### S2-01: Adotar TanStack Query para data fetching

**Descricao:**
Instalar `@tanstack/react-query` e migrar o padrao `useEffect + useState` para `useQuery`/`useMutation` nas paginas de dados. Configurar TTLs conforme recomendado no `API_CONTRACT.md`: feed 2-5 min, igreja/perfil 30-60 min, eventos 5-10 min.

**Criterios de aceite:**
- [ ] TanStack Query configurado com `QueryClientProvider` no `App.tsx`
- [ ] Pelo menos 10 paginas migradas (priorizando as mais acessadas: Home, Devotionals, Bible, Prayer)
- [ ] Navegacao entre paginas nao dispara re-fetch desnecessario (dados em cache)
- [ ] Indicadores de `loading`, `error` e `stale` funcionais
- [ ] Nenhuma regressao visual

**Risco:** Medio — migracao progressiva em 30 paginas; risco de regressao se feita em lote

---

### S2-02: Pre-cache de conteudo critico offline

**Descricao:**
Configurar o Service Worker para pre-cachear: devocional do dia, ultimo capitulo da Biblia lido e dados da igreja (perfil/agenda). Exibir indicador visual quando offline com dados cacheados.

**Criterios de aceite:**
- [ ] Devocional do dia acessivel offline apos primeira leitura
- [ ] Ultimo capitulo da Biblia lido acessivel offline
- [ ] Banner "Voce esta offline" exibido quando sem conexao
- [ ] Dados atualizados automaticamente ao reconectar
- [ ] Tamanho do cache limitado (max 50 MB, LRU eviction)

**Risco:** Alto — complexidade de sincronizacao e limites de storage em dispositivos antigos

---

### S2-03: Otimizar bundle size (code splitting)

**Descricao:**
Auditar o bundle com `vite-bundle-visualizer`. Garantir que lazy loading esta funcionando corretamente. Extrair dependencias pesadas (date-fns locales, Radix, Bible data) em chunks separados. Alvo: bundle inicial < 200KB gzipped.

**Criterios de aceite:**
- [ ] Relatorio de bundle gerado e documentado
- [ ] Bundle inicial (first load) < 200KB gzipped
- [ ] Chunks de rotas carregados sob demanda (verificar Network tab)
- [ ] `date-fns` tree-shaken (apenas locales utilizados)
- [ ] Lighthouse Performance score >= 85 em mobile (4G simulado)

**Risco:** Baixo

---

### S2-04: Implementar skeleton loading padronizado

**Descricao:**
Criar componente `SkeletonPage` reutilizavel que espelha o layout de `InternalPageLayout`. Substituir o `PageLoader` (spinner generico) por skeletons contextuais nas paginas mais acessadas.

**Criterios de aceite:**
- [ ] Componente `SkeletonPage` criado com variantes (lista, detalhe, grid)
- [ ] Aplicado em pelo menos 5 paginas principais (Home, DevotionalDetail, BibleReader, PrayerHub, NoticeList)
- [ ] CLS < 0.1 nas paginas migradas (sem pulo de layout)
- [ ] Skeleton desaparece em < 300ms em conexao rapida

**Risco:** Baixo

---

### S2-05: Implementar prefetch de rotas adjacentes

**Descricao:**
Adicionar prefetch de dados para rotas provaveis (ex: ao visualizar lista de devocionais, pre-carregar o primeiro item; ao ler capitulo 3, pre-carregar capitulo 4). Usar `queryClient.prefetchQuery` do TanStack Query.

**Criterios de aceite:**
- [ ] Navegacao entre devocionais da lista para detalhe e instantanea (dados ja em cache)
- [ ] Navegacao entre capitulos da Biblia sem loading visivel
- [ ] Prefetch nao impacta performance da pagina atual (prioridade `idle`)
- [ ] Sem requisicoes duplicadas (deduplicacao pelo TanStack Query)

**Risco:** Baixo — depende de S2-01 concluido

---

## Sprint 3 — Mobile Wrapper + Novos Modulos Biblicos

Objetivo: Preparar o app para distribuicao nativa (Capacitor) e lancar os primeiros modulos avancados de estudo biblico.

---

### S3-01: Integrar Capacitor para wrapper nativo

**Descricao:**
Adicionar `@capacitor/core` e `@capacitor/cli` ao projeto. Configurar plataformas Android e iOS. Garantir que funcionalidades web (auth, navigation, deep links) funcionem dentro do wrapper nativo.

**Criterios de aceite:**
- [ ] `npx cap init` executado com configuracao correta (appId, appName, webDir: dist)
- [ ] `npx cap add android` e `npx cap add ios` executados sem erro
- [ ] App abre e navega corretamente no emulador Android
- [ ] App abre e navega corretamente no simulador iOS
- [ ] Login via Supabase Auth funciona dentro do wrapper
- [ ] Deep links (`/c/:slug`, `/devocionais/:id`) funcionam

**Risco:** Alto — integracao de auth em webview, comportamento de cookies/storage, e configuracao de build nativo

---

### S3-02: Push Notifications via Capacitor

**Descricao:**
Configurar `@capacitor/push-notifications` para Android (FCM) e iOS (APNs). Criar Edge Function para envio de notificacoes. Implementar opt-in no app com preferencias de tipo (devocional, avisos, eventos).

**Criterios de aceite:**
- [ ] Token de push registrado no backend apos opt-in
- [ ] Notificacao recebida com app em foreground e background
- [ ] Toque na notificacao abre a rota correta (deep link)
- [ ] Tela de preferencias permite ativar/desativar por tipo
- [ ] Respeita consentimento LGPD (opt-in explicito)

**Risco:** Alto — configuracao de FCM/APNs, certificados iOS, e fluxo de permissao do SO

---

### S3-03: Modulo Dicionario Biblico

**Descricao:**
Criar modulo de dicionario com termos teologicos e palavras-chave. Permitir busca por termo e navegacao alfabetica. Integrar com o leitor da Biblia: ao tocar em uma palavra, exibir definicao em modal.

**Criterios de aceite:**
- [ ] Edge Function `public-dictionary-search` criada com busca por termo e paginacao
- [ ] Pagina `/biblia/dicionario` com busca e navegacao A-Z
- [ ] Modal de definicao acessivel a partir do `BibleReader` (long-press ou icone)
- [ ] Dados seed com pelo menos 200 termos iniciais
- [ ] Usa `InternalPageLayout`
- [ ] Feature flag: `FEATURE_BIBLE_DICTIONARY`

**Risco:** Medio — depende de curadoria de conteudo teologico e decisao sobre fonte de dados (proprio vs API externa)

---

### S3-04: Modulo Texto Original (Hebraico/Grego)

**Descricao:**
Criar visualizacao interlinear que exibe o texto original (hebraico AT / grego NT) lado a lado com a traducao em portugues. Incluir transliteracao e numero Strong para cada palavra.

**Criterios de aceite:**
- [ ] Edge Function `public-interlinear-verse` retorna texto original + traducao + Strong number
- [ ] Pagina `/biblia/:bookId/:chapterId/original` com visualizacao interlinear
- [ ] Toque em palavra original exibe: transliteracao, traducao literal, numero Strong
- [ ] Integracao com dicionario (S3-03): link direto do Strong para o verbete
- [ ] Suporte a fontes hebraica (RTL) e grega
- [ ] Feature flag: `FEATURE_BIBLE_ORIGINAL_TEXT`

**Risco:** Alto — fontes RTL, dados interlineares volumosos, licenciamento de base de dados Strong, performance de renderizacao

---

### S3-05: Modulo Biblia de Estudo

**Descricao:**
Expandir o `BibleReader` com camada de notas de estudo: introducao ao livro, contexto historico (ja existente em `bible_books`), notas de rodape por versiculo, referencias cruzadas e mapas. Exibir como painel lateral/inferior toggleavel.

**Criterios de aceite:**
- [ ] Painel de estudo toggleavel no `BibleReader` (botao "Estudo")
- [ ] Secao "Introducao" usa dados de `bible_books` (contexto historico, temas)
- [ ] Notas de rodape por versiculo via `bible_commentaries` (ja existente)
- [ ] Referencias cruzadas clicaveis (navegam para o versiculo referenciado)
- [ ] Edge Function `public-study-notes` para notas editoriais futuras
- [ ] Feature flag: `FEATURE_STUDY_BIBLE`

**Risco:** Medio — volume de conteudo editorial, UX de painel em tela mobile, e integracao com dados existentes de `bible_commentaries`

---

### S3-06: Modulo de Anotacoes Pessoais na Biblia

**Descricao:**
Permitir que usuarios autenticados criem anotacoes, destaques (highlight) e marcadores em versiculos. Sincronizar via Edge Function. Exibir destaques no `BibleReader` e listar todas as anotacoes em uma pagina dedicada.

**Criterios de aceite:**
- [ ] Tabela `user_bible_notes` criada (user_id, book_id, chapter, verse, note_text, highlight_color, created_at)
- [ ] Edge Functions: `church-bible-notes-list`, `church-bible-notes-upsert`, `church-bible-notes-delete`
- [ ] Versiculos destacados exibidos com cor de fundo no `BibleReader`
- [ ] Pagina `/c/:slug/biblia/anotacoes` lista todas as anotacoes do usuario
- [ ] Limite de 1000 anotacoes por usuario (rate limit na Edge Function)
- [ ] Feature flag: `FEATURE_BIBLE_NOTES`

**Risco:** Medio — sincronizacao offline, performance de renderizacao com muitos destaques, e moderacao (anotacoes sao privadas)

---

## Matriz de Dependencias

```
S1-01 ──→ S1-02 ──→ S2-02
S1-01 ──→ S1-03
S1-01 ──→ S1-04
            │
S2-01 ──→ S2-05
S2-01 ──→ S2-02
            │
S1-02 ──→ S3-01 ──→ S3-02
            │
S3-03 ←──→ S3-04 (integrados via Strong numbers)
S3-03 ──→ S3-05
```

---

## Resumo por Sprint

| Sprint | Foco | Itens | Risco Geral |
|--------|------|-------|-------------|
| **Sprint 1** | Store Readiness + PWA | 5 itens (manifest, SW, Apple, TWA, splash) | Baixo-Medio |
| **Sprint 2** | Performance + Offline | 5 itens (TanStack, offline, bundle, skeleton, prefetch) | Medio |
| **Sprint 3** | Mobile Wrapper + Modulos Biblicos | 6 itens (Capacitor, push, dicionario, original, estudo, anotacoes) | Medio-Alto |

---

## Pre-requisitos Transversais

Estes itens do `06_RISKS_AND_QUICKWINS.md` devem ser resolvidos **antes** de iniciar as Sprints acima:

| Item | Motivo |
|------|--------|
| QW1 — CORS compartilhado | Store review pode rejeitar app com CORS wildcard |
| QW3 — Migrar para Deno.serve() | Funcoes legadas podem quebrar com atualizacao do runtime |
| QW5 — Hook de fetching ou TanStack Query | Pre-requisito direto para S2-01 |
| R2 — Planejar testes automatizados | Risco de regressao cresce com novos modulos |

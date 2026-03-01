# Visao Geral do Supabase — MD Connect App

> Gerado a partir de `supabase/`.
> Ultima atualizacao: 2026-02-07

---

## 1. Estrutura do Diretorio

```
supabase/
├── config.toml                 # Configuracao do Supabase local (functions habilitadas, JWT)
├── functions/
│   ├── _shared/
│   │   └── cors.ts             # Helpers compartilhados (CORS, jsonResponse)
│   ├── <36 Edge Functions>     # Deno/TypeScript (ver secao 4)
│   └── deno.json               # Config Deno global
└── migrations/
    └── <21 arquivos .sql>      # Migracoes sequenciais (ver secao 2)
```

---

## 2. Migracoes (`supabase/migrations/`)

21 arquivos de migracao ordenados cronologicamente. Criam tabelas, indices, RLS policies, funcoes RPC, triggers, storage buckets e views materializadas.

### Linha do Tempo

| Migracao | Data | Dominio |
|----------|------|---------|
| `20241216000000_init_sprint3.sql` | Dez 2024 | Devocionais + Pedidos de oracao (tabelas iniciais) |
| `20250101000000_verse_posters.sql` | Jan 2025 | Posters de versiculos + bucket de storage |
| `20250102000000_create_bible_books.sql` | Jan 2025 | Metadados dos 66 livros da Biblia |
| `20250102000000_optimize_devotionals.sql` | Jan 2025 | Traducoes de devocionais + historico de leitura |
| `20250102010000_seed_remaining_books.sql` | Jan 2025 | Seed dos livros restantes da Biblia |
| `20250102020000_auto_context_trigger.sql` | Jan 2025 | Trigger para contexto biblico automatico |
| `20250102030000_seed_full_bible.sql` | Jan 2025 | Seed completo dos 66 livros |
| `20250102040000_seed_chunked_safely.sql` | Jan 2025 | Seed idempotente com ON CONFLICT |
| `20250102120000_bucket_devotional_covers.sql` | Jan 2025 | Bucket para capas de devocionais |
| `20251217_create_partners.sql` | Dez 2025 | Parceiros e leads |
| `20251218000000_social_proof.sql` | Dez 2025 | Reacoes (amem) e contagem de leituras |
| `20251219000000_bible_commentaries.sql` | Dez 2025 | Comentarios teologicos por passagem |
| `20251219010000_global_optimization.sql` | Dez 2025 | Indices globais e ANALYZE |
| `20251219020000_enhance_social_proof.sql` | Dez 2025 | Evolucao de reacoes (reaction_type) |
| `20251219030000_public_reads.sql` | Dez 2025 | Leituras anonimas (session_hash) |
| `20251219040000_prayer_requests.sql` | Dez 2025 | Pedidos de oracao v2 + reacoes de oracao |
| `20251219050000_prayer_contact.sql` | Dez 2025 | Consentimento de contato em pedidos |
| `20251220180000_analytics_events.sql` | Dez 2025 | Eventos de analytics com UTM |
| `20251221030000_analytics_kpi_views.sql` | Dez 2025 | Views materializadas de KPI |
| `20251222000000_client_error_reports.sql` | Dez 2025 | Relatorios de erro do client |
| `20251225000000_add_churches_cover_image.sql` | Dez 2025 | Imagem de capa em churches |

---

## 3. Dominios e Tabelas

### 3.1 Devocionais e Conteudo

| Tabela | Descricao |
|--------|-----------|
| `devotionals` | Devocionais diarios (titulo, corpo, versiculo, capa, data, idioma) |
| `devotional_translations` | Traducoes multi-idioma de devocionais (FK → devotionals) |
| `devotional_reads` | Historico de leitura autenticada (user_id + devotional_id + data) |
| `devotional_reads_public` | Leituras anonimas por session_hash (deduplicacao diaria) |
| `devotional_reactions` | Reacoes "amem" em devocionais (user_id + devotional_id, unico) |

### 3.2 Biblia

| Tabela | Descricao |
|--------|-----------|
| `bible_books` | Metadados dos 66 livros (contexto historico, temas, aplicacoes) |
| `bible_commentaries` | Comentarios teologicos por passagem (livro, capitulo, versiculo) |
| `verse_reactions` | Reacoes "amem" em versiculos especificos |
| `verse_posters` | Imagens geradas com versiculos (hash unico para deduplicacao) |

### 3.3 Oracao e Pedidos

| Tabela | Descricao |
|--------|-----------|
| `prayer_requests` | Pedidos de oracao (categoria, urgencia, privacidade, status, contato) |
| `prayer_reactions` | Reacoes "orando por voce" em pedidos (request_id + user_id) |

### 3.4 Parceiros e Monetizacao

| Tabela | Descricao |
|--------|-----------|
| `partners` | Parceiros cadastrados (nome, logo, link, tier: standard/gold/platinum) |
| `partner_leads` | Leads de novos parceiros (nome, whatsapp, status) |

### 3.5 Analytics e Observabilidade

| Tabela | Descricao |
|--------|-----------|
| `analytics_events` | Eventos de rastreamento (sessao, pagina, UTM, partner_id, meta) |
| `client_error_reports` | Erros capturados no client (fingerprint, deduplicacao, severidade, stack) |

### 3.6 KPIs (Views Materializadas)

| View | Descricao |
|------|-----------|
| `kpi_daily` | Agregacao diaria: total de views, sessoes unicas, top 5 paginas |
| `kpi_partners_daily` | Agregacao diaria por parceiro: views, cliques, CTR |

### 3.7 Tabelas Externas (referenciadas mas nao criadas nas migracoes)

Estas tabelas sao referenciadas nas Edge Functions e services mas nao possuem migracoes neste repositorio. Provavelmente criadas no projeto fullstack ou via dashboard do Supabase:

| Tabela | Referenciada em |
|--------|-----------------|
| `profiles` | `church-session-context` (church_id do usuario) |
| `churches` | `public-churches-list`, `church-session-context` |
| `posts` | `church-posts-list`, `church-post-detail` (devocionais, noticias, avisos) |
| `content_series` | `church-series-list`, `church-series-detail` |
| `content_messages` | `church-message-detail`, `church-messages-by-series` |
| `reading_plans` | `church-reading-plans-list`, `church-reading-plan-detail` |
| `reading_plan_days` | `church-plan-days-list` |
| `user_plan_progress` | `church-plan-progress-get`, `church-plan-progress-upsert` |
| `church_events` | `member-events` |
| `user_content_history` | `church-content-history`, `church-content-mark-read` |
| `monetization_partners` | `public-monetization-partners` |
| `monetization_services` | `public-monetization-services`, `public-monetization-service-detail` |
| `monetization_tracking` | `monetization-track` |

---

## 4. Edge Functions (`supabase/functions/`)

36 funcoes organizadas por dominio. Todas escritas em Deno/TypeScript, retornam o envelope padrao `{ ok, data, error, meta }`.

### 4.1 Autenticacao e Contexto

| Funcao | Auth | Descricao |
|--------|------|-----------|
| `church-session-context` | JWT | Retorna `church_id` do usuario autenticado (via `profiles`) |

### 4.2 Conteudo da Igreja (prefixo `church-`)

| Funcao | Auth | Descricao |
|--------|------|-----------|
| `church-posts-list` | JWT | Lista posts da igreja (tipo, paginacao) |
| `church-post-detail` | JWT | Detalhe de um post |
| `church-series-list` | JWT | Lista series de mensagens |
| `church-series-detail` | JWT | Detalhe de uma serie |
| `church-messages-by-series` | JWT | Mensagens de uma serie |
| `church-message-detail` | JWT | Detalhe de uma mensagem |
| `church-reading-plans-list` | JWT | Lista planos de leitura |
| `church-reading-plan-detail` | JWT | Detalhe de um plano |
| `church-plan-days-list` | JWT | Dias de um plano de leitura |
| `church-plan-progress-get` | JWT | Progresso do usuario em um plano |
| `church-plan-progress-upsert` | JWT | Atualiza progresso do plano |
| `church-content-history` | JWT | Historico de conteudo lido |
| `church-content-mark-read` | JWT | Marca conteudo como lido |
| `church-pastoral-requests-create` | JWT | Cria pedido pastoral |

### 4.3 Devocionais

| Funcao | Auth | Descricao |
|--------|------|-----------|
| `devotionals-get` | Nao | Busca devocional (por data ou ID) |
| `devotionals-generate-cover` | Service | Gera capa de devocional (provavelmente via IA) |

### 4.4 Biblia e IA

| Funcao | Auth | Descricao |
|--------|------|-----------|
| `public-bible-books` | Nao | Lista livros da Biblia com metadados |
| `generate-verse-commentary` | Nao | Gera comentario teologico via IA |
| `generate-book-context` | Nao | Gera contexto historico de um livro via IA |
| `verse-image-generate` | Nao | Gera imagem com versiculo |

### 4.5 Oracao

| Funcao | Auth | Descricao |
|--------|------|-----------|
| `prayer-requests-create` | Nao | Cria pedido de oracao (publico) |
| `prayer-confirmation` | JWT | Confirmacao/interacao com pedido |

### 4.6 Monetizacao e Parceiros

| Funcao | Auth | Descricao |
|--------|------|-----------|
| `partners-get` | Nao | Lista parceiros ativos |
| `partner-leads-create` | Nao | Registra lead de parceiro |
| `public-monetization-partners` | Nao | Parceiros para exibicao publica |
| `public-monetization-services` | Nao | Lista servicos disponiveis |
| `public-monetization-service-detail` | Nao | Detalhe de um servico |
| `monetization-track` | Nao | Rastreia clique/visualizacao de parceiro |

### 4.7 Igrejas

| Funcao | Auth | Descricao |
|--------|------|-----------|
| `public-churches-list` | Nao | Lista igrejas publicas (busca, filtros) |

### 4.8 Eventos

| Funcao | Auth | Descricao |
|--------|------|-----------|
| `member-events` | JWT | Lista eventos da igreja do membro |

### 4.9 Analytics e Observabilidade

| Funcao | Auth | Descricao |
|--------|------|-----------|
| `track-event` | Nao | Registra evento de analytics (rate limited: 60/min) |
| `track-public-read` | Nao | Registra leitura publica anonima |
| `report-client-error` | Nao | Registra erro do client (sanitiza PII, deduplica) |
| `kpi` | Service | Dashboard KPI geral (views, sessoes) |
| `kpi-partners` | Service | Dashboard KPI de parceiros (views, cliques, CTR) |

---

## 5. Infraestrutura Compartilhada

### `_shared/cors.ts`

Modulo reutilizado por todas as Edge Functions:

- `corsHeaders` — headers CORS padrao
- `handleCors(req)` — responde a requisicoes OPTIONS (preflight)
- `jsonResponse(data, status, origin?)` — cria resposta JSON com headers CORS

> **Nota:** O arquivo `_shared/cors.ts` ainda contem `'*'` como origin padrao, porem as funcoes individuais aplicam o CORS allowlist diretamente. O gate Sprint 0 valida que nenhuma funcao use wildcard em producao.

### Storage Buckets

| Bucket | Acesso | Uso |
|--------|--------|-----|
| `verse-posters` | Publico (leitura) | Imagens geradas com versiculos |
| `devotional-covers` | Publico (leitura) | Capas de devocionais |

### Funcoes RPC (banco)

| Funcao | Descricao |
|--------|-----------|
| `toggle_devotional_amen()` | Toggle de reacao "amem" em devocional |
| `get_devotional_social()` | Contadores sociais de devocional (amem, leituras) |
| `get_devotional_social_combined()` | Contadores combinados (autenticados + anonimos) |
| `toggle_verse_amen()` | Toggle de reacao em versiculo |
| `get_chapter_stats()` | Estatisticas de reacoes por capitulo |
| `toggle_prayer_reaction()` | Toggle de "orando por voce" |
| `get_prayer_feed()` | Feed de pedidos de oracao com contadores |
| `refresh_kpi_views()` | Atualiza views materializadas de KPI |

---

## 6. Politicas RLS (Resumo)

Todas as tabelas possuem RLS habilitado. Padrao geral:

| Padrao | Tabelas |
|--------|---------|
| **Leitura publica** | `devotionals`, `bible_books`, `bible_commentaries`, `partners`, `verse_posters`, `devotional_translations` |
| **Leitura publica + escrita autenticada** | `devotional_reactions`, `verse_reactions`, `prayer_requests`, `prayer_reactions` |
| **Insert publico (sem login)** | `partner_leads`, `devotional_reads_public` |
| **Apenas service_role** | `analytics_events`, `client_error_reports`, `bible_commentaries` (insert) |
| **Apenas dono (auth.uid = user_id)** | `devotional_reads`, `prayer_requests` (update) |

---

## 7. Configuracao Local (`config.toml`)

Apenas duas funcoes possuem configuracao explicita no `config.toml`:

- `member-events` — JWT obrigatorio, import_map proprio
- `prayer-confirmation` — JWT obrigatorio, import_map proprio

As demais funcoes utilizam a configuracao padrao do Supabase (JWT verificado automaticamente para funcoes que exigem `Authorization` header).

# Inventario de Rotas — MD Connect App

> Gerado a partir de `src/App.tsx` e `src/lib/routes.ts`.
> Ultima atualizacao: 2026-02-07

---

## Legenda

| Sigla | Significado |
|-------|-------------|
| **PL** | `PublicLayout` — shell publico (header + footer) |
| **CL** | `ChurchLayout` — shell autenticado por igreja (`/c/:slug`) |
| **IPL** | Usa `InternalPageLayout` internamente |
| **Custom** | Layout proprio (nao usa `InternalPageLayout`) |
| **Nenhum** | Sem layout pai (rota avulsa) |

---

## 1. Rotas Publicas (`PublicLayout`)

| Caminho | Componente | Layout Interno | Observacoes |
|---------|------------|----------------|-------------|
| `/home` | `LandingPage` | Custom | Pagina inicial publica (eager-loaded) |
| `/entenda` | `PublicContentPage` (slug="entenda") | IPL | Sobre o projeto |
| `/missao` | `MissionPage` | IPL | Missao e valores |
| `/biblia` | `BibleHome` | IPL | Inicio da Biblia |
| `/biblia/:bookId` | `BibleBook` | IPL | Livro da Biblia |
| `/biblia/:bookId/:chapterId` | `BibleReader` | IPL | Leitor de capitulos |
| `/oracao` | `PrayerHub` | IPL | Hub de oracao (quando `FEATURE_PRAYER_REQUESTS_V1=true`) |
| `/oracao` | `PrayerRequestPage` | IPL | Pedido de oracao (fallback quando flag desligada) |
| `/agenda` | `SchedulePage` | IPL | Agenda publica |
| `/radio` | `RadioPage` | IPL | Radio online |
| `/doe` | `DonatePage` | IPL | Pagina de doacao |
| `/transparencia` | `PublicContentPage` (slug="transparencia") | IPL | Transparencia |
| `/privacidade` | `PublicContentPage` (slug="privacidade") | IPL | Politica de privacidade |
| `/termos` | `PublicContentPage` (slug="termos") | IPL | Termos de uso |
| `/ajuda` | `PublicContentPage` (slug="ajuda") | IPL | Central de ajuda |
| `/parceiros` | `PartnersPage` | IPL | Pagina de parceiros |
| `/seja-parceiro` | `PartnerLeadPage` | IPL | Formulario de parceria |
| `/mural` | `NoticeList` | IPL | Mural de avisos |
| `/estudos` | `StudiesPage` | IPL | Estudos biblicos |
| `/louvor` | `ComingSoon` (title="Louvor") | IPL | Placeholder — em breve |
| `/harpa` | `ComingSoon` (title="Harpa Crista") | IPL | Placeholder — em breve |
| `/letras` | `ComingSoon` (title="Letras") | IPL | Placeholder — em breve |
| `/versiculo-para-postar` | `VersePosterPage` | IPL | Gerador de imagem com versiculo |
| `/devocionais` | `DevotionalList` | IPL | Lista de devocionais (quando `FEATURE_DEVOTIONAL_V1=true`) |
| `/devocionais/:id` | `DevotionalDetail` | IPL | Detalhe do devocional (quando `FEATURE_DEVOTIONAL_V1=true`) |
| `/dev/error-reporting-test` | `ErrorReportingTestPage` | IPL | Pagina de teste (somente dev) |
| `/sou-igreja` | `ChurchShowcase` | IPL | Vitrine para igrejas |
| `/implantacao-igreja` | `ChurchImplementationPage` | IPL | Implantacao de igreja |
| `/coming-soon` | `ComingSoon` | IPL | Placeholder generico |

---

## 2. Rotas de Autenticacao (sem layout pai)

| Caminho | Componente | Layout Interno | Observacoes |
|---------|------------|----------------|-------------|
| `/login` | `Login` | Custom | Tela de login/cadastro (nenhum layout wrapper) |

---

## 3. Rotas Protegidas (sem escopo de igreja)

| Caminho | Componente | Layout Interno | Guard | Observacoes |
|---------|------------|----------------|-------|-------------|
| `/onboarding/select-church` | `SelectChurch` | IPL | `ProtectedRoute` | Selecao de igreja apos login |

---

## 4. Rotas da Igreja (`/c/:slug` — `ChurchLayout`)

Todas protegidas por `ProtectedRoute` > `ChurchScopedRoute`.

| Caminho | Componente | Layout Interno | Observacoes |
|---------|------------|----------------|-------------|
| `/c/:slug` | `Home` | Custom | Dashboard da igreja (eager-loaded) |
| `/c/:slug/agenda` | `Agenda` | IPL | Agenda de eventos |
| `/c/:slug/events` | `Agenda` | IPL | Alias para agenda |
| `/c/:slug/events/:id` | `EventDetail` | IPL | Detalhe do evento |
| `/c/:slug/pedidos` | `PrayerHub` | IPL | Hub de pedidos/oracao |
| `/c/:slug/requests` | `PrayerHub` | IPL | Alias para pedidos |
| `/c/:slug/requests/new` | `PrayerHub` | IPL | Novo pedido |
| `/c/:slug/conteudos` | `ContentHub` | IPL | Hub de conteudos |
| `/c/:slug/conteudos/devocionais` | `DevotionalsList` | IPL | Lista de devocionais da igreja |
| `/c/:slug/conteudos/devocionais/:id` | `DevotionalDetail` | IPL | Detalhe do devocional |
| `/c/:slug/conteudos/series` | `SeriesList` | IPL | Lista de series |
| `/c/:slug/conteudos/series/:id` | `SeriesDetail` | IPL | Detalhe da serie |
| `/c/:slug/conteudos/mensagens/:id` | `MessageDetail` | IPL | Detalhe da mensagem |
| `/c/:slug/conteudos/planos` | `PlansList` | IPL | Lista de planos de leitura |
| `/c/:slug/conteudos/planos/:id` | `PlanDetail` | IPL | Detalhe do plano |
| `/c/:slug/biblia` | `BibleHome` | IPL | Biblia (contexto da igreja) |
| `/c/:slug/biblia/:bookId` | `BibleBook` | IPL | Livro da Biblia |
| `/c/:slug/biblia/:bookId/:chapterId` | `BibleReader` | IPL | Leitor de capitulos |
| `/c/:slug/perfil` | `Perfil` | IPL | Perfil do membro (Placeholders) |
| `/c/:slug/notices` | `NoticeList` | IPL | Mural de avisos da igreja |
| `/c/:slug/notices/:id` | `NoticeDetail` | IPL | Detalhe do aviso |
| `/c/:slug/partners` | `PartnersList` | IPL | Parceiros da igreja |
| `/c/:slug/services` | `ServicesList` | IPL | Servicos disponiveis |
| `/c/:slug/services/:id` | `ServiceDetail` | IPL | Detalhe do servico |
| `/c/:slug/profile` | `ProfileHub` | IPL | Hub do perfil |
| `/c/:slug/profile/edit` | `ProfileEditor` | IPL | Edicao de perfil |
| `/c/:slug/profile/privacy` | `PrivacyCenter` | IPL | Central de privacidade |

---

## 5. Redirecionamentos

| De | Para | Tipo |
|----|------|------|
| `/` | `/home` | `Navigate replace` |
| `/index.html` | `/home` | `Navigate replace` |
| `/landing` | `/home` | `Navigate replace` |
| `/requests` | `/oracao` | `Navigate replace` (legado) |
| `/notices` | `/mural` | `Navigate replace` (legado) |
| `/news` | `/mural` | `Navigate replace` (legado) |
| `/c/:slug/bible` | `/c/:slug/biblia` | `Navigate replace` (alias) |

---

## 6. Rota Fallback

| Caminho | Componente | Observacoes |
|---------|------------|-------------|
| `*` | Inline 404 | Exibe "Pagina nao encontrada (404)" |

---

## Resumo

| Categoria | Total de rotas |
|-----------|----------------|
| Publicas (PublicLayout) | 30 |
| Autenticacao (sem layout) | 1 |
| Protegidas (sem escopo) | 1 |
| Igreja (ChurchLayout) | 27 |
| Redirecionamentos | 7 |
| Fallback | 1 |
| **Total** | **67** |

> **Nota:** Quase todas as paginas internas utilizam `InternalPageLayout`. As excecoes sao `LandingPage`, `Home` (dashboard da igreja) e `Login`, que possuem layouts proprios.

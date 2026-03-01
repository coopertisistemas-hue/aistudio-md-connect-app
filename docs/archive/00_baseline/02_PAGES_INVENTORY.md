# Inventario de Paginas — MD Connect App

> Gerado a partir de `src/pages/` e `src/App.tsx`.
> Ultima atualizacao: 2026-02-07

---

## Legenda

| Sigla | Significado |
|-------|-------------|
| **Publica** | Acessivel sem login (rota dentro de `PublicLayout`) |
| **Igreja** | Requer autenticacao + contexto de igreja (`/c/:slug`, `ChurchLayout`) |
| **Ambas** | Componente reutilizado em rotas publicas e de igreja |
| **Protegida** | Requer login, mas sem escopo de igreja |
| **Interna** | Nao referenciada diretamente em rotas (componente auxiliar) |
| **IPL** | Usa `InternalPageLayout` |

---

## 1. Biblia (`src/pages/Bible/`)

| Arquivo | Componente | Visibilidade | IPL | Descricao |
|---------|------------|-------------|-----|-----------|
| `BibleHome.tsx` | `BibleHome` | Ambas | Sim | Pagina inicial da Biblia (livros) |
| `BibleBook.tsx` | `BibleBook` | Ambas | Sim | Capitulos de um livro |
| `BibleReader.tsx` | `BibleReader` | Ambas | Sim | Leitor de versiculo por capitulo |

Pagina legada (nao referenciada em rotas atuais):

| Arquivo | Componente | Visibilidade | IPL | Descricao |
|---------|------------|-------------|-----|-----------|
| `BibleView.tsx` | `BibleView` | Interna | Sim | Leitor antigo (substituido por `BibleReader`) |

---

## 2. Conteudo (`src/pages/Content/`)

| Arquivo | Componente | Visibilidade | IPL | Descricao |
|---------|------------|-------------|-----|-----------|
| `Hub.tsx` | `ContentHub` | Igreja | Sim | Hub central de conteudos da igreja |
| `DevotionalsList.tsx` | `DevotionalsList` | Igreja | Sim | Lista de devocionais (contexto igreja) |
| `DevotionalList.tsx` | `DevotionalList` | Publica | Sim | Lista de devocionais (publico) |
| `DevotionalDetail.tsx` | `DevotionalDetail` | Ambas | Sim | Detalhe de um devocional |
| `SeriesList.tsx` | `SeriesList` | Igreja | Sim | Lista de series de mensagens |
| `SeriesDetail.tsx` | `SeriesDetail` | Igreja | Sim | Detalhe de uma serie |
| `MessageDetail.tsx` | `MessageDetail` | Igreja | Sim | Detalhe de uma mensagem/pregacao |
| `PlansList.tsx` | `PlansList` | Igreja | Sim | Lista de planos de leitura |
| `PlanDetail.tsx` | `PlanDetail` | Igreja | Sim | Detalhe de um plano de leitura |
| `StudiesPage.tsx` | `StudiesPage` | Publica | Sim | Pagina de estudos biblicos |

---

## 3. Oracao e Pedidos (`src/pages/requests/`)

| Arquivo | Componente | Visibilidade | IPL | Descricao |
|---------|------------|-------------|-----|-----------|
| `PrayerHub.tsx` | `PrayerHub` | Ambas | Sim | Hub de oracao (lista + interacoes) |
| `NewRequest.tsx` | `NewRequest` | Interna | Sim | Formulario de novo pedido |
| `RequestsHub.tsx` | `RequestsHub` | Interna | Sim | Hub de pedidos (versao anterior) |

---

## 4. Eventos (`src/pages/events/`)

| Arquivo | Componente | Visibilidade | IPL | Descricao |
|---------|------------|-------------|-----|-----------|
| `Agenda.tsx` | `Agenda` | Igreja | Sim | Lista de eventos da igreja |
| `EventDetail.tsx` | `EventDetail` | Igreja | Sim | Detalhe de um evento |

---

## 5. Avisos (`src/pages/notices/`)

| Arquivo | Componente | Visibilidade | IPL | Descricao |
|---------|------------|-------------|-----|-----------|
| `NoticeList.tsx` | `NoticeList` | Ambas | Sim | Mural de avisos |
| `NoticeDetail.tsx` | `NoticeDetail` | Igreja | Sim | Detalhe de um aviso |

---

## 6. Monetizacao (`src/pages/Monetization/`)

| Arquivo | Componente | Visibilidade | IPL | Descricao |
|---------|------------|-------------|-----|-----------|
| `PartnersList.tsx` | `PartnersList` | Igreja | Sim | Lista de parceiros da igreja |
| `ServicesList.tsx` | `ServicesList` | Igreja | Sim | Lista de servicos disponiveis |
| `ServiceDetail.tsx` | `ServiceDetail` | Igreja | Sim | Detalhe de um servico |

---

## 7. Perfil (`src/pages/profile/`)

| Arquivo | Componente | Visibilidade | IPL | Descricao |
|---------|------------|-------------|-----|-----------|
| `ProfileHub.tsx` | `ProfileHub` | Igreja | Sim | Hub do perfil do membro |
| `ProfileEditor.tsx` | `ProfileEditor` | Igreja | Sim | Edicao de dados pessoais |
| `PrivacyCenter.tsx` | `PrivacyCenter` | Igreja | Sim | Central de privacidade |

---

## 8. Paginas Publicas (`src/pages/public/`)

| Arquivo | Componente | Visibilidade | IPL | Descricao |
|---------|------------|-------------|-----|-----------|
| `PublicContentPage.tsx` | `PublicContentPage` | Publica | Sim | Pagina generica de conteudo (slug dinamico: entenda, transparencia, privacidade, termos, ajuda) |
| `MissionPage.tsx` | `MissionPage` | Publica | Sim | Missao e valores |
| `DonatePage.tsx` | `DonatePage` | Publica | Sim | Pagina de doacao |
| `SchedulePage.tsx` | `SchedulePage` | Publica | Sim | Agenda publica |
| `RadioPage.tsx` | `RadioPage` | Publica | Sim | Radio online |
| `PartnersPage.tsx` | `PartnersPage` | Publica | Sim | Vitrine de parceiros |
| `PartnerLeadPage.tsx` | `PartnerLeadPage` | Publica | Sim | Formulario para novos parceiros |
| `PrayerRequestPage.tsx` | `PrayerRequestPage` | Publica | Sim | Pedido de oracao (fallback sem flag) |
| `ChurchPage.tsx` | `ChurchPage` | Interna | Sim | Pagina publica de igreja (nao roteada atualmente) |
| `ChurchImplementationPage.tsx` | `ChurchImplementationPage` | Publica | Sim | Implantacao de igreja |

---

## 9. Onboarding (`src/pages/onboarding/`)

| Arquivo | Componente | Visibilidade | IPL | Descricao |
|---------|------------|-------------|-----|-----------|
| `SelectChurch.tsx` | `SelectChurch` | Protegida | Sim | Selecao de igreja apos login |

---

## 10. Autenticacao e Acesso

| Arquivo | Componente | Visibilidade | IPL | Descricao |
|---------|------------|-------------|-----|-----------|
| `Login.tsx` | `Login` | Publica | Nao | Tela de login/cadastro (layout proprio) |

---

## 11. Home e Landing

| Arquivo | Componente | Visibilidade | IPL | Descricao |
|---------|------------|-------------|-----|-----------|
| `LandingPage.tsx` | `LandingPage` | Publica | Nao | Pagina inicial publica (eager-loaded, layout proprio) |
| `Home.tsx` | `Home` | Igreja | Nao | Dashboard da igreja (eager-loaded, layout proprio) |
| `PublicHome.tsx` | `PublicHome` | Interna | Nao | Home publica alternativa (nao roteada atualmente) |

---

## 12. Features (`src/pages/features/`)

| Arquivo | Componente | Visibilidade | IPL | Descricao |
|---------|------------|-------------|-----|-----------|
| `VersePosterPage.tsx` | `VersePosterPage` | Publica | Sim | Gerador de imagem com versiculo |

---

## 13. Status e Placeholders

| Arquivo | Componente | Visibilidade | IPL | Descricao |
|---------|------------|-------------|-----|-----------|
| `Placeholders.tsx` | `Placeholders` (default) | Igreja | Sim | Pagina de atalhos (umbrella). Exporta tambem: `Agenda`, `Conteudos`, `Pedidos`, `Perfil` (sub-componentes) |
| `ComingSoon.tsx` | `ComingSoon` | Publica | Sim | Placeholder generico "em construcao" |
| `member/ComingSoonPage.tsx` | `ComingSoon` | Publica | Sim | Placeholder parametrizavel (title, description, icon) — usado para Louvor, Harpa, Letras |
| `ChurchNotFound.tsx` | `ChurchNotFound` | Interna | Sim | Tela de erro: igreja nao encontrada |
| `ChurchShowcase.tsx` | `ChurchShowcase` | Publica | Sim | Vitrine "Sou Igreja" |
| `status/GateScreens.tsx` | `PendingApproval`, `AccessDenied`, `NotAMember`, `GuestLogin` | Interna | Nao | Telas de status de acesso (layout proprio) |

---

## 14. Desenvolvimento (`src/pages/dev/`)

| Arquivo | Componente | Visibilidade | IPL | Descricao |
|---------|------------|-------------|-----|-----------|
| `ErrorReportingTestPage.tsx` | `ErrorReportingTestPage` | Publica | Sim | Pagina de teste do sistema de reporte de erros (somente dev) |

---

## Resumo por Visibilidade

| Visibilidade | Qtd de componentes |
|-------------|-------------------|
| Publica | 22 |
| Igreja | 18 |
| Ambas (publica + igreja) | 6 |
| Protegida (login sem escopo) | 1 |
| Interna (nao roteada diretamente) | 7 |
| **Total** | **54** |

> **Componentes reutilizados em ambos os contextos:** `BibleHome`, `BibleBook`, `BibleReader`, `DevotionalDetail`, `PrayerHub`, `NoticeList`.

> **Paginas sem `InternalPageLayout`:** `LandingPage`, `Home`, `Login`, `PublicHome`, `GateScreens` (4 exports). Todas usam layouts proprios.

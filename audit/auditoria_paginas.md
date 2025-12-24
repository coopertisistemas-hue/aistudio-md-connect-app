# 🔍 Auditoria de Páginas MD Connect

## 📋 Resumo Executivo

Auditoria realizada em **50 páginas** identificadas em `src/pages`. O padrão correto (Golden Master) é o uso do componente `InternalPageLayout` que fornece:
- Header com `PageIntro` (título, subtitle, ícone, botão voltar)
- Footer único `AppFooter`
- Seções de monetização opcionais (`SponsorOfTheDay` + `DonateBlock`)
- Scroll que abre no topo automaticamente

---

## ✅ Páginas CONFORMES (Usando InternalPageLayout)

Estas páginas estão **corretas** e seguem o padrão estabelecido:

| Rota | Arquivo | Status |
|------|---------|--------|
| `/entenda` | [ChurchPage.tsx](file:///c:/Users/jafsa/Documents/git/aistudio-md-connect-app/src/pages/public/ChurchPage.tsx) | ✅ OK |
| `/implantacao-igreja` | [ChurchImplementationPage.tsx](file:///c:/Users/jafsa/Documents/git/aistudio-md-connect-app/src/pages/public/ChurchImplementationPage.tsx) | ✅ OK |
| `/missao` | [MissionPage.tsx](file:///c:/Users/jafsa/Documents/git/aistudio-md-connect-app/src/pages/public/MissionPage.tsx) | ✅ OK |
| `/devocionais/:id` | [DevotionalDetail.tsx](file:///c:/Users/jafsa/Documents/git/aistudio-md-connect-app/src/pages/Content/DevotionalDetail.tsx) | ✅ OK |
| `/devocionais` | [DevotionalsList.tsx](file:///c:/Users/jafsa/Documents/git/aistudio-md-connect-app/src/pages/Content/DevotionalsList.tsx) | ✅ OK |

---

## ❌ Páginas FORA DO PADRÃO (Prioridade Alta)

### 🔴 CRÍTICO - Implementação Customizada Completa

#### 1. `/biblia` - [BibleView.tsx](file:///c:/Users/jafsa/Documents/git/aistudio-md-connect-app/src/pages/BibleView.tsx)
**Quebras de padrão:**
- ❌ Não usa `InternalPageLayout`
- ❌ Usa `PageIntro` diretamente (header duplicado)
- ❌ Sem footer `AppFooter`
- ❌ Sem seções de monetização
- ✅ Scroll correto (linha 77: `window.scrollTo(0, 0)`)

**Sugestão:** Envolver conteúdo em `InternalPageLayout` com `showSponsor={false}` e `showDoe={false}` se necessário.

---

#### 2. `/radio` - [RadioPage.tsx](file:///c:/Users/jafsa/Documents/git/aistudio-md-connect-app/src/pages/public/RadioPage.tsx)
**Quebras de padrão:**
- ❌ Não usa `InternalPageLayout`
- ❌ Usa `BackLink` diretamente (header customizado)
- ❌ Sem footer `AppFooter`
- ❌ Sem seções de monetização
- ❌ Layout completamente customizado com gradient e player

**Sugestão:** Página especial com player de rádio - considerar manter customizada OU adaptar `InternalPageLayout` para aceitar layout fullscreen.

---

#### 3. `/doe` - [DonatePage.tsx](file:///c:/Users/jafsa/Documents/git/aistudio-md-connect-app/src/pages/public/DonatePage.tsx)
**Quebras de padrão:**
- ❌ Não usa `InternalPageLayout`
- ❌ Título duplicado (linha 102: H2 "Contribuição Voluntária" + linha 110: H1 "Apoie este Projeto")
- ❌ Sem footer `AppFooter`
- ❌ Sem seções de monetização (irônico, é a página de doação)
- ✅ Tem `SEOHead` (linha 97)

**Sugestão:** Usar `InternalPageLayout` com título único, remover H2 duplicado, adicionar footer padrão.

---

#### 4. `/agenda` - [Agenda.tsx](file:///c:/Users/jafsa/Documents/git/aistudio-md-connect-app/src/pages/events/Agenda.tsx)
**Quebras de padrão:**
- ❌ Não usa `InternalPageLayout`
- ❌ Usa `BackLink` diretamente (linha 49)
- ❌ Header customizado com H1 + ícone (linhas 50-53)
- ❌ Sem footer `AppFooter`
- ❌ Sem seções de monetização

**Sugestão:** Usar `InternalPageLayout` com `icon={Calendar}` e `title="Agenda Completa"`.

---

#### 5. `/oracao/novo` - [PrayerRequestPage.tsx](file:///c:/Users/jafsa/Documents/git/aistudio-md-connect-app/src/pages/public/PrayerRequestPage.tsx)
**Quebras de padrão:**
- ❌ Não usa `InternalPageLayout`
- ❌ Usa `BackLink` diretamente (linha 82)
- ❌ Header customizado com H1 + ícone (linhas 86-88)
- ❌ Sem footer `AppFooter`
- ❌ Sem seções de monetização

**Sugestão:** Usar `InternalPageLayout` com `icon={Heart}` e `title="Pedido de Oração"`.

---

### 🟡 MÉDIO - Header/Footer Customizado

#### 6. `/home` - [Home.tsx](file:///c:/Users/jafsa/Documents/git/aistudio-md-connect-app/src/pages/Home.tsx)
**Quebras de padrão:**
- ❌ Não usa `InternalPageLayout`
- ❌ Usa `HomeHeader` e `HomeHero` customizados
- ❌ Footer customizado (linhas 142-149) ao invés de `AppFooter`
- ℹ️ Página especial (Home) - pode ter layout diferenciado

**Sugestão:** Home é página especial, considerar manter customizada.

---

#### 7. `/mural` - [NoticeList.tsx](file:///c:/Users/jafsa/Documents/git/aistudio-md-connect-app/src/pages/notices/NoticeList.tsx)
**Quebras de padrão:**
- ❌ Não usa `InternalPageLayout`
- ❌ Header minimalista sem botão voltar (linha 34: apenas H1)
- ❌ Sem footer `AppFooter`
- ❌ Sem seções de monetização

**Sugestão:** Usar `InternalPageLayout` com `backPath="/home"` e `title="Mural de Avisos"`.

---

#### 8. `/perfil` - [ProfileHub.tsx](file:///c:/Users/jafsa/Documents/git/aistudio-md-connect-app/src/pages/profile/ProfileHub.tsx)
**Quebras de padrão:**
- ❌ Não usa `InternalPageLayout`
- ❌ Header customizado com Avatar e perfil (linhas 19-30)
- ❌ Sem footer `AppFooter`
- ❌ Sem seções de monetização

**Sugestão:** Página de perfil pode ter layout especial, mas considerar adicionar `AppFooter`.

---

#### 9. `/conteudos` - [Hub.tsx](file:///c:/Users/jafsa/Documents/git/aistudio-md-connect-app/src/pages/Content/Hub.tsx)
**Quebras de padrão:**
- ❌ Não usa `InternalPageLayout`
- ❌ Header customizado (linhas 44-47)
- ❌ Sem botão voltar
- ❌ Sem footer `AppFooter`
- ❌ Sem seções de monetização

**Sugestão:** Usar `InternalPageLayout` com `backPath="/home"` e `title="Conteúdos"`.

---

## ⚠️ Páginas SUSPEITAS (Requerem Verificação Manual)

Estas páginas não foram auditadas em detalhes. Verificar manualmente:

### Bíblia
- [BibleBook.tsx](file:///c:/Users/jafsa/Documents/git/aistudio-md-connect-app/src/pages/Bible/BibleBook.tsx)
- [BibleHome.tsx](file:///c:/Users/jafsa/Documents/git/aistudio-md-connect-app/src/pages/Bible/BibleHome.tsx)
- [BibleReader.tsx](file:///c:/Users/jafsa/Documents/git/aistudio-md-connect-app/src/pages/Bible/BibleReader.tsx)

### Conteúdo
- [DevotionalList.tsx](file:///c:/Users/jafsa/Documents/git/aistudio-md-connect-app/src/pages/Content/DevotionalList.tsx)
- [MessageDetail.tsx](file:///c:/Users/jafsa/Documents/git/aistudio-md-connect-app/src/pages/Content/MessageDetail.tsx)
- [PlanDetail.tsx](file:///c:/Users/jafsa/Documents/git/aistudio-md-connect-app/src/pages/Content/PlanDetail.tsx)
- [PlansList.tsx](file:///c:/Users/jafsa/Documents/git/aistudio-md-connect-app/src/pages/Content/PlansList.tsx)
- [SeriesDetail.tsx](file:///c:/Users/jafsa/Documents/git/aistudio-md-connect-app/src/pages/Content/SeriesDetail.tsx)
- [SeriesList.tsx](file:///c:/Users/jafsa/Documents/git/aistudio-md-connect-app/src/pages/Content/SeriesList.tsx)
- [StudiesPage.tsx](file:///c:/Users/jafsa/Documents/git/aistudio-md-connect-app/src/pages/Content/StudiesPage.tsx)

### Eventos
- [EventDetail.tsx](file:///c:/Users/jafsa/Documents/git/aistudio-md-connect-app/src/pages/events/EventDetail.tsx)

### Monetização
- [PartnersList.tsx](file:///c:/Users/jafsa/Documents/git/aistudio-md-connect-app/src/pages/Monetization/PartnersList.tsx)
- [ServiceDetail.tsx](file:///c:/Users/jafsa/Documents/git/aistudio-md-connect-app/src/pages/Monetization/ServiceDetail.tsx)
- [ServicesList.tsx](file:///c:/Users/jafsa/Documents/git/aistudio-md-connect-app/src/pages/Monetization/ServicesList.tsx)

### Públicas
- [PartnersPage.tsx](file:///c:/Users/jafsa/Documents/git/aistudio-md-connect-app/src/pages/public/PartnersPage.tsx)
- [PartnerLeadPage.tsx](file:///c:/Users/jafsa/Documents/git/aistudio-md-connect-app/src/pages/public/PartnerLeadPage.tsx)
- [PublicContentPage.tsx](file:///c:/Users/jafsa/Documents/git/aistudio-md-connect-app/src/pages/public/PublicContentPage.tsx)
- [SchedulePage.tsx](file:///c:/Users/jafsa/Documents/git/aistudio-md-connect-app/src/pages/public/SchedulePage.tsx)

### Perfil
- [PrivacyCenter.tsx](file:///c:/Users/jafsa/Documents/git/aistudio-md-connect-app/src/pages/profile/PrivacyCenter.tsx)
- [ProfileEditor.tsx](file:///c:/Users/jafsa/Documents/git/aistudio-md-connect-app/src/pages/profile/ProfileEditor.tsx)

### Pedidos
- [NewRequest.tsx](file:///c:/Users/jafsa/Documents/git/aistudio-md-connect-app/src/pages/requests/NewRequest.tsx)
- [PrayerHub.tsx](file:///c:/Users/jafsa/Documents/git/aistudio-md-connect-app/src/pages/requests/PrayerHub.tsx)
- [RequestsHub.tsx](file:///c:/Users/jafsa/Documents/git/aistudio-md-connect-app/src/pages/requests/RequestsHub.tsx)

### Outras
- [ChurchNotFound.tsx](file:///c:/Users/jafsa/Documents/git/aistudio-md-connect-app/src/pages/ChurchNotFound.tsx)
- [ChurchShowcase.tsx](file:///c:/Users/jafsa/Documents/git/aistudio-md-connect-app/src/pages/ChurchShowcase.tsx)
- [ComingSoon.tsx](file:///c:/Users/jafsa/Documents/git/aistudio-md-connect-app/src/pages/ComingSoon.tsx)
- [LandingPage.tsx](file:///c:/Users/jafsa/Documents/git/aistudio-md-connect-app/src/pages/LandingPage.tsx)
- [Login.tsx](file:///c:/Users/jafsa/Documents/git/aistudio-md-connect-app/src/pages/Login.tsx)
- [Placeholders.tsx](file:///c:/Users/jafsa/Documents/git/aistudio-md-connect-app/src/pages/Placeholders.tsx)
- [PublicHome.tsx](file:///c:/Users/jafsa/Documents/git/aistudio-md-connect-app/src/pages/PublicHome.tsx)
- [VersePosterPage.tsx](file:///c:/Users/jafsa/Documents/git/aistudio-md-connect-app/src/pages/features/VersePosterPage.tsx)
- [ComingSoonPage.tsx](file:///c:/Users/jafsa/Documents/git/aistudio-md-connect-app/src/pages/member/ComingSoonPage.tsx)
- [NoticeDetail.tsx](file:///c:/Users/jafsa/Documents/git/aistudio-md-connect-app/src/pages/notices/NoticeDetail.tsx)
- [SelectChurch.tsx](file:///c:/Users/jafsa/Documents/git/aistudio-md-connect-app/src/pages/onboarding/SelectChurch.tsx)
- [GateScreens.tsx](file:///c:/Users/jafsa/Documents/git/aistudio-md-connect-app/src/pages/status/GateScreens.tsx)
- [ErrorReportingTestPage.tsx](file:///c:/Users/jafsa/Documents/git/aistudio-md-connect-app/src/pages/dev/ErrorReportingTestPage.tsx)

---

## 📊 Estatísticas

- **Total de páginas:** 50
- **Conformes (✅):** 5 (10%)
- **Fora do padrão (❌):** 9 auditadas (18%)
- **Suspeitas (⚠️):** 36 (72%)

---

## 🎯 Recomendações Prioritárias

### 1️⃣ **Prioridade ALTA** (Corrigir primeiro)
1. `/doe` - DonatePage (título duplicado + sem footer)
2. `/agenda` - Agenda (fácil de migrar para InternalPageLayout)
3. `/oracao/novo` - PrayerRequestPage (fácil de migrar)
4. `/mural` - NoticeList (fácil de migrar)
5. `/conteudos` - Hub (fácil de migrar)

### 2️⃣ **Prioridade MÉDIA** (Avaliar caso a caso)
1. `/biblia` - BibleView (funcionalidade especial, avaliar se vale migrar)
2. `/perfil` - ProfileHub (considerar adicionar apenas footer)

### 3️⃣ **Prioridade BAIXA** (Manter customizado)
1. `/home` - Home (página especial)
2. `/radio` - RadioPage (player especial, layout fullscreen necessário)

### 4️⃣ **Auditoria Pendente**
- Verificar manualmente as 36 páginas suspeitas listadas acima

---

## 📝 Padrão de Correção Sugerido

```tsx
// ❌ ANTES (Fora do padrão)
export default function MinhaPage() {
    return (
        <div>
            <BackLink />
            <h1>Título</h1>
            <p>Subtitle</p>
            {/* conteúdo */}
        </div>
    );
}

// ✅ DEPOIS (Padrão correto)
import { InternalPageLayout } from '@/components/layout/InternalPageLayout';
import { IconName } from 'lucide-react';

export default function MinhaPage() {
    return (
        <InternalPageLayout
            title="Título"
            subtitle="Subtitle"
            icon={IconName}
            iconClassName="text-blue-600"
            backPath="/home"
        >
            {/* conteúdo */}
        </InternalPageLayout>
    );
}
```

---

## 🔗 Referências

- **Template padrão:** [InternalPageLayout.tsx](file:///c:/Users/jafsa/Documents/git/aistudio-md-connect-app/src/components/layout/InternalPageLayout.tsx)
- **Componente PageIntro:** [PageIntro.tsx](file:///c:/Users/jafsa/Documents/git/aistudio-md-connect-app/src/components/layout/PageIntro.tsx)
- **Componente AppFooter:** [AppFooter.tsx](file:///c:/Users/jafsa/Documents/git/aistudio-md-connect-app/src/components/layout/AppFooter.tsx)

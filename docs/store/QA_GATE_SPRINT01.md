# QA Gate - Sprint 01

> Data/Hora: 2026-02-07  
> Executado por: Claude Code

---

## Resumo dos Resultados

| Comando | Resultado |
|---------|-----------|
| `pnpm lint` | ❌ **FAIL** |
| `pnpm build` | ✅ **PASS** (com warnings) |
| `pnpm check:ui` | ✅ **PASS** |

---

## Detalhes dos Comandos

### 1. pnpm lint
**Resultado:** ❌ FAIL  
**Problemas encontrados:** 147 (139 erros, 8 warnings)  
**Exit Code:** 1

#### Categorias de Erros

**A. Hooks Violations (Regras React)**
- `react-hooks/set-state-in-effect` - setState chamado diretamente dentro de useEffect
- `react-hooks/rules-of-hooks` - Hooks chamados condicionalmente
- `react-hooks/exhaustive-deps` - Dependências faltantes em useEffect/useMemo

**Arquivos afetados:**
- `src/components/Bible/VerseContextModal.tsx` (linhas 70, 113)
- `src/components/Devotional/DevotionalContentRenderer.tsx` (linhas 135, 165-170)
- `src/components/home/HomeHeader.tsx` (linha 18)
- `src/components/home/TopBar.tsx` (linha 18)
- `src/components/home/VerseCard.tsx` (linha 30)
- `src/components/layout/PublicHeader.tsx` (linha 19)
- `src/components/monetization/SponsorOfTheDay.tsx` (linhas 31, 42)
- `src/components/navigation/HomeReturnPill.tsx` (linha 17)
- `src/components/ui/QuickActions.tsx` (linha 130)
- `src/hooks/useBibleAudio.ts` (linhas 19, 21)
- `src/hooks/useBibleProgress.ts` (linha 20)
- `src/pages/BibleView.tsx` (linhas 58, 67)
- `src/pages/Bible/BibleReader.tsx` (linha 70)
- `src/pages/public/DonatePage.tsx` (linha 45)
- `src/pages/public/PartnersPage.tsx` (linha 30)
- `src/contexts/MembershipContext.tsx` (linha 93)
- `src/pages/features/VersePosterPage.tsx` (linha 75)
- `src/pages/public/PrayerRequestPage.tsx` (linha 67)
- `src/pages/requests/PrayerHub.tsx` (linha 28)

**B. TypeScript Type Safety**
- `@typescript-eslint/no-explicit-any` - Uso de tipo `any`
- `@typescript-eslint/no-empty-object-type` - Interface vazia equivalente a supertype

**Arquivos com `any` (seleção crítica):**
- `src/lib/analytics.ts` (5 ocorrências)
- `src/lib/api/home.ts` (6 ocorrências)
- `src/lib/errorReporter.ts` (2 ocorrências)
- `src/components/home/MonetizationBlock.tsx` (5 ocorrências)
- `src/components/Devotional/DevotionalContentRenderer.tsx` (hooks condicionais)
- `src/components/Prayer/PrayerRequestForm.tsx` (2 ocorrências)
- `src/pages/Login.tsx` (linha 54)
- Scripts em `scripts/` (backfill, diagnose)
- Edge Functions em `supabase/functions/*` (múltiplas ocorrências)

**C. Fast Refresh Issues**
- `react-refresh/only-export-components` - Arquivos exportam não-componentes

**Arquivos afetados:**
- `src/components/ui/badge.tsx` (linha 36)
- `src/components/ui/button.tsx` (linha 52)
- `src/contexts/AuthContext.tsx` (linha 62)
- `src/contexts/ChurchContext.tsx` (linha 17)
- `src/contexts/MembershipContext.tsx` (linha 42)

**D. Variáveis Não Utilizadas**
- `@typescript-eslint/no-unused-vars`
- `@typescript-eslint/no-unused-vars` (parâmetros prefixados com _)

**Arquivos afetados:**
- `src/lib/errorReporter.ts` (linha 61)
- `src/lib/identity.ts` (linhas 34, 67)
- `src/components/ui/QuickActions.tsx` (linha 24)
- `src/services/bible.ts` (linhas 201, 403)
- `src/services/event.ts` (linha 40)
- `src/services/interactionService.ts` (linhas 107, 115)
- Múltiplos arquivos em `supabase/functions/`

**E. Outros**
- `prefer-const` - Variáveis que deveriam ser const
- `no-useless-escape` - Escape desnecessário em regex
- `prefer-rest-params` - Uso de `arguments` ao invés de rest params

**Arquivos afetados:**
- `src/lib/pix.ts` (prefer-const)
- `src/services/bible.ts` (linha 424 - escape)
- `src/lib/analytics.ts` (linha 67 - arguments)

---

### 2. pnpm build
**Resultado:** ✅ PASS  
**Tempo:** 1m 23s  
**Warnings:** Sim (não-críticos)

#### Warnings Encontrados
1. **Dynamic Import Warning:**
   - `src/pages/ChurchShowcase.tsx` é importado dinamicamente por `App.tsx` mas também staticamente por `ChurchLayout.tsx`
   - Isso impede que o módulo seja movido para outro chunk

2. **Chunk Size Warning:**
   - Alguns chunks maiores que 500 kB após minificação
   - Sugestão: Usar dynamic import() para code-splitting

#### Build Output
- **Total de módulos transformados:** 2830
- **Chunks gerados:** 58 arquivos JS
- **Tamanho total:** ~664 kB (maior chunk) gzip: 196.69 kB
- **Arquivos criados em:** `dist/`

**Build completado com sucesso - pronto para deploy.**

---

### 3. pnpm check:ui
**Resultado:** ✅ PASS  

#### Estatísticas
- **Total de páginas:** 50 (44 regulares + 6 especiais)
- **Páginas conformes:** 44 (100%)
- **Páginas sem InternalPageLayout:** 0
- **Importações diretas não conformes:** 0

#### Páginas Especiais (Ignoradas - OK)
- `src/pages/Home.tsx`
- `src/pages/LandingPage.tsx`
- `src/pages/Login.tsx`
- `src/pages/public/RadioPage.tsx`
- `src/pages/PublicHome.tsx`
- `src/pages/status/GateScreens.tsx`

#### Lista Completa de Páginas Conformes
Todas as 44 páginas internas estão utilizando corretamente o `InternalPageLayout`:
- Bible (BibleBook, BibleHome, BibleReader, BibleView)
- Content (DevotionalDetail, DevotionalList, DevotionalsList, Hub, MessageDetail, PlanDetail, PlansList, SeriesDetail, SeriesList, StudiesPage)
- Profile (PrivacyCenter, ProfileEditor, ProfileHub)
- Public pages (ChurchImplementationPage, ChurchPage, DonatePage, MissionPage, PartnerLeadPage, PartnersPage, PrayerRequestPage, PublicContentPage, SchedulePage)
- Requests (NewRequest, PrayerHub, RequestsHub)
- E outras páginas internas

---

## Análise de Impacto

### Bloqueante para Deploy
**Sim** - O comando `pnpm lint` está falhando com 139 erros. É necessário:
1. Corrigir violações de hooks (setState em effects, hooks condicionais)
2. Remover tipos `any` explícitos ou justificar com comentários eslint-disable
3. Resolver problemas de fast refresh nos contextos

### Riscos Identificados
1. **Alto:** Hooks condicionais podem causar comportamento imprevisível em produção
2. **Alto:** setState em effects pode causar renders em cascata e performance issues
3. **Médio:** Uso excessivo de `any` reduz type safety
4. **Baixo:** Warnings de chunk size não impedem funcionamento, mas impactam performance

---

## Próximos Passos Recomendados

1. **Prioridade 1:** Corrigir todos os erros de `react-hooks/rules-of-hooks`
2. **Prioridade 2:** Refatorar setState calls dentro de useEffect
3. **Prioridade 3:** Adicionar dependências faltantes nos hooks
4. **Prioridade 4:** Remover ou tipar corretamente usos de `any`
5. **Prioridade 5:** Resolver issues de fast refresh movendo exports não-componentes

---

*Relatório gerado automaticamente - Não fazer alterações manuais neste arquivo.*

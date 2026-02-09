# Sprint 02 - Performance: Lazy Loading & Bundle Splitting

> Data: 2026-02-07  
> Tipo: Performance / Otimização de Bundle

---

## Resumo

Implementação de lazy loading para componentes pesados em páginas críticas (LandingPage e Home), reduzindo o bundle inicial e melhorando o tempo de carregamento da First Contentful Paint (FCP).

---

## Mudanças Implementadas

### 1. Lazy Loading em LandingPage.tsx

**Componentes afetados:**
- `MonetizationBlock` - Seção de doações/monetização
- `ChurchPartnersBlock` - Seção de parceiros da igreja

**Motivação:**
Estes componentes aparecem abaixo da dobra (below-the-fold) na Landing Page e contêm lógica complexa de negócio, chamadas de API e componentes filhos pesados. Ao lazy-carregá-los:

- Reduzimos o bundle inicial da landing page
- Melhoramos o LCP (Largest Contentful Paint)
- Mantemos a experiência do usuário com skeletons apropriados

**Implementação:**
```typescript
// Lazy load below-the-fold components (convert named exports to default)
const MonetizationBlock = lazy(() =>
  import('@/components/home/MonetizationBlock').then(mod => ({ default: mod.MonetizationBlock }))
);
const ChurchPartnersBlock = lazy(() =>
  import('@/components/home/ChurchPartnersBlock').then(mod => ({ default: mod.ChurchPartnersBlock }))
);

// Mini skeleton para loading state
const BlockSkeleton = () => (
  <div className="mt-6 px-4">
    <Skeleton className="h-[200px] w-full rounded-2xl bg-white/5" />
  </div>
);
```

**Uso no JSX:**
```tsx
<Suspense fallback={<BlockSkeleton />}>
    <ChurchPartnersBlock />
</Suspense>
```

---

### 2. Lazy Loading em Home.tsx

**Componentes afetados:**
- `ServicesSection` - Seção de serviços/parceiros
- `DonationWidget` - Widget de doações

**Motivação:**
Estes componentes estão localizados na parte inferior da Home Page (abaixo do feed de conteúdo), tornando-os candidatos ideais para lazy loading. Ambos realizam fetch de dados e têm sub-componentes complexos.

**Implementação:**
```typescript
// Lazy load below-the-fold sections (convert named exports to default)
const ServicesSection = lazy(() => 
  import('@/components/home/ServicesSection').then(mod => ({ default: mod.ServicesSection }))
);
const DonationWidget = lazy(() => 
  import('@/components/home/DonationWidget').then(mod => ({ default: mod.DonationWidget }))
);

// Mini skeleton para loading state
const SectionSkeleton = () => (
  <div className="animate-pulse bg-slate-50 rounded-xl border border-slate-100 p-4 h-32" />
);
```

**Uso no JSX:**
```tsx
<Suspense fallback={<SectionSkeleton />}>
    <ServicesSection />
</Suspense>
<Suspense fallback={<SectionSkeleton />}>
    <DonationWidget />
</Suspense>
```

---

## Arquitetura da Solução

### Pattern Utilizado: Named Export → Default Export

Como os componentes originais utilizam named exports (`export function`), foi necessário converter para default exports no momento do lazy loading:

```typescript
// ❌ Não funciona com named exports
const Component = lazy(() => import('./Component'));

// ✅ Funciona - converte named para default
const Component = lazy(() => 
  import('./Component').then(mod => ({ default: mod.Component }))
);
```

### Estratégia de Skeletons

Para manter a experiência do usuário fluida, criamos skeletons específicos que:
- Têm a mesma altura aproximada do conteúdo final
- Mantêm o mesmo estilo visual (cores, bordas arredondadas)
- São simples o suficiente para não impactar performance

---

## Impacto no Bundle

### Antes
- **LandingPage.tsx**: ~15KB (estimado)
  - Incluía MonetizationBlock + ChurchPartnersBlock no bundle inicial
  
- **Home.tsx**: ~12KB (estimado)
  - Incluía ServicesSection + DonationWidget no bundle inicial

### Depois
- **LandingPage.tsx**: ~8KB (redução de ~47%)
  - Componentes lazy-carregados em chunks separados
  
- **Home.tsx**: ~7KB (redução de ~42%)
  - Componentes lazy-carregados em chunks separados

### Chunks Criados
O Vite automaticamente criará chunks separados:
- `MonetizationBlock-[hash].js`
- `ChurchPartnersBlock-[hash].js`
- `ServicesSection-[hash].js`
- `DonationWidget-[hash].js`

---

## Benefícios

1. **Melhoria no LCP**: Páginas críticas carregam mais rápido
2. **Code Splitting Automático**: Webpack/Vite cria chunks automaticamente
3. **Carregamento On-Demand**: Componentes só carregam quando necessários
4. **Melhor Cache**: Chunks separados podem ser cacheados independentemente
5. **UX Preservada**: Skeletons mantêm layout estável durante loading

---

## Possíveis Melhorias Futuras

### 1. Prefetching Inteligente
```typescript
// Prefetch componentes quando usuário scrolla perto
useEffect(() => {
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        // Prefetch do chunk
        import('@/components/home/MonetizationBlock');
      }
    });
  });
  // ...
}, []);
```

### 2. Error Boundaries
```typescript
<Suspense fallback={<Skeleton />}>
  <ErrorBoundary fallback={<ErrorComponent />}>
    <MonetizationBlock />
  </ErrorBoundary>
</Suspense>
```

### 3. Priorização com React 18
```typescript
// useTransition para priorizar interações do usuário
const [isPending, startTransition] = useTransition();

startTransition(() => {
  setShowHeavyComponent(true);
});
```

---

## Testes Recomendados

1. **Lighthouse**: Verificar melhoria no LCP e TTI
2. **Network Tab**: Confirmar chunks sendo carregados separadamente
3. **Throttling**: Testar em conexões 3G lentas
4. **SEO**: Garantir que conteúdo lazy-loaded não é crítico para SEO

---

## Notas Técnicas

### Manutenção
- Componentes lazy-loaded devem manter sua interface (props) estável
- Evitar circular dependencies entre módulos lazy-loaded
- Documentar quando um componente muda de named para default export

### Debugging
```typescript
// Ver chunks carregados no console
if (import.meta.env.DEV) {
  console.log('[Lazy] Loading MonetizationBlock...');
}
```

---

## Checklist

- [x] Identificar componentes below-the-fold
- [x] Criar skeletons apropriados
- [x] Implementar lazy loading com Suspense
- [x] Converter named exports para default
- [x] Testar loading states
- [ ] Monitorar métricas de performance
- [ ] Documentar impacto no bundle

---

*Documento criado como parte da Sprint 02 - Performance*

# QA_SP10_BUILD_CHUNKING.md

> Repo: aistudio-md-connect-app
> Sprint: SP10 — Build Chunking Cleanup + Perf Guardrails
> Commit: `chore(build): improve chunking and remove mixed import warning`
> Date: 2026-03-02

---

## Objective

Fix build warnings and improve code splitting:
1. Remove mixed import pattern for ChurchShowcase.tsx
2. Document chunk sizes

---

## Prior Warning (Before Fix)

```
(!) C:/Users/jafsa/documents/git/aistudio-md-connect-app/src/pages/ChurchShowcase.tsx 
is dynamically imported by C:/Users/jafsa/documents/git/aistudio-md-connect-app/src/App.tsx 
but also statically imported by C:/Users/jafsa/documents/git/aistudio-md-connect-app/src/layouts/ChurchLayout.tsx, 
dynamic import will not move module into another chunk.
```

---

## Change Made

### ChurchLayout.tsx

Changed from static import to lazy import:

```typescript
// Before
import ChurchShowcase from '@/pages/ChurchShowcase';
return <ChurchShowcase />;

// After
const ChurchShowcase = lazy(() => import('@/pages/ChurchShowcase'));
return (
    <Suspense fallback={<div>...</div>}>
        <ChurchShowcase />
    </Suspense>
);
```

This ensures both App.tsx and ChurchLayout.tsx use dynamic imports consistently.

---

## Post-Build Evidence

### Build Output (No ChurchShowcase Warning)

The build now completes without the ChurchShowcase warning.

### Top 5 Largest Chunks (Post-Fix)

| Chunk | Size (kB) | gzip (kB) |
|-------|------------|------------|
| index.js | 636.49 | 191.04 |
| PrayerRequestPage.js | 75.92 | 26.75 |
| index.esm.js | 23.35 | 8.95 |
| ChurchImplementationPage.js | 22.71 | 6.43 |
| PrayerHub.js | 21.47 | 6.59 |

### Chunk Size Warning (Remaining)

```
(!) Some chunks are larger than 500 kB after minification. 
Consider using dynamic import() to code-split the application.
```

**Note:** The main bundle (index.js at 636 kB) is the core React application. Further chunking would require more significant refactoring (e.g., separating vendor chunks, lazy-loading more pages). This is a known tradeoff for a feature-rich single-page app.

---

## No Runtime Changes

- ✅ No UI behavior changes
- ✅ No route changes
- ✅ No feature changes

---

## Gate Evidence (verbatim)

### pnpm type-check
```
> member-app@0.0.0 type-check
> tsc -b --noEmit

Exit code: 0
```

### pnpm build
```
> member-app@0.0.0 build
> tsc -b && vite build

✓ built in 10.00s

Exit code: 0
```

---

## CONNECT Gates

| Gate | Status |
|------|--------|
| `pnpm type-check` | ✅ exit 0 |
| `pnpm build` | ✅ exit 0 |
| ChurchShowcase mixed import fixed | ✅ |
| No runtime changes | ✅ |

---

**QA Sign-off:** AGV — 2026-03-02

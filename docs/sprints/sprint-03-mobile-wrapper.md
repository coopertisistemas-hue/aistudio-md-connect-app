# Sprint 03 - Estratégia Mobile: Capacitor Wrapper

> Data: 2026-02-08  
> Status: Proposta Técnica  
> Escopo: Arquitetura de Wrapper Mobile para MD Connect

---

## 1. Visão Geral

### 1.1 Objetivo

Transformar o MD Connect App (atualmente PWA/web) em um aplicativo mobile nativo distribuível via Google Play Store e Apple App Store, mantendo a base de código React existente e minimizando o retrabalho.

### 1.2 Escolha Tecnológica: Capacitor

**Tecnologia Selecionada:** Ionic Capacitor  
**Versão:** Capacitor 6 (latest stable)  
**Plataforma Inicial:** Android (fase 1)  
**Plataforma Secundária:** iOS (fase 2)

---

## 2. Racional: Por que Capacitor?

### 2.1 Comparativo de Soluções Mobile

| Solução | Curva de Aprendizado | Reuso de Código | Performance | Tempo de MV | Custo de Manutenção |
|---------|---------------------|-----------------|-------------|-------------|---------------------|
| **Capacitor** | Baixa | ~95% | Boa | 2-3 semanas | Baixo |
| React Native | Alta | ~70% | Muito Boa | 6-8 semanas | Médio |
| Flutter | Média | ~85% | Muito Boa | 4-6 semanas | Médio |
| TWA/PWA | Nenhuma | 100% | Depende do OS | 1 semana | Muito Baixo |
| Cordova | Baixa | ~95% | Regular | 2-3 semanas | Alto (legado) |

### 2.2 Por que Capacitor venceu?

#### A. Preservação do Investimento Web

```
Código Existente:
├── React 19 + TypeScript
├── Vite + Tailwind CSS
├── Supabase (BFF)
├── Radix UI Components
└── ~50 páginas implementadas

Com Capacitor:
✅ 95% do código reutilizado
✅ Mesma arquitetura BFF
✅ Mesmos componentes UI
✅ Mesmo fluxo de desenvolvimento
✅ Hot reload funciona
```

**Contras de React Native:**
- ❌ Reescrever componentes UI (Radix → NativeBase/React Native Paper)
- ❌ Nova arquitetura de navegação
- ❌ Repensar state management
- ❌ Reescrever integrações (Supabase, Analytics)
- ❌ Time de 2-3 desenvolvedores RN especializados

#### B. Bridge Nativa Moderna

Capacitor oferece:
- **Bridge JavaScript ↔ Native** otimizado
- **Plugins oficiais** mantidos pelo Ionic team
- **Comunidade ativa** com plugins de terceiros
- **Acesso a APIs nativas** quando necessário (câmera, push, geolocalização)
- **Runtime atualizado** (WebView moderno)

```typescript
// Exemplo: Acesso nativo via plugin
import { Camera, CameraResultType } from '@capacitor/camera';

const takePhoto = async () => {
  const photo = await Camera.getPhoto({
    resultType: CameraResultType.Uri,
    quality: 90
  });
  // Usar foto no app React normalmente
};
```

#### C. Build Pipeline Simplificado

```
Com Capacitor:
1. pnpm build (gera assets estáticos)
2. npx cap sync (copia para plataformas)
3. Android Studio / Xcode (build nativo)
4. Upload para stores

Total: ~15 minutos primeiro build
```

vs React Native:
```
1. Metro bundler
2. Compilação nativa (Android/iOS)
3. Resolução de dependências nativas
4. Configuração de signing
5. Build final

Total: ~2-4 horas setup inicial
```

#### D. Flexibilidade de Deployment

| Canal | Capacitor | React Native | TWA |
|-------|-----------|--------------|-----|
| Google Play | ✅ | ✅ | ✅ |
| Apple Store | ✅ | ✅ | ❌ |
| Web/PWA | ✅ | ❌ | ✅ |
| APK Direto | ✅ | ✅ | ❌ |
| Atualização OTA | ✅ (live updates) | ❌ (obrigatório store) | ✅ |

**Vantagem Crítica:** Podemos distribuir via Google Play (obrigatório para alguns recursos) E manter a versão web funcional com o mesmo codebase.

---

## 3. Estratégia Android-First

### 3.1 Por que Android Primeiro?

#### Dados de Mercado Brasil

| Métrica | Android | iOS |
|---------|---------|-----|
| Market Share (2024) | ~85% | ~15% |
| Dispositivos Ativos | 160M+ | 35M+ |
| Custo de Desenvolvimento | Mais Baixo | Mais Alto (Mac obrigatório) |
| Aprovação Store | 24-48h | 1-7 dias |
| Fragmentação | Alta (vantagem Capacitor) | Baixa |

#### Vantagens Práticas

1. **Sem Hardware Especial**
   - Qualquer máquina Windows/Linux desenvolve Android
   - iOS requer Mac (investimento R$ 15k+)

2. **Ciclo de Feedback Rápido**
   - Internal testing (Firebase App Distribution): Imediato
   - Play Console review: 24-48h
   - iOS TestFlight + Review: 1-7 dias

3. **Público-Alvo da IPDA**
   - Demografia predominantemente Android
   - Dispositivos de entrada/média (R$ 800-2000)
   - Capacitor performa bem em hardware modesto

4. **Validação de Conceito**
   - Testar aceitação antes de investir em iOS
   - Ajustar UX baseado em feedback real
   - Validar modelo de monetização

### 3.2 Roadmap de Plataformas

```
Fase 1 (Android) - Sprint 03-04
├── Configuração Capacitor Android
├── Build pipeline Android
├── Firebase App Distribution (beta)
├── Google Play Console (produção)
└── Otimizações de performance

Fase 2 (iOS) - Sprint 05-06
├── Configuração Capacitor iOS
├── Adaptações de UI (safe areas, notches)
├── Apple Developer Program ($99/ano)
├── TestFlight (beta)
└── App Store Review (produção)

Fase 3 (Desktop) - Sprint 07+
├── Capacitor Electron (opcional)
└── PWA Desktop (Chrome OS, etc)
```

---

## 4. Arquitetura de Alto Nível

### 4.1 Diagrama de Componentes

```
┌─────────────────────────────────────────────────────────────────┐
│                     MD CONNECT MOBILE APP                        │
├─────────────────────────────────────────────────────────────────┤
│                                                                  │
│  ┌─────────────────────────────────────────────────────────┐   │
│  │                  Capacitor Runtime                       │   │
│  │  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐   │   │
│  │  │   Android    │  │     iOS      │  │    Web       │   │   │
│  │  │   WebView    │  │   WebView    │  │   Browser    │   │   │
│  │  └──────────────┘  └──────────────┘  └──────────────┘   │   │
│  └─────────────────────────────────────────────────────────┘   │
│                              │                                  │
│                              ▼                                  │
│  ┌─────────────────────────────────────────────────────────┐   │
│  │              Bridge JavaScript-Nativo                    │   │
│  │  • Plugins Capacitor                                    │   │
│  │  • APIs Nativas (Camera, Push, Storage)                │   │
│  │  • Eventos do ciclo de vida                            │   │   │
│  └─────────────────────────────────────────────────────────┘   │
│                              │                                  │
│                              ▼                                  │
│  ┌─────────────────────────────────────────────────────────┐   │
│  │                 Aplicação React                          │   │
│  │  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐   │   │
│  │  │    App.tsx   │  │   Rotas      │  │  Contextos   │   │   │
│  │  └──────────────┘  └──────────────┘  └──────────────┘   │   │
│  │                                                              │   │
│  │  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐   │   │
│  │  │   Páginas    │  │ Componentes  │  │   Hooks      │   │   │
│  │  │   (50+)      │  │   (UI)       │  │  (Logic)     │   │   │
│  │  └──────────────┘  └──────────────┘  └──────────────┘   │   │
│  └─────────────────────────────────────────────────────────┘   │
│                              │                                  │
│                              ▼                                  │
│  ┌─────────────────────────────────────────────────────────┐   │
│  │                    BFF Layer                             │   │
│  │  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐   │   │
│  │  │   BFF Client │  │    Cache     │  │   Offline    │   │   │
│  │  │   (invoke)   │  │   (local)    │  │   Support    │   │   │
│  │  └──────────────┘  └──────────────┘  └──────────────┘   │   │
│  └─────────────────────────────────────────────────────────┘   │
│                              │                                  │
│                              ▼                                  │
│  ┌─────────────────────────────────────────────────────────┐   │
│  │              Supabase (Edge Functions)                   │   │
│  └─────────────────────────────────────────────────────────┘   │
│                                                                  │
└─────────────────────────────────────────────────────────────────┘
```

### 4.2 Estrutura de Diretórios

```
md-connect-app/
├── src/                          # Código React existente
│   ├── components/
│   ├── pages/
│   ├── hooks/
│   ├── lib/
│   └── ...
├── android/                      # ⬅️ NOVO: Projeto Android
│   ├── app/
│   │   ├── src/main/
│   │   │   ├── java/com/mdconnect/app/
│   │   │   └── res/
│   │   └── build.gradle
│   └── build.gradle
├── ios/                          # ⬅️ NOVO: Projeto iOS (fase 2)
│   └── App/
├── capacitor.config.ts           # ⬅️ NOVO: Configuração Capacitor
├── vite.config.ts                # Build web → assets mobile
├── package.json
└── docs/
```

### 4.3 Fluxo de Desenvolvimento

```mermaid
Developer Workflow:
1. Desenvolve feature em React (src/)
   ↓
2. pnpm build
   → Gera dist/ (assets otimizados)
   ↓
3. npx cap sync android
   → Copia dist/ para android/app/src/main/assets
   → Atualiza plugins nativos
   → Sincroniza dependências
   ↓
4. npx cap run android
   → Instala APK em dispositivo/emulador
   → Hot reload funciona!
   ↓
5. Teste em device físico
   ↓
6. Android Studio → Build Signed APK/AAB
   ↓
7. Upload Google Play Console
```

### 4.4 Plugins Essenciais

| Plugin | Propósito | Status |
|--------|-----------|--------|
| `@capacitor/app` | Eventos de ciclo de vida | ✅ Obrigatório |
| `@capacitor/splash-screen` | Splash nativo | ✅ UX |
| `@capacitor/status-bar` | Controle status bar | ✅ UX |
| `@capacitor/push-notifications` | Notificações | ⚠️ Fase 2 |
| `@capacitor/share` | Share nativo | ✅ UX |
| `@capacitor/preferences` | Storage nativo | ✅ Performance |
| `@capacitor/network` | Detecção offline | ✅ Funcional |
| `@capacitor/local-notifications` | Lembretes locais | ⚠️ Fase 2 |
| `@capacitor/screen-orientation` | Lock portrait | ✅ UX |

---

## 5. Configuração Técnica

### 5.1 Instalação e Setup

```bash
# 1. Instalar Capacitor CLI e core
npm install @capacitor/core @capacitor/cli

# 2. Adicionar plataforma Android
npx cap add android

# 3. Configurar capacitor.config.ts
```

### 5.2 Configuração do Capacitor

```typescript
// capacitor.config.ts
import type { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'com.mdconnect.app',
  appName: 'MD Connect',
  webDir: 'dist',
  server: {
    androidScheme: 'https',
    cleartext: false, // HTTPS only
  },
  plugins: {
    SplashScreen: {
      launchShowDuration: 3000,
      launchAutoHide: true,
      backgroundColor: '#1e3a8a',
      androidSplashResourceName: 'splash',
      androidScaleType: 'CENTER_CROP',
    },
    StatusBar: {
      style: 'DARK',
      backgroundColor: '#1e3a8a',
    },
  },
  // Otimizações Android
  android: {
    allowMixedContent: false,
    captureInput: true,
    webContentsDebuggingEnabled: false, // true em dev
  },
};

export default config;
```

### 5.3 Integração com Build Vite

```typescript
// vite.config.ts (atualizado)
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'path';

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
  build: {
    // Otimizações para mobile
    target: 'es2020',
    minify: 'terser',
    terserOptions: {
      compress: {
        drop_console: true,
        drop_debugger: true,
      },
    },
    // Chunk splitting otimizado
    rollupOptions: {
      output: {
        manualChunks: {
          'vendor-react': ['react', 'react-dom', 'react-router-dom'],
          'vendor-ui': ['@radix-ui/react-dialog', '@radix-ui/react-select', /* ... */],
          'vendor-utils': ['date-fns', 'clsx', 'tailwind-merge'],
        },
      },
    },
  },
});
```

### 5.4 Scripts de Build

```json
// package.json
{
  "scripts": {
    "mobile:build": "tsc && vite build && cap sync",
    "mobile:android": "cap run android",
    "mobile:android:studio": "cap open android",
    "mobile:sync": "cap sync",
    "mobile:copy": "cap copy"
  }
}
```

---

## 6. Adaptações Necessárias

### 6.1 Detecção de Plataforma

```typescript
// lib/platform.ts
import { Capacitor } from '@capacitor/core';

export const isNative = () => Capacitor.isNativePlatform();
export const isAndroid = () => Capacitor.getPlatform() === 'android';
export const isIOS = () => Capacitor.getPlatform() === 'ios';
export const isWeb = () => !isNative();

// Uso em componentes
import { isNative } from '@/lib/platform';

export default function Home() {
  if (isNative()) {
    // Comportamento específico mobile
  }
}
```

### 6.2 Ajustes de UI para Mobile Nativo

#### Safe Areas (Notch, Status Bar)

```css
/* index.css */
:root {
  --safe-area-top: env(safe-area-inset-top);
  --safe-area-bottom: env(safe-area-inset-bottom);
}

.native-app .header {
  padding-top: var(--safe-area-top);
}

.native-app .bottom-nav {
  padding-bottom: var(--safe-area-bottom);
}
```

#### Scroll Behavior

```typescript
// hooks/useScroll.ts
import { useEffect } from 'react';
import { Capacitor } from '@capacitor/core';

export function useNativeScroll() {
  useEffect(() => {
    if (Capacitor.isNativePlatform()) {
      // Desabilitar bounce em iOS
      document.body.style.overscrollBehavior = 'none';
    }
  }, []);
}
```

### 6.3 Deep Links

```typescript
// Configuração para abrir app via links
// capacitor.config.ts
{
  plugins: {
    App: {
      // Handle deep links
    }
  }
}

// Em App.tsx
import { App } from '@capacitor/app';

useEffect(() => {
  App.addListener('appUrlOpen', (data) => {
    // Navegar para rota baseada na URL
    const slug = data.url.split('/').pop();
    navigate(`/devocionais/${slug}`);
  });
}, []);
```

---

## 7. Riscos e Mitigações

### 7.1 Riscos Técnicos

#### Risco 1: Performance em Dispositivos de Entrada

**Descrição:** WebView pode ter performance inferior a nativo em dispositivos Android de baixo custo (comuns no público IPDA).

**Impacto:** Alto  
**Probabilidade:** Média

**Mitigações:**
1. **Otimização agressiva de bundle**
   - Code splitting por rota
   - Lazy loading de componentes
   - Remover dead code

2. **Virtualização de listas**
   ```typescript
   // Usar react-window para listas longas
   import { FixedSizeList } from 'react-window';
   ```

3. **WebView atualizado**
   - Capacitor usa WebView do Chrome (atualizado)
   - Melhor que WebView antigo do sistema

4. **Teste em hardware real**
   - Testar em Moto G, Samsung A-series
   - Definir min-spec: Android 8+ (API 26)

**Métricas de Aceitação:**
- First Contentful Paint < 2s em Moto G9
- Time to Interactive < 4s
- 60fps em scroll de devocionais

---

#### Risco 2: Limitações de Plugins

**Descrição:** Recursos nativos complexos (background sync, geofencing) podem não ter plugins disponíveis.

**Impacto:** Médio  
**Probabilidade:** Baixa

**Mitigações:**
1. **Plugins nativos customizados**
   ```bash
   npx cap plugin:generate my-custom-plugin
   ```

2. **Fallback web**
   ```typescript
   const requestCamera = async () => {
     try {
       if (isNative()) {
         return await Camera.getPhoto();
       }
       // Fallback para input file em web
       return await webCameraFallback();
     } catch {
       // Fallback graceoso
     }
   };
   ```

3. **Comunidade ativa**
   - Ionic maintainers são responsivos
   - 200+ plugins disponíveis
   - Documentação extensiva

---

#### Risco 3: Fragmentação Android

**Descrição:** Diferentes versões de Android (8-14) com comportamentos distintos.

**Impacto:** Médio  
**Probabilidade:** Alta

**Mitigações:**
1. **AndroidX e Support Libraries**
   - Capacitor gerencia compatibilidade
   - Min API: 22 (Android 5.1) → 95% devices

2. **Test Matrix**
   | Versão | Market Share | Prioridade |
   |--------|--------------|------------|
   | Android 14 | 15% | ✅ Testar |
   | Android 13 | 25% | ✅ Testar |
   | Android 12 | 20% | ✅ Testar |
   | Android 11 | 15% | ✅ Testar |
   | Android 10 | 10% | ⚠️ Smoke test |
   | Android 9 | 8% | ⚠️ Smoke test |
   | < Android 9 | 7% | ❌ Não suportar |

3. **Firebase Test Lab**
   - Testes automatizados em 50+ devices
   - Screenshots de cada tela

---

#### Risco 4: Apple App Store Rejection

**Descrição:** Apple rejeita apps que são "apenas um webview" sem funcionalidade nativa.

**Impacto:** Alto (bloqueia iOS)  
**Probabilidade:** Média

**Mitigações:**
1. **Incluir funcionalidades nativas significativas**
   - Push notifications
   - Deep linking
   - Share nativo
   - Camera (para uploads)

2. **Design nativo**
   - Adaptar UI para guidelines iOS
   - Safe areas, gestures nativos
   - Haptics feedback

3. **App Store Optimization**
   - Descrição destacando recursos nativos
   - Screenshots mostrando integração iOS

4. **Preparar para Review**
   - Demo account para reviewers
   - Video de funcionamento
   - Notas de release detalhadas

---

#### Risco 5: Complexidade de Build

**Descrição:** Pipeline de build mobile é mais complexo que web.

**Impacto:** Médio  
**Probabilidade:** Alta

**Mitigações:**
1. **Documentação detalhada**
   - Setup guide passo-a-passo
   - Troubleshooting common errors

2. **Automação CI/CD**
   ```yaml
   # .github/workflows/mobile.yml
   - name: Build Android
     run: |
       pnpm build
       npx cap sync android
       cd android && ./gradlew assembleRelease
   ```

3. **Ambiente Dockerizado**
   ```dockerfile
   # Dockerfile para builds consistentes
   FROM node:20
   RUN apt-get update && apt-get install -y openjdk-17-jdk android-sdk
   ```

4. **Processo de Signing**
   - Documentar geração de keystores
   - CI/CD com secrets criptografados

---

### 7.2 Riscos de Negócio

#### Risco 6: Custos de Stores

| Store | Custo Único | Custo Anual | Observação |
|-------|-------------|-------------|------------|
| Google Play | $25 | - | One-time fee |
| Apple App Store | - | $99 | Renovação anual |
| **Total Ano 1** | **$124** | **$99** | - |

**Mitigação:**
- Budget aprovado na fase de planning
- Conta Google Play: usar conta existente IPDA
- Apple: decisão após validação Android

#### Risco 7: Manutenção Dupla

**Descrição:** Manter web + mobile pode dobrar esforço.

**Mitigação:**
- ✅ **Single source of truth** - 95% código compartilhado
- ✅ **Feature flags** - Controlar rollout
- ✅ **Testes automatizados** - Evitar regressões

---

## 8. Critérios de Sucesso

### 8.1 Métricas Técnicas

| Métrica | Target | Como Medir |
|---------|--------|------------|
| Bundle Size | < 5MB APK | Android Studio Analyzer |
| Startup Time | < 3s | Firebase Performance |
| Crash-free Users | > 99.5% | Crashlytics |
| ANR Rate | < 0.5% | Google Play Console |
| Lighthouse PWA | > 90 | Lighthouse CI |

### 8.2 Métricas de Negócio

| Métrica | Target | Timeline |
|---------|--------|----------|
| Downloads (Android) | 1,000 | Mês 1-3 |
| DAU | 300 | Mês 3 |
| Rating Google Play | > 4.0 | Mês 3 |
| Retenção D1 | > 40% | Mês 1 |

---

## 9. Próximos Passos

### Sprint 03 - Setup e Primeiro Build

- [ ] Instalar Capacitor e configurar projeto
- [ ] Gerar ícones e splash screens
- [ ] Primeiro build Android
- [ ] Teste em device físico
- [ ] Configurar Firebase App Distribution

### Sprint 04 - Beta e Otimização

- [ ] Internal testing com 20 usuários
- [ ] Otimizações de performance
- [ ] Implementar plugins essenciais
- [ ] Preparar assets para Google Play

### Sprint 05 - Produção

- [ ] Google Play Console setup
- [ ] Privacy policy e termos
- [ ] Build de produção (AAB)
- [ ] Submissão e review

---

## 10. Conclusão

**Capacitor é a escolha certa** para o MD Connect porque:

1. **Preserva investimento** - 95% código React reutilizado
2. **Time-to-market** - 2-3 semanas vs 2-3 meses (React Native)
3. **Custo reduzido** - Sem necessidade de devs mobile especializados
4. **Flexibilidade** - Web + Mobile do mesmo codebase
5. **Performance adequada** - WebView moderno é suficiente para leitura bíblica

**Android-first** é estratégico porque:
- 85% do mercado brasileiro
- Menor barreira de entrada (sem Mac)
- Ciclo de feedback mais rápido
- Público IPDA predominantemente Android

**Riscos são gerenciáveis** com:
- Otimizações de performance
- Teste em hardware real
- Plugins nativos quando necessário
- Processo estruturado de build/deploy

---

## 11. Inicialização do Capacitor (Realizado)

> Data: 2026-02-08  
> Status: ✅ Concluído

### 11.1 Comandos Executados

```bash
# 1. Instalar Capacitor Core e CLI
pnpm add -D @capacitor/cli@8.0.2 @capacitor/core@8.0.2

# 2. Instalar plataforma Android
pnpm add -D @capacitor/android@8.0.2

# 3. Adicionar plataforma Android
npx cap add android

# 4. Instalar plugins essenciais
pnpm add @capacitor/app@8.0.0 @capacitor/splash-screen@8.0.0 @capacitor/status-bar@8.0.0
```

### 11.2 Versões Instaladas

| Pacote | Versão | Tipo |
|--------|--------|------|
| `@capacitor/cli` | 8.0.2 | devDependency |
| `@capacitor/core` | 8.0.2 | devDependency |
| `@capacitor/android` | 8.0.2 | devDependency |
| `@capacitor/app` | 8.0.0 | dependency |
| `@capacitor/splash-screen` | 8.0.0 | dependency |
| `@capacitor/status-bar` | 8.0.0 | dependency |

### 11.3 Arquivos Criados

```
md-connect-app/
├── capacitor.config.ts          # Configuração do Capacitor
├── android/                     # Projeto Android nativo
│   ├── app/
│   │   ├── src/main/
│   │   │   ├── AndroidManifest.xml
│   │   │   ├── java/com/mdconnect/app/
│   │   │   └── res/            # Recursos (layouts, strings, etc)
│   │   └── build.gradle
│   ├── build.gradle
│   ├── gradle.properties
│   └── settings.gradle
└── ...
```

### 11.4 Configuração Aplicada

**Arquivo:** `capacitor.config.ts`

```typescript
import type { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'com.mdconnect.app',
  appName: 'MD Connect',
  webDir: 'dist',
  server: {
    androidScheme: 'https',
    cleartext: false,
  },
  plugins: {
    SplashScreen: {
      launchShowDuration: 2000,
      launchAutoHide: true,
      backgroundColor: '#1e3a8a',
      androidSplashResourceName: 'splash',
      androidScaleType: 'CENTER_CROP',
    },
    StatusBar: {
      style: 'DARK',
      backgroundColor: '#1e3a8a',
    },
  },
  android: {
    allowMixedContent: false,
    captureInput: true,
    webContentsDebuggingEnabled: process.env.NODE_ENV === 'development',
  },
};

export default config;
```

### 11.5 Scripts do Package.json

```json
{
  "scripts": {
    "mobile:build": "tsc && vite build && cap sync",
    "mobile:android": "cap run android",
    "mobile:android:studio": "cap open android",
    "mobile:sync": "cap sync",
    "mobile:copy": "cap copy"
  }
}
```

### 11.6 Fluxo de Build Mobile

```bash
# Desenvolvimento (hot reload)
pnpm mobile:build    # Build web + sync para Android
npx cap run android  # Instala e roda em device/emulador

# Produção
pnpmmobile:build     # Build otimizado
npx cap open android # Abre Android Studio
# → Build → Generate Signed Bundle/APK
```

### 11.7 Checklist de Inicialização

- [x] Capacitor CLI instalado (8.0.2)
- [x] Capacitor Core instalado (8.0.2)
- [x] Plataforma Android adicionada (8.0.2)
- [x] Arquivo `capacitor.config.ts` criado
- [x] Plugins essenciais instalados
- [x] Diretório `android/` gerado
- [x] App ID configurado: `com.mdconnect.app`
- [x] Tema IPDA aplicado (azul #1e3a8a)

### 11.8 Próximos Passos Imediatos

1. **Gerar ícones e splash screens**
   ```bash
   npm install -g cordova-res
   cordova-res android --skip-config --copy
   ```

2. **Configurar signing para release**
   - Gerar keystore
   - Configurar `android/app/build.gradle`

3. **Primeiro build de teste**
   ```bash
   pnpm mobile:build
   npx cap open android
   # Build debug APK em Android Studio
   ```

4. **Teste em device físico**
   - Habilitar USB debugging
   - Conectar device e rodar

### 11.9 Configuração de Metadados do App

#### App Identification

| Propriedade | Valor | Arquivo de Configuração |
|-------------|-------|------------------------|
| **App ID** | `com.mdconnect.app` | `capacitor.config.ts` |
| **App Name** | `MD Connect` | `capacitor.config.ts` + `strings.xml` |
| **Short Name** | `MD Connect` | `strings.xml` |
| **Description** | Momento Devocional - Palavra, Comunidade e Apoio | `strings.xml` |
| **Version** | `1.0.0` | `package.json` + `build.gradle` |
| **Build Number** | `1` | `build.gradle` |

#### Arquivos de Configuração Atualizados

**1. capacitor.config.ts**
```typescript
const config: CapacitorConfig = {
  appId: 'com.mdconnect.app',           // Reverse domain
  appName: 'MD Connect',                // Nome do app
  webDir: 'dist',                       // Diretório de build
  
  server: {
    androidScheme: 'https',
    cleartext: false,
  },
  
  plugins: {
    SplashScreen: {
      launchShowDuration: 2000,         // 2 segundos
      launchAutoHide: true,
      backgroundColor: '#1e3a8a',       // IPDA Blue
      androidSplashResourceName: 'splash',
      androidScaleType: 'CENTER_CROP',
      showSpinner: false,
      splashFullScreen: true,
      splashImmersive: true,
    },
    StatusBar: {
      style: 'DARK',
      backgroundColor: '#1e3a8a',
    },
  },
  
  android: {
    allowMixedContent: false,
    captureInput: true,
    webContentsDebuggingEnabled: process.env.NODE_ENV === 'development',
    overrideUserAgent: 'MD-Connect-Android/1.0.0',
    backgroundColor: '#1e3a8a',
  },
};
```

**2. android/app/src/main/res/values/strings.xml**
```xml
<?xml version='1.0' encoding='utf-8'?>
<resources>
    <string name="app_name">MD Connect</string>
    <string name="app_name_short">MD Connect</string>
    <string name="title_activity_main">MD Connect</string>
    <string name="package_name">com.mdconnect.app</string>
    <string name="custom_url_scheme">com.mdconnect.app</string>
    <string name="app_description">Momento Devocional - Palavra, Comunidade e Apoio</string>
</resources>
```

**3. AndroidManifest.xml**
```xml
<manifest xmlns:android="http://schemas.android.com/apk/res/android">
    <application
        android:allowBackup="true"
        android:icon="@mipmap/ic_launcher"
        android:label="@string/app_name"
        android:roundIcon="@mipmap/ic_launcher_round"
        android:supportsRtl="true"
        android:theme="@style/AppTheme">
        
        <activity
            android:name=".MainActivity"
            android:label="@string/title_activity_main"
            android:theme="@style/AppTheme.NoActionBarLaunch"
            android:launchMode="singleTask"
            android:exported="true">
            
            <intent-filter>
                <action android:name="android.intent.action.MAIN" />
                <category android:name="android.intent.category.LAUNCHER" />
            </intent-filter>
            
            <!-- Deep Link Configuration -->
            <intent-filter>
                <action android:name="android.intent.action.VIEW" />
                <category android:name="android.intent.category.DEFAULT" />
                <category android:name="android.intent.category.BROWSABLE" />
                <data android:scheme="com.mdconnect.app" />
            </intent-filter>
        </activity>
    </application>
    
    <uses-permission android:name="android.permission.INTERNET" />
</manifest>
```

#### Splash Screen e Ícones (Placeholders)

**Status Atual:** Placeholders padrão do Capacitor configurados

**Diretórios Criados:**
```
android/app/src/main/res/
├── mipmap-mdpi/          # 48x48 - Densidade base
├── mipmap-hdpi/          # 72x72 - Alta densidade
├── mipmap-xhdpi/         # 96x96 - Extra alta
├── mipmap-xxhdpi/        # 144x144 - XX alta
├── mipmap-xxxhdpi/       # 192x192 - XXX alta
├── mipmap-anydpi-v26/    # Ícones adaptativos (Android 8.0+)
├── drawable-port-*/      # Splash screens portrait
└── drawable-land-*/      # Splash screens landscape
```

**Especificações para Assets Finais:**

| Asset | Dimensões | Formato | Localização Fonte |
|-------|-----------|---------|-------------------|
| **Ícone** | 1024x1024 | PNG | `resources/icon.png` |
| **Splash** | 2732x2732 | PNG | `resources/splash.png` |
| **Background** | - | Cor | `#1e3a8a` (IPDA Blue) |

**Gerar Assets:**
```bash
# Instalar gerador de recursos
npm install -g cordova-res

# Gerar todos os assets Android
npx cordova-res android --skip-config --copy

# Isso irá gerar:
# - Ícones em todas as densidades mipmap-*/
# - Splash screens em drawable-port-*/ e drawable-land-*/
```

#### URL Scheme (Deep Links)

**Scheme Configurado:** `com.mdconnect.app`

**Exemplos de Deep Links:**
```
com.mdconnect.app://              # Home
com.mdconnect.app://devocionais   # Lista de devocionais
com.mdconnect.app://biblia        # Bíblia
com.mdconnect.app://prayer        # Pedidos de oração
```

**Uso no Código:**
```typescript
import { App } from '@capacitor/app';

App.addListener('appUrlOpen', (data) => {
  const path = data.url.replace('com.mdconnect.app://', '');
  navigate(`/${path}`);
});
```

#### Versionamento

**Estratégia:** SemVer (MAJOR.MINOR.PATCH)

| Tipo | Incrementar Quando | Exemplo |
|------|-------------------|---------|
| **MAJOR** | Breaking changes | 1.0.0 → 2.0.0 |
| **MINOR** | Novas features | 1.0.0 → 1.1.0 |
| **PATCH** | Bug fixes | 1.0.0 → 1.0.1 |

**Atualização de Versão:**

1. **package.json**
   ```json
   "version": "1.0.0"
   ```

2. **android/app/build.gradle**
   ```gradle
   android {
       defaultConfig {
           versionCode 1
           versionName "1.0.0"
       }
   }
   ```

3. **capacitor.config.ts**
   ```typescript
   android: {
       overrideUserAgent: 'MD-Connect-Android/1.0.0'
   }
   ```

#### Checklist de Metadados

- [x] App ID definido: `com.mdconnect.app`
- [x] App Name configurado: `MD Connect`
- [x] Short Name configurado: `MD Connect`
- [x] Description adicionada: Momento Devocional
- [x] URL Scheme configurado: `com.mdconnect.app`
- [x] Splash screen config (placeholders)
- [x] Status bar config (IPDA Blue)
- [x] Tema corporativo aplicado
- [ ] Ícones finais gerados (pending assets)
- [ ] Splash screens finais gerados (pending assets)

---

## 12. Referências e Documentação

- [Documentação de Metadados](resources/METADATA.md)
- [Capacitor Configuration](https://capacitorjs.com/docs/config)
- [Android App Manifest](https://developer.android.com/guide/topics/manifest/manifest-intro)
- [Android Adaptive Icons](https://developer.android.com/guide/practices/ui_guidelines/icon_design_adaptive)

---

*Documento técnico para aprovação da estratégia mobile*

---

## 12. Permissões Android (Privacy-First)

### 12.1 Filosofia de Privacidade

O MD Connect segue uma abordagem **privacy-first** e **minimalista** para permissões:

- ✅ **Apenas permissões essenciais** são solicitadas
- ❌ **Nenhuma permissão desnecessária** é incluída
- 🔒 **Dados do usuário são protegidos** por padrão
- 📱 **Transparência total** sobre o que é acessado

### 12.2 Permissões Atuais

#### Permissão Essencial

| Permissão | Necessidade | Justificativa |
|-----------|-------------|---------------|
| `android.permission.INTERNET` | **Obrigatória** | Conexão com Supabase (BFF), API de Bíblia, e serviços cloud |

**Arquivo:** `android/app/src/main/AndroidManifest.xml`

```xml
<uses-permission android:name="android.permission.INTERNET" />
```

**Nota:** Esta é a única permissão necessária para o funcionamento básico do app.

### 12.3 Permissões NÃO Incluídas (Proposital)

| Permissão | Por que NÃO foi incluída | Alternativa Usada |
|-------------|---------------------------|-------------------|
| `CAMERA` | Upload de fotos não é feature MVP | N/A (futuramente via input file) |
| `READ_EXTERNAL_STORAGE` | Não precisamos acessar arquivos do usuário | N/A |
| `WRITE_EXTERNAL_STORAGE` | Cache é gerenciado pelo WebView | Diretório interno do app |
| `ACCESS_FINE_LOCATION` | Não usamos geolocalização | N/A |
| `RECORD_AUDIO` | Não temos features de áudio nativo | N/A |
| `POST_NOTIFICATIONS` | Push notifications - Fase 2 | Configurável futuramente |

### 12.4 Configuração de WebView (Privacidade)

#### Configurações de Segurança

**Arquivo:** `capacitor.config.ts`

```typescript
const config: CapacitorConfig = {
  server: {
    androidScheme: 'https',           // ✅ Sempre HTTPS
    cleartext: false,                 // ❌ Bloqueia HTTP não-seguro
    ...(process.env.NODE_ENV === 'development' && { 
      cleartext: true                // ⚠️ Apenas em desenvolvimento
    }),
  },
  
  android: {
    // Segurança
    allowMixedContent: false,         // ❌ Bloqueia conteúdo misto HTTP/HTTPS
    captureInput: true,               // ✅ Captura de input otimizada
    webContentsDebuggingEnabled: false, // ❌ Debug desabilitado em produção
    
    // User Agent customizado para analytics
    overrideUserAgent: 'MD-Connect-Android/1.0.0',
  },
};
```

#### Comportamento de Segurança

| Configuração | Valor | Impacto |
|--------------|-------|---------|
| `androidScheme` | `https` | Todas as requisições usam HTTPS |
| `cleartext` | `false` | Bloqueia comunicação não criptografada |
| `allowMixedContent` | `false` | Impede carregamento de HTTP em HTTPS |
| `webContentsDebuggingEnabled` | `false` | Previne inspeção em produção |

### 12.5 Checklist de Privacidade

- [x] Apenas permissão INTERNET ativa
- [x] HTTPS obrigatório em produção
- [x] Cleartext desabilitado em produção
- [x] Mixed content bloqueado
- [x] WebView debugging desabilitado em produção
- [x] User agent customizado (não revela info sensível)
- [x] Nenhuma permissão de storage solicitada
- [x] Nenhuma permissão de localização solicitada
- [x] Nenhuma permissão de câmera/microfone solicitada

### 12.6 Comparação com Outros Apps

| App | Permissões Comuns | MD Connect |
|-----|-------------------|------------|
| **App de Igreja Médio** | INTERNET, CAMERA, STORAGE, LOCATION | **Apenas INTERNET** ✅ |
| **Rede Social** | 10+ permissões | **Minimalista** ✅ |
| **App de Bíblia** | INTERNET, STORAGE, NOTIFICATIONS | **Apenas INTERNET** ✅ |

### 12.7 Impacto no Google Play

**Vantagens da abordagem privacy-first:**

1. **Data Safety Section** - Fácil preenchimento (poucos dados coletados)
2. **Review mais rápido** - Menos permissões = menos scrutinização
3. **Confiança do usuário** - Transparência aumenta conversão
4. **LGPD/GDPR compliance** - Menos burocracia legal

**Declaração de Data Safety:**
```
Dados Coletados:
- Nenhum dado do dispositivo (location, contacts, files)
- Apenas dados de uso anônimos (analytics)
- Dados de conta (email, nome) - via Supabase seguro

Compartilhamento:
- Nenhum compartilhamento com terceiros
- Dados apenas para funcionamento do app
```

---

## 13. Deep Linking (Android)

### 13.1 Configuração Básica

Deep linking permite que o app seja aberto a partir de URLs específicas, facilitando o compartilhamento de conteúdo e a navegação direta.

**URL Scheme Configurado:** `com.mdconnect.app`

### 13.2 URLs Suportadas

| URL | Destino | Descrição |
|-----|---------|-----------|
| `com.mdconnect.app://` | Home | Página inicial do app |
| `com.mdconnect.app://devocionais` | Devocionais | Lista de devocionais |
| `com.mdconnect.app://devocionais/:id` | Devocional | Devocional específico |
| `com.mdconnect.app://biblia` | Bíblia | Home da Bíblia |
| `com.mdconnect.app://biblia/:livro` | Livro Bíblico | Lista de capítulos |
| `com.mdconnect.app://biblia/:livro/:capitulo` | Capítulo | Leitura específica |

### 13.3 Configuração no AndroidManifest.xml

**Arquivo:** `android/app/src/main/AndroidManifest.xml`

```xml
<activity
    android:name=".MainActivity"
    android:launchMode="singleTask"
    android:exported="true">
    
    <!-- Launcher -->
    <intent-filter>
        <action android:name="android.intent.action.MAIN" />
        <category android:name="android.intent.category.LAUNCHER" />
    </intent-filter>
    
    <!-- Deep Link Configuration -->
    <intent-filter>
        <action android:name="android.intent.action.VIEW" />
        <category android:name="android.intent.category.DEFAULT" />
        <category android:name="android.intent.category.BROWSABLE" />
        <data android:scheme="com.mdconnect.app" />
    </intent-filter>
    
</activity>
```

### 13.4 Exemplos de Uso

**Compartilhar um devocional:**
```
com.mdconnect.app://devocionais/joao-3-16
```

**Link direto para capítulo bíblico:**
```
com.mdconnect.app://biblia/joao/3
```

**Abrir app na home:**
```
com.mdconnect.app://
```

### 13.5 Testando Deep Links

**Via ADB (Android Debug Bridge):**
```bash
# Abrir home
adb shell am start -W -a android.intent.action.VIEW -d "com.mdconnect.app://"

# Abrir devocional específico
adb shell am start -W -a android.intent.action.VIEW -d "com.mdconnect.app://devocionais/latest"

# Abrir capítulo da Bíblia
adb shell am start -W -a android.intent.action.VIEW -d "com.mdconnect.app://biblia/genesis/1"
```

### 13.6 Implementação Futura (React)

Quando implementar o handling no React:

```typescript
import { App } from '@capacitor/app';
import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

export function useDeepLinks() {
  const navigate = useNavigate();
  
  useEffect(() => {
    App.addListener('appUrlOpen', (data) => {
      const url = new URL(data.url);
      const path = url.pathname || '/';
      
      // Parse path and navigate
      // Ex: /devocionais/:id -> navigate('/devocionais/:id')
      navigate(path);
    });
    
    return () => {
      App.removeAllListeners();
    };
  }, [navigate]);
}
```

### 13.7 Casos de Uso

1. **Compartilhamento Social**
   - Usuário compartilha devocional do dia via WhatsApp
   - Link: `com.mdconnect.app://devocionais/2024-02-08`

2. **Notificações Push (Fase 2)**
   - Push notification abre diretamente o devocional
   - Deep link embutido na notificação

3. **QR Codes em Igreja**
   - QR code no boletim aponta para capítulo da semana
   - Link: `com.mdconnect.app://biblia/romanos/8`

4. **Website para App**
   - Botão "Abrir no App" no site
   - Redireciona para conteúdo específico

### 13.8 Limitações Atuais

- ✅ Configuração AndroidManifest.xml implementada
- ⚠️ Handling no React não implementado (futuro)
- ⚠️ Apenas custom URL scheme (não Universal Links)
- ✅ Funciona offline (app abre normalmente)

---

## 14. Referências e Documentação

- [Documentação de Metadados](resources/METADATA.md)
- [Capacitor Configuration](https://capacitorjs.com/docs/config)
- [Android App Manifest](https://developer.android.com/guide/topics/manifest/manifest-intro)
- [Android Adaptive Icons](https://developer.android.com/guide/practices/ui_guidelines/icon_design_adaptive)
- [Android Permissions Best Practices](https://developer.android.com/training/permissions/usage-notes)

---

*Documento técnico para aprovação da estratégia mobile*

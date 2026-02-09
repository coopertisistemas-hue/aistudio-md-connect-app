# Sprint 02 - PWA: Status e Configuração Atual

> Data: 2026-02-07  
> Status: NÃO IMPLEMENTADO  
> Escopo: Análise de configuração PWA atual e requisitos para implementação

---

## 1. Status Atual do PWA

### 1.1 Configuração Geral

| Aspecto | Status | Detalhes |
|---------|--------|----------|
| **Manifest.json** | ❌ AUSENTE | Arquivo não existe em `public/manifest.json` |
| **Service Worker** | ❌ AUSENTE | Nenhum SW registrado ou configurado |
| **Vite PWA Plugin** | ❌ NÃO INSTALADO | `vite-plugin-pwa` não está nas dependências |
| **Link no HTML** | ❌ AUSENTE | `index.html` não contém `<link rel="manifest">` |
| **Registro SW** | ❌ AUSENTE | `main.tsx` não registra service worker |
| **Ícones PWA** | ⚠️ PARCIAL | Ícones existem em `/public/` mas não no formato PWA completo |

### 1.2 Estrutura de Arquivos Atual

```
public/
├── favicon.ico              ✅ (64 KB)
├── logo.jpg                 ✅ (297 KB) - Logo principal
├── logo-md.png              ✅ (158 KB) - Logo MD Connect
├── logo-md-transparent.jpg  ✅ (158 KB) - Logo transparente
├── og-mdconnect.png         ✅ (158 KB) - Open Graph
├── vite.svg                 ✅ (4 KB) - Logo Vite
└── manifest.json            ❌ NÃO EXISTE
```

### 1.3 Configuração Vite Atual

**Arquivo:** `vite.config.ts`

```typescript
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import path from 'path'

export default defineConfig({
  plugins: [react()],  // ❌ Sem vite-plugin-pwa
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
  server: {
    port: 5173,
    strictPort: true,
  },
})
```

**Observação:** O arquivo de configuração não inclui o plugin `vite-plugin-pwa` necessário para geração automática de Service Worker e manifest.

### 1.4 Index.html - Meta Tags

**Arquivo:** `index.html`

Meta tags PWA presentes:
- ✅ `theme-color`: `#6366f1`
- ✅ `viewport`: `width=device-width, initial-scale=1.0`
- ❌ `manifest`: Link para manifest.json ausente
- ❌ `apple-mobile-web-app-capable`: Ausente
- ❌ `apple-mobile-web-app-status-bar-style`: Ausente

```html
<head>
  <meta charset="UTF-8" />
  <link rel="icon" type="image/x-icon" href="/favicon.ico" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <meta name="theme-color" content="#6366f1" />
  <!-- TODO: Adicionar <link rel="manifest" href="/manifest.json"> -->
</head>
```

---

## 2. Service Worker - Status

### 2.1 Implementação Atual

**Status:** NENHUMA IMPLEMENTAÇÃO

- ❌ Nenhum arquivo de Service Worker (`sw.js`, `service-worker.js`)
- ❌ Sem registro em `main.tsx`
- ❌ Sem Workbox configurado
- ❌ Sem estratégia de cache

### 2.2 Cache Atual

O app atualmente usa apenas **localStorage** para dados simples:

```typescript
// Implementações existentes em localStorage:
- md_bible_progress      // Progresso de leitura bíblica
- md_verse_date          // Data do versículo diário
- md_verse_data          // Versículo em cache
- md_reduce_motion       // Preferência de acessibilidade
- md_session_hash        // ID de sessão anônimo
- md_current_church      // Igreja atual
- md:cache:*             // Cache de conteúdo (implementado Sprint 02)
```

**Limitação:** localStorage não oferece:
- Cache de assets estáticos (JS, CSS, imagens)
- Funcionalidade offline completa
- Background sync
- Push notifications

---

## 3. Offline Scope - Análise

### 3.1 Funcionalidades que FUNCIONAM Offline (Parcial)

Com o cache implementado em `src/lib/cache.ts`:

| Funcionalidade | Offline | Cache | Observação |
|----------------|---------|-------|------------|
| **Leitura Bíblica** | ⚠️ Parcial | ✅ Capítulos em cache | Capítulos já lidos funcionam offline |
| **Devocionais** | ⚠️ Parcial | ✅ Devocional em cache | Último devocional lido disponível |
| **Versículo Diário** | ✅ Sim | localStorage | Cache do dia atual |
| **Progresso de Leitura** | ✅ Sim | localStorage | Salvo localmente |
| **Interface UI** | ❌ Não | - | Requer internet para carregar app |

### 3.2 Funcionalidades que NÃO FUNCIONAM Offline

| Funcionalidade | Motivo |
|----------------|--------|
| **Login/Autenticação** | Requer Supabase Auth |
| **Pedidos de Oração** | Requer API para envio/leitura |
| **Eventos/Agenda** | Dados dinâmicos da igreja |
| **Notícias/Mural** | Conteúdo atualizado frequentemente |
| **Rádio** | Streaming requer conexão |
| **Devocional do Dia** | Só funciona se já cacheado |

### 3.3 Limitações Atuais

1. **Sem App Shell Cache**
   - O app não pode iniciar sem internet
   - HTML, CSS e JS são sempre buscados da rede

2. **Sem Cache de Assets**
   - Imagens e ícones não são cacheados
   - Fontes do Google Fonts sempre carregam da CDN

3. **Sem Background Sync**
   - Ações offline (ex: curtir versículo) não são sincronizadas

4. **Sem Instalação**
   - Usuários não podem "Adicionar à Tela Inicial"
   - Não funciona como app standalone

---

## 4. Requisitos para PWA Completo

### 4.1 Dependências Necessárias

```bash
npm install -D vite-plugin-pwa
```

### 4.2 Configuração Vite

```typescript
// vite.config.ts
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { VitePWA } from 'vite-plugin-pwa'
import path from 'path'

export default defineConfig({
  plugins: [
    react(),
    VitePWA({
      registerType: 'autoUpdate',
      includeAssets: ['favicon.ico', 'apple-touch-icon.png', 'mask-icon.svg'],
      manifest: {
        name: 'MD Connect',
        short_name: 'MDConnect',
        description: 'Momento Devocional - Palavra, Comunidade e Apoio',
        theme_color: '#1e3a8a',
        background_color: '#f8fafc',
        display: 'standalone',
        scope: '/',
        start_url: '/',
        orientation: 'portrait',
        lang: 'pt-BR',
        icons: [
          {
            src: '/logo-md.png',
            sizes: '192x192',
            type: 'image/png'
          },
          {
            src: '/logo-md.png',
            sizes: '512x512',
            type: 'image/png',
            purpose: 'any maskable'
          }
        ],
        screenshots: [
          {
            src: '/og-mdconnect.png',
            sizes: '1280x720',
            type: 'image/png',
            form_factor: 'wide'
          }
        ]
      },
      workbox: {
        globPatterns: ['**/*.{js,css,html,ico,png,svg}'],
        runtimeCaching: [
          {
            urlPattern: /^https:\/\/fonts\.googleapis\.com\/.*/i,
            handler: 'CacheFirst',
            options: {
              cacheName: 'google-fonts-cache',
              expiration: {
                maxEntries: 10,
                maxAgeSeconds: 60 * 60 * 24 * 365 // 1 year
              }
            }
          },
          {
            urlPattern: /^https:\/\/fonts\.gstatic\.com\/.*/i,
            handler: 'CacheFirst',
            options: {
              cacheName: 'gstatic-fonts-cache',
              expiration: {
                maxEntries: 10,
                maxAgeSeconds: 60 * 60 * 24 * 365
              }
            }
          }
        ]
      }
    })
  ],
  // ... resto da configuração
})
```

### 4.3 Atualizações Necessárias

#### A. index.html

```html
<head>
  <!-- ... meta tags existentes ... -->
  
  <!-- PWA Meta Tags -->
  <link rel="manifest" href="/manifest.json">
  <meta name="apple-mobile-web-app-capable" content="yes">
  <meta name="apple-mobile-web-app-status-bar-style" content="black-translucent">
  <meta name="apple-mobile-web-app-title" content="MD Connect">
  <link rel="apple-touch-icon" href="/logo-md.png">
  
  <!-- Theme Color Dinâmico -->
  <meta name="theme-color" content="#1e3a8a" media="(prefers-color-scheme: light)">
  <meta name="theme-color" content="#0f172a" media="(prefers-color-scheme: dark)">
</head>
```

#### B. main.tsx

```typescript
// main.tsx
import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App'
import './index.css'

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
)

// Registro do Service Worker (adicionar no final)
if ('serviceWorker' in navigator) {
  window.addEventListener('load', () => {
    navigator.serviceWorker.register('/sw.js')
      .then((registration) => {
        console.log('SW registered:', registration)
      })
      .catch((error) => {
        console.log('SW registration failed:', error)
      })
  })
}
```

---

## 5. Estratégia de Cache Recomendada

### 5.1 App Shell (Cache-First)

Assets que devem sempre estar disponíveis offline:

```javascript
// workbox.config.js
workbox: {
  globPatterns: [
    'index.html',
    '**/*.{js,css}',
    'favicon.ico',
    'logo-md.png',
    'logo-md-transparent.jpg'
  ],
  globIgnores: ['**/*.map', '**/sw.js']
}
```

### 5.2 Conteúdo Dinâmico (Stale-While-Revalidate)

```javascript
runtimeCaching: [
  // API de Bíblia - Cache com atualização em background
  {
    urlPattern: /^https:\/\/bible-api\.com\/.*/i,
    handler: 'StaleWhileRevalidate',
    options: {
      cacheName: 'bible-api-cache',
      expiration: {
        maxEntries: 100,
        maxAgeSeconds: 60 * 60 * 24 * 30 // 30 dias
      }
    }
  },
  // Imagens de capa - Cache First
  {
    urlPattern: /\.(?:png|jpg|jpeg|svg|gif)$/i,
    handler: 'CacheFirst',
    options: {
      cacheName: 'images-cache',
      expiration: {
        maxEntries: 60,
        maxAgeSeconds: 60 * 60 * 24 * 30
      }
    }
  }
]
```

### 5.3 Estratégia Híbrida (Cache de Conteúdo + Network)

Para o sistema de cache já implementado em `src/lib/cache.ts`:

```typescript
// Integrar com Service Worker
// O SW pode interceptar chamadas da API e:
// 1. Verificar se existe em IndexedDB (cache.ts)
// 2. Se não existir, buscar na rede
// 3. Salvar em IndexedDB para uso offline
```

---

## 6. Roadmap de Implementação PWA

### Fase 1: Básico (Essencial para MVP)
- [ ] Instalar `vite-plugin-pwa`
- [ ] Criar `manifest.json` completo
- [ ] Configurar Service Worker básico (App Shell)
- [ ] Adicionar meta tags PWA no `index.html`
- [ ] Testar instalação em dispositivos móveis

### Fase 2: Cache Avançado
- [ ] Implementar cache de capítulos bíblicos no SW
- [ ] Cache de imagens e assets estáticos
- [ ] Background sync para ações offline
- [ ] Estratégia de atualização do app

### Fase 3: Recursos Premium
- [ ] Push Notifications (Firebase/OneSignal)
- [ ] Badge API para notificações
- [ ] Periodic Background Sync (devocional diário)
- [ ] Share Target API (compartilhar versículos)

---

## 7. Considerações de Segurança

### 7.1 HTTPS
- PWA requer HTTPS em produção
- Service Workers só funcionam em contexto seguro
- Localhost é exceção durante desenvolvimento

### 7.2 Scope do Service Worker
- SW controla todas as requisições no seu scope
- Scope padrão: `/` (raiz do domínio)
- Rotas externas (analytics, APIs) precisam de tratamento especial

### 7.3 Cache de Dados Sensíveis
- NÃO cachear:
  - Dados de login/sessão
  - Informações pessoais do usuário
  - Tokens de autenticação
- Cachear apenas:
  - Conteúdo público (Bíblia, devocionais)
  - Assets estáticos (JS, CSS, imagens)

---

## 8. Métricas de Sucesso

| Métrica | Antes | Meta | Como Medir |
|---------|-------|------|------------|
| Lighthouse PWA Score | 0/100 | >90/100 | Lighthouse CI |
| Install Prompt | ❌ | ✅ | Evento `beforeinstallprompt` |
| Offline Functionality | 0% | 70% | Testes manuais |
| Cache Hit Rate | N/A | >60% | Workbox analytics |
| App Size (Installable) | N/A | <50MB | Chrome DevTools |

---

## 9. Referências

### Documentação
- [Vite PWA Plugin](https://vite-pwa-org.netlify.app/)
- [Workbox](https://developer.chrome.com/docs/workbox/)
- [Web App Manifest](https://developer.mozilla.org/en-US/docs/Web/Manifest)
- [Service Worker API](https://developer.mozilla.org/en-US/docs/Web/API/Service_Worker_API)

### Ferramentas de Teste
- Chrome DevTools → Lighthouse → PWA
- Chrome DevTools → Application → Service Workers
- [PWA Builder](https://www.pwabuilder.com/)
- [Web Page Test](https://www.webpagetest.org/)

---

## 10. Conclusão

**Status Atual:** O app MD Connect não possui configuração PWA completa. A única presença PWA é:
- ✅ Meta tag `theme-color` configurada
- ✅ Ícones disponíveis em `/public/`

**Próximos Passos:**
1. Implementar `vite-plugin-pwa` para geração automática de SW e manifest
2. Criar manifest.json completo com todos os campos obrigatórios
3. Configurar estratégia de cache para conteúdo bíblico e devocionais
4. Testar instalação e funcionamento offline

**Impacto Esperado:**
- Possibilidade de instalação na tela inicial
- Funcionamento offline para leitura bíblica
- Melhor performance com cache de assets
- Experiência similar a app nativo

---

*Documento gerado para análise de configuração PWA - Sprint 02*

# Inventário de Assets - MD Connect App

> Data de criação: 2026-02-07  
> Versão: 1.0

---

## 1. Visão Geral

Este documento cataloga todos os assets visuais (imagens, vídeos) e tipográficos (fontes) utilizados no MD Connect App, incluindo suas localizações, formatos e estratégias de carregamento.

---

## 2. Imagens e Assets Visuais

### 2.1 Assets Estáticos (pasta `/public/`)

Todos os assets estáticos são servidos diretamente sem processamento pelo Vite.

| Arquivo | Formato | Tamanho | Uso | Ocorrências |
|---------|---------|---------|-----|-------------|
| `favicon.ico` | ICO | 64 KB | Ícone do navegador/aba | `index.html:5` |
| `logo.jpg` | JPEG | 297 KB | Logo principal (fallback) | Landing pages |
| `logo-md.png` | PNG | 158 KB | Logo MD Connect (ícone) | `HomeHeader.tsx:56`, `DesktopOverlay.tsx:39` |
| `logo-md-transparent.jpg` | JPEG | 158 KB | Logo com fundo transparente | `HeroSection.tsx:29` |
| `custom-logo.jpg` | JPEG | 158 KB | Logo customizado da igreja | `TopBar.tsx:37`, `PublicHeader.tsx:38`, `AppFooter.tsx:30` |
| `og-mdconnect.png` | PNG | 158 KB | Open Graph image (social) | `index.html:28,36` |
| `vite.svg` | SVG | 4 KB | Logo Vite (dev only) | - |
| `videos/md-bg.mp4` | MP4 | 6.4 MB | Vídeo de background | `AppBackground.tsx` |

**Total de assets estáticos:** ~7.4 MB

### 2.2 Assets de Código (pasta `/src/assets/`)

| Arquivo | Formato | Uso |
|---------|---------|-----|
| `react.svg` | SVG | Logo React (template padrão) |

### 2.3 Imagens Dinâmicas (URLs Externas)

O app consome imagens dinâmicas de múltiplas fontes:

#### A. Banco de Dados (Supabase)

| Tipo | Propriedade | Tabelas | Componentes |
|------|-------------|---------|-------------|
| Logo da igreja | `logo_url` | `churches` | `HomeHero.tsx:52` |
| Capa de igreja | `cover_image_url` | `churches` | `SelectChurch.tsx:142` |
| Capa de série | `cover_image_url` | `series` | `SeriesList.tsx:62`, `SeriesDetail.tsx:47` |
| Capa de mensagem | `cover_image_url` | `messages` | `SeriesDetail.tsx:73` |
| Capa de evento | `cover_image_url` | `events` | `EventDetail.tsx:102` |
| Capa de devocional | `cover_image_url` | `devotionals` | `DevotionalDetail.tsx:109` |
| Logo de parceiro | `logo_url` | `partners` | `SponsorOfTheDay.tsx:22` |
| Imagem de afiliado | `image_url` | `affiliates` | `AffiliateCard.tsx:24`, `MonetizationBlock.tsx:279` |
| Avatar do usuário | `avatar_url` / `photo_url` | `auth.users` | `TopBar.tsx:70`, `PublicHeader.tsx:72` |

#### B. Unsplash (Imagens de Stock)

| URL | Uso | Localização |
|-----|-----|-------------|
| `https://images.unsplash.com/photo-1504052434569-70ad5836ab65` | Capa de devocional (fallback) | `DevotionalDetail.tsx:17,109` |
| `https://images.unsplash.com/photo-1478737270239-2f52b7154e7a` | Background da rádio | `RadioPage.tsx:171` |

#### C. Grainy Gradients (Textura)

| URL | Uso | Localização |
|-----|-----|-------------|
| `https://grainy-gradients.vercel.app/noise.svg` | Textura de ruído/noise | `HomeHero.tsx:44`, `AppBackground.tsx:79` |

#### D. Serviço de Imagens de Versículos (IA)

| Endpoint | Uso | Componente |
|----------|-----|------------|
| `verse-image-generate` (Edge Function) | Geração de imagens de versículos | `VersePosterPage.tsx:260` |

### 2.4 Formatos de Imagem Utilizados

| Formato | Uso Principal | Otimização |
|---------|---------------|------------|
| **JPEG** | Fotos, logos com fundo | Compressão lossy aceitável |
| **PNG** | Logos com transparência, ícones | Compressão lossless |
| **SVG** | Ícones vetoriais (Lucide React) | Escalável sem perda |
| **ICO** | Favicon | Múltiplas resoluções embutidas |
| **MP4** | Vídeo de background | Compressão H.264 |

---

## 3. Estratégia de Carregamento de Imagens

### 3.1 Lazy Loading

Imagens com `loading="lazy"` implementado:

| Componente | Imagem | Motivo |
|------------|--------|--------|
| `SeriesList.tsx:62` | `item.cover_image_url` | Lista de séries (abaixo da dobra) |
| `AffiliateCard.tsx:24` | `partner.image_url` | Cards de afiliados (carrossel) |

### 3.2 Eager Loading

Imagens com `loading="eager"`:

| Componente | Imagem | Motivo |
|------------|--------|--------|
| `DevotionalDetail.tsx:112` | `cover_image_url` | Hero image (acima da dobra) |

### 3.3 Carregamento Programático

**Canvas API para posters de versículos:**
- Arquivo: `VersePosterPage.tsx:66-69`
- Método: `new window.Image()` + `img.onload`
- Uso: Carregamento dinâmico de imagem de background para canvas
- Processo:
  1. Cria objeto Image
  2. Define onload handler
  3. Desenha no canvas com `ctx.drawImage()`

### 3.4 Vídeo de Background

| Propriedade | Valor | Arquivo |
|-------------|-------|---------|
| Arquivo | `public/videos/md-bg.mp4` | `AppBackground.tsx:53` |
| Tamanho | 6.4 MB | - |
| Preload | `metadata` | `AppBackground.tsx:53` |
| Autoplay | Sim | - |
| Loop | Sim | - |
| Muted | Sim | - |

**Observação:** O vídeo utiliza `preload="metadata"` para carregar apenas metadados inicialmente, economizando banda.

---

## 4. Fontes Tipográficas

### 4.1 Fontes do Google Fonts

**Importação:** `src/index.css:1`

```css
@import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&family=Montserrat:wght@500;600;700;800&display=swap');
```

**Configuração Tailwind:** `tailwind.config.js:34-37`

```javascript
fontFamily: {
    sans: ['Inter', 'sans-serif'],
    heading: ['Montserrat', 'sans-serif'],
}
```

### 4.2 Famílias de Fontes

| Família | Pesos | Uso | Fallback |
|---------|-------|-----|----------|
| **Inter** | 400, 500, 600, 700 | Texto do corpo, UI | `sans-serif` |
| **Montserrat** | 500, 600, 700, 800 | Títulos, headings | `sans-serif` |

### 4.3 Estratégia de Carregamento de Fontes

| Propriedade | Valor | Descrição |
|-------------|-------|-----------|
| `display=swap` | Ativo | Fonte alternativa exibida imediatamente, trocada quando carregada |
| Cache | Navegador | Fontes cacheadas pelo browser (CDN do Google) |
| Preconnect | Implícito | Não há `<link rel="preconnect">` explícito para fonts.gstatic.com |

### 4.4 Fontes Locais

**Nenhuma fonte local encontrada.** Todas as fontes são carregadas via CDN do Google Fonts.

---

## 5. Ícones

### 5.1 Biblioteca de Ícones

| Biblioteca | Uso | Importação |
|------------|-----|------------|
| **Lucide React** | Ícones da interface | `import { IconName } from 'lucide-react'` |

**Exemplos de uso:**
- Navegação: `Home`, `BookOpen`, `Radio`, `Users`, `User`
- Ações: `Heart`, `Share2`, `Bookmark`, `Play`, `Pause`
- Status: `Check`, `X`, `AlertCircle`, `Loader2`

### 5.2 Ícones como SVG

- **Vite logo:** `public/vite.svg` (usado em dev)
- **React logo:** `src/assets/react.svg` (template)

---

## 6. Análise de Performance e Otimizações

### 6.1 Problemas Identificados

#### A. Fontes
| Problema | Impacto | Solução Sugerida |
|----------|---------|------------------|
| Falta `preconnect` para fonts.gstatic.com | Atraso no carregamento inicial | Adicionar `<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>` em `index.html` |
| Fonte Montserrat com 4 pesos | ~60-80 KB extra | Considerar reduzir pesos se não todos forem usados |

#### B. Imagens
| Problema | Impacto | Localização |
|----------|---------|-------------|
| Logo.jpg (297 KB) maior que necessário | Carregamento mais lento | `public/logo.jpg` |
| Imagens Unsplash sem otimização de tamanho | Download de imagens maiores que o necessário | `DevotionalDetail.tsx`, `RadioPage.tsx` |
| Vídeo de 6.4 MB sem variantes mobile | Dados excessivos em mobile | `public/videos/md-bg.mp4` |
| Múltiplos logos (logo-md.png, custom-logo.jpg, logo-md-transparent.jpg) | Redundância | Pasta `/public/` |

#### C. Lazy Loading
| Problema | Impacto | Solução |
|----------|---------|---------|
| Poucas imagens com lazy loading | Carregamento inicial mais lento | Adicionar `loading="lazy"` em imagens abaixo da dobra |
| Sem `decoding="async"` | Bloqueio do main thread durante decode | Adicionar atributo em todas as `<img>` |

### 6.2 Otimizações Recomendadas

#### Prioridade Alta

1. **Implementar preconnect para fontes:**
   ```html
   <link rel="preconnect" href="https://fonts.googleapis.com">
   <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
   ```

2. **Otimizar imagens Unsplash com parâmetros de tamanho:**
   ```typescript
   // Atual
   'https://images.unsplash.com/photo-...?q=80&w=1000'
   
   // Otimizado
   'https://images.unsplash.com/photo-...?w=800&q=75&auto=format&fit=crop'
   ```

3. **Adicionar lazy loading em todas as imagens dinâmicas:**
   ```tsx
   <img 
     src={imageUrl} 
     loading="lazy" 
     decoding="async"
     alt="..."
   />
   ```

#### Prioridade Média

4. **Converter logos para WebP com fallback:**
   ```tsx
   <picture>
     <source srcSet="/logo-md.webp" type="image/webp">
     <img src="/logo-md.png" alt="Logo">
   </picture>
   ```

5. **Implementar vídeo responsivo:**
   ```tsx
   const isMobile = window.innerWidth < 768;
   const videoSrc = isMobile ? '/videos/md-bg-mobile.mp4' : '/videos/md-bg.mp4';
   ```

6. **Remover assets não utilizados:**
   - `src/assets/react.svg` (apenas template)
   - Verificar uso real de `logo.jpg` vs `logo-md.png`

#### Prioridade Baixa

7. **Considerar Critical CSS para fontes:**
   - Inserir fontes críticas inline para evitar FOUT

8. **Implementar service worker para cache de assets:**
   - Cachear logos e fontes no primeiro acesso

---

## 7. Métricas de Assets

### 7.1 Tamanho Total

| Categoria | Tamanho | % do Total |
|-----------|---------|------------|
| Vídeos | 6.4 MB | 87.7% |
| Imagens estáticas | 894 KB | 12.0% |
| Outros (SVG, ICO, TXT) | 21 KB | 0.3% |
| **Total** | **~7.3 MB** | **100%** |

### 7.2 Contagem de Assets

| Tipo | Quantidade |
|------|------------|
| Imagens estáticas | 8 |
| Vídeos | 1 |
| Ícones (Lucide) | 50+ (biblioteca) |
| Fontes | 2 famílias |

---

## 8. Checklist de Manutenção

- [ ] Auditar uso de `any` em URLs de imagem
- [ ] Verificar se todas as imagens têm atributo `alt`
- [ ] Implementar tratamento de erro para imagens quebradas (`onError`)
- [ ] Adicionar `loading="lazy"` em imagens abaixo da dobra
- [ ] Considerar implementação de blur-up para imagens grandes
- [ ] Otimizar vídeo de background para mobile (versão menor)
- [ ] Implementar CDN para assets (CloudFront/Cloudflare)

---

*Documento gerado automaticamente - Última atualização: 2026-02-07*

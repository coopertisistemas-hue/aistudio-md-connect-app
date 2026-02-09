# Especificacoes de Assets para Stores — MD Connect App

> Ultima atualizacao: 2026-02-07
> Referencia: `docs/store/STORE_CHECKLIST.md`

---

## 1. Icone do App

### 1.1 Especificacoes por plataforma

| Plataforma | Tamanho | Formato | Alpha/Transparencia | Cantos |
|-----------|---------|---------|---------------------|--------|
| Google Play | 512 x 512 px | PNG 32-bit | Nao permitido | Sistema aplica arredondamento |
| App Store | 1024 x 1024 px | PNG | Nao permitido | Sistema aplica arredondamento |
| PWA (manifest) | 512 x 512 px | PNG | Permitido | Nenhum (quadrado) |
| PWA maskable | 512 x 512 px | PNG | Nao recomendado | Safe zone obrigatoria |
| Apple Touch Icon | 180 x 180 px | PNG | Nao permitido | Sistema aplica arredondamento |
| Favicon | 32 x 32 px | ICO ou PNG | Permitido | Nenhum |

### 1.2 Tamanhos adicionais para manifest.json

| Tamanho | Uso |
|---------|-----|
| 48 x 48 | Android notification |
| 72 x 72 | Android mdpi |
| 96 x 96 | Android xdpi / Favicon grande |
| 144 x 144 | Android xxdpi |
| 192 x 192 | Android xxxdpi / PWA install prompt |
| 512 x 512 | PWA splash / Play Store |

### 1.3 Safe Zone (icone maskable)

O icone maskable e recortado em diferentes formatos pelo SO (circulo, quadrado arredondado, squircle). O conteudo visivel deve estar dentro da **safe zone central de 80%**.

```
┌──────────────────────┐
│                      │
│   ┌──────────────┐   │
│   │              │   │
│   │  SAFE ZONE   │   │  ← 80% do centro (409 x 409 px em um canvas de 512)
│   │  (conteudo)  │   │
│   │              │   │
│   └──────────────┘   │
│                      │
└──────────────────────┘
         512 px

Margem de cada lado: ~51 px (10% de cada lado)
```

**Regras:**
- Logo e texto devem estar dentro da safe zone
- Fundo deve preencher todo o canvas (512 x 512) — sem transparencia
- Cor de fundo sugerida: `#0F2C56` (Primary MD Connect) ou `#1e3a8a` (Primary Tailwind)
- Validar em: https://maskable.app/editor

### 1.4 Diretriz visual do icone

| Elemento | Especificacao |
|----------|---------------|
| Simbolo principal | Logo MD Connect (cruz + livro ou versao simplificada) |
| Cor de fundo | `#0F2C56` (azul primario) |
| Cor do simbolo | Branco `#FFFFFF` |
| Estilo | Flat, sem sombras, sem gradientes complexos |
| Texto | Evitar texto no icone (ilegivel em tamanhos pequenos) |

---

## 2. Splash Screen

### 2.1 PWA (via manifest.json)

O splash screen do PWA e gerado automaticamente pelo navegador a partir de:

| Propriedade do manifest | Valor | Uso no splash |
|------------------------|-------|---------------|
| `name` | `MD Connect` | Texto exibido |
| `background_color` | `#0F2C56` | Cor de fundo |
| `theme_color` | `#0F2C56` | Barra de status |
| `icons` (512x512) | Icone do app | Centro da tela |

**Nao ha** imagem customizada de splash no PWA — o sistema gera automaticamente.

### 2.2 TWA / Capacitor (nativo)

Para wrapper nativo, splash screens customizadas sao necessarias:

| Plataforma | Tamanho | Formato | Observacao |
|-----------|---------|---------|-----------|
| Android mdpi | 320 x 480 | PNG | Retrato |
| Android hdpi | 480 x 800 | PNG | Retrato |
| Android xhdpi | 720 x 1280 | PNG | Retrato |
| Android xxhdpi | 960 x 1600 | PNG | Retrato |
| Android xxxhdpi | 1280 x 1920 | PNG | Retrato |
| iOS 1x | 640 x 1136 | PNG | iPhone SE |
| iOS 2x | 750 x 1334 | PNG | iPhone 8 |
| iOS 3x | 1242 x 2208 | PNG | iPhone 8 Plus |
| iOS Super Retina | 1170 x 2532 | PNG | iPhone 14 |
| iOS Pro Max | 1290 x 2796 | PNG | iPhone 15 Pro Max |

### 2.3 Diretriz visual do splash

| Elemento | Especificacao |
|----------|---------------|
| Fundo | Cor solida `#0F2C56` |
| Centro | Logo MD Connect em branco (mesmo do icone, versao horizontal ou vertical) |
| Texto opcional | "MD Connect" em Montserrat 600, branco, abaixo do logo |
| Sem animacao | Imagem estatica (animacoes nao sao suportadas) |

---

## 3. Feature Graphic (Google Play)

| Item | Especificacao |
|------|---------------|
| Tamanho | 1024 x 500 px |
| Formato | PNG ou JPG |
| Uso | Banner de destaque na Play Store |

### Diretriz visual

| Elemento | Especificacao |
|----------|---------------|
| Fundo | Gradiente suave `#0F2C56` → `#1e3a8a` ou foto com overlay |
| Logo | MD Connect centralizado ou a esquerda |
| Tagline | Frase curta a direita (ex: "Palavra, Comunidade e Oracao") |
| Estilo | Limpo, sem excesso de texto, legivel em miniatura |
| Texto | Maximo 3-4 palavras grandes — o resto vai na descricao da store |

---

## 4. Screenshots

### 4.1 Especificacoes tecnicas

| Plataforma | Tamanho recomendado | Orientacao | Qtd |
|-----------|---------------------|-----------|-----|
| Google Play (phone) | 1080 x 1920 px (9:16) | Retrato | 6 |
| Apple iPhone 6.7" | 1290 x 2796 px | Retrato | 6 |
| Apple iPhone 6.5" | 1284 x 2778 px | Retrato | 6 |

### 4.2 Telas a capturar

Capturar na ordem abaixo. Cada screenshot deve ter um **titulo curto** sobreposto no topo (fora da area do app) com fundo colorido.

| # | Tela | Rota | Titulo sugerido | Prioridade |
|---|------|------|-----------------|------------|
| 1 | **Home / Landing** | `/home` | "Devocional do dia na palma da mao" | Obrigatoria |
| 2 | **Devocional (detalhe)** | `/devocionais/:id` | "Reflexao guiada com versiculo e oracao" | Obrigatoria |
| 3 | **Biblia (leitor)** | `/biblia/:bookId/:chapterId` | "Biblia completa com explicacao e audio" | Obrigatoria |
| 4 | **Oracao (hub)** | `/oracao` | "Comunidade de oracao e intercessao" | Obrigatoria |
| 5 | **Poster de Versiculo** | `/versiculo-para-postar` | "Crie imagens com versiculos" | Recomendada |
| 6 | **Radio** | `/radio` | "Radio cristã ao vivo" | Recomendada |
| 7 | **Perfil + Privacidade** | `/c/:slug/profile/privacy` | "Seus dados sob seu controle" | Opcional |
| 8 | **Hub de Igrejas** | `/sou-igreja` | "Encontre sua igreja" | Opcional |

### 4.3 Diretriz visual dos screenshots

| Elemento | Especificacao |
|----------|---------------|
| Moldura | Mockup de dispositivo opcional (iPhone ou Pixel) |
| Titulo | Montserrat 700, branco sobre fundo `#0F2C56`, 1-2 linhas |
| Posicao do titulo | Topo (15-20% da altura) com app abaixo |
| Fundo extra | Cor solida ou gradiente suave ao redor do mockup |
| Estado do app | Dados reais ou realistas (nao lorem ipsum) |
| Barra de status | Visivel com horario, bateria, sinal — aparencia natural |
| Idioma | PT-BR em todo o conteudo visivel |

### 4.4 Dicas por tela

| Tela | O que garantir na captura |
|------|--------------------------|
| Home | Card do devocional visivel, tiles de navegacao, visual limpo |
| Devocional | Versiculo destacado, secao de reflexao, botoes de reacao e compartilhamento |
| Biblia | Texto do capitulo legivel, menu de acao em um versiculo aberto (amem, copiar, ouvir) |
| Oracao | Feed com pelo menos 2-3 pedidos, contagem de "Estou orando", categorias visiveis |
| Poster | Canvas com versiculo renderizado, seletor de templates visivel |
| Radio | Player em estado "tocando", nome da estacao visivel |
| Privacidade | Toggles de LGPD visiveis e ativados |
| Hub de Igrejas | Cards de igrejas com logo e cidade |

---

## 5. Copy para Listagem na Store

### Opcao A — Foco em habito devocional

**Titulo:** `MD Connect`
**Subtitulo (Apple):** `Devocional, Biblia e Oracao`
**Descricao curta (Google):** `Devocional diario, Biblia, oracao e comunidade crista.`

**Descricao completa:**

> Comece o dia com a Palavra de Deus. O MD Connect oferece um devocional diario com reflexao guiada, versiculo do dia e oracao — tudo em 3 a 5 minutos.
>
> Leia a Biblia completa com comentarios teologicos e audio em portugues. Marque seus versiculos favoritos com "Amem" e compartilhe no WhatsApp.
>
> Envie pedidos de oracao e ore por outras pessoas da comunidade. Acompanhe planos de leitura e series de mensagens da sua igreja.
>
> Crie imagens com versiculos para compartilhar nas redes sociais. Ouca a radio cristã ao vivo direto do app.
>
> Gratuito. Sem anuncios intrusivos. Feito com reverencia.

---

### Opcao B — Foco em comunidade e igreja

**Titulo:** `MD Connect`
**Subtitulo (Apple):** `Sua igreja no seu bolso`
**Descricao curta (Google):** `Conecte-se a sua igreja: devocional, Biblia, oracao e avisos.`

**Descricao completa:**

> O MD Connect conecta voce a sua comunidade de fe. Receba avisos da sua igreja, acompanhe a agenda de eventos e participe da rede de oracao.
>
> Leia o devocional do dia com reflexao biblica e compartilhe com quem voce ama. Acesse a Biblia completa com explicacoes e audio.
>
> Envie pedidos de oracao com privacidade e acompanhe as intercessoes da comunidade. Siga planos de leitura e cresca na Palavra.
>
> Gere imagens com versiculos para suas redes sociais e ouca a radio cristã ao vivo.
>
> Gratuito para todos. Monetizacao etica e transparente.

---

### Opcao C — Foco em simplicidade e acessibilidade

**Titulo:** `MD Connect`
**Subtitulo (Apple):** `Palavra e oracao para todos`
**Descricao curta (Google):** `Biblia com audio, devocional diario e oracao. Simples e gratuito.`

**Descricao completa:**

> Tecnologia a servico do Reino. O MD Connect foi criado para ser simples: botoes grandes, linguagem clara e audio em tudo.
>
> Ouca o devocional do dia. Leia a Biblia com explicacao verso a verso. Envie um pedido de oracao com um toque. Ouca a radio cristã.
>
> Nao precisa saber ler bem para usar — o app fala por voce. Ideal para todas as idades e niveis de familiaridade com tecnologia.
>
> Conecte-se a sua igreja, acompanhe avisos e eventos, e compartilhe versiculos no WhatsApp.
>
> 100% gratuito. Sem propaganda no meio do devocional. Seus dados sao seus.

---

## 6. Organizacao de Arquivos

Estrutura sugerida para armazenar assets no repositorio:

```
assets/
└── store/
    ├── icon/
    │   ├── icon-1024.png          (App Store)
    │   ├── icon-512.png           (Play Store + PWA)
    │   ├── icon-512-maskable.png  (PWA maskable)
    │   ├── icon-192.png           (PWA)
    │   ├── icon-180.png           (Apple Touch)
    │   ├── icon-144.png
    │   ├── icon-96.png
    │   ├── icon-72.png
    │   ├── icon-48.png
    │   └── icon-32.png            (Favicon)
    ├── splash/
    │   ├── android/               (por densidade)
    │   └── ios/                   (por dispositivo)
    ├── screenshots/
    │   ├── google-play/           (1080x1920)
    │   └── app-store/
    │       ├── 6.7/               (1290x2796)
    │       └── 6.5/               (1284x2778)
    └── feature-graphic.png        (1024x500)
```

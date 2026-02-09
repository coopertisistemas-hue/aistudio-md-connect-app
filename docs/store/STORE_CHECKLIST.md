# Checklist de Publicacao nas Stores — MD Connect App

> Ultima atualizacao: 2026-02-07
> Referencia: `docs/store/PRIVACY_POLICY.md`, `docs/store/TERMS_OF_USE.md`

---

## Legenda de Status

| Status | Significado |
|--------|-------------|
| `TODO` | Nao iniciado |
| `IN_PROGRESS` | Em andamento |
| `DONE` | Concluido e validado |

---

## 1. Apple App Store

### 1.1 App Privacy ("Nutrition Labels")

Preencher no App Store Connect > App Privacy. Cada categoria deve ser declarada com tipo de uso e vinculo ao usuario.

| Categoria Apple | Dados do MD Connect | Vinculado a identidade? | Usado para rastreamento? | Status |
|----------------|---------------------|------------------------|--------------------------|--------|
| **Contact Info — Email** | E-mail de cadastro | Sim (conta) | Nao | `TODO` |
| **Contact Info — Name** | Nome do perfil | Sim (conta) | Nao | `TODO` |
| **Contact Info — Phone** | Telefone/WhatsApp (opcional) | Sim (conta) | Nao | `TODO` |
| **Identifiers — User ID** | UUID da conta Supabase | Sim | Nao | `TODO` |
| **Identifiers — Device ID** | `anon_id` (UUID local) | Nao | Nao | `TODO` |
| **Usage Data — Product Interaction** | Paginas visitadas, cliques, reacoes | Nao | Nao | `TODO` |
| **Usage Data — Other Usage Data** | Eventos de analytics (GA4 + backend) | Nao | Nao | `TODO` |
| **Diagnostics — Crash Data** | Erros JS (mensagem, stack, rota) | Nao | Nao | `TODO` |
| **Diagnostics — Performance Data** | Nao coletado | — | — | `DONE` |
| **User Content** | Pedidos de oracao (texto) | Sim (conta) | Nao | `TODO` |
| **Location** | Nao coletado | — | — | `DONE` |
| **Contacts** | Nao coletado | — | — | `DONE` |
| **Health & Fitness** | Nao coletado | — | — | `DONE` |
| **Financial Info** | Nao coletado (doacoes externas) | — | — | `DONE` |
| **Sensitive Info** | Conteudo religioso (oracao) — declarar se exigido | — | — | `TODO` |
| **Purchases** | Nao ha compras in-app | — | — | `DONE` |

**Declaracoes adicionais:**

| Item | Resposta | Status |
|------|----------|--------|
| O app usa dados para rastreamento (App Tracking Transparency)? | Nao | `TODO` |
| O app coleta dados de menores de 13 anos? | Nao | `TODO` |
| O app tem politica de privacidade? | Sim (`/privacidade`) | `TODO` |

---

### 1.2 Screenshots

Formato: PNG ou JPG, sem alpha, sem cantos arredondados.

| Dispositivo | Resolucao | Orientacao | Qtd minima | Qtd maxima | Status |
|-------------|-----------|------------|------------|------------|--------|
| iPhone 6.7" (obrigatorio) | 1290 x 2796 | Retrato | 3 | 10 | `TODO` |
| iPhone 6.5" (obrigatorio) | 1284 x 2778 | Retrato | 3 | 10 | `TODO` |
| iPhone 5.5" (se suportado) | 1242 x 2208 | Retrato | 3 | 10 | `TODO` |
| iPad 12.9" (se suportado) | 2048 x 2732 | Retrato | 3 | 10 | `TODO` |

**Telas recomendadas para screenshots:**

| # | Tela | Descricao sugerida | Status |
|---|------|--------------------|--------|
| 1 | Home / Landing | Devocional do dia + tiles de navegacao | `TODO` |
| 2 | Biblia (BibleReader) | Leitura de capitulo com menu de versiculo | `TODO` |
| 3 | Devocional (DevotionalDetail) | Conteudo devocional com reacoes | `TODO` |
| 4 | Oracao (PrayerHub) | Feed de pedidos com "Estou orando" | `TODO` |
| 5 | Poster de Versiculo | Gerador de imagem com templates | `TODO` |
| 6 | Radio | Player de streaming | `TODO` |

---

### 1.3 Metadados

| Campo | Limite | Conteudo proposto | Status |
|-------|--------|-------------------|--------|
| Nome do app | 30 caracteres | `MD Connect` | `TODO` |
| Subtitulo | 30 caracteres | `Devocional, Biblia e Oracao` | `TODO` |
| Categoria primaria | — | Lifestyle ou Books & Reference | `TODO` |
| Categoria secundaria | — | Education (opcional) | `TODO` |
| Keywords | 100 caracteres | `devocional,biblia,oracao,igreja,cristao,evangelico,radio,versiculo,leitura,ipda` | `TODO` |
| Descricao | 4000 caracteres | Redigir texto completo em PT-BR | `TODO` |
| Texto promocional | 170 caracteres | Redigir frase de destaque | `TODO` |
| URL de privacidade | — | `https://mdconnect.app/privacidade` | `TODO` |
| URL de suporte | — | `https://mdconnect.app/ajuda` | `TODO` |
| URL de marketing | — | `https://mdconnect.app` | `TODO` |
| Copyright | — | `© 2026 MD Connect` | `TODO` |

---

### 1.4 Icone

| Item | Especificacao | Status |
|------|---------------|--------|
| Icone App Store | 1024 x 1024 PNG, sem alpha, sem cantos arredondados | `TODO` |
| Sem sobreposicao de badges | Apple nao permite badges ou overlays no icone | `TODO` |

---

### 1.5 Classificacao de Conteudo (Apple)

| Categoria | Frequencia | Observacao | Status |
|-----------|------------|-----------|--------|
| Cartoon or Fantasy Violence | Nenhuma | — | `TODO` |
| Realistic Violence | Nenhuma | — | `TODO` |
| Sexual Content or Nudity | Nenhuma | — | `TODO` |
| Profanity or Crude Humor | Nenhuma | — | `TODO` |
| Alcohol, Tobacco, or Drug Use | Nenhuma | — | `TODO` |
| Gambling | Nenhuma | — | `TODO` |
| Horror/Fear Themes | Nenhuma | — | `TODO` |
| Medical/Treatment Info | Nenhuma | Disclaimer no app: "nao e orientacao medica" | `TODO` |
| Unrestricted Web Access | Nenhuma | Links externos abrem no navegador | `TODO` |
| User Generated Content | Sim (pedidos de oracao) | Declarar moderacao | `TODO` |

**Classificacao esperada:** 4+ (compativel com todas as idades)

---

## 2. Google Play Store

### 2.1 Data Safety

Preencher no Google Play Console > App Content > Data Safety.

#### Coleta de dados

| Categoria Play | Tipo de dado | Coletado? | Compartilhado? | Opcional? | Status |
|---------------|-------------|-----------|----------------|-----------|--------|
| **Informacoes pessoais — Nome** | Nome do perfil | Sim | Nao | Nao | `TODO` |
| **Informacoes pessoais — E-mail** | E-mail de cadastro | Sim | Nao | Nao | `TODO` |
| **Informacoes pessoais — Telefone** | WhatsApp (pedido de oracao) | Sim | Nao | Sim | `TODO` |
| **Informacoes pessoais — Endereco** | Nao coletado | Nao | — | — | `DONE` |
| **Atividade no app — Visualizacoes de pagina** | Analytics de navegacao | Sim | Sim (GA4) | Nao | `TODO` |
| **Atividade no app — Historico de pesquisa** | Nao coletado | Nao | — | — | `DONE` |
| **Atividade no app — Outro conteudo gerado** | Pedidos de oracao | Sim | Nao | Sim | `TODO` |
| **Atividade no app — Interacoes no app** | Reacoes (amem, orando), cliques | Sim | Nao | Nao | `TODO` |
| **Identificadores — IDs do usuario** | UUID da conta | Sim | Nao | Nao | `TODO` |
| **Identificadores — IDs do dispositivo** | `anon_id` (UUID local) | Sim | Nao | Nao | `TODO` |
| **Diagnosticos — Registros de falha** | Erros JS (stack, rota) | Sim | Nao | Nao | `TODO` |
| **Diagnosticos — Diagnostico do app** | Nao coletado | Nao | — | — | `DONE` |
| **Localizacao** | Nao coletado | Nao | — | — | `DONE` |
| **Informacoes financeiras** | Nao coletado | Nao | — | — | `DONE` |
| **Saude e fitness** | Nao coletado | Nao | — | — | `DONE` |
| **Fotos e videos** | Nao coletado | Nao | — | — | `DONE` |
| **Audio** | Nao coletado | Nao | — | — | `DONE` |
| **Mensagens** | Nao coletado | Nao | — | — | `DONE` |
| **Contatos** | Nao coletado | Nao | — | — | `DONE` |
| **Calendario** | Nao coletado | Nao | — | — | `DONE` |
| **Arquivos e docs** | Nao coletado | Nao | — | — | `DONE` |

#### Perguntas adicionais

| Pergunta | Resposta | Status |
|----------|----------|--------|
| Os dados sao criptografados em transito? | Sim (HTTPS) | `TODO` |
| Os dados sao criptografados em repouso? | Sim (Supabase encryption at rest) | `TODO` |
| O usuario pode solicitar exclusao dos dados? | Sim (Perfil > Privacidade > Excluir conta) | `TODO` |
| O app foi revisado de acordo com a Politica de Familias do Google Play? | Nao se aplica (app nao e voltado para criancas) | `TODO` |
| URL da politica de privacidade | `https://mdconnect.app/privacidade` | `TODO` |

---

### 2.2 Screenshots e Feature Graphic

| Asset | Especificacao | Qtd | Status |
|-------|---------------|-----|--------|
| Feature Graphic | 1024 x 500 PNG ou JPG | 1 | `TODO` |
| Screenshots phone | 16:9 ou 9:16, min 320px, max 3840px | Min 2, max 8 | `TODO` |
| Screenshots tablet 7" (se suportado) | Min 320px, max 3840px | Min 1, max 8 | `TODO` |
| Screenshots tablet 10" (se suportado) | Min 320px, max 3840px | Min 1, max 8 | `TODO` |

**Telas recomendadas:** mesmas da Apple (secao 1.2).

---

### 2.3 Metadados

| Campo | Limite | Conteudo proposto | Status |
|-------|--------|-------------------|--------|
| Titulo do app | 30 caracteres | `MD Connect` | `TODO` |
| Descricao curta | 80 caracteres | `Devocional diario, Biblia, oracao e comunidade crista.` | `TODO` |
| Descricao completa | 4000 caracteres | Redigir texto completo em PT-BR | `TODO` |
| Categoria | — | Books & Reference ou Lifestyle | `TODO` |
| E-mail do desenvolvedor | — | contato@mdconnect.app | `TODO` |
| Site do desenvolvedor | — | https://mdconnect.app | `TODO` |
| URL da politica de privacidade | — | https://mdconnect.app/privacidade | `TODO` |
| Pais de distribuicao | — | Brasil (inicialmente) | `TODO` |
| Idioma padrao | — | Portugues (Brasil) | `TODO` |

---

### 2.4 Icone

| Item | Especificacao | Status |
|------|---------------|--------|
| Icone Play Store | 512 x 512 PNG, 32-bit, sem transparencia | `TODO` |
| Fundo solido | Google exige fundo opaco | `TODO` |

---

### 2.5 Classificacao de Conteudo (IARC)

Questionario a ser preenchido no Google Play Console > App Content > Content Rating.

| Pergunta | Resposta esperada | Status |
|----------|-------------------|--------|
| O app contem violencia? | Nao | `TODO` |
| O app contem linguagem vulgar? | Nao | `TODO` |
| O app contem conteudo sexual? | Nao | `TODO` |
| O app promove drogas, alcool ou tabaco? | Nao | `TODO` |
| O app contem jogos de azar? | Nao | `TODO` |
| O app permite conteudo gerado por usuarios? | Sim (pedidos de oracao) | `TODO` |
| O app possui moderacao de UGC? | Sim (moderacao pela lideranca) | `TODO` |
| O app coleta informacoes pessoais? | Sim (e-mail, nome) | `TODO` |
| O app permite compras? | Nao (doacoes externas ao app) | `TODO` |
| O app compartilha localizacao? | Nao | `TODO` |

**Classificacao esperada:** Livre (L) / Everyone (E)

---

### 2.6 TWA (Trusted Web Activity)

Requisitos especificos para publicar PWA como TWA na Play Store.

| Item | Descricao | Status |
|------|-----------|--------|
| Digital Asset Links | `/.well-known/assetlinks.json` servido no dominio | `TODO` |
| Manifest valido | `public/manifest.json` com todos os campos obrigatorios | `TODO` |
| Icone maskable | 512x512 com safe zone para Android Adaptive Icons | `TODO` |
| Bubblewrap configurado | Projeto Bubblewrap inicializado com appId e signing key | `TODO` |
| APK assinado | Build de release assinado para upload | `TODO` |
| Offline fallback | Pagina offline exibida quando sem conexao | `TODO` |
| Lighthouse PWA | Badge "installable" sem warnings | `TODO` |

---

## 3. Resumo de Progresso

| Store | Total de itens | DONE | IN_PROGRESS | TODO |
|-------|---------------|------|-------------|------|
| Apple App Store | 48 | 6 | 0 | 42 |
| Google Play Store | 53 | 11 | 0 | 42 |
| **Total** | **101** | **17** | **0** | **84** |

> Atualizar esta tabela conforme os itens forem concluidos.

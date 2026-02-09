# Auditoria de Consentimento e Rastreamento - MD Connect App

> Data da auditoria: 2026-02-07
> Escopo: Analytics, Error Reporting e Privacy Center

---

## 1. Analytics (Rastreamento)

### Implementação Atual: Google Analytics 4 (GA4)

**Localização do código:**
- `src/lib/analytics.ts` (serviço principal)
- `src/components/AnalyticsTracker.tsx` (inicialização e tracking de rotas)
- `src/App.tsx:94` (renderização do componente)

**Como funciona:**
- Biblioteca: Google Analytics 4 via `gtag.js`
- Injeção dinâmica do script no `<head>` do documento
- Page views automáticos em toda mudança de rota

**Variáveis de ambiente:**
```
VITE_GA_MEASUREMENT_ID=G-XXXXXXXXXX
VITE_ANALYTICS_ENABLED=true|false
```

**Eventos rastreados:**
| Evento | Descrição |
|--------|-----------|
| `page_view` | Visualização de página |
| `nav_click` | Clique em navegação |
| `cta_click` | Clique em call-to-action |
| `content_open` | Abertura de conteúdo |
| `feature_usage` | Uso de funcionalidade |
| `login_status` | Status de login |
| `click_partner` | Clique em parceiro |
| `view_partner` | Visualização de parceiro |
| `click_donate` | Clique em doação |
| `play_audio` | Reprodução de áudio |
| `share_devotional` | Compartilhamento de devocional |

**Arquivos com tracking implementado:**
- `src/pages/public/RadioPage.tsx`
- `src/pages/public/PartnersPage.tsx`
- `src/pages/public/DonatePage.tsx`
- `src/pages/Login.tsx`
- `src/pages/features/VersePosterPage.tsx`
- `src/components/home/MonetizationBlock.tsx`
- `src/components/home/ChurchPartnersBlock.tsx`
- `src/components/Devotional/DevotionalShareButton.tsx`
- `src/components/QuickActions.tsx`

**Backend Analytics:**
- Edge Function: `supabase/functions/track-event/index.ts`
- Tabela: `analytics_events`
- Rate limiting: 60 eventos/minuto por sessão
- Captura de UTM parameters para tracking de campanhas

---

## 2. Error Reporting (Relato de Erros)

### Implementação: Sistema Customizado (NÃO usa Sentry/Bugsnag)

**Localização do código:**
- `src/lib/errorReporter.ts` (serviço de report)
- `src/lib/identity.ts` (geração de IDs anônimos)
- `src/main.tsx:13-34` (handlers globais)
- `src/components/AppErrorBoundary.tsx` (React Error Boundary)
- `supabase/functions/report-client-error/index.ts` (Edge Function)

**Como funciona:**
- Sistema próprio desenvolvido internamente
- Relatos via `fetch` com `keepalive` ou `navigator.sendBeacon`
- Deduplicação baseada em fingerprint (60 segundos no cliente)
- Sanitização de PII (emails e telefones removidos antes do envio)

**Variável de ambiente:**
```
VITE_ERROR_REPORTING_ENABLED=true|false
```

**Características:**
- Rate limiting: 20 erros/minuto por sessão
- Deduplicação no backend: 10 minutos, incrementa contador `occurrences`
- Fails silently: nunca quebra a aplicação
- Identificação anônima via localStorage (ID de 24h)

**Captura de erros:**
1. Erros de janela (`window.onerror`)
2. Rejeições de Promise não tratadas (`unhandledrejection`)
3. Erros de renderização React (Error Boundary)

**Campos armazenados:**
- Mensagem, stack trace, rota, user agent
- Ambiente (dev/preview/prod)
- Versão do app
- Metadados adicionais (contexto)
- Fingerprint para deduplicação

---

## 3. Privacy Center (Central de Privacidade)

### Localização
- **Arquivo:** `src/pages/profile/PrivacyCenter.tsx`
- **Rota:** `/c/:slug/profile/privacy`

### Objetivo
Permitir que membros controlem a visibilidade de seus dados pessoais no diretório da igreja, em conformidade com a **LGPD** (Lei Geral de Proteção de Dados).

### Funcionalidades

#### 3.1 Banner Informativo LGPD
- Destaque visual azul explicando proteção de dados
- Texto: "Seus dados estão protegidos"
- Explica que dados sensíveis ficam ocultos por padrão

#### 3.2 Controles de Visibilidade
Quatro toggles controlam o que outros membros podem ver:

| Toggle | Chave | Descrição |
|--------|-------|-----------|
| Telefone / WhatsApp | `show_phone` | Exibir telefone no diretório |
| Endereço de E-mail | `show_email` | Exibir email no diretório |
| Data de Nascimento | `show_birth` | Exibir aniversário (dia/mês) |

*Nota: `show_address` existe no estado mas não está exposto na UI*

#### 3.3 Informações de Uso de Dados
Explicações fornecidas ao usuário:
1. Dados usados apenas para comunicação interna da igreja
2. Apenas pastores e administradores têm acesso completo
3. Exclusão de conta deve ser solicitada via secretaria

#### 3.4 Fluxo de Dados
```
1. Carrega configurações atuais do member.privacy_settings
2. Usuário altera toggles (estado local)
3. Clique em "Salvar alterações"
4. Atualiza tabela `members` campo `privacy_settings` (JSONB)
```

### O QUE ESTÁ FALTANDO

#### Ausências Críticas para LGPD:
1. **Banner de consentimento de cookies** - Não implementado
2. **Opt-out de analytics** - Usuários não podem desativar rastreamento
3. **Exportação de dados** - Não há botão "baixar meus dados"
4. **Exclusão automatizada de conta** - Processo manual via secretaria

#### Divergências de Implementação:
- Controle `show_address` existe no código mas não aparece na interface
- Apenas 3 dos 4 campos de privacidade são expostos ao usuário

---

## 4. Resumo de Status

| Sistema | Implementação | Status | LGPD Compliant |
|---------|---------------|--------|----------------|
| **Analytics (GA4)** | Google Analytics 4 | ✅ Ativo via env vars | ⚠️ Parcial - falta consentimento explícito |
| **Backend Analytics** | Supabase Edge Function | ✅ Ativo | ✅ Dados anônimos |
| **Error Reporting** | Sistema customizado | ✅ Opt-in via env var | ✅ Sanitiza PII |
| **Privacy Center** | Controles de visibilidade | ✅ Ativo | ✅ Para dados de diretório |
| **Cookie Consent** | Não implementado | ❌ Ausente | ❌ Não compliant |
| **Exportação de Dados** | Processo manual | ❌ Não automatizado | ⚠️ LGPD exige portabilidade |
| **Exclusão de Dados** | Contato secretaria | ⚠️ Manual | ⚠️ LGPD exige facilitação |

---

## 5. Recomendações

### Prioridade Alta:
1. **Implementar banner de consentimento de cookies** antes do primeiro tracking
2. **Adicionar toggle de opt-out de analytics** no Privacy Center
3. **Implementar exportação de dados do usuário** (direito à portabilidade LGPD)

### Prioridade Média:
4. **Expor controle `show_address`** na UI ou remover do código
5. **Adicionar botão de "Solicitar exclusão de conta"** com confirmação
6. **Documentar fluxo de exclusão de dados** para equipe da secretaria

### Prioridade Baixa:
7. Considerar alternativa ao GA4 (Plausible, Fathom) para maior privacidade
8. Implementar modo "sem rastreamento" para usuários que recusarem consentimento

---

## 6. Variáveis de Ambiente Requeridas

```bash
# Analytics
VITE_GA_MEASUREMENT_ID=G-XXXXXXXXXX
VITE_ANALYTICS_ENABLED=true

# Error Reporting
VITE_ERROR_REPORTING_ENABLED=true

# Backend
VITE_API_BASE_URL=https://sua-api.com
VITE_ENABLE_BACKEND_ANALYTICS=true
```

---

*Documento gerado automaticamente via auditoria de código.*

# Roadmap de Compatibilidade — Site Fullstack (Admin) x Public Shell (App Web Cliente)

## Objetivo
Garantir que o site fullstack (repo separado) seja compatível com o Public Shell (app web cliente),
consumindo os mesmos contratos (Edge Functions/BFF), mesmos modelos de dados (Supabase) e padrões de segurança/QA.

Este documento NÃO implementa o fullstack agora. Ele define premissas e backlog futuro.

---

## Escopo Atual (Fase 1 — Public Shell)
O app web cliente entrega:
- Home premium (Golden Master: hero/vídeo/primeira dobra intocáveis)
- Devocional V1
- Pedidos de oração V1
- (em andamento) Versículo para postar / DOE / Parceiros
- Sem autenticação na Fase 1 (público geral)

---

## Premissas Invioláveis (Compatibilidade)
1) **Contrato de Integração**: o client não acessa tabelas direto.
   - Regra: zero `supabase.from` no app web cliente.
   - Toda leitura/escrita passa por Edge Functions/BFF.

2) **Supabase como Fonte de Verdade**:
   - Conteúdos e pedidos devem residir no Supabase.
   - O fullstack admin só gerencia/visualiza via contratos (ou via service role controlado).

3) **Segurança por padrão**:
   - RLS e políticas definidas para proteger dados sensíveis (especialmente pedidos “apenas intercessores”).
   - Anti-spam e validações (rate limit, payload size, sanitização).

4) **Golden Master UX**:
   - Mudanças no app não podem “quebrar o espetáculo”.
   - Feature Flags para tudo novo.

5) **i18n preparado**:
   - UI preparada para PT/EN/ES; conteúdo pode evoluir gradualmente.

---

## Modelos de Dados (planejados no Supabase)
### Tabela: devotionals
- id (uuid/int)
- title
- content (markdown ou richtext)
- verse_reference (opcional)
- lang (pt/en/es)
- source_type (md_original | curated_link | licensed_partner)
- source_name / source_url (se curadoria)
- publish_date (date)
- status (draft | scheduled | published)
- created_at / updated_at

### Tabela: prayer_requests
- id (uuid)
- created_at
- request_type (oracao | visita | conselho)
- message
- is_anonymous (bool)
- intercessors_only (bool)
- contact_whatsapp_optin (bool)
- status (new | triaged | answered | archived)
- device_id (opcional, se houver “meus pedidos” sem login)
- metadata (jsonb opcional: ip_hash, user_agent, locale)

### Tabela: partners (monetização)
- id
- name
- logo_url
- link_url
- tier (basic | featured)
- is_active
- created_at / updated_at

---

## Contratos (Edge Functions / BFF)
### Devocionais
- GET /devotionals?lang=pt&status=published
- GET /devotionals/:id
- GET /devotionals/today?lang=pt

### Pedidos de oração
- POST /prayer-requests
- GET /prayer-requests/me (se usar device_id)
- (admin) GET /admin/prayer-requests?status=new
- (admin) PATCH /admin/prayer-requests/:id (triage/status)

### Parceiros / DOE
- GET /partners?active=true
- GET /donation-info (texto de transparência / links)
- POST /partner-leads (captura de interesse)

Obs: endpoints admin exigem autenticação e role.

---

## Autenticação e RBAC (somente no Fullstack)
- O fullstack terá login e controle de acesso.
- Roles mínimas:
  - md_admin (admin do projeto Momento Devocional)
  - md_editor (cria/edita devocionais)
  - md_moderator (triagem de pedidos)
- O app web cliente permanece público na Fase 1.

---

## Backlog do Fullstack (para executar depois)
### Fase FS-1 — Admin mínimo (compatível com o app)
- Login + RBAC (somente md_admin/md_editor/md_moderator)
- CRUD Devocionais (draft/scheduled/published)
- Moderação Pedidos de oração (triagem/status)
- Gestão de Parceiros (carrossel)
- Gestão do texto “DOE / Transparência”

### Fase FS-2 — Operação e escala
- Auditoria (logs de ações admin)
- Exportação/relatórios (devocionais publicadas, pedidos triados)
- Painel de métricas (eventos do app, cliques, conversões)

### Fase FS-3 — Conteúdo curado e parcerias
- Cadastro de fontes e links (curadoria)
- Fluxo de aprovação editorial
- Gestão de licenças/termos (quando houver parceiros)

---

## QA e Critérios de Aceite (para o Fullstack)
- Não expor dados “intercessors_only” publicamente
- Admins só veem o que têm permissão
- Endpoints admin exigem role
- Teste de regressão do app: contratos não podem quebrar rotas existentes
- Walkthrough/relatório por sprint no fullstack também

---

## Notas sobre Conteúdo de Terceiros (devocionais públicas)
- “Disponível no dia” não implica permissão de republicação.
- Caminho seguro: curadoria (link oficial + metadados) e/ou licença/parceria.
- Conteúdo original MD é o pilar principal.

---

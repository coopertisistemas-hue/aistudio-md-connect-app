# PRD — Módulo Pedidos de Oração (Fullstack Admin)
**Repo:** aistudio-ipda-connect-admin (em breve: aistudio-md-connect-admin)  
**Produto:** MD Connect — Admin/Operação (Fullstack)  
**Origem dos dados:** App público (MD Momento Devocional) — módulo "Pedidos de Oração"  
**Objetivo do módulo:** Triagem + intercessão + resposta + auditoria (cuidado pastoral com governança)

---

## 1) Escopo e visão
O app público permite:
- Criar pedido com **Categoria**, **Urgência**, **Privacidade** (Público | Somente Equipe | Anônimo)
- Exibir **Mural de Oração** (itens públicos/anônimos) para oração coletiva
- (Fase futura) permitir “Estou orando” / prova social e compartilhamento

O Fullstack Admin deve:
- Receber e operar pedidos do escopo **Projeto MD Momento Devocional** (público)
- Permitir que **Equipe do projeto** (pastores, obreiros, intercessores) atenda:
  - atribuição
  - status (novo → em intercessão → respondido → atendido)
  - notas internas
  - resposta ao solicitante (quando aplicável)
  - marcação “atendido” (com registro)
- Criar base reutilizável para futuramente suportar **Igrejas (multi-tenant)**

---

## 2) Princípios
- **Porta aberta no público**: envio sem login deve ser permitido (sem fricção)
- **Governança no admin**: rastreabilidade e permissão por role
- **Privacidade primeiro**: “Somente Equipe” nunca vaza; “Anônimo” nunca mostra identidade no mural
- **Premium UX**: fila operacional clara, escaneável, com filtros úteis
- **Sem impacto na Home** do app público (sempre)

---

## 3) Atores e roles (Admin)
- **super_admin**: tudo
- **admin_projeto**: gerencia equipe, fila, categorias, templates
- **pastor_lider**: pode responder e marcar como atendido
- **intercessor**: pode assumir e registrar oração/andamento
- **moderador**: pode ocultar/arquivar e atuar contra abuso

---

## 4) Modelagem (DB) — compatível com público hoje e multi-tenant amanhã
### 4.1 Tabela: prayer_requests
Campos:
- id (uuid pk)
- scope_type (text) — 'public_project' | 'church'  (hoje: public_project)
- scope_id (uuid null) — futuro: church_id / org_id
- created_by_user_id (uuid null) — pode ser null (envio público)
- tracking_token (text null) — opcional para acompanhar sem login (fase 2)
- category (text not null) — ex: familia, saude, direcao, gratidao, libertacao, finances, outros
- urgency (text not null) — 'normal' | 'urgente'
- privacy (text not null) — 'publico' | 'somente_equipe' | 'anonimo'
- body (text not null)
- status (text not null) — 'novo' | 'em_intercessao' | 'respondido' | 'atendido' | 'arquivado'
- assigned_to (uuid null) — auth.users.id (equipe)
- answered_at (timestamptz null)
- resolved_at (timestamptz null)
- created_at (timestamptz default now())
- updated_at (timestamptz default now())

Índices:
- (scope_type, scope_id, status, created_at desc)
- (status, urgency, created_at desc)
- (assigned_to, status)
- (created_by_user_id, created_at desc)

### 4.2 Tabela: prayer_updates
Para notas internas e respostas:
- id (uuid pk)
- request_id (uuid fk -> prayer_requests.id)
- created_by (uuid fk -> auth.users.id)
- visibility (text) — 'internal' | 'requester' | 'public_testimony'
- message (text not null)
- created_at (timestamptz default now())

Índices:
- (request_id, created_at desc)
- (visibility, created_at desc)

### 4.3 Tabela: prayer_reactions (prova social / mural)
- request_id (uuid fk)
- user_id (uuid fk)
- reaction_type (text default 'praying')
- created_at (timestamptz default now())
Unique:
- (request_id, user_id, reaction_type)

Índices:
- (request_id)
- (user_id, created_at desc)

### 4.4 Tabela: project_team_members
Equipe do projeto (escopo public_project):
- user_id (uuid pk)
- role (text)
- is_active (boolean default true)
- created_at (timestamptz default now())

---

## 5) RLS (alto nível)
### prayer_requests
- Público: inserir somente scope_type='public_project'
- Leitura pública: somente pedidos privacy in ('publico','anonimo') e status != 'arquivado' (se houver mural)
- Equipe: project_team_members.is_active = true pode ler tudo do scope public_project
- Ações (update): apenas equipe (ou admin) pode alterar status/assigned_to

### prayer_updates
- internal: só equipe
- requester: só solicitante (user_id) ou via tracking_token (fase 2)
- public_testimony: opcional mostrar no público

### prayer_reactions
- toggle apenas para users autenticados (evitar spam)
- leitura pública: contagem agregada (sem expor user_id)

---

## 6) RPCs recomendadas (para UI performática)
- get_prayer_queue(scope_type, scope_id, status, filters, page)
- assign_prayer_request(request_id, assignee_id)
- set_prayer_status(request_id, status)
- add_prayer_update(request_id, visibility, message)
- toggle_prayer_reaction(request_id)  -- "Estou orando"
- get_prayer_social(request_id)       -- counts + meu estado

---

## 7) Telas do Fullstack Admin
### 7.1 Fila (Queue)
Tabs:
- Novos
- Em intercessão
- Respondidos
- Atendidos
- Arquivados

Filtros:
- categoria, urgência, privacidade, atribuído, período

Card do pedido:
- chips: categoria + urgência + privacidade + status
- ações rápidas: assumir / atribuir / marcar atendido / abrir detalhe

### 7.2 Detalhe
- corpo do pedido
- timeline de updates
- adicionar nota interna
- enviar resposta (requester)
- marcar como atendido + registro curto (“Como Deus respondeu”)

### 7.3 Configurações
- categorias (lista/ordem)
- templates de resposta
- equipe (roles / ativação)

---

## 8) Fases de entrega
### Fase 1 (MVP Admin)
DB + RLS + RPCs + UI Fila + Detalhe + Atribuição + Status + Nota interna

### Fase 2 (Acompanhamento solicitante)
tracking_token + tela “Acompanhar pedido” no público

### Fase 3 (Mural + prova social)
“Estou orando” + contadores + filtros + moderação

### Fase 4 (multi-tenant igrejas)
scope_id obrigatório para churches + regras de org_id

---

## 9) QA checklist
- Pedido criado no público aparece como "novo" no admin
- Somente Equipe não aparece no mural
- Anônimo não mostra nome (nunca)
- Nota internal não vaza
- Status/atribuição auditável (updated_at)
- Paginação e filtros funcionam com índice (sem lentidão)

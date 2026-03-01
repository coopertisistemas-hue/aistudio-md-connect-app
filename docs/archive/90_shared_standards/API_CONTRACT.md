API_CONTRACT.md — MD Connect (App Web Cliente)
0) Objetivo

Este documento define o Contrato Oficial de API do App Web Cliente (PWA) do MD Connect, utilizando o padrão BFF via Supabase Edge Functions.

Regra de ouro

✅ O client NÃO acessa tabelas do Supabase diretamente.
✅ Nenhum supabase.from(...) no app web cliente.
✅ Toda leitura/escrita passa por Edge Functions.

1) Base URL, versionamento e headers
1.1 Base URL

Produção (exemplos):

https://ipda.mdconnect.app (client)

Edge Functions: https://<PROJECT_REF>.functions.supabase.co/<functionName>

Observação: o client deve chamar Edge Functions via supabase.functions.invoke("<functionName>") ou via fetch() direto na URL da function (com headers). Padronizar 1 forma.

1.2 Headers padrão

Público (sem login)

Content-Type: application/json

X-App: mdconnect-web

X-App-Denomination: ipda (quando aplicável)

Accept-Language: pt-BR (opcional)

Autenticado

Tudo acima + Authorization: Bearer <JWT>

2) Envelope padrão de resposta (obrigatório)

Todas as Edge Functions retornam:

{
  "ok": true,
  "data": {},
  "error": null,
  "meta": {
    "request_id": "uuid-ou-string",
    "ts": "2025-12-14T12:00:00Z"
  }
}

2.1 Erros padronizados
{
  "ok": false,
  "data": null,
  "error": {
    "code": "VALIDATION_ERROR | UNAUTHORIZED | FORBIDDEN | NOT_FOUND | RATE_LIMITED | INTERNAL_ERROR",
    "message": "Texto humano e objetivo",
    "details": { "field": "motivo" }
  },
  "meta": { "request_id": "...", "ts": "..." }
}

2.2 HTTP status

200 ok

400 validação

401 sem login / token inválido

403 sem permissão

404 não encontrado

429 rate limit

500 erro interno

3) Auth, contexto e permissões
3.1 auth/me é obrigatório

O client não confia em localStorage para igreja/perfil.

Fluxo:

Usuário loga via Supabase Auth.

Client chama auth/me.

A API retorna:

profile

church

organization/denomination

permissões calculadas

3.2 Estrutura de hierarquia IPDA (conceito)

O feed do autenticado deve respeitar prioridade:

sede → estadual → regional → setorial → local

Isso será aplicado no endpoint church/notices_list (e/ou church/priority_feed).

4) Paginação, filtros e cache
4.1 Paginação padrão

Preferir cursor ou offset. Padrão sugerido:

Request:

{ "limit": 20, "cursor": "opaque-string" }


Response:

{
  "items": [],
  "page": { "limit": 20, "next_cursor": "opaque-string-or-null" }
}

4.2 Cache (client)

Recomendado TanStack Query:

feed: 2–5 min

igreja/perfil: 30–60 min

eventos: 5–10 min

5) Convenção de nomes (Edge Functions)

Prefixos (obrigatórios):

public_* → sem login

auth_* → login

church_* → login + contexto de igreja

admin_* → permissões elevadas (fora do escopo do app público)

Exemplos:

public_feed

auth_me

church_notices_list

6) Mapa 1:1 — Services atuais → Edge Functions

Objetivo: migrar o app autenticado existente sem refazer UI.
Cada src/services/*.ts passa a chamar somente essas functions.

6.1 src/services/church.ts

Tabelas envolvidas: churches, church_service_times, organizations

Edge Functions

public_church_detail

public_churches_list

auth_me (retorna church do usuário)

church_profile (detalhes extras da igreja vinculada)

6.2 src/services/content.ts

Tabelas envolvidas: posts (type: devotional|news|notice), content_series, content_messages, study_materials, reading_plans, reading_plan_days, user_plan_progress

Edge Functions (MVP)

public_devotional_today (devocional do dia)

public_posts_list (news/devotional/notice públicos)

public_post_detail

church_posts_list (conteúdo para autenticado por igreja)

church_post_detail

Observação: “histórico de leitura” pode ser implementado com user_plan_progress (planos) e/ou uma tabela futura. No MVP, manter simples.

6.3 src/services/event.ts

Tabela: church_events

Edge Functions

public_events_list (se igreja permitir)

church_events_list (autenticado)

church_event_detail

6.4 src/services/feed.ts

Tabelas: posts, profiles (e regras por church_id)

Edge Functions

public_feed (curado e limitado)

church_feed (autenticado; inclui prioridade institucional)

6.5 src/services/monetization.ts

Tabelas: monetization_partners, monetization_services, monetization_tracking, transparency_contents

Edge Functions

public_ads_get

public_ads_track (rate limited + dedupe)

public_transparency_get

public_services_get

6.6 src/services/requests.ts (ou equivalente no app)

Tabela: pastoral_requests (inclui pedidos e pode servir para oração por categoria/tipo)

Edge Functions

church_pastoral_request_create

church_pastoral_requests_my_list

church_pastoral_request_detail

6.7 src/services/prayer.ts (ou equivalente)

Tabelas: pastoral_requests (request_type=“prayer”), prayer_interactions

Edge Functions

public_prayer_request_create (se permitido; caso contrário somente autenticado)

church_prayer_requests_list

church_prayer_interaction_toggle

7) Definição detalhada dos endpoints (MVP)
7.1 AUTH
auth_me (POST)

Auth: obrigatório
Objetivo: retornar perfil + contexto seguro (igreja/denominação) + permissões.

Request:

{ "include": ["profile", "church", "organization", "permissions"] }


Response (exemplo):

{
  "ok": true,
  "data": {
    "profile": {
      "id": "user-uuid",
      "name": "Fulano",
      "role": "Membro",
      "profile_type": "Membro",
      "church_id": "church-uuid"
    },
    "church": {
      "id": "church-uuid",
      "name": "IPDA Urubici",
      "slug": "ipda-urubici",
      "is_publicly_visible": true
    },
    "organization": {
      "id": "org-uuid",
      "name": "Igreja Pentecostal Deus é Amor",
      "slug": "ipda"
    },
    "permissions": {
      "can_view_church_content": true,
      "can_create_requests": true
    }
  },
  "error": null,
  "meta": { "request_id": "...", "ts": "..." }
}

7.2 IGREJAS (PÚBLICO)
public_churches_list (POST)

Auth: não
Objetivo: hub de igrejas

Request:

{
  "q": "urubici",
  "city": "Urubici",
  "limit": 20,
  "cursor": null,
  "filters": { "denomination": "ipda", "has_online_service": true }
}


Response:

{
  "ok": true,
  "data": {
    "items": [
      { "id": "uuid", "name": "IPDA Urubici", "slug": "ipda-urubici", "whatsapp_phone": "+55...", "is_publicly_visible": true }
    ],
    "page": { "limit": 20, "next_cursor": null }
  }
}

public_church_detail (POST)

Request:

{ "slug": "ipda-urubici" }


Response (inclui public_profile, horários e contatos):

{
  "ok": true,
  "data": {
    "church": {
      "id": "uuid",
      "name": "IPDA Urubici",
      "slug": "ipda-urubici",
      "public_profile": { "description": "...", "service_times": [] },
      "whatsapp_phone": "+55...",
      "is_publicly_visible": true
    }
  }
}

7.3 CONTEÚDO (POSTS)
public_devotional_today (POST)

Auth: não
Objetivo: devocional do dia (pode ser por denominação; fallback global)

Request:

{ "denomination": "ipda", "date": "2025-12-14" }


Response:

{
  "ok": true,
  "data": {
    "devotional": {
      "id": "uuid",
      "title": "Tema do dia",
      "subtitle": "2 linhas no máximo",
      "content_body": "texto...",
      "cover_image_url": "https://...",
      "published_at": "2025-12-14T00:00:00Z",
      "cta": { "type": "whatsapp", "label": "Enviar para alguém", "href": "https://wa.me/..." }
    }
  }
}

public_posts_list (POST)

Auth: não
Objetivo: lista curada (news/devotional/notice) para “Explorar” (não Home)

Request:

{ "type": "news", "limit": 20, "cursor": null, "denomination": "ipda" }

public_post_detail (POST)

Request:

{ "id": "uuid" }

7.4 AVISOS E PRIORIDADE INSTITUCIONAL
church_notices_list (POST)

Auth: obrigatório
Fonte: notices + pulpit_announcements + (opcional) posts type=notice
Objetivo: entregar avisos no padrão:
sede → estado → regional → setorial → local (quando modelado).

Request:

{ "limit": 30, "cursor": null, "includePinned": true }


Response:

{
  "ok": true,
  "data": {
    "items": [
      {
        "id": "uuid",
        "title": "Comunicado",
        "body": "...",
        "priority": "high",
        "origin": { "level": "local", "label": "Igreja Local" },
        "is_pinned": true,
        "start_date": "2025-12-14T00:00:00Z",
        "end_date": null
      }
    ],
    "page": { "limit": 30, "next_cursor": null }
  }
}

7.5 EVENTOS
church_events_list (POST)

Auth obrigatório.

Request:

{ "from": "2025-12-01", "to": "2026-01-31", "limit": 50 }


Response:

{
  "ok": true,
  "data": { "items": [ { "id": "uuid", "title": "Culto", "starts_at": "...", "location": "..." } ] }
}

7.6 SOLICITAÇÕES PASTORAIS / ORAÇÃO
church_pastoral_request_create (POST)

Tabela: pastoral_requests

Request:

{
  "request_type": "prayer",
  "category": "Saúde",
  "priority": "normal",
  "title": "Pedido de oração",
  "description": "texto...",
  "contact_phone": "+55...",
  "privacy": "leadership"
}


Response:

{ "ok": true, "data": { "id": "uuid", "status": "received" } }

church_pastoral_requests_my_list (POST)

Request:

{ "limit": 20, "cursor": null }

7.7 INTERAÇÕES DE ORAÇÃO
church_prayer_interaction_toggle (POST)

Tabela: prayer_interactions (FK em pastoral_requests.id)

Request:

{ "prayer_request_id": "uuid" }


Response:

{ "ok": true, "data": { "active": true, "count": 12 } }

7.8 MONETIZAÇÃO
public_ads_get (POST)

Tabela: monetization_partners

Request:

{ "placement": "home_bottom", "denomination": "ipda", "limit": 5 }

public_ads_track (POST)

Tabela: monetization_tracking
Regras: rate limit + dedupe.

Request:

{ "partner_id": "uuid", "event": "click", "context": { "placement": "home_bottom" } }

8) Definition of Done (DoD) — migração concluída

Um sprint de migração só é considerado pronto se:

✅ 0 ocorrências de supabase.from( no app cliente

✅ todas as queries agora passam por Edge

✅ CORS allowlist aplicado

✅ validação de input nas Edge

✅ testes E2E do fluxo principal

9) Prompt “padrão Antigravity” para implementar cada bloco
Você é o Antigravity trabalhando no MD Connect. Siga estritamente o documento:
docs/MD_CONNECT_APP_MASTER_PLAN.md e docs/API_CONTRACT.md

Regras:
- Nenhum `supabase.from` no client.
- Implementar as Edge Functions exatamente com o envelope padrão.
- Aplicar CORS allowlist e validação de input.
- Não criar tabelas novas sem solicitação explícita.

Tarefa:
[cole aqui o(s) endpoint(s) desta sprint]

Saída:
- Edge Functions criadas/alteradas
- arquivos do client alterados
- como validar (passos de QA)
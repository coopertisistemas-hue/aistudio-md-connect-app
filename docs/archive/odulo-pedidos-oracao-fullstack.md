PRD — Módulo de Pedidos de Oração (Fullstack Admin)

Produto: MD Connect Fullstack (Admin/Operação)
Consumidor: Projeto MD Momento Devocional (módulos públicos do app)
Futuro: Reaproveitável para “Igrejas clientes” (multi-tenant), com escopo por igreja

1) Objetivo do módulo

Centralizar e operacionalizar pedidos de oração recebidos pelo app público (e futuramente por igrejas), permitindo:

Triagem, atribuição, intercessão, resposta, marcação como atendido

Visão por filas, status, urgência, categoria

Governança de privacidade (anônimo / apenas intercessores / público)

Auditoria e métricas (prova social e impacto)

2) Princípios

Zero atrito no público: permitir envio sem login (opcional)

Controle e cuidado no admin: equipe com permissão e rastreabilidade

Teologia conservadora / linguagem respeitosa

Premium UX: escaneável, rápido, sem poluição visual

Sem mexer na Home do app público (sempre)

3) Atores e permissões
Roles (Admin Fullstack)

super_admin: tudo

admin_projeto: gerencia equipe, filas, configurações

pastor/lider: pode responder, marcar atendido, ver pedidos privados

intercessor: pode assumir/registrar oração, adicionar nota interna

moderador: pode ocultar, arquivar, bloquear abuso

Público (App)

anon: pode enviar (se permitido), pode ver mural público (se existir)

auth_user (quando houver): pode acompanhar pedidos próprios

4) Fluxos principais
4.1 Envio (App Público)

Usuário envia pedido (texto + categoria + opções):

is_anonymous

only_intercessors

urgency

Sistema cria pedido com status novo.

(Opcional) Oferta de acompanhamento:

“Quer acompanhar este pedido?”

Login / magic link / token de acompanhamento

4.2 Triagem (Fullstack)

Fila “Novos”

Admin/líder define:

categoria correta

urgência

atribuição (assignee)

encaminhamento (pastor/intercessão)

4.3 Intercessão e atendimento

Intercessor assume → status em_intercessao

Adiciona nota interna

Pastor/líder pode enviar resposta (se houver canal)

Ao final: atendido + (opcional) “testemunho/resultado” (curto e respeitoso)

5) Estrutura de dados (proposta pronta pra multi-escopo)

Mesmo usando hoje só “projeto público”, já modela para amanhã (igrejas).

5.1 Tabela prayer_requests

Campos essenciais:

id uuid pk

scope_type text (public_project | church)

scope_id uuid null (para igreja; null no público)

created_by_user_id uuid null (pode ser null no público)

tracking_token text null (para acompanhamento sem login)

title text null (opcional no público)

body text not null

category text (ex.: familia, saude, finances, libertacao, gratidao, direcao, etc.)

urgency text (normal | urgente)

privacy text (publico | somente_intercessores | anonimo)

status text (novo | em_intercessao | respondido | atendido | arquivado)

assigned_to uuid null (user_id no admin)

created_at timestamptz default now()

updated_at timestamptz default now()

resolved_at timestamptz null

Índices recomendados:

(scope_type, scope_id, status, created_at desc)

(status, urgency, created_at desc)

(assigned_to, status)

(created_by_user_id, created_at desc) (para “meus pedidos”)

5.2 Tabela prayer_updates (respostas e notas)

id uuid pk

request_id uuid fk -> prayer_requests.id

created_by uuid fk -> auth.users.id

visibility text (internal | requester | public_testimony)

message text not null

created_at timestamptz default now()

Índices:

(request_id, created_at desc)

(visibility, created_at desc)

5.3 Tabela prayer_reactions (prova social)

request_id uuid fk

user_id uuid fk

reaction_type text default 'praying'

created_at timestamptz default now()
Unique:

(request_id, user_id, reaction_type)

Índices:

(request_id)

(user_id, created_at desc)

5.4 Tabela project_team_members (equipe MD Momento Devocional)

user_id uuid pk

role text

is_active boolean default true

created_at timestamptz default now()

Alternativa: se vocês já têm tabela de equipe/perfis no fullstack, reaproveitar.

6) RLS (alto nível)

Regras:

Público:

pode inserir em prayer_requests apenas no scope_type='public_project' (se permitido)

leitura só de pedidos privacy='publico' (se existir mural)

Equipe:

membros project_team_members veem todos do escopo público, inclusive somente_intercessores

Igreja (futuro):

staff da igreja vê pedidos do scope_id dela (multi-tenant)

prayer_updates:

internal só equipe

requester só solicitante (user_id ou tracking_token)

public_testimony pode aparecer no público (opcional)

7) RPCs (pra UI ficar limpa e rápida)

assign_prayer_request(request_id, assignee_id)

set_prayer_status(request_id, status)

add_prayer_update(request_id, visibility, message)

toggle_prayer_reaction(request_id) (praying)

get_prayer_social(request_id) (count + meu estado)

get_prayer_queue(scope_type, scope_id, filters...) (lista paginada com contadores)

8) Telas (Fullstack Admin)
8.1 Lista / Fila

Tabs: Novos | Em intercessão | Respondidos | Atendidos | Arquivados

Filtros: urgência, categoria, privacidade, atribuído a, data

Card: resumo do pedido + chips + “Assumir” + “Marcar atendido”

Ações rápidas: atribuir, mudar status

8.2 Detalhe do pedido

Pedido (texto)

Metadados: privacidade, urgência, categoria, data, atribuído

Linha do tempo (updates)

Campo “Adicionar nota interna” e “Responder solicitante”

Botão “Marcar como atendido” (com mensagem opcional)

8.3 Configurações

Categorias (CRUD)

Regras de privacidade padrão

Templates de resposta (“Estamos orando…”, “Foi atendido…”)

Gestão da equipe (roles)

9) Integração com o App Público

App público continua simples:

enviar pedido

ver status (se tiver tracking ou login)

“Estou orando” no mural (se habilitado)

MVP recomendado agora:

enviar pedido + receber “confirmado”

equipe trata no fullstack

acompanhamento só via login/token depois (fase 2)

10) Plano de execução em fases (enxuto e realista)
Fase 1 — Fullstack Operacional (core)

DB + RLS + RPCs

Tela fila + detalhe + atribuição + status + nota interna

QA

Fase 2 — Acompanhamento do solicitante

tracking_token + página “Acompanhar pedido”

(Opcional) magic link

Fase 3 — Prova social e mural

“Estou orando” + contadores

Feed público apenas de pedidos publico

Fase 4 — Multi-tenant (igrejas)

scope_type/scope_id ativo para clientes

permissões por igreja

11) QA checklist

Pedido público chega no admin como novo

Equipe consegue atribuir e mudar status

Privado (“somente intercessores”) não aparece no público

Anônimo oculta identificação em qualquer card público

Notas internas não vazam

Toggle “Estou orando” não duplica (unique)

Performance: lista paginada < 300ms em ambiente normal
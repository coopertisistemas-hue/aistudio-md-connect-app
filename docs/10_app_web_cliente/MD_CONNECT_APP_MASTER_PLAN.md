MD Connect — App Web Cliente (PWA)
Master Plan + Roadmap por Sprints + QA por IA + Knowledge Base (Antigravity)

Domínios: mdconnect.app (hub geral) + ipda.mdconnect.app (primeira denominação) + futuros (ad., pib., ccb.).
Status: Documento diretor (SSOT) para execução e governança.

0) Resumo executivo
Decisões já tomadas

Não recomeçar do zero. Vamos arrumar o app autenticado existente e evoluir por camadas.

Segurança: Edge Functions Only (client NÃO acessa tabelas com supabase.from).

UX: Home devocional-first + botões grandes (estilo Portal Urubici) para simplicidade.

WhatsApp continua rei: o app organiza; o WhatsApp distribui.

Inclusão: Modo Simples + Áudio primeiro (sem constranger quem tem baixa alfabetização).

Rádio: inserir Rádio Deus é Amor com mini-player persistente.

Monetização ética: DOE + afiliados + publicidade curada + serviços (sem interromper devocional).

1) Visão, propósito e critérios de sucesso
1.1 Propósito

Construir um App Web Cliente (PWA) premium para o projeto MD – Momento Devocional e o ecossistema MD Connect, atendendo:

Público (sem login): Palavra + devocionais + louvor + rádio + hub de igrejas + conteúdos curados.

Autenticado: “Minha Igreja” com avisos, agenda, transmissões, oração, preferências e governança.

1.2 Objetivos de produto

Retenção por hábito: devocional diário (3–5 min) como CTA #1.

Baixa rejeição: simplicidade, foco e fluxo guiado.

Engajamento e prova social: compartilhamento fácil (WhatsApp/Status), deep links e cards.

Escala institucional (IPDA-ready): preparado para a hierarquia Sede → Estadual → Regional → Setorial → Local.

Sustentabilidade: monetização com reverência e transparência.

1.3 KPIs (prova social + gestão)

WAU/MAU + retenção D7/D30

% conclusão “Devocional do Dia”

Compartilhamentos (WhatsApp/link)

Pedidos de oração: enviados / atendidos / moderados

Cliques “Rota para igreja”, “Agenda”, “Culto online”, “Ouvir rádio”

Monetização: impressões/cliques (parceiros), DOE, conversões afiliadas

2) Princípios obrigatórios (não negociáveis)
2.1 Segurança: Edge Functions Only

✅ Client não pode usar supabase.from('tabela').

✅ Toda leitura/escrita passa por Supabase Edge Functions (BFF).

✅ RLS continua ativo (defesa em profundidade).

✅ service_role nunca vai para o client (somente no ambiente seguro da function, se necessário).

2.2 Governança e prioridade institucional

Para membro autenticado, a ordem de prioridade de conteúdo/comunicados é:

Sede (oficial)

Estadual / Regional / Setorial (conforme vínculo)

Igreja local

Conteúdo geral MD (devocionais, séries)

2.3 UX anti-cansaço (“anti-YouVersion”)

Home não vira portal.

1 CTA principal (Devocional do Dia) + no máximo 2 secundários acima da dobra.

Portal/Blog/Notícias: ficam em Explorar (rota separada).

2.4 Inclusão

App deve funcionar sem ler: botões grandes, áudio, fluxo guiado e “Modo Simples”.

3) Arquitetura (alto nível)
3.1 Componentes

App Web Cliente: React/Vite (base existente), mobile-first, PWA, i18n UI.

Edge Functions (BFF): endpoints públicos e autenticados.

Supabase: DB + RLS + RPCs para permissões.

Observabilidade: logs, métricas e eventos (analytics).

3.2 Domínios / subdomínios

mdconnect.app → hub geral

ipda.mdconnect.app → skin IPDA (PWA, branding, curadoria)

CORS allowlist por domínio autorizado.

3.3 Contexto seguro

Contexto “igreja do usuário” vem de auth/me (Edge).

Nada de “confiar” em localStorage para church_id.

4) Design System (visual premium + jovem + acolhedor)

Meta: moderno, humano, leve, com hierarquia clara e “toque fácil”.

4.1 Paleta (base recomendada)

Neutros (light-first recomendado para inclusão):

Background: #F7F8FA

Surface: #FFFFFF

Text primary: #111827

Text secondary: #6B7280

Border: #E5E7EB

Acentos MD Connect:

Primary: #0F2C56 (confiança)

Accent/CTA: #FFC857 (calor/energia)

Success: #2BB673

Skin IPDA:

Mantém base e substitui Accent pela cor institucional IPDA (quando definida).

4.2 Tipografia

Títulos: Montserrat (600–700)

Texto: Inter (400–500)

Tamanhos: 14 / 16 / 18 / 22 / 28

Acessibilidade: toggle “fonte grande”.

4.3 Componentes obrigatórios

DevotionalHeroCard (CTA #1)

ButtonTile (botões grandes: ícone + título + 2 linhas)

MiniPlayer (Rádio/Louvor persistente)

NoticeCard, EventCard

ShareCard (1080x1920, agenda p/ Status)

AccessibilityControls (fonte/contraste/modo simples)

4.4 Navegação

Bottom Nav:

Início

Bíblia

Devocional

Rádio/Louvor

Igreja / Entrar

5) IA de produto: Informação e fluxos
5.1 Público (sem login)

Home (devocional-first):

Devocional do Dia (3–5 min)

Tiles: Bíblia | Rádio | Louvor | Encontre uma Igreja

“Hoje no MD” (máx 3 cards)

Parceiros do Reino (discreto)

Explorar (portal controlado):

Séries/Storybooks

Artigos/Blog curados

Materiais de estudo

Transparência/DOE

Hub de Igrejas:

lista + mapa + filtros

detalhe com horários, contatos, rota e transmissão

Oração:

Enviar pedido (texto/voz, privado/público)

Ver pedidos públicos aprovados (se habilitado)

5.2 Autenticado (Minha Igreja)

Avisos (prioridade institucional + local)

Agenda / eventos

Culto online (links oficiais)

Pedidos de oração (meus / minha igreja, conforme permissão)

Preferências (LGPD / comunicação / WhatsApp)

6) WhatsApp: elevar sem competir
6.1 MVP (já no início)

“Enviar no WhatsApp” em: devocional, versículo, aviso, agenda

“Gerar card para Status” (agenda da semana)

6.2 Fase 2 (opt-in)

preferências: frequência / horário / tipo

opt-out simples e visível

7) Rádio Deus é Amor

Página Rádio + mini-player persistente

Stream configurável

modo baixo consumo

8) Inclusão (baixa alfabetização)
8.1 Modo Simples (MVP)

Quatro ações:

Ouvir Devocional

Ouvir Rádio

Pedir Oração por voz

Minha Igreja (agenda/rota)

8.2 Áudio primeiro

Devocional com “Ouvir agora”

Versículo falado

Oração por voz (gravar) + transcrição opcional (sem obrigar)

9) Monetização ética

DOE + transparência

Afiliados curados (rotular)

Publicidade curada “Parceiros do Reino”

Serviços de tecnologia (B2B)

Regras:

nada de anúncio no meio do devocional

sem pop-up, sem interstitial agressivo

tracking por evento (sem perfil comportamental pesado)

10) API e Edge Functions (contrato padrão)
10.1 Convenções

public/* (sem login)

auth/* (login)

church/* (login + contexto)

admin/* (permissão elevada)

10.2 Envelope padrão
{ "ok": true, "data": {}, "error": null, "meta": { "request_id": "...", "ts": "..." } }

10.3 CORS allowlist

https://mdconnect.app

https://ipda.mdconnect.app

10.4 Endpoints MVP (mínimos)

Público

public/devotional_today

public/feed (limitado)

public/bible_passage

public/bible_search

public/radio_stream

public/worship_playlists

public/churches_list

public/church_detail

public/prayer_request_create (rate limit)

public/prayer_requests_public

public/ads_get

public/ads_track

public/services_get

public/transparency_get

Autenticado

auth/me

auth/preferences_get

auth/preferences_set

church/notices_list

church/events_list

church/profile

church/prayer_requests_my

church/prayer_interaction_toggle

10.5 Rate-limit (mínimo)

Oração: 1 pedido / X minutos por IP/usuário

Ads tracking: dedupe por janela de tempo

11) Roadmap por fases e sprints (com QA por IA)

Regra-mãe: sem feature nova antes de eliminar supabase.from do client.

Fase 0 — Alinhamento

Sprint 0.1 — Baseline + contrato

Consolidar este documento no repo

Inventariar rotas e serviços atuais

Definir Home devocional-first + tiles grandes

QA por IA

validar escopo MVP vs fase 2

validar consistência de nomenclatura e fluxo

Fase 1 — P0 Segurança: Edge Functions Only

Sprint 1.1 — Template Edge + CORS + logs

Template padrão: valida input, valida JWT, resolve contexto, logs, erros

CORS allowlist configurado

Política de secrets e envs

QA por IA

security review do template

requests fora do domínio devem falhar

Sprint 1.2 — Migrar serviços críticos

criar functions espelho dos src/services/*

refatorar app: trocar por functions.invoke / fetch

remover totalmente supabase.from( do client

QA por IA

scan repo: zero ocorrências de supabase.from(

E2E: login → home → notices → events → profile

Sprint 1.3 — Cache + hardening

TanStack Query/SWR

paginação (feed/search)

limites de payload

QA por IA

Lighthouse mobile 85+

IA identifica gargalos e telas pesadas

Fase 2 — Núcleo público (retenção + aquisição)

Sprint 2.1 — Home pública + PWA + i18n UI

Home devocional-first

manifest/ícones

PT/EN/ES (UI)

QA por IA

heurística: 1 CTA dominante

PWA install/offline básico

Sprint 2.2 — Hub de igrejas (mapa + detalhe)

listagem e detalhe por Edge

CTA rota/WhatsApp

QA por IA

valida só igrejas públicas

filtros e paginação

Sprint 2.3 — Bíblia + busca + versículo falado

leitura

busca com paginação

acessibilidade

QA por IA

referências válidas/invalid

fonte grande/contraste

Sprint 2.4 — Rádio + mini-player

player persistente

fallback de stream

QA por IA

play/pause e navegação sem travar

Fase 3 — Inclusão + oração (governado)

Sprint 3.1 — Modo Simples + oração por voz

fluxo “sem ler”

gravação de áudio

QA por IA

teste de uso por pessoa com baixa alfabetização

anti-spam

Sprint 3.2 — Oração público/autenticado + moderação

público só aprovado

privado protegido

rate limit

QA por IA

privacidade: pedido privado nunca vaza

Fase 4 — IPDA (skin + prioridade institucional)

Sprint 4.1 — ipda.mdconnect.app (branding/PWA)

tokens/manifest/ícones IPDA

conteúdos/links oficiais

QA por IA

consistência visual + CORS

Sprint 4.2 — Feed por prioridade institucional

sede → estado → regional → setorial → local

selos “oficial”

QA por IA

clareza + regras de permissão

Fase 5 — Distribuição (WhatsApp)

Sprint 5.1 — Compartilhar + card para Status

share + export imagem

QA por IA

preview social + deep link

Sprint 5.2 — Opt-in WhatsApp

preferências + opt-out

QA por IA

consentimento LGPD claro

Fase 6 — Monetização completa

Sprint 6.1 — Parceiros/Afiliados/DOE + transparência

ads_get/ads_track

página transparência/DOE

QA por IA

sem intrusão no devocional

Fase 7 — Observabilidade e escala

Sprint 7.1 — métricas + alertas + performance final

dashboard executivo

alertas de erro/latência

Lighthouse 90+

QA por IA

regressão total E2E

12) QA por IA — Playbook padrão
Pacote mínimo por sprint

link do preview

lista de Edge Functions alteradas

logs e latência

prints/vídeo curto do fluxo

Prompt padrão (copiar/colar)
Você é um auditor sênior (UX + Segurança + Performance). Avalie o sprint entregue do App Web Cliente MD Connect.

Entradas:
- Link do preview:
- Lista de Edge Functions:
- Logs principais:
- Prints/vídeo dos fluxos:

Tarefas:
1) Regressão: o que quebrou vs sprint anterior?
2) Segurança: client sem acesso direto ao DB? CORS allowlist? validação input? rate limit?
3) Dados: endpoints retornam apenas o necessário? paginação? tratamento de erro?
4) UX Mobile: 1 CTA principal na Home? fricções? excesso de opções? clareza?
5) Performance: carregamento, caching, Lighthouse (se houver).
6) LGPD: consentimentos, links de políticas, preferências.

Saída:
- Status DoD: APROVADO ou REPROVADO
- Lista P0/P1/P2 de ajustes
- Recomendações objetivas

13) Knowledge Base (para Antigravity não se perder)
Estrutura do repositório (docs)

docs/MD_CONNECT_APP_MASTER_PLAN.md (este documento)

docs/EDGE_FUNCTIONS_GUIDE.md (template, CORS, rate limit, padrões)

docs/API_CONTRACT.md (endpoints com exemplos)

docs/DESIGN_SYSTEM.md (tokens, componentes, padrões)

docs/QA_PLAYBOOK.md (checklists, prompts, testes)

docs/CONTENT_GOVERNANCE.md (hierarquia IPDA, fluxo editorial)

Regras de ouro (colocar no topo do README)

✅ Client nunca usa supabase.from

✅ Tudo via Edge Functions

✅ Home devocional-first

✅ Portal/Blog em Explorar

✅ Modo Simples + Rádio + WhatsApp são pilares

✅ Monetização não interrompe devocional

Prompt-base pro Antigravity (para cada sprint)
Você é o Antigravity trabalhando no projeto MD Connect (App Web Cliente). Siga estritamente:
docs/MD_CONNECT_APP_MASTER_PLAN.md

Regras obrigatórias:
- Nenhum acesso direto ao Supabase DB pelo client. Todos os dados via Supabase Edge Functions.
- CORS allowlist: mdconnect.app e ipda.mdconnect.app
- Respeitar design system (botões grandes + devocional-first)
- Implementar exatamente o escopo do sprint (não expandir)

Tarefa do sprint:
[COLE AQUI O ESCOPO]

Saída:
- Lista de arquivos alterados
- Lista de Edge Functions criadas/alteradas
- Como validar (passos de QA)

14) Próximos passos imediatos (ação)

Criar /docs no repo do app cliente e salvar este arquivo como MD_CONNECT_APP_MASTER_PLAN.md.

Criar API_CONTRACT.md e listar os endpoints que vocês já têm (e os novos).

Iniciar Sprint 1.1 (template Edge + CORS + logs).

Executar Sprint 1.2 (migrar serviços e zerar supabase.from no client).

Só então: público + IPDA skin + rádio + modo simples.

Fechamento

Este documento é o “contrato” do projeto. Qualquer feature fora disso vira mudança formal (change request).
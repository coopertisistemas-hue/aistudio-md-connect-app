# Índice de Documentação

Este arquivo indexa a documentação do projeto `md-connect-app` para facilitar a navegação e o entendimento das regras vigentes.

## 🏛️ SSOT e Governança
Documentos que definem a verdade única para a Fase 1 do App Web Cliente.

- [MD_CONNECT_APP_MASTER_PLAN.md](10_app_web_cliente/MD_CONNECT_APP_MASTER_PLAN.md) — **SSOT Produto (App)**. A "Bíblia" do App Cliente.
- [ROADMAP_FASE1.md](ROADMAP_FASE1.md) — **SSOT Execução Fase 1**. Plano tático e entregas.
- [QA_CHECKLIST_FASE1.md](QA_CHECKLIST_FASE1.md) — **Gate de Qualidade**. Checklist obrigatório para PRs.
- [API_CONTRACT.md](90_shared_standards/API_CONTRACT.md) — **Contrato de Integração**. Zero `supabase.from` no client.

---

## Sumário por Pastas

### 📁 10_app_web_cliente
Documentação específica do App Web Cliente (PWA), focado no membro.
- [MD_CONNECT_APP_MASTER_PLAN.md](10_app_web_cliente/MD_CONNECT_APP_MASTER_PLAN.md) — Documento diretor (SSOT). `FASE1` `OBRIGATÓRIO`
- [member_app_audit_report.md](10_app_web_cliente/member_app_audit_report.md) — Relatório de auditoria do App do Membro. `QA`
- [PUBLIC_PAGES_CONTENT.md](10_app_web_cliente/PUBLIC_PAGES_CONTENT.md) — Definição de conteúdo para páginas públicas. `PADRÃO`

### 📁 20_fullstack_site
Documentação do Site Fullstack (Admin + Landing).
- [DOCUMENTATION.md](20_fullstack_site/DOCUMENTATION.md) — Documentação técnica fullstack. `REFERÊNCIA` `CONTEXTO`
- [MD_LANDING_OVERVIEW.md](20_fullstack_site/MD_LANDING_OVERVIEW.md) — Visão geral da Landing Page (Fase 0). `FASE1`

### 📁 90_shared_standards
Padrões transversais, contratos de API e regras globais.
- [AI_RULES.md](90_shared_standards/AI_RULES.md) — Tech stack, regras de IA e convenções de código. `PADRÃO` `OBRIGATÓRIO`
- [API_CONTRACT.md](90_shared_standards/API_CONTRACT.md) — Contrato oficial de API (BFF/Edge Functions). `API` `OBRIGATÓRIO`
- [QUALITY_GUIDELINES.md](90_shared_standards/QUALITY_GUIDELINES.md) — Pilares de excelência, UX e alinhamento espiritual. `PADRÃO` `OBRIGATÓRIO`
- [RLS_PROFILES.md](90_shared_standards/RLS_PROFILES.md) — Solução para recursividade em Policies RLS. `SEGURANÇA`
- [qa_plan_communications_engagement.md](90_shared_standards/qa_plan_communications_engagement.md) — Plano de QA para módulo de Comunicação (Sprint 11). `QA`
- [security_and_api_report.md](90_shared_standards/security_and_api_report.md) — Relatório de superfície de API e Segurança. `SEGURANÇA`

### 📁 00_inbox_legacy
Planos de implementação antigos ou de sprints específicas (referência histórica).
- [IMPLEMENTATION_PLAN.md](00_inbox_legacy/IMPLEMENTATION_PLAN.md) — Plano Mestre original do Sistema de Igrejas (Base). `LEGADO`
- [sprint-3-finance-events-plan.md](00_inbox_legacy/sprint-3-finance-events-plan.md) — Planejamento Sprint 3 (Finanças/Eventos). `LEGADO`
- [implementation_plan_finance_consolidation.md](00_inbox_legacy/implementation_plan_finance_consolidation.md) — Planejamento Sprint 9 (Consolidação Financeira). `LEGADO`
- [implementation_plan_services_ministries_pulpit.md](00_inbox_legacy/implementation_plan_services_ministries_pulpit.md) — Planejamento Sprint 10 (Liturgia). `LEGADO`
- [implementation_plan_communications_engagement.md](00_inbox_legacy/implementation_plan_communications_engagement.md) — Planejamento Sprint 11 (Comunicação). `LEGADO`
- [implementation_plan_transparency_council.md](00_inbox_legacy/implementation_plan_transparency_council.md) — Planejamento Sprint 12 (Transparência). `LEGADO`
- [implementation_plan_governance_council.md](00_inbox_legacy/implementation_plan_governance_council.md) — Planejamento Sprint 12.5 (Governança). `LEGADO`
- [ux_flow_transparency_council.md](00_inbox_legacy/ux_flow_transparency_council.md) — Fluxo de UX para Transparência. `LEGADO`

### Documentação de Governança (Sprint 0)
- [ROADMAP_FASE1.md](ROADMAP_FASE1.md) — Roadmap, Fases e Definition of Done da Fase 1. `GOVERNANÇA` `OBRIGATÓRIO`
- [QA_CHECKLIST_FASE1.md](QA_CHECKLIST_FASE1.md) — Checklist objetivo de QA para aprovação de PRs. `GOVERNANÇA` `QA`

---

## 🚨 Fase 1 — Obrigatórios (Governança Atual)

Estes são os documentos vivos que devem ser seguidos risca nesta fase do projeto.

1. **[ROADMAP_FASE1.md](ROADMAP_FASE1.md)** - O plano tático de execução e entregas.
2. **[QA_CHECKLIST_FASE1.md](QA_CHECKLIST_FASE1.md)** - O critério de aceite para qualidade.
3. **[MD_CONNECT_APP_MASTER_PLAN.md](10_app_web_cliente/MD_CONNECT_APP_MASTER_PLAN.md)** - A "Bíblia" do App Cliente. Define o que está sendo construído agora.
4. **[API_CONTRACT.md](90_shared_standards/API_CONTRACT.md)** - Regras de comunicação Client <-> Server. OBRIGATÓRIO: Zero `supabase.from` no client.
5. **[AI_RULES.md](90_shared_standards/AI_RULES.md)** - Regras técnicas para o agente de IA e devs.
6. **[QUALITY_GUIDELINES.md](90_shared_standards/QUALITY_GUIDELINES.md)** - Padrão de qualidade, UX e tom de voz.
7. **[security_and_api_report.md](90_shared_standards/security_and_api_report.md)** - Baseline de segurança.

---

## 📊 Consolidação e Duplicidades

Observações para limpeza futura:

- **Sprints Legados**: Os arquivos em `00_inbox_legacy` detalham sprints específicas (3, 9, 10, 11, 12). Parte desse conteúdo já foi implementado ou evoluiu. Sugestão: Manter como arquivo histórico, mas ignorar para novas implementações a menos que seja para recuperar contexto.
- **Master Plans**: `00_inbox_legacy/IMPLEMENTATION_PLAN.md` é o plano pai, mas para o App Cliente, o `10_app_web_cliente/MD_CONNECT_APP_MASTER_PLAN.md` é a autoridade atual.


# IMPLEMENTATION_PLAN – Sistema de Igrejas / IPDA Connect

## 0. Contexto Geral

Este documento define o plano de implementação do **Sistema de Igrejas** voltado inicialmente à realidade da **Igreja Pentecostal Deus é Amor** (estrutura mundial) e aplicável a outras denominações.

Arquitetura geral:

- **Backend & Banco**: Supabase (Postgres + Edge Functions + Auth + RLS).
- **Painel Admin / Site Fullstack**: Projeto A (Antigravity + Supabase) – gestão operacional, eclesiástica, financeira, marketing e integrações (GMN).
- **App Web Cliente (App do Membro)**: Projeto B (frontend separado) – experiência do membro, consumo de dados e interação com a igreja.
- **Escopo de escala**: de igrejas com 5 membros até 1000+ membros por unidade, com visão hierárquica mundial (Sede → Estaduais → Regionais → Setoriais → Locais).

Princípios:

- **Segurança e LGPD primeiro** (dados de membros são extremamente sensíveis).
- **Multi-igreja e multi-país desde o início** (Deus é Amor é mundial).
- **Entrega incremental por fases e sprints**, sempre com valor utilizável ao final de cada fase.
- **App do Membro desacoplado** do painel admin, porém compartilhando a mesma base (multi-projetos, mesmo backend).

---

## 0. Fase 0 – Landing Page Momento Devocional (MD)

### Objetivo

Criar uma **Landing Page oficial do projeto MD – Momento Devocional**, integrada a este mesmo projeto (site fullstack), com foco em:

- Apresentar a visão espiritual e prática do Momento Devocional (Reino, Palavra, Igreja).
- Explicar que o sistema de Igrejas e o App do Membro fazem parte do ecossistema MD.
- Oferecer um canal de **DOE / contribuição voluntária** para:
  - Custear despesas de software, infraestrutura e desenvolvimento.
  - Apoiar projetos sociais vinculados ao MD.
  - Sustentar o trabalho do idealizador (Alexandre) e da equipe.

A landing será parte deste projeto (Painel + Site), mas com **rota própria** (ex.: `/momento-devocional` ou similar) e, futuramente, poderá ter domínio dedicado.

### Escopo da Fase 0

#### Sprint 0.1 – Estrutura e Conteúdo da Landing

- Criar rota/página pública para o Momento Devocional:
  - Hero Section:
    - Título forte (ex.: “Momento Devocional – Tecnologia a serviço da Igreja de Cristo”).
    - Subtítulo explicando o propósito (devocionais, sistema de igrejas, app do membro, apoio à Obra).
    - CTA principal: **DOE / Apoie o Projeto**.
  - Seções sugeridas:
    - Sobre o Momento Devocional:
      - Propósito espiritual (Reino, Palavra, discipulado).
      - Como o MD se conecta com o Sistema de Igrejas e o App do Membro.
    - Benefícios para a Igreja:
      - Organização pastoral, membros, finanças, comunicação.
    - Benefícios para o Corpo de Cristo:
      - Conteúdo devocional, Bíblia online, pedidos de oração, integração.
    - Propósito das doações:
      - Manutenção de software e infraestrutura.
      - Projetos sociais e ações em prol da Obra.
      - Sustento do time envolvido.
    - Transparência e compromisso:
      - Explicar que relatórios de uso dos recursos serão disponibilizados gradualmente.

- Layout:
  - Responsivo, leve e com foco em conversão (DOE / Contato).
  - Utilizar o design system do projeto (tipografia, cores e componentes já adotados).

#### Sprint 0.2 – Fluxo de DOE / Contribuição

- Modelar uma estrutura **separada** das finanças das igrejas:
  - Tabela específica (ex.: `md_donations`), independente das tabelas financeiras das igrejas.
  - Campos mínimos:
    - `id`
    - `amount`
    - `currency`
    - `donor_name` (opcional)
    - `donor_email` (opcional)
    - `donor_church` (texto livre, opcional)
    - `purpose` (ex.: “software”, “projetos sociais”, “equipe” – pode ser agrupado)
    - `created_at`
    - status de pagamento (pago, pendente, cancelado).

- Integração com gateway de pagamento (a definir – ex.: Stripe, Mercado Pago, etc.):
  - Fluxo de DOE simples:
    - Valor sugerido ou valor livre.
    - Opção de recorrência (opcional para V1, pode ficar planejada).
  - Página de sucesso:
    - Mensagem de agradecimento.
    - Explicar brevemente o impacto das doações.

- LGPD:
  - Se for coletado nome/e-mail do doador:
    - Exibir aviso de consentimento para uso desses dados:
      - Para envio de agradecimento e comunicações relacionadas ao projeto MD.
    - Permitir DOE anônimo (sem identificação).

#### Sprint 0.3 – Analytics, SEO & Integração com Futuro App do Membro

- Configurar analytics na landing:
  - Eventos principais:
    - Visualização da landing.
    - Cliques nos CTAs de DOE.
    - DOE iniciado / DOE concluído.
- SEO básico:
  - Title, description, tags, Open Graph.
  - Texto otimizado para termos como:
    - “momento devocional”, “devocional online”, “sistema para igrejas”, “aplicativo para igrejas”, etc.
- Preparar pontos de integração futura:
  - Link da landing dentro do App do Membro:
    - “Conheça o Momento Devocional”.
    - “Apoie este projeto”.
  - Possibilidade futura de exibir um resumo:
    - Número de igrejas atendidas.
    - Número de países.
    - Destaques de ações sociais apoiadas (quando existirem).

### Observações Importantes da Fase 0

- As doações geradas pela Landing do Momento Devocional **não são contabilizadas como finanças de uma igreja específica**:
  - São receitas do projeto/ plataforma MD em si.
  - Devem ficar separadas das tabelas de finanças das igrejas (dízimos, ofertas, projetos internos).
- A Fase 0 não substitui as Fases 4 e 6:
  - Fase 4 continua focada nas finanças das igrejas.
  - Fase 6 continua focada no App do Membro.
- Fase 0 pode ser implementada em paralelo ao início da Fase 1, desde que não quebre a arquitetura.

## 1. Visão Macro das Fases

1. **Fase 1 – Fundação Sólida (Core, Auth, Segurança & Multi-Igreja)**  
   Foco: modelagem de dados, autenticação, RBAC, LGPD base, sessões, estrutura mundial (Sede/Estaduais/Regionais/Setoriais/Locais) e diretório de igrejas.

2. **Fase 2 – Membresia & Cuidado Pastoral (O Coração)**  
   Foco: cadastro de membros com LGPD, dados eclesiásticos (batismo, conversão, cartas), aniversários, visitas e acompanhamento pastoral.

3. **Fase 3 – Operação, Ministérios & Agenda Unificada (A Organização)**  
   Foco: ministérios, escalas, células/grupos, agenda de cultos/programações, visão por igreja e por cidade/região.

4. **Fase 4 – Mordomia Financeira & Monetização (Os Recursos)**  
   Foco: entradas, saídas, centros de custo/projetos, doações online, receitas de serviços/produtos e relatórios de prestação de contas.

5. **Fase 5 – Presença Digital, Marketing & GMN (A Voz)**  
   Foco: diretório público de igrejas, integração com Google Meu Negócio, divulgação de eventos e campanhas.

6. **Fase 6 – App Web do Membro (A Comunidade)** – Projeto B  
   Foco: Bíblia online, devocionais, mural de avisos, pedidos de oração, visitas, agenda das igrejas da cidade, campanhas e transparência.

7. **Fase 7 – Inteligência & Automação (O Futuro)**  
   Foco: relatórios avançados, auditoria, IA para engajamento, risco de evasão, previsões financeiras e automações.

---

## 2. Cross-Cutting: Segurança, Sessões, LGPD & Internacionalização

Esses temas são transversais e aparecem em várias fases, mas a base é construída principalmente na **Fase 1**.

### 2.1. Segurança & Controle de Sessão

Requisitos:

- **Apenas 1 sessão ativa por usuário**:
  - Tabela `user_sessions` com: `id`, `user_id`, `device_info`, `ip`, `created_at`, `last_activity_at`, `is_active`.
  - No login:
    - Invalidar sessões anteriores do mesmo `user_id`.
    - Criar nova sessão e vincular aos tokens.

- **Timeout por inatividade**:
  - Painel Admin: 15–30 minutos de inatividade.
  - App do Membro: 1–4 horas (configurável).
  - A cada request autenticado:
    - Atualizar `last_activity_at`.
    - Se o limite estourar, sessão expira e exige novo login.

- **Auditoria básica de sessões**:
  - Registrar criação, término e falhas de login.
  - Base para relatórios de segurança na Fase 7.

### 2.2. LGPD no Cadastro de Membros

- Campos de consentimento no cadastro:
  - `consent_communication` (receber comunicações da igreja).
  - `consent_profile_visibility` (exibir dados básicos para outros membros).
  - `consent_whatsapp_contact` (autorizar exibir botão de WhatsApp para outros membros).
- Configurações de privacidade por membro:
  - Quem pode ver:
    - Data de aniversário (dia/mês).
    - Telefone/WhatsApp.
    - E-mail.
  - Opções:
    - Somente liderança.
    - Igreja local.
    - Ninguém (uso interno).
- Bloqueio de exportação:
  - Por padrão, **não permitir exportação de base de membros**.
  - Se existir exportação:
    - Apenas para perfis específicos (secretaria central/tesouraria).
    - Sempre auditada (quem exportou, quando, qual escopo).
- Dados sensíveis:
  - Histórico pastoral, saúde, observações pessoais → acesso restrito a perfis de liderança.

### 2.3. Internacionalização (i18n) & App Mundial

- `organizations` e `church_units` com:
  - País.
  - Cidade.
  - Fuso-horário.
  - Idioma padrão da unidade (`language_default`).
- Infra de i18n para UI:
  - Arquivos de tradução por idioma (`pt-BR`, `en`, `es`, etc.).
  - Chaves de textos: `auth.login.title`, `member.profile.name`, etc.
- Conteúdo editorial multilíngue:
  - Devocionais, estudos, avisos, campanhas:
    - Idioma original.
    - Traduções por idioma (estrutura própria).
    - Indicação quando conteúdo é traduzido.
- Preferências de idioma:
  - Idioma padrão herdado da igreja.
  - Usuário pode sobrescrever sua preferência no perfil.

---

## 3. Fase 1 – Fundação Sólida (Core, Auth, Segurança & Multi-Igreja)

### Objetivos

- Ter um núcleo sólido de autenticação, autorização, sessões, LGPD base e estrutura multi-igreja/mundial.
- Disponibilizar um **painel mínimo** para gestão de organizações e igrejas (sem ainda mexer com membros).

### Sprint 1.1 – Modelagem de Dados & Multi-Igreja

- Criar tabelas principais:
  - `organizations` – denominações / ministérios.
  - `church_units` – Sede, Estaduais, Regionais, Setoriais, Locais.
- Campos em `church_units`:
  - Hierarquia: `parent_id`, `type` (Sede/Estadual/Regional/Setorial/Local).
  - Endereço completo.
  - Geo (latitude/longitude).
  - Contatos: telefone, WhatsApp, e-mail, site.
  - GMN: `gmb_place_id`, flag de sincronização.
  - `country`, `city`, `timezone`, `language_default`.
- Garantir que outras tabelas futuras (membros, eventos, finanças, etc.) referenciem `church_unit_id`.

### Sprint 1.2 – Auth, RBAC & Sessões

- Implementar autenticação com Supabase Auth (ou camada própria integrada).
- Modelar:
  - `roles` (perfis: admin global, admin sede, admin regional, pastor local, secretaria, tesouraria, etc.).
  - `user_roles` com escopo:
    - `scope_type` (organization / church_unit / region).
    - `scope_id`.
- Criar `user_sessions`:
  - Implementar política:
    - 1 sessão por usuário.
    - Timeout por inatividade.
- RLS & Policies:
  - Garantir que o acesso a dados sempre seja filtrado por:
    - `organization_id`.
    - `church_unit_id` (quando aplicável).
    - Papel do usuário.

### Sprint 1.3 – Painel Admin Inicial (Organizações & Igrejas)

- Criar layout base do painel (Antigravity):
  - Login, logout.
  - Sidebar inicial.
- Telas mínimas:
  - Listar organizações.
  - Detalhe de organização.
  - CRUD de `church_units`:
    - Cadastro/edição de igreja.
    - Configuração de endereço, fuso-horário, idioma, contatos.
- Auditoria básica:
  - Registro de criação/edição de `church_units`.

---

## 4. Fase 2 – Membresia & Cuidado Pastoral (O Coração)

### Objetivos

- Permitir cadastro completo de membros com LGPD.
- Registrar vida eclesiástica (conversão, batismo, cartas).
- Acompanhar aniversários e visitas pastorais.
- Garantir que tudo seja **acessível apenas logado** e com perfis adequados.

### Sprint 2.1 – Modelagem de Membros & LGPD

- Tabelas:
  - `members`:
    - Dados pessoais mínimos (nome, data de nascimento, contato, endereço).
    - `church_unit_id` principal.
  - `member_ecclesiastical_profile`:
    - Conversão: data, local.
    - Batismo: data, local, ministro.
    - Forma de recebimento: batismo, reconciliação, transferência, aclamação.
    - Igreja de origem (para transferências).
  - `member_consent`:
    - `consent_communication`.
    - `consent_profile_visibility`.
    - `consent_whatsapp_contact`.
    - Carimbo de data/hora e origem do consentimento.
  - Relacionamentos familiares:
    - `member_family_links` (pai/mãe/filho/cônjuge).

- Regras LGPD:
  - Bloquear exportação da base de membros (no mínimo na V1).
  - Mostrar dados conforme perfil e consentimento.

### Sprint 2.2 – Cadastros & Agenda de Aniversários

- Telas no painel admin:
  - Cadastro e edição de membros (somente perfis autorizados).
  - Visualização de perfil com seções: dados pessoais, eclesiásticos, família, consentimentos.
- Agenda de aniversariantes:
  - Visão por dia/semana/mês, filtrada por igreja.
  - Respeitar:
    - `consent_communication = true`.
- Integração WhatsApp:
  - Botão “Enviar mensagem de aniversário” com template pré-preenchido.

### Sprint 2.3 – Acompanhamento Pastoral & Visitas

- Tabelas:
  - `pastoral_followups`:
    - Tipo: visita, aconselhamento, acompanhamento especial.
    - Responsável (pastor/obreiro).
    - Situação (em andamento, concluído).
  - `visit_requests`:
    - Membro solicitante.
    - Tipo de visita (hospitalar, domiciliar, aconselhamento).
    - Situação (aguardando, agendada, concluída, cancelada).

- Telas no painel admin:
  - Lista de pedidos de visita.
  - Agenda de visitas.
  - Registro de visitas concluídas (somente liderança).
- LGPD:
  - Esses dados **não aparecem** para outros membros no app.

---

## 5. Fase 3 – Operação, Ministérios & Agenda Unificada (A Organização)

### Objetivos

- Organizar ministérios, escalas e células/grupos.
- Implementar agenda de cultos e programações por igreja.
- Permitir visão unificada por cidade/região (ex.: Sede + congregações em São Francisco de Paula).

### Sprint 3.1 – Ministérios, Voluntários & Escalas

- Tabelas:
  - `ministries` (louvor, recepção, diaconato, infantil, mídia, etc.).
  - `volunteers` (ligação membro ↔ ministério).
  - `trainings` e `volunteer_trainings` (para elegibilidade).
  - `schedules` (escala de serviço por culto/evento).

- Telas:
  - Cadastro de ministérios.
  - Atribuição de membros como voluntários.
  - Registro de treinamentos obrigatórios.
  - Montagem de escala de ministérios (por culto/evento).

### Sprint 3.2 – Células, Grupos & Reuniões Menores

- Tabelas:
  - `small_groups` (células, grupos familiares, grupos de jovens).
  - `group_members` (membros por grupo).
  - `group_meetings` (agenda de reuniões de célula).

- Telas:
  - Cadastro de grupos.
  - Vincular membros aos grupos.
  - Agenda de células por igreja/bairro.

### Sprint 3.3 – Agenda de Cultos & Agenda da Cidade/Região

- Tabelas:
  - `services` ou `church_events`:
    - `church_unit_id`.
    - Tipo: culto de doutrina, culto da família, campanha, congresso, etc.
    - Dia da semana, horário, periodicidade (semanal, quinzenal, mensal, único).
    - Escopo:
      - Local.
      - Setorial.
      - Regional.
      - Aberto à cidade inteira.
      - Nacional/Mundial (quando for o caso).

- Telas:
  - Agenda por igreja (visão local).
  - Agenda consolidada por cidade/região:
    - Exibir sede + congregações.
    - Mostrar programações que não conflitam (apoio inter-igrejas).
- Integração futura:
  - Marcação de eventos como “relevantes para GMN” (para uso na Fase 5).

---

## 6. Fase 4 – Mordomia Financeira & Monetização (Os Recursos)

### Objetivos

- Organizar finanças por igreja.
- Implementar centros de custo/projetos.
- Permitir doações online e receitas de serviços/produtos.
- Preparar relatórios de prestação de contas e transparência.

### Sprint 4.1 – Estrutura Financeira Básica

- Tabelas:
  - `financial_accounts` (contas caixa, bancos).
  - `cost_centers` (missões, construção, obra social, mídia, manutenção, etc.).
  - `projects` (campanhas específicas).
  - `transactions` (entradas/saídas) com vínculo a conta, centro de custo e projeto.

- Telas:
  - Cadastro de centros de custo e projetos.
  - Lançamento manual de receitas/despesas (por igreja).
  - Visão de extrato por igreja e por projeto.

### Sprint 4.2 – Doações Online & Campanhas

- Módulo de doações:
  - Doações gerais.
  - Dízimos.
  - Campanhas específicas (obra social, construção, missões).
- Integração com gateway de pagamento (definir provedor).
- Relatórios:
  - Doações por membro (acesso restrito).
  - Doações por campanha e por igreja.
- Configuração de repasse:
  - Definir percentuais para:
    - Obra social.
    - Sustentação da igreja.
    - Nível superior (regional/sede, se aplicável).

### Sprint 4.3 – Receitas de Serviços & Produtos

- Estrutura para:
  - Serviços da igreja (locação de salão, eventos, cursos).
  - Produtos (livros, materiais de estudo, camisetas, etc.).
- Tabelas:
  - `products_services`.
  - `product_sales` / `service_sales`.

- Telas:
  - Catálogo por igreja.
  - Registro de vendas/serviços.
- Relatórios combinados:
  - Receitas de doações, serviços e produtos.
  - Prestação de contas por centro de custo e projeto.

---

## 7. Fase 5 – Presença Digital, Marketing & GMN (A Voz)

### Objetivos

- Consolidar diretório público de igrejas.
- Integração com **Google Meu Negócio**.
- Potencializar divulgação de eventos e campanhas.

### Sprint 5.1 – Diretório Público de Igrejas

- Expor (em site público ou seção específica):
  - Lista de igrejas com:
    - Nome.
    - Endereço.
    - Mapa (Google Maps).
    - Contatos: telefone, WhatsApp, e-mail.
    - Link para site/app.
- Filtros:
  - Por cidade, estado, país.
  - Por tipo (sede, congregação).

### Sprint 5.2 – Integração Google Meu Negócio (GMN)

- Usar campos de `church_units`:
  - `gmb_place_id`, endereço, contatos, horários.
- Módulo de sincronização:
  - Atualizar endereço, telefone, site, horários de funcionamento.
  - Planejar:
    - Publicação de eventos especiais (cultos, congressos) como posts no GMN.

### Sprint 5.3 – Marketing & Distribuição de Conteúdo

- Templates de campanhas:
  - Eventos regionais/estaduais/nacionais.
  - Campanhas de doação/obra social.
- Ações:
  - Geração de texto & arte base para redes sociais.
  - Links prontos para WhatsApp (divulgação rápida).
- Integração com agenda:
  - Selecionar eventos da agenda para divulgação (interno + externo).

---

## 8. Fase 6 – App Web do Membro (A Comunidade) – Projeto B

> **Importante**: O App Web Cliente será um **projeto separado** (outro repo), consumindo o mesmo backend e banco de dados.  
> Objetivo: desacoplar o site fullstack/painel admin da experiência do membro, permitindo domínios/links dedicados.

### Objetivos

- Entregar um app web onde o membro:
  - Tenha Bíblia, devocionais, estudos, mural, agenda.
  - Faça pedidos de oração e solicitações de visita.
  - Veja campanhas e transparência de uso dos recursos.
  - Encontre igrejas próximas e suas programações.
  - Se comunique com a igreja (WhatsApp / canal interno).

### Sprint 6.1 – Autenticação, Perfil & Idioma do Membro

- Implementar login integrado ao backend (mesmo sistema de Auth).
- Respeitar:
  - Política de 1 sessão por vez.
  - Timeout de inatividade.
- Perfil do membro:
  - Edição básica (foto, e-mail, telefone).
  - Configurações de privacidade e consentimentos (LGPD).
  - Preferência de idioma.

### Sprint 6.2 – Conteúdo Espiritual & Mural

- Seções:
  - **Bíblia online**:
    - Navegação por livro/capítulo.
    - Busca por referência.
  - **Devocionais & Estudos**:
    - Listagem, leitura, marcação de lidos/favoritos.
  - **Mural de avisos**:
    - Avisos da igreja local.
    - Avisos regionais/nacionais (quando marcados como globais).
- Tradução:
  - Respeitar idioma preferido do usuário.
  - Indicar quando texto for tradução automática.

### Sprint 6.3 – Oração, Visitas & Contato com a Igreja

- Pedidos de oração:
  - Formulário com opções de:
    - Público para grupo de intercessão.
    - Privado (apenas liderança/pastor).
    - Anônimo (sem exibir nome no grupo).
  - Integração com painel (Fase 2 e 3) para acompanhamento.
- Agendamento de visitas:
  - Membro solicita tipo de visita (pastoral, hospitalar, aconselhamento).
  - Disponibilidade de dias/turnos.
  - Integração com módulo de visitas do painel.
- Canal com a igreja:
  - Botões de ação:
    - “Falar com a Secretaria”.
    - “Falar com o Pastor”.
    - “Falar com Ministério X”.
  - Deep links de WhatsApp com mensagens pré-preenchidas.

### Sprint 6.4 – Diretório & Agenda das Igrejas da Cidade

- Encontrar igreja:
  - Lista + mapa com igrejas próximas (baseado na igreja do membro e/ou localização).
  - Filtros por tipo (sede, congregação) e recursos.
  - Botões:
    - “Ver programação”.
    - “Abrir no mapa”.
    - “Falar com a igreja”.
- Agenda:
  - **Agenda da minha igreja**.
  - **Agenda das igrejas da minha cidade/região**:
    - Mostrar cultos que não conflitam, fomentando integração.
- Campanhas & Transparência:
  - Listar campanhas (obra social, missões, construção).
  - Mostrar metas e valores arrecadados (por igreja).
  - Exibir relatórios de impacto (quando cadastrados no painel).

### Sprint 6.5 – Comunidade & Comunicação entre Membros (Opcional/Avançado)

- Diretório interno:
  - Mostrar apenas membros que optaram por participar (opt-in).
  - Respeitar privacidade (o que cada um autorizou exibir).
- Conversas:
  - Mensagens 1:1.
  - Grupos (células, ministérios, jovens).
  - Tudo dentro do app (sem expor dados além do necessário).
- WhatsApp:
  - Mostrar botão de contato apenas se `consent_whatsapp_contact = true`.

---

## 9. Fase 7 – Inteligência & Automação (O Futuro)

### Objetivos

- Refinar auditoria, segurança e LGPD.
- Implementar IA para apoio à liderança.
- Automação de comunicações em momentos-chave.

### Sprint 7.1 – Auditoria Avançada & Relatórios LGPD

- Log de:
  - Quem acessou qual membro.
  - Quem alterou quais campos.
  - Exportações realizadas (se habilitadas).
- Relatórios:
  - Acessos por período.
  - Perfis com maior volume de consultas.
- Alertas:
  - Comportamento anômalo (ex.: muitas consultas em pouco tempo, tentativas de login falhas etc.).

### Sprint 7.2 – IA & Análise Preditiva

- Indicadores:
  - Frequência de culto/célula (quando houver).
  - Engajamento no app (devocionais, pedidos, participação em campanhas).
- IA:
  - Risco de afastamento (membro sumindo há muito tempo).
  - Sugestão de ações pastorais.
  - Previsão de ofertas/doações para planejamento de caixa.

### Sprint 7.3 – Automação de Comunicação

- Triggers:
  - Aniversário.
  - Longo período sem participação.
  - Conclusão de curso / discipulado.
  - Engajamento em campanhas.
- Canais:
  - WhatsApp (via templates).
  - E-mail.
- Sempre:
  - Respeitando consentimentos LGPD.

---

## 10. Próximos Passos Imediatos (para o Antigravity)

1. **Rever este IMPLEMENTATION_PLAN.md** e ajustar detalhes técnicos conforme melhores práticas do Antigravity + Supabase.
2. Iniciar pela **Fase 1 – Fundação Sólida**, criando:
   - Modelagem de `organizations`, `church_units`, `user_roles`, `user_sessions`.
   - Infra de Auth, RBAC, RLS e sessão (1 login por vez + timeout).
   - Painel básico de gestão de igrejas.
3. Validar com o responsável funcional (Alexandre) antes de avançar para a Fase 2.

Este plano deve servir como **mapa de batalha** para o desenvolvimento incremental, garantindo segurança, escalabilidade mundial e aderência às necessidades reais das igrejas.

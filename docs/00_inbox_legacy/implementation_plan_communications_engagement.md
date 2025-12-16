# Planejamento da Sprint 11: Comunicação & Engajamento (Fase 5)

## 1. Resumo Executivo
Esta sprint tem como objetivo transformar o **MD Connect** em uma central de comunicação estratégica para a igreja. Focaremos em estruturar como a igreja se comunica *internamente* (Mural de Avisos para liderança e membros) e *externamente* (Presença Digital, Google Meu Negócio e Diretório de Igrejas).

Além disso, prepararemos o terreno para a "Comunicação Ativa" através da modelagem de **Campanhas** e **Templates de WhatsApp**, permitindo que a liderança planeje ações coordenadas (ex: "Campanha de 40 dias de oração") e padronize a comunicação, mesmo que os envios reais sejam implementados em uma etapa futura.

O resultado será um admin capaz de gerir não apenas dados operacionais, mas também a **voz e a imagem** da igreja.

## 2. Objetivos da Sprint
*   **Centralizar a Comunicação:** Criar um "Mural Digital" para avisos oficiais, eliminando ruído de grupos de mensagens informais.
*   **Estruturar a Presença Digital:** Garantir que cada igreja tenha seus dados públicos (endereço, horários, contatos) organizados e prontos para sincronização com Google Meu Negócio e Site da Denominação.
*   **Planejamento de Campanhas:** Permitir a criação de campanhas que agrupam eventos e comunicações sob um mesmo tema.
*   **Padronização via WhatsApp:** Criar modelos (templates) de mensagens para garantir consistência na comunicação dos líderes com os membros.

## 3. Entregas por Domínio

### A. Comunicação Interna (Mural)
*   **Mural de Avisos/Notícias:** Interface para criar, editar e excluir avisos.
*   **Categorização:** Tipos de aviso (Culto, Evento, Administrativo, Urgente, Social).
*   **Controle de Visibilidade (Escopo):**
    *   *Interno:* Apenas Admin/Liderança.
    *   *Público/Membros:* Visível no App (futuro).
    *   *Global:* Visível para toda a organização (opcional).

### B. Campanhas & Estratégia
*   **Gestão de Campanhas:** Criar campanhas com Nome, Tema, Data Início/Fim e Cor.
*   **Associação:** Vincular Eventos existentes a uma Campanha (ex: todos os cultos de Outubro vinculados à "Campanha da Família").

### C. Integração WhatsApp (Modelagem)
*   **Gestão de Templates:** Criar modelos de texto com variáveis (ex: "Olá {NOME}, não esqueça do culto de {DATA}.").
*   **Simulador de Disparo:** Interface para testar o template (ver como ficaria a mensagem), preparando o backend para o disparo real futuro.
*   **Log de Comunicação:** Estrutura de banco para registrar histórico (quem enviou, para quem, qual template, status).

### D. Presença Digital & GMN
*   **Perfil Público da Igreja:** Campos dedicados para SEO e GMN (Descrição Curta, Horários de Funcionamento formatados, Links de Redes Sociais, Coordenadas GPS refinadas).
*   **Status de Sincronização:** Flags indicando se os dados estão atualizados no GMN (mock/manual por enquanto).

### E. Diretório de Igrejas
*   **Listagem de Igrejas:** Visão consolidada de todas as congregações da organização.
*   **Busca e Filtros:** Por Estado, Cidade e Tipo (Sede/Congregação).
*   **Cartão de Visita:** Visualização rápida dos dados públicos de cada igreja.

## 4. Tarefas Técnicas

### Banco de Dados (Supabase)
*   **Tabelas Novas:**
    *   `notices` (avisos): `id`, `church_id`, `title`, `content`, `category`, `scope`, `expires_at`, `created_by`.
    *   `campaigns`: `id`, `church_id`, `name`, `theme`, `start_date`, `end_date`, `color`.
    *   `whatsapp_templates`: `id`, `church_id`, `title`, `content`, `variables` (JSON array).
    *   `whatsapp_logs`: `id`, `church_id`, `member_id`, `template_id`, `status`, `sent_at`.
*   **Alterações em Tabelas Existentes:**
    *   `churches`: Adicionar coluna `public_profile` (JSONB) para armazenar dados flexíveis do GMN (horários, social links, coords) ou criar tabela extensão `church_directories`. *Decisão: Tabela extensão `church_profiles` 1:1 para manter `churches` leve.*
    *   `church_events`: Adicionar coluna `campaign_id` (FK) para vínculo.

### API & Hooks
*   `src/api/communication.ts`: CRUD para Notices, Campanhas e Templates.
*   `src/api/directory.ts`: Fetch para Church Profiles e Directory list.
*   `src/hooks/useCommunication.ts`: Hooks para Notices/Campaigns.
*   `src/hooks/useDirectory.ts`: Hooks para gestão do perfil público.

### Frontend (Telas Admin)
*   **Módulo Comunicação (`/communications`):**
    *   `NoticeBoard.tsx` (Mural): Lista cards + CREATE/EDIT Modal.
    *   `CampaignsManager.tsx`: Timeline ou Lista de campanhas.
    *   `WhatsappTemplates.tsx`: Editor de texto com inserção de variáveis.
*   **Módulo Presença (`/digital-presence`):**
    *   `DigitalProfileForm.tsx`: Formulário rico (Endereço, Horários, Fotos, Links).
    *   `DirectoryList.tsx`: Tabela/Grid de igrejas com filtros.

### Integração
*   Atualizar `EventFormModal.tsx` para permitir selecionar uma **Campanha**.
*   Atualizar Dashboard para mostrar "Avisos Recentes" (bloco administrativo).

### QA Plan
1.  Criar Aviso com escopo "Interno" e verificar se aparece.
2.  Criar Campanha e vincular a um Evento.
3.  Editar Perfil Público da igreja e verificar persistência.
4.  Filtrar Diretório por cidade.

## 5. Arquivos Impactados (Estimativa)
*   `supabase/migrations/20250115000000_sprint11_communication.sql` (NEW)
*   `src/App.tsx` (Novas rotas)
*   `src/components/AdminSidebar.tsx` (Novos menus)
*   `src/pages/admin/Communication/Communications.tsx` (NEW - Wrapper)
*   `src/pages/admin/Communication/NoticeBoard.tsx` (NEW)
*   `src/pages/admin/Communication/CampaignsManager.tsx` (NEW)
*   `src/pages/admin/Communication/WhatsappTemplates.tsx` (NEW)
*   `src/pages/admin/DigitalPresence/DigitalPresence.tsx` (NEW)
*   `src/components/EventFormModal.tsx` (Update)
*   `src/api/communication.ts` (NEW)

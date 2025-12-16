# Sprint 10: Gestão Eclesiástica & Liturgia ✝️

## 1. Visão Geral
**Objetivo:** Profissionalizar a gestão dos cultos e celebrações, integrando a agenda (Eventos) com a força de trabalho (Ministérios/Escalas) e o público (Check-in). Além disso, criar uma ferramenta stratégica para o pastor: o **Dashboard de Púlpito**.

**Público-Alvo:** 
- **Pastores:** Visão clara do culto, aniversariantes e avisos.
- **Líderes de Ministério:** Organização das escalas.
- **Secretaria/Recepção:** Controle de frequência (Check-in).

## 2. Entregas Principais
1.  **Gestão de Cultos (Liturgia)**
    - Diferenciação de "Culto" vs "Evento Comum".
    - Associação de escalas e checklists específicos para cultos.
2.  **Integração de Ministérios**
    - Refinamento das Escalas para vincular diretamente aos Cultos criados.
3.  **Check-in de Culto**
    - Ferramenta de contagem rápida (Homens, Mulheres, Crianças, Visitantes).
    - Registro histórico de frequência por culto.
4.  **Dashboard de Púlpito**
    - Tela minimalista "Tablet Mode" para uso durante ou antes do culto.
    - Resumo de: Escala do dia, Aniversariantes, Visitantes, Avisos.

## 3. Detalhamento Técnico

### 3.1 Banco de Dados (Supabase)
*   **Tabela: `service_attendances` (Novo)**
    *   `id`: UUID
    *   `event_id`: UUID (FK events)
    *   `count_men`: Integer
    *   `count_women`: Integer
    *   `count_kids`: Integer
    *   `count_visitors`: Integer
    *   `observations`: Text
*   **Alteração: `events`**
    *   Adicionar flag `is_service` (boolean) ou usar `event_type = 'culto'`. (Vamos padronizar `event_type`).

### 3.2 Camada de API (Hooks & Services)
*   `src/api/services.ts`:
    *   `checkInService(eventId, counts)`
    *   `getServiceSummary(eventId)`: Traz totais, escalas e aniversariantes da data.
*   `src/hooks/useServices.ts`: Abstração para componentes.

### 3.3 Frontend (Telas)

#### A. Gestão de Cultos (`/admin/services`)
*   Pode ser uma especialização de `/admin/agenda` ou uma view separada focada apenas em Cultos.
*   **Decisão:** Manter em `/admin/agenda` mas criar uma aba ou filtro "Apenas Cultos" para facilitar a gestão litúrgica.

#### B. Escalas (`/admin/ministries`) *Refinamento*
*   Garantir que ao criar uma escala, o usuário possa selecionar um evento da agenda (Culto).

#### C. Check-in de Culto (`/admin/services/checkin/:id`)
*   Interface simples com botões grandes (+ / -) para contagem.
*   Campo para observações (ex: "Chuva forte", "Visitante ilustre").

#### D. Dashboard de Púlpito (`/admin/pulpit`)
*   **Layout:** Focado em leitura fácil (fontes grandes, alto contraste).
*   **Seções:**
    1.  **Cabeçalho:** Data, Hora, Nome do Culto.
    2.  **Escala:** Quem está no Louvor, Palavra, Mídia.
    3.  **Pessoas:** Aniversariantes do dia/semana (Card destacado).
    4.  **Visitantes:** Lista de visitantes cadastrados recentemente (ou check-in do dia).
    5.  **Avisos:** Recados fixos da semana.

## 4. Arquivos Impactados
*   `src/pages/admin/EventManagement.tsx` (Adaptação para suportar métricas de culto)
*   `src/pages/admin/PulpitDashboard.tsx` (Novo)
*   `src/components/services/ServiceCheckin.tsx` (Novo)
*   `src/api/services.ts` (Novo)
*   `supabase/migrations/20250101000090_create_service_management.sql` (Novo)

## 5. Plano de Testes (QA)
1.  Criar um evento do tipo "Culto".
2.  Alocar uma escala de ministério para este culto.
3.  Realizar o Check-in (contagem) de pessoas.
4.  Acessar o Dashboard de Púlpito e verificar se as informações (Escala, Contagem, Aniversariantes) aparecem corretamente.

# Plano de Execução: Consolidação Financeira (Sprint 9)

**Objetivo:** Elevar o módulo financeiro de "lançamentos básicos" para "ferramenta de gestão e auditoria", atendendo às necessidades da Tesouraria e do Conselho Fiscal das igrejas. A meta é permitir o acompanhamento de metas (Orçamento), prover relatórios gerenciais e garantir transparência total (Auditoria).

---

## 1. Visão Funcional (O que entregaremos)

### 🎯 Orçamento x Realizado (Budget vs Realized)
*   **Problema:** O pastor define uma meta de R$ 50.000 para missões, mas hoje não sabe o quanto já entrou sem somar na calculadora.
*   **Solução:**
    *   Tela para definir **Metas Mensais** ou Anuais por Categoria (ex: "Missões", "Dízimos", "Reforma").
    *   Gráfico/Tabela comparativa: `Meta` vs `Arrecadado` vs `Diferença (%)`.

### 📑 Relatórios Gerenciais
*   **Problema:** Tesoureiro precisa prestar contas no fim do mês e hoje só tem uma lista corrida de lançamentos.
*   **Solução:**
    *   Tela dedicada a Relatórios.
    *   Filtros avançados: Período Personalizado, Categoria, Tipo (Entrada/Saída).
    *   Visão Agrupada: Total por Categoria (ex: Quanto gastamos com "Energia" no ano?).
    *   **Exportação:** Botão simples para gerar CSV/Excel dos dados filtrados.

### 🛡️ Auditoria Financeira Especializada
*   **Problema:** O Conselho quer saber "Quem alterou o valor dessa oferta de 1000 para 100?". O log existe mas está misturado com logs de login/membros.
*   **Solução:**
    *   Aba "Auditoria" dentro do Financeiro.
    *   Mostra APENAS ações em `financial_transactions` e `financial_categories`.
    *   Visual "Diff": "Valor alterado de X para Y".

### 📊 Painel Principal (Dashboard)
*   **Problema:** Os números no dashboard principal ainda são estáticos ou parciais.
*   **Solução:**
    *   Conectar cards de Receita/Despesa aos dados reais consolidados.
    *   Exibir "Termômetro Financeiro" (Percentual da Meta do Mês atingido).

---

## 2. Estrutura Técnica (O que vamos construir)

### 🗄️ Banco de Dados (Supabase)
Criar migração `20250101000080_finance_consolidation.sql`:

1.  **Tabela `financial_budgets`**
    *   `id` (uuid)
    *   `church_id` (fk)
    *   `category_id` (fk, nullable - se null é meta global da igreja)
    *   `month` (int), `year` (int) - ou `period_start`/`end`
    *   `amount` (decimal) - A meta prevista.
    *   `created_at`, `updated_at`

2.  **Índices e Views (Opcional)**
    *   Garantir índices em `financial_transactions(church_id, date, category_id)` para relatórios rápidos.

### 🔌 API Layer (`src/api/finance-reports.ts`)
Criar serviço especializado para consultas pesadas (Analytics), separando do CRUD básico.

*   `getBudgetOverview(churchId, month, year)`:
    *   Busca metas em `financial_budgets`.
    *   Soma `financial_transactions` do período agrupado por categoria.
    *   Retorna objeto combinado: `{ category, target, actual, percent }`.
*   `getAuditTrail(churchId, filters)`:
    *   Consulta a tabela `audit_logs`.
    *   Filtra por `table_name = 'financial_transactions'`.
*   `exportTransactions(churchId, filters)`:
    *   Gera CSV no frontend ou backend.

### 🖥️ Frontend (Admin)

#### A. Ajustes nas Rotas (`src/pages/admin/Finance.tsx`)
Refatorar a página Financeiro para usar **Abas (Tabs)** do Shadcn UI:
1.  **Lançamentos** (A tela atual).
2.  **Relatórios & Metas** (Nova).
3.  **Auditoria** (Nova, visível apenas para Tesoureiros/Admins).

#### B. Componentes Novos
1.  `BudgetManager.tsx`: Modal ou tabela inline para definir as metas do mês.
2.  `FinancialReports.tsx`:
    *   Seletor de Período.
    *   Gráfico de Barras (Meta vs Real).
    *   Tabela de Agrupamento por Categoria.
3.  `FinancialAuditTable.tsx`:
    *   Tabela de logs filtrada.
    *   Coluna "Detalhes" formatando o campo JSONB de mudanças (`old_data` vs `new_data`).

#### C. Dashboard (`src/pages/admin/Dashboard.tsx`)
*   Atualizar o hook de KPIs para buscar também o `budget` do mês atual e calcular o `%` atingido.

---

## 3. Plano de Tarefas (Passo a Passo)

1.  **Database:** Criar e rodar migração `financial_budgets`.
2.  **Backend:** Implementar `finance-reports.ts` (API).
3.  **Frontend - Reports:** Criar tela de Relatórios com Gráfico e Tabela de Metas.
4.  **Frontend - Budget:** Criar UI para definir as metas (CRUD de `financial_budgets`).
5.  **Frontend - Audit:** Criar tela de Auditoria Financeira filtrada.
6.  **Dash Integration:** Atualizar Dashboard principal.

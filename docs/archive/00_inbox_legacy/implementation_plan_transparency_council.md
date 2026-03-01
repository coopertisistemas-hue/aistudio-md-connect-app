# Plano de Implementação: Transparência & Conselho Fiscal

**Versão:** 1.0
**Data:** 12/12/2025
**Contexto:** Sprint 12 do MD Connect

---

## 1. Resumo Executivo
Este módulo visa fortalecer a confiança e a governança nas igrejas que utilizam o MD Connect. Focamos em entregar ferramentas que transformam os dados financeiros já existentes em **informação auditável e apresentável**.
Para o **Conselho Fiscal**, entregamos um painel pronto para reuniões, eliminando a necessidade de planilhas manuais.
Para a **Liderança/Membros**, oferecemos um Portal de Transparência configurável, permitindo que cada igreja decida o nível de abertura de seus números (do "apenas totalizadores" ao "detalhe por categoria"), promovendo uma cultura de integridade.

---

## 2. Objetivos Principais

1.  **Agilidade para o Conselho Fiscal:** Reduzir o tempo de preparação de reuniões de prestação de contas com dashboards automáticos.
2.  **Rastreabilidade (Auditoria):** Garantir que qualquer alteração em dados sensíveis (financeiro/membros) seja visível e rastreável, inibindo fraudes ou erros não detectados.
3.  **Flexibilidade na Transparência:** Permitir que a igreja configure *quem* vê *o quê*, respeitando a maturidade e o estatuto de cada comunidade.

---

## 3. Entregas por Domínio

### A. Painel do Conselho Fiscal (`FiscalDashboard`)
Um dashboard "somente leitura" otimizado para análise crítica.
*   **Visão:** Consolidado Mês a Mês (Entradas vs Saídas).
*   **Destaques:** Saldo Anterior, Saldo Atual, Variação %.
*   **Alertas:** Grandes saídas não usuais ou categorias que estouraram o orçamento (link com módulo de Metas).

### B. Portal de Transparência (`TransparencyPortal`)
Uma área simplificada para acesso de não-administradores (liderança expandida ou membros).
*   **Configurável:** A igreja ativa/desativa.
*   **Conteúdo:** Gráficos de "Origem dos Recursos" e "Aplicação dos Recursos" (Pizza/Barras).
*   **Privacidade:** Não mostra nomes de dizimistas, apenas totais por categoria (Dízimos, Ofertas, Missões).

### C. Auditoria Visual (`AuditVisual`)
Interface amigável para explorar os logs do sistema (`audit_logs`).
*   **Foco:** Quem fez, o que fez, quando fez e *o que mudou* (Diff visual: Valor 100 -> 1000).
*   **Filtros:** Por usuário, por módulo (Financeiro, Secretaria), por data.

### D. Configurações de Transparência (`TransparencySettings`)
O "controle remoto" da privacidade.
*   **Definições:**
    *   "Ativar Portal de Transparência?" (Sim/Não).
    *   "Quem pode acessar?" (Apenas Conselho / Liderança / Todos os Membros).
    *   "Nível de Detalhe?" (Apenas Totais / Por Categoria / Detalhado).

---

## 4. Tarefas Técnicas

### 4.1. Banco de Dados & Schema
*   **Tabela `church_settings` (Ajuste):** Adicionar coluna JSONB `transparency_config` para armazenar as preferências (nível de acesso, ativação).
*   **View de Relatórios (Opcional):** Criar *Database Views* seguras para o portal de transparência, garantindo que queries do frontend nunca acessem dados sensíveis acidentalmente.
*   **Auditoria:** Verificar se a tabela `audit_logs` já captura o `old_record` e `new_record` corretamente para transações financeiras.

### 4.2. API & Hooks
*   `src/api/transparency.ts`:
    *   `getFiscalSummary(period)`: Retorna dados consolidados para o conselho.
    *   `getPublicFinancials()`: Retorna dados higienizados para o portal (respeitando configurações).
    *   `getVisualAuditLogs(filters)`: Busca logs formatados com diff.
*   `src/hooks/useTransparency.ts`: Wrapper do React Query para essas chamadas.

### 4.3. Telas Admin (Frontend)
*   **`FiscalDashboard.tsx`:**
    *   Uso de `Recharts` para gráficos de tendência e composição.
    *   Tabelas densas para conferência de valores.
*   **`AuditVisualizer.tsx`:**
    *   Componente de linha do tempo.
    *   Visualizador JSON Diff (comparar Antes vs Depois).
*   **`TransparencySettings.tsx`:**
    *   Formulário com `Switch` (Ativar/Desativar) e `Select` (Nível de Acesso).

### 4.4. Integração
*   Integrar o **Portal de Transparência** no futuro *App do Membro* (apenas se ativado).
*   Adicionar atalho para "Auditoria deste registro" nos detalhes de uma Transação Financeira existente.

### 4.5. QA & Testes
*   **Cenário 1:** Admin altera uma transação -> Verificar se aparece na Auditoria com o Diff correto.
*   **Cenário 2:** Ativar Portal -> Acessar com usuário "Membro" -> Verificar se vê apenas o permitido.
*   **Cenário 3:** Desativar Portal -> Acessar com usuário "Membro" -> Deve receber Acesso Negado.

---

## 5. Arquivos e Pastas Impactados (Estimativa)

**Novos Arquivos:**
*   `src/pages/admin/Transparency/FiscalCouncil.tsx`
*   `src/pages/admin/Transparency/TransparencyPortal.tsx`
*   `src/pages/admin/Transparency/AuditVisualizer.tsx`
*   `src/pages/admin/Settings/TransparencySettings.tsx`
*   `src/api/transparency.ts`
*   `src/hooks/useTransparency.ts`

**Arquivos Existentes para Edição:**
*   `src/components/AdminSidebar.tsx`: Adicionar menu "Transparência" ou "Conselho".
*   `src/App.tsx`: Novas rotas protegidas.
*   `src/api/finance.ts`: Possíveis ajustes para queries de agregação.
*   `supabase/migrations/*`: Script para adicionar `transparency_config` em `churches` ou `church_settings`.

**Documentação:**
*   `docs/SCHEMA_OVERVIEW.md`: Atualizar com novos conceitos.
*   `docs/qa_plan_transparency.md`: Futuro roteiro de testes.

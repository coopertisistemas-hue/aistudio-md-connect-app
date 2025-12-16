# UX & Fluxo: Transparência e Conselho Fiscal (Sprint 12.5)

Este documento define a experiência do usuário (UX), a arquitetura de informação e os fluxos de trabalho para o módulo de Transparência e Conselho Fiscal.

---

## 1. Painel do Conselho Fiscal (`FiscalDashboard`)

**Objetivo:** Proporcionar aos conselheiros uma visão clara, auditável e imutável da saúde financeira da igreja, facilitando reuniões de aprovação de contas.

*   **Localização:** Admin → Finanças → Conselho Fiscal
*   **Público-Alvo:** Membros do Conselho Fiscal, Tesoureiro, Pastor Presidente.

### Estrutura da Tela
1.  **Cabeçalho de Controle:**
    *   **Seletor de Período:** Dropdown para Mensal (padrão), Trimestral, Anual.
    *   **Seletor de Igreja:** (Apenas para SuperAdmin/Organização) Filtrar unidade específica.
    *   **Botão "Gerar Relatório Oficial":** Ação principal para gerar o PDF da reunião.

2.  **Cartões de KPI (Big Numbers):**
    *   **Entradas:** Valor total + Variação vs. Mês Anterior (%).
    *   **Saídas:** Valor total + Variação vs. Mês Anterior (%).
    *   **Saldo Operacional:** Resultado do período.
    *   **Saldo em Caixa:** Saldo acumulado real (banco + caixa).

3.  **Gráficos de Análise:**
    *   **Evolução Semestral:** Gráfico de barras (Entrada x Saída) dos últimos 6 meses para identificar tendências visuais.
    *   **Composição de Saídas:** Gráfico de Rosca (Donut) com Top 5 categorias de despesas (ex.: Pessoal, Manutenção, Missões).

4.  **Bloco "Pontos de Atenção" (Inteligência):**
    *   Lista de alertas automáticos:
        *   "Despesas com 'Manutenção' subiram 40% este mês."
        *   "3 lançamentos acima de R$ 1.000,00 sem anexo de comprovante."
        *   "Dízimos caíram 15% em relação à média anual."

5.  **Tabela de Fechamentos Mensais:**
    *   Lista histórica dos meses anteriores com status: `Aberto`, `Em Revisão`, `Fechado`.
    *   Ação: Clicar para ver o "Snapshot" imutável daquele mês.

### Jornada do Usuário (Fluxo Típico)
1.  **Antes da Reunião:** O Tesoureiro acessa o painel, verifica se todos os lançamentos do mês passado estão categorizados e resolve os "Pontos de Atenção" (anexando recibos faltantes).
2.  **Na Reunião:** O Conselho acessa o painel (pode ser em modo "leitura"), analisa os gráficos de tendência e questiona as variações bruscas apontadas pelo sistema.
3.  **Aprovação:** Se tudo estiver ok, o Tesoureiro clica em "Fechar Mês". O sistema gera o snapshot imutável em `finance_monthly_reports` e o status muda para `Fechado`.

---

## 2. Portal de Transparência (`TransparencyPortal`)

**Objetivo:** Uma visão simplificada e pedagógica das finanças para stakeholders não-técnicos (liderança ou membros), focada na "aplicação dos recursos" e não na contabilidade fria.

*   **Localização:** Admin → Finanças → Portal de Transparência
*   **Público-Alvo:** Liderança, Membros (se habilitado).

### Estrutura da Tela (Preview/Admin)
1.  **Barra de Configuração Rápida:**
    *   Switch: "Modo Público" (Ativo/Inativo).
    *   Seletor: "Nível de Detalhe" (Resumido/Detalhado).

2.  **Cabeçalho Institucional (Configurável):**
    *   Espaço para texto de boas-vindas ou "Palavra do Tesoureiro" (vindo de `transparency_contents`).
    *   Intenção: Explicar a visão bíblica/estratégia por trás dos números.

3.  **Visualização "Destino dos Recursos":**
    *   Em vez de "Despesas", usa-se termos como "Investimentos do Reino".
    *   Gráfico de Pizza amigável:
        *   "30% Missões e Social"
        *   "40% Estrutura e Templo"
        *   "30% Pessoal e Ministérios"

4.  **Galeria de Projetos (Opcional):**
    *   Cards mostrando arrecadação para projetos específicos (ex.: "Reforma do Telhado", "Campanha de Missões").
    *   Barra de progresso: Arrecadado vs. Alvo.

### Jornada do Usuário
1.  **Configuração:** O Pastor define que quer transparência para a Liderança. Ele escreve um texto explicando que o foco do ano é "Expansão".
2.  **Acesso:** Um líder de jovens entra no sistema, vai ao Portal e vê que, apesar das despesas altas, grande parte foi para a reforma da sala dos jovens. Ele entende o valor do gasto.

---

## 3. Auditoria Financeira Visual (`AuditVisualizer`)

**Objetivo:** Rastreabilidade total e visual de alterações em dados sensíveis, inibindo fraudes e erros operacionais.

*   **Localização:** Admin → Finanças → Auditoria
*   **Público-Alvo:** Conselho Fiscal, Auditores Externos, SuperAdmin.

### Estrutura da Tela
1.  **Timeline de Eventos:**
    *   Lista vertical cronológica (estilo feed de rede social).
    *   Cada item mostra:
        *   Avatar do Usuário + Ação (ex.: "José editou uma Saída").
        *   Data/Hora relativa (ex.: "há 2 horas").
        *   Badge de Criticidade (Baixa/Média/Alta).

2.  **Visual Diff (O Diferencial):**
    *   Ao expandir um item de edição, mostra-se o "Antes e Depois" lado a lado.
        *   *Antes:* Valor: R$ 100,00 | Categoria: Limpeza
        *   *Depois:* Valor: **R$ 1.000,00** | Categoria: **Manutenção**
        *   Campos alterados ficam destacados em amarelo/vermelho.

3.  **Filtros Avançados de Auditoria:**
    *   "Mostrar apenas exclusões" (Risco alto).
    *   "Mostrar alterações feitas pelo usuário X".
    *   "Mostrar alterações fora do horário comercial".

4.  **Ações de Governança:**
    *   Botão "Marcar como Revisado" em eventos críticos.
    *   Botão "Criar Anotação" (abre modal para inserir registro em `audit_annotations`).

### Jornada do Usuário
1.  **Suspeita:** O Conselho nota uma despesa estranha de R$ 500,00 em "Material de Escritório".
2.  **Investigação:** Acessam a Auditoria, filtram por essa categoria e veem que o usuário "Secretária" alterou o valor de R$ 50,00 para R$ 500,00 às 23h da noite.
3.  **Sinalização:** O Conselho clica em "Criar Anotação", marca como `severity: high` e escreve "Valor alterado sem justificativa. Verificar com secretária".

---

## 4. Configurações de Transparência (`TransparencySettings`)

**Objetivo:** Centralizar as regras de negócio sobre quem vê o quê.

*   **Localização:** Admin → Configurações → Transparência

### Estrutura da Tela
1.  **Níveis de Acesso (Radio Cards):**
    *   **Privado:** Apenas Admins e Tesoureiros (Padrão).
    *   **Conselho:** Libera acesso ao `FiscalDashboard` para perfil 'Conselho'.
    *   **Liderança:** Libera acesso ao `TransparencyPortal` para 'Líderes'.
    *   **Membros:** Libera o Portal no App do Membro.

2.  **Chaves de Exibição (Toggles):**
    *   [ ] Mostrar Saldo em Caixa (Geralmente desativado para segurança).
    *   [x] Mostrar Detalhe de Entradas (Dízimos/Ofertas separados).
    *   [x] Mostrar Auditoria para o Conselho.

3.  **Editor de Conteúdo Institucional:**
    *   Editor de texto rico (Markdown/WYSIWYG) para editar os textos de `transparency_contents` (ex.: "Nossa Política Financeira").

### Integrações
*   **App do Membro:** Se a opção "Membros" estiver ativa, um novo card "Transparência" aparece na Home do App Mobile, carregando a visão do Portal.
*   **Notificações:** Alterações em configurações de transparência geram logs de auditoria críticos.

---

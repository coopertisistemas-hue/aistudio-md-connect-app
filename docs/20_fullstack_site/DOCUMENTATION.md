# Documentação Técnica do Projeto IPDA Connect

Este documento detalha a estrutura de rotas, o modelo de dados (baseado nos tipos TypeScript) e o guia de estilo visual do projeto.

## 1. Mapa de Rotas e Acesso

| Rota | Descrição | Acesso Requerido (Role) | Layout |
| :--- | :--- | :--- | :--- |
| `/` | Redirecionamento inicial baseado na Role | Qualquer (Autenticado) | N/A |
| `/login` | Tela de Login | Público | N/A |
| `/register` | Tela de Cadastro | Público | N/A |
| `/public/home` | Home Page (Site Público) | Público | PublicLayout |
| `/public/events` | Agenda de Eventos Pública | Público | PublicLayout |
| `/public/events/:id` | Detalhes do Evento Público | Público | PublicLayout |
| `/public/status` | Status do Serviço | Público | PublicLayout |
| `/public/ranking` | Ranking de Engajamento | Público | PublicLayout |
| `/app/home` | Home Page (App Membro) | Membro, Pastor, Admin | MemberLayout |
| `/app/bible` | Bíblia Sagrada | Membro, Pastor, Admin | MemberLayout |
| `/app/harp` | Harpa Cristã | Membro, Pastor, Admin | MemberLayout |
| `/app/churches` | Lista de Igrejas | Membro, Pastor, Admin | MemberLayout |
| `/app/profile` | Perfil do Usuário | Membro, Pastor, Admin | MemberLayout |
| `/app/inbox` | Caixa de Entrada (Notificações) | Membro, Pastor, Admin | MemberLayout |
| `/app/exclusive` | Conteúdo Exclusivo | Membro, Pastor, Admin | MemberLayout |
| `/admin/dashboard` | Visão Geral e KPIs | Pastor, Admin | AdminLayout |
| `/admin/users` | Gestão de Usuários | Pastor, Admin (via Permissão) | AdminLayout |
| `/admin/ministries` | Gestão de Ministérios | Pastor, Admin (via Permissão) | AdminLayout |
| `/admin/ministry-performance` | Desempenho de Ministérios | Pastor, Admin (via Permissão) | AdminLayout |
| `/admin/churches` | Gestão de Igrejas | SuperAdmin | AdminLayout |
| `/admin/content` | Gestão de Notícias/Artigos | Pastor, Admin (via Permissão) | AdminLayout |
| `/admin/events` | Gestão de Agenda de Eventos | Pastor, Admin (via Permissão) | AdminLayout |
| `/admin/finance` | Gestão Financeira | Pastor, Admin (via Permissão) | AdminLayout |
| `/admin/kanban` | Kanban de Tarefas | Pastor, Admin (via Permissão) | AdminLayout |
| `/admin/tracking` | Tracking Externo (Urubici) | Pastor, Admin (via Permissão) | AdminLayout |
| `/admin/modules` | Gerenciamento de Módulos | Pastor, Admin (via Permissão) | AdminLayout |
| `/admin/inbox` | Caixa de Entrada Pública | Pastor, Admin (via Permissão) | AdminLayout |
| `/admin/webhooks` | Integrações/Webhooks | SuperAdmin | AdminLayout |
| `/admin/audit-log` | Log de Auditoria | SuperAdmin | AdminLayout |
| `/admin/access-denied` | Acesso Negado (403) | Qualquer (Autenticado) | AdminLayout |
| `/admin/support` | Ajuda e Suporte | Pastor, Admin | AdminLayout |
| `*` | 404 Not Found | N/A | N/A |

---

## 2. Estrutura do Banco de Dados (Entidades Principais)

A estrutura abaixo reflete os tipos definidos em `src/types/index.ts` e `src/schemas/user.ts`.

### Entidade: Usuário (`UserTableEntry`)

| Campo | Tipo | Descrição | Notas |
| :--- | :--- | :--- | :--- |
| `id` | string | ID único do usuário. | |
| `churchId` | string | ID da igreja/congregação. | Usado para multi-tenancy. |
| `role` | 'Membro' \| 'Pastor' \| 'SuperAdmin' | Nível de acesso do usuário. | |
| `name` | string | Nome completo. | |
| `email` | string | Email de login. | |
| `status` | 'Ativo' \| 'Inativo' \| 'Pendente' | Status da conta. | |
| `details` | Objeto (`UserDetails`) | Dados detalhados da ficha cadastral. | |
| `details.phone` | string | Telefone/WhatsApp. | |
| `details.birthDate` | string (YYYY-MM-DD) | Data de nascimento. | |
| `details.cpf` | string | CPF. | |
| `details.street`, `details.number`, etc. | string | Campos de endereço. | |
| `details.congregation` | string | Congregação de vínculo. | |
| `details.churchFunction` | string | Função na igreja (ex: Obreiro). | |
| `details.baptismDate` | string (YYYY-MM-DD) | Data de batismo. | |
| `details.ministries` | string[] | IDs dos ministérios que o membro participa. | |
| `permissions` | Objeto (Simulado) | Permissões de acesso a módulos. | |

### Entidade: Conteúdo (`ContentEntry`)

| Campo | Tipo | Descrição | Notas |
| :--- | :--- | :--- | :--- |
| `id` | string | ID único do conteúdo. | |
| `title` | string | Título da notícia/artigo. | |
| `subtitle` | string | Subtítulo opcional. | |
| `author` | string | Nome do autor. | |
| `publishDate` | string (YYYY-MM-DD) | Data de publicação. | |
| `status` | 'Rascunho' \| 'Publicado' | Status de visibilidade. | |
| `contentBody` | string | Corpo do artigo (HTML/Markdown). | |
| `featuredImage` | string | URL da imagem de destaque. | |

### Entidade: Evento (`EventEntry`)

| Campo | Tipo | Descrição | Notas |
| :--- | :--- | :--- | :--- |
| `id` | string | ID único do evento. | |
| `name` | string | Nome do evento. | |
| `description` | string | Descrição detalhada. | |
| `startDate` | string (YYYY-MM-DDTHH:MM) | Data e hora de início. | |
| `endDate` | string (YYYY-MM-DDTHH:MM) | Data e hora de fim. | |
| `location` | string | Local do evento. | |
| `status` | 'Agendado' \| 'Cancelado' \| 'Realizado' | Status do evento. | |
| `coverImage` | string | URL da imagem de capa. | |

---

## 3. Manual de Boas Práticas e Guia de Estilo

O projeto utiliza o framework **Tailwind CSS** com a biblioteca de componentes **Shadcn/ui**, garantindo um design moderno e responsivo.

### Checklist de Produção (V1.0)

1.  **Segurança de Endpoints:** Todos os endpoints de API e Webhooks devem usar **HTTPS** em produção.
2.  **Secrets:** Chaves de API (ex: WhatsApp, E-mail) devem ser armazenadas em **variáveis de ambiente (secrets)** e nunca em código fonte.
3.  **Timezone:** O servidor deve ser configurado para usar o fuso horário `America/Sao_Paulo` para garantir a consistência de datas e horários em logs, eventos e escalas.
4.  **Logs de Debug:** Logs de console desnecessários foram removidos do front-end.

### Cores Principais (Definidas em `src/globals.css` e `tailwind.config.ts`)

| Variável CSS | Descrição | Uso Típico |
| :--- | :--- | :--- |
| `--primary` | Cor principal do tema (Dark Blue/Indigo). | Botões primários, links ativos, títulos. |
| `--secondary` | Cor secundária/suporte. | Backgrounds de cards, botões secundários. |
| `--background` | Cor de fundo principal da aplicação. | Corpo da página. |
| `--foreground` | Cor do texto principal. | |
| `--destructive` | Cor de alerta/erro (Vermelho). | Botões de exclusão, mensagens de erro. |
| `--accent` | Cor de destaque sutil. | Hover states, backgrounds de seções. |

### Tipografia

*   **Fontes:** Utiliza a fonte padrão do sistema (sans-serif).
*   **Títulos:** Classes `text-3xl`, `font-bold` ou `font-extrabold` para títulos de página.
*   **Corpo:** `text-base` ou `text-sm` com `text-foreground` ou `text-muted-foreground` para texto secundário.

### Estilo de Componentes

*   **Bordas:** O raio de borda padrão é `var(--radius)` (0.5rem), aplicado a todos os botões, inputs e cards.
*   **Cards:** Utilizam a estrutura `Card`, `CardHeader`, `CardTitle`, `CardContent` para consistência de layout e sombra.
*   **Inputs/Botões:** Todos os elementos de formulário utilizam os componentes Shadcn/ui, garantindo padding, altura e estados de foco uniformes.
*   **Responsividade:** O design é **Mobile-First**. Layouts complexos (como o Kanban e as Tabelas de Admin) utilizam `overflow-x-auto` ou layouts de coluna (`grid-cols-1 md:grid-cols-X`) para se adaptar a diferentes tamanhos de tela.
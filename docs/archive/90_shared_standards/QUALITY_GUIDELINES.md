# IPDA Connect / Momento Devocional – Padrões de Excelência

> “E tudo quanto fizerdes, fazei-o de todo o coração, como ao Senhor e não aos homens.”  
> Colossenses 3:23

Este documento define os padrões de qualidade para tudo o que for desenvolvido no ecossistema IPDA Connect / Momento Devocional.

## 1. Propósito

- Usar tecnologia moderna como **braço de apoio** ao crescimento da Obra do Senhor Jesus.
- Entregar sistemas que sejam:
  - **Confiáveis** (estáveis e seguros)
  - **Bonitos** (UX/UI agradável, acessível)
  - **Simples de usar** (para igreja real, não só para tech).

---

## 2. Pilares de Excelência

1. **Excelência Técnica**
   - Arquitetura limpa, modular, com separação clara de camadas.
   - Reaproveitamento de componentes (nada de copiar/colar tela de CRUD inteira).
   - Migrations versionadas, RLS bem definida, sem “gambiarras” diretas no banco.
   - Tipagem forte (TypeScript) em tudo que for possível.

2. **Experiência do Usuário (UX/UI)**
   - Mobile-first, mas sem descuidar do desktop.
   - Layouts consistentes (mesmo “feeling” entre Delivery Connect, MD, painel admin e app web cliente).
   - Navegação previsível: o usuário sempre sabe onde está e como voltar.
   - Estados bem tratados: loading, vazio, erro, sucesso.

3. **Segurança & LGPD**
   - Apenas 1 sessão por usuário por vez.
   - RLS em todas as tabelas sensíveis.
   - Dados de membros sempre protegidos, sem exportação aberta por padrão.
   - Consentimentos explícitos para comunicação e visibilidade de dados.

4. **Alinhamento Espiritual**
   - Linguagem respeitosa, cristocêntrica.
   - Versículos e frases que apontem para a Palavra, não para o sistema.
   - Nada de abusar de notificações ou “gatilhos de marketing” que pareçam manipuladores.
   - Lembrar sempre: **pessoas são ovelhas, não “leads”**.

---

## 3. Padrões para Landing Pages (LP)

Aplicável à LP Momento Devocional e futuras LPs de produtos Connect.

- **Hero forte, claro e cristão**
  - Explicar em 1–2 frases o que é o projeto.
  - Ter sempre um versículo ou referência bíblica em algum ponto da página.
- **Narrativa em blocos**
  - Para quem é → O que é → Funcionalidades → Benefícios → Como funciona → DOE/apoio.
- **CTAs bem definidos**
  - Máximo de 2 CTAs principais por dobra:
    - Ação espiritual (saber mais / falar com a equipe).
    - Ação de apoio (DOE / contribuir).
- **Visual**
  - Aproveitar padrão Connect: cards, ícones, grids, seções bem separadas.
  - Sempre responsivo (verificar em 320px, 768px, 1024px).
- **Performance**
  - Imagens otimizadas, sem carregar peso desnecessário.
  - Nada de scripts de terceiros descontrolados.

Checklist rápido antes de publicar:
- [ ] Faz sentido para alguém que nunca ouviu falar do projeto?
- [ ] Cristo e a Palavra aparecem de forma clara (sem exagero emocional, mas com verdade)?
- [ ] CTAs são claros?
- [ ] Está bonito e fluido em mobile?

---

## 4. Padrões para CRUDs no Painel Admin

Objetivo: evitar “CRUD Frankenstein” e manter tudo moderno, limpo e padronizado.

### 4.1. Arquitetura

- Cada módulo (ex.: `members`, `church_units`, `pastoral_followups`) deve ter:
  - Pasta própria em `src/app/(admin)/[modulo]`.
  - Componentes reutilizáveis em `src/components/admin/[modulo]`.
  - Hooks ou serviços de dados em `src/lib/api/[modulo]` ou similar.

### 4.2. UX dos CRUDs

- **Listagem**
  - Barra de busca + filtros essenciais.
  - Ações claras: “Novo”, “Ver”, “Editar”.
  - Colunas relevantes, nada poluído.
- **Formulários**
  - Agrupar campos em seções: Dados básicos, Dados eclesiásticos, Contatos, LGPD.
  - Validação com feedback claro (mensagens legíveis para humano, não só dev).
  - Botões: “Salvar”, “Cancelar/Voltar”.
- **Feedback**
  - Toasts para sucesso/erro.
  - Spinners ou skeletons para loading.

### 4.3. Qualidade do Código

- Nada de lógica pesada dentro do componente de página:
  - Usar hooks / serviços para isolar chamadas Supabase.
- Tipos sempre provenientes de `database.types.ts`.
- Erros tratados (try/catch com mensagens úteis).

Checklist de CRUD:
- [ ] Listagem com busca/filtros.
- [ ] Form de criação/edição com validação.
- [ ] Ações de criar/editar/excluir protegidas por permissão (RBAC + RLS).
- [ ] Código dividido em componentes/hook, não tudo em `page.tsx`.

---

## 5. Padrões para o App Web Cliente (Membro)

> Outro projeto, mas mesma filosofia.

### 5.1. Arquitetura

- SPA moderna (React/Vite ou Next App Router), consumindo o mesmo backend.
- Módulos principais:
  - `devocionais`, `biblia`, `mural`, `oracao`, `visitas`, `agenda`, `campanhas`.
- Estado global enxuto:
  - Auth, igreja atual, preferências (idioma, tema).

### 5.2. UX para o Membro

- Home clara:
  - Próximo devocional/destaque.
  - Próximos cultos.
  - Acesso rápido a “Pedido de oração” e “Falar com a Igreja”.
- Navegação tipo “app de verdade”:
  - Bottom nav em mobile (5 abas principais).
- Acessibilidade:
  - Fonte legível.
  - Bom contraste.
  - Componentes clicáveis grandes (dedo, não mouse de dev).

### 5.3. Espiritualidade no App

- Sempre trazer:
  - Versículos, mensagens curtas, devocionais bem escritos.
- Nunca tratar pedido de oração como “ticket de suporte”.
- Linguagem amorosa, firme, bíblica.

---

## 6. Processo de Revisão (antes de subir qualquer fase)

Antes de considerar uma fase “concluída”:

- [ ] Código revisado (olhar de limpeza e padrão).
- [ ] Telas testadas no mínimo em:
  - Desktop (≥ 1280px).
  - Tablet (~768px).
  - Mobile (320–414px).
- [ ] Fluxo principal testado pelo menos 1x de ponta a ponta.
- [ ] Coerência com este documento:
  - Cristo no centro.
  - Excelência técnica.
  - Simplicidade de uso.

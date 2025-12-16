# ROADMAP — FASE 1 (App Web Cliente)

**Objetivo:** Estabelecer a fundação de segurança (Edge Functions) e lançar o núcleo público do App com governança rígida.

> **Regra de Ouro (Golden Master):**
> A Home atual é sagrada. O Hero, o vídeo de background e a primeira dobra NÃO podem ser alterados visualmente sem aprovação explícita e teste de regressão.

---

## Ordem de Execução & Entregas

### 🚀 Sprint 1.1: Fundação de Segurança (Edge & CORS)
*Foco: Infraestrutura invisível.*
- [ ] **Configurar Edge Functions:** Template padrão com validação de JWT e tratamento de erros.
- [ ] **CORS Allowlist:** Bloquear requisições de origens desconhecidas.
- [ ] **Logs de Segurança:** Registrar acessos bloqueados.

### 🔄 Sprint 1.2: Migração de Serviços Críticos (BFF)
*Foco: Remover `supabase.from` do Client.*
- [ ] **Migrar `src/services/church.ts`**: Criar `public_church_detail`, `public_churches_list`.
- [ ] **Migrar `src/services/content.ts`**: Criar `public_devotional_today`, `public_feed`.
- [ ] **Audit:** Garantir ZERO chamadas diretas ao banco no client.

### 🏠 Sprint 2.1: Home Pública (Core)
*Foco: Retenção e Experiência.*
- [ ] **Devocional-First:** Garantir que o card do devocional seja o elemento #1.
- [ ] **Tiles de Navegação:** Botões grandes para Bíblia, Rádio e Igrejas.
- [ ] **PWA:** Manifest e Ícones configurados para instalação.

### 📍 Sprint 2.2: Hub de Igrejas
*Foco: Encontrar uma igreja.*
- [ ] **Listagem:** Busca por cidade e estado via Edge Function.
- [ ] **Detalhe:** Página da igreja com horários e endereço.
- [ ] **Rota:** Botão "Como chegar" (Google Maps).

---

## Definition of Done (DoD)

Para considerar qualquer sprint ou feature **PRONTA**, ela deve atender a:

1.  **Segurança:**
    - [ ] NENHUMA chamada `supabase.from()` no código do client entregue.
    - [ ] Validação de Input (`zod`) em todas as Edge Functions.

2.  **Qualidade de Código:**
    - [ ] **Feature Flags:** Mudanças de risco protegidas por flag (ativo/inativo).
    - [ ] **Reversibilidade:** Commits atômicos que permitem rollback fácil.
    - [ ] Sem erros de console (`F12`) novos.

3.  **Visual (Golden Master):**
    - [ ] A Home Page mantém a integridade do Hero/Vídeo atual.
    - [ ] Responsivo testado em Mobile (375px) e Desktop (1366px).

4.  **Performance:**
    - [ ] Lighthouse Mobile Score > 80 (Performance).
    - [ ] Sem layout shift (CLS < 0.1) na primeira dobra.

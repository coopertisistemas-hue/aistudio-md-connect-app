# QA Checklist — Fase 1

Checklist objetivo de qualidade para validação antes de qualquer merge/deploy.
**Meta:** Garantir que o básico funciona e que o visual "Golden Master" não foi quebrado.

---

## 🎨 1. Visual & Golden Master
- [ ] **Home Hero:** O vídeo de background carrega e roda? O título/texto está legível sobre o vídeo?
- [ ] **Integridade:** NENHUMA quebra visual na primeira dobra (header, menu, hero) comparado à versão anterior.
- [ ] **Espaçamento:** Não há elementos "colados" nas bordas ou sobrepostos.
- [ ] **Imagens:** Todas as imagens carregam (sem ícone de "quebrado").

## 📱 2. Responsividade
- [ ] **Mobile (375px):**
    - [ ] Scroll horizontal indesejado? (Não deve haver).
    - [ ] Botões clicáveis com o dedo (tamanho ok)?
    - [ ] Menu hambúrguer abre/fecha suavemente?
- [ ] **Desktop (1366px+):**
    - [ ] Layout centralizado ou full-width conforme design.
    - [ ] Vídeo ocupa a área correta.

## 🛠️ 3. Console & Erros
- [ ] **Console Limpo:** Abrir F12. Não deve haver erros vermelhos (exceto 404s esperados de API em dev).
- [ ] **React Keys:** Sem avisos de `Warning: Each child in a list should have a unique "key" prop`.
- [ ] **Hydration:** Sem erros de `Hydration failed` (se usar SSR/Next.js).

## ⚡ 4. Performance Básica
- [ ] **Carregamento:** A página abre e fica interativa em < 3 segundos (4G simulado)?
- [ ] **CLS (Pulos):** O layout não "pula" enquanto carrega fontes ou imagens?
- [ ] **Vídeo:** O vídeo de background não trava a rolagem da página?

## 🔗 5. Links & Navegação
- [ ] **Broken Links:** Clique em TODOS os links da tela testada. Nenhum deve dar 404.
- [ ] **Voltar:** O botão "Voltar" (se houver) leva para a tela anterior correta.
- [ ] **Logo:** Clicar no logo leva para a Home.

## ♿ 6. Acessibilidade Mínima
- [ ] **Contraste:** Texto de leitura (corpo) tem contraste suficiente com o fundo?
- [ ] **Alt Text:** Imagens de conteúdo têm descrição (alt)?
- [ ] **Labels:** Botões de ícone (ex: lupa, menu) têm `aria-label` ou texto invisível?

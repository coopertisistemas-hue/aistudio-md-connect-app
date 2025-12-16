# MD Connect - Landing Page Overview

## Propósito
Este documento detalha a refatoração visual e estrutural da Landing Page (`/public/home`) para alinhar-se à identidade do "Momento Devocional" e oferecer uma experiência premium e focada na conversão.

## Estrutura Atualizada

### 1. Header Global (`PublicHeader.tsx`)
*   **Estilo**: Fixo (sticky), fundo branco translúcido com blur.
*   **Branding**: Logo "MD Connect" em gradiente azul + Subtítulo "Gestão e Edificação para Igrejas".
*   **Navegação**: Centralizada (Início, Recursos, Planos, Sobre, Projeto MD).
*   **Ações**: Botão de Login destacado (Pill, Azul Escuro).

### 2. Hero Section (`Home.tsx`)
*   **Background**: Gradiente em tons de azul profundo e lilás (`#0F172A`, `#1D4ED8`, `#EEF2FF`).
*   **Foco Visual**: Elementos de fundo desfocados (blobs) para profundidade.
*   **Mensagem**: "Gestão completa para sua igreja" + Subtítulo focado em benefícios.
*   **Versículo**: Alert Strip com Mateus 6:33.
*   **CTAs**: "Começar grátis (DOE)" e "Quero ser Igreja Parceira".

### 3. Seções de Conteúdo (`Home.tsx`)
*   **Para quem é**: 4 cards (Pastores, Equipes, Igrejas, Membros).
*   **Recursos (Tudo em um só lugar)**: 6 cards detalhando funcionalidades (Eventos, WhatsApp, Pastoral, etc.).
*   **Projeto MD**: Storytelling sobre o propósito espiritual do projeto + Card de estatísticas (Devocionais enviados, Igrejas impactadas).
*   **FAQ**: Acordeão com perguntas sobre gratuidade, LGPD e compatibilidade.

### 4. Rodapé (`PublicFooter.tsx`)
*   **Estilo**: Fundo Azul Profundo (`#1E3A8A`).
*   **Colunas**: 
    1. Logo & Propósito.
    2. Links Rápidos.
    3. Sobre Nós.
    4. Contato.
*   **Copyright**: "© 2025 Momento Devocional" + "Desenvolvido pelo projeto MD".

## Notas Técnicas
*   Todo o estilo utiliza **Tailwind CSS**.
*   Ícones via `lucide-react`.
*   Componentes base do **ShadCN UI** (Button, Sheet, Accordion).
*   Responsividade garantida (Mobile First).

---
*Documento gerado automaticamente após refatoração visual (Dez/2025).*

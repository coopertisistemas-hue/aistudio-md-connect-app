# Funcionalidades por Modulo — MD Connect App

> Gerado a partir dos services, API wrappers, componentes e paginas.
> Ultima atualizacao: 2026-02-07

---

## 1. Biblia

| Funcionalidade | Descricao |
|----------------|-----------|
| Leitura por capitulo | Exibe capitulos completos com navegacao anterior/proximo. Traducao Almeida via API externa. |
| Reacoes por versiculo | Toggle "Amem" em versiculos individuais com contagem visivel por capitulo. |
| Comentario teologico | Modal com contexto historico, insights teologicos, aplicacao pratica e referencias cruzadas. Busca no banco, fallback para geracao via IA. |
| Audio do versiculo | Sintese de voz (Web Speech API) com selecao automatica de voz PT-BR. Controles de play/pause/resume. |
| Copiar versiculo | Copia texto + referencia para a area de transferencia. |
| Compartilhar versiculo | Compartilhamento via Web Share API ou fallback WhatsApp. |
| Progresso de leitura | Salva ultimo livro/capitulo lido em localStorage. |
| Metadados dos livros | Contexto historico, temas e aplicacoes para os 66 livros (seed no banco). |

---

## 2. Devocionais

| Funcionalidade | Descricao |
|----------------|-----------|
| Devocional do dia | Exibe devocional diario com versiculo-chave, reflexao guiada, aplicacao pratica e oracao. |
| Lista de devocionais | Listagem paginada de devocionais publicados (publico e por igreja). |
| Renderizacao rica | Parser de markdown que detecta referencias biblicas e as torna clicaveis. Secoes visuais distintas (versiculo, reflexao, aplicacao, oracao, leituras). |
| Audio do devocional | Gera texto completo para sintese de voz com correcao de abreviacoes e pronuncia. |
| Reacao "Amem" | Toggle de reacao autenticada e anonima com contagem de "amem" e visualizacoes do dia. |
| Registro de leitura | Grava leitura no banco (deduplicada por usuario + devocional + data). Leituras anonimas via session_hash. |
| Compartilhamento | Compartilha devocional com imagem de capa via Web Share API ou link WhatsApp com formatacao markdown. |
| Traducoes | Suporte multi-idioma via tabela `devotional_translations`. |

---

## 3. Oracao e Pedidos

| Funcionalidade | Descricao |
|----------------|-----------|
| Criar pedido | Formulario com categoria (saude, familia, espiritual, financeiro, gratidao, libertacao, direcao, outros), urgencia (normal/urgente) e descricao. |
| Privacidade | Tres niveis: publico, somente equipe ou anonimo. |
| Metodo de contato | Opcoes: somente app, e-mail ou WhatsApp. Requer consentimento explicito. |
| Protocolo de acompanhamento | Numero de protocolo gerado apos envio. Link copiavel para acompanhamento. |
| Feed de pedidos | Lista paginada de pedidos publicos com filtro por urgencia e gratidao. |
| Reacao "Estou orando" | Toggle com contagem. UI otimista com rollback em caso de erro. |
| Confirmacao por e-mail | Dispara Edge Function de confirmacao apos criacao. |
| Pre-visualizacao | Modo de preview antes do envio final. |

---

## 4. Planos de Leitura

| Funcionalidade | Descricao |
|----------------|-----------|
| Lista de planos | Exibe planos de leitura disponiveis na igreja. |
| Detalhe do plano | Titulo, descricao, barra de progresso e checklist de dias. |
| Progresso individual | Marca dias como concluidos (toggle unidirecional). Sincronizado via Edge Function. |
| Carregamento paralelo | Busca plano, dias e progresso simultaneamente. |

---

## 5. Series e Mensagens

| Funcionalidade | Descricao |
|----------------|-----------|
| Lista de series | Exibe series de mensagens/pregacoes da igreja. |
| Detalhe da serie | Titulo, descricao e lista de mensagens vinculadas. |
| Detalhe da mensagem | Conteudo da mensagem com suporte a video e audio (URL, duracao). |
| Historico de conteudo | Registro de conteudos lidos/assistidos pelo usuario. |
| Marcar como lido | Registra consumo de conteudo via Edge Function. |

---

## 6. Igreja e Comunidade

| Funcionalidade | Descricao |
|----------------|-----------|
| Perfil da igreja | Nome, logo, endereco, horarios de culto e cor tema. Carregado via slug na URL. |
| Hub de igrejas | Listagem publica de igrejas com busca por cidade/estado. |
| Avisos (mural) | Lista de avisos com suporte a fixacao, prioridade e data de expiracao. |
| Detalhe do aviso | Visualizacao completa de um aviso individual. |
| Feed unificado | Agregacao de posts (noticias, devocionais, avisos, eventos, lives) com prioridade e CTAs. |
| Vitrine "Sou Igreja" | Pagina publica para atrair novas igrejas a plataforma. |
| Implantacao | Pagina com informacoes sobre como aderir ao MD Connect. |

---

## 7. Eventos e Agenda

| Funcionalidade | Descricao |
|----------------|-----------|
| Lista de eventos | Eventos da igreja com tipo (culto, reuniao, visita, vigilia, ensaio), local e horarios. |
| Detalhe do evento | Informacoes completas com CTA (link, WhatsApp, rota). |
| Agenda publica | Versao publica da agenda para visitantes. |
| Proximo evento | Widget na home exibindo o proximo evento agendado. |

---

## 8. Monetizacao e Parceiros

| Funcionalidade | Descricao |
|----------------|-----------|
| Vitrine de parceiros | Exibe parceiros com logo, tagline e link. Tiers: standard, gold, platinum. |
| Vitrine de servicos | Lista de servicos oferecidos pela plataforma (B2B). |
| Detalhe do servico | Pagina individual com descricao completa. |
| Rastreamento de cliques | Registra impressoes, cliques e interacoes WhatsApp com atribuicao de contexto/fonte. Fire-and-forget. |
| Captacao de leads | Formulario para novos parceiros (nome, WhatsApp, mensagem). |
| Pagina de doacao | CTA para contribuicao financeira com integracao WhatsApp. |
| Transparencia | Pagina publica com prestacao de contas. |

---

## 9. Poster de Versiculo

| Funcionalidade | Descricao |
|----------------|-----------|
| Criacao de poster | Gerador de imagem (1080x1350, 4:5) com texto de versiculo e referencia. |
| Templates visuais | 4 templates pre-definidos (Sunset, Midnight, Clean, Royal) com cores e fontes proprias. |
| Fundo gerado por IA | 8 estilos de fundo via Edge Function (natureza, epico, minimalista, aquarela, etc.). Controlado por feature flag. |
| Download e compartilhamento | Exporta canvas como imagem. Compartilha via Web Share API. |

---

## 10. Radio

| Funcionalidade | Descricao |
|----------------|-----------|
| Player de streaming | Player HTML5 com play/pause, controle de volume e mute. |
| Configuracao dinamica | URL do stream e nome da estacao carregados do backend. |
| Tratamento de erros | Mensagem de reconexao em caso de falha no stream. Fallback mock em dev. |
| Rastreamento | Evento de analytics ao iniciar reproducao. |

---

## 11. Perfil e Privacidade

| Funcionalidade | Descricao |
|----------------|-----------|
| Hub do perfil | Dashboard com avatar, nome, funcao/vinculo e menu de acoes. |
| Edicao de perfil | Alteracao de nome, foto e dados de contato. |
| Central de privacidade (LGPD) | Toggles para visibilidade de: telefone/WhatsApp, e-mail, aniversario e endereco no diretorio da igreja. |
| Logout | Encerramento de sessao via Supabase Auth. |

---

## 12. Autenticacao e Onboarding

| Funcionalidade | Descricao |
|----------------|-----------|
| Login/Cadastro | Autenticacao por e-mail e senha via Supabase Auth. |
| Selecao de igreja | Tela pos-login para vincular usuario a uma igreja. |
| Contexto seguro | `auth-me` retorna perfil + church_id + permissoes. Client nao confia em localStorage. |
| Telas de status | Telas de aprovacao pendente, acesso negado, nao-membro e login como convidado. |

---

## 13. Paginas Institucionais

| Funcionalidade | Descricao |
|----------------|-----------|
| Paginas de conteudo | Paginas genericas renderizadas por slug (entenda, privacidade, termos, ajuda, transparencia). |
| Missao e valores | Pagina institucional dedicada. |
| Estudos | Pagina de materiais de estudo biblico. |
| Placeholders | Paginas "em breve" para modulos futuros (Louvor, Harpa Crista, Letras). |

---

## 14. Analytics e Observabilidade

| Funcionalidade | Descricao |
|----------------|-----------|
| Google Analytics 4 | Page views, cliques de navegacao, CTAs, uso de features, status de login. |
| Analytics backend | Eventos fire-and-forget via Edge Function com suporte a UTM (source, medium, campaign). |
| KPIs | Views materializadas: KPI diario (views, sessoes, top pages) e KPI de parceiros (views, cliques, CTR). |
| Reporte de erros | Captura automatica de erros JS e rejeicoes de promise. Deduplicacao por fingerprint (janela 60s). Sanitiza PII. |
| Identidade | ID anonimo persistente + session ID rotativo (24h). Usado por analytics e error reporting. |

---

## 15. Feature Flags

| Flag | Modulo | Status |
|------|--------|--------|
| `FEATURE_HOME_QUICK_ACTIONS` | Home | Ativo |
| `FEATURE_HOME_PARTNERS_SECTION` | Home | Ativo |
| `FEATURE_HOME_DONATE_SECTION` | Home | Ativo |
| `FEATURE_DEVOTIONAL_V1` | Devocionais | Ativo |
| `FEATURE_PRAYER_REQUESTS_V1` | Oracao | Ativo |
| `FEATURE_DEVOTIONAL_API` | Devocionais | Ativo |
| `FEATURE_PRAYER_API` | Oracao | Ativo |
| `FEATURE_DEVOTIONAL_SUPPORT_BLOCK` | Devocionais | Ativo |
| `FEATURE_DEVOTIONAL_SPONSOR_HIGHLIGHT` | Devocionais | Ativo |
| `FEATURE_SUPPORT_FOOTER` | Layout | Ativo |
| `FEATURE_HOME_RETURN_PILL` | Navegacao | Ativo |
| `FEATURE_DONATE_PAGE` | Monetizacao | Ativo |
| `FEATURE_PARTNERS_API` | Monetizacao | Ativo |
| `FEATURE_PARTNER_LEADS` | Monetizacao | Ativo |
| `FEATURE_VERSE_POSTER_V1` | Poster | Ativo |
| `FEATURE_VERSE_POSTER_AI_BG` | Poster | Ativo |

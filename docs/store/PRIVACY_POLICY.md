# Politica de Privacidade — MD Connect

**Ultima atualizacao:** 7 de fevereiro de 2026
**Versao:** 1.0

O MD Connect ("nos", "nosso", "app") e uma plataforma cristã para devocionais diarios, leitura biblica, oracao e comunidade. Esta politica descreve quais dados coletamos, por que coletamos e como voce pode controla-los.

---

## 1. Dados que coletamos

### 1.1 Dados fornecidos por voce

| Dado | Quando | Obrigatorio |
|------|--------|-------------|
| E-mail e senha | Ao criar conta | Sim (para login) |
| Nome | Ao completar perfil | Sim |
| Telefone/WhatsApp | Ao editar perfil ou solicitar contato em pedido de oracao | Nao |
| Igreja vinculada | Ao selecionar igreja no onboarding | Sim (para area autenticada) |
| Pedido de oracao (texto) | Ao enviar pedido | Sim (para a funcionalidade) |
| Categoria, urgencia e privacidade do pedido | Ao enviar pedido | Sim |
| Metodo de contato preferido (app, e-mail ou WhatsApp) | Ao enviar pedido com contato | Nao |
| Nome e WhatsApp de parceiro | Ao preencher formulario de parceria | Sim (para a funcionalidade) |

### 1.2 Dados coletados automaticamente

| Dado | Finalidade | Armazenamento |
|------|-----------|---------------|
| ID anonimo (`anon_id`) | Identificar o dispositivo sem vincular a conta. Nunca muda. | localStorage do navegador |
| ID de sessao (`session_id`) | Agrupar acoes dentro de uma visita. Renova a cada 24 horas. | localStorage do navegador |
| Paginas visitadas e acoes (cliques, visualizacoes) | Analytics de uso agregado | Google Analytics 4 + banco proprio |
| Parametros UTM (source, medium, campaign) | Atribuicao de campanhas | sessionStorage do navegador + banco |
| Erros do aplicativo (mensagem, stack trace, rota, navegador) | Correcao de bugs e estabilidade | Banco proprio |
| Progresso de leitura biblica (livro, capitulo) | Retomar leitura onde parou | localStorage do navegador (somente local) |
| Cache da igreja (nome, slug, dados publicos) | Evitar recarregamentos desnecessarios | localStorage do navegador |
| User agent (tipo de navegador e sistema operacional) | Diagnostico de erros | Banco proprio (vinculado ao erro) |

### 1.3 Dados que NAO coletamos

- Localizacao geografica (GPS)
- Lista de contatos
- Fotos, camera ou microfone (exceto se voce iniciar a funcionalidade de poster de versiculo)
- Dados financeiros ou de pagamento (doacoes sao redirecionadas para canais externos)
- Perfil comportamental para venda a terceiros

---

## 2. Finalidade de cada coleta

| Finalidade | Dados utilizados | Base legal (LGPD) |
|-----------|-----------------|-------------------|
| Autenticacao e acesso a area da igreja | E-mail, senha, church_id | Execucao de contrato (Art. 7, V) |
| Exibicao do perfil na comunidade | Nome, funcao, foto | Consentimento (Art. 7, I) |
| Envio e acompanhamento de pedidos de oracao | Texto do pedido, categoria, contato | Consentimento (Art. 7, I) |
| Analytics de uso (quais funcionalidades sao mais usadas) | Paginas, cliques, sessao, UTM | Interesse legitimo (Art. 7, IX) |
| Correcao de erros e estabilidade | Erro, stack, rota, navegador, anon_id | Interesse legitimo (Art. 7, IX) |
| Rastreamento de cliques em parceiros | Clique, parceiro_id, contexto | Interesse legitimo (Art. 7, IX) |
| Captacao de leads para parceria | Nome, WhatsApp | Consentimento (Art. 7, I) |
| Retomar leitura biblica | Livro, capitulo (local) | Interesse legitimo (Art. 7, IX) |

---

## 3. Compartilhamento de dados

### Com quem compartilhamos

| Terceiro | Dados compartilhados | Finalidade |
|----------|---------------------|-----------|
| **Google Analytics (Google LLC)** | Eventos de uso anonimizados (paginas, cliques, sessao) | Analytics agregado |
| **Supabase Inc.** | Todos os dados do banco (infraestrutura) | Hospedagem e autenticacao |

### O que NAO fazemos

- **Nao vendemos** dados pessoais a terceiros
- **Nao compartilhamos** pedidos de oracao com entidades externas
- **Nao criamos** perfil comportamental para publicidade direcionada
- **Nao transferimos** dados para paises sem protecao adequada, exceto para a infraestrutura (Supabase nos EUA, Google nos EUA), com base em clausulas contratuais padrao

---

## 4. Armazenamento local (navegador)

O app armazena dados no seu navegador para funcionar corretamente:

| Chave | Conteudo | Expiracao |
|-------|----------|-----------|
| `md_anon_id` | UUID anonimo do dispositivo | Nunca (permanente) |
| `md_session_id` | UUID da sessao | 24 horas |
| `md_session_started_at` | Timestamp de inicio da sessao | 24 horas |
| Cache da igreja | Dados publicos da igreja vinculada | Ate novo login |
| Progresso biblico | Ultimo livro e capitulo lido | Ate limpeza manual |
| `analytics_session_id` | ID de sessao para analytics | Ate fechar o navegador |
| Parametros UTM | source, medium, campaign | Ate fechar o navegador |

Voce pode limpar esses dados a qualquer momento nas configuracoes do navegador (Limpar dados do site).

---

## 5. Retencao de dados

| Tipo de dado | Periodo de retencao |
|-------------|---------------------|
| Conta e perfil | Enquanto a conta existir |
| Pedidos de oracao | 12 meses apos criacao (ou ate exclusao pelo usuario) |
| Eventos de analytics | 24 meses |
| Relatorios de erro | 6 meses |
| Leads de parceria | 12 meses apos envio |
| Reacoes (amem, orando) | Enquanto a conta existir |

Apos o periodo de retencao, os dados sao anonimizados ou excluidos automaticamente.

---

## 6. Seus direitos (LGPD Art. 18)

Como titular dos dados, voce tem direito a:

- **Acesso** — saber quais dados temos sobre voce
- **Correcao** — corrigir dados incompletos ou incorretos
- **Exclusao** — solicitar a remocao dos seus dados pessoais
- **Portabilidade** — receber seus dados em formato estruturado
- **Revogacao de consentimento** — retirar permissoes a qualquer momento
- **Informacao** — saber com quem compartilhamos seus dados

### Controles disponiveis no app

- **Central de Privacidade** (`Perfil > Privacidade`): controle de visibilidade de telefone, e-mail, aniversario e endereco no diretorio da igreja
- **Exclusao de conta**: disponivel em `Perfil > Privacidade > Excluir minha conta`

---

## 7. Exclusao de conta e dados

Voce pode solicitar a exclusao da sua conta a qualquer momento:

1. Acesse **Perfil > Privacidade > Excluir minha conta**
2. Confirme a solicitacao no modal de confirmacao
3. Sua conta sera marcada para exclusao
4. Apos **30 dias** de carencia, todos os dados pessoais serao removidos ou anonimizados
5. Voce recebera um e-mail confirmando a exclusao

**Dados removidos na exclusao:**
- Perfil (nome, e-mail, telefone, endereco)
- Pedidos de oracao vinculados a sua conta
- Reacoes e progresso de leitura
- Historico de conteudo

**Dados que permanecem anonimizados:**
- Contagens agregadas de leitura e reacoes (sem vinculo ao usuario)
- Eventos de analytics (ja anonimos por design)

---

## 8. Criancas e adolescentes

O MD Connect nao e direcionado a criancas menores de 13 anos. Nao coletamos intencionalmente dados de menores de 13 anos. Se tomarmos conhecimento de que coletamos dados de uma crianca sem consentimento dos pais ou responsaveis, excluiremos esses dados.

Adolescentes entre 13 e 18 anos podem usar o app com consentimento dos pais ou responsaveis legais, conforme o Art. 14 da LGPD.

---

## 9. Seguranca

- Todas as comunicacoes usam **HTTPS** (criptografia em transito)
- O banco de dados utiliza **Row Level Security (RLS)** — cada usuario so acessa seus proprios dados
- Todas as operacoes de dados passam por **Edge Functions** autenticadas (o app nunca acessa o banco diretamente)
- Erros reportados passam por **sanitizacao de PII** (dados pessoais sao removidos antes do armazenamento)
- CORS restrito a dominios autorizados (sem wildcard em producao)

---

## 10. Alteracoes nesta politica

Podemos atualizar esta politica periodicamente. Quando fizermos alteracoes significativas:

- A data de "ultima atualizacao" no topo sera alterada
- Usuarios autenticados serao notificados via aviso no app
- A versao anterior ficara disponivel mediante solicitacao

O uso continuado do app apos a publicacao de alteracoes constitui aceite dos novos termos.

---

## 11. Contato

Para exercer seus direitos, tirar duvidas ou reportar problemas de privacidade:

- **E-mail:** privacidade@mdconnect.app
- **WhatsApp:** [Canal de suporte MD Connect](https://wa.me/5551986859236?text=Ol%C3%A1!%20Gostaria%20de%20falar%20sobre%20privacidade%20dos%20meus%20dados.)

Responderemos em ate **15 dias uteis**, conforme previsto na LGPD.

---

> **Nota:** Este documento e um modelo tecnico baseado na analise do codigo-fonte do app. Deve ser revisado por um profissional juridico antes da publicacao oficial.

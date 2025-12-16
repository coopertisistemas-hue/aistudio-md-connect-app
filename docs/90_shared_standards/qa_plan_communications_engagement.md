# Roteiro de QA: Comunicação & Engajamento (Sprint 11)

Este documento descreve os testes manuais necessários para validar o módulo de Comunicação antes do lançamento.

## 1. Mural de Avisos (`/communications` > Mural)

| ID | Cenário | Passos | Resultado Esperado |
|---|---|---|---|
| A01 | **Criar Aviso Interno** | 1. Clicar em "Novo Aviso".<br>2. Título: "Reunião de Líderes".<br>3. Categoria: "Administrativo".<br>4. Escopo: "Interno".<br>5. Salvar. | O aviso aparece no mural com ícone de cadeado (🔒). Não deve aparecer para membros comuns no futuro App. |
| A02 | **Criar Aviso Público** | 1. Criar novo aviso.<br>2. Título: "Culto Especial".<br>3. Categoria: "Culto".<br>4. Escopo: "Público".<br>5. Salvar. | O aviso aparece no mural com ícone de globo (🌍). |
| A03 | **Validar Categorias** | 1. Criar avisos com categorias diferentes (Social, Urgente).<br>2. Verificar as cores dos cards. | Cada categoria deve ter uma cor distinta no badge (ex: Urgente = Vermelho, Social = Verde). |
| A04 | **Edição e Exclusão** | 1. Clicar no ícone de lápis de um aviso.<br>2. Alterar título.<br>3. Salvar.<br>4. Excluir o aviso. | O título é atualizado imediatamente. Após excluir, o aviso some da lista. |
| A05 | **Data de Expiração** | 1. Criar aviso com data de expiração para "Ontem". | O aviso não deve aparecer na lista padrão (ou deve aparecer marcado como expirado/arquivado). |

## 2. Campanhas (`/communications` > Campanhas)

| ID | Cenário | Passos | Resultado Esperado |
|---|---|---|---|
| C01 | **Criar Campanha** | 1. Clicar em "Nova Campanha".<br>2. Nome: "Mês da Família".<br>3. Cor: Azul.<br>4. Período: 01/10 a 31/10.<br>5. Salvar. | A campanha aparece na lista/timeline com a barra lateral na cor Azul. |
| C02 | **Edição** | 1. Editar a campanha criada.<br>2. Mudar a cor para Vermelho.<br>3. Salvar. | A cor da borda do card muda para Vermelho. |
| C03 | **Timeline Visual** | 1. Criar uma campanha futura e uma passada. | A ordem de exibição deve priorizar as vigentes ou futuras. |

## 3. Presença Digital (`/communications` > Presença)

| ID | Cenário | Passos | Resultado Esperado |
|---|---|---|---|
| P01 | **Preencher Dados** | 1. Preencher Descrição, Telefone, e Links (Instagram, Maps).<br>2. Clicar em Salvar. | O sistema exibe o toast "Perfil atualizado". Ao recarregar a página, os dados persistem. |
| P02 | **Links Externos** | 1. Preencher um link do Google Maps.<br>2. Clicar no botão de "Link Externo" (setinha). | Uma nova aba do navegador abre corretamente no endereço do mapa. |
| P03 | **Campos Vazios** | 1. Deixar alguns campos em branco e salvar. | O sistema aceita (campos opcionais) e na visualização do diretório esses ícones não aparecem. |

## 4. Diretório (`/communications` > Presença > Aba Diretório)

| ID | Cenário | Passos | Resultado Esperado |
|---|---|---|---|
| D01 | **Listagem** | 1. Acessar a aba. | Deve listar todas as igrejas da organização. |
| D02 | **Qualidade de Dados** | 1. Verificar o card da igreja editada no teste P01.<br>2. Verificar o card de uma igreja sem dados. | A igreja P01 mostra telefone/site. A outra mostra "Perfil Incompleto" ou oculta os ícones. |

## 5. WhatsApp Templates (`/communications` > WhatsApp)

| ID | Cenário | Passos | Resultado Esperado |
|---|---|---|---|
| W01 | **Criar Template** | 1. Novo Modelo.<br>2. Título: "Boas Vindas".<br>3. Texto: "Olá {{NOME}}".<br>4. Inserir variável clicando na tag. | A tag `{{NOME}}` é inserida no texto. O template é salvo na galeria. |
| W02 | **Copiar Texto** | 1. Clicar no botão "Copiar Texto" do card. | O texto vai para a área de transferência do computador. |

## 6. Multi-Igreja & Segurança (RLS)

| ID | Cenário | Passos | Resultado Esperado |
|---|---|---|---|
| S01 | **Isolamento de Avisos** | 1. Logar como Admin da Igreja A.<br>2. Criar aviso "Festa Igreja A".<br>3. Logar como Admin da Igreja B.<br>4. Acessar Mural. | O Admin B **NÃO** deve ver o aviso "Festa Igreja A". |
| S02 | **Isolamento de Campanhas** | 1. Logar como Admin da Igreja A.<br>2. Criar campanha "Campanha A".<br>3. Logar como Admin da Igreja B. | O Admin B **NÃO** deve ver a "Campanha A". |
| S03 | **Diretório Global** | 1. Logar como Admin da Igreja A.<br>2. Acessar Diretório. | O Admin A **DEVE** ver a Igreja B na lista (pois o diretório é organizacional), mas não pode editar os dados da Igreja B. |

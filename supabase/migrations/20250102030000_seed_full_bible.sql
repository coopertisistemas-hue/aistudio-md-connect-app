-- FORCE SEED ALL 66 BOOKS
-- This file is created because the previous seed file might have been marked as 'already run'
-- while it was still incomplete. This ensures we actually get all books.

insert into public.bible_books (id, name, abbrev, testament, historical_context, themes, application)
values
    -- --- PENTATEUC (5) ---
    (
        'genesis', 'Gênesis', ARRAY['Gn', 'Gên'], 'VT',
        'O livro das origens. Narra a criação, a queda, e a aliança de Deus com os patriarcas para abençoar todas as nações.',
        ARRAY['Criação e Queda', 'Aliança', 'Providência Divina', 'Fé dos Patriarcas'],
        ARRAY['Reconheça Deus como Criador soberano.', 'Confie que Deus transforma o mal em bem.', 'Ande com Deus em fé.']
    ),
    (
        'exodo', 'Êxodo', ARRAY['Ex', 'Êx'], 'VT',
        'Narra a libertação de Israel do Egito, a aliança no Sinai e a construção do Tabernáculo.',
        ARRAY['Redenção', 'A Lei de Deus', 'Presença Divina', 'Adoração'],
        ARRAY['Reconheça que Deus ouve o clamor dos aflitos.', 'Veja a libertação do pecado como o verdadeiro êxodo.', 'Valorize a adoração a Deus.']
    ),
    (
        'levitico', 'Levítico', ARRAY['Lv', 'Lev'], 'VT',
        'Manual para sacerdotes, ensinando como um povo pecador pode se aproximar de um Deus santo.',
        ARRAY['Santidade', 'Sacrifício e Expiação', 'Sacerdócio', 'Festas Solenes'],
        ARRAY['Seja santo, pois Deus é santo.', 'Agradeça pelo sacrifício perfeito de Cristo.', 'Consagre sua vida ao Senhor.']
    ),
    (
        'numeros', 'Números', ARRAY['Nm', 'Num'], 'VT',
        'A peregrinação pelo deserto. Mostra a paciência de Deus disciplinando Seu povo e preparando a nova geração.',
        ARRAY['Fidelidade de Deus', 'Rebelião e Juízo', 'Providência', 'A Nuvem Guiadora'],
        ARRAY['Confie na promessa de Deus e não murmure.', 'Siga a direção de Deus dia após dia.', 'Deus é fiel mesmo quando somos infiéis.']
    ),
    (
        'deuteronomio', 'Deuteronômio', ARRAY['Dt', 'Deut'], 'VT',
        'Moisés reafirma a Lei antes da entrada na Terra Prometida. Um chamado para amar a Deus de todo o coração.',
        ARRAY['Amor a Deus', 'Obediência e Bênção', 'Ensino às Gerações', 'Aliança'],
        ARRAY['Ame o Senhor com todo o seu coração.', 'Ensine a Palavra de Deus a seus filhos.', 'Lembre-se dos feitos do Senhor.']
    ),

    -- --- HISTORICAL (12) ---
    (
        'josue', 'Josué', ARRAY['Js', 'Jos'], 'VT',
        'A conquista da Terra Prometida. Destaca a fidelidade de Deus em cumprir Suas promessas.',
        ARRAY['Conquista pela Fé', 'Fidelidade de Deus', 'Coragem', 'A Terra como Herança'],
        ARRAY['Seja forte e corajoso.', 'Medite na Palavra para prosperar.', 'Eu e minha casa serviremos ao Senhor.']
    ),
    (
        'juizes', 'Juízes', ARRAY['Jz', 'Jui'], 'VT',
        'Ciclos de pecado, servidão e salvação através de juízes. Mostra o perigo do relativismo moral.',
        ARRAY['Ciclo do Pecado', 'Graça de Deus', 'Liderança Imperfeita', 'Necessidade de um Rei'],
        ARRAY['Cuidado com a complacência espiritual.', 'Clame a Deus em meio às consequências do pecado.', 'Líderes falham, mas Deus permanece.']
    ),
    (
        'rute', 'Rute', ARRAY['Rt', 'Rut'], 'VT',
        'Uma história de lealdade e redenção. Deus age nos bastidores para preservar a linhagem messiânica.',
        ARRAY['Lealdade (Hesed)', 'Redentor (Goel)', 'Providência Oculta', 'Inclusão'],
        ARRAY['Confie que Deus trabalha mesmo nos tempos difíceis.', 'Seja leal e bondoso.', 'Deus restaura histórias quebradas.']
    ),
    (
        '1samuel', '1 Samuel', ARRAY['1Sm', '1 Sam'], 'VT',
        'A transição para a monarquia. Samuel, Saul e a unção de Davi.',
        ARRAY['Soberania de Deus', 'Obediência vs Sacrifício', 'O Coração vs Aparência'],
        ARRAY['Obedecer é melhor que sacrificar.', 'Deus vê o coração.', 'Busque a Deus nas crises de liderança.']
    ),
    (
        '2samuel', '2 Samuel', ARRAY['2Sm', '2 Sam'], 'VT',
        'O reinado de Davi, a aliança eterna, seu pecado e arrependimento.',
        ARRAY['Aliança Davídica', 'Pecado e Consequência', 'Arrependimento', 'Soberania Real'],
        ARRAY['Busque o arrependimento rápido.', 'Confie nas promessas do Reino.', 'O pecado perdoado ainda tem consequências.']
    ),
    (
        '1reis', '1 Reis', ARRAY['1Rs', '1 Reis'], 'VT',
        'O auge sob Salomão e a divisão do reino. Elias profetiza contra a idolatria.',
        ARRAY['Sabedoria', 'Templo', 'Divisão e Declínio', 'Profetismo'],
        ARRAY['Busque a sabedoria de Deus.', 'Cuidado com a idolatria no coração.', 'Permaneça fiel mesmo sozinho.']
    ),
    (
        '2reis', '2 Reis', ARRAY['2Rs', '2 Reis'], 'VT',
        'Os reinos divididos até o exílio. Eliseu sucede Elias. A queda de Israel e Judá.',
        ARRAY['Milagres e Misericórdia', 'Juízo Inevitável', 'Idolatria', 'Palavra Profética'],
        ARRAY['Confie no poder de Deus.', 'Leve a sério os avisos de Deus.', 'Deus é soberano sobre as nações.']
    ),
    (
        '1cronicas', '1 Crônicas', ARRAY['1Cr', '1 Cron'], 'VT',
        'Foco espiritual e sacerdotal da história para encorajar os exilados.',
        ARRAY['Adoração Verdadeira', 'Reinado de Davi', 'Soberania', 'Bênção de Deus'],
        ARRAY['Busque a Deus e Sua força.', 'Valorize a adoração.', 'Confie nos propósitos de Deus.']
    ),
    (
        '2cronicas', '2 Crônicas', ARRAY['2Cr', '2 Cron'], 'VT',
        'A história do Templo e os reis que buscaram a Deus (reavivamentos).',
        ARRAY['Reavivamento', 'Oração e Humildade', 'O Templo', 'Misericórdia'],
        ARRAY['Se o meu povo se humilhar e orar...', 'Busque o Senhor enquanto Ele está perto.', 'A batalha é de Deus.']
    ),
    (
        'esdras', 'Esdras', ARRAY['Ed', 'Esd'], 'VT',
        'O retorno do exílio e a reconstrução do Templo. A importância da Palavra.',
        ARRAY['Restauração', 'Providência', 'Ensino da Palavra', 'Santidade'],
        ARRAY['A mão de Deus está sobre os que O buscam.', 'Dedique-se à Palavra.', 'Santifique-se do pecado.']
    ),
    (
        'neemias', 'Neemias', ARRAY['Ne', 'Nee'], 'VT',
        'A reconstrução dos muros de Jerusalém. Liderança, oração e ação.',
        ARRAY['Liderança Piedosa', 'Oração e Ação', 'Reconstrução', 'Cuidado Social'],
        ARRAY['A alegria do Senhor é a vossa força.', 'Ore e aja.', 'Não desanime na obra.']
    ),
    (
        'ester', 'Ester', ARRAY['Et', 'Est'], 'VT',
        'Deus preserva Seu povo na Pérsia através de Ester. Providência divina visível.',
        ARRAY['Providência Soberana', 'Coragem', 'Libertação', 'Propósito'],
        ARRAY['Você está aqui para um propósito.', 'Tenha coragem para fazer o certo.', 'Deus age no silêncio.']
    ),

    -- --- POETIC (5) ---
    (
        'jo', 'Jó', ARRAY['Jó', 'Job'], 'VT',
        'O problema do sofrimento e a soberania de Deus.',
        ARRAY['Soberania no Sofrimento', 'Fé Desinteressada', 'O Silêncio de Deus'],
        ARRAY['Adore a Deus mesmo na dor.', 'Deus é sábio além da nossa compreensão.', 'Interceda pelos outros.']
    ),
    (
        'salmos', 'Salmos', ARRAY['Sl', 'Sal'], 'VT',
        'O hinário de Israel. Orações de louvor, lamento, confiança e gratidão.',
        ARRAY['Louvor e Adoração', 'Lamento', 'O Reinado de Deus', 'A Palavra'],
        ARRAY['Derrame seu coração a Deus.', 'Encontre refúgio no Senhor.', 'Louve-O em todo tempo.']
    ),
    (
        'proverbios', 'Provérbios', ARRAY['Pv', 'Pro'], 'VT',
        'Sabedoria prática para a vida. O temor do Senhor é o princípio da sabedoria.',
        ARRAY['Temor do Senhor', 'Sabedoria', 'Vida Reta', 'Palavras'],
        ARRAY['Busque a sabedoria divina.', 'Confie no Senhor de todo coração.', 'Guarde seu coração.']
    ),
    (
        'eclesiastes', 'Eclesiastes', ARRAY['Ec', 'Ecl'], 'VT',
        'A vaidade da vida sem Deus. O sentido é temer a Deus.',
        ARRAY['Vaidade da Vida', 'Tempo para Tudo', 'Temor a Deus', 'Eternidade'],
        ARRAY['Aproveite a vida como dom.', 'Não ponha esperança no passageiro.', 'Tema a Deus em tudo.']
    ),
    (
        'canticos', 'Cânticos', ARRAY['Ct', 'Cant'], 'VT',
        'O amor conjugal celebrado. Alegoria do amor de Deus pelo povo.',
        ARRAY['Amor Conjugal', 'Beleza e Desejo', 'Fidelidade', 'União com Cristo'],
        ARRAY['Cultive o amor no casamento.', 'Celebre o amor divino.', 'Busque intimidade com Cristo.']
    ),

    -- --- MAJOR PROPHETS (5) ---
    (
        'isaias', 'Isaías', ARRAY['Is', 'Isa'], 'VT',
        'O profeta messiânico. Juízo, consolo e o Servo Sofredor.',
        ARRAY['Santidade de Deus', 'Messias', 'Juízo e Consolo', 'Restauração'],
        ARRAY['Confie no Santo de Israel.', 'Busque o Senhor.', 'Espere novos céus e nova terra.']
    ),
    (
        'jeremias', 'Jeremias', ARRAY['Jr', 'Jer'], 'VT',
        'Anuncia o exílio e a Nova Aliança.',
        ARRAY['Arrependimento', 'Nova Aliança', 'Soberania', 'Idolatria'],
        ARRAY['Mude o coração, não só rituais.', 'Os planos de Deus são de esperança.', 'Busque a Deus de todo coração.']
    ),
    (
        'lamentacoes', 'Lamentações', ARRAY['Lm', 'Lam'], 'VT',
        'O choro por Jerusalém, com esperança na fidelidade divina.',
        ARRAY['Lamento', 'Juízo', 'Fidelidade de Deus', 'Esperança'],
        ARRAY['Derrame a alma diante de Deus.', 'Grande é a Tua fidelidade.', 'Espere no Senhor.']
    ),
    (
        'ezequiel', 'Ezequiel', ARRAY['Ez', 'Eze'], 'VT',
        'Visões da glória de Deus e restauração futura (Ossos Secos).',
        ARRAY['Glória de Deus', 'O Espírito', 'Responsabilidade', 'Novo Coração'],
        ARRAY['Peça um coração novo.', 'O Espírito dá vida.', 'Busque a glória de Deus.']
    ),
    (
        'daniel', 'Daniel', ARRAY['Dn', 'Dan'], 'VT',
        'Fidelidade no exílio e profecias do Reino eterno.',
        ARRAY['Soberania de Deus', 'Fidelidade', 'Oração', 'Reino de Deus'],
        ARRAY['Não se contamine com o mundo.', 'Ore constantemente.', 'O Reino de Deus triunfará.']
    ),

    -- --- MINOR PROPHETS (12) ---
    (
        'oseias', 'Oseias', ARRAY['Os', 'Ose'], 'VT',
        'O amor fiel de Deus por um povo infiel.',
        ARRAY['Amor Incondicional', 'Infidelidade', 'Restauração'],
        ARRAY['Conheça ao Senhor.', 'Volte para Deus.', 'Valorize o amor leal de Deus.']
    ),
    (
        'joel', 'Joel', ARRAY['Jl', 'Joe'], 'VT',
        'O Dia do Senhor e o derramamento do Espírito.',
        ARRAY['Dia do Senhor', 'Arrependimento', 'Espírito Santo'],
        ARRAY['Rasgue o coração em arrependimento.', 'Busque o Espírito Santo.', 'Invoque o Senhor.']
    ),
    (
        'amos', 'Amós', ARRAY['Am', 'Amo'], 'VT',
        'Justiça social e denúncia da hipocrisia.',
        ARRAY['Justiça Social', 'Juízo', 'Hipocrisia'],
        ARRAY['Busque o bem.', 'Adoração requer justiça.', 'Prepare-se para encontrar Deus.']
    ),
    (
        'obadias', 'Obadias', ARRAY['Ob', 'Oba'], 'VT',
        'Julgamento de Edom pela soberba.',
        ARRAY['Soberba', 'Justiça Divina', 'Vitória de Deus'],
        ARRAY['Não se alegre com o mal alheio.', 'Abata a soberba.', 'Deus julga as injustiças.']
    ),
    (
        'jonas', 'Jonas', ARRAY['Jn', 'Jon'], 'VT',
        'A misericórdia de Deus alcança a todos.',
        ARRAY['Misericórdia Universal', 'Soberania', 'Arrependimento'],
        ARRAY['Não fuja da vontade de Deus.', 'Tenha compaixão.', 'A salvação vem do Senhor.']
    ),
    (
        'miqueias', 'Miqueias', ARRAY['Mq', 'Miq'], 'VT',
        'Justiça, misericórdia e humildade. O Messias de Belém.',
        ARRAY['Justiça e Misericórdia', 'O Messias', 'Perdão'],
        ARRAY['Pratique a justiça e misericórdia.', 'Ande humildemente com Deus.', 'Deus perdoa pecados.']
    ),
    (
        'naum', 'Naum', ARRAY['Na', 'Nau'], 'VT',
        'Juízo sobre Nínive. Deus é vingador e refúgio.',
        ARRAY['Juízo', 'Bondade de Deus', 'Refúgio'],
        ARRAY['O Senhor é bom.', 'Confie no refúgio divino.', 'Deus extingue o mal.']
    ),
    (
        'habacuque', 'Habacuque', ARRAY['Hc', 'Hab'], 'VT',
        'O justo viverá da fé em meio ao caos.',
        ARRAY['Fé na Adversidade', 'Soberania', 'Alegria na Salvação'],
        ARRAY['Alegre-se no Senhor na crise.', 'Viva pela fé.', 'Espere em Deus.']
    ),
    (
        'sofonias', 'Sofonias', ARRAY['Sf', 'Sof'], 'VT',
        'O Grande Dia do Senhor e a alegria de Deus pelo remanescente.',
        ARRAY['Dia do Senhor', 'Remanescente', 'Alegria de Deus'],
        ARRAY['Busque a mansidão.', 'Deus se alegra em você.', 'Não tema.']
    ),
    (
        'ageu', 'Ageu', ARRAY['Ag', 'Age'], 'VT',
        'Construção do Templo. Prioridades.',
        ARRAY['Prioridades', 'O Templo', 'Glória Futura'],
        ARRAY['Primeiro o Reino de Deus.', 'Não desanime.', 'A paz do Senhor está aqui.']
    ),
    (
        'zacarias', 'Zacarias', ARRAY['Zc', 'Zac'], 'VT',
        'Visions apocalípticas e o Messias Rei.',
        ARRAY['Messias', 'Espírito Santo', 'Restauração'],
        ARRAY['Não por força, mas pelo Espírito.', 'Não despreze os pequenos começos.', 'Olhe para Jesus.']
    ),
    (
        'malaquias', 'Malaquias', ARRAY['Ml', 'Mal'], 'VT',
        'Repreensão ao formalismo. O Sol da Justiça.',
        ARRAY['Adoração', 'Fidelidade', 'Dízimos', 'Juízo'],
        ARRAY['Dê o seu melhor a Deus.', 'Seja fiel.', 'Espere o Sol da Justiça.']
    ),

    -- --- NEW TESTAMENT (Gospels & Acts) ---
    (
        'mateus', 'Mateus', ARRAY['Mt', 'Mat'], 'NT',
        'Jesus, o Rei Messias.',
        ARRAY['Jesus o Rei', 'Reino dos Céus', 'Discipulado'],
        ARRAY['Busque primeiro o Reino.', 'Faça discípulos.', 'Jesus cumpre a Escritura.']
    ),
    (
        'marcos', 'Marcos', ARRAY['Mc', 'Mar'], 'NT',
        'Jesus, o Servo Sofredor.',
        ARRAY['Servo Sofredor', 'Ação', 'Discipulado'],
        ARRAY['Sirva com humildade.', 'Creia no poder de Deus.', 'Siga a Cristo na cruz.']
    ),
    (
        'lucas', 'Lucas', ARRAY['Lc', 'Luc'], 'NT',
        'Jesus, o Filho do Homem, Salvador de todos.',
        ARRAY['Filho do Homem', 'Salvação Universal', 'Oração'],
        ARRAY['Leve o evangelho a todos.', 'Ore sempre.', 'Tenha compaixão.']
    ),
    (
        'joao', 'João', ARRAY['Jo', 'Joa'], 'NT',
        'Jesus, o Filho de Deus. Crer para ter vida.',
        ARRAY['Divindade de Jesus', 'Vida Eterna', 'Amor'],
        ARRAY['Creia em Jesus.', 'Permaneça nEle.', 'Ame como Ele amou.']
    ),
    (
        'atos', 'Atos', ARRAY['At', 'Ato'], 'NT',
        'O Espírito Santo e a expansão da Igreja.',
        ARRAY['Espírito Santo', 'Testemunho', 'Igreja'],
        ARRAY['Busque o Espírito.', 'Testemunhe.', 'Confie na missão de Deus.']
    ),

    -- --- PAULINE EPISTLES ---
    (
        'romanos', 'Romanos', ARRAY['Rm', 'Rom'], 'NT',
        'A justiça de Deus pela fé.',
        ARRAY['Justificação', 'Graça', 'Vida no Espírito'],
        ARRAY['Confie na graça.', 'Ofereça-se a Deus.', 'Nada nos separa do amor de Deus.']
    ),
    (
        '1corintios', '1 Coríntios', ARRAY['1Co', '1 Cor'], 'NT',
        'Correção de problemas na igreja.',
        ARRAY['Unidade', 'Santidade', 'Dons', 'Amor'],
        ARRAY['Busque a unidade.', 'Faça tudo com amor.', 'Use seus dons para edificar.']
    ),
    (
        '2corintios', '2 Coríntios', ARRAY['2Co', '2 Cor'], 'NT',
        'Defesa do ministério e poder na fraqueza.',
        ARRAY['Poder na Fraqueza', 'Reconciliação', 'Generosidade'],
        ARRAY['Força na fraqueza.', 'Seja embaixador de Cristo.', 'Contribua com alegria.']
    ),
    (
        'galatas', 'Gálatas', ARRAY['Gl', 'Gal'], 'NT',
        'Liberdade em Cristo vs Legalismo.',
        ARRAY['Justificação pela Fé', 'Liberdade', 'Fruto do Espírito'],
        ARRAY['Não volte ao legalismo.', 'Ande no Espírito.', 'Sirva em amor.']
    ),
    (
        'efesios', 'Efésios', ARRAY['Ef', 'Efe'], 'NT',
        'A Igreja como Corpo de Cristo.',
        ARRAY['Riquezas em Cristo', 'Unidade', 'Batalha Espiritual'],
        ARRAY['Você é amado.', 'Revista-se da armadura.', 'Mantenha a unidade.']
    ),
    (
        'filipenses', 'Filipenses', ARRAY['Fp', 'Fil'], 'NT',
        'Alegria em todas as situações.',
        ARRAY['Alegria', 'Humildade', 'Contentamento'],
        ARRAY['Alegre-se no Senhor.', 'Seja humilde.', 'Busque a paz.']
    ),
    (
        'colossenses', 'Colossenses', ARRAY['Cl', 'Col'], 'NT',
        'A supremacia de Cristo.',
        ARRAY['Supremacia de Cristo', 'Plenitude', 'Vida Nova'],
        ARRAY['Cristo é tudo.', 'Busque o céu.', 'Faça tudo para Ele.']
    ),
    (
        '1tessalonicenses', '1 Tessalonicenses', ARRAY['1Ts', '1 Tes'], 'NT',
        'A volta de Cristo e santificação.',
        ARRAY['Segunda Vinda', 'Santificação', 'Esperança'],
        ARRAY['Console-se com a volta de Jesus.', 'Ore sempre.', 'Seja santo.']
    ),
    (
        '2tessalonicenses', '2 Tessalonicenses', ARRAY['2Ts', '2 Tes'], 'NT',
        'O Dia do Senhor e perseverança.',
        ARRAY['Dia do Senhor', 'Trabalho', 'Perseverança'],
        ARRAY['Não se perturbe.', 'Trabalhe o bem.', 'Deus é fiel.']
    ),
    (
        '1timoteo', '1 Timóteo', ARRAY['1Tm', '1 Tim'], 'NT',
        'Liderança e ordem na igreja.',
        ARRAY['Liderança', 'Doutrina', 'Piedade'],
        ARRAY['Ore por todos.', 'Busque a piedade.', 'Combata o bom combate.']
    ),
    (
        '2timoteo', '2 Timóteo', ARRAY['2Tm', '2 Tim'], 'NT',
        'Fidelidade final e a Palavra.',
        ARRAY['Fidelidade', 'A Palavra', 'Perseverança'],
        ARRAY['Não se envergonhe.', 'Maneje a Palavra.', 'Cumpra seu ministério.']
    ),
    (
        'tito', 'Tito', ARRAY['Tt', 'Tit'], 'NT',
        'Boas obras e sã doutrina.',
        ARRAY['Boas Obras', 'Graça', 'Liderança'],
        ARRAY['Pratique o bem.', 'A graça educa.', 'Evite contendas.']
    ),
    (
        'filemom', 'Filemom', ARRAY['Fm', 'Flm'], 'NT',
        'Reconciliação prática.',
        ARRAY['Perdão', 'Reconciliação', 'Irmandade'],
        ARRAY['Perdoe.', 'Receba como irmão.', 'Restaure relacionamentos.']
    ),
    (
        'hebreus', 'Hebreus', ARRAY['Hb', 'Heb'], 'NT',
        'A superioridade de Cristo.',
        ARRAY['Supremacia de Cristo', 'Fé', 'Perseverança'],
        ARRAY['Olhe para Jesus.', 'Não desista.', 'Fé é certeza.']
    ),

    -- --- GENERAL EPISTLES ---
    (
        'tiago', 'Tiago', ARRAY['Tg', 'Tia'], 'NT',
        'A fé sem obras é morta.',
        ARRAY['Fé e Obras', 'Sabedoria', 'Língua'],
        ARRAY['Pratique a Palavra.', 'Peça sabedoria.', 'Fé gera ação.']
    ),
    (
        '1pedro', '1 Pedro', ARRAY['1Pe', '1 Pe'], 'NT',
        'Esperança no sofrimento.',
        ARRAY['Esperança', 'Santidade', 'Sofrimento'],
        ARRAY['Tenha esperança viva.', 'Seja santo.', 'Humilhe-se sob Deus.']
    ),
    (
        '2pedro', '2 Pedro', ARRAY['2Pe', '2 Pe'], 'NT',
        'Crescimento e alerta contra falsos mestres.',
        ARRAY['Falsos Mestres', 'Crescimento', 'Dia do Senhor'],
        ARRAY['Cresça na graça.', 'Confie na promessa.', 'Cuidado com o erro.']
    ),
    (
        '1joao', '1 João', ARRAY['1Jo', '1 Jo'], 'NT',
        'Certeza da salvação e amor.',
        ARRAY['Certeza', 'Amor', 'Luz'],
        ARRAY['Ande na luz.', 'Ame os irmãos.', 'Não ame o mundo.']
    ),
    (
        '2joao', '2 João', ARRAY['2Jo', '2 Jo'], 'NT',
        'Verdade e amor.',
        ARRAY['Verdade', 'Discernimento'],
        ARRAY['Ande na verdade.', 'Cuidado com enganadores.']
    ),
    (
        '3joao', '3 João', ARRAY['3Jo', '3 Jo'], 'NT',
        'Hospitalidade e verdade.',
        ARRAY['Hospitalidade', 'Serviço'],
        ARRAY['Apoie a verdade.', 'Imite o bem.']
    ),
    (
        'judas', 'Judas', ARRAY['Jd', 'Jud'], 'NT',
        'Batalha pela fé.',
        ARRAY['Batalha', 'Julgamento', 'Preservação'],
        ARRAY['Batalhe pela fé.', 'Edifique-se.', 'Deus te guarda.']
    ),
    (
        'apocalipse', 'Apocalipse', ARRAY['Ap', 'Apo'], 'NT',
        'A vitória final de Cristo.',
        ARRAY['Vitória', 'Adoração', 'Novos Céus'],
        ARRAY['Adore a Deus.', 'Seja fiel até o fim.', 'Maranata, vem Jesus.']
    )

on conflict (id) do update 
set 
    historical_context = excluded.historical_context,
    themes = excluded.themes,
    application = excluded.application,
    abbrev = excluded.abbrev;

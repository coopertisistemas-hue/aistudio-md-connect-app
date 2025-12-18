-- Seed ALL Remaining Bible Books
-- This ensures COMPLETE context coverage for the entire Bible (OT + NT).

insert into public.bible_books (id, name, abbrev, testament, historical_context, themes, application)
values
    -- --- PENTATEUCH (Remaining) ---
    (
        'exodo', 'Êxodo', ARRAY['Ex', 'Êx'], 'VT',
        'Narra a libertação de Israel da escravidão no Egito (c. 1446 a.C.), a aliança no Sinai e a construção do Tabernáculo, onde a glória de Deus habita entre Seu povo.',
        ARRAY['Redenção', 'A Lei de Deus', 'Presença Divina', 'Adoração'],
        ARRAY['Reconheça que Deus ouve o clamor dos aflitos.', 'Veja a libertação do pecado como o verdadeiro êxodo.', 'Valorize a santidade e a adoração a Deus.']
    ),
    (
        'levitico', 'Levítico', ARRAY['Lv', 'Lev'], 'VT',
        'Manual para os sacerdotes e o povo (c. 1445 a.C.), ensinando como um povo pecador pode se aproximar de um Deus santo através de sacrifícios (tipificando Cristo) e pureza.',
        ARRAY['Santidade', 'Sacrifício e Expiação', 'Sacerdócio', 'Festas Solenes'],
        ARRAY['Seja santo, pois Deus é santo.', 'Agradeça pelo sacrifício perfeito de Cristo que nos purifica.', 'Consagre todas as áreas da vida ao Senhor.']
    ),
    (
        'numeros', 'Números', ARRAY['Nm', 'Num'], 'VT',
        'Relata a peregrinação de 40 anos no deserto devido à incredulidade. Mostra a paciência de Deus disciplinando Seu povo e preparando a nova geração.',
        ARRAY['Fidelidade de Deus', 'Rebelião e Juízo', 'Providência no Deserto', 'A Nuvem Guiadora'],
        ARRAY['Confie na promessa de Deus e não murmure.', 'Veja a fidelidade de Deus mesmo em meio à nossa infidelidade.', 'Siga a direção de Deus dia após dia.']
    ),
    (
        'deuteronomio', 'Deuteronômio', ARRAY['Dt', 'Deut'], 'VT',
        'Moisés reafirma a Lei à nova geração antes de entrar na Terra Prometida. Um chamado apaixonado para amar a Deus de todo o coração e obedecer aos Seus mandamentos.',
        ARRAY['Amor a Deus', 'Obediência e Bênção', 'Ensino às Gerações', 'Aliança'],
        ARRAY['Ame o Senhor com todo o seu coração, alma e força.', 'Ensine a Palavra de Deus diligentemente a seus filhos.', 'Lembre-se do que Deus já fez por você.']
    ),

    -- --- HISTORICAL BOOKS (Remaining) ---
    (
        'josue', 'Josué', ARRAY['Js', 'Jos'], 'VT',
        'A conquista da Terra Prometida sob a liderança de Josué. Destaca a fidelidade de Deus em cumprir Suas promessas e a necessidade de coragem e obediência guerreira.',
        ARRAY['Conquista pela Fé', 'Fidelidade de Deus', 'Coragem', 'A Terra como Herança'],
        ARRAY['Seja forte e corajoso; não tenha medo.', 'Medite na Palavra para prosperar em seu caminho.', 'Decida hoje: "Eu e minha casa serviremos ao Senhor."']
    ),
    (
        'juizes', 'Juízes', ARRAY['Jz', 'Jui'], 'VT',
        'Um período sombrio de ciclos: pecado, servidão, súplica e salvação através de juízes. Mostra o perigo do relativismo moral: "cada um fazia o que parecia reto aos seus olhos".',
        ARRAY['Ciclo do Pecado', 'Graça de Deus', 'Liderança Imperfeita', 'Necessidade de um Rei'],
        ARRAY['Cuidado com a complacência espiritual.', 'Clame a Deus em meio às consequências do pecado.', 'Reconheça que líderes humanos falham, mas Deus permanece fiel.']
    ),
    (
        'rute', 'Rute', ARRAY['Rt', 'Rut'], 'VT',
        'Uma história de lealdade e redenção nos tempos dos juízes. Mostra como Deus age nos bastidores através de uma moabita fiel para preservar a linhagem messiânica.',
        ARRAY['Lealdade (Hesed)', 'Redentor (Goel)', 'Providência Oculta', 'Inclusão dos Gentios'],
        ARRAY['Confie que Deus trabalha mesmo nos tempos difíceis.', 'Seja leal e bondoso, refletindo o caráter de Deus.', 'Veja em Boaz um tipo de Cristo, nosso Redentor.']
    ),
    (
        '1samuel', '1 Samuel', ARRAY['1Sm', '1 Sam'], 'VT',
        'A transição da teocracia para a monarquia. Narra a história de Samuel (último juiz), a ascensão e queda de Saul (primeiro rei) e a unção de Davi (rei segundo o coração de Deus).',
        ARRAY['Soberania de Deus', 'Obediência vs Sacrifício', 'O Coração vs Aparência', 'Amizade (Davi e Jônatas)'],
        ARRAY['Lembre-se que obedecer é melhor que sacrificar.', 'Deus vê o coração, não a aparência externa.', 'Busque a Deus em meio às crises de liderança.']
    ),
    (
        '2samuel', '2 Samuel', ARRAY['2Sm', '2 Sam'], 'VT',
        'O reinado de Davi, suas vitórias militares, a aliança eterna de Deus com ele, mas também seu terrível pecado com Bate-Seba e as consequências dolorosas em sua família.',
        ARRAY['Aliança Davídica', 'Pecado e Consequência', 'Arrependimento Genuíno', 'Soberania Real'],
        ARRAY['Busque o arrependimento rápido quando errar.', 'Confie nas promessas eternas de Deus para o Reino.', 'Entenda que o pecado perdoado ainda pode ter consequências.']
    ),
    (
        '1reis', '1 Reis', ARRAY['1Rs', '1 Reis'], 'VT',
        'O auge de Israel sob Salomão (Templo) e a trágica divisão do reino. Elias profetiza contra a idolatria de Acabe e Jezabel, defendendo que "O Senhor é Deus".',
        ARRAY['Sabedoria', 'Templo e Adoração', 'Divisão e Declínio', 'Profetismo'],
        ARRAY['Busque a sabedoria de Deus acima de riquezas.', 'Cuidado com influências que desviam seu coração de Deus.', 'Permaneça fiel mesmo quando parece estar sozinho (Elias).']
    ),
    (
        '2reis', '2 Reis', ARRAY['2Rs', '2 Reis'], 'VT',
        'A história dos reinos divididos até o exílio. Eliseu sucede Elias com porção dobrada de poder. Israel cai para a Assíria e Judá para a Babilônia devido à idolatria persistente.',
        ARRAY['Milagres e Misericórdia', 'Juízo Inevitável', 'Idolatria', 'Palavra Profética'],
        ARRAY['Confie no poder de Deus para suprir necessidades (Eliseu).', 'Leve a sério os avisos de Deus contra o pecado.', 'Veja a soberania de Deus sobre as nações.']
    ),
    (
        '1cronicas', '1 Crônicas', ARRAY['1Cr', '1 Cron'], 'VT',
        'Uma releitura da história focada no aspecto espiritual e sacerdotal para encorajar os exilados que retornaram. Enfatiza a Aliança Davídica e a preparação para o Templo.',
        ARRAY['Adoração Verdadeira', 'Reinado de Davi', 'Soberania na História', 'Bênção de Deus'],
        ARRAY['Busque a Deus e Sua força; busque a Sua face continuamente.', 'Valorize a adoração e o serviço na Casa de Deus.', 'Confie que Deus cumpre Seus propósitos na história.']
    ),
    (
        '2cronicas', '2 Crônicas', ARRAY['2Cr', '2 Cron'], 'VT',
        'Foca na dinastia de Davi e no Templo em Jerusalém. Destaca os reis que buscaram a Deus (reavivamentos) e o princípio: "Se buscarmos a Deus, Ele se deixará achar".',
        ARRAY['Reavivamento', 'Oração e Humildade', 'Centralidade do Templo', 'Juízo e Misericórdia'],
        ARRAY['Se o meu povo se humilhar e orar, Eu sararei a sua terra.', 'Busque o Senhor enquanto Ele está perto.', 'Lembre-se que a batalha é de Deus.']
    ),
    (
        'esdras', 'Esdras', ARRAY['Ed', 'Esd'], 'VT',
        'O retorno do exílio babilônico e a reconstrução do Templo sob Zorobabel, e a restauração espiritual do povo sob o escriba Esdras, com ênfase na Palavra de Deus.',
        ARRAY['Restauração', 'Providência Divina', 'Ensino da Palavra', 'Santidade na Comunidade'],
        ARRAY['A mão bondosa de Deus está sobre os que O buscam.', 'Dedique-se a estudar e praticar a Palavra de Deus.', 'Santifique-se e separe-se do pecado.']
    ),
    (
        'neemias', 'Neemias', ARRAY['Ne', 'Nee'], 'VT',
        'Neemias lidera a reconstrução dos muros de Jerusalém apesar da oposição. Exemplo excelso de liderança, oração e ação prática ("ora e vigia").',
        ARRAY['Liderança Piedosa', 'Oração e Ação', 'Reconstrução', 'Cuidado com os Pobres'],
        ARRAY['A alegria do Senhor é a vossa força.', 'Ore antes de agir, e aja confiando em Deus.', 'Não desanime diante da oposição; persista na obra.']
    ),
    (
        'ester', 'Ester', ARRAY['Et', 'Est'], 'VT',
        'Deus preserva Seu povo da aniquilação na Pérsia através da rainha Ester e Mardoqueu. O nome de Deus não aparece, mas Sua providência é visível em cada detalhe.',
        ARRAY['Providência Soberana', 'Coragem', 'Libertação', 'Para um Tempo como Este'],
        ARRAY['Você pode ter sido colocado onde está para um propósito divino.', 'Tenha coragem para fazer o que é certo.', 'Confie que Deus age mesmo quando parece silente.']
    ),

    -- --- POETIC Books (Job, Song of Solomon) - Psalms/Proverbs/Eccl already done ---
    (
        'jo', 'Jó', ARRAY['Jó', 'Job'], 'VT',
        'Um drama sobre o sofrimento do justo e a soberania de Deus. Questiona "por que sofremos?" e responde revelando a majestade inescrutável de Deus, não as razões detalhadas.',
        ARRAY['Soberania no Sofrimento', 'Fé Desinteressada', 'O Silêncio de Deus', 'Poder Criador'],
        ARRAY['Adore a Deus mesmo na dor: "O Senhor deu, o Senhor tomou, bendito seja..."', 'Confie que Deus é sábio mesmo quando não O entendemos.', 'Interceda pelos outros mesmo em seu próprio sofrimento.']
    ),
    (
        'canticos', 'Cânticos', ARRAY['Ct', 'Cant'], 'VT',
        'Um poema lírico celebrando o amor romântico e sexual dentro do casamento como dom de Deus. Alegoricamente, reflete o amor apaixonado de Deus pelo Seu povo.',
        ARRAY['Amor Conjugal', 'Beleza e Desejo', 'Fidelidade', 'União com Cristo'],
        ARRAY['Cultive o amor e a pureza no casamento.', 'Celebre o amor como um reflexo do amor de Deus.', 'Busque intimidade espiritual com Cristo, o Amado da alma.']
    ),

    -- --- MAJOR PROPHETS (Remaining) ---
    -- Isa/Jer done --
    (
        'lamentacoes', 'Lamentações', ARRAY['Lm', 'Lam'], 'VT',
        'Jeremias chora a destruição de Jerusalém. No centro da dor, surge a esperança: "As misericórdias do Senhor são a causa de não sermos consumidos".',
        ARRAY['Lamento Profundo', 'Juízo Divino', 'Fidelidade de Deus', 'Esperança'],
        ARRAY['Derrame sua alma diante de Deus na dor.', 'Lembre-se: "Grande é a Tua fidelidade."', 'Espere no Senhor, pois Ele é bom para a alma que O busca.']
    ),
    (
        'ezequiel', 'Ezequiel', ARRAY['Ez', 'Eze'], 'VT',
        'Profeta no exílio, usa visões e atos simbólicos para anunciar o juízo e a restauração futura (Vale de Ossos Secos, o Novo Templo). Enfatiza a glória e santidade de Deus.',
        ARRAY['A Glória de Deus', 'O Espírito Vivificador', 'Responsabilidade Pessoal', 'O Novo Coração'],
        ARRAY['Peça a Deus um coração novo e um espírito novo.', 'Creia que o Espírito pode dar vida aos ossos secos.', 'Busque a glória de Deus em tudo.']
    ),
    (
        'daniel', 'Daniel', ARRAY['Dn', 'Dan'], 'VT',
        'Fidelidade em terra estranha e visões apocalípticas sobre os impérios mundiais e o Reino eterno de Deus. Mostra que Deus governa sobre os reinos dos homens.',
        ARRAY['Soberania de Deus', 'Fidelidade sob Pressão', 'Oração e Profecia', 'O Messias Vindouro'],
        ARRAY['Decida não se contaminar com os manjares do mundo.', 'Ore com constância, mesmo diante de ameaças.', 'Confie que o Reino de Deus triunfará sobre todos.']
    ),

    -- --- MINOR PROPHETS (Complete) ---
    (
        'oseias', 'Oseias', ARRAY['Os', 'Ose'], 'VT',
        'Deus ordena ao profeta casar com uma prostituta para ilustrar o amor fiel de Deus por um Israel infiel. Um convite emocionante ao arrependimento.',
        ARRAY['Amor Incondicional', 'Infidelidade Espiritual', 'Conhecimento de Deus', 'Restauração'],
        ARRAY['Conheçamos e prossigamos em conhecer ao Senhor.', 'Volte para Deus, pois Ele cura a infidelidade.', 'Valorize o amor leal de Deus por você.']
    ),
    (
        'joel', 'Joel', ARRAY['Jl', 'Joe'], 'VT',
        'Uma praga de gafanhotos prefigura o "Dia do Senhor". Promete o derramamento do Espírito Santo sobre toda carne, cumprido em Pentecostes.',
        ARRAY['Dia do Senhor', 'Arrependimento Urgente', 'Espírito Santo', 'Restauração'],
        ARRAY['Rasgue o coração e não as vestes em arrependimento.', 'Busque a plenitude do Espírito Santo.', 'Invoque o nome do Senhor para ser salvo.']
    ),
    (
        'amos', 'Amós', ARRAY['Am', 'Amo'], 'VT',
        'Um pastor denuncia a injustiça social e a religiosidade hipócrita de Israel. Deus ruge de Sião exigindo justiça: "Corra o juízo como as águas".',
        ARRAY['Justiça Social', 'Juízo de Deus', 'Hipotrisia Religiosa', 'Busca genuína'],
        ARRAY['Busque o bem, e não o mal, para que vivais.', 'Não separe adoração de justiça social.', 'Prepare-se para encontrar-se com o teu Deus.']
    ),
    (
        'obadias', 'Obadias', ARRAY['Ob', 'Oba'], 'VT',
        'O menor livro do VT, profetizando o julgamento de Edom por sua soberba e violência contra o irmão Jacó (Israel). "O Reino será do Senhor".',
        ARRAY['Soberba e Queda', 'Justiça Divina', 'Fraternidade Traída', 'Vitória de Deus'],
        ARRAY['Não se alegre com a calamidade do seu irmão.', 'Abata a soberba do seu coração.', 'Confie que Deus julgará as injustiças da história.']
    ),
    (
        'jonas', 'Jonas', ARRAY['Jn', 'Jon'], 'VT',
        'Um profeta relutante foge da missão de pregar aos inimigos em Nínive. Revela que a misericórdia de Deus se estende a todas as nações, repreendendo o nacionalismo estreito.',
        ARRAY['Misericórdia Universal', 'Soberania sobre a Criação', 'Arrependimento', 'Compaixão'],
        ARRAY['Não fuja da vontade de Deus.', 'Tenha compaixão dos perdidos, como Deus tem.', 'Reconheça que a salvação vem do Senhor.']
    ),
    (
        'miqueias', 'Miqueias', ARRAY['Mq', 'Miq'], 'VT',
        'Denuncia a corrupção dos líderes. Profetiza o nascimento do Messias em Belém. Resume a religião pura: "Praticar a justiça, amar a misericórdia e andar humildemente com Deus".',
        ARRAY['Justiça e Misericórdia', 'Messias Pastor (Belém)', 'Deus Perdoador', 'Esperança'],
        ARRAY['O que Deus pede de ti? Justiça, misericórdia e humildade.', 'Confie que Deus lançará seus pecados nas profundezas do mar.', 'Espere no Deus da sua salvação.']
    ),
    (
        'naum', 'Naum', ARRAY['Na', 'Nau'], 'VT',
        'Profecia da queda definitiva de Nínive. Mostra Deus como vingador contra o mal persistente e refúgio para os que Nele confiam.',
        ARRAY['Juízo sobre o Mal', 'Bondade e Severidade', 'Refúgio na Angústia'],
        ARRAY['O Senhor é bom, uma fortaleza no dia da angústia.', 'Confie que Deus extinguirá o mal.', 'Não abuse da paciência de Deus.']
    ),
    (
        'habacuque', 'Habacuque', ARRAY['Hc', 'Hab'], 'VT',
        'O profeta questiona Deus: "Por que o mal prevalece?". Deus responde que usará os babilônios para julgar. Habacuque aprende a viver pela fé: "O justo viverá da sua fé".',
        ARRAY['Fé na Adversidade', 'Soberania Misteriosa', 'Alegria na Salvação', 'O Justo Viverá da Fé'],
        ARRAY['Ainda que a figueira não floresça, alegre-se no Deus da sua salvação.', 'Viva pela fé, não pelo que vê.', 'Espere a visão de Deus, pois certamente virá.']
    ),
    (
        'sofonias', 'Sofonias', ARRAY['Sf', 'Sof'], 'VT',
        'Anuncia o "Grande Dia do Senhor", dia de ira e purificação. Promete que Deus deixará um remanescente humilde e que Ele Se alegrará sobre eles com cânticos.',
        ARRAY['Dia do Senhor', 'Juízo Universal', 'Remanescente Humilde', 'Alegria de Deus'],
        ARRAY['Busque a mansidão e a justiça.', 'Saiba que Deus se alegra em você e renova seu amor.', 'Não tema, pois o Senhor está no meio de ti.']
    ),
    (
        'ageu', 'Ageu', ARRAY['Ag', 'Age'], 'VT',
        'Exorta o povo a retomar a construção do Templo, paralisada por desânimo e materialismo. "Considerai o vosso passado". A glória da segunda casa será maior que a da primeira.',
        ARRAY['Prioridades', 'Construção do Templo', 'Glória Futura', 'Soberania de Deus'],
        ARRAY['Coloque o Reino de Deus em primeiro lugar.', 'Não se desanime com o "pequeno começo".', '"A minha paz darei neste lugar", diz o Senhor.']
    ),
    (
        'zacarias', 'Zacarias', ARRAY['Zc', 'Zac'], 'VT',
        'Visões apocalípticas encorajando a reconstrução. Cheio de profecias messiânicas (Rei humilde, traspassado, pastor ferido). "Não por força, mas pelo meu Espírito".',
        ARRAY['O Messias Rei e Sacerdote', 'Espírito Santo', 'Restauração de Jerusalém', 'Limpeza do Pecado'],
        ARRAY['Não despreze o dia das pequenas coisas.', 'Dependa do Espírito de Deus, não da força humana.', 'Olhe para Aquele a quem traspassaram (Jesus).']
    ),
    (
        'malaquias', 'Malaquias', ARRAY['Ml', 'Mal'], 'VT',
        'A última voz do VT. Repreende o formalismo, divórcios e falta de dízimos. Anuncia a vinda do "Sol da Justiça" e do precursor (Elias/João Batista).',
        ARRAY['Adoração Sincera', 'Fidelidade Conjugal', 'Dízimos e Ofertas', 'Dia do Juízo'],
        ARRAY['Dê a Deus o seu melhor, não o resto.', 'Seja fiel em seus relacionamentos e finanças.', 'Espere a cura que vem do Sol da Justiça.']
    ),

    -- --- NEW TESTAMENT (Previous Batch - RE-INCLUDED FOR COMPLETENESS) ---
    (
        'marcos', 'Marcos', ARRAY['Mc', 'Mar'], 'NT',
        'O evangelho da ação, escrito provavelmente por João Marcos (c. 55-65 d.C.) sob influência de Pedro. Retrata Jesus como o Servo Sofredor que age com poder e autoridade imediata.',
        ARRAY['Servo Sofredor', 'Ação e Poder', 'Discipulado no Caminho', 'Segredo Messiânico'],
        ARRAY['Sirva a Deus com prontidão e humildade.', 'Creia no poder de Jesus sobre a natureza e as enfermidades.', 'Siga a Cristo mesmo quando o caminho envolve a cruz.']
    ),
    (
        'lucas', 'Lucas', ARRAY['Lc', 'Luc'], 'NT',
        'O "médico amado" escreve (c. 60 d.C.) para Teófilo, enfatizando a humanidade de Jesus e Sua compaixão pelos marginalizados (pobres, mulheres, gentios).',
        ARRAY['Filho do Homem', 'Salvação Universal', 'Oração e Espírito Santo', 'Compaixão Social'],
        ARRAY['Leve o evangelho a todos, sem distinção.', 'Cultive uma vida de oração constante.', 'Trate os marginalizados com a dignidade de Cristo.']
    ),
    (
        'atos', 'Atos', ARRAY['At', 'Ato', 'Atos'], 'NT',
        'Volume 2 de Lucas, narrando a expansão da Igreja pelo poder do Espírito Santo, de Jerusalém a Roma (c. 62 d.C.). Mostra que nada pode deter o avanço do Reino.',
        ARRAY['Poder do Espírito', 'Testemunho', 'Expansão da Igreja', 'Soberania de Deus'],
        ARRAY['Busque o enchimento do Espírito Santo para testemunhar.', 'Persevere na comunhão e no ensino dos apóstolos.', 'Confie que Deus dirige a missão da Sua igreja.']
    ),
    (
        '1corintios', '1 Coríntios', ARRAY['1Co', '1 Cor'], 'NT',
        'Paulo escreve (c. 55 d.C.) para corrigir divisões e desordens na igreja de Corinto. Aborda temas práticos como casamento, dons espirituais e a ressurreição.',
        ARRAY['Unidade na Igreja', 'Santidade Sexual', 'Dons Espirituais', 'Amor (Cap. 13)', 'Ressurreição'],
        ARRAY['Busque a unidade do corpo de Cristo acima de preferências pessoais.', 'Use seus dons para edificação, não para exibição.', 'Faça tudo com amor.', 'Viva na esperança da ressurreição.']
    ),
    (
        '2corintios', '2 Coríntios', ARRAY['2Co', '2 Cor'], 'NT',
        'A carta mais pessoal de Paulo (c. 56 d.C.), defendendo seu apostolado através da fraqueza. Revela o "ministério da reconciliação" e o poder de Deus em vasos de barro.',
        ARRAY['Poder na Fraqueza', 'Ministério da Reconciliação', 'Generosidade', 'Consolo de Deus'],
        ARRAY['Encontre a força de Deus em suas fraquezas.', 'Seja um embaixador da reconciliação.', 'Contribua com alegria para a obra de Deus.']
    ),
    (
        'galatas', 'Gálatas', ARRAY['Gl', 'Gal'], 'NT',
        'O "grito de liberdade" de Paulo (c. 49 d.C.) contra legalistas que exigiam a circuncisão. Defende apaixonadamente a justificação pela fé somente e a liberdade no Espírito.',
        ARRAY['Justificação pela Fé', 'Liberdade Cristã', 'Fruto do Espírito', 'Não à Legalismo'],
        ARRAY['Não troque a graça de Cristo por regras humanas.', 'Ande no Espírito para não satisfazer a carne.', 'Use sua liberdade para servir uns aos outros em amor.']
    ),
    (
        'efesios', 'Efésios', ARRAY['Ef', 'Efe'], 'NT',
        'Uma carta circular (c. 60-62 d.C.) sobre o "mistério de Cristo" e a Igreja. Divide-se em doutrina (nossa posição em Cristo) e prática (nossa caminhada no mundo).',
        ARRAY['Riquezas em Cristo', 'Unidade da Igreja', 'Batalha Espiritual', 'Família Cristã'],
        ARRAY['Lembre-se de sua identidade de filho amado de Deus.', 'Revista-se de toda a armadura de Deus diariamente.', 'Mantenha a unidade do Espírito pelo vínculo da paz.']
    ),
    (
        'filipenses', 'Filipenses', ARRAY['Fp', 'Fil'], 'NT',
        'A carta da alegria, escrita da prisão (c. 61 d.C.). Paulo agradece a oferta dos filipenses e os exorta à humildade (exemplo de Cristo) e ao contentamento em qualquer situação.',
        ARRAY['Alegria em Tudo', 'Humildade de Cristo', 'Contentamento', 'Unidade'],
        ARRAY['Alegre-se no Senhor, não nas circunstâncias.', 'Considere os outros superiores a si mesmo.', 'Busque a paz de Deus que excede todo entendimento.']
    ),
    (
        'colossenses', 'Colossenses', ARRAY['Cl', 'Col'], 'NT',
        'Escrita para combater heresias que diminuíam a Cristo (c. 60-62 d.C.). Paulo apresenta a preeminência e suficiência total de Cristo: Ele é tudo em todos.',
        ARRAY['Supremacia de Cristo', 'Plenitude de Deus', 'Vida Ressuscitada', 'Cristo em Vós'],
        ARRAY['Não se deixe enganar por filosofias humanas.', 'Busque as coisas que são de cima.', 'Faça tudo como para o Senhor.']
    ),
    (
        '1tessalonicenses', '1 Tessalonicenses', ARRAY['1Ts', '1 Tes'], 'NT',
        'Uma das primeiras cartas (c. 51 d.C.), encorajando uma igreja jovem sob perseguição. Foca na esperança da volta de Cristo e na vida de santidade enquanto se espera.',
        ARRAY['Segunda Vinda', 'Santificação', 'Esperança', 'Vida Exemplar'],
        ARRAY['Console-se com a promessa da volta de Jesus.', 'Ore sem cessar e dê graças em tudo.', 'Abstenha-se de toda aparência do mal.']
    ),
    (
        '2tessalonicenses', '2 Tessalonicenses', ARRAY['2Ts', '2 Tes'], 'NT',
        'Escrita logo após a primeira (c. 51-52 d.C.) para corrigir mal-entendidos sobre o Dia do Senhor, alertando contra a ociosidade e explicando a vinda do "homem do pecado".',
        ARRAY['Dia do Senhor', 'Julgamento de Deus', 'Trabalho e Ordem', 'Perseverança'],
        ARRAY['Não se perturbe com falsas profecias.', 'Trabalhe tranquilamente para ganhar o próprio pão.', 'Não se canse de fazer o bem.']
    ),
    (
        '1timoteo', '1 Timóteo', ARRAY['1Tm', '1 Tim'], 'NT',
        'Carta pastoral (c. 64 d.C.) instruindo Timóteo sobre a ordem na igreja de Éfeso: liderança qualificada, oração pública, combate a falsos mestres e cuidado com viúvas.',
        ARRAY['Liderança da Igreja', 'Sã Doutrina', 'Piedade com Contentamento', 'Oração'],
        ARRAY['Ore por todas as autoridades.', 'Busque viver com piedade e contentamento (grande lucro).', 'Combata o bom combate da fé.']
    ),
    (
        'tito', 'Tito', ARRAY['Tt', 'Tit', 'Tito'], 'NT',
        'Instruções a Tito em Creta (c. 64 d.C.) para organizar a igreja. Enfatiza que a graça de Deus não só salva, mas educa para vivermos de maneira sensata, justa e piedosa.',
        ARRAY['Boas Obras', 'Graça Educadora', 'Liderança', 'Vida Saudável'],
        ARRAY['Dedique-se à prática de boas obras.', 'Permita que a graça transforme seu caráter.', 'Evite controvérsias tolas e inúteis.']
    ),
    (
        'filemom', 'Filemom', ARRAY['Fm', 'Flm', 'Filem'], 'NT',
        'Um bilhete pessoal (c. 60-62 d.C.) intercedendo pelo escravo fugitivo Onésimo. Paulo pede que Filemom o receba não mais como escravo, mas como irmão amado.',
        ARRAY['Perdão', 'Reconciliação', 'Igualdade em Cristo', 'Intercessão'],
        ARRAY['Perdoe e restaure relacionamentos quebrados.', 'Veja as pessoas através dos olhos de Cristo.', 'Esteja disposto a pagar o preço pela reconciliação de outros.']
    ),
    (
        'tiago', 'Tiago', ARRAY['Tg', 'Tia', 'Tiago'], 'NT',
        'Provavelmente o primeiro livro do NT (c. 45 d.C.), escrito pelo irmão de Jesus. É a "literatura de sabedoria" do NT, ensinando que a fé genuína inevitavelmente produz obras.',
        ARRAY['Fé e Obras', 'Sabedoria do Alto', 'Controle da Língua', 'Oração e Fé'],
        ARRAY['Seja praticante da Palavra, não apenas ouvinte.', 'Peça sabedoria a Deus com fé.', 'Demonstre sua fé através de suas ações.']
    ),
    (
        '2pedro', '2 Pedro', ARRAY['2Pe', '2 Pe'], 'NT',
        'O testamento final de Pedro (c. 67 d.C.), alertando contra falsos mestres e zombadores que negam a volta de Cristo. Exorta ao crescimento na graça e no conhecimento.',
        ARRAY['Falsos Mestres', 'Dia do Senhor', 'Crescimento Espiritual', 'Certeza da Palavra'],
        ARRAY['Procure crescer na graça e no conhecimento de Jesus.', 'Confie que a demora de Deus é oportunidade de salvação.', 'Esteja atento para não cair no erro dos iníquos.']
    ),
    (
        '1joao', '1 João', ARRAY['1Jo', '1 Jo'], 'NT',
        'Escrita para dar certeza da salvação (c. 90 d.C.). Apresenta testes de vida (obediência), amor (fraternal) e verdade (doutrina) para distinguir o verdadeiro cristão.',
        ARRAY['Certeza da Salvação', 'Deus é Amor', 'Deus é Luz', 'Comunhão'],
        ARRAY['Ande na luz, confessando seus pecados.', 'Ame seus irmãos não só de palavra, mas em ação.', 'Não ame o mundo nem o que nele há.']
    ),
    (
        '2joao', '2 João', ARRAY['2Jo', '2 Jo'], 'NT',
        'Carta curta à "senhora eleita" (igreja), alertando para não receber falsos mestres que não confessam Jesus em carne, pois isso seria ser cúmplice de suas obras más.',
        ARRAY['Verdade e Amor', 'Hospitalidade com Discernimento', 'Falsos Mestres'],
        ARRAY['Ande na verdade e no amor.', 'Tenha discernimento: não apoie quem distorce o evangelho.']
    ),
    (
        '3joao', '3 João', ARRAY['3Jo', '3 Jo'], 'NT',
        'Carta a Gaio, elogiando sua hospitalidade aos missionários, em contraste com Diótrefes que buscava primazia. Encoraja a imitar o bem.',
        ARRAY['Hospitalidade', 'Apoio Missionário', 'Liderança Servidora'],
        ARRAY['Apoie aqueles que trabalham pela verdade.', 'Não imite o mal, mas o bem.', 'Busque servir, não ser o primeiro.']
    ),
    (
        'judas', 'Judas', ARRAY['Jd', 'Jud', 'Judas'], 'NT',
        'Irmão de Tiago e Jesus, escreve (c. 65 d.C.) exortando a "batalhar pela fé". Alerta sobre apóstatas libertinos infiltrados na igreja e anuncia o julgamento certo de Deus.',
        ARRAY['Batalha pela Fé', 'Apostasía', 'Julgamento Divino', 'Preservação em Deus'],
        ARRAY['Edifique-se na fé santíssima, orando no Espírito.', 'Tenha compaixão dos que duvidam, salvando-os do fogo.', 'Louve Aquele que é poderoso para lhe guardar de tropeçar.']
    ),
    (
        'apocalipse', 'Apocalipse', ARRAY['Ap', 'Apo', 'Rev'], 'NT',
        'A revelação de Jesus Cristo a João em Patmos (c. 95 d.C.). Através de visões apocalípticas, garante a vitória final de Cristo sobre o mal e o estabelecimento do Novo Céu e Nova Terra.',
        ARRAY['Vitória de Cristo', 'Soberania de Deus', 'Adoração Celestial', 'Novos Céus'],
        ARRAY['Adore a Deus e ao Cordeiro acima de tudo.', 'Não tema o sofrimento futuro; seja fiel até a morte.', 'Mantenha viva a esperança: "Vem, Senhor Jesus!"']
    ),
    (
        'proverbios', 'Provérbios', ARRAY['Pv', 'Pro'], 'VT',
        'Sabedoria prática para a vida diária, compilada principalmente por Salomão. Ensina que "o temor do Senhor é o princípio da sabedoria" e contrasta o caminho do sábio com o do tolo.',
        ARRAY['Temor do Senhor', 'Sabedoria vs Insensatez', 'Vida Reta', 'Palavras e Trabalho'],
        ARRAY['Busque a sabedoria como a tesouros escondidos.', 'Confie no Senhor de todo o coração.', 'Guarde seu coração, pois dele procedem as fontes da vida.']
    ),
    (
        'eclesiastes', 'Eclesiastes', ARRAY['Ec', 'Ecl'], 'VT',
        'O Pregador reflete sobre a vaidade da vida "debaixo do sol" sem Deus. Conclui que o sentido da existência é temer a Deus e guardar Seus mandamentos.',
        ARRAY['Vaidade da Vida', 'Tempo para Tudo', 'Temor a Deus', 'Morte e Eternidade'],
        ARRAY['Aproveite a vida como dom de Deus, mas lembre-se do Criador.', 'Não coloque sua esperança em riquezas ou prazeres passageiros.', 'Tema a Deus em tudo o que fizer.']
    ),
    (
        'isaias', 'Isaías', ARRAY['Is', 'Isa'], 'VT',
        'O "profeta evangélico" (c. 740-680 a.C.). Anuncia o julgamento de Judá, mas também consola com profecias detalhadas sobre o Messias, o Servo Sofredor que traria salvação.',
        ARRAY['Santidade de Deus', 'Messias Prometido', 'Juízo e Consolo', 'Restauracao'],
        ARRAY['Confie em Deus, o Santo de Israel, em tempos de crise.', 'Busque o Senhor enquanto se pode achar.', 'Descanse na promessa de novos céus e nova terra.']
    ),
     (
        'jeremias', 'Jeremias', ARRAY['Jr', 'Jer'], 'VT',
        'O "profeta chorão" (c. 627-586 a.C.) que anunciou a destruição de Jerusalém e o exílio. Também profetizou a Nova Aliança, onde Deus escreveria Sua lei nos corações.',
        ARRAY['Arrependimento', 'Nova Aliança', 'Soberania de Deus', 'Idolatria'],
        ARRAY['Não confie em rituais religiosos vazios, mas mude o coração.', 'Confie que os planos de Deus são de paz e esperança.', 'Busque a Deus de todo o coração.']
    )

on conflict (id) do nothing;

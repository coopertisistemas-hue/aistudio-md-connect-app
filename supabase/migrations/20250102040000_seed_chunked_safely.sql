-- SAFE CHUNKED SEED
-- Executing in blocks to prevent "all-or-nothing" failures and ensure all books are present.

-- BLOCK 1: PENTATEUCH (5 Books)
INSERT INTO public.bible_books (id, name, abbrev, testament, historical_context, themes, application) VALUES
('genesis', 'Gênesis', ARRAY['Gn', 'Gên'], 'VT', 'O livro das origens. Criação, queda e aliança.', ARRAY['Criação', 'Aliança'], ARRAY['Deus é o Criador.', 'Confie na providência.']),
('exodo', 'Êxodo', ARRAY['Ex', 'Êx'], 'VT', 'Libertação do Egito e a Lei.', ARRAY['Redenção', 'Lei'], ARRAY['Deus liberta.', 'Seja santo.']),
('levitico', 'Levítico', ARRAY['Lv', 'Lev'], 'VT', 'Santidade e sacrifícios.', ARRAY['Santidade', 'Expiação'], ARRAY['Busque a santidade.', 'Cristo é o sacrifício perfeito.']),
('numeros', 'Números', ARRAY['Nm', 'Num'], 'VT', 'Peregrinação no deserto.', ARRAY['Fidelidade', 'Juízo'], ARRAY['Não murmure.', 'Siga a Deus.']),
('deuteronomio', 'Deuteronômio', ARRAY['Dt', 'Deut'], 'VT', 'Reafirmação da Lei.', ARRAY['Obediência', 'Amor'], ARRAY['Ame a Deus acima de tudo.', 'Ensine a Palavra.'])
ON CONFLICT (id) DO UPDATE SET historical_context = excluded.historical_context;

-- BLOCK 2: HISTORICAL (12 Books)
INSERT INTO public.bible_books (id, name, abbrev, testament, historical_context, themes, application) VALUES
('josue', 'Josué', ARRAY['Js', 'Jos'], 'VT', 'Conquista da terra.', ARRAY['Conquista', 'Coragem'], ARRAY['Seja forte e corajoso.', 'Confie nas promessas.']),
('juizes', 'Juízes', ARRAY['Jz', 'Jui'], 'VT', 'Ciclos de apostasia e juízes.', ARRAY['Pecado', 'Livramento'], ARRAY['Não se afaste de Deus.', 'Clame por socorro.']),
('rute', 'Rute', ARRAY['Rt', 'Rut'], 'VT', 'História de redenção.', ARRAY['Lealdade', 'Redenção'], ARRAY['Deus age no dia a dia.', 'Seja leal.']),
('1samuel', '1 Samuel', ARRAY['1Sm', '1 Sam'], 'VT', 'Samuel, Saul e Davi.', ARRAY['Reinado', 'Coração'], ARRAY['Deus vê o coração.', 'Obedeça a Deus.']),
('2samuel', '2 Samuel', ARRAY['2Sm', '2 Sam'], 'VT', 'Reinado de Davi e pecado.', ARRAY['Aliança', 'Arrependimento'], ARRAY['Arrependa-se genuinamente.', 'Confie na graça.']),
('1reis', '1 Reis', ARRAY['1Rs', '1 Reis'], 'VT', 'Salomão e divisão do reino.', ARRAY['Sabedoria', 'Divisão'], ARRAY['Busque sabedoria.', 'Não divida seu coração.']),
('2reis', '2 Reis', ARRAY['2Rs', '2 Reis'], 'VT', 'Declínio e exílio.', ARRAY['Juízo', 'Profetas'], ARRAY['Ouça a voz de Deus.', 'Não ignore avisos.']),
('1cronicas', '1 Crônicas', ARRAY['1Cr', '1 Cron'], 'VT', 'Genealogias e Davi.', ARRAY['Adoração', 'Legado'], ARRAY['Adore a Deus.', 'Deixe um legado de fé.']),
('2cronicas', '2 Crônicas', ARRAY['2Cr', '2 Cron'], 'VT', 'Reis de Judá e Templo.', ARRAY['Reavivamento', 'Templo'], ARRAY['Busque o Senhor.', 'Humilhe-se e ore.']),
('esdras', 'Esdras', ARRAY['Ed', 'Esd'], 'VT', 'Retorno e reconstrução.', ARRAY['Palavra', 'Restauração'], ARRAY['Estude a Palavra.', 'Restaure seu altar.']),
('neemias', 'Neemias', ARRAY['Ne', 'Nee'], 'VT', 'Reconstrução dos muros.', ARRAY['Liderança', 'Oração'], ARRAY['Ore e trabalhe.', 'Não desista.']),
('ester', 'Ester', ARRAY['Et', 'Est'], 'VT', 'Deus salva Seu povo.', ARRAY['Providência', 'Coragem'], ARRAY['Deus age nos bastidores.', 'Tenha coragem.'])
ON CONFLICT (id) DO UPDATE SET historical_context = excluded.historical_context;

-- BLOCK 3: POETIC (5 Books)
INSERT INTO public.bible_books (id, name, abbrev, testament, historical_context, themes, application) VALUES
('jo', 'Jó', ARRAY['Jó', 'Job'], 'VT', 'Sofrimento e soberania.', ARRAY['Sofrimento', 'Soberania'], ARRAY['Confie em Deus na dor.', 'Deus é soberano.']),
('salmos', 'Salmos', ARRAY['Sl', 'Sal'], 'VT', 'Hinário de oração e louvor.', ARRAY['Louvor', 'Lamento'], ARRAY['Louve em todo tempo.', 'Derrame sua alma.']),
('proverbios', 'Provérbios', ARRAY['Pv', 'Pro'], 'VT', 'Sabedoria para a vida.', ARRAY['Sabedoria', 'Temor'], ARRAY['O temor do Senhor é o início.', 'Busque entendimento.']),
('eclesiastes', 'Eclesiastes', ARRAY['Ec', 'Ecl'], 'VT', 'Vaidade sem Deus.', ARRAY['Vaidade', 'Eternidade'], ARRAY['Tema a Deus.', 'Aproveite a vida com Ele.']),
('canticos', 'Cânticos', ARRAY['Ct', 'Cant'], 'VT', 'Amor conjugal.', ARRAY['Amor', 'Casamento'], ARRAY['Celebre o amor.', 'Ame como Cristo.'])
ON CONFLICT (id) DO UPDATE SET historical_context = excluded.historical_context;

-- BLOCK 4: MAJOR PROPHETS (5 Books)
INSERT INTO public.bible_books (id, name, abbrev, testament, historical_context, themes, application) VALUES
('isaias', 'Isaías', ARRAY['Is', 'Isa'], 'VT', 'O profeta messiânico.', ARRAY['Messias', 'Salvação'], ARRAY['Confie no Santo de Israel.', 'Espere a salvação.']),
('jeremias', 'Jeremias', ARRAY['Jr', 'Jer'], 'VT', 'O profeta chorão.', ARRAY['Aliança', 'Arrependimento'], ARRAY['Chore pelo pecado.', 'Deus restaura.']),
('lamentacoes', 'Lamentações', ARRAY['Lm', 'Lam'], 'VT', 'Lamento por Jerusalém.', ARRAY['Fidelidade', 'Dor'], ARRAY['A fidelidade de Deus é grande.', 'Espere nEle.']),
('ezequiel', 'Ezequiel', ARRAY['Ez', 'Eze'], 'VT', 'Glória e restauração.', ARRAY['Espírito', 'Glória'], ARRAY['Que o Espírito sopre vida.', 'Busque a glória de Deus.']),
('daniel', 'Daniel', ARRAY['Dn', 'Dan'], 'VT', 'Fidelidade no exílio.', ARRAY['Soberania', 'Reino'], ARRAY['O Reino de Deus é eterno.', 'Seja fiel.'])
ON CONFLICT (id) DO UPDATE SET historical_context = excluded.historical_context;

-- BLOCK 5: MINOR PROPHETS (12 Books)
INSERT INTO public.bible_books (id, name, abbrev, testament, historical_context, themes, application) VALUES
('oseias', 'Oseias', ARRAY['Os', 'Ose'], 'VT', 'Amor fiel.', ARRAY['Amor', 'Infidelidade'], ARRAY['Deus ama o infiel.', 'Volte para Ele.']),
('joel', 'Joel', ARRAY['Jl', 'Joe'], 'VT', 'O Espírito Santo.', ARRAY['Espírito', 'Dia do Senhor'], ARRAY['Busque o Espírito.', 'Arrependa-se.']),
('amos', 'Amós', ARRAY['Am', 'Amo'], 'VT', 'Justiça social.', ARRAY['Justiça', 'Pobreza'], ARRAY['Pratique a justiça.', 'Não oprima.']),
('obadias', 'Obadias', ARRAY['Ob', 'Oba'], 'VT', 'Julgamento de Edom.', ARRAY['Orgulho', 'Queda'], ARRAY['Não seja orgulhoso.', 'Deus vê tudo.']),
('jonas', 'Jonas', ARRAY['Jn', 'Jon'], 'VT', 'Deus ama as nações.', ARRAY['Missões', 'Compaixão'], ARRAY['Tenha compaixão.', 'Obedeça ao chamado.']),
('miqueias', 'Miqueias', ARRAY['Mq', 'Miq'], 'VT', 'O que Deus pede.', ARRAY['Humildade', 'Justiça'], ARRAY['Ande humildemente.', 'Ame a misericórdia.']),
('naum', 'Naum', ARRAY['Na', 'Nau'], 'VT', 'Juízo de Nínive.', ARRAY['Juízo', 'Refúgio'], ARRAY['Deus é refúgio.', 'O mal não prevalecerá.']),
('habacuque', 'Habacuque', ARRAY['Hc', 'Hab'], 'VT', 'Fé na dúvida.', ARRAY['Fé', 'Perplexidade'], ARRAY['O justo viverá da fé.', 'Alegre-se em Deus.']),
('sofonias', 'Sofonias', ARRAY['Sf', 'Sof'], 'VT', 'O Dia do Senhor.', ARRAY['Alegria', 'Purificação'], ARRAY['Deus canta sobre você.', 'Busque a mansidão.']),
('ageu', 'Ageu', ARRAY['Ag', 'Age'], 'VT', 'Reconstrução.', ARRAY['Prioridades', 'Templo'], ARRAY['Ponha Deus em primeiro lugar.', 'Não tenhas medo.']),
('zacarias', 'Zacarias', ARRAY['Zc', 'Zac'], 'VT', 'O Rei vem.', ARRAY['Messias', 'Zelo'], ARRAY['Não por força, mas pelo Espírito.', 'O Rei virá.']),
('malaquias', 'Malaquias', ARRAY['Ml', 'Mal'], 'VT', 'Sol da Justiça.', ARRAY['Adoração', 'Família'], ARRAY['Dê o seu melhor.', 'Honre sua família.'])
ON CONFLICT (id) DO UPDATE SET historical_context = excluded.historical_context;

-- BLOCK 6: NEW TESTAMENT (27 Books)
INSERT INTO public.bible_books (id, name, abbrev, testament, historical_context, themes, application) VALUES
('mateus', 'Mateus', ARRAY['Mt', 'Mat'], 'NT', 'Jesus o Rei.', ARRAY['Reino', 'Lei'], ARRAY['Busque o Reino.', 'Siga o Rei.']),
('marcos', 'Marcos', ARRAY['Mc', 'Mar'], 'NT', 'Jesus o Servo.', ARRAY['Serviço', 'Ação'], ARRAY['Sirva como Jesus.', 'Creia.']),
('lucas', 'Lucas', ARRAY['Lc', 'Luc'], 'NT', 'Jesus o Homem Ideal.', ARRAY['Humanidade', 'Espírito'], ARRAY['Jesus ama os perdidos.', 'Ore.']),
('joao', 'João', ARRAY['Jo', 'Joa'], 'NT', 'Jesus o Filho de Deus.', ARRAY['Vida', 'Luz'], ARRAY['Creia para ter vida.', 'Permaneça nEle.']),
('atos', 'Atos', ARRAY['At', 'Ato'], 'NT', 'A Igreja cresce.', ARRAY['Igreja', 'Espírito'], ARRAY['Seja testemunha.', 'O Espírito capacita.']),
('romanos', 'Romanos', ARRAY['Rm', 'Rom'], 'NT', 'A justiça de Deus.', ARRAY['Fé', 'Graça'], ARRAY['O justo vive pela fé.', 'Somos salvos pela graça.']),
('1corintios', '1 Coríntios', ARRAY['1Co', '1 Cor'], 'NT', 'Problemas na igreja.', ARRAY['Amor', 'Unidade'], ARRAY['O amor é supremo.', 'Seja unido.']),
('2corintios', '2 Coríntios', ARRAY['2Co', '2 Cor'], 'NT', 'Ministério da reconciliação.', ARRAY['Consolo', 'Fraqueza'], ARRAY['Deus consola.', 'Seja embaixador.']),
('galatas', 'Gálatas', ARRAY['Gl', 'Gal'], 'NT', 'Liberdade em Cristo.', ARRAY['Liberdade', 'Espírito'], ARRAY['Não seja escravo da lei.', 'Viva pelo Espírito.']),
('efesios', 'Efésios', ARRAY['Ef', 'Efe'], 'NT', 'Unidade em Cristo.', ARRAY['Unidade', 'Efésios'], ARRAY['Você é abençoado.', 'Ande em amor.']),
('filipenses', 'Filipenses', ARRAY['Fp', 'Fil'], 'NT', 'Alegria.', ARRAY['Alegria', 'Humildade'], ARRAY['Alegre-se sempre.', 'Humilhe-se.']),
('colossenses', 'Colossenses', ARRAY['Cl', 'Col'], 'NT', 'Supremacia de Cristo.', ARRAY['Cristo', 'Plenitude'], ARRAY['Cristo é tudo.', 'Pense no alto.']),
('1tessalonicenses', '1 Tessalonicenses', ARRAY['1Ts', '1 Tes'], 'NT', 'A volta de Jesus.', ARRAY['Esperança', 'Santidade'], ARRAY['Jesus volta logo.', 'Console-se.']),
('2tessalonicenses', '2 Tessalonicenses', ARRAY['2Ts', '2 Tes'], 'NT', 'O anticristo.', ARRAY['Juízo', 'Trabalho'], ARRAY['Não seja enganado.', 'Trabalhe.']),
('1timoteo', '1 Timóteo', ARRAY['1Tm', '1 Tim'], 'NT', 'Cuidado pastoral.', ARRAY['Liderança', 'Piedade'], ARRAY['Cuide da igreja.', 'Seja exemplo.']),
('2timoteo', '2 Timóteo', ARRAY['2Tm', '2 Tim'], 'NT', 'O bom combate.', ARRAY['Fidelidade', 'Palavra'], ARRAY['Guarde a fé.', 'Pregue a Palavra.']),
('tito', 'Tito', ARRAY['Tt', 'Tit'], 'NT', 'Boas obras.', ARRAY['Obras', 'Ensino'], ARRAY['Faça o bem.', 'Seja íntegro.']),
('filemom', 'Filemom', ARRAY['Fm', 'Flm'], 'NT', 'Perdão.', ARRAY['Perdão', 'Irmãos'], ARRAY['Perdoe de coração.', 'Receba.']),
('hebreus', 'Hebreus', ARRAY['Hb', 'Heb'], 'NT', 'Jesus é superior.', ARRAY['Sacerdócio', 'Fé'], ARRAY['Jesus é o melhor.', 'Tenha fé.']),
('tiago', 'Tiago', ARRAY['Tg', 'Tia'], 'NT', 'Fé na prática.', ARRAY['Obras', 'Sabedoria'], ARRAY['Pratique o que crê.', 'Controle a língua.']),
('1pedro', '1 Pedro', ARRAY['1Pe', '1 Pe'], 'NT', 'Sofrimento.', ARRAY['Esperança', 'Provação'], ARRAY['Sofra com esperança.', 'Seja santo.']),
('2pedro', '2 Pedro', ARRAY['2Pe', '2 Pe'], 'NT', 'Conhecimento.', ARRAY['Crescimento', 'Verdade'], ARRAY['Cresça na graça.', 'Evite o erro.']),
('1joao', '1 João', ARRAY['1Jo', '1 Jo'], 'NT', 'Comunhão.', ARRAY['Amor', 'Luz'], ARRAY['Ame uns aos outros.', 'Deus é luz.']),
('2joao', '2 João', ARRAY['2Jo', '2 Jo'], 'NT', 'Hospitalidade cautelosa.', ARRAY['Verdade', 'Alerta'], ARRAY['Ande na verdade.', 'Cuidado com falsos.']),
('3joao', '3 João', ARRAY['3Jo', '3 Jo'], 'NT', 'Apoio à verdade.', ARRAY['Apoio', 'Bem'], ARRAY['Apoie os fiéis.', 'Imite o bem.']),
('judas', 'Judas', ARRAY['Jd', 'Jud'], 'NT', 'Batalha pela fé.', ARRAY['Defesa', 'Juízo'], ARRAY['Batalhe pela fé.', 'Deus guarda você.']),
('apocalipse', 'Apocalipse', ARRAY['Ap', 'Apo'], 'NT', 'Vitória final.', ARRAY['Vitória', 'Fim'], ARRAY['Jesus venceu.', 'Adore ao Cordeiro.'])
ON CONFLICT (id) DO UPDATE SET historical_context = excluded.historical_context;

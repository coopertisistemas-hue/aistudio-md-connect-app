-- Create bible_books table for dynamic context
create table if not exists public.bible_books (
    id text primary key, -- e.g. 'romanos', 'genesis'
    name text not null, -- e.g. 'Romanos'
    abbrev text[] not null, -- e.g. ['Rm', 'Rom']
    testament text not null check (testament in ('VT', 'NT')),
    historical_context text not null,
    themes text[] not null default '{}',
    application text[] not null default '{}',
    created_at timestamptz default now()
);

-- Enable RLS
alter table public.bible_books enable row level security;

-- Create Policy: Everyone can read
drop policy if exists "Public read access" on public.bible_books;
create policy "Public read access"
    on public.bible_books
    for select
    to public
    using (true);

-- Seed Data (from bible_books.ts)
insert into public.bible_books (id, name, abbrev, testament, historical_context, themes, application)
values
    (
        'hebreus',
        'Hebreus',
        ARRAY['Hb', 'Heb'],
        'NT',
        'Escrita antes de 70 d.C., esta carta anônima dirige-se a cristãos judeus tentados a voltar ao judaísmo devido à perseguição. O autor demonstra a superioridade absoluta de Cristo sobre profetas, anjos, Moisés e o sistema levítico.',
        ARRAY['Supremacia de Cristo', 'Novo e Melhor Pacto', 'Fé Perseverante', 'Disciplina de Deus'],
        ARRAY[
            'Mantenha os olhos fixos em Jesus, independentemente das circunstâncias.',
            'Valorize a nova aliança e o acesso direto a Deus que temos.',
            'Não abandone a comunhão com outros cristãos.',
            'Aceite a disciplina divina como prova de filiação.'
        ]
    ),
    (
        'joao',
        'João',
        ARRAY['Jo', 'Joã', 'Joa'],
        'NT',
        'O "Discípulo Amado" escreve entre 85-95 d.C., provavelmente de Éfeso. Diferente dos sinóticos, foca na divindade de Jesus ("O Verbo"), usando 7 sinais miraculosos e os grandes discursos "Eu Sou" para gerar fé.',
        ARRAY['Divindade de Jesus', 'Vida Eterna', 'Fé como Confiança', 'Amor Fraternal'],
        ARRAY[
            'Creia que Jesus é o Filho de Deus para ter vida em Seu nome.',
            'Permaneça nEle como o ramo permanece na videira.',
            'Ame os outros como Cristo amou, demonstrando discipulado.',
            'Confie na promessa do Espírito Santo como Consolador.'
        ]
    ),
    (
        '1pedro',
        '1 Pedro',
        ARRAY['1Pe', '1 Pe', '1Ped'],
        'NT',
        'Pedro escreve de Roma (c. 63-64 d.C.) para cristãos dispersos na Ásia Menor enfrentando hostilidade social. Ele encoraja a esperança viva e a santidade, apresentando o sofrimento como parte do chamado cristão.',
        ARRAY['Esperança em meio à dor', 'Santidade', 'Testemunho Cristão', 'Submissão e Humildade'],
        ARRAY[
            'Mantenha uma conduta exemplar mesmo quando caluniado.',
            'Encare o sofrimento não como estranho, mas como partilha com Cristo.',
            'Seja santo em toda a sua maneira de viver.',
            'Humilhe-se sob a poderosa mão de Deus.'
        ]
    ),
    (
        '2timoteo',
        '2 Timóteo',
        ARRAY['2Tm', '2 Tm', '2 Tim'],
        'NT',
        'A última carta de Paulo (c. 67 d.C.), escrita da prisão em Roma pouco antes de sua execução. É um testamento pessoal e urgente para seu "filho na fé", exortando-o a guardar o Evangelho e pregar a Palavra.',
        ARRAY['Fidelidade ao Evangelho', 'Sofrimento pelo Evangelho', 'Inspiração das Escrituras', 'Combate da Fé'],
        ARRAY[
            'Não se envergonhe do testemunho de Cristo.',
            'Maneje bem (interprete corretamente) a Palavra da verdade.',
            'Fuja das paixões da mocidade e busque a justiça.',
            'Esteja preparado para pregar a Palavra em qualquer tempo.'
        ]
    ),
    (
        'salmos',
        'Salmos',
        ARRAY['Sl', 'Sal'],
        'VT',
        'Coletânea de 150 cânticos e orações de Israel, escritos por Davi, Asafe, os filhos de Coré e outros ao longo de séculos. Abrange toda a gama de emoções humanas diante de Deus, do lamento profundo ao louvor exultante.',
        ARRAY['Louvor e Adoração', 'Lamento e Confiança', 'O Reinado de Deus', 'A Palavra de Deus'],
        ARRAY[
            'Derrame seu coração honestamente a Deus em oração.',
            'Encontre refúgio em Deus em tempos de angústia.',
            'Louve a Deus por Seus atributos e obras na criação.',
            'Medite na lei do Senhor dia e noite.'
        ]
    ),
    (
        'genesis',
        'Gênesis',
        ARRAY['Gn', 'Gên'],
        'VT',
        'O livro das origens (Moisés, c. 1446 a.C.), narrando a criação, a queda, e a aliança de Deus com os patriarcas (Abraão, Isaque, Jacó) para abençoar todas as nações.',
        ARRAY['Criação e Queda', 'Aliança', 'Providência Divina', 'Fé dos Patriarcas'],
        ARRAY[
            'Reconheça Deus como Criador soberano de tudo.',
            'Confie que Deus transforma o mal em bem (José).',
            'Ande com Deus em fé, mesmo sem ver o cumprimento total.',
            'Veja a seriedade do pecado e a graça da redenção.'
        ]
    ),
    (
        'mateus',
        'Mateus',
        ARRAY['Mt', 'Mat'],
        'NT',
        'Escrito para judeus (c. 60-65 d.C.), apresenta Jesus como o Messias Rei prometido, o Filho de Davi. Enfatiza o cumprimento das profecias e os ensinos do Reino (Sermão do Monte).',
        ARRAY['Jesus o Rei', 'Reino dos Céus', 'Discipulado Radical', 'Cumprimento da Lei'],
        ARRAY[
            'Busque primeiro o Reino de Deus e Sua justiça.',
            'Faça discípulos de todas as nações (Grande Comissão).',
            'Obedeça aos ensinos de Cristo como fundamento sólido.',
            'Reconheça Jesus como o cumprimento de toda a Escritura.'
        ]
    ),
    (
        'romanos',
        'Romanos',
        ARRAY['Rm', 'Rom'],
        'NT',
        'A magnum opus de Paulo (c. 57 d.C.), escrita de Corinto para a igreja em Roma. Expõe sistematicamente o evangelho da salvação pela graça mediante a fé, a justificação, a santificação e o plano de Deus para Israel e a igreja.',
        ARRAY['Justificação pela Fé', 'Pecado Universal', 'Graça Soberana', 'Vida no Espírito'],
        ARRAY[
            'Confie somente na obra de Cristo para sua justificação, não em obras.',
            'Ofereça seu corpo como sacrifício vivo, santo e agradável a Deus.',
            'Ame sem hipocrisia e vença o mal com o bem.',
            'Reconheça que nada pode nos separar do amor de Deus.'
        ]
    )
on conflict (id) do nothing;

export interface BookContext {
    id: string; // abbreviation (gn, ex, mt, 1tm)
    name: string;
    author: string;
    audience: string;
    date: string;
    purpose: string;
    themes: string[];
}

export const bibleBooksContext: Record<string, BookContext> = {
    // NT
    'mt': {
        id: 'mt',
        name: 'Mateus',
        author: 'Mateus (Levi), o cobrador de impostos e discípulo.',
        audience: 'Judeus cristãos.',
        date: 'Aprox. 60-65 d.C.',
        purpose: 'Demonstrar que Jesus é o Messias prometido, cumprindo as profecias do AT.',
        themes: ['Reino dos Céus', 'Jesus como Rei', 'Cumprimento da Lei', 'Discipulado']
    },
    'mc': {
        id: 'mc',
        name: 'Marcos',
        author: 'João Marcos, primo de Barnabé e companheiro de Pedro.',
        audience: 'Gentios, especialmente romanos.',
        date: 'Aprox. 55-65 d.C.',
        purpose: 'Apresentar Jesus como o Servo Sofredor que veio para servir e dar sua vida.',
        themes: ['Jesus como Servo', 'Milagres', 'Ação Imediata', 'Discipulado Radical']
    },
    'lc': {
        id: 'lc',
        name: 'Lucas',
        author: 'Lucas, o médico amado e historiador.',
        audience: 'Teófilo e gentios gregos.',
        date: 'Aprox. 60 d.C.',
        purpose: 'Fornecer um relato ordenado e histórico da vida de Cristo, enfatizando sua humanidade.',
        themes: ['O Filho do Homem', 'Salvação Universal', 'Espírito Santo', 'Oração']
    },
    'jo': {
        id: 'jo',
        name: 'João',
        author: 'João, o discípulo amado.',
        audience: 'Cristãos em geral e buscadores da verdade.',
        date: 'Aprox. 85-90 d.C.',
        purpose: 'Para que creiais que Jesus é o Cristo, o Filho de Deus, e tenhais vida.',
        themes: ['Divindade de Cristo', 'Vida Eterna', 'Amor', 'Eu Sou']
    },
    'at': {
        id: 'at',
        name: 'Atos',
        author: 'Lucas.',
        audience: 'Teófilo e a igreja primitiva.',
        date: 'Aprox. 61-62 d.C.',
        purpose: 'Registrar a expansão da igreja pelo poder do Espírito Santo.',
        themes: ['Espírito Santo', 'Missões', 'Testemunho', 'Igreja Primitiva']
    },
    'rm': {
        id: 'rm',
        name: 'Romanos',
        author: 'Apóstolo Paulo.',
        audience: 'Cristãos em Roma (Judeus e Gentios).',
        date: 'Aprox. 57 d.C.',
        purpose: 'Apresentar o evangelho da justificação pela fé de forma sistemática.',
        themes: ['Justificação pela Fé', 'Pecado Universal', 'Graça', 'Vida no Espírito']
    },
    '1tm': {
        id: '1tm',
        name: '1 Timóteo',
        author: 'Apóstolo Paulo.',
        audience: 'Timóteo, jovem pastor em Éfeso.',
        date: 'Aprox. 62-64 d.C.',
        purpose: 'Instruir sobre a ordem, liderança e sã doutrina na igreja.',
        themes: ['Liderança', 'Sã Doutrina', 'Piedade', 'Cuidado Pastoral']
    },
    '2tm': {
        id: '2tm',
        name: '2 Timóteo',
        author: 'Apóstolo Paulo (sua última carta).',
        audience: 'Timóteo.',
        date: 'Aprox. 66-67 d.C.',
        purpose: 'Encorajar Timóteo a permanecer firme na fé diante da perseguição e liderar com coragem.',
        themes: ['Fidelidade', 'Perseverança', 'Palavra de Deus', 'Legado']
    },
    '1pe': {
        id: '1pe',
        name: '1 Pedro',
        author: 'Apóstolo Pedro.',
        audience: 'Cristãos dispersos na Ásia Menor.',
        date: 'Aprox. 62-64 d.C.',
        purpose: 'Encorajar os crentes a permanecerem firmes e santos em meio ao sofrimento.',
        themes: ['Sofrimento', 'Esperança Viva', 'Ateidade', 'Submissão']
    },
    'gn': {
        id: 'gn',
        name: 'Gênesis',
        author: 'Moisés.',
        audience: 'Povo de Israel no deserto.',
        date: 'Aprox. 1446-1406 a.C.',
        purpose: 'Revelar a origem do mundo, do homem e da aliança de Deus com Israel.',
        themes: ['Criação', 'Queda', 'Aliança', 'Patriarcas']
    },
    'sl': {
        id: 'sl',
        name: 'Salmos',
        author: 'Davi, Asafe, Filhos de Corá, Salomão e outros.',
        audience: 'Povo de Deus em adoração.',
        date: 'Vários períodos (aprox. 1000 anos).',
        purpose: 'Expressar louvor, lamento, gratidão e confiança em Deus.',
        themes: ['Adoração', 'Confiança', 'Messias', 'Lei de Deus']
    }
    // Add others as needed
};

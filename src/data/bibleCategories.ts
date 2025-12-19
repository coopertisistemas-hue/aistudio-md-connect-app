export type BibleBookDef = {
    key: string; // English key for API
    name: string; // PT-BR Display Name
};

export type BibleCategory = {
    title: string;
    books: BibleBookDef[];
};

export type TestamentData = {
    id: 'OT' | 'NT';
    title: string;
    categories: BibleCategory[];
};

export const BIBLE_CATEGORIES: Record<'OT' | 'NT', TestamentData> = {
    OT: {
        id: 'OT',
        title: 'Antigo Testamento',
        categories: [
            {
                title: 'Pentateuco',
                books: [
                    { key: 'Genesis', name: 'Gênesis' },
                    { key: 'Exodus', name: 'Êxodo' },
                    { key: 'Leviticus', name: 'Levítico' },
                    { key: 'Numbers', name: 'Números' },
                    { key: 'Deuteronomy', name: 'Deuteronômio' },
                ]
            },
            {
                title: 'Históricos',
                books: [
                    { key: 'Joshua', name: 'Josué' },
                    { key: 'Judges', name: 'Juízes' },
                    { key: 'Ruth', name: 'Rute' },
                    { key: '1 Samuel', name: '1 Samuel' },
                    { key: '2 Samuel', name: '2 Samuel' },
                    { key: '1 Kings', name: '1 Reis' },
                    { key: '2 Kings', name: '2 Reis' },
                    { key: '1 Chronicles', name: '1 Crônicas' },
                    { key: '2 Chronicles', name: '2 Crônicas' },
                    { key: 'Ezra', name: 'Esdras' },
                    { key: 'Nehemiah', name: 'Neemias' },
                    { key: 'Esther', name: 'Ester' },
                ]
            },
            {
                title: 'Poéticos & Sapienciais',
                books: [
                    { key: 'Job', name: 'Jó' },
                    { key: 'Psalms', name: 'Salmos' },
                    { key: 'Proverbs', name: 'Provérbios' },
                    { key: 'Ecclesiastes', name: 'Eclesiastes' },
                    { key: 'Song of Solomon', name: 'Cantares' },
                ]
            },
            {
                title: 'Profetas Maiores',
                books: [
                    { key: 'Isaiah', name: 'Isaías' },
                    { key: 'Jeremiah', name: 'Jeremias' },
                    { key: 'Lamentations', name: 'Lamentações' },
                    { key: 'Ezekiel', name: 'Ezequiel' },
                    { key: 'Daniel', name: 'Daniel' },
                ]
            },
            {
                title: 'Profetas Menores',
                books: [
                    { key: 'Hosea', name: 'Oséias' },
                    { key: 'Joel', name: 'Joel' },
                    { key: 'Amos', name: 'Amós' },
                    { key: 'Obadiah', name: 'Obadias' },
                    { key: 'Jonah', name: 'Jonas' },
                    { key: 'Micah', name: 'Miquéias' },
                    { key: 'Nahum', name: 'Naum' },
                    { key: 'Habakkuk', name: 'Habacuque' },
                    { key: 'Zephaniah', name: 'Sofonias' },
                    { key: 'Haggai', name: 'Ageu' },
                    { key: 'Zechariah', name: 'Zacarias' },
                    { key: 'Malachi', name: 'Malaquias' },
                ]
            }
        ]
    },
    NT: {
        id: 'NT',
        title: 'Novo Testamento',
        categories: [
            {
                title: 'Evangelhos',
                books: [
                    { key: 'Matthew', name: 'Mateus' },
                    { key: 'Mark', name: 'Marcos' },
                    { key: 'Luke', name: 'Lucas' },
                    { key: 'John', name: 'João' },
                ]
            },
            {
                title: 'Histórico',
                books: [
                    { key: 'Acts', name: 'Atos' },
                ]
            },
            {
                title: 'Epístolas Paulinas',
                books: [
                    { key: 'Romans', name: 'Romanos' },
                    { key: '1 Corinthians', name: '1 Coríntios' },
                    { key: '2 Corinthians', name: '2 Coríntios' },
                    { key: 'Galatians', name: 'Gálatas' },
                    { key: 'Ephesians', name: 'Efésios' },
                    { key: 'Philippians', name: 'Filipenses' },
                    { key: 'Colossians', name: 'Colossenses' },
                    { key: '1 Thessalonians', name: '1 Tessalonicenses' },
                    { key: '2 Thessalonians', name: '2 Tessalonicenses' },
                    { key: '1 Timothy', name: '1 Timóteo' },
                    { key: '2 Timothy', name: '2 Timóteo' },
                    { key: 'Titus', name: 'Tito' },
                    { key: 'Philemon', name: 'Filemom' },
                ]
            },
            {
                title: 'Epístolas Gerais',
                books: [
                    { key: 'Hebrews', name: 'Hebreus' },
                    { key: 'James', name: 'Tiago' },
                    { key: '1 Peter', name: '1 Pedro' },
                    { key: '2 Peter', name: '2 Pedro' },
                    { key: '1 John', name: '1 João' },
                    { key: '2 John', name: '2 João' },
                    { key: '3 John', name: '3 João' },
                    { key: 'Jude', name: 'Judas' },
                ]
            },
            {
                title: 'Profético',
                books: [
                    { key: 'Revelation', name: 'Apocalipse' },
                ]
            }
        ]
    }
};

export const getAllBooksFlat = () => {
    const otBytes = BIBLE_CATEGORIES.OT.categories.flatMap(c => c.books);
    const ntBytes = BIBLE_CATEGORIES.NT.categories.flatMap(c => c.books);
    return [...otBytes, ...ntBytes];
};

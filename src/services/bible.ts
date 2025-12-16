export interface BibleVerse {
    book_id: string;
    book_name: string;
    chapter: number;
    verse: number;
    text: string;
}

export interface BibleChapter {
    reference: string;
    verses: BibleVerse[];
    text: string;
    translation_id: string;
    translation_name: string;
    translation_note: string;
}

// Simple list of books for selection
export const OLD_TESTAMENT = [
    'Genesis', 'Exodus', 'Leviticus', 'Numbers', 'Deuteronomy', 'Joshua', 'Judges', 'Ruth',
    '1 Samuel', '2 Samuel', '1 Kings', '2 Kings', '1 Chronicles', '2 Chronicles', 'Ezra',
    'Nehemiah', 'Esther', 'Job', 'Psalms', 'Proverbs', 'Ecclesiastes', 'Song of Solomon',
    'Isaiah', 'Jeremiah', 'Lamentations', 'Ezekiel', 'Daniel', 'Hosea', 'Joel', 'Amos',
    'Obadiah', 'Jonah', 'Micah', 'Nahum', 'Habakkuk', 'Zephaniah', 'Haggai', 'Zechariah', 'Malachi'
];

export const NEW_TESTAMENT = [
    'Matthew', 'Mark', 'Luke', 'John', 'Acts', 'Romans', '1 Corinthians', '2 Corinthians',
    'Galatians', 'Ephesians', 'Philippians', 'Colossians', '1 Thessalonians', '2 Thessalonians',
    '1 Timothy', '2 Timothy', 'Titus', 'Philemon', 'Hebrews', 'James', '1 Peter', '2 Peter',
    '1 John', '2 John', '3 John', 'Jude', 'Revelation'
];

// Mapeamento de nomes de livros (Inglês -> Português) para a API
const ENGLISH_TO_PORTUGUESE: Record<string, string> = {
    'Genesis': 'Gênesis',
    'Exodus': 'Êxodo',
    'Leviticus': 'Levítico',
    'Numbers': 'Números',
    'Deuteronomy': 'Deuteronômio',
    'Joshua': 'Josué',
    'Judges': 'Juízes',
    'Ruth': 'Rute',
    '1 Samuel': '1 Samuel',
    '2 Samuel': '2 Samuel',
    '1 Kings': '1 Reis',
    '2 Kings': '2 Reis',
    '1 Chronicles': '1 Crônicas',
    '2 Chronicles': '2 Crônicas',
    'Ezra': 'Esdras',
    'Nehemiah': 'Neemias',
    'Esther': 'Ester',
    'Job': 'Jó',
    'Psalms': 'Salmos',
    'Proverbs': 'Provérbios',
    'Ecclesiastes': 'Eclesiastes',
    'Song of Solomon': 'Cânticos',
    'Isaiah': 'Isaías',
    'Jeremiah': 'Jeremias',
    'Lamentations': 'Lamentações',
    'Ezekiel': 'Ezequiel',
    'Daniel': 'Daniel',
    'Hosea': 'Oseias',
    'Joel': 'Joel',
    'Amos': 'Amós',
    'Obadiah': 'Obadias',
    'Jonah': 'Jonas',
    'Micah': 'Miqueias',
    'Nahum': 'Naum',
    'Habakkuk': 'Habacuque',
    'Zephaniah': 'Sofonias',
    'Haggai': 'Ageu',
    'Zechariah': 'Zacarias',
    'Malachi': 'Malaquias',
    'Matthew': 'Mateus',
    'Mark': 'Marcos',
    'Luke': 'Lucas',
    'John': 'João',
    'Acts': 'Atos',
    'Romans': 'Romanos',
    '1 Corinthians': '1 Coríntios',
    '2 Corinthians': '2 Coríntios',
    'Galatians': 'Gálatas',
    'Ephesians': 'Efésios',
    'Philippians': 'Filipenses',
    'Colossians': 'Colossenses',
    '1 Thessalonians': '1 Tessalonicenses',
    '2 Thessalonians': '2 Tessalonicenses',
    '1 Timothy': '1 Timóteo',
    '2 Timothy': '2 Timóteo',
    'Titus': 'Tito',
    'Philemon': 'Filemom',
    'Hebrews': 'Hebreus',
    'James': 'Tiago',
    '1 Peter': '1 Pedro',
    '2 Peter': '2 Pedro',
    '1 John': '1 João',
    '2 John': '2 João',
    '3 John': '3 João',
    'Jude': 'Judas',
    'Revelation': 'Apocalipse'
};

export const bibleService = {
    getChapter: async (book: string, chapter: number, translation = 'almeida') => {
        // Translations: 'almeida' (Portuguese), 'web' (English)
        try {
            // Se for tradução 'almeida', tentar usar o nome em português
            let apiBook = book;
            if (translation === 'almeida') {
                apiBook = ENGLISH_TO_PORTUGUESE[book] || book;
            }

            const url = `https://bible-api.com/${encodeURIComponent(apiBook)}+${chapter}?translation=${translation}`;
            const response = await fetch(url);
            if (!response.ok) {
                throw new Error(`Failed to fetch chapter: ${response.status} ${response.statusText} for ${url}`);
            }
            return await response.json() as BibleChapter;
        } catch (error) {
            console.error('Bible API Error:', error);
            return null;
        }
    }
};

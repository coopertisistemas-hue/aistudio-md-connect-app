import { supabase } from '@/lib/supabase';

export interface BibleBookData {
    id: string;
    name: string;
    abbrev: string[];
    testament: 'VT' | 'NT';
    historical_context: string;
    themes: string[];
    application: string[];
}

export interface BibleCommentary {
    id: string;
    book_id: string;
    chapter: number;
    verse: number;
    historical_context: string;
    theological_insights: string[];
    practical_application: string[];
    themes: string[];
    author_ref: string;
    cross_references?: string[]; // New Sprint 2
}

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

// Basic mapping for MVP - expand as needed
const PT_TO_EN_BOOKS: Record<string, string> = {
    'gn': 'Genesis', 'gên': 'Genesis', 'genesis': 'Genesis',
    'ex': 'Exodus', 'êx': 'Exodus', 'exodo': 'Exodus',
    'lv': 'Leviticus', 'lev': 'Leviticus',
    'nm': 'Numbers', 'num': 'Numbers',
    'dt': 'Deuteronomy', 'deut': 'Deuteronomy',
    'js': 'Joshua', 'jos': 'Joshua',
    'jz': 'Judges', 'juiz': 'Judges',
    'rt': 'Ruth', 'rute': 'Ruth',
    '1sm': '1 Samuel', '1sam': '1 Samuel',
    '2sm': '2 Samuel', '2sam': '2 Samuel',
    '1rs': '1 Kings', '1reis': '1 Kings',
    '2rs': '2 Kings', '2reis': '2 Kings',
    '1cr': '1 Chronicles', '1chron': '1 Chronicles',
    '2cr': '2 Chronicles', '2chron': '2 Chronicles',
    'ed': 'Ezra', 'esdras': 'Ezra',
    'ne': 'Nehemiah', 'neemias': 'Nehemiah',
    'et': 'Esther', 'ester': 'Esther',
    'job': 'Job', 'jó': 'Job',
    'sl': 'Psalms', 'sal': 'Psalms', 'salmos': 'Psalms',
    'pv': 'Proverbs', 'prov': 'Proverbs',
    'ec': 'Ecclesiastes', 'ecl': 'Ecclesiastes',
    'ct': 'Song of Solomon', 'cant': 'Song of Solomon',
    'is': 'Isaiah', 'isa': 'Isaiah',
    'jr': 'Jeremiah', 'jer': 'Jeremiah',
    'lm': 'Lamentations', 'lam': 'Lamentations',
    'ez': 'Ezekiel', 'eze': 'Ezekiel',
    'dn': 'Daniel', 'dan': 'Daniel',
    'os': 'Hosea', 'oseias': 'Hosea',
    'jl': 'Joel',
    'am': 'Amos', 'amos': 'Amos',
    'ob': 'Obadiah', 'obadias': 'Obadiah',
    'jn': 'Jonah', 'jonas': 'Jonah',
    'mq': 'Micah', 'miq': 'Micah',
    'na': 'Nahum', 'naum': 'Nahum',
    'hc': 'Habakkuk', 'hab': 'Habakkuk',
    'sf': 'Zephaniah', 'sof': 'Zephaniah',
    'ag': 'Haggai', 'ageu': 'Haggai',
    'zc': 'Zechariah', 'zac': 'Zechariah',
    'ml': 'Malachi', 'mal': 'Malachi',
    'mt': 'Matthew', 'mat': 'Matthew',
    'mc': 'Mark', 'mar': 'Mark',
    'lc': 'Luke', 'luc': 'Luke',
    'jo': 'John', 'joão': 'John', 'joao': 'John',
    'at': 'Acts', 'atos': 'Acts',
    'rm': 'Romans', 'rom': 'Romans',
    '1co': '1 Corinthians', '1cor': '1 Corinthians',
    '2co': '2 Corinthians', '2cor': '2 Corinthians',
    'gl': 'Galatians', 'gal': 'Galatians',
    'ef': 'Ephesians', 'efe': 'Ephesians',
    'fp': 'Philippians', 'flp': 'Philippians',
    'cl': 'Colossians', 'col': 'Colossians',
    '1ts': '1 Thessalonians', '1les': '1 Thessalonians',
    '2ts': '2 Thessalonians', '2les': '2 Thessalonians',
    '1tm': '1 Timothy', '1tim': '1 Timothy',
    '2tm': '2 Timothy', '2tim': '2 Timothy',
    'tt': 'Titus', 'tito': 'Titus',
    'fm': 'Philemon', 'filem': 'Philemon',
    'hb': 'Hebrews', 'heb': 'Hebrews',
    'tg': 'James', 'tiago': 'James',
    '1pe': '1 Peter', '1ped': '1 Peter',
    '2pe': '2 Peter', '2ped': '2 Peter',
    '1jo': '1 John', '1joao': '1 John',
    '2jo': '2 John', '2joao': '2 John',
    '3jo': '3 John', '3joao': '3 John',
    'jd': 'Jude', 'judas': 'Jude',
    'ap': 'Revelation', 'apoc': 'Revelation'
};

// Helper to build fallback explanation
const buildVerseExplanation = (bookId: string, chapter: number, verse: number, _text?: string): BibleCommentary => {
    // Simple heuristics driven fallback
    // In a real app, this could use a local JSON of key verses or a smarter rule engine.

    return {
        id: `local-${bookId}-${chapter}-${verse}`,
        book_id: bookId,
        chapter,
        verse,
        historical_context: "Este versículo insere-se no contexto geral do livro, abordando os temas centrais da mensagem do autor para seu público original.",
        theological_insights: [
            "A soberania de Deus e Sua providência sobre a vida humana.",
            "A importância da fé e da obediência à Palavra revelada."
        ],
        practical_application: [
            "Reflita sobre como este princípio se aplica às suas decisões hoje.",
            "Busque orar pedindo sabedoria para viver esta verdade."
        ],
        themes: ["Fé", "Obediência", "Vida Cristã"],
        author_ref: "Bíblia de Estudo (Gerado Automaticamente)",
        cross_references: [
            // Mock dynamic references based on book group?
            // For MVP, return generic popular verses or None
            "Hb 11:1", "Sl 119:105", "Rm 8:28"
        ]
    };
};

export const bibleService = {
    // ... (keeping getChapter, getPassage, getBookContext, verify they are there) ...
    // Note: I will only replace the end of the file including getVerseCommentary to verify integration.

    getChapter: async (book: string, chapter: number, translation = 'almeida') => {
        // ... (implementation same as before)
        try {
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
    },

    getPassage: async (reference: string, translation = 'almeida') => {
        // ... (implementation same as before, preserving huge logic)
        try {
            let searchRef = reference;
            let enBook: string | undefined;
            const parts = reference.trim().split(' ');
            if (parts.length > 0) {
                const bookPart = parts[0].toLowerCase();
                enBook = PT_TO_EN_BOOKS[bookPart];

                if (!enBook && parts.length > 1 && !parts[1].includes(':')) {
                    const compound = `${parts[0]} ${parts[1]}`.toLowerCase();
                    enBook = PT_TO_EN_BOOKS[compound];
                }

                if (enBook) {
                    if (translation === 'almeida' && ENGLISH_TO_PORTUGUESE[enBook]) {
                        const ptBook = ENGLISH_TO_PORTUGUESE[enBook];
                        const match = reference.match(/(\d+[:.]\d+(?:-\d+)?)/);
                        if (match) {
                            const numbers = match[0];
                            searchRef = `${ptBook} ${numbers}`;
                        } else {
                            searchRef = `${ptBook} ${parts.slice(1).join(' ')}`;
                        }
                    } else {
                        const match = reference.match(/(\d+[:.]\d+(?:-\d+)?)/);
                        if (match) {
                            const numbers = match[0];
                            searchRef = `${enBook} ${numbers}`;
                        } else {
                            searchRef = `${enBook} ${parts.slice(1).join(' ')}`;
                        }
                    }
                }
            }
            searchRef = searchRef.trim();
            let url = `https://bible-api.com/${encodeURIComponent(searchRef)}?translation=${translation}`;
            let response = await fetch(url);

            if (!response.ok && enBook && ENGLISH_TO_PORTUGUESE[enBook]) {
                const ptBook = ENGLISH_TO_PORTUGUESE[enBook];
                const match = reference.match(/(\d+[:.]\d+(?:-\d+)?)/);
                const numbers = match ? match[0] : parts.slice(1).join(' ');
                const ptSearchRef = `${ptBook} ${numbers}`;
                console.log(`[BibleAPI] Retrying with PT name: ${ptSearchRef}`);
                url = `https://bible-api.com/${encodeURIComponent(ptSearchRef)}?translation=${translation}`;
                response = await fetch(url);
            }

            if (!response.ok) return null;
            const data = await response.json();
            return {
                reference: data.reference,
                text: data.text,
                verses: data.verses
            };
        } catch (error) {
            console.error('Bible Passage API Error:', error);
            return null;
        }
    },

    getBookContext: async (reference: string) => {
        try {
            const match = reference.match(/^((?:[123I]{1,3}\s*)?[A-Za-zÀ-ÿ]+)/);
            const cleanRef = match ? match[1].toLowerCase().replace(/\./g, '') : '';
            const normalizedInput = cleanRef.replace(/\s+/g, '');
            const { data, error } = await supabase.from('bible_books').select('*');
            if (error) throw error;
            if (!data) return null;
            const book = data.find(b => {
                return b.abbrev.some((a: string) => {
                    const normAbbrev = a.toLowerCase().replace(/\s+/g, '');
                    return normalizedInput.startsWith(normAbbrev) || normalizedInput === normAbbrev;
                });
            });
            return book || null;
        } catch (error) {
            console.error('Bible Context DB Error:', error);
            return null;
        }
    },

    expandBookName: (abbrev: string): string => {
        if (!abbrev) return abbrev;

        // 1. Check if input is already a known English key (Case Insensitive)
        // e.g. "Revelation" -> "Apocalipse"
        const directMatch = Object.keys(ENGLISH_TO_PORTUGUESE).find(k => k.toLowerCase() === abbrev.toLowerCase());
        if (directMatch) {
            return ENGLISH_TO_PORTUGUESE[directMatch];
        }

        // 2. Fallback to existing logic (Abbreviations)
        const lower = abbrev.toLowerCase().replace(/\s+/g, '');
        let fullName = abbrev;
        const enName = PT_TO_EN_BOOKS[lower];

        if (enName) {
            fullName = ENGLISH_TO_PORTUGUESE[enName] || enName;
        } else {
            const found = Object.values(ENGLISH_TO_PORTUGUESE).find(v => v.toLowerCase() === lower);
            if (found) fullName = found;
        }

        // 3. Number Formatting
        if (fullName.startsWith('1 ')) return fullName.replace('1 ', 'Primeiro ');
        if (fullName.startsWith('2 ')) return fullName.replace('2 ', 'Segundo ');
        if (fullName.startsWith('3 ')) return fullName.replace('3 ', 'Terceiro ');

        return fullName;
    },

    getVerseCommentary: async (bookId: string, chapter: number, verse: number, verseText?: string): Promise<BibleCommentary | null> => {
        let result: BibleCommentary | null = null;
        try {
            // 1. Normalize ID
            let searchId = bookId.toLowerCase();
            if (searchId === 'genesis' || searchId === 'gênesis') searchId = 'gn';

            // 2. Try DB
            const { data, error } = await supabase
                .from('bible_commentaries')
                .select('*')
                .eq('book_id', searchId)
                .eq('chapter', chapter)
                .eq('verse', verse)
                .maybeSingle();

            if (!error && data) {
                result = data as BibleCommentary;
            }

            // 3. Fallback to AI (Cloud) if configured, or Local Fallback
            if (!result && verseText) {
                // Ideally toggle: Use AI? 
                // For MVP Speed + Robustness, let's prioritize Cloud AI if keys exist, else Local.
                // Assuming we want to TRY cloud first:
                try {
                    const { data: genData } = await supabase.functions.invoke('generate-verse-commentary', {
                        body: {
                            book_id: searchId,
                            chapter,
                            verse,
                            text: verseText
                        }
                    });
                    if (genData?.data) {
                        result = genData.data as BibleCommentary;
                    }
                } catch (e) {
                    // AI failed, proceed to local fallback
                }
            }

            // 4. Final Fallback: Local Generator
            if (!result) {
                console.log('Using local fallback for explanation');
                result = buildVerseExplanation(searchId, chapter, verse, verseText);
            }

            return result;
        } catch (err) {
            console.error('Error fetching commentary:', err);
            // Even on error, return fallback
            return buildVerseExplanation(bookId, chapter, verse, verseText);
        }
    },

    // [New for Devotional Modal]
    getBookIdFromRaw: (raw: string): string | null => {
        const lower = raw.toLowerCase().replace(/[\.\s]/g, '');
        // 1. Try direct map
        if (PT_TO_EN_BOOKS[lower]) return PT_TO_EN_BOOKS[lower];

        // 2. Try English keys
        const directMatch = Object.keys(ENGLISH_TO_PORTUGUESE).find(k => k.toLowerCase() === lower);
        if (directMatch) return directMatch;
        return null;
    },

    getPassageText: async (params: { book: string, chapter: number, verseStart: number, verseEnd?: number }): Promise<BibleVerse[] | null> => {
        // Construct reference string for reuse of existing getPassage logic
        const refStr = `${params.book} ${params.chapter}:${params.verseStart}${params.verseEnd ? `-${params.verseEnd}` : ''}`;
        const data = await bibleService.getPassage(refStr);
        return data?.verses || null;
    }
};

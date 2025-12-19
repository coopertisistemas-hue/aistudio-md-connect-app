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
    },

    getPassage: async (reference: string, translation = 'almeida') => {
        try {
            // Smart translation of reference book to English for API
            let searchRef = reference;
            let enBook: string | undefined;
            const parts = reference.trim().split(' ');
            if (parts.length > 0) {
                // Try to find book match
                // Logic: 1Pe -> 1 Pe -> 1Peter
                const bookPart = parts[0].toLowerCase(); // Basic case "Jo 3:16"
                enBook = PT_TO_EN_BOOKS[bookPart];

                // Handle cases like "1 Pe" (split) or "Hb"
                if (!enBook && parts.length > 1 && !parts[1].includes(':')) {
                    // Maybe "1 Pedro"
                    const compound = `${parts[0]} ${parts[1]}`.toLowerCase();
                    enBook = PT_TO_EN_BOOKS[compound];
                }

                if (enBook) {
                    // Check if we should use Portuguese name immediately for Almeida
                    if (translation === 'almeida' && ENGLISH_TO_PORTUGUESE[enBook]) {
                        const ptBook = ENGLISH_TO_PORTUGUESE[enBook];
                        // Reconstruct ref with PT book name
                        const match = reference.match(/(\d+[:.]\d+(?:-\d+)?)/);
                        if (match) {
                            const numbers = match[0];
                            searchRef = `${ptBook} ${numbers}`;
                        } else {
                            // Fallback reconstruction
                            searchRef = `${ptBook} ${parts.slice(1).join(' ')}`;
                        }
                    } else {
                        // Use English name (standard behavior)
                        const match = reference.match(/(\d+[:.]\d+(?:-\d+)?)/);
                        if (match) {
                            const numbers = match[0];
                            searchRef = `${enBook} ${numbers}`;
                        } else {
                            // Fallback: simple text replacement if regex fails
                            searchRef = `${enBook} ${parts.slice(1).join(' ')}`;
                        }
                    }
                }
            }

            // Ensure URL is clean
            searchRef = searchRef.trim();

            let url = `https://bible-api.com/${encodeURIComponent(searchRef)}?translation=${translation}`;
            let response = await fetch(url);

            // Fallback: If English name fails, try Portuguese name (API sometimes prefers localised names for specific translations)
            if (!response.ok && enBook && ENGLISH_TO_PORTUGUESE[enBook]) {
                const ptBook = ENGLISH_TO_PORTUGUESE[enBook];
                // Re-construct ref simple fallback
                // Use regex match from earlier or parts
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
            // Extract generic book abbreviation (e.g. "1 Pe 1:2" -> "1pe")
            // Naive split fails for "1Pe". Use regex to capture book part:
            const match = reference.match(/^((?:[123I]{1,3}\s*)?[A-Za-zÀ-ÿ]+)/);
            const cleanRef = match ? match[1].toLowerCase().replace(/\./g, '') : '';
            const normalizedInput = cleanRef.replace(/\s+/g, '');
            // normalizedInput: '1pe', 'rm', 'jo', etc.

            // Since our array in DB stores standard abbreviations like 'Hb', 'Heb', '1Pe', etc.
            // We need a way to match flexibly. 
            // 1. Try to fetch ALL books (caching could improve this) or search.
            // PostgreSQL array query: Find row where 'abbrev' array contains a matching string (case insensitive is tricky with contains).

            // Better approach for MVP reliability:
            // Fetch the book that matches any of the likely abbreviations.

            // Construct a "likely" standard abbreviation from input? 
            // Or just search by the normalized input if we store normalized keys? 
            // DB stores: ['1Pe', '1 Pe', '1Ped']
            // Input: '1pe'

            // Let's use a text search on the array converted to text, or fetch and filter in JS if dataset is small (66 books is tiny).
            // Fetching all books and caching in memory is actually most efficient for 66 items vs network latency of complex queries.

            // For now, let's just query where array contains the standardized input? No, case sensitivity.

            // Best bet for single query: Filter where valid abbreviations match input.
            // We can rely on the fact that existing static file logic was good.
            // Let's replicate strict matching: 

            // Alternative: Fetch the specific book by ID if we could map 'rm' -> 'romanos', but we don't have that map dynamic yet.

            // STRATEGY: Fetch all books (lightweight) and find match in JS. 
            // This ensures exact parity with previous logic and avoids complex Postgres array regex.
            const { data, error } = await supabase
                .from('bible_books')
                .select('*');

            if (error) throw error;
            if (!data) return null;

            // JS Find Logic (matches findBookData)
            const book = data.find(b => {
                return b.abbrev.some((a: string) => {
                    const normAbbrev = a.toLowerCase().replace(/\s+/g, '');
                    return normalizedInput.startsWith(normAbbrev) || normalizedInput === normAbbrev;
                });
            });

            return book || null;

            return book || null;
        } catch (error) {
            console.error('Bible Context DB Error:', error);
            return null;
        }
    },

    expandBookName: (abbrev: string): string => {
        if (!abbrev) return abbrev;
        // Remove spaces to handle "1 Rs" -> "1rs" for standardized lookup
        const lower = abbrev.toLowerCase().replace(/\s+/g, '');
        let fullName = abbrev;

        // 1. Map PT abbrev -> EN name -> PT Full Name
        const enName = PT_TO_EN_BOOKS[lower];
        if (enName) {
            fullName = ENGLISH_TO_PORTUGUESE[enName] || enName;
        } else {
            // Check if it matches a value in ENGLISH_TO_PORTUGUESE (already full PT name or close to it)
            const found = Object.values(ENGLISH_TO_PORTUGUESE).find(v => v.toLowerCase() === lower);
            if (found) fullName = found;
        }

        // 2. Handle Ordinals (1 John -> Primeiro João, etc.)
        if (fullName.startsWith('1 ')) return fullName.replace('1 ', 'Primeiro ');
        if (fullName.startsWith('2 ')) return fullName.replace('2 ', 'Segundo ');
        if (fullName.startsWith('3 ')) return fullName.replace('3 ', 'Terceiro ');

        return fullName;
    },

    getVerseCommentary: async (bookId: string, chapter: number, verse: number, verseText?: string): Promise<BibleCommentary | null> => {
        try {
            // 1. Normalize ID
            let searchId = bookId.toLowerCase();
            if (searchId === 'genesis' || searchId === 'gênesis') searchId = 'gn';
            // (Add more normalizations if critical, but 'gn' is main one for now)

            // 2. Try DB
            const { data, error } = await supabase
                .from('bible_commentaries')
                .select('*')
                .eq('book_id', searchId)
                .eq('chapter', chapter)
                .eq('verse', verse)
                .maybeSingle();

            if (error) throw error;
            if (data) return data as BibleCommentary;

            // 3. If missing and we have text, Generate!
            if (!data && verseText) {
                console.log('Context missing, generating via AI...', { searchId, chapter, verse });

                const { data: genData, error: genError } = await supabase.functions.invoke('generate-verse-commentary', {
                    body: {
                        book_id: searchId,
                        chapter,
                        verse,
                        text: verseText
                    }
                });

                if (genError) {
                    console.error('Generation Error:', genError);
                    return null;
                }

                if (genData?.data) {
                    return genData.data as BibleCommentary;
                }
            }

            return null;
        } catch (err) {
            console.error('Error fetching commentary:', err);
            return null;
        }
    }
};

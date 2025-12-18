/**
 * Utility to parse and format Bible references from text.
 * Supports standard abbreviations (Hb, Rm, Jo) and numbered books (1Pe, 2 Tm).
 */

// Regex Breakdown:
// 1. (?:[123I]{1,3}\s?)? -> Optional prefix: "1 ", "2", "3", "I ", "II " (with or without space)
// 2. [A-Za-zÀ-ÿ]{2,}     -> Book name/abbreviation (at least 2 chars): "Pe", "Jo", "Gênesis"
// 3. \.?                 -> Optional dot
// 4. \s?                 -> Optional space
// 5. \d+                 -> Chapter number
// 6. (?::\d+(?:-\d+)?)?  -> Optional Verse range: ":1", ":1-2"
// 7. (?:[;,]\s?(?:[123I]{1,3}\s?)?[A-Za-zÀ-ÿ]{2,}\s?\d+(?::\d+(?:-\d+)?)?)* -> Optional chained references (future proofing, simplified here)
// Note: We capture the main reference.
export const BIBLE_REF_REGEX = /((?:[123I]{1,3}\s?)?[A-Za-zÀ-ÿ]{2,}\.?\s?\d+(?::\d+(?:-\d+)?)?)/g;

// List of valid prefixes to reduce false positives (like "E a paz...")
const VALID_BOOKS_PREFIX = [
    'Gn', 'Ex', 'Lv', 'Nm', 'Dt', 'Js', 'Jz', 'Rt', '1Sm', '2Sm', '1Rs', '2Rs', '1Cr', '2Cr', 'Ed', 'Ne', 'Et', 'Jó', 'Sl', 'Pv', 'Ec', 'Ct', 'Is', 'Jr', 'Lm', 'Ez', 'Dn', 'Os', 'Jl', 'Am', 'Ob', 'Jn', 'Mq', 'Na', 'Hc', 'Sf', 'Ag', 'Zc', 'Ml',
    'Mt', 'Mc', 'Lc', 'Jo', 'At', 'Rm', '1Co', '2Co', 'Gl', 'Ef', 'Fp', 'Cl', '1Ts', '2Ts', '1Tm', '2Tm', 'Tt', 'Fm', 'Hb', 'Tg', '1Pe', '2Pe', '1Jo', '2Jo', '3Jo', 'Jd', 'Ap',
    'Gên', 'Êxo', 'Lev', 'Núm', 'Deu', 'Jos', 'Juí', 'Rut', 'Rei', 'Crô', 'Esd', 'Nee', 'Est', 'Sal', 'Pro', 'Ecl', 'Cân', 'Isa', 'Jer', 'Lam', 'Eze', 'Dan', 'Ose', 'Joe', 'Amo', 'Oba', 'Jon', 'Miq', 'Nau', 'Hab', 'Sof', 'Age', 'Zac', 'Mal',
    'Mat', 'Mar', 'Luc', 'Joã', 'Ato', 'Rom', 'Cor', 'Gál', 'Efé', 'Fil', 'Col', 'Tes', 'Tim', 'Tit', 'Fil', 'Heb', 'Tia', 'Ped', 'Joa', 'Jud', 'Apo'
];

export function isBibleRef(text: string): boolean {
    const clean = text.trim();
    if (clean.length < 3) return false;

    // 1. Must match regex structure
    if (!new RegExp(`^${BIBLE_REF_REGEX.source}$`).test(clean)) return false;

    // 2. Must start with a valid book prefix
    // Normalize: "1 Pe" -> "Pe", "2Tm" -> "Tm"
    const prefixPart = clean.split(/[\s.:]/)[0]; // "1Pe"
    const bookName = prefixPart.replace(/^[123I]+\s?/, '').toLowerCase(); // "pe"

    return VALID_BOOKS_PREFIX.some(p => bookName.startsWith(p.toLowerCase()));
}

export function parseBibleRefs(text: string): { type: 'text' | 'ref', content: string }[] {
    if (!text) return [];

    // Split by regex
    const parts = text.split(BIBLE_REF_REGEX);
    const result: { type: 'text' | 'ref', content: string }[] = [];

    parts.forEach(part => {
        if (!part) return;

        // It's a reference if it passes our validator
        if (isBibleRef(part)) {
            result.push({ type: 'ref', content: part });
        } else {
            // Check if it's purely whitespace? No, preserve it.
            result.push({ type: 'text', content: part });
        }
    });

    return result;
}

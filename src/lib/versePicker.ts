const VERSES = [
    { text: "O Senhor é o meu pastor e nada me faltará.", ref: "Salmos 23:1" },
    { text: "Tudo posso naquele que me fortalece.", ref: "Filipenses 4:13" },
    { text: "Porque dele, e por ele, e para ele são todas as coisas.", ref: "Romanos 11:36" },
    { text: "Mil cairão ao teu lado, e dez mil à tua direita, mas tu não serás atingido.", ref: "Salmos 91:7" },
    { text: "Entrega o teu caminho ao Senhor; confia nele, e ele tudo fará.", ref: "Salmos 37:5" },
    { text: "O Senhor é a minha luz e a minha salvação; de quem terei temor?", ref: "Salmos 27:1" },
    { text: "Aquietai-vos e sabei que eu sou Deus.", ref: "Salmos 46:10" },
    { text: "Porque Deus amou o mundo de tal maneira que deu o seu Filho unigênito.", ref: "João 3:16" },
    { text: "Não temas, porque eu sou contigo; não te assombres, porque eu sou o teu Deus.", ref: "Isaías 41:10" },
    { text: "Confia no Senhor de todo o teu coração e não te estribes no teu próprio entendimento.", ref: "Provérbios 3:5" }
];

export type Verse = typeof VERSES[0];

/**
 * Pick verse for a specific date (deterministic)
 * Uses date as seed to ensure same verse for same day
 */
export function pickVerseForDate(dateKey: string): Verse {
    // Use date as seed for deterministic selection
    const seed = dateKey.split('-').reduce((acc, val) => acc + parseInt(val), 0);
    const index = seed % VERSES.length;
    return VERSES[index];
}

/**
 * Pick a different verse (avoid current)
 * Returns random verse that's different from current
 */
export function pickDifferentVerse(currentRef: string): Verse {
    const available = VERSES.filter(v => v.ref !== currentRef);
    if (available.length === 0) return VERSES[0]; // Fallback
    const randomIndex = Math.floor(Math.random() * available.length);
    return available[randomIndex];
}

export { VERSES };

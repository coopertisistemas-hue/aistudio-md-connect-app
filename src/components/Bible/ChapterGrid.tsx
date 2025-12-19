
interface ChapterGridProps {
    bookName: string; // Passed for visual context or logic if needed (e.g. Psalm 119)
    onSelect: (chapter: number) => void;
}

export function ChapterGrid({ bookName, onSelect }: ChapterGridProps) {
    // Generate simple array. For production, we'd want exact chapter counts per book. 
    // For now, we default to 50 or use a map if available, or just a safe high number 
    // and handle API 404s gracefully (or providing a "load more" isn't standard for Bible).
    // Better strategy: Use a known map of chapter counts.

    // Quick map for MVP standard books (can be moved to a constants file)
    const CHAPTER_COUNTS: Record<string, number> = {
        'Genesis': 50, 'Exodus': 40, 'Leviticus': 27, 'Numbers': 36, 'Deuteronomy': 34,
        'Joshua': 24, 'Judges': 21, 'Ruth': 4, '1 Samuel': 31, '2 Samuel': 24,
        '1 Kings': 22, '2 Kings': 25, '1 Chronicles': 29, '2 Chronicles': 36,
        'Ezra': 10, 'Nehemiah': 13, 'Esther': 10, 'Job': 42, 'Psalms': 150,
        'Proverbs': 31, 'Ecclesiastes': 12, 'Song of Solomon': 8, 'Isaiah': 66,
        'Jeremiah': 52, 'Lamentations': 5, 'Ezekiel': 48, 'Daniel': 12, 'Hosea': 14,
        'Joel': 3, 'Amos': 9, 'Obadiah': 1, 'Jonah': 4, 'Micah': 7, 'Nahum': 3,
        'Habakkuk': 3, 'Zephaniah': 3, 'Haggai': 2, 'Zechariah': 14, 'Malachi': 4,
        'Matthew': 28, 'Mark': 16, 'Luke': 24, 'John': 21, 'Acts': 28, 'Romans': 16,
        '1 Corinthians': 16, '2 Corinthians': 13, 'Galatians': 6, 'Ephesians': 6,
        'Philippians': 4, 'Colossians': 4, '1 Thessalonians': 5, '2 Thessalonians': 3,
        '1 Timothy': 6, '2 Timothy': 4, 'Titus': 3, 'Philemon': 1, 'Hebrews': 13,
        'James': 5, '1 Peter': 5, '2 Peter': 3, '1 John': 5, '2 John': 1, '3 John': 1,
        'Jude': 1, 'Revelation': 22
    };

    const count = CHAPTER_COUNTS[bookName] || 50;

    return (
        <div className="grid grid-cols-5 md:grid-cols-8 gap-3">
            {Array.from({ length: count }, (_, i) => i + 1).map((chapter) => (
                <button
                    key={chapter}
                    onClick={() => onSelect(chapter)}
                    className="aspect-square flex items-center justify-center rounded-xl bg-white border border-slate-100 text-slate-700 font-bold hover:bg-indigo-50 hover:text-indigo-600 hover:border-indigo-200 transition-all shadow-sm active:scale-95"
                >
                    {chapter}
                </button>
            ))}
        </div>
    );
}

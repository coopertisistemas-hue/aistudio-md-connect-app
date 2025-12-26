import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { BookOpen, RefreshCw } from 'lucide-react';
import { APP_ROUTES } from '@/lib/routes';
import { analytics } from '@/lib/analytics';
import { getDateKey } from '@/lib/dateKey';
import { pickVerseForDate, pickDifferentVerse, type Verse } from '@/lib/versePicker';

interface VerseCardProps {
    verse: {
        text: string;
        reference: string;
        lang?: string;
    } | null;
}

export function VerseCard({ verse: initialVerse }: VerseCardProps) {
    const navigate = useNavigate();
    const [verse, setVerse] = useState<Verse | null>(null);
    const [isChanging, setIsChanging] = useState(false);

    useEffect(() => {
        // Daily Persistence using São Paulo timezone
        const todayKey = getDateKey();
        const storedDate = localStorage.getItem('md_verse_date');
        const storedVerse = localStorage.getItem('md_verse_data');

        if (storedDate === todayKey && storedVerse) {
            try {
                setVerse(JSON.parse(storedVerse));
            } catch {
                // Fallback to initial verse or pick new one
                if (initialVerse) {
                    setVerse({ text: initialVerse.text, ref: initialVerse.reference });
                } else {
                    const newVerse = pickVerseForDate(todayKey);
                    localStorage.setItem('md_verse_date', todayKey);
                    localStorage.setItem('md_verse_data', JSON.stringify(newVerse));
                    setVerse(newVerse);
                }
            }
        } else {
            // New day: prefer initial verse from backend, fallback to picker
            if (initialVerse) {
                const verseData = { text: initialVerse.text, ref: initialVerse.reference };
                localStorage.setItem('md_verse_date', todayKey);
                localStorage.setItem('md_verse_data', JSON.stringify(verseData));
                setVerse(verseData);
            } else {
                const newVerse = pickVerseForDate(todayKey);
                localStorage.setItem('md_verse_date', todayKey);
                localStorage.setItem('md_verse_data', JSON.stringify(newVerse));
                setVerse(newVerse);
            }
        }
    }, [initialVerse]);

    const handleChangeVerse = () => {
        if (!verse || isChanging) return;

        setIsChanging(true);
        const newVerse = pickDifferentVerse(verse.ref);

        // Persist for today
        const todayKey = getDateKey();
        localStorage.setItem('md_verse_date', todayKey);
        localStorage.setItem('md_verse_data', JSON.stringify(newVerse));

        setVerse(newVerse);

        // Track analytics
        analytics.track({
            name: 'cta_click',
            element: 'verse_card_change',
            context: 'member',
            metadata: { from: verse.ref, to: newVerse.ref }
        });

        setTimeout(() => setIsChanging(false), 300);
    };

    const handleOpenBible = () => {
        if (!verse) return;

        analytics.track({
            name: 'cta_click',
            element: 'verse_card_read',
            context: 'member',
            route_to: APP_ROUTES.BIBLE,
            metadata: { reference: verse.ref }
        });

        // Parse reference (e.g., "Salmos 23:1" -> Book: "Salmos", Chapter: "23")
        const match = verse.ref.match(/^([\d\s\w\u00C0-\u00FF]+)\s(\d+)/);

        if (match) {
            const book = match[1].trim();
            const chapter = match[2];
            navigate(`${APP_ROUTES.BIBLE}?book=${encodeURIComponent(book)}&chapter=${chapter}`);
        } else {
            navigate(APP_ROUTES.BIBLE);
        }
    };

    if (!verse) return null;

    return (
        <div className="mx-5 mb-8 mt-2 bg-gradient-to-br from-white to-slate-50 border border-white/60 rounded-3xl p-6 text-center shadow-lg shadow-slate-200/50 relative overflow-hidden group">
            {/* Subtle glow effect light */}
            <div className="absolute -top-10 -right-10 w-40 h-40 bg-blue-100/50 blur-[60px] rounded-full pointer-events-none" />

            <div className="flex items-center justify-between mb-4">
                <div className="flex-1" />
                <h3 className="text-[10px] font-bold text-blue-500 uppercase tracking-[0.2em] relative z-10 flex items-center justify-center gap-2">
                    <span className="w-1 h-1 rounded-full bg-blue-400"></span>
                    Versículo do Dia
                    <span className="w-1 h-1 rounded-full bg-blue-400"></span>
                </h3>
                <div className="flex-1 flex justify-end">
                    <button
                        onClick={handleChangeVerse}
                        disabled={isChanging}
                        className="p-1.5 rounded-full hover:bg-slate-100 active:bg-slate-200 transition-colors group/btn disabled:opacity-50 relative z-10"
                        title="Ver outro versículo"
                        aria-label="Trocar versículo do dia"
                    >
                        <RefreshCw
                            className={`w-3.5 h-3.5 text-slate-400 group-hover/btn:text-blue-500 transition-colors ${isChanging ? 'animate-spin' : ''
                                }`}
                        />
                    </button>
                </div>
            </div>

            <p className="text-sm font-serif italic text-slate-700 leading-relaxed mb-2 line-clamp-3 relative z-10">
                "{verse.text}"
            </p>

            <p className="text-[11px] font-bold text-slate-400 mb-6 relative z-10 uppercase tracking-wide">
                {verse.ref}
            </p>

            <button
                onClick={handleOpenBible}
                className="w-full bg-slate-100/80 hover:bg-slate-200 text-slate-600 border border-slate-200 h-10 rounded-xl font-bold text-xs flex items-center justify-center gap-2 transition-all active:scale-[0.98] relative z-10"
            >
                <BookOpen className="w-3.5 h-3.5 text-blue-500" />
                Ler na Bíblia
            </button>
        </div>
    );
}

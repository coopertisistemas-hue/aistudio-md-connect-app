import { useNavigate } from 'react-router-dom';
import { BookOpen } from 'lucide-react';
import { APP_ROUTES } from '@/lib/routes';
import { analytics } from '@/lib/analytics';

interface VerseCardProps {
    verse: {
        text: string;
        reference: string;
        lang?: string;
    } | null;
}

export function VerseCard({ verse }: VerseCardProps) {
    const navigate = useNavigate();

    // Fallback if null (though parent usually handles data fetching, safe to check)
    if (!verse) return null;

    const handleOpenBible = () => {
        analytics.track({
            name: 'cta_click',
            element: 'verse_card_read',
            context: 'member',
            route_to: APP_ROUTES.BIBLE,
            metadata: { reference: verse.reference }
        });
        // Parse reference (e.g., "Salmos 23:1" -> Book: "Salmos", Chapter: "23")
        // Regex to match: (Book Name) (Chapter):(Verse)
        // Taking into account books with numbers like "1 João"
        const match = verse.reference.match(/^([\d\s\w\u00C0-\u00FF]+)\s(\d+)/);

        if (match) {
            const book = match[1].trim();
            const chapter = match[2];
            navigate(`${APP_ROUTES.BIBLE}?book=${encodeURIComponent(book)}&chapter=${chapter}`);
        } else {
            // Fallback
            navigate(APP_ROUTES.BIBLE);
        }
    };

    return (
        <div className="mx-5 mb-8 mt-2 bg-gradient-to-br from-white to-slate-50 border border-white/60 rounded-3xl p-6 text-center shadow-lg shadow-slate-200/50 relative overflow-hidden group">
            {/* Subtle glow effect light */}
            <div className="absolute -top-10 -right-10 w-40 h-40 bg-blue-100/50 blur-[60px] rounded-full pointer-events-none" />

            <h3 className="text-[10px] font-bold text-blue-500 uppercase tracking-[0.2em] mb-4 relative z-10 flex items-center justify-center gap-2">
                <span className="w-1 h-1 rounded-full bg-blue-400"></span>
                Versículo do Dia
                <span className="w-1 h-1 rounded-full bg-blue-400"></span>
            </h3>

            <p className="text-sm font-serif italic text-slate-700 leading-relaxed mb-2 line-clamp-3 relative z-10">
                "{verse.text}"
            </p>

            <p className="text-[11px] font-bold text-slate-400 mb-6 relative z-10 uppercase tracking-wide">
                {verse.reference}
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

import { Users, Quote, RefreshCw } from 'lucide-react';
import { useState, useEffect } from 'react';
import { getDateKey } from '@/lib/dateKey';
import { pickVerseForDate, pickDifferentVerse, type Verse } from '@/lib/versePicker';

export function HomeHeader() {
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
                // Fallback if parse fails
                const newVerse = pickVerseForDate(todayKey);
                localStorage.setItem('md_verse_date', todayKey);
                localStorage.setItem('md_verse_data', JSON.stringify(newVerse));
                setVerse(newVerse);
            }
        } else {
            // New day or first visit
            const newVerse = pickVerseForDate(todayKey);
            localStorage.setItem('md_verse_date', todayKey);
            localStorage.setItem('md_verse_data', JSON.stringify(newVerse));
            setVerse(newVerse);
        }
    }, []);

    const handleChangeVerse = () => {
        if (!verse || isChanging) return;

        setIsChanging(true);
        const newVerse = pickDifferentVerse(verse.ref);

        // Persist for today
        const todayKey = getDateKey();
        localStorage.setItem('md_verse_date', todayKey);
        localStorage.setItem('md_verse_data', JSON.stringify(newVerse));

        setVerse(newVerse);
        setTimeout(() => setIsChanging(false), 300);
    };

    return (
        <header className="bg-white p-4 pb-2 z-10 relative">
            <div className="flex justify-between items-start mb-4">
                {/* Brand - Left */}
                <div className="flex items-center space-x-3">
                    <div className="h-10 w-10 rounded-full overflow-hidden flex items-center justify-center border border-slate-100 shadow-sm">
                        <img src="/logo-md.png" alt="MD" className="w-full h-full object-cover" />
                    </div>
                    <div>
                        <h1 className="font-heading font-bold text-lg text-slate-900 leading-tight">MD Connect</h1>
                        <p className="text-[10px] text-slate-500 font-medium uppercase tracking-wider">A serviço do Reino</p>
                    </div>
                </div>

                {/* Profile - Right */}
                <div className="bg-slate-50 p-2 rounded-full border border-slate-100">
                    <Users className="h-5 w-5 text-slate-400" />
                </div>
            </div>

            {/* Daily Verse Section with Change Button */}
            {verse && (
                <div className="mt-2 mb-1 pl-1 border-l-2 border-blue-500/30 relative">
                    <div className="flex items-start justify-between gap-2">
                        <div className="flex items-start flex-1 min-w-0">
                            <Quote className="w-3 h-3 text-blue-400 mr-2 mt-0.5 opacity-50 fill-current shrink-0" />
                            <div className="min-w-0">
                                <p className="text-sm font-medium text-slate-700 italic leading-snug">
                                    "{verse.text}"
                                </p>
                                <p className="text-[10px] text-slate-400 font-bold mt-1 tracking-wide uppercase">
                                    {verse.ref}
                                </p>
                            </div>
                        </div>

                        <button
                            onClick={handleChangeVerse}
                            disabled={isChanging}
                            className="shrink-0 p-1.5 rounded-full hover:bg-slate-100 active:bg-slate-200 transition-colors group disabled:opacity-50"
                            title="Ver outro versículo"
                            aria-label="Trocar versículo do dia"
                        >
                            <RefreshCw
                                className={`w-3.5 h-3.5 text-slate-400 group-hover:text-blue-500 transition-colors ${isChanging ? 'animate-spin' : ''
                                    }`}
                            />
                        </button>
                    </div>
                </div>
            )}
        </header>
    );
}

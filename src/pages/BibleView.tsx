import { useState, useEffect } from 'react';
import { bibleService, type BibleChapter, OLD_TESTAMENT, NEW_TESTAMENT } from '@/services/bible';
import { ChevronLeft, ChevronRight, Loader2, BookOpen } from 'lucide-react';
import { PageIntro } from '@/components/layout/PageIntro';
import { useSearchParams } from 'react-router-dom';

export default function BibleView() {
    const [searchParams] = useSearchParams();

    // Normalization Helper
    const normalizeBook = (rawBook: string | null): string | null => {
        if (!rawBook) return null;
        const normalized = rawBook.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "");

        // Map common Portuguese names to English IDs
        const MAPPING: Record<string, string> = {
            'salmos': 'Psalms',
            'genesis': 'Genesis',
            'exodo': 'Exodus',
            'mateus': 'Matthew',
            'marcos': 'Mark',
            'lucas': 'Luke',
            'joao': 'John',
            'apocalipse': 'Revelation'
            // Add others as needed, defaulting to raw if no match
        };

        // Check exact match in English lists first
        const allBooks = [...OLD_TESTAMENT, ...NEW_TESTAMENT];
        const exactMatch = allBooks.find(b => b.toLowerCase() === rawBook.toLowerCase());
        if (exactMatch) return exactMatch;

        return MAPPING[normalized] || MAPPING[rawBook.toLowerCase()] || rawBook;
    };

    // Lazy Initialization: URL > Default
    const [book, setBook] = useState(() => {
        const paramBook = searchParams.get('book');
        return normalizeBook(paramBook) || 'Genesis';
    });

    const [chapter, setChapter] = useState(() => {
        const paramChapter = searchParams.get('chapter');
        return paramChapter ? Number(paramChapter) : 1;
    });

    const [data, setData] = useState<BibleChapter | null>(null);
    const [isLoading, setIsLoading] = useState(true);

    // Sync URL params to State (Handle Back/Forward blocks)
    useEffect(() => {
        const paramBook = searchParams.get('book');
        const paramChapter = searchParams.get('chapter');

        if (paramBook) {
            const normalized = normalizeBook(paramBook);
            if (normalized && normalized !== book) {
                setBook(normalized);
            }
        }
        if (paramChapter) {
            const numChapter = Number(paramChapter);
            if (numChapter !== chapter) {
                setChapter(numChapter);
            }
        }
    }, [searchParams]); // Keep logic simple, avoid changing state if matches

    useEffect(() => {
        const load = async () => {
            setIsLoading(true);
            const res = await bibleService.getChapter(book, chapter);
            setData(res);
            setIsLoading(false);
        };
        load();
        window.scrollTo(0, 0);
    }, [book, chapter]);

    const handleNext = () => setChapter(c => c + 1);
    const handlePrev = () => setChapter(c => Math.max(1, c - 1));


    return (
        <div className="flex flex-col h-full bg-slate-50/50">
            {/* Standardized Header */}
            <div className="px-5 pt-8 pb-2">
                <PageIntro
                    title="Bíblia Sagrada"
                    subtitle="Leia a Palavra com foco e clareza."
                    icon={BookOpen}
                    iconClassName="text-indigo-600"
                    className="mb-4"
                />

                {/* Selectors Line */}
                <div className="flex gap-2 w-full md:w-auto mt-2">
                    <select
                        value={book}
                        onChange={(e) => { setBook(e.target.value); setChapter(1); }}
                        className="h-10 px-3 py-2 rounded-xl border border-slate-200 text-sm bg-white/80 backdrop-blur-sm text-slate-900 font-medium focus:outline-none focus:ring-2 focus:ring-indigo-500/20 flex-1 md:flex-none md:min-w-[140px] shadow-sm cursor-pointer transition-all hover:bg-white"
                    >
                        <option disabled>AT</option>
                        {OLD_TESTAMENT.map(b => <option key={b} value={b}>{b}</option>)}
                        <option disabled>NT</option>
                        {NEW_TESTAMENT.map(b => <option key={b} value={b}>{b}</option>)}
                    </select>

                    <select
                        value={chapter}
                        onChange={(e) => setChapter(Number(e.target.value))}
                        className="h-10 px-3 py-2 rounded-xl border border-slate-200 text-sm bg-white/80 backdrop-blur-sm text-slate-900 font-medium focus:outline-none focus:ring-2 focus:ring-indigo-500/20 w-20 shadow-sm cursor-pointer transition-all hover:bg-white"
                    >
                        {Array.from({ length: 150 }, (_, i) => i + 1).map(n => (
                            <option key={n} value={n}>{n}</option>
                        ))}
                    </select>
                </div>
            </div>

            {/* Content using Cards for Legibility */}
            <div className="flex-1 p-5 overflow-y-auto pb-24 font-serif">
                {isLoading ? (
                    <div className="flex justify-center py-10">
                        <Loader2 className="h-8 w-8 animate-spin text-primary" />
                    </div>
                ) : data ? (
                    <div className="space-y-4 max-w-2xl mx-auto">
                        {/* Title Card */}
                        <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-100 mb-6">
                            <h2 className="text-2xl font-bold text-center text-slate-900 mb-0">{data.reference}</h2>
                        </div>

                        {/* Text Card relative to video */}
                        <div className="bg-white/95 backdrop-blur-sm rounded-2xl p-6 md:p-8 shadow-sm border border-slate-100">
                            <div className="space-y-4 text-lg leading-loose text-slate-800">
                                {data.verses.map((v) => (
                                    <span key={v.verse} className="inline mr-1">
                                        <sup className="text-[10px] text-primary font-sans mr-0.5 font-bold opacity-70">{v.verse}</sup>
                                        <span className={v.text.includes('Jesus') ? "text-red-700 font-medium" : "font-medium text-slate-700"}>{v.text} </span>
                                    </span>
                                ))}
                            </div>
                        </div>

                        <div className="flex justify-between mt-6">
                            <button
                                onClick={handlePrev}
                                disabled={chapter <= 1}
                                className="flex items-center px-4 py-3 text-sm font-bold text-slate-700 bg-white border border-slate-200 rounded-xl hover:bg-slate-50 disabled:opacity-50 shadow-sm"
                            >
                                <ChevronLeft className="mr-1 h-4 w-4" /> Anterior
                            </button>
                            <button
                                onClick={handleNext}
                                className="flex items-center px-4 py-3 text-sm font-bold text-slate-700 bg-white border border-slate-200 rounded-xl hover:bg-slate-50 shadow-sm"
                            >
                                Próximo <ChevronRight className="ml-1 h-4 w-4" />
                            </button>
                        </div>
                    </div>
                ) : (
                    <div className="flex flex-col items-center justify-center h-full text-white/80">
                        <div className="bg-white/10 backdrop-blur-md p-8 rounded-3xl border border-white/20 text-center">
                            <p className="font-medium text-lg">Selecione um capítulo para ler.</p>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}

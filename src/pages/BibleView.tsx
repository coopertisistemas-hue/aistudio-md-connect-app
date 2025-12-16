import { useState, useEffect } from 'react';
import { bibleService, type BibleChapter, OLD_TESTAMENT, NEW_TESTAMENT } from '@/services/bible';
import { ChevronLeft, ChevronRight, Loader2 } from 'lucide-react';
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
        <div className="flex flex-col h-full bg-white">
            {/* Header Sticky */}
            <div className="sticky top-0 z-20 bg-white border-b border-slate-100 p-3 flex items-center justify-between shadow-sm">

                <div className="flex gap-2 w-full justify-center md:justify-start">
                    <select
                        value={book}
                        onChange={(e) => { setBook(e.target.value); setChapter(1); }}
                        className="h-9 px-3 py-1 rounded-lg border border-slate-200 text-sm bg-white text-slate-700 focus:outline-none focus:ring-2 focus:ring-primary/20"
                    >
                        <option disabled>Antigo Testamento</option>
                        {OLD_TESTAMENT.map(b => <option key={b} value={b}>{b}</option>)}
                        <option disabled>Novo Testamento</option>
                        {NEW_TESTAMENT.map(b => <option key={b} value={b}>{b}</option>)}
                    </select>

                    <select
                        value={chapter}
                        onChange={(e) => setChapter(Number(e.target.value))}
                        className="h-9 px-3 py-1 rounded-lg border border-slate-200 text-sm bg-white text-slate-700 focus:outline-none focus:ring-2 focus:ring-primary/20"
                    >
                        {Array.from({ length: 150 }, (_, i) => i + 1).map(n => (
                            <option key={n} value={n}>{n}</option>
                        ))}
                    </select>
                </div>
            </div>

            {/* Content */}
            <div className="flex-1 p-5 overflow-y-auto pb-24 font-serif">
                {isLoading ? (
                    <div className="flex justify-center py-10">
                        <Loader2 className="h-8 w-8 animate-spin text-primary" />
                    </div>
                ) : data ? (
                    <div className="space-y-4 max-w-2xl mx-auto">
                        <h2 className="text-2xl font-bold text-center mb-6 text-slate-900">{data.reference}</h2>
                        <div className="space-y-4 text-lg leading-loose text-slate-800">
                            {data.verses.map((v) => (
                                <span key={v.verse} className="inline mr-1">
                                    <sup className="text-[10px] text-primary font-sans mr-0.5 font-bold opacity-70">{v.verse}</sup>
                                    <span className={v.text.includes('Jesus') ? "text-red-700" : ""}>{v.text} </span>
                                </span>
                            ))}
                        </div>

                        <div className="flex justify-between mt-10 pt-6 border-t border-slate-100">
                            <button
                                onClick={handlePrev}
                                disabled={chapter <= 1}
                                className="flex items-center px-4 py-2 text-sm font-medium text-slate-600 bg-white border border-slate-200 rounded-lg hover:bg-slate-50 disabled:opacity-50"
                            >
                                <ChevronLeft className="mr-1 h-4 w-4" /> Anterior
                            </button>
                            <button
                                onClick={handleNext}
                                className="flex items-center px-4 py-2 text-sm font-medium text-slate-600 bg-white border border-slate-200 rounded-lg hover:bg-slate-50"
                            >
                                Próximo <ChevronRight className="ml-1 h-4 w-4" />
                            </button>
                        </div>

                        <div className="bg-blue-50 p-6 rounded-2xl border border-blue-100">
                            <h3 className="font-bold text-blue-800 mb-2">Planos de Leitura</h3>
                            <p className="text-sm text-blue-600 mb-4">
                                Siga um plano anual ou temático para manter sua constância.
                            </p>
                            <button className="bg-blue-600 text-white text-sm font-bold px-4 py-2 rounded-lg w-full flex items-center justify-center gap-2 opacity-75 cursor-not-allowed">
                                Em breve
                            </button>
                        </div>
                    </div>
                ) : (
                    <div className="flex flex-col items-center justify-center h-full text-slate-400">
                        <p>Selecione um capítulo para ler.</p>
                    </div>
                )}
            </div>
        </div>
    );
}

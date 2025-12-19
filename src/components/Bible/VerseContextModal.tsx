import React, { useEffect } from 'react';
import { X, Sparkles, Book, Compass, Lightbulb, Link as LinkIcon, BookOpen } from 'lucide-react';
import { bibleService, type BibleBookData } from '@/services/bible';

interface VerseContextModalProps {
    isOpen: boolean;
    onClose: () => void;
    verseRef: string | null;
    passageText: string | null;
    verseBookId?: string; // Optional bookId for better context fetching
}

export function VerseContextModal({ isOpen, onClose, verseRef, passageText, verseBookId }: VerseContextModalProps) {
    // Close on escape
    useEffect(() => {
        const handleEsc = (e: KeyboardEvent) => { if (e.key === 'Escape') onClose(); };
        window.addEventListener('keydown', handleEsc);
        return () => window.removeEventListener('keydown', handleEsc);
    }, [onClose]);

    // Data Fetching State
    const [bookData, setBookData] = React.useState<BibleBookData | null>(null);
    const [isLoadingContext, setIsLoadingContext] = React.useState(false);

    useEffect(() => {
        if (isOpen && (verseRef || verseBookId)) {
            setIsLoadingContext(true);
            setBookData(null);

            // Prefer verseBookId if available (cleaner), else parse from Ref
            const query = verseBookId || verseRef || '';

            if (query) {
                bibleService.getBookContext(query)
                    .then(data => {
                        setBookData(data);
                    })
                    .catch(err => console.error(err))
                    .finally(() => setIsLoadingContext(false));
            } else {
                setIsLoadingContext(false);
            }
        }
    }, [verseRef, verseBookId, isOpen]);

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 animate-fade-in">
            {/* Backdrop */}
            <div className="absolute inset-0 bg-slate-900/60 backdrop-blur-md transition-opacity" onClick={onClose} />

            {/* Modal Card */}
            <div className="relative w-full max-w-lg bg-white rounded-3xl shadow-2xl overflow-hidden flex flex-col max-h-[85vh] animate-in zoom-in-95 duration-200">

                {/* Header */}
                <div className="relative px-6 py-6 md:px-8 bg-gradient-to-br from-indigo-600 to-violet-700 text-white shrink-0 overflow-hidden">
                    {/* Decor */}
                    <div className="absolute top-0 right-0 p-6 opacity-10">
                        <Sparkles className="w-32 h-32 -rotate-12 transform translate-x-8 -translate-y-8" />
                    </div>

                    <button
                        onClick={onClose}
                        className="absolute top-4 right-4 p-2 bg-white/10 hover:bg-white/20 rounded-full transition-colors z-20"
                    >
                        <X className="w-5 h-5" />
                    </button>

                    <div className="relative z-10 text-center">
                        <div className="inline-flex items-center gap-1.5 px-3 py-0.5 rounded-full bg-indigo-400/30 border border-indigo-300/30 text-[10px] font-bold tracking-widest uppercase mb-4 shadow-sm backdrop-blur-sm">
                            <Book className="w-3 h-3" />
                            <span>Estudo & Contexto</span>
                        </div>

                        <h2 className="text-2xl font-serif font-bold mb-3">{verseRef}</h2>

                        {passageText && (
                            <div className="relative max-w-sm mx-auto">
                                <p className="text-indigo-50/90 text-sm md:text-base leading-relaxed italic font-serif">
                                    "{passageText}"
                                </p>
                            </div>
                        )}
                    </div>
                </div>

                {/* Scrollable Content */}
                <div className="overflow-y-auto flex-1 bg-slate-50/50">
                    {isLoadingContext ? (
                        <div className="p-8 space-y-6 animate-pulse">
                            <div className="h-4 bg-slate-200 rounded w-1/3 mx-auto"></div>
                            <div className="h-32 bg-slate-200 rounded-xl"></div>
                            <div className="h-24 bg-slate-200 rounded-xl"></div>
                        </div>
                    ) : bookData ? (
                        <div className="p-6 md:p-8 space-y-6">

                            {/* 1. Contexto Histórico Card */}
                            <section className="bg-white p-5 rounded-2xl border border-slate-100 shadow-sm">
                                <div className="flex items-center gap-2 mb-3">
                                    <div className="p-1.5 bg-indigo-50 rounded-lg text-indigo-600">
                                        <Compass className="w-4 h-4" />
                                    </div>
                                    <h3 className="font-bold text-slate-800 text-sm uppercase tracking-wide">Contexto Histórico</h3>
                                </div>
                                <p className="text-slate-600 text-sm leading-relaxed text-justify">
                                    {bookData.historical_context}
                                </p>
                            </section>

                            {/* 2. Aplicabilidade */}
                            <section>
                                <div className="flex items-center gap-2 mb-3 px-1">
                                    <Lightbulb className="w-4 h-4 text-amber-500" />
                                    <h3 className="font-bold text-slate-800 text-sm uppercase tracking-wide">Aplicação Prática</h3>
                                </div>
                                <ul className="space-y-2">
                                    {bookData.application.map((app, idx) => (
                                        <li key={idx} className="flex gap-3 bg-white p-3 rounded-xl border border-slate-100 shadow-sm text-sm text-slate-700">
                                            <span className="flex-shrink-0 w-6 h-6 rounded-full bg-amber-50 text-amber-600 flex items-center justify-center font-bold text-xs mt-0.5 border border-amber-100">
                                                {idx + 1}
                                            </span>
                                            <span className="leading-relaxed">{app}</span>
                                        </li>
                                    ))}
                                </ul>
                            </section>

                            {/* 3. Temas (Chips) */}
                            <section className="bg-white p-5 rounded-2xl border border-slate-100 shadow-sm">
                                <div className="flex items-center gap-2 mb-3">
                                    <LinkIcon className="w-4 h-4 text-emerald-600" />
                                    <h3 className="font-bold text-slate-800 text-sm uppercase tracking-wide">Temas Centrais</h3>
                                </div>
                                <div className="flex flex-wrap gap-2">
                                    {bookData.themes.map((theme, i) => (
                                        <span key={i} className="px-3 py-1.5 bg-slate-50 border border-slate-200 rounded-lg text-xs font-semibold text-slate-600">
                                            {theme}
                                        </span>
                                    ))}
                                </div>
                            </section>

                        </div>
                    ) : (
                        <div className="flex flex-col items-center justify-center py-16 px-6 text-center space-y-4 opacity-60">
                            <BookOpen className="w-12 h-12 text-slate-300" />
                            <div>
                                <h3 className="text-slate-800 font-bold mb-1">Contexto Indisponível</h3>
                                <p className="text-slate-500 text-sm">
                                    Ainda não temos dados de estudo para este livro específica.
                                </p>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}

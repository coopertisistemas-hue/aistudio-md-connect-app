import React, { useEffect } from 'react';
import { BookOpen, X, Sparkles, Book, Info, Quote } from 'lucide-react';
import { bibleService, type BibleBookData } from '@/services/bible';

interface VerseContextModalProps {
    isOpen: boolean;
    onClose: () => void;
    reference: string | null;
    passageText: string | null;
    isLoading: boolean;
}

export function VerseContextModal({ isOpen, onClose, reference, passageText, isLoading }: VerseContextModalProps) {
    // 1. Hook Logic MUST be inside component

    // Close on escape
    useEffect(() => {
        const handleEsc = (e: KeyboardEvent) => { if (e.key === 'Escape') onClose(); };
        window.addEventListener('keydown', handleEsc);
        return () => window.removeEventListener('keydown', handleEsc);
    }, [onClose]);

    // 2. Data Fetching State (Moved to top level)
    const [bookData, setBookData] = React.useState<BibleBookData | null>(null);
    const [isLoadingContext, setIsLoadingContext] = React.useState(false);

    useEffect(() => {
        if (reference && isOpen) {
            setIsLoadingContext(true);
            setBookData(null); // Reset prev data
            bibleService.getBookContext(reference)
                .then(data => {
                    setBookData(data);
                })
                .catch(err => console.error(err))
                .finally(() => setIsLoadingContext(false));
        }
    }, [reference, isOpen]);

    // 3. Conditional Return
    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 animate-fade-in">
            {/* Backdrop with stronger blur for focus */}
            <div className="absolute inset-0 bg-slate-900/40 backdrop-blur-md transition-opacity" onClick={onClose} />

            {/* Modal Card - Glassmorphism & Elevation */}
            <div className="relative w-full max-w-2xl bg-white/95 backdrop-blur-xl rounded-3xl shadow-2xl overflow-hidden flex flex-col max-h-[85vh] ring-1 ring-white/50">

                {/* Header - Unified with Verse Text for flow */}
                <div className="relative px-6 pt-6 pb-4 md:px-10 flex flex-col items-center bg-gradient-to-b from-indigo-50/50 via-white to-white shrink-0">

                    {/* Floating Close Button */}
                    <button
                        onClick={onClose}
                        className="absolute top-4 right-4 p-2 rounded-full bg-slate-100/50 hover:bg-slate-100 text-slate-400 hover:text-slate-600 transition-colors z-20 backdrop-blur-sm"
                    >
                        <X className="w-5 h-5" />
                    </button>

                    {/* Meta Pill */}
                    <div className="flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-50/80 border border-indigo-100 text-[10px] font-bold tracking-widest text-indigo-800 uppercase mb-3">
                        <Book className="w-3 h-3" />
                        <span>{reference || 'Referência'}</span>
                    </div>

                    {/* Verse Text Display (Centerpiece) */}
                    {passageText ? (
                        <div className="relative max-w-lg mx-auto text-center z-10">
                            <Quote className="absolute -top-6 -left-8 w-10 h-10 text-indigo-100 -z-10 transform -scale-x-100 opacity-50" />
                            <h3 className="font-serif text-lg md:text-xl text-slate-800 leading-normal italic md:leading-relaxed">
                                “{passageText}”
                            </h3>
                            <div className="mt-2 flex items-center justify-center gap-2 opacity-60">
                                <div className="w-8 h-px bg-indigo-200" />
                                <span className="text-[10px] font-medium uppercase tracking-widest text-indigo-400">Almeida Corrigida Fiel</span>
                                <div className="w-8 h-px bg-indigo-200" />
                            </div>
                        </div>
                    ) : isLoading ? (
                        <div className="w-3/4 space-y-3 animate-pulse flex flex-col items-center">
                            <div className="h-4 bg-slate-100 rounded w-full" />
                            <div className="h-4 bg-slate-100 rounded w-5/6" />
                            <div className="h-4 bg-slate-100 rounded w-4/6" />
                        </div>
                    ) : (
                        <div className="p-4 bg-slate-50/50 rounded-xl text-slate-400 text-sm">
                            Texto indisponível.
                        </div>
                    )}
                </div>

                {/* Scrollable Content - Context Cards */}
                <div className="overflow-y-auto flex-1 px-6 pb-8 md:px-10 space-y-4 bg-white">

                    {isLoadingContext ? (
                        <div className="flex flex-col items-center justify-center py-12 space-y-4 animate-pulse">
                            <div className="h-4 w-32 bg-slate-100 rounded"></div>
                            <div className="h-20 w-full bg-slate-50/50 rounded-xl"></div>
                            <div className="h-4 w-24 bg-slate-100 rounded"></div>
                        </div>
                    ) : bookData ? (
                        <>
                            {/* Divider with Icon */}
                            <div className="flex items-center justify-center py-2">
                                <span className="p-1.5 rounded-full bg-slate-50 text-slate-300">
                                    <Info className="w-4 h-4" />
                                </span>
                            </div>

                            {/* 1. Contexto Histórico Card */}
                            <section className="group p-6 rounded-2xl bg-slate-50/50 hover:bg-slate-50 transition-colors border border-slate-100/50">
                                <h4 className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-3 flex items-center gap-2">
                                    Contexto Histórico
                                </h4>
                                <p className="text-slate-600 leading-bg-relaxed text-sm md:text-base text-justify">
                                    {bookData.historical_context}
                                </p>
                            </section>

                            {/* 2. Key Themes */}
                            <section>
                                <div className="flex flex-wrap justify-center gap-2">
                                    {bookData.themes.map((theme, idx) => (
                                        <span key={idx} className="px-3 py-1.5 bg-white border border-slate-100 shadow-sm rounded-lg text-slate-600 text-xs font-medium hover:text-indigo-600 hover:border-indigo-100 transition-colors cursor-default">
                                            {theme}
                                        </span>
                                    ))}
                                </div>
                            </section>

                            {/* 3. Applicability (Highlight) */}
                            <section className="bg-gradient-to-br from-indigo-50/50 to-white p-6 rounded-2xl border border-indigo-50/50 relative overflow-hidden">
                                <div className="absolute top-0 right-0 w-32 h-32 bg-indigo-100/20 rounded-bl-full -mr-8 -mt-8" />

                                <h4 className="relative z-10 flex items-center gap-2 text-xs font-bold text-indigo-900 uppercase tracking-widest mb-4">
                                    <Sparkles className="w-4 h-4 text-indigo-400" />
                                    Para sua vida hoje
                                </h4>

                                <ul className="relative z-10 space-y-4">
                                    {bookData.application.map((app, idx) => (
                                        <li key={idx} className="flex gap-3 text-slate-700 text-sm md:text-base leading-relaxed group/item">
                                            <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-white border border-indigo-100 text-[10px] font-bold text-indigo-400 shadow-sm group-hover/item:text-indigo-600 group-hover/item:border-indigo-200 transition-colors">
                                                {idx + 1}
                                            </span>
                                            <span className="pt-0.5">{app}</span>
                                        </li>
                                    ))}
                                </ul>
                            </section>
                        </>
                    ) : (
                        <div className="flex flex-col items-center justify-center p-8 text-center space-y-3 opacity-60">
                            <BookOpen className="w-8 h-8 text-slate-300" />
                            <p className="text-slate-400 text-sm font-medium">
                                Contexto detalhado em breve.
                            </p>
                            <p className="text-xs text-slate-300 max-w-xs">
                                Nossa base de dados de estudos está sendo expandida gradualmente.
                            </p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}

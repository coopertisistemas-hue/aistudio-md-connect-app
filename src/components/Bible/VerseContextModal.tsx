import React, { useEffect } from 'react';
import { X, Sparkles, Book, Compass, Lightbulb, Link as LinkIcon, BookOpen, Scroll } from 'lucide-react';
import { bibleService, type BibleCommentary } from '@/services/bible';

interface VerseContextModalProps {
    isOpen: boolean;
    onClose: () => void;
    verseRef: string | null;
    passageText: string | null;
    verseBookId?: string; // Optional bookId for better context fetching
    chapter?: number; // New
    verse?: number; // New
}

export function VerseContextModal({ isOpen, onClose, verseRef, passageText, verseBookId, chapter, verse }: VerseContextModalProps) {
    // Close on escape
    useEffect(() => {
        const handleEsc = (e: KeyboardEvent) => { if (e.key === 'Escape') onClose(); };
        window.addEventListener('keydown', handleEsc);
        return () => window.removeEventListener('keydown', handleEsc);
    }, [onClose]);

    // Data Fetching State
    const [data, setData] = React.useState<BibleCommentary | null>(null);
    const [isLoadingContext, setIsLoadingContext] = React.useState(false);

    useEffect(() => {
        if (isOpen && verseBookId && chapter && verse) {
            setIsLoadingContext(true);
            setData(null);

            bibleService.getVerseCommentary(verseBookId, chapter, verse, passageText || undefined)
                .then(res => {
                    setData(res);
                })
                .catch(err => console.error(err))
                .finally(() => setIsLoadingContext(false));
        }
    }, [verseBookId, chapter, verse, isOpen]);

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
                        <div className="p-8 space-y-6 flex flex-col items-center justify-center min-h-[300px] text-center">
                            <Sparkles className="w-12 h-12 text-indigo-300 animate-pulse mb-4" />
                            <div className="h-4 bg-slate-100 rounded w-1/2 animate-pulse mx-auto"></div>
                            <p className="text-sm text-slate-400 font-medium animate-pulse">
                                Pesquisando referências teológicas...
                            </p>
                        </div>
                    ) : data ? (
                        <div className="p-6 md:p-8 space-y-6">

                            {/* 1. Contexto Histórico */}
                            {data.historical_context && (
                                <section className="bg-white p-5 rounded-2xl border border-slate-100 shadow-sm">
                                    <div className="flex items-center gap-2 mb-3">
                                        <div className="p-1.5 bg-indigo-50 rounded-lg text-indigo-600">
                                            <Compass className="w-4 h-4" />
                                        </div>
                                        <h3 className="font-bold text-slate-800 text-sm uppercase tracking-wide">Contexto Histórico</h3>
                                    </div>
                                    <p className="text-slate-600 text-sm leading-relaxed text-justify">
                                        {data.historical_context}
                                    </p>
                                </section>
                            )}

                            {/* 2. Insights Teológicos (NEW) */}
                            {data.theological_insights?.length > 0 && (
                                <section className="bg-slate-50 p-5 rounded-2xl border border-slate-200/60">
                                    <div className="flex items-center gap-2 mb-3">
                                        <div className="p-1.5 bg-violet-100 rounded-lg text-violet-600">
                                            <Scroll className="w-4 h-4" />
                                        </div>
                                        <h3 className="font-bold text-slate-800 text-sm uppercase tracking-wide">Visão Teológica</h3>
                                    </div>
                                    <ul className="space-y-3">
                                        {data.theological_insights.map((insight, idx) => (
                                            <li key={idx} className="text-sm text-slate-700 leading-relaxed flex gap-2">
                                                <span className="text-violet-400 mt-1">•</span>
                                                <span>{insight}</span>
                                            </li>
                                        ))}
                                    </ul>
                                </section>
                            )}

                            {/* 3. Aplicabilidade */}
                            {data.practical_application?.length > 0 && (
                                <section>
                                    <div className="flex items-center gap-2 mb-3 px-1">
                                        <Lightbulb className="w-4 h-4 text-amber-500" />
                                        <h3 className="font-bold text-slate-800 text-sm uppercase tracking-wide">Aplicação Prática</h3>
                                    </div>
                                    <ul className="space-y-2">
                                        {data.practical_application.map((app, idx) => (
                                            <li key={idx} className="flex gap-3 bg-white p-3 rounded-xl border border-slate-100 shadow-sm text-sm text-slate-700">
                                                <span className="flex-shrink-0 w-6 h-6 rounded-full bg-amber-50 text-amber-600 flex items-center justify-center font-bold text-xs mt-0.5 border border-amber-100">
                                                    {idx + 1}
                                                </span>
                                                <span className="leading-relaxed">{app}</span>
                                            </li>
                                        ))}
                                    </ul>
                                </section>
                            )}

                            {/* 4. Temas (Chips) */}
                            {data.themes?.length > 0 && (
                                <section className="bg-white p-5 rounded-2xl border border-slate-100 shadow-sm">
                                    <div className="flex items-center gap-2 mb-3">
                                        <LinkIcon className="w-4 h-4 text-emerald-600" />
                                        <h3 className="font-bold text-slate-800 text-sm uppercase tracking-wide">Temas Centrais</h3>
                                    </div>
                                    <div className="flex flex-wrap gap-2">
                                        {data.themes.map((theme, i) => (
                                            <span key={i} className="px-3 py-1.5 bg-slate-50 border border-slate-200 rounded-lg text-xs font-semibold text-slate-600">
                                                {theme}
                                            </span>
                                        ))}
                                    </div>
                                </section>
                            )}

                            {/* Author Ref */}
                            {data.author_ref && (
                                <div className="text-center">
                                    <p className="text-[10px] text-slate-400 uppercase tracking-widest font-bold">Fonte / Referência</p>
                                    <p className="text-xs text-slate-500 font-serif italic mt-1">{data.author_ref}</p>
                                </div>
                            )}

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

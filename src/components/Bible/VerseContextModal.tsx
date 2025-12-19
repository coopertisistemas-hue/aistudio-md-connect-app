import React, { useEffect } from 'react';

import { useNavigate } from 'react-router-dom';
import { X, Sparkles, Book, Compass, Lightbulb, Scroll, User, Calendar, Target, BookOpen, Link as LinkIcon, ArrowRight, ExternalLink } from 'lucide-react';
import { bibleService, type BibleCommentary } from '@/services/bible';
import { bibleBooksContext } from '@/data/bibleBooksContext';

// Helper Component for consistent section headers
const SectionHeader = ({ icon: Icon, color, title }: { icon: React.ElementType, color: string, title: string }) => {
    const colorMap: Record<string, string> = {
        indigo: 'bg-indigo-50 text-indigo-600',
        violet: 'bg-violet-50 text-violet-600',
        amber: 'bg-amber-50 text-amber-600',
        emerald: 'bg-emerald-50 text-emerald-600',
    };
    const activeColor = colorMap[color] || colorMap.indigo;

    return (
        <div className="flex items-center gap-2 mb-3">
            <div className={`p-1.5 rounded-lg ${activeColor}`}>
                <Icon className="w-4 h-4" />
            </div>
            <h3 className="font-bold text-slate-800 text-sm uppercase tracking-wide">{title}</h3>
        </div>
    );
};

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
    const navigate = useNavigate();

    // Close on escape
    useEffect(() => {
        const handleEsc = (e: KeyboardEvent) => { if (e.key === 'Escape') onClose(); };
        window.addEventListener('keydown', handleEsc);
        return () => window.removeEventListener('keydown', handleEsc);
    }, [onClose]);

    // Lookup Static Book Context
    const bookContext = React.useMemo(() => {
        if (!verseBookId) {
            // Try to extract from verseRef "1Tm 3:16" -> "1tm"
            if (!verseRef) return null;
            const match = verseRef.match(/^((?:[123]\s*)?[a-zA-Z]+)/);
            if (match) {
                const key = match[1].toLowerCase().replace(/\s/g, ''); // "1 Tm" -> "1tm"
                return bibleBooksContext[key] || null;
            }
            return null;
        }
        // Normalize passed ID "1tm", "genesis"
        let key = verseBookId.toLowerCase();
        if (key === 'gênesis') key = 'gn'; // basic norm
        // ... (can add more norm logic or rely on service if needed)

        return bibleBooksContext[key] || null;
    }, [verseBookId, verseRef]);

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
                    <div className="p-6 md:p-8 space-y-8 pb-32"> {/* Added padding bottom for sticky footer overlap safety if needed, though structure separates it */}

                        {/* 0. Static Book Context */}
                        {bookContext && (
                            <section className="bg-white p-5 rounded-2xl border border-slate-100 shadow-sm space-y-4">
                                <SectionHeader icon={BookOpen} color="indigo" title={`Contexto de ${bookContext.name}`} />
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div className="space-y-1">
                                        <div className="flex items-center gap-1.5 text-xs font-bold text-slate-400 uppercase tracking-widest">
                                            <User className="w-3 h-3" /> Autor
                                        </div>
                                        <p className="text-sm text-slate-700 leading-snug font-medium">{bookContext.author}</p>
                                    </div>
                                    <div className="space-y-1">
                                        <div className="flex items-center gap-1.5 text-xs font-bold text-slate-400 uppercase tracking-widest">
                                            <Calendar className="w-3 h-3" /> Data
                                        </div>
                                        <p className="text-sm text-slate-700 leading-snug font-medium">{bookContext.date}</p>
                                    </div>
                                    <div className="col-span-1 md:col-span-2 space-y-1">
                                        <div className="flex items-center gap-1.5 text-xs font-bold text-slate-400 uppercase tracking-widest">
                                            <Target className="w-3 h-3" /> Propósito
                                        </div>
                                        <p className="text-sm text-slate-700 leading-relaxed">{bookContext.purpose}</p>
                                    </div>
                                </div>
                                <div className="flex flex-wrap gap-2 pt-2">
                                    {bookContext.themes.map(t => (
                                        <span key={t} className="px-2.5 py-1 bg-slate-100 rounded-md text-[10px] font-bold text-slate-600 uppercase tracking-wider">
                                            {t}
                                        </span>
                                    ))}
                                </div>
                            </section>
                        )}

                        {/* Loading State */}
                        {isLoadingContext ? (
                            <div className="p-8 space-y-6 flex flex-col items-center justify-center text-center opacity-70">
                                <Sparkles className="w-8 h-8 text-indigo-300 animate-pulse mb-3" />
                                <p className="text-xs text-slate-400 font-medium animate-pulse">
                                    Buscando insights do versículo...
                                </p>
                            </div>
                        ) : data ? (
                            <div className="space-y-8 animate-in fade-in slide-in-from-bottom-2 duration-500">

                                {/* 1. Contexto Histórico */}
                                {data.historical_context && (
                                    <section>
                                        <SectionHeader icon={Compass} color="indigo" title="Contexto Histórico" />
                                        <p className="text-slate-700 text-sm leading-relaxed text-justify bg-white p-5 rounded-2xl shadow-sm border border-slate-100">
                                            {data.historical_context}
                                        </p>
                                    </section>
                                )}

                                {/* 2. Insights Teológicos */}
                                {data.theological_insights?.length > 0 && (
                                    <section>
                                        <SectionHeader icon={Scroll} color="violet" title="Visão Teológica" />
                                        <ul className="space-y-3">
                                            {data.theological_insights.map((insight, idx) => (
                                                <li key={idx} className="bg-white p-4 rounded-2xl border-l-4 border-violet-300 shadow-sm text-sm text-slate-700 leading-relaxed">
                                                    {insight}
                                                </li>
                                            ))}
                                        </ul>
                                    </section>
                                )}

                                {/* 3. Aplicabilidade (Bullets) */}
                                {data.practical_application?.length > 0 && (
                                    <section>
                                        <SectionHeader icon={Lightbulb} color="amber" title="Aplicação Prática" />
                                        <ul className="space-y-3 bg-white p-5 rounded-2xl border border-slate-100 shadow-sm">
                                            {data.practical_application.slice(0, 4).map((app, idx) => (
                                                <li key={idx} className="flex items-start gap-3 text-sm text-slate-700">
                                                    <span className="mt-1.5 w-1.5 h-1.5 rounded-full bg-amber-400 shrink-0" />
                                                    <span className="leading-relaxed">{app}</span>
                                                </li>
                                            ))}
                                        </ul>
                                    </section>
                                )}

                                {/* 4. Referências Cruzadas (Chips) */}
                                {data.cross_references && data.cross_references.length > 0 && (
                                    <section>
                                        <SectionHeader icon={LinkIcon} color="emerald" title="Referências Cruzadas" />
                                        <div className="flex flex-wrap gap-2.5">
                                            {data.cross_references.map((ref, idx) => (
                                                <button
                                                    key={idx}
                                                    onClick={() => {
                                                        try {
                                                            const parts = ref.trim().split(' ');
                                                            if (parts.length < 2) { onClose(); return; }
                                                            const refPart = parts.pop();
                                                            const bookPart = parts.join(' ').toLowerCase().replace('.', '');
                                                            if (refPart && bookPart) {
                                                                const chapterNum = refPart.split(':')[0];
                                                                navigate(`/biblia/${encodeURIComponent(bookPart)}/${chapterNum}`);
                                                            }
                                                        } catch (e) {
                                                            console.warn("Nav error", e);
                                                        }
                                                        onClose();
                                                    }}
                                                    className="group inline-flex items-center gap-1.5 px-3.5 py-2 bg-indigo-50 border border-indigo-100 rounded-full text-xs font-semibold text-indigo-700 italic hover:bg-indigo-100 hover:border-indigo-200 transition-all shadow-sm active:scale-95"
                                                >
                                                    <span className="not-italic opacity-70 group-hover:opacity-100 transition-opacity">
                                                        <LinkIcon className="w-3 h-3" />
                                                    </span>
                                                    {ref}
                                                    <ExternalLink className="w-3 h-3 opacity-40 ml-0.5 group-hover:translate-x-0.5 transition-transform" />
                                                </button>
                                            ))}
                                        </div>
                                    </section>
                                )}

                                {/* Author Ref */}
                                {data.author_ref && (
                                    <div className="text-center pt-6 pb-2 border-t border-slate-100 mt-6">
                                        <p className="text-[10px] text-slate-400 uppercase tracking-widest font-bold">Fonte</p>
                                        <p className="text-xs text-slate-500 font-serif italic mt-1">{data.author_ref}</p>
                                    </div>
                                )}

                            </div>
                        ) : (
                            !bookContext && (
                                <div className="flex flex-col items-center justify-center py-10 opacity-50">
                                    <p className="text-sm text-slate-400">Nenhum detalhe adicional encontrado.</p>
                                </div>
                            )
                        )}
                    </div>
                </div>

                {/* Sticky Footer Action */}
                {verseBookId && chapter && (
                    <div className="p-4 bg-white/80 backdrop-blur-xl border-t border-slate-100 sticky bottom-0 z-10 w-full shrink-0 shadow-[0_-4px_20px_-4px_rgba(0,0,0,0.05)]">
                        <button
                            onClick={() => {
                                navigate(`/biblia/${verseBookId}/${chapter}`);
                                onClose();
                            }}
                            className="w-full flex items-center justify-center gap-2 py-4 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-bold text-sm transition-all shadow-lg shadow-slate-200 active:scale-[0.98]"
                        >
                            Abrir no Capítulo <ArrowRight className="w-4 h-4" />
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
}

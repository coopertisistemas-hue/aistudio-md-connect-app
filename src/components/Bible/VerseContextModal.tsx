import React, { useEffect, useRef } from 'react';
import { createPortal } from 'react-dom';
import { useNavigate } from 'react-router-dom';
import { X, Sparkles, Book, Compass, Lightbulb, Scroll, User, Calendar, Target, BookOpen, Link as LinkIcon, ArrowRight, ExternalLink } from 'lucide-react';
import { bibleService, type BibleCommentary, type BibleVerse } from '@/services/bible';
import { bibleBooksContext } from '@/data/bibleBooksContext';
import { parseReferenceDetails } from '@/utils/bibleParser';

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
    passageVerses?: { verse: number, text: string }[] | null; // New structured text
    verseBookId?: string;
    chapter?: number;
    verse?: number;
}

export function VerseContextModal({ isOpen, onClose, verseRef, passageText, passageVerses, verseBookId, chapter, verse }: VerseContextModalProps) {
    const navigate = useNavigate();
    const scrollRef = useRef<HTMLDivElement>(null);

    // Reset scroll when opened
    useEffect(() => {
        if (isOpen && scrollRef.current) {
            scrollRef.current.scrollTo(0, 0);
        }
    }, [isOpen]);

    // Close on escape
    useEffect(() => {
        const handleEsc = (e: KeyboardEvent) => { if (e.key === 'Escape') onClose(); };
        window.addEventListener('keydown', handleEsc);
        return () => window.removeEventListener('keydown', handleEsc);
    }, [onClose]);

    // Internal State for "Self-Service" fetching (when props are missing)
    const [fetchedVerses, setFetchedVerses] = React.useState<BibleVerse[] | null>(null);
    const [fetchedParams, setFetchedParams] = React.useState<{ bookId: string, chapter: number, verse: number } | null>(null);
    const [isLoadingText, setIsLoadingText] = React.useState(false);

    // 1. Resolve Reference to Params (if not provided)
    useEffect(() => {
        if (isOpen && verseRef && (!verseBookId || !chapter || !verse)) {
            const details = parseReferenceDetails(verseRef);
            if (details && details.isValid) {
                const bookId = bibleService.getBookIdFromRaw(details.bookRaw);
                if (bookId) {
                    setFetchedParams({
                        bookId,
                        chapter: details.chapter,
                        verse: details.verseStart
                    });

                    // Also fetch text if missing
                    if (!passageText && !passageVerses) {
                        setIsLoadingText(true);
                        bibleService.getPassageText({
                            book: details.bookRaw, // Use raw for search or ID? getPassageText handles raw well
                            chapter: details.chapter,
                            verseStart: details.verseStart,
                            verseEnd: details.verseEnd
                        }).then(verses => {
                            setFetchedVerses(verses);
                        }).finally(() => setIsLoadingText(false));
                    }
                }
            }
        } else {
            // Reset if props change or close
            // Optional: we might want to keep data to avoid flicker, but for now reset on new ref
        }
    }, [isOpen, verseRef, verseBookId, chapter, verse, passageText, passageVerses]);

    // Determine final params
    const activeBookId = verseBookId || fetchedParams?.bookId;
    const activeChapter = chapter || fetchedParams?.chapter;
    const activeVerse = verse || fetchedParams?.verse;

    // Lookup Static Book Context
    const bookContext = React.useMemo(() => {
        if (!activeBookId) return null;
        return bibleBooksContext[activeBookId.toLowerCase()] || bibleBooksContext['gn'] || null;
    }, [activeBookId]);

    // Data Fetching State (Commentary)
    const [data, setData] = React.useState<BibleCommentary | null>(null);
    const [isLoadingContext, setIsLoadingContext] = React.useState(false);

    useEffect(() => {
        if (isOpen && activeBookId && activeChapter && activeVerse) {
            setIsLoadingContext(true);
            setData(null);

            // Use passed text OR fetched text for AI generation/fallback context
            const contextText = passageText || (fetchedVerses ? fetchedVerses.map(v => v.text).join(' ') : undefined);

            bibleService.getVerseCommentary(activeBookId, activeChapter, activeVerse, contextText)
                .then(res => {
                    setData(res);
                })
                .catch(err => console.error(err))
                .finally(() => setIsLoadingContext(false));
        }
    }, [activeBookId, activeChapter, activeVerse, isOpen, passageText, fetchedVerses]);


    if (!isOpen) return null;

    // Logic for truncation
    const MAX_VERSES = 12;
    const finalVerses = passageVerses || fetchedVerses;
    const isTruncated = finalVerses && finalVerses.length > MAX_VERSES;
    const displayVerses = isTruncated ? finalVerses.slice(0, MAX_VERSES) : finalVerses;

    return createPortal(
        <div className="fixed inset-0 z-[100] flex items-start justify-center px-4 pt-16 pb-4 sm:items-center sm:p-4 animate-fade-in isolate">
            {/* Backdrop */}
            <div className="absolute inset-0 bg-slate-900/60 backdrop-blur-md transition-opacity" onClick={onClose} />

            {/* Modal Card */}
            <div className="relative w-full max-w-lg bg-white rounded-3xl shadow-2xl overflow-hidden flex flex-col max-h-[85vh] animate-in zoom-in-95 duration-200 ring-1 ring-white/20 z-10">

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

                        {/* Only show simple text here if NO complex verses are provided, keeping legacy behavior */}
                        {passageText && !finalVerses && (
                            <div className="relative max-w-sm mx-auto">
                                <p className="text-indigo-50/90 text-sm md:text-base leading-relaxed italic font-serif">
                                    "{passageText}"
                                </p>
                            </div>
                        )}
                    </div>
                </div>

                {/* Scrollable Content */}
                <div ref={scrollRef} className="overflow-y-auto flex-1 bg-slate-50/50 scroll-smooth">
                    <div className="p-6 md:p-8 space-y-8 pb-32">

                        {/* NEW: Explicit Text Section for Passages */}
                        {((finalVerses && finalVerses.length > 0) || isLoadingText) && (
                            <section className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm">
                                <SectionHeader icon={BookOpen} color="indigo" title="Texto Bíblico" />
                                {isLoadingText ? (
                                    <div className="space-y-4 animate-pulse">
                                        <div className="flex gap-2">
                                            <div className="h-4 bg-slate-100 rounded w-6 shrink-0 mt-1"></div>
                                            <div className="h-4 bg-slate-100 rounded w-full"></div>
                                        </div>
                                        <div className="flex gap-2">
                                            <div className="h-4 bg-slate-100 rounded w-6 shrink-0 mt-1"></div>
                                            <div className="h-4 bg-slate-100 rounded w-5/6"></div>
                                        </div>
                                        <div className="flex gap-2">
                                            <div className="h-4 bg-slate-100 rounded w-6 shrink-0 mt-1"></div>
                                            <div className="h-4 bg-slate-100 rounded w-4/5"></div>
                                        </div>
                                    </div>
                                ) : (
                                    <div className="space-y-4">
                                        {displayVerses?.map((v, i) => (
                                            <p key={i} className="text-slate-700 leading-relaxed font-serif text-[15px]">
                                                <span className="text-[10px] font-bold text-indigo-400 bg-indigo-50 px-1.5 py-0.5 rounded mr-2 align-middle">
                                                    {v.verse}
                                                </span>
                                                <span className="italic">{v.text}</span>
                                            </p>
                                        ))}
                                        {isTruncated && (
                                            <div className="pt-2 flex items-center gap-2 text-slate-400 text-xs font-medium italic">
                                                <span>(continua...)</span>
                                                <button
                                                    onClick={() => {
                                                        const bId = verseBookId || fetchedParams?.bookId;
                                                        const ch = chapter || fetchedParams?.chapter;
                                                        if (bId && ch) {
                                                            navigate(`/biblia/${bId}/${ch}`);
                                                            onClose();
                                                        }
                                                    }}
                                                    className="text-indigo-500 hover:text-indigo-700 underline"
                                                >
                                                    Ler capítulo completo
                                                </button>
                                            </div>
                                        )}
                                    </div>
                                )}
                            </section>
                        )}

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
        </div>,
        document.body
    );
}

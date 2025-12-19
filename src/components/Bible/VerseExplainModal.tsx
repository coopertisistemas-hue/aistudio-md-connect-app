
import { X, Book, Lightbulb, Compass, Link as LinkIcon, Sparkles } from 'lucide-react';
import { type BibleBookData } from '@/services/bible';

interface ExplainModalProps {
    isOpen: boolean;
    onClose: () => void;
    verseRef: string;
    text: string;
    bookData: BibleBookData | null;
    isLoading: boolean;
}

export function VerseExplainModal({ isOpen, onClose, verseRef, text, bookData, isLoading }: ExplainModalProps) {
    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-end md:items-center justify-center p-4 sm:p-0">
            {/* Backdrop */}
            <div
                className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm transition-opacity animate-in fade-in"
                onClick={onClose}
            />

            {/* Modal Content */}
            <div className="relative w-full max-w-lg bg-white rounded-3xl shadow-2xl overflow-hidden animate-in slide-in-from-bottom-10 duration-500 max-h-[85vh] flex flex-col">

                {/* Header */}
                <div className="bg-gradient-to-br from-indigo-600 to-violet-700 p-6 text-white shrink-0 relative overflow-hidden">
                    <div className="absolute top-0 right-0 p-6 opacity-10">
                        <Sparkles className="w-24 h-24 -rotate-12 transform translate-x-4 -translate-y-4" />
                    </div>

                    <button
                        onClick={onClose}
                        className="absolute top-4 right-4 p-2 bg-white/10 hover:bg-white/20 rounded-full transition-colors"
                    >
                        <X className="w-5 h-5" />
                    </button>

                    <div className="relative z-10">
                        <div className="flex items-center gap-2 text-indigo-100 text-xs font-bold uppercase tracking-widest mb-3">
                            <Book className="w-4 h-4" />
                            Estudo Premium
                        </div>
                        <h2 className="text-2xl font-serif font-bold mb-2">{verseRef}</h2>
                        <p className="text-indigo-100/90 text-sm leading-relaxed line-clamp-2 border-l-2 border-indigo-400/50 pl-3 italic">
                            "{text}"
                        </p>
                    </div>
                </div>

                {/* Body - Scrollable */}
                <div className="overflow-y-auto p-6 space-y-8 bg-slate-50/50">
                    {isLoading ? (
                        <div className="space-y-4 animate-pulse">
                            <div className="h-4 bg-slate-200 rounded w-3/4"></div>
                            <div className="h-32 bg-slate-200 rounded-xl"></div>
                            <div className="h-4 bg-slate-200 rounded w-1/2"></div>
                            <div className="h-20 bg-slate-200 rounded-xl"></div>
                        </div>
                    ) : bookData ? (
                        <>
                            {/* 1. Contexto do Livro */}
                            <section>
                                <div className="flex items-center gap-2 mb-3">
                                    <Compass className="w-5 h-5 text-indigo-600" />
                                    <h3 className="font-bold text-slate-800">Contexto Histórico</h3>
                                </div>
                                <div className="bg-white p-4 rounded-xl border border-slate-100 text-sm text-slate-600 leading-relaxed shadow-sm">
                                    {bookData.historical_context}
                                </div>
                            </section>

                            {/* 2. Aplicabilidade */}
                            <section>
                                <div className="flex items-center gap-2 mb-3">
                                    <Lightbulb className="w-5 h-5 text-amber-500" />
                                    <h3 className="font-bold text-slate-800">Aplicação Prática</h3>
                                </div>
                                <ul className="space-y-2">
                                    {bookData.application.map((app, idx) => (
                                        <li key={idx} className="flex gap-3 bg-white p-3 rounded-xl border border-slate-100 shadow-sm text-sm text-slate-700">
                                            <span className="flex-shrink-0 w-6 h-6 rounded-full bg-amber-50 text-amber-600 flex items-center justify-center font-bold text-xs mt-0.5">
                                                {idx + 1}
                                            </span>
                                            <span className="leading-relaxed">{app}</span>
                                        </li>
                                    ))}
                                </ul>
                            </section>

                            {/* 3. Palavras-chave / Temas (Chips) */}
                            <section>
                                <div className="flex items-center gap-2 mb-3">
                                    <LinkIcon className="w-5 h-5 text-emerald-600" />
                                    <h3 className="font-bold text-slate-800">Temas e Conexões</h3>
                                </div>
                                <div className="flex flex-wrap gap-2">
                                    {bookData.themes.map((theme, i) => (
                                        <span key={i} className="px-3 py-1.5 bg-white border border-slate-200 rounded-lg text-xs font-semibold text-slate-600 shadow-sm">
                                            {theme}
                                        </span>
                                    ))}
                                    {/* Placeholder Cross-refs for MVP */}
                                    <span className="px-3 py-1.5 bg-indigo-50 border border-indigo-100 rounded-lg text-xs font-semibold text-indigo-600 shadow-sm cursor-pointer hover:bg-indigo-100 transition-colors">
                                        Ver referências cruzadas +
                                    </span>
                                </div>
                            </section>
                        </>
                    ) : (
                        <div className="text-center py-10 text-slate-500">
                            Informações de estudo não disponíveis para este livro.
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}

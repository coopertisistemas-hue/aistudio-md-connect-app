import { useState, useMemo, useEffect } from 'react';
import { Quote, BookOpen, Sparkles, Calendar, Heart, Users } from 'lucide-react';
import { parseBibleRefs } from '@/utils/bibleParser';
import { VerseContextModal } from '@/components/Bible/VerseContextModal';
import { cn } from '@/lib/utils';
import { DevotionalAudioPlayer } from './DevotionalAudioPlayer';
import { DevotionalShareButton } from './DevotionalShareButton';
import { bibleService } from '@/services/bible';
import { interactionService } from '@/services/interactionService';
import { useAuth } from '@/contexts/AuthContext';

interface DevotionalContentRendererProps {
    id: string; // [NEW] Required for sharing
    title: string;
    subtitle?: string;
    content: string;
    author?: { name: string; avatar_url?: string | null } | null;
    coverUrl?: string | null; // [NEW] For image sharing
}

export function DevotionalContentRenderer({ id, title, subtitle, content, author, coverUrl }: DevotionalContentRendererProps) {
    const [modalState, setModalState] = useState<{ isOpen: boolean; ref: string | null }>({
        isOpen: false,
        ref: null
    });

    const handleOpenModal = (ref: string) => {
        setModalState({ isOpen: true, ref });
    };

    // --- Parsing Logic ---
    const parsedContent = useMemo(() => {
        if (!content) return null;

        const normalized = content.replace(/\r\n/g, '\n');
        const blocks = normalized.split('\n\n');

        let verseKey = '';
        let reflectionLines: string[] = [];
        let applicationLines: string[] = [];
        let prayer = '';
        let readings: string[] = [];

        let currentBlockIndex = 0;
        // Key Verse Heuristic: First block if not a header
        if (blocks.length > 0 && !blocks[0].trim().startsWith('#')) {
            verseKey = blocks[0].trim();
            currentBlockIndex = 1;
        }

        let currentSection: 'reflection' | 'application' | 'prayer' | 'readings' = 'reflection';

        for (let i = currentBlockIndex; i < blocks.length; i++) {
            const block = blocks[i].trim();
            if (!block) continue;
            const lowerBlock = block.toLowerCase();

            // Section Detection
            if (lowerBlock.startsWith('## reflexão') || lowerBlock.startsWith('## reflexao')) {
                currentSection = 'reflection'; continue;
            }
            if (lowerBlock.startsWith('## oração') || lowerBlock.startsWith('## oracao')) {
                currentSection = 'prayer';
                // Inline prayer content check
                const inline = block.replace(/^##\s*oraç[ãa]o\s*:?/i, '').trim();
                if (inline) prayer += (prayer ? '\n\n' : '') + inline;
                continue;
            }
            if (lowerBlock.startsWith('## leituras') || lowerBlock.startsWith('## leituras')) {
                currentSection = 'readings'; continue;
            }
            // Application Section Detection
            const appMatch = block.match(/^(?:##\s*)?aplicaç[ãa]o pr[áa]tica:?(.*)/i);
            if (appMatch) {
                currentSection = 'application';
                const inline = appMatch[1].trim();
                if (inline) applicationLines.push(inline);
                continue;
            }
            // Signature Detection
            if (block.match(/^(?:---|___)?\s*(?:escrito|supervisionado|autor)\s*(?:por|:)?\s+.*$/i)) {
                continue;
            }
            if (block.startsWith('---')) {
                continue;
            }

            // Content Accumulation
            if (currentSection === 'reflection') {
                if (!block.startsWith('#')) reflectionLines.push(block);
            } else if (currentSection === 'prayer') {
                if (!block.startsWith('#')) prayer += (prayer ? '\n\n' : '') + block;
            } else if (currentSection === 'application') {
                if (!block.startsWith('#')) applicationLines.push(block);
            } else if (currentSection === 'readings') {
                if (!block.startsWith('#')) readings.push(block);
            }
        }

        return { verseKey, reflectionLines, applicationLines, prayer, readings };
    }, [content]);

    // --- Renderers ---
    const renderRichText = (text: string) => {
        const chunks = parseBibleRefs(text);
        return (
            <>
                {chunks.map((chunk, idx) => {
                    if (chunk.type === 'ref') {
                        return (
                            <span
                                key={idx}
                                onClick={() => handleOpenModal(chunk.content)}
                                className="font-semibold text-indigo-600 cursor-pointer hover:text-indigo-800 hover:underline decoration-indigo-300 decoration-2 underline-offset-2 transition-colors px-0.5 rounded hover:bg-indigo-50"
                                title="Ver contexto"
                            >
                                {chunk.content}
                            </span>
                        );
                    }
                    const parts = chunk.content.split(/(\*\*.*?\*\*)/g);
                    return parts.map((sub, sIdx) => {
                        if (sub.startsWith('**') && sub.endsWith('**')) return <strong key={`${idx}-${sIdx}`} className="font-bold text-slate-900">{sub.slice(2, -2)}</strong>;
                        return sub;
                    });
                })}
            </>
        );
    };

    if (!parsedContent) return null;

    // Helper to generate full audio text with expanded abbreviations
    const fullAudioText = useMemo(() => {
        const parts = [
            title,
            subtitle,
            parsedContent.verseKey,
            ...parsedContent.reflectionLines,
            parsedContent.applicationLines.length > 0 ? 'Aplicação Prática.' : '',
            ...parsedContent.applicationLines,
            parsedContent.prayer ? 'Oração.' : '',
            parsedContent.prayer
        ].filter(Boolean) as string[];

        // Join and clean basic markdown
        let text = parts.join('. ').replace(/[*#_\[\]]/g, '');

        // 1. Fix "Chapter:Verse" pronunciation (e.g. 4:6 -> 4 versículo 6)
        text = text.replace(/(\d+):(\d+)/g, '$1 versículo $2');

        // 2. Fix Verse Ranges (e.g. 1-2 -> 1 a 2)
        text = text.replace(/(\d+)-(\d+)/g, '$1 a $2');

        // 3. Expand Book Abbreviations (e.g. "Hb" -> "Hebreus", "1Pe" -> "Primeiro Pedro", "1 Rs" -> "Primeiro Reis")
        // Capture optional 1-3 prefix (+ optional space) + 2 letters (including accents)
        // [A-Za-zÀ-ÿ] ensures words like "Amém" are matched correctly preventing partial matches.
        return text.replace(/\b((?:[1-3]\s*)?[A-Za-zÀ-ÿ]{2,})\b/g, (match) => {
            return bibleService.expandBookName(match);
        });
    }, [title, subtitle, parsedContent]);

    // Social Proof State
    const [likes, setLikes] = useState(0);
    const [hasLiked, setHasLiked] = useState(false);
    const [viewsToday, setViewsToday] = useState(0);
    const { user } = useAuth(); // Assuming useAuth exists, if not need to fetch from supabase auth

    useEffect(() => {
        if (!id) return;

        // Log View
        interactionService.logDevotionalRead(id, user?.id);

        // Fetch Data
        const load = async () => {
            const details = await interactionService.getDevotionalDetails(id, user?.id);
            setLikes(details.likes);
            setHasLiked(details.has_liked);
            setViewsToday(details.views_today);
        };
        load();
    }, [id, user]);

    const handleLike = async () => {
        if (!user) {
            // Optional: prompt login
            return;
        }

        // Optimistic UI
        const newLikeState = !hasLiked;
        setHasLiked(newLikeState);
        setLikes(prev => newLikeState ? prev + 1 : prev - 1);

        const res = await interactionService.toggleDevotionalReaction(id!, user.id);
        if (res) {
            setLikes(res.count);
            setHasLiked(res.reacted);
        } else {
            // Revert on error
            setHasLiked(!newLikeState);
            setLikes(prev => newLikeState ? prev - 1 : prev + 1);
        }
    };

    if (!content) return null;

    const formattedDate = new Date().toLocaleDateString('pt-BR', {
        weekday: 'long',
        year: 'numeric',
        month: 'long',
        day: 'numeric'
    });

    return (
        <article className="max-w-3xl mx-auto pb-24 animate-in fade-in duration-700">


            {/* Header Content */}
            <header className="mb-10 text-center px-4">
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-50 text-indigo-700 text-xs font-bold uppercase tracking-wider mb-4">
                    <span className="w-2 h-2 rounded-full bg-indigo-500 animate-pulse" />
                    Devocional Diário
                </div>

                <h1 className="text-3xl md:text-5xl font-serif font-bold text-slate-900 mb-4 leading-tight">
                    {title}
                </h1>

                <div className="flex items-center justify-center gap-2 text-slate-500 text-sm font-medium">
                    <Calendar className="w-4 h-4" />
                    <span className="capitalize">{formattedDate}</span>
                </div>

                {/* Social Proof Bar */}
                <div className="flex items-center justify-center gap-6 mt-6 animate-in slide-in-from-bottom-2 fade-in duration-500 delay-150">
                    <div className="flex items-center gap-2 text-slate-500 text-xs font-medium bg-slate-50 px-3 py-1.5 rounded-full border border-slate-100">
                        <Users className="w-3.5 h-3.5 text-indigo-500" />
                        <span>{viewsToday > 0 ? `${viewsToday} leram hoje` : 'Seja o primeiro a ler'}</span>
                    </div>

                    <button
                        onClick={handleLike}
                        className={cn(
                            "flex items-center gap-1.5 px-4 py-1.5 rounded-full border transition-all active:scale-95",
                            hasLiked
                                ? "bg-indigo-50 border-indigo-200 text-indigo-700"
                                : "bg-white border-slate-200 text-slate-600 hover:bg-slate-50"
                        )}
                    >
                        <Heart className={cn("w-4 h-4", hasLiked && "fill-current")} />
                        <span className="text-sm font-bold">{hasLiked ? "Amém!" : "Amém"}</span>
                        <span className="text-xs opacity-70 border-l border-current pl-1.5 ml-0.5">{likes}</span>
                    </button>

                    {coverUrl && (
                        <DevotionalShareButton
                            id={id}
                            title={title}
                            subtitle={subtitle}
                            verseKey={parsedContent?.verseKey}
                            coverUrl={coverUrl}
                        />
                    )}
                </div>
            </header>

            {/* 1. Key Verse */}
            {parsedContent.verseKey && (
                <div className="bg-white rounded-2xl p-6 md:p-8 shadow-sm border border-slate-100 relative overflow-hidden group hover:shadow-md transition-shadow mb-8">
                    <div className="absolute top-0 right-0 p-4 opacity-10">
                        <Quote className="w-16 h-16 text-indigo-900 rotate-12" />
                    </div>
                    <p className="font-serif text-xl md:text-2xl text-slate-800 italic leading-relaxed relative z-10">
                        “{renderRichText(parsedContent.verseKey.replace(/^['"]|['"]$/g, ''))}”
                    </p>
                    {subtitle && (
                        <p className="text-sm font-bold text-indigo-600 mt-4 uppercase tracking-wider text-right flex justify-end items-center gap-2">
                            <span className="w-8 h-px bg-indigo-200" />
                            {subtitle}
                        </p>
                    )}
                </div>
            )}

            {/* 2. Reflection */}
            <div className="bg-white rounded-3xl p-6 md:p-8 shadow-sm border border-slate-100 mb-8">
                <div className="flex items-center gap-3 mb-6">
                    <div className="h-0.5 w-8 bg-indigo-500 rounded-full" />
                    <span className="text-sm font-bold text-indigo-900 uppercase tracking-widest">Reflexão Guiada</span>
                </div>

                <div className="prose prose-slate prose-lg md:prose-xl max-w-none text-slate-600 leading-8 tracking-wide">
                    {parsedContent.reflectionLines.map((line, idx) => (
                        <p key={idx} className="mb-6 last:mb-0">
                            {renderRichText(line)}
                        </p>
                    ))}
                </div>

                {/* 3. Readings */}
                {parsedContent.readings.length > 0 && (
                    <div className="mt-10 pt-8 border-t border-slate-100">
                        <h4 className="flex items-center gap-2 text-xs font-bold text-slate-400 uppercase tracking-wider mb-4">
                            <BookOpen className="w-4 h-4" />
                            Leituras de Apoio
                        </h4>
                        <div className="flex flex-wrap gap-2">
                            {parsedContent.readings.map((r, i) => (
                                <div key={i} className="inline-flex items-center px-4 py-2 bg-slate-50 border border-slate-100 rounded-full text-sm font-medium text-slate-600 hover:bg-indigo-50 hover:text-indigo-700 hover:border-indigo-100 transition-colors cursor-default">
                                    {renderRichText(r)}
                                </div>
                            ))}
                        </div>
                    </div>
                )}
            </div>

            {/* 3. Application */}
            {parsedContent.applicationLines.length > 0 && (
                <div className="bg-white rounded-3xl p-6 md:p-8 shadow-sm border border-slate-100 mb-8">
                    <div className="flex items-center gap-3 mb-6">
                        <div className="h-0.5 w-8 bg-indigo-500 rounded-full" />
                        <span className="text-sm font-bold text-indigo-900 uppercase tracking-widest">Aplicação Prática</span>
                    </div>

                    <div className="prose prose-slate prose-lg md:prose-xl max-w-none text-slate-600 leading-8 tracking-wide">
                        {parsedContent.applicationLines.map((line, idx) => (
                            <p key={idx} className="mb-6 last:mb-0">
                                {renderRichText(line)}
                            </p>
                        ))}
                    </div>
                </div>
            )}

            {/* 4. Prayer */}
            {parsedContent.prayer && (
                <div className="bg-slate-50/80 backdrop-blur-sm rounded-3xl p-6 md:p-8 shadow-sm border border-slate-100 relative overflow-hidden group mb-8">
                    <div className="absolute -right-2 -top-2 opacity-[0.03] transform rotate-12">
                        <Sparkles className="w-24 h-24 text-indigo-900" />
                    </div>

                    <div className="flex items-center gap-3 mb-6 relative z-10">
                        <div className="inline-flex items-center gap-2 px-3 py-1 bg-indigo-50 rounded-full border border-indigo-100">
                            <Sparkles className="w-3 h-3 text-indigo-500" />
                            <span className="text-[10px] font-bold text-indigo-700 uppercase tracking-widest leading-none mt-0.5">Oração</span>
                        </div>
                    </div>

                    <p className="text-lg md:text-xl text-slate-700 font-serif italic leading-relaxed relative z-10">
                        <span className="text-indigo-300 font-sans text-4xl leading-none absolute -left-4 -top-2 select-none opacity-50">“</span>
                        {renderRichText(parsedContent.prayer.trim())}
                    </p>
                </div>
            )}

            <div className="flex justify-center pb-8">
                <div className="flex flex-col items-center text-center">
                    <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-1">SUPERVISIONADO POR</p>
                    <p className="text-slate-800 font-serif font-bold text-lg">
                        {author?.name || 'MD — Momento Devocional'}
                    </p>
                </div>
            </div>

            {/* Modal */}
            <VerseContextModal
                isOpen={modalState.isOpen}
                onClose={() => setModalState(prev => ({ ...prev, isOpen: false }))}
                verseRef={modalState.ref}
                passageText={null} // Let modal fetch it
            />

            {/* Sticky Audio Player */}
            <DevotionalAudioPlayer text={fullAudioText} />
        </article>
    );
}

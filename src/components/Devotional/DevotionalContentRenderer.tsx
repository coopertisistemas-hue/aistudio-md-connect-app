import React, { useMemo, useState } from 'react';
import { Quote, BookOpen, Sparkles } from 'lucide-react';
import { parseBibleRefs } from '@/utils/bibleParser';
import { bibleService } from '@/services/bible';
import { VerseContextModal } from '@/components/Bible/VerseContextModal';

interface DevotionalContentRendererProps {
    title: string;
    subtitle?: string;
    content: string;
    author?: { name: string; avatar_url: string | null } | null;
}

export function DevotionalContentRenderer({ title, subtitle, content, author }: DevotionalContentRendererProps) {
    const [modalState, setModalState] = useState<{ isOpen: boolean; ref: string | null; text: string | null; isLoading: boolean }>({
        isOpen: false,
        ref: null,
        text: null,
        isLoading: false
    });

    const handleOpenModal = async (ref: string) => {
        setModalState({ isOpen: true, ref, text: null, isLoading: true });
        try {
            // Lazy load the service to avoid circular deps if any (though standard import is fine)
            const { bibleService } = await import('@/services/bible');
            const data = await bibleService.getPassage(ref);
            setModalState(prev => ({
                ...prev,
                text: data?.text || null,
                isLoading: false
            }));
        } catch (error) {
            console.error('Failed to fetch passage', error);
            setModalState(prev => ({ ...prev, isLoading: false }));
        }
    };

    // --- Parsing Logic ---
    const parsedContent = useMemo(() => {
        if (!content) return null;

        const normalized = content.replace(/\r\n/g, '\n');
        const blocks = normalized.split('\n\n');

        let verseKey = '';
        let reflectionLines: string[] = [];
        let prayer = '';
        let readings: string[] = [];
        let signature = '';

        let currentBlockIndex = 0;
        // Key Verse Heuristic: First block if not a header
        if (blocks.length > 0 && !blocks[0].trim().startsWith('#')) {
            verseKey = blocks[0].trim();
            currentBlockIndex = 1;
        }

        let currentSection: 'reflection' | 'prayer' | 'readings' | 'signature' = 'reflection';

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
            if (lowerBlock.startsWith('### leituras') || lowerBlock.startsWith('## leituras')) {
                currentSection = 'readings'; continue;
            }
            if (block.startsWith('---') || lowerBlock.includes('escrito por')) {
                currentSection = 'signature';
                // Don't continue, might be the line itself
            }

            // Content Accumulation
            if (currentSection === 'reflection') {
                if (!block.startsWith('#')) reflectionLines.push(block);
            } else if (currentSection === 'prayer') {
                if (!block.startsWith('#')) prayer += (prayer ? '\n\n' : '') + block;
            } else if (currentSection === 'readings') {
                if (!block.startsWith('#')) readings.push(block);
            } else if (currentSection === 'signature') {
                if (!block.startsWith('---')) signature += block;
            }
        }

        return { verseKey, reflectionLines, prayer, readings, signature };
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
                    // Handle bold markdown too
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

    return (
        <div className="space-y-8 animate-fade-in relative z-20">
            {/* 1. Key Verse */}
            {parsedContent.verseKey && (
                <div className="bg-white rounded-2xl p-6 md:p-8 shadow-sm border border-slate-100 relative overflow-hidden group hover:shadow-md transition-shadow">
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
            <div className="bg-white rounded-3xl p-6 md:p-8 shadow-sm border border-slate-100">
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

            {/* 4. Prayer */}
            {parsedContent.prayer && (
                <div className="relative overflow-hidden rounded-3xl group">
                    <div className="absolute inset-0 bg-gradient-to-br from-indigo-600 to-purple-700 opacity-95" />
                    <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-10 mix-blend-overlay" />

                    <div className="relative p-8 md:p-10 border border-white/10 rounded-3xl">
                        <div className="flex items-center justify-between mb-6">
                            <h3 className="flex items-center gap-2 text-sm font-bold text-white/90 uppercase tracking-widest">
                                <Sparkles className="w-4 h-4 text-amber-300" />
                                Oração
                            </h3>
                        </div>

                        <p className="text-lg md:text-xl text-white/95 font-medium leading-relaxed font-serif italic relative z-10 selection:bg-indigo-400 selection:text-white">
                            "{renderRichText(parsedContent.prayer.trim())}"
                        </p>
                    </div>
                </div>
            )}

            {/* 5. Author Signature */}
            <div className="flex justify-center pb-8">
                <div className="flex flex-col items-center text-center">
                    <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-1">Escrito por</p>
                    <p className="text-slate-800 font-serif font-bold text-lg">
                        {parsedContent.signature || author?.name || 'Equipe Pastoral'}
                    </p>
                </div>
            </div>

            {/* Modal */}
            <VerseContextModal
                isOpen={modalState.isOpen}
                onClose={() => setModalState(prev => ({ ...prev, isOpen: false }))}
                reference={modalState.ref}
                passageText={modalState.text}
                isLoading={modalState.isLoading}
            />
        </div>
    );
}

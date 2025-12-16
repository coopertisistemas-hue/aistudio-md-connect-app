import { useState } from 'react';
import { Play, Pause, ChevronUp, Copy, Check } from 'lucide-react';

interface VerseStickerProps {
    verse: {
        text: string;
        reference: string;
        lang: string;
    } | null;
    simple?: boolean;
}

export function VerseSticker({ verse, simple }: VerseStickerProps) {
    const [isExpanded, setIsExpanded] = useState(false);
    const [isPlaying, setIsPlaying] = useState(false);
    const [copied, setCopied] = useState(false);

    // Fallback default verse if API returns null (ensures UI visibility)
    // Also handling cases where verse object exists but might have missing fields
    const effectiveVerse = (verse && verse.reference && verse.text) ? verse : {
        text: "O SENHOR é o meu pastor, nada me faltará.",
        reference: "Salmos 23:1",
        lang: "pt-BR"
    };

    if (!effectiveVerse) return null;

    if (simple) {
        return (
            <div className="px-6 mb-8 mt-4 text-center">
                <p className="text-sm font-serif italic text-white/80 leading-relaxed">
                    "{effectiveVerse.text}"
                </p>
                <p className="text-[10px] font-bold text-white/40 mt-2 uppercase tracking-widest">
                    {effectiveVerse.reference}
                </p>
            </div>
        );
    }

    const handleSpeak = (e: React.MouseEvent) => {
        // ... (existing logic)
        e.stopPropagation();

        if (isPlaying) {
            window.speechSynthesis.cancel();
            setIsPlaying(false);
            return;
        }

        const utterance = new SpeechSynthesisUtterance(`${effectiveVerse.text}. ${effectiveVerse.reference}`);
        utterance.lang = effectiveVerse.lang || 'pt-BR';
        utterance.rate = 0.9;
        utterance.onend = () => setIsPlaying(false);
        window.speechSynthesis.speak(utterance);
        setIsPlaying(true);
    };

    const handleCopy = (e: React.MouseEvent) => {
        e.stopPropagation();
        const textToCopy = `"${effectiveVerse.text}" - ${effectiveVerse.reference}`;
        navigator.clipboard.writeText(textToCopy).then(() => {
            setCopied(true);
            setTimeout(() => setCopied(false), 2000);
        });
    };

    return (
        <div className="px-5 mt-4 mb-2 relative z-30">
            <div
                onClick={() => setIsExpanded(!isExpanded)}
                className={`
                    bg-white/10 backdrop-blur-md border border-white/15 shadow-xl 
                    transition-all duration-300 cubic-bezier(0.2, 0.8, 0.2, 1) cursor-pointer overflow-hidden
                    ${isExpanded ? 'rounded-3xl' : 'rounded-full active:scale-[0.98]'}
                `}
            >
                {/* Collapsed View (Pill) */}
                {!isExpanded ? (
                    <div className="pl-4 pr-2 py-2 flex items-center justify-between gap-3 h-[52px]">
                        <div className="flex items-center gap-3 overflow-hidden flex-1">
                            <div className="w-8 h-8 rounded-full bg-blue-500/20 flex items-center justify-center shrink-0 border border-blue-400/20">
                                <span className="text-[9px] font-bold text-blue-200 uppercase">{effectiveVerse.reference.split(' ')[0].substring(0, 2)}</span>
                            </div>
                            <div className="flex flex-col justify-center min-w-0">
                                <span className="text-[10px] text-blue-200 font-bold uppercase tracking-wider leading-none mb-0.5">
                                    {effectiveVerse.reference}
                                </span>
                                <span className="text-xs text-white/95 truncate font-medium leading-none opacity-90">
                                    {effectiveVerse.text}
                                </span>
                            </div>
                        </div>

                        {/* Compact Actions */}
                        <div className="flex items-center gap-1">
                            <button
                                onClick={handleSpeak}
                                className="w-8 h-8 rounded-full hover:bg-white/10 flex items-center justify-center text-white/70 transition-colors"
                            >
                                {isPlaying ? <Pause className="w-4 h-4 fill-current" /> : <Play className="w-4 h-4 fill-current ml-0.5" />}
                            </button>
                            <button
                                onClick={handleCopy}
                                className="w-8 h-8 rounded-full hover:bg-white/10 flex items-center justify-center text-white/70 transition-colors"
                            >
                                {copied ? <Check className="w-4 h-4 text-green-400" /> : <Copy className="w-4 h-4" />}
                            </button>
                        </div>
                    </div>
                ) : (
                    /* Expanded View */
                    <div className="p-6 animate-in fade-in zoom-in-95 duration-200">
                        <div className="flex items-start justify-between mb-4">
                            <span className="bg-blue-500/20 text-blue-200 px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wide border border-blue-500/10 shadow-sm">
                                Palavra do Dia
                            </span>
                            <button
                                onClick={(e) => { e.stopPropagation(); setIsExpanded(false); }}
                                className="p-1 -mr-2 -mt-2 rounded-full hover:bg-white/10 text-white/40 transition-colors"
                            >
                                <ChevronUp className="w-5 h-5" />
                            </button>
                        </div>

                        <p className="text-base font-serif italic text-white/95 leading-relaxed mb-6">
                            "{effectiveVerse.text}"
                        </p>

                        <div className="flex items-center justify-between pt-4 border-t border-white/10">
                            <div className="flex flex-col">
                                <span className="text-xs font-bold text-white mb-0.5">{effectiveVerse.reference}</span>
                                <span className="text-[10px] text-white/50">Almeida Corrigida Fiel</span>
                            </div>

                            <div className="flex items-center gap-2">
                                <button
                                    onClick={handleSpeak}
                                    className="w-10 h-10 rounded-full bg-blue-600/20 hover:bg-blue-600/30 text-blue-300 flex items-center justify-center border border-blue-500/20 transition-all active:scale-95"
                                >
                                    {isPlaying ? <Pause className="w-5 h-5 fill-current" /> : <Play className="w-5 h-5 fill-current ml-0.5" />}
                                </button>
                                <button
                                    onClick={handleCopy}
                                    className="w-10 h-10 rounded-full bg-white/5 hover:bg-white/10 text-white flex items-center justify-center border border-white/10 transition-all active:scale-95"
                                >
                                    {copied ? <Check className="w-5 h-5 text-green-400" /> : <Copy className="w-4 h-4" />}
                                </button>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}

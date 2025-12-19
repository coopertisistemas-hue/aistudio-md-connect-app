import { useState, useEffect, useRef } from 'react';
import { Play, Pause, Square, Volume2 } from 'lucide-react';

interface DevotionalAudioPlayerProps {
    text: string;
    title?: string;
    variant?: 'sticky-bottom' | 'minimal';
}

export function DevotionalAudioPlayer({ text, title, variant = 'sticky-bottom' }: DevotionalAudioPlayerProps) {
    const [isSupported, setIsSupported] = useState(false);
    const [isPlaying, setIsPlaying] = useState(false);
    const [isPaused, setIsPaused] = useState(false);
    const [error, setError] = useState<string | null>(null);

    // Use refs for speech synthesis to avoid closure staleness issues
    const synthRef = useRef<SpeechSynthesis | null>(null);
    const utteranceRef = useRef<SpeechSynthesisUtterance | null>(null);

    useEffect(() => {
        if (typeof window !== 'undefined' && window.speechSynthesis) {
            synthRef.current = window.speechSynthesis;
            setIsSupported(true);
        } else {
            setError("Áudio não suportado");
        }

        // Cleanup on unmount
        return () => {
            if (synthRef.current) {
                synthRef.current.cancel();
            }
        };
    }, []);

    const handlePlay = () => {
        if (!synthRef.current || !text) return;

        // If paused, just resume
        if (isPaused) {
            synthRef.current.resume();
            setIsPaused(false);
            setIsPlaying(true);
            return;
        }

        // If already playing (shouldn't happen with UI logic, but safe guard), cancel
        if (synthRef.current.speaking) {
            synthRef.current.cancel();
        }

        const utterance = new SpeechSynthesisUtterance(text);
        utterance.lang = 'pt-BR';
        utterance.rate = 0.9; // Slower pace for devotional reading
        utterance.pitch = 1.0;

        // Smart Voice Selection
        const voices = synthRef.current.getVoices();

        // Priority list for natural sounding voices
        const ptVoices = voices.filter(v => v.lang.startsWith('pt-BR') || v.lang === 'pt_BR');

        // 1. Google Voices (usually high quality neural-like on Android/Chrome)
        let selectedVoice = ptVoices.find(v => v.name.includes('Google') && v.name.includes('Português'));

        // 2. Microsoft Voices (good on Windows) - "Francisca" is excellent, "Antonio" is good
        if (!selectedVoice) {
            selectedVoice = ptVoices.find(v => v.name.includes('Francisca') || v.name.includes('Antonio'));
        }

        // 3. Fallback to any Microsoft voice
        if (!selectedVoice) {
            selectedVoice = ptVoices.find(v => v.name.includes('Microsoft'));
        }

        // 4. Fallback to any PT-BR
        if (!selectedVoice) {
            selectedVoice = ptVoices[0];
        }

        if (selectedVoice) {
            utterance.voice = selectedVoice;
            // console.log("Selected Voice:", selectedVoice.name);
        }

        utterance.onstart = () => {
            setIsPlaying(true);
            setIsPaused(false);
        };

        utterance.onend = () => {
            setIsPlaying(false);
            setIsPaused(false);
        };

        utterance.onerror = (e) => {
            // "interrupted" or "canceled" are expected when we manually stop/pause
            if (e.error === 'interrupted' || e.error === 'canceled') {
                setIsPlaying(false);
                setIsPaused(false);
                return;
            }
            console.error("Speech Error:", e);
            setIsPlaying(false);
            setIsPaused(false);
        };

        utteranceRef.current = utterance;
        synthRef.current.speak(utterance);
    };

    const handlePause = () => {
        if (synthRef.current && isPlaying) {
            synthRef.current.pause();
            setIsPaused(true);
            setIsPlaying(false);
        }
    };

    const handleStop = () => {
        if (synthRef.current) {
            synthRef.current.cancel();
            setIsPlaying(false);
            setIsPaused(false);
        }
    };

    if (!isSupported) return null;

    if (variant === 'minimal') {
        return (
            <div className="flex items-center gap-2 animate-fade-in z-30">
                <button
                    onClick={isPlaying ? handlePause : handlePlay}
                    className={`
                        group flex items-center justify-center gap-2 px-4 py-2 rounded-full transition-all duration-300
                        ${isPlaying
                            ? 'bg-indigo-100 text-indigo-700 border border-indigo-200'
                            : 'bg-white/80 hover:bg-slate-50 text-slate-600 hover:text-indigo-600 border border-slate-200 hover:border-indigo-100'
                        } shadow-sm backdrop-blur-sm
                    `}
                >
                    {isPlaying ? (
                        <>
                            <div className="flex gap-0.5 items-end h-3 mr-1">
                                <span className="w-0.5 bg-current rounded-full animate-[music-bar_1s_ease-in-out_infinite]" style={{ animationDelay: '0ms' }} />
                                <span className="w-0.5 bg-current rounded-full animate-[music-bar_1s_ease-in-out_infinite]" style={{ animationDelay: '200ms' }} />
                                <span className="w-0.5 bg-current rounded-full animate-[music-bar_1s_ease-in-out_infinite]" style={{ animationDelay: '400ms' }} />
                            </div>
                            <span className="text-xs font-bold uppercase tracking-wider">Ouvindo</span>
                        </>
                    ) : (
                        <>
                            <div className="flex items-center justify-center w-6 h-6 rounded-full bg-slate-100 group-hover:bg-indigo-50 text-slate-400 group-hover:text-indigo-500 transition-colors">
                                <Volume2 className="w-3.5 h-3.5 ml-0.5" />
                            </div>
                            <span className="text-xs font-bold uppercase tracking-wider">Ouvir</span>
                        </>
                    )}
                </button>

                {(isPlaying || isPaused) && (
                    <button
                        onClick={handleStop}
                        className="p-2 rounded-full bg-white/80 hover:bg-red-50 text-slate-400 hover:text-red-500 border border-slate-200 hover:border-red-100 transition-all shadow-sm"
                        title="Parar"
                    >
                        <Square className="w-4 h-4 fill-current" />
                    </button>
                )}

                <style>{`
                    @keyframes music-bar {
                        0%, 100% { height: 4px; }
                        50% { height: 10px; }
                    }
                `}</style>
            </div>
        );
    }

    return (
        <div className="sticky bottom-6 z-40 w-full flex justify-center pointer-events-none animate-in slide-in-from-bottom-4 duration-500">
            <div className="pointer-events-auto bg-white/90 backdrop-blur-xl border border-white/50 shadow-xl shadow-indigo-900/10 rounded-full px-4 py-2 flex items-center gap-3 ring-1 ring-black/5 max-w-[90vw]">

                {/* Status Indicator / Icon */}
                <div className="relative flex items-center justify-center w-8 h-8 rounded-full bg-indigo-50 text-indigo-600">
                    {isPlaying ? (
                        <div className="flex gap-0.5 items-end h-3">
                            <span className="w-0.5 bg-current rounded-full animate-[music-bar_1s_ease-in-out_infinite]" style={{ animationDelay: '0ms' }} />
                            <span className="w-0.5 bg-current rounded-full animate-[music-bar_1s_ease-in-out_infinite]" style={{ animationDelay: '200ms' }} />
                            <span className="w-0.5 bg-current rounded-full animate-[music-bar_1s_ease-in-out_infinite]" style={{ animationDelay: '400ms' }} />
                        </div>
                    ) : (
                        <Volume2 className="w-4 h-4" />
                    )}
                </div>

                <div className="flex flex-col mr-2">
                    <span className="text-xs font-bold text-slate-800 leading-none">
                        Ouvir Devocional
                    </span>
                    <span className="text-[10px] font-medium text-slate-500 leading-none mt-0.5">
                        {isPlaying ? 'Reproduzindo...' : isPaused ? 'Pausado' : 'Toque para ouvir'}
                    </span>
                </div>

                {/* Controls */}
                <div className="flex items-center gap-1 pl-2 border-l border-slate-200">
                    {!isPlaying ? (
                        <button
                            onClick={handlePlay}
                            className="p-2 rounded-full hover:bg-slate-100 text-slate-700 hover:text-indigo-600 transition-colors"
                            aria-label="Play"
                        >
                            <Play className="w-5 h-5 fill-current" />
                        </button>
                    ) : (
                        <button
                            onClick={handlePause}
                            className="p-2 rounded-full hover:bg-slate-100 text-slate-700 hover:text-indigo-600 transition-colors"
                            aria-label="Pause"
                        >
                            <Pause className="w-5 h-5 fill-current" />
                        </button>
                    )}

                    {(isPlaying || isPaused) && (
                        <button
                            onClick={handleStop}
                            className="p-2 rounded-full hover:bg-red-50 text-slate-400 hover:text-red-500 transition-colors"
                            aria-label="Stop"
                        >
                            <Square className="w-4 h-4 fill-current" />
                        </button>
                    )}
                </div>
            </div>

            <style>{`
                @keyframes music-bar {
                    0%, 100% { height: 4px; }
                    50% { height: 12px; }
                }
            `}</style>
        </div>
    );
}


import { Play, Pause, X } from 'lucide-react';
import { cn } from '@/lib/utils';

interface BibleAudioPlayerProps {
    isPlaying: boolean;
    isPaused: boolean;
    onToggle: () => void;
    onStop: () => void;
    bookName: string;
    chapter: number;
    className?: string;
}

export function BibleAudioPlayer({
    isPlaying,
    isPaused,
    onToggle,
    onStop,
    bookName,
    chapter,
    className
}: BibleAudioPlayerProps) {
    if (!isPlaying && !isPaused) return null;

    return (
        <div className={cn(
            "fixed bottom-6 left-0 right-0 z-40 flex justify-center pointer-events-none animate-in slide-in-from-bottom-6 fade-in duration-500",
            className
        )}>
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
                        <div className="w-1.5 h-1.5 rounded-full bg-indigo-400" />
                    )}
                </div>

                <div className="flex flex-col mr-2">
                    <span className="text-xs font-bold text-slate-800 leading-none">
                        {bookName} {chapter}
                    </span>
                    <span className="text-[10px] font-medium text-slate-500 leading-none mt-0.5">
                        {isPlaying ? 'Reproduzindo...' : 'Pausado'}
                    </span>
                </div>

                {/* Controls */}
                <div className="flex items-center gap-1 pl-2 border-l border-slate-200">
                    <button
                        onClick={onToggle}
                        className="p-2 rounded-full hover:bg-slate-100 text-slate-700 hover:text-indigo-600 transition-colors"
                        aria-label={isPlaying ? "Pausar" : "Reproduzir"}
                    >
                        {isPlaying ? <Pause className="w-5 h-5 fill-current" /> : <Play className="w-5 h-5 fill-current" />}
                    </button>

                    <button
                        onClick={onStop}
                        className="p-2 rounded-full hover:bg-red-50 text-slate-400 hover:text-red-500 transition-colors"
                        aria-label="Parar"
                    >
                        <X className="w-4 h-4" />
                    </button>
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

// Add these keyframes to your global CSS or tailwind config for the music bars if not present
// For now, relying on standard animations or just static if unavailable, but here's the style logic assumption


import { Play, Pause, Square, X } from 'lucide-react';
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
            "fixed bottom-20 right-4 z-40 flex items-center gap-3 bg-slate-900/95 backdrop-blur-md rounded-full pl-4 pr-2 py-2 shadow-2xl shadow-indigo-900/20 border border-white/10 animate-in slide-in-from-bottom-10 fade-in duration-300",
            className
        )}>
            {/* Equalizer Animation (Fake) */}
            <div className="flex items-center gap-0.5 h-4">
                <div className={cn("w-1 bg-indigo-400 rounded-full animate-music-bar-1", isPaused && "animation-paused h-1.5")} />
                <div className={cn("w-1 bg-indigo-400 rounded-full animate-music-bar-2", isPaused && "animation-paused h-3")} />
                <div className={cn("w-1 bg-indigo-400 rounded-full animate-music-bar-3", isPaused && "animation-paused h-2")} />
            </div>

            <div className="flex flex-col mr-2">
                <span className="text-[10px] text-indigo-300 font-bold uppercase tracking-wider leading-none">Ouvindo</span>
                <span className="text-xs font-medium text-white leading-tight mt-0.5">{bookName} {chapter}</span>
            </div>

            <button
                onClick={onToggle}
                className="w-10 h-10 rounded-full bg-indigo-600 hover:bg-indigo-500 flex items-center justify-center text-white transition-all active:scale-95 shadow-lg shadow-indigo-600/30"
            >
                {isPlaying ? <Pause className="w-5 h-5 fill-current" /> : <Play className="w-5 h-5 fill-current ml-0.5" />}
            </button>

            <button
                onClick={onStop}
                className="w-8 h-8 rounded-full bg-slate-800 hover:bg-slate-700 flex items-center justify-center text-slate-400 transition-all hover:text-white"
            >
                <X className="w-4 h-4" />
            </button>
        </div>
    );
}

// Add these keyframes to your global CSS or tailwind config for the music bars if not present
// For now, relying on standard animations or just static if unavailable, but here's the style logic assumption

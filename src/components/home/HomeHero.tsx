import { useState } from 'react';
import { Play, Pause } from 'lucide-react';
// import { useNavigate } from 'react-router-dom';
// import { useAuth } from '@/contexts/AuthContext';

interface HomeHeroProps {
    church?: any;
    verse?: {
        text: string;
        reference: string;
        lang: string;
    } | null;
}

export function HomeHero({ church, verse }: HomeHeroProps) {
    // const navigate = useNavigate();
    // const { user } = useAuth();
    const [isPlaying, setIsPlaying] = useState(false);

    const handleSpeak = () => {
        if (!verse) return;

        if (isPlaying) {
            window.speechSynthesis.cancel();
            setIsPlaying(false);
            return;
        }

        const utterance = new SpeechSynthesisUtterance(`${verse.text}. ${verse.reference}`);
        utterance.lang = verse.lang || 'pt-BR';
        utterance.rate = 0.9;

        utterance.onend = () => setIsPlaying(false);

        window.speechSynthesis.speak(utterance);
        setIsPlaying(true);
    };

    return (
        <section className="relative overflow-hidden bg-slate-900 pb-8 pt-4 rounded-b-[2.5rem] shadow-2xl z-10">
            {/* Ambient Background */}
            <div className="absolute inset-0 bg-slate-900">
                <div className="absolute top-[-50%] left-[-20%] w-[140%] h-[140%] rounded-full bg-gradient-to-b from-blue-600/20 via-purple-900/20 to-transparent blur-3xl opacity-70" />
                <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20 brightness-100 contrast-150 mix-blend-overlay"></div>
            </div>

            <div className="relative px-6 flex flex-col items-center text-center">
                {/* Brand / Header */}
                <div className="mb-6 flex flex-col items-center animate-fade-in">
                    <h1 className="text-lg font-bold text-white tracking-tight flex items-center gap-2">
                        {church?.logo_url && (
                            <img src={church.logo_url} alt="Logo" className="w-5 h-5 object-contain" />
                        )}
                        {church?.name || 'MD Connect'}
                    </h1>
                    <p className="text-[10px] text-slate-400 font-medium tracking-widest uppercase mt-0.5">
                        Tecnologia a serviço do Reino
                    </p>
                </div>

                {/* Glass Card with Verse (Only if verse exists) */}
                {verse && (
                    <div className="w-full max-w-sm bg-white/5 backdrop-blur-xl border border-white/10 rounded-3xl p-5 shadow-2xl relative overflow-hidden group">
                        {/* Gloss effect */}
                        <div className="absolute inset-0 bg-gradient-to-tr from-white/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-700 pointer-events-none" />

                        <div className="mb-5 text-left animate-in slide-in-from-bottom-2 duration-700">
                            <div className="flex items-start gap-3">
                                <div className="flex-1">
                                    <p className="text-sm text-slate-200 font-serif italic leading-relaxed mb-2 opacity-90 line-clamp-3">
                                        "{verse.text}"
                                    </p>
                                    <div className="flex items-center gap-2">
                                        <div className="h-[1px] w-4 bg-blue-500/50"></div>
                                        <span className="text-xs font-bold text-blue-300 tracking-wide">{verse.reference}</span>
                                    </div>
                                </div>
                                <button
                                    onClick={handleSpeak}
                                    className="shrink-0 w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center text-white transition-all active:scale-90"
                                    title="Ouvir versículo"
                                >
                                    {isPlaying ? (
                                        <Pause className="w-3.5 h-3.5 fill-current" />
                                    ) : (
                                        <Play className="w-3.5 h-3.5 fill-current ml-0.5" />
                                    )}
                                </button>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </section>
    );
}

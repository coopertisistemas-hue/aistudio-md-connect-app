import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Bell, ChevronRight, Megaphone } from 'lucide-react';

interface Notice {
    id: string;
    title: string;
    description: string;
    created_at: string;
}

interface NoticesTickerProps {
    notices: Notice[];
}

export function NoticesTicker({ notices }: NoticesTickerProps) {
    const navigate = useNavigate();
    const [currentIndex, setCurrentIndex] = useState(0);
    const [isAnimating, setIsAnimating] = useState(false);

    useEffect(() => {
        if (!notices || notices.length <= 1) return;

        const interval = setInterval(() => {
            setIsAnimating(true);
            setTimeout(() => {
                setCurrentIndex((prev) => (prev + 1) % notices.length);
                setIsAnimating(false);
            }, 500); // Wait for fade out
        }, 5000); // 5 seconds per item

        return () => clearInterval(interval);
    }, [notices]);

    if (!notices || notices.length === 0) return null;

    const currentNotice = notices[currentIndex];

    return (
        <div className="px-5 mb-8">
            <div className="flex items-center justify-between mb-3 px-1">
                <h2 className="text-sm font-bold text-white tracking-tight flex items-center gap-2">
                    <Megaphone className="w-4 h-4 text-amber-400" />
                    Mural & Novidades
                </h2>
                <button
                    onClick={() => navigate('/notices')}
                    className="text-[10px] text-white/50 font-medium uppercase tracking-wide flex items-center gap-1 hover:text-white transition-colors"
                >
                    Ver tudo <ChevronRight className="w-3 h-3" />
                </button>
            </div>

            <div
                onClick={() => navigate(`/notices/${currentNotice.id}`)}
                className="bg-white/5 backdrop-blur-md border border-white/10 rounded-2xl p-1 pr-4 flex items-center gap-3 cursor-pointer active:scale-[0.99] transition-transform overflow-hidden relative"
            >
                {/* Icon Box */}
                <div className="w-10 h-10 rounded-xl bg-amber-500/20 flex items-center justify-center shrink-0 border border-amber-500/20 text-amber-400 shadow-inner">
                    <Bell className="w-5 h-5" />
                </div>

                {/* Content Ticker */}
                <div className={`flex-1 min-w-0 flex flex-col justify-center transition-opacity duration-500 ${isAnimating ? 'opacity-0' : 'opacity-100'}`}>
                    <div className="flex items-center gap-2">
                        <span className="text-[9px] bg-white/10 text-white/70 px-1.5 rounded uppercase font-bold tracking-wider">
                            Aviso
                        </span>
                        <span className="text-[10px] text-white/40">
                            {new Date(currentNotice.created_at).toLocaleDateString('pt-BR')}
                        </span>
                    </div>
                    <p className="text-xs font-bold text-white leading-tight truncate mt-0.5">
                        {currentNotice.title}
                    </p>
                </div>

                {/* Arrow */}
                <ChevronRight className="w-4 h-4 text-white/20 shrink-0" />

                {/* Progress/Timeline Indicator if multiple */}
                {notices.length > 1 && (
                    <div className="absolute bottom-0 left-0 h-[2px] bg-amber-500/50 transition-all duration-[5000ms] ease-linear w-full origin-left"
                        key={currentIndex} // Reset animation on index change
                        style={{
                            width: '100%',
                            animation: `progress 5s linear infinite`,
                        }}
                    />
                )}
            </div>
            <style>{`
                @keyframes progress {
                    from { transform: scaleX(0); }
                    to { transform: scaleX(1); }
                }
            `}</style>
        </div>
    );
}

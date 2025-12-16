import { useNavigate } from 'react-router-dom';
import { Bell, ChevronRight, Megaphone } from 'lucide-react';
import { APP_ROUTES } from '@/lib/routes';
import { analytics } from '@/lib/analytics';

interface Notice {
    id: string;
    title: string;
    description: string;
    created_at: string;
}

interface MuralCompactProps {
    notices: Notice[];
}

export function MuralCompact({ notices }: MuralCompactProps) {
    const navigate = useNavigate();

    // Empty State Check (redundant if parent checks, but good practice)
    if (!notices || notices.length === 0) return null;

    return (
        <div className="px-5 mb-8">
            <div className="flex items-center justify-between mb-3 px-1">
                <h2 className="text-sm font-semibold text-slate-900 tracking-tight flex items-center gap-2">
                    <Megaphone className="w-4 h-4 text-amber-500" />
                    Mural & Novidades
                </h2>
                <button
                    onClick={() => {
                        analytics.track({
                            name: 'content_open',
                            element: 'mural_view_all',
                            context: 'member',
                            route_to: APP_ROUTES.MURAL
                        });
                        navigate(APP_ROUTES.MURAL);
                    }}
                    className="text-[10px] text-slate-700 font-bold uppercase tracking-wide flex items-center gap-1 hover:text-slate-900 transition-colors"
                >
                    Ver tudo <ChevronRight className="w-3 h-3" />
                </button>
            </div>

            <div
                className="bg-white/80 backdrop-blur-xl border border-white/60 rounded-full h-[48px] flex items-center gap-3 overflow-hidden relative shadow-sm"
            >
                {/* Fixed Icon Area - Light */}
                <div className="pl-1 z-10 bg-gradient-to-r from-slate-50 via-slate-50 to-transparent pr-4 h-full flex items-center">
                    <div className="w-8 h-8 rounded-full bg-amber-100 flex items-center justify-center shrink-0 border border-amber-200 text-amber-600 shadow-sm">
                        <Bell className="w-4 h-4" />
                    </div>
                </div>

                {/* Marquee Content */}
                <div className="flex-1 overflow-hidden relative h-full flex items-center mask-linear-fade">
                    <div className="whitespace-nowrap flex items-center animate-marquee">
                        {notices.map((notice) => (
                            <span
                                key={notice.id}
                                onClick={() => {
                                    analytics.track({
                                        name: 'content_open',
                                        element: 'mural_ticker_item',
                                        context: 'member',
                                        content_id: notice.id
                                    });
                                    navigate(`${APP_ROUTES.MURAL}/${notice.id}`);
                                }}
                                className="inline-flex items-center gap-4 text-xs font-bold text-slate-700 mr-8 cursor-pointer hover:text-amber-700 transition-colors"
                            >
                                {notice.title}
                                <span className="w-1.5 h-1.5 rounded-full bg-slate-300" />
                            </span>
                        ))}
                        {/* Duplicate for seamless loop */}
                        {notices.map((notice) => (
                            <span
                                key={`dup-${notice.id}`}
                                onClick={() => navigate(`${APP_ROUTES.MURAL}/${notice.id}`)}
                                className="inline-flex items-center gap-4 text-xs font-bold text-slate-700 mr-8 cursor-pointer hover:text-amber-700 transition-colors"
                            >
                                {notice.title}
                                <span className="w-1.5 h-1.5 rounded-full bg-slate-300" />
                            </span>
                        ))}
                    </div>
                </div>

                {/* Right Fade/Arrow */}
                <div className="absolute right-0 top-0 bottom-0 w-12 bg-gradient-to-l from-white/90 to-transparent z-10 pointer-events-none flex items-center justify-end pr-3">
                    <ChevronRight className="w-4 h-4 text-slate-400" />
                </div>
            </div>

            <style>{`
                @keyframes marquee {
                    0% { transform: translateX(0); }
                    100% { transform: translateX(-50%); }
                }
                .animate-marquee {
                    animation: marquee 20s linear infinite;
                }
                .animate-marquee:hover {
                    animation-play-state: paused;
                }
                .mask-linear-fade {
                    mask-image: linear-gradient(to right, transparent, black 10px, black 90%, transparent);
                }
            `}</style>
        </div>
    );
}

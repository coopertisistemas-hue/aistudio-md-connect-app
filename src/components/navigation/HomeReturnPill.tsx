import { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Home, X } from 'lucide-react';
import { FLAGS } from '@/lib/flags';

export function HomeReturnPill() {
    const navigate = useNavigate();
    const location = useLocation();
    const [isVisible, setIsVisible] = useState(false);

    useEffect(() => {
        if (!FLAGS.FEATURE_HOME_RETURN_PILL) return;

        // 1. Exclude specific routes (Home, Donate, Monetization)
        const excludedRoutes = ['/', '/doe', '/seja-parceiro', '/partners', '/home', '/login'];
        if (excludedRoutes.some(r => location.pathname === r || location.pathname.startsWith(r + '/'))) {
            setIsVisible(false);
            return;
        }

        // 2. Check if dismissed this session
        const dismissed = sessionStorage.getItem('md_pill_dismissed');
        if (dismissed) return;

        // 3. Check if user has visited home this session
        // (Set by LandingPage)
        const visitedHome = sessionStorage.getItem('has_visited_home');
        if (visitedHome) return;

        // If none of the above, user likely deep-linked
        // Show after a small delay to not jar
        const timer = setTimeout(() => setIsVisible(true), 1000);
        return () => clearTimeout(timer);

    }, [location.pathname]);

    const handleDismiss = (e: React.MouseEvent) => {
        e.stopPropagation();
        setIsVisible(false);
        sessionStorage.setItem('md_pill_dismissed', 'true');
    };

    const goHome = () => {
        navigate('/');
    };

    if (!isVisible) return null;

    return (
        <div className="fixed bottom-24 left-1/2 -translate-x-1/2 z-50 animate-in slide-in-from-bottom-4 fade-in duration-500 w-full max-w-sm px-4 pointer-events-none">
            <div
                onClick={goHome}
                className="bg-slate-900/90 backdrop-blur-md text-white p-1 pr-3 rounded-full shadow-xl shadow-slate-900/20 flex items-center gap-3 cursor-pointer pointer-events-auto hover:bg-slate-800 transition-colors border border-white/10"
            >
                <div className="w-8 h-8 rounded-full bg-indigo-500 flex items-center justify-center shrink-0">
                    <Home className="w-4 h-4 text-white" />
                </div>

                <div className="flex-1 min-w-0 flex flex-col justify-center">
                    <p className="text-[10px] text-slate-300 font-medium uppercase tracking-wide">Voltar para Home</p>
                    <p className="text-xs font-bold truncate">Ver novidades e atalhos</p>
                </div>

                <button
                    onClick={handleDismiss}
                    className="p-1.5 hover:bg-white/10 rounded-full transition-colors shrink-0"
                >
                    <X className="w-3.5 h-3.5 text-slate-400" />
                </button>
            </div>
        </div>
    );
}

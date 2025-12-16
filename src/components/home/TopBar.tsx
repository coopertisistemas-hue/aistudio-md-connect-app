import { useNavigate } from 'react-router-dom';
import { User, LogIn, Sparkles, ZapOff } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { useState, useEffect } from 'react';

interface TopBarProps {
    church?: any;
}

export function TopBar({ church }: TopBarProps) {
    const navigate = useNavigate();
    const { user } = useAuth();
    const [reducedMotion, setReducedMotion] = useState(false);

    // Initialize state from local storage
    useEffect(() => {
        const stored = localStorage.getItem('md_reduce_motion') === 'true';
        setReducedMotion(stored);
    }, []);

    const toggleMotion = () => {
        const newValue = !reducedMotion;
        setReducedMotion(newValue);
        localStorage.setItem('md_reduce_motion', String(newValue));
        // Dispatch event for AppBackground to pick up
        window.dispatchEvent(new Event('md-toggle-motion'));
    };

    // Helper to get avatar URL safely from Supabase user metadata
    const avatarUrl = user?.user_metadata?.avatar_url || user?.user_metadata?.photo_url;

    return (
        <header className="sticky top-0 z-20 py-4 px-5 flex items-center justify-between bg-white/70 backdrop-blur-xl border-b border-white/40 shadow-sm transition-all duration-300">
            {/* Branding */}
            <div className="flex items-center gap-3">
                <div className="h-12 w-12 rounded-full overflow-hidden border border-blue-100 shadow-sm relative group bg-white">
                    <img src="/custom-logo.jpg" alt={church?.name || 'MD Connect'} className="w-full h-full object-cover" />
                </div>
                <div className="flex flex-col">
                    <h1 className="text-lg font-extrabold text-[#4F46E5] leading-tight tracking-tight">
                        {church?.name || 'MD Connect'}
                    </h1>
                    <p className="text-[10px] text-[#4F46E5]/80 font-bold uppercase tracking-wider">
                        Tecnologia a serviço do Reino
                    </p>
                </div>
            </div>

            {/* Actions */}
            <div className="flex items-center gap-2">
                {/* Motion Toggle (Accessibility) */}
                <button
                    onClick={toggleMotion}
                    title={reducedMotion ? "Ativar Animações" : "Reduzir Animações"}
                    className="w-8 h-8 rounded-full bg-slate-100 hover:bg-slate-200 flex items-center justify-center text-slate-400 transition-colors border border-slate-200"
                >
                    {reducedMotion ? (
                        <ZapOff className="w-4 h-4 text-slate-400" strokeWidth={1.5} />
                    ) : (
                        <Sparkles className="w-4 h-4 text-amber-400" strokeWidth={1.5} />
                    )}
                </button>

                {user ? (
                    <button
                        onClick={() => navigate('/profile')}
                        className="w-10 h-10 rounded-full bg-white/50 hover:bg-white/80 border border-white/60 flex items-center justify-center text-[#4F46E5] shadow-sm transition-all active:scale-95 overflow-hidden"
                    >
                        {avatarUrl ? (
                            <img src={avatarUrl} alt="Profile" className="w-full h-full object-cover" />
                        ) : (
                            <User className="w-5 h-5" />
                        )}
                    </button>
                ) : (
                    <button
                        onClick={() => navigate('/login')}
                        className="w-10 h-10 rounded-full bg-white/50 hover:bg-white/80 border border-white/60 flex items-center justify-center text-[#4F46E5] shadow-sm transition-all active:scale-95"
                    >
                        <LogIn className="w-5 h-5 ml-0.5" />
                    </button>
                )}
            </div>
        </header>
    );
}

import { useNavigate } from 'react-router-dom';
import { User, ChevronRight } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';

interface HeroCompactProps {
    church?: any;
}

export function HeroCompact({ church }: HeroCompactProps) {
    const navigate = useNavigate();
    const { user } = useAuth();

    return (
        <section className="px-6 pt-4 pb-6 flex flex-col items-center text-center relative z-10">
            {/* Subtle Gradient Glow behind text */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-40 h-20 bg-blue-500/20 blur-[60px] rounded-full pointer-events-none" />

            {/* Brand */}
            <h1 className="text-2xl font-bold text-white tracking-tight leading-none mb-1">
                {church?.name || 'MD Connect'}
            </h1>
            <p className="text-slate-400 text-[10px] font-medium tracking-[0.2em] uppercase opacity-80">
                Tecnologia a serviço do Reino
            </p>

            {/* Optional Micro-phrase */}
            <p className="text-slate-300/60 text-xs font-serif italic mt-3 max-w-[200px] leading-relaxed">
                "Conectando vidas, edificando a fé."
            </p>

            {/* Discreet Action - Only if logged in */}
            {user ? (
                <button
                    onClick={() => navigate('/profile')}
                    className="mt-4 flex items-center gap-1.5 text-[10px] font-bold text-blue-300 hover:text-blue-200 uppercase tracking-wider transition-colors py-1 px-3 rounded-full bg-white/5 border border-white/5"
                >
                    <User className="w-3 h-3" />
                    Minha Área
                </button>
            ) : (
                <button
                    onClick={() => navigate('/login')}
                    className="mt-4 flex items-center gap-1.5 text-[10px] font-bold text-slate-300 hover:text-white uppercase tracking-wider transition-colors"
                >
                    Acessar Conta <ChevronRight className="w-3 h-3" />
                </button>
            )}
        </section>
    );
}

import { useNavigate } from 'react-router-dom';
import { Book, MessageCircleHeart, Sun } from 'lucide-react';
import { cn } from '@/lib/utils';
import { APP_ROUTES } from '@/lib/routes';

interface HeroCardProps {
    title: string;
    subtitle: string;
    icon: React.ElementType;
    onClick: () => void;
    color: string;
    gradient: string;
    delay?: number;
}

function HeroCard({ title, subtitle, icon: Icon, onClick, color, gradient, delay = 0 }: HeroCardProps) {
    return (
        <button
            onClick={onClick}
            className={cn(
                "relative w-full text-left overflow-hidden rounded-3xl p-5 shadow-sm border border-white/60 transition-all duration-300 active:scale-[0.98] group",
                "bg-white/80 backdrop-blur-xl hover:shadow-md hover:border-white/80"
            )}
            style={{ animationDelay: `${delay}ms` }}
        >
            {/* Background Gradient Blob */}
            <div className={cn("absolute -right-4 -top-4 w-24 h-24 rounded-full opacity-10 blur-2xl transition-all group-hover:scale-110", gradient)} />
            
            <div className="relative z-10 flex items-start gap-4">
                <div className={cn("p-3 rounded-2xl shadow-sm ring-1 ring-black/5 shrink-0 transition-transform group-hover:scale-105", gradient, "bg-opacity-10")}>
                    <Icon className={cn("w-6 h-6", color)} />
                </div>
                <div className="flex-1 min-w-0 pt-0.5">
                    <h3 className="font-bold text-slate-900 text-lg leading-tight mb-1 group-hover:text-indigo-950 transition-colors">{title}</h3>
                    <p className="text-sm text-slate-500 font-medium leading-tight">{subtitle}</p>
                </div>
            </div>
        </button>
    );
}

export function HeroSection() {
    const navigate = useNavigate();

    return (
        <div className="px-5 pt-2 pb-6 flex flex-col gap-3">
             <HeroCard 
                title="Bíblia Sagrada" 
                subtitle="Leitura e planos" 
                icon={Book} 
                onClick={() => navigate(APP_ROUTES.BIBLE)}
                color="text-indigo-600"
                gradient="bg-indigo-500"
                delay={0}
             />
             <div className="grid grid-cols-2 gap-3">
                 <HeroCard 
                    title="Devocional" 
                    subtitle="Palavra do dia" 
                    icon={Sun} 
                    onClick={() => navigate('/devocionais/today')} // Assuming direct link to today/list
                    color="text-amber-500"
                    gradient="bg-amber-500"
                    delay={100}
                 />
                 <HeroCard 
                    title="Oração" 
                    subtitle="Faça um pedido" 
                    icon={MessageCircleHeart} 
                    onClick={() => navigate(APP_ROUTES.PRAYER)}
                    color="text-rose-500"
                    gradient="bg-rose-500"
                    delay={200}
                 />
             </div>
        </div>
    );
}

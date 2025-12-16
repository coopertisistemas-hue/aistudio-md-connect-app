import { Link, useLocation } from 'react-router-dom';
import { useChurch } from '@/contexts/ChurchContext';
import { Home, Calendar, BookOpen, MessageCircleHeart, User } from 'lucide-react';
import { cn } from '@/lib/utils';

export function BottomNav() {
    const location = useLocation();

    const { church } = useChurch();

    if (!church) return null;

    const navItems = [
        { label: 'Início', icon: Home, path: `/c/${church.slug}` },
        { label: 'Agenda', icon: Calendar, path: `/c/${church.slug}/agenda` },
        { label: 'Conteúdos', icon: BookOpen, path: `/c/${church.slug}/conteudos` },
        { label: 'Pedidos', icon: MessageCircleHeart, path: `/c/${church.slug}/pedidos` },
        { label: 'Perfil', icon: User, path: `/c/${church.slug}/profile` },
    ];

    return (
        <nav className="fixed bottom-0 w-full bg-white border-t border-slate-200 pb-safe z-50">
            <div className="flex justify-around items-center h-16">
                {navItems.map((item) => {
                    // Check active state more loosely or exactly
                    const isActive = location.pathname === item.path || location.pathname.startsWith(item.path + '/');
                    // Special case for Home to avoid matching everything
                    const isHome = item.path.endsWith(church.slug);
                    const isReallyActive = isHome ? location.pathname === item.path : isActive;

                    return (
                        <Link
                            key={item.path}
                            to={item.path}
                            className={cn(
                                "flex flex-col items-center justify-center w-full h-full space-y-1 transition-colors",
                                isReallyActive ? "text-primary" : "text-slate-400 hover:text-slate-600"
                            )}
                        >
                            <item.icon className={cn("h-6 w-6", isReallyActive && "fill-current/20")} />
                            <span className="text-[10px] font-medium">{item.label}</span>
                        </Link>
                    );
                })}
            </div>
        </nav>
    );
}

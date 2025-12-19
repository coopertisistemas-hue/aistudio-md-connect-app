import { MessageCircleHeart, Calendar, ChevronRight, Book, Users, LayoutGrid, Music, FileText, Youtube, Sparkles, BookOpen, Megaphone, Share2, Lightbulb, UserPlus, Mic2, Music4, HeartHandshake, Handshake, ShoppingBag, Database, Home, TrendingUp } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { APP_ROUTES, EXTERNAL_LINKS } from '@/lib/routes';
import { analytics } from '@/lib/analytics';
import { SectionHeader } from '@/components/ui/SectionHeader';
import { FLAGS } from '@/lib/flags';

interface QuickActionItem {
    id?: string;
    label: string;
    enabled?: boolean;
    // ... allow other props
}

interface QuickActionsProps {
    actions?: QuickActionItem[];
}

export function QuickActions({ actions: _externalActions }: QuickActionsProps = {}) {
    const navigate = useNavigate();

    const trackAction = (label: string, destination: string) => {
        analytics.track({
            name: 'nav_click',
            element: `quickaction_${label.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "")}`,
            context: 'member',
            route_to: destination
        });
    };

    if (!FLAGS.FEATURE_HOME_QUICK_ACTIONS) return null;

    // Category Data Structure
    const categories = [
        {
            id: 'palavra',
            title: 'Palavra',
            categoryIcon: Book,
            categoryIconColor: 'text-blue-500',
            items: [
                { label: 'Estudo Bíblico', icon: FileText, route: APP_ROUTES.STUDIES, color: 'text-blue-600', bg: 'bg-blue-50' },
                { label: 'Versículo do Dia', icon: Sparkles, route: APP_ROUTES.VERSE_POSTER, color: 'text-amber-600', bg: 'bg-amber-50' },
                { label: 'Plano de Leitura', icon: Book, route: '/plans', color: 'text-indigo-600', bg: 'bg-indigo-50', comingSoon: true },
            ]
        },
        {
            id: 'crescimento',
            title: 'Crescimento',
            categoryIcon: TrendingUp,
            categoryIconColor: 'text-emerald-500',
            items: [
                { label: 'Discipulado', icon: Users, route: '/discipleship', color: 'text-emerald-600', bg: 'bg-emerald-50', comingSoon: true },
                { label: 'Grupo Célula', icon: Home, route: '/cells', color: 'text-orange-600', bg: 'bg-orange-50', comingSoon: true },
            ]
        },
        {
            id: 'comunidade',
            title: 'Comunidade',
            categoryIcon: Users,
            categoryIconColor: 'text-pink-500',
            items: [
                { label: 'Mural', icon: Megaphone, route: APP_ROUTES.MURAL, color: 'text-pink-600', bg: 'bg-pink-50' }, // Shortened from "Mural & Novidade"
                { label: 'Testemunhos', icon: MessageCircleHeart, route: '/testimonies', color: 'text-cyan-600', bg: 'bg-cyan-50', comingSoon: true },
                { label: 'Convidar', icon: Share2, route: '/invite', color: 'text-purple-600', bg: 'bg-purple-50', comingSoon: true }, // Shortened
                { label: 'Ideias', icon: Lightbulb, route: '/feedback', color: 'text-yellow-600', bg: 'bg-yellow-50', comingSoon: true }, // Shortened
            ]
        },
        {
            id: 'igreja',
            title: 'Igreja',
            categoryIcon: Home,
            categoryIconColor: 'text-purple-500',
            items: [
                { label: 'Eventos', icon: Calendar, route: APP_ROUTES.AGENDA, color: 'text-red-500', bg: 'bg-red-50' },
                { label: 'Visitas', icon: UserPlus, route: '/visits', color: 'text-teal-600', bg: 'bg-teal-50', comingSoon: true },
            ]
        },
        {
            id: 'louvor',
            title: 'Louvor',
            categoryIcon: Music,
            categoryIconColor: 'text-red-500',
            items: [
                { label: 'Louvores', icon: Youtube, route: '/worship', color: 'text-red-600', bg: 'bg-red-50', comingSoon: true },
                { label: 'Harpa', icon: Music, route: '/harpa', color: 'text-blue-600', bg: 'bg-blue-50', comingSoon: true },
                { label: 'Letras', icon: Mic2, route: '/letras', color: 'text-slate-600', bg: 'bg-slate-50', comingSoon: true },
                { label: 'Playbacks', icon: Music4, route: '/playbacks', color: 'text-purple-600', bg: 'bg-purple-50', comingSoon: true },
            ]
        },
        {
            id: 'apoio',
            title: 'Apoio',
            categoryIcon: HeartHandshake,
            categoryIconColor: 'text-rose-500',
            items: [
                { label: 'DOE', icon: HeartHandshake, route: APP_ROUTES.DONATE, color: 'text-rose-600', bg: 'bg-rose-50' },
                { label: 'Parceiro', icon: Handshake, route: '/parceiros', color: 'text-slate-700', bg: 'bg-slate-100', comingSoon: true },
                { label: 'Store', icon: ShoppingBag, route: '/store', color: 'text-indigo-600', bg: 'bg-indigo-50', comingSoon: true }, // "eCommerce"
                { label: 'ERP', icon: Database, route: '/erp', color: 'text-blue-800', bg: 'bg-blue-100', comingSoon: true }, // "MD Connect"
            ]
        }
    ];

    return (
        <div className="mb-8 px-5">
            <SectionHeader
                title="Acesso Rápido"
                subtitle="Atalhos para o dia a dia"
                icon={LayoutGrid}
                iconColor="text-blue-500"
            />

            {/* Primary Actions - Premium Highlights */}
            <div className="flex flex-col gap-3 mb-8">
                <div className="grid grid-cols-2 gap-3">
                    <ProminentFeatureCard
                        title="Bíblia"
                        subtitle="Sagrada"
                        icon={Book}
                        gradient="from-slate-800 to-slate-950" // Darker, more premium
                        iconBg="bg-white/10"
                        variant="vertical"
                        onClick={() => {
                            trackAction('biblia', APP_ROUTES.BIBLE);
                            navigate(APP_ROUTES.BIBLE);
                        }}
                    />

                    <ProminentFeatureCard
                        title="Devocional"
                        subtitle="Diário"
                        icon={BookOpen}
                        gradient="from-emerald-600 to-teal-700"
                        iconBg="bg-white/10"
                        variant="vertical"
                        onClick={() => {
                            trackAction('devocional', '/devocionais/today');
                            navigate('/devocionais/today');
                        }}
                    />
                </div>

                <ProminentFeatureCard
                    title="Pedido de Oração"
                    subtitle="Fale com os pastores"
                    icon={MessageCircleHeart}
                    gradient="from-blue-600 to-indigo-700"
                    iconBg="bg-white/20"
                    onClick={() => {
                        analytics.track({
                            name: 'feature_usage',
                            element: 'quickaction_prayer_cta',
                            context: 'member',
                            route_to: APP_ROUTES.PRAYER
                        });
                        navigate(APP_ROUTES.PRAYER);
                    }}
                />
            </div>

            {/* Categorized Menu - 2 Columns */}
            <div className="grid grid-cols-2 gap-x-4 gap-y-8">
                {categories.map((category) => (
                    <div key={category.id} className="flex flex-col h-full">
                        {/* Premium Header Style */}
                        <h2 className="text-sm font-semibold text-slate-900 tracking-tight flex items-center gap-2 mb-4">
                            <category.categoryIcon className={`w-4 h-4 ${category.categoryIconColor}`} />
                            {category.title}
                        </h2>

                        {/* 2-column grid for buttons */}
                        <div className="grid grid-cols-2 gap-2">
                            {category.items.map((item, idx) => (
                                <CategoryItem
                                    key={idx}
                                    icon={item.icon}
                                    label={item.label}
                                    color={item.color}
                                    bg={item.bg}
                                    comingSoon={item.comingSoon}
                                    onClick={() => {
                                        if (item.comingSoon) {
                                            const { toast } = require('sonner'); // Lazy load toast
                                            toast.info("Em breve", {
                                                description: "Esta funcionalidade estará disponível em breve."
                                            });
                                            return;
                                        }
                                        trackAction(item.label.toLowerCase(), item.route);
                                        navigate(item.route);
                                    }}
                                />
                            ))}
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}

function ProminentFeatureCard({ title, subtitle, icon: Icon, gradient, iconBg, onClick, variant = 'default' }: any) {
    const isVertical = variant === 'vertical';

    return (
        <button
            onClick={onClick}
            className={`w-full bg-gradient-to-br ${gradient} text-white rounded-3xl shadow-lg shadow-slate-900/5 relative overflow-hidden active:scale-[0.98] transition-all group ${isVertical ? 'p-5 h-[140px] flex flex-col justify-between items-start' : 'p-4 flex items-center justify-center gap-3'}`}
        >
            <div className="absolute inset-0 bg-white/5 opacity-0 group-hover:opacity-100 transition-opacity" />

            {isVertical ? (
                // Vertical Layout (Big Tile)
                <>
                    <div className="w-full flex justify-between items-start z-10">
                        <div className={`${iconBg} p-3 rounded-2xl backdrop-blur-md`}>
                            <Icon className="w-7 h-7 text-white" />
                        </div>
                        <ChevronRight className="w-5 h-5 text-white/50" />
                    </div>

                    <div className="text-left z-10">
                        <h3 className="font-heading font-bold text-xl leading-tight mb-0.5">{title}</h3>
                        <p className="text-xs text-white/80 font-medium">{subtitle}</p>
                    </div>
                </>
            ) : (
                // Horizontal Layout (Banner)
                <div className="flex items-center space-x-3 z-10 w-full justify-between">
                    <div className="flex items-center gap-4">
                        <div className={`${iconBg} p-3 rounded-full backdrop-blur-md group-hover:bg-white/30 transition-colors`}>
                            <Icon className="w-6 h-6 text-white" />
                        </div>
                        <div className="text-left">
                            <h3 className="font-heading font-bold text-lg leading-none mb-1">{title}</h3>
                            <p className="text-xs text-white/90 font-medium opacity-90">{subtitle}</p>
                        </div>
                    </div>
                    <div className="bg-white/10 p-2 rounded-full z-10">
                        <ChevronRight className="w-5 h-5 text-white/90" />
                    </div>
                </div>
            )}

            {/* Decoration */}
            <div className="absolute -right-6 -bottom-10 bg-white/10 h-32 w-32 rounded-full pointer-events-none blur-3xl opacity-60" />
        </button>
    );
}

function CategoryItem({ icon: Icon, label, onClick, color, bg, comingSoon }: any) {
    return (
        <button
            onClick={onClick}
            className={`flex flex-col items-center justify-start gap-2 group active:scale-95 transition-transform ${comingSoon ? 'opacity-60 grayscale-[0.5]' : ''}`}
        >
            <div className={`w-12 h-12 shrink-0 rounded-2xl border border-slate-100 shadow-sm flex items-center justify-center transition-all ${bg} group-hover:brightness-95 relative`}>
                <Icon className={`w-5 h-5 ${color}`} />
                {comingSoon && (
                    <div className="absolute -top-1 -right-1 flex h-3 w-3">
                        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-slate-400 opacity-75"></span>
                        <span className="relative inline-flex rounded-full h-3 w-3 bg-slate-500"></span>
                    </div>
                )}
            </div>
            <span className="font-bold text-[10px] text-slate-600 text-center leading-tight max-w-[4rem] line-clamp-2 min-h-[2.5em] flex items-start justify-center">
                {label}
            </span>
        </button>
    );
}

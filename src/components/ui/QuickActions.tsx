import { useState, useMemo } from 'react';
import { MessageCircleHeart, Calendar, ChevronRight, Book, Users, LayoutGrid, Music, FileText, Youtube, Sparkles, BookOpen, Megaphone, Share2, Lightbulb, UserPlus, Mic2, Music4, HeartHandshake, Handshake, ShoppingBag, Database, Home, TrendingUp, Search } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { APP_ROUTES } from '@/lib/routes';
import { analytics } from '@/lib/analytics';
import { SectionHeader } from '@/components/ui/SectionHeader';
import { toast } from 'sonner';
import { FLAGS } from '@/lib/flags';
import { Drawer } from '@/components/ui/Drawer';
import { Input } from '@/components/ui/input';

interface QuickActionItem {
    id?: string;
    label: string;
    enabled?: boolean;
    modalOnly?: boolean; // New prop to hide from home preview
    // ... allow other props
}

interface QuickActionsProps {
    actions?: QuickActionItem[];
}

export function QuickActions({ actions: _externalActions }: QuickActionsProps = {}) {
    const navigate = useNavigate();

    // State
    const [showGlobalDrawer, setShowGlobalDrawer] = useState(false);
    const [searchQuery, setSearchQuery] = useState('');
    const [scrollToCategoryId, setScrollToCategoryId] = useState<string | null>(null);

    // Scroll to category when drawer opens
    useMemo(() => {
        if (showGlobalDrawer && scrollToCategoryId) {
            // Use setTimeout to ensure DOM is rendered after drawer animation/mount
            setTimeout(() => {
                const el = document.getElementById(`category-${scrollToCategoryId}`);
                el?.scrollIntoView({ behavior: 'smooth', block: 'start' });
                setScrollToCategoryId(null); // Reset
            }, 300); // 300ms matches drawer animation roughly
        }
    }, [showGlobalDrawer, scrollToCategoryId]);

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
                { label: 'Bíblia', icon: Book, route: APP_ROUTES.BIBLE, color: 'text-indigo-600', bg: 'bg-slate-100', modalOnly: true }, // Highlight
                { label: 'Devocional', icon: BookOpen, route: '/devocionais/today', color: 'text-emerald-600', bg: 'bg-emerald-50', modalOnly: true }, // Highlight
                { label: 'Estudo Bíblico', icon: FileText, route: APP_ROUTES.STUDIES, color: 'text-blue-600', bg: 'bg-blue-50' },
                { label: 'Versículo', icon: Sparkles, route: APP_ROUTES.VERSE_POSTER, color: 'text-amber-600', bg: 'bg-amber-50' },
                { label: 'Planos', icon: Book, route: '/plans', color: 'text-indigo-600', bg: 'bg-indigo-50', comingSoon: true },
            ]
        },
        {
            id: 'crescimento',
            title: 'Crescimento',
            categoryIcon: TrendingUp,
            categoryIconColor: 'text-emerald-500',
            items: [
                { label: 'Discipulado', icon: Users, route: '/discipleship', color: 'text-emerald-600', bg: 'bg-emerald-50', comingSoon: true },
                { label: 'Células', icon: Home, route: '/cells', color: 'text-orange-600', bg: 'bg-orange-50', comingSoon: true },
            ]
        },
        {
            id: 'comunidade',
            title: 'Comunidade',
            categoryIcon: Users,
            categoryIconColor: 'text-pink-500',
            items: [
                { label: 'Pedido De Oração', icon: MessageCircleHeart, route: APP_ROUTES.PRAYER, color: 'text-purple-600', bg: 'bg-purple-50', modalOnly: true }, // Highlight
                { label: 'Mural', icon: Megaphone, route: APP_ROUTES.MURAL, color: 'text-pink-600', bg: 'bg-pink-50' },
                { label: 'Testemunhos', icon: MessageCircleHeart, route: '/testimonies', color: 'text-cyan-600', bg: 'bg-cyan-50', comingSoon: true },
                { label: 'Convidar', icon: Share2, route: '/invite', color: 'text-purple-600', bg: 'bg-purple-50', comingSoon: true },
                { label: 'Ideias', icon: Lightbulb, route: '/feedback', color: 'text-yellow-600', bg: 'bg-yellow-50', comingSoon: true },
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
                { label: 'Store', icon: ShoppingBag, route: '/store', color: 'text-indigo-600', bg: 'bg-indigo-50', comingSoon: true },
                { label: 'ERP', icon: Database, route: '/erp', color: 'text-blue-800', bg: 'bg-blue-100', comingSoon: true },
            ]
        }
    ];

    // Filter Logic for Global Drawer
    const filteredCategories = useMemo(() => {
        if (!searchQuery.trim()) return categories;
        const lowerQuery = searchQuery.toLowerCase();

        return categories.map(cat => ({
            ...cat,
            items: cat.items.filter(item => item.label.toLowerCase().includes(lowerQuery))
        })).filter(cat => cat.items.length > 0);
    }, [searchQuery, categories]);


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
                        gradient="from-slate-800 to-slate-950"
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

            {/* Global Visibility Control */}
            <div className="flex items-center justify-between mb-6">
                <h3 className="text-sm font-semibold text-slate-900 tracking-tight">Recursos</h3>
                <button
                    onClick={() => setShowGlobalDrawer(true)}
                    className="text-xs font-bold text-blue-600 hover:text-blue-700 transition-colors uppercase tracking-wide flex items-center gap-1"
                >
                    Ver todos os recursos
                    <ChevronRight className="w-3 h-3" />
                </button>
            </div>

            {/* Categorized Menu - Limited Preview */}
            <div className="grid grid-cols-2 gap-x-4 gap-y-8">
                {categories.map((category) => {
                    const limit = 2;
                    // Filter out modalOnly items for preview
                    const previewItems = category.items.filter(i => !i.modalOnly).slice(0, limit);
                    // Always show 2 items logic applies to the filtered list
                    // "Ver mais" always visible as requested to access specific category in modal

                    return (
                        <div key={category.id} className="flex flex-col h-full">
                            {/* Premium Header Style */}
                            <div className="flex items-center justify-between mb-4 h-6">
                                <h2 className="text-sm font-semibold text-slate-900 tracking-tight flex items-center gap-2">
                                    <category.categoryIcon className={`w-4 h-4 ${category.categoryIconColor}`} />
                                    {category.title}
                                </h2>
                                <button
                                    onClick={() => {
                                        setShowGlobalDrawer(true);
                                        setScrollToCategoryId(category.id);
                                    }}
                                    className="text-[10px] font-bold text-slate-400 hover:text-slate-600 transition-colors flex items-center gap-0.5"
                                >
                                    Ver mais
                                </button>
                            </div>

                            {/* 2-column grid for buttons */}
                            <div className="grid grid-cols-2 gap-2">
                                {previewItems.map((item, idx) => (
                                    <CategoryItem
                                        key={idx}
                                        icon={item.icon}
                                        label={item.label}
                                        color={item.color}
                                        bg={item.bg}
                                        comingSoon={item.comingSoon}
                                        onClick={() => {
                                            if (item.comingSoon) {
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
                    );
                })}
            </div>

            {/* --- DRAWER: Global Resources --- */}
            <Drawer
                isOpen={showGlobalDrawer}
                onClose={() => {
                    setShowGlobalDrawer(false);
                    setSearchQuery('');
                }}
                className="!bg-slate-50/90" // Slight tint for premium feel override
                title="" // We implement custom header
                showCloseButton={false} // We provide custom close
            >
                {/* Custom Sticky Header */}
                <div className="sticky top-0 z-50 -mx-6 px-6 pt-5 pb-2 bg-white/80 backdrop-blur-xl border-b border-white/40 shadow-sm transition-all">
                    {/* Title Row */}
                    <div className="flex items-center justify-between mb-4">
                        <div>
                            <h2 className="text-xl font-bold text-slate-900 tracking-tight leading-none">Todos os Recursos</h2>
                            <p className="text-xs text-slate-500 font-medium mt-1">Encontre por nome ou categoria</p>
                        </div>
                        <button
                            onClick={() => setShowGlobalDrawer(false)}
                            className="group p-2 -mr-2 text-slate-400 hover:text-slate-600 bg-transparent hover:bg-slate-100/50 rounded-full transition-all active:scale-95"
                        >
                            <div className="ring-1 ring-slate-200/50 rounded-full p-1 group-hover:ring-slate-300/60 transition-colors">
                                <Search className="hidden" /> {/* Hack to keep import unused warning away if I remove X, but I imported X in Drawer... wait, I need X here */}
                                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-4 h-4"><path d="M18 6 6 18" /><path d="m6 6 12 12" /></svg>
                            </div>
                        </button>
                    </div>

                    {/* Search Bar */}
                    <div className="relative group mb-3">
                        <div className="absolute -inset-0.5 bg-gradient-to-r from-blue-500/20 to-purple-500/20 rounded-xl blur opacity-0 group-hover:opacity-100 transition duration-500"></div>
                        <div className="relative">
                            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 group-focus-within:text-blue-500 transition-colors" />
                            <Input
                                placeholder="Buscar recurso..."
                                className="pl-10 h-10 bg-slate-100/50 border-slate-200/50 focus:bg-white focus:border-blue-200 focus:ring-4 focus:ring-blue-500/5 rounded-xl transition-all placeholder:text-slate-400 text-slate-700 font-medium text-sm"
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                autoFocus={false}
                            />
                        </div>
                    </div>

                    {/* Category Chips (Scrollable) */}
                    {!searchQuery && (
                        <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-none -mx-6 px-6 mask-fade-right">
                            {categories.map(cat => (
                                <button
                                    key={cat.id}
                                    onClick={() => {
                                        const el = document.getElementById(`category-${cat.id}`);
                                        el?.scrollIntoView({ behavior: 'smooth', block: 'start' });
                                    }}
                                    className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-white border border-slate-100 shadow-sm text-[11px] font-bold text-slate-600 whitespace-nowrap active:scale-95 transition-transform hover:bg-slate-50 hover:border-slate-200"
                                >
                                    <span>{cat.title}</span>
                                    <span className="bg-slate-100 text-slate-400 px-1.5 rounded-md text-[9px]">{cat.items.length}</span>
                                </button>
                            ))}
                        </div>
                    )}
                </div>

                <div className="pt-2 pb-10 space-y-6">
                    {/* Results */}
                    {filteredCategories.length === 0 ? (
                        <div className="text-center py-12 flex flex-col items-center justify-center gap-3 opacity-60">
                            <div className="w-12 h-12 bg-slate-100 rounded-full flex items-center justify-center">
                                <Search className="w-6 h-6 text-slate-300" />
                            </div>
                            <p className="text-sm font-medium text-slate-500">Nenhum recurso encontrado para "{searchQuery}"</p>
                        </div>
                    ) : (
                        <div className="space-y-6">
                            {filteredCategories.map((cat) => (
                                <div
                                    key={cat.id}
                                    id={`category-${cat.id}`}
                                    className="bg-white/40 border border-white/60 shadow-sm rounded-3xl p-4 sm:p-5 scroll-mt-44" // scroll-mt handles sticky header offset
                                >
                                    <div className="flex items-center justify-between mb-4">
                                        <div className="flex items-center gap-2.5">
                                            <div className="p-1.5 bg-white shadow-sm rounded-lg border border-slate-50">
                                                <cat.categoryIcon className={`w-4 h-4 ${cat.categoryIconColor}`} />
                                            </div>
                                            <h3 className="font-bold text-sm text-slate-700 tracking-tight">{cat.title}</h3>
                                        </div>
                                        <span className="text-[10px] font-bold text-slate-400 bg-slate-100/80 px-2 py-0.5 rounded-full border border-slate-100">
                                            {cat.items.length}
                                        </span>
                                    </div>

                                    <div className="grid grid-cols-3 sm:grid-cols-4 gap-x-2 gap-y-4 sm:gap-4">
                                        {cat.items.map((item, idx) => (
                                            <CategoryItem
                                                key={idx}
                                                icon={item.icon}
                                                label={item.label}
                                                color={item.color}
                                                bg={item.bg}
                                                comingSoon={item.comingSoon}
                                                variant="large" // Larger variant for global view
                                                onClick={() => {
                                                    if (item.comingSoon) {
                                                        toast.info("Em breve", {
                                                            description: "Esta funcionalidade estará disponível em breve."
                                                        });
                                                        return;
                                                    }
                                                    trackAction(item.label.toLowerCase(), item.route);
                                                    setShowGlobalDrawer(false);
                                                    navigate(item.route);
                                                }}
                                            />
                                        ))}
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </Drawer>
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

function CategoryItem({ icon: Icon, label, onClick, color, bg, comingSoon, variant = 'default' }: any) {
    const isLarge = variant === 'large';
    const sizeClasses = isLarge ? "w-12 h-12 sm:w-14 sm:h-14" : "w-12 h-12";
    const iconSize = isLarge ? "w-5 h-5 sm:w-6 sm:h-6" : "w-5 h-5";
    const textSize = isLarge ? "text-[11px] sm:text-xs" : "text-[10px]";

    return (
        <button
            onClick={onClick}
            className={`flex flex-col items-center justify-start gap-2 group active:scale-95 transition-transform ${comingSoon ? 'opacity-80' : ''}`}
        >
            <div className={`${sizeClasses} shrink-0 rounded-[18px] sm:rounded-2xl border border-slate-100 shadow-sm flex items-center justify-center transition-all ${bg} group-hover:brightness-95 group-hover:scale-105 relative`}>
                <Icon className={`${iconSize} ${color} ${comingSoon ? 'opacity-50 grayscale' : ''}`} />
                {comingSoon && (
                    <div className="absolute -bottom-2 bg-slate-100 border border-slate-200 shadow-sm px-1.5 py-0.5 rounded-full z-10">
                        <span className="text-[8px] font-bold text-slate-500 uppercase tracking-wide leading-none block">Breve</span>
                    </div>
                )}
            </div>
            <span className={`font-bold ${textSize} text-slate-600 text-center leading-tight max-w-[5rem] line-clamp-2 min-h-[2.5em] flex items-start justify-center group-hover:text-slate-900 transition-colors`}>
                {label}
            </span>
        </button>
    );
}


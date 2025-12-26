import { useEffect, useRef, useState } from 'react';
import { HandHeart, Users, ArrowRight, Info, FileText, Building2 } from 'lucide-react'; // Added icons
import { monetizationService } from '@/lib/api/monetization';
import { useNavigate } from 'react-router-dom';
import { APP_ROUTES } from '@/lib/routes';
import { SectionHeader } from '@/components/ui/SectionHeader';

// --- Main Component ---

interface MonetizationBlockProps {
    monetization: {
        doe: any;
        partners: any[];
        affiliates: any[];
        transparency: { label: string; link: string } | null;
    };
    churchId?: string;
}

export function MonetizationBlock({ monetization, churchId }: MonetizationBlockProps) {
    const navigate = useNavigate();
    const scrollRef = useRef<HTMLDivElement>(null);
    const scrollPos = useRef(0);
    const [isPaused, setIsPaused] = useState(false);

    // Track Helper
    const track = (action: string, type: string) => {
        // Mapping user intent to function signature: itemId, itemType, context, churchId
        monetizationService.trackClick(action, type, 'home_monetization', churchId);
    };

    if (!monetization || (!monetization.doe && monetization.partners.length === 0 && monetization.affiliates.length === 0)) {
        return null;
    }

    // --- Partners Logic ---
    const allPartners = [...monetization.partners, ...monetization.affiliates];

    // Card Types
    type CarouselItem = { type: 'fixed_partner' } | { type: 'partner', data: any };

    // Build List: [Fixed Card, ...Partners]
    const baseItems: CarouselItem[] = [
        { type: 'fixed_partner' },
        ...allPartners.map(p => ({ type: 'partner', data: p } as CarouselItem))
    ];

    // Loop logic: Duplicate enough times for smooth infinite scroll
    // If list is small, replicate more. 
    const loopItems = [...baseItems, ...baseItems, ...baseItems, ...baseItems];

    // Page Visibility API: pause when tab is hidden
    useEffect(() => {
        const handleVisibilityChange = () => {
            setIsPaused(document.hidden);
        };

        document.addEventListener('visibilitychange', handleVisibilityChange);
        return () => document.removeEventListener('visibilitychange', handleVisibilityChange);
    }, []);

    // Auto Scroll Effect
    useEffect(() => {
        const container = scrollRef.current;

        console.log('[Carousel Debug] Effect triggered', {
            hasContainer: !!container,
            baseItemsLength: baseItems.length,
            isPaused,
            scrollWidth: container?.scrollWidth,
            clientWidth: container?.clientWidth
        });

        if (!container || baseItems.length === 0) {
            console.log('[Carousel Debug] Early return - no container or no items');
            return;
        }

        let animationFrameId: number;
        const speed = 0.6; // Tune for "premium" feel

        const animate = () => {
            if (!isPaused) {
                scrollPos.current += speed;
                // Soft Reset logic roughly based on content width fraction
                // Just assuming 1/4 of content is one set
                const singleSetWidth = container.scrollWidth / 4;
                if (scrollPos.current >= singleSetWidth) {
                    scrollPos.current = 0;
                    container.scrollLeft = 0;
                } else {
                    container.scrollLeft = scrollPos.current;
                }
            } else {
                scrollPos.current = container.scrollLeft;
            }
            animationFrameId = requestAnimationFrame(animate);
        };

        // Start animation (removed reduced motion check for debugging)
        console.log('[Carousel Debug] Starting animation');
        animationFrameId = requestAnimationFrame(animate);

        return () => {
            console.log('[Carousel Debug] Cleanup - canceling animation');
            cancelAnimationFrame(animationFrameId);
        };
    }, [isPaused, baseItems.length]);


    // Handlers
    const handleDonateClick = () => {
        track('donate_button', 'donate_click');
        navigate(APP_ROUTES.DONATE);
    };

    return (
        <div className="section-monetization pt-6 pb-12 mb-4 bg-gradient-to-b from-transparent to-slate-50/50">
            {/* --- SECTION HEADER --- */}
            {/* --- ACTION BUTTONS SECTION --- */}
            <div className="px-5 mb-8">
                <SectionHeader
                    title="Apoie a Obra"
                    subtitle="O MD Connect é gratuito para igrejas. Sua contribuição mantém servidores, segurança e suporte — e acelera a implantação do ERP (Admin + App do membro)."
                    icon={HandHeart}
                    iconColor="text-emerald-500"
                    actionLabel="Entenda"
                    onAction={() => {
                        track('donate_info', 'donate_info_open');
                        navigate(APP_ROUTES.ABOUT);
                    }}
                />

                {/* Mini Info Block - Bullets (Premium Legibility) */}
                <div className="bg-white/85 backdrop-blur-md border border-white/40 rounded-xl p-4 mb-4 shadow-lg shadow-slate-200/50">
                    <ul className="text-xs text-slate-700 space-y-2">
                        <li className="flex items-start gap-2.5">
                            <Building2 className="w-4 h-4 text-emerald-600 mt-0.5 shrink-0" />
                            <span className="leading-snug font-medium">Infraestrutura e suporte técnico</span>
                        </li>
                        <li className="flex items-start gap-2.5">
                            <FileText className="w-4 h-4 text-emerald-600 mt-0.5 shrink-0" />
                            <span className="leading-snug font-medium">Segurança & LGPD (sem venda de dados)</span>
                        </li>
                        <li className="flex items-start gap-2.5">
                            <HandHeart className="w-4 h-4 text-emerald-600 mt-0.5 shrink-0" />
                            <span className="leading-snug font-medium">ERP para Igrejas (Admin + App do membro)</span>
                        </li>
                        <li className="flex items-start gap-2.5">
                            <Info className="w-4 h-4 text-emerald-600 mt-0.5 shrink-0" />
                            <span className="leading-snug font-medium">Serviços digitais para igrejas e parceiros (sites, conteúdo e automações)</span>
                        </li>
                    </ul>
                </div>

                <div className="space-y-3">
                    {/* 1. Primary: DOE Agora */}
                    {monetization.doe && (
                        <button
                            onClick={handleDonateClick}
                            className="w-full h-14 bg-emerald-600 rounded-xl shadow-lg shadow-emerald-600/20 flex items-center justify-center gap-2 relative overflow-hidden group active:scale-[0.98] transition-transform"
                        >
                            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent -translate-x-full group-hover:animate-shimmer" />
                            <HandHeart className="w-5 h-5 text-emerald-100" />
                            <span className="text-sm font-bold text-white uppercase tracking-wide">DOE Agora</span>
                        </button>
                    )}

                    {/* 2. Secondary Actions (Row) */}
                    <div className="flex gap-3">
                        <button
                            onClick={() => {
                                track('donate_info', 'donate_info_open');
                                navigate(APP_ROUTES.ABOUT);
                            }}
                            className="flex-1 h-10 rounded-lg border border-slate-200 bg-white hover:bg-slate-50 text-slate-600 flex items-center justify-center gap-1.5 active:scale-[0.98] transition-transform"
                        >
                            <Info className="w-4 h-4 text-slate-400" />
                            <span className="text-[10px] font-bold uppercase tracking-wide">Entenda</span>
                        </button>

                        <button
                            onClick={() => {
                                track('partner_application', 'partner_apply_open');
                                navigate(APP_ROUTES.PARTNERS);
                            }}
                            className="flex-1 h-10 rounded-lg border border-slate-200 bg-white hover:bg-slate-50 text-slate-600 flex items-center justify-center gap-1.5 active:scale-[0.98] transition-transform"
                        >
                            <Users className="w-4 h-4 text-slate-400" />
                            <span className="text-[10px] font-bold uppercase tracking-wide">Seja Parceiro</span>
                        </button>
                    </div>

                    {/* 3. Transparency Link (Discrete) */}
                    {monetization.transparency && (
                        <div className="text-center pt-2">
                            <button
                                onClick={() => {
                                    track('transparency_link', 'transparency_open');
                                    window.open(monetization.transparency!.link, '_blank');
                                }}
                                className="text-[10px] text-slate-400 hover:text-slate-600 transition-colors flex items-center justify-center gap-1 mx-auto"
                            >
                                <FileText className="w-3 h-3" />
                                {monetization.transparency.label}
                            </button>
                        </div>
                    )}
                </div>
            </div>

            {/* --- CAROUSEL (Full Width) --- */}
            {baseItems.length > 0 && (
                <div className="relative group/carousel mt-8">
                    <div className="px-5">
                        <SectionHeader
                            title="Parceiros"
                            subtitle="Conheça quem apoia o projeto"
                            icon={Building2}
                            iconColor="text-blue-500"
                            actionLabel="Seja Parceiro"
                            onAction={() => {
                                track('partner_application', 'partner_apply_open');
                                navigate(APP_ROUTES.PARTNERS);
                            }}
                        />
                    </div>
                    {/* Fade Edges */}
                    <div className="absolute left-0 top-0 bottom-0 w-6 bg-gradient-to-r from-[#F6F7FB] to-transparent z-10 pointer-events-none" />
                    <div className="absolute right-0 top-0 bottom-0 w-6 bg-gradient-to-l from-[#F6F7FB] to-transparent z-10 pointer-events-none" />

                    <div
                        ref={scrollRef}
                        className="flex gap-4 overflow-x-auto pb-6 pt-2 scrollbar-hide px-5"
                        // Pause interactions
                        onTouchStart={() => setIsPaused(true)}
                        onTouchEnd={() => setIsPaused(false)}
                        onMouseEnter={() => setIsPaused(true)}
                        onMouseLeave={() => setIsPaused(false)}
                    >
                        {loopItems.map((item, index) => {
                            // Unique key mix
                            const key = `${item.type}-${index}`;

                            if (item.type === 'fixed_partner') {
                                return (
                                    <div
                                        key={key}
                                        className="shrink-0 w-[200px] bg-gradient-to-br from-blue-50 to-indigo-50 border border-blue-100 rounded-2xl p-4 flex flex-col items-center justify-center text-center shadow-sm relative overflow-hidden"
                                    >
                                        <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center mb-3 text-blue-600">
                                            <Users className="w-5 h-5" />
                                        </div>
                                        <h3 className="text-xs font-bold text-slate-800 mb-1">Seja Parceiro Oficial</h3>
                                        <p className="text-[10px] text-slate-500 font-medium mb-3 line-clamp-2">
                                            Apoie a obra e apareça no app
                                        </p>
                                        <button
                                            onClick={() => {
                                                track('partner_application', 'partner_apply_open');
                                                navigate(APP_ROUTES.PARTNERS);
                                            }}
                                            className="h-8 px-4 bg-blue-600 text-white rounded-lg text-[10px] font-bold uppercase tracking-wide hover:bg-blue-700 transition-colors"
                                        >
                                            Quero ser parceiro
                                        </button>
                                    </div>
                                );
                            } else {
                                const p = (item as any).data;
                                return (
                                    <div
                                        key={key}
                                        className="shrink-0 w-[200px] bg-white border border-slate-100 rounded-2xl p-4 flex flex-col items-center text-center shadow-sm relative group/card hover:shadow-md transition-all"
                                    >
                                        {/* Logo */}
                                        <div className="w-10 h-10 mb-3 rounded-full bg-slate-50 border border-slate-100 p-1 flex items-center justify-center overflow-hidden">
                                            {p.image_url ? (
                                                <img src={p.image_url} alt={p.title} className="w-full h-full object-contain" />
                                            ) : (
                                                <span className="text-[10px] font-bold text-slate-400">MD</span>
                                            )}
                                        </div>

                                        <div className="w-full px-1 mb-3">
                                            <h3 className="text-xs font-bold text-slate-900 line-clamp-1 mb-0.5">{p.title}</h3>
                                            <p className="text-[10px] text-slate-500 leading-tight line-clamp-1">
                                                {p.description || "Parceiro Oficial MD Connect"}
                                            </p>
                                        </div>

                                        <button
                                            onClick={() => {
                                                track(p.id || p.title, 'partner_visit');
                                                window.open(p.external_link, '_blank');
                                            }}
                                            className="w-full h-8 bg-slate-50 hover:bg-slate-100 text-slate-600 rounded-lg text-[10px] font-bold uppercase tracking-wide flex items-center justify-center gap-1 transition-colors"
                                        >
                                            Visitar
                                            <ArrowRight className="w-3 h-3 opacity-50" />
                                        </button>
                                    </div>
                                );
                            }
                        })}
                    </div>
                </div>
            )}






        </div>
    );
}

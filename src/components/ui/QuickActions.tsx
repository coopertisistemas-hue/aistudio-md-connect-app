import { MessageCircleHeart, Calendar, ChevronRight, Book, Users, LayoutGrid } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { APP_ROUTES, EXTERNAL_LINKS } from '@/lib/routes';
import { analytics } from '@/lib/analytics';
import { SectionHeader } from '@/components/ui/SectionHeader';

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

    const actions = [
        {
            label: 'Bíblia',
            icon: Book,
            onClick: () => {
                trackAction('biblia', APP_ROUTES.BIBLE);
                navigate(APP_ROUTES.BIBLE);
            },
            color: 'text-indigo-600',
            bg: 'bg-indigo-50'
        },
        {
            label: 'Estudos',
            icon: Users,
            onClick: () => {
                trackAction('estudos', APP_ROUTES.STUDIES);
                navigate(APP_ROUTES.STUDIES);
            },
            color: 'text-emerald-600',
            bg: 'bg-emerald-50'
        },
        {
            label: 'Agenda',
            icon: Calendar,
            onClick: () => {
                trackAction('agenda', APP_ROUTES.AGENDA);
                navigate(APP_ROUTES.AGENDA);
            },
            color: 'text-blue-600',
            bg: 'bg-blue-50'
        },
        {
            label: 'WhatsApp',
            icon: null,
            isWhatsapp: true,
            onClick: () => {
                analytics.track({
                    name: 'cta_click',
                    element: 'quickaction_whatsapp',
                    context: 'member',
                    metadata: { type: 'external', destination: 'whatsapp' }
                });
                window.open(EXTERNAL_LINKS.SUPPORT_WHATSAPP, '_blank');
            },
            color: 'text-[#25D366]',
            bg: 'bg-green-50'
        },
    ];

    // Limit visible items logic could go here, but with 4 it fits perfectly.
    // If we had more, we'd slice and add a "More" button.
    // If we had more, we'd slice and add a "More" button.

    // ...

    return (
        <div className="mb-8 px-5">
            <SectionHeader
                title="Acesso Rápido"
                subtitle="Atalhos para o dia a dia"
                icon={LayoutGrid}
                iconColor="text-blue-500"
            />


            {/* Primary CTA: Prayer Request (Maintained Large) */}
            <button
                onClick={() => {
                    analytics.track({
                        name: 'feature_usage',
                        element: 'quickaction_prayer_cta',
                        context: 'member',
                        route_to: APP_ROUTES.PRAYER
                    });
                    navigate(APP_ROUTES.PRAYER);
                }}
                className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 text-white p-4 rounded-2xl shadow-lg shadow-blue-900/10 mb-4 flex items-center justify-between relative overflow-hidden active:scale-[0.98] transition-all group"
            >
                <div className="flex items-center space-x-3 z-10">
                    <div className="bg-white/20 p-2.5 rounded-full backdrop-blur-sm group-hover:bg-white/30 transition-colors">
                        <MessageCircleHeart className="w-6 h-6 text-white" />
                    </div>
                    <div className="text-left">
                        <h3 className="font-heading font-bold text-lg leading-none mb-1">Pedir Oração</h3>
                        <p className="text-xs text-blue-100 font-medium opacity-90">Fale com os pastores</p>
                    </div>
                </div>
                <div className="bg-white/10 p-1.5 rounded-full z-10">
                    <ChevronRight className="w-5 h-5 text-white/90" />
                </div>

                {/* Decoration */}
                <div className="absolute -right-6 -bottom-10 bg-white/10 h-28 w-28 rounded-full pointer-events-none blur-2xl" />
                <div className="absolute top-0 right-0 p-3 opacity-10">
                    <MessageCircleHeart className="w-24 h-24" />
                </div>
            </button>

            {/* Secondary Actions Grid - Adaptive columns */}
            <div className="grid grid-cols-4 gap-2 sm:gap-3">
                {actions.map((action, idx) => (
                    <SecondaryAction
                        key={idx}
                        icon={action.icon}
                        label={action.label}
                        onClick={action.onClick}
                        color={action.color}
                        bg={action.bg}
                        isWhatsapp={action.isWhatsapp}
                    />
                ))}
            </div>
        </div>
    );
}

function SecondaryAction({ icon: Icon, label, onClick, color, bg, isWhatsapp }: any) {
    return (
        <button
            onClick={onClick}
            className="flex flex-col items-center justify-center gap-2 group active:scale-95 transition-transform"
        >
            <div className={`w-14 h-14 rounded-2xl border border-slate-100 shadow-sm flex items-center justify-center transition-colors ${bg} group-hover:brightness-95`}>
                {isWhatsapp ? (
                    <svg viewBox="0 0 24 24" fill="currentColor" className={`w-6 h-6 ${color}`}>
                        <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.008-.57-.008-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z" />
                    </svg>
                ) : (
                    <Icon className={`w-6 h-6 ${color}`} />
                )}
            </div>
            <span className="font-bold text-[11px] text-slate-600 text-center leading-tight max-w-[5rem]">{label}</span>
        </button>
    );
}

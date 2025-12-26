import { Heart, ArrowRight, ShieldCheck } from 'lucide-react';

import { useNavigate } from 'react-router-dom';
import { APP_ROUTES } from '@/lib/routes';
import { analytics } from '@/lib/analytics';

export function DonationWidget() {
    const navigate = useNavigate();

    return (
        <div className="mx-4 mb-6">
            <div className="bg-gradient-to-br from-slate-50 to-white border border-slate-200/60 rounded-xl p-4 shadow-sm relative overflow-hidden group">

                {/* Background Decor */}
                <div className="absolute top-0 right-0 p-3 opacity-5">
                    <Heart className="w-20 h-20 text-slate-800" />
                </div>

                <div className="relative z-10">
                    <div className="flex items-start space-x-3">
                        <div className="bg-white p-2 rounded-full shadow-sm border border-slate-100 mt-1">
                            <Heart className="w-4 h-4 text-rose-500 fill-rose-50" />
                        </div>
                        <div className="flex-1">
                            <h3 className="font-heading font-bold text-slate-800 text-sm mb-0.5">DOE — Contribuição voluntária</h3>
                            <p className="text-[10px] text-slate-400 mb-2">Tecnologia a serviço do Reino</p>
                            <p className="text-xs text-slate-600 leading-relaxed mb-3">
                                Sua contribuição mantém nossa infraestrutura, suporte e serviços. E viabiliza a evolução do app e a implantação do ERP gratuito para igrejas.
                            </p>

                            <div className="flex flex-col gap-3">
                                <button
                                    onClick={() => {
                                        analytics.track({
                                            name: 'cta_click',
                                            element: 'donation_widget_contribute',
                                            context: 'member',
                                            metadata: { type: 'whatsapp_start' }
                                        });
                                        window.open('https://wa.me/?text=Quero%20contribuir%20voluntariamente%20(DOE)%20com%20o%20MD%20Connect.', '_blank');
                                    }}
                                    className="inline-flex items-center justify-center space-x-2 bg-slate-800 text-white px-4 py-2 rounded-lg text-xs font-bold active:scale-95 transition-transform shadow-md shadow-slate-200"
                                >
                                    <span>Quero contribuir</span>
                                    <ArrowRight className="w-3 h-3" />
                                </button>

                                <div className="flex items-center gap-3 flex-wrap">
                                    <button
                                        onClick={() => {
                                            analytics.track({
                                                name: 'nav_click',
                                                element: 'donation_widget_partners',
                                                context: 'member',
                                                route_to: APP_ROUTES.PARTNERS
                                            });
                                            navigate(APP_ROUTES.PARTNERS);
                                        }}
                                        className="flex items-center space-x-1.5 text-[10px] text-slate-500 hover:text-blue-600 transition-colors"
                                    >
                                        <ShieldCheck className="w-3 h-3" />
                                        <span className="font-medium">Seja Parceiro</span>
                                    </button>

                                    <button
                                        onClick={() => {
                                            analytics.track({
                                                name: 'nav_click',
                                                element: 'donation_widget_church_erp',
                                                context: 'member',
                                                route_to: APP_ROUTES.CHURCH_SHOWCASE
                                            });
                                            navigate(APP_ROUTES.CHURCH_SHOWCASE);
                                        }}
                                        className="flex items-center space-x-1.5 text-[10px] text-slate-500 hover:text-indigo-600 transition-colors"
                                    >
                                        <ShieldCheck className="w-3 h-3" />
                                        <span className="font-medium">ERP gratuito para Igrejas</span>
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

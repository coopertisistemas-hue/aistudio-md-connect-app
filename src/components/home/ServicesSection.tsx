import { useState, useEffect } from 'react';
import { Building, ShoppingBag, ArrowRight, CheckCircle2, MessageCircle } from 'lucide-react';
import { PortalSection } from '@/components/ui/PortalComponents';
import { monetizationService } from '@/services/monetization';
import type { Partner } from '@/types/monetization';
import AffiliateCard from '@/components/monetization/AffiliateCard';
import { Link } from 'react-router-dom';

export function ServicesSection() {
    const [partners, setPartners] = useState<Partner[]>([]);

    // We can keep fetching partners if needed, or just hide if empty.
    // Assuming we still want partners.
    useEffect(() => {
        monetizationService.getFeaturedPartners().then(setPartners);
    }, []);

    return (
        <div className="space-y-6">

            {/* Parceiros & Ofertas (Afiliados) - Mantido se houver dados */}
            {partners.length > 0 && (
                <div>
                    <div className="flex justify-between items-end mb-1 px-1">
                        <PortalSection title="Parceiros & Ofertas" icon={ShoppingBag} className="mb-0" children={null} />
                        <Link to="partners" className="text-[10px] text-blue-600 font-bold flex items-center hover:underline">
                            Ver todos <ArrowRight className="w-3 h-3 ml-1" />
                        </Link>
                    </div>

                    <div className="px-1 mb-3">
                        <p className="text-xs text-slate-500 font-medium">Recursos recomendados para edificação.</p>
                    </div>

                    <div className="flex space-x-3 overflow-x-auto pb-4 scrollbar-hide snap-x px-1">
                        {partners.map(p => (
                            <AffiliateCard key={p.id} partner={p} source="home" />
                        ))}
                    </div>
                </div>
            )}

            {/* Serviços para Igrejas (Compact Block) */}
            <div className="border-t border-slate-100 pt-6 px-1">
                <div className="flex justify-between items-center mb-4">
                    <PortalSection title="Serviços para Igrejas" icon={Building} className="mb-0" children={null} />
                    <Link to="services" className="text-[10px] text-blue-600 font-bold flex items-center hover:underline bg-blue-50 px-2 py-1 rounded-full">
                        Ver todos
                    </Link>
                </div>

                <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-sm relative overflow-hidden">
                    <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-bl from-blue-50 to-transparent rounded-bl-full -mr-10 -mt-10 pointer-events-none" />

                    <div className="relative z-10">
                        <h4 className="font-bold text-slate-800 text-sm mb-3">Soluções completas para o seu ministério</h4>

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 mb-5">
                            <ServiceItem label="Google Meu Negócio (GMB)" />
                            <ServiceItem label="Gestão de Mídias Sociais" />
                            <ServiceItem label="Criação de Sites e Apps" />
                            <ServiceItem label="Consultoria Estratégica" />
                        </div>

                        <button
                            onClick={() => window.open('https://wa.me/?text=Tenho%20interesse%20nos%20serviços%20para%20igrejas', '_blank')}
                            className="w-full bg-[#25D366] hover:bg-[#20bd5a] text-white font-bold py-3 rounded-lg flex items-center justify-center space-x-2 active:scale-[0.98] transition-all shadow-sm shadow-green-100"
                        >
                            <MessageCircle className="w-5 h-5" />
                            <span>Falar no WhatsApp</span>
                        </button>
                    </div>
                </div>
            </div>

        </div>
    );
}

function ServiceItem({ label }: { label: string }) {
    return (
        <div className="flex items-center space-x-2">
            <CheckCircle2 className="w-4 h-4 text-blue-600 flex-shrink-0" />
            <span className="text-xs text-slate-600 font-medium">{label}</span>
        </div>
    );
}

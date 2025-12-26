import { useNavigate } from 'react-router-dom';
import { Building2, Users, ArrowRight } from 'lucide-react';
import { SectionHeader } from '@/components/ui/SectionHeader';
import { analytics } from '@/lib/analytics';
import { APP_ROUTES } from '@/lib/routes';

export function ChurchPartnersBlock() {
    const navigate = useNavigate();

    const track = (action: string) => {
        analytics.track({
            name: 'cta_click',
            element: `church_partner_${action}`,
            context: 'member',
        });
    };

    return (
        <div className="section-church-partners px-5 mb-10">
            <SectionHeader
                title="Para Igrejas e Parceiros"
                subtitle="Soluções para o Reino"
                icon={Building2}
                iconColor="text-indigo-500"
            />

            <div className="grid grid-cols-2 gap-3">
                {/* Card Igrejas */}
                <button
                    onClick={() => {
                        track('church_erp');
                        navigate(APP_ROUTES.CHURCH_SHOWCASE);
                    }}
                    className="group relative flex flex-col items-center p-4 bg-gradient-to-br from-indigo-50 to-white border border-indigo-100/50 rounded-2xl shadow-sm hover:shadow-md transition-all active:scale-[0.98] overflow-hidden"
                >
                    <div className="w-10 h-10 rounded-full bg-indigo-100 flex items-center justify-center mb-3 text-indigo-600 group-hover:scale-110 transition-transform">
                        <Building2 className="w-5 h-5" />
                    </div>
                    <h3 className="text-sm font-bold text-slate-800 text-center leading-tight mb-1">
                        Sou Igreja
                    </h3>
                    <p className="text-[10px] text-slate-500 text-center font-medium leading-tight">
                        ERP completo + App do membro
                    </p>
                    <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity">
                        <ArrowRight className="w-3 h-3 text-indigo-400" />
                    </div>
                </button>

                {/* Card Parceiros */}
                <button
                    onClick={() => {
                        track('become_partner');
                        navigate(APP_ROUTES.PARTNERS);
                    }}
                    className="group relative flex flex-col items-center p-4 bg-gradient-to-br from-blue-50 to-white border border-blue-100/50 rounded-2xl shadow-sm hover:shadow-md transition-all active:scale-[0.98] overflow-hidden"
                >
                    <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center mb-3 text-blue-600 group-hover:scale-110 transition-transform">
                        <Users className="w-5 h-5" />
                    </div>
                    <h3 className="text-sm font-bold text-slate-800 text-center leading-tight mb-1">
                        Sou Parceiro
                    </h3>
                    <p className="text-[10px] text-slate-500 text-center font-medium leading-tight">
                        Site mobile gratuito
                    </p>
                    <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity">
                        <ArrowRight className="w-3 h-3 text-blue-400" />
                    </div>
                </button>
            </div>
        </div>
    );
}

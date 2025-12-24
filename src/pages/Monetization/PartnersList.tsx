import { useState, useEffect } from 'react';
import { Handshake } from 'lucide-react';
import { monetizationService } from '@/services/monetization';
import type { Partner } from '@/types/monetization';
import AffiliateCard from '@/components/monetization/AffiliateCard';
import { InternalPageLayout } from '@/components/layout/InternalPageLayout';

export default function PartnersList() {
    const [partners, setPartners] = useState<Partner[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        monetizationService.getAllPartners().then(data => {
            setPartners(data);
            setLoading(false);
        });
    }, []);

    return (
        <InternalPageLayout
            title="Parceiros"
            subtitle="Quem caminha junto na missão."
            icon={Handshake}
            iconClassName="text-emerald-600"
            backPath="/home"
        >
            <div className="p-4">
                <p className="text-xs text-slate-500 mb-4 px-2 bg-yellow-50 text-yellow-800 py-2 rounded">
                    ⚠️ Indicações de parceiros verificados. Compras podem gerar comissão para sustentabilidade do projeto.
                </p>

                {loading ? (
                    <div className="grid grid-cols-2 gap-3">
                        {[1, 2, 3, 4].map(i => (
                            <div key={i} className="min-w-[150px] bg-white rounded-xl border border-slate-100 p-2 text-center animate-pulse">
                                <div className="w-full h-24 bg-slate-100 rounded mb-2"></div>
                                <div className="h-4 w-3/4 bg-slate-100 rounded mx-auto mb-1"></div>
                                <div className="h-3 w-1/2 bg-slate-100 rounded mx-auto"></div>
                            </div>
                        ))}
                    </div>
                ) : (
                    <div className="grid grid-cols-2 gap-3">
                        {partners.map(p => (
                            <AffiliateCard key={p.id} partner={p} source="list" />
                        ))}
                        {partners.length === 0 && <div className="col-span-2 text-center text-slate-400 py-10">Nenhum parceiro no momento.</div>}
                    </div>
                )}
            </div>
        </InternalPageLayout>
    );
}

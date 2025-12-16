import { useState, useEffect } from 'react';
import { ArrowLeft } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { monetizationService } from '@/services/monetization';
import type { Partner } from '@/types/monetization';
import AffiliateCard from '@/components/monetization/AffiliateCard';

export default function PartnersList() {
    const navigate = useNavigate();
    const [partners, setPartners] = useState<Partner[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        monetizationService.getAllPartners().then(data => {
            setPartners(data);
            setLoading(false);
        });
    }, []);

    return (
        <div className="min-h-screen bg-slate-50 pb-20">
            <header className="bg-white sticky top-0 z-10 border-b border-slate-100 px-4 py-3 flex items-center">
                <button onClick={() => navigate(-1)} className="mr-3 p-1 rounded-full hover:bg-slate-100">
                    <ArrowLeft className="w-5 h-5 text-slate-700" />
                </button>
                <h1 className="font-bold text-slate-800 text-lg">Parceiros & Ofertas</h1>
            </header>

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
        </div>
    );
}

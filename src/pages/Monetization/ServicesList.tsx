import { useState, useEffect } from 'react';
import { Building2 } from 'lucide-react';
import { BackLink } from '@/components/ui/BackLink';
import { monetizationService } from '@/services/monetization';
import type { Service } from '@/types/monetization';
import ServiceCard from '@/components/monetization/ServiceCard';

export default function ServicesList() {
    const [services, setServices] = useState<Service[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        monetizationService.getAllServices().then(data => {
            setServices(data);
            setLoading(false);
        });
    }, []);

    return (
        <div className="min-h-screen bg-slate-50 pb-20">
            <div className="px-5 pt-8 mb-4">
                <BackLink className="mb-4" />
                <h1 className="text-2xl font-bold text-slate-900 mb-1 flex items-center gap-2">
                    <Building2 className="w-6 h-6 text-blue-600" />
                    Serviços para Igrejas
                </h1>
                <p className="text-slate-500 text-sm">Soluções e serviços para o seu ministério.</p>
            </div>

            <div className="p-4 space-y-4">
                {loading ? (
                    <div className="grid gap-4">
                        {[1, 2, 3].map(i => (
                            <div key={i} className="bg-white rounded-xl border border-slate-100 p-4 animate-pulse">
                                <div className="flex justify-between mb-2">
                                    <div className="h-10 w-10 bg-slate-100 rounded"></div>
                                    <div className="h-6 w-20 bg-slate-100 rounded"></div>
                                </div>
                                <div className="h-5 w-1/2 bg-slate-100 rounded mb-2"></div>
                                <div className="h-4 w-full bg-slate-100 rounded mb-4"></div>
                                <div className="grid grid-cols-2 gap-2">
                                    <div className="h-10 bg-slate-100 rounded"></div>
                                    <div className="h-10 bg-slate-100 rounded"></div>
                                </div>
                            </div>
                        ))}
                    </div>
                ) : (
                    <div className="grid gap-4">
                        {services.map(s => (
                            <ServiceCard key={s.id} service={s} source="list" />
                        ))}
                        {services.length === 0 && <div className="text-center text-slate-400 py-10">Nenhum serviço disponível no momento.</div>}
                    </div>
                )}
            </div>
        </div>
    );
}

import { useState, useEffect } from 'react';
import { Building2 } from 'lucide-react';
import { monetizationService } from '@/services/monetization';
import type { Service } from '@/types/monetization';
import ServiceCard from '@/components/monetization/ServiceCard';
import { InternalPageLayout } from '@/components/layout/InternalPageLayout';

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
        <InternalPageLayout
            title="Serviços"
            subtitle="Apoio e soluções para servir melhor."
            icon={Building2}
            iconClassName="text-blue-600"
            backPath="/home"
        >
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
        </InternalPageLayout>
    );
}

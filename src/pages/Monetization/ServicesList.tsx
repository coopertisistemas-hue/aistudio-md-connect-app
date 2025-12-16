import { useState, useEffect } from 'react';
import { ArrowLeft } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { monetizationService } from '@/services/monetization';
import type { Service } from '@/types/monetization';
import ServiceCard from '@/components/monetization/ServiceCard';

export default function ServicesList() {
    const navigate = useNavigate();
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
            <header className="bg-white sticky top-0 z-10 border-b border-slate-100 px-4 py-3 flex items-center">
                <button onClick={() => navigate(-1)} className="mr-3 p-1 rounded-full hover:bg-slate-100">
                    <ArrowLeft className="w-5 h-5 text-slate-700" />
                </button>
                <h1 className="font-bold text-slate-800 text-lg">Serviços para Igrejas</h1>
            </header>

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

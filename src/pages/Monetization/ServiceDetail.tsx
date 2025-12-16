import { useState, useEffect } from 'react';
import { ArrowLeft, MessageCircle, CheckCircle2 } from 'lucide-react';
import { useNavigate, useParams } from 'react-router-dom';
import { monetizationService } from '@/services/monetization';
import type { Service } from '@/types/monetization';

export default function ServiceDetail() {
    const { id } = useParams();
    const navigate = useNavigate();
    const [service, setService] = useState<Service | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (id) {
            monetizationService.getServiceById(id).then(data => {
                setService(data);
                setLoading(false);
            });
            monetizationService.trackEvent(id, 'service', 'click', 'detail_load');
        }
    }, [id]);

    if (loading) return <div className="p-10 text-center">Carregando...</div>;
    if (!service) return <div className="p-10 text-center">Serviço não encontrado</div>;

    const handleWhatsApp = () => {
        monetizationService.trackEvent(service.id, 'service', 'whatsapp', 'detail');
        const text = encodeURIComponent(service.whatsapp_message || `Olá, gostaria de saber mais sobre ${service.title}`);
        window.open(`https://wa.me/${service.whatsapp_number}?text=${text}`, '_blank');
    };

    return (
        <div className="min-h-screen bg-slate-50 pb-24">
            {/* Header Image/Gradient Placeholder - Could use an image field if added later */}
            <div className="h-40 bg-gradient-to-r from-blue-600 to-indigo-700 relative">
                <button onClick={() => navigate(-1)} className="absolute top-4 left-4 p-2 bg-white/20 backdrop-blur rounded-full text-white">
                    <ArrowLeft className="w-5 h-5" />
                </button>
                <div className="absolute -bottom-6 left-4 bg-white p-4 rounded-xl shadow-lg border border-slate-100">
                    <h1 className="font-bold text-xl text-slate-900">{service.title}</h1>
                </div>
            </div>

            <div className="mt-10 px-4 space-y-6">

                <div className="bg-white p-4 rounded-xl border border-slate-100">
                    <h2 className="font-semibold text-slate-900 mb-2">Sobre o Serviço</h2>
                    <p className="text-slate-600 leading-relaxed whitespace-pre-wrap">{service.description || service.value_proposition}</p>
                </div>

                <div className="bg-white p-4 rounded-xl border border-slate-100">
                    <h2 className="font-semibold text-slate-900 mb-4">Destaques</h2>
                    <ul className="space-y-2">
                        <li className="flex items-center gap-2 text-sm text-slate-600">
                            <CheckCircle2 className="w-4 h-4 text-green-500" /> Solução especializada para igrejas
                        </li>
                        <li className="flex items-center gap-2 text-sm text-slate-600">
                            <CheckCircle2 className="w-4 h-4 text-green-500" /> Atendimento via WhatsApp
                        </li>
                        {service.price_starts_at && (
                            <li className="flex items-center gap-2 text-sm text-slate-600">
                                <CheckCircle2 className="w-4 h-4 text-green-500" /> Planos a partir de {service.price_starts_at}
                            </li>
                        )}
                    </ul>
                </div>

            </div>

            <div className="fixed bottom-0 left-0 w-full p-4 bg-white border-t border-slate-100">
                <button
                    onClick={handleWhatsApp}
                    className="w-full bg-green-500 hover:bg-green-600 text-white font-bold py-3.5 rounded-xl shadow-lg shadow-green-500/20 transition-all flex items-center justify-center gap-2"
                >
                    <MessageCircle className="w-5 h-5" />
                    Falar no WhatsApp
                </button>
            </div>
        </div>
    );
}

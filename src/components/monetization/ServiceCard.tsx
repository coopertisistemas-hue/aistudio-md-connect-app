import React from 'react';
import type { Service } from '@/types/monetization';
import { MessageCircle, Info } from 'lucide-react';
import { monetizationService } from '@/services/monetization';
import { Link } from 'react-router-dom';

interface ServiceCardProps {
    service: Service;
    source: string;
}

const ServiceCard: React.FC<ServiceCardProps> = ({ service, source }) => {
    const handleWhatsApp = (e: React.MouseEvent) => {
        e.stopPropagation();
        monetizationService.trackEvent(service.id, 'service', 'whatsapp', source);
        const text = encodeURIComponent(service.whatsapp_message || `Olá, gostaria de saber mais sobre ${service.title}`);
        window.open(`https://wa.me/${service.whatsapp_number}?text=${text}`, '_blank');
    };

    return (
        <div className="bg-white rounded-xl border border-slate-100 shadow-sm p-4 hover:shadow-md transition-all">
            <div className="flex justify-between items-start mb-2">
                <div className="h-10 w-10 bg-indigo-50 rounded-lg flex items-center justify-center text-indigo-600">
                    <Info className="w-5 h-5" />
                </div>
                {service.price_starts_at && (
                    <span className="text-xs font-semibold bg-green-50 text-green-700 px-2 py-1 rounded-full">
                        A partir de {service.price_starts_at}
                    </span>
                )}
            </div>

            <h3 className="font-bold text-slate-900 mb-1 leading-tight">{service.title}</h3>
            <p className="text-xs text-slate-500 line-clamp-2 mb-4 h-8">{service.value_proposition || service.description}</p>

            <div className="flex gap-2">
                <button
                    onClick={handleWhatsApp}
                    className="flex-1 bg-green-500 hover:bg-green-600 text-white text-xs font-bold py-2.5 rounded-lg flex items-center justify-center gap-1.5 transition-colors shadow-sm"
                >
                    <MessageCircle className="w-3.5 h-3.5" />
                    Chamar no WhatsApp
                </button>
                <Link
                    to={`/services/${service.id}`}
                    onClick={() => monetizationService.trackEvent(service.id, 'service', 'click', source)}
                    className="px-3 bg-slate-50 text-slate-600 border border-slate-200 rounded-lg flex items-center justify-center hover:bg-slate-100 transition-colors"
                >
                    <Info className="w-4 h-4" />
                </Link>
            </div>
        </div>
    );
};

export default ServiceCard;

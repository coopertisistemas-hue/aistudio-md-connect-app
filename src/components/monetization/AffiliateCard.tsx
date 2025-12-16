import React from 'react';
import type { Partner } from '@/types/monetization';
import { ExternalLink } from 'lucide-react';
import { monetizationService } from '@/services/monetization';

interface AffiliateCardProps {
    partner: Partner;
    source: string;
}

const AffiliateCard: React.FC<AffiliateCardProps> = ({ partner, source }) => {
    const handleClick = () => {
        monetizationService.trackEvent(partner.id, 'partner', 'click', source);
        window.open(partner.external_link, '_blank');
    };

    return (
        <div
            onClick={handleClick}
            className="flex-shrink-0 w-36 md:w-48 bg-white rounded-xl border border-slate-100 shadow-sm overflow-hidden snap-start cursor-pointer hover:shadow-md transition-shadow relative group"
        >
            <div className="h-24 bg-slate-100 relative">
                {partner.image_url ? (
                    <img src={partner.image_url} alt={partner.title} className="w-full h-full object-cover" loading="lazy" />
                ) : (
                    <div className="w-full h-full flex items-center justify-center text-slate-300 text-xs">Sem imagem</div>
                )}
                {/* Badge Parceria */}
                <div className="absolute top-1 left-1 bg-black/50 backdrop-blur text-white text-[10px] px-1.5 py-0.5 rounded">
                    Parceria
                </div>
            </div>
            <div className="p-3">
                <h3 className="text-xs font-bold text-slate-900 line-clamp-1 leading-tight mb-1" title={partner.title}>{partner.title}</h3>
                <p className="text-[10px] text-slate-500 line-clamp-2 min-h-[2.5em]">{partner.description}</p>
                <div className="flex items-center gap-1 mt-2 text-[10px] text-blue-600 font-bold opacity-100 transition-opacity">
                    Ver oferta <ExternalLink className="w-3 h-3" />
                </div>
            </div>
        </div>
    );
};

export default AffiliateCard;

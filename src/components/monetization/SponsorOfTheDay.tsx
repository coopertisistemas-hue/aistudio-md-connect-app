import { useState, useMemo } from 'react';
import { Star } from 'lucide-react';
import { FLAGS } from '@/lib/flags';
import { analytics } from '@/lib/analytics';
import { SPONSORS } from '@/lib/data/sponsors';
import { SponsorsModal } from './SponsorsModal';

export function SponsorOfTheDay() {
    const [showAll, setShowAll] = useState(false);

    if (!FLAGS.FEATURE_DEVOTIONAL_SPONSOR_HIGHLIGHT || SPONSORS.length === 0) return null;

    // Deterministic selection based on date hash
    const sponsor = useMemo(() => {
        const today = new Date().toISOString().split('T')[0]; // YYYY-MM-DD
        let hash = 0;
        for (let i = 0; i < today.length; i++) {
            hash = ((hash << 5) - hash) + today.charCodeAt(i);
            hash |= 0;
        }
        const index = Math.abs(hash) % SPONSORS.length;
        return SPONSORS[index];
    }, []);

    const handleSponsorClick = () => {
        analytics.track({
            name: 'feature_usage',
            element: 'sponsor_click',
            context: 'member',
            metadata: { sponsor_id: sponsor.id, sponsor_name: sponsor.name, source: 'devotional_detail' }
        });
    };

    return (
        <>
            <div className="animate-fade-in-up delay-100">
                <div className="flex items-center gap-2 mb-3 px-1">
                    <Star className="w-3 h-3 text-amber-500 fill-amber-500" />
                    <span className="text-xs font-bold text-slate-900 uppercase tracking-wider">Patrocinado por</span>
                </div>

                <a
                    href={sponsor.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    onClick={handleSponsorClick}
                    className="block bg-white border border-slate-100 rounded-2xl p-4 shadow-sm hover:shadow-lg hover:border-amber-200 hover:bg-amber-50/5 transition-all group relative overflow-hidden"
                >
                    <div className="absolute top-0 right-0 w-16 h-16 bg-amber-100/20 rounded-bl-full pointer-events-none" />

                    <div className="flex items-center gap-4">
                        <div className="w-16 h-16 rounded-xl bg-slate-50 border border-slate-100 overflow-hidden flex items-center justify-center shrink-0 p-1">
                            {sponsor.logo ? (
                                <img src={sponsor.logo} alt={sponsor.name} className="w-full h-full object-cover rounded-lg" />
                            ) : (
                                <span className="font-bold text-slate-400 text-2xl">{sponsor.name[0]}</span>
                            )}
                        </div>
                        <div className="flex-1 min-w-0 py-1">
                            <h4 className="font-bold text-slate-900 text-lg group-hover:text-amber-600 transition-colors truncate leading-tight">
                                {sponsor.name}
                            </h4>
                            <p className="text-sm text-slate-700 font-medium truncate mt-0.5">{sponsor.tagline}</p>
                        </div>
                        <div className="pl-2">
                            <div className="px-4 py-2 bg-slate-100 text-slate-700 text-xs font-bold rounded-lg group-hover:bg-amber-100 group-hover:text-amber-800 transition-colors whitespace-nowrap">
                                Saiba mais
                            </div>
                        </div>
                    </div>
                </a>

                <div className="text-center mt-3">
                    <button
                        onClick={() => setShowAll(true)}
                        className="text-xs font-medium text-slate-400 hover:text-indigo-600 transition-colors"
                    >
                        Ver todos os patrocinadores
                    </button>
                </div>
            </div>

            <SponsorsModal isOpen={showAll} onClose={() => setShowAll(false)} />
        </>
    );
}

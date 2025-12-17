import { useState, useMemo, useEffect } from 'react';
import { Star } from 'lucide-react';
import { FLAGS } from '@/lib/flags';
import { analytics } from '@/lib/analytics';
import { SPONSORS, type Sponsor } from '@/lib/data/sponsors';
import { SponsorsModal } from './SponsorsModal';
import { partnersApi } from '@/lib/api/partners';

export function SponsorOfTheDay() {
    const [showAll, setShowAll] = useState(false);
    const [apiPartners, setApiPartners] = useState<Sponsor[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (FLAGS.FEATURE_PARTNERS_API) {
            partnersApi.getActive().then(res => {
                if (res.data && res.data.length > 0) {
                    // Normalize DB Parter to local Sponsor interface
                    const normalized: Sponsor[] = res.data.map(p => ({
                        id: p.id,
                        name: p.name,
                        logo: p.logo_url || '',
                        url: p.link_url,
                        tagline: p.tagline || ''
                    }));
                    setApiPartners(normalized);
                }
                setLoading(false);
            });
        } else {
            setLoading(false);
        }
    }, []);

    if (!FLAGS.FEATURE_DEVOTIONAL_SPONSOR_HIGHLIGHT) return null;

    // Use API data if available, otherwise local Fallback
    const sourceData = apiPartners.length > 0 ? apiPartners : SPONSORS;
    if (sourceData.length === 0 && !loading) return null;

    // Deterministic selection based on date hash
    const sponsor = useMemo(() => {
        if (sourceData.length === 0) return null;
        const today = new Date().toISOString().split('T')[0]; // YYYY-MM-DD
        let hash = 0;
        for (let i = 0; i < today.length; i++) {
            hash = ((hash << 5) - hash) + today.charCodeAt(i);
            hash |= 0;
        }
        const index = Math.abs(hash) % sourceData.length;
        return sourceData[index];
    }, [sourceData]); // Re-calculate when sourceData changes

    if (!sponsor) return null;

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

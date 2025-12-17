import { Heart, HandHeart } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { analytics } from '@/lib/analytics';
import { FLAGS } from '@/lib/flags';

export function DonateBlock() {
    const navigate = useNavigate();

    if (!FLAGS.FEATURE_DEVOTIONAL_SUPPORT_BLOCK) return null;

    const handleDonate = () => {
        analytics.track({ name: 'feature_usage', element: 'donate_btn', context: 'member', metadata: { source: 'devotional_footer' } });
        navigate('/doe');
    };

    const handlePartner = () => {
        analytics.track({ name: 'feature_usage', element: 'sponsor_btn', context: 'member', metadata: { source: 'devotional_footer' } });
        navigate('/seja-parceiro');
    };

    return (
        <div className="p-6 bg-gradient-to-br from-indigo-50 to-white rounded-2xl border border-indigo-100 shadow-sm relative overflow-hidden">
            <div className="flex flex-col items-center text-center gap-4 relative z-10">
                <div className="w-12 h-12 rounded-full bg-white flex items-center justify-center shadow-sm text-rose-500 shrink-0">
                    <Heart className="w-6 h-6 fill-rose-50" />
                </div>
                <div className="w-full">
                    <h3 className="font-serif font-bold text-slate-900 text-lg mb-1">Apoie a Obra</h3>
                    <p className="text-slate-600 text-sm leading-relaxed mb-4 max-w-sm mx-auto">
                        Se este conteúdo te edificou, ajude a manter o projeto no ar e ampliar o alcance.
                    </p>
                    <div className="flex flex-col sm:flex-row gap-2">
                        <button
                            onClick={handleDonate}
                            className="flex-1 bg-rose-600 text-white text-sm font-bold py-2.5 px-4 rounded-xl shadow-lg shadow-rose-200 hover:bg-rose-700 hover:shadow-xl active:scale-95 transition-all text-center flex items-center justify-center"
                        >
                            DOE agora
                        </button>
                        <button
                            onClick={handlePartner}
                            className="flex-1 bg-white text-indigo-700 border border-indigo-200 text-sm font-bold py-2.5 px-4 rounded-xl hover:bg-indigo-50 active:scale-95 transition-all text-center flex items-center justify-center gap-2"
                        >
                            <HandHeart className="w-4 h-4" />
                            Seja um patrocinador
                        </button>
                    </div>
                </div>
            </div>
            {/* Decor */}
            <div className="absolute top-0 right-0 w-32 h-32 bg-indigo-100/50 rounded-full blur-3xl -mr-10 -mt-10 pointer-events-none" />
        </div>
    );
}

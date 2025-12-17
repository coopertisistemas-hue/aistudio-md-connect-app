import { X, ExternalLink } from 'lucide-react';
import { SPONSORS } from '@/lib/data/sponsors';

interface SponsorsModalProps {
    isOpen: boolean;
    onClose: () => void;
}

export function SponsorsModal({ isOpen, onClose }: SponsorsModalProps) {
    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-4 animate-in fade-in duration-200">
            {/* Backdrop */}
            <div
                className="absolute inset-0 bg-black/40 backdrop-blur-sm"
                onClick={onClose}
            />

            {/* Modal */}
            <div className="bg-white w-full max-w-md rounded-2xl shadow-2xl relative z-10 overflow-hidden animate-in slide-in-from-bottom-10 duration-300">
                <div className="flex items-center justify-between p-4 border-b border-slate-100 bg-slate-50/50">
                    <h3 className="font-bold text-slate-800">Nossos Patrocinadores</h3>
                    <button
                        onClick={onClose}
                        className="p-2 -mr-2 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-full transition-colors"
                    >
                        <X className="w-5 h-5" />
                    </button>
                </div>

                <div className="p-4 max-h-[60vh] overflow-y-auto space-y-3">
                    {SPONSORS.map(sponsor => (
                        <a
                            key={sponsor.id}
                            href={sponsor.url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex items-center gap-4 p-3 rounded-xl border border-slate-100 hover:border-indigo-100 hover:bg-indigo-50/30 transition-all group"
                        >
                            <div className="w-12 h-12 rounded-lg bg-slate-100 overflow-hidden shrink-0 border border-slate-100">
                                {sponsor.logo ? (
                                    <img src={sponsor.logo} alt={sponsor.name} className="w-full h-full object-cover" />
                                ) : (
                                    <div className="w-full h-full bg-indigo-100 flex items-center justify-center text-indigo-500 font-bold">
                                        {sponsor.name[0]}
                                    </div>
                                )}
                            </div>
                            <div className="flex-1">
                                <h4 className="font-bold text-slate-900 text-sm group-hover:text-indigo-700 transition-colors">
                                    {sponsor.name}
                                </h4>
                                <p className="text-xs text-slate-500">{sponsor.tagline}</p>
                            </div>
                            <ExternalLink className="w-4 h-4 text-slate-300 group-hover:text-indigo-400" />
                        </a>
                    ))}

                    <div className="mt-6 pt-4 border-t border-slate-100 text-center">
                        <p className="text-xs text-slate-400 mb-3">Gostaria de apoiar este projeto?</p>
                        <a
                            href="/seja-parceiro"
                            className="inline-block px-4 py-2 bg-slate-900 text-white text-xs font-bold rounded-full hover:bg-slate-800 transition-colors"
                        >
                            Seja um Patrocinador
                        </a>
                    </div>
                </div>
            </div>
        </div>
    );
}

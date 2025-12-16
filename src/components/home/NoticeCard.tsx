import { Pin, Calendar, ArrowRight } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

interface NoticeCardProps {
    notice: any;
}

export function NoticeCard({ notice }: NoticeCardProps) {
    const navigate = useNavigate();

    if (!notice) return null;

    return (
        <div className="px-6 mb-8 animate-in fade-in slide-in-from-bottom-4 duration-700 delay-100">
            <div className="flex items-center justify-between mb-3 px-1">
                <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider">Aviso da Semana</h3>
            </div>

            <div
                onClick={() => navigate(`/notices/${notice.id}`)}
                className="bg-white rounded-2xl p-5 border border-slate-100 shadow-sm active:scale-[0.98] transition-all cursor-pointer group relative overflow-hidden"
            >
                {/* Decorative Accents */}
                <div className="absolute top-0 right-0 w-16 h-16 bg-gradient-to-bl from-blue-50 to-transparent rounded-bl-full opacity-50"></div>

                <div className="flex justify-between items-start gap-3 relative z-10">
                    <div className="flex-1">
                        <div className="flex items-center gap-2 mb-2">
                            {notice.is_pinned && (
                                <span className="bg-amber-100 text-amber-700 text-[10px] font-bold px-2 py-0.5 rounded-full flex items-center gap-1">
                                    <Pin className="w-3 h-3" /> Fixo
                                </span>
                            )}
                            <span className="text-[10px] text-slate-400 font-medium flex items-center gap-1">
                                <Calendar className="w-3 h-3" />
                                {new Date(notice.created_at).toLocaleDateString('pt-BR', { day: 'numeric', month: 'short' })}
                            </span>
                        </div>
                        <h4 className="font-bold text-slate-800 text-base leading-snug line-clamp-2 mb-1 group-hover:text-blue-600 transition-colors">
                            {notice.title}
                        </h4>
                        <p className="text-slate-500 text-sm line-clamp-2 leading-relaxed">
                            {notice.body}
                        </p>
                    </div>
                </div>

                <div className="mt-3 flex items-center text-xs font-bold text-blue-600 opacity-0 group-hover:opacity-100 transition-opacity transform translate-x-[-10px] group-hover:translate-x-0 duration-300">
                    Ler aviso completo <ArrowRight className="w-3 h-3 ml-1" />
                </div>
            </div>
        </div>
    );
}

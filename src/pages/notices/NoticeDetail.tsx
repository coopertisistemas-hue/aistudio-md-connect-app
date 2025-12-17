
import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { feedService, type FeedItem } from '@/services/feed';
import { ArrowLeft, Calendar, Share2, AlertTriangle } from 'lucide-react';
import { BackLink } from '@/components/ui/BackLink';


export default function NoticeDetail() {
    const { id } = useParams();
    const navigate = useNavigate();
    const [notice, setNotice] = useState<FeedItem | null>(null);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        if (!id) return;
        feedService.getNoticeById(id)
            .then(setNotice)
            .catch(console.error)
            .finally(() => setIsLoading(false));
    }, [id]);

    if (isLoading) return <div className="p-8 text-center text-slate-400">Carregando...</div>;
    if (!notice) return <div className="p-8 text-center text-slate-500">Aviso não encontrado.</div>;

    const handleShare = () => {
        if (navigator.share) {
            navigator.share({
                title: notice.title,
                text: notice.content || notice.body,
                url: window.location.href
            });
        }
    };

    return (
        <div className="min-h-screen bg-white pb-safe">
            {/* Header */}
            <div className="sticky top-0 bg-white/90 backdrop-blur-md z-20 border-b border-slate-100 px-4 py-3 flex items-center justify-between">
                <BackLink className="-ml-2" />
                <div className="flex gap-2">
                    <button onClick={handleShare} className="p-2 rounded-full hover:bg-slate-50 text-slate-700">
                        <Share2 className="h-5 w-5" />
                    </button>
                </div>
            </div>

            <div className="px-5 py-6 space-y-6">
                {/* Meta */}
                <div className="space-y-3">
                    <div className="flex flex-wrap gap-2">
                        {notice.priority === 'high' && (
                            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-red-100 text-red-700 text-xs font-bold uppercase tracking-wide">
                                <AlertTriangle className="h-3 w-3" /> Urgente
                            </span>
                        )}
                        <span className="inline-flex items-center px-3 py-1 rounded-full bg-blue-50 text-blue-700 text-xs font-bold uppercase tracking-wide">
                            {notice.type === 'notice' ? 'Comunicado' : 'Notícia'}
                        </span>
                    </div>

                    <h1 className="text-2xl font-bold text-slate-900 leading-tight">
                        {notice.title}
                    </h1>
                    {notice.subtitle && <p className="text-lg text-slate-600 font-medium leading-normal">{notice.subtitle}</p>}

                    <div className="flex items-center gap-2 text-sm text-slate-500">
                        <Calendar className="h-4 w-4" />
                        <span>{new Date(notice.starts_at || notice.published_at || "").toLocaleDateString('pt-BR', {
                            weekday: 'long',
                            day: 'numeric',
                            month: 'long'
                        })}</span>
                    </div>
                </div>

                <hr className="border-slate-100" />

                {/* Content */}
                <div className="prose prose-slate prose-lg max-w-none text-slate-700 leading-relaxed whitespace-pre-wrap">
                    {notice.content || notice.body}
                </div>

                {/* CTA Button */}
                {notice.cta_type && notice.cta_type !== null && (
                    <div className="mt-8">
                        <a
                            href={notice.cta_href}
                            target={notice.cta_type === 'internal' ? '_self' : '_blank'}
                            rel="noreferrer"
                            className={`block w-full py-3.5 px-4 rounded-xl text-center font-bold text-white shadow-lg transform active:scale-[0.98] transition-all
                                ${notice.cta_type === 'whatsapp' ? 'bg-[#25D366] hover:bg-[#128C7E]' : 'bg-blue-600 hover:bg-blue-700'}
                            `}
                        >
                            {notice.cta_label || (notice.cta_type === 'whatsapp' ? 'Conversar no WhatsApp' : 'Acessar Link')}
                        </a>
                    </div>
                )}

                {/* Footer / CTA Area (Optional) */}
                <div className="pt-8 text-center text-xs text-slate-400">
                    MD Connect • Comunicação Oficial
                </div>
            </div>
        </div>
    );
}

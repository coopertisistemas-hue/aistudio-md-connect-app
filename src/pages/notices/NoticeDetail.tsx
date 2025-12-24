import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { feedService, type FeedItem } from '@/services/feed';
import { Calendar, Share2, AlertTriangle, Bell } from 'lucide-react';
import { InternalPageLayout } from '@/components/layout/InternalPageLayout';

export default function NoticeDetail() {
    const { id } = useParams();
    const [notice, setNotice] = useState<FeedItem | null>(null);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        if (!id) return;
        feedService.getNoticeById(id)
            .then(setNotice)
            .catch(console.error)
            .finally(() => setIsLoading(false));
    }, [id]);

    const handleShare = () => {
        if (navigator.share && notice) {
            navigator.share({
                title: notice.title,
                text: notice.content || notice.body,
                url: window.location.href
            });
        }
    };

    if (isLoading) {
        return (
            <InternalPageLayout
                title="Aviso"
                subtitle="Informações e comunicados com clareza."
                icon={Bell}
                iconClassName="text-blue-500"
                backPath="/home"
            >
                <div className="p-8 text-center text-slate-400">Carregando...</div>
            </InternalPageLayout>
        );
    }

    if (!notice) {
        return (
            <InternalPageLayout
                title="Aviso"
                subtitle="Informações e comunicados com clareza."
                icon={Bell}
                iconClassName="text-blue-500"
                backPath="/mural"
            >
                <div className="p-8 text-center text-slate-500">Aviso não encontrado.</div>
            </InternalPageLayout>
        );
    }

    return (
        <InternalPageLayout
            title={notice.title}
            subtitle="Informações e comunicados com clareza."
            icon={Bell}
            iconClassName="text-blue-500"
            backPath="/mural"
            actions={
                <button onClick={handleShare} className="p-2 rounded-full hover:bg-slate-100 text-slate-700">
                    <Share2 className="h-5 w-5" />
                </button>
            }
        >
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
            </div>
        </InternalPageLayout>
    );
}

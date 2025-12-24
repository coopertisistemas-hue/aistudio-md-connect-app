import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { Calendar, MapPin, Clock, Share2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { eventService, type ChurchEvent } from '@/services/event';
import { format, parseISO } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { InternalPageLayout } from '@/components/layout/InternalPageLayout';

export default function EventDetail() {
    const { id } = useParams<{ id: string }>();
    const [event, setEvent] = useState<ChurchEvent | null>(null);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        if (id) {
            eventService.getEventById(id).then(data => {
                setEvent(data);
            }).catch(err => {
                console.error(err);
            }).finally(() => {
                setIsLoading(false);
            });
        }
    }, [id]);

    const handleShare = async () => {
        if (navigator.share && event) {
            try {
                await navigator.share({
                    title: event.title,
                    text: `Convite para: ${event.title}`,
                    url: window.location.href,
                });
            } catch (error) {
                console.log('Error sharing', error);
            }
        }
    };

    const addToCalendar = () => {
        if (!event) return;
        const start = formatDate(event.starts_at);
        const end = event.ends_at ? formatDate(event.ends_at) : formatDate(event.starts_at, 2);

        const url = `https://calendar.google.com/calendar/render?action=TEMPLATE&text=${encodeURIComponent(event.title)}&dates=${start}/${end}&details=${encodeURIComponent(event.description || '')}&location=${encodeURIComponent(event.location || '')}`;
        window.open(url, '_blank');
    };

    const formatDate = (dateStr: string, addHours = 0) => {
        const d = new Date(dateStr);
        d.setHours(d.getHours() + addHours);
        return d.toISOString().replace(/-|:|\.\d\d\d/g, "");
    };

    if (isLoading) {
        return (
            <InternalPageLayout
                title="Evento"
                subtitle="Detalhes e programação."
                icon={Calendar}
                iconClassName="text-orange-500"
                backPath="/agenda"
            >
                <div className="p-8 text-center">Carregando...</div>
            </InternalPageLayout>
        );
    }

    if (!event) {
        return (
            <InternalPageLayout
                title="Evento"
                subtitle="Detalhes e programação."
                icon={Calendar}
                iconClassName="text-orange-500"
                backPath="/agenda"
            >
                <div className="p-8 text-center">Evento não encontrado.</div>
            </InternalPageLayout>
        );
    }

    const date = parseISO(event.starts_at);

    return (
        <InternalPageLayout
            title={event.title}
            subtitle="Detalhes e programação."
            icon={Calendar}
            iconClassName="text-orange-500"
            backPath="/agenda"
            showFooter={false}
            actions={
                <Button variant="ghost" size="icon" onClick={handleShare} className="hover:bg-slate-100">
                    <Share2 className="h-5 w-5" />
                </Button>
            }
        >
            {/* Header Image */}
            <div className="relative h-64 w-full bg-slate-200">
                {event.cover_image_url ? (
                    <img src={event.cover_image_url} alt={event.title} className="w-full h-full object-cover" />
                ) : (
                    <div className="absolute inset-0 flex items-center justify-center text-slate-400 bg-slate-100">
                        <Calendar className="w-16 h-16 opacity-20" />
                    </div>
                )}
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>

                <div className="absolute bottom-0 left-0 p-6 w-full">
                    {event.featured && (
                        <span className="inline-block px-2 py-0.5 mb-2 rounded bg-yellow-400 text-yellow-900 text-[10px] font-bold uppercase tracking-wide">
                            Destaque
                        </span>
                    )}
                    {event.event_type && (
                        <p className="text-white/80 text-sm font-medium capitalize">{event.event_type}</p>
                    )}
                </div>
            </div>

            <div className="p-6 space-y-8 -mt-4 bg-white rounded-t-3xl relative z-10">
                {/* Key Info */}
                <div className="grid grid-cols-2 gap-4">
                    <div className="bg-slate-50 p-4 rounded-xl border border-slate-100 flex flex-col items-center text-center">
                        <Clock className="w-6 h-6 text-blue-500 mb-2" />
                        <span className="text-xs text-slate-500 font-bold uppercase">Data & Hora</span>
                        <p className="text-sm font-bold text-slate-800 mt-1">{format(date, "dd 'de' MMM", { locale: ptBR })}</p>
                        <p className="text-xs text-slate-600">{format(date, "HH:mm")}</p>
                    </div>
                    <div className="bg-slate-50 p-4 rounded-xl border border-slate-100 flex flex-col items-center text-center">
                        <MapPin className="w-6 h-6 text-red-500 mb-2" />
                        <span className="text-xs text-slate-500 font-bold uppercase">Local</span>
                        <p className="text-xs font-bold text-slate-800 mt-1 line-clamp-2">{event.location || 'Online'}</p>
                        <a href={`https://maps.google.com/?q=${event.location}`} target="_blank" className="text-[10px] text-blue-600 underline mt-1">Ver no mapa</a>
                    </div>
                </div>

                {/* Description */}
                <div>
                    <h3 className="font-bold text-slate-800 mb-2 text-lg">Sobre o Evento</h3>
                    <p className="text-slate-600 leading-relaxed text-sm whitespace-pre-wrap">{event.description || 'Sem descrição.'}</p>
                </div>

                {/* Tags */}
                {event.audience_tags && event.audience_tags.length > 0 && (
                    <div className="flex flex-wrap gap-2">
                        {event.audience_tags.map(tag => (
                            <span key={tag} className="px-3 py-1 bg-slate-100 text-slate-600 rounded-full text-xs font-bold uppercase">
                                # {tag}
                            </span>
                        ))}
                    </div>
                )}
            </div>

            {/* Sticky Action Footer */}
            <div className="fixed bottom-0 left-0 right-0 p-4 bg-white border-t border-slate-100 shadow-lg flex flex-col gap-3 pb-8 safe-area-bottom">
                <Button className="w-full bg-slate-900 text-white hover:bg-slate-800" onClick={addToCalendar}>
                    <Calendar className="mr-2 h-4 w-4" /> Adicionar ao Calendário
                </Button>

                {event.cta_type && event.cta_type !== 'none' && (
                    <Button
                        className={`w-full ${event.cta_type === 'whatsapp' ? 'bg-[#25D366] hover:bg-[#128C7E]' : 'bg-blue-600 hover:bg-blue-700'}`}
                        onClick={() => window.open(event.cta_href, '_blank')}
                    >
                        {event.cta_type === 'whatsapp' ? 'Falar no WhatsApp' : (event.cta_label || 'Acessar Link')}
                    </Button>
                )}
            </div>
        </InternalPageLayout>
    );
}

import { useState, useEffect } from 'react';
import { Calendar as CalendarIcon, MapPin } from 'lucide-react';
import { PortalSection } from '@/components/ui/PortalComponents';
import { eventService, type ChurchEvent } from '@/services/event';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { useNavigate } from 'react-router-dom';

export function NextEventsWidget() {
    const [events, setEvents] = useState<ChurchEvent[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const navigate = useNavigate();

    useEffect(() => {
        eventService.getEvents(5).then(data => {
            setEvents(data);
        }).finally(() => {
            setIsLoading(false);
        });
    }, []);

    const handleEventClick = (id: string) => {
        navigate(`/events/${id}`);
    };

    const handleAgendaClick = () => {
        navigate('/events');
    };

    if (isLoading) {
        return (
            <PortalSection title="Próximos Eventos" icon={CalendarIcon} actionLabel="Agenda completa" onAction={handleAgendaClick}>
                <div className="flex space-x-3 overflow-x-auto pb-2 scrollbar-hide">
                    {[1, 2].map(i => (
                        <div key={i} className="min-w-[160px] h-24 bg-slate-50 animate-pulse rounded-xl border border-slate-100"></div>
                    ))}
                </div>
            </PortalSection>
        );
    }

    if (events.length === 0) {
        return (
            <PortalSection title="Próximos Eventos" icon={CalendarIcon} actionLabel="Agenda completa" onAction={handleAgendaClick}>
                <div className="p-4 bg-slate-50 rounded-xl border border-slate-100 text-center">
                    <p className="text-sm text-slate-500">Nenhum evento agendado em breve.</p>
                </div>
            </PortalSection>
        );
    }

    return (
        <PortalSection title="Próximos Eventos" icon={CalendarIcon} actionLabel="Agenda completa" onAction={handleAgendaClick}>
            <div className="flex space-x-3 overflow-x-auto pb-2 scrollbar-hide snap-x">
                {events.map(event => {
                    const date = new Date(event.starts_at);
                    const day = format(date, 'dd', { locale: ptBR });
                    const month = format(date, 'MMM', { locale: ptBR }).toUpperCase();
                    const weekday = format(date, 'EEE', { locale: ptBR }).toUpperCase();
                    const time = format(date, 'HH:mm');

                    return (
                        <div
                            key={event.id}
                            onClick={() => handleEventClick(event.id)}
                            className="min-w-[160px] bg-white border border-slate-100 rounded-xl p-3 shadow-sm flex flex-col items-start active:bg-slate-50 transition-colors snap-center cursor-pointer relative overflow-hidden"
                        >
                            {event.featured && (
                                <div className="absolute top-0 right-0 w-3 h-3 bg-yellow-400 rounded-bl-lg"></div>
                            )}
                            <div className={`
                                font-bold text-xs px-2 py-1 rounded-md mb-2
                                ${event.event_type === 'culto' ? 'bg-blue-50 text-blue-600' :
                                    event.event_type === 'ensaio' ? 'bg-purple-50 text-purple-600' : 'bg-red-50 text-red-600'}
                            `}>
                                {weekday}, {day} {month}
                            </div>
                            <h4 className="font-bold text-slate-800 text-sm leading-tight mb-1 line-clamp-2">{event.title}</h4>
                            <p className="text-xs text-slate-500 mb-0.5">{time}h</p>
                            {event.location && (
                                <div className="flex items-center text-[10px] text-slate-400 mt-auto pt-1">
                                    <MapPin className="w-3 h-3 mr-0.5" />
                                    <span className="truncate max-w-[100px]">{event.location}</span>
                                </div>
                            )}
                        </div>
                    );
                })}
                <div
                    onClick={handleAgendaClick}
                    className="min-w-[100px] bg-white border border-slate-100 rounded-xl p-3 shadow-sm flex flex-col items-center justify-center active:bg-slate-50 transition-colors snap-center cursor-pointer"
                >
                    <p className="text-xs text-blue-600 font-bold">Ver todos</p>
                </div>
            </div>
        </PortalSection>
    );
}

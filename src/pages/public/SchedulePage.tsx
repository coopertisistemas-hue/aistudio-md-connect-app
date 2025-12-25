import React, { useEffect, useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Calendar, MapPin, Clock, CalendarX } from 'lucide-react';
import { toast } from 'sonner';
import { InternalPageLayout } from '@/components/layout/InternalPageLayout';

interface CalendarEvent {
    id: string;
    title: string;
    description?: string;
    starts_at: string;
    location?: string;
    status: string;
}

const getMemberEvents = async () => {
    const res = await fetch(`${import.meta.env.VITE_SUPABASE_URL}/functions/v1/member-events`);
    if (!res.ok) throw new Error('Falha ao carregar eventos');
    const json = await res.json();
    return json.data as CalendarEvent[];
};

const SchedulePage: React.FC = () => {
    const [events, setEvents] = useState<CalendarEvent[]>([]);
    const [loading, setLoading] = useState(true);
    const [filter, setFilter] = useState<'upcoming' | 'month' | 'all'>('upcoming');

    useEffect(() => {
        const load = async () => {
            try {
                const data = await getMemberEvents();
                setEvents(data || []);
            } catch (error) {
                console.error("API Error, using mock:", error);
                // MOCK FALLBACK for Demo
                setEvents([
                    {
                        id: '1', title: 'Culto da Família',
                        starts_at: new Date(new Date().setDate(new Date().getDate() + 1)).toISOString(), // Tomorrow
                        location: 'Templo Sede', status: 'published',
                        description: 'Venha participar conosco deste momento especial.'
                    },
                    {
                        id: '2', title: 'Escola Dominical',
                        starts_at: new Date(new Date().setDate(new Date().getDate() + 3)).toISOString(), // +3 days
                        location: 'Auditório', status: 'published'
                    }
                ]);
                toast.info("Modo Demo: Exibindo eventos de exemplo.");
            } finally {
                setLoading(false);
            }
        };
        load();
    }, []);

    const filteredEvents = events.filter(event => {
        const date = new Date(event.starts_at);
        const now = new Date();

        if (filter === 'upcoming') {
            // Logic: Show all future events (default API behavior), maybe limit top 5? 
            // Or just keep as is (all future). The prompt says "Próximos".
            return true;
        }
        if (filter === 'month') {
            return date.getMonth() === now.getMonth() && date.getFullYear() === now.getFullYear();
        }
        return true; // 'all'
    });

    const formatDate = (isoString: string) => {
        const date = new Date(isoString);
        return {
            day: date.getDate(),
            month: date.toLocaleString('pt-BR', { month: 'short' }).toUpperCase().replace('.', ''),
            weekday: date.toLocaleString('pt-BR', { weekday: 'long' }),
            time: date.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })
        };
    };

    return (
        <InternalPageLayout
            title="Agenda"
            subtitle="Programações e eventos."
            icon={Calendar}
            iconClassName="text-amber-600"
            backPath="/home"
        >
            <div className="max-w-2xl mx-auto px-4 space-y-6">
                <div className="flex flex-col gap-4">

                    {/* Filters */}
                    <div className="flex gap-2 pb-2 overflow-x-auto no-scrollbar mask-gradient">
                        <button
                            onClick={() => setFilter('upcoming')}
                            className={`px-4 py-1.5 rounded-full text-sm font-medium transition-all whitespace-nowrap
                            ${filter === 'upcoming' ? 'bg-amber-100 text-amber-800' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'}
                        `}
                        >
                            Próximos
                        </button>
                        <button
                            onClick={() => setFilter('month')}
                            className={`px-4 py-1.5 rounded-full text-sm font-medium transition-all whitespace-nowrap
                            ${filter === 'month' ? 'bg-amber-100 text-amber-800' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'}
                        `}
                        >
                            Este Mês
                        </button>
                        <button
                            onClick={() => setFilter('all')}
                            className={`px-4 py-1.5 rounded-full text-sm font-medium transition-all whitespace-nowrap
                            ${filter === 'all' ? 'bg-amber-100 text-amber-800' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'}
                        `}
                        >
                            Todos
                        </button>
                    </div>
                </div>

                {loading ? (
                    <div className="space-y-4">
                        {[1, 2, 3].map(i => (
                            <div key={i} className="h-28 bg-slate-100 animate-pulse rounded-2xl" />
                        ))}
                    </div>
                ) : filteredEvents.length === 0 ? (
                    <Card className="border-none shadow-sm bg-slate-50 py-12 text-center">
                        <CardContent className="flex flex-col items-center gap-4">
                            <div className="bg-white p-4 rounded-full shadow-sm">
                                <CalendarX className="h-8 w-8 text-slate-300" />
                            </div>
                            <div>
                                <h3 className="text-lg font-semibold text-slate-700">Nada encontrado</h3>
                                <p className="text-muted-foreground">Nenhum evento neste período.</p>
                            </div>
                        </CardContent>
                    </Card>
                ) : (
                    <div className="space-y-4">
                        {filteredEvents.map((event) => {
                            const date = formatDate(event.starts_at);
                            return (
                                <Card key={event.id} className="border-none shadow-sm hover:shadow-md transition-shadow overflow-hidden group bg-white/80 backdrop-blur-sm">
                                    <CardContent className="p-0 flex flex-row h-full items-stretch">
                                        {/* Date Block */}
                                        <div className="bg-amber-50 w-24 flex flex-col items-center justify-center p-2 border-r border-amber-100 group-hover:bg-amber-100 transition-colors shrink-0">
                                            <span className="text-amber-600 font-bold text-3xl">{date.day}</span>
                                            <span className="text-amber-800 text-xs font-bold tracking-wider">{date.month}</span>
                                            <span className="text-amber-600/60 text-[10px] mt-1 capitalize text-center leading-tight w-full truncate px-1">
                                                {date.weekday.split('-')[0]}
                                            </span>
                                        </div>

                                        {/* Content Block */}
                                        <div className="p-4 flex-1 flex flex-col justify-center gap-1.5 min-w-0">
                                            <h3 className="text-lg font-bold text-slate-900 leading-tight truncate pr-2" title={event.title}>
                                                {event.title}
                                            </h3>

                                            <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-sm text-slate-500 font-medium">
                                                <span className="flex items-center gap-1.5 bg-slate-100 px-2 py-0.5 rounded-full shrink-0">
                                                    <Clock className="w-3.5 h-3.5" />
                                                    {date.time}
                                                </span>
                                                {event.location && (
                                                    <span className="flex items-center gap-1.5 shrink-0 truncate max-w-[150px]" title={event.location}>
                                                        <MapPin className="w-3.5 h-3.5" />
                                                        {event.location}
                                                    </span>
                                                )}
                                            </div>

                                            {event.description && (
                                                <p className="text-slate-600 text-sm leading-snug line-clamp-2 mt-1">
                                                    {event.description}
                                                </p>
                                            )}
                                        </div>
                                    </CardContent>
                                </Card>
                            );
                        })}
                    </div>
                )}
            </div>
        </InternalPageLayout>
    );
};

export default SchedulePage;

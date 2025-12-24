import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Calendar, MapPin, Clock, Search } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { eventService, type ChurchEvent } from '@/services/event';
import { format, parseISO } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { InternalPageLayout } from '@/components/layout/InternalPageLayout';

export default function Agenda() {
    const navigate = useNavigate();
    const [events, setEvents] = useState<ChurchEvent[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedTag, setSelectedTag] = useState<string | null>(null);

    useEffect(() => {
        // Fetch more events for the full agenda
        eventService.getEvents(50).then(data => {
            setEvents(data);
        }).finally(() => {
            setIsLoading(false);
        });
    }, []);

    const filteredEvents = events.filter(event => {
        const matchesSearch = event.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
            (event.location || '').toLowerCase().includes(searchTerm.toLowerCase());
        const matchesTag = selectedTag ? event.audience_tags?.includes(selectedTag) : true;
        return matchesSearch && matchesTag;
    });

    // Extract all unique tags
    const allTags = Array.from(new Set(events.flatMap(e => e.audience_tags || [])));

    // Group events by Month
    const groupedEvents: { [key: string]: ChurchEvent[] } = {};
    filteredEvents.forEach(event => {
        const monthKey = format(parseISO(event.starts_at), 'MMMM yyyy', { locale: ptBR });
        if (!groupedEvents[monthKey]) groupedEvents[monthKey] = [];
        groupedEvents[monthKey].push(event);
    });

    return (
        <InternalPageLayout
            title="Agenda Completa"
            subtitle="Acompanhe os próximos eventos e programações."
            icon={Calendar}
            iconClassName="text-orange-500"
            backPath="/home"
        >
            <div className="px-5 pb-4">
                {/* Search & Filter */}
                <div className="space-y-3 mb-6">
                    <div className="relative">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                        <Input
                            placeholder="Buscar eventos..."
                            className="pl-9 bg-slate-50 border-slate-200"
                            value={searchTerm}
                            onChange={(e: React.ChangeEvent<HTMLInputElement>) => setSearchTerm(e.target.value)}
                        />
                    </div>

                    {allTags.length > 0 && (
                        <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide">
                            <button
                                onClick={() => setSelectedTag(null)}
                                className={`px-3 py-1.5 rounded-full text-xs font-bold whitespace-nowrap border transition-colors
                                    ${selectedTag === null ? 'bg-slate-800 text-white border-slate-800' : 'bg-white text-slate-600 border-slate-200'}
                                `}
                            >
                                Todos
                            </button>
                            {allTags.map(tag => (
                                <button
                                    key={tag}
                                    onClick={() => setSelectedTag(tag === selectedTag ? null : tag)}
                                    className={`px-3 py-1.5 rounded-full text-xs font-bold whitespace-nowrap border transition-colors uppercase
                                        ${selectedTag === tag ? 'bg-blue-600 text-white border-blue-600' : 'bg-white text-slate-600 border-slate-200'}
                                    `}
                                >
                                    {tag}
                                </button>
                            ))}
                        </div>
                    )}
                </div>

                {/* List */}
                <div className="space-y-8">
                    {isLoading ? (
                        <div className="space-y-4">
                            {[1, 2, 3].map(i => (
                                <div key={i} className="h-32 bg-slate-200 animate-pulse rounded-xl"></div>
                            ))}
                        </div>
                    ) : filteredEvents.length === 0 ? (
                        <div className="text-center py-10 text-slate-500">
                            <Calendar className="h-12 w-12 mx-auto mb-3 opacity-20" />
                            <p className="mb-4">Nenhum evento encontrado.</p>
                            <Button
                                variant="outline"
                                className="bg-white"
                                onClick={() => window.open('https://youtube.com/user/deuseamor', '_blank')}
                            >
                                Assistir Cultos Online
                            </Button>
                        </div>
                    ) : (
                        Object.entries(groupedEvents).map(([month, monthEvents]) => (
                            <div key={month} className="space-y-3">
                                <h2 className="text-sm font-bold text-slate-400 uppercase tracking-wider sticky top-[140px] bg-slate-50/95 py-2 backdrop-blur-sm z-0">
                                    {month}
                                </h2>
                                {monthEvents.map(event => {
                                    const date = parseISO(event.starts_at);
                                    return (
                                        <div
                                            key={event.id}
                                            onClick={() => navigate(`/events/${event.id}`)}
                                            className="bg-white p-4 rounded-xl border border-slate-100 shadow-sm active:scale-[0.99] transition-transform cursor-pointer relative overflow-hidden"
                                        >
                                            {event.featured && (
                                                <div className="absolute top-0 right-0 w-4 h-4 bg-yellow-400 rounded-bl-xl"></div>
                                            )}
                                            <div className="flex gap-4">
                                                {/* Date Box */}
                                                <div className="flex flex-col items-center justify-center bg-slate-50 rounded-lg w-14 h-14 border border-slate-100 shrink-0">
                                                    <span className="text-xs text-slate-500 font-bold uppercase">{format(date, 'MMM', { locale: ptBR })}</span>
                                                    <span className="text-xl font-bold text-slate-800 leading-none">{format(date, 'dd')}</span>
                                                </div>

                                                {/* Info */}
                                                <div className="flex-1 min-w-0">
                                                    <div className="flex justify-between items-start">
                                                        <h3 className="font-bold text-slate-800 leading-tight mb-1">{event.title}</h3>
                                                    </div>

                                                    <div className="flex items-center text-xs text-slate-500 gap-3">
                                                        <div className="flex items-center">
                                                            <Clock className="w-3 h-3 mr-1" />
                                                            {format(date, 'HH:mm')}
                                                        </div>
                                                        {event.event_type && (
                                                            <span className={`px-1.5 py-0.5 rounded text-[10px] font-bold uppercase
                                                                ${event.event_type === 'culto' ? 'bg-blue-50 text-blue-600' : 'bg-slate-100 text-slate-600'}
                                                            `}>
                                                                {event.event_type}
                                                            </span>
                                                        )}
                                                    </div>
                                                    {event.location && (
                                                        <div className="flex items-center text-xs text-slate-400 mt-1">
                                                            <MapPin className="w-3 h-3 mr-1" />
                                                            <span className="truncate">{event.location}</span>
                                                        </div>
                                                    )}
                                                </div>
                                            </div>
                                        </div>
                                    );
                                })}
                            </div>
                        ))
                    )}
                </div>
            </div>
        </InternalPageLayout>
    );
}

import { useState } from 'react';
import { formatDistanceToNow } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { Heart, Clock, Lock, ShieldCheck, User } from 'lucide-react';
import { cn } from '@/lib/utils';
import { prayerApi, type PrayerRequest } from '@/lib/api/prayer';
import { toast } from 'sonner';

interface PrayerRequestCardProps {
    request: PrayerRequest;
}

export function PrayerRequestCard({ request }: PrayerRequestCardProps) {
    const [reacted, setReacted] = useState(request.user_reacted || false);
    const [count, setCount] = useState(request.reaction_count || 0);
    const [loading, setLoading] = useState(false);

    const handleReaction = async () => {
        // Optimistic update
        const newState = !reacted;
        setReacted(newState);
        setCount(prev => newState ? prev + 1 : prev - 1);

        // Don't actually block UI on network call unless error
        try {
            setLoading(true);
            const { error } = await prayerApi.toggleReaction(request.id);
            if (error) throw error;
        } catch (err) {
            // Revert on error
            setReacted(!newState);
            setCount(prev => !newState ? prev + 1 : prev - 1);
            toast.error("Erro ao registrar oração. Tente novamente.");
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    const isUrgent = request.urgency === 'urgent';
    const isAnonymous = request.privacy === 'anonymous';

    return (
        <div className={cn(
            "bg-white rounded-2xl p-5 shadow-sm border border-slate-100 relative overflow-hidden transition-all hover:shadow-md",
            isUrgent && "border-l-4 border-l-rose-500"
        )}>
            {/* Header: User & Time */}
            <div className="flex items-start justify-between mb-3">
                <div className="flex items-center gap-3">
                    <div className={cn(
                        "w-10 h-10 rounded-full flex items-center justify-center shrink-0",
                        isAnonymous ? "bg-slate-100 text-slate-400" : "bg-indigo-50 text-indigo-600"
                    )}>
                        {isAnonymous ? <ShieldCheck className="w-5 h-5" /> : <User className="w-5 h-5" />}
                    </div>
                    <div>
                        <h4 className="font-semibold text-slate-800 text-sm leading-tight">
                            {isAnonymous ? "Pedido Anônimo" : "Irmão(ã)"}
                        </h4>
                        <div className="flex items-center gap-2 text-xs text-slate-400 mt-0.5">
                            <Clock className="w-3 h-3" />
                            <span>{formatDistanceToNow(new Date(request.created_at), { addSuffix: true, locale: ptBR })}</span>
                        </div>
                    </div>
                </div>

                {/* Badges */}
                <div className="flex flex-col items-end gap-1.5">
                    {isUrgent && (
                        <span className="bg-rose-50 text-rose-600 text-[10px] font-bold px-2 py-0.5 rounded-full uppercase tracking-wider">
                            Urgente
                        </span>
                    )}
                    <span className="bg-slate-50 text-slate-500 text-[10px] font-medium px-2 py-0.5 rounded-full capitalize">
                        {request.category}
                    </span>
                </div>
            </div>

            {/* Content */}
            <div className="mb-4">
                {request.title && <h3 className="font-bold text-slate-900 mb-1">{request.title}</h3>}
                <p className="text-slate-600 text-sm leading-relaxed whitespace-pre-wrap">
                    {request.description}
                </p>
            </div>

            {/* Footer: Actions */}
            <div className="flex items-center justify-between pt-3 border-t border-slate-50">
                <div className="flex items-center gap-1 text-xs text-slate-400 font-medium">
                    {request.privacy !== 'public' && (
                        <>
                            <Lock className="w-3 h-3" />
                            {request.privacy === 'team_only' ? 'Privado (Equipe)' : 'Restrito'}
                        </>
                    )}
                </div>

                <button
                    onClick={handleReaction}
                    disabled={loading}
                    className={cn(
                        "flex items-center gap-2 px-4 py-2 rounded-full text-sm font-bold transition-all active:scale-95",
                        reacted
                            ? "bg-rose-50 text-rose-600 ring-1 ring-rose-100 shadow-sm"
                            : "bg-slate-50 text-slate-500 hover:bg-slate-100"
                    )}
                >
                    <Heart className={cn("w-4 h-4 transition-all", reacted ? "fill-rose-500 scale-110" : "scale-100")} />
                    <span>{reacted ? 'Orando' : 'Estou orando'}</span>
                    {count > 0 && (
                        <span className={cn("ml-1 text-xs px-1.5 py-0.5 rounded-full", reacted ? "bg-rose-100/50" : "bg-slate-200/50")}>
                            {count}
                        </span>
                    )}
                </button>
            </div>
        </div>
    );
}

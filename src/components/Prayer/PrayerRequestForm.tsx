import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { Send, Loader2, Eye, EyeOff, ShieldCheck, Lock, Globe, Mail, Phone, CheckCircle2, Copy, ExternalLink } from 'lucide-react';
import { cn } from '@/lib/utils';
import { prayerApi } from '@/lib/api/prayer';
import type { CreatePrayerRequestPayload, PrayerRequest } from '@/lib/api/prayer';
import { supabase } from '@/lib/supabase';
import { PrayerRequestCard } from './PrayerRequestCard';
import { toast } from 'sonner';

interface PrayerRequestFormProps {
    onSuccess?: () => void;
}

const CATEGORIES = [
    { value: 'saude', label: 'Saúde' },
    { value: 'familia', label: 'Família' },
    { value: 'espiritual', label: 'Vida Espiritual' },
    { value: 'financeiro', label: 'Vida Financeira' },
    { value: 'gratidao', label: 'Agradecimento' },
    { value: 'outros', label: 'Outros' },
    { value: 'libertacao', label: 'Libertação' },
    { value: 'direcao', label: 'Direção' },
];

export function PrayerRequestForm({ onSuccess }: PrayerRequestFormProps) {
    const [preview, setPreview] = useState(false);
    const [successData, setSuccessData] = useState<{ id: string, protocol: string, contact_method: string, contact_value?: string } | null>(null);

    const { register, handleSubmit, watch, setValue, reset, formState: { isSubmitting, isValid, errors } } = useForm<CreatePrayerRequestPayload>({
        defaultValues: {
            description: '',
            category: 'outros',
            urgency: 'normal',
            privacy: 'public',
            contact_method: 'none',
            consent_contact: false
        },
        mode: 'onChange'
    });

    const values = watch();

    const onSubmit = async (data: CreatePrayerRequestPayload) => {
        try {
            const { data: result, error } = await prayerApi.create(data);
            if (error) throw error;

            // Format protocol/id for display - usually ID is UUID, we can just show first 8 chars or full ID
            const protocol = result.id.slice(0, 8).toUpperCase();

            setSuccessData({
                id: result.id,
                protocol: protocol,
                contact_method: data.contact_method || 'none',
                contact_value: data.contact_value
            });

            // Trigger Email Confirmation if applicable
            if (data.contact_method === 'email' && data.contact_value) {
                // Fire and forget - don't block UI on this
                supabase.functions.invoke('prayer-confirmation', {
                    body: {
                        contact_value: data.contact_value,
                        protocol: protocol,
                        category: data.category
                    }
                }).catch(err => console.error('Failed to send confirmation email:', err));
            }

            toast.success("Seu pedido foi recebido com sucesso!");
            reset();
            setPreview(false);
            // Call onSuccess later if needed, but we want to show success screen first
        } catch (err) {
            console.error(err);
            toast.error("Houve um problema ao enviar seu pedido. Tente novamente.");
        }
    };

    const handleCopyLink = () => {
        // Mock link for now - phase 2 will have real tracking page
        const link = `${window.location.origin}/oracao/acompanhar/${successData?.id}`;
        navigator.clipboard.writeText(link);
        toast.success("Link copiado para a área de transferência!");
    };

    const handleOpenWhatsapp = () => {
        if (!successData?.contact_value) return;
        // Clean phone number
        const phone = successData.contact_value.replace(/\D/g, '');
        const message = encodeURIComponent(`Olá! Recebemos seu pedido de oração.\nProtocolo: ${successData.protocol}\n\nEstaremos orando por você!`);
        window.open(`https://wa.me/${phone}?text=${message}`, '_blank');
    };

    // Render Success View
    if (successData) {
        return (
            <div className="flex flex-col items-center justify-center py-8 text-center animate-in fade-in zoom-in-95 duration-300">
                <div className="w-20 h-20 bg-emerald-100 rounded-full flex items-center justify-center mb-6">
                    <CheckCircle2 className="w-10 h-10 text-emerald-600" />
                </div>
                <h3 className="text-2xl font-bold text-slate-900 mb-2">Pedido Recebido!</h3>
                <p className="text-slate-600 mb-6 max-w-xs">
                    Sua intenção foi entregue aos nossos intercessores. Oramos para que Deus abençoe sua vida.
                </p>

                <div className="bg-slate-50 border border-slate-200 rounded-xl p-4 w-full mb-6">
                    <p className="text-xs uppercase tracking-wider text-slate-500 font-bold mb-1">Seu Protocolo</p>
                    <p className="text-3xl font-mono font-bold text-indigo-600 select-all">{successData.protocol}</p>
                </div>

                <div className="space-y-3 w-full">
                    <button
                        onClick={handleCopyLink}
                        className="w-full flex items-center justify-center gap-2 py-3 bg-white border border-slate-200 text-slate-700 font-medium rounded-xl hover:bg-slate-50 transition-colors"
                    >
                        <Copy className="w-4 h-4" />
                        Copiar Link de Acompanhamento
                    </button>

                    {successData.contact_method === 'whatsapp' && (
                        <button
                            onClick={handleOpenWhatsapp}
                            className="w-full flex items-center justify-center gap-2 py-3 bg-emerald-500 text-white font-bold rounded-xl hover:bg-emerald-600 transition-colors shadow-lg shadow-emerald-200"
                        >
                            <ExternalLink className="w-4 h-4" />
                            Abrir no WhatsApp
                        </button>
                    )}

                    <button
                        onClick={() => { setSuccessData(null); if (onSuccess) onSuccess(); }}
                        className="w-full py-3 text-sm text-indigo-600 font-medium hover:underline mt-2"
                    >
                        Fazer outro pedido
                    </button>
                </div>
            </div>
        );
    }

    // New Request Form
    const mockPreviewRequest: PrayerRequest = {
        id: 'preview',
        user_id: 'current',
        description: values.description || 'Seu pedido aparecerá assim...',
        category: values.category,
        urgency: values.urgency,
        privacy: values.privacy,
        status: 'open',
        created_at: new Date().toISOString(),
        reaction_count: 0,
        user_reacted: false
    };

    return (
        <div className="space-y-6">
            {/* Header & Preview Toggle */}
            <div className="flex items-center justify-between">
                <h3 className="text-lg font-bold text-slate-800">Novo Pedido</h3>
                <button
                    type="button"
                    onClick={() => setPreview(!preview)}
                    className="text-xs font-medium text-indigo-600 flex items-center gap-1.5 px-3 py-1.5 bg-indigo-50 rounded-full hover:bg-indigo-100 transition-colors"
                >
                    {preview ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
                    {preview ? 'Editar' : 'Prévia'}
                </button>
            </div>

            {preview ? (
                <div className="animate-in fade-in zoom-in-95 duration-200">
                    <p className="text-sm text-slate-500 mb-3 text-center">É assim que seu pedido aparecerá:</p>
                    <PrayerRequestCard request={mockPreviewRequest} />
                    <div className="mt-4 flex gap-3">
                        <button
                            onClick={() => setPreview(false)}
                            className="flex-1 py-3 text-sm font-medium text-slate-600 bg-slate-100 rounded-xl hover:bg-slate-200 transition-colors"
                        >
                            Voltar e Editar
                        </button>
                        <button
                            onClick={handleSubmit(onSubmit)}
                            disabled={isSubmitting}
                            className="flex-1 py-3 text-sm font-bold text-white bg-indigo-600 rounded-xl hover:bg-indigo-700 shadow-md shadow-indigo-200 flex items-center justify-center gap-2"
                        >
                            {isSubmitting ? <Loader2 className="w-4 h-4 animate-spin" /> : <Send className="w-4 h-4" />}
                            Confirmar Envio
                        </button>
                    </div>
                </div>
            ) : (
                <form onSubmit={handleSubmit(onSubmit)} className="space-y-5 animate-in fade-in slide-in-from-left-4 duration-300">
                    {/* Category & Urgency */}
                    <div className="grid grid-cols-2 gap-3">
                        <div className="space-y-1.5">
                            <label className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Categoria</label>
                            <select
                                {...register('category')}
                                className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm font-medium text-slate-700 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none"
                            >
                                {CATEGORIES.map(cat => (
                                    <option key={cat.value} value={cat.value}>{cat.label}</option>
                                ))}
                            </select>
                        </div>
                        <div className="space-y-1.5">
                            <label className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Urgência</label>
                            <div className="flex bg-slate-50 p-1 rounded-xl border border-slate-200">
                                <button
                                    type="button"
                                    onClick={() => setValue('urgency', 'normal')}
                                    className={cn("flex-1 py-1.5 text-xs font-medium rounded-lg transition-all", values.urgency === 'normal' ? "bg-white shadow-sm text-slate-700" : "text-slate-400")}
                                >
                                    Normal
                                </button>
                                <button
                                    type="button"
                                    onClick={() => setValue('urgency', 'urgent')}
                                    className={cn("flex-1 py-1.5 text-xs font-medium rounded-lg transition-all", values.urgency === 'urgent' ? "bg-rose-500 shadow-sm text-white" : "text-slate-400")}
                                >
                                    Urgente
                                </button>
                            </div>
                        </div>
                    </div>

                    {/* Description */}
                    <div className="space-y-1.5">
                        <label className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Seu Pedido</label>
                        <textarea
                            {...register('description', { required: true, minLength: 10 })}
                            placeholder="Descreva seu pedido de oração detalhadamente. Deus conhece seu coração..."
                            className="w-full p-4 bg-white border border-slate-200 rounded-xl min-h-[140px] text-slate-700 text-sm leading-relaxed resize-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none"
                        />
                        <div className="flex justify-end text-xs text-slate-400">
                            {values.description?.length || 0} caracteres
                        </div>
                    </div>

                    {/* Contact Preference Section (NEW) */}
                    <div className="space-y-3 pt-2">
                        <label className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Como quer receber retorno?</label>
                        <div className="grid grid-cols-3 gap-2">
                            {[
                                { val: 'none', label: 'App', icon: ShieldCheck },
                                { val: 'email', label: 'E-mail', icon: Mail },
                                { val: 'whatsapp', label: 'WhatsApp', icon: Phone }
                            ].map(opt => (
                                <button
                                    key={opt.val}
                                    type="button"
                                    onClick={() => setValue('contact_method', opt.val as any)}
                                    className={cn(
                                        "flex flex-col items-center justify-center gap-2 p-3 rounded-xl border transition-all",
                                        values.contact_method === opt.val
                                            ? "bg-indigo-50 border-indigo-200 text-indigo-700 ring-1 ring-indigo-200"
                                            : "bg-white border-slate-100 text-slate-500 hover:bg-slate-50"
                                    )}
                                >
                                    <opt.icon className="w-5 h-5" />
                                    <span className="text-xs font-bold">{opt.label}</span>
                                </button>
                            ))}
                        </div>

                        {/* Dynamic Inputs based on Contact Method */}
                        {values.contact_method === 'email' && (
                            <div className="animate-in slide-in-from-top-2 fade-in duration-200 space-y-2">
                                <input
                                    {...register('contact_value', {
                                        required: values.contact_method === 'email',
                                        pattern: /^[^\s@]+@[^\s@]+\.[^\s@]+$/
                                    })}
                                    placeholder="seu@email.com"
                                    className="w-full p-3 bg-white border border-slate-200 rounded-xl text-sm focus:ring-2 focus:ring-indigo-500 outline-none"
                                />
                                {errors.contact_value && <span className="text-xs text-rose-500">Email inválido</span>}
                            </div>
                        )}
                        {values.contact_method === 'whatsapp' && (
                            <div className="animate-in slide-in-from-top-2 fade-in duration-200 space-y-2">
                                <input
                                    {...register('contact_value', {
                                        required: values.contact_method === 'whatsapp',
                                        minLength: 10
                                    })}
                                    placeholder="(11) 99999-9999"
                                    className="w-full p-3 bg-white border border-slate-200 rounded-xl text-sm focus:ring-2 focus:ring-indigo-500 outline-none"
                                />
                                <p className="text-[10px] text-slate-400">Informe DDD + Número</p>
                            </div>
                        )}

                        {/* Consent Checkbox */}
                        {values.contact_method !== 'none' && values.contact_method !== undefined && (
                            <div className="flex items-start gap-3 p-3 bg-indigo-50/50 rounded-xl animate-in fade-in">
                                <input
                                    type="checkbox"
                                    {...register('consent_contact', { required: true })}
                                    className="mt-1 w-4 h-4 text-indigo-600 rounded focus:ring-indigo-500"
                                />
                                <label className="text-xs text-slate-600 leading-snug">
                                    Autorizo o uso deste contato <strong>apenas</strong> para receber retorno e atualizações sobre este pedido de oração.
                                </label>
                            </div>
                        )}
                    </div>

                    {/* Privacy Options */}
                    <div className="space-y-2 pt-2">
                        <label className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Privacidade</label>
                        <div className="grid grid-cols-1 gap-2">
                            {[
                                { val: 'public', icon: Globe, label: 'Público', desc: 'Visível no mural para oração coletiva' },
                                { val: 'team_only', icon: Lock, label: 'Somente Equipe', desc: 'Apenas pastores e líderes verão' },
                                { val: 'anonymous', icon: ShieldCheck, label: 'Anônimo', desc: 'Público, mas sem revelar seu nome' }
                            ].map(opt => (
                                <div
                                    key={opt.val}
                                    onClick={() => setValue('privacy', opt.val as any)}
                                    className={cn(
                                        "flex items-center gap-3 p-3 rounded-xl border cursor-pointer transition-all",
                                        values.privacy === opt.val
                                            ? "bg-indigo-50 border-indigo-200 ring-1 ring-indigo-200"
                                            : "bg-white border-slate-100 hover:bg-slate-50"
                                    )}
                                >
                                    <div className={cn("p-2 rounded-full", values.privacy === opt.val ? "bg-white text-indigo-600" : "bg-slate-100 text-slate-400")}>
                                        <opt.icon className="w-4 h-4" />
                                    </div>
                                    <div>
                                        <p className={cn("text-sm font-semibold", values.privacy === opt.val ? "text-indigo-900" : "text-slate-700")}>{opt.label}</p>
                                        <p className="text-xs text-slate-500">{opt.desc}</p>
                                    </div>
                                    <div className="ml-auto">
                                        <div className={cn("w-4 h-4 rounded-full border flex items-center justify-center", values.privacy === opt.val ? "border-indigo-600 bg-indigo-600" : "border-slate-300")}>
                                            {values.privacy === opt.val && <div className="w-1.5 h-1.5 bg-white rounded-full" />}
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                    <button
                        type="submit"
                        disabled={isSubmitting || !isValid}
                        className="w-full bg-rose-600 hover:bg-rose-700 disabled:bg-slate-300 disabled:cursor-not-allowed text-white font-bold h-12 rounded-xl shadow-lg shadow-rose-200 active:scale-[0.98] transition-all flex items-center justify-center gap-2 text-base mt-2"
                    >
                        {isSubmitting ? <Loader2 className="animate-spin w-5 h-5" /> : <Send className="w-5 h-5" />}
                        {isSubmitting ? 'Enviando...' : 'Enviar Pedido de Oração'}
                    </button>
                </form>
            )}
        </div>
    );
}

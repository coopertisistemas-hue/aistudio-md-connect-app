import { useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { Lock, Users, Eye, CheckCircle2, Heart, Calendar, MessageCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { supabase } from '@/lib/supabase';
import { getChurchContext, invokeBff } from '@/lib/bff';
import { InternalPageLayout } from '@/components/layout/InternalPageLayout';

export default function NewRequest() {
    const navigate = useNavigate();
    const [searchParams] = useSearchParams();
    const type = searchParams.get('type') || 'oracao';

    const [isSubmitting, setIsSubmitting] = useState(false);
    const [success, setSuccess] = useState(false);

    // Form Stats
    const [privacy, setPrivacy] = useState('leadership'); // leadership, pastor, public
    const [formData, setFormData] = useState({
        title: '',
        description: '',
        category: '',
        visit_address: '',
        visit_time: '',
        phone: '',
        urgency: 'normal'
    });

    const getDescription = () => {
        switch (type) {
            case 'visita': return 'Nos diga onde e quando você gostaria de receber a visita.';
            case 'aconselhamento': return 'Como podemos te ajudar? Descreva brevemente.';
            default: return 'Descreva seu pedido de oração.';
        }
    };

    const getIcon = () => {
        switch (type) {
            case 'visita': return Calendar;
            case 'aconselhamento': return MessageCircle;
            default: return Heart;
        }
    };

    const handleSubmit = async () => {
        setIsSubmitting(true);
        try {
            const { data: { session } } = await supabase.auth.getSession();
            if (!session) throw new Error('Não autenticado');

            const { church_id } = await getChurchContext();
            if (!church_id) throw new Error('Igreja não encontrada para o seu usuário.');

            const payload = {
                church_id,
                member_id: session.user.id,
                request_type: type,
                title: formData.title || (type === 'oracao' ? 'Pedido de Oração' : 'Solicitação'),
                description: formData.description,
                privacy: privacy,
                status: 'received',
                priority: formData.urgency === 'alta' ? 'alta' : 'media',

                // Specifics
                category: formData.category,
                visit_address: formData.visit_address,
                visit_time: formData.visit_time,
                contact_phone: formData.phone,
            };

            await invokeBff('church-pastoral-requests-create', payload);

            setSuccess(true);
        } catch (error) {
            console.error(error);
            alert('Erro ao enviar pedido. Tente novamente.');
        } finally {
            setIsSubmitting(false);
        }
    };

    if (success) {
        return (
            <div className="min-h-screen bg-slate-50 flex flex-col items-center justify-center p-6 text-center">
                <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mb-6 animate-in zoom-in duration-300">
                    <CheckCircle2 className="w-10 h-10 text-green-600" />
                </div>
                <h2 className="text-2xl font-bold text-slate-800 mb-2">Pedido Recebido!</h2>
                <p className="text-slate-500 mb-8 max-w-xs">
                    Sua solicitação foi enviada para nossa equipe pastoral. Em breve entraremos em contato.
                </p>
                <Button onClick={() => navigate('/requests')} className="w-full max-w-xs bg-slate-900 text-white">
                    Voltar para Pedidos
                </Button>
            </div>
        );
    }

    return (
        <InternalPageLayout
            title="Novo Pedido"
            subtitle="Envie seu pedido com confiança."
            icon={getIcon()}
            iconClassName="text-rose-500"
            backPath="/requests"
        >
            <div className="p-6 space-y-8 animate-in slide-in-from-right duration-300">

                {/* Step 1: Basic Info */}
                <div className="space-y-4">
                    <div>
                        <label className="text-xs font-bold text-slate-500 uppercase mb-1 block">Título (Opcional)</label>
                        <Input
                            placeholder="Ex: Saúde da família"
                            value={formData.title}
                            onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                        />
                    </div>

                    <div>
                        <label className="text-xs font-bold text-slate-500 uppercase mb-1 block">Descrição *</label>
                        <textarea
                            className="w-full p-3 rounded-lg border border-slate-200 text-sm min-h-[120px] focus:outline-none focus:ring-2 focus:ring-slate-900"
                            placeholder={getDescription()}
                            value={formData.description}
                            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                        ></textarea>
                    </div>

                    {type === 'visita' && (
                        <>
                            <div>
                                <label className="text-xs font-bold text-slate-500 uppercase mb-1 block">Endereço *</label>
                                <Input
                                    placeholder="Rua, Número, Bairro"
                                    value={formData.visit_address}
                                    onChange={(e) => setFormData({ ...formData, visit_address: e.target.value })}
                                />
                            </div>
                            <div>
                                <label className="text-xs font-bold text-slate-500 uppercase mb-1 block">Melhor Horário / Data</label>
                                <Input
                                    placeholder="Ex: Segundas à tarde"
                                    value={formData.visit_time}
                                    onChange={(e) => setFormData({ ...formData, visit_time: e.target.value })}
                                />
                            </div>
                        </>
                    )}

                    {(type === 'visita' || type === 'aconselhamento') && (
                        <div>
                            <label className="text-xs font-bold text-slate-500 uppercase mb-1 block">WhatsApp para contato *</label>
                            <Input
                                placeholder="(00) 00000-0000"
                                value={formData.phone}
                                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                            />
                        </div>
                    )}
                </div>

                {/* Step 2: Privacy (Only for Prayer) */}
                {type === 'oracao' && (
                    <div className="space-y-3">
                        <label className="text-xs font-bold text-slate-500 uppercase mb-1 block">Quem pode ver este pedido?</label>

                        <button
                            onClick={() => setPrivacy('leadership')}
                            className={`w-full p-4 rounded-xl border flex items-center gap-3 text-left transition-all
                                ${privacy === 'leadership' ? 'border-blue-500 bg-blue-50' : 'border-slate-200 bg-white'}
                            `}
                        >
                            <div className={`w-10 h-10 rounded-full flex items-center justify-center ${privacy === 'leadership' ? 'bg-blue-200 text-blue-700' : 'bg-slate-100 text-slate-500'}`}>
                                <Users className="w-5 h-5" />
                            </div>
                            <div>
                                <h4 className={`font-bold text-sm ${privacy === 'leadership' ? 'text-blue-900' : 'text-slate-800'}`}>Liderança da Igreja</h4>
                                <p className="text-xs text-slate-500">Apenas líderes e obreiros autorizados.</p>
                            </div>
                        </button>

                        <button
                            onClick={() => setPrivacy('pastor')}
                            className={`w-full p-4 rounded-xl border flex items-center gap-3 text-left transition-all
                                ${privacy === 'pastor' ? 'border-amber-500 bg-amber-50' : 'border-slate-200 bg-white'}
                            `}
                        >
                            <div className={`w-10 h-10 rounded-full flex items-center justify-center ${privacy === 'pastor' ? 'bg-amber-200 text-amber-700' : 'bg-slate-100 text-slate-500'}`}>
                                <Lock className="w-5 h-5" />
                            </div>
                            <div>
                                <h4 className={`font-bold text-sm ${privacy === 'pastor' ? 'text-amber-900' : 'text-slate-800'}`}>Apenas Pastor</h4>
                                <p className="text-xs text-slate-500">Estritamente confidencial.</p>
                            </div>
                        </button>

                        <button
                            onClick={() => setPrivacy('public')}
                            className={`w-full p-4 rounded-xl border flex items-center gap-3 text-left transition-all
                                ${privacy === 'public' ? 'border-green-500 bg-green-50' : 'border-slate-200 bg-white'}
                            `}
                        >
                            <div className={`w-10 h-10 rounded-full flex items-center justify-center ${privacy === 'public' ? 'bg-green-200 text-green-700' : 'bg-slate-100 text-slate-500'}`}>
                                <Eye className="w-5 h-5" />
                            </div>
                            <div>
                                <h4 className={`font-bold text-sm ${privacy === 'public' ? 'text-green-900' : 'text-slate-800'}`}>Mural de Oração</h4>
                                <p className="text-xs text-slate-500">Visível para todos os membros orarem.</p>
                            </div>
                        </button>
                    </div>
                )}

                {/* Submit Action */}
                <div className="fixed bottom-0 left-0 right-0 p-4 bg-white border-t border-slate-100">
                    <Button
                        className="w-full bg-slate-900 text-white h-12 text-base shadow-lg hover:bg-slate-800"
                        onClick={handleSubmit}
                        disabled={!formData.description || isSubmitting}
                    >
                        {isSubmitting ? 'Enviando...' : 'Enviar Pedido'}
                    </Button>
                </div>
            </div>
        </InternalPageLayout>
    );
}

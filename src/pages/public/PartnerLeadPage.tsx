
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { MessageCircle, CheckCircle, Handshake } from 'lucide-react';
import { partnersApi } from '@/lib/api/partners';
import { toast } from 'sonner';
import { analytics } from '@/lib/analytics';
import { InternalPageLayout } from '@/components/layout/InternalPageLayout';
import { SEOHead } from '@/components/SEO/SEOHead';
import { APP_ROUTES } from '@/lib/routes';

export default function PartnerLeadPage() {
    const navigate = useNavigate();
    const [form, setForm] = useState({ name: '', whatsapp: '', message: '' });
    const [loading, setLoading] = useState(false);
    const [success, setSuccess] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);

        const { error } = await partnersApi.createLead(form);

        if (error) {
            toast.error(error);
            setLoading(false);
        } else {
            setSuccess(true);
            toast.success("Solicitação enviada!");
            analytics.track({ name: 'feature_usage', element: 'partner_lead_submit', context: 'public' });
        }
    };

    return (
        <>
            <SEOHead
                config={{
                    title: "Solicitar Parceria - MD Connect",
                    description: "Entre em contato para se tornar parceiro oficial do MD Connect"
                }}
            />
            <InternalPageLayout
                title="Seja parceiro"
                subtitle="Vamos conversar e alinhar a melhor forma de apoiar."
                icon={Handshake}
                iconClassName="text-emerald-600"
                backPath={APP_ROUTES.PARTNERS_PAGE}
                showDoe={false}
                showSponsor={false}
            >
                <main className="container max-w-md mx-auto px-5 animate-in slide-in-from-bottom-5 duration-500">
                    {success ? (
                        <Card className="border-slate-100 shadow-sm bg-white">
                            <CardContent className="p-8 text-center">
                                <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
                                    <CheckCircle className="w-8 h-8 text-green-600" />
                                </div>
                                <h2 className="text-2xl font-bold text-slate-900 mb-2">Mensagem Recebida!</h2>
                                <p className="text-slate-600 mb-8">
                                    Obrigado pelo interesse em apoiar a obra. Nossa equipe entrará em contato pelo WhatsApp em breve.
                                </p>
                                <Button onClick={() => navigate(APP_ROUTES.PARTNERS_PAGE)} className="w-full bg-slate-900 text-white font-bold h-12 rounded-xl">
                                    Voltar para Parcerias
                                </Button>
                            </CardContent>
                        </Card>
                    ) : (
                        <Card className="border-slate-100 shadow-sm bg-white">
                            <CardContent className="p-6">
                                <form onSubmit={handleSubmit} className="space-y-4">
                                    <div>
                                        <label className="block text-xs font-bold text-slate-700 mb-1 ml-1">Nome Completo</label>
                                        <input
                                            required
                                            className="w-full h-12 px-4 rounded-xl border border-slate-200 bg-slate-50 font-medium text-slate-900 focus:outline-none focus:ring-2 focus:ring-slate-900/10 transition-all"
                                            placeholder="Seu nome ou da empresa"
                                            value={form.name}
                                            onChange={e => setForm({ ...form, name: e.target.value })}
                                        />
                                    </div>

                                    <div>
                                        <label className="block text-xs font-bold text-slate-700 mb-1 ml-1">WhatsApp</label>
                                        <input
                                            required
                                            type="tel"
                                            className="w-full h-12 px-4 rounded-xl border border-slate-200 bg-slate-50 font-medium text-slate-900 focus:outline-none focus:ring-2 focus:ring-slate-900/10 transition-all"
                                            placeholder="(00) 90000-0000"
                                            value={form.whatsapp}
                                            onChange={e => setForm({ ...form, whatsapp: e.target.value })}
                                        />
                                    </div>

                                    <div>
                                        <label className="block text-xs font-bold text-slate-700 mb-1 ml-1">Mensagem (Opcional)</label>
                                        <textarea
                                            className="w-full h-24 p-4 rounded-xl border border-slate-200 bg-slate-50 font-medium text-slate-900 focus:outline-none focus:ring-2 focus:ring-slate-900/10 transition-all resize-none"
                                            placeholder="Gostaria de saber mais sobre..."
                                            value={form.message}
                                            onChange={e => setForm({ ...form, message: e.target.value })}
                                        />
                                    </div>

                                    <Button disabled={loading} type="submit" className="w-full h-14 bg-slate-900 hover:bg-slate-800 text-white rounded-xl font-bold mt-4 shadow-lg shadow-slate-900/10">
                                        {loading ? 'Enviando...' : 'Solicitar Contato'}
                                    </Button>
                                </form>
                            </CardContent>
                        </Card>
                    )}

                    {!success && (
                        <div className="mt-8 text-center">
                            <p className="text-xs text-slate-400 mb-2">Prefere falar agora?</p>
                            <Button
                                variant="ghost"
                                onClick={() => window.open('https://wa.me/5551986859236', '_blank')}
                                className="text-green-600 hover:bg-green-50 font-bold"
                            >
                                <MessageCircle className="w-4 h-4 mr-2" />
                                Chamar no WhatsApp
                            </Button>
                        </div>
                    )}
                </main>
            </InternalPageLayout>
        </>
    );
}

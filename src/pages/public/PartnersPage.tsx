import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import {
    Heart, Copy, CheckCircle2, MessageCircle,
    Zap, Globe, Smartphone, Info, ArrowRight, ArrowLeft
} from 'lucide-react';
import { toast } from 'sonner';
import QRCode from 'react-qr-code';
import { PixPayload } from '@/lib/pix';
import { APP_ROUTES } from '@/lib/routes';
import { analytics } from '@/lib/analytics';
import { SEOHead } from '@/components/SEO/SEOHead';

export default function PartnersPage() {
    const navigate = useNavigate();
    const pixKey = "projetomomentodevocional@gmail.com";
    const recipientName = "JOSE ALEXANDRE F DE SANTANA";
    const recipientCity = "BRASIL";
    const txid = "MDCONNECT";
    const PARTNER_VALUE = 99.00;

    const [brCode, setBrCode] = useState('');

    useEffect(() => {
        try {
            const payload = new PixPayload(pixKey, recipientName, recipientCity, txid, PARTNER_VALUE);
            setBrCode(payload.generate());
        } catch (e) {
            console.error("PIX Generation Error", e);
        }
    }, []);

    const copyPixKey = () => {
        navigator.clipboard.writeText(pixKey);
        toast.success("Chave E-mail copiada!");

        // Track partner interaction
        analytics.trackEvent('click_partner', {
            meta: {
                action: 'copy_pix_key',
                partner_value: PARTNER_VALUE
            }
        });
    };

    const copyBrCode = () => {
        if (!brCode) return;
        navigator.clipboard.writeText(brCode);
        toast.success("Código 'Copia e Cola' copiado!");

        // Track partner interaction
        analytics.trackEvent('click_partner', {
            meta: {
                action: 'copy_pix_brcode',
                partner_value: PARTNER_VALUE
            }
        });
    };

    const handleWhatsAppPartner = () => {
        const text = "Olá! Paz do Senhor 😊 Vim pela página de Parceiros do MD Connect. Quero ser Parceiro Oficial (R$ 99,00) e gostaria de orientações para apoiar a obra.";
        window.open(`https://wa.me/5551986859236?text=${encodeURIComponent(text)}`, '_blank');

        // Track partner interaction
        analytics.trackEvent('click_partner', {
            meta: {
                action: 'whatsapp_cta',
                partner_value: PARTNER_VALUE
            }
        });
    };


    return (
        <>
            <SEOHead />
            <div className="min-h-screen bg-gradient-to-b from-purple-50 via-white to-white pt-20 pb-24 px-4 animate-in fade-in duration-500 max-w-2xl mx-auto">

                {/* Botão Voltar Fixo */}
                <button
                    onClick={() => navigate(-1)}
                    className="fixed top-4 left-4 z-50 p-2 rounded-full bg-white/80 backdrop-blur-sm border border-slate-200 hover:bg-white shadow-sm transition-all active:scale-95"
                    aria-label="Voltar"
                >
                    <ArrowLeft className="w-5 h-5 text-slate-700" />
                </button>

                {/* A) HERO com Vídeo Background */}
                <div className="relative text-center space-y-4 mb-8 overflow-hidden rounded-3xl">
                    {/* Vídeo Background */}
                    <div className="absolute inset-0 -z-10">
                        <video
                            autoPlay
                            loop
                            muted
                            playsInline
                            className="w-full h-full object-cover opacity-20"
                        >
                            <source src="https://assets.mixkit.co/videos/preview/mixkit-people-praying-in-a-church-4255-large.mp4" type="video/mp4" />
                        </video>
                        {/* Overlay gradient */}
                        <div className="absolute inset-0 bg-gradient-to-b from-purple-50/90 via-white/95 to-white"></div>
                    </div>

                    {/* Conteúdo do Hero */}
                    <div className="relative z-10 py-12">
                        <div className="w-16 h-16 bg-amber-50 rounded-full flex items-center justify-center mx-auto shadow-sm border border-amber-100 mb-4">
                            <Heart className="w-8 h-8 text-amber-500 fill-amber-500" />
                        </div>
                        <h1 className="text-3xl font-bold text-slate-900 tracking-tight leading-tight">
                            Seja Parceiro Oficial
                        </h1>
                        <p className="text-slate-600 font-medium text-lg leading-relaxed max-w-lg mx-auto">
                            Tecnologia a serviço do Reino: missões, ação social e modernização da Igreja local.
                        </p>
                    </div>
                </div>

                {/* B) CARD R$ 99,00 */}
                <div className="relative">
                    <div className="absolute -inset-1 bg-gradient-to-b from-amber-500/10 to-transparent blur-xl opacity-70 pointer-events-none rounded-[2rem]" />

                    <Card className="border-amber-400/60 shadow-xl shadow-amber-900/5 overflow-hidden relative bg-white">
                        <div className="absolute top-0 right-0 bg-amber-500 text-white text-[10px] font-bold px-3 py-1 rounded-bl-xl uppercase tracking-wider">
                            Recomendado
                        </div>

                        <CardContent className="p-0">
                            {/* Header Card */}
                            <div className="bg-amber-50/50 p-6 text-center border-b border-amber-100">
                                <h2 className="text-xl font-bold text-slate-900 mb-1">Parceria Oficial</h2>
                                <p className="text-slate-500 text-sm mb-4 leading-snug">
                                    Uma contribuição mensal para fortalecer o Reino, apoiar ações sociais e sustentar a evolução da plataforma.
                                </p>
                                <div className="flex items-baseline justify-center gap-1 text-amber-600">
                                    <span className="text-sm font-semibold">R$</span>
                                    <span className="text-5xl font-bold tracking-tighter">99,00</span>
                                    <span className="text-slate-400 text-sm font-medium">/mês</span>
                                </div>
                            </div>

                            {/* PIX Area */}
                            <div className="p-6 space-y-6">
                                <div className="flex justify-center">
                                    <div className="bg-white p-3 rounded-xl border border-slate-200 shadow-inner inline-block">
                                        {brCode ? (
                                            <div className="w-48 h-48 sm:w-56 sm:h-56">
                                                <QRCode value={brCode} style={{ height: "100%", width: "100%" }} viewBox={`0 0 256 256`} />
                                            </div>
                                        ) : (
                                            <div className="w-48 h-48 bg-slate-50 animate-pulse rounded-lg flex items-center justify-center text-xs text-slate-400">
                                                Gerando QR Code...
                                            </div>
                                        )}
                                    </div>
                                </div>

                                <div className="space-y-3">
                                    <Button
                                        onClick={copyBrCode}
                                        className="w-full bg-slate-900 hover:bg-slate-800 text-white h-12 rounded-xl font-bold text-sm shadow-lg shadow-slate-900/10 active:scale-[0.98] transition-all"
                                    >
                                        <Copy className="w-4 h-4 mr-2" />
                                        Copiar código PIX
                                    </Button>

                                    <div className="relative flex items-center py-1">
                                        <div className="flex-grow border-t border-slate-100"></div>
                                        <span className="flex-shrink-0 mx-4 text-slate-300 text-[10px] font-bold uppercase">Ou chave E-mail</span>
                                        <div className="flex-grow border-t border-slate-100"></div>
                                    </div>

                                    <Button
                                        variant="outline"
                                        onClick={copyPixKey}
                                        className="w-full border-slate-200 text-slate-600 hover:bg-slate-50 h-11 rounded-xl font-semibold text-sm"
                                    >
                                        <Copy className="w-4 h-4 mr-2" />
                                        Copiar chave PIX
                                    </Button>
                                </div>

                                {/* Trust Line */}
                                <div className="bg-slate-50 rounded-lg p-3 flex gap-3 border border-slate-100">
                                    <Info className="w-4 h-4 text-slate-400 shrink-0 mt-0.5" />
                                    <p className="text-xs text-slate-500 leading-snug">
                                        Ao confirmar o PIX, o recebedor aparecerá como: <strong className="text-slate-700">José Alexandre F. de Santana</strong>.
                                    </p>
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    {/* Outros valores */}
                    <div className="text-center mt-4">
                        <button
                            onClick={() => navigate(APP_ROUTES.DONATE)}
                            className="text-xs font-semibold text-slate-400 hover:text-amber-600 underline transition-colors"
                        >
                            Quero contribuir com outro valor
                        </button>
                    </div>
                </div>

                {/* C) SEÇÕES DE CONTEÚDO */}

                {/* 1. Por que existe */}
                <section className="space-y-4 pt-4">
                    <h3 className="font-bold text-slate-900 text-lg px-1">Por que essa parceria existe?</h3>
                    <Card className="border-slate-100 shadow-sm">
                        <CardContent className="p-5">
                            <p className="text-slate-600 leading-relaxed font-medium">
                                O MD Connect nasce para servir ao Reino com excelência: ampliar o alcance da Palavra, fortalecer igrejas e apoiar pessoas com tecnologia segura, organizada e acolhedora.
                            </p>
                        </CardContent>
                    </Card>
                </section>

                {/* 2. Destinação */}
                <section className="space-y-4">
                    <h3 className="font-bold text-slate-900 text-lg px-1">Destinação da Parceria</h3>
                    <Card className="border-slate-100 shadow-sm bg-slate-50/50">
                        <CardContent className="p-6">
                            <ul className="space-y-4">
                                <li className="flex gap-4 items-start">
                                    <div className="bg-blue-100 text-blue-700 font-bold text-xs px-2 py-1 rounded-md shrink-0">10%</div>
                                    <div>
                                        <h4 className="font-bold text-slate-900 text-sm">Missões</h4>
                                        <p className="text-xs text-slate-500 leading-relaxed mt-1">Apoio a frentes missionárias e expansão do Evangelho.</p>
                                    </div>
                                </li>
                                <li className="flex gap-4 items-start">
                                    <div className="bg-rose-100 text-rose-700 font-bold text-xs px-2 py-1 rounded-md shrink-0">10%</div>
                                    <div>
                                        <h4 className="font-bold text-slate-900 text-sm">Ação Social</h4>
                                        <p className="text-xs text-slate-500 leading-relaxed mt-1">Apoio a famílias e iniciativas sociais ligadas à obra.</p>
                                    </div>
                                </li>
                                <li className="flex gap-4 items-start">
                                    <div className="bg-emerald-100 text-emerald-700 font-bold text-xs px-2 py-1 rounded-md shrink-0">80%</div>
                                    <div>
                                        <h4 className="font-bold text-slate-900 text-sm">Sustentação e Evolução</h4>
                                        <p className="text-xs text-slate-500 leading-relaxed mt-1">Infraestrutura, segurança, desenvolvimento e modernização digital das igrejas.</p>
                                    </div>
                                </li>
                            </ul>
                            <div className="mt-6 pt-4 border-t border-slate-200">
                                <button
                                    onClick={() => navigate(APP_ROUTES.TRANSPARENCY)}
                                    className="flex items-center gap-1 text-xs font-bold text-slate-500 hover:text-amber-600 transition-colors"
                                >
                                    Ver prestação de contas em Transparência <ArrowRight className="w-3 h-3" />
                                </button>
                            </div>
                        </CardContent>
                    </Card>
                </section>

                {/* 3. Modernização */}
                <section className="space-y-4">
                    <h3 className="font-bold text-slate-900 text-lg px-1">Modernização da Igreja Local</h3>
                    <Card className="border-slate-100 shadow-sm">
                        <CardContent className="p-6">
                            <ul className="space-y-3">
                                <BenefitItem icon={Zap} text="Sistema de gestão (ERP) para organização" />
                                <BenefitItem icon={Smartphone} text="App web para comunicação com membros" />
                                <BenefitItem icon={Globe} text="Estrutura digital para alcance e crescimento" />
                            </ul>
                        </CardContent>
                    </Card>
                </section>

                {/* 4. Benefícios */}
                <section className="space-y-4">
                    <h3 className="font-bold text-slate-900 text-lg px-1">Benefícios da Parceria</h3>
                    <Card className="border-amber-100 bg-amber-50/30 shadow-sm">
                        <CardContent className="p-6">
                            <ul className="space-y-3">
                                <BenefitItem icon={CheckCircle2} text="Destaque como Parceiro Oficial no ecossistema" iconColor="text-amber-600" />
                                <BenefitItem icon={CheckCircle2} text="Presença no app (vitrine) com link/contato" iconColor="text-amber-600" />
                                <BenefitItem icon={CheckCircle2} text="Fortalecimento direto do projeto e infraestrutura" iconColor="text-amber-600" />
                                <BenefitItem icon={CheckCircle2} text="Participação em um projeto com propósito" iconColor="text-amber-600" />
                            </ul>
                        </CardContent>
                    </Card>
                </section>

                {/* CTA Final */}
                <div className="fixed bottom-0 left-0 right-0 p-4 bg-white/80 backdrop-blur-xl border-t border-slate-200 z-50 md:static md:bg-transparent md:border-0 md:backdrop-blur-none md:p-0 md:mt-12">
                    <Button
                        onClick={handleWhatsAppPartner}
                        className="w-full bg-green-600 hover:bg-green-700 text-white h-14 rounded-xl text-lg font-bold shadow-lg shadow-green-900/20 active:scale-[0.98] transition-all flex items-center justify-center gap-2 max-w-xl mx-auto"
                    >
                        <MessageCircle className="w-6 h-6" />
                        Quero ser Parceiro Oficial
                    </Button>
                </div>

            </div>
        </>
    );
}

function BenefitItem({ icon: Icon, text, iconColor = "text-slate-400" }: { icon: any, text: string, iconColor?: string }) {
    return (
        <li className="flex gap-3 items-start">
            <div className={`mt-0.5 ${iconColor}`}>
                <Icon className="w-5 h-5" />
            </div>
            <span className="text-sm text-slate-700 leading-snug font-medium">{text}</span>
        </li>
    )
}

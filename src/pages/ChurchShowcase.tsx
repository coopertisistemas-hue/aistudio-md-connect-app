import { useNavigate } from 'react-router-dom';
import {
    BookOpen, Heart, Calendar, Globe, Users, Megaphone,
    Sparkles, Rocket, MessageCircle, FileText, Settings,
    Shield, Church
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { InternalPageLayout } from '@/components/layout/InternalPageLayout';
import { APP_ROUTES, EXTERNAL_LINKS } from '@/lib/routes';
import { SEOHead } from '@/components/SEOHead';

export default function ChurchShowcase() {
    const navigate = useNavigate();

    const features = [
        {
            icon: BookOpen,
            title: "Devocional Diario + Biblia",
            description: "Conteudo espiritual renovado todo dia + Biblia completa com recursos"
        },
        {
            icon: Megaphone,
            title: "Mural & Comunicados",
            description: "Avisos, noticias e comunicacao direta com os membros"
        },
        {
            icon: Heart,
            title: "Pedidos de Oracao",
            description: "Sistema de pedidos e acompanhamento pastoral"
        },
        {
            icon: Calendar,
            title: "Agenda & Eventos",
            description: "Calendario de cultos, reunioes e atividades"
        },
        {
            icon: Globe,
            title: "Area Publica Institucional",
            description: "Site mobile gratuito para sua igreja (quando aplicavel)"
        },
        {
            icon: Users,
            title: "Gestao de Membros",
            description: "Controle de frequencia, grupos e ministerios"
        }
    ];

    const steps = [
        {
            number: "1",
            title: "Cadastro & Validacao",
            description: "Preencha o formulario com os dados da igreja. Nossa equipe valida em ate 48h.",
            icon: FileText
        },
        {
            number: "2",
            title: "Implantacao Guiada",
            description: "Checklist passo a passo + suporte tecnico para configuracao completa.",
            icon: Settings
        },
        {
            number: "3",
            title: "Go-Live & Suporte",
            description: "Sua igreja no ar! Suporte continuo via WhatsApp e atualizacoes constantes.",
            icon: Rocket
        }
    ];

    return (
        <>
            <SEOHead
                title="Sou Igreja - MD Connect"
                description="Implante o MD Connect e fortaleca o cuidado com a igreja — com organizacao, conteudo e comunicacao."
                keywords="igreja, gestao eclesiastica, app igreja, sistema igreja, devocional, biblia"
            />

            <InternalPageLayout
                title="Sou Igreja"
                subtitle="Tecnologia a servico do Reino"
                icon={Church}
                iconClassName="text-indigo-600"
                backPath="/home"
            >
                <div className="px-4 space-y-8 pb-8">

                    {/* Hero Section */}
                    <div className="bg-gradient-to-br from-indigo-50 via-white to-blue-50 rounded-3xl p-8 border border-indigo-100/50 shadow-sm">
                        {/* Badge */}
                        <div className="inline-flex items-center gap-2 px-3 py-1 bg-indigo-100 rounded-full mb-4">
                            <Sparkles className="w-3 h-3 text-indigo-600" />
                            <span className="text-xs font-bold text-indigo-700 uppercase tracking-wider">
                                Tecnologia a Servico do Reino
                            </span>
                        </div>

                        {/* Title */}
                        <h1 className="text-3xl md:text-4xl font-bold text-slate-900 mb-3">
                            Fortaleca sua Igreja
                        </h1>

                        {/* Subtitle */}
                        <p className="text-slate-600 leading-relaxed mb-6">
                            Implante o MD Connect e fortaleca o cuidado com a igreja —
                            com organizacao, conteudo e comunicacao.
                        </p>

                        {/* CTAs */}
                        <div className="flex flex-col sm:flex-row gap-3">
                            <Button
                                onClick={() => navigate(APP_ROUTES.CHURCH_IMPLEMENTATION)}
                                className="flex-1 bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-6"
                            >
                                <Rocket className="w-4 h-4 mr-2" />
                                Quero implantar
                            </Button>
                            <Button
                                onClick={() => window.open(EXTERNAL_LINKS.SUPPORT_WHATSAPP, '_blank')}
                                variant="outline"
                                className="flex-1 border-indigo-200 text-indigo-700 hover:bg-indigo-50 font-bold py-6"
                            >
                                <MessageCircle className="w-4 h-4 mr-2" />
                                Falar com a equipe
                            </Button>
                        </div>
                    </div>

                    {/* Features Section */}
                    <div>
                        <h2 className="text-2xl font-bold text-slate-900 mb-6">
                            O que sua igreja recebe
                        </h2>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            {features.map((feature, idx) => (
                                <Card key={idx} className="border-slate-100 hover:shadow-md transition-shadow">
                                    <CardContent className="p-6">
                                        <div className="flex items-start gap-4">
                                            <div className="bg-indigo-50 rounded-xl p-3 flex-shrink-0">
                                                <feature.icon className="w-6 h-6 text-indigo-600" />
                                            </div>
                                            <div>
                                                <h3 className="font-bold text-slate-900 mb-1">{feature.title}</h3>
                                                <p className="text-sm text-slate-600 leading-relaxed">{feature.description}</p>
                                            </div>
                                        </div>
                                    </CardContent>
                                </Card>
                            ))}
                        </div>
                    </div>

                    {/* How it Works Section */}
                    <div>
                        <h2 className="text-2xl font-bold text-slate-900 mb-6">
                            Como funciona
                        </h2>
                        <div className="space-y-4">
                            {steps.map((step, idx) => (
                                <div key={idx} className="flex gap-4 items-start bg-white rounded-2xl p-6 border border-slate-100 shadow-sm">
                                    <div className="bg-indigo-600 text-white rounded-full w-10 h-10 flex items-center justify-center font-bold flex-shrink-0">
                                        {step.number}
                                    </div>
                                    <div className="flex-1">
                                        <div className="flex items-center gap-2 mb-1">
                                            <step.icon className="w-5 h-5 text-indigo-600" />
                                            <h3 className="font-bold text-slate-900">{step.title}</h3>
                                        </div>
                                        <p className="text-sm text-slate-600 leading-relaxed">{step.description}</p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* LGPD & Transparency Section */}
                    <Card className="bg-slate-50 border-slate-200">
                        <CardContent className="p-6">
                            <div className="flex items-start gap-4">
                                <Shield className="w-6 h-6 text-slate-600 flex-shrink-0 mt-1" />
                                <div>
                                    <h3 className="font-bold text-slate-900 mb-2">
                                        Privacidade & Transparencia
                                    </h3>
                                    <p className="text-sm text-slate-600 mb-4 leading-relaxed">
                                        Todos os dados sao tratados conforme LGPD.
                                        Acesse nossa central de privacidade e relatorios de transparencia.
                                    </p>
                                    <div className="flex flex-wrap gap-2">
                                        <Button
                                            variant="outline"
                                            size="sm"
                                            onClick={() => navigate(APP_ROUTES.PRIVACY)}
                                            className="text-slate-700"
                                        >
                                            Privacidade
                                        </Button>
                                        <Button
                                            variant="outline"
                                            size="sm"
                                            onClick={() => navigate(APP_ROUTES.TRANSPARENCY)}
                                            className="text-slate-700"
                                        >
                                            Transparencia
                                        </Button>
                                    </div>
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    {/* Final CTA */}
                    <div className="bg-gradient-to-r from-indigo-600 to-blue-600 rounded-3xl p-8 text-center text-white shadow-lg">
                        <h2 className="text-2xl font-bold mb-3">
                            Pronto para comecar?
                        </h2>
                        <p className="text-indigo-100 mb-6 leading-relaxed">
                            Junte-se as igrejas que ja usam o MD Connect para fortalecer o cuidado pastoral.
                        </p>
                        <Button
                            onClick={() => navigate(APP_ROUTES.CHURCH_IMPLEMENTATION)}
                            className="bg-white text-indigo-600 hover:bg-indigo-50 font-bold py-6 px-8"
                        >
                            <Rocket className="w-5 h-5 mr-2" />
                            Iniciar implantacao agora
                        </Button>
                    </div>

                </div>
            </InternalPageLayout>
        </>
    );
}

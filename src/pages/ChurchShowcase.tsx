import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Church, Rocket, MessageCircle, BookOpen, Heart, Calendar, Globe, Users, Megaphone, Sparkles, FileText, Settings, Shield } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { InternalPageLayout } from '@/components/layout/InternalPageLayout';
import { APP_ROUTES, EXTERNAL_LINKS } from '@/lib/routes';
import { SEOHead } from '@/components/SEOHead';

const ChurchShowcase: React.FC = () => {
    const navigate = useNavigate();

    return (
        <>
            <SEOHead
                title="Sou Igreja - MD Connect"
                description="Implante o MD Connect na sua igreja"
                keywords="igreja, gestao, app, sistema"
            />

            <InternalPageLayout
                title="Sou Igreja"
                subtitle="Tecnologia a servico do Reino"
                icon={Church}
                iconClassName="text-indigo-600"
                backPath="/home"
            >
                <div className="px-4 space-y-8 pb-8">

                    {/* Hero */}
                    <div className="bg-gradient-to-br from-indigo-50 via-white to-blue-50 rounded-3xl p-8 border border-indigo-100/50 shadow-sm">
                        <div className="inline-flex items-center gap-2 px-3 py-1 bg-indigo-100 rounded-full mb-4">
                            <Sparkles className="w-3 h-3 text-indigo-600" />
                            <span className="text-xs font-bold text-indigo-700 uppercase tracking-wider">
                                Tecnologia a Servico do Reino
                            </span>
                        </div>

                        <h1 className="text-3xl md:text-4xl font-bold text-slate-900 mb-3">
                            Fortaleca sua Igreja
                        </h1>

                        <p className="text-slate-600 leading-relaxed mb-6">
                            Implante o MD Connect e fortaleca o cuidado com a igreja com organizacao, conteudo e comunicacao.
                        </p>

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

                    {/* Features */}
                    <div>
                        <h2 className="text-2xl font-bold text-slate-900 mb-6">
                            O que sua igreja recebe
                        </h2>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <Card className="border-slate-100 hover:shadow-md transition-shadow">
                                <CardContent className="p-6">
                                    <div className="flex items-start gap-4">
                                        <div className="bg-indigo-50 rounded-xl p-3 flex-shrink-0">
                                            <BookOpen className="w-6 h-6 text-indigo-600" />
                                        </div>
                                        <div>
                                            <h3 className="font-bold text-slate-900 mb-1">Devocional + Biblia</h3>
                                            <p className="text-sm text-slate-600 leading-relaxed">Conteudo espiritual renovado todo dia</p>
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>

                            <Card className="border-slate-100 hover:shadow-md transition-shadow">
                                <CardContent className="p-6">
                                    <div className="flex items-start gap-4">
                                        <div className="bg-indigo-50 rounded-xl p-3 flex-shrink-0">
                                            <Megaphone className="w-6 h-6 text-indigo-600" />
                                        </div>
                                        <div>
                                            <h3 className="font-bold text-slate-900 mb-1">Mural & Comunicados</h3>
                                            <p className="text-sm text-slate-600 leading-relaxed">Avisos e comunicacao direta</p>
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>

                            <Card className="border-slate-100 hover:shadow-md transition-shadow">
                                <CardContent className="p-6">
                                    <div className="flex items-start gap-4">
                                        <div className="bg-indigo-50 rounded-xl p-3 flex-shrink-0">
                                            <Heart className="w-6 h-6 text-indigo-600" />
                                        </div>
                                        <div>
                                            <h3 className="font-bold text-slate-900 mb-1">Pedidos de Oracao</h3>
                                            <p className="text-sm text-slate-600 leading-relaxed">Sistema de pedidos pastoral</p>
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>

                            <Card className="border-slate-100 hover:shadow-md transition-shadow">
                                <CardContent className="p-6">
                                    <div className="flex items-start gap-4">
                                        <div className="bg-indigo-50 rounded-xl p-3 flex-shrink-0">
                                            <Calendar className="w-6 h-6 text-indigo-600" />
                                        </div>
                                        <div>
                                            <h3 className="font-bold text-slate-900 mb-1">Agenda & Eventos</h3>
                                            <p className="text-sm text-slate-600 leading-relaxed">Calendario de cultos e atividades</p>
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>

                            <Card className="border-slate-100 hover:shadow-md transition-shadow">
                                <CardContent className="p-6">
                                    <div className="flex items-start gap-4">
                                        <div className="bg-indigo-50 rounded-xl p-3 flex-shrink-0">
                                            <Globe className="w-6 h-6 text-indigo-600" />
                                        </div>
                                        <div>
                                            <h3 className="font-bold text-slate-900 mb-1">Area Publica</h3>
                                            <p className="text-sm text-slate-600 leading-relaxed">Site mobile gratuito</p>
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>

                            <Card className="border-slate-100 hover:shadow-md transition-shadow">
                                <CardContent className="p-6">
                                    <div className="flex items-start gap-4">
                                        <div className="bg-indigo-50 rounded-xl p-3 flex-shrink-0">
                                            <Users className="w-6 h-6 text-indigo-600" />
                                        </div>
                                        <div>
                                            <h3 className="font-bold text-slate-900 mb-1">Gestao de Membros</h3>
                                            <p className="text-sm text-slate-600 leading-relaxed">Controle de frequencia e grupos</p>
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>
                        </div>
                    </div>

                    {/* Steps */}
                    <div>
                        <h2 className="text-2xl font-bold text-slate-900 mb-6">
                            Como funciona
                        </h2>
                        <div className="space-y-4">
                            <div className="flex gap-4 items-start bg-white rounded-2xl p-6 border border-slate-100 shadow-sm">
                                <div className="bg-indigo-600 text-white rounded-full w-10 h-10 flex items-center justify-center font-bold flex-shrink-0">
                                    1
                                </div>
                                <div className="flex-1">
                                    <div className="flex items-center gap-2 mb-1">
                                        <FileText className="w-5 h-5 text-indigo-600" />
                                        <h3 className="font-bold text-slate-900">Cadastro & Validacao</h3>
                                    </div>
                                    <p className="text-sm text-slate-600 leading-relaxed">Preencha o formulario. Validacao em ate 48h.</p>
                                </div>
                            </div>

                            <div className="flex gap-4 items-start bg-white rounded-2xl p-6 border border-slate-100 shadow-sm">
                                <div className="bg-indigo-600 text-white rounded-full w-10 h-10 flex items-center justify-center font-bold flex-shrink-0">
                                    2
                                </div>
                                <div className="flex-1">
                                    <div className="flex items-center gap-2 mb-1">
                                        <Settings className="w-5 h-5 text-indigo-600" />
                                        <h3 className="font-bold text-slate-900">Implantacao Guiada</h3>
                                    </div>
                                    <p className="text-sm text-slate-600 leading-relaxed">Checklist passo a passo com suporte tecnico.</p>
                                </div>
                            </div>

                            <div className="flex gap-4 items-start bg-white rounded-2xl p-6 border border-slate-100 shadow-sm">
                                <div className="bg-indigo-600 text-white rounded-full w-10 h-10 flex items-center justify-center font-bold flex-shrink-0">
                                    3
                                </div>
                                <div className="flex-1">
                                    <div className="flex items-center gap-2 mb-1">
                                        <Rocket className="w-5 h-5 text-indigo-600" />
                                        <h3 className="font-bold text-slate-900">Go-Live & Suporte</h3>
                                    </div>
                                    <p className="text-sm text-slate-600 leading-relaxed">Sua igreja no ar com suporte continuo.</p>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* LGPD */}
                    <Card className="bg-slate-50 border-slate-200">
                        <CardContent className="p-6">
                            <div className="flex items-start gap-4">
                                <Shield className="w-6 h-6 text-slate-600 flex-shrink-0 mt-1" />
                                <div>
                                    <h3 className="font-bold text-slate-900 mb-2">
                                        Privacidade & Transparencia
                                    </h3>
                                    <p className="text-sm text-slate-600 mb-4 leading-relaxed">
                                        Dados tratados conforme LGPD.
                                    </p>
                                    <div className="flex flex-wrap gap-2">
                                        <Button
                                            variant="outline"
                                            size="sm"
                                            onClick={() => navigate(APP_ROUTES.PRIVACY)}
                                        >
                                            Privacidade
                                        </Button>
                                        <Button
                                            variant="outline"
                                            size="sm"
                                            onClick={() => navigate(APP_ROUTES.TRANSPARENCY)}
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
                            Junte-se as igrejas que ja usam o MD Connect.
                        </p>
                        <Button
                            onClick={() => navigate(APP_ROUTES.CHURCH_IMPLEMENTATION)}
                            className="bg-white text-indigo-600 hover:bg-indigo-50 font-bold py-6 px-8"
                        >
                            <Rocket className="w-5 h-5 mr-2" />
                            Iniciar implantacao
                        </Button>
                    </div>

                </div>
            </InternalPageLayout>
        </>
    );
};

export default ChurchShowcase;

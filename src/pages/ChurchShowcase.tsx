import { useNavigate } from 'react-router-dom';
import { Church, Rocket, MessageCircle, BookOpen, Heart, Calendar, Globe, Users, Megaphone, Sparkles } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import { InternalPageLayout } from '@/components/layout/InternalPageLayout';
import { APP_ROUTES, EXTERNAL_LINKS } from '@/lib/routes';
import { SEOHead } from '@/components/SEO/SEOHead';

export default function ChurchShowcase() {
    const navigate = useNavigate();

    return (
        <>
            <SEOHead
                config={{
                    title: "Sou Igreja - MD Connect",
                    description: "Implante o MD Connect na sua igreja com organizacao, conteudo e comunicacao"
                }}
            />

            <InternalPageLayout
                title="Sou Igreja"
                subtitle="Tecnologia a servico do Reino"
                icon={Church}
                iconClassName="text-indigo-600"
                backPath="/home"
            >
                <div className="max-w-4xl mx-auto px-4 py-8 space-y-24">

                    {/* Hero Section */}
                    <section className="text-center space-y-8 py-4">
                        <div className="flex flex-wrap justify-center gap-2">
                            <Badge className="bg-green-100 text-green-700 hover:bg-green-100 border-green-200 uppercase tracking-widest text-[10px] font-bold">
                                Licenca de Uso Gratuita
                            </Badge>
                            <Badge variant="outline" className="bg-indigo-50/50 border-indigo-100 text-indigo-600 uppercase tracking-widest text-[10px] font-bold">
                                Tecnologia a Servico do Reino
                            </Badge>
                        </div>

                        <div className="space-y-4 max-w-3xl mx-auto">
                            <h2 className="text-3xl md:text-5xl font-black text-slate-900 tracking-tight leading-[1.1]">
                                Fortaleca sua <span className="text-indigo-600">Igreja</span>
                            </h2>
                            <p className="text-slate-600 leading-relaxed md:text-xl max-w-2xl mx-auto">
                                Implante o MD Connect e fortaleca o cuidado com a igreja com organizacao, conteudo e comunicacao.
                            </p>
                        </div>

                        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4">
                            <Button
                                size="lg"
                                className="w-full sm:w-auto bg-indigo-600 hover:bg-indigo-700 text-white font-bold h-14 px-10 rounded-full shadow-xl shadow-indigo-200 gap-2 transition-all hover:scale-105 active:scale-95"
                                onClick={() => navigate(APP_ROUTES.CHURCH_IMPLEMENTATION)}
                            >
                                <Rocket className="w-5 h-5" />
                                Quero implantar
                            </Button>
                            <Button
                                size="lg"
                                variant="outline"
                                className="w-full sm:w-auto bg-white/80 backdrop-blur-sm hover:bg-white text-slate-700 border-slate-200 font-bold h-14 px-10 rounded-full transition-all hover:border-indigo-300"
                                onClick={() => window.open(EXTERNAL_LINKS.SUPPORT_WHATSAPP, '_blank')}
                            >
                                <MessageCircle className="w-5 h-5" />
                                Falar com a equipe
                            </Button>
                        </div>
                    </section>

                    {/* Features Section */}
                    <section className="space-y-12">
                        <div className="text-center space-y-2">
                            <h3 className="text-2xl font-bold text-slate-900">O que sua igreja recebe</h3>
                            <p className="text-slate-500 text-sm">Ecossistema completo para gestao e cuidado pastoral</p>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <Card className="border-slate-100 bg-white/60 backdrop-blur-sm shadow-sm h-full hover:shadow-md transition-shadow">
                                <CardContent className="p-8 flex flex-col items-start gap-4">
                                    <div className="bg-indigo-50 rounded-xl p-3 flex-shrink-0">
                                        <BookOpen className="w-6 h-6 text-indigo-600" />
                                    </div>
                                    <div>
                                        <h4 className="font-bold text-slate-900 mb-1">Devocional + Biblia</h4>
                                        <p className="text-sm text-slate-600 leading-relaxed">Conteudo espiritual renovado todo dia</p>
                                    </div>
                                </CardContent>
                            </Card>

                            <Card className="border-slate-100 bg-white/60 backdrop-blur-sm shadow-sm h-full hover:shadow-md transition-shadow">
                                <CardContent className="p-8 flex flex-col items-start gap-4">
                                    <div className="bg-indigo-50 rounded-xl p-3 flex-shrink-0">
                                        <Megaphone className="w-6 h-6 text-indigo-600" />
                                    </div>
                                    <div>
                                        <h4 className="font-bold text-slate-900 mb-1">Mural e Comunicados</h4>
                                        <p className="text-sm text-slate-600 leading-relaxed">Avisos e comunicacao direta</p>
                                    </div>
                                </CardContent>
                            </Card>

                            <Card className="border-slate-100 bg-white/60 backdrop-blur-sm shadow-sm h-full hover:shadow-md transition-shadow">
                                <CardContent className="p-8 flex flex-col items-start gap-4">
                                    <div className="bg-indigo-50 rounded-xl p-3 flex-shrink-0">
                                        <Heart className="w-6 h-6 text-indigo-600" />
                                    </div>
                                    <div>
                                        <h4 className="font-bold text-slate-900 mb-1">Pedidos de Oracao</h4>
                                        <p className="text-sm text-slate-600 leading-relaxed">Sistema de pedidos pastoral</p>
                                    </div>
                                </CardContent>
                            </Card>

                            <Card className="border-slate-100 bg-white/60 backdrop-blur-sm shadow-sm h-full hover:shadow-md transition-shadow">
                                <CardContent className="p-8 flex flex-col items-start gap-4">
                                    <div className="bg-indigo-50 rounded-xl p-3 flex-shrink-0">
                                        <Calendar className="w-6 h-6 text-indigo-600" />
                                    </div>
                                    <div>
                                        <h4 className="font-bold text-slate-900 mb-1">Agenda e Eventos</h4>
                                        <p className="text-sm text-slate-600 leading-relaxed">Calendario de cultos e atividades</p>
                                    </div>
                                </CardContent>
                            </Card>

                            <Card className="border-slate-100 bg-white/60 backdrop-blur-sm shadow-sm h-full hover:shadow-md transition-shadow">
                                <CardContent className="p-8 flex flex-col items-start gap-4">
                                    <div className="bg-indigo-50 rounded-xl p-3 flex-shrink-0">
                                        <Globe className="w-6 h-6 text-indigo-600" />
                                    </div>
                                    <div>
                                        <h4 className="font-bold text-slate-900 mb-1">Area Publica</h4>
                                        <p className="text-sm text-slate-600 leading-relaxed">Site mobile gratuito</p>
                                    </div>
                                </CardContent>
                            </Card>

                            <Card className="border-slate-100 bg-white/60 backdrop-blur-sm shadow-sm h-full hover:shadow-md transition-shadow">
                                <CardContent className="p-8 flex flex-col items-start gap-4">
                                    <div className="bg-indigo-50 rounded-xl p-3 flex-shrink-0">
                                        <Users className="w-6 h-6 text-indigo-600" />
                                    </div>
                                    <div>
                                        <h4 className="font-bold text-slate-900 mb-1">Gestao de Membros</h4>
                                        <p className="text-sm text-slate-600 leading-relaxed">Controle de frequencia e grupos</p>
                                    </div>
                                </CardContent>
                            </Card>
                        </div>
                    </section>

                    {/* Final CTA */}
                    <section className="text-center py-10">
                        <div className="bg-indigo-50 border border-indigo-100 rounded-[3rem] p-12 md:p-20 space-y-8 relative overflow-hidden">
                            {/* Background Decor */}
                            <div className="absolute top-0 left-0 w-64 h-64 bg-indigo-200/20 rounded-full blur-3xl -ml-20 -mt-20 pointer-events-none" />
                            <div className="absolute bottom-0 right-0 w-64 h-64 bg-indigo-200/20 rounded-full blur-3xl -mr-20 -mb-20 pointer-events-none" />

                            <div className="relative z-10 space-y-6 max-w-2xl mx-auto">
                                <h3 className="text-3xl md:text-4xl font-black text-slate-900 tracking-tight leading-tight">
                                    Pronto para comecar?
                                </h3>
                                <p className="text-slate-600 text-lg">
                                    Junte-se as igrejas que ja usam o MD Connect.
                                </p>
                                <div className="pt-4">
                                    <Button
                                        size="lg"
                                        className="bg-slate-900 hover:bg-slate-800 text-white font-bold h-16 px-12 rounded-full shadow-2xl transition-all hover:scale-105 active:scale-95 gap-3"
                                        onClick={() => navigate(APP_ROUTES.CHURCH_IMPLEMENTATION)}
                                    >
                                        <Rocket className="w-6 h-6 text-indigo-400" />
                                        Iniciar implantacao agora
                                    </Button>
                                </div>
                            </div>
                        </div>
                    </section>

                </div>
            </InternalPageLayout>
        </>
    );
}

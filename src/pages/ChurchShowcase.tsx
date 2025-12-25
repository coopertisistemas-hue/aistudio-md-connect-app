import { useNavigate } from 'react-router-dom';
import { Church, Rocket, MessageCircle, BookOpen, Heart, Calendar, Globe, Users, Megaphone } from 'lucide-react';
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
                <div className="max-w-4xl mx-auto px-4 py-6 md:py-10 space-y-14 md:space-y-16">

                    {/* Hero Section */}
                    <section>
                        <Card className="bg-white/80 backdrop-blur-sm border border-slate-200/60 shadow-lg rounded-3xl overflow-hidden">
                            <CardContent className="p-7 md:p-10 pb-10 md:pb-12 text-center space-y-7 md:space-y-8">
                                <div className="flex flex-wrap justify-center gap-2 mb-5">
                                    <Badge className="bg-green-100 text-green-700 hover:bg-green-100 border-green-200 uppercase tracking-widest text-[10px] font-bold">
                                        Licenca de Uso Gratuita
                                    </Badge>
                                    <Badge variant="outline" className="bg-indigo-50/50 border-indigo-100 text-indigo-600 uppercase tracking-widest text-[10px] font-bold">
                                        Tecnologia a Servico do Reino
                                    </Badge>
                                </div>

                                <div className="space-y-6 max-w-3xl mx-auto">
                                    <h2 className="text-[2.35rem] sm:text-5xl md:text-6xl font-black text-slate-900 tracking-tight leading-[1.05]">
                                        Fortaleca sua <span className="bg-gradient-to-r from-indigo-600 to-blue-600 bg-clip-text text-transparent">Igreja</span>
                                    </h2>
                                    <p className="text-base sm:text-lg md:text-xl text-slate-600 leading-relaxed max-w-2xl mx-auto">
                                        Implante o MD Connect e fortaleca o cuidado com a igreja com organizacao, conteudo e comunicacao.
                                    </p>
                                </div>

                                <div className="mt-7 grid grid-cols-1 sm:grid-cols-2 gap-3 w-full max-w-2xl mx-auto">
                                    <Button
                                        className="w-full h-12 rounded-full bg-indigo-600 hover:bg-indigo-700 text-white font-semibold shadow-md shadow-indigo-200/60 md:hover:scale-[1.02] transition"
                                        onClick={() => navigate(APP_ROUTES.CHURCH_IMPLEMENTATION)}
                                    >
                                        <Rocket className="w-5 h-5 mr-2" />
                                        Quero implantar
                                    </Button>
                                    <Button
                                        variant="outline"
                                        className="w-full h-12 rounded-full bg-white/70 backdrop-blur border-slate-200 text-slate-800 hover:bg-white transition"
                                        onClick={() => window.open(EXTERNAL_LINKS.SUPPORT_WHATSAPP, '_blank')}
                                    >
                                        <MessageCircle className="w-5 h-5 mr-2" />
                                        Falar com a equipe
                                    </Button>
                                </div>
                            </CardContent>
                        </Card>
                    </section>

                    {/* Features Section */}
                    <section className="space-y-12">
                        <div className="text-center space-y-2">
                            <h3 className="text-2xl font-bold text-slate-900">O que sua igreja recebe</h3>
                            <p className="text-slate-500 text-sm">Ecossistema completo para gestao e cuidado pastoral</p>
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                            <Card className="border-slate-200/60 bg-white/80 backdrop-blur-sm shadow-sm h-full hover:shadow-lg hover:border-indigo-200 transition-all">
                                <CardContent className="p-6 md:p-8 flex flex-col items-start gap-4">
                                    <div className="bg-gradient-to-br from-indigo-50 to-indigo-100/50 rounded-2xl p-3.5 md:p-4 flex-shrink-0">
                                        <BookOpen className="w-7 h-7 text-indigo-600" />
                                    </div>
                                    <div>
                                        <h4 className="font-bold text-slate-900 mb-1">Devocional + Biblia</h4>
                                        <p className="text-sm text-slate-600 leading-relaxed">Conteudo espiritual renovado todo dia</p>
                                    </div>
                                </CardContent>
                            </Card>

                            <Card className="border-slate-200/60 bg-white/80 backdrop-blur-sm shadow-sm h-full hover:shadow-lg hover:border-indigo-200 transition-all">
                                <CardContent className="p-6 md:p-8 flex flex-col items-start gap-4">
                                    <div className="bg-gradient-to-br from-indigo-50 to-indigo-100/50 rounded-2xl p-3.5 md:p-4 flex-shrink-0">
                                        <Megaphone className="w-7 h-7 text-indigo-600" />
                                    </div>
                                    <div>
                                        <h4 className="font-bold text-slate-900 mb-1">Mural e Comunicados</h4>
                                        <p className="text-sm text-slate-600 leading-relaxed">Avisos e comunicacao direta</p>
                                    </div>
                                </CardContent>
                            </Card>

                            <Card className="border-slate-200/60 bg-white/80 backdrop-blur-sm shadow-sm h-full hover:shadow-lg hover:border-indigo-200 transition-all">
                                <CardContent className="p-6 md:p-8 flex flex-col items-start gap-4">
                                    <div className="bg-gradient-to-br from-indigo-50 to-indigo-100/50 rounded-2xl p-3.5 md:p-4 flex-shrink-0">
                                        <Heart className="w-7 h-7 text-indigo-600" />
                                    </div>
                                    <div>
                                        <h4 className="font-bold text-slate-900 mb-1">Pedidos de Oracao</h4>
                                        <p className="text-sm text-slate-600 leading-relaxed">Sistema de pedidos pastoral</p>
                                    </div>
                                </CardContent>
                            </Card>

                            <Card className="border-slate-200/60 bg-white/80 backdrop-blur-sm shadow-sm h-full hover:shadow-lg hover:border-indigo-200 transition-all">
                                <CardContent className="p-6 md:p-8 flex flex-col items-start gap-4">
                                    <div className="bg-gradient-to-br from-indigo-50 to-indigo-100/50 rounded-2xl p-3.5 md:p-4 flex-shrink-0">
                                        <Calendar className="w-7 h-7 text-indigo-600" />
                                    </div>
                                    <div>
                                        <h4 className="font-bold text-slate-900 mb-1">Agenda e Eventos</h4>
                                        <p className="text-sm text-slate-600 leading-relaxed">Calendario de cultos e atividades</p>
                                    </div>
                                </CardContent>
                            </Card>

                            <Card className="border-slate-200/60 bg-white/80 backdrop-blur-sm shadow-sm h-full hover:shadow-lg hover:border-indigo-200 transition-all">
                                <CardContent className="p-6 md:p-8 flex flex-col items-start gap-4">
                                    <div className="bg-gradient-to-br from-indigo-50 to-indigo-100/50 rounded-2xl p-3.5 md:p-4 flex-shrink-0">
                                        <Globe className="w-7 h-7 text-indigo-600" />
                                    </div>
                                    <div>
                                        <h4 className="font-bold text-slate-900 mb-1">Area Publica</h4>
                                        <p className="text-sm text-slate-600 leading-relaxed">Site mobile gratuito</p>
                                    </div>
                                </CardContent>
                            </Card>

                            <Card className="border-slate-200/60 bg-white/80 backdrop-blur-sm shadow-sm h-full hover:shadow-lg hover:border-indigo-200 transition-all">
                                <CardContent className="p-6 md:p-8 flex flex-col items-start gap-4">
                                    <div className="bg-gradient-to-br from-indigo-50 to-indigo-100/50 rounded-2xl p-3.5 md:p-4 flex-shrink-0">
                                        <Users className="w-7 h-7 text-indigo-600" />
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
                        <div className="bg-gradient-to-br from-indigo-50 via-white to-indigo-50 border border-indigo-100 rounded-3xl md:rounded-[2.5rem] p-8 md:p-12 space-y-8 relative overflow-hidden">
                            {/* Background Decor */}
                            <div className="absolute top-0 left-0 w-48 h-48 md:w-56 md:h-56 bg-indigo-200/20 rounded-full blur-3xl -ml-20 -mt-20 pointer-events-none" />
                            <div className="absolute bottom-0 right-0 w-48 h-48 md:w-56 md:h-56 bg-indigo-200/20 rounded-full blur-3xl -mr-20 -mb-20 pointer-events-none" />

                            <div className="relative z-10 space-y-6 max-w-2xl mx-auto">
                                <h3 className="text-3xl md:text-4xl font-black text-slate-900 tracking-tight leading-tight">
                                    Pronto para <span className="bg-gradient-to-r from-indigo-600 to-blue-600 bg-clip-text text-transparent">comecar</span>?
                                </h3>
                                <p className="text-base md:text-lg font-medium text-slate-700">
                                    Junte-se as igrejas que ja usam o MD Connect.
                                </p>
                                <div className="pt-4">
                                    <Button
                                        size="lg"
                                        className="bg-gradient-to-r from-slate-900 to-slate-800 hover:from-slate-800 hover:to-slate-700 text-white font-bold h-14 md:h-16 px-12 rounded-full shadow-2xl shadow-slate-900/20 transition-all hover:scale-105 active:scale-95 gap-3"
                                        onClick={() => navigate(APP_ROUTES.CHURCH_IMPLEMENTATION)}
                                    >
                                        <Rocket className="w-6 h-6 text-indigo-300" />
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

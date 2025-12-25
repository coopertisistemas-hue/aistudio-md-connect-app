import { useEffect, useState } from 'react';
import { InternalPageLayout } from '@/components/layout/InternalPageLayout';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent } from '@/components/ui/card';
import {
    Accordion,
    AccordionContent,
    AccordionItem,
    AccordionTrigger,
} from '@/components/ui/accordion';
import { DoeSupportCard } from '@/components/monetization/DoeSupportCard';
import { SEOHead } from '@/components/SEO/SEOHead';
import { EXTERNAL_LINKS } from '@/lib/routes';
import {
    ShieldCheck,
    MessageSquare,
    Building2,
    CheckCircle2,
    Globe,
    MapPin,
    Sparkles,
    User,
    Mail,
    Phone,
    MapPinned
} from 'lucide-react';

export default function ChurchImplementationPage() {
    const [loading, setLoading] = useState(false);

    // Form State
    const [formData, setFormData] = useState({
        name: '',
        churchName: '',
        role: '',
        city: '',
        whatsapp: '',
        email: '',
        type: 'remote', // remote | local
        schedule: '',
        message: ''
    });

    useEffect(() => {
        window.scrollTo(0, 0);
    }, []);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleTypeChange = (value: string) => {
        setFormData(prev => ({ ...prev, type: value }));
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);

        // Construct Mailto as fallback
        const subject = `Solicitacao de Implantacao MD Connect - ${formData.churchName}`;
        const body = `Nome: ${formData.name}%0D%0ACargo: ${formData.role}%0D%0AIgreja: ${formData.churchName}%0D%0ACidade: ${formData.city}%0D%0AWhatsApp: ${formData.whatsapp}%0D%0AEmail: ${formData.email}%0D%0ATipo: ${formData.type === 'remote' ? 'Remota' : 'Presencial'}%0D%0AHorario: ${formData.schedule}%0D%0AMensagem: ${formData.message}`;

        setTimeout(() => {
            setLoading(false);
            window.location.href = `mailto:contato@mdconnect.com.br?subject=${subject}&body=${body}`;
        }, 1500);
    };

    const scrollToForm = () => {
        document.getElementById('implementation-form')?.scrollIntoView({ behavior: 'smooth' });
    };

    return (
        <>
            <SEOHead
                config={{
                    title: "Implantacao de Igreja - MD Connect",
                    description: "Implante o MD Connect na sua igreja com suporte completo e gratuito"
                }}
            />

            {/* Video Background com Glass Premium */}
            <div className="fixed inset-0 -z-10 overflow-hidden">
                <video
                    autoPlay
                    loop
                    muted
                    playsInline
                    className="absolute inset-0 w-full h-full object-cover opacity-[0.18]"
                >
                    <source src="/videos/md-bg.mp4" type="video/mp4" />
                </video>
                {/* Overlay translúcido para efeito glass */}
                <div className="absolute inset-0 bg-white/65 backdrop-blur-sm" />
                {/* Gradiente vertical para profundidade */}
                <div className="absolute inset-0 bg-gradient-to-b from-white/60 via-white/35 to-white/70" />
            </div>


            <InternalPageLayout
                title="Sua Igreja no Digital"
                subtitle="Implantacao assistida, segura e focada na expansao do Reino."
                tagline="Implantacao & Tecnologia"
                icon={Building2}
                backPath="/sou-igreja"
                className="pb-24"
                showDoe={false}
                showSponsor={false}
            >
                <div className="max-w-4xl mx-auto px-4 py-8 space-y-24">

                    {/* CONTEUDO SERA ADICIONADO AQUI INCREMENTALMENTE */}


                    {/* 1. HERO SECTION */}
                    <section className="text-center space-y-8 py-4">
                        <div className="flex flex-wrap justify-center gap-2">
                            <Badge className="bg-green-100 text-green-700 hover:bg-green-100 border-green-200 uppercase tracking-widest text-[10px] font-bold">
                                Licenca de Uso Gratuita
                            </Badge>
                            <Badge variant="outline" className="bg-indigo-50/50 border-indigo-100 text-indigo-600 uppercase tracking-widest text-[10px] font-bold">
                                Assessoria Especializada
                            </Badge>
                        </div>

                        <div className="space-y-4 max-w-3xl mx-auto">
                            <h2 className="text-3xl md:text-5xl font-black text-slate-900 tracking-tight leading-[1.1]">
                                Organize seu ministerio com <span className="bg-gradient-to-r from-indigo-600 to-blue-600 bg-clip-text text-transparent">tecnologia servil.</span>
                            </h2>
                            <p className="text-slate-600 leading-relaxed md:text-xl max-w-2xl mx-auto">
                                Levamos a estrutura digital completa para sua igreja, focando na facilitacao do discipulado e na gestao transparente do rebanho.
                            </p>
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-4 max-w-2xl mx-auto">
                            <Button
                                size="lg"
                                className="w-full bg-green-600 hover:bg-green-700 text-white font-bold h-14 px-8 rounded-full shadow-xl shadow-green-200 gap-2 transition-all hover:scale-105 active:scale-95"
                                onClick={() => window.open(EXTERNAL_LINKS.SUPPORT_WHATSAPP, '_blank')}
                            >
                                <MessageSquare className="w-5 h-5" />
                                Conversar no WhatsApp
                            </Button>
                            <Button
                                size="lg"
                                variant="outline"
                                className="w-full bg-white/80 backdrop-blur-sm hover:bg-white text-slate-700 border-slate-200 font-bold h-14 px-8 rounded-full transition-all hover:border-indigo-300"
                                onClick={scrollToForm}
                            >
                                Preencher Formulario
                            </Button>
                        </div>
                    </section>

                    {/* 2. COMO FUNCIONA */}
                    <section className="space-y-12">
                        <div className="text-center space-y-3">
                            <h3 className="text-3xl md:text-4xl font-black text-slate-900 tracking-tight">Como funciona?</h3>
                            <p className="text-slate-600 text-base md:text-lg max-w-2xl mx-auto">O processo e agil, simples e acompanhado por nossa equipe ministerial.</p>
                        </div>

                        <div className="space-y-6">
                            {[
                                {
                                    step: "01",
                                    title: "Solicitacao",
                                    desc: "Voce preenche o formulario com os dados da igreja e lideranca.",
                                    gradient: "from-blue-500 to-indigo-600",
                                    icon: "📝"
                                },
                                {
                                    step: "02",
                                    title: "Configuracao",
                                    desc: "Nossa equipe valida as informacoes e prepara seu ambiente exclusivo.",
                                    gradient: "from-indigo-500 to-purple-600",
                                    icon: "⚙️"
                                },
                                {
                                    step: "03",
                                    title: "Liberacao",
                                    desc: "Voce recebe os acessos, materiais de treinamento e suporte inicial.",
                                    gradient: "from-purple-500 to-pink-600",
                                    icon: "🚀"
                                }
                            ].map((s, i) => (
                                <div key={i} className="relative group">
                                    <Card className="border-slate-200/60 bg-white/80 backdrop-blur-sm shadow-lg hover:shadow-2xl hover:scale-[1.02] transition-all duration-300">
                                        <CardContent className="p-6 md:p-8">
                                            <div className="flex items-start gap-6">
                                                {/* Icon Badge */}
                                                <div className={`w-16 h-16 md:w-20 md:h-20 rounded-3xl bg-gradient-to-br ${s.gradient} flex items-center justify-center text-3xl md:text-4xl shadow-lg shrink-0 group-hover:scale-110 transition-transform`}>
                                                    {s.icon}
                                                </div>

                                                {/* Content */}
                                                <div className="flex-1 space-y-2 pt-1">
                                                    <div className="flex items-center gap-3">
                                                        <div className="w-8 h-8 rounded-lg bg-indigo-50 text-indigo-600 flex items-center justify-center font-black text-xs">
                                                            {s.step}
                                                        </div>
                                                        <h4 className="font-black text-slate-900 text-lg md:text-xl tracking-tight">{s.title}</h4>
                                                    </div>
                                                    <p className="text-sm md:text-base text-slate-600 leading-relaxed">{s.desc}</p>
                                                </div>
                                            </div>
                                        </CardContent>
                                    </Card>
                                </div>
                            ))}
                        </div>
                    </section>

                    {/* 3. FORMULARIO DE IMPLANTACAO */}
                    <section id="implementation-form" className="scroll-mt-20">
                        <Card className="border-indigo-100 bg-gradient-to-br from-indigo-50/50 to-white backdrop-blur-sm shadow-xl">
                            <CardContent className="p-8 md:p-12">
                                <div className="text-center space-y-3 mb-10">
                                    <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-indigo-600 text-white mb-4">
                                        <ShieldCheck className="w-8 h-8" />
                                    </div>
                                    <h3 className="text-3xl md:text-4xl font-black text-slate-900 tracking-tight">Inicie a implantacao</h3>
                                    <p className="text-slate-600 text-base md:text-lg max-w-2xl mx-auto">O ministerio entrara em contato em breve.</p>
                                </div>

                                <form onSubmit={handleSubmit} className="space-y-10">
                                    {/* Responsavel pela Solicitacao */}
                                    <div className="space-y-5">
                                        <div className="flex items-center gap-2 text-slate-700">
                                            <User className="w-5 h-5 text-indigo-600" />
                                            <h4 className="font-bold text-sm uppercase tracking-wider">Responsavel pela Solicitacao</h4>
                                        </div>

                                        <div className="space-y-4">
                                            <div className="space-y-2">
                                                <label className="text-sm font-medium text-slate-700">Seu Nome Completo</label>
                                                <Input
                                                    name="name"
                                                    value={formData.name}
                                                    onChange={handleChange}
                                                    placeholder="Ex: Pr. Joao dos Santos"
                                                    required
                                                    className="h-12 bg-white/80 border-slate-200 focus:border-indigo-400"
                                                />
                                            </div>
                                            <div className="space-y-2">
                                                <label className="text-sm font-medium text-slate-700">Cargo ou Funcao</label>
                                                <Input
                                                    name="role"
                                                    value={formData.role}
                                                    onChange={handleChange}
                                                    placeholder="Ex: Pastor Presidente"
                                                    required
                                                    className="h-12 bg-white/80 border-slate-200 focus:border-indigo-400"
                                                />
                                            </div>
                                            <div className="space-y-2">
                                                <label className="text-sm font-medium text-slate-700">WhatsApp de Contato</label>
                                                <Input
                                                    name="whatsapp"
                                                    value={formData.whatsapp}
                                                    onChange={handleChange}
                                                    placeholder="(00) 00000-0000"
                                                    required
                                                    className="h-12 bg-white/80 border-slate-200 focus:border-indigo-400"
                                                />
                                            </div>
                                            <div className="space-y-2">
                                                <label className="text-sm font-medium text-slate-700">E-mail Institucional</label>
                                                <Input
                                                    name="email"
                                                    type="email"
                                                    value={formData.email}
                                                    onChange={handleChange}
                                                    placeholder="contato@igreja.com"
                                                    required
                                                    className="h-12 bg-white/80 border-slate-200 focus:border-indigo-400"
                                                />
                                            </div>
                                        </div>
                                    </div>

                                    {/* Dados da Instituicao */}
                                    <div className="space-y-6 pt-6 border-t border-slate-200">
                                        <div className="flex items-center gap-2 text-slate-700">
                                            <Building2 className="w-5 h-5 text-indigo-600" />
                                            <h4 className="font-bold text-sm uppercase tracking-wider">Dados da Instituicao</h4>
                                        </div>

                                        <div className="space-y-4">
                                            <div className="space-y-2">
                                                <label className="text-sm font-medium text-slate-700">Nome da Igreja</label>
                                                <Input
                                                    name="churchName"
                                                    value={formData.churchName}
                                                    onChange={handleChange}
                                                    placeholder="Ex: Igreja Evangelica Betel"
                                                    required
                                                    className="h-12 bg-white/80 border-slate-200 focus:border-indigo-400"
                                                />
                                            </div>
                                            <div className="space-y-2">
                                                <label className="text-sm font-medium text-slate-700">Cidade / UF</label>
                                                <Input
                                                    name="city"
                                                    value={formData.city}
                                                    onChange={handleChange}
                                                    placeholder="Ex: Rio de Janeiro - RJ"
                                                    required
                                                    className="h-12 bg-white/80 border-slate-200 focus:border-indigo-400"
                                                />
                                            </div>
                                        </div>
                                    </div>

                                    {/* Modelo de Implantacao */}
                                    <div className="space-y-5 pt-8 border-t border-slate-200">
                                        <div className="flex items-center gap-2 text-slate-700">
                                            <Sparkles className="w-5 h-5 text-indigo-600" />
                                            <h4 className="font-bold text-sm uppercase tracking-wider">Modelo de Implantacao Preferencial</h4>
                                        </div>

                                        <div className="grid md:grid-cols-2 gap-4 items-start">
                                            {/* REMOTA */}
                                            <button
                                                type="button"
                                                onClick={() => handleTypeChange('remote')}
                                                className={`p-6 rounded-2xl border-2 transition-all text-center ${formData.type === 'remote'
                                                    ? 'border-indigo-600 bg-indigo-50'
                                                    : 'border-slate-200 bg-white/50 hover:border-indigo-300'
                                                    }`}
                                            >
                                                <div className="flex flex-col items-center gap-3">
                                                    <div className="w-12 h-12 rounded-xl bg-indigo-100 text-indigo-600 flex items-center justify-center">
                                                        <Globe className="w-6 h-6" />
                                                    </div>

                                                    <div className="space-y-1">
                                                        <h5 className="font-bold text-slate-900 leading-tight">Remota</h5>
                                                        <p className="text-xs text-green-600 font-bold uppercase">Gratuita</p>
                                                    </div>

                                                    <p className="text-sm text-slate-600 leading-relaxed">
                                                        Configuracao via videochamada e suporte continuo.
                                                    </p>
                                                </div>
                                            </button>

                                            {/* PRESENCIAL */}
                                            <button
                                                type="button"
                                                onClick={() => handleTypeChange('local')}
                                                className={`p-6 rounded-2xl border-2 transition-all text-center ${formData.type === 'local'
                                                    ? 'border-indigo-600 bg-indigo-50'
                                                    : 'border-slate-200 bg-white/50 hover:border-indigo-300'
                                                    }`}
                                            >
                                                <div className="flex flex-col items-center gap-3">
                                                    <div className="w-12 h-12 rounded-xl bg-orange-100 text-orange-600 flex items-center justify-center">
                                                        <MapPin className="w-6 h-6" />
                                                    </div>

                                                    <div className="space-y-1">
                                                        <h5 className="font-bold text-slate-900 leading-tight">Presencial</h5>
                                                        <p className="text-xs text-orange-600 font-bold uppercase">Consultar</p>
                                                    </div>

                                                    <p className="text-sm text-slate-600 leading-relaxed">
                                                        Visita tecnica e treinamento in-loco.
                                                    </p>
                                                </div>
                                            </button>
                                        </div>

                                        <div className="space-y-2">
                                            <label className="text-sm font-medium text-slate-700">Melhor horario para contato</label>
                                            <Input
                                                name="schedule"
                                                value={formData.schedule}
                                                onChange={handleChange}
                                                placeholder="Ex: Manha (9h as 12h)"
                                                className="h-12 bg-white/80 border-slate-200 focus:border-indigo-400"
                                            />
                                        </div>
                                    </div>

                                    {/* Mensagem */}
                                    <div className="space-y-6 pt-6 border-t border-slate-200">
                                        <div className="space-y-2">
                                            <label className="text-sm font-medium text-slate-700">Mensagem ou Duvida (Opcional)</label>
                                            <Textarea
                                                name="message"
                                                value={formData.message}
                                                onChange={handleChange}
                                                placeholder="Conte-nos um pouco sobre a necessidade da sua igreja..."
                                                rows={4}
                                                className="bg-white/80 border-slate-200 focus:border-indigo-400 resize-none"
                                            />
                                        </div>
                                    </div>

                                    {/* Submit Button */}
                                    <div className="pt-6">
                                        <Button
                                            type="submit"
                                            disabled={loading}
                                            className="w-full h-14 bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-lg rounded-full shadow-xl shadow-indigo-200 transition-all hover:scale-105 active:scale-95"
                                        >
                                            {loading ? 'Enviando...' : 'Solicitar Implantacao'}
                                        </Button>
                                        <p className="text-xs text-slate-500 text-center mt-4">
                                            Ao enviar, voce concorda com nossos termos de uso e politica de privacidade.
                                        </p>
                                    </div>
                                </form>
                            </CardContent>
                        </Card>
                    </section>

                    {/* 4. FAQ - PERGUNTAS FREQUENTES */}
                    <section className="space-y-8">
                        <div className="text-center space-y-3">
                            <h3 className="text-3xl md:text-4xl font-black text-slate-900 tracking-tight">Perguntas Frequentes</h3>
                            <p className="text-slate-600 text-base md:text-lg max-w-2xl mx-auto">Tire suas duvidas sobre a implantacao do MD Connect.</p>
                        </div>

                        <Accordion type="single" collapsible className="space-y-4">
                            <AccordionItem value="item-1" className="border-slate-200 bg-white/80 backdrop-blur-sm rounded-2xl px-6 border-2">
                                <AccordionTrigger className="text-left font-bold text-slate-900 hover:no-underline py-5">
                                    A licenca de uso e realmente gratuita?
                                </AccordionTrigger>
                                <AccordionContent className="text-slate-600 leading-relaxed pb-5">
                                    Sim! O MD Connect e 100% gratuito para igrejas. Nao cobramos mensalidades, taxas de implantacao ou custos ocultos.
                                    Nossa missao e servir o Reino com tecnologia de qualidade.
                                </AccordionContent>
                            </AccordionItem>

                            <AccordionItem value="item-2" className="border-slate-200 bg-white/80 backdrop-blur-sm rounded-2xl px-6 border-2">
                                <AccordionTrigger className="text-left font-bold text-slate-900 hover:no-underline py-5">
                                    Qual o prazo para liberacao apos a solicitacao?
                                </AccordionTrigger>
                                <AccordionContent className="text-slate-600 leading-relaxed pb-5">
                                    Normalmente, o processo leva de 3 a 5 dias uteis. Nossa equipe valida as informacoes, configura seu ambiente
                                    exclusivo e prepara os materiais de treinamento antes da liberacao.
                                </AccordionContent>
                            </AccordionItem>

                            <AccordionItem value="item-3" className="border-slate-200 bg-white/80 backdrop-blur-sm rounded-2xl px-6 border-2">
                                <AccordionTrigger className="text-left font-bold text-slate-900 hover:no-underline py-5">
                                    Preciso ter conhecimento tecnico para usar?
                                </AccordionTrigger>
                                <AccordionContent className="text-slate-600 leading-relaxed pb-5">
                                    Nao! O MD Connect foi desenvolvido para ser intuitivo e facil de usar. Alem disso, fornecemos materiais de
                                    treinamento, tutoriais em video e suporte continuo para sua equipe.
                                </AccordionContent>
                            </AccordionItem>

                            <AccordionItem value="item-4" className="border-slate-200 bg-white/80 backdrop-blur-sm rounded-2xl px-6 border-2">
                                <AccordionTrigger className="text-left font-bold text-slate-900 hover:no-underline py-5">
                                    Posso personalizar o sistema com a identidade da minha igreja?
                                </AccordionTrigger>
                                <AccordionContent className="text-slate-600 leading-relaxed pb-5">
                                    Sim! Voce pode adicionar o logo da sua igreja, ajustar cores e personalizar diversos aspectos visuais
                                    para refletir a identidade do seu ministerio.
                                </AccordionContent>
                            </AccordionItem>

                            <AccordionItem value="item-5" className="border-slate-200 bg-white/80 backdrop-blur-sm rounded-2xl px-6 border-2">
                                <AccordionTrigger className="text-left font-bold text-slate-900 hover:no-underline py-5">
                                    E possivel migrar dados de outro sistema?
                                </AccordionTrigger>
                                <AccordionContent className="text-slate-600 leading-relaxed pb-5">
                                    Sim! Nossa equipe pode auxiliar na migracao de dados de planilhas ou outros sistemas. Entre em contato
                                    conosco para avaliarmos a melhor forma de realizar essa transicao.
                                </AccordionContent>
                            </AccordionItem>
                        </Accordion>
                    </section>

                    {/* 5. CTA WHATSAPP FINAL */}
                    <section>
                        <Card className="border-green-100 bg-gradient-to-br from-green-50/50 to-white backdrop-blur-sm shadow-xl">
                            <CardContent className="p-8 md:p-12 text-center">
                                <div className="space-y-6 max-w-2xl mx-auto">
                                    <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-green-600 text-white mb-2">
                                        <MessageSquare className="w-8 h-8" />
                                    </div>

                                    <div className="space-y-3">
                                        <h3 className="text-2xl md:text-3xl font-black text-slate-900 tracking-tight">
                                            Ainda tem duvidas?
                                        </h3>
                                        <p className="text-slate-600 text-base md:text-lg leading-relaxed">
                                            Nossa equipe esta pronta para atender sua igreja. Entre em contato via WhatsApp e tire todas as suas duvidas!
                                        </p>
                                    </div>

                                    <Button
                                        size="lg"
                                        className="bg-green-600 hover:bg-green-700 text-white font-bold h-14 px-8 rounded-full shadow-xl shadow-green-200 gap-2 transition-all hover:scale-105 active:scale-95"
                                        onClick={() => window.open(EXTERNAL_LINKS.SUPPORT_WHATSAPP, '_blank')}
                                    >
                                        <MessageSquare className="w-5 h-5" />
                                        Falar com a Equipe
                                    </Button>
                                </div>
                            </CardContent>
                        </Card>
                    </section>


                </div>
            </InternalPageLayout>
        </>
    );
}

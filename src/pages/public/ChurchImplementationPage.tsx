import { useEffect, useState } from 'react';
import { InternalPageLayout } from '@/components/layout/InternalPageLayout';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent } from '@/components/ui/card';
import {
    ShieldCheck,
    MessageSquare,
    Building2,
    User,
    CheckCircle2,
    Globe,
    MapPin,
    Sparkles
} from 'lucide-react';
import { EXTERNAL_LINKS } from '@/lib/routes';
import { DoeSupportCard } from '@/components/monetization/DoeSupportCard';
import {
    Accordion,
    AccordionContent,
    AccordionItem,
    AccordionTrigger,
} from "@/components/ui/accordion";

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
        const subject = `Solicitação de Implantação MD Connect - ${formData.churchName}`;
        const body = `Nome: ${formData.name}%0D%0ACargo: ${formData.role}%0D%0AIgreja: ${formData.churchName}%0D%0ACidade: ${formData.city}%0D%0AWhatsApp: ${formData.whatsapp}%0D%0AEmail: ${formData.email}%0D%0ATipo: ${formData.type === 'remote' ? 'Remota' : 'Presencial'}%0D%0AHorário: ${formData.schedule}%0D%0AMensagem: ${formData.message}`;

        setTimeout(() => {
            setLoading(false);
            window.location.href = `mailto:contato@mdconnect.com.br?subject=${subject}&body=${body}`;
        }, 1500);
    };

    const scrollToForm = () => {
        document.getElementById('implementation-form')?.scrollIntoView({ behavior: 'smooth' });
    };

    return (
        <InternalPageLayout
            title="Sua Igreja no Digital"
            subtitle="Implantação assistida, segura e focada na expansão do Reino."
            tagline="Implantação & Tecnologia"
            icon={Building2}
            className="pb-24"
            showDoe={false} // We will use a custom section for this to meet requiremens
            showSponsor={false}
        >
            <div className="max-w-4xl mx-auto px-4 py-8 space-y-24">

                {/* 1. HERO SECTION (Already partially in InternalPageLayout, but adding extra visual weight) */}
                <section className="text-center space-y-8 py-4">
                    <div className="flex flex-wrap justify-center gap-2">
                        <Badge className="bg-green-100 text-green-700 hover:bg-green-100 border-green-200 uppercase tracking-widest text-[10px] font-bold">
                            Licença de Uso Gratuita
                        </Badge>
                        <Badge variant="outline" className="bg-indigo-50/50 border-indigo-100 text-indigo-600 uppercase tracking-widest text-[10px] font-bold">
                            Assessoria Especializada
                        </Badge>
                    </div>

                    <div className="space-y-4 max-w-3xl mx-auto">
                        <h2 className="text-3xl md:text-5xl font-black text-slate-900 tracking-tight leading-[1.1]">
                            Organize seu ministério com <span className="text-indigo-600">tecnologia servil.</span>
                        </h2>
                        <p className="text-slate-600 leading-relaxed md:text-xl max-w-2xl mx-auto">
                            Levamos a estrutura digital completa para sua igreja, focando na facilitação do discipulado e na gestão transparente do rebanho.
                        </p>
                    </div>

                    <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4">
                        <Button
                            size="lg"
                            className="w-full sm:w-auto bg-green-600 hover:bg-green-700 text-white font-bold h-14 px-10 rounded-full shadow-xl shadow-green-200 gap-2 transition-all hover:scale-105 active:scale-95"
                            onClick={() => window.open(EXTERNAL_LINKS.SUPPORT_WHATSAPP, '_blank')}
                        >
                            <MessageSquare className="w-5 h-5" />
                            Conversar no WhatsApp
                        </Button>
                        <Button
                            size="lg"
                            variant="outline"
                            className="w-full sm:w-auto bg-white/80 backdrop-blur-sm hover:bg-white text-slate-700 border-slate-200 font-bold h-14 px-10 rounded-full transition-all hover:border-indigo-300"
                            onClick={scrollToForm}
                        >
                            Preencher Formulário
                        </Button>
                    </div>
                </section>

                {/* 2. COMO FUNCIONA */}
                <section className="space-y-12">
                    <div className="text-center space-y-2">
                        <h3 className="text-2xl font-bold text-slate-900">Como funciona?</h3>
                        <p className="text-slate-500 text-sm">O processo é ágil e acompanhado por nossa equipe.</p>
                    </div>

                    <div className="grid gap-6 md:grid-cols-3">
                        {[
                            { step: "01", title: "Solicitação", desc: "Você preenche o formulário com os dados da igreja e liderança." },
                            { step: "02", title: "Configuração", desc: "Nossa equipe valida as informações e prepara seu ambiente exclusivo." },
                            { step: "03", title: "Liberação", desc: "Você recebe os acessos, materiais de treinamento e suporte inicial." }
                        ].map((s, i) => (
                            <div key={i} className="relative">
                                <Card className="border-slate-100 bg-white/60 backdrop-blur-sm shadow-sm h-full hover:shadow-md transition-shadow">
                                    <CardContent className="p-8 flex flex-col items-center text-center gap-4">
                                        <div className="w-14 h-14 rounded-2xl bg-indigo-50 text-indigo-600 flex items-center justify-center font-black text-xl mb-2">
                                            {s.step}
                                        </div>
                                        <h4 className="font-bold text-slate-900 text-lg">{s.title}</h4>
                                        <p className="text-sm text-slate-600 leading-relaxed">{s.desc}</p>
                                    </CardContent>
                                </Card>
                            </div>
                        ))}
                    </div>
                </section>

                {/* 3. O QUE SUA IGREJA RECEBE */}
                <section className="bg-slate-900 rounded-[2.5rem] p-8 md:p-16 text-white shadow-2xl relative overflow-hidden">
                    <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-indigo-500/10 rounded-full blur-[120px] -translate-y-1/2 translate-x-1/2 pointer-events-none" />

                    <div className="relative z-10 grid md:grid-cols-2 gap-16 items-center">
                        <div className="space-y-8">
                            <div className="space-y-4">
                                <Badge className="bg-indigo-500/20 text-indigo-300 border-indigo-500/30">
                                    Sem custo de licença mensal
                                </Badge>
                                <h3 className="text-3xl md:text-4xl font-bold">Ecossistema completo</h3>
                                <p className="text-slate-400 text-lg leading-relaxed">
                                    Toda a tecnologia necessária para a jornada do membro e a gestão da instituição, disponível sem barreiras financeiras.
                                </p>
                            </div>

                            <ul className="grid grid-cols-1 sm:grid-cols-2 gap-y-4 gap-x-8">
                                {[
                                    "App Exclusivo p/ Membros",
                                    "Gestão de Células/Grupos",
                                    "Secretaria Digital",
                                    "Tesouraria Transparente",
                                    "Agenda & Eventos",
                                    "Área de Conteúdo Bíblico",
                                    "Devocionais Integradas",
                                    "Suporte via Comunidade"
                                ].map((item, i) => (
                                    <li key={i} className="flex items-center gap-3 text-sm text-slate-300">
                                        <div className="p-1 rounded-full bg-green-500/20 text-green-400 shrink-0">
                                            <CheckCircle2 className="w-3.5 h-3.5" />
                                        </div>
                                        {item}
                                    </li>
                                ))}
                            </ul>
                        </div>

                        <div className="bg-white/5 backdrop-blur-md rounded-3xl p-8 border border-white/10 space-y-6">
                            <div className="flex items-center gap-3 text-indigo-400">
                                <Sparkles className="w-6 h-6" />
                                <h4 className="font-bold text-xl text-white">Pronto para o uso</h4>
                            </div>
                            <p className="text-sm text-slate-400 leading-relaxed">
                                Diferente de outros sistemas, o MD Connect já nasce configurado com as melhores práticas de gestão eclesiástica.
                            </p>
                            <div className="p-4 rounded-xl bg-indigo-500/10 border border-indigo-500/20">
                                <p className="text-xs text-indigo-100 font-medium italic">
                                    "O sistema é gratuito para a igreja focar no Reino. Nossa manutenção vem de parcerias e ofertas voluntárias."
                                </p>
                            </div>
                        </div>
                    </div>
                </section>

                {/* 4. MODELOS DE IMPLANTAÇÃO */}
                <section className="space-y-10">
                    <div className="text-center space-y-2">
                        <h3 className="text-2xl font-bold text-slate-900">Modelos de Implantação</h3>
                        <p className="text-slate-500 text-sm">Escolha como prefere que nossa equipe auxilie sua igreja.</p>
                    </div>

                    <div className="grid md:grid-cols-2 gap-8">
                        {/* Remote */}
                        <Card className="border-2 border-slate-100/60 bg-white/50 backdrop-blur-sm relative overflow-hidden group">
                            <div className="absolute top-0 right-0 p-4">
                                <Badge className="bg-green-100 text-green-700 border-none uppercase text-[10px] font-black">Gratuita</Badge>
                            </div>
                            <CardContent className="p-8 space-y-6">
                                <div className="w-12 h-12 rounded-2xl bg-indigo-50 text-indigo-600 flex items-center justify-center">
                                    <Globe className="w-7 h-7" />
                                </div>
                                <div>
                                    <h4 className="font-black text-xl text-slate-900 tracking-tight">Implantação Remota</h4>
                                    <p className="text-sm text-slate-500 mt-2 leading-relaxed">Foco em agilidade. Todo o suporte e treinamento via ferramentas digitais.</p>
                                </div>
                                <ul className="space-y-3 pt-2">
                                    {["Configuração via Videochamada", "Webinars de Treinamento", "Suporte Contínuo via WhatsApp"].map((l, i) => (
                                        <li key={i} className="text-xs text-slate-600 flex gap-2 font-medium">
                                            <CheckCircle2 className="w-4 h-4 text-green-500 shrink-0" /> {l}
                                        </li>
                                    ))}
                                </ul>
                                <Button className="w-full bg-slate-900 h-12 rounded-xl group-hover:bg-indigo-600 transition-colors" onClick={scrollToForm}>
                                    Solicitar Remota
                                </Button>
                            </CardContent>
                        </Card>

                        {/* Presential */}
                        <Card className="border-2 border-slate-100/60 bg-white/50 backdrop-blur-sm relative group">
                            <CardContent className="p-8 space-y-6">
                                <div className="w-12 h-12 rounded-2xl bg-orange-50 text-orange-600 flex items-center justify-center">
                                    <MapPin className="w-7 h-7" />
                                </div>
                                <div>
                                    <h4 className="font-black text-xl text-slate-900 tracking-tight">Presencial / Local</h4>
                                    <p className="text-sm text-slate-500 mt-2 leading-relaxed">Visita técnica e workshops presenciais para a liderança e voluntários.</p>
                                </div>
                                <ul className="space-y-3 pt-2">
                                    {["Treinamento In-loco", "Consultoria de Processos", "Setup Assistido presencial"].map((l, i) => (
                                        <li key={i} className="text-xs text-slate-600 flex gap-2 font-medium">
                                            <CheckCircle2 className="w-4 h-4 text-green-500 shrink-0" /> {l}
                                        </li>
                                    ))}
                                </ul>
                                <div className="space-y-3">
                                    <Button variant="outline" className="w-full border-slate-200 h-12 rounded-xl" onClick={scrollToForm}>
                                        Consultar Disponibilidade
                                    </Button>
                                    <p className="text-[10px] text-slate-400 text-center uppercase tracking-widest font-bold">
                                        Custos de deslocamento e logística combinados à parte
                                    </p>
                                </div>
                            </CardContent>
                        </Card>
                    </div>
                </section>

                {/* 5. FORM SECTION */}
                <section id="implementation-form" className="scroll-mt-24 pt-8">
                    <div className="bg-white rounded-[2.5rem] border border-slate-200 shadow-2xl shadow-slate-200/50 overflow-hidden">
                        <div className="bg-indigo-600 p-8 md:p-12 text-white flex flex-col md:flex-row md:items-center justify-between gap-6">
                            <div className="space-y-2">
                                <h3 className="text-2xl md:text-3xl font-bold">Inicie a implantação</h3>
                                <p className="text-indigo-100/80">O ministério entrará em contato em breve.</p>
                            </div>
                            <div className="p-4 bg-white/10 rounded-2xl backdrop-blur-sm border border-white/20 hidden md:block">
                                <ShieldCheck className="w-10 h-10" />
                            </div>
                        </div>

                        <form onSubmit={handleSubmit} className="p-8 md:p-12 space-y-10">
                            {/* Personal Info */}
                            <div className="space-y-6">
                                <div className="flex items-center gap-2 text-slate-400">
                                    <User className="w-4 h-4" />
                                    <span className="text-xs font-bold uppercase tracking-widest">Responsável pela Solicitação</span>
                                </div>
                                <div className="grid md:grid-cols-2 gap-6">
                                    <div className="space-y-2">
                                        <label htmlFor="name" className="text-xs font-bold text-slate-700 ml-1">Seu Nome Completo</label>
                                        <Input id="name" name="name" required placeholder="Ex: Pr. João dos Santos" className="h-12 border-slate-200 focus:ring-indigo-500" value={formData.name} onChange={handleChange} />
                                    </div>
                                    <div className="space-y-2">
                                        <label htmlFor="role" className="text-xs font-bold text-slate-700 ml-1">Cargo ou Função</label>
                                        <Input id="role" name="role" required placeholder="Ex: Pastor Presidente, Secretário" className="h-12 border-slate-200" value={formData.role} onChange={handleChange} />
                                    </div>
                                </div>
                                <div className="grid md:grid-cols-2 gap-6">
                                    <div className="space-y-2">
                                        <label htmlFor="whatsapp" className="text-xs font-bold text-slate-700 ml-1">WhatsApp de Contato</label>
                                        <Input id="whatsapp" name="whatsapp" required placeholder="(00) 00000-0000" className="h-12 border-slate-200" value={formData.whatsapp} onChange={handleChange} />
                                    </div>
                                    <div className="space-y-2">
                                        <label htmlFor="email" className="text-xs font-bold text-slate-700 ml-1">E-mail Institucional</label>
                                        <Input id="email" name="email" type="email" required placeholder="contato@igreja.org" className="h-12 border-slate-200" value={formData.email} onChange={handleChange} />
                                    </div>
                                </div>
                            </div>

                            <hr className="border-slate-100" />

                            {/* Church Info */}
                            <div className="space-y-6">
                                <div className="flex items-center gap-2 text-slate-400">
                                    <Building2 className="w-4 h-4" />
                                    <span className="text-xs font-bold uppercase tracking-widest">Dados da Instituição</span>
                                </div>
                                <div className="grid md:grid-cols-2 gap-6">
                                    <div className="space-y-2">
                                        <label htmlFor="churchName" className="text-xs font-bold text-slate-700 ml-1">Nome da Igreja</label>
                                        <Input id="churchName" name="churchName" required placeholder="Ex: Igreja Evangélica MD Connect Centro" className="h-12 border-slate-200" value={formData.churchName} onChange={handleChange} />
                                    </div>
                                    <div className="space-y-2">
                                        <label htmlFor="city" className="text-xs font-bold text-slate-700 ml-1">Cidade / UF</label>
                                        <Input id="city" name="city" required placeholder="Ex: Rio de Janeiro - RJ" className="h-12 border-slate-200" value={formData.city} onChange={handleChange} />
                                    </div>
                                </div>
                            </div>

                            <hr className="border-slate-100" />

                            {/* Preferences */}
                            <div className="space-y-8">
                                <div className="space-y-4">
                                    <label className="text-xs font-bold text-slate-700 ml-1">Modelo de Implantação Preferencial</label>
                                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                        <label className={`cursor-pointer flex items-center gap-4 p-5 rounded-2xl border-2 transition-all ${formData.type === 'remote' ? 'border-indigo-600 bg-indigo-50/50' : 'border-slate-100 hover:border-slate-200 bg-slate-50/40'}`}>
                                            <input type="radio" name="type" value="remote" className="sr-only" checked={formData.type === 'remote'} onChange={(e) => handleTypeChange(e.target.value)} />
                                            <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${formData.type === 'remote' ? 'bg-indigo-600 text-white' : 'bg-slate-200 text-slate-500'}`}>
                                                <Globe className="w-5 h-5" />
                                            </div>
                                            <div className="flex flex-col">
                                                <span className="font-bold text-sm">Remota</span>
                                                <span className="text-[10px] text-slate-500 uppercase font-black uppercase tracking-widest">Gratuita</span>
                                            </div>
                                        </label>

                                        <label className={`cursor-pointer flex items-center gap-4 p-5 rounded-2xl border-2 transition-all ${formData.type === 'local' ? 'border-orange-500 bg-orange-50/50' : 'border-slate-100 hover:border-slate-200 bg-slate-50/40'}`}>
                                            <input type="radio" name="type" value="local" className="sr-only" checked={formData.type === 'local'} onChange={(e) => handleTypeChange(e.target.value)} />
                                            <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${formData.type === 'local' ? 'bg-orange-500 text-white' : 'bg-slate-200 text-slate-500'}`}>
                                                <MapPin className="w-5 h-5" />
                                            </div>
                                            <div className="flex flex-col">
                                                <span className="font-bold text-sm">Presencial</span>
                                                <span className="text-[10px] text-slate-500 uppercase font-black uppercase tracking-widest">Consultar</span>
                                            </div>
                                        </label>
                                    </div>
                                </div>

                                <div className="space-y-2">
                                    <label htmlFor="schedule" className="text-xs font-bold text-slate-700 ml-1">Melhor horário para contato</label>
                                    <Input id="schedule" name="schedule" placeholder="Ex: Manhã (9h às 12h)" className="h-12 border-slate-200" value={formData.schedule} onChange={handleChange} />
                                </div>
                                <div className="space-y-2">
                                    <label htmlFor="message" className="text-xs font-bold text-slate-700 ml-1">Mensagem ou Dúvida (Opcional)</label>
                                    <Textarea id="message" name="message" placeholder="Conte-nos um pouco sobre a necessidade da sua igreja..." className="min-h-[120px] border-slate-200 focus:ring-indigo-500" value={formData.message} onChange={handleChange} />
                                </div>
                            </div>

                            <div className="pt-4">
                                <Button type="submit" className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-bold h-16 rounded-2xl shadow-xl shadow-indigo-100 text-lg transition-all active:scale-[0.98]" disabled={loading}>
                                    {loading ? "Processando..." : "Solicitar Habilitação Gratuita"}
                                </Button>
                                <p className="text-center text-[11px] text-slate-400 mt-4 leading-relaxed max-w-xs mx-auto">
                                    Ao enviar, você concorda que o MD Connect entre em contato para tratar exclusivamente da implantação.
                                </p>
                            </div>
                        </form>
                    </div>
                </section>

                {/* 6. COMPROMISSO COM O REINO */}
                <DoeSupportCard />

                {/* 7. FAQ */}
                <section className="max-w-3xl mx-auto space-y-12">
                    <div className="text-center space-y-2">
                        <h3 className="text-2xl font-bold text-slate-900">Perguntas Frequentes</h3>
                        <p className="text-slate-500 text-sm">Esclareça suas principais dúvidas sobre o projeto.</p>
                    </div>

                    <Accordion type="single" collapsible className="w-full">
                        <AccordionItem value="item-1" className="border-slate-100">
                            <AccordionTrigger className="text-left font-bold text-slate-800 py-6">É realmente gratuito? Tem pegadinha?</AccordionTrigger>
                            <AccordionContent className="text-slate-600 leading-relaxed pb-6 text-sm">
                                Não há pegadinha. O MD Connect nasceu para servir ao Reino. A "licença de uso" do ERP e do App para membros é totalmente gratuita. Incentivamos que as igrejas usuárias apoiem o projeto financeiramente conforme Deus prosperar, para que possamos manter servidores e equipe técnica, mas isso nunca será um bloqueio para as funcionalidades principais.
                            </AccordionContent>
                        </AccordionItem>
                        <AccordionItem value="item-2" className="border-slate-100">
                            <AccordionTrigger className="text-left font-bold text-slate-800 py-6">Quanto tempo leva para liberar minha igreja?</AccordionTrigger>
                            <AccordionContent className="text-slate-600 leading-relaxed pb-6 text-sm">
                                Após o preenchimento da solicitação, nossa equipe faz uma validação manual (para garantir que é uma liderança real). Este processo costuma levar entre 24h e 72h úteis.
                            </AccordionContent>
                        </AccordionItem>
                        <AccordionItem value="item-3" className="border-slate-100">
                            <AccordionTrigger className="text-left font-bold text-slate-800 py-6">Meus dados estão seguros e seguem a LGPD?</AccordionTrigger>
                            <AccordionContent className="text-slate-600 leading-relaxed pb-6 text-sm">
                                Sim. Segurança é prioridade. Utilizamos infraestrutura criptografada de nível bancário. Os dados da sua igreja pertencem exclusivamente à sua igreja. Não vendemos dados nem os expomos a terceiros interessados.
                            </AccordionContent>
                        </AccordionItem>
                        <AccordionItem value="item-4" className="border-slate-100">
                            <AccordionTrigger className="text-left font-bold text-slate-800 py-6">Preciso ter muitos membros para usar?</AccordionTrigger>
                            <AccordionContent className="text-slate-600 leading-relaxed pb-6 text-sm">
                                Absolutamente não. Atendemos desde igrejas em implantação (células/pontos de pregação) até grandes ministérios. A tecnologia deve servir a todos.
                            </AccordionContent>
                        </AccordionItem>
                    </Accordion>
                </section>

                {/* 8. FINAL CTA (WhatsApp) */}
                <section className="text-center py-10">
                    <div className="bg-indigo-50 border border-indigo-100 rounded-[3rem] p-12 md:p-20 space-y-8 relative overflow-hidden">
                        {/* Background Decor */}
                        <div className="absolute top-0 left-0 w-64 h-64 bg-indigo-200/20 rounded-full blur-3xl -ml-20 -mt-20 pointer-events-none" />
                        <div className="absolute bottom-0 right-0 w-64 h-64 bg-indigo-200/20 rounded-full blur-3xl -mr-20 -mb-20 pointer-events-none" />

                        <div className="relative z-10 space-y-6 max-w-2xl mx-auto">
                            <h3 className="text-3xl md:text-4xl font-black text-slate-900 tracking-tight leading-tight">
                                Ficou com alguma dúvida antes de começar?
                            </h3>
                            <p className="text-slate-600 text-lg">
                                Nosso time ministerial está pronto para conversar e entender a realidade da sua igreja.
                            </p>
                            <div className="pt-4">
                                <Button
                                    size="lg"
                                    className="bg-slate-900 hover:bg-slate-800 text-white font-bold h-16 px-12 rounded-full shadow-2xl transition-all hover:scale-105 active:scale-95 gap-3"
                                    onClick={() => window.open(EXTERNAL_LINKS.SUPPORT_WHATSAPP, '_blank')}
                                >
                                    <MessageSquare className="w-6 h-6 text-green-500" />
                                    Chamar no WhatsApp agora
                                </Button>
                            </div>
                        </div>
                    </div>
                </section>

                {/* FINAL DISCLAIMER */}
                <div className="flex flex-col items-center gap-4 text-center max-w-xl mx-auto">
                    <ShieldCheck className="w-10 h-10 text-green-600/50" />
                    <p className="text-[11px] text-slate-400 leading-relaxed uppercase tracking-[0.2em] font-bold">
                        Tecnologia a serviço do Reino • LGPD Compliant • MD Connect 2024
                    </p>
                </div>

            </div>
        </InternalPageLayout>
    );
}

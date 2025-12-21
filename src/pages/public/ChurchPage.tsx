import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { InternalPageLayout } from '@/components/layout/InternalPageLayout';
import {
    Church, CheckCircle2,
    ShieldCheck, Lock, MessageSquare,
    ArrowRight, Sparkles
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { APP_ROUTES, EXTERNAL_LINKS } from '@/lib/routes';
import { Badge } from '@/components/ui/badge';
import { DoeSupportCard } from '@/components/monetization/DoeSupportCard';
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog"
import {
    Accordion,
    AccordionContent,
    AccordionItem,
    AccordionTrigger,
} from "@/components/ui/accordion"
import { ScrollArea } from "@/components/ui/scroll-area"
import { CHURCH_RESOURCES } from '@/data/churchResourcesCatalog';


export default function ChurchPage() {
    const navigate = useNavigate();
    const [isCatalogOpen, setCatalogOpen] = useState(false);

    return (
        <InternalPageLayout
            title="Para Igrejas"
            subtitle="Tecnologia gratuita para fortalecer a igreja local."
            tagline="Tecnologia a serviço do Reino."
            icon={Church}
            iconClassName="text-indigo-600"
            showSponsor={false}
            showDoe={false}
            showFooter={true}
            className="bg-transparent"
        >
            <div className="w-full animate-fade-in relative z-10 pb-4">
                <div className="px-4 md:px-8 max-w-2xl mx-auto relative z-20 pt-6 space-y-12">

                    {/* 1. HERO SECTION - PREMIUM GLASS STYLE */}
                    <div className="text-center space-y-8 py-4 relative overflow-hidden">
                        {/* Decorative Glow */}
                        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-64 h-32 bg-indigo-500/10 blur-[100px] rounded-full -z-10" />

                        <div className="flex flex-wrap justify-center gap-2">
                            <Badge variant="secondary" className="bg-white/40 backdrop-blur-md text-green-700 border-white/40 uppercase tracking-widest text-[9px] font-bold px-3">
                                Gratuidade Vitalícia
                            </Badge>
                            <Badge variant="outline" className="bg-white/20 backdrop-blur-md border-white/30 text-indigo-700 uppercase tracking-widest text-[9px] font-bold gap-1 px-3">
                                <Sparkles className="w-3 h-3 text-amber-500" /> Premium
                            </Badge>
                        </div>

                        <div className="space-y-4">
                            <h2 className="text-4xl md:text-5xl font-extrabold text-slate-900 tracking-tight leading-tight drop-shadow-sm">
                                Tecnologia a serviço <br />
                                <span className="bg-gradient-to-r from-indigo-600 to-blue-500 bg-clip-text text-transparent">do Reino de Deus</span>
                            </h2>

                            <p className="text-lg text-slate-600 leading-relaxed max-w-md mx-auto font-medium">
                                Organize o rebanho, edifique os membros e modernize sua comunicação com o MD Connect.
                            </p>
                        </div>

                        <div className="flex flex-col sm:flex-row gap-4 w-full sm:max-w-md mx-auto">
                            <Button
                                className="flex-1 bg-indigo-600 hover:bg-indigo-700 text-white shadow-xl shadow-indigo-200 h-14 text-base font-bold rounded-2xl transition-all active:scale-95 group"
                                onClick={() => navigate(APP_ROUTES.CHURCH_IMPLEMENTATION)}
                            >
                                Implantar agora
                                <ArrowRight className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" />
                            </Button>
                        </div>
                    </div>

                    {/* 2. NA PRÁTICA (6 PILLARS) */}
                    <div>
                        <div className="flex items-center gap-2 mb-4 justify-center">
                            <CheckCircle2 className="w-5 h-5 text-green-600" />
                            <h3 className="text-sm font-bold text-slate-700 uppercase tracking-wider">
                                Funcionalidades
                            </h3>
                        </div>

                        <div className="grid grid-cols-2 gap-3 sm:gap-4">
                            {CHURCH_RESOURCES.map((item, i) => (
                                <div key={i} className="bg-white p-4 rounded-xl border border-slate-100 shadow-sm flex flex-col items-center text-center gap-2 h-full">
                                    <div className="p-2 bg-slate-50 rounded-lg text-slate-600">
                                        <item.icon className="w-5 h-5" />
                                    </div>
                                    <h4 className="text-xs font-bold text-slate-800">{item.label}</h4>
                                    <p className="text-[10px] text-slate-500 leading-tight">{item.desc}</p>
                                </div>
                            ))}
                        </div>

                        <div className="mt-4 text-center">
                            <Button
                                variant="ghost"
                                size="sm"
                                className="text-indigo-600 text-xs font-bold hover:bg-indigo-50"
                                onClick={() => setCatalogOpen(true)}
                            >
                                Ver catálogo completo
                            </Button>
                        </div>
                    </div>

                    {/* 3. DIFERENCIAIS */}
                    <div className="bg-slate-50 rounded-2xl p-5 border border-slate-100">
                        <h3 className="text-sm font-bold text-slate-800 mb-4 text-center">Por que usar?</h3>
                        <ul className="space-y-3">
                            {[
                                "Foco 100% no Reino e na edificação.",
                                "Sem anúncios seculares ou distrações.",
                                "Permissões de acesso por perfil (Pastor, Líder, Membro).",
                                "Relatórios financeiros e de membros."
                            ].map((item, i) => (
                                <li key={i} className="flex items-start gap-2 text-xs text-slate-600">
                                    <CheckCircle2 className="w-4 h-4 text-indigo-600 shrink-0 mt-0.5" />
                                    <span>{item}</span>
                                </li>
                            ))}
                        </ul>
                    </div>

                    {/* 4. COMO IMPLANTAR */}
                    <div className="space-y-6 pt-4 border-t border-slate-100">
                        <h3 className="text-lg font-bold text-slate-800 text-center">Como implantar?</h3>

                        <div className="space-y-3">
                            {[
                                { step: 1, title: "Cadastro da Liderança", text: "O pastor/líder cria seu perfil." },
                                { step: 2, title: "Registro da Igreja", text: "Cadastre sede ou congregação." },
                                { step: 3, title: "Convite aos Membros", text: "Envie o link para entrar." }
                            ].map((s) => (
                                <div key={s.step} className="flex gap-4 p-4 bg-white rounded-xl border border-slate-100 shadow-sm">
                                    <div className="flex-shrink-0 w-8 h-8 rounded-full bg-indigo-50 text-indigo-600 flex items-center justify-center font-bold text-sm">
                                        {s.step}
                                    </div>
                                    <div>
                                        <h4 className="text-sm font-bold text-slate-800">{s.title}</h4>
                                        <p className="text-xs text-slate-500 mt-1">{s.text}</p>
                                    </div>
                                </div>
                            ))}
                        </div>

                        <div className="bg-indigo-50/50 p-4 rounded-xl border border-indigo-100 text-center mt-6">
                            <p className="text-xs text-slate-600 mb-3 font-medium">
                                Implantação assistida. Resposta em até 24h. <br />Sem custo de licença.
                            </p>
                            <Button
                                className="w-full bg-white border border-slate-200 text-slate-700 hover:bg-slate-50 h-10 text-sm font-bold shadow-sm"
                                onClick={() => window.open(EXTERNAL_LINKS.SUPPORT_WHATSAPP, '_blank')}
                            >
                                <MessageSquare className="w-4 h-4 mr-2 text-green-600" />
                                Falar com a equipe
                            </Button>
                        </div>
                    </div>

                    {/* 5. SEGURANÇA & LGPD */}
                    <div className="flex items-center gap-3 p-4 bg-white rounded-xl border border-slate-100 shadow-sm">
                        <ShieldCheck className="w-8 h-8 text-slate-400" />
                        <div>
                            <h4 className="text-xs font-bold text-slate-800 flex items-center gap-1">
                                Segurança e LGPD <Lock className="w-3 h-3 text-slate-400" />
                            </h4>
                            <p className="text-[10px] text-slate-500 leading-tight mt-1">
                                Seus dados protegidos ecriptografados. Acesso restrito por hierarquia.
                            </p>
                        </div>
                    </div>

                    {/* 7. REDESIGNED SUPPORT SECTION (DOE) - COMPACT & PERSUASIVE */}
                    <DoeSupportCard className="pt-4" />

                </div>
            </div>

            {/* CATALOG MODAL (DIALOG) */}
            <Dialog open={isCatalogOpen} onOpenChange={setCatalogOpen}>
                <DialogContent className="sm:max-w-md p-0 overflow-hidden border-0 shadow-2xl bg-white rounded-2xl max-h-[90vh] flex flex-col">
                    {/* Header */}
                    <div className="p-6 pb-2 shrink-0 bg-white z-10">
                        <DialogHeader>
                            <div className="flex items-center justify-between mb-2">
                                <DialogTitle className="text-xl font-bold text-slate-900 tracking-tight">
                                    Catálogo de Recursos
                                </DialogTitle>
                                <Badge variant="secondary" className="bg-indigo-50 text-indigo-700 hover:bg-indigo-100 border-indigo-100 uppercase text-[10px] tracking-wider font-bold">
                                    Implantação Assistida
                                </Badge>
                            </div>
                            <DialogDescription className="text-slate-500 text-sm leading-relaxed">
                                Uma visão geral dos módulos do MD Connect para fortalecer sua igreja.
                            </DialogDescription>
                        </DialogHeader>
                    </div>

                    {/* Scrollable Content */}
                    <ScrollArea className="flex-1 px-6">
                        <div className="pb-6">
                            <Accordion type="multiple" defaultValue={["item-0", "item-1"]} className="w-full space-y-2">
                                {CHURCH_RESOURCES.map((feature, index) => (
                                    <AccordionItem key={index} value={`item-${index}`} className="border-b-slate-100 last:border-0 px-1">
                                        <AccordionTrigger className="hover:no-underline py-4 group">
                                            <div className="flex items-center gap-3 text-left">
                                                <div className="p-2 bg-slate-50 group-data-[state=open]:bg-indigo-50 rounded-lg text-slate-500 group-data-[state=open]:text-indigo-600 transition-colors">
                                                    <feature.icon className="w-4 h-4" />
                                                </div>
                                                <span className="font-bold text-sm text-slate-700 group-data-[state=open]:text-slate-900">
                                                    {feature.label}
                                                </span>
                                            </div>
                                        </AccordionTrigger>
                                        <AccordionContent className="pb-4">
                                            <ul className="space-y-3 pl-11">
                                                {feature.items.map((item, idx) => {
                                                    const isObj = typeof item === 'object';
                                                    const text = isObj ? (item as any).label : item;
                                                    const badge = isObj ? (item as any).badge : null;

                                                    return (
                                                        <li key={idx} className="flex items-start gap-2.5 text-sm text-slate-600 leading-snug">
                                                            <CheckCircle2 className="w-4 h-4 text-green-500 shrink-0 mt-0.5" />
                                                            <span className="flex-1 flex flex-wrap gap-2 items-center">
                                                                {text}
                                                                {badge && (
                                                                    <Badge variant="secondary" className="text-[9px] h-4 px-1.5 bg-slate-100 text-slate-600 border-slate-200">
                                                                        {badge}
                                                                    </Badge>
                                                                )}
                                                            </span>
                                                        </li>
                                                    );
                                                })}
                                            </ul>
                                        </AccordionContent>
                                    </AccordionItem>
                                ))}
                            </Accordion>
                        </div>
                    </ScrollArea>

                    {/* Sticky Footer */}
                    <div className="p-4 bg-white/80 backdrop-blur-md border-t border-slate-100 shrink-0">
                        <Button
                            className="w-full bg-slate-900 hover:bg-slate-800 text-white font-bold h-12 shadow-lg shadow-slate-200 transition-all active:scale-[0.98]"
                            onClick={() => {
                                setCatalogOpen(false);
                                navigate(APP_ROUTES.CHURCH_IMPLEMENTATION);
                            }}
                        >
                            Quero implantar agora
                        </Button>
                    </div>
                </DialogContent>
            </Dialog>
        </InternalPageLayout>
    );
}

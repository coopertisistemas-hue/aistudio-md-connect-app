import { useNavigate } from 'react-router-dom';

import { Target, Globe, Heart, CheckCircle2, ChevronDown, Handshake, Gift, Book } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { APP_ROUTES } from '@/lib/routes';
import { InternalPageLayout } from '@/components/layout/InternalPageLayout';


export default function MissionPage() {
    const navigate = useNavigate();

    return (
        <InternalPageLayout
            title="Missão e Valores"
            subtitle="Tecnologia a serviço do Reino — para anunciar a Palavra, edificar vidas e fortalecer a Igreja local."
            icon={Target}
            iconClassName="text-indigo-600"
        >
            <div className="w-full animate-fade-in relative z-10 pb-4">
                {/* Content Container (Standard Max Width) */}
                <div className="px-4 md:px-8 max-w-2xl mx-auto relative z-20 pt-6">

                    {/* Chips (Moved inside content) */}
                    <div className="flex flex-wrap justify-center gap-2 mb-8">
                        <span className="inline-flex items-center px-2.5 py-1 rounded-full text-[10px] font-bold bg-green-50 text-green-700 border border-green-100 uppercase tracking-wide">
                            GRATUITO
                        </span>
                        <span className="inline-flex items-center px-2.5 py-1 rounded-full text-[10px] font-bold bg-indigo-50 text-indigo-700 border border-indigo-100 uppercase tracking-wide">
                            TECNOLOGIA DO REINO
                        </span>
                        <span className="inline-flex items-center px-2.5 py-1 rounded-full text-[10px] font-bold bg-blue-50 text-blue-700 border border-blue-100 uppercase tracking-wide">
                            TRANSPARÊNCIA
                        </span>
                        <span className="inline-flex items-center px-2.5 py-1 rounded-full text-[10px] font-bold bg-amber-50 text-amber-700 border border-amber-100 uppercase tracking-wide">
                            10% AÇÃO SOCIAL
                        </span>
                        <span className="inline-flex items-center px-2.5 py-1 rounded-full text-[10px] font-bold bg-pink-50 text-pink-700 border border-pink-100 uppercase tracking-wide">
                            10% MISSÕES
                        </span>
                    </div>

                    <div className="space-y-8">
                        {/* B) BLOCO “NÚCLEO OFICIAL” */}
                        <div className="grid grid-cols-1 gap-4">
                            {/* Mission */}
                            <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-100 flex flex-col h-full hover:shadow-md transition-shadow">
                                <div className="flex items-center gap-3 mb-3">
                                    <div className="w-8 h-8 rounded-lg bg-blue-50 flex items-center justify-center text-blue-600">
                                        <Target className="w-4 h-4" />
                                    </div>
                                    <h2 className="text-sm font-bold text-slate-800 uppercase tracking-wide">Missão</h2>
                                </div>
                                <p className="text-slate-600 text-sm leading-relaxed flex-1 italic mb-4">
                                    “Servir à Igreja de Cristo com tecnologia, para anunciar a Palavra, edificar vidas, fortalecer igrejas (especialmente as menores) e apoiar missões e ação social — com santidade e compromisso com o Reino.”
                                </p>

                                {/* Verses Section */}
                                <div className="pt-4 border-t border-slate-50">
                                    <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-2 block">
                                        Base Bíblica
                                    </span>
                                    <div className="flex flex-wrap gap-2">
                                        <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-50 border border-slate-100 text-xs font-semibold text-slate-600">
                                            <Book className="w-3.5 h-3.5 text-slate-400" /> Mc 16:15
                                        </span>
                                        <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-50 border border-slate-100 text-xs font-semibold text-slate-600">
                                            <Book className="w-3.5 h-3.5 text-slate-400" /> Tg 1:22
                                        </span>
                                    </div>
                                </div>
                            </div>

                            {/* Vision */}
                            <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-100 flex flex-col h-full hover:shadow-md transition-shadow">
                                <div className="flex items-center gap-3 mb-3">
                                    <div className="w-8 h-8 rounded-lg bg-amber-50 flex items-center justify-center text-amber-600">
                                        <Globe className="w-4 h-4" />
                                    </div>
                                    <h2 className="text-sm font-bold text-slate-800 uppercase tracking-wide">Visão</h2>
                                </div>
                                <p className="text-slate-600 text-sm leading-relaxed flex-1 italic mb-4">
                                    “Ser uma plataforma de apoio digital que fortaleça igrejas locais e ajude a expandir o Evangelho — com excelência, ordem e propósito.”
                                </p>

                                {/* Verses Section */}
                                <div className="pt-4 border-t border-slate-50">
                                    <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-2 block">
                                        Base Bíblica
                                    </span>
                                    <div className="flex flex-wrap gap-2">
                                        <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-50 border border-slate-100 text-xs font-semibold text-slate-600">
                                            <Book className="w-3.5 h-3.5 text-slate-400" /> At 1:8
                                        </span>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* C) BLOCO “VALORES” */}
                        <div className="bg-white rounded-2xl p-6 md:p-8 shadow-sm border border-slate-100">
                            <div className="flex items-center gap-3 mb-6 border-b border-slate-50 pb-4">
                                <div className="w-10 h-10 rounded-lg bg-indigo-50 flex items-center justify-center text-indigo-600">
                                    <Heart className="w-5 h-5" />
                                </div>
                                <div>
                                    <h2 className="text-lg font-bold text-slate-800">Nossos Valores</h2>
                                    <p className="text-xs text-slate-400">Princípios inegociáveis do projeto</p>
                                </div>
                            </div>

                            <ul className="space-y-4">
                                {[
                                    { title: "Cristo no centro", desc: "Tudo aponta para Jesus, não para a plataforma.", ref: "Cl 1:18" },
                                    { title: "Autoridade das Escrituras", desc: "A Palavra é fundamento, não opinião.", ref: "2Tm 3:16" },
                                    { title: "Igreja local fortalecida", desc: "Apoio prático, cuidado pastoral e ordem.", ref: "1Co 14:40" },
                                    { title: "Comunhão e integração", desc: "Membros ligados à igreja, não isolados.", ref: "Hb 10:25" },
                                    { title: "Vida diária com Deus", desc: "Prática da Palavra e disciplina espiritual.", ref: "Tg 1:22" },
                                    { title: "Santidade e renúncia ao mundo", desc: "Edificação acima de distração.", ref: "Rm 12:2" },
                                    { title: "Transparência e mordomia", desc: "Destino claro e prestação de contas.", ref: "2Co 8:21" }
                                ].map((item, idx) => (
                                    <li key={idx} className="flex gap-3 items-start">
                                        <span className="flex-shrink-0 w-6 h-6 rounded-full bg-slate-100 flex items-center justify-center text-slate-400 text-xs font-bold mt-0.5">
                                            {idx + 1}
                                        </span>
                                        <div>
                                            <h3 className="text-sm font-bold text-slate-800">
                                                {item.title}
                                                <span className="text-slate-400 font-normal text-[10px] ml-2 tracking-wide uppercase">
                                                    {item.ref}
                                                </span>
                                            </h3>
                                            <p className="text-xs text-slate-500 mt-0.5 leading-relaxed">
                                                “{item.desc}”
                                            </p>
                                        </div>
                                    </li>
                                ))}
                            </ul>
                        </div>

                        {/* D) BLOCO “COMO ISSO SE TRADUZ NO APP” */}
                        <div className="bg-slate-50 rounded-2xl p-6 border border-slate-100">
                            <h3 className="text-sm font-bold text-slate-700 mb-4 uppercase tracking-wider flex items-center gap-2">
                                <CheckCircle2 className="w-4 h-4 text-green-600" />
                                Na Prática
                            </h3>
                            <div className="grid sm:grid-cols-2 gap-x-4 gap-y-3">
                                {[
                                    "Comunicação com membros: avisos, mural e notificações.",
                                    "Agenda e organização: eventos e visitas (cuidado pastoral).",
                                    "Recursos de edificação: Bíblia, devocional, estudo e leitura.",
                                    "Apoio a igrejas menores: acesso gratuito e estrutura pronta.",
                                    "Crescimento espiritual: disciplina, comunhão e caminhada cristã."
                                ].map((text, i) => (
                                    <div key={i} className="flex gap-2 items-start text-xs text-slate-600">
                                        <span className="w-1.5 h-1.5 rounded-full bg-slate-300 mt-1.5 flex-shrink-0" />
                                        <span>{text}</span>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* E) BLOCO “DOE + SUSTENTAÇÃO DO GRATUITO” */}
                        <div className="bg-gradient-to-br from-indigo-50 to-white rounded-2xl p-6 border border-indigo-100 text-center shadow-sm">
                            <div className="w-12 h-12 bg-indigo-100 text-indigo-600 rounded-full flex items-center justify-center mx-auto mb-4">
                                <Gift className="w-6 h-6" />
                            </div>

                            {/* Main DOE Message */}
                            <h2 className="text-lg font-bold text-indigo-900 mb-2">O DOE mantém o app gratuito</h2>
                            <p className="text-sm text-slate-600 leading-relaxed max-w-md mx-auto mb-6">
                                O MD Connect é gratuito. A sua doação voluntária sustenta toda a infraestrutura (servidores, banco de dados e app) no ar.
                            </p>

                            {/* Services Commitment Block */}
                            <div className="mb-8 p-4 bg-indigo-50/50 rounded-xl border border-indigo-100">
                                <h3 className="text-xs font-bold text-indigo-800 uppercase tracking-widest mb-1">
                                    Compromisso dos Serviços
                                </h3>
                                <p className="text-xs text-indigo-700 mb-2">
                                    Sobre o valor faturado dos serviços digitais (parcerias):
                                </p>
                                <div className="flex flex-col items-center gap-1">
                                    <span className="inline-flex items-center px-3 py-1 rounded-full bg-indigo-100 text-indigo-700 text-xs font-bold border border-indigo-200">
                                        10% Missões + 10% Ação Social
                                    </span>
                                    <span className="text-[10px] text-indigo-400 font-medium mt-1 uppercase tracking-wider">
                                        2Co 8:21
                                    </span>
                                </div>
                            </div>

                            {/* CTAs - Mobile Stacked */}
                            <div className="flex flex-col gap-3 w-full">
                                <Button
                                    className="w-full bg-indigo-600 hover:bg-indigo-700 text-white shadow-md shadow-indigo-200 h-11 text-sm font-semibold"
                                    onClick={() => navigate(APP_ROUTES.DONATE)}
                                >
                                    <Gift className="w-4 h-4 mr-2" />
                                    Entender o DOE
                                </Button>
                                <Button
                                    className="w-full bg-slate-800 hover:bg-slate-900 text-white shadow-md shadow-slate-200 border border-slate-700 h-11 text-sm font-semibold"
                                    onClick={() => navigate(APP_ROUTES.PARTNER_JOIN)}
                                >
                                    <Handshake className="w-4 h-4 mr-2" />
                                    Ser parceiro do projeto
                                </Button>
                                <Button
                                    variant="ghost"
                                    className="w-full text-slate-500 hover:text-indigo-600 hover:bg-indigo-50 h-11 text-sm"
                                    onClick={() => navigate('/onboarding/select-church')}
                                >
                                    Sou Igreja — Implantar
                                    <ChevronDown className="w-3 h-3 ml-2 -rotate-90" />
                                </Button>
                            </div>
                        </div>

                        {/* F) “GUARD-RAILS” REFINED */}
                        <details className="group bg-white rounded-xl border border-slate-100 overflow-hidden">
                            <summary className="flex items-center justify-between p-5 cursor-pointer hover:bg-slate-50 transition-colors select-none">
                                <span className="text-sm font-semibold text-slate-700">
                                    Como mantemos consistência com a Missão
                                </span>
                                <ChevronDown className="w-5 h-5 text-slate-400 group-open:rotate-180 transition-transform" />
                            </summary>
                            <div className="px-5 pb-5 border-t border-slate-50 bg-slate-50/50">
                                <ul className="space-y-3 mt-4">
                                    {[
                                        "O conteúdo glorifica a Cristo ou promove a plataforma?",
                                        "Existe base bíblica clara para a edificação?",
                                        "Essa funcionalidade fortalece a igreja local?",
                                        "A vida prática (oração e comunhão) é incentivada?",
                                        "A transparência e mordomia estão evidentes?"
                                    ].map((item, i) => (
                                        <li key={i} className="flex gap-3 items-start text-[15px] leading-relaxed text-slate-600">
                                            <CheckCircle2 className="w-4 h-4 text-green-500 flex-shrink-0 mt-1" />
                                            {item}
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        </details>

                        {/* Footer Note */}
                        <div className="mt-12 text-center pb-8 pt-4 flex justify-center">
                            <div className="inline-flex flex-col items-center justify-center px-6 py-4 rounded-xl bg-neutral-950/70 border border-white/10 backdrop-blur-md shadow-2xl">
                                <p className="text-xs font-semibold text-white/90 mb-1.5 tracking-wide">
                                    Tecnologia a serviço do Reino.
                                </p>
                                <p className="text-[10px] text-white/60 uppercase tracking-widest font-medium">
                                    “A Ele seja glória na Igreja e em Cristo Jesus.” <span className="opacity-50 ml-1">(Ef 3:21)</span>
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </InternalPageLayout>
    );
}

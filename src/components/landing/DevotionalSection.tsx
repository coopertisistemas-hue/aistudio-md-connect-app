import React from 'react';
import { Button } from '@/components/ui/button';
import { BookOpen, CheckCircle } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Card, CardContent } from '@/components/ui/card';

export const DevotionalSection: React.FC = () => {
    return (
        <section className="py-24 bg-white relative overflow-hidden">
            <div className="container mx-auto px-4">
                <div className="grid lg:grid-cols-2 gap-16 items-center">

                    {/* Visual Content */}
                    <div className="relative order-2 lg:order-1">
                        <div className="relative z-10 rounded-3xl overflow-hidden shadow-2xl border-8 border-slate-50 rotate-3 transform hover:rotate-0 transition-transform duration-700">
                            <img
                                src="https://images.unsplash.com/photo-1507525428034-b723cf961d3e?q=80&w=2073&auto=format&fit=crop"
                                alt="Person reading bible on beach"
                                className="w-full h-auto object-cover hover:scale-105 transition-transform duration-700"
                            />
                            <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent p-8 text-white">
                                <p className="font-heading font-bold text-xl">"Lâmpada para os meus pés é a tua palavra..."</p>
                                <p className="text-sm opacity-80">Salmos 119:105</p>
                            </div>
                        </div>

                        {/* Floating elements */}
                        <div className="absolute -top-10 -left-10 w-40 h-40 bg-blue-100/50 rounded-full blur-3xl -z-0"></div>
                        <div className="absolute -bottom-10 -right-10 w-60 h-60 bg-amber-100/50 rounded-full blur-3xl -z-0"></div>

                        <Card className="absolute top-10 -left-6 z-20 w-48 shadow-xl animate-float hidden md:block border-none bg-white/90 backdrop-blur">
                            <CardContent className="p-4 flex items-center gap-3">
                                <div className="bg-green-100 p-2 rounded-full">
                                    <CheckCircle className="w-5 h-5 text-green-600" />
                                </div>
                                <div>
                                    <p className="text-xs text-slate-500 font-bold uppercase">Hábito Diário</p>
                                    <p className="font-bold text-slate-800">365 Dias</p>
                                </div>
                            </CardContent>
                        </Card>
                    </div>

                    {/* Text Content */}
                    <div className="order-1 lg:order-2">
                        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-50 text-blue-700 text-sm font-bold mb-6">
                            <BookOpen className="w-4 h-4" />
                            <span>MD - Momento Devocional</span>
                        </div>

                        <h2 className="text-4xl lg:text-5xl font-bold text-slate-900 mb-6 font-heading leading-tight">
                            Alimente seu espírito <br />
                            <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-indigo-600">todos os dias</span>
                        </h2>

                        <p className="text-lg text-slate-600 mb-8 leading-relaxed">
                            O MD Connect não é apenas um app, é um compromisso com o seu crescimento espiritual.
                            Receba devocionais diários, acompanhe planos de leitura bíblica e mantenha a constância na Palavra, onde quer que você esteja.
                        </p>

                        <div className="space-y-4 mb-8">
                            {[
                                { title: "Devocional Diário", desc: "Uma mensagem fresca de ânimo e sabedoria toda manhã." },
                                { title: "Bíblia Online", desc: "Acesse as escrituras sagradas em qualquer lugar." },
                                { title: "Planos de Leitura", desc: "Metas estruturadas para ler a Bíblia completa." },
                            ].map((item, idx) => (
                                <div key={idx} className="flex gap-4 items-start">
                                    <div className="mt-1 bg-blue-50 p-1.5 rounded-lg">
                                        <CheckCircle className="w-5 h-5 text-blue-600" />
                                    </div>
                                    <div>
                                        <h4 className="font-bold text-slate-800">{item.title}</h4>
                                        <p className="text-sm text-slate-500">{item.desc}</p>
                                    </div>
                                </div>
                            ))}
                        </div>

                        <Link to="/conteudos/devocionais">
                            <Button className="bg-slate-900 hover:bg-slate-800 text-white rounded-xl h-12 px-8 shadow-lg hover:shadow-xl transition-all">
                                Acessar Devocional Agora
                            </Button>
                        </Link>
                    </div>

                </div>
            </div>
        </section>
    );
};

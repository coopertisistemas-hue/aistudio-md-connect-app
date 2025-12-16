import React from 'react';
import { ArrowLeftRight, HandHeart } from 'lucide-react';
import { Button } from '@/components/ui/button';

export const ReturnMechanicsSection: React.FC = () => {
    return (
        <section className="py-20 bg-white">
            <div className="container mx-auto px-4">
                <div className="flex flex-col md:flex-row items-center gap-12">

                    <div className="flex-1">
                        <span className="text-amber-500 font-bold tracking-wider uppercase text-sm">Transparência</span>
                        <h2 className="text-3xl lg:text-4xl font-bold text-slate-900 mt-2 mb-6 font-heading">
                            Tecnologia que <span className="text-blue-600">retorna como cuidado</span>
                        </h2>
                        <p className="text-slate-600 text-lg mb-8 leading-relaxed">
                            O MD Connect não apenas fornece tecnologia, mas retroalimenta o Reino.
                            Parte dos recursos gerados pelas assinaturas volta para a igreja local para apoiar projetos,
                            missões e ação social.
                        </p>

                        <div className="space-y-6">
                            <div className="flex items-start gap-4">
                                <div className="bg-blue-50 p-3 rounded-full">
                                    <ArrowLeftRight className="w-6 h-6 text-blue-600" />
                                </div>
                                <div>
                                    <h4 className="font-bold text-slate-800 text-lg">Cashback para o Reino</h4>
                                    <p className="text-slate-500">Repasse periódico de valores para a liderança da igreja investir onde há maior necessidade.</p>
                                </div>
                            </div>

                            <div className="flex items-start gap-4">
                                <div className="bg-amber-50 p-3 rounded-full">
                                    <HandHeart className="w-6 h-6 text-amber-600" />
                                </div>
                                <div>
                                    <h4 className="font-bold text-slate-800 text-lg">Ação Social e Projetos</h4>
                                    <p className="text-slate-500">Apoio financeiro direto para manutenção, eventos e ajuda humanitária.</p>
                                </div>
                            </div>
                        </div>

                        <div className="mt-8">
                            <Button variant="outline" className="text-blue-600 border-blue-200 hover:bg-blue-50">
                                Entender como funciona o retorno
                            </Button>
                        </div>
                    </div>

                    <div className="flex-1 relative">
                        <div className="absolute inset-0 bg-gradient-to-tr from-blue-600/20 to-amber-400/20 rounded-3xl transform rotate-3 scale-95 blur-xl"></div>
                        <img
                            src="https://images.unsplash.com/photo-1593113598332-cd288d649433?q=80&w=2070&auto=format&fit=crop"
                            alt="Community Support"
                            className="relative rounded-3xl shadow-xl border-4 border-white aspect-video object-cover"
                        />
                    </div>

                </div>
            </div>
        </section>
    );
};

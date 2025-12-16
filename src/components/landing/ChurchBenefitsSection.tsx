import React from 'react';
import { Newspaper, Calendar, MessageCircle, Users } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';

export const ChurchBenefitsSection: React.FC = () => {
    const features = [
        {
            icon: Newspaper,
            title: "Mural Digital",
            description: "Avisos importantes e notícias oficiais da igreja na palma da mão de cada membro.",
            color: "bg-blue-100 text-blue-600",
            image: "https://images.unsplash.com/photo-1557804506-669a67965ba0?q=80&w=1974&auto=format&fit=crop"
        },
        {
            icon: Calendar,
            title: "Agenda Integrada",
            description: "Nunca mais perca um culto ou evento. Calendário completo e atualizado.",
            color: "bg-amber-100 text-amber-600",
            image: "https://images.unsplash.com/photo-1506784983877-45594efa4cbe?q=80&w=2068&auto=format&fit=crop"
        },
        {
            icon: MessageCircle,
            title: "Pedidos de Oração",
            description: "Um canal direto e privativo para solicitar oração, visitas ou aconselhamento.",
            color: "bg-purple-100 text-purple-600",
            image: "https://images.unsplash.com/photo-1544654283-2393fdf6df94?q=80&w=1770&auto=format&fit=crop"
        },
        {
            icon: Users,
            title: "Engajamento",
            description: "Ferramentas para integrar jovens, adultos e departamentos da igreja.",
            color: "bg-emerald-100 text-emerald-600",
            image: "https://images.unsplash.com/photo-1529070538774-1843cb3265df?q=80&w=2070&auto=format&fit=crop"
        }
    ];

    return (
        <section className="py-24 bg-slate-50 relative">
            <div className="container mx-auto px-4">

                <div className="text-center max-w-3xl mx-auto mb-16">
                    <span className="text-blue-600 font-bold tracking-wider uppercase text-sm">Para Igrejas</span>
                    <h2 className="text-4xl font-bold text-slate-900 mt-2 mb-4 font-heading">
                        Organização e Cuidado Pastoral
                    </h2>
                    <p className="text-slate-600 text-lg">
                        Ferramentas práticas que simplificam a gestão e aproximam a liderança dos membros, permitindo que a igreja foque no que mais importa: vidas.
                    </p>
                </div>

                <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
                    {features.map((feature, idx) => (
                        <Card key={idx} className="group hover:shadow-2xl transition-all duration-300 border-none overflow-hidden h-full">
                            <div className="h-48 overflow-hidden relative">
                                <div className="absolute inset-0 bg-slate-900/10 group-hover:bg-slate-900/0 transition-colors z-10"></div>
                                <img
                                    src={feature.image}
                                    alt={feature.title}
                                    className="w-full h-full object-cover transform group-hover:scale-110 transition-transform duration-700"
                                />
                                <div className={`absolute top-4 left-4 ${feature.color} p-3 rounded-xl z-20 shadow-lg`}>
                                    <feature.icon className="w-6 h-6" />
                                </div>
                            </div>
                            <CardContent className="p-6">
                                <h3 className="text-xl font-bold text-slate-900 mb-2 group-hover:text-blue-600 transition-colors">{feature.title}</h3>
                                <p className="text-slate-500 text-sm leading-relaxed">
                                    {feature.description}
                                </p>
                            </CardContent>
                        </Card>
                    ))}
                </div>

                <div className="mt-16 text-center">
                    <Button
                        size="lg"
                        className="bg-blue-600 hover:bg-blue-700 text-white rounded-full px-10 h-14 text-lg shadow-xl shadow-blue-600/20"
                        onClick={() => window.open('https://wa.me/5551986859236?text=Ola!%20Quero%20levar%20o%20MD%20Connect%20para%20minha%20igreja', '_blank')}
                    >
                        Quero levar para minha igreja
                    </Button>
                </div>

            </div>
        </section>
    );
};

import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { MapPin, Share2, Code, MessageSquare } from 'lucide-react';

export const ServicesSection: React.FC = () => {
    const services = [
        {
            icon: MapPin,
            title: "Google Meu Negócio",
            description: "Colocamos sua igreja no mapa. Seja encontrado por quem precisa.",
            bg: "bg-blue-600",
            image: "https://images.unsplash.com/photo-1548345680-f5475ea5df84?q=80&w=2073&auto=format&fit=crop"
        },
        {
            icon: Share2,
            title: "Gestão de Mídias",
            description: "Identidade visual e posts profissionais para suas redes sociais.",
            bg: "bg-rose-500",
            image: "https://images.unsplash.com/photo-1611162617474-5b21e879e113?q=80&w=1974&auto=format&fit=crop"
        },
        {
            icon: Code,
            title: "Sites e Landings",
            description: "Páginas modernas e otimizadas para apresentar sua igreja.",
            bg: "bg-slate-800",
            image: "https://images.unsplash.com/photo-1547658719-da2b51169166?q=80&w=1964&auto=format&fit=crop"
        },
        {
            icon: MessageSquare,
            title: "Consultoria",
            description: "Estratégias de comunicação e tecnologia para o crescimento.",
            bg: "bg-emerald-600",
            image: "https://images.unsplash.com/photo-1552664730-d307ca884978?q=80&w=2070&auto=format&fit=crop"
        }
    ];

    return (
        <section className="py-24 bg-slate-900 text-white">
            <div className="container mx-auto px-4">
                <div className="text-center mb-16">
                    <h2 className="text-3xl lg:text-4xl font-bold mb-4 font-heading">
                        Serviços Digitais para Igrejas
                    </h2>
                    <p className="text-slate-400 max-w-2xl mx-auto">
                        Além da plataforma, oferecemos uma gama completa de serviços para profissionalizar
                        a comunicação e a presença digital da sua comunidade.
                    </p>
                </div>

                <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
                    {services.map((service, idx) => (
                        <Card key={idx} className="bg-slate-800 border-slate-700 overflow-hidden group hover:border-slate-600 transition-colors">
                            <div className="h-32 overflow-hidden relative">
                                <img src={service.image} alt={service.title} className="w-full h-full object-cover opacity-60 group-hover:opacity-80 transition-opacity" />
                                <div className={`absolute bottom-0 left-0 p-2 ${service.bg} text-white rounded-tr-xl`}>
                                    <service.icon className="w-5 h-5" />
                                </div>
                            </div>
                            <CardContent className="p-6">
                                <h3 className="font-bold text-lg text-white mb-2">{service.title}</h3>
                                <p className="text-sm text-slate-400 mb-4">{service.description}</p>
                                <Button variant="link" className="p-0 text-blue-400 hover:text-blue-300 h-auto text-xs uppercase font-bold tracking-wider">
                                    Saiba mais &rarr;
                                </Button>
                            </CardContent>
                        </Card>
                    ))}
                </div>

                <div className="mt-16 text-center">
                    <Button
                        size="lg"
                        className="bg-green-600 hover:bg-green-700 text-white rounded-full px-8 shadow-lg shadow-green-900/20"
                        onClick={() => window.open('https://wa.me/5551986859236?text=Ola!%20Gostaria%20de%20saber%20mais%20sobre%20os%20serviços', '_blank')}
                    >
                        <MessageSquare className="mr-2 w-5 h-5" />
                        Falar no WhatsApp
                    </Button>
                </div>
            </div>
        </section>
    );
};

import React from 'react';
import { Button } from '@/components/ui/button';
import { ArrowRight, Play, Heart, Church } from 'lucide-react';
import { Link } from 'react-router-dom';

export const HeroSection: React.FC = () => {
    return (
        <section className="relative w-full h-screen min-h-[600px] flex items-center justify-center overflow-hidden text-white">
            {/* Background Video / Fallback */}
            <div className="absolute inset-0 z-0 bg-slate-900">
                <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-black/40 to-slate-900 z-10"></div>
                {/* Fallback Image if video fails or loads slow */}
                <img
                    src="https://images.unsplash.com/photo-1510590337019-5ef2d3977e9e?q=80&w=2070&auto=format&fit=crop"
                    alt="Background Worship"
                    className="w-full h-full object-cover opacity-60"
                />
                {/* Video Loop (Example URL) */}
                {/* <video autoPlay loop muted playsInline className="absolute inset-0 w-full h-full object-cover opacity-50">
                    <source src="/hero-video.mp4" type="video/mp4" />
                </video> */}
            </div>

            {/* Content */}
            <div className="relative z-20 container mx-auto px-4 text-center flex flex-col items-center">

                {/* Logo & Badge */}
                <div className="animate-fade-in-down mb-6">
                    <img src="/logo-md-transparent.jpg" alt="MD Connect" className="h-24 w-auto mx-auto rounded-full shadow-2xl border-2 border-white/20 mb-4" />
                    <span className="inline-block px-4 py-1.5 rounded-full bg-white/10 backdrop-blur-md border border-white/20 text-xs font-semibold tracking-wider uppercase text-blue-100">
                        Tecnologia a serviço do Reino
                    </span>
                </div>

                {/* Headline */}
                <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold font-heading mb-6 leading-tight drop-shadow-lg max-w-4xl">
                    Comunicação, <span className="text-blue-400">cuidado</span> e constância.
                </h1>

                {/* Subheadline */}
                <p className="text-lg md:text-xl text-slate-200 mb-10 max-w-2xl leading-relaxed opacity-90">
                    Uma plataforma completa para fortalecer a igreja, engajar membros e propagar a Palavra de Deus através do devocional diário.
                </p>

                {/* CTAs */}
                <div className="flex flex-col sm:flex-row gap-4 w-full max-w-md mx-auto justify-center">
                    <Link to="/c/demo-church" className="w-full sm:w-auto">
                        <Button size="lg" className="w-full bg-blue-600 hover:bg-blue-700 text-white border-none shadow-lg shadow-blue-900/20 text-md h-12 rounded-xl">
                            <Church className="mr-2 h-5 w-5" /> Acessar minha Igreja
                        </Button>
                    </Link>

                    <Link to="/conteudos/devocionais" className="w-full sm:w-auto">
                        <Button variant="outline" size="lg" className="w-full bg-white/10 hover:bg-white/20 text-white border-white/30 backdrop-blur-sm text-md h-12 rounded-xl">
                            <Play className="mr-2 h-5 w-5 fill-current" /> Conhecer o MD
                        </Button>
                    </Link>
                </div>

                {/* Secondary CTA (DOE) */}
                <div className="mt-8">
                    <Link to="/doe" className="inline-flex items-center text-sm font-medium text-blue-200 hover:text-white transition-colors gap-1 group">
                        <Heart className="h-4 w-4 text-rose-500 fill-rose-500 group-hover:scale-110 transition-transform" />
                        Quero contribuir com o Reino
                        <ArrowRight className="h-4 w-4 ml-1 group-hover:translate-x-1 transition-transform" />
                    </Link>
                </div>

            </div>

            {/* Scroll Indicator */}
            <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 animate-bounce opacity-50">
                <div className="w-6 h-10 border-2 border-white rounded-full flex justify-center pt-2">
                    <div className="w-1 h-3 bg-white rounded-full"></div>
                </div>
            </div>
        </section>
    );
};

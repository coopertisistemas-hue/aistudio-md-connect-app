import { useNavigate } from 'react-router-dom';
// import { TopBar } from '@/components/home/TopBar'; // Removed unused
import { Button } from '@/components/ui/button';
import { ChevronLeft, GraduationCap, ArrowRight, BookOpen } from 'lucide-react';
import { APP_ROUTES } from '@/lib/routes';

export default function StudiesPage() {
    const navigate = useNavigate();

    return (
        <div className="min-h-screen bg-slate-50/50 pb-20">
            {/* TopBar removed to use PublicHeader */}

            <main className="container max-w-lg mx-auto px-5 pt-8 flex flex-col items-center text-center animate-in fade-in duration-500">
                {/* Hero Icon */}
                <div className="w-20 h-20 rounded-3xl bg-gradient-to-br from-indigo-500 to-violet-600 flex items-center justify-center shadow-xl shadow-indigo-500/20 mb-8 transform hover:scale-105 transition-transform duration-300">
                    <GraduationCap className="w-10 h-10 text-white" />
                </div>

                <h1 className="text-2xl font-bold text-slate-900 mb-3 tracking-tight">Estudos Bíblicos</h1>
                <p className="text-slate-500 text-lg font-medium mb-10 max-w-xs leading-relaxed">
                    Em breve, uma área exclusiva para aprofundar seu conhecimento na Palavra.
                </p>

                {/* Premium Card */}
                <div className="w-full bg-white rounded-2xl p-6 shadow-sm border border-slate-100 mb-10 relative overflow-hidden group">
                    <div className="absolute top-0 right-0 w-20 h-20 bg-indigo-50 rounded-bl-full -mr-10 -mt-10 opacity-50 group-hover:scale-110 transition-transform" />

                    <div className="flex items-start gap-4 text-left relative z-10">
                        <div className="w-10 h-10 rounded-full bg-indigo-50 flex items-center justify-center shrink-0">
                            <BookOpen className="w-5 h-5 text-indigo-600" />
                        </div>
                        <div>
                            <h3 className="font-bold text-slate-900 text-sm mb-1">O que vem por aí?</h3>
                            <p className="text-xs text-slate-500 leading-relaxed">
                                Artigos teológicos, séries de estudo passo a passo e materiais de apoio para sua caminhada cristã.
                            </p>
                        </div>
                    </div>
                </div>

                {/* Actions */}
                <div className="w-full space-y-3">
                    <Button
                        onClick={() => navigate(APP_ROUTES.HOME)}
                        className="w-full h-12 bg-slate-900 hover:bg-slate-800 text-white rounded-xl font-bold tracking-wide shadow-lg shadow-slate-900/10"
                    >
                        <ChevronLeft className="w-4 h-4 mr-2" />
                        Voltar para o Início
                    </Button>

                    <Button
                        variant="ghost"
                        onClick={() => navigate(APP_ROUTES.MURAL)}
                        className="w-full h-12 text-indigo-600 hover:text-indigo-700 hover:bg-indigo-50 rounded-xl font-bold tracking-wide"
                    >
                        Ver Mural de Novidades
                        <ArrowRight className="w-4 h-4 ml-2 opacity-50" />
                    </Button>
                </div>
            </main>
        </div>
    );
}

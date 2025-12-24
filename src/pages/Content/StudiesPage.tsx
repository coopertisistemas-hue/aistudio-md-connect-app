import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { GraduationCap, ArrowRight, BookOpen } from 'lucide-react';
import { APP_ROUTES } from '@/lib/routes';
import { InternalPageLayout } from '@/components/layout/InternalPageLayout';

export default function StudiesPage() {
    const navigate = useNavigate();

    return (
        <InternalPageLayout
            title="Estudos"
            subtitle="Conteúdo para edificação e aprendizado."
            icon={GraduationCap}
            iconClassName="text-indigo-600"
            backPath="/home"
        >
            <div className="container max-w-lg mx-auto px-5 pt-4 pb-8">
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
                        variant="ghost"
                        onClick={() => navigate(APP_ROUTES.MURAL)}
                        className="w-full h-12 text-indigo-600 hover:text-indigo-700 hover:bg-indigo-50 rounded-xl font-bold tracking-wide"
                    >
                        Ver Mural de Novidades
                        <ArrowRight className="w-4 h-4 ml-2 opacity-50" />
                    </Button>
                </div>
            </div>
        </InternalPageLayout >
    );
}

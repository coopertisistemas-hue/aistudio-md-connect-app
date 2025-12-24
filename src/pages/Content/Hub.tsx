import { useNavigate } from 'react-router-dom';
import { BookOpen, Heart, List, Video, ChevronRight } from 'lucide-react';
import { InternalPageLayout } from '@/components/layout/InternalPageLayout';

export default function Hub() {
    const navigate = useNavigate();

    const sections = [
        {
            title: 'Devocionais',
            description: 'Reflexões diárias para sua vida espiritual',
            icon: Heart,
            iconColor: 'text-rose-500',
            bgColor: 'bg-rose-50',
            path: '/conteudos/devocionais'
        },
        {
            title: 'Bíblia',
            description: 'Leia e estude a Palavra de Deus',
            icon: BookOpen,
            iconColor: 'text-blue-500',
            bgColor: 'bg-blue-50',
            path: '/biblia'
        },
        {
            title: 'Séries',
            description: 'Mensagens organizadas por temas',
            icon: Video,
            iconColor: 'text-purple-500',
            bgColor: 'bg-purple-50',
            path: '/conteudos/series'
        },
        {
            title: 'Planos de Leitura',
            description: 'Guias estruturados para seu crescimento',
            icon: List,
            iconColor: 'text-green-500',
            bgColor: 'bg-green-50',
            path: '/conteudos/planos'
        }
    ];

    return (
        <InternalPageLayout
            title="Conteúdos"
            subtitle="Devocionais, mensagens e planos para edificação."
            icon={BookOpen}
            iconClassName="text-indigo-500"
            backPath="/home"
        >
            <div className="px-5 pb-8">
                <div className="grid gap-4">
                    {sections.map((section) => {
                        const Icon = section.icon;
                        return (
                            <div
                                key={section.path}
                                onClick={() => navigate(section.path)}
                                className="bg-white p-5 rounded-xl border border-slate-100 shadow-sm cursor-pointer hover:shadow-md transition-all active:scale-[0.99] flex items-center gap-4"
                            >
                                <div className={`${section.bgColor} p-3 rounded-xl`}>
                                    <Icon className={`w-6 h-6 ${section.iconColor}`} />
                                </div>
                                <div className="flex-1">
                                    <h3 className="font-bold text-slate-900 mb-0.5">{section.title}</h3>
                                    <p className="text-sm text-slate-500">{section.description}</p>
                                </div>
                                <ChevronRight className="w-5 h-5 text-slate-400" />
                            </div>
                        );
                    })}
                </div>

                {/* Featured Content Card */}
                <div
                    className="mt-6 aspect-video rounded-xl bg-gradient-to-br from-indigo-500 to-purple-600 relative overflow-hidden flex items-end p-4 cursor-pointer shadow-lg"
                    onClick={() => navigate('/conteudos/devocionais')}
                >
                    <div className="absolute inset-0 bg-black/20"></div>
                    <div className="relative z-10 text-white">
                        <p className="text-xs font-bold uppercase tracking-wider mb-1 opacity-90">Em Destaque</p>
                        <h3 className="text-xl font-bold mb-1">Devocional de Hoje</h3>
                        <p className="text-sm opacity-90">Comece seu dia com uma palavra de edificação</p>
                    </div>
                </div>
            </div>
        </InternalPageLayout>
    );
}

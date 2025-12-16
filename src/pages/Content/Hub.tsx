import { useNavigate } from 'react-router-dom';
import { Book, Heart, List, Video, ChevronRight } from 'lucide-react';

export default function ContentHub() {
    const navigate = useNavigate();

    const categories = [
        {
            id: 'devotionals',
            title: 'Devocionais',
            description: 'Mensagens diárias para sua edificação',
            icon: Heart,
            color: 'bg-rose-100 text-rose-600',
            path: '/conteudos/devocionais'
        },
        {
            id: 'bible',
            title: 'Bíblia Online',
            description: 'Leia as Sagradas Escrituras',
            icon: Book,
            color: 'bg-amber-100 text-amber-600',
            path: '/biblia' // Using the existing route
        },
        {
            id: 'series',
            title: 'Séries e Mensagens',
            description: 'Assista às pregações da igreja',
            icon: Video,
            color: 'bg-blue-100 text-blue-600',
            path: '/conteudos/series'
        },
        {
            id: 'plans',
            title: 'Planos de Leitura',
            description: 'Acompanhe seu progresso bíblico',
            icon: List,
            color: 'bg-emerald-100 text-emerald-600',
            path: '/conteudos/planos'
        }
    ];

    return (
        <div className="p-4 space-y-6">
            <div className="space-y-1">
                <h1 className="text-2xl font-bold font-heading text-slate-900">Conteúdos</h1>
                <p className="text-muted-foreground text-sm">Explore nossa biblioteca de edificação.</p>
            </div>

            <div className="grid gap-3">
                {categories.map((cat) => (
                    <button
                        key={cat.id}
                        onClick={() => navigate(cat.path)}
                        className="flex items-center p-4 bg-white border border-slate-200 rounded-xl shadow-sm active:scale-98 transition-transform text-left"
                    >
                        <div className={`p-3 rounded-full ${cat.color} mr-4`}>
                            <cat.icon className="h-6 w-6" />
                        </div>
                        <div className="flex-1">
                            <h3 className="font-semibold text-slate-900">{cat.title}</h3>
                            <p className="text-xs text-slate-500 mt-0.5">{cat.description}</p>
                        </div>
                        <ChevronRight className="h-5 w-5 text-slate-300" />
                    </button>
                ))}
            </div>

            {/* Featured Section (Placeholder for now, maybe Latest Devotional later) */}
            <div className="pt-4 border-t border-slate-100">
                <h2 className="text-sm font-semibold text-slate-900 mb-3">Destaque do Dia</h2>
                <div
                    onClick={() => navigate('/conteudos/devocionais')}
                    className="aspect-video rounded-xl bg-slate-100 relative overflow-hidden flex items-end p-4 cursor-pointer"
                >
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                    <div className="relative z-10 text-white">
                        <span className="text-xs font-medium bg-primary px-2 py-0.5 rounded-full mb-2 inline-block">Hoje</span>
                        <h3 className="font-bold">Palavra de Esperança</h3>
                    </div>
                </div>
            </div>
        </div>
    );
}

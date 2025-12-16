import { PlayCircle, BookOpen, Music, Users, GraduationCap, HeartHandshake } from 'lucide-react';
import { PortalSection } from '@/components/ui/PortalComponents';

export function ContentsHub() {
    const categories = [
        { id: 'bible', label: 'Bíblia Online', icon: BookOpen, color: 'text-blue-600', bg: 'bg-blue-50' },
        { id: 'devocionais', label: 'Devocionais', icon: HeartHandshake, color: 'text-amber-500', bg: 'bg-amber-50' },
        { id: 'reading', label: 'Planos', icon: GraduationCap, color: 'text-emerald-600', bg: 'bg-emerald-50' },
        { id: 'series', label: 'Séries', icon: PlayCircle, color: 'text-primary', bg: 'bg-slate-100' },
        // Secondary items
        { id: 'kids', label: 'Kids', icon: Users, color: 'text-pink-500', bg: 'bg-pink-50' },
        { id: 'music', label: 'Louvor', icon: Music, color: 'text-purple-600', bg: 'bg-purple-50' },
    ];

    return (
        <PortalSection title="Conteúdos" icon={BookOpen} actionLabel="Ver tudo">
            <div className="grid grid-cols-3 gap-3">
                {categories.map((cat) => (
                    <button
                        key={cat.id}
                        className="flex flex-col items-center justify-center p-3 rounded-xl border border-slate-100 bg-white shadow-sm hover:bg-slate-50 transition-colors active:scale-95"
                    >
                        <div className={`p-2.5 rounded-full ${cat.bg} mb-2`}>
                            <cat.icon className={`h-5 w-5 ${cat.color}`} />
                        </div>
                        <span className="text-xs font-medium text-slate-600">{cat.label}</span>
                    </button>
                ))}
            </div>
        </PortalSection>
    );
}

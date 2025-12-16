
import { Calendar, BookOpen, MessageCircleHeart, User, Construction, ChevronRight } from 'lucide-react';

export function Agenda() {
    return (
        <div className="p-4 pt-8">
            <h1 className="font-heading font-bold text-2xl text-slate-800 mb-4 flex items-center">
                <Calendar className="mr-2 h-6 w-6 text-secondary" /> Agenda 2025
            </h1>
            <div className="space-y-4">
                <p className="text-slate-500">Próximos eventos da igreja.</p>
                {/* Placeholder List */}
                {[1, 2, 3].map(i => (
                    <div key={i} className="bg-white p-4 rounded-xl border border-slate-100 shadow-sm flex">
                        <div className="bg-slate-100 rounded-lg p-2 text-center min-w-[3.5rem] mr-4 flex flex-col justify-center">
                            <span className="text-xs font-bold text-slate-500 uppercase">Dez</span>
                            <span className="text-xl font-bold text-slate-800">1{i}</span>
                        </div>
                        <div>
                            <h3 className="font-bold text-slate-800">Culto de Celebração {i}</h3>
                            <p className="text-xs text-slate-500 mt-1">Domingo às 18:00 • Templo Maior</p>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}

export function Conteudos() {
    return (
        <div className="p-4 pt-8">
            <h1 className="font-heading font-bold text-2xl text-slate-800 mb-4 flex items-center">
                <BookOpen className="mr-2 h-6 w-6 text-primary" /> Conteúdos
            </h1>
            <div className="grid grid-cols-2 gap-4">
                {['Bíblia Online', 'Devocionais', 'Séries', 'Estudos', 'Kids', 'Jovens'].map(cat => (
                    <div key={cat} className="bg-white p-4 rounded-xl border border-slate-100 shadow-sm text-center py-8 hover:border-primary/20 transition-colors">
                        <div className="h-10 w-10 bg-slate-50 rounded-full mx-auto mb-3 flex items-center justify-center">
                            <BookOpen className="h-5 w-5 text-primary" />
                        </div>
                        <h3 className="font-bold text-slate-700 text-sm">{cat}</h3>
                    </div>
                ))}
            </div>
        </div>
    );
}

export function Pedidos() {
    return (
        <div className="p-4 pt-8">
            <h1 className="font-heading font-bold text-2xl text-slate-800 mb-4 flex items-center">
                <MessageCircleHeart className="mr-2 h-6 w-6 text-alert" /> Pedidos
            </h1>
            <p className="text-slate-500 mb-6">Como podemos ajudar você hoje?</p>

            <button className="w-full bg-white p-4 rounded-xl border border-slate-100 shadow-sm mb-3 flex items-center justify-between group">
                <span className="font-bold text-slate-700">Pedido de Oração</span>
                <ChevronRight className="h-5 w-5 text-slate-300 group-hover:text-primary" />
            </button>
            <button className="w-full bg-white p-4 rounded-xl border border-slate-100 shadow-sm mb-3 flex items-center justify-between group">
                <span className="font-bold text-slate-700">Agendar Visita Pastoral</span>
                <ChevronRight className="h-5 w-5 text-slate-300 group-hover:text-primary" />
            </button>
            <button className="w-full bg-white p-4 rounded-xl border border-slate-100 shadow-sm mb-3 flex items-center justify-between group">
                <span className="font-bold text-slate-700">Falar com Líder</span>
                <ChevronRight className="h-5 w-5 text-slate-300 group-hover:text-primary" />
            </button>
        </div>
    );
}


export function Perfil() {
    return (
        <div className="p-4 pt-8">
            <h1 className="font-heading font-bold text-2xl text-slate-800 mb-6 flex items-center">
                <User className="mr-2 h-6 w-6 text-highlight" /> Meu Perfil
            </h1>

            <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 mb-6 flex items-center">
                <div className="h-16 w-16 bg-slate-200 rounded-full mr-4 flex items-center justify-center">
                    <User className="h-8 w-8 text-slate-400" />
                </div>
                <div>
                    <h2 className="font-bold text-lg text-slate-800">Visitante</h2>
                    <p className="text-xs text-slate-500">Faça login para acessar todos os recursos</p>
                    <button className="mt-2 text-primary font-bold text-sm">Entrar / Cadastrar</button>
                </div>
            </div>

            <div className="space-y-2">
                <div className="bg-slate-50 p-3 rounded-lg flex items-center justify-between">
                    <span className="text-sm font-medium text-slate-600">Configurações</span>
                    <Construction className="h-4 w-4 text-slate-400" />
                </div>
                <div className="bg-slate-50 p-3 rounded-lg flex items-center justify-between">
                    <span className="text-sm font-medium text-slate-600">Ajuda</span>
                    <Construction className="h-4 w-4 text-slate-400" />
                </div>
            </div>
        </div>
    );
}

import { useNavigate } from 'react-router-dom';
import { Heart, Calendar, MessageCircle, AlertCircle, HeartHandshake } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { InternalPageLayout } from '@/components/layout/InternalPageLayout';

export default function RequestsHub() {
    const navigate = useNavigate();

    return (
        <InternalPageLayout
            title="Pedidos"
            subtitle="Acompanhe pedidos e intercessões."
            icon={HeartHandshake}
            iconClassName="text-rose-500"
            backPath="/home"
        >
            <div className="p-4 space-y-6">

                {/* Main Actions */}
                <div className="grid gap-4">
                    <button
                        onClick={() => navigate('/requests/new?type=oracao')}
                        className="bg-white p-5 rounded-xl border border-slate-100 shadow-sm flex items-center gap-4 active:scale-[0.98] transition-all text-left group"
                    >
                        <div className="w-12 h-12 rounded-full bg-blue-50 flex items-center justify-center group-hover:bg-blue-100 transition-colors">
                            <Heart className="w-6 h-6 text-blue-600" />
                        </div>
                        <div>
                            <h3 className="font-bold text-slate-800 text-lg">Pedir Oração</h3>
                            <p className="text-xs text-slate-500 mt-1">Compartilhe um pedido com a liderança ou igreja.</p>
                        </div>
                    </button>

                    <button
                        onClick={() => navigate('/requests/new?type=visita')}
                        className="bg-white p-5 rounded-xl border border-slate-100 shadow-sm flex items-center gap-4 active:scale-[0.98] transition-all text-left group"
                    >
                        <div className="w-12 h-12 rounded-full bg-green-50 flex items-center justify-center group-hover:bg-green-100 transition-colors">
                            <Calendar className="w-6 h-6 text-green-600" />
                        </div>
                        <div>
                            <h3 className="font-bold text-slate-800 text-lg">Solicitar Visita</h3>
                            <p className="text-xs text-slate-500 mt-1">Receba uma visita pastoral em sua casa ou hospital.</p>
                        </div>
                    </button>

                    <button
                        onClick={() => navigate('/requests/new?type=aconselhamento')}
                        className="bg-white p-5 rounded-xl border border-slate-100 shadow-sm flex items-center gap-4 active:scale-[0.98] transition-all text-left group"
                    >
                        <div className="w-12 h-12 rounded-full bg-purple-50 flex items-center justify-center group-hover:bg-purple-100 transition-colors">
                            <MessageCircle className="w-6 h-6 text-purple-600" />
                        </div>
                        <div>
                            <h3 className="font-bold text-slate-800 text-lg">Aconselhamento</h3>
                            <p className="text-xs text-slate-500 mt-1">Converse com um pastor ou líder sobre questões pessoais.</p>
                        </div>
                    </button>
                </div>

                {/* My Requests Preview */}
                <div className="mt-8">
                    <div className="flex justify-between items-center mb-3">
                        <h2 className="font-bold text-slate-700">Meus Pedidos</h2>
                        <Button variant="link" className="text-xs h-auto p-0 text-blue-600" onClick={() => navigate('/requests/list')}>
                            Ver todos
                        </Button>
                    </div>

                    {/* Placeholder for list - will implement logic later */}
                    <div className="bg-slate-100 rounded-xl p-6 text-center">
                        <p className="text-sm text-slate-400">Você ainda não tem pedidos recentes.</p>
                    </div>
                </div>

                {/* Confidentiality Note */}
                <div className="bg-amber-50 rounded-xl p-4 flex gap-3 text-amber-800 text-xs">
                    <AlertCircle className="w-5 h-5 shrink-0" />
                    <p>
                        <span className="font-bold block mb-1">Privacidade Garantida</span>
                        Seus pedidos de aconselhamento e confissões são estritamente confidenciais e acessíveis apenas aos pastores autorizados.
                    </p>
                </div>
            </div>
        </InternalPageLayout>
    );
}

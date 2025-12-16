import { Clock, Lock, UserPlus, LogIn } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useMembership } from '@/contexts/MembershipContext';
import { useState } from 'react';

// Shared Layout for Status Screens
function StatusLayout({ icon: Icon, title, description, action }: any) {
    return (
        <div className="min-h-screen flex flex-col items-center justify-center p-6 bg-slate-50 text-center">
            <div className="bg-white p-8 rounded-3xl shadow-sm border border-slate-100 max-w-sm w-full">
                <div className="bg-slate-100 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6">
                    <Icon className="w-10 h-10 text-slate-500" />
                </div>
                <h2 className="text-2xl font-bold text-slate-800 mb-3">{title}</h2>
                <p className="text-slate-500 mb-8 leading-relaxed">
                    {description}
                </p>
                {action}
            </div>
        </div>
    );
}

export function PendingApproval() {
    return (
        <StatusLayout
            icon={Clock}
            title="Aguardando Aprovação"
            description="Seu cadastro foi recebido com sucesso! Nossa equipe está analisando sua solicitação. Você receberá uma notificação assim que seu acesso for liberado."
            action={
                <button disabled className="w-full bg-slate-100 text-slate-400 font-bold py-3 rounded-xl cursor-not-allowed">
                    Em análise
                </button>
            }
        />
    );
}

export function AccessDenied() {
    return (
        <StatusLayout
            icon={Lock}
            title="Acesso Bloqueado"
            description="Seu acesso a esta igreja está temporariamente suspenso. Entre em contato com a administração para mais informações."
            action={
                <button className="w-full bg-slate-200 text-slate-600 font-bold py-3 rounded-xl hover:bg-slate-300 transition-colors">
                    Falar com Suporte
                </button>
            }
        />
    );
}

export function NotAMember() {
    const { joinChurch } = useMembership();
    const [isJoining, setIsJoining] = useState(false);
    const [name, setName] = useState('');

    const handleJoin = async () => {
        if (!name.trim()) return;
        setIsJoining(true);
        try {
            await joinChurch({ full_name: name });
        } catch (error) {
            console.error(error);
            alert('Erro ao solicitar participação.');
        } finally {
            setIsJoining(false);
        }
    };

    return (
        <StatusLayout
            icon={UserPlus}
            title="Faça parte da Família"
            description="Para acessar os conteúdos exclusivos e interagir com a igreja, é necessário ser um membro cadastrado."
            action={
                <div className="space-y-4">
                    <input
                        type="text"
                        placeholder="Seu nome completo"
                        className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all"
                        value={name}
                        onChange={e => setName(e.target.value)}
                    />
                    <button
                        onClick={handleJoin}
                        disabled={isJoining || !name.trim()}
                        className="w-full bg-primary text-white font-bold py-3 rounded-xl hover:bg-primary/90 transition-transform active:scale-95 disabled:opacity-50 disabled:pointer-events-none"
                    >
                        {isJoining ? 'Enviando...' : 'Solicitar Entrada'}
                    </button>
                </div>
            }
        />
    );
}

export function GuestLogin() {
    const navigate = useNavigate();
    return (
        <StatusLayout
            icon={LogIn}
            title="Bem-vindo"
            description="Faça login para acessar a área de membros da sua igreja."
            action={
                <button
                    onClick={() => navigate('/login')} // Need to check where login route is
                    className="w-full bg-slate-900 text-white font-bold py-3 rounded-xl hover:bg-slate-800 transition-transform active:scale-95"
                >
                    Entrar
                </button>
            }
        />
    );
}

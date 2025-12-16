import { useMembership } from '@/contexts/MembershipContext';
import { Shield, Edit, LogOut, ChevronRight } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '@/lib/supabase';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';

export default function ProfileHub() {
    const { member } = useMembership();
    const navigate = useNavigate();

    const handleLogout = async () => {
        await supabase.auth.signOut();
        navigate('/landing');
    };

    return (
        <div className="pb-20 bg-slate-50 min-h-screen">
            {/* Header Profile */}
            <div className="bg-white p-6 pb-8 border-b border-slate-100 mb-6">
                <div className="flex flex-col items-center">
                    <Avatar className="w-24 h-24 mb-4 border-4 border-slate-50 shadow-sm">
                        <AvatarImage src={member?.photo_url || ''} />
                        <AvatarFallback className="bg-blue-100 text-blue-600 text-2xl font-bold">
                            {member?.full_name?.substring(0, 2).toUpperCase()}
                        </AvatarFallback>
                    </Avatar>
                    <h1 className="text-xl font-bold text-slate-900">{member?.full_name}</h1>
                    <p className="text-slate-500 text-sm mt-1">{member?.role || 'Membro'}</p>
                </div>
            </div>

            {/* Menu */}
            <div className="px-4 space-y-3">

                <button onClick={() => navigate('edit')} className="w-full bg-white p-4 rounded-xl border border-slate-200 flex items-center justify-between active:scale-[0.98] transition-transform">
                    <div className="flex items-center space-x-4">
                        <div className="bg-blue-50 w-10 h-10 rounded-full flex items-center justify-center">
                            <Edit className="w-5 h-5 text-blue-600" />
                        </div>
                        <div className="text-left">
                            <h3 className="font-bold text-slate-800 text-sm">Editar Dados</h3>
                            <p className="text-xs text-slate-400">Atualizar nome, foto e contato</p>
                        </div>
                    </div>
                    <ChevronRight className="w-5 h-5 text-slate-300" />
                </button>

                <button onClick={() => navigate('privacy')} className="w-full bg-white p-4 rounded-xl border border-slate-200 flex items-center justify-between active:scale-[0.98] transition-transform">
                    <div className="flex items-center space-x-4">
                        <div className="bg-purple-50 w-10 h-10 rounded-full flex items-center justify-center">
                            <Shield className="w-5 h-5 text-purple-600" />
                        </div>
                        <div className="text-left">
                            <h3 className="font-bold text-slate-800 text-sm">Privacidade (LGPD)</h3>
                            <p className="text-xs text-slate-400">Controle quem vê seus dados</p>
                        </div>
                    </div>
                    <ChevronRight className="w-5 h-5 text-slate-300" />
                </button>

                <button onClick={handleLogout} className="w-full bg-white p-4 rounded-xl border border-slate-200 flex items-center justify-between active:scale-[0.98] transition-transform mt-8 text-red-600">
                    <div className="flex items-center space-x-4">
                        <div className="bg-red-50 w-10 h-10 rounded-full flex items-center justify-center">
                            <LogOut className="w-5 h-5 text-red-600" />
                        </div>
                        <div className="text-left">
                            <h3 className="font-bold text-sm">Sair do App</h3>
                        </div>
                    </div>
                </button>

            </div>
        </div>
    );
}

import { useState, useEffect } from 'react';
import { useMembership } from '@/contexts/MembershipContext';
import { supabase } from '@/lib/supabase';
import { BackHeader } from '@/components/BackHeader';
import { Save, Loader2, User, Phone, Calendar } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export default function ProfileEditor() {
    const { member, refreshMember } = useMembership();
    const navigate = useNavigate();
    const [isLoading, setIsLoading] = useState(false);

    const [formData, setFormData] = useState({
        full_name: '',
        nickname: '',
        phone: '',
        birth_date: ''
    });

    useEffect(() => {
        if (member) {
            setFormData({
                full_name: member.full_name || '',
                nickname: member.nickname || '',
                phone: member.phone || '',
                birth_date: member.birth_date || ''
            });
        }
    }, [member]);

    const handleSave = async () => {
        if (!member) return;
        setIsLoading(true);
        try {
            const { error } = await supabase
                .from('members')
                .update(formData)
                .eq('id', member.id);

            if (error) throw error;
            await refreshMember();
            alert('Perfil atualizado com sucesso!');
            navigate(-1);
        } catch (error) {
            console.error(error);
            alert('Erro ao atualizar perfil.');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="pb-20 bg-slate-50 min-h-screen">
            <BackHeader title="Editar Dados" />

            <div className="p-4 space-y-6">

                <div className="space-y-4 bg-white p-6 rounded-2xl border border-slate-100 shadow-sm">
                    {/* Full Name */}
                    <div>
                        <label className="text-xs font-bold text-slate-500 mb-1 block ml-1">Nome Completo</label>
                        <div className="relative">
                            <User className="absolute left-3 top-3 w-5 h-5 text-slate-300" />
                            <input
                                type="text"
                                className="w-full pl-10 pr-4 py-3 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-100 focus:border-blue-500"
                                value={formData.full_name}
                                onChange={e => setFormData({ ...formData, full_name: e.target.value })}
                            />
                        </div>
                    </div>

                    {/* Nickname */}
                    <div>
                        <label className="text-xs font-bold text-slate-500 mb-1 block ml-1">Apelido (Como prefere ser chamado)</label>
                        <div className="relative">
                            <User className="absolute left-3 top-3 w-5 h-5 text-slate-300" />
                            <input
                                type="text"
                                className="w-full pl-10 pr-4 py-3 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-100 focus:border-blue-500"
                                value={formData.nickname}
                                onChange={e => setFormData({ ...formData, nickname: e.target.value })}
                            />
                        </div>
                    </div>

                    {/* Phone */}
                    <div>
                        <label className="text-xs font-bold text-slate-500 mb-1 block ml-1">WhatsApp</label>
                        <div className="relative">
                            <Phone className="absolute left-3 top-3 w-5 h-5 text-slate-300" />
                            <input
                                type="tel"
                                className="w-full pl-10 pr-4 py-3 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-100 focus:border-blue-500"
                                value={formData.phone}
                                onChange={e => setFormData({ ...formData, phone: e.target.value })}
                            />
                        </div>
                    </div>

                    {/* Birth Date */}
                    <div>
                        <label className="text-xs font-bold text-slate-500 mb-1 block ml-1">Data de Nascimento</label>
                        <div className="relative">
                            <Calendar className="absolute left-3 top-3 w-5 h-5 text-slate-300" />
                            <input
                                type="date"
                                className="w-full pl-10 pr-4 py-3 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-100 focus:border-blue-500"
                                value={formData.birth_date}
                                onChange={e => setFormData({ ...formData, birth_date: e.target.value })}
                            />
                        </div>
                    </div>
                </div>

                <p className="text-center text-xs text-slate-400">
                    Ao salvar, você concorda que estes dados são verdadeiros.
                </p>

                {/* Save Button */}
                <button
                    onClick={handleSave}
                    disabled={isLoading}
                    className="w-full bg-slate-900 text-white font-bold py-4 rounded-xl flex items-center justify-center space-x-2 shadow-xl active:scale-[0.98] transition-transform"
                >
                    {isLoading ? <Loader2 className="animate-spin" /> : <Save className="w-5 h-5" />}
                    <span>Salvar Alterações</span>
                </button>

            </div>
        </div>
    );
}

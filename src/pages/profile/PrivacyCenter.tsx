import { useState, useEffect } from 'react';
import { useMembership } from '@/contexts/MembershipContext';
import { supabase } from '@/lib/supabase';
import { PortalSection, PortalCard } from '@/components/ui/PortalComponents';
import { Shield, Eye, Lock, Save, Loader2 } from 'lucide-react';
import { Switch } from '@/components/ui/switch';
import { InternalPageLayout } from '@/components/layout/InternalPageLayout';

export default function PrivacyCenter() {
    const { member, refreshMember } = useMembership();
    // const navigate = useNavigate();
    const [settings, setSettings] = useState({
        show_phone: false,
        show_email: false,
        show_birth: false,
        show_address: false
    });
    const [isLoading, setIsLoading] = useState(false);

    useEffect(() => {
        if (member?.privacy_settings) {
            setSettings(member.privacy_settings);
        }
    }, [member]);

    const handleSave = async () => {
        if (!member) return;
        setIsLoading(true);
        try {
            const { error } = await supabase
                .from('members')
                .update({ privacy_settings: settings })
                .eq('id', member.id);

            if (error) throw error;
            await refreshMember();
            alert('Configurações de privacidade atualizadas!');
        } catch (error) {
            console.error(error);
            alert('Erro ao salvar configurações.');
        } finally {
            setIsLoading(false);
        }
    };

    const toggle = (key: keyof typeof settings) => {
        setSettings(prev => ({ ...prev, [key]: !prev[key] }));
    };

    return (
        <InternalPageLayout
            title="Privacidade"
            subtitle="Controle seus dados e permissões."
            icon={Shield}
            iconClassName="text-purple-600"
            backPath="/profile"
        >
            <div className="px-4 space-y-6">

                {/* 1. LGPD Explanation */}
                <PortalCard className="bg-blue-50 border-blue-200">
                    <div className="flex items-start space-x-3">
                        <Shield className="w-6 h-6 text-blue-600 mt-1" />
                        <div>
                            <h3 className="font-bold text-blue-800 text-sm mb-1">Seus dados estão protegidos</h3>
                            <p className="text-xs text-blue-700 leading-relaxed">
                                Seguindo a Lei Geral de Proteção de Dados (LGPD), você tem controle total sobre quem vê suas informações. Por padrão, seus dados sensíveis são ocultos para outros membros.
                            </p>
                        </div>
                    </div>
                </PortalCard>

                {/* 2. Visibility Controls */}
                <PortalSection title="Visibilidade no Diretório" icon={Eye}>
                    <div className="bg-white rounded-xl border border-slate-100 divide-y divide-slate-100">
                        {/* Phone */}
                        <div className="p-4 flex items-center justify-between">
                            <div>
                                <h4 className="font-bold text-slate-700 text-sm">Telefone / WhatsApp</h4>
                                <p className="text-xs text-slate-400">Permitir que membros vejam seu número</p>
                            </div>
                            <Switch checked={settings.show_phone} onCheckedChange={() => toggle('show_phone')} />
                        </div>

                        {/* Email */}
                        <div className="p-4 flex items-center justify-between">
                            <div>
                                <h4 className="font-bold text-slate-700 text-sm">Endereço de E-mail</h4>
                                <p className="text-xs text-slate-400">Exibir seu e-mail no diretório</p>
                            </div>
                            <Switch checked={settings.show_email} onCheckedChange={() => toggle('show_email')} />
                        </div>

                        {/* Birthday */}
                        <div className="p-4 flex items-center justify-between">
                            <div>
                                <h4 className="font-bold text-slate-700 text-sm">Data de Nascimento</h4>
                                <p className="text-xs text-slate-400">Mostrar dia e mês do seu aniversário</p>
                            </div>
                            <Switch checked={settings.show_birth} onCheckedChange={() => toggle('show_birth')} />
                        </div>
                    </div>
                </PortalSection>

                {/* 3. Data Usage Info */}
                <PortalSection title="Como usamos seus dados" icon={Lock}>
                    <PortalCard>
                        <ul className="space-y-3">
                            <li className="text-xs text-slate-600 flex items-start">
                                <span className="bg-slate-100 rounded-full w-4 h-4 flex items-center justify-center text-[10px] font-bold mr-2 mt-0.5">1</span>
                                <span>Seus dados são usados apenas para comunicação interna da igreja e gestão eclesiástica.</span>
                            </li>
                            <li className="text-xs text-slate-600 flex items-start">
                                <span className="bg-slate-100 rounded-full w-4 h-4 flex items-center justify-center text-[10px] font-bold mr-2 mt-0.5">2</span>
                                <span>Apenas pastores e administradores autorizados têm acesso completo ao seu cadastro.</span>
                            </li>
                            <li className="text-xs text-slate-600 flex items-start">
                                <span className="bg-slate-100 rounded-full w-4 h-4 flex items-center justify-center text-[10px] font-bold mr-2 mt-0.5">3</span>
                                <span>Você pode solicitar a exclusão da sua conta a qualquer momento entrando em contato com a secretaria.</span>
                            </li>
                        </ul>
                    </PortalCard>
                </PortalSection>

                {/* Save Button */}
                <button
                    onClick={handleSave}
                    disabled={isLoading}
                    className="w-full bg-slate-900 text-white font-bold py-4 rounded-xl flex items-center justify-center space-x-2 fixed bottom-6 left-4 right-4 max-w-[calc(100%-2rem)] mx-auto shadow-xl z-20 active:scale-95 transition-transform"
                    style={{ width: 'calc(100% - 2rem)' }} // Mobile fix
                >
                    {isLoading ? <Loader2 className="animate-spin" /> : <Save className="w-5 h-5" />}
                    <span>Salvar Preferências</span>
                </button>
                <div className="h-16"></div> {/* Spacer for fixed button */}

            </div>
        </InternalPageLayout>
    );
}

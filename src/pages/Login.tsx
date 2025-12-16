import { useState } from 'react';
import { supabase } from '@/lib/supabase';
import { useNavigate } from 'react-router-dom';
import { Mail, Lock, Loader2 } from 'lucide-react';

export default function Login() {
    const navigate = useNavigate();
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [mode, setMode] = useState<'signin' | 'signup'>('signin');

    const handleAuth = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError('');

        try {
            if (mode === 'signup') {
                const { error } = await supabase.auth.signUp({
                    email,
                    password,
                });
                if (error) throw error;
                alert('Cadastro realizado! Verifique seu email.');
            } else {
                const { data: { user } } = await supabase.auth.signInWithPassword({
                    email,
                    password,
                });
                if (user) {
                    await handleLoginSuccess(user.id);
                }
            }
        } catch (err: any) {
            setError(err.message || 'Erro na autenticação');
        } finally {
            setLoading(false);
        }
    };

    const handleLoginSuccess = async (userId: string) => {
        try {
            // 1. Get Profile to find Church
            const { data: profile, error: profileError } = await supabase
                .from('profiles')
                .select('church_id')
                .eq('id', userId)
                .single();

            if (profileError || !profile?.church_id) {
                // Fallback if no church assigned yet
                navigate('/');
                return;
            }

            // 2. Get Church Slug
            const { data: church, error: churchError } = await supabase
                .from('churches')
                .select('slug')
                .eq('id', profile.church_id)
                .single();

            if (churchError || !church?.slug) {
                // No church found for profile, redirect to onboarding
                navigate('/onboarding/select-church');
                return;
            }

            // 3. Redirect to Authenticated Home
            navigate(`/c/${church.slug}`);

        } catch (error) {
            console.error("Redirection error:", error);
            navigate('/');
        }
    };

    return (
        <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4">
            <div className="bg-white p-8 rounded-3xl shadow-sm border border-slate-100 w-full max-w-sm">
                <div className="text-center mb-8">
                    <h1 className="text-2xl font-bold text-slate-900">{mode === 'signin' ? 'Bem-vindo' : 'Criar Conta'}</h1>
                    <p className="text-slate-400 text-sm">Acesse o MD Connect</p>
                </div>

                <form onSubmit={handleAuth} className="space-y-4">
                    <div>
                        <label className="block text-xs font-bold text-slate-500 mb-1 ml-1">Email</label>
                        <div className="relative">
                            <Mail className="absolute left-3 top-3 w-5 h-5 text-slate-300" />
                            <input
                                type="email"
                                className="w-full pl-10 pr-4 py-3 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all"
                                placeholder="seu@email.com"
                                value={email}
                                onChange={e => setEmail(e.target.value)}
                                required
                            />
                        </div>
                    </div>
                    <div>
                        <label className="block text-xs font-bold text-slate-500 mb-1 ml-1">Senha</label>
                        <div className="relative">
                            <Lock className="absolute left-3 top-3 w-5 h-5 text-slate-300" />
                            <input
                                type="password"
                                className="w-full pl-10 pr-4 py-3 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all"
                                placeholder="••••••••"
                                value={password}
                                onChange={e => setPassword(e.target.value)}
                                required
                            />
                        </div>
                    </div>

                    {error && <p className="text-red-500 text-xs text-center">{error}</p>}

                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full bg-slate-900 text-white font-bold py-3 rounded-xl hover:bg-slate-800 transition-transform active:scale-95 disabled:opacity-70 flex justify-center"
                    >
                        {loading ? <Loader2 className="animate-spin" /> : (mode === 'signin' ? 'Entrar' : 'Cadastrar')}
                    </button>
                </form>

                <div className="mt-6 text-center text-sm text-slate-500">
                    <button onClick={() => setMode(mode === 'signin' ? 'signup' : 'signin')} className="hover:text-primary underline">
                        {mode === 'signin' ? 'Não tem conta? Cadastre-se' : 'Já tenho conta. Entrar'}
                    </button>
                </div>
            </div>
        </div>
    );
}

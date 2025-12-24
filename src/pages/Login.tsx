import { useState } from 'react';
import { supabase } from '@/lib/supabase';
import { useNavigate } from 'react-router-dom';
import { Mail, Lock, Loader2 } from 'lucide-react';
import { analytics } from '@/lib/analytics';

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

                // Track signup event
                analytics.track({
                    name: 'login_status',
                    element: 'signup',
                    context: 'public',
                    metadata: { method: 'email' }
                });

                alert('Cadastro realizado! Verifique seu email.');
            } else {
                const { data: { user } } = await supabase.auth.signInWithPassword({
                    email,
                    password,
                });
                if (user) {
                    // Track login event
                    analytics.track({
                        name: 'login_status',
                        element: 'login',
                        context: 'public',
                        metadata: { method: 'email', user_id: user.id }
                    });

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
        <div className="min-h-screen bg-transparent flex items-center justify-center p-4">
            <div className="bg-white/95 backdrop-blur-xl p-8 rounded-3xl shadow-lg border border-white/50 w-full max-w-sm">
                <div className="text-center mb-8">
                    <h1 className="text-2xl font-bold text-slate-900">{mode === 'signin' ? 'Bem-vindo' : 'Criar Conta'}</h1>
                    <p className="text-slate-500 font-medium text-sm">Acesse o MD Connect</p>
                </div>

                <form onSubmit={handleAuth} className="space-y-4">
                    <div>
                        <label className="block text-xs font-bold text-slate-700 mb-1 ml-1">Email</label>
                        <div className="relative">
                            <Mail className="absolute left-3 top-3 w-5 h-5 text-slate-400" />
                            <input
                                type="email"
                                className="w-full pl-10 pr-4 py-3 rounded-xl border border-slate-200 text-slate-900 font-medium focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all placeholder:text-slate-300"
                                placeholder="seu@email.com"
                                value={email}
                                onChange={e => setEmail(e.target.value)}
                                required
                            />
                        </div>
                    </div>
                    <div>
                        <label className="block text-xs font-bold text-slate-700 mb-1 ml-1">Senha</label>
                        <div className="relative">
                            <Lock className="absolute left-3 top-3 w-5 h-5 text-slate-400" />
                            <input
                                type="password"
                                className="w-full pl-10 pr-4 py-3 rounded-xl border border-slate-200 text-slate-900 font-medium focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all placeholder:text-slate-300"
                                placeholder="••••••••"
                                value={password}
                                onChange={e => setPassword(e.target.value)}
                                required
                            />
                        </div>
                    </div>

                    {error && <p className="text-red-500 text-xs text-center font-bold bg-red-50 py-2 rounded-lg">{error}</p>}

                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full bg-slate-900 text-white font-bold py-3.5 rounded-xl hover:bg-slate-800 transition-transform active:scale-95 disabled:opacity-70 flex justify-center shadow-lg shadow-slate-900/10"
                    >
                        {loading ? <Loader2 className="animate-spin" /> : (mode === 'signin' ? 'Entrar' : 'Cadastrar')}
                    </button>
                </form>

                <div className="mt-6 text-center text-sm text-slate-500">
                    <button onClick={() => setMode(mode === 'signin' ? 'signup' : 'signin')} className="hover:text-indigo-600 font-bold underline decoration-2 underline-offset-2 transition-colors">
                        {mode === 'signin' ? 'Não tem conta? Cadastre-se' : 'Já tenho conta. Entrar'}
                    </button>
                </div>
            </div>
        </div>
    );
}

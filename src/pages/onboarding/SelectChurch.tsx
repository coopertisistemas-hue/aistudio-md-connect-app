import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import { useNavigate } from 'react-router-dom';
import { Search, MapPin, Loader2, Church, AlertCircle, RefreshCw } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { InternalPageLayout } from '@/components/layout/InternalPageLayout';
import { Button } from '@/components/ui/button';

interface Church {
    id: string;
    name: string;
    slug: string;
    city: string;
    state: string;
    cover_image_url?: string;
    theme_color?: string;
}

export default function SelectChurch() {
    const navigate = useNavigate();
    const { user } = useAuth();
    const [churches, setChurches] = useState<Church[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [joining, setJoining] = useState<string | null>(null);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        loadChurches();
    }, []);

    const loadChurches = async () => {
        setError(null);
        setLoading(true);
        try {
            // Using Edge Function as requested
            const { data, error } = await supabase.functions.invoke('public-churches-list');
            if (error) throw error;
            setChurches(data || []);
        } catch (err: any) {
            console.error('Error loading churches:', err);
            setError('Erro ao carregar igrejas. Verifique sua conexão e tente novamente.');
        } finally {
            setLoading(false);
        }
    };

    const handleJoinChurch = async (church: Church) => {
        if (!user) return;
        setJoining(church.id);
        try {
            // 1. Update Profile (User selects their "Home Church")
            const { error: profileError } = await supabase
                .from('profiles')
                .update({ church_id: church.id })
                .eq('id', user.id);

            if (profileError) throw profileError;

            // 2. Also ensure they are in the members table (as pending or active?)
            // For now, linking profile is enough to get them redirected, 
            // but MembershipContext checks 'members' table.
            // Let's create a pending member record if not exists.
            const { error: memberError } = await supabase
                .from('members')
                .upsert({
                    church_id: church.id,
                    user_id: user.id,
                    status: 'pendente', // Requires approval or 'active' for auto-join
                    full_name: user.email?.split('@')[0] || 'Novo Membro'
                }, { onConflict: 'user_id, church_id' });

            // If error, ignore for now as RLS might block if not permitted
            if (memberError) console.log("Member creation warning:", memberError);

            // 3. Redirect
            navigate(`/c/${church.slug}`);

        } catch (err) {
            console.error(err);
            alert('Erro ao selecionar igreja.');
        } finally {
            setJoining(null);
        }
    };

    const filteredChurches = churches.filter(c =>
        c.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        c.city.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <InternalPageLayout
            title="Selecionar Igreja"
            subtitle="Escolha sua igreja para continuar."
            icon={Church}
            iconClassName="text-blue-600"
            backPath="/landing"
        >
            <div className="px-4 space-y-6">

                <div className="relative mb-6">
                    <Search className="absolute left-3 top-3.5 w-5 h-5 text-slate-400" />
                    <input
                        type="text"
                        placeholder="Buscar por nome ou cidade..."
                        className="w-full pl-10 pr-4 py-3 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all bg-white shadow-sm"
                        value={searchTerm}
                        onChange={e => setSearchTerm(e.target.value)}
                    />
                </div>

                {loading ? (
                    <div className="flex justify-center py-12">
                        <Loader2 className="w-8 h-8 text-primary animate-spin" />
                    </div>
                ) : error ? (
                    <div className="flex flex-col items-center justify-center py-12 px-4">
                        <div className="bg-red-50 border border-red-100 rounded-2xl p-8 max-w-md w-full text-center">
                            <div className="flex justify-center mb-4">
                                <div className="bg-red-100 rounded-full p-3">
                                    <AlertCircle className="w-8 h-8 text-red-600" />
                                </div>
                            </div>
                            <h3 className="font-bold text-lg text-slate-900 mb-2">Ops! Algo deu errado</h3>
                            <p className="text-slate-600 mb-6">{error}</p>
                            <Button
                                onClick={loadChurches}
                                className="w-full bg-slate-900 hover:bg-slate-800 text-white font-bold"
                            >
                                <RefreshCw className="w-4 h-4 mr-2" />
                                Tentar novamente
                            </Button>
                        </div>
                    </div>
                ) : (
                    <div className="grid gap-4">
                        {filteredChurches.map(church => (
                            <div key={church.id} className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden flex flex-col">
                                {church.cover_image_url && (
                                    <div className="h-32 bg-slate-200 w-full relative">
                                        <img src={church.cover_image_url} alt={church.name} className="w-full h-full object-cover" />
                                        <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />
                                    </div>
                                )}
                                <div className="p-5 flex flex-col gap-3">
                                    <div>
                                        <h3 className="font-bold text-lg text-slate-900">{church.name}</h3>
                                        <div className="flex items-center text-slate-500 text-sm gap-1 mt-1">
                                            <MapPin className="w-4 h-4" />
                                            {church.city}, {church.state}
                                        </div>
                                    </div>
                                    <button
                                        onClick={() => handleJoinChurch(church)}
                                        disabled={!!joining}
                                        className="w-full mt-2 bg-slate-900 text-white font-bold py-3 rounded-xl hover:bg-slate-800 transition-all active:scale-95 disabled:opacity-70 flex items-center justify-center"
                                    >
                                        {joining === church.id ? <Loader2 className="animate-spin w-5 h-5" /> : 'Participar desta Igreja'}
                                    </button>
                                </div>
                            </div>
                        ))}

                        {filteredChurches.length === 0 && churches.length === 0 && (
                            <div className="text-center py-12">
                                <div className="bg-slate-50 border border-slate-100 rounded-2xl p-8 max-w-md mx-auto">
                                    <div className="flex justify-center mb-4">
                                        <Church className="w-12 h-12 text-slate-300" />
                                    </div>
                                    <h3 className="font-bold text-lg text-slate-900 mb-2">Nenhuma igreja disponível</h3>
                                    <p className="text-slate-500 text-sm">No momento não há igrejas cadastradas no sistema.</p>
                                </div>
                            </div>
                        )}

                        {filteredChurches.length === 0 && churches.length > 0 && (
                            <div className="text-center py-12 text-slate-400">
                                Nenhuma igreja encontrada com esse filtro.
                            </div>
                        )}
                    </div>
                )}
            </div>
        </InternalPageLayout>
    );
}

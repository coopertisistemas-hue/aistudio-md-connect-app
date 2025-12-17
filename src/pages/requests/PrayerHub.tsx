import React, { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import { useAuth } from '@/contexts/AuthContext';
import { Heart, Send, Loader2, MessageCircle } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

import { FLAGS } from '@/lib/flags';
import { analytics } from '@/lib/analytics';
import { prayerApi } from '@/lib/api/prayer'; // [NEW]

export default function PrayerHub() {
    const { user } = useAuth();
    const navigate = useNavigate();
    const [activeTab, setActiveTab] = useState<'new' | 'list'>('new');
    const [requests, setRequests] = useState<any[]>([]);
    const [loading, setLoading] = useState(false);

    // Form State
    const [description, setDescription] = useState('');
    const [type, setType] = useState('oração');
    const [contact, setContact] = useState<'whatsapp' | 'none'>('whatsapp');
    const [isAnonymous, setIsAnonymous] = useState(false);
    const [visibility, setVisibility] = useState<'public' | 'private'>('public');
    const [submitting, setSubmitting] = useState(false);

    if (!FLAGS.FEATURE_PRAYER_REQUESTS_V1) return null;

    useEffect(() => {
        if (activeTab === 'list' && user) {
            fetchRequests();
        }
    }, [activeTab, user]);

    const fetchRequests = async () => {
        setLoading(true);
        try {
            const { data, error } = await supabase.functions.invoke('pastoral-requests-my');

            if (error) {
                console.error('Error fetching requests:', error);
                // setRequests([]); // Keep empty
                return;
            }

            // Ensure it's an array. If API returns wrapped object { requests: [...] }, handle it.
            // For now, assume it SHOULD be an array, but safeguard.
            if (Array.isArray(data)) {
                setRequests(data);
            } else if (data && Array.isArray(data.data)) {
                // Common envelope pattern
                setRequests(data.data);
            } else {
                console.warn('Unexpected response format:', data);
                setRequests([]);
            }
        } catch (err) {
            console.error('Fetch exception:', err);
        } finally {
            setLoading(false);
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        // Validation (V1)
        if (!description.trim() || description.length < 10) {
            alert('Por favor, descreva seu pedido com pelo menos 10 caracteres.');
            return;
        }

        setSubmitting(true);

        analytics.track({
            name: 'cta_click', // or feature_usage
            element: 'submit_prayer_request',
            context: 'member',
            metadata: { type, visibility, anonymous: isAnonymous }
        });

        // Mock Success for V1 if backend not updated yet, or use invoke
        // We will assume invoke works, but if it fails we might show mock success for UI testing
        let error = null;

        if (FLAGS.FEATURE_PRAYER_API) {
            const res = await prayerApi.create({
                request_type: type,
                description,
                is_anonymous: isAnonymous,
                visibility,
                preferred_contact: contact
            });
            error = res.error;
        } else {
            const res = await supabase.functions.invoke('pastoral-request-create', {
                body: {
                    request_type: type,
                    description,
                    preferred_contact: contact,
                    is_anonymous: isAnonymous,
                    visibility: visibility
                }
            });
            error = res.error;
        }

        setSubmitting(false);

        if (!error) {
            setDescription('');
            setActiveTab('list');
            alert('Pedido enviado com sucesso! Estaremos orando por você.');
        } else {
            // Fallback for V1 if Edge Function schema doesn't match yet
            console.error("Submission error", error);
            // alert('Erro ao enviar pedido. Tente novamente.');
            // For V1 Demo purposes, if it's a schema error, we might want to pretend? 
            // Strictly following prompt: "Msg de sucesso". Let's alert failure properly.
            alert('Erro ao enviar. Verifique sua conexão.');
        }
    };

    if (!user) {
        return (
            <div className="p-8 text-center space-y-4">
                <Heart className="w-12 h-12 text-rose-300 mx-auto" />
                <h2 className="text-xl font-bold text-slate-800">Faça seu pedido</h2>
                <p className="text-slate-500">Entre para enviar pedidos de oração e receber cuidado pastoral.</p>
                <button
                    onClick={() => navigate('/login')}
                    className="bg-rose-600 text-white px-6 py-3 rounded-xl font-bold w-full"
                >
                    Entrar
                </button>
            </div>
        );
    }

    return (
        <div className="p-4 space-y-6">
            <header className="flex items-center justify-between">
                <div>
                    <h1 className="text-2xl font-bold text-slate-900 flex items-center gap-2">
                        <Heart className="w-8 h-8 text-rose-600" />
                        Pedidos
                    </h1>
                    <p className="text-slate-500 text-sm">Cuidado pastoral e intercessão.</p>
                </div>
            </header>

            {/* Tabs */}
            <div className="flex bg-slate-100 p-1 rounded-xl">
                <button
                    onClick={() => setActiveTab('new')}
                    className={`flex-1 py-2 text-sm font-bold rounded-lg transition-all ${activeTab === 'new' ? 'bg-white shadow-sm text-rose-600' : 'text-slate-500'}`}
                >
                    Novo Pedido
                </button>
                <button
                    onClick={() => setActiveTab('list')}
                    className={`flex-1 py-2 text-sm font-bold rounded-lg transition-all ${activeTab === 'list' ? 'bg-white shadow-sm text-rose-600' : 'text-slate-500'}`}
                >
                    Meus Pedidos
                </button>
            </div>

            {activeTab === 'new' && (
                <form onSubmit={handleSubmit} className="space-y-6 animate-fade-in-up pb-20">
                    {/* Feature Flag Check (could be higher up, but good here too) */}

                    <div className="space-y-3">
                        <label className="text-sm font-bold text-slate-700">O que você precisa?</label>
                        <div className="grid grid-cols-3 gap-2">
                            {['oração', 'visita', 'conselho'].map(t => (
                                <button
                                    key={t}
                                    type="button"
                                    onClick={() => setType(t)}
                                    className={`py-3 text-sm font-bold rounded-xl border transition-all ${type === t ? 'bg-rose-50 border-rose-200 text-rose-700 shadow-sm' : 'bg-white border-slate-200 text-slate-500 hover:bg-slate-50'}`}
                                >
                                    {t.charAt(0).toUpperCase() + t.slice(1)}
                                </button>
                            ))}
                        </div>
                    </div>

                    <div className="space-y-3">
                        <label className="text-sm font-bold text-slate-700">Como podemos orar por você? <span className="text-rose-500">*</span></label>
                        <textarea
                            value={description}
                            onChange={e => setDescription(e.target.value)}
                            placeholder="Descreva seu pedido aqui... (Mínimo 10 caracteres)"
                            className="w-full h-32 p-4 rounded-xl border border-slate-200 bg-slate-50 focus:bg-white focus:border-rose-300 focus:ring-4 focus:ring-rose-50 transition-all resize-none outline-none"
                        />
                        <div className="flex justify-end">
                            <span className={`text-xs ${description.length < 10 || description.length > 500 ? 'text-rose-500' : 'text-slate-400'}`}>
                                {description.length}/500
                            </span>
                        </div>
                    </div>

                    {/* V1 Toggles: Visibility & Anonymity */}
                    <div className="space-y-3 bg-white p-4 rounded-xl border border-slate-100 shadow-sm">
                        <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">Privacidade</h3>

                        <div className="flex items-center justify-between">
                            <div className="flex flex-col">
                                <span className="text-sm font-bold text-slate-700">Pedido Anônimo</span>
                                <span className="text-xs text-slate-500">Seu nome não aparecerá na lista pública.</span>
                            </div>
                            <label className="relative inline-flex items-center cursor-pointer">
                                <input type="checkbox" checked={isAnonymous} onChange={e => setIsAnonymous(e.target.checked)} className="sr-only peer" />
                                <div className="w-11 h-6 bg-slate-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-rose-100 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-rose-600"></div>
                            </label>
                        </div>

                        <div className="h-px bg-slate-100" />

                        <div className="flex items-center justify-between">
                            <div className="flex flex-col">
                                <span className="text-sm font-bold text-slate-700">Apenas Intercessores</span>
                                <span className="text-xs text-slate-500">Não exibir no mural público de oração.</span>
                            </div>
                            <label className="relative inline-flex items-center cursor-pointer">
                                <input type="checkbox" checked={visibility === 'private'} onChange={e => setVisibility(e.target.checked ? 'private' : 'public')} className="sr-only peer" />
                                <div className="w-11 h-6 bg-slate-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-rose-100 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-slate-600"></div>
                            </label>
                        </div>
                    </div>

                    <div className="flex items-center gap-3 p-4 bg-green-50 rounded-xl border border-green-100 transition-colors">
                        <MessageCircle className="w-5 h-5 text-green-600 shrink-0" />
                        <div className="flex-1">
                            <p className="text-sm font-bold text-green-800">Contato por WhatsApp?</p>
                            <p className="text-xs text-green-600">Para a equipe pastoral falar com você.</p>
                        </div>
                        <input
                            type="checkbox"
                            checked={contact === 'whatsapp'}
                            onChange={(e) => setContact(e.target.checked ? 'whatsapp' : 'none')}
                            className="w-5 h-5 accent-green-600 rounded"
                        />
                    </div>

                    <button
                        type="submit"
                        disabled={submitting || description.length < 10}
                        className="w-full bg-rose-600 disabled:bg-slate-300 text-white py-4 rounded-xl font-bold text-lg shadow-lg shadow-rose-200 hover:shadow-xl hover:shadow-rose-100 active:scale-[0.98] transition-all flex items-center justify-center gap-2"
                    >
                        {submitting ? <Loader2 className="animate-spin" /> : <Send className="w-5 h-5" />}
                        Enviar Pedido
                    </button>

                    <p className="text-center text-xs text-slate-400 px-4">
                        Seus pedidos são recebidos pela equipe pastoral com total sigilo e carinho.
                    </p>
                </form>
            )}

            {activeTab === 'list' && (
                <div className="space-y-3 animate-fade-in-up">
                    {loading ? (
                        <div className="flex justify-center py-8"><Loader2 className="animate-spin text-slate-400" /></div>
                    ) : requests.length === 0 ? (
                        <div className="text-center py-8 text-slate-400">
                            <p>Você ainda não fez nenhum pedido.</p>
                        </div>
                    ) : (
                        requests.map(req => (
                            <div key={req.id} className="bg-white p-4 rounded-xl border border-slate-100 shadow-sm">
                                <div className="flex justify-between items-start mb-2">
                                    <span className="text-xs font-bold uppercase tracking-wider text-slate-400">
                                        {new Date(req.created_at).toLocaleDateString('pt-BR')}
                                    </span>
                                    <span className={`px-2 py-1 rounded-full text-[10px] font-bold uppercase ${req.status === 'pending' || req.status === 'new' ? 'bg-orange-100 text-orange-600' : 'bg-green-100 text-green-600'
                                        }`}>
                                        {req.status === 'new' ? 'Enviado' : req.status}
                                    </span>
                                </div>
                                <h3 className="font-bold text-slate-800 capitalize mb-1">{req.request_type || req.type}</h3>
                                <p className="text-slate-600 text-sm line-clamp-2">{req.description}</p>
                            </div>
                        ))
                    )}
                </div>
            )}
        </div>
    );
}

// Add CSS utility for animation if not present globally
// .animate-fade-in-up { animation: fadeInUp 0.3s ease-out; }
// @keyframes fadeInUp { from { opacity: 0; transform: translateY(10px); } to { opacity: 1; transform: translateY(0); } }

import React, { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import { useAuth } from '@/contexts/AuthContext';
import { Heart, Send, Loader2, MessageCircle } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

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
    const [submitting, setSubmitting] = useState(false);

    useEffect(() => {
        if (activeTab === 'list' && user) {
            fetchRequests();
        }
    }, [activeTab, user]);

    const fetchRequests = async () => {
        setLoading(true);
        const { data, error } = await supabase.functions.invoke('pastoral-requests-my');
        if (!error && data) {
            setRequests(data);
        }
        setLoading(false);
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!description.trim()) return;

        setSubmitting(true);
        const { error } = await supabase.functions.invoke('pastoral-request-create', {
            body: {
                request_type: type,
                description,
                preferred_contact: contact
            }
        });

        setSubmitting(false);

        if (!error) {
            setDescription('');
            setActiveTab('list');
            // Show success toast?
        } else {
            alert('Erro ao enviar pedido. Tente novamente.');
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
                <form onSubmit={handleSubmit} className="space-y-4 animate-fade-in-up">
                    <div className="space-y-2">
                        <label className="text-sm font-bold text-slate-700">O que você precisa?</label>
                        <div className="grid grid-cols-3 gap-2">
                            {['oração', 'visita', 'conselho'].map(t => (
                                <button
                                    key={t}
                                    type="button"
                                    onClick={() => setType(t)}
                                    className={`py-3 text-sm font-bold rounded-xl border ${type === t ? 'bg-rose-50 border-rose-200 text-rose-700' : 'bg-white border-slate-200 text-slate-500'}`}
                                >
                                    {t.charAt(0).toUpperCase() + t.slice(1)}
                                </button>
                            ))}
                        </div>
                    </div>

                    <div className="space-y-2">
                        <label className="text-sm font-bold text-slate-700">Como podemos orar por você?</label>
                        <textarea
                            value={description}
                            onChange={e => setDescription(e.target.value)}
                            placeholder="Descreva seu pedido aqui..."
                            className="w-full h-32 p-4 rounded-xl border border-slate-200 bg-slate-50 focus:bg-white resize-none"
                        />
                    </div>

                    <div className="flex items-center gap-3 p-4 bg-green-50 rounded-xl border border-green-100">
                        <MessageCircle className="w-5 h-5 text-green-600" />
                        <div className="flex-1">
                            <p className="text-sm font-bold text-green-800">Contato por WhatsApp?</p>
                            <p className="text-xs text-green-600">Para a equipe pastoral falar com você.</p>
                        </div>
                        <input
                            type="checkbox"
                            checked={contact === 'whatsapp'}
                            onChange={(e) => setContact(e.target.checked ? 'whatsapp' : 'none')}
                            className="w-5 h-5 accent-green-600"
                        />
                    </div>

                    <button
                        type="submit"
                        disabled={submitting}
                        className="w-full bg-rose-600 text-white py-4 rounded-xl font-bold text-lg shadow-lg shadow-rose-200 active:scale-95 transition-transform flex items-center justify-center gap-2"
                    >
                        {submitting ? <Loader2 className="animate-spin" /> : <Send className="w-5 h-5" />}
                        Enviar Pedido
                    </button>
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

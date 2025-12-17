import React, { useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { Heart, Send, Loader2, Lock, Globe, ShieldCheck } from 'lucide-react';

import { FLAGS } from '@/lib/flags';
import { analytics } from '@/lib/analytics';
import { prayerApi } from '@/lib/api/prayer';

export default function PrayerHub() {
    useAuth();
    const [activeTab, setActiveTab] = useState<'new' | 'list'>('new');

    // Form State
    const [description, setDescription] = useState('');
    const [type, setType] = useState('oração');
    const [contact] = useState<'whatsapp' | 'none'>('whatsapp');
    const [isAnonymous, setIsAnonymous] = useState(false);
    const [visibility, setVisibility] = useState<'public' | 'private'>('public');
    const [submitting, setSubmitting] = useState(false);

    if (!FLAGS.FEATURE_PRAYER_REQUESTS_V1) return null;

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!description.trim() || description.length < 10) {
            alert('Por favor, descreva seu pedido com pelo menos 10 caracteres.');
            return;
        }

        setSubmitting(true);

        analytics.track({
            name: 'cta_click',
            element: 'submit_prayer_request',
            context: 'member',
            metadata: { type, visibility, anonymous: isAnonymous }
        });

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
            // Validate mock offline
            await new Promise(r => setTimeout(r, 1000));
        }

        setSubmitting(false);

        if (!error) {
            setDescription('');
            alert('Pedido enviado com sucesso! Estaremos orando por você.');
            // Do not switch tab automatically if tab is placeholder
            // setActiveTab('list'); 
        } else {
            console.error("Submission error", error);
            alert('Erro ao enviar. Verifique sua conexão.');
        }
    };

    return (
        <div className="min-h-screen bg-transparent flex flex-col pb-safe">
            {/* Header */}
            <div className="bg-white border-b border-slate-200 px-6 py-4 flex items-center justify-between sticky top-0 z-10">
                <h1 className="text-xl font-serif font-bold text-slate-900 flex items-center gap-2">
                    <Heart className="w-6 h-6 text-rose-500 fill-rose-500" />
                    Pedidos de Oração
                </h1>
            </div>

            {/* Tabs */}
            <div className="flex p-2 bg-white mb-2">
                <button
                    onClick={() => setActiveTab('new')}
                    className={`flex-1 py-2 text-sm font-medium rounded-lg transition-colors ${activeTab === 'new' ? 'bg-indigo-50 text-indigo-700' : 'text-slate-500'}`}
                >
                    Novo Pedido
                </button>
                <button
                    onClick={() => setActiveTab('list')}
                    className={`flex-1 py-2 text-sm font-medium rounded-lg transition-colors ${activeTab === 'list' ? 'bg-indigo-50 text-indigo-700' : 'text-slate-500'}`}
                >
                    Meus Pedidos
                </button>
            </div>

            {/* Content */}
            <div className="flex-1 p-4 max-w-lg mx-auto w-full">
                {activeTab === 'new' ? (
                    <form onSubmit={handleSubmit} className="space-y-6 bg-white p-6 rounded-2xl shadow-sm border border-slate-100">

                        {/* Type Selection */}
                        <div className="flex gap-2 p-1 bg-slate-50 rounded-xl">
                            {['oração', 'visita', 'conselho'].map(t => (
                                <button
                                    key={t}
                                    type="button"
                                    onClick={() => setType(t)}
                                    className={`flex-1 py-2 text-xs font-medium capitalize rounded-lg transition-all ${type === t ? 'bg-white shadow-sm text-indigo-600' : 'text-slate-400'}`}
                                >
                                    {t}
                                </button>
                            ))}
                        </div>

                        {/* Text Area */}
                        <div>
                            <label className="block text-sm font-medium text-slate-700 mb-2">Como podemos orar?</label>
                            <textarea
                                value={description}
                                onChange={e => setDescription(e.target.value)}
                                className="w-full p-4 rounded-xl border border-slate-200 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 min-h-[120px] text-slate-700 placeholder:text-slate-400 resize-none text-base"
                                placeholder="Descreva seu pedido aqui..."
                                maxLength={500}
                            />
                            <div className="flex justify-end mt-1">
                                <span className={`text-xs ${description.length > 450 ? 'text-amber-500' : 'text-slate-400'}`}>
                                    {description.length}/500
                                </span>
                            </div>
                        </div>

                        {/* Toggles */}
                        <div className="space-y-3 pt-2">
                            <div className="flex items-center justify-between p-3 bg-slate-50 rounded-xl">
                                <div className="flex items-center gap-3">
                                    <div className={`p-2 rounded-full ${isAnonymous ? 'bg-indigo-100 text-indigo-600' : 'bg-slate-200 text-slate-400'}`}>
                                        <ShieldCheck className="w-4 h-4" />
                                    </div>
                                    <div className="text-sm">
                                        <p className="font-medium text-slate-700">Pedido Anônimo</p>
                                        <p className="text-xs text-slate-400">Não identificar meu nome</p>
                                    </div>
                                </div>
                                <label className="relative inline-flex items-center cursor-pointer">
                                    <input type="checkbox" checked={isAnonymous} onChange={e => setIsAnonymous(e.target.checked)} className="sr-only peer" />
                                    <div className="w-11 h-6 bg-slate-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-indigo-600"></div>
                                </label>
                            </div>

                            <div className="flex items-center justify-between p-3 bg-slate-50 rounded-xl">
                                <div className="flex items-center gap-3">
                                    <div className={`p-2 rounded-full ${visibility === 'private' ? 'bg-rose-100 text-rose-600' : 'bg-emerald-100 text-emerald-600'}`}>
                                        {visibility === 'private' ? <Lock className="w-4 h-4" /> : <Globe className="w-4 h-4" />}
                                    </div>
                                    <div className="text-sm">
                                        <p className="font-medium text-slate-700">Apenas Intercessores</p>
                                        <p className="text-xs text-slate-400">Não exibir no mural público</p>
                                    </div>
                                </div>
                                <label className="relative inline-flex items-center cursor-pointer">
                                    <input
                                        type="checkbox"
                                        checked={visibility === 'private'}
                                        onChange={e => setVisibility(e.target.checked ? 'private' : 'public')}
                                        className="sr-only peer"
                                    />
                                    <div className="w-11 h-6 bg-slate-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-rose-500"></div>
                                </label>
                            </div>
                        </div>

                        <button
                            type="submit"
                            disabled={submitting || !description.trim()}
                            className="w-full bg-indigo-600 hover:bg-indigo-700 disabled:bg-slate-300 disabled:text-slate-500 text-white font-bold py-4 rounded-xl shadow-lg shadow-indigo-200 active:scale-[0.98] transition-all flex items-center justify-center gap-2"
                        >
                            {submitting ? <Loader2 className="animate-spin w-5 h-5" /> : <Send className="w-5 h-5" />}
                            {submitting ? 'Enviando...' : 'Enviar Pedido'}
                        </button>
                    </form>
                ) : (
                    // OPTION A: Premium Placeholder for "My Requests"
                    <div className="flex flex-col items-center justify-center py-12 text-center">
                        <div className="w-20 h-20 bg-indigo-50 rounded-full flex items-center justify-center mb-6">
                            <Lock className="w-8 h-8 text-indigo-400" />
                        </div>
                        <h3 className="text-lg font-medium text-slate-900 mb-2">Área de Membros</h3>
                        <p className="text-slate-500 text-sm leading-relaxed max-w-[260px] mb-8">
                            O histórico de pedidos estará disponível em breve para membros cadastrados. Continue orando conosco!
                        </p>
                        <button
                            onClick={() => setActiveTab('new')}
                            className="text-indigo-600 font-medium text-sm border border-indigo-100 bg-indigo-50 px-6 py-2 rounded-full hover:bg-indigo-100 transition-colors"
                        >
                            Fazer novo pedido
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
}

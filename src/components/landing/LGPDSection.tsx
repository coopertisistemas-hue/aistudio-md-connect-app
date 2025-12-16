import React from 'react';
import { ShieldCheck, Lock } from 'lucide-react';
import { Link } from 'react-router-dom';

export const LGPDSection: React.FC = () => {
    return (
        <section className="py-16 bg-slate-50 border-t border-slate-200">
            <div className="container mx-auto px-4 text-center max-w-4xl">

                <div className="flex justify-center mb-4">
                    <ShieldCheck className="w-10 h-10 text-slate-400" />
                </div>

                <h3 className="text-xl font-bold text-slate-800 mb-4">Privacidade e Proteção de Dados (LGPD)</h3>

                <p className="text-slate-500 text-sm mb-6 leading-relaxed">
                    Tratamos dados pessoais com responsabilidade, seguindo os princípios da Lei Geral de Proteção de Dados (LGPD),
                    com foco em finalidade, transparência e segurança. Você tem controle sobre suas informações e visibilidade.
                    Em caso de incidente relevante, seguimos o processo de comunicação previsto e as orientações da ANPD.
                </p>

                <div className="flex flex-wrap justify-center gap-4 text-sm font-medium">
                    <Link to="/privacidade" className="text-blue-600 hover:underline flex items-center gap-1">
                        <Lock className="w-3 h-3" /> Política de Privacidade
                    </Link>
                    <span className="text-slate-300">|</span>
                    <a href="#" className="text-slate-500 hover:text-slate-700">Termos de Uso</a>
                    <span className="text-slate-300">|</span>
                    <a href="#" className="text-slate-500 hover:text-slate-700">Canal de Transparência</a>
                </div>

            </div>
        </section>
    );
};

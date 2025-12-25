import { AlertTriangle } from 'lucide-react';
import { InternalPageLayout } from '@/components/layout/InternalPageLayout';

export default function ChurchNotFound() {
    return (
        <InternalPageLayout
            title="Igreja não encontrada"
            subtitle="Verifique o link ou selecione outra igreja."
            icon={AlertTriangle}
            iconClassName="text-red-600"
            backPath="/landing"
        >
            <div className="flex flex-col items-center justify-center p-6 text-center">
                <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 max-w-xs w-full">
                    <div className="bg-red-50 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                        <AlertTriangle className="w-8 h-8 text-red-400" />
                    </div>
                    <h2 className="font-heading font-bold text-xl text-slate-800 mb-2">Igreja não encontrada</h2>
                    <p className="text-sm text-slate-500 mb-6">
                        O endereço que você acessou não corresponde a nenhuma igreja ativa no sistema.
                    </p>
                    <div className="text-xs text-slate-400">
                        Verifique o link e tente novamente.
                    </div>
                </div>
            </div>
        </InternalPageLayout>
    );
}

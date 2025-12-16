import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Construction } from 'lucide-react';
import { Button } from '@/components/ui/button';

export default function ComingSoon() {
    const navigate = useNavigate();

    return (
        <div className="min-h-screen flex flex-col items-center justify-center p-6 bg-slate-50 text-center animate-in fade-in duration-500">
            <div className="w-20 h-20 bg-blue-100 rounded-full flex items-center justify-center mb-6">
                <Construction className="w-10 h-10 text-blue-600" />
            </div>

            <h1 className="text-2xl font-bold text-slate-900 mb-2">Em Breve</h1>
            <p className="text-slate-600 max-w-xs mx-auto mb-8">
                Estamos preparando novidades incríveis para você. Esta funcionalidade estará disponível na próxima atualização.
            </p>

            <Button
                onClick={() => navigate(-1)}
                variant="outline"
                className="gap-2"
            >
                <ArrowLeft className="w-4 h-4" />
                Voltar
            </Button>
        </div>
    );
}

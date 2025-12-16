import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { ChevronLeft, MessageCircle } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';

interface ComingSoonPageProps {
    title?: string;
    description?: string;
    icon?: React.ElementType;
}

const ComingSoonPage: React.FC<ComingSoonPageProps> = ({
    title = "Em Breve",
    description = "Estamos preparando algo especial para você.",
    icon: Icon
}) => {
    const navigate = useNavigate();

    return (
        <div className="flex flex-col items-center justify-center min-h-[60vh] p-4 text-center animate-in fade-in zoom-in duration-500">
            <div className="bg-blue-50 p-6 rounded-full mb-6">
                {Icon ? (
                    <Icon className="w-12 h-12 text-primary" />
                ) : (
                    <div className="w-12 h-12 text-primary text-4xl font-bold">?</div>
                )}
            </div>

            <h1 className="text-2xl md:text-3xl font-bold text-slate-900 mb-2">
                {title}
            </h1>

            <p className="text-muted-foreground max-w-md mb-8 text-lg">
                {description}
            </p>

            <div className="flex flex-col sm:flex-row gap-3 w-full max-w-xs">
                <Button
                    variant="outline"
                    size="lg"
                    onClick={() => navigate(-1)}
                    className="w-full"
                >
                    <ChevronLeft className="mr-2 h-4 w-4" />
                    Voltar
                </Button>
                <Button
                    size="lg"
                    className="w-full"
                    onClick={() => window.open('https://wa.me/5500000000000', '_blank')}
                >
                    <MessageCircle className="mr-2 h-4 w-4" />
                    Falar com a equipe
                </Button>
            </div>

            <Card className="mt-12 w-full max-w-md bg-slate-50 border-slate-100">
                <CardContent className="p-4 text-sm text-slate-500">
                    Estamos trabalhando duro para trazer esta novidade para você.
                    Em breve, você terá acesso completo a este recurso.
                </CardContent>
            </Card>
        </div>
    );
};

export default ComingSoonPage;

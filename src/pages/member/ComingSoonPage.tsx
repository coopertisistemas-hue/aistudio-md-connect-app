import React from 'react';
import { Button } from '@/components/ui/button';
import { MessageCircle, LucideIcon } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { PageIntro } from '@/components/layout/PageIntro';

interface ComingSoonPageProps {
    title?: string;
    description?: string;
    icon?: LucideIcon;
}

const ComingSoonPage: React.FC<ComingSoonPageProps> = ({
    title = "Em Breve",
    description = "Estamos preparando algo especial para você.",
    icon: Icon
}) => {

    return (
        <div className="min-h-screen flex flex-col bg-slate-50/50">
            <div className="px-5 pt-8">
                <PageIntro
                    title={title}
                    subtitle={description}
                    icon={Icon}
                    iconClassName="text-indigo-600"
                />
            </div>

            <div className="flex-1 flex flex-col items-center px-5 pt-8 animate-in fade-in duration-500">
                <div className="w-full max-w-sm space-y-6">
                    <Button
                        size="lg"
                        className="w-full h-12 rounded-xl font-bold shadow-sm"
                        onClick={() => window.open('https://wa.me/5500000000000', '_blank')}
                    >
                        <MessageCircle className="mr-2 h-5 w-5" />
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
        </div>
    );
};

export default ComingSoonPage;

import React from 'react';
import { Button } from '@/components/ui/button';
import { MessageCircle, type LucideIcon, Construction } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { InternalPageLayout } from '@/components/layout/InternalPageLayout';

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
        <InternalPageLayout
            title={title}
            subtitle={description}
            icon={Icon || Construction}
            iconClassName="text-indigo-600"
            backPath="/home"
        >
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
        </InternalPageLayout>
    );
};

export default ComingSoonPage;

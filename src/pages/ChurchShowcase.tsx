import { useNavigate } from 'react-router-dom';
import { Church, Rocket, MessageCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { InternalPageLayout } from '@/components/layout/InternalPageLayout';
import { APP_ROUTES, EXTERNAL_LINKS } from '@/lib/routes';
import { SEOHead } from '@/components/SEO/SEOHead';

export default function ChurchShowcase() {
    const navigate = useNavigate();

    return (
        <>
            <SEOHead
                title="Sou Igreja - MD Connect"
                description="Implante o MD Connect na sua igreja"
                keywords="igreja, gestao, app, sistema"
            />

            <InternalPageLayout
                title="Sou Igreja"
                subtitle="Tecnologia a servico do Reino"
                icon={Church}
                iconClassName="text-indigo-600"
                backPath="/home"
            >
                <div className="px-4 space-y-8 pb-8">

                    {/* Hero Section */}
                    <div className="bg-gradient-to-br from-indigo-50 via-white to-blue-50 rounded-3xl p-8 border border-indigo-100/50 shadow-sm">
                        <h1 className="text-3xl md:text-4xl font-bold text-slate-900 mb-3">
                            Fortaleca sua Igreja
                        </h1>

                        <p className="text-slate-600 leading-relaxed mb-6">
                            Implante o MD Connect e fortaleca o cuidado com a igreja.
                        </p>

                        <div className="flex flex-col sm:flex-row gap-3">
                            <Button
                                onClick={() => navigate(APP_ROUTES.CHURCH_IMPLEMENTATION)}
                                className="flex-1 bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-6"
                            >
                                <Rocket className="w-4 h-4 mr-2" />
                                Quero implantar
                            </Button>
                            <Button
                                onClick={() => window.open(EXTERNAL_LINKS.SUPPORT_WHATSAPP, '_blank')}
                                variant="outline"
                                className="flex-1 border-indigo-200 text-indigo-700 hover:bg-indigo-50 font-bold py-6"
                            >
                                <MessageCircle className="w-4 h-4 mr-2" />
                                Falar com a equipe
                            </Button>
                        </div>
                    </div>

                </div>
            </InternalPageLayout>
        </>
    );
}

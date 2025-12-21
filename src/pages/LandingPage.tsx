import { useEffect, useState } from 'react';
import { homeService, type HomeData } from '@/lib/api/home';
// import { AppBackground } from '@/components/layout/AppBackground'; // Removed, global now
import { MuralCompact } from '@/components/home/MuralCompact';
import { VerseCard } from '@/components/home/VerseCard';
import { QuickActions } from '@/components/ui/QuickActions';
import { MonetizationBlock } from '@/components/home/MonetizationBlock';
import { Skeleton } from '@/components/ui/skeleton';
import { FLAGS } from '@/lib/flags';
import { ChurchPartnersBlock } from '@/components/home/ChurchPartnersBlock';
import { SEOHead } from '@/components/SEO/SEOHead';
import { generateOrganizationSchema, generateWebSiteSchema } from '@/lib/seo';

export default function LandingPage() {
    const [data, setData] = useState<HomeData | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        // Mark that user has visited home
        sessionStorage.setItem('has_visited_home', 'true');

        const load = async () => {
            // TODO: In production, Slug should be derived from subdomain or context.
            const slug = 'sede';

            try {
                setLoading(true);
                const res = await homeService.getHomeData(slug);

                // MOCK DATA FOR REVIEW (Force UI Rendering)
                if (!res.latest_notices || res.latest_notices.length === 0) {
                    res.latest_notices = [
                        { id: '1', title: 'Culto de Santa Ceia neste domingo às 19h', created_at: new Date().toISOString(), description: '' },
                        { id: '2', title: 'Reunião de Obreiros terça-feira', created_at: new Date().toISOString(), description: '' }
                    ];
                }

                if (!res.monetization || (!res.monetization.doe && res.monetization.partners.length === 0)) {
                    res.monetization = {
                        doe: { id: 'doe', external_link: '#' },
                        partners: [
                            { id: 'p1', title: 'Padaria Pão da Vida', image_url: null, external_link: '#' },
                            { id: 'p2', title: 'Livraria Gospel', image_url: null, external_link: '#' },
                            { id: 'p3', title: 'Cantina da Benção', image_url: null, external_link: '#' },
                        ],
                        affiliates: [],
                        transparency: { label: 'Portal da Transparência', link: '#' }
                    };
                }

                if (!res.daily_verse) {
                    res.daily_verse = {
                        text: "O Senhor é o meu pastor, nada me faltará.",
                        reference: "Salmos 23:1",
                        lang: "pt-BR"
                    };
                }

                setData(res);
            } catch (err) {
                console.error(err);
                setError('Erro ao carregar dados.');
            } finally {
                setLoading(false);
            }
        };
        load();
    }, []);

    if (loading) {
        return (
            <div className="min-h-screen bg-transparent pb-20 relative overflow-hidden isolate">
                {/* Global Background Layer handled by PublicLayout */}

                {/* 1. TopBar Skeleton */}
                <div className="h-13 w-full bg-white/5 backdrop-blur-md border-b border-white/5 flex items-center justify-between px-4 sticky top-0 z-20">
                    <div className="flex flex-col gap-1">
                        <Skeleton className="h-4 w-20 bg-white/10" />
                        <Skeleton className="h-2 w-32 bg-white/5" />
                    </div>
                    <Skeleton className="h-8 w-8 rounded-full bg-white/10" />
                </div>

                <div className="px-4 relative z-10">
                    {/* 2. VerseSticker Skeleton (Pill) */}
                    <div className="mt-3 mb-2">
                        <Skeleton className="h-[52px] w-full rounded-full bg-white/10" />
                    </div>

                    {/* 3. QuickActions Skeleton (Grid) */}
                    <div className="grid grid-cols-2 gap-3 mt-6">
                        <Skeleton className="h-[105px] rounded-2xl bg-white/5" />
                        <Skeleton className="h-[105px] rounded-2xl bg-white/5" />
                        <Skeleton className="h-[105px] rounded-2xl bg-white/5" />
                        <Skeleton className="h-[105px] rounded-2xl bg-white/5" />
                    </div>

                    {/* 4. Ticker Skeleton */}
                    <div className="mt-8 mb-6">
                        <Skeleton className="h-[56px] w-full rounded-2xl bg-white/5" />
                    </div>
                </div>
            </div>
        );
    }

    if (error || !data) {
        return (
            <div className="min-h-screen flex items-center justify-center p-6 text-center bg-slate-900 text-white">
                <p className="text-slate-400 font-medium">Não foi possível carregar a página inicial.</p>
            </div>
        );
    }

    return (
        <>
            <SEOHead schemaData={[generateOrganizationSchema(), generateWebSiteSchema()]} />
            <div className="relative min-h-[100dvh] text-slate-900 font-sans isolate">
                {/* Global Background Layer handled by PublicLayout */}

                {/* Content Layer */}
                <div className="relative z-10 pb-safe">
                    {/* 1. Spacer for Sticky Header (PublicLayout Header is 80px approx) */}
                    <div className="h-4" />

                    {/* 2. Mural & Novidades (Ticker) */}
                    {data.latest_notices && data.latest_notices.length > 0 && (
                        <MuralCompact notices={data.latest_notices} />
                    )}

                    {/* 3. Quick Actions (Glass Grid) */}
                    {FLAGS.FEATURE_HOME_QUICK_ACTIONS && (
                        <QuickActions actions={data.quick_actions} />
                    )}

                    {/* 3.1 Church & Partners Premium Section (NEW) */}
                    {FLAGS.FEATURE_HOME_PARTNERS_SECTION && (
                        <ChurchPartnersBlock />
                    )}

                    {/* 4. Monetization (Glass & Discrete) */}
                    {FLAGS.FEATURE_HOME_DONATE_SECTION && (
                        <MonetizationBlock monetization={data.monetization} churchId={data.church?.id} />
                    )}

                    {/* 5. Verse Card (Simple Card at Bottom) */}
                    <VerseCard verse={data.daily_verse} />
                </div>
            </div>
        </>
    );
}

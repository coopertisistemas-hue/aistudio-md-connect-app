import { useLocation } from 'react-router-dom';
import { DonateBlock } from '@/components/monetization/DonateBlock';
import { SponsorOfTheDay } from '@/components/monetization/SponsorOfTheDay';
import { FLAGS } from '@/lib/flags';

export function SupportFooter() {
    const location = useLocation();

    // Check Feature Flag
    if (!FLAGS.FEATURE_SUPPORT_FOOTER) return null;

    // Exclude on specific routes
    const excludedRoutes = [
        '/doe',
        '/seja-parceiro',
        '/partners',
        '/services'
    ];
    if (excludedRoutes.some(route => location.pathname.startsWith(route))) {
        return null;
    }

    return (
        <div className="w-full bg-transparent border-t border-slate-100/50">
            <div className="max-w-2xl mx-auto px-4 py-6">
                <div className="flex flex-col gap-6">
                    {/* Order: Sponsor First, then Donate */}
                    <SponsorOfTheDay />
                    <DonateBlock />
                </div>
            </div>
        </div>
    );
}

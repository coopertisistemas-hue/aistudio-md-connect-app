import type { ReactNode } from 'react';
import { type LucideIcon } from 'lucide-react';
import { PageIntro } from '@/components/layout/PageIntro';
import { AppFooter } from '@/components/layout/AppFooter';
import { SponsorOfTheDay } from '@/components/monetization/SponsorOfTheDay';
import { DonateBlock } from '@/components/monetization/DonateBlock';

interface InternalPageLayoutProps {
    title: string;
    subtitle?: string;
    icon?: LucideIcon;
    iconClassName?: string;
    children: ReactNode;
    // Options
    showSponsor?: boolean; // Controls SponsorOfTheDay visibility
    showDoe?: boolean;     // Controls DonateBlock visibility
    showFooter?: boolean;  // Controls AppFooter visibility

    backPath?: string;
    actions?: ReactNode;
    className?: string;
}

export function InternalPageLayout({
    title,
    subtitle,
    icon,
    iconClassName,
    children,
    showSponsor = true,
    showDoe = true,
    showFooter = true,
    backPath,
    actions,
    className
}: InternalPageLayoutProps) {
    return (
        <div className={`flex-1 flex flex-col ${className || ''}`}>
            {/* Header Interno Reutilizado */}
            <div className="px-5 pt-8">
                <PageIntro
                    title={title}
                    subtitle={subtitle}
                    icon={icon}
                    iconClassName={iconClassName}
                    backLinkPath={backPath}
                    actions={actions}
                />
            </div>

            {/* Conteúdo da Página */}
            <div className="flex-1">
                {children}
            </div>

            {/* Footers Padronizados */}
            <div className="mt-auto">
                {/* Monetization / Support Section */}
                {(showSponsor || showDoe) && (
                    <div className="w-full bg-transparent border-t border-slate-100/50">
                        <div className="max-w-2xl mx-auto px-4 py-6">
                            <div className="flex flex-col gap-6">
                                {showSponsor && <SponsorOfTheDay />}
                                {showDoe && <DonateBlock />}
                            </div>
                        </div>
                    </div>
                )}

                {/* Global App Footer */}
                {showFooter && <AppFooter />}
            </div>
        </div>
    );
}

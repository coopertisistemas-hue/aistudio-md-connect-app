import React, { ReactNode } from 'react';
import { type LucideIcon } from 'lucide-react';
import { PageIntro } from '@/components/layout/PageIntro';
import { AppFooter } from '@/components/layout/AppFooter';
import { SupportFooter } from '@/components/monetization/SupportFooter';

interface InternalPageLayoutProps {
    title: string;
    subtitle?: string;
    icon?: LucideIcon;
    iconClassName?: string;
    children: ReactNode;
    // Options
    showSponsor?: boolean; // Controls SupportFooter visibility
    showDoe?: boolean;     // Passed to SupportFooter if it supported granular control, but SupportFooter is a block. 
                           // For now, showSponsor controls the entire SupportFooter block presence.
                           // If granular control inside SupportFooter is needed, we'd need props there too.
                           // Based on current SupportFooter, it just renders.
    
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
                {showSponsor && <SupportFooter />}
                <AppFooter />
            </div>
        </div>
    );
}

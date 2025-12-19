
import type { ReactNode } from 'react';
import { type LucideIcon } from 'lucide-react';
import { BackLink } from '@/components/ui/BackLink';
import { cn } from '@/lib/utils';

interface PageIntroProps {
    title: string;
    subtitle?: string;
    icon?: LucideIcon;
    iconClassName?: string;
    actions?: ReactNode;
    backLink?: boolean;
    backLinkPath?: string;
    className?: string; // Container override
    titleClassName?: string;
}

export function PageIntro({
    title,
    subtitle,
    icon: Icon,
    iconClassName,
    actions,
    backLink = true,
    backLinkPath,
    className,
    titleClassName
}: PageIntroProps) {
    return (
        <div className={cn("flex flex-col mb-6 animate-in fade-in slide-in-from-bottom-2 duration-500", className)}>
            {backLink && (
                <div className="mb-4">
                    <BackLink to={backLinkPath} />
                </div>
            )}

            <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4">
                <div className="flex-1 space-y-1">
                    <h1 className={cn("text-2xl font-bold text-slate-900 tracking-tight flex items-center gap-2.5", titleClassName)}>
                        {Icon && (
                            <Icon
                                className={cn("w-7 h-7", iconClassName || "text-slate-900")}
                                strokeWidth={2}
                            />
                        )}
                        {title}
                    </h1>

                    {subtitle && (
                        <p className="text-slate-500 text-sm font-medium leading-relaxed max-w-lg">
                            {subtitle}
                        </p>
                    )}
                </div>

                {actions && (
                    <div className="flex-shrink-0 pt-0.5 w-full md:w-auto mt-2 md:mt-0">
                        {actions}
                    </div>
                )}
            </div>
        </div>
    );
}

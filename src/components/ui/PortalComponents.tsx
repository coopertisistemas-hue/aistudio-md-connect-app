import type { ReactNode } from 'react';
import { cn } from '@/lib/utils';
import { ChevronRight } from 'lucide-react';

interface PortalSectionProps {
    title: string;
    icon?: React.ElementType;
    children: ReactNode;
    actionLabel?: string;
    onAction?: () => void;
    className?: string;
}

export function PortalSection({ title, icon: Icon, children, actionLabel, onAction, className }: PortalSectionProps) {
    return (
        <section className={cn("mb-6", className)}>
            <div className="flex items-center justify-between mb-3 px-1">
                <h2 className="font-heading font-bold text-lg flex items-center text-slate-800">
                    {Icon && <Icon className="h-5 w-5 mr-2 text-primary" />}
                    {title}
                </h2>
                {actionLabel && (
                    <button onClick={onAction} className="text-sm text-primary font-medium flex items-center">
                        {actionLabel} <ChevronRight className="h-4 w-4 ml-0.5" />
                    </button>
                )}
            </div>
            {children}
        </section>
    );
}

export function PortalCard({ children, className, onClick }: { children: ReactNode, className?: string, onClick?: () => void }) {
    return (
        <div
            onClick={onClick}
            className={cn(
                "bg-white rounded-xl border border-slate-100 shadow-sm p-4",
                onClick && "active:bg-slate-50 transition-colors",
                className
            )}
        >
            {children}
        </div>
    );
}

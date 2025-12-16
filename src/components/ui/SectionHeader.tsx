import { ChevronRight, type LucideIcon } from 'lucide-react';

interface SectionHeaderProps {
    title: string;
    subtitle?: string;
    icon?: LucideIcon;
    iconColor?: string; // class name like 'text-amber-500'
    actionLabel?: string;
    onAction?: () => void;
    className?: string;
}

export function SectionHeader({
    title,
    subtitle,
    icon: Icon,
    iconColor = 'text-slate-900',
    actionLabel,
    onAction,
    className = ''
}: SectionHeaderProps) {
    return (
        <div className={`flex items-end justify-between px-1 mb-3 ${className}`}>
            <div className="flex flex-col gap-0.5">
                <h2 className="text-sm font-semibold text-slate-900 tracking-tight flex items-center gap-2">
                    {Icon && <Icon className={`w-4 h-4 ${iconColor}`} />}
                    {title}
                </h2>
                {subtitle && (
                    <p className="text-[10px] text-slate-500 font-medium pl-6 leading-none">
                        {subtitle}
                    </p>
                )}
            </div>

            {actionLabel && (
                <button
                    onClick={onAction}
                    className="text-[10px] text-slate-700 font-bold uppercase tracking-wide flex items-center gap-1 hover:text-slate-900 transition-colors pb-0.5"
                >
                    {actionLabel} <ChevronRight className="w-3 h-3" />
                </button>
            )}
        </div>
    );
}

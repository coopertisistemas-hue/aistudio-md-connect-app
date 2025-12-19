import { ChevronRight } from 'lucide-react';
import { cn } from '@/lib/utils';

export interface CategoryItem {
    id: string;
    label: string;
    icon?: React.ElementType; // Optional icon
    onClick: () => void;
    badge?: string;
    disabled?: boolean;
}

interface CategorySectionProps {
    title: string;
    items: CategoryItem[];
}

export function CategorySection({ title, items }: CategorySectionProps) {
    if (!items || items.length === 0) return null;

    return (
        <div className="mb-8 px-5">
            <h2 className="text-sm font-bold text-slate-400 uppercase tracking-wider mb-3 pl-1">
                {title}
            </h2>
            <div className="bg-white/60 backdrop-blur-lg rounded-2xl border border-white/60 overflow-hidden shadow-sm">
                {items.map((item, index) => (
                    <div key={item.id}>
                        <button
                            onClick={item.onClick}
                            disabled={item.disabled}
                            className={cn(
                                "w-full flex items-center justify-between p-4 text-left transition-colors hover:bg-white/50 active:bg-slate-50",
                                item.disabled && "opacity-50 cursor-not-allowed"
                            )}
                        >
                            <div className="flex items-center gap-3">
                                {item.icon && (
                                    <div className="w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center text-slate-600">
                                        <item.icon className="w-4 h-4" />
                                    </div>
                                )}
                                <span className={cn("font-semibold text-slate-700", !item.icon && "text-sm")}>{item.label}</span>
                            </div>

                            <div className="flex items-center gap-2">
                                {item.badge && (
                                    <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-indigo-50 text-indigo-600 border border-indigo-100 uppercase tracking-wide">
                                        {item.badge}
                                    </span>
                                )}
                                <ChevronRight className="w-4 h-4 text-slate-400" />
                            </div>
                        </button>
                        {/* Divider if not last */}
                        {index < items.length - 1 && (
                            <div className="h-px bg-slate-100 mx-4" />
                        )}
                    </div>
                ))}
            </div>
        </div>
    );
}

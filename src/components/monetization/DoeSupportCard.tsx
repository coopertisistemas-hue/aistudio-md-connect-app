import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Heart, HandHeart } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { DOE_SUPPORT_CONTENT } from '@/content/doeSupportContent';
import { cn } from '@/lib/utils';

interface DoeSupportCardProps {
    className?: string;
}

export const DoeSupportCard: React.FC<DoeSupportCardProps> = ({ className }) => {
    const navigate = useNavigate();
    const content = DOE_SUPPORT_CONTENT;

    return (
        <div className={cn("p-6 bg-white/80 backdrop-blur-xl rounded-3xl border border-white/60 shadow-xl shadow-indigo-900/5 relative overflow-hidden", className)}>
            {/* Accent blur */}
            <div className="absolute top-0 right-0 w-32 h-32 bg-rose-500/5 rounded-full blur-3xl -mr-16 -mt-16" />

            <div className="flex flex-col gap-6 relative z-10">
                <div className="space-y-2">
                    <div className="flex items-center gap-2 text-rose-600">
                        <Heart className="w-5 h-5 fill-rose-50" />
                        <h3 className="font-serif font-bold text-slate-900 text-xl tracking-tight">
                            {content.title} <span className="text-slate-400 font-sans text-xs font-medium">{content.optionalLabel}</span>
                        </h3>
                    </div>
                    <p className="text-slate-600 text-sm leading-relaxed font-medium">
                        {content.description}
                    </p>
                </div>

                <ul className="space-y-3">
                    {content.benefits.map((benefit, i) => (
                        <li key={i} className="flex items-start gap-3">
                            <div className={cn("p-1 rounded-lg shrink-0 mt-0.5", benefit.bg)}>
                                <benefit.icon className={cn("w-3.5 h-3.5", benefit.color)} />
                            </div>
                            <span className="text-xs font-bold text-slate-700">
                                {benefit.text} <span className="text-slate-400 font-normal text-[10px]">{benefit.subtext}</span>
                            </span>
                        </li>
                    ))}
                </ul>

                <div className="bg-indigo-50/50 p-3 rounded-2xl border border-indigo-100/50 flex items-center gap-3">
                    <div className="p-2 bg-white rounded-xl shadow-sm">
                        <content.partnerSection.icon className="w-4 h-4 text-amber-500" />
                    </div>
                    <p className="text-[11px] text-slate-600 leading-snug">
                        {content.partnerSection.text} <strong className="text-slate-800">{content.partnerSection.highlightedText}</strong> {content.partnerSection.subtext} <strong className="text-slate-800">{content.partnerSection.devotionalHighlight}</strong>.
                    </p>
                </div>

                <div className="flex flex-col gap-2">
                    <Button
                        className="w-full bg-rose-600 hover:bg-rose-700 text-white h-12 rounded-xl font-bold text-sm shadow-lg shadow-rose-200"
                        onClick={() => navigate(content.ctas.monthly.path)}
                    >
                        {content.ctas.monthly.label}
                    </Button>
                    <div className="grid grid-cols-2 gap-2">
                        <Button
                            variant="secondary"
                            className="bg-slate-100 hover:bg-slate-200 text-slate-700 h-11 rounded-xl font-bold text-xs"
                            onClick={() => navigate(content.ctas.now.path)}
                        >
                            <Heart className="w-3 h-3 mr-2" />
                            {content.ctas.now.label}
                        </Button>
                        <Button
                            variant="outline"
                            className="border-indigo-200 text-indigo-700 hover:bg-indigo-50 h-11 rounded-xl font-bold text-xs"
                            onClick={() => navigate(content.ctas.partner.path)}
                        >
                            <HandHeart className="w-3 h-3 mr-2" />
                            {content.ctas.partner.label}
                        </Button>
                    </div>
                </div>
            </div>
        </div>
    );
};

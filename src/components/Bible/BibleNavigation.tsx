
import { ChevronLeft, ChevronRight, Menu } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface BibleNavigationProps {
    bookName: string;
    chapter: number;
    onPrev: () => void;
    onNext: () => void;
    onMenu?: () => void;
    disablePrev?: boolean;
    disableNext?: boolean;
}

export function BibleNavigation({
    bookName,
    chapter,
    onPrev,
    onNext,
    onMenu,
    disablePrev,
    disableNext
}: BibleNavigationProps) {
    return (
        <div className="sticky bottom-0 left-0 right-0 bg-white border-t border-slate-100 p-4 safe-area-bottom flex items-center justify-between z-30 shadow-[0_-4px_6px_-1px_rgba(0,0,0,0.05)]">
            <Button
                variant="ghost"
                size="icon"
                onClick={onPrev}
                disabled={disablePrev}
                className="h-12 w-12 rounded-full hover:bg-slate-50"
            >
                <ChevronLeft className="h-6 w-6 text-slate-600" />
            </Button>

            <button
                onClick={onMenu}
                className="flex flex-col items-center justify-center -space-y-0.5"
            >
                <span className="text-xs font-bold text-slate-400 uppercase tracking-widest">Lendo</span>
                <span className="text-sm font-bold text-slate-800">{bookName} {chapter}</span>
            </button>

            <Button
                variant="ghost"
                size="icon"
                onClick={onNext}
                disabled={disableNext}
                className="h-12 w-12 rounded-full hover:bg-slate-50"
            >
                <ChevronRight className="h-6 w-6 text-slate-600" />
            </Button>
        </div>
    );
}

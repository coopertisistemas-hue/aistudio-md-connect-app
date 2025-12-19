
import { useState, useRef, useEffect } from 'react';
import { Copy, Share2, Heart, BookOpen, Headphones } from 'lucide-react';
import { cn } from '@/lib/utils';

interface VerseActionMenuProps {
    children: React.ReactNode;
    verseRef: string;
    text: string;
    onExplain: () => void;
    onListen: () => void;
    onLike: () => void;
    isLiked: boolean;
    likeCount?: number;
}

export function VerseActionMenu({ children, verseRef, text, onExplain, onListen, onLike, isLiked, likeCount }: VerseActionMenuProps) {
    const [isOpen, setIsOpen] = useState(false);
    const menuRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const handleClickOutside = (event: Event) => {
            if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
                setIsOpen(false);
            }
        };
        if (isOpen) {
            document.addEventListener('mousedown', handleClickOutside);
            document.addEventListener('touchstart', handleClickOutside);
        }
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
            document.removeEventListener('touchstart', handleClickOutside);
        };
    }, [isOpen]);

    const handleCopy = () => {
        navigator.clipboard.writeText(`${text} (${verseRef})`);
        setIsOpen(false);
        // Optional: Toast "Copied"
    };

    const handleShare = async () => {
        if (navigator.share) {
            try {
                await navigator.share({
                    title: 'Versículo Bíblico',
                    text: `"${text}" - ${verseRef}`,
                });
            } catch (err) {
                console.error('Share failed', err);
            }
        } else {
            handleCopy();
        }
        setIsOpen(false);
    };

    return (
        <span className="relative inline" ref={menuRef}>
            <span onClick={() => setIsOpen(!isOpen)} className="cursor-pointer select-none">
                {children}
            </span>

            {/* Backdrop for mobile focus */}
            {isOpen && (
                <div
                    className="fixed inset-0 bg-black/20 backdrop-blur-[1px] z-40"
                    onClick={() => setIsOpen(false)}
                />
            )}

            {isOpen && (
                <div className="fixed inset-x-4 bottom-6 md:absolute md:inset-auto md:bottom-full md:left-1/2 md:-translate-x-1/2 md:w-56 md:mb-2 z-50 bg-white/95 backdrop-blur-xl rounded-2xl md:rounded-xl shadow-2xl border border-white/20 md:border-slate-100 p-2 animate-in slide-in-from-bottom-10 fade-in duration-200 origin-bottom flex flex-col gap-1 safe-area-bottom">

                    {/* Header for Mobile */}
                    <div className="md:hidden flex items-center justify-between px-3 py-2 border-b border-slate-100/50 mb-1">
                        <span className="text-xs font-bold text-slate-400 uppercase tracking-widest">{verseRef}</span>
                        <div className="w-8 h-1 bg-slate-200 rounded-full mx-auto hidden"></div>
                    </div>

                    <div className="grid grid-cols-2 md:grid-cols-1 gap-1">
                        <button onClick={() => { onListen(); setIsOpen(false); }} className="flex items-center justify-center md:justify-start px-3 py-3 md:py-2.5 bg-slate-50 md:bg-transparent hover:bg-indigo-50 rounded-xl md:rounded-lg text-slate-700 text-sm font-medium transition-colors">
                            <Headphones className="mr-2 h-4 w-4 text-indigo-500" /> Ouvir
                        </button>

                        <button onClick={() => { onLike(); setIsOpen(false); }} className="flex items-center justify-center md:justify-start px-3 py-3 md:py-2.5 bg-slate-50 md:bg-transparent hover:bg-indigo-50 rounded-xl md:rounded-lg text-slate-700 text-sm font-medium transition-colors">
                            <Heart className={cn("mr-2 h-4 w-4", isLiked ? "fill-red-500 text-red-500" : "text-slate-400")} />
                            {isLiked ? 'Amém!' : 'Amém'}
                            {likeCount !== undefined && likeCount > 0 && <span className="ml-1.5 text-xs text-slate-400 font-normal bg-slate-100 px-1.5 py-0.5 rounded-full">{likeCount}</span>}
                        </button>
                    </div>

                    <div className="grid grid-cols-2 md:grid-cols-1 gap-1">
                        <button onClick={handleCopy} className="flex items-center justify-center md:justify-start px-3 py-3 md:py-2.5 hover:bg-indigo-50 rounded-xl md:rounded-lg text-slate-700 text-sm font-medium transition-colors">
                            <Copy className="mr-2 h-4 w-4 text-slate-400" /> Copiar
                        </button>
                        <button onClick={handleShare} className="flex items-center justify-center md:justify-start px-3 py-3 md:py-2.5 hover:bg-indigo-50 rounded-xl md:rounded-lg text-slate-700 text-sm font-medium transition-colors">
                            <Share2 className="mr-2 h-4 w-4 text-slate-400" /> Compartilhar
                        </button>
                    </div>

                    <div className="h-px bg-slate-100 my-1 hidden md:block" />

                    <button onClick={() => { onExplain(); setIsOpen(false); }} className="col-span-2 md:col-span-1 w-full flex items-center justify-center md:justify-start px-3 py-3 md:py-2.5 bg-indigo-50/50 hover:bg-indigo-50 rounded-xl md:rounded-lg text-indigo-700 text-sm font-bold transition-colors mt-1 md:mt-0 border border-indigo-100/50 md:border-transparent">
                        <BookOpen className="mr-2 h-4 w-4 text-indigo-600" /> Ver Explicação Detalhada
                    </button>

                    {/* Desktop Arrow */}
                    <div className="hidden md:block absolute left-1/2 -translate-x-1/2 bottom-[-6px] w-3 h-3 bg-white border-r border-b border-slate-100 transform rotate-45"></div>
                </div>
            )}
        </span>
    );
}


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
}

export function VerseActionMenu({ children, verseRef, text, onExplain, onListen, onLike, isLiked }: VerseActionMenuProps) {
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
            <span onClick={() => setIsOpen(!isOpen)} className="cursor-pointer">
                {children}
            </span>

            {isOpen && (
                <div className="absolute z-50 bottom-full mb-2 left-1/2 -translate-x-1/2 w-48 bg-white/95 backdrop-blur-md rounded-xl shadow-xl border border-slate-100 p-1 animate-in fade-in zoom-in-95 duration-200 origin-bottom">
                    <button onClick={() => { onListen(); setIsOpen(false); }} className="w-full text-left flex items-center px-3 py-2.5 hover:bg-indigo-50 rounded-lg text-slate-700 text-sm font-medium transition-colors">
                        <Headphones className="mr-2 h-4 w-4 text-slate-400" /> Ouvir
                    </button>
                    <div className="h-px bg-slate-100 my-1" />
                    <button onClick={handleCopy} className="w-full text-left flex items-center px-3 py-2.5 hover:bg-indigo-50 rounded-lg text-slate-700 text-sm font-medium transition-colors">
                        <Copy className="mr-2 h-4 w-4 text-slate-400" /> Copiar
                    </button>
                    <button onClick={handleShare} className="w-full text-left flex items-center px-3 py-2.5 hover:bg-indigo-50 rounded-lg text-slate-700 text-sm font-medium transition-colors">
                        <Share2 className="mr-2 h-4 w-4 text-slate-400" /> Compartilhar
                    </button>
                    <button onClick={() => { onLike(); setIsOpen(false); }} className="w-full text-left flex items-center px-3 py-2.5 hover:bg-indigo-50 rounded-lg text-slate-700 text-sm font-medium transition-colors">
                        <Heart className={cn("mr-2 h-4 w-4", isLiked ? "fill-red-500 text-red-500" : "text-slate-400")} /> {isLiked ? 'Amém!' : 'Amém'}
                    </button>
                    <div className="h-px bg-slate-100 my-1" />
                    <button onClick={() => { onExplain(); setIsOpen(false); }} className="w-full text-left flex items-center px-3 py-2.5 hover:bg-indigo-50 rounded-lg text-indigo-700 text-sm font-bold transition-colors">
                        <BookOpen className="mr-2 h-4 w-4 text-indigo-500" /> Explicar
                    </button>

                    {/* Arrow */}
                    <div className="absolute left-1/2 -translate-x-1/2 bottom-[-6px] w-3 h-3 bg-white border-r border-b border-slate-100 transform rotate-45 rotate-0"></div>
                </div>
            )}
        </span>
    );
}

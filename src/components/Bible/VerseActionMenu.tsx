
import { useState, useRef, useEffect, useLayoutEffect } from 'react';
import { createPortal } from 'react-dom';
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
    const [menuStyle, setMenuStyle] = useState<React.CSSProperties>({});
    const triggerRef = useRef<HTMLSpanElement>(null);
    const menuRef = useRef<HTMLDivElement>(null);

    // Calculate position when opening
    useLayoutEffect(() => {
        if (isOpen && triggerRef.current && menuRef.current) {
            const updatePosition = () => {
                const triggerRect = triggerRef.current!.getBoundingClientRect();
                const menuRect = menuRef.current!.getBoundingClientRect();
                const viewportHeight = window.innerHeight;
                const viewportWidth = window.innerWidth;
                const gap = 8; // sideOffset
                const padding = 16; // collisionPadding

                // Check if mobile (using same breakpoint as CSS usually, or just window width)
                const isMobile = viewportWidth < 768;

                if (isMobile) {
                    // Mobile: Fixed bottom sheet, no calculation needed essentially, handled by CSS classes
                    setMenuStyle({});
                    return;
                }

                // Desktop Calculation
                let top = triggerRect.bottom + gap;
                let left = triggerRect.left + (triggerRect.width / 2) - (menuRect.width / 2);

                // Flip detection (prefer bottom, try top if collision)
                const spaceBelow = viewportHeight - top;

                // If not enough space below AND more space above, flip to top
                if (spaceBelow < menuRect.height && triggerRect.top > menuRect.height + gap + padding) {
                    top = triggerRect.top - menuRect.height - gap;
                }

                // Shift detection (horizontal clamp)
                if (left < padding) {
                    left = padding;
                } else if (left + menuRect.width > viewportWidth - padding) {
                    left = viewportWidth - menuRect.width - padding;
                }

                setMenuStyle({
                    top: `${top}px`,
                    left: `${left}px`,
                    position: 'fixed'
                });

                // We could setPlacement(placement) if we want to show/position arrow specifically
            };

            updatePosition();
            // Optional: Re-calculate on scroll/resize if strictly needed, 
            // but for a menu usually closing on scroll is better or just acceptable initial pos.
            // Let's add resize listener at least.
            window.addEventListener('resize', updatePosition);
            window.addEventListener('scroll', updatePosition, true); // Capture scroll to update pos if needed or close

            return () => {
                window.removeEventListener('resize', updatePosition);
                window.removeEventListener('scroll', updatePosition, true);
            };
        }
    }, [isOpen]);

    useEffect(() => {
        const handleClickOutside = (event: Event) => {
            // Check both menu and trigger
            if (
                menuRef.current &&
                !menuRef.current.contains(event.target as Node) &&
                triggerRef.current &&
                !triggerRef.current.contains(event.target as Node)
            ) {
                setIsOpen(false);
            }
        };

        const handleEscape = (event: KeyboardEvent) => {
            if (event.key === 'Escape') setIsOpen(false);
        };

        if (isOpen) {
            document.addEventListener('mousedown', handleClickOutside);
            document.addEventListener('touchstart', handleClickOutside);
            document.addEventListener('keydown', handleEscape);
        }
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
            document.removeEventListener('touchstart', handleClickOutside);
            document.removeEventListener('keydown', handleEscape);
        };
    }, [isOpen]);

    const handleCopy = () => {
        navigator.clipboard.writeText(`${text} (${verseRef})`);
        setIsOpen(false);
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
        <>
            <span
                ref={triggerRef}
                onClick={() => setIsOpen(!isOpen)}
                className={cn("cursor-pointer select-none", isOpen && "bg-indigo-50/50 rounded-sm")}
            >
                {children}
            </span>

            {isOpen && createPortal(
                <>
                    {/* Backdrop */}
                    <div
                        className="fixed inset-0 bg-black/20 backdrop-blur-[1px] z-50 transition-opacity"
                        onClick={() => setIsOpen(false)}
                    />

                    {/* Menu Content */}
                    <div
                        ref={menuRef}
                        style={menuStyle}
                        className={cn(
                            "fixed z-50 bg-white/95 backdrop-blur-xl shadow-2xl border border-white/20 p-2 flex flex-col gap-1 safe-area-bottom",
                            // Mobile Styles
                            "inset-x-4 bottom-6 rounded-2xl animate-in slide-in-from-bottom-10 fade-in duration-200",
                            // Desktop Styles (overridden by inline styles when active)
                            "md:w-56 md:inset-auto md:rounded-xl md:border-slate-100",
                            // Max Height for small screens
                            "max-h-[calc(100vh-48px)] overflow-y-auto"
                        )}
                    >
                        {/* Header for Mobile */}
                        <div className="md:hidden flex items-center justify-between px-3 py-2 border-b border-slate-100/50 mb-1 shrink-0">
                            <span className="text-xs font-bold text-slate-400 uppercase tracking-widest">{verseRef}</span>
                        </div>

                        <div className="grid grid-cols-2 md:grid-cols-1 gap-1 shrink-0">
                            <button onClick={() => { onListen(); setIsOpen(false); }} className="flex items-center justify-center md:justify-start px-3 py-3 md:py-2.5 bg-slate-50 md:bg-transparent hover:bg-indigo-50 rounded-xl md:rounded-lg text-slate-700 text-sm font-medium transition-colors">
                                <Headphones className="mr-2 h-4 w-4 text-indigo-500" /> Ouvir
                            </button>

                            <button onClick={() => { onLike(); setIsOpen(false); }} className="flex items-center justify-center md:justify-start px-3 py-3 md:py-2.5 bg-slate-50 md:bg-transparent hover:bg-indigo-50 rounded-xl md:rounded-lg text-slate-700 text-sm font-medium transition-colors">
                                <Heart className={cn("mr-2 h-4 w-4", isLiked ? "fill-red-500 text-red-500" : "text-slate-400")} />
                                {isLiked ? 'Amém!' : 'Amém'}
                                {likeCount !== undefined && likeCount > 0 && <span className="ml-1.5 text-xs text-slate-400 font-normal bg-slate-100 px-1.5 py-0.5 rounded-full">{likeCount}</span>}
                            </button>
                        </div>

                        <div className="grid grid-cols-2 md:grid-cols-1 gap-1 shrink-0">
                            <button onClick={handleCopy} className="flex items-center justify-center md:justify-start px-3 py-3 md:py-2.5 hover:bg-indigo-50 rounded-xl md:rounded-lg text-slate-700 text-sm font-medium transition-colors">
                                <Copy className="mr-2 h-4 w-4 text-slate-400" /> Copiar
                            </button>
                            <button onClick={handleShare} className="flex items-center justify-center md:justify-start px-3 py-3 md:py-2.5 hover:bg-indigo-50 rounded-xl md:rounded-lg text-slate-700 text-sm font-medium transition-colors">
                                <Share2 className="mr-2 h-4 w-4 text-slate-400" /> Compartilhar
                            </button>
                        </div>

                        <div className="h-px bg-slate-100 my-1 hidden md:block shrink-0" />

                        <button onClick={() => { onExplain(); setIsOpen(false); }} className="col-span-2 md:col-span-1 w-full flex items-center justify-center md:justify-start px-3 py-3 md:py-2.5 bg-indigo-50/50 hover:bg-indigo-50 rounded-xl md:rounded-lg text-indigo-700 text-sm font-bold transition-colors mt-1 md:mt-0 border border-indigo-100/50 md:border-transparent shrink-0">
                            <BookOpen className="mr-2 h-4 w-4 text-indigo-600" /> Ver Explicação Detalhada
                        </button>

                    </div>
                </>,
                document.body
            )}
        </>
    );
}

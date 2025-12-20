import { useEffect, useRef } from 'react';
import { createPortal } from 'react-dom';
import { X } from 'lucide-react';

interface DrawerProps {
    isOpen: boolean;
    onClose: () => void;
    title?: string;
    children: React.ReactNode;
    className?: string;
    showCloseButton?: boolean;
}

export function Drawer({ isOpen, onClose, title, children, className = "", showCloseButton = true }: DrawerProps) {
    const contentRef = useRef<HTMLDivElement>(null);

    // Close on escape
    useEffect(() => {
        const handleEsc = (e: KeyboardEvent) => { if (e.key === 'Escape') onClose(); };
        window.addEventListener('keydown', handleEsc);
        return () => window.removeEventListener('keydown', handleEsc);
    }, [onClose]);

    // Prevent body scroll when open
    useEffect(() => {
        if (isOpen) {
            document.body.style.overflow = 'hidden';
        } else {
            document.body.style.overflow = '';
        }
        return () => { document.body.style.overflow = ''; };
    }, [isOpen]);

    if (!isOpen) return null;

    return createPortal(
        <div className="fixed inset-0 z-[100] flex justify-center items-end sm:items-center sm:p-4 isolate">
            {/* Backdrop */}
            <div
                className="absolute inset-0 bg-slate-900/40 backdrop-blur-md transition-opacity animate-in fade-in duration-300"
                onClick={onClose}
            />

            {/* Drawer Content */}
            <div
                ref={contentRef}
                className={`
                    relative w-full max-w-lg 
                    bg-white/95 backdrop-blur-2xl supports-[backdrop-filter]:bg-white/80
                    rounded-t-[32px] sm:rounded-3xl 
                    shadow-[0_-8px_40px_-12px_rgba(0,0,0,0.15)] 
                    flex flex-col max-h-[90vh] sm:max-h-[85vh] 
                    animate-in slide-in-from-bottom-full sm:slide-in-from-bottom-10 sm:zoom-in-95 duration-300 
                    ring-1 ring-white/40 border border-white/20
                    ${className}
                `}
            >
                {/* Header (Sticky) */}
                <div className="sticky top-0 z-50 flex items-center justify-between px-6 py-5 border-b border-slate-100/60 bg-white/50 backdrop-blur-md shrink-0">
                    {title && (
                        <div className="flex flex-col gap-0.5">
                            <h2 className="text-xl font-bold text-slate-900 tracking-tight leading-none">{title}</h2>
                            <div className="h-1 w-8 bg-gradient-to-r from-blue-500/50 to-purple-500/50 rounded-full mt-1.5" />
                        </div>
                    )}
                    {showCloseButton && (
                        <button
                            onClick={onClose}
                            className="group p-2 -mr-2 text-slate-400 hover:text-slate-600 bg-transparent hover:bg-slate-100/80 rounded-full transition-all active:scale-95"
                        >
                            <div className="ring-1 ring-slate-200/50 rounded-full p-1 group-hover:ring-slate-300/60 transition-colors">
                                <X className="w-4 h-4" />
                            </div>
                        </button>
                    )}
                </div>

                {/* Scrollable Body */}
                <div className="overflow-y-auto p-6 scroll-smooth">
                    {children}
                </div>
            </div>
        </div>,
        document.body
    );
}

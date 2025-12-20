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
                className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm transition-opacity animate-in fade-in duration-200" 
                onClick={onClose} 
            />

            {/* Drawer Content */}
            <div 
                ref={contentRef}
                className={`
                    relative w-full max-w-lg bg-white rounded-t-3xl sm:rounded-3xl shadow-2xl 
                    flex flex-col max-h-[90vh] sm:max-h-[85vh] 
                    animate-in slide-in-from-bottom-full sm:slide-in-from-bottom-10 sm:zoom-in-95 duration-300 
                    ring-1 ring-slate-900/5
                    ${className}
                `}
            >
                {/* Header */}
                <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100 shrink-0">
                    {title && (
                        <h2 className="text-lg font-bold text-slate-900 tracking-tight">{title}</h2>
                    )}
                    {showCloseButton && (
                        <button
                            onClick={onClose}
                            className="p-2 -mr-2 text-slate-400 hover:text-slate-600 hover:bg-slate-50 rounded-full transition-colors"
                        >
                            <X className="w-5 h-5" />
                        </button>
                    )}
                </div>

                {/* Scrollable Body */}
                <div className="overflow-y-auto p-6">
                    {children}
                </div>
            </div>
        </div>,
        document.body
    );
}

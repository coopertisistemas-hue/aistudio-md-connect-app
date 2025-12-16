import { ArrowUp } from 'lucide-react';
import { useEffect, useState } from 'react';

export function BackToTop() {
    const [visible, setVisible] = useState(false);

    useEffect(() => {
        const handleScroll = () => {
            if (window.scrollY > 300) {
                setVisible(true);
            } else {
                setVisible(false);
            }
        };

        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    const scrollToTop = () => {
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    if (!visible) return null;

    return (
        <button
            onClick={scrollToTop}
            className="fixed bottom-24 right-4 z-40 bg-white/90 backdrop-blur border border-slate-200 p-3 rounded-full shadow-lg text-slate-600 active:scale-95 transition-all animate-in fade-in slide-in-from-bottom-4 duration-300"
        >
            <ArrowUp className="w-5 h-5" />
        </button>
    );
}

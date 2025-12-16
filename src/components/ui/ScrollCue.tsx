import { useEffect, useState } from 'react';
import { ChevronDown } from 'lucide-react';

export function ScrollCue() {
    const [visible, setVisible] = useState(true);

    useEffect(() => {
        const handleScroll = () => {
            if (window.scrollY > 20) {
                setVisible(false);
            }
        };

        window.addEventListener('scroll', handleScroll);

        // Auto-hide after 5 seconds if no scroll
        const timer = setTimeout(() => setVisible(false), 5000);

        return () => {
            window.removeEventListener('scroll', handleScroll);
            clearTimeout(timer);
        };
    }, []);

    if (!visible) return null;

    return (
        <div className="fixed bottom-20 left-1/2 -translate-x-1/2 z-40 pointer-events-none animate-bounce opacity-80">
            <div className="bg-white/80 backdrop-blur rounded-full p-1 shadow-sm border border-slate-100/50">
                <ChevronDown className="w-5 h-5 text-slate-500" />
            </div>
        </div>
    );
}

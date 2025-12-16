import React, { useState, useEffect } from 'react';
import { Calendar, AlertTriangle, Radio, Megaphone } from 'lucide-react';
import { type FeedItem } from '@/services/feed';
import { useNavigate } from 'react-router-dom';

interface NotificationTickerProps {
    items: FeedItem[];
}

export const NotificationTicker: React.FC<NotificationTickerProps> = ({ items }) => {
    const navigate = useNavigate();
    const [currentIndex, setCurrentIndex] = useState(0);
    const [isPaused, setIsPaused] = useState(false);

    // Fallback items if feed is empty (to ensure visibility as requested)
    const effectiveItems = items.length > 0 ? items.slice(0, 5) : [
        {
            id: 'welcome',
            title: 'Bem-vindo ao App da sua Igreja! Confira os próximos eventos.',
            type: 'notice',
            priority: 'normal',
            published_at: new Date().toISOString()
        } as FeedItem,
        {
            id: 'example',
            title: 'Culto de Doutrina - Terça às 19h30',
            type: 'event',
            priority: 'normal',
            published_at: new Date().toISOString()
        } as FeedItem
    ];

    useEffect(() => {
        const interval = setInterval(() => {
            if (!isPaused) {
                setCurrentIndex((prev) => (prev + 1) % effectiveItems.length);
            }
        }, 8000);

        return () => clearInterval(interval);
    }, [effectiveItems.length, isPaused]);

    const currentItem = effectiveItems[currentIndex];

    const getIcon = (item: FeedItem) => {
        if (item.priority === 'high') return <AlertTriangle className="w-3.5 h-3.5 text-amber-600" />;
        if (item.type === 'event') return <Calendar className="w-3.5 h-3.5 text-blue-600" />;
        if (item.type === 'live') return <Radio className="w-3.5 h-3.5 text-red-600 animate-pulse" />;
        return <Megaphone className="w-3.5 h-3.5 text-slate-600" />;
    };

    const handleClick = () => {
        if (currentItem.id === 'welcome' || currentItem.id === 'example') return; // No action for mock
        if (currentItem.type === 'event') navigate('/events');
        else navigate('/notices');
    };

    return (
        <div className="w-full bg-white border-b border-slate-100 mb-0 shadow-sm z-10 relative overflow-hidden">
            <style>{`
                @keyframes slideInRight {
                    0% { opacity: 0; transform: translateX(30px); }
                    100% { opacity: 1; transform: translateX(0); }
                }
                .animate-slide-right {
                    animation: slideInRight 5.0s cubic-bezier(0.2, 0.8, 0.2, 1) forwards;
                }
             `}</style>
            <div
                className="w-full px-4 py-3 flex items-center cursor-pointer group"
                onMouseEnter={() => setIsPaused(true)}
                onMouseLeave={() => setIsPaused(false)}
                onTouchStart={() => setIsPaused(true)}
                onTouchEnd={() => setTimeout(() => setIsPaused(false), 2000)}
                onClick={handleClick}
            >
                {/* Animated Wrapper for Content (Chip + Text) */}
                <div key={currentIndex} className="flex-1 flex items-center min-w-0 animate-slide-right">

                    {/* Badge / Icon */}
                    <div className={`flex-shrink-0 mr-3 flex items-center space-x-1.5 px-2 py-1 rounded-md ${currentItem.priority === 'high' ? 'bg-amber-100 text-amber-700' :
                        currentItem.type === 'live' ? 'bg-red-100 text-red-700' : 'bg-slate-100 text-slate-600'
                        }`}>
                        {getIcon(currentItem)}
                        <span className="text-[10px] font-bold uppercase tracking-wider">
                            {currentItem.priority === 'high' ? 'URGENTE' :
                                currentItem.type === 'live' ? 'AO VIVO' :
                                    currentItem.type === 'event' ? 'AGENDA' : 'NOTÍCIA'}
                        </span>
                    </div>

                    {/* Text Content */}
                    <div className="flex-1 min-w-0">
                        <p className="text-sm text-slate-700 truncate font-medium leading-none">
                            {currentItem.title}
                        </p>
                    </div>
                </div>

                {/* Navigation Dots (Static) */}
                <div className="flex-shrink-0 ml-3 flex space-x-1 opacity-0 group-hover:opacity-100 transition-opacity">
                    {effectiveItems.map((_, idx) => (
                        <div
                            key={idx}
                            className={`h-1.5 w-1.5 rounded-full transition-all duration-300 ${idx === currentIndex ? 'bg-slate-400' : 'bg-slate-200'
                                }`}
                        />
                    ))}
                </div>
            </div>
        </div>
    );
};

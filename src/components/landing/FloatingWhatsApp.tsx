import React from 'react';
import { MessageCircle } from 'lucide-react';

export const FloatingWhatsApp: React.FC = () => {
    return (
        <a
            href="https://wa.me/5551986859236?text=Olá!%20Quero%20conhecer%20o%20MD%20Connect%20para%20minha%20igreja."
            target="_blank"
            rel="noopener noreferrer"
            className="fixed bottom-6 right-6 z-50 bg-[#25D366] hover:bg-[#20bd5a] text-white p-4 rounded-full shadow-lg hover:shadow-xl transition-all hover:scale-110 group animate-in slide-in-from-bottom-5 duration-500"
            aria-label="Falar no WhatsApp"
        >
            <MessageCircle className="w-7 h-7 fill-white text-white" />
            <span className="absolute right-full mr-3 top-1/2 -translate-y-1/2 bg-white text-slate-800 text-xs font-bold px-3 py-1.5 rounded-lg shadow-md whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none">
                Falar Conosco
            </span>
        </a>
    );
};

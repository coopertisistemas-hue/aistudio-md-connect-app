import { Users, Quote } from 'lucide-react';
import { useState, useEffect } from 'react';

const VERSES = [
    { text: "O Senhor é o meu pastor e nada me faltará.", ref: "Salmos 23:1" },
    { text: "Tudo posso naquele que me fortalece.", ref: "Filipenses 4:13" },
    { text: "Porque dele, e por ele, e para ele são todas as coisas.", ref: "Romanos 11:36" },
    { text: "Mil cairão ao teu lado, e dez mil à tua direita, mas tu não serás atingido.", ref: "Salmos 91:7" },
    { text: "Entrega o teu caminho ao Senhor; confia nele, e ele tudo fará.", ref: "Salmos 37:5" }
];

export function HomeHeader() {
    const [verse, setVerse] = useState(VERSES[0]);

    useEffect(() => {
        // Daily Persistence (using date as key)
        const today = new Date().toISOString().split('T')[0]; // YYYY-MM-DD
        const storedDate = localStorage.getItem('md_verse_date');
        const storedIndex = localStorage.getItem('md_verse_index');

        if (storedDate === today && storedIndex) {
            setVerse(VERSES[parseInt(storedIndex)]);
        } else {
            const newIndex = Math.floor(Math.random() * VERSES.length);
            localStorage.setItem('md_verse_date', today);
            localStorage.setItem('md_verse_index', newIndex.toString());
            setVerse(VERSES[newIndex]);
        }
    }, []);

    return (
        <header className="bg-white p-4 pb-2 z-10 relative">
            <div className="flex justify-between items-start mb-4">
                {/* Brand - Left */}
                <div className="flex items-center space-x-3">
                    <div className="h-10 w-10 rounded-full overflow-hidden flex items-center justify-center border border-slate-100 shadow-sm">
                        <img src="/logo-md.png" alt="MD" className="w-full h-full object-cover" />
                    </div>
                    <div>
                        <h1 className="font-heading font-bold text-lg text-slate-900 leading-tight">MD Connect</h1>
                        <p className="text-[10px] text-slate-500 font-medium uppercase tracking-wider">A serviço do Reino</p>
                    </div>
                </div>

                {/* Profile - Right */}
                <div className="bg-slate-50 p-2 rounded-full border border-slate-100">
                    <Users className="h-5 w-5 text-slate-400" />
                </div>
            </div>

            {/* Daily Verse Section */}
            <div className="mt-2 mb-1 pl-1 border-l-2 border-blue-500/30">
                <div className="flex items-start">
                    <Quote className="w-3 h-3 text-blue-400 mr-2 mt-0.5 opacity-50 fill-current" />
                    <div>
                        <p className="text-sm font-medium text-slate-700 italic leading-snug">"{verse.text}"</p>
                        <p className="text-[10px] text-slate-400 font-bold mt-1 tracking-wide uppercase">{verse.ref}</p>
                    </div>
                </div>
            </div>
        </header >
    );
}

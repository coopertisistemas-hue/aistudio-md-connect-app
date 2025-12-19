
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { BookOpen, Search, Bookmark, ChevronRight } from 'lucide-react';
import { PageIntro } from '@/components/layout/PageIntro';
import { BookList } from '@/components/Bible/BookList';
import { OLD_TESTAMENT, NEW_TESTAMENT, bibleService } from '@/services/bible';
import { useBibleProgress } from '@/hooks/useBibleProgress';
import { Input } from '@/components/ui/input';

export default function BibleHome() {
    const navigate = useNavigate();
    const { progress } = useBibleProgress();
    const [searchTerm, setSearchTerm] = useState('');
    const [activeTab, setActiveTab] = useState<'OT' | 'NT'>('OT');

    // Filter Logic
    const filterBooks = (list: string[]) => {
        if (!searchTerm) return list;
        return list.filter(b => {
            const ptName = bibleService.expandBookName(b);
            return b.toLowerCase().includes(searchTerm.toLowerCase()) ||
                ptName.toLowerCase().includes(searchTerm.toLowerCase());
        });
    };

    const filteredOT = filterBooks(OLD_TESTAMENT);
    const filteredNT = filterBooks(NEW_TESTAMENT);

    // Auto-switch tab if search only matches one side
    if (searchTerm && filteredOT.length === 0 && filteredNT.length > 0 && activeTab === 'OT') setActiveTab('NT');
    if (searchTerm && filteredNT.length === 0 && filteredOT.length > 0 && activeTab === 'NT') setActiveTab('OT');

    return (
        <div className="min-h-screen bg-slate-50 pb-24">
            <div className="px-5 pt-8">
                <PageIntro
                    title="Bíblia Sagrada"
                    subtitle="Lâmpada para os meus pés é a Tua Palavra."
                    icon={BookOpen}
                    iconClassName="text-indigo-600"
                    backLinkPath="/"
                />

                {/* Continue Reading Card */}
                {progress && (
                    <div
                        onClick={() => navigate(`/biblia/${progress.book}/${progress.chapter}`)}
                        className="mt-6 bg-gradient-to-br from-indigo-900 to-indigo-800 rounded-2xl p-5 text-white shadow-lg shadow-indigo-900/20 relative overflow-hidden group cursor-pointer transition-transform active:scale-[0.98]"
                    >
                        <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
                            <Bookmark className="w-24 h-24 -rotate-12" />
                        </div>

                        <div className="relative z-10">
                            <div className="flex items-center gap-2 text-indigo-200 text-xs font-bold uppercase tracking-widest mb-2">
                                <Bookmark className="w-3 h-3" />
                                Continue Lendo
                            </div>
                            <h3 className="text-2xl font-serif font-bold mb-1">
                                {bibleService.expandBookName(progress.book)} {progress.chapter}
                            </h3>
                            <p className="text-indigo-200 text-sm">
                                Última leitura em {new Date(progress.lastReadAt).toLocaleDateString('pt-BR')}
                            </p>

                            <div className="mt-4 flex items-center text-sm font-bold text-white">
                                Continuar <ChevronRight className="w-4 h-4 ml-1" />
                            </div>
                        </div>
                    </div>
                )}

                {/* Search */}
                <div className="mt-6 relative">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                    <Input
                        placeholder="Buscar livro..."
                        className="pl-10 h-12 bg-white border-slate-200 text-base"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                </div>

                {/* Tabs */}
                <div className="mt-6 flex bg-slate-200/50 p-1 rounded-xl">
                    <button
                        onClick={() => setActiveTab('OT')}
                        className={`flex-1 py-2.5 text-sm font-bold rounded-lg transition-all ${activeTab === 'OT' ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-500 hover:text-slate-700'}`}
                    >
                        Antigo Testamento
                    </button>
                    <button
                        onClick={() => setActiveTab('NT')}
                        className={`flex-1 py-2.5 text-sm font-bold rounded-lg transition-all ${activeTab === 'NT' ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-500 hover:text-slate-700'}`}
                    >
                        Novo Testamento
                    </button>
                </div>

                {/* List */}
                <div className="mt-6 animate-in slide-in-from-bottom-4 duration-500">
                    {activeTab === 'OT' ? (
                        filteredOT.length > 0 ? (
                            <BookList books={filteredOT} onSelect={(b) => navigate(`/biblia/${b}`)} />
                        ) : (
                            <p className="text-center text-slate-400 py-10">Nenhum livro encontrado.</p>
                        )
                    ) : (
                        filteredNT.length > 0 ? (
                            <BookList books={filteredNT} onSelect={(b) => navigate(`/biblia/${b}`)} />
                        ) : (
                            <p className="text-center text-slate-400 py-10">Nenhum livro encontrado.</p>
                        )
                    )}
                </div>
            </div>
        </div>
    );
}

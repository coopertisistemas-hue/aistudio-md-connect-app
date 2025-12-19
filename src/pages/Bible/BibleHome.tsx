
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { BookOpen, Search, Bookmark, ChevronRight } from 'lucide-react';
import { PageIntro } from '@/components/layout/PageIntro';
import { BookList } from '@/components/Bible/BookList';
import { bibleService } from '@/services/bible';
import { useBibleProgress } from '@/hooks/useBibleProgress';
import { Input } from '@/components/ui/input';
import { BIBLE_CATEGORIES, getAllBooksFlat, type BibleCategory } from '@/data/bibleCategories';

export default function BibleHome() {
    const navigate = useNavigate();
    const { progress } = useBibleProgress();
    const [searchTerm, setSearchTerm] = useState('');
    const [activeTab, setActiveTab] = useState<'OT' | 'NT'>('OT');

    // Filter Logic
    const allBooks = getAllBooksFlat();
    const filteredResults = searchTerm
        ? allBooks.filter(b =>
            b.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            b.key.toLowerCase().includes(searchTerm.toLowerCase())
        )
        : [];

    const currentTestamentData = BIBLE_CATEGORIES[activeTab];

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
                        className="pl-10 h-12 bg-white border-slate-200 text-base rounded-xl focus:ring-indigo-500 focus:border-indigo-500"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                </div>

                {/* Content Area */}
                <div className="mt-6">
                    {searchTerm ? (
                        <div className="space-y-4 animate-in fade-in duration-300">
                            <h3 className="text-xs font-bold text-slate-400 uppercase tracking-widest pl-1">
                                Resultados da Busca ({filteredResults.length})
                            </h3>
                            {filteredResults.length > 0 ? (
                                <BookList books={filteredResults} onSelect={(b) => navigate(`/biblia/${b}`)} />
                            ) : (
                                <div className="text-center py-12 text-slate-400 bg-white rounded-2xl border border-slate-100 border-dashed">
                                    <BookOpen className="w-8 h-8 mx-auto mb-2 opacity-20" />
                                    <p>Nenhum livro encontrado.</p>
                                </div>
                            )}
                        </div>
                    ) : (
                        <>
                            {/* Tabs */}
                            <div className="flex bg-slate-200/50 p-1 rounded-xl mb-6">
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

                            {/* Categorized List */}
                            <div className="space-y-8 animate-in slide-in-from-bottom-4 duration-500">
                                {currentTestamentData.categories.map((category: BibleCategory) => (
                                    <section key={category.title} className="space-y-3">
                                        <h3 className="text-xs font-bold text-slate-400 uppercase tracking-widest pl-1 border-l-2 border-indigo-500 ml-1">
                                            {category.title}
                                        </h3>
                                        <BookList books={category.books} onSelect={(b) => navigate(`/biblia/${b}`)} />
                                    </section>
                                ))}
                            </div>
                        </>
                    )}
                </div>
            </div>
        </div>
    );
}

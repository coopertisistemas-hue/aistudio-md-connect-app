
import { useParams, useNavigate } from 'react-router-dom';
import { BookOpen } from 'lucide-react';
import { PageIntro } from '@/components/layout/PageIntro';
import { ChapterGrid } from '@/components/Bible/ChapterGrid';
import { bibleService } from '@/services/bible';

export default function BibleBook() {
    const { bookId } = useParams();
    const navigate = useNavigate();

    // Safety check
    if (!bookId) return <div className="p-10 text-center">Livro não encontrado</div>;

    const displayTitle = bibleService.expandBookName(bookId);

    return (
        <div className="min-h-screen bg-slate-50 pb-24">
            <div className="px-5 pt-8">
                <PageIntro
                    title={displayTitle}
                    subtitle="Selecione um capítulo para ler."
                    icon={BookOpen}
                    iconClassName="text-indigo-600"

                    backLink={true}
                    backLinkPath="/biblia"
                />

                <div className="mt-8 animate-in slide-in-from-bottom-4 duration-500">
                    <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-100">
                        <ChapterGrid
                            bookName={bookId}
                            onSelect={(chapter) => navigate(`/biblia/${bookId}/${chapter}`)}
                        />
                    </div>
                </div>
            </div>
        </div>
    );
}

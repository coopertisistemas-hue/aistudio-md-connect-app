
import { ChevronRight } from 'lucide-react';
import { bibleService } from '@/services/bible';

interface BookListProps {
    books: string[];
    onSelect: (book: string) => void;
}

export function BookList({ books, onSelect }: BookListProps) {
    return (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
            {books.map((book) => {
                // Map EN book names to PT if needed for display
                const ptName = bibleService.expandBookName(book);

                return (
                    <button
                        key={book}
                        onClick={() => onSelect(book)}
                        className="flex items-center justify-between p-4 bg-white border border-slate-100 rounded-xl hover:bg-slate-50 active:bg-slate-100 transition-colors text-left group shadow-sm hover:shadow"
                    >
                        <span className="font-semibold text-slate-700 group-hover:text-indigo-700 transition-colors">
                            {ptName}
                        </span>
                        <ChevronRight className="w-4 h-4 text-slate-300 group-hover:text-indigo-400" />
                    </button>
                );
            })}
        </div>
    );
}

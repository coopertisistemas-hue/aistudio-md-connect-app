import { ChevronRight } from 'lucide-react';

interface BookDef {
    key: string;
    name: string;
}

interface BookListProps {
    books: BookDef[];
    onSelect: (bookKey: string) => void;
}

export function BookList({ books, onSelect }: BookListProps) {
    return (
        <div className="grid grid-cols-2 lg:grid-cols-3 gap-3">
            {books.map((book) => (
                <button
                    key={book.key}
                    onClick={() => onSelect(book.key)}
                    className="flex items-center justify-between p-4 bg-white border border-slate-100 rounded-xl hover:bg-slate-50 active:bg-slate-100 transition-colors text-left group shadow-sm hover:shadow"
                >
                    <span className="font-semibold text-slate-700 group-hover:text-indigo-700 transition-colors text-sm">
                        {book.name}
                    </span>
                    <ChevronRight className="w-4 h-4 text-slate-300 group-hover:text-indigo-400" />
                </button>
            ))}
        </div>
    );
}

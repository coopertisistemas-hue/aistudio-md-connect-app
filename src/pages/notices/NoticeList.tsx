import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { Pin, Calendar, Loader2 } from 'lucide-react';
import { supabase } from '@/lib/supabase';

export default function NoticeList() {
    // const navigate = useNavigate(); // Removed unused
    const { slug } = useParams();
    const [notices, setNotices] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (!slug) return;

        const fetchNotices = async () => {
            setLoading(true);
            const { data, error } = await supabase.functions.invoke('public-notices-list', {
                body: { slug, limit: 20 }
            });

            if (!error && data?.data) {
                setNotices(data.data);
            }
            setLoading(false);
        };

        fetchNotices();
    }, [slug]);

    return (
        <div className="min-h-screen bg-slate-50 pb-20">
            {/* Content Header (Non-sticky, just title) */}
            <div className="px-4 pt-4 pb-2">
                <h1 className="text-xl font-bold text-slate-800">Mural de Avisos</h1>
            </div>

            <div className="p-4 space-y-4">
                {loading ? (
                    <div className="flex justify-center py-8"><Loader2 className="animate-spin text-slate-400" /></div>
                ) : notices.length === 0 ? (
                    <div className="text-center py-12 text-slate-400">
                        <p>Nenhum aviso publicado.</p>
                    </div>
                ) : (
                    notices.map((notice) => (
                        <div key={notice.id} className="bg-white p-5 rounded-xl border border-slate-100 shadow-sm relative overflow-hidden">
                            {notice.is_pinned && (
                                <div className="absolute top-0 right-0 bg-blue-100 text-blue-700 px-2 py-1 rounded-bl-xl">
                                    <Pin className="w-3 h-3" />
                                </div>
                            )}
                            <div className="flex items-center gap-2 mb-2">
                                <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase ${notice.priority === 'high' ? 'bg-red-50 text-red-600' : 'bg-slate-100 text-slate-500'
                                    }`}>
                                    {notice.priority === 'high' ? 'Importante' : 'Aviso'}
                                </span>
                                <span className="text-xs text-slate-400 flex items-center gap-1">
                                    <Calendar className="w-3 h-3" />
                                    {new Date(notice.created_at).toLocaleDateString('pt-BR')}
                                </span>
                            </div>
                            <h3 className="font-bold text-slate-800 mb-2 text-lg">{notice.title}</h3>
                            <div className="text-slate-600 text-sm whitespace-pre-line leading-relaxed">
                                {notice.body}
                            </div>
                        </div>
                    ))
                )}
            </div>
        </div>
    );
}

import { ArrowLeft } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export function BackHeader({ title, backPath }: { title: string; backPath?: string }) {
    const navigate = useNavigate();
    return (
        <div className="flex items-center space-x-4 p-4 bg-white sticky top-0 z-10 border-b border-slate-100">
            <button onClick={() => backPath ? navigate(backPath) : navigate(-1)} className="p-2 -ml-2 hover:bg-slate-50 rounded-full">
                <ArrowLeft className="w-5 h-5 text-slate-700" />
            </button>
            <h1 className="font-bold text-slate-800 text-lg">{title}</h1>
        </div>
    );
}

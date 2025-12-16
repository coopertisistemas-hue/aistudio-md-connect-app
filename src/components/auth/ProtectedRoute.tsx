import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { Loader2 } from 'lucide-react';

export function ProtectedRoute({ children }: { children: React.ReactNode }) {
    const { user, loading } = useAuth();
    const location = useLocation();

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-slate-50">
                <Loader2 className="w-8 h-8 text-blue-600 animate-spin" />
            </div>
        );
    }

    if (!user) {
        // Redirect to Public Home (Landing) instead of login, as requested
        // But maybe Login is better UX? User asked:
        // "A) Usuário NÃO autenticado: ... /c/:slug -> redirect para /home"
        return <Navigate to="/home" state={{ from: location }} replace />;
    }

    return <>{children}</>;
}

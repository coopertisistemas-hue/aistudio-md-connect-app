import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { ChevronLeft } from 'lucide-react';
import { APP_ROUTES } from '@/lib/routes';

interface BackLinkProps {
    to?: string; // Optional explicit destination
    label?: string;
    className?: string;
}

export function BackLink({ to, label = "Voltar", className }: BackLinkProps) {
    const navigate = useNavigate();

    const handleBack = () => {
        if (to) {
            navigate(to);
        } else {
            // Check if there is a previous entry in history state (not reliable in all browsers/stacks, but good heuristic)
            // Or simply use navigate(-1). To be safer about "fallback to Home", we can check key.
            // If location.key is 'default', it might be a fresh load.
            if (window.history.length > 2) {
                navigate(-1);
            } else {
                navigate(APP_ROUTES.HOME);
            }
        }
    };

    return (
        <Button
            variant="ghost"
            className={`pl-0 hover:bg-transparent text-slate-600 hover:text-slate-900 transition-colors font-medium ${className || ''}`}
            onClick={handleBack}
            aria-label={label}
        >
            <ChevronLeft className="w-5 h-5 mr-1" />
            {label}
        </Button>
    );
}

// Premium Error Boundary
// Catches React render errors and shows user-friendly fallback UI

import { Component, type ErrorInfo, type ReactNode } from 'react';
import { AlertTriangle } from 'lucide-react';
import { reportError } from '@/lib/errorReporter';

interface Props {
    children: ReactNode;
}

interface State {
    hasError: boolean;
    error: Error | null;
}

class ErrorBoundaryClass extends Component<Props, State> {
    constructor(props: Props) {
        super(props);
        this.state = {
            hasError: false,
            error: null
        };
    }

    static getDerivedStateFromError(error: Error): State {
        return {
            hasError: true,
            error
        };
    }

    componentDidCatch(error: Error, errorInfo: ErrorInfo): void {
        // Report error to backend
        reportError(error, {
            source: 'react_boundary',
            extra: {
                componentStack: errorInfo.componentStack?.substring(0, 500)
            }
        });
    }

    handleReload = (): void => {
        window.location.reload();
    };

    handleGoHome = (): void => {
        window.location.href = '/home';
    };

    render() {
        if (this.state.hasError) {
            return (
                <div className="min-h-screen bg-gradient-to-b from-purple-50 to-white flex items-center justify-center p-4">
                    <div className="max-w-md w-full bg-white rounded-2xl shadow-xl p-8 text-center space-y-6 animate-in fade-in duration-500">
                        {/* Icon */}
                        <div className="w-16 h-16 bg-red-50 rounded-full flex items-center justify-center mx-auto">
                            <AlertTriangle className="w-8 h-8 text-red-500" />
                        </div>

                        {/* Title */}
                        <div className="space-y-2">
                            <h1 className="text-2xl font-bold text-slate-900">
                                Ops! Algo deu errado
                            </h1>
                            <p className="text-slate-600">
                                Já recebemos o relatório e vamos corrigir o mais rápido possível.
                            </p>
                        </div>

                        {/* Buttons */}
                        <div className="flex flex-col gap-3 pt-4">
                            <button
                                onClick={this.handleReload}
                                className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-semibold py-3 px-6 rounded-lg transition-colors duration-200"
                            >
                                Recarregar Página
                            </button>
                            <button
                                onClick={this.handleGoHome}
                                className="w-full bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold py-3 px-6 rounded-lg transition-colors duration-200"
                            >
                                Voltar ao Início
                            </button>
                        </div>

                        {/* Footer hint */}
                        <p className="text-xs text-slate-400 pt-4">
                            Se o problema persistir, entre em contato com o suporte.
                        </p>
                    </div>
                </div>
            );
        }

        return this.props.children;
    }
}

// Export as default
export function AppErrorBoundary({ children }: { children: ReactNode }) {
    return <ErrorBoundaryClass>{children}</ErrorBoundaryClass>;
}

export default AppErrorBoundary;

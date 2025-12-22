// DEV ONLY - Error Reporting Test Page
// This page is only accessible in development mode

import { useState } from 'react';
import { reportError, reportCustomError } from '@/lib/errorReporter';
import { AlertTriangle, Bug, CheckCircle } from 'lucide-react';

export default function ErrorReportingTestPage() {
    const [lastAction, setLastAction] = useState<string>('');

    // Only show in development
    if (import.meta.env.PROD) {
        return (
            <div className="min-h-screen flex items-center justify-center p-4">
                <div className="text-center">
                    <h1 className="text-2xl font-bold text-slate-900">404</h1>
                    <p className="text-slate-600">Page not found</p>
                </div>
            </div>
        );
    }

    const handleThrowError = () => {
        setLastAction('Throwing error...');
        throw new Error('test-report: Manual error throw');
    };

    const handleReportCustom = () => {
        setLastAction('Reporting custom error...');
        reportCustomError('test-report: Custom error message', {
            source: 'react_boundary',
            extra: { test: true }
        });
        setLastAction('Custom error reported!');
    };

    const handleThrowAsync = async () => {
        setLastAction('Throwing async error...');
        await Promise.reject(new Error('test-report: Async error'));
    };

    const handleReportWithContext = () => {
        setLastAction('Reporting error with context...');
        const error = new Error('test-report: Error with extra context');
        reportError(error, {
            source: 'window_error',
            extra: {
                userId: 'test-user-123',
                action: 'button-click',
                timestamp: new Date().toISOString()
            }
        });
        setLastAction('Error with context reported!');
    };

    return (
        <div className="min-h-screen bg-gradient-to-b from-purple-50 to-white p-8">
            <div className="max-w-2xl mx-auto space-y-6">
                {/* Header */}
                <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                    <div className="flex items-center gap-2">
                        <Bug className="w-5 h-5 text-yellow-600" />
                        <h1 className="text-lg font-bold text-yellow-900">
                            Error Reporting Test Page (DEV ONLY)
                        </h1>
                    </div>
                    <p className="text-sm text-yellow-700 mt-2">
                        This page is only accessible in development mode.
                        Use the buttons below to test error reporting.
                    </p>
                </div>

                {/* Status */}
                {lastAction && (
                    <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                        <div className="flex items-center gap-2">
                            <CheckCircle className="w-5 h-5 text-blue-600" />
                            <p className="text-sm text-blue-900">{lastAction}</p>
                        </div>
                    </div>
                )}

                {/* Test Buttons */}
                <div className="bg-white rounded-lg shadow-lg p-6 space-y-4">
                    <h2 className="text-xl font-bold text-slate-900 mb-4">Test Cases</h2>

                    {/* Test 1: Throw Error (ErrorBoundary) */}
                    <div className="border border-slate-200 rounded-lg p-4 space-y-2">
                        <h3 className="font-semibold text-slate-900">1. Throw Error (ErrorBoundary)</h3>
                        <p className="text-sm text-slate-600">
                            Throws an error that will be caught by ErrorBoundary.
                            You should see the premium fallback UI.
                        </p>
                        <button
                            onClick={handleThrowError}
                            className="w-full bg-red-600 hover:bg-red-700 text-white font-semibold py-2 px-4 rounded-lg transition-colors"
                        >
                            <AlertTriangle className="w-4 h-4 inline mr-2" />
                            Throw Error
                        </button>
                    </div>

                    {/* Test 2: Report Custom Error */}
                    <div className="border border-slate-200 rounded-lg p-4 space-y-2">
                        <h3 className="font-semibold text-slate-900">2. Report Custom Error</h3>
                        <p className="text-sm text-slate-600">
                            Reports a custom error without throwing.
                            App continues to work normally.
                        </p>
                        <button
                            onClick={handleReportCustom}
                            className="w-full bg-orange-600 hover:bg-orange-700 text-white font-semibold py-2 px-4 rounded-lg transition-colors"
                        >
                            Report Custom Error
                        </button>
                    </div>

                    {/* Test 3: Async Error */}
                    <div className="border border-slate-200 rounded-lg p-4 space-y-2">
                        <h3 className="font-semibold text-slate-900">3. Unhandled Promise Rejection</h3>
                        <p className="text-sm text-slate-600">
                            Triggers an unhandled promise rejection.
                            Should be caught by global handler.
                        </p>
                        <button
                            onClick={handleThrowAsync}
                            className="w-full bg-purple-600 hover:bg-purple-700 text-white font-semibold py-2 px-4 rounded-lg transition-colors"
                        >
                            Throw Async Error
                        </button>
                    </div>

                    {/* Test 4: Error with Context */}
                    <div className="border border-slate-200 rounded-lg p-4 space-y-2">
                        <h3 className="font-semibold text-slate-900">4. Error with Extra Context</h3>
                        <p className="text-sm text-slate-600">
                            Reports an error with additional metadata.
                            Check the `meta` field in the database.
                        </p>
                        <button
                            onClick={handleReportWithContext}
                            className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-semibold py-2 px-4 rounded-lg transition-colors"
                        >
                            Report with Context
                        </button>
                    </div>
                </div>

                {/* Instructions */}
                <div className="bg-slate-50 border border-slate-200 rounded-lg p-4">
                    <h3 className="font-semibold text-slate-900 mb-2">How to Verify</h3>
                    <ol className="text-sm text-slate-700 space-y-1 list-decimal list-inside">
                        <li>Make sure `VITE_ERROR_REPORTING_ENABLED=true` in `.env`</li>
                        <li>Click a test button above</li>
                        <li>Go to Supabase Dashboard → SQL Editor</li>
                        <li>Run: `SELECT * FROM client_error_reports ORDER BY created_at DESC LIMIT 10;`</li>
                        <li>Verify the error appears in the table</li>
                    </ol>
                </div>
            </div>
        </div>
    );
}

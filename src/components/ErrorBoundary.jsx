import React from 'react';
import { useRouteError, useNavigate } from 'react-router-dom';
import { AlertTriangle, Home, RefreshCw } from 'lucide-react';

const ErrorBoundary = () => {
    const error = useRouteError();
    const navigate = useNavigate();

    console.error('Unhandled Route Error:', error);

    return (
        <div className="min-h-screen bg-black flex items-center justify-center p-6 text-center">
            <div className="max-w-md w-full space-y-6 animate-in fade-in zoom-in duration-300">
                <div className="w-20 h-20 mx-auto bg-red-500/10 rounded-full flex items-center justify-center border border-red-500/20">
                    <AlertTriangle className="w-10 h-10 text-red-500" />
                </div>

                <div className="space-y-2">
                    <h1 className="text-2xl font-bold text-white">Something went wrong</h1>
                    <p className="text-gray-400 text-sm">
                        We encountered an unexpected error. Don't worry, your funds are safe.
                    </p>
                    {process.env.NODE_ENV === 'development' && (
                        <div className="mt-4 p-3 bg-red-900/10 border border-red-900/20 rounded-lg text-left overflow-auto max-h-32">
                            <p className="text-[10px] font-mono text-red-400 break-all">
                                {error?.message || error?.statusText || 'Unknown error'}
                            </p>
                        </div>
                    )}
                </div>

                <div className="flex flex-col gap-3">
                    <button
                        onClick={() => window.location.reload()}
                        className="w-full py-3.5 rounded-xl bg-white/5 border border-white/10 text-white font-bold text-sm flex items-center justify-center gap-2 hover:bg-white/10 transition-all"
                    >
                        <RefreshCw size={18} />
                        Refresh App
                    </button>

                    <button
                        onClick={() => navigate('/')}
                        className="w-full py-3.5 rounded-xl bg-[var(--gold)] text-black font-bold text-sm flex items-center justify-center gap-2 hover:shadow-[0_0_20px_rgba(255,215,0,0.2)] transition-all"
                    >
                        <Home size={18} />
                        Return Home
                    </button>
                </div>
            </div>
        </div>
    );
};

export default ErrorBoundary;

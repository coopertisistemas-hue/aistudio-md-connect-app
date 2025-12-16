import QRCode from 'react-qr-code';
import { Copy, ExternalLink, Share2 } from 'lucide-react';

export function DesktopOverlay() {
    const currentUrl = window.location.href;
    const isDev = import.meta.env.DEV;
    const searchParams = new URLSearchParams(window.location.search);
    const forceDesktop = searchParams.get('desktop') === '1';

    // If in Development and NOT forced, do not block (return nothing)
    // Also do not block if on Landing Page
    const isLanding = window.location.pathname.startsWith('/landing');
    if ((isDev && !forceDesktop) || isLanding) {
        return null;
    }

    const copyToClipboard = () => {
        navigator.clipboard.writeText(currentUrl);
        alert('Link copiado!');
    };

    const openInNewTab = () => {
        window.open(currentUrl, '_blank');
    };



    const shareWhatsApp = () => {
        const text = `Acesse o App MD Connect: ${currentUrl}`;
        const waUrl = `https://wa.me/?text=${encodeURIComponent(text)}`;
        window.open(waUrl, '_blank');
    };

    return (
        <div className="hidden md:flex fixed inset-0 z-50 bg-white flex-col justify-center items-center p-8 text-center text-gray-900">
            <div className="max-w-md w-full flex flex-col items-center">

                <div className="h-20 w-20 rounded-full overflow-hidden mb-6 shadow-xl">
                    <img src="/logo-md.png" alt="MD" className="w-full h-full object-cover" />
                </div>

                <h1 className="text-3xl font-bold mb-4 text-slate-900 font-heading">MD Connect</h1>
                <h2 className="text-xl font-medium mb-4 text-slate-500">Abra no celular 📱</h2>

                <p className="text-lg text-gray-600 mb-8 leading-relaxed">
                    Este app foi feito para uso exclusivo no smartphone, para uma experiência mais rápida e fácil.
                </p>

                <div className="bg-white p-4 rounded-2xl border border-gray-200 shadow-lg mb-8">
                    <QRCode value={currentUrl} size={200} />
                </div>

                <div className="flex flex-col gap-3 w-full max-w-xs">
                    <button
                        onClick={copyToClipboard}
                        className="flex items-center justify-center gap-2 w-full bg-gray-100 hover:bg-gray-200 text-gray-900 py-3 px-4 rounded-xl transition-colors font-medium active:scale-95 duration-200"
                    >
                        <Copy size={18} />
                        Copiar link
                    </button>

                    <button
                        onClick={openInNewTab}
                        className="flex items-center justify-center gap-2 w-full bg-gray-100 hover:bg-gray-200 text-gray-900 py-3 px-4 rounded-xl transition-colors font-medium active:scale-95 duration-200"
                    >
                        <ExternalLink size={18} />
                        Abrir URL
                    </button>

                    <button
                        onClick={shareWhatsApp}
                        className="flex items-center justify-center gap-2 w-full bg-[#25D366] hover:bg-[#128C7E] text-white py-3 px-4 rounded-xl transition-colors font-medium active:scale-95 duration-200"
                    >
                        <Share2 size={18} />
                        Enviar no WhatsApp
                    </button>
                </div>

            </div>
        </div>
    );
}

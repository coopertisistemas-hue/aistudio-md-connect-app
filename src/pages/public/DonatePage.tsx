import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Heart, Copy, CheckCircle, MessageCircle, ChevronRight, Info, QrCode } from 'lucide-react';
import { APP_ROUTES, EXTERNAL_LINKS } from '@/lib/routes';
import { toast } from 'sonner';
import QRCode from 'react-qr-code'; // Ensure this matches package.json
import { PixPayload } from '@/lib/pix';

const SUGGESTED_VALUES = [
    { label: 'R$ 1', value: 1.00 },
    { label: 'R$ 5', value: 5.00 },
    { label: 'R$ 10', value: 10.00 },
    { label: 'R$ 30', value: 30.00 },
    { label: 'R$ 50', value: 50.00 },
    { label: 'R$ 100', value: 100.00 },
];

const DonatePage: React.FC = () => {
    const navigate = useNavigate();
    const pixKey = "projetomomentodevocional@gmail.com";
    const recipientName = "JOSE ALEXANDRE F DE SANTANA";
    const recipientCity = "BRASIL";
    const txid = "MDCONNECT";

    // State
    const [selectedValue, setSelectedValue] = useState<number | null>(null);
    const [customValue, setCustomValue] = useState<string>('');
    const [isCustom, setIsCustom] = useState(false);
    const [brCode, setBrCode] = useState('');

    // Values Logic
    const currentAmount = isCustom
        ? (parseFloat(customValue.replace(',', '.')) || 0)
        : (selectedValue || 0);

    // PIX Generation
    useEffect(() => {
        try {
            const payload = new PixPayload(pixKey, recipientName, recipientCity, txid, currentAmount > 0 ? currentAmount : null);
            setBrCode(payload.generate());
        } catch (e) {
            console.error("PIX Generation Error", e);
        }
    }, [currentAmount]);

    // Handlers
    const handleValueSelect = (val: number) => {
        setSelectedValue(val);
        setCustomValue('');
        setIsCustom(false);
    };

    const handleCustomChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const val = e.target.value.replace(/[^0-9,]/g, ''); // Basic Mask
        setCustomValue(val);
        setIsCustom(true);
        setSelectedValue(null);
    };

    const copyPixKey = () => {
        navigator.clipboard.writeText(pixKey);
        toast.success("Chave E-mail copiada!");
    };

    const copyBrCode = () => {
        if (!brCode) return;
        navigator.clipboard.writeText(brCode);
        toast.success("Código 'Copia e Cola' copiado!");
    };



    return (
        <div className="space-y-8 animate-in fade-in duration-500 max-w-md mx-auto px-4 pt-6">
            {/* Local Back Button Removed (Handled by PublicLayout) */}

            {/* Title */}
            <h2 className="text-xl font-bold text-slate-800 text-center pt-0">Contribuição Voluntária</h2>

            {/* HERO SECTION */}
            <div className="text-center space-y-4">
                <div className="w-16 h-16 bg-rose-50 rounded-full flex items-center justify-center mx-auto shadow-sm border border-rose-100">
                    <Heart className="w-8 h-8 text-rose-500 fill-rose-500" />
                </div>
                <div>
                    <h1 className="text-2xl font-bold text-slate-900 tracking-tight">Apoie este Projeto</h1>
                    <p className="text-slate-500 text-sm leading-relaxed max-w-xs mx-auto">
                        Sua contribuição ajuda a manter a tecnologia no ar e alcançar mais vidas.
                    </p>
                </div>
            </div>

            {/* VALUE SELECTION */}
            <div className="space-y-3">
                <h3 className="text-sm font-bold text-slate-700 uppercase tracking-wide px-1 text-center">Escolha um valor</h3>

                {/* Grid */}
                <div className="grid grid-cols-3 gap-3">
                    {SUGGESTED_VALUES.map((item) => (
                        <button
                            key={item.value}
                            onClick={() => handleValueSelect(item.value)}
                            className={`h-12 rounded-xl text-sm font-bold border transition-all active:scale-95 ${selectedValue === item.value && !isCustom
                                ? 'bg-rose-600 text-white border-rose-600 shadow-md shadow-rose-600/20'
                                : 'bg-white text-slate-600 border-slate-200 hover:border-rose-200 hover:bg-rose-50'
                                }`}
                        >
                            {item.label}
                        </button>
                    ))}
                </div>

                {/* Custom Input */}
                <div className={`relative flex items-center bg-white border rounded-xl overflow-hidden h-12 transition-colors ${isCustom ? 'border-rose-500 ring-1 ring-rose-200' : 'border-slate-200'}`}>
                    <span className="pl-4 text-slate-400 font-medium text-sm">R$</span>
                    <input
                        type="text"
                        placeholder="Outro valor (0,00)"
                        value={customValue}
                        onChange={handleCustomChange}
                        onFocus={() => { setIsCustom(true); setSelectedValue(null); }}
                        className="flex-1 h-full px-2 text-slate-900 font-bold outline-none placeholder:text-slate-300 placeholder:font-normal"
                    />
                </div>

                {/* "No Value" Toggle */}
                <div className="flex justify-center">
                    <button
                        onClick={() => { setSelectedValue(null); setCustomValue(''); setIsCustom(false); }}
                        className={`text-xs font-medium px-4 py-2 rounded-full transition-colors ${currentAmount === 0 ? 'bg-slate-100 text-slate-600' : 'text-slate-400 hover:text-slate-600'}`}
                    >
                        Prefiro definir o valor no App do banco
                    </button>
                </div>
            </div>

            {/* PIX BLOCK (PREMIUM) */}
            <Card className="border-rose-100 shadow-lg shadow-rose-900/5 overflow-hidden">
                <CardContent className="p-0">
                    <div className="bg-gradient-to-b from-rose-50/50 to-transparent p-6 text-center space-y-6">

                        {/* QR Code Display */}
                        <div className="bg-white p-4 rounded-2xl shadow-sm border border-rose-100 inline-block">
                            {brCode ? (
                                <div className="h-48 w-48 mx-auto flex items-center justify-center">
                                    <QRCode value={brCode} size={192} style={{ height: "auto", maxWidth: "100%", width: "100%" }} viewBox={`0 0 256 256`} />
                                </div>
                            ) : (
                                <div className="h-48 w-48 bg-slate-50 rounded-lg flex items-center justify-center text-slate-300">
                                    <p className="text-xs px-4">Gerando QR Code...</p>
                                </div>
                            )}
                        </div>

                        {/* Copy Code Section */}
                        <div className="space-y-3">
                            <div className="flex items-center justify-center gap-2 text-rose-600">
                                <QrCode className="w-4 h-4" />
                                <p className="text-xs font-bold uppercase tracking-wider">PIX Copia e Cola</p>
                            </div>

                            {/* Readonly Input for Visual Verification */}
                            <div className="relative">
                                <input
                                    readOnly
                                    value={brCode}
                                    className="w-full bg-slate-50 border border-slate-200 rounded-lg py-2 px-3 text-[10px] text-slate-500 font-mono truncate cursor-text"
                                />
                            </div>

                            <Button
                                onClick={copyBrCode}
                                className="w-full bg-slate-800 hover:bg-slate-900 text-white rounded-xl h-12 font-bold shadow-lg shadow-slate-900/10 active:scale-[0.98] transition-all"
                            >
                                <Copy className="mr-2 h-4 w-4" />
                                Copiar código PIX
                            </Button>

                            <div className="relative flex items-center py-2">
                                <div className="flex-grow border-t border-slate-200"></div>
                                <span className="flex-shrink-0 mx-4 text-slate-300 text-xs font-bold uppercase">Ou use a chave</span>
                                <div className="flex-grow border-t border-slate-200"></div>
                            </div>

                            <Button
                                variant="outline"
                                onClick={copyPixKey}
                                className="w-full border-rose-200 text-rose-600 hover:bg-rose-50 hover:text-rose-700 rounded-xl h-11 font-bold active:scale-[0.98] transition-all"
                            >
                                <Copy className="mr-2 h-4 w-4" />
                                Copiar chave E-mail
                            </Button>
                        </div>
                    </div>

                    <div className="bg-slate-50 px-6 py-4 border-t border-rose-100/50">
                        <div className="flex gap-3 items-start">
                            <Info className="w-4 h-4 text-slate-400 shrink-0 mt-0.5" />
                            <p className="text-xs text-slate-500 leading-relaxed">
                                Ao confirmar o PIX, o recebedor aparecerá como: <span className="font-semibold text-slate-700">José Alexandre F. de Santana</span>.
                            </p>
                        </div>
                    </div>
                </CardContent>
            </Card>

            {/* INVESTMENT SECTION */}
            <div className="space-y-4">
                <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wide px-1">Onde investimos?</h3>
                <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
                    {[
                        "Servidores e Infraestrutura de Nuvem",
                        "Desenvolvimento e melhorias no App",
                        "Produção de conteúdo devocional",
                        "Manutenção técnica contínua"
                    ].map((item, i) => (
                        <div key={i} className="flex items-center gap-3 p-4 border-b border-slate-50 last:border-0 hover:bg-slate-50/50 transition-colors">
                            <div className="w-6 h-6 rounded-full bg-emerald-50 flex items-center justify-center shrink-0">
                                <CheckCircle className="w-3.5 h-3.5 text-emerald-600" />
                            </div>
                            <span className="text-sm font-medium text-slate-700">{item}</span>
                        </div>
                    ))}
                </div>
            </div>

            {/* TRANSPARENCY SECTION */}
            <div className="bg-white rounded-2xl p-5 border border-slate-100 shadow-sm flex items-center justify-between gap-4">
                <div className="space-y-1">
                    <h3 className="font-bold text-slate-900 text-sm">Transparência</h3>
                    <p className="text-xs text-slate-500 leading-snug">Publicamos atualizações e prestação de contas do projeto.</p>
                </div>
                <Button
                    variant="outline"
                    size="sm"
                    onClick={() => navigate(APP_ROUTES.TRANSPARENCY)}
                    className="h-9 text-xs font-bold border-slate-200 hover:bg-slate-50"
                >
                    Ver <ChevronRight className="ml-1 w-3 h-3" />
                </Button>
            </div>

            {/* HELP SECTION */}
            <div className="text-center pt-4 pb-2">
                <h3 className="text-sm font-bold text-slate-900 mb-1">Precisa falar com a equipe?</h3>
                <p className="text-xs text-slate-500 mb-4 px-4">
                    Se tiver dúvidas sobre doação ou parceria, chame no WhatsApp.
                </p>
                <Button
                    variant="ghost"
                    onClick={() => window.open(EXTERNAL_LINKS.DONATION_SUPPORT, '_blank')}
                    className="text-green-600 hover:text-green-700 hover:bg-green-50 font-bold text-sm h-10"
                >
                    <MessageCircle className="w-4 h-4 mr-2" />
                    Falar no WhatsApp
                </Button>
            </div>
        </div>
    );
};

export default DonatePage;


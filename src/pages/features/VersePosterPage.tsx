
import { useState, useRef, useEffect } from 'react';

import { Button } from '@/components/ui/button';
import { Download, Share2, Image, RefreshCcw, Wand2 } from 'lucide-react';
import { toast } from 'sonner';
import { analytics } from '@/lib/analytics';
import { FLAGS } from '@/lib/flags';
import { InternalPageLayout } from '@/components/layout/InternalPageLayout';
import { versePostersApi } from '@/lib/api/versePosters';

// Template Definitions
const TEMPLATES = [
    {
        id: 'gradient-sunset',
        name: 'Sunset',
        background: 'linear-gradient(135deg, #f6d365 0%, #fda085 100%)',
        textColor: '#ffffff',
        accentColor: 'rgba(255,255,255,0.8)',
        fontFamily: 'serif'
    },
    {
        id: 'midnight-blue',
        name: 'Midnight',
        background: 'linear-gradient(to top, #1e3c72 0%, #2a5298 100%)',
        textColor: '#ffffff',
        accentColor: 'rgba(255,255,255,0.7)',
        fontFamily: 'sans-serif'
    },
    {
        id: 'clean-slate',
        name: 'Clean',
        background: '#f8fafc',
        textColor: '#1e293b',
        accentColor: '#64748b',
        fontFamily: 'serif'
    },
    {
        id: 'royal-purple',
        name: 'Royal',
        background: 'linear-gradient(to right, #6a11cb 0%, #2575fc 100%)',
        textColor: '#ffffff',
        accentColor: 'rgba(255,255,255,0.8)',
        fontFamily: 'sans-serif'
    }
];

export default function VersePosterPage() {
    const [verse, setVerse] = useState('Porque Deus amou o mundo de tal maneira que deu o seu Filho unigênito, para que todo aquele que nele crê não pereça, mas tenha a vida eterna.');
    const [reference, setReference] = useState('João 3:16');
    const [selectedTemplate, setSelectedTemplate] = useState(TEMPLATES[0]);
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const [isGenerating, setIsGenerating] = useState(false);

    // AI State
    const [aiImageUrl, setAiImageUrl] = useState<string | null>(null);
    const [isAiLoading, setIsAiLoading] = useState(false);
    const [bgImage, setBgImage] = useState<HTMLImageElement | null>(null);

    // Load Image when URL changes
    useEffect(() => {
        if (!aiImageUrl) {
            setBgImage(null);
            return;
        }
        const img = new window.Image();
        img.crossOrigin = "anonymous";
        img.src = aiImageUrl;
        img.onload = () => setBgImage(img);
    }, [aiImageUrl]);

    // Draw Canvas whenever inputs change
    useEffect(() => {
        drawCanvas();
    }, [verse, reference, selectedTemplate, bgImage]);

    const drawCanvas = () => {
        const canvas = canvasRef.current;
        if (!canvas) return;
        const ctx = canvas.getContext('2d');
        if (!ctx) return;

        // Canvas Settings (High Res for Crisp Text)
        // const scale = 2; // Retina Support (Unused currently, logic relies on hardcoded width/height)
        const width = 1080;
        const height = 1350; // 4:5 Aspect Ratio (Social Media Optimized)

        canvas.width = width;
        canvas.height = height;

        // 1. Background
        if (bgImage) {
            // Draw Image (Cover)
            const imgRatio = bgImage.width / bgImage.height;
            const canvasRatio = width / height;
            let drawWidth = width;
            let drawHeight = height;
            let offsetX = 0;
            let offsetY = 0;

            if (imgRatio > canvasRatio) {
                drawWidth = height * imgRatio;
                offsetX = (width - drawWidth) / 2;
            } else {
                drawHeight = width / imgRatio;
                offsetY = (height - drawHeight) / 2;
            }

            ctx.drawImage(bgImage, offsetX, offsetY, drawWidth, drawHeight);

            // Add subtle overlay to ensure text contrast on AI images
            ctx.fillStyle = 'rgba(0,0,0,0.3)';
            ctx.fillRect(0, 0, width, height);

        } else {
            // Template Gradient/Color
            const gradient = ctx.createLinearGradient(0, 0, width, height);
            if (selectedTemplate.id === 'gradient-sunset') {
                gradient.addColorStop(0, '#f6d365');
                gradient.addColorStop(1, '#fda085');
                ctx.fillStyle = gradient;
            } else if (selectedTemplate.id === 'midnight-blue') {
                gradient.addColorStop(0, '#1e3c72');
                gradient.addColorStop(1, '#2a5298');
                ctx.fillStyle = gradient;
            } else if (selectedTemplate.id === 'royal-purple') {
                gradient.addColorStop(0, '#6a11cb');
                gradient.addColorStop(1, '#2575fc');
                ctx.fillStyle = gradient;
            } else {
                ctx.fillStyle = selectedTemplate.background; // Solid Color
            }
            ctx.fillRect(0, 0, width, height);
        }

        // 2. Padding & Layout
        const padding = 100;
        const effectiveWidth = width - (padding * 2);

        // 3. Text Implementation (Verse)
        ctx.fillStyle = selectedTemplate.textColor;
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        // Shadow for better legibility on images
        ctx.shadowColor = 'rgba(0,0,0,0.5)';
        ctx.shadowBlur = bgImage ? 20 : 0;
        ctx.shadowOffsetX = 0;
        ctx.shadowOffsetY = bgImage ? 4 : 0;

        // Dynamic Font Sizing
        let fontSize = 90;
        ctx.font = `bold ${fontSize}px ${selectedTemplate.fontFamily === 'serif' ? 'Georgia, serif' : 'Inter, sans-serif'}`;

        // Simple Word Wrap Logic
        const words = verse.split(' ');
        let lines = [];
        let currentLine = words[0];

        for (let i = 1; i < words.length; i++) {
            const word = words[i];
            const width = ctx.measureText(currentLine + " " + word).width;
            if (width < effectiveWidth) {
                currentLine += " " + word;
            } else {
                lines.push(currentLine);
                currentLine = word;
            }
        }
        lines.push(currentLine);

        // Auto-scale font down if too many lines
        while (lines.length * (fontSize * 1.4) > height / 2 && fontSize > 40) {
            fontSize -= 5;
            ctx.font = `bold ${fontSize}px ${selectedTemplate.fontFamily === 'serif' ? 'Georgia, serif' : 'Inter, sans-serif'}`;
            // Re-wrap with new font size
            lines = [];
            currentLine = words[0];
            for (let i = 1; i < words.length; i++) {
                const word = words[i];
                const width = ctx.measureText(currentLine + " " + word).width;
                if (width < effectiveWidth) {
                    currentLine += " " + word;
                } else {
                    lines.push(currentLine);
                    currentLine = word;
                }
            }
            lines.push(currentLine);
        }

        // Draw Lines (Centered Vertically)
        const lineHeight = fontSize * 1.4;
        const totalTextHeight = lines.length * lineHeight;
        let startY = (height / 2) - (totalTextHeight / 2) - 50;

        // --- NEW: Halo/Mist Overlay for Legibility ---
        if (bgImage) {
            const centerX = width / 2;
            const centerY = startY + (totalTextHeight / 2);

            // Radius covers the text area generously
            const radius = Math.max(effectiveWidth, totalTextHeight) * 0.8;

            // Create Radial Gradient
            const gradient = ctx.createRadialGradient(centerX, centerY, 0, centerX, centerY, radius);

            // Color logic: "Black mist" if text is white (most cases), "White mist" if text is dark
            // Since our templates default to white text on generated images (as we force solid backgrounds logic usually), 
            // but AI generation uses user selected template color, we should check `selectedTemplate.textColor`.
            // For AI generated images, we usually want White Text.
            // Let's assume best practice for AI images is Dark Halo + White Text.

            // "Premium Halo": Very subtle in center, fades out.
            // 0.4 opacity at center, 0 at edge.
            gradient.addColorStop(0, 'rgba(0, 0, 0, 0.5)');
            gradient.addColorStop(0.5, 'rgba(0, 0, 0, 0.3)');
            gradient.addColorStop(1, 'rgba(0, 0, 0, 0)');

            ctx.fillStyle = gradient;
            // Draw a rect covering the central area or full canvas? 
            // Full canvas fill with radial gradient centered on text looks best and smoothest.
            ctx.fillStyle = gradient;
            ctx.fillRect(0, 0, width, height);

            // Ensure text is white for contrast against dark halo
            ctx.fillStyle = '#ffffff';
        }

        lines.forEach((line) => {
            ctx.fillText(line, width / 2, startY);
            startY += lineHeight;
        });

        // Reset shadow for footer
        ctx.shadowBlur = 0;
        ctx.shadowOffsetY = 0;

        // 4. Reference
        const refFontSize = 50;
        ctx.font = `italic ${refFontSize}px ${selectedTemplate.fontFamily === 'serif' ? 'Georgia, serif' : 'Inter, sans-serif'}`;
        ctx.fillStyle = selectedTemplate.accentColor;
        ctx.fillText(reference, width / 2, startY + 40);

        // 5. Footer Branding (Modified to standard watermark)
        const footerY = height - 80;
        ctx.font = `500 30px sans-serif`;
        ctx.fillStyle = selectedTemplate.accentColor;
        ctx.globalAlpha = 0.7;
        ctx.fillText("@projetomomentodevocional", width / 2, footerY);
        ctx.globalAlpha = 1.0;
    };

    const handleGenerateAI = async () => {
        setIsAiLoading(true);
        try {
            // Pick a random style for variety (or let user pick later, for now random from whitelist)
            const styles = ['minimal_premium', 'cinematic_light', 'soft_illustration', 'watercolor', 'nature_symbolic'];
            const randomStyle = styles[Math.floor(Math.random() * styles.length)] as any;

            const response = await versePostersApi.generateImage({
                verse_text: verse,
                reference: reference,
                style: randomStyle
            });

            setAiImageUrl(response.image_url);
            toast.success(response.cached ? "Imagem carregada (Cache)" : "Novo fundo gerado com IA!");
            analytics.track({ name: 'feature_usage', element: 'verse_poster_ai_generate', context: 'member' });
        } catch (error) {
            toast.error("Erro ao gerar fundo. Tente novamente.");
            console.error(error);
        } finally {
            setIsAiLoading(false);
        }
    };

    const handleDownload = () => {
        setIsGenerating(true);
        const canvas = canvasRef.current;
        if (!canvas) return;

        // Add small delay to simulate processing and give user feedback
        setTimeout(() => {
            try {
                const link = document.createElement('a');
                link.download = `versiculo-md-${Date.now()}.png`;
                link.href = canvas.toDataURL('image/png');
                link.click();
                toast.success("Imagem baixada com sucesso!");
                analytics.track({ name: 'feature_usage', element: 'verse_poster_download', context: 'member' });
            } catch (e) {
                toast.error("Erro ao baixar. Tente em outro navegador.");
            } finally {
                setIsGenerating(false);
            }
        }, 500);
    };

    const handleShare = async () => {
        setIsGenerating(true);
        const canvas = canvasRef.current;
        if (!canvas) return;

        setTimeout(async () => {
            try {
                const blob = await new Promise<Blob | null>(resolve => canvas.toBlob(resolve, 'image/png'));
                if (!blob) throw new Error('Blob creation failed');

                const file = new File([blob], 'versiculo.png', { type: 'image/png' });

                if (navigator.share && navigator.canShare({ files: [file] })) {
                    await navigator.share({
                        title: 'Versículo do Dia',
                        text: `${verse} - ${reference}\nCompartilhado via MD Connect`,
                        files: [file]
                    });
                    analytics.track({ name: 'feature_usage', element: 'verse_poster_share', context: 'member' });
                } else {
                    toast.error("Seu navegador não suporta compartilhamento direto. Use a opção Baixar.");
                }
            } catch (e) {
                console.error(e);
                toast.error("Erro ao compartilhar.");
            } finally {
                setIsGenerating(false);
            }
        }, 500);
    };

    if (!FLAGS.FEATURE_VERSE_POSTER_V1) return null;

    return (
        <InternalPageLayout
            title="Poster do Versículo"
            subtitle="Crie e compartilhe uma arte com a Palavra."
            icon={Image}
            iconClassName="text-indigo-600"
            backPath="/home"
        >
            <main className="container max-w-lg mx-auto px-5">

                {/* Input Area */}
                <div className="space-y-4 mb-8">
                    <div>
                        <label className="block text-xs font-bold text-slate-700 mb-1 ml-1">Versículo</label>
                        <textarea
                            value={verse}
                            onChange={(e) => setVerse(e.target.value)}
                            maxLength={300}
                            className="w-full p-4 rounded-xl border border-slate-200 bg-white font-medium text-slate-900 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 resize-none h-32"
                            placeholder="Digite o versículo..."
                        />
                    </div>
                    <div>
                        <label className="block text-xs font-bold text-slate-700 mb-1 ml-1">Referência</label>
                        <input
                            value={reference}
                            onChange={(e) => setReference(e.target.value)}
                            className="w-full px-4 py-3 rounded-xl border border-slate-200 bg-white font-medium text-slate-900 focus:outline-none focus:ring-2 focus:ring-indigo-500/20"
                            placeholder="Ex: João 3:16"
                        />
                    </div>
                </div>

                {/* Template Selection */}
                <div className="mb-8">
                    <div className="flex items-center justify-between mb-2">
                        <label className="text-xs font-bold text-slate-700 ml-1">Escolha um estilo</label>
                        {/* Sprint 7: AI Generation */}
                        {FLAGS.FEATURE_VERSE_POSTER_AI_BG && (
                            <Button
                                variant="outline"
                                size="sm"
                                onClick={() => handleGenerateAI()}
                                disabled={isAiLoading || isGenerating}
                                className={`text-xs h-7 gap-1.5 border-indigo-200 text-indigo-700 hover:bg-indigo-50 hover:text-indigo-800 ${aiImageUrl ? 'bg-indigo-50 border-indigo-300' : ''}`}
                            >
                                {isAiLoading ? <RefreshCcw className="w-3 h-3 animate-spin" /> : <Wand2 className="w-3 h-3" />}
                                {aiImageUrl ? 'Gerar Outro' : 'Criar Fundo com IA'}
                            </Button>
                        )}
                    </div>

                    <div className="flex gap-3 overflow-x-auto pb-2 scrollbar-none">
                        {/* Standard Templates */}
                        {TEMPLATES.map(t => (
                            <button
                                key={t.id}
                                onClick={() => {
                                    setSelectedTemplate(t);
                                    setAiImageUrl(null); // Reset AI image when picking a preset
                                }}
                                className={`w-16 h-16 rounded-xl flex-shrink-0 border-2 transition-all relative overflow-hidden ${selectedTemplate.id === t.id && !aiImageUrl ? 'border-slate-900 scale-105 shadow-md' : 'border-transparent opacity-70 hover:opacity-100'}`}
                                style={{ background: t.background }}
                                title={t.name}
                            />
                        ))}
                    </div>
                </div>

                {/* Preview & Canvas */}
                <div className="mb-8 flex justify-center">
                    <div className="relative shadow-xl rounded-2xl overflow-hidden border border-slate-200 bg-white">
                        {/* The Actual Canvas (Hidden but functional? No, we show it scaled down) */}
                        <canvas
                            ref={canvasRef}
                            style={{
                                width: '100%',
                                maxWidth: '300px',
                                height: 'auto',
                                display: 'block'
                            }}
                            className="bg-white"
                        />
                    </div>
                </div>

                {/* Actions */}
                <div className="grid grid-cols-2 gap-4">
                    <Button
                        onClick={handleDownload}
                        disabled={isGenerating}
                        className="h-14 bg-slate-900 hover:bg-slate-800 text-white rounded-xl font-bold shadow-lg shadow-slate-900/10"
                    >
                        {isGenerating ? <RefreshCcw className="animate-spin w-5 h-5" /> : <Download className="w-5 h-5 mr-2" />}
                        Baixar
                    </Button>
                    <Button
                        onClick={handleShare}
                        disabled={isGenerating}
                        className="h-14 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl font-bold shadow-lg shadow-indigo-900/10"
                    >
                        {isGenerating ? <RefreshCcw className="animate-spin w-5 h-5" /> : <Share2 className="w-5 h-5 mr-2" />}
                        Compartilhar
                    </Button>
                </div>
            </main>
        </InternalPageLayout>
    );
}

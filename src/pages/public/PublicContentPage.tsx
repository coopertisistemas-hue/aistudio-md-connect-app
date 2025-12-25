import { useEffect, useState } from 'react';
import { PublicApi, type PublicPage } from '@/lib/api/public'; // Assuming this exists from previous step
import { Loader2, AlertCircle, FileText } from 'lucide-react';
import { InternalPageLayout } from '@/components/layout/InternalPageLayout';

interface PublicContentPageProps {
    slug?: string; // Optional: if used as a standalone component
}

export default function PublicContentPage({ slug: propSlug }: PublicContentPageProps) {
    // If slug is passed as prop, use it. Otherwise try to get from URL params if configured that way.
    // Ideally this component is used like <PublicContentPage slug="privacy" /> inside a specific route wrapper,
    // OR mapped to a dynamic route /p/:slug.
    // For now, let's assume it might receive a prop or we fall back to something else, but prop is safest for the fixed routes (Terms, Privacy).

    const [page, setPage] = useState<PublicPage | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(false);

    const activeSlug = propSlug;

    useEffect(() => {
        let isMounted = true;

        const fetchPage = async () => {
            if (!activeSlug) return;

            setIsLoading(true);
            setError(false);

            try {
                const data = await PublicApi.getPage(activeSlug);
                if (isMounted) {
                    if (data) {
                        setPage(data);
                    } else {
                        setError(true);
                    }
                }
            } catch (err) {
                if (isMounted) setError(true);
            } finally {
                if (isMounted) setIsLoading(false);
            }
        };

        fetchPage();

        return () => { isMounted = false; };
    }, [activeSlug]);

    if (!activeSlug) return null;

    // --- STATES ---

    if (isLoading) {
        return (
            <div className="min-h-[60vh] flex flex-col items-center justify-center text-slate-400">
                <Loader2 className="w-8 h-8 animate-spin mb-4 text-slate-300" />
                <p className="text-sm font-medium animate-pulse">Carregando conteúdo...</p>
            </div>
        );
    }

    if (error || !page) {
        return (
            <div className="min-h-[60vh] flex flex-col items-center justify-center px-6 text-center">
                <div className="w-16 h-16 bg-red-50 text-red-400 rounded-full flex items-center justify-center mb-4">
                    <AlertCircle className="w-8 h-8" />
                </div>
                <h2 className="text-lg font-bold text-slate-800 mb-2">Conteúdo indisponível</h2>
                <p className="text-slate-500 text-sm max-w-xs mx-auto">
                    Não conseguimos carregar esta página no momento. Pode ser que ela ainda não tenha sido publicada.
                </p>
            </div>
        );
    }

    // --- SUCCESS RENDER ---

    return (
        <InternalPageLayout
            title="Conteúdo"
            subtitle="Acesse conteúdos públicos e compartilhe."
            icon={FileText}
            iconClassName="text-slate-600"
            backPath="/home"
        >
            {/* Content Section */}
            <div className="max-w-2xl mx-auto px-4">
                <div className="bg-white rounded-2xl p-6 md:p-10 shadow-sm border border-slate-100">
                    <SimpleMarkdown content={page.content} />
                </div>

                {/* Footer Note */}
                <div className="mt-8 text-center text-[10px] text-slate-400 uppercase tracking-widest">
                    MD Connect • Documento Oficial
                </div>
            </div>
        </InternalPageLayout>
    );
}

// --- Simple Markdown Renderer (Premium Style) ---
// Handles headers, lists, paragraphs, and bold/italic simple syntax
function SimpleMarkdown({ content }: { content: string }) {
    if (!content) return null;

    // Split by double newline to separate blocks
    const blocks = content.split(/\n\n+/);

    return (
        <div className="space-y-6 text-slate-700 leading-relaxed font-sans">
            {blocks.map((block, index) => {
                const trimmed = block.trim();

                // H1/H2 (## )
                if (trimmed.startsWith('## ')) {
                    return (
                        <h2 key={index} className="text-lg font-bold text-slate-900 mt-4 mb-2 border-b border-slate-100 pb-2">
                            {trimmed.replace(/^##\s+/, '')}
                        </h2>
                    );
                }

                // H3 (### )
                if (trimmed.startsWith('### ')) {
                    return (
                        <h3 key={index} className="text-base font-bold text-slate-800 mt-2">
                            {trimmed.replace(/^###\s+/, '')}
                        </h3>
                    );
                }

                // H1 (# ) - fallback, though usually we use H2 for logical content sections
                if (trimmed.startsWith('# ')) {
                    return (
                        <h2 key={index} className="text-xl font-bold text-slate-900 mt-6 mb-3">
                            {trimmed.replace(/^#\s+/, '')}
                        </h2>
                    );
                }

                // Bullet List (- or *)
                if (trimmed.startsWith('- ') || trimmed.startsWith('* ')) {
                    const items = trimmed.split(/\n/).map(line => line.replace(/^[-*]\s+/, ''));
                    return (
                        <ul key={index} className="space-y-2 my-2">
                            {items.map((item, i) => (
                                <li key={i} className="flex items-start gap-2 text-sm text-slate-600">
                                    <span className="text-slate-300 mt-1.5">•</span>
                                    <span dangerouslySetInnerHTML={{ __html: parseInline(item) }} />
                                </li>
                            ))}
                        </ul>
                    );
                }

                // Numbered List (1. )
                if (/^\d+\.\s/.test(trimmed)) {
                    const items = trimmed.split(/\n/).map(line => line.replace(/^\d+\.\s+/, ''));
                    return (
                        <ol key={index} className="space-y-2 list-decimal list-inside text-sm text-slate-600 my-2 pl-2">
                            {items.map((item, i) => (
                                <li key={i} dangerouslySetInnerHTML={{ __html: parseInline(item) }} />
                            ))}
                        </ol>
                    );
                }

                // Paragraph
                return (
                    <p
                        key={index}
                        className="text-sm md:text-base text-slate-600 loading-relaxed"
                        dangerouslySetInnerHTML={{ __html: parseInline(trimmed) }}
                    />
                );
            })}
        </div>
    );
}

// Simple inline parser for **bold** and *italic*
function parseInline(text: string): string {
    let result = text
        .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
        .replace(/__(.*?)__/g, '<strong>$1</strong>')
        .replace(/\*(.*?)\*/g, '<em>$1</em>')
        .replace(/_(.*?)_/g, '<em>$1</em>')
        // Basic link support [text](url)
        .replace(/\[(.*?)\]\((.*?)\)/g, '<a href="$2" class="text-blue-600 hover:underline" target="_blank" rel="noopener noreferrer">$1</a>');

    // Convert newlines to breaks if they exist within a block (unlikely with our split logic but good for safety)
    result = result.replace(/\n/g, '<br />');

    return result;
}

import { Share2 } from 'lucide-react';
import { toast } from 'sonner';
import { analytics } from '@/lib/analytics';

interface DevotionalShareButtonProps {
    id: string;
    title: string;
    subtitle?: string;
    verseKey?: string;
    coverUrl?: string | null;
}

export function DevotionalShareButton({ id, title, subtitle, verseKey, coverUrl }: DevotionalShareButtonProps) {

    const handleShare = async () => {
        // Construct standard share data
        const shareUrl = `${window.location.origin}/share/devocional/${id}`;

        // Formatting text for WhatsApp (Bold title, Italic verse)
        // Note: WhatsApp supports *bold* and _italic_
        const textParts = [
            `*${title}*`, // Bold Title
            subtitle ? `_${subtitle}_` : '',
            verseKey ? `\n"${verseKey}"` : '',
            `\nLeia mais e ouça em: ${shareUrl}`
        ].filter(Boolean);

        const shareText = textParts.join('\n');

        try {
            // Check if Web Share API is supported
            if (navigator.share) {
                const shareData: ShareData = {
                    title: title,
                    text: shareText,
                    url: shareUrl // Some apps ignore this if files are present, but good to have
                };

                // Feature: Share Image if available and supported
                if (coverUrl && navigator.canShare) {
                    try {
                        // We need to fetch the image and convert to File
                        // Note: CORS must be enabled on the image source (Supabase Storage usually handles this)
                        const response = await fetch(coverUrl);
                        const blob = await response.blob();
                        const file = new File([blob], 'devocional-cover.png', { type: blob.type });

                        // Check if we can share this file
                        if (navigator.canShare({ files: [file] })) {
                            shareData.files = [file];
                            // When sharing files, 'text' is sometimes ignored by WhatsApp in favor of caption, 
                            // but we send it anyway.
                        }
                    } catch (err) {
                        console.warn('Failed to load cover image for sharing:', err);
                        // Fallback to link only if image load fails
                    }
                }

                await navigator.share(shareData);

                // Track successful share
                analytics.trackEvent('share_devotional', {
                    meta: {
                        devotional_id: id,
                        title: title,
                        method: 'native_share',
                        has_image: !!coverUrl
                    }
                });

                // toast.success('Compartilhado com sucesso!');
            } else {
                // Fallback: Open WhatsApp Web/App directly via URL scheme
                const encodedText = encodeURIComponent(shareText);
                window.open(`https://wa.me/?text=${encodedText}`, '_blank');

                // Track fallback share
                analytics.trackEvent('share_devotional', {
                    meta: {
                        devotional_id: id,
                        title: title,
                        method: 'whatsapp_fallback',
                        has_image: false
                    }
                });
            }
        } catch (error) {
            // User aborted or share failed
            if ((error as Error).name !== 'AbortError') {
                console.error('Share failed:', error);
                toast.error('Não foi possível compartilhar automatically.');

                // Last resort fallback
                const encodedText = encodeURIComponent(shareText);
                window.open(`https://wa.me/?text=${encodedText}`, '_blank');

                // Track error fallback
                analytics.trackEvent('share_devotional', {
                    meta: {
                        devotional_id: id,
                        title: title,
                        method: 'error_fallback',
                        has_image: false
                    }
                });
            }
        }
    };

    return (
        <button
            onClick={handleShare}
            className="flex items-center gap-2 px-4 py-2 bg-indigo-50 text-indigo-600 rounded-full font-bold text-sm hover:bg-indigo-100 transition-colors"
            title="Compartilhar no WhatsApp"
        >
            <Share2 className="w-4 h-4" />
            Compartilhar
        </button>
    );
}

import { supabase } from '@/lib/supabase';

export const monetizationService = {
    async trackClick(
        itemId: string,
        itemType: string,
        context: string,
        churchId?: string
    ): Promise<void> {
        try {
            await supabase.functions.invoke('public-monetization-click', {
                method: 'POST',
                body: {
                    item_id: itemId,
                    item_type: itemType,
                    context: context,
                    church_id: churchId
                }
            });
        } catch (error) {
            console.error('Failed to track click', error);
            // Fail silently to user
        }
    }
};

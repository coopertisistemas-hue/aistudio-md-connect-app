export interface Partner {
    id: string;
    title: string;
    description?: string;
    image_url?: string;
    category?: string;
    external_link: string;
    status: 'draft' | 'published' | 'archived';
    is_featured: boolean;
}

export interface Service {
    id: string;
    title: string;
    value_proposition?: string;
    description?: string;
    price_starts_at?: string;
    whatsapp_number?: string;
    whatsapp_message?: string;
    status: 'draft' | 'published' | 'archived';
    is_featured: boolean;
}

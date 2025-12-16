export interface Post {
    id: string;
    church_id: string;
    title: string;
    subtitle?: string;
    content_body?: string;
    cover_image_url?: string;
    type: 'news' | 'devotional' | 'notice';
    status: 'draft' | 'published' | 'archived';
    author_id?: string;
    published_at: string;
    is_pinned?: boolean;
}

export interface ContentSeries {
    id: string;
    church_id: string;
    title: string;
    description?: string;
    cover_image_url?: string;
    status: 'draft' | 'published' | 'archived';
}

export interface ContentMessage {
    id: string;
    church_id: string;
    series_id?: string;
    title: string;
    description?: string;
    video_url?: string;
    audio_url?: string;
    cover_image_url?: string;
    published_at: string;
    author_name?: string;
    duration_seconds?: number;
}

export interface ReadingPlan {
    id: string;
    church_id: string;
    title: string;
    description?: string;
    cover_image_url?: string;
    total_days: number;
    status: 'draft' | 'published';
}

export interface ReadingPlanDay {
    id: string;
    plan_id: string;
    day_number: number;
    title?: string;
    content?: string;
    bible_refs?: string[];
}

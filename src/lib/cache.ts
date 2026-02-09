import type { BibleChapter } from '@/services/bible';
import type { Post } from '@/types/content';

interface CacheEntry<T> {
  data: T;
  timestamp: number;
  ttl: number;
}

const CACHE_PREFIX = 'md:cache:';
const DEFAULT_TTL = 24 * 60 * 60 * 1000;

class ContentCache {
  private getKey(type: string, id: string): string {
    return `${CACHE_PREFIX}${type}:${id}`;
  }

  private isValid(entry: CacheEntry<unknown>): boolean {
    return Date.now() - entry.timestamp < entry.ttl;
  }

  get<T>(type: string, id: string): T | null {
    try {
      const key = this.getKey(type, id);
      const stored = localStorage.getItem(key);
      if (!stored) return null;

      const entry: CacheEntry<T> = JSON.parse(stored);
      if (!this.isValid(entry)) {
        localStorage.removeItem(key);
        return null;
      }
      return entry.data;
    } catch {
      return null;
    }
  }

  set<T>(type: string, id: string, data: T, ttl = DEFAULT_TTL): void {
    try {
      const key = this.getKey(type, id);
      const entry: CacheEntry<T> = {
        data,
        timestamp: Date.now(),
        ttl,
      };
      localStorage.setItem(key, JSON.stringify(entry));
    } catch (e) {
      console.warn('Failed to cache content:', e);
    }
  }

  clear(): void {
    Object.keys(localStorage)
      .filter((key) => key.startsWith(CACHE_PREFIX))
      .forEach((key) => localStorage.removeItem(key));
  }
}

export const contentCache = new ContentCache();

export function getCachedChapter(bookId: string, chapter: number): BibleChapter | null {
  return contentCache.get<BibleChapter>('bible', `${bookId}:${chapter}`);
}

export function cacheChapter(bookId: string, chapter: number, data: BibleChapter): void {
  contentCache.set('bible', `${bookId}:${chapter}`, data, 7 * 24 * 60 * 60 * 1000);
}

export function getCachedDevotional(id: string): Post | null {
  return contentCache.get<Post>('devotional', id);
}

export function cacheDevotional(id: string, data: Post): void {
  contentCache.set('devotional', id, data, 12 * 60 * 60 * 1000);
}

// SEO Configuration and Utilities for MD Connect

export interface SEOConfig {
    title: string;
    description: string;
    canonical?: string;
    ogImage?: string;
    ogType?: 'website' | 'article';
    article?: {
        publishedTime?: string;
        author?: string;
        section?: string;
    };
}

// Base URL - Uses environment variable or fallback
// Set VITE_PUBLIC_BASE_URL in .env for production
export const BASE_URL = import.meta.env.VITE_PUBLIC_BASE_URL ||
    (typeof window !== 'undefined' ? window.location.origin : 'https://mdconnect.app');

// Default SEO values
export const DEFAULT_SEO: SEOConfig = {
    title: 'MD Connect - Momento Devocional | Palavra, Comunidade e Apoio',
    description: 'Conecte-se com Deus através de devocionais diários, leitura bíblica, rádio cristã e comunidade de oração. Apoie a obra do Reino.',
    ogImage: `${BASE_URL}/og-image.png`,
    ogType: 'website'
};

// Route-specific SEO configurations
export const ROUTE_SEO: Record<string, SEOConfig> = {
    '/': DEFAULT_SEO,

    '/home': {
        title: 'Início | MD Connect',
        description: 'Sua plataforma cristã para crescimento espiritual. Devocionais, Bíblia, rádio e comunidade de oração.',
        ogType: 'website'
    },

    '/entenda': {
        title: 'Entenda o MD Connect | Nossa Missão',
        description: 'Conheça a missão do MD Connect: levar a Palavra de Deus através da tecnologia, conectando pessoas ao Reino.',
        ogType: 'website'
    },

    '/missao': {
        title: 'Nossa Missão | MD Connect',
        description: 'Levar a Palavra de Deus através da tecnologia, conectando pessoas ao Reino e fortalecendo a fé cristã.',
        ogType: 'website'
    },

    '/devocionais': {
        title: 'Devocionais Diários | MD Connect',
        description: 'Devocionais diários para fortalecer sua fé e comunhão com Deus. Reflexões bíblicas para cada dia.',
        ogType: 'website'
    },

    '/biblia': {
        title: 'Bíblia Online | MD Connect',
        description: 'Leia a Bíblia online com diferentes traduções. Acesso rápido aos livros, capítulos e versículos.',
        ogType: 'website'
    },

    '/radio': {
        title: 'Rádio Cristã | MD Connect',
        description: 'Ouça nossa rádio cristã com programação gospel e mensagens edificantes 24 horas por dia.',
        ogType: 'website'
    },

    '/doar': {
        title: 'Apoie a Obra | Doações | MD Connect',
        description: 'Apoie o MD Connect através de doações via PIX. Ajude a levar a Palavra de Deus através da tecnologia.',
        ogType: 'website'
    },

    '/parceiros': {
        title: 'Seja Parceiro | MD Connect',
        description: 'Torne-se um Parceiro Oficial do MD Connect. Apoie a obra do Reino com R$ 99,00 mensais.',
        ogType: 'website'
    },

    '/pedido-oracao': {
        title: 'Pedido de Oração | MD Connect',
        description: 'Envie seu pedido de oração. Nossa comunidade está pronta para interceder por você.',
        ogType: 'website'
    },

    '/mural': {
        title: 'Mural de Avisos | MD Connect',
        description: 'Fique por dentro das novidades, avisos e comunicados da comunidade MD Connect.',
        ogType: 'website'
    }
};

// Get SEO config for a specific route
export function getSEOConfig(pathname: string): SEOConfig {
    // Try exact match first
    if (ROUTE_SEO[pathname]) {
        return ROUTE_SEO[pathname];
    }

    // Try pattern matching for dynamic routes
    if (pathname.startsWith('/devocionais/')) {
        return {
            title: 'Devocional | MD Connect',
            description: 'Leia este devocional e fortaleça sua fé com reflexões bíblicas diárias.',
            ogType: 'article'
        };
    }

    if (pathname.startsWith('/biblia/')) {
        return {
            title: 'Bíblia | MD Connect',
            description: 'Leia a Bíblia online com diferentes traduções.',
            ogType: 'website'
        };
    }

    // Default fallback
    return DEFAULT_SEO;
}

// Generate canonical URL
export function getCanonicalURL(pathname: string): string {
    return `${BASE_URL}${pathname}`;
}

// Schema.org JSON-LD generators
export function generateOrganizationSchema() {
    return {
        '@context': 'https://schema.org',
        '@type': 'Organization',
        name: 'MD Connect',
        url: BASE_URL,
        logo: `${BASE_URL}/logo.png`,
        description: 'Plataforma cristã para devocionais, leitura bíblica e comunidade de oração',
        sameAs: [
            // Add your social media URLs here
            // 'https://instagram.com/mdconnect',
            // 'https://facebook.com/mdconnect'
        ]
    };
}

export function generateWebSiteSchema() {
    return {
        '@context': 'https://schema.org',
        '@type': 'WebSite',
        name: 'MD Connect',
        url: BASE_URL,
        description: 'Plataforma cristã para crescimento espiritual',
        potentialAction: {
            '@type': 'SearchAction',
            target: `${BASE_URL}/search?q={search_term_string}`,
            'query-input': 'required name=search_term_string'
        }
    };
}

export function generateBreadcrumbSchema(items: Array<{ name: string; url: string }>) {
    return {
        '@context': 'https://schema.org',
        '@type': 'BreadcrumbList',
        itemListElement: items.map((item, index) => ({
            '@type': 'ListItem',
            position: index + 1,
            name: item.name,
            item: item.url
        }))
    };
}

export function generateArticleSchema(article: {
    title: string;
    description: string;
    datePublished: string;
    dateModified?: string;
    author?: string;
    image?: string;
}) {
    return {
        '@context': 'https://schema.org',
        '@type': 'Article',
        headline: article.title,
        description: article.description,
        datePublished: article.datePublished,
        dateModified: article.dateModified || article.datePublished,
        author: {
            '@type': 'Person',
            name: article.author || 'MD Connect'
        },
        publisher: {
            '@type': 'Organization',
            name: 'MD Connect',
            logo: {
                '@type': 'ImageObject',
                url: `${BASE_URL}/logo.png`
            }
        },
        image: article.image || `${BASE_URL}/og-image.png`
    };
}

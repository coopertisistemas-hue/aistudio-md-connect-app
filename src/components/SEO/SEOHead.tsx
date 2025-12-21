import { Helmet } from 'react-helmet-async';
import { useLocation } from 'react-router-dom';
import { getSEOConfig, getCanonicalURL, BASE_URL, type SEOConfig } from '@/lib/seo';

interface SEOHeadProps {
    config?: Partial<SEOConfig>;
    schemaData?: object | object[];
}

export function SEOHead({ config, schemaData }: SEOHeadProps) {
    const location = useLocation();
    const routeConfig = getSEOConfig(location.pathname);

    // Merge route config with custom config
    const finalConfig: SEOConfig = {
        ...routeConfig,
        ...config
    };

    const {
        title,
        description,
        canonical,
        ogImage,
        ogType = 'website',
        article
    } = finalConfig;

    const canonicalUrl = canonical || getCanonicalURL(location.pathname);
    const imageUrl = ogImage || `${BASE_URL}/og-image.png`;

    return (
        <Helmet>
            {/* Basic Meta Tags */}
            <title>{title}</title>
            <meta name="description" content={description} />
            <link rel="canonical" href={canonicalUrl} />

            {/* Open Graph */}
            <meta property="og:title" content={title} />
            <meta property="og:description" content={description} />
            <meta property="og:image" content={imageUrl} />
            <meta property="og:url" content={canonicalUrl} />
            <meta property="og:type" content={ogType} />
            <meta property="og:site_name" content="MD Connect" />
            <meta property="og:locale" content="pt_BR" />

            {/* Article-specific OG tags */}
            {article && ogType === 'article' && (
                <>
                    {article.publishedTime && (
                        <meta property="article:published_time" content={article.publishedTime} />
                    )}
                    {article.author && (
                        <meta property="article:author" content={article.author} />
                    )}
                    {article.section && (
                        <meta property="article:section" content={article.section} />
                    )}
                </>
            )}

            {/* Twitter Cards */}
            <meta name="twitter:card" content="summary_large_image" />
            <meta name="twitter:title" content={title} />
            <meta name="twitter:description" content={description} />
            <meta name="twitter:image" content={imageUrl} />

            {/* Schema.org JSON-LD */}
            {schemaData && (
                <script type="application/ld+json">
                    {JSON.stringify(Array.isArray(schemaData) ? schemaData : [schemaData])}
                </script>
            )}
        </Helmet>
    );
}

import { createClient } from '@supabase/supabase-js';

export default async function handler(req, res) {
    const { id } = req.query;

    if (!id) {
        return res.status(400).send('Missing ID');
    }

    // Initialize Supabase Client
    // Note: Vercel automatically exposes env vars if configured in the project settings.
    // We use process.env.VITE_SUPABASE_URL because that's likely what's set, 
    // but for backend node functions usually it's best to have separate envs. 
    // Assuming standard vars or reusing exposed ones.
    const supabaseUrl = process.env.VITE_SUPABASE_URL || process.env.SUPABASE_URL;
    const supabaseKey = process.env.VITE_SUPABASE_ANON_KEY || process.env.SUPABASE_ANON_KEY;

    if (!supabaseUrl || !supabaseKey) {
        return res.status(500).send('Server Misconfiguration: Missing Supabase Credentials');
    }

    const supabase = createClient(supabaseUrl, supabaseKey);

    try {
        const { data: post, error } = await supabase
            .from('posts')
            .select('*')
            .eq('id', id)
            .single();

        if (error || !post) {
            // Fallback if not found
            return res.redirect('/');
        }

        // Prepare Metadata
        const title = post.title || 'MD Connect Devocional';
        const subtitle = post.subtitle || 'Uma mensagem de fé para você.';
        const imageUrl = post.cover_image_url || 'https://md-connect.vercel.app/og-default.png'; // Fallback needed
        const appUrl = `https://md-connect.portaliap.com.br/devocionais/${id}`; // Adjust domain as needed or use request host

        // Minimal HTML with Open Graph tags
        const html = `
      <!DOCTYPE html>
      <html lang="pt-BR">
      <head>
        <meta charset="utf-8">
        <title>${title}</title>
        <meta name="description" content="${subtitle}">
        
        <!-- Open Graph / Facebook / WhatsApp -->
        <meta property="og:type" content="article">
        <meta property="og:url" content="${appUrl}">
        <meta property="og:title" content="${title}">
        <meta property="og:description" content="${subtitle}">
        <meta property="og:image" content="${imageUrl}">
        <meta property="og:image:width" content="1200">
        <meta property="og:image:height" content="630">

        <!-- Twitter -->
        <meta property="twitter:card" content="summary_large_image">
        <meta property="twitter:url" content="${appUrl}">
        <meta property="twitter:title" content="${title}">
        <meta property="twitter:description" content="${subtitle}">
        <meta property="twitter:image" content="${imageUrl}">

        <!-- Redirect to App -->
        <meta http-equiv="refresh" content="0;url=${appUrl}">
      </head>
      <body>
        <p>Redirecionando para o devocional...</p>
        <script>window.location.href = "${appUrl}"</script>
      </body>
      </html>
    `;

        res.setHeader('Content-Type', 'text/html');
        res.setHeader('Cache-Control', 's-maxage=60, stale-while-revalidate');
        return res.status(200).send(html);

    } catch (err) {
        console.error(err);
        return res.redirect('/');
    }
}

// Fallback/Demo Data for Sponsors
export interface Sponsor {
    id: string;
    name: string;
    logo?: string;
    tagline: string;
    url?: string;
}

export const SPONSORS: Sponsor[] = [
    {
        id: '1',
        name: 'TechTemple',
        tagline: 'Soluções digitais para igrejas.',
        url: 'https://techtemple.com.br',
        logo: 'https://images.unsplash.com/photo-1599305445671-ac291c95aaa9?w=100&h=100&fit=crop'
    },
    {
        id: '2',
        name: 'Café com Graça',
        tagline: 'O melhor café do seu dia.',
        url: 'https://cafecomgraca.com',
        logo: 'https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?w=100&h=100&fit=crop'
    },
    {
        id: '3',
        name: 'Livraria Semeador',
        tagline: 'Livros que edificam.',
        url: 'https://livrariasemeador.com.br',
        logo: 'https://images.unsplash.com/photo-1491841550275-ad7854e35ca6?w=100&h=100&fit=crop'
    }
];

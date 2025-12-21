import { Book, Calendar, Heart, Radio, Newspaper, GraduationCap, DollarSign, Handshake, Info, Shield, FileText, LifeBuoy } from 'lucide-react';

export const APP_ROUTES = {
    // Core
    HOME: '/home',
    LOGIN: '/login',
    REGISTER: '/register',

    // Features (Public & Member)
    BIBLE: '/biblia',
    PRAYER: '/oracao',
    AGENDA: '/agenda',
    RADIO: '/radio',
    MURAL: '/mural',       // Unified: was /notices or /news
    DEVOTIONALS: '/devocionais',
    STUDIES: '/estudos',   // New placeholder
    WORSHIP: '/louvor',
    HARP: '/harpa',
    LYRICS: '/letras',
    VERSE_POSTER: '/versiculo-para-postar',

    // Institutional
    ABOUT: '/entenda',
    DONATE: '/doe',
    PARTNERS: '/parceiros',
    PARTNER_JOIN: '/seja-parceiro',
    MISSION: '/missao',
    CHURCH_IMPLEMENTATION: '/implantacao-igreja',

    // Legal
    PRIVACY: '/privacidade',
    TERMS: '/termos',
    HELP: '/ajuda',
    TRANSPARENCY: '/transparencia',
};

// Menu Item Definition for UI (Consistency across App/Site)
export const MAIN_MENU = [
    { label: 'Bíblia', path: APP_ROUTES.BIBLE, icon: Book, primary: true },
    { label: 'Oração', path: APP_ROUTES.PRAYER, icon: Heart, primary: true },
    { label: 'Agenda', path: APP_ROUTES.AGENDA, icon: Calendar, primary: false },
    { label: 'Rádio', path: APP_ROUTES.RADIO, icon: Radio, primary: false },
    { label: 'Mural', path: APP_ROUTES.MURAL, icon: Newspaper, primary: false },
    { label: 'Estudos', path: APP_ROUTES.STUDIES, icon: GraduationCap, primary: false },
];

export const FOOTER_LINKS = {
    legal: [
        { label: 'Privacidade', path: APP_ROUTES.PRIVACY, icon: Shield },
        { label: 'Termos de Uso', path: APP_ROUTES.TERMS, icon: FileText },
        { label: 'Ajuda', path: APP_ROUTES.HELP, icon: LifeBuoy },
        { label: 'Transparência', path: APP_ROUTES.TRANSPARENCY, icon: Info },
    ],
    institutional: [
        { label: 'Sobre o Projeto', path: APP_ROUTES.ABOUT },
        { label: 'Missão e Valores', path: APP_ROUTES.MISSION },
        { label: 'Apoie a Obra', path: APP_ROUTES.DONATE, icon: DollarSign },
        { label: 'Seja Parceiro', path: APP_ROUTES.PARTNERS, icon: Handshake },
    ]
};

export const EXTERNAL_LINKS = {
    SUPPORT_WHATSAPP: 'https://wa.me/5551986859236?text=Ol%C3%A1!%20Paz%20do%20Senhor%20%F0%9F%98%8A%20Vim%20pelo%20MD%20Connect%20e%20gostaria%20de%20falar%20com%20a%20equipe.',
    DONATION_SUPPORT: 'https://wa.me/5551986859236?text=Ol%C3%A1!%20Paz%20do%20Senhor%20%F0%9F%98%8A%20Vim%20pelo%20MD%20Connect%20e%20gostaria%20de%20falar%20sobre%20contribui%C3%A7%C3%A3o%2Fdoa%C3%A7%C3%A3o.',
};

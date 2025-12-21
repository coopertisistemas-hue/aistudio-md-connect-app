import { LayoutDashboard, Wallet, Megaphone, HeartHandshake, Smartphone, BookOpen } from 'lucide-react';

export interface CatalogItem {
    label: string;
    badge?: string;
}

export interface ChurchResource {
    id: string;
    icon: any; // LucideIcon type implies explicit dependency, keeping 'any' or generic for simplicity in data file
    label: string;
    desc: string;
    items: (string | CatalogItem)[];
}

export const CHURCH_RESOURCES: ChurchResource[] = [
    {
        id: 'management',
        icon: LayoutDashboard,
        label: "Gestão & Adm",
        desc: "Back-office completo, secretaria e dashboard.",
        items: [
            "Dashboard Pastoral 360º",
            "Gestão de Membros e Visitantes",
            "Controle de Perfis e Acessos (ACL)"
        ]
    },
    {
        id: 'finance',
        icon: Wallet,
        label: "Financeiro",
        desc: "Caixa, dízimos, despesas e transparência.",
        items: [
            "Livro Caixa (Entradas/Saídas)",
            "Gestão de Dízimos e Ofertas",
            "Portal de Transparência Simplificado"
        ]
    },
    {
        id: 'marketing',
        icon: Megaphone,
        label: "Marketing",
        desc: "Presença digital, SEO e Link da Bio.",
        items: [
            "Página Pública da Igreja (SEO)",
            "Integração Google Meu Negócio",
            "Link da Bio / Hub de Links",
            { label: "Comunicados via WhatsApp", badge: "Opcional" }
        ]
    },
    {
        id: 'pastoral',
        icon: HeartHandshake,
        label: "Pastoral",
        desc: "Gestão de pessoas, voluntários e oração.",
        items: [
            "Gestão de Pedidos de Oração",
            "Help Desk / Atendimento",
            "Gestão de Voluntários e Escalas"
        ]
    },
    {
        id: 'app',
        icon: Smartphone,
        label: "App do Membro",
        desc: "Bíblia, devocional, dízimo e avisos.",
        items: [
            "Bíblia e Harpa Integradas",
            "Mural de Avisos e Notícias",
            "Dízimo Online (Pix/Cartão)"
        ]
    },
    {
        id: 'education',
        icon: BookOpen,
        label: "Ensino & Conteúdo",
        desc: "Escola bíblica, notícias e materiais.",
        items: [
            "Escola Bíblica (EBD)",
            "Gestão de Eventos e Inscrições",
            "Solicitações e Tickets"
        ]
    },
];

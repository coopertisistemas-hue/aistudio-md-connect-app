import { Gift, Handshake, Globe, Monitor, Heart, HeartHandshake } from 'lucide-react';
import { APP_ROUTES, EXTERNAL_LINKS } from '@/lib/routes';

export const KINGDOM_SUPPORT_CONTENT = {
    badges: {
        transparency: "Transparência & Sustentabilidade",
        gratitude: "Licença Gratuita para Igrejas",
        gift: "Presente para Parceiros",
        roadmap: "Roadmap de Expansão"
    },
    sections: {
        doe: {
            id: 'doe',
            title: "Mantido por voluntariado",
            description: "A base do sistema (App e ERP) não possui mensalidade. Sua manutenção se dá por ofertas voluntárias. O apoio financeiro, preferencialmente mensal, garante a evolução técnica de todas as igrejas beneficiadas.",
            cta: "Entenda como apoiar",
            path: APP_ROUTES.DONATE,
            icon: Gift,
            accent: "text-rose-500",
            bg: "bg-indigo-50/30",
            border: "border-indigo-100"
        },
        partner: {
            id: 'partner',
            title: "Seja um Parceiro Oficial",
            description: "Ao se tornar um parceiro mensal, você ajuda a sustentar o projeto e ainda recebe o eBook 'A Vida Prática com Deus' no seu WhatsApp como gratidão pelo seu apoio à obra.",
            cta: "Ser Parceiro + Presente",
            path: APP_ROUTES.PARTNER_JOIN,
            icon: HeartHandshake,
            accent: "text-indigo-600",
            bg: "bg-slate-50/50",
            border: "border-slate-100",
            badge: "Ganha Presente"
        },
        freeSite: {
            id: 'free-site',
            title: "Site Grátis para sua Igreja",
            description: "Igrejas que implantarem o sistema ganham a criação e hospedagem (subdomínio) de uma página oficial, facilitando a localização por novos visitantes.",
            cta: "Solicitar Implantação",
            path: APP_ROUTES.CHURCH_IMPLEMENTATION,
            icon: Monitor,
            accent: "text-green-600",
            bg: "bg-green-50/30",
            border: "border-green-100"
        },
        roadmap: {
            id: 'roadmap',
            title: "Expansão Global do Reino",
            description: "Nossa meta é traduzir toda a plataforma e conteúdos. Roadmap: Português (OK) -> Espanhol -> Inglês -> Francês. Foco global para o anúncio da Palavra.",
            icon: Globe,
            accent: "text-blue-600",
            bg: "bg-blue-50/30",
            border: "border-blue-100",
            steps: ["Português", "Espanhol", "Inglês", "Francês"]
        }
    },
    compact: {
        title: "Apoie a Obra",
        description: "O MD Connect é gratuito para igrejas. Sua oferta voluntária sustenta a infraestrutura e a expansão do Reino no digital.",
        ctas: [
            { label: "DOE Agora", path: APP_ROUTES.DONATE, icon: Heart, primary: true },
            { label: "Seja Parceiro", path: APP_ROUTES.PARTNER_JOIN, icon: Handshake, primary: false },
            { label: "WhatsApp", path: EXTERNAL_LINKS.SUPPORT_WHATSAPP, icon: HeartHandshake, primary: false, external: true }
        ]
    }
};

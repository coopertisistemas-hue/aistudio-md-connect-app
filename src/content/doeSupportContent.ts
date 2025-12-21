import { Heart, CheckCircle2, Globe, Monitor, Gift, HandHeart } from 'lucide-react';
import { APP_ROUTES } from '@/lib/routes';

export const DOE_SUPPORT_CONTENT = {
    title: "Apoie a Obra",
    optionalLabel: "(opcional)",
    description: "O MD Connect é gratuito para igrejas. Seu apoio mantém a infraestrutura, a segurança e acelera a evolução do projeto.",
    benefits: [
        {
            icon: CheckCircle2,
            text: "Suporte e melhorias contínuas",
            subtext: "(sem mensalidade de licença)",
            color: "text-green-600",
            bg: "bg-green-50"
        },
        {
            icon: Globe,
            text: "Expansão internacional:",
            subtext: "países de língua portuguesa (1ª fase) → inglês (2ª) → espanhol (3ª)",
            color: "text-blue-600",
            bg: "bg-blue-50"
        },
        {
            icon: Monitor,
            text: "Site institucional gratuito",
            subtext: "para igrejas sem site",
            color: "text-indigo-600",
            bg: "bg-indigo-50"
        }
    ],
    partnerSection: {
        icon: Gift,
        text: "Parceiros recebem",
        highlightedText: "pack de desconto nos SaaS do ecossistema Connect",
        subtext: "(ERP e gestão) + presente combo devocional",
        devotionalHighlight: "'40 Dias de Recomeço'"
    },
    ctas: {
        monthly: { label: "DOE mensalmente", path: APP_ROUTES.DONATE },
        now: { label: "DOE agora", path: APP_ROUTES.DONATE, icon: Heart },
        partner: { label: "Seja parceiro", path: APP_ROUTES.PARTNER_JOIN, icon: HandHeart }
    }
};

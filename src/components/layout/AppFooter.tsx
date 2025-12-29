import React from 'react';
import { Instagram, Mail } from 'lucide-react';
import { Link } from 'react-router-dom';
import { FOOTER_LINKS } from '@/lib/routes';
import { analytics } from '@/lib/analytics';

export function AppFooter() {
    const trackFooterClick = (label: string, destination: string, isExternal = false) => {
        analytics.track({
            name: 'nav_click',
            element: `footer_link_${label.toLowerCase().replace(/\s+/g, '_')}`,
            context: 'member',
            route_to: destination,
            metadata: { external: isExternal }
        });
    };

    return (
        <footer className="w-full mt-auto relative z-10 px-4 pb-6 pt-4">
            {/* Glass Container for Legibility over Video */}
            <div className="w-full max-w-md mx-auto bg-white/70 backdrop-blur-xl border border-white/50 rounded-2xl p-5 shadow-sm">

                <div className="flex flex-col items-center text-center">

                    {/* 1. Brand & Socials (Row for compactness) */}
                    <div className="flex items-center justify-between w-full mb-4 px-2">
                        {/* Brand */}
                        <div className="flex items-center gap-2">
                            <div className="h-8 w-8 rounded-full overflow-hidden border border-slate-200 shadow-sm relative bg-white">
                                <img src="/custom-logo.jpg" alt="MD Connect" className="w-full h-full object-cover" />
                            </div>
                            <span className="text-[10px] font-bold text-slate-800 tracking-tight">
                                MD Connect
                            </span>
                        </div>

                        {/* Socials */}
                        <div className="flex items-center gap-2">
                            <a
                                href="https://wa.me/5511000000000"
                                target="_blank"
                                rel="noopener noreferrer"
                                onClick={() => trackFooterClick('whatsapp', 'whatsapp_support', true)}
                                className="w-14 h-14 rounded-2xl bg-green-50 border border-slate-100 shadow-sm flex items-center justify-center transition-all active:scale-95 group"
                            >
                                <svg viewBox="0 0 24 24" fill="currentColor" className="w-6 h-6 text-[#25D366]">
                                    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.008-.57-.008-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z" />
                                </svg>
                            </a>
                            <a
                                href="https://instagram.com/mdconnect.ofc"
                                target="_blank"
                                rel="noopener noreferrer"
                                onClick={() => trackFooterClick('instagram', 'instagram.com/mdconnect.ofc', true)}
                                className="w-7 h-7 rounded-full bg-slate-100 hover:bg-white text-slate-400 hover:text-pink-600 border border-transparent hover:border-slate-200 flex items-center justify-center transition-all active:scale-95"
                                aria-label="Siga no Instagram"
                            >
                                <Instagram className="w-3.5 h-3.5" />
                            </a>
                            <a
                                href="mailto:projetomomentodevocional@gmail.com?subject=Contato%20–%20MD%20Connect"
                                onClick={() => trackFooterClick('email', 'mailto:projetomomentodevocional@gmail.com', true)}
                                className="w-7 h-7 rounded-full bg-slate-100 hover:bg-white text-slate-400 hover:text-blue-600 border border-transparent hover:border-slate-200 flex items-center justify-center transition-all active:scale-95"
                                aria-label="Entre em contato por email"
                            >
                                <Mail className="w-3.5 h-3.5" />
                            </a>
                        </div>
                    </div>

                    {/* Divider */}
                    <div className="w-full h-[1px] bg-slate-200/50 mb-3" />

                    {/* 1.5. Institutional Links (Main Navigation) */}
                    {/* 1.5. Institutional Links (Main Navigation) */}
                    <div className="flex flex-wrap items-center justify-center gap-x-3 gap-y-2 mb-4 w-full px-2">
                        {FOOTER_LINKS.institutional.map((link) => (
                            <Link
                                key={link.path}
                                to={link.path}
                                onClick={() => trackFooterClick(link.label, link.path)}
                                className="flex items-center gap-1 text-[10px] font-semibold text-slate-600 hover:text-blue-600 transition-colors"
                            >
                                {link.label}
                            </Link>
                        ))}
                    </div>

                    {/* 2. Legal & Transparency (Compact Cluster) */}
                    <div className="flex flex-wrap items-center justify-center gap-x-3 gap-y-2 mb-4 w-full">
                        {FOOTER_LINKS.legal.map((link, index) => {
                            const Icon = link.icon;
                            return (
                                <React.Fragment key={link.path}>
                                    <Link
                                        to={link.path}
                                        onClick={() => trackFooterClick(link.label, link.path)}
                                        className="flex items-center gap-1 text-[9px] text-slate-500 font-medium hover:text-slate-800 transition-colors"
                                    >
                                        {Icon && <Icon className="w-2.5 h-2.5" />}
                                        {link.label}
                                    </Link>
                                    {index < FOOTER_LINKS.legal.length - 1 && (
                                        <span className="text-[9px] text-slate-300">•</span>
                                    )}
                                </React.Fragment>
                            );
                        })}
                    </div>

                    {/* 3. Copyright */}
                    <div className="flex flex-col gap-0.5 opacity-80">
                        <p className="text-[9px] text-slate-500 font-medium">
                            &copy; 2025 MD – Momento Devocional. Todos os direitos reservados.
                        </p>
                        <p className="text-[8px] font-bold text-slate-400 uppercase tracking-widest mt-1">
                            Desenvolvido por <span className="text-blue-500">MD Connect</span>
                        </p>
                    </div>

                </div>
            </div>
        </footer>
    );
}



import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Newspaper, BookOpen, Zap } from 'lucide-react';
import { PortalSection, PortalCard } from '@/components/ui/PortalComponents';
import { feedService, type FeedItem } from '@/services/feed';

import { HomeHeader } from '@/components/home/HomeHeader';
import { HomeHero } from '@/components/home/HomeHero';
import { ContentsHub } from '@/components/home/ContentsHub';
import { ServicesSection } from '@/components/home/ServicesSection';
import { NextEventsWidget } from '@/components/home/NextEventsWidget';
import { QuickActions } from '@/components/ui/QuickActions';
import { ScrollCue } from '@/components/ui/ScrollCue';
import { NotificationTicker } from '@/components/home/NotificationTicker';
import { BackToTop } from '@/components/ui/BackToTop';
import { DonationWidget } from '@/components/home/DonationWidget';

export default function Home() {
    const [feed, setFeed] = useState<FeedItem[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const navigate = useNavigate();

    useEffect(() => {
        const loadFeed = async () => {
            try {
                const data = await feedService.getFeed();
                setFeed(data);
            } catch (error) {
                console.error("Feed load error:", error);
            } finally {
                setIsLoading(false);
            }
        };
        loadFeed();
    }, []);

    return (
        <div className="flex flex-col pb-8">
            {/* 1. Header & Hero */}
            <ScrollCue />
            <BackToTop />
            <HomeHeader />
            <NotificationTicker items={feed} />
            <HomeHero />

            <div className="px-4 space-y-2">

                {/* 2. Quick Actions */}
                <PortalSection title="Ações Rápidas" icon={Zap}>
                    <QuickActions />
                </PortalSection>

                {/* 3. Mural / Feed */}
                <PortalSection title="Mural da Igreja" icon={Newspaper} actionLabel="Ver todos" onAction={() => navigate('notices')}>
                    {isLoading ? (
                        <div className="flex space-x-3 overflow-x-auto pb-2 scrollbar-hide snap-x">
                            {[1, 2, 3].map(i => (
                                <div key={i} className="min-w-[280px] snap-center">
                                    <div className="bg-white rounded-xl border border-slate-100 p-4 h-32 animate-pulse">
                                        <div className="flex justify-between mb-3">
                                            <div className="h-4 w-16 bg-slate-100 rounded"></div>
                                            <div className="h-3 w-12 bg-slate-100 rounded"></div>
                                        </div>
                                        <div className="h-5 w-3/4 bg-slate-100 rounded mb-2"></div>
                                        <div className="h-4 w-full bg-slate-100 rounded"></div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    ) : feed.length > 0 ? (
                        <div className="flex space-x-3 overflow-x-auto pb-2 scrollbar-hide snap-x">
                            {feed.map(item => (
                                <div key={item.id} className="min-w-[280px] snap-center">
                                    <PortalCard className={`relative ${item.is_pinned ? 'border-blue-200 bg-blue-50/30' : ''}`}>
                                        <div className="flex justify-between items-start mb-2">
                                            <div className="flex items-center space-x-2">
                                                <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full uppercase ${item.priority === 'high' ? 'bg-red-100 text-red-700' :
                                                    item.type === 'news' ? 'bg-blue-100 text-blue-700' :
                                                        item.type === 'devotional' ? 'bg-purple-100 text-purple-700' :
                                                            'bg-orange-100 text-orange-700'
                                                    }`}>
                                                    {item.priority === 'high' ? 'Urgente' :
                                                        item.type === 'news' ? 'Notícia' :
                                                            item.type === 'notice' ? 'Aviso' : 'Devocional'}
                                                </span>
                                                {item.is_pinned && <span className="text-[10px] bg-blue-100 text-blue-700 px-1.5 py-0.5 rounded font-bold">Fixado</span>}
                                            </div>
                                            <span className="text-[10px] text-slate-400">
                                                {new Date(item.starts_at || item.published_at || new Date()).toLocaleDateString()}
                                            </span>
                                        </div>
                                        <h3 className="font-bold text-slate-800 mb-1 leading-snug">{item.title}</h3>
                                        {item.subtitle ? (
                                            <p className="text-xs text-slate-500 line-clamp-1">{item.subtitle}</p>
                                        ) : item.content && (
                                            <p className="text-xs text-slate-500 line-clamp-1">{item.content}</p>
                                        )}
                                    </PortalCard>
                                </div>
                            ))}
                        </div>
                    ) : (
                        <PortalCard>
                            <div className="text-center py-6 px-4">
                                <p className="text-slate-500 text-sm mb-4">Nenhuma publicação recente no mural.</p>
                                <div className="flex flex-col gap-2">
                                    <button onClick={() => window.open('https://wa.me/?text=Ola', '_blank')} className="text-xs font-bold text-green-600 bg-green-50 py-2 rounded-lg">
                                        Receber no WhatsApp
                                    </button>
                                    <button onClick={() => console.log('Radio')} className="text-xs font-bold text-blue-600 bg-blue-50 py-2 rounded-lg">
                                        Ouvir Rádio Deus é Amor
                                    </button>
                                </div>
                            </div>
                        </PortalCard>
                    )}
                </PortalSection>

                {/* 4. Content Hub */}
                <ContentsHub />

                <NextEventsWidget />

                {/* 6. Discipleship Placeholder (Can keep or merge into ContentHub - I'll keep for now as it was specific) */}
                <PortalSection title="Discipulado" icon={BookOpen}>
                    <div className="grid grid-cols-2 gap-3">
                        <PortalCard className="bg-slate-50 border-slate-200">
                            <h4 className="font-bold text-slate-700 text-sm">Novos Convertidos</h4>
                        </PortalCard>
                        <PortalCard className="bg-slate-50 border-slate-200">
                            <h4 className="font-bold text-slate-700 text-sm">Batismo</h4>
                        </PortalCard>
                    </div>
                </PortalSection>

                {/* 7. Services & Monetization */}
                <ServicesSection />
                <DonationWidget />

                {/* Footer Info */}
                <footer className="py-8 text-center mt-6">
                    <p className="text-slate-400 text-xs font-medium">MD Connect Mobile v1.0</p>
                    <p className="text-[10px] text-slate-300 mt-1 uppercase tracking-wide">Tecnologia a serviço do Reino</p>
                    <div className="flex justify-center space-x-6 mt-4 opacity-70">
                        <span className="text-xs text-slate-400">Privacidade</span>
                        <span className="text-xs text-slate-400">Suporte</span>
                    </div>
                </footer>

            </div>
        </div>
    );
}

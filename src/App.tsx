import { Suspense, lazy } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { HelmetProvider } from 'react-helmet-async';
import { MobileContainer } from '@/components/MobileContainer';
import { DesktopOverlay } from '@/components/DesktopOverlay';
import { Music, Book, FileText, Loader2 } from 'lucide-react';
import { ChurchLayout } from '@/layouts/ChurchLayout';
import { PublicLayout } from '@/layouts/PublicLayout';
// Auth Guards
import { ProtectedRoute } from '@/components/auth/ProtectedRoute';
import { ChurchScopedRoute } from '@/components/auth/ChurchScopedRoute';
import { APP_ROUTES } from '@/lib/routes'; // Central Source of Truth
import { AnalyticsTracker } from '@/components/AnalyticsTracker';
import { FLAGS } from '@/lib/flags';
import { AuthProvider } from '@/contexts/AuthContext';

// Eager Load Critical Pages (Home/Landing) for LCP
import LandingPage from '@/pages/LandingPage';
import Home from '@/pages/Home';

// Lazy Load Internal/Heavy Pages
const PublicContentPage = lazy(() => import('@/pages/public/PublicContentPage'));
const MissionPage = lazy(() => import('@/pages/public/MissionPage'));
const Perfil = lazy(() => import('@/pages/Placeholders').then(m => ({ default: m.Perfil })));
const BibleHome = lazy(() => import('@/pages/Bible/BibleHome'));
const BibleBook = lazy(() => import('@/pages/Bible/BibleBook'));
const BibleReader = lazy(() => import('@/pages/Bible/BibleReader'));

// Content Pages
const ContentHub = lazy(() => import('@/pages/Content/Hub'));
const DevotionalsList = lazy(() => import('@/pages/Content/DevotionalsList'));
const DevotionalDetail = lazy(() => import('@/pages/Content/DevotionalDetail'));
const DevotionalList = lazy(() => import('@/pages/Content/DevotionalList'));
const SeriesList = lazy(() => import('@/pages/Content/SeriesList'));
const SeriesDetail = lazy(() => import('@/pages/Content/SeriesDetail'));
const MessageDetail = lazy(() => import('@/pages/Content/MessageDetail'));
const PlansList = lazy(() => import('@/pages/Content/PlansList'));
const PlanDetail = lazy(() => import('@/pages/Content/PlanDetail'));
const StudiesPage = lazy(() => import('@/pages/Content/StudiesPage'));

// Notices & Events
const NoticeList = lazy(() => import('@/pages/notices/NoticeList'));
const NoticeDetail = lazy(() => import('@/pages/notices/NoticeDetail'));
const Agenda = lazy(() => import('@/pages/events/Agenda'));
const EventDetail = lazy(() => import('@/pages/events/EventDetail'));

// Requests/Prayer
const PrayerHub = lazy(() => import('@/pages/requests/PrayerHub'));
const PrayerRequestPage = lazy(() => import('@/pages/public/PrayerRequestPage'));

// Monetization
const PartnersList = lazy(() => import('@/pages/Monetization/PartnersList'));
const ServicesList = lazy(() => import('@/pages/Monetization/ServicesList'));
const ServiceDetail = lazy(() => import('@/pages/Monetization/ServiceDetail'));
const PartnersPage = lazy(() => import('@/pages/public/PartnersPage'));
const PartnerLeadPage = lazy(() => import('@/pages/public/PartnerLeadPage'));

// Auth & Profile
const Login = lazy(() => import('@/pages/Login'));
const SelectChurch = lazy(() => import('@/pages/onboarding/SelectChurch'));
const ProfileHub = lazy(() => import('@/pages/profile/ProfileHub'));
const ProfileEditor = lazy(() => import('@/pages/profile/ProfileEditor'));
const PrivacyCenter = lazy(() => import('@/pages/profile/PrivacyCenter'));

// Public Misc
const DonatePage = lazy(() => import('@/pages/public/DonatePage'));
const SchedulePage = lazy(() => import('@/pages/public/SchedulePage'));
const RadioPage = lazy(() => import('@/pages/public/RadioPage'));
const VersePosterPage = lazy(() => import('@/pages/features/VersePosterPage'));
const ComingSoon = lazy(() => import('@/pages/member/ComingSoonPage'));

// DEV ONLY
const ErrorReportingTestPage = lazy(() => import('@/pages/dev/ErrorReportingTestPage'));

// Fallback Loading Component
const PageLoader = () => (
  <div className="h-screen flex items-center justify-center bg-gray-50">
    <Loader2 className="w-8 h-8 text-indigo-600 animate-spin" />
  </div>
);

export default function App() {
  return (
    <HelmetProvider>
      <AuthProvider>
        <div className="bg-gray-100 min-h-screen flex justify-center relative">
          <DesktopOverlay />
          <MobileContainer>
            <BrowserRouter>
              <AnalyticsTracker />
              <Suspense fallback={<PageLoader />}>
                <Routes>
                  {/* Public Routes (App Shell) */}
                  <Route element={<PublicLayout />}>
                    <Route path={APP_ROUTES.HOME} element={<LandingPage />} />
                    <Route path={APP_ROUTES.ABOUT} element={<PublicContentPage slug="entenda" />} />
                    <Route path={APP_ROUTES.MISSION} element={<MissionPage />} />
                    <Route path="biblia" element={<BibleHome />} />
                    <Route path="biblia/:bookId" element={<BibleBook />} />
                    <Route path="biblia/:bookId/:chapterId" element={<BibleReader />} />

                    {FLAGS.FEATURE_PRAYER_REQUESTS_V1 ? (
                      <Route path={APP_ROUTES.PRAYER} element={<PrayerHub />} />
                    ) : (
                      <Route path={APP_ROUTES.PRAYER} element={<PrayerRequestPage />} />
                    )}

                    <Route path={APP_ROUTES.AGENDA} element={<SchedulePage />} />
                    <Route path={APP_ROUTES.RADIO} element={<RadioPage />} />
                    <Route path={APP_ROUTES.DONATE} element={<DonatePage />} />
                    <Route path={APP_ROUTES.TRANSPARENCY} element={<PublicContentPage slug="transparencia" />} />
                    <Route path={APP_ROUTES.PRIVACY} element={<PublicContentPage slug="privacidade" />} />
                    <Route path={APP_ROUTES.TERMS} element={<PublicContentPage slug="termos" />} />
                    <Route path={APP_ROUTES.HELP} element={<PublicContentPage slug="ajuda" />} />
                    <Route path={APP_ROUTES.PARTNERS} element={<PartnersPage />} />
                    <Route path={APP_ROUTES.PARTNER_JOIN} element={<PartnerLeadPage />} />
                    <Route path={APP_ROUTES.MURAL} element={<NoticeList />} />
                    <Route path={APP_ROUTES.STUDIES} element={<StudiesPage />} />
                    <Route path={APP_ROUTES.WORSHIP} element={<ComingSoon title="Louvor" description="Playlists e recursos musicais em breve." icon={Music} />} />
                    <Route path={APP_ROUTES.HARP} element={<ComingSoon title="Harpa Cristã" description="Hinos e cifras para adoração em breve." icon={Book} />} />
                    <Route path={APP_ROUTES.LYRICS} element={<ComingSoon title="Letras" description="Acervo de letras para louvor em breve." icon={FileText} />} />
                    <Route path={APP_ROUTES.VERSE_POSTER} element={<VersePosterPage />} />

                    {FLAGS.FEATURE_DEVOTIONAL_V1 && (
                      <>
                        <Route path="/devocionais" element={<DevotionalList />} />
                        <Route path="/devocionais/:id" element={<DevotionalDetail />} />
                      </>
                    )}

                    {/* DEV ONLY: Error Reporting Test */}
                    <Route path="/dev/error-reporting-test" element={<ErrorReportingTestPage />} />

                    <Route path="/coming-soon" element={<ComingSoon />} />
                  </Route>

                  {/* Redirects */}
                  {/* Redirects */}
                  <Route path="/" element={<Navigate to={APP_ROUTES.HOME} replace />} />
                  <Route path="/index.html" element={<Navigate to={APP_ROUTES.HOME} replace />} />
                  <Route path="/landing" element={<Navigate to={APP_ROUTES.HOME} replace />} />

                  {/* Legacy Redirects for Standard */}
                  <Route path="/requests" element={<Navigate to={APP_ROUTES.PRAYER} replace />} />
                  <Route path="/notices" element={<Navigate to={APP_ROUTES.MURAL} replace />} />
                  <Route path="/news" element={<Navigate to={APP_ROUTES.MURAL} replace />} />

                  {/* Auth Routes */}
                  <Route path={APP_ROUTES.LOGIN} element={<Login />} />

                  {/* ... (rest of routes) ... */}


                  {/* Onboarding - Protected but not Scoped */}
                  <Route path="/onboarding/select-church" element={
                    <ProtectedRoute>
                      <SelectChurch />
                    </ProtectedRoute>
                  } />

                  {/* Church Context Routes (Protected & Scoped) */}
                  <Route path="/c/:slug" element={
                    <ProtectedRoute>
                      <ChurchScopedRoute>
                        <ChurchLayout />
                      </ChurchScopedRoute>
                    </ProtectedRoute>
                  }>
                    <Route index element={<Home />} />
                    <Route path="agenda" element={<Agenda />} />
                    <Route path="events" element={<Agenda />} />
                    <Route path="events/:id" element={<EventDetail />} />

                    {/* Requests */}
                    <Route path="pedidos" element={<PrayerHub />} />
                    <Route path="requests" element={<PrayerHub />} />
                    <Route path="requests/new" element={<PrayerHub />} />

                    {/* Content Module */}
                    <Route path="conteudos" element={<ContentHub />} />
                    <Route path="conteudos/devocionais" element={<DevotionalsList />} />
                    <Route path="conteudos/devocionais/:id" element={<DevotionalDetail />} />
                    <Route path="conteudos/series" element={<SeriesList />} />
                    <Route path="conteudos/series/:id" element={<SeriesDetail />} />
                    <Route path="conteudos/mensagens/:id" element={<MessageDetail />} />
                    <Route path="conteudos/planos" element={<PlansList />} />
                    <Route path="conteudos/planos/:id" element={<PlanDetail />} />
                    <Route path="biblia" element={<BibleHome />} />
                    <Route path="biblia/:bookId" element={<BibleBook />} />
                    <Route path="biblia/:bookId/:chapterId" element={<BibleReader />} />
                    <Route path="bible" element={<Navigate to="biblia" replace />} />

                    <Route path="perfil" element={<Perfil />} />
                    <Route path="notices" element={<NoticeList />} />
                    <Route path="notices/:id" element={<NoticeDetail />} />

                    {/* Monetization */}
                    <Route path="partners" element={<PartnersList />} />
                    <Route path="services" element={<ServicesList />} />
                    <Route path="services/:id" element={<ServiceDetail />} />

                    {/* Profile */}
                    <Route path="profile" element={<ProfileHub />} />
                    <Route path="profile/edit" element={<ProfileEditor />} />
                    <Route path="profile/privacy" element={<PrivacyCenter />} />
                  </Route>

                  {/* Protected Routes Fallback */}

                  {/* Fallback */}
                  <Route path="*" element={<div className="h-screen flex items-center justify-center text-slate-500">Página não encontrada (404)</div>} />
                </Routes>
              </Suspense>
            </BrowserRouter>
          </MobileContainer>
        </div>
      </AuthProvider>
    </HelmetProvider>
  );
}

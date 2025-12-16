import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { MobileContainer } from '@/components/MobileContainer';
import { DesktopOverlay } from '@/components/DesktopOverlay';
import { ChurchLayout } from '@/layouts/ChurchLayout';
import { PublicLayout } from '@/layouts/PublicLayout';
// Auth Guards
import { ProtectedRoute } from '@/components/auth/ProtectedRoute';
import { ChurchScopedRoute } from '@/components/auth/ChurchScopedRoute';
import { APP_ROUTES } from '@/lib/routes'; // Central Source of Truth
import { AnalyticsTracker } from '@/components/AnalyticsTracker'; // [NEW]

import LandingPage from '@/pages/LandingPage'; // Now App Home
import PublicContentPage from '@/pages/public/PublicContentPage'; // Generic Content Page
import Home from '@/pages/Home';
import { Perfil } from '@/pages/Placeholders';
import BibleView from '@/pages/BibleView';
// Content Pages
import ContentHub from '@/pages/Content/Hub';
import DevotionalsList from '@/pages/Content/DevotionalsList';
import DevotionalDetail from '@/pages/Content/DevotionalDetail';
import SeriesList from '@/pages/Content/SeriesList';
import SeriesDetail from '@/pages/Content/SeriesDetail';
import MessageDetail from '@/pages/Content/MessageDetail';
import PlansList from '@/pages/Content/PlansList';
import PlanDetail from '@/pages/Content/PlanDetail';
import NoticeList from '@/pages/notices/NoticeList';
import NoticeDetail from '@/pages/notices/NoticeDetail';
import Agenda from '@/pages/events/Agenda';
import EventDetail from '@/pages/events/EventDetail';
import PrayerHub from '@/pages/requests/PrayerHub';
// import RequestsHub from '@/pages/requests/RequestsHub'; // Deprecated?
// import NewRequest from '@/pages/requests/NewRequest'; // Deprecated
import PartnersList from '@/pages/Monetization/PartnersList';
import ServicesList from '@/pages/Monetization/ServicesList';
import ServiceDetail from '@/pages/Monetization/ServiceDetail';

import Login from '@/pages/Login';
import SelectChurch from '@/pages/onboarding/SelectChurch';
import ProfileHub from '@/pages/profile/ProfileHub';
import ProfileEditor from '@/pages/profile/ProfileEditor';
import PrivacyCenter from '@/pages/profile/PrivacyCenter';
import DonatePage from '@/pages/public/DonatePage';
import PrayerRequestPage from '@/pages/public/PrayerRequestPage';
import SchedulePage from '@/pages/public/SchedulePage';
import RadioPage from '@/pages/public/RadioPage';
import StudiesPage from '@/pages/Content/StudiesPage';

import PartnersPage from '@/pages/public/PartnersPage';
import ComingSoon from '@/pages/ComingSoon';
import { AuthProvider } from '@/contexts/AuthContext';

export default function App() {
  return (
    <AuthProvider>
      <div className="bg-gray-100 min-h-screen flex justify-center relative">
        <DesktopOverlay />
        <MobileContainer>
          <BrowserRouter>
            <AnalyticsTracker />
            <Routes>
              {/* Public Routes (App Shell) */}
              <Route element={<PublicLayout />}>
                <Route path={APP_ROUTES.HOME} element={<LandingPage />} />
                <Route path={APP_ROUTES.ABOUT} element={<PublicContentPage slug="entenda" />} />
                <Route path={APP_ROUTES.BIBLE} element={<BibleView />} />
                <Route path={APP_ROUTES.PRAYER} element={<PrayerRequestPage />} />
                <Route path={APP_ROUTES.AGENDA} element={<SchedulePage />} />
                <Route path={APP_ROUTES.RADIO} element={<RadioPage />} />
                <Route path={APP_ROUTES.DONATE} element={<DonatePage />} />
                <Route path={APP_ROUTES.TRANSPARENCY} element={<PublicContentPage slug="transparencia" />} />
                <Route path={APP_ROUTES.PRIVACY} element={<PublicContentPage slug="privacidade" />} />
                <Route path={APP_ROUTES.TERMS} element={<PublicContentPage slug="termos" />} />
                <Route path={APP_ROUTES.HELP} element={<PublicContentPage slug="ajuda" />} />
                <Route path={APP_ROUTES.PARTNERS} element={<PartnersPage />} />
                <Route path={APP_ROUTES.MURAL} element={<NoticeList />} />
                <Route path={APP_ROUTES.STUDIES} element={<StudiesPage />} />
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
                <Route path="biblia" element={<BibleView />} />
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
          </BrowserRouter>
        </MobileContainer>
      </div>
    </AuthProvider >
  );
}

import { Route, Routes, useParams } from 'react-router-dom';
import LandingPage from './pages/landing/LandingPage';
import BrandPanelPage from './pages/brand/BrandPanelPage';
import AdminPage from './pages/admin/AdminPage';
import InfluencerPanelPage from './pages/influencer/InfluencerPanelPage';
import InfluencerOnboardingPage from './pages/influencer/onboarding/InfluencerOnboardingPage';
import PendingApproval from './pages/auth/PendingApproval';
import {
  RedirectByAuthState,
  RequireAuth,
  RequireOnboarding,
  RequireRole,
} from './components/guards/RouteGuards';

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<LandingPage />} />
      <Route path="/tanitim-sayfasi" element={<LandingPage />} />
      <Route path="/nasil-calisir" element={<LandingPage initialPage="how-it-works" />} />
      <Route path="/markalar" element={<LandingPage initialPage="brands" />} />
      <Route path="/influencerlar" element={<LandingPage initialPage="influencers" />} />
      <Route path="/iletisim" element={<LandingPage initialPage="contact" />} />
      <Route path="/login" element={<LandingPage initialPage="login" />} />
      <Route path="/register" element={<LandingPage initialPage="register" />} />
      <Route path="/auth/redirect" element={<RedirectByAuthState />} />

      <Route path="/brand/onboarding" element={<BrandPanelRoute initialMode="ONBOARDING_STEP1" skipOnboardingGuard />} />
      <Route path="/brand" element={<BrandPanelRoute />} />
      <Route path="/brand/:tab" element={<BrandPanelRoute />} />
      <Route path="/brand-panel" element={<BrandPanelRoute />} />
      <Route path="/brand-panel/:tab" element={<BrandPanelRoute />} />

      <Route
        path="/influencer-profil-olustur"
        element={
          <RequireAuth>
            <RequireRole role="influencer">
              <InfluencerOnboardingPage />
            </RequireRole>
          </RequireAuth>
        }
      />
      <Route
        path="/influencer-onboarding"
        element={
          <RequireAuth>
            <RequireRole role="influencer">
              <InfluencerOnboardingPage />
            </RequireRole>
          </RequireAuth>
        }
      />
      <Route path="/influencer-panel" element={<InfluencerPanelRoute />} />
      <Route path="/influencer-panel/:screen" element={<InfluencerPanelRoute />} />

      <Route path="/admin" element={<AdminRoute />} />
      <Route path="/admin/:tab" element={<AdminRoute />} />
      <Route
        path="/pending-approval"
        element={
          <RequireAuth>
            <PendingApproval />
          </RequireAuth>
        }
      />
      <Route path="*" element={<LandingPage />} />
    </Routes>
  );
}

function BrandPanelRoute({ initialMode = 'MAIN', skipOnboardingGuard = false }) {
  const { tab } = useParams();
  const page = <BrandPanelPage initialMode={initialMode} initialTab={normalizeBrandTab(tab)} />;

  return (
    <RequireAuth>
      <RequireRole role="brand">
        {skipOnboardingGuard ? page : <RequireOnboarding>{page}</RequireOnboarding>}
      </RequireRole>
    </RequireAuth>
  );
}

function InfluencerPanelRoute() {
  const { screen } = useParams();

  return (
    <RequireAuth>
      <RequireRole role="influencer">
        <RequireOnboarding>
          <InfluencerPanelPage initialScreen={normalizeInfluencerScreen(screen)} />
        </RequireOnboarding>
      </RequireRole>
    </RequireAuth>
  );
}

function AdminRoute() {
  const { tab } = useParams();

  return (
    <RequireAuth>
      <RequireRole role="admin">
        <AdminPage initialTab={normalizeAdminTab(tab)} />
      </RequireRole>
    </RequireAuth>
  );
}

function normalizeBrandTab(tab) {
  const aliases = {
    dashboard: 'dashboard',
    campaigns: 'campaigns',
    'new-campaign': 'new_campaign',
    matches: 'matches',
    offers: 'offers',
    messages: 'messages',
    settings: 'settings',
  };

  return aliases[tab] || 'dashboard';
}

function normalizeInfluencerScreen(screen) {
  const screens = ['dashboard', 'offers', 'needs', 'profile', 'portfolio', 'messages', 'settings'];
  return screens.includes(screen) ? screen : 'dashboard';
}

function normalizeAdminTab(tab) {
  const tabs = ['dashboard', 'approvals', 'users', 'campaigns', 'payments', 'settings'];
  return tabs.includes(tab) ? tab : 'dashboard';
}

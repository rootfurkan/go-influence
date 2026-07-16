import { Navigate, useLocation } from 'react-router-dom';
import { useSelector } from 'react-redux';
import AuthLoadingScreen from '../common/AuthLoadingScreen';

export function RequireAuth({ children }) {
  const { initialized, user } = useSelector((state) => state.auth);
  const location = useLocation();

  if (!initialized) return <AuthLoadingScreen />;
  if (!user) return <Navigate to="/login" replace state={{ from: location }} />;

  return children;
}

export function RequireRole({ role, children }) {
  const { initialized, profile } = useSelector((state) => state.auth);

  if (!initialized) return <AuthLoadingScreen />;
  if (!profile) return <Navigate to="/login" replace />;
  if (profile.role !== role) return <Navigate to={getHomeForProfile(profile)} replace />;

  return children;
}

export function RequireOnboarding({ children }) {
  const { initialized, profile } = useSelector((state) => state.auth);

  if (!initialized) return <AuthLoadingScreen />;
  if (!profile) return <Navigate to="/login" replace />;

  if (!profile.onboardingComplete) {
    if (profile.role === 'brand') return <Navigate to="/brand/onboarding" replace />;
    if (profile.role === 'influencer') return <Navigate to="/influencer-profil-olustur" replace />;
  }

  if (profile.role === 'influencer' && !isInfluencerApprovedForPanel(profile)) {
    return <Navigate to="/pending-approval" replace />;
  }

  return children;
}

export function RedirectByAuthState() {
  const { initialized, user, profile } = useSelector((state) => state.auth);

  if (!initialized) return <AuthLoadingScreen />;
  if (!user || !profile) return <Navigate to="/" replace />;

  return <Navigate to={getHomeForProfile(profile)} replace />;
}

export function getHomeForProfile(profile) {
  if (!profile?.onboardingComplete) {
    if (profile?.role === 'brand') return '/brand/onboarding';
    if (profile?.role === 'influencer') return '/influencer-profil-olustur';
  }

  if (profile?.role === 'admin') return '/admin';
  if (profile?.role === 'brand') return '/brand';
  if (profile?.role === 'influencer') {
    return isInfluencerApprovedForPanel(profile) ? '/influencer-panel' : '/pending-approval';
  }

  return '/';
}

function isInfluencerApprovedForPanel(profile) {
  if (!profile) return false;
  if (profile.status === 'approved' || profile.approvalStatus === 'approved') return true;
  return profile.accountStatus === 'active' && profile.isActive !== false;
}

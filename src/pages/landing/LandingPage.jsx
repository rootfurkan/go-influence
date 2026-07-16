import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import Navbar from "./components/Navbar.jsx";
import Footer from "./components/Footer.jsx";
import Home from "./components/Home.jsx";
import HowItWorks from "./components/HowItWorks.jsx";
import ForBrands from "./components/ForBrands.jsx";
import ForInfluencers from "./components/ForInfluencers.jsx";
import Contact from "./components/Contact.jsx";
import Login from "./components/Login.jsx";
import Register from "./components/Register.jsx";
import { CheckCircle2 } from "lucide-react";
import { getHomeForProfile } from "../../components/guards/RouteGuards";
import { logoutUser } from "../../features/auth/authService";
import {
  clearLandingUser,
  clearPreselectedRole,
  hideLandingWelcome,
  setLandingPage,
  setLandingUser,
  setPreselectedRole,
  showLandingWelcome,
} from "../../features/landing/landingSlice";
function App({ initialPage = "home" }) {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { profile } = useSelector((state) => state.auth);
  const { currentPage, preselectedRole, currentUser, showWelcomeMessage } = useSelector((state) => state.landing);
  const [showLoginToast, setShowLoginToast] = useState(false);
  const activeUser = profile || currentUser;
  const landingRoutes = {
    home: "/",
    "how-it-works": "/nasil-calisir",
    brands: "/markalar",
    influencers: "/influencerlar",
    contact: "/iletisim",
    login: "/login",
    register: "/register",
  };
  const navigateTo = (pageId) => {
    if ((pageId === "login" || pageId === "register") && activeUser) {
      navigate(getHomeForProfile(activeUser));
      return;
    }

    navigate(landingRoutes[pageId] || "/");
    dispatch(setLandingPage(pageId));
    window.scrollTo({ top: 0, behavior: "smooth" });
  };
  const handleLoginSuccess = (userProfile) => {
    dispatch(setLandingUser(userProfile));
    dispatch(showLandingWelcome());
    navigate(getHomeForProfile(userProfile));
  };
  const handleRegisterSuccess = (userProfile) => {
    dispatch(setLandingUser(userProfile));
    dispatch(showLandingWelcome());
    navigate(getHomeForProfile(userProfile));
  };
  const handleGoToPanel = () => {
    if (!activeUser) return;
    navigate(getHomeForProfile(activeUser));
  };
  useEffect(() => {
    dispatch(setLandingPage(initialPage));
  }, [dispatch, initialPage]);
  useEffect(() => {
    if (profile) {
      dispatch(setLandingUser(profile));
    }
  }, [dispatch, profile]);
  useEffect(() => {
    if (!activeUser) {
      setShowLoginToast(false);
      return;
    }

    setShowLoginToast(true);
    const timer = setTimeout(() => {
      setShowLoginToast(false);
    }, 3000);

    return () => clearTimeout(timer);
  }, [activeUser?.uid, activeUser?.email]);
  useEffect(() => {
    if (showWelcomeMessage) {
      const timer = setTimeout(() => {
        dispatch(hideLandingWelcome());
      }, 5e3);
      return () => clearTimeout(timer);
    }
  }, [dispatch, showWelcomeMessage]);
  const renderPage = () => {
    switch (currentPage) {
      case "home":
        return <Home navigateTo={navigateTo} setPreselectedRole={(role) => dispatch(setPreselectedRole(role))} />;
      case "how-it-works":
        return <HowItWorks navigateTo={navigateTo} setPreselectedRole={(role) => dispatch(setPreselectedRole(role))} />;
      case "brands":
        return <ForBrands navigateTo={navigateTo} setPreselectedRole={(role) => dispatch(setPreselectedRole(role))} />;
      case "influencers":
        return <ForInfluencers navigateTo={navigateTo} setPreselectedRole={(role) => dispatch(setPreselectedRole(role))} />;
      case "contact":
        return <Contact />;
      case "login":
        return <Login navigateTo={navigateTo} onLoginSuccess={handleLoginSuccess} />;
      case "register":
        return <Register
          navigateTo={navigateTo}
          preselectedRole={preselectedRole}
          clearPreselectedRole={() => dispatch(clearPreselectedRole())}
          onRegisterSuccess={handleRegisterSuccess}
        />;
      default:
        return <Home navigateTo={navigateTo} setPreselectedRole={(role) => dispatch(setPreselectedRole(role))} />;
    }
  };
  return <div className="min-h-screen bg-surface flex flex-col justify-between">
      
      {
    /* Session/Auth Banner */
  }
      {activeUser && showLoginToast && <div className="fixed bottom-6 right-6 z-[60] bg-emerald-600 text-white py-3 px-5 rounded-2xl shadow-2xl flex items-center gap-3 border border-emerald-500 animate-in slide-in-from-bottom-6 fade-in duration-300">
          <CheckCircle2 className="w-5 h-5 text-emerald-100" />
          <div className="text-left text-xs font-sans">
            <p className="font-bold">Giriş Yapıldı</p>
            <p className="opacity-95">{activeUser.displayName || activeUser.email} ({activeUser.role === "brand" ? "Marka" : activeUser.role === "influencer" ? "\u0130\xE7erik \xDCreticisi" : "Admin"})</p>
          </div>
          <button
    onClick={async () => {
      await logoutUser();
      dispatch(clearLandingUser());
    }}
    className="ml-2 bg-white/10 hover:bg-white/20 px-2.5 py-1.5 rounded-lg text-[10px] font-bold uppercase tracking-wider cursor-pointer transition-colors"
  >
            Çıkış Yap
          </button>
        </div>}

      {
    /* Dynamic Welcome Pop-up Notification */
  }
      {showWelcomeMessage && activeUser && <div className="fixed top-24 left-1/2 -translate-x-1/2 z-[60] bg-white border border-emerald-200 px-6 py-4 rounded-2xl shadow-xl flex items-center gap-3 animate-in slide-in-from-top-6 fade-in duration-300">
          <div className="w-8 h-8 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center">
            <CheckCircle2 className="w-5 h-5" />
          </div>
          <div className="text-left text-sm font-sans text-on-surface">
            <p className="font-bold">Hoş Geldiniz, {activeUser.displayName || activeUser.email}!</p>
            <p className="text-xs text-on-surface-variant">Platforma başarıyla giriş yaptınız. Keşfetmeye başlayın!</p>
          </div>
          <button
    onClick={() => dispatch(hideLandingWelcome())}
    className="text-xs text-on-surface-variant hover:text-primary font-bold ml-4 cursor-pointer"
  >
            Kapat
          </button>
        </div>}

      {
    /* Navbar Shared */
  }
      <Navbar currentPage={currentPage} navigateTo={navigateTo} currentUser={activeUser} onGoToPanel={handleGoToPanel} />

      {
    /* Main Page Area */
  }
      <main className="flex-grow">
        {renderPage()}
      </main>

      {
    /* Footer Shared */
  }
      <Footer navigateTo={navigateTo} />
    </div>;
}
export {
  App as default
};

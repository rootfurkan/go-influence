/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */
import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { X, HelpCircle, LifeBuoy } from "lucide-react";
import { completeInfluencerOnboarding, getInfluencerProfile } from "../../../features/auth/authService";
import TopNavBar from "./components/TopNavBar.jsx";
import StepPersonal from "./components/StepPersonal.jsx";
import StepInterests from "./components/StepInterests.jsx";
import StepSocials from "./components/StepSocials.jsx";
import StepPortfolio from "./components/StepPortfolio.jsx";
import ProfileSuccess from "./components/ProfileSuccess.jsx";
const INITIAL_FORM_DATA = {
  displayName: "",
  location: "\u0130stanbul, T\xFCrkiye",
  bio: "",
  profileImage: "https://lh3.googleusercontent.com/aida-public/AB6AXuAr0lcA9WoLaWQJCFJl5eBfw7TsOQLgiJOmK-gL1LNfKUvqxEUUTXvOZJ1h_Qk2hvSvoMWSXvODbe5Qotyc3kjFta8dUriShX0MYqnnm8QtvKxcFVOMjjFxL5YXRVpLpdMurXrbwZOB1Q_KYA3cZh4FWjLGY3GrYSPiAve1wISiJPnHCSSKb16drK3XxYWsPMcLfYrOiDu47RtIEPht4WrsA2p0jcw7TL86LUhLVPYv24hn78k308qj",
  interests: ["teknoloji", "guzellik"],
  socials: {},
  portfolio: [
    "https://lh3.googleusercontent.com/aida-public/AB6AXuAr0lcA9WoLaWQJCFJl5eBfw7TsOQLgiJOmK-gL1LNfKUvqxEUUTXvOZJ1h_Qk2hvSvoMWSXvODbe5Qotyc3kjFta8dUriShX0MYqnnm8QtvKxcFVOMjjFxL5YXRVpLpdMurXrbwZOB1Q_KYA3cZh4FWjLGY3GrYSPiAve1wISiJPnHCSSKb16drK3XxYWsPMcLfYrOiDu47RtIEPht4WrsA2p0jcw7TL86LUhLVPYv24hn78k308qj",
    "https://lh3.googleusercontent.com/aida-public/AB6AXuBdsGDo66ptzEHB7RSr02xmKmOFEPv5HL5AFQe2XwyLvnXBEs-0wkxC5i7_2ZY9nBFv2JtRULeL1jtYKgf2dAps3SdsijZgiM3KQGdWfzP75jPvKxWJnvyMPlA2HEVY12lwdq62RzjBynusf70MBsnP35rK6WTDPxyy-D-WGZqcLrLgH4MuelOfVFaxI00wamdplZySMslwwZDLvmreqh4aG3S35RXahgKmbaEyB5Z5VZVtQxWNU7AO"
  ],
  pricing: {
    post: { min: "2000", max: "5000" },
    story: { min: "1000", max: "3000" },
    reels: { min: "3500", max: "8000" }
  }
};
function App() {
  const navigate = useNavigate();
  const { user } = useSelector((state) => state.auth);
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState(INITIAL_FORM_DATA);
  const [currencySelected, setCurrencySelected] = useState("\u20BA");
  const [showHelpModal, setShowHelpModal] = useState(false);
  const [saving, setSaving] = useState(false);
  const [loadingProfile, setLoadingProfile] = useState(false);
  useEffect(() => {
    if (!user?.uid) return;

    let ignore = false;

    async function loadExistingProfile() {
      setLoadingProfile(true);
      const existingProfile = await getInfluencerProfile(user.uid);
      if (ignore) return;

      if (existingProfile) {
        setFormData(mapInfluencerProfileToFormData(existingProfile));
      }

      setLoadingProfile(false);
    }

    loadExistingProfile();

    return () => {
      ignore = true;
    };
  }, [user?.uid]);
  const handleNextStep = () => {
    setStep((prev) => prev + 1);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };
  const handlePrevStep = () => {
    setStep((prev) => prev - 1);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };
  const handleFormReset = () => {
    if (confirm("Profil kurulumunu s\u0131f\u0131rlamak istedi\u011Finize emin misiniz?")) {
      setFormData(INITIAL_FORM_DATA);
      setStep(1);
    }
  };
  const handleForceReset = () => {
    setFormData(INITIAL_FORM_DATA);
    setStep(1);
  };
  const handleProfileSubmit = async (currency) => {
    if (!user?.uid) return;

    setSaving(true);
    await completeInfluencerOnboarding(user.uid, {
      ...formData,
      currency,
    });
    setSaving(false);
    setCurrencySelected(currency);
    setStep(5);
    window.scrollTo({ top: 0, behavior: "smooth" });
    navigate("/pending-approval", { replace: true });
  };
  return <div className="bg-surface text-on-surface min-h-screen flex flex-col font-sans selection:bg-primary/20 select-text relative">
      
      {
    /* Decorative ambient glowing background elements */
  }
      <div className="glow-sphere bg-primary w-[450px] h-[450px] -top-36 -right-24" />
      <div className="glow-sphere bg-secondary-container w-[500px] h-[500px] bottom-0 -left-28" />
      <div className="glow-sphere bg-tertiary-fixed w-[300px] h-[300px] top-[40%] left-[20%]" />

      {
    /* Navigation TopBar */
  }
      <TopNavBar
    onReset={handleForceReset}
    onHelpClick={() => setShowHelpModal(true)}
  />

      {
    /* Help Overlay Modal */
  }
      {showHelpModal && <div className="fixed inset-0 bg-black/45 backdrop-blur-sm z-50 flex items-center justify-center p-4 animate-fade-in">
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 md:p-8 space-y-6 shadow-2xl relative border border-surface-container-high">
            <button
    type="button"
    onClick={() => setShowHelpModal(false)}
    className="absolute top-5 right-5 w-8 h-8 rounded-full bg-surface-container hover:bg-surface-container-high transition-colors flex items-center justify-center text-on-surface-variant hover:text-on-surface cursor-pointer"
  >
              <X size={16} />
            </button>

            <div className="space-y-2">
              <h3 className="text-2xl font-display font-extrabold text-primary flex items-center gap-2">
                <HelpCircle size={24} />
                Onboarding Yardımı
              </h3>
              <p className="text-xs text-on-surface-variant font-medium">
                Sıkça sorulan soruları aşağıda bulabilirsiniz.
              </p>
            </div>


            <div className="space-y-4 max-h-[350px] overflow-y-auto pr-2">
              <div className="space-y-1">
                <h4 className="font-bold text-sm text-on-surface">Kategoriler ne işe yarıyor?</h4>
                <p className="text-xs text-on-surface-variant leading-relaxed">
                  İlgi alanları ve içerik ürettiğiniz kategoriler, markaların arama filtrelerinde öncelikli çıkmanızı sağlar.
                </p>
              </div>
              <div className="space-y-1">
                <h4 className="font-bold text-sm text-on-surface">Sosyal medya verilerimi doğrulamalı mıyım?</h4>
                <p className="text-xs text-on-surface-variant leading-relaxed">
                  Evet. "Doğrula ve Analiz Et" butonu ile hesap istatistiklerinizi analiz edebilirsiniz. Bu, markaların size duyduğu güveni artırır.
                </p>
              </div>
              <div className="space-y-1">
                <h4 className="font-bold text-sm text-on-surface">Fiyat aralıklarımı değiştirebilir miyim?</h4>
                <p className="text-xs text-on-surface-variant leading-relaxed">
                  Belirttiğiniz fiyatlar markaların size teklif gönderirken referans alacağı başlangıç aralıklarıdır. Teklif geldiğinde kabul edebilir veya reddedebilirsiniz.
                </p>
              </div>
              <div className="space-y-1">
                <h4 className="font-bold text-sm text-on-surface">Profil onayı ne kadar sürer?</h4>
                <p className="text-xs text-on-surface-variant leading-relaxed">
                  Kaydı tamamladığınızda ekibimiz profilinizi 12-24 saat içinde inceler ve onaylandığında SMS/E-posta ile bilgilendirme yapar.
                </p>
              </div>
            </div>

            <button
    type="button"
    onClick={() => setShowHelpModal(false)}
    className="w-full py-4 bg-primary text-white font-bold rounded-2xl text-xs shadow-md transition-all hover:opacity-95"
  >
              Anladım, Devam Et
            </button>
          </div>
        </div>}

      {
    /* Main Wizard Page container */
  }
      <main className="flex-1 pt-28 pb-20 max-w-[1000px] mx-auto w-full px-6 flex flex-col justify-start">
        
        {
    /* Step progress indicators (Header) */
  }
        {step <= 4 && <div className="mb-10 flex flex-col items-center">
            {
    /* Horizontal progress row */
  }
            <div className="flex items-center justify-between w-full max-w-xl mb-6 relative">
              {
    /* Stepper horizontal line */
  }
              <div className="absolute top-1/2 left-0 w-full h-[2px] bg-surface-container-highest -translate-y-1/2 -z-10" />
              <div
    className="absolute top-1/2 left-0 h-[2px] bg-primary -translate-y-1/2 -z-10 transition-all duration-500"
    style={{ width: `${(step - 1) / 3 * 100}%` }}
  />

              {
    /* Step 1 */
  }
              <div className="flex flex-col items-center gap-1.5 bg-surface px-2">
                <div className={`w-9 h-9 rounded-full flex items-center justify-center font-bold text-sm transition-all duration-300 ${step > 1 ? "bg-primary text-white shadow-sm" : step === 1 ? "bg-primary text-white ring-4 ring-primary-fixed shadow-[0_0_15px_rgba(144,0,215,0.25)]" : "bg-surface-container-highest text-on-surface-variant"}`}>
                  {step > 1 ? "\u2713" : "1"}
                </div>
                <span className={`text-[10px] uppercase tracking-wider font-extrabold ${step === 1 ? "text-primary" : "text-on-surface-variant"}`}>
                  Kurulum
                </span>
              </div>

              {
    /* Step 2 */
  }
              <div className="flex flex-col items-center gap-1.5 bg-surface px-2">
                <div className={`w-9 h-9 rounded-full flex items-center justify-center font-bold text-sm transition-all duration-300 ${step > 2 ? "bg-primary text-white shadow-sm" : step === 2 ? "bg-primary text-white ring-4 ring-primary-fixed shadow-[0_0_15px_rgba(144,0,215,0.25)]" : "bg-surface-container-highest text-on-surface-variant"}`}>
                  {step > 2 ? "\u2713" : "2"}
                </div>
                <span className={`text-[10px] uppercase tracking-wider font-extrabold ${step === 2 ? "text-primary" : "text-on-surface-variant"}`}>
                  İlgi Alanları
                </span>
              </div>

              {
    /* Step 3 */
  }
              <div className="flex flex-col items-center gap-1.5 bg-surface px-2">
                <div className={`w-9 h-9 rounded-full flex items-center justify-center font-bold text-sm transition-all duration-300 ${step > 3 ? "bg-primary text-white shadow-sm" : step === 3 ? "bg-primary text-white ring-4 ring-primary-fixed shadow-[0_0_15px_rgba(144,0,215,0.25)]" : "bg-surface-container-highest text-on-surface-variant"}`}>
                  {step > 3 ? "\u2713" : "3"}
                </div>
                <span className={`text-[10px] uppercase tracking-wider font-extrabold ${step === 3 ? "text-primary" : "text-on-surface-variant"}`}>
                  Kanallar
                </span>
              </div>

              {
    /* Step 4 */
  }
              <div className="flex flex-col items-center gap-1.5 bg-surface px-2">
                <div className={`w-9 h-9 rounded-full flex items-center justify-center font-bold text-sm transition-all duration-300 ${step === 4 ? "bg-primary text-white ring-4 ring-primary-fixed shadow-[0_0_15px_rgba(144,0,215,0.25)]" : "bg-surface-container-highest text-on-surface-variant"}`}>
                  4
                </div>
                <span className={`text-[10px] uppercase tracking-wider font-extrabold ${step === 4 ? "text-primary" : "text-on-surface-variant"}`}>
                  Portfolyo
                </span>
              </div>
            </div>
          </div>}

        {
    /* Form Body Component Resolution */
  }
        <div className="transition-all duration-300 ease-in-out">
          {loadingProfile && <p className="mb-4 text-center text-xs font-bold text-primary">Profil bilgilerin yükleniyor...</p>}
          {step === 1 && <StepPersonal
    formData={formData}
    setFormData={setFormData}
    onNext={handleNextStep}
  />}

          {step === 2 && <StepInterests
    formData={formData}
    setFormData={setFormData}
    onNext={handleNextStep}
    onPrev={handlePrevStep}
  />}

          {step === 3 && <StepSocials
    formData={formData}
    setFormData={setFormData}
    onNext={handleNextStep}
    onPrev={handlePrevStep}
  />}

          {step === 4 && <StepPortfolio
    formData={formData}
    setFormData={setFormData}
    onSubmit={handleProfileSubmit}
    onPrev={handlePrevStep}
  />}
          {saving && <p className="mt-4 text-center text-xs font-bold text-primary">Profil kaydediliyor...</p>}

          {step === 5 && <ProfileSuccess
    formData={formData}
    currencySelected={currencySelected}
    onReset={handleForceReset}
  />}
        </div>
      </main>

      {
    /* Unified footer with dynamic resetting */
  }
      <footer className="w-full py-8 bg-surface-container-low border-t border-surface-container mt-12">
        <div className="max-w-[1000px] mx-auto px-6 flex flex-col md:flex-row justify-between items-center gap-4 text-xs text-on-surface-variant/80">
          <div className="font-extrabold text-primary text-base select-none">
            Go Influence
          </div>
          <div className="flex flex-wrap justify-center gap-6 font-semibold">
            <button type="button" onClick={() => setShowHelpModal(true)} className="hover:text-primary transition-colors cursor-pointer">
              Gizlilik Politikası
            </button>
            <button type="button" onClick={() => setShowHelpModal(true)} className="hover:text-primary transition-colors cursor-pointer">
              Kullanım Koşulları
            </button>
            <button type="button" onClick={() => setShowHelpModal(true)} className="hover:text-primary transition-colors text-primary flex items-center gap-1 cursor-pointer">
              <LifeBuoy size={14} />
              Canlı Destek
            </button>
          </div>
          <div className="font-medium text-center md:text-right">
            © 2026 Go Influence. Tüm hakları saklıdır.
          </div>
        </div>
      </footer>
    </div>;
}
export {
  App as default
};

function mapInfluencerProfileToFormData(profile) {
  const priceRange = profile.priceRange || {};
  const fallbackPricing = {
    post: { min: String(priceRange.min || "2000"), max: String(priceRange.max || "5000") },
    story: { min: String(priceRange.min || "1000"), max: String(priceRange.max || "3000") },
    reels: { min: String(priceRange.min || "3500"), max: String(priceRange.max || "8000") }
  };

  return {
    ...INITIAL_FORM_DATA,
    displayName: profile.displayName || "",
    location: profile.location || INITIAL_FORM_DATA.location,
    bio: profile.bio || "",
    profileImage: profile.profileImageUrl || INITIAL_FORM_DATA.profileImage,
    interests: profile.categories?.length ? profile.categories : INITIAL_FORM_DATA.interests,
    socials: profile.socialAccounts || {},
    portfolio: profile.portfolio?.length ? profile.portfolio : INITIAL_FORM_DATA.portfolio,
    pricing: {
      post: {
        min: String(profile.pricing?.post?.min ?? fallbackPricing.post.min),
        max: String(profile.pricing?.post?.max ?? fallbackPricing.post.max)
      },
      story: {
        min: String(profile.pricing?.story?.min ?? fallbackPricing.story.min),
        max: String(profile.pricing?.story?.max ?? fallbackPricing.story.max)
      },
      reels: {
        min: String(profile.pricing?.reels?.min ?? fallbackPricing.reels.min),
        max: String(profile.pricing?.reels?.max ?? fallbackPricing.reels.max)
      }
    }
  };
}

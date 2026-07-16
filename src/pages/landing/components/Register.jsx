import React, { useState, useEffect } from "react";
import { Store, Wand2, Network, ShieldCheck, Mail, Lock, User, Sparkles, Loader2, CheckCircle2 } from "lucide-react";
import { registerUser } from "../../../features/auth/authService";

export default function Register({ navigateTo, preselectedRole, clearPreselectedRole, onRegisterSuccess }) {
  const [selectedRole, setSelectedRole] = useState("marka"); // 'marka' | 'creator' | 'agency'
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    // Dynamic fields
    companyName: "",
    website: "",
    socialPlatform: "instagram",
    followers: "",
    agencyName: "",
    agreeTerms: false
  });
  const [loading, setLoading] = useState(false);
  const [registered, setRegistered] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  // Sync with preselected role from Home/HowItWorks/Brands/Influencers buttons
  useEffect(() => {
    if (preselectedRole) {
      setSelectedRole(preselectedRole);
      clearPreselectedRole(); // reset so it doesn't lock forever
    }
  }, [preselectedRole]);

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value
    }));
    setErrorMessage("");
  };

  const handleRoleChange = (role) => {
    setSelectedRole(role);
    setErrorMessage("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (selectedRole === "agency") {
      setErrorMessage("Ajans hesabı sonraki fazda eklenecek. Şimdilik marka veya içerik üreticisi rolünü seçin.");
      return;
    }
    if (!formData.name || !formData.email || !formData.password) {
      setErrorMessage("Lütfen tüm zorunlu alanları doldurun.");
      return;
    }
    if (!formData.agreeTerms) {
      setErrorMessage("Devam etmek için kullanım ve gizlilik koşullarını onaylamalısınız.");
      return;
    }

    setLoading(true);
    try {
      await registerUser({
        email: formData.email,
        password: formData.password,
        role: selectedRole,
        displayName: formData.name,
      });
      setLoading(false);
      setRegistered(true);
    } catch (error) {
      setErrorMessage(getAuthErrorMessage(error));
      setLoading(false);
    }
  };

  const handleFinalSuccessRedirect = () => {
    const profile = {
      displayName: formData.name || "Kullanıcı",
      email: formData.email,
      role: selectedRole === "creator" ? "influencer" : "brand",
      onboardingComplete: false,
      status: "active"
    };
    onRegisterSuccess(profile);
  };

  return (
    <div className="pt-20 min-h-screen bg-surface flex items-center justify-center px-6 py-12">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_40%,rgba(176,38,255,0.05)_0%,transparent_50%)] -z-10" />
      
      <div className="bg-white rounded-[40px] border border-outline-variant/60 shadow-2xl p-6 md:p-12 w-full max-w-2xl text-left">
        
        {registered ? (
          <div className="space-y-6 text-center py-8 animate-in fade-in zoom-in duration-300">
            <div className="w-20 h-20 rounded-full bg-emerald-100 flex items-center justify-center mx-auto text-emerald-600">
              <CheckCircle2 className="w-12 h-12" />
            </div>
            <div className="space-y-2">
              <h1 className="font-sans font-extrabold text-2xl md:text-3xl text-emerald-900">Hesabınız Başarıyla Oluşturuldu!</h1>
              <p className="font-sans text-sm text-on-surface-variant max-w-md mx-auto">
                Kayıt işleminiz tamamlandı. Hoş geldiniz! Platformumuzun tüm olanaklarını deneyimlemeye hazırsınız.
              </p>
            </div>
            <button
              onClick={handleFinalSuccessRedirect}
              className="bg-primary text-white font-sans font-bold px-8 py-3.5 rounded-full text-sm hover:scale-105 active:scale-95 transition-all shadow-md cursor-pointer mt-4"
            >
              Uygulamaya Giriş Yap
            </button>
          </div>
        ) : (
          <div className="space-y-8">
            
            {/* Header */}
            <div className="space-y-2 text-center md:text-left">
              <h1 className="font-sans font-extrabold text-2xl md:text-3xl text-on-surface">Hesap Oluştur</h1>
              <p className="font-sans text-sm text-on-surface-variant">Saniyeler içinde topluluğumuza katılın ve iş birliklerini yönetmeye başlayın.</p>
            </div>

            {/* Role Selection Cards */}
            <div className="space-y-3">
              <label className="text-xs font-sans font-bold text-on-surface-variant uppercase tracking-wider block">Kullanıcı Rolünüzü Seçin *</label>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {/* Role 1: Marka */}
                <button
                  type="button"
                  onClick={() => handleRoleChange("marka")}
                  className={`p-5 rounded-2xl border text-left flex flex-col justify-between gap-4 cursor-pointer transition-all ${
                    selectedRole === "marka" 
                      ? "border-primary bg-primary/[0.02] shadow-md shadow-primary/5" 
                      : "border-outline-variant hover:bg-surface"
                  }`}
                >
                  <div className={`p-2.5 rounded-xl self-start ${selectedRole === "marka" ? "bg-primary text-white" : "bg-surface-container-low text-on-surface-variant"}`}>
                    <Store className="w-5 h-5" />
                  </div>
                  <div>
                    <h4 className="font-sans font-bold text-sm text-on-surface">Marka / İşletme</h4>
                    <p className="font-sans text-[11px] text-on-surface-variant leading-relaxed mt-1">İçerik üreticileri keşfetmek ve ilan açmak istiyorum.</p>
                  </div>
                </button>

                {/* Role 2: Creator */}
                <button
                  type="button"
                  onClick={() => handleRoleChange("creator")}
                  className={`p-5 rounded-2xl border text-left flex flex-col justify-between gap-4 cursor-pointer transition-all ${
                    selectedRole === "creator" 
                      ? "border-primary bg-primary/[0.02] shadow-md shadow-primary/5" 
                      : "border-outline-variant hover:bg-surface"
                  }`}
                >
                  <div className={`p-2.5 rounded-xl self-start ${selectedRole === "creator" ? "bg-primary text-white" : "bg-surface-container-low text-on-surface-variant"}`}>
                    <Wand2 className="w-5 h-5" />
                  </div>
                  <div>
                    <h4 className="font-sans font-bold text-sm text-on-surface">İçerik Üreticisi</h4>
                    <p className="font-sans text-[11px] text-on-surface-variant leading-relaxed mt-1">Markalarla iş birliği yapıp kazanç sağlamak istiyorum.</p>
                  </div>
                </button>

                {/* Role 3: Agency */}
                <button
                  type="button"
                  onClick={() => handleRoleChange("agency")}
                  className={`p-5 rounded-2xl border text-left flex flex-col justify-between gap-4 cursor-pointer transition-all ${
                    selectedRole === "agency" 
                      ? "border-primary bg-primary/[0.02] shadow-md shadow-primary/5" 
                      : "border-outline-variant hover:bg-surface"
                  }`}
                >
                  <div className={`p-2.5 rounded-xl self-start ${selectedRole === "agency" ? "bg-primary text-white" : "bg-surface-container-low text-on-surface-variant"}`}>
                    <Network className="w-5 h-5" />
                  </div>
                  <div>
                    <h4 className="font-sans font-bold text-sm text-on-surface">Ajans / Temsilci</h4>
                    <p className="font-sans text-[11px] text-on-surface-variant leading-relaxed mt-1">Birden çok marka veya influencer hesabı yönetiyorum.</p>
                  </div>
                </button>
              </div>
            </div>

            {/* Registration Form */}
            <form onSubmit={handleSubmit} className="space-y-5">
              
              {errorMessage && (
                <div className="bg-red-50 border border-red-200 text-red-800 p-4 rounded-xl font-sans text-xs md:text-sm">
                  {errorMessage}
                </div>
              )}

              {/* Grid for Name and Email */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                <div className="space-y-2">
                  <label className="text-xs font-sans font-bold text-on-surface-variant uppercase tracking-wider block">Adınız Soyadınız *</label>
                  <div className="relative flex items-center">
                    <div className="absolute left-4 text-on-surface-variant/50">
                      <User className="w-4 h-4" />
                    </div>
                    <input 
                      type="text"
                      name="name"
                      required
                      value={formData.name}
                      onChange={handleInputChange}
                      placeholder="Örn: Selin Yılmaz"
                      className="w-full bg-surface border border-outline-variant rounded-2xl pl-11 pr-4 py-3 text-sm font-sans focus:border-primary focus:outline-none transition-colors"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-xs font-sans font-bold text-on-surface-variant uppercase tracking-wider block">E-Posta Adresiniz *</label>
                  <div className="relative flex items-center">
                    <div className="absolute left-4 text-on-surface-variant/50">
                      <Mail className="w-4 h-4" />
                    </div>
                    <input 
                      type="email"
                      name="email"
                      required
                      value={formData.email}
                      onChange={handleInputChange}
                      placeholder="ornek@alanadi.com"
                      className="w-full bg-surface border border-outline-variant rounded-2xl pl-11 pr-4 py-3 text-sm font-sans focus:border-primary focus:outline-none transition-colors"
                    />
                  </div>
                </div>
              </div>

              {/* Password */}
              <div className="space-y-2">
                <label className="text-xs font-sans font-bold text-on-surface-variant uppercase tracking-wider block">Şifre Belirleyin *</label>
                <div className="relative flex items-center">
                  <div className="absolute left-4 text-on-surface-variant/50">
                    <Lock className="w-4 h-4" />
                  </div>
                  <input 
                    type="password"
                    name="password"
                    required
                    value={formData.password}
                    onChange={handleInputChange}
                    placeholder="En az 6 karakter"
                    className="w-full bg-surface border border-outline-variant rounded-2xl pl-11 pr-4 py-3 text-sm font-sans focus:border-primary focus:outline-none transition-colors"
                  />
                </div>
              </div>

              {/* Dynamic Context Fields based on Selected Role */}
              {selectedRole === "marka" && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-5 p-5 bg-primary/[0.01] rounded-2xl border border-primary/5 space-y-4 md:space-y-0">
                  <div className="space-y-2">
                    <label className="text-xs font-sans font-bold text-on-surface-variant uppercase tracking-wider block">Firma / Marka Adı</label>
                    <input 
                      type="text"
                      name="companyName"
                      value={formData.companyName}
                      onChange={handleInputChange}
                      placeholder="Örn: Aura Güzellik"
                      className="w-full bg-white border border-outline-variant rounded-2xl px-4 py-3 text-sm font-sans focus:border-primary focus:outline-none transition-colors"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-xs font-sans font-bold text-on-surface-variant uppercase tracking-wider block">Web Sitesi veya Sektör</label>
                    <input 
                      type="text"
                      name="website"
                      value={formData.website}
                      onChange={handleInputChange}
                      placeholder="Örn: www.aura.com / Kozmetik"
                      className="w-full bg-white border border-outline-variant rounded-2xl px-4 py-3 text-sm font-sans focus:border-primary focus:outline-none transition-colors"
                    />
                  </div>
                </div>
              )}

              {selectedRole === "creator" && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-5 p-5 bg-amber-50/10 rounded-2xl border border-amber-500/10 space-y-4 md:space-y-0">
                  <div className="space-y-2">
                    <label className="text-xs font-sans font-bold text-on-surface-variant uppercase tracking-wider block">Ana Sosyal Medya Platformunuz</label>
                    <select 
                      name="socialPlatform"
                      value={formData.socialPlatform}
                      onChange={handleInputChange}
                      className="w-full bg-white border border-outline-variant rounded-2xl px-4 py-3 text-sm font-sans focus:border-primary focus:outline-none transition-colors"
                    >
                      <option value="instagram">Instagram</option>
                      <option value="youtube">YouTube</option>
                      <option value="tiktok">TikTok</option>
                      <option value="twitch">Twitch / Diğer</option>
                    </select>
                  </div>
                  <div className="space-y-2">
                    <label className="text-xs font-sans font-bold text-on-surface-variant uppercase tracking-wider block">Yaklaşık Takipçi Sayınız</label>
                    <input 
                      type="text"
                      name="followers"
                      value={formData.followers}
                      onChange={handleInputChange}
                      placeholder="Örn: 150,000"
                      className="w-full bg-white border border-outline-variant rounded-2xl px-4 py-3 text-sm font-sans focus:border-primary focus:outline-none transition-colors"
                    />
                  </div>
                </div>
              )}

              {selectedRole === "agency" && (
                <div className="p-5 bg-slate-50 rounded-2xl border border-slate-200 space-y-2">
                  <label className="text-xs font-sans font-bold text-on-surface-variant uppercase tracking-wider block">Ajans Adı</label>
                  <input 
                    type="text"
                    name="agencyName"
                    value={formData.agencyName}
                    onChange={handleInputChange}
                    placeholder="Örn: Star PR & Management"
                    className="w-full bg-white border border-outline-variant rounded-2xl px-4 py-3 text-sm font-sans focus:border-primary focus:outline-none transition-colors"
                  />
                </div>
              )}

              {/* Agree Terms and privacy */}
              <div className="flex items-start gap-2.5 pt-2">
                <input 
                  type="checkbox" 
                  name="agreeTerms"
                  id="agree-terms"
                  checked={formData.agreeTerms}
                  onChange={handleInputChange}
                  className="rounded border-outline-variant text-primary focus:ring-primary w-4 h-4 mt-0.5 cursor-pointer"
                />
                <label htmlFor="agree-terms" className="font-sans text-xs text-on-surface-variant select-none cursor-pointer leading-relaxed">
                  Go Influence <span className="text-primary font-bold hover:underline">Kullanım Koşulları</span>'nı ve <span className="text-primary font-bold hover:underline">Gizlilik Politikası</span>'nı okudum, onaylıyorum.
                </label>
              </div>

              {/* Submit button */}
              <button
                type="submit"
                disabled={loading}
                className="w-full bg-primary text-white font-sans font-bold py-4 rounded-2xl hover:scale-[1.02] active:scale-[0.98] disabled:opacity-75 transition-all shadow-lg shadow-primary/10 flex items-center justify-center gap-2 cursor-pointer mt-4"
              >
                {loading ? (
                  <>
                    <Loader2 className="w-5 h-5 animate-spin" />
                    <span>Kaydınız İşleniyor...</span>
                  </>
                ) : (
                  <span>Kayıt Ol</span>
                )}
              </button>

            </form>

            {/* Social signups */}
            <div className="space-y-4">
              <div className="relative flex py-2 items-center">
                <div className="flex-grow border-t border-surface-container-low"></div>
                <span className="flex-shrink mx-4 text-xs font-sans text-on-surface-variant/60 font-semibold uppercase tracking-wider">Hızlı Kayıt Ol</span>
                <div className="flex-grow border-t border-surface-container-low"></div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <button 
                  onClick={() => {
                    setErrorMessage("Google ile kayıt sonraki fazda aktif edilecek.");
                  }}
                  className="bg-white border border-outline-variant px-4 py-3 rounded-2xl flex items-center justify-center gap-2 text-xs md:text-sm font-sans font-bold hover:bg-surface transition-colors cursor-pointer"
                >
                  <img src="https://www.svgrepo.com/show/475656/google-color.svg" alt="Google" className="w-4 h-4" />
                  <span>Google</span>
                </button>
                <button 
                  onClick={() => {
                    setErrorMessage("Apple ile kayıt sonraki fazda aktif edilecek.");
                  }}
                  className="bg-white border border-outline-variant px-4 py-3 rounded-2xl flex items-center justify-center gap-2 text-xs md:text-sm font-sans font-bold hover:bg-surface transition-colors cursor-pointer"
                >
                  <img src="https://www.svgrepo.com/show/511330/apple-os.svg" alt="Apple" className="w-4 h-4" />
                  <span>Apple</span>
                </button>
              </div>
            </div>

            {/* Redirect back to Login */}
            <div className="pt-6 border-t border-surface-container-low text-center font-sans text-xs md:text-sm text-on-surface-variant">
              <span>Zaten hesabınız var mı? </span>
              <button 
                onClick={() => navigateTo("login")}
                className="text-primary font-bold hover:underline cursor-pointer"
              >
                Giriş Yapın
              </button>
            </div>

          </div>
        )}

      </div>
    </div>
  );
}

function getAuthErrorMessage(error) {
  if (error?.code === "auth/email-already-in-use") return "Bu e-posta adresi zaten kayıtlı.";
  if (error?.code === "auth/weak-password") return "Şifre en az 6 karakter olmalı.";
  if (error?.code === "auth/invalid-email") return "Geçerli bir e-posta adresi girin.";
  return "Kayıt oluşturulamadı. Lütfen bilgilerinizi kontrol edin.";
}

import React, { useState } from "react";
import { Eye, EyeOff, ShieldCheck, Sparkles, Star, Loader2, Mail, Lock } from "lucide-react";
import { loginUser } from "../../../features/auth/authService";

export default function Login({ navigateTo, onLoginSuccess }) {
  const [formData, setFormData] = useState({
    email: "",
    password: ""
  });
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    setErrorMessage(""); // clear error
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.email || !formData.password) {
      setErrorMessage("Lütfen tüm alanları doldurun.");
      return;
    }

    setLoading(true);
    try {
      const profile = await loginUser(formData);
      if (!profile) {
        setErrorMessage("Kullanıcı profiliniz bulunamadı. Lütfen destek ile iletişime geçin.");
        return;
      }
      onLoginSuccess(profile);
    } catch (error) {
      setErrorMessage(getAuthErrorMessage(error));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="pt-20 min-h-screen bg-surface flex items-center px-4 py-4 mt-2">
      <div className="w-full max-w-[1160px] max-h-[calc(100vh-6rem)] mx-auto grid grid-cols-1 lg:grid-cols-12 overflow-hidden rounded-[32px] border border-outline-variant/60 bg-white shadow-xl">
        
        {/* Left Column: Visual Brand Banner (Desktop only) */}
        <div className="hidden lg:flex lg:col-span-5 bg-gradient-to-br from-[#7000a8] to-[#25003c] text-white p-8 flex-col justify-between relative overflow-hidden border-r border-white/20">
          {/* Decorative ambient glowing lines */}
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_80%_20%,rgba(255,255,255,0.15)_0%,transparent_50%)]" />
          <div className="absolute -bottom-20 -left-20 w-80 h-80 bg-primary/20 rounded-full blur-3xl" />

          {/* Logo / Header */}
          <div 
            onClick={() => navigateTo("home")}
            className="text-xl font-extrabold tracking-tight cursor-pointer hover:opacity-90 self-start relative z-10"
          >
            Go Influence
          </div>

          {/* Core Content Showcase */}
          <div className="space-y-5 relative z-10 text-left">
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/10 border border-white/10 text-xs font-semibold font-sans">
              <Sparkles className="w-3.5 h-3.5 text-[#F9F871]" />
              <span>Yıldızlarla Markanızı Buluşturun</span>
            </div>

            <div className="space-y-4">
              <h2 className="font-sans font-extrabold text-2xl md:text-3xl leading-tight">
                Hayalinizdeki Kampanyayı Bugün Başlatın
              </h2>
              <p className="font-sans text-white/80 text-sm leading-relaxed">
                Yüzlerce doğrulanmış kreatif arasından bütçenize ve hedeflerinize en uygun olanı bulun, süreci güvenle yönetin.
              </p>
            </div>

            {/* Featured Mini Creator Profile card illustration */}
            <div className="bg-white/10 border border-white/20 backdrop-blur-md rounded-2xl p-4 space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <img 
                    src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=100" 
                    alt="Selin Aras" 
                    className="w-10 h-10 rounded-full object-cover border border-white/20"
                  />
                  <div>
                    <h4 className="font-sans font-bold text-xs">Selin Aras</h4>
                    <p className="font-sans text-[10px] text-white/70">Güzellik & Moda (240K)</p>
                  </div>
                </div>
                <div className="bg-[#F9F871] text-on-surface font-sans font-bold text-[10px] px-2 py-0.5 rounded-full border border-black/5 flex items-center gap-1">
                  <Star className="w-3 h-3 fill-on-surface" />
                  98% Uyum
                </div>
              </div>

              <div className="grid grid-cols-2 gap-2 text-xs border-t border-white/10 pt-3">
                <div>
                  <p className="text-[9px] text-white/50 font-sans">Etkileşim Oranı</p>
                  <p className="font-sans font-bold text-[#F9F871]">4.8%</p>
                </div>
                <div>
                  <p className="text-[9px] text-white/50 font-sans">Erişim Skoru</p>
                  <p className="font-sans font-bold">Mükemmel</p>
                </div>
              </div>
            </div>
          </div>

          {/* Footer badge */}
          <div className="text-xs text-white/40 flex items-center gap-1.5 relative z-10 font-sans">
            <ShieldCheck className="w-4 h-4 text-emerald-400" />
            <span>Escrow ve SSL Güvenceli Platform</span>
          </div>
        </div>

        {/* Right Column: Beautiful Login Form */}
        <div className="w-full lg:col-span-7 bg-white p-5 md:p-10 flex flex-col justify-center text-left overflow-y-auto">
          <div className="max-w-sm w-full mx-auto space-y-5">
            
            {/* Header info */}
            <div className="space-y-2">
              <h1 className="font-sans font-extrabold text-2xl text-on-surface">Tekrar Hoş Geldiniz</h1>
              <p className="font-sans text-sm text-on-surface-variant">Devam etmek için kayıtlı e-posta adresiniz ve şifrenizle giriş yapın.</p>
            </div>

            {/* Form */}
            <form onSubmit={handleSubmit} className="space-y-4">
              
              {errorMessage && (
                <div className="bg-red-50 border border-red-200 text-red-800 p-3 rounded-xl font-sans text-xs md:text-sm">
                  {errorMessage}
                </div>
              )}

              {/* Email */}
              <div className="space-y-2">
                <label className="text-xs font-sans font-bold text-on-surface-variant uppercase tracking-wider block">E-Posta Adresi</label>
                <div className="relative flex items-center">
                  <div className="absolute left-4 text-on-surface-variant/50">
                    <Mail className="w-5 h-5" />
                  </div>
                  <input 
                    type="email"
                    name="email"
                    required
                    value={formData.email}
                    onChange={handleInputChange}
                    placeholder="ornek@alanadi.com"
                    className="w-full bg-surface border border-outline-variant rounded-2xl pl-12 pr-4 py-3 text-sm font-sans focus:border-primary focus:outline-none transition-colors"
                  />
                </div>
              </div>

              {/* Password */}
              <div className="space-y-2">
                <div className="flex justify-between items-center">
                  <label className="text-xs font-sans font-bold text-on-surface-variant uppercase tracking-wider block">Şifre</label>
                  <a href="#" className="text-xs font-sans font-bold text-primary hover:underline">Şifremi Unuttum</a>
                </div>
                <div className="relative flex items-center">
                  <div className="absolute left-4 text-on-surface-variant/50">
                    <Lock className="w-5 h-5" />
                  </div>
                  <input 
                    type={showPassword ? "text" : "password"}
                    name="password"
                    required
                    value={formData.password}
                    onChange={handleInputChange}
                    placeholder="••••••••"
                    className="w-full bg-surface border border-outline-variant rounded-2xl pl-12 pr-12 py-3 text-sm font-sans focus:border-primary focus:outline-none transition-colors"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-4 text-on-surface-variant/50 hover:text-primary transition-colors cursor-pointer"
                  >
                    {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                  </button>
                </div>
              </div>

              {/* Remember me */}
              <div className="flex items-center gap-2">
                <input 
                  type="checkbox" 
                  id="remember-me"
                  className="rounded border-outline-variant text-primary focus:ring-primary w-4 h-4"
                />
                <label htmlFor="remember-me" className="font-sans text-xs text-on-surface-variant select-none cursor-pointer">
                  Beni Hatırla
                </label>
              </div>

              {/* Submit button */}
              <button
                type="submit"
                disabled={loading}
                className="w-full bg-primary text-white font-sans font-bold py-3.5 rounded-2xl hover:scale-[1.02] active:scale-[0.98] disabled:opacity-75 transition-all shadow-lg shadow-primary/10 flex items-center justify-center gap-2 cursor-pointer"
              >
                {loading ? (
                  <>
                    <Loader2 className="w-5 h-5 animate-spin" />
                    <span>Kontrol Ediliyor...</span>
                  </>
                ) : (
                  <span>Giriş Yap</span>
                )}
              </button>

            </form>

            {/* Social Logins */}
            <div className="space-y-3">
              <div className="relative flex py-1 items-center">
                <div className="flex-grow border-t border-surface-container-low"></div>
                <span className="flex-shrink mx-4 text-xs font-sans text-on-surface-variant/60 font-semibold uppercase tracking-wider">Veya Bunlarla Bağlan</span>
                <div className="flex-grow border-t border-surface-container-low"></div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                {/* Google login */}
                <button 
                  onClick={() => {
                    setErrorMessage("Google ile giriş sonraki fazda aktif edilecek.");
                  }}
                  className="bg-white border border-outline-variant px-4 py-2.5 rounded-2xl flex items-center justify-center gap-2 text-xs md:text-sm font-sans font-bold hover:bg-surface transition-colors cursor-pointer"
                >
                  <img src="https://www.svgrepo.com/show/475656/google-color.svg" alt="Google" className="w-4 h-4" />
                  <span>Google</span>
                </button>
                {/* Apple login */}
                <button 
                  onClick={() => {
                    setErrorMessage("Apple ile giriş sonraki fazda aktif edilecek.");
                  }}
                  className="bg-white border border-outline-variant px-4 py-2.5 rounded-2xl flex items-center justify-center gap-2 text-xs md:text-sm font-sans font-bold hover:bg-surface transition-colors cursor-pointer"
                >
                  <img src="https://www.svgrepo.com/show/511330/apple-os.svg" alt="Apple" className="w-4 h-4" />
                  <span>Apple</span>
                </button>
              </div>
            </div>

            {/* Redirect register */}
            <div className="pt-4 border-t border-surface-container-low text-center font-sans text-xs md:text-sm text-on-surface-variant">
              <span>Hesabınız yok mu? </span>
              <button 
                onClick={() => navigateTo("register")}
                className="text-primary font-bold hover:underline cursor-pointer"
              >
                Ücretsiz Kayıt Olun
              </button>
            </div>

          </div>
        </div>

      </div>
    </div>
  );
}

function getAuthErrorMessage(error) {
  if (error?.code === "auth/invalid-credential") return "E-posta veya şifre hatalı.";
  if (error?.code === "auth/user-not-found") return "Bu e-posta ile kayıtlı kullanıcı bulunamadı.";
  if (error?.code === "auth/wrong-password") return "Şifre hatalı.";
  return "Giriş yapılamadı. Lütfen bilgilerinizi kontrol edin.";
}

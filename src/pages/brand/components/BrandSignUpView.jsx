/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */
import { useState } from "react";
import { ArrowRight, ShieldCheck, Lock } from "lucide-react";
function BrandSignUpView({ onSignUpComplete }) {
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [termsAccepted, setTermsAccepted] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");
  const handleSignUp = (e) => {
    e.preventDefault();
    setErrorMsg("");
    if (!fullName || !email || !password || !confirmPassword) {
      setErrorMsg("L\xFCtfen t\xFCm alanlar\u0131 doldurun.");
      return;
    }
    if (password !== confirmPassword) {
      setErrorMsg("\u015Eifreler uyu\u015Fmuyor.");
      return;
    }
    if (!termsAccepted) {
      setErrorMsg("Kullan\u0131m ko\u015Fullar\u0131n\u0131 kabul etmelisiniz.");
      return;
    }
    onSignUpComplete(fullName, email);
  };
  return <div className="w-full max-w-[500px] z-10 animate-in fade-in duration-500">
      
      {
    /* Registration Card */
  }
      <div className="glass-card shadow-[0px_10px_30px_rgba(176,38,255,0.06)] rounded-xl p-8 md:p-12">
        
        {
    /* Header Section */
  }
        <div className="text-center mb-10">
          <div className="flex justify-center mb-4">
            <span className="font-sans font-extrabold text-3xl text-primary tracking-tighter">
              Go Influence
            </span>
          </div>
          <h1 className="font-sans font-extrabold text-2xl md:text-3xl text-on-surface mb-2">
            Marka olarak katıl
          </h1>
          <p className="text-on-surface-variant font-semibold text-sm">
            Kampanyalarını yönetmeye hemen başla.
          </p>
        </div>

        {
    /* Social Sign Up Button */
  }
        <button
    type="button"
    onClick={() => onSignUpComplete("Selin Y\u0131lmaz", "selin@brand.com")}
    className="w-full h-14 flex items-center justify-center gap-3 bg-surface-container-lowest border border-outline-variant rounded-2xl hover:bg-surface-container-low transition-all active:scale-95 mb-8 cursor-pointer shadow-sm"
  >
          <img
    alt="Google"
    className="w-5 h-5 shrink-0"
    src="https://lh3.googleusercontent.com/aida-public/AB6AXuDfz0w7Xe69giMehC13WhzAdwd8Ib9ckwelo-uOtWxgrq9_jiTavtIVUU0ScPkDtWLmFcNXO-ql7qXf8Y9vFqwCfFS5PmSntI43O3ZYcb1L9lj8XvioApIkqVqv4n9UxBEtc8iEYKPRbnwF72tfNSRI_y_c_Na35WUlhWEqpbMCyuxT8Htak-WUx9p-Hx_RdCYMn45A3jqx4ASnz0Z4TkVGOnrJLqEI43VCLGe3MHzfHz-vrf85EOh1"
    referrerPolicy="no-referrer"
  />
          <span className="font-bold text-xs text-on-surface">Google ile kayıt ol</span>
        </button>

        {
    /* Separator line */
  }
        <div className="relative flex items-center mb-8">
          <div className="flex-grow border-t border-outline-variant" />
          <span className="flex-shrink mx-4 text-outline font-bold text-[10px] uppercase tracking-widest">
            veya
          </span>
          <div className="flex-grow border-t border-outline-variant" />
        </div>

        {
    /* Signup input fields form */
  }
        <form onSubmit={handleSignUp} className="space-y-5">
          {errorMsg && <div className="p-3 bg-red-50 border border-red-200 text-red-700 text-xs font-bold rounded-xl text-center">
              {errorMsg}
            </div>}

          <div className="grid grid-cols-1 gap-5">
            {
    /* Full name input */
  }
            <div className="space-y-1.5">
              <label className="font-bold text-xs text-on-surface-variant ml-1 uppercase tracking-wider block">
                Ad Soyad
              </label>
              <input
    required
    type="text"
    value={fullName}
    onChange={(e) => setFullName(e.target.value)}
    placeholder="Örn. Selin Yılmaz"
    className="w-full h-14 px-5 bg-surface-container-low border border-transparent rounded-2xl focus:border-primary focus:ring-1 focus:ring-primary focus:bg-surface-container-lowest transition-all placeholder:text-outline/50 outline-none text-sm font-semibold"
  />
            </div>

            {
    /* Email input */
  }
            <div className="space-y-1.5">
              <label className="font-bold text-xs text-on-surface-variant ml-1 uppercase tracking-wider block">
                E-posta Adresi
              </label>
              <input
    required
    type="email"
    value={email}
    onChange={(e) => setEmail(e.target.value)}
    placeholder="marka@domain.com"
    className="w-full h-14 px-5 bg-surface-container-low border border-transparent rounded-2xl focus:border-primary focus:ring-1 focus:ring-primary focus:bg-surface-container-lowest transition-all placeholder:text-outline/50 outline-none text-sm font-semibold"
  />
            </div>

            {
    /* Passwords side by side */
  }
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <label className="font-bold text-xs text-on-surface-variant ml-1 uppercase tracking-wider block">
                  Şifre
                </label>
                <input
    required
    type="password"
    value={password}
    onChange={(e) => setPassword(e.target.value)}
    placeholder="••••••••"
    className="w-full h-14 px-5 bg-surface-container-low border border-transparent rounded-2xl focus:border-primary focus:ring-1 focus:ring-primary focus:bg-surface-container-lowest transition-all placeholder:text-outline/50 outline-none text-sm font-semibold"
  />
              </div>

              <div className="space-y-1.5">
                <label className="font-bold text-xs text-on-surface-variant ml-1 uppercase tracking-wider block">
                  Şifre Tekrar
                </label>
                <input
    required
    type="password"
    value={confirmPassword}
    onChange={(e) => setConfirmPassword(e.target.value)}
    placeholder="••••••••"
    className="w-full h-14 px-5 bg-surface-container-low border border-transparent rounded-2xl focus:border-primary focus:ring-1 focus:ring-primary focus:bg-surface-container-lowest transition-all placeholder:text-outline/50 outline-none text-sm font-semibold"
  />
              </div>
            </div>
          </div>

          {
    /* Terms checkbox */
  }
          <div className="flex items-start gap-3 pt-2">
            <input
    id="terms"
    type="checkbox"
    checked={termsAccepted}
    onChange={(e) => setTermsAccepted(e.target.checked)}
    className="mt-1 w-5 h-5 rounded border-outline-variant text-primary focus:ring-primary cursor-pointer shrink-0"
  />
            <label className="font-bold text-[12px] text-on-surface-variant leading-tight cursor-pointer" htmlFor="terms">
              <a href="#" className="text-primary hover:underline">Kullanım Koşulları</a> ve <a href="#" className="text-primary hover:underline">Gizlilik Politikası</a>'nı okudum, onaylıyorum.
            </label>
          </div>

          {
    /* Submit Button */
  }
          <button
    type="submit"
    className="w-full h-14 bg-primary text-white font-extrabold rounded-xl shadow-[0px_8px_24px_rgba(176,38,255,0.25)] hover:scale-[1.01] hover:bg-primary/95 transition-all active:scale-95 flex items-center justify-center gap-2 mt-4 cursor-pointer"
  >
            <span>Kayıt Ol</span>
            <ArrowRight size={18} />
          </button>
        </form>

        {
    /* Footer Link */
  }
        <div className="mt-10 text-center">
          <p className="font-semibold text-xs text-on-surface-variant">
            Zaten hesabın var mı? 
            <a href="#" onClick={() => onSignUpComplete("Demo User", "demo@user.com")} className="text-primary font-bold hover:underline ml-1">
              Giriş yap
            </a>
          </p>
        </div>

      </div>

      {
    /* Trust Badges */
  }
      <div className="mt-8 flex justify-center items-center gap-8 opacity-60 grayscale hover:grayscale-0 transition-all duration-500">
        <div className="flex items-center gap-2">
          <ShieldCheck size={18} className="text-on-surface" />
          <span className="font-bold text-[10px] uppercase tracking-wider text-on-surface">Güvenli Kayıt</span>
        </div>
        
        <div className="flex items-center gap-2">
          <Lock size={18} className="text-on-surface" />
          <span className="font-bold text-[10px] uppercase tracking-wider text-on-surface">256-bit SSL</span>
        </div>
      </div>

    </div>;
}
export {
  BrandSignUpView as default
};

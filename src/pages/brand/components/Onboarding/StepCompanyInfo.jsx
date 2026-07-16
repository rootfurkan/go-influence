/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */
import { useState } from "react";
import { motion } from "motion/react";
import { User, Users, Building, MapPin, ArrowRight, UserCheck } from "lucide-react";
function StepCompanyInfo({ profile, onChange, onNext }) {
  const [descLength, setDescLength] = useState(profile.description.length);
  const handleDescChange = (e) => {
    const text = e.target.value.slice(0, 250);
    onChange({ description: text });
    setDescLength(text.length);
  };
  const sizes = [
    { value: "1-10", label: "Small", icon: User, details: "1-10 \xE7al\u0131\u015Fan" },
    { value: "11-50", label: "Medium", icon: Users, details: "11-50 \xE7al\u0131\u015Fan" },
    { value: "50+", label: "Large", icon: Building, details: "50+ \xE7al\u0131\u015Fan" }
  ];
  return <motion.div
    initial={{ opacity: 0, y: 15 }}
    animate={{ opacity: 1, y: 0 }}
    exit={{ opacity: 0, y: -15 }}
    className="w-full max-w-[720px] space-y-8"
  >
      {
    /* Onboarding Header */
  }
      <div className="text-center">
        <h1 className="font-sans font-extrabold text-3xl md:text-5xl text-primary tracking-tight mb-3">
          Zorunlu Şirket Profili
        </h1>
        <p className="font-medium text-on-surface-variant text-base md:text-lg">
          Harika işbirlikleri için şirketinizi tanıtmaya başlayalım.
        </p>
      </div>

      {
    /* Form Card */
  }
      <div className="bg-surface-container-lowest border border-[#F1F1F1] rounded-xl p-6 md:p-12 shadow-[0px_10px_30px_rgba(176,38,255,0.06)] hover:shadow-[0px_15px_40px_rgba(176,38,255,0.1)] transition-all">
        <form onSubmit={(e) => {
    e.preventDefault();
    onNext();
  }} className="space-y-6">
          
          {
    /* Row 1: Name & Website */
  }
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <label className="font-semibold text-xs text-on-surface-variant ml-1 uppercase tracking-wider block">
                Şirket Adı
              </label>
              <input
    required
    type="text"
    value={profile.name}
    onChange={(e) => onChange({ name: e.target.value })}
    placeholder="Örn: Digital Reach Co."
    className="w-full bg-[#F8F9FA] border border-[#d2c1d7] focus:border-primary focus:ring-1 focus:ring-primary rounded-2xl p-4 transition-all outline-none"
  />
            </div>
            <div className="space-y-2">
              <label className="font-semibold text-xs text-on-surface-variant ml-1 uppercase tracking-wider block">
                Web Sitesi
              </label>
              <input
    required
    type="url"
    value={profile.website}
    onChange={(e) => onChange({ website: e.target.value })}
    placeholder="https://www.company.com"
    className="w-full bg-[#F8F9FA] border border-[#d2c1d7] focus:border-primary focus:ring-1 focus:ring-primary rounded-2xl p-4 transition-all outline-none"
  />
            </div>
          </div>

          {
    /* Row 2: Short Description */
  }
          <div className="space-y-2">
            <label className="font-semibold text-xs text-on-surface-variant ml-1 uppercase tracking-wider block">
              Kısa Açıklama
            </label>
            <textarea
    required
    rows={4}
    maxLength={250}
    value={profile.description}
    onChange={handleDescChange}
    placeholder="Şirketinizin vizyonundan ve hedeflerinden kısaca bahsedin..."
    className="w-full bg-[#F8F9FA] border border-[#d2c1d7] focus:border-primary focus:ring-1 focus:ring-primary rounded-2xl p-4 transition-all outline-none resize-none"
  />
            <p className="text-[12px] text-right text-outline font-semibold">
              {descLength}/250 karakter
            </p>
          </div>

          {
    /* Row 3: Company Size Selection */
  }
          <div className="space-y-3">
            <label className="font-semibold text-xs text-on-surface-variant ml-1 uppercase tracking-wider block">
              Şirket Büyüklüğü
            </label>
            <div className="grid grid-cols-3 gap-4">
              {sizes.map((s) => {
    const IconComp = s.icon;
    const isChecked = profile.size === s.value;
    return <button
      type="button"
      key={s.value}
      onClick={() => onChange({ size: s.value })}
      className={`flex flex-col items-center justify-center p-4 border rounded-2xl cursor-pointer transition-all hover:scale-[1.02] active:scale-95 ${isChecked ? "bg-secondary-container border-secondary text-secondary" : "bg-surface-container-low border-[#F1F1F1] text-on-surface-variant"}`}
    >
                    <IconComp size={24} className="mb-1" />
                    <span className="font-bold text-sm">{s.label}</span>
                    <span className="text-[10px] text-outline mt-0.5">{s.details}</span>
                  </button>;
  })}
            </div>
          </div>

          {
    /* Row 4: Location */
  }
          <div className="space-y-2">
            <label className="font-semibold text-xs text-on-surface-variant ml-1 uppercase tracking-wider block">
              Konum
            </label>
            <div className="relative">
              <MapPin className="absolute left-4 top-1/2 -translate-y-1/2 text-outline" size={20} />
              <input
    required
    type="text"
    value={profile.location}
    onChange={(e) => onChange({ location: e.target.value })}
    placeholder="Şehir, Ülke"
    className="w-full bg-[#F8F9FA] border border-[#d2c1d7] focus:border-primary focus:ring-1 focus:ring-primary rounded-2xl p-4 pl-12 transition-all outline-none"
  />
            </div>
          </div>

          {
    /* CTAs */
  }
          <div className="pt-6 flex flex-col md:flex-row items-center gap-4">
            <button
    type="submit"
    className="w-full md:w-auto px-10 py-4 bg-primary text-white font-bold rounded-3xl neon-shadow hover:scale-105 active:scale-95 transition-all cursor-pointer flex items-center justify-center gap-2"
  >
              <span>Devam Et</span>
              <ArrowRight size={18} />
            </button>
            <button
    type="button"
    onClick={() => alert("Taslak ba\u015Far\u0131yla kaydedildi!")}
    className="w-full md:w-auto px-10 py-4 bg-transparent text-on-surface-variant font-bold rounded-3xl hover:bg-surface-container-low transition-all cursor-pointer"
  >
              Taslağı Kaydet
            </button>
          </div>
        </form>
      </div>

      {
    /* Decorative Illustration Segment (Bento teaser) */
  }
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="md:col-span-2 bg-secondary-container/30 rounded-xl p-6 md:p-8 flex items-center justify-between border border-secondary-container overflow-hidden relative">
          <div className="relative z-10 max-w-sm">
            <div className="bg-[#F9F871] text-black px-3 py-1 rounded-full text-[10px] font-extrabold inline-block mb-3 uppercase tracking-wider">
              YÜKSELEN TREND
            </div>
            <h3 className="font-extrabold text-lg text-secondary mb-1">
              Marka Kimliğiniz Önemli
            </h3>
            <p className="text-sm text-on-secondary-container/80 font-medium leading-relaxed">
              Doğru bilgilerle markanızın influencer'lar tarafından daha kolay keşfedilmesini sağlayın.
            </p>
          </div>
          <div className="hidden lg:block w-36 h-36 bg-white rounded-3xl shadow-xl rotate-12 relative overflow-hidden shrink-0">
            <img
    className="w-full h-full object-cover"
    src="https://lh3.googleusercontent.com/aida-public/AB6AXuCY2CGuXhZ-AIk-T_br5wvTYF0EfEwV1lmBNtonxxTdLoIq8RRA7OTZ4SbRzyYPIn5udaMMhTicLOMeevqOTDpUBxJx9vAjqJ7TXOwWOjjJOZY1-geoocUa5g8eOh1iMQGA3T-Nbhv5-zU0vWPlUhjSERtYarkDiOs_Tw-vQneymFAleVpkMdXowKBofIdNMmgr8Pv1Q9qQzBh_JWSAtnrGfKUtMx1uVMacoTkbOn0YvISotwbS4Nie"
    alt="Brand Identity illustration"
    referrerPolicy="no-referrer"
  />
          </div>
        </div>

        <div className="bg-surface-container-high rounded-xl p-6 flex flex-col justify-center items-center text-center">
          <UserCheck size={36} className="text-primary mb-3" />
          <h4 className="font-bold text-sm text-on-surface">Hızlı Onay</h4>
          <p className="text-[11px] text-outline mt-1 font-medium leading-normal">
            Profiliniz tamamlandığında 24 saat içinde uzman ekibimizce onaylanır.
          </p>
        </div>
      </div>
    </motion.div>;
}
export {
  StepCompanyInfo as default
};

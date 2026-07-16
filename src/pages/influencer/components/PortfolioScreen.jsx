import { useEffect, useState } from "react";
import { updateInfluencerProfile } from "../../../features/auth/authService";
import { getCurrencyCode, getCurrencySymbol } from "../../../utils/currency";

function PortfolioScreen({ profile, user, onShowToast }) {
  const [activeFilter, setActiveFilter] = useState("all");
  const [pricingPost, setPricingPost] = useState(450);
  const [pricingReels, setPricingReels] = useState(850);
  const [pricingTiktok, setPricingTiktok] = useState(1200);
  const [saving, setSaving] = useState(false);
  const currency = getCurrencyCode(profile);
  const currencySymbol = getCurrencySymbol(currency);

  useEffect(() => {
    setPricingPost(Number(profile?.pricing?.post?.min || profile?.pricing?.post?.base || 450));
    setPricingReels(Number(profile?.pricing?.reels?.min || profile?.pricing?.reels?.base || 850));
    setPricingTiktok(Number(profile?.pricing?.tiktok?.min || profile?.pricing?.tiktok?.base || 1200));
  }, [profile]);

  const handleSavePricing = async () => {
    if (!user?.uid) {
      onShowToast?.("Oturum bilgisi bulunamadı.", "error");
      return;
    }

    setSaving(true);
    try {
      await updateInfluencerProfile(user.uid, {
        ...profile,
        pricing: {
          ...(profile?.pricing || {}),
          post: { min: pricingPost, max: pricingPost, base: pricingPost, currency },
          reels: { min: pricingReels, max: pricingReels, base: pricingReels, currency },
          tiktok: { min: pricingTiktok, max: pricingTiktok, base: pricingTiktok, currency },
        },
      });
      onShowToast?.("Fiyatlandırma kaydedildi.", "success");
    } catch (error) {
      console.error("Pricing could not be saved.", error);
      onShowToast?.("Fiyatlandırma kaydedilemedi.", "error");
    } finally {
      setSaving(false);
    }
  };
  return <div className="relative min-h-screen pb-16 flex flex-col lg:flex-row gap-6">
      {
    /* Portfolio Left / Main Area */
  }
      <div className="flex-1 min-w-0">
        {
    /* Top Header inside Area */
  }
        <header className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
          <div>
            <h1 className="text-3xl font-extrabold tracking-tight text-on-surface">İçerik Portfolyosu</h1>
            <p className="text-sm text-on-surface-variant mt-1">Markalar için sergilenen en güncel ve en popüler içerikleriniz.</p>
          </div>
          <div className="flex bg-surface-container-high rounded-full p-1 self-start sm:self-auto border border-[#E1E3E4]">
            <button
    onClick={() => setActiveFilter("all")}
    className={`px-4 py-1.5 rounded-full text-xs font-bold transition-all ${activeFilter === "all" ? "bg-white text-primary shadow-sm" : "text-on-surface-variant hover:text-primary"}`}
  >
              Hepsi
            </button>
            <button
    onClick={() => setActiveFilter("instagram")}
    className={`px-4 py-1.5 rounded-full text-xs font-bold transition-all ${activeFilter === "instagram" ? "bg-white text-primary shadow-sm" : "text-on-surface-variant hover:text-primary"}`}
  >
              Instagram
            </button>
            <button
    onClick={() => setActiveFilter("tiktok")}
    className={`px-4 py-1.5 rounded-full text-xs font-bold transition-all ${activeFilter === "tiktok" ? "bg-white text-primary shadow-sm" : "text-on-surface-variant hover:text-primary"}`}
  >
              TikTok
            </button>
            <button
    onClick={() => setActiveFilter("youtube")}
    className={`px-4 py-1.5 rounded-full text-xs font-bold transition-all ${activeFilter === "youtube" ? "bg-white text-primary shadow-sm" : "text-on-surface-variant hover:text-primary"}`}
  >
              Youtube
            </button>
          </div>
        </header>

        {
    /* Portfolio Grid */
  }
        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6" id="portfolio-bento-grid">
          {
    /* Content Card 1 (Large / Featured) */
  }
          <div className="group relative bg-white rounded-3xl overflow-hidden shadow-[0px_10px_30px_rgba(176,38,255,0.06)] border border-[#F1F1F1] hover:shadow-xl hover:-translate-y-1 transition-all duration-300 sm:col-span-2 sm:row-span-2">
            <div className="aspect-[4/3] sm:aspect-[16/10] relative">
              <img
    className="w-full h-full object-cover group-hover:scale-102 transition-transform duration-500"
    alt="Şehir Turu Vlog Serisi"
    src="https://lh3.googleusercontent.com/aida-public/AB6AXuBDW9dRHmq83ESbwvVydsdANTuGdRazbjDSHjce9Z6RENlOc-uZxQewAo-UhehoffMYYEr15tdMO6kuC0UMUcDeufGZZGCcPFz5JYuXa9R032ug7RJpMjRlAxZTkcuxygCE7kIza9NAbxugEiD-z-499luPStcazb4_v-mMvE5VCKJZR1abxPBa3qK-SIDO0s4LTf5M_ID5kTcPh63Q43Bd445CKAXhFXwTrivbqjUtjOIlvlO2dlQo"
  />
              <div className="absolute top-4 left-4">
                <span className="bg-secondary-container text-on-secondary-container px-3 py-1 rounded-full text-xs font-bold flex items-center gap-1 shadow-sm">
                  <span className="material-symbols-outlined text-[14px]">trending_up</span> Popüler
                </span>
              </div>
              <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent p-6 text-white">
                <span className="text-[10px] font-bold uppercase tracking-wider text-secondary-container bg-primary/20 px-2 py-0.5 rounded-full mb-2 inline-block">VLOG</span>
                <h3 className="font-bold text-xl mb-1">Şehir Turu Vlog Serisi</h3>
                <div className="flex items-center gap-4 text-white/90 text-sm">
                  <span className="flex items-center gap-1"><span className="material-symbols-outlined text-base">favorite</span> 24.5K</span>
                  <span className="flex items-center gap-1"><span className="material-symbols-outlined text-base">comment</span> 1.2K</span>
                </div>
              </div>
            </div>
          </div>

          {
    /* Content Card 2 */
  }
          <div className="group relative bg-white rounded-3xl overflow-hidden shadow-[0px_10px_30px_rgba(176,38,255,0.06)] border border-[#F1F1F1] hover:shadow-xl hover:-translate-y-1 transition-all duration-300">
            <div className="aspect-square relative overflow-hidden">
              <img
    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
    alt="Güzellik Rutinim"
    src="https://lh3.googleusercontent.com/aida-public/AB6AXuCKxLbYpP-OZf_8ajhXPBWxQUERbIhl70gxC7LysLfMe56V9MQjabSxPVLYj2Dk0z7vs7LP1If5yBwWpm2Dxvw66pV4RFVjN_L7Eqeg5VcuaIcocbzeLJekHZQ3U3gWbaAdU9hNfCZlcco7G-NlLZ9RcELvBqLG9Z2LHH3fhE3S9L5wdBSEOvSao-kKs3pZ-bX63OeMRHSShwEkKcUgieVyOxGPtgl3dkBIxhc3d_37-UKHhpmk4tz8"
  />
              <div className="absolute inset-0 bg-primary/20 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                <button className="bg-white text-primary p-3 rounded-full shadow-lg hover:scale-110 transition-transform">
                  <span className="material-symbols-outlined text-[20px]">visibility</span>
                </button>
              </div>
            </div>
            <div className="p-5">
              <div className="flex items-center justify-between mb-2">
                <span className="text-[10px] font-extrabold text-on-primary-fixed-variant uppercase tracking-wider bg-primary/10 px-2 py-0.5 rounded-md">Cilt Bakımı</span>
                <span className="material-symbols-outlined text-pink-500 text-[18px]">photo_camera</span>
              </div>
              <h4 className="font-bold text-on-surface truncate text-sm">Güzellik Rutinim #Reels</h4>
            </div>
          </div>

          {
    /* Content Card 3 */
  }
          <div className="group relative bg-white rounded-3xl overflow-hidden shadow-[0px_10px_30px_rgba(176,38,255,0.06)] border border-[#F1F1F1] hover:shadow-xl hover:-translate-y-1 transition-all duration-300">
            <div className="aspect-square relative overflow-hidden">
              <img
    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
    alt="Moda Kombinleri"
    src="https://lh3.googleusercontent.com/aida-public/AB6AXuD66EzLWNVkHvMaBKWQO9fI_z3nx1Cmq6YeAilxQHYU81rVSgHAm0vRvgP-mi0YlehDFX1jyGWWrgS8yiqpy1SSAqRLnRnSHAwH2aJxMEUhMiwREzI4tNkX3dU4XSSvaBaXbJ2pxVP11wUpv-H7174ALUfnTXp2htcfoSQPIPPkM9YfWW_zt3PGMfd5a6ltF-HGCeJVnh_sdenbbEWTfhfUGU_1MreBi97vYuoNWAMQtuwXabSOPmcx"
  />
              <div className="absolute inset-0 bg-primary/20 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                <button className="bg-white text-primary p-3 rounded-full shadow-lg hover:scale-110 transition-transform">
                  <span className="material-symbols-outlined text-[20px]">visibility</span>
                </button>
              </div>
            </div>
            <div className="p-5">
              <div className="flex items-center justify-between mb-2">
                <span className="text-[10px] font-extrabold text-on-primary-fixed-variant uppercase tracking-wider bg-primary/10 px-2 py-0.5 rounded-md">Moda</span>
                <span className="material-symbols-outlined text-blue-500 text-[18px]">videocam</span>
              </div>
              <h4 className="font-bold text-on-surface truncate text-sm">Streetwear Kombinleri</h4>
            </div>
          </div>

          {
    /* Content Card 4 */
  }
          <div className="group relative bg-white rounded-3xl overflow-hidden shadow-[0px_10px_30px_rgba(176,38,255,0.06)] border border-[#F1F1F1] hover:shadow-xl hover:-translate-y-1 transition-all duration-300">
            <div className="aspect-square relative overflow-hidden">
              <img
    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
    alt="Gourmet Dish"
    src="https://lh3.googleusercontent.com/aida-public/AB6AXuATrl3NOus4LMG1IhPzGUk926XudV5LeUfMMxFvJc4281OLeYhOpDwC2z02qGxZBxKJHVCghLwPMAIaa8ttUWjcnax-1QZZB0i5sWa_guzpDj0AJ2CEdLLW39so4LzsepUWcxhFfcXPQf6G98wiWmN_M7uHSbk2r5DDITij0kJ0HclHR5vFJ1DrzItiUUmnfCGIZBu4oKG9IEDqjkQc1nOir4a4DGcSkc_oar9jr0rLa39QJBTjFlRZ"
  />
              <div className="absolute inset-0 bg-primary/20 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                <button className="bg-white text-primary p-3 rounded-full shadow-lg hover:scale-110 transition-transform">
                  <span className="material-symbols-outlined text-[20px]">visibility</span>
                </button>
              </div>
            </div>
            <div className="p-5">
              <div className="flex items-center justify-between mb-2">
                <span className="text-[10px] font-extrabold text-on-primary-fixed-variant uppercase tracking-wider bg-primary/10 px-2 py-0.5 rounded-md">Gurme</span>
                <span className="material-symbols-outlined text-orange-500 text-[18px]">restaurant</span>
              </div>
              <h4 className="font-bold text-on-surface truncate text-sm">Hafta Sonu Lezzet Keşfi</h4>
            </div>
          </div>

          {
    /* Content Card 5 */
  }
          <div className="group relative bg-white rounded-3xl overflow-hidden shadow-[0px_10px_30px_rgba(176,38,255,0.06)] border border-[#F1F1F1] hover:shadow-xl hover:-translate-y-1 transition-all duration-300">
            <div className="aspect-square relative overflow-hidden">
              <img
    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
    alt="Travel View"
    src="https://lh3.googleusercontent.com/aida-public/AB6AXuDoWwuqBzNZl5gJsKBG4z-vIjbCPC4c2a1Jkup1lEdm0U0qL92k-q_UshA9rCckoK_GjMca6d1PeYHWacqiSnCVOHBVUfjvPeVx6JUg9JXmfn9MM3TbfSeFKbmb7HlGvEoYG-OlYSZ-z3w4fzmjTXncdMTrLOgNHX4rviqralMfvrEQC6QvjPRDSqWxbX7fNj14n2AG_niZMD0giMRuIWfbypqg5tqRcPNT3ZsGJhcukONtDsNMbUOS"
  />
              <div className="absolute inset-0 bg-primary/20 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                <button className="bg-white text-primary p-3 rounded-full shadow-lg hover:scale-110 transition-transform">
                  <span className="material-symbols-outlined text-[20px]">visibility</span>
                </button>
              </div>
            </div>
            <div className="p-5">
              <div className="flex items-center justify-between mb-2">
                <span className="text-[10px] font-extrabold text-on-primary-fixed-variant uppercase tracking-wider bg-primary/10 px-2 py-0.5 rounded-md">Seyahat</span>
                <span className="material-symbols-outlined text-green-500 text-[18px]">travel_explore</span>
              </div>
              <h4 className="font-bold text-on-surface truncate text-sm">Doğa ile Baş Başa</h4>
            </div>
          </div>
        </div>
      </div>

      {
    /* Portfolio Right Sidebar / Pricing Settings */
  }
      <aside className="w-full lg:w-80 bg-white border border-outline-variant/30 rounded-3xl flex flex-col p-6 shadow-sm self-start" id="portfolio-pricing-sidebar">
        <div className="pb-6 border-b border-outline-variant/20 mb-6">
          <h2 className="font-bold text-lg text-on-surface flex items-center gap-2">
            <span className="material-symbols-outlined text-primary text-xl">payments</span>
            Fiyatlandırma
          </h2>
          <p className="text-on-surface-variant text-xs mt-1">Markalar için görünür olacak baz fiyatlarınız.</p>
        </div>

        <div className="space-y-6 flex-1 mb-6">
          {
    /* Pricing Item: Instagram Post */
  }
          <div className="space-y-2">
            <div className="flex justify-between items-center">
              <label className="text-xs font-bold text-on-surface">Instagram Post</label>
              <span className="text-[10px] text-primary bg-primary/5 px-2.5 py-0.5 rounded-full font-bold uppercase tracking-wider">Standart</span>
            </div>
            <div className="relative">
              <span className="absolute left-4 top-1/2 -translate-y-1/2 text-on-surface-variant font-extrabold text-sm">{currencySymbol}</span>
              <input
    type="number"
    value={pricingPost}
    onChange={(e) => setPricingPost(Number(e.target.value))}
    className="w-full pl-8 pr-4 py-3 bg-surface-container-low border-none rounded-2xl focus:ring-2 focus:ring-primary font-bold text-on-surface text-sm"
  />
            </div>
          </div>

          {
    /* Pricing Item: Instagram Reel */
  }
          <div className="space-y-2">
            <div className="flex justify-between items-center">
              <label className="text-xs font-bold text-on-surface">Instagram Reels</label>
              <span className="text-[10px] text-primary bg-primary/5 px-2.5 py-0.5 rounded-full font-bold uppercase tracking-wider">Popüler</span>
            </div>
            <div className="relative">
              <span className="absolute left-4 top-1/2 -translate-y-1/2 text-on-surface-variant font-extrabold text-sm">{currencySymbol}</span>
              <input
    type="number"
    value={pricingReels}
    onChange={(e) => setPricingReels(Number(e.target.value))}
    className="w-full pl-8 pr-4 py-3 bg-surface-container-low border-none rounded-2xl focus:ring-2 focus:ring-primary font-bold text-on-surface text-sm"
  />
            </div>
          </div>

          {
    /* Pricing Item: TikTok Video */
  }
          <div className="space-y-2">
            <div className="flex justify-between items-center">
              <label className="text-xs font-bold text-on-surface">TikTok Video</label>
              <span className="text-[10px] text-secondary bg-secondary/10 px-2.5 py-0.5 rounded-full font-bold uppercase tracking-wider">Viral</span>
            </div>
            <div className="relative">
              <span className="absolute left-4 top-1/2 -translate-y-1/2 text-on-surface-variant font-extrabold text-sm">{currencySymbol}</span>
              <input
    type="number"
    value={pricingTiktok}
    onChange={(e) => setPricingTiktok(Number(e.target.value))}
    className="w-full pl-8 pr-4 py-3 bg-surface-container-low border-none rounded-2xl focus:ring-2 focus:ring-primary font-bold text-on-surface text-sm"
  />
            </div>
          </div>

          {
    /* Bundle Packages Recommendation */
  }
          <div className="pt-2">
            <div className="bg-secondary-container/30 p-4 rounded-2xl border border-secondary-container">
              <h5 className="text-xs font-bold text-on-secondary-container mb-1">Paket Önerisi</h5>
              <p className="text-[11px] text-on-secondary-fixed-variant leading-relaxed">
                3 Post + 1 Reels paketi oluşturarak satışlarınızı %25 artırabilirsiniz.
              </p>
              <button className="w-full py-2 bg-secondary text-white rounded-xl text-xs font-bold hover:brightness-90 transition-all mt-3 shadow-sm">
                Paket Oluştur
              </button>
            </div>
          </div>
        </div>

        <button
          onClick={handleSavePricing}
          disabled={saving}
          className="w-full bg-primary text-white py-3.5 rounded-2xl font-bold text-xs neon-glow hover:scale-[1.02] active:scale-95 transition-all disabled:opacity-60"
        >
          Değişiklikleri Kaydet
        </button>
      </aside>
    </div>;
}
export {
  PortfolioScreen as default
};

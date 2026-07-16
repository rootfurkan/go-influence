import React, { useState } from "react";
import { Filter, Calendar, ShieldCheck, BarChart3, Plus, Check, ArrowRight, TrendingUp, Users, RefreshCw } from "lucide-react";

export default function ForBrands({ navigateTo, setPreselectedRole }) {
  const [billingPeriod, setBillingPeriod] = useState("monthly"); // 'monthly' or 'yearly'
  const [hoveredPlan, setHoveredPlan] = useState("growth");

  const features = [
    {
      icon: <Users className="w-5 h-5 text-primary" />,
      title: "Kategori Bazlı Eşleştirme",
      desc: "Ürününüzün veya hizmetinizin ruhunu en iyi yansıtan, kitlesi hedeflerinizle uyuşan doğru kreatifleri kategori ve hizmet uyumuna göre bulun."
    },
    {
      icon: <Filter className="w-5 h-5 text-primary" />,
      title: "Derinlemesine Filtreleme",
      desc: "Kreatifleri yaş, lokasyon, cinsiyet dağılımı, kitle ilgi alanları ve gerçek etkileşim oranlarına göre gelişmiş parametrelerle süzün."
    },
    {
      icon: <Calendar className="w-5 h-5 text-primary" />,
      title: "Kolay Kampanya Yönetimi",
      desc: "Görsel taslaklarını inceleyin, revizyon talep edin ve onay verin. İletişim kalabalığını tek bir şeffaf panelde toplayın."
    },
    {
      icon: <ShieldCheck className="w-5 h-5 text-primary" />,
      title: "Güvenli Havuz (Escrow)",
      desc: "Ücretinizi güvende tutun. Bütçeniz ancak içerik belirlenen brief kurallarına göre yayınlandığında kreatifin cüzdanına aktarılır."
    },
    {
      icon: <BarChart3 className="w-5 h-5 text-primary" />,
      title: "Anlık Performans Analitiği",
      desc: "Yayınlanan içeriklerin erişim, etkileşim, tıklama ve maliyet başı edinme (CPA) metriklerini canlı grafiklerle ölçümleyin."
    },
    {
      icon: <Plus className="w-5 h-5 text-primary" />,
      title: "Daha Fazlası Yakında",
      desc: "Influencer hediyeleşme sistemleri, sözleşme otomasyonu ve detaylı raporlama araçları platformumuza eklenmeye devam ediyor."
    }
  ];

  const pricingPlans = [
    {
      id: "startup",
      name: "Startup",
      desc: "Küçük ölçekli ilk kampanyalarını başlatmak isteyen markalar için.",
      monthlyPrice: 1499,
      yearlyPrice: 1199,
      features: [
        "Aylık 3 aktif kampanya",
        "Temel kategori filtreleme",
        "Temel kitle analiz verileri",
        "E-posta desteği",
        "Standart escrows güvenliği"
      ]
    },
    {
      id: "growth",
      name: "Growth",
      desc: "Büyüme aşamasındaki, profesyonel influencer stratejisi güden işletmeler.",
      monthlyPrice: 3499,
      yearlyPrice: 2799,
      popular: true,
      features: [
        "Sınırsız aktif kampanya",
        "Gelişmiş demografik filtreler",
        "Kategori bazlı eşleştirme asistanı",
        "Öncelikli canlı destek & Danışmanlık",
        "Detaylı kampanya ROI raporlaması",
        "Sözleşme taslakları otomasyonu"
      ]
    },
    {
      id: "enterprise",
      name: "Enterprise",
      desc: "Büyük ölçekli markalar, ajanslar ve özel entegrasyon arayanlar.",
      monthlyPrice: "Özel",
      yearlyPrice: "Özel",
      features: [
        "Çoklu marka ve alt hesap yönetimi",
        "Özel hesap yöneticisi",
        "Platform API erişimi",
        "Özel sözleşme entegrasyonu",
        "Küratörlü influencer listesi",
        "7/24 Telefon ve görüntülü destek"
      ]
    }
  ];

  return (
    <div className="pt-20 bg-surface text-on-surface">
      
      {/* Hero Section */}
      <section className="relative py-16 md:py-24 px-6 md:px-16 max-w-[1280px] mx-auto overflow-hidden">
        <div className="absolute inset-0 ambient-glow-1 -z-10" />

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          
          {/* Left Hero copywriting */}
          <div className="lg:col-span-6 space-y-6 text-left">
            <span className="text-primary font-sans font-bold text-sm tracking-wider uppercase bg-primary/10 px-4 py-2 rounded-full border border-primary/10">Markalar İçin</span>
            <h1 className="font-sans font-extrabold text-4xl md:text-5xl leading-tight text-on-surface">
              Doğru Influencer, <br />
              <span className="text-primary">Gerçek Sonuçlar</span>
            </h1>
            <p className="font-sans text-on-surface-variant text-base md:text-lg leading-relaxed">
              Takipçi sayılarına değil, gerçek etkiye odaklanın. Hedef kitlenizle organik bağ kuracak kreatifleri akıllı eşleştirme gücüyle dakikalar içinde keşfedin.
            </p>
            
            <div className="pt-4 flex flex-wrap gap-4">
              <button 
                onClick={() => {
                  setPreselectedRole("marka");
                  navigateTo("register");
                }}
                className="bg-primary text-white font-sans font-bold px-8 py-4 rounded-full hover:scale-105 active:scale-95 transition-all cursor-pointer shadow-lg shadow-primary/20 flex items-center gap-2"
              >
                Marka Kaydı Oluştur
                <ArrowRight className="w-5 h-5" />
              </button>
              <button 
                onClick={() => {
                  const pricingSection = document.getElementById("pricing-section");
                  if (pricingSection) pricingSection.scrollIntoView({ behavior: "smooth" });
                }}
                className="bg-white border border-outline-variant text-on-surface font-sans font-semibold px-8 py-4 rounded-full hover:bg-surface-container-low transition-colors cursor-pointer"
              >
                Planları İncele
              </button>
            </div>
          </div>

          {/* Right Hero Dashboard Mock representation */}
          <div className="lg:col-span-6 relative flex justify-center items-center">
            {/* Ambient circle backdrops */}
            <div className="absolute inset-0 ambient-glow-2 -z-10" />
            
            <div className="bg-white border border-outline-variant rounded-[32px] p-6 w-full max-w-lg shadow-2xl space-y-6">
              
              {/* Fake dashboard header */}
              <div className="flex justify-between items-center pb-4 border-b border-surface-container-low">
                <div>
                  <h3 className="font-sans font-bold text-base text-on-surface text-left">Kampanya Yönetim Paneli</h3>
                  <p className="font-sans text-xs text-on-surface-variant text-left">Yaz Kampanyası #1</p>
                </div>
                <span className="bg-emerald-100 text-emerald-800 font-sans font-bold text-xs px-3 py-1 rounded-full flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                  Aktif Kampanya
                </span>
              </div>

              {/* Fake analytics dashboard items */}
              <div className="grid grid-cols-2 gap-4">
                <div className="bg-surface p-4 rounded-2xl border border-surface-container-low space-y-1 text-left">
                  <p className="text-[10px] text-on-surface-variant uppercase font-sans tracking-wider">Erişim</p>
                  <p className="font-sans font-extrabold text-lg text-primary">324.5K</p>
                </div>
                <div className="bg-surface p-4 rounded-2xl border border-surface-container-low space-y-1 text-left">
                  <p className="text-[10px] text-on-surface-variant uppercase font-sans tracking-wider">Maliyet / Tıklama (CPC)</p>
                  <p className="font-sans font-extrabold text-lg text-on-surface">1.45 TL</p>
                </div>
              </div>

              {/* Mini ROI card showing interactive animation style */}
              <div className="bg-primary/5 p-4 rounded-2xl border border-primary/10 flex items-center justify-between text-left">
                <div className="flex items-center gap-3">
                  <div className="bg-primary text-white p-2 rounded-xl">
                    <TrendingUp className="w-5 h-5" />
                  </div>
                  <div>
                    <h4 className="font-sans font-bold text-sm text-primary">Kampanya ROI Getirisi</h4>
                    <p className="font-sans text-xs text-on-surface-variant">Sektör ortalamasının %45 üzerinde</p>
                  </div>
                </div>
                <span className="font-sans font-extrabold text-lg text-primary">+245%</span>
              </div>

              {/* Influencer task list overview */}
              <div className="space-y-3">
                <p className="text-xs font-sans font-bold text-on-surface-variant text-left">İçerik İlerleme Durumu</p>
                <div className="space-y-2">
                  <div className="flex items-center justify-between bg-surface p-2.5 rounded-xl border border-surface-container-low text-xs font-sans text-on-surface">
                    <div className="flex items-center gap-2">
                      <img src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=100" alt="Avatar" className="w-6 h-6 rounded-full object-cover" />
                      <span>Selin Aras - Reel Taslağı</span>
                    </div>
                    <span className="bg-emerald-50 text-emerald-700 px-2 py-0.5 rounded-md font-semibold">Onaylandı</span>
                  </div>
                  <div className="flex items-center justify-between bg-surface p-2.5 rounded-xl border border-surface-container-low text-xs font-sans text-on-surface">
                    <div className="flex items-center gap-2">
                      <img src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=100" alt="Avatar" className="w-6 h-6 rounded-full object-cover" />
                      <span>Mert Yılmaz - Hikaye Taslağı</span>
                    </div>
                    <span className="bg-amber-50 text-amber-700 px-2 py-0.5 rounded-md font-semibold">İnceleniyor</span>
                  </div>
                </div>
              </div>

            </div>
          </div>

        </div>
      </section>

      {/* Bento-style / Grid Features Section */}
      <section className="py-20 px-6 md:px-16 bg-white border-y border-surface-container-low">
        <div className="max-w-[1280px] mx-auto space-y-16">
          <div className="text-center space-y-4 max-w-2xl mx-auto">
            <span className="text-primary font-sans font-bold text-sm tracking-widest uppercase">ÖZELLİKLER</span>
            <h2 className="font-sans font-extrabold text-3xl md:text-4xl text-on-surface">Her Şey Kontrolünüz Altında</h2>
            <p className="font-sans text-on-surface-variant text-sm md:text-base">
              Yorucu Excel tablolarına ve kayıp WhatsApp konuşmalarına veda edin. Kampanyanızın tüm aşamalarını tek bir akıllı platformdan koordine edin.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 text-left">
            {features.map((feature, idx) => (
              <div 
                key={idx} 
                className="bg-surface p-8 rounded-3xl border border-outline-variant/50 hover:border-primary/30 transition-colors space-y-4"
              >
                <div className="w-10 h-10 rounded-2xl bg-primary/10 flex items-center justify-center border border-primary/20">
                  {feature.icon}
                </div>
                <h3 className="font-sans font-bold text-lg md:text-xl text-on-surface">{feature.title}</h3>
                <p className="font-sans text-sm text-on-surface-variant leading-relaxed">
                  {feature.desc}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Pricing Tiers Section */}
      <section id="pricing-section" className="py-20 px-6 md:px-16 max-w-[1280px] mx-auto text-center space-y-12">
        <div className="space-y-4 max-w-2xl mx-auto">
          <span className="text-primary font-sans font-bold text-sm tracking-widest uppercase font-mono">FİYATLANDIRMA</span>
          <h2 className="font-sans font-extrabold text-3xl md:text-4xl">Markanıza Uygun Planı Seçin</h2>
          <p className="font-sans text-on-surface-variant text-sm md:text-base">
            Gizli ek ödemeler veya komisyonlar olmadan, şeffaf abonelik modellerimiz ile bütçenizi en baştan netleştirin.
          </p>

          {/* Billing Switcher */}
          <div className="inline-flex items-center gap-2 bg-white border border-outline-variant p-1 rounded-full shadow-sm mt-4">
            <button 
              onClick={() => setBillingPeriod("monthly")}
              className={`px-5 py-2 rounded-full font-sans font-semibold text-xs md:text-sm cursor-pointer transition-all ${
                billingPeriod === "monthly" ? "bg-primary text-white" : "text-on-surface-variant hover:text-on-surface"
              }`}
            >
              Aylık Ödeme
            </button>
            <button 
              onClick={() => setBillingPeriod("yearly")}
              className={`px-5 py-2 rounded-full font-sans font-semibold text-xs md:text-sm cursor-pointer transition-all flex items-center gap-1.5 ${
                billingPeriod === "yearly" ? "bg-primary text-white" : "text-on-surface-variant hover:text-on-surface"
              }`}
            >
              Yıllık Ödeme
              <span className="bg-[#F9F871] text-on-surface text-[10px] font-bold px-2 py-0.5 rounded-full border border-black/5">
                -20%
              </span>
            </button>
          </div>
        </div>

        {/* Pricing Cards Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-stretch pt-6">
          {pricingPlans.map((plan) => {
            const isPopular = plan.popular;
            const price = billingPeriod === "monthly" ? plan.monthlyPrice : plan.yearlyPrice;
            const formattedPrice = typeof price === "number" ? `${price.toLocaleString()} TL` : price;

            return (
              <div 
                key={plan.id}
                onMouseEnter={() => setHoveredPlan(plan.id)}
                className={`bg-white rounded-[32px] border p-8 flex flex-col justify-between text-left transition-all duration-300 relative ${
                  isPopular 
                    ? "border-primary shadow-2xl lg:scale-105 z-10" 
                    : hoveredPlan === plan.id 
                      ? "border-primary/40 shadow-xl" 
                      : "border-outline-variant/60 shadow-sm"
                }`}
              >
                {isPopular && (
                  <span className="absolute -top-4 left-1/2 -translate-x-1/2 bg-primary text-white px-4 py-1.5 rounded-full font-sans font-extrabold text-xs shadow-md tracking-wider uppercase">
                    En Çok Tercih Edilen
                  </span>
                )}

                <div className="space-y-6">
                  {/* Tier Title */}
                  <div className="space-y-2">
                    <h3 className="font-sans font-extrabold text-2xl text-on-surface">{plan.name}</h3>
                    <p className="font-sans text-xs md:text-sm text-on-surface-variant leading-relaxed min-h-[40px]">{plan.desc}</p>
                  </div>

                  {/* Price display */}
                  <div className="py-2 flex items-baseline gap-2">
                    <span className="font-sans font-black text-3xl md:text-4xl text-on-surface">{formattedPrice}</span>
                    {typeof price === "number" && (
                      <span className="font-sans text-xs md:text-sm text-on-surface-variant font-medium">/ ay</span>
                    )}
                  </div>

                  <hr className="border-surface-container-low" />

                  {/* Features Bullet List */}
                  <ul className="space-y-4 font-sans text-sm text-on-surface-variant">
                    {plan.features.map((feat, index) => (
                      <li key={index} className="flex items-start gap-2.5">
                        <div className="bg-emerald-100 text-emerald-700 p-0.5 rounded-full mt-0.5">
                          <Check className="w-3.5 h-3.5 stroke-[3]" />
                        </div>
                        <span>{feat}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Pricing Plan button */}
                <div className="pt-8">
                  <button 
                    onClick={() => {
                      setPreselectedRole("marka");
                      navigateTo("register");
                    }}
                    className={`w-full py-3.5 rounded-full font-sans font-bold text-sm cursor-pointer hover:scale-[1.02] active:scale-[0.98] transition-all text-center ${
                      isPopular 
                        ? "bg-primary text-white shadow-lg shadow-primary/25" 
                        : "bg-surface-container-low text-on-surface hover:bg-primary/10 hover:text-primary"
                    }`}
                  >
                    {plan.id === "enterprise" ? "Satış Ekibiyle Görüş" : "Hemen Başla"}
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* Bottom Banner */}
      <section className="py-20 px-6 md:px-16 max-w-[1280px] mx-auto">
        <div className="bg-primary text-white rounded-[40px] px-8 py-16 md:p-16 text-center space-y-6 relative overflow-hidden shadow-2xl">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_80%,rgba(255,255,255,0.12)_0%,transparent_50%)]" />
          <h2 className="font-sans font-extrabold text-3xl md:text-4xl relative z-10">Markanızı Birlikte Büyütelim</h2>
          <p className="font-sans text-white/80 text-base md:text-lg max-w-xl mx-auto relative z-10">
            Platformumuzun gelişmiş araçlarıyla influencer pazarlama operasyonlarınızda maksimum bütçe verimliliği ve anlık raporlama konforunu yaşayın.
          </p>
          <div className="pt-4 relative z-10 flex flex-wrap justify-center gap-4">
            <button 
              onClick={() => {
                setPreselectedRole("marka");
                navigateTo("register");
              }}
              className="bg-[#F9F871] text-on-surface font-sans font-bold px-8 py-3.5 rounded-full hover:scale-105 active:scale-95 transition-all shadow-lg cursor-pointer"
            >
              Şimdi Üye Ol
            </button>
            <button 
              onClick={() => navigateTo("contact")}
              className="bg-white/10 border border-white/20 text-white font-sans font-semibold px-8 py-3.5 rounded-full hover:bg-white/20 transition-all cursor-pointer"
            >
              Demo Talep Et
            </button>
          </div>
        </div>
      </section>

    </div>
  );
}







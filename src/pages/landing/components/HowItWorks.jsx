import React, { useState } from "react";
import { FileText, Wand2, BarChart3, UserPlus, Mail, UploadCloud, CreditCard, ChevronRight, CheckCircle2 } from "lucide-react";

export default function HowItWorks({ navigateTo, setPreselectedRole }) {
  const [activeTab, setActiveTab] = useState("brand"); // 'brand' or 'influencer' for mobile tab toggle, though desktop will show side-by-side or tabs!

  const handleRoleRegister = (role) => {
    setPreselectedRole(role);
    navigateTo("register");
  };

  const brandSteps = [
    {
      num: "01",
      title: "Kampanya Brief'ini Oluşturun",
      desc: "Hedef kitlenizi, kampanya bütçenizi, platform tercihinizi (Instagram, YouTube, TikTok) ve vizyonunuzu belirten bir ilan açın.",
      icon: <FileText className="w-6 h-6 text-primary" />,
      color: "bg-primary/10 border-primary/20 text-primary"
    },
    {
      num: "02",
      title: "Eşleşen Kreatifleri İnceleyin",
      desc: "Kategori eşleşme sistemi, lokasyon, ilgi alanları ve içerik hizmetlerine göre en uyumlu kreatifleri listeler.",
      icon: <UserPlus className="w-6 h-6 text-primary" />,
      color: "bg-primary/10 border-primary/20 text-primary"
    },
    {
      num: "03",
      title: "İçerik Taslaklarını Onaylayın",
      desc: "Kreatiflerin hazırladığı taslak görselleri veya videoları yayınlanmadan önce panelinizde görün, revizyon isteyin veya onaylayın.",
      icon: <Wand2 className="w-6 h-6 text-primary" />,
      color: "bg-primary/10 border-primary/20 text-primary"
    },
    {
      num: "04",
      title: "Güvenli Ödeme & Canlı Rapor",
      desc: "Ödemeniz içerik onaylanana kadar güvende kalır. Yayınlandığı andan itibaren erişim, tıklama ve ROI istatistiklerini takip edin.",
      icon: <BarChart3 className="w-6 h-6 text-primary" />,
      color: "bg-primary/10 border-primary/20 text-primary"
    }
  ];

  const influencerSteps = [
    {
      num: "01",
      title: "Sosyal Medyanı Bağla & Profilini Süsle",
      desc: "Sosyal medya hesaplarını güvenle entegre et. Otomatik güncellenen akıllı medya kitin ve istatistiklerin markaların önüne çıksın.",
      icon: <UserPlus className="w-6 h-6 text-amber-600" />,
      color: "bg-amber-100 border-amber-200 text-amber-700"
    },
    {
      num: "02",
      title: "Teklif Al veya Kampanyalara Başvur",
      desc: "Markaların doğrudan sana göndereceği özel teklifleri değerlendir veya ilgini çeken açık kampanyalara tek tıkla teklif ver.",
      icon: <Mail className="w-6 h-6 text-amber-600" />,
      color: "bg-amber-100 border-amber-200 text-amber-700"
    },
    {
      num: "03",
      title: "Özgün İçeriğini Tasarla & Sun",
      desc: "Hazırladığın görselleri ve video taslaklarını platform üzerinden markanın onayına sun. Tüm revizyonları tek panelden kolayca tamamla.",
      icon: <UploadCloud className="w-6 h-6 text-amber-600" />,
      color: "bg-amber-100 border-amber-200 text-amber-700"
    },
    {
      num: "04",
      title: "Kazancını Güvenle Hesabına Çek",
      desc: "İçerik yayınlandığı anda anlaştığın bakiye cüzdanına yansır. Komisyon veya gecikme sürprizi olmadan ödemeni banka hesabına aktar.",
      icon: <CreditCard className="w-6 h-6 text-amber-600" />,
      color: "bg-amber-100 border-amber-200 text-amber-700"
    }
  ];

  return (
    <div className="pt-20 bg-surface text-on-surface">
      
      {/* Page Header */}
      <section className="py-16 md:py-24 px-6 md:px-16 max-w-[1280px] mx-auto text-center relative">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_40%,rgba(176,38,255,0.06)_0%,transparent_50%)] -z-10" />
        <div className="space-y-4 max-w-3xl mx-auto">
          <span className="text-primary font-sans font-bold text-sm tracking-widest uppercase">KILAVUZ</span>
          <h1 className="font-sans font-extrabold text-4xl md:text-5xl leading-tight text-on-surface">
            A'dan Z'ye Güvenli ve Akıllı İş Birliği
          </h1>
          <p className="font-sans text-on-surface-variant text-base md:text-lg max-w-2xl mx-auto leading-relaxed">
            Go Influence ile karmaşık sözleşmeler, kayıp ödemeler ve belirsiz istatistikler geride kalıyor. Marka ve kreatif süreçlerini uçtan uca kolaylaştırıyoruz.
          </p>
        </div>
      </section>

      {/* Tab Switcher for Mobile / Small Screens */}
      <div className="flex md:hidden justify-center px-6 mb-8">
        <div className="bg-white border border-outline-variant p-1.5 rounded-full flex gap-1 w-full max-w-sm shadow-md">
          <button 
            onClick={() => setActiveTab("brand")}
            className={`flex-1 py-3 text-center rounded-full font-sans font-bold text-sm transition-all ${
              activeTab === "brand" ? "bg-primary text-white" : "text-on-surface-variant"
            }`}
          >
            Markalar İçin
          </button>
          <button 
            onClick={() => setActiveTab("influencer")}
            className={`flex-1 py-3 text-center rounded-full font-sans font-bold text-sm transition-all ${
              activeTab === "influencer" ? "bg-amber-500 text-white" : "text-on-surface-variant"
            }`}
          >
            Kreatifler İçin
          </button>
        </div>
      </div>

      {/* Journey Dual Container */}
      <section className="px-6 md:px-16 pb-24 max-w-[1280px] mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 lg:gap-20">
          
          {/* Left Column: Marka Yolculuğu */}
          <div className={`space-y-12 text-left ${activeTab === "brand" ? "block" : "hidden md:block"}`}>
            <div className="space-y-3 pb-4 border-b border-surface-container-low">
              <span className="text-primary font-sans font-bold text-xs tracking-wider uppercase bg-primary/10 px-3 py-1.5 rounded-full">Markalar İçin</span>
              <h2 className="font-sans font-extrabold text-2xl md:text-3xl">Marka Yolculuğu</h2>
              <p className="font-sans text-sm text-on-surface-variant">Hedef kitlenize ulaşmak, marka bilinirliğini ve satışları artırmak hiç bu kadar kolay olmamıştı.</p>
            </div>

            {/* Vertical Timeline */}
            <div className="relative pl-8 space-y-12">
              {/* Vertical line decorative background */}
              <div className="absolute top-4 bottom-4 left-4 w-[2px] timeline-line" />

              {brandSteps.map((step, idx) => (
                <div key={idx} className="relative group">
                  {/* Timeline point dot */}
                  <div className="absolute -left-[31px] top-1.5 w-6 h-6 rounded-full bg-white border-4 border-primary flex items-center justify-center shadow-md group-hover:scale-110 transition-transform z-10" />

                  <div className="bg-white p-6 md:p-8 rounded-3xl border border-outline-variant/60 shadow-sm hover:shadow-md transition-shadow relative">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-4">
                      <div className="flex items-center gap-3">
                        <div className={`p-3 rounded-2xl border ${step.color}`}>
                          {step.icon}
                        </div>
                        <h3 className="font-sans font-bold text-lg md:text-xl text-on-surface">{step.title}</h3>
                      </div>
                      <span className="font-sans font-extrabold text-3xl text-primary/20 sm:text-right select-none">{step.num}</span>
                    </div>
                    <p className="font-sans text-sm md:text-base text-on-surface-variant leading-relaxed">
                      {step.desc}
                    </p>
                  </div>
                </div>
              ))}
            </div>

            <div className="pt-4">
              <button 
                onClick={() => handleRoleRegister("marka")}
                className="w-full sm:w-auto bg-primary text-white font-sans font-bold text-base px-8 py-4 rounded-full shadow-lg shadow-primary/10 hover:scale-105 active:scale-95 transition-all cursor-pointer flex items-center justify-center gap-2"
              >
                Marka Kampanyası Başlat
                <ChevronRight className="w-5 h-5" />
              </button>
            </div>
          </div>

          {/* Right Column: Influencer Yolculuğu */}
          <div className={`space-y-12 text-left ${activeTab === "influencer" ? "block" : "hidden md:block"}`}>
            <div className="space-y-3 pb-4 border-b border-surface-container-low">
              <span className="text-amber-700 font-sans font-bold text-xs tracking-wider uppercase bg-amber-100 px-3 py-1.5 rounded-full">Kreatifler İçin</span>
              <h2 className="font-sans font-extrabold text-2xl md:text-3xl">Kreatif Yolculuğu</h2>
              <p className="font-sans text-sm text-on-surface-variant">Özgün içeriklerinizle markalara değer katın, iş birliği tekliflerini tam zamanında yönetin.</p>
            </div>

            {/* Vertical Timeline */}
            <div className="relative pl-8 space-y-12">
              {/* Vertical line decorative background */}
              <div className="absolute top-4 bottom-4 left-4 w-[2px] timeline-line-yellow" />

              {influencerSteps.map((step, idx) => (
                <div key={idx} className="relative group">
                  {/* Timeline point dot */}
                  <div className="absolute -left-[31px] top-1.5 w-6 h-6 rounded-full bg-white border-4 border-amber-500 flex items-center justify-center shadow-md group-hover:scale-110 transition-transform z-10" />

                  <div className="bg-white p-6 md:p-8 rounded-3xl border border-outline-variant/60 shadow-sm hover:shadow-md transition-shadow relative">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-4">
                      <div className="flex items-center gap-3">
                        <div className={`p-3 rounded-2xl border ${step.color}`}>
                          {step.icon}
                        </div>
                        <h3 className="font-sans font-bold text-lg md:text-xl text-on-surface">{step.title}</h3>
                      </div>
                      <span className="font-sans font-extrabold text-3xl text-amber-500/20 sm:text-right select-none">{step.num}</span>
                    </div>
                    <p className="font-sans text-sm md:text-base text-on-surface-variant leading-relaxed">
                      {step.desc}
                    </p>
                  </div>
                </div>
              ))}
            </div>

            <div className="pt-4">
              <button 
                onClick={() => handleRoleRegister("creator")}
                className="w-full sm:w-auto bg-amber-500 hover:bg-amber-600 text-white font-sans font-bold text-base px-8 py-4 rounded-full shadow-lg shadow-amber-500/10 hover:scale-105 active:scale-95 transition-all cursor-pointer flex items-center justify-center gap-2"
              >
                Kreatif Profili Oluştur
                <ChevronRight className="w-5 h-5" />
              </button>
            </div>
          </div>

        </div>
      </section>

      {/* Trust & Escrow Safe Badging Section */}
      <section className="bg-white py-16 border-t border-surface-container-low px-6 md:px-16 text-center">
        <div className="max-w-4xl mx-auto space-y-8">
          <h3 className="font-sans font-extrabold text-2xl md:text-3xl text-on-surface">Güvenlik ve Şeffaflık Standartlarımız</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="space-y-2 text-center p-4">
              <div className="w-10 h-10 rounded-full bg-emerald-100 flex items-center justify-center mx-auto text-emerald-600 mb-3">
                <CheckCircle2 className="w-6 h-6" />
              </div>
              <h4 className="font-sans font-bold text-base">Güvenli Ödeme Cüzdanı</h4>
              <p className="font-sans text-xs md:text-sm text-on-surface-variant leading-relaxed">Ödemeler güvenli havuzda tutulur ve yalnızca belirlenen brief onaylandığında serbest kalır.</p>
            </div>
            <div className="space-y-2 text-center p-4">
              <div className="w-10 h-10 rounded-full bg-emerald-100 flex items-center justify-center mx-auto text-emerald-600 mb-3">
                <CheckCircle2 className="w-6 h-6" />
              </div>
              <h4 className="font-sans font-bold text-base">Doğrulanmış İstatistikler</h4>
              <p className="font-sans text-xs md:text-sm text-on-surface-variant leading-relaxed">Tüm takipçi ve etkileşim oranları doğrudan resmi sosyal medya API'leri üzerinden çekilir.</p>
            </div>
            <div className="space-y-2 text-center p-4">
              <div className="w-10 h-10 rounded-full bg-emerald-100 flex items-center justify-center mx-auto text-emerald-600 mb-3">
                <CheckCircle2 className="w-6 h-6" />
              </div>
              <h4 className="font-sans font-bold text-base">Hızlı İletişim & Canlı Destek</h4>
              <p className="font-sans text-xs md:text-sm text-on-surface-variant leading-relaxed">Sürecin her adımında taraflar arasındaki anlaşmazlıkları çözecek destek ekibimiz devrededir.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Bottom CTA */}
      <section className="py-20 px-6 md:px-16 max-w-[1280px] mx-auto text-center">
        <div className="bg-[#fed5e7] text-on-secondary-container rounded-[40px] px-8 py-16 md:p-16 space-y-6">
          <h2 className="font-sans font-extrabold text-3xl md:text-4xl text-[#795a69]">Birlikte büyümeye hazır mısınız?</h2>
          <p className="font-sans text-[#795a69]/80 text-base md:text-lg max-w-xl mx-auto">
            Hemen kaydolun, saniyeler içinde ilk iş birliğinizin temelini atın. Sınırları aşan kampanyaları birlikte başlatalım.
          </p>
          <div className="pt-4 flex flex-wrap justify-center gap-4">
            <button 
              onClick={() => handleRoleRegister("marka")}
              className="bg-primary text-white font-sans font-bold px-8 py-3.5 rounded-full hover:scale-105 active:scale-95 transition-all cursor-pointer shadow-lg shadow-primary/20"
            >
              Hemen Başla
            </button>
            <button 
              onClick={() => navigateTo("contact")}
              className="bg-white text-on-surface border border-outline-variant font-sans font-semibold px-8 py-3.5 rounded-full hover:bg-surface-container-low transition-all cursor-pointer"
            >
              Destek Al
            </button>
          </div>
        </div>
      </section>

    </div>
  );
}


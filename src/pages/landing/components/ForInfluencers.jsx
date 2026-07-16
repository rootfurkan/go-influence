import React, { useState } from "react";
import { Layout, MessageSquare, CreditCard, ChevronRight, CheckCircle, ShieldCheck, Award, Heart, TrendingUp, Users } from "lucide-react";

export default function ForInfluencers({ navigateTo, setPreselectedRole }) {
  const [activeTab, setActiveTab] = useState("kit");

  const benefits = [
    {
      icon: <Users className="w-5 h-5 text-amber-600" />,
      title: "Sana En Uygun Markaları Keşfet",
      desc: "İçerik diline, duruşuna ve hedef kitlene uyan marka kampanyalarını ilgi alanlarına göre listele. Doğal iş birlikleriyle kitleni koru."
    },
    {
      icon: <Layout className="w-5 h-5 text-amber-600" />,
      title: "Otomatik Akıllı Medya Kit",
      desc: "Sosyal medya hesaplarını bağladığında izlenme, erişim ve kitle demografisi verilerin otomatik güncellenen şık bir medya kitine dönüşür."
    },
    {
      icon: <MessageSquare className="w-5 h-5 text-amber-600" />,
      title: "Kolay Teklif ve Revizyon Yönetimi",
      desc: "Markalarla doğrudan sohbet et, özel teklifler hazırla. Revizyon taleplerini ve tüm onay aşamalarını tek bir panelden kafa karışıklığı olmadan yönet."
    },
    {
      icon: <CreditCard className="w-5 h-5 text-amber-600" />,
      title: "Zamanında ve Güvenli Kazanç Takibi",
      desc: "Ödemen iş birliği kesinleştiğinde havuzda bloke edilir. İçeriğin yayınlandığı anda ise saniyeler içinde cüzdanına geçer. Ödeme kovalama stresi son bulur!"
    }
  ];

  const handleRoleRegister = () => {
    setPreselectedRole("creator");
    navigateTo("register");
  };

  return (
    <div className="pt-20 bg-surface text-on-surface">
      
      {/* Hero Section */}
      <section className="relative py-16 md:py-24 px-6 md:px-16 max-w-[1280px] mx-auto overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_70%_20%,rgba(249,248,113,0.1)_0%,transparent_50%)] -z-10" />

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          
          {/* Left Hero Content */}
          <div className="lg:col-span-6 space-y-6 text-left">
            <span className="text-amber-800 font-sans font-bold text-sm tracking-wider uppercase bg-amber-100 px-4 py-2 rounded-full border border-amber-200">Kreatifler İçin</span>
            <h1 className="font-sans font-extrabold text-4xl md:text-5xl leading-tight text-on-surface">
              Yaratıcılığını <br />
              <span className="text-amber-600">Kazanca Dönüştür</span>
            </h1>
            <p className="font-sans text-on-surface-variant text-base md:text-lg leading-relaxed">
              En sevdiğin markalarla iş birliği yap, otomatik güncellenen medya kitinle profesyonel görün ve güvenli escrow sistemi sayesinde ödeme alma endişesi taşımadan üretmeye odaklan.
            </p>
            
            <div className="pt-4 flex flex-wrap gap-4">
              <button 
                onClick={handleRoleRegister}
                className="bg-amber-500 hover:bg-amber-600 text-white font-sans font-bold px-8 py-4 rounded-full hover:scale-105 active:scale-95 transition-all cursor-pointer shadow-lg shadow-amber-500/10 flex items-center gap-2"
              >
                Kreatif Olarak Katıl
                <ChevronRight className="w-5 h-5" />
              </button>
              <button 
                onClick={() => {
                  const benefitsSection = document.getElementById("benefits-section");
                  if (benefitsSection) benefitsSection.scrollIntoView({ behavior: "smooth" });
                }}
                className="bg-white border border-outline-variant text-on-surface font-sans font-semibold px-8 py-4 rounded-full hover:bg-surface-container-low transition-colors cursor-pointer"
              >
                Neler Sunuyoruz?
              </button>
            </div>
          </div>

          {/* Right Hero Custom Profile Display Mock */}
          <div className="lg:col-span-6 relative flex justify-center items-center">
            <div className="absolute inset-0 ambient-glow-2 -z-10" />
            
            <div className="bg-white border border-outline-variant rounded-[32px] p-6 w-full max-w-lg shadow-2xl space-y-6">
              
              {/* Creator Card Title */}
              <div className="flex justify-between items-center pb-4 border-b border-surface-container-low">
                <div className="flex items-center gap-3">
                  <img 
                    src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=150" 
                    alt="Selin Aras" 
                    className="w-12 h-12 rounded-full object-cover border-2 border-amber-400"
                  />
                  <div className="text-left">
                    <h3 className="font-sans font-bold text-base text-on-surface">Selin Aras</h3>
                    <p className="font-sans text-xs text-on-surface-variant">Moda & Lifestyle Kreatifi</p>
                  </div>
                </div>
                <div className="bg-amber-50 text-amber-800 font-sans font-bold text-xs px-3 py-1.5 rounded-full border border-amber-200">
                  Doğrulanmış Profil
                </div>
              </div>

              {/* Creator Metrics tabs */}
              <div className="flex gap-2 bg-surface p-1 rounded-full border border-surface-container-low">
                <button 
                  onClick={() => setActiveTab("kit")}
                  className={`flex-1 py-1.5 rounded-full font-sans text-xs font-bold transition-all cursor-pointer ${
                    activeTab === "kit" ? "bg-white text-on-surface shadow-sm" : "text-on-surface-variant hover:text-on-surface"
                  }`}
                >
                  Medya Kit İstatistikleri
                </button>
                <button 
                  onClick={() => setActiveTab("earnings")}
                  className={`flex-1 py-1.5 rounded-full font-sans text-xs font-bold transition-all cursor-pointer ${
                    activeTab === "earnings" ? "bg-white text-on-surface shadow-sm" : "text-on-surface-variant hover:text-on-surface"
                  }`}
                >
                  Kazanç Kontrolü
                </button>
              </div>

              {/* Tab 1: Media Kit statistics view */}
              {activeTab === "kit" && (
                <div className="space-y-4 animate-in fade-in duration-200 text-left">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="bg-surface p-4 rounded-2xl border border-surface-container-low">
                      <p className="text-[10px] text-on-surface-variant uppercase font-sans tracking-wider">Takipçi Kitlesi</p>
                      <p className="font-sans font-extrabold text-lg text-on-surface">240,000</p>
                    </div>
                    <div className="bg-surface p-4 rounded-2xl border border-surface-container-low">
                      <p className="text-[10px] text-on-surface-variant uppercase font-sans tracking-wider">Etkileşim Oranı</p>
                      <p className="font-sans font-extrabold text-lg text-amber-600">4.8%</p>
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="bg-surface p-4 rounded-2xl border border-surface-container-low">
                      <p className="text-[10px] text-on-surface-variant uppercase font-sans tracking-wider">Aylık Ortalama Erişim</p>
                      <p className="font-sans font-extrabold text-lg text-on-surface">1.1 Milyon</p>
                    </div>
                    <div className="bg-surface p-4 rounded-2xl border border-surface-container-low">
                      <p className="text-[10px] text-on-surface-variant uppercase font-sans tracking-wider">Kitle Yaş Dağılımı</p>
                      <p className="font-sans font-extrabold text-base text-on-surface">18 - 34 (%72)</p>
                    </div>
                  </div>
                </div>
              )}

              {/* Tab 2: Earnings list view */}
              {activeTab === "earnings" && (
                <div className="space-y-4 animate-in fade-in duration-200 text-left">
                  <div className="bg-amber-50 border border-amber-200/50 p-4 rounded-2xl flex justify-between items-center">
                    <div>
                      <p className="text-xs text-amber-800 font-sans">Toplam Cüzdan Bakiyesi</p>
                      <p className="font-sans font-black text-2xl text-amber-900">15,240.00 TL</p>
                    </div>
                    <button className="bg-amber-600 text-white text-xs font-bold px-3 py-1.5 rounded-lg shadow-sm hover:bg-amber-700 cursor-pointer">
                      Para Çek
                    </button>
                  </div>

                  <div className="space-y-2">
                    <p className="text-[10px] text-on-surface-variant font-sans font-bold uppercase tracking-wider">Son Ödemeler</p>
                    <div className="flex justify-between items-center p-2.5 bg-surface rounded-xl border border-surface-container-low text-xs font-sans text-on-surface">
                      <span>Aura Kozmetik - Video İş Birliği</span>
                      <span className="font-bold text-emerald-600">+8,500.00 TL</span>
                    </div>
                    <div className="flex justify-between items-center p-2.5 bg-surface rounded-xl border border-surface-container-low text-xs font-sans text-on-surface">
                      <span>ModaEvim - Post Tanıtımı</span>
                      <span className="font-bold text-emerald-600">+6,740.00 TL</span>
                    </div>
                  </div>
                </div>
              )}

              {/* Offer tracker notification emulation */}
              <div className="bg-emerald-50 border border-emerald-200 p-4 rounded-2xl text-left flex items-start gap-3">
                <div className="bg-emerald-100 text-emerald-700 p-1.5 rounded-xl">
                  <ShieldCheck className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="font-sans font-bold text-xs text-emerald-800">1 Yeni İş Birliği Teklifi</h4>
                  <p className="font-sans text-[11px] text-emerald-800/80 leading-relaxed mt-0.5">
                    "Luna Teknoloji" markası sizinle 12,000 TL bütçeli bir kampanya başlatmak istiyor.
                  </p>
                </div>
              </div>

            </div>
          </div>

        </div>
      </section>

      {/* Benefits Detailed Feature Grid */}
      <section id="benefits-section" className="py-20 px-6 md:px-16 bg-white border-y border-surface-container-low">
        <div className="max-w-[1280px] mx-auto space-y-16">
          <div className="text-center space-y-4 max-w-2xl mx-auto">
            <span className="text-amber-600 font-sans font-bold text-sm tracking-widest uppercase font-mono">SENİN İÇİN NELER HAZIRLADIK?</span>
            <h2 className="font-sans font-extrabold text-3xl md:text-4xl text-on-surface">Kariyerini Güvenceye Al, Özgürce Üret</h2>
            <p className="font-sans text-on-surface-variant text-sm md:text-base">
              Markalarla yaşanan anlaşmazlıkları, ödenmeyen faturaları ve bütçe karmaşalarını tamamen ortadan kaldıran şeffaf bir platform deneyimi.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 text-left">
            {benefits.map((benefit, idx) => (
              <div 
                key={idx} 
                className="bg-surface p-8 rounded-3xl border border-outline-variant/50 hover:border-amber-400/30 transition-colors space-y-4"
              >
                <div className="w-10 h-10 rounded-2xl bg-amber-100 flex items-center justify-center border border-amber-200">
                  {benefit.icon}
                </div>
                <h3 className="font-sans font-bold text-lg md:text-xl text-on-surface">{benefit.title}</h3>
                <p className="font-sans text-sm text-on-surface-variant leading-relaxed">
                  {benefit.desc}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Call to Action Banner Checklist Benefits */}
      <section className="py-20 px-6 md:px-16 max-w-[1280px] mx-auto text-center">
        <div className="bg-[#f8f9fa] border border-outline-variant/60 rounded-[40px] px-8 py-16 md:p-16 space-y-10 shadow-sm relative overflow-hidden">
          <div className="absolute inset-0 ambient-glow-1 -z-10" />
          
          <div className="space-y-4 max-w-2xl mx-auto">
            <h2 className="font-sans font-extrabold text-3xl md:text-4xl">Kariyerini Bir Üst Seviyeye Taşı</h2>
            <p className="font-sans text-on-surface-variant text-base md:text-lg">
              Yaratıcılığına gerçekten değer veren markalarla doğrudan bağ kurarak profesyonel influencer kariyerini bugün başlat.
            </p>
          </div>

          {/* Core Benefit Checklists */}
          <div className="flex flex-wrap justify-center gap-6 md:gap-12 max-w-3xl mx-auto font-sans font-bold text-sm text-on-surface">
            <div className="flex items-center gap-2.5">
              <CheckCircle className="w-5 h-5 text-emerald-600 fill-emerald-100" />
              <span>Tamamen Ücretsiz Üyelik</span>
            </div>
            <div className="flex items-center gap-2.5">
              <CheckCircle className="w-5 h-5 text-emerald-600 fill-emerald-100" />
              <span>Sürpriz Kesintiler & Komisyon Yok</span>
            </div>
            <div className="flex items-center gap-2.5">
              <CheckCircle className="w-5 h-5 text-emerald-600 fill-emerald-100" />
              <span>Tıkır Tıkır İşleyen Güvenli Ödeme</span>
            </div>
          </div>

          <div className="pt-4">
            <button 
              onClick={handleRoleRegister}
              className="bg-amber-500 hover:bg-amber-600 text-white font-sans font-bold px-10 py-4.5 rounded-full hover:scale-105 active:scale-95 transition-all shadow-xl shadow-amber-500/20 cursor-pointer text-base"
            >
              Kreatif Olarak Şimdi Başla
            </button>
          </div>
        </div>
      </section>

    </div>
  );
}


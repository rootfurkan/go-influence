import React, { useState } from "react";
import { ArrowRight, Sparkles, TrendingUp, Users, Award, ShieldCheck, Heart, Search, CheckCircle2 } from "lucide-react";

const ALL_CREATORS = [
  {
    id: 1,
    name: "Selin Aras",
    category: "Moda & Stil",
    catId: "fashion",
    followers: "240K",
    engagement: "4.8%",
    desc: "Sürdürülebilir moda, minimalist kombin fikirleri ve lifestyle içerikler paylaşıyor.",
    img: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=500",
    score: "98%"
  },
  {
    id: 2,
    name: "Mert Yılmaz",
    category: "Teknoloji",
    catId: "tech",
    followers: "150K",
    engagement: "5.2%",
    desc: "En yeni akıllı telefonlar, bilgisayar donanımları ve teknoloji araçları incelemeleri.",
    img: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=500",
    score: "96%"
  },
  {
    id: 3,
    name: "Can Demir",
    category: "Fitness & Spor",
    catId: "fitness",
    followers: "310K",
    engagement: "6.1%",
    desc: "Evde egzersiz rutinleri, fitness koçluğu ve sporcu beslenmesi rehberleri.",
    img: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&q=80&w=500",
    score: "97%"
  },
  {
    id: 4,
    name: "Ece Yıldız",
    category: "Güzellik",
    catId: "beauty",
    followers: "185K",
    engagement: "4.5%",
    desc: "Bilimsel cilt bakımı analizleri, doğal makyaj rutinleri ve dürüst kozmetik yorumları.",
    img: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&q=80&w=500",
    score: "95%"
  },
  {
    id: 5,
    name: "Kaan Kaya",
    category: "Oyun & E-Spor",
    catId: "gaming",
    followers: "420K",
    engagement: "7.3%",
    desc: "Canlı yayın kesitleri, espor analizleri ve indie oyun ilk bakış incelemeleri.",
    img: "https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?auto=format&fit=crop&q=80&w=500",
    score: "99%"
  },
  {
    id: 6,
    name: "Dilek Koç",
    category: "Yemek & Gurme",
    catId: "food",
    followers: "95K",
    engagement: "5.8%",
    desc: "Pratik 15 dakikalık akşam yemekleri, glutensiz tarifler ve mutfak sırları.",
    img: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&q=80&w=500",
    score: "94%"
  }
];

const CATEGORIES = [
  { id: "all", label: "Tüm Sektörler" },
  { id: "fashion", label: "Moda & Stil" },
  { id: "tech", label: "Teknoloji" },
  { id: "fitness", label: "Fitness & Spor" },
  { id: "beauty", label: "Güzellik" },
  { id: "gaming", label: "Oyun & E-Spor" },
  { id: "food", label: "Yemek & Gurme" }
];

export default function Home({ navigateTo, setPreselectedRole }) {
  const [activeCategory, setActiveCategory] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");

  const filteredCreators = ALL_CREATORS.filter(creator => {
    const matchesCategory = activeCategory === "all" || creator.catId === activeCategory;
    const matchesSearch = creator.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          creator.category.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          creator.desc.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  const handleRoleRegister = (role) => {
    setPreselectedRole(role);
    navigateTo("register");
  };

  return (
    <div className="pt-20 bg-surface text-on-surface overflow-x-hidden">
      {/* Hero Section */}
      <section className="relative min-h-[90vh] flex items-center pt-8 pb-16 px-6 md:px-16 max-w-[1280px] mx-auto">
        <div className="absolute inset-0 ambient-glow-1 -z-10" />
        
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center w-full">
          {/* Left Column: Copywriting & CTA */}
          <div className="lg:col-span-7 space-y-8 text-left">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 border border-primary/20 text-primary font-sans font-semibold text-xs md:text-sm animate-pulse">
              <Sparkles className="w-4 h-4 text-primary" />
              <span>Kategori Bazlı Influencer Keşfi</span>
            </div>

            <h1 className="font-sans font-extrabold text-4xl md:text-6xl text-on-surface leading-[1.1] tracking-tight">
              Doğru influencer'ı, <br />
              <span className="text-primary bg-clip-text">doğru markayla</span> <br />
              buluşturuyoruz.
            </h1>

            <p className="font-sans text-on-surface-variant text-base md:text-xl leading-relaxed max-w-xl">
              Gelişmiş analitik veriler ve akıllı eşleştirme teknolojimiz ile influencer pazarlama kampanyalarınızı zahmetsizce planlayın, bütçenizi en verimli şekilde yönetin.
            </p>

            {/* Quick search input emulation */}
            <div className="max-w-md bg-white p-2 rounded-full border border-outline-variant flex items-center shadow-lg shadow-primary/5">
              <div className="flex items-center pl-3 pr-2 text-on-surface-variant/60">
                <Search className="w-5 h-5" />
              </div>
              <input 
                type="text" 
                placeholder="Örn: Moda, Teknoloji, Fitness..." 
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full bg-transparent border-none outline-none text-sm text-on-surface placeholder-on-surface-variant/40"
              />
              <button 
                onClick={() => {
                  const section = document.getElementById("creators-list");
                  if (section) section.scrollIntoView({ behavior: "smooth" });
                }}
                className="bg-primary text-white text-xs md:text-sm font-semibold px-5 py-2.5 rounded-full hover:scale-105 transition-all cursor-pointer whitespace-nowrap"
              >
                Kreatif Bul
              </button>
            </div>

            {/* CTAs */}
            <div className="flex flex-wrap items-center gap-4">
              <button
                onClick={() => handleRoleRegister("marka")}
                className="bg-primary-container text-white px-8 py-4 rounded-full font-sans font-bold text-base hover:scale-105 active:scale-95 transition-all shadow-xl shadow-primary/10 cursor-pointer flex items-center gap-2"
              >
                Marka Olarak Katıl
                <ArrowRight className="w-5 h-5" />
              </button>
              <button
                onClick={() => navigateTo("how-it-works")}
                className="bg-white border border-outline-variant text-on-surface px-8 py-4 rounded-full font-sans font-semibold text-base hover:bg-surface-container-low transition-all cursor-pointer"
              >
                Nasıl Çalışır?
              </button>
            </div>
          </div>

          {/* Right Column: Floating Match Graphic Cards */}
          <div className="lg:col-span-5 relative flex justify-center items-center h-[450px] md:h-[550px]">
            <div className="absolute inset-0 ambient-glow-2 -z-10" />

            {/* Main Interactive Floating Match Frame */}
            <div className="relative w-[320px] md:w-[380px] bg-white p-6 rounded-[32px] border border-outline-variant/60 shadow-[0px_20px_60px_rgba(144,0,215,0.08)] animate-float">
              {/* Card top badge */}
              <div className="flex justify-between items-center mb-6">
                <span className="bg-primary-fixed text-on-primary-fixed-variant px-3 py-1 rounded-full text-xs font-bold font-sans">
                  Örnek Kampanya Eşleşmesi
                </span>
                <div className="flex items-center gap-1.5 bg-[#F9F871] text-on-surface font-sans font-bold text-xs px-2.5 py-1 rounded-full border border-black/5">
                  <Sparkles className="w-3.5 h-3.5 fill-on-surface" />
                  98% Uyum
                </div>
              </div>

              {/* Influencer Row */}
              <div className="flex items-center gap-4 p-3 bg-surface rounded-2xl border border-surface-container-low mb-4">
                <img 
                  src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=200" 
                  alt="Selin Aras" 
                  className="w-12 h-12 rounded-full object-cover border-2 border-primary/20"
                />
                <div className="text-left">
                  <h4 className="font-sans font-bold text-sm">Selin Aras</h4>
                  <p className="font-sans text-xs text-on-surface-variant">Moda & Lifestyle (240K)</p>
                </div>
              </div>

              {/* Connecting Pulse Line */}
              <div className="relative flex justify-center my-1.5 h-6">
                <div className="absolute top-1/2 left-0 right-0 h-[2px] bg-dashed bg-primary-fixed" />
                <div className="bg-primary text-white p-1 rounded-full relative z-10 hover:scale-110 transition-transform">
                  <Heart className="w-3.5 h-3.5 fill-white" />
                </div>
              </div>

              {/* Brand Row */}
              <div className="flex items-center gap-4 p-3 bg-surface rounded-2xl border border-surface-container-low mb-4">
                <div className="w-12 h-12 rounded-full bg-[#fed5e7] flex items-center justify-center border-2 border-[#ffd8e9]">
                  <span className="font-sans font-bold text-xs text-[#795a69]">AURA</span>
                </div>
                <div className="text-left">
                  <h4 className="font-sans font-bold text-sm">Aura Kozmetik</h4>
                  <p className="font-sans text-xs text-on-surface-variant">Güzellik & Bakım Markası</p>
                </div>
              </div>

              {/* Campaign Status Check list */}
              <div className="space-y-2 mt-4 pt-4 border-t border-surface-container-low">
                <div className="flex items-center gap-2.5 text-xs text-on-surface-variant text-left">
                  <CheckCircle2 className="w-4 h-4 text-emerald-500 fill-emerald-500/20" />
                  <span>Hedef Kitle Eşleşmesi Doğrulandı</span>
                </div>
                <div className="flex items-center gap-2.5 text-xs text-on-surface-variant text-left">
                  <CheckCircle2 className="w-4 h-4 text-emerald-500 fill-emerald-500/20" />
                  <span>Geçmiş Kampanya ROI Analizi Yapıldı</span>
                </div>
              </div>
            </div>

            {/* Floating Bubble 1: Analytics Graphic */}
            <div className="absolute top-10 left-0 bg-white border border-outline-variant/60 p-3.5 rounded-2xl shadow-xl flex items-center gap-3 animate-pulse">
              <div className="bg-emerald-500/10 p-2 rounded-xl">
                <TrendingUp className="w-5 h-5 text-emerald-500" />
              </div>
              <div className="text-left">
                <p className="text-[10px] text-on-surface-variant font-sans">Etkileşim Artışı</p>
                <p className="text-sm font-sans font-bold text-emerald-600">+24.5%</p>
              </div>
            </div>

            {/* Floating Bubble 2: Reach */}
            <div className="absolute bottom-12 right-0 bg-white border border-outline-variant/60 p-3.5 rounded-2xl shadow-xl flex items-center gap-3">
              <div className="bg-purple-500/10 p-2 rounded-xl">
                <Users className="w-5 h-5 text-primary" />
              </div>
              <div className="text-left">
                <p className="text-[10px] text-on-surface-variant font-sans">Toplam Erişim</p>
                <p className="text-sm font-sans font-bold text-on-surface">1.2M +</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="bg-white border-y border-surface-container-low py-12 px-6 md:px-16">
        <div className="max-w-[1280px] mx-auto grid grid-cols-1 md:grid-cols-3 gap-8 md:gap-0 text-center">
          <div className="md:border-r border-surface-container-low py-4 space-y-1">
            <h3 className="font-sans text-4xl md:text-5xl font-extrabold text-primary">500 +</h3>
            <p className="font-sans text-sm md:text-base font-semibold text-on-surface-variant">Aktif Doğrulanmış Influencer</p>
          </div>
          <div className="md:border-r border-surface-container-low py-4 space-y-1">
            <h3 className="font-sans text-4xl md:text-5xl font-extrabold text-primary">200 +</h3>
            <p className="font-sans text-sm md:text-base font-semibold text-on-surface-variant">Global ve Yerel Marka</p>
          </div>
          <div className="py-4 space-y-1">
            <h3 className="font-sans text-4xl md:text-5xl font-extrabold text-primary">1000 +</h3>
            <p className="font-sans text-sm md:text-base font-semibold text-on-surface-variant">Başarılı Kampanya Eşleşmesi</p>
          </div>
        </div>
      </section>

      {/* Process Section */}
      <section className="py-20 px-6 md:px-16 max-w-[1280px] mx-auto text-center space-y-16">
        <div className="space-y-4 max-w-2xl mx-auto">
          <span className="text-primary font-sans font-bold text-sm tracking-widest uppercase">SÜREÇ NASIL İLERLİYOR?</span>
          <h2 className="font-sans font-extrabold text-3xl md:text-4xl">Saniyeler İçinde İş Birliği</h2>
          <p className="font-sans text-on-surface-variant text-base">Platformumuz, markalar ile influencerlar arasındaki iletişimi en baştan en sona optimize edecek adımlarla kurgulandı.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Step 1 */}
          <div className="bg-white p-8 rounded-3xl border border-outline-variant/50 relative shadow-sm hover:shadow-md transition-shadow">
            <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center text-primary font-sans font-bold mb-6 mx-auto">
              1
            </div>
            <h3 className="font-sans font-bold text-xl mb-3">Hesabını Oluştur</h3>
            <p className="font-sans text-sm text-on-surface-variant leading-relaxed">
              Marka isen hedeflerini, influencer isen sosyal medya profillerini ve kitleni tanımlayarak hızlıca aramıza katıl.
            </p>
          </div>

          {/* Step 2 */}
          <div className="bg-white p-8 rounded-3xl border border-outline-variant/50 relative shadow-sm hover:shadow-md transition-shadow">
            <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center text-primary font-sans font-bold mb-6 mx-auto">
              2
            </div>
            <h3 className="font-sans font-bold text-xl mb-3">Akıllı Eşleşmeyi Keşfet</h3>
            <p className="font-sans text-sm text-on-surface-variant leading-relaxed">
              Kategori, kitle demografisi ve etkileşim oranlarına göre en yüksek getiriyi sağlayacak partnere ulaşırsınız.
            </p>
          </div>

          {/* Step 3 */}
          <div className="bg-white p-8 rounded-3xl border border-outline-variant/50 relative shadow-sm hover:shadow-md transition-shadow">
            <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center text-primary font-sans font-bold mb-6 mx-auto">
              3
            </div>
            <h3 className="font-sans font-bold text-xl mb-3">Kampanyayı Tamamla</h3>
            <p className="font-sans text-sm text-on-surface-variant leading-relaxed">
              İçerik onaylarını platformdan yönet, ödemeleri güvenli escrow sistemiyle yap ve performans raporlarını anlık analiz et.
            </p>
          </div>
        </div>
      </section>

      {/* Categories & Influencers Catalog (Interactive) */}
      <section id="creators-list" className="py-20 px-6 md:px-16 bg-white/50 border-y border-surface-container-low">
        <div className="max-w-[1280px] mx-auto space-y-12">
          
          {/* Header */}
          <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6">
            <div className="space-y-3 text-left">
              <span className="text-primary font-sans font-bold text-sm tracking-widest uppercase">KREATİFLERİMİZ</span>
              <h2 className="font-sans font-extrabold text-3xl md:text-4xl">Her Sektörden Kreatifler</h2>
              <p className="font-sans text-on-surface-variant text-sm md:text-base max-w-xl">
                Niş alanınız ne olursa olsun, doğru topluluğa hitap eden içerik üreticisini kategorilerimiz arasından filtreleyerek bulun.
              </p>
            </div>
          </div>

          {/* Filter Chips */}
          <div className="flex flex-wrap gap-2.5 justify-start">
            {CATEGORIES.map(cat => {
              const isActive = activeCategory === cat.id;
              return (
                <button
                  key={cat.id}
                  onClick={() => setActiveCategory(cat.id)}
                  className={`px-5 py-2.5 rounded-full font-sans text-xs md:text-sm font-semibold border transition-all cursor-pointer ${
                    isActive 
                      ? "bg-primary text-white border-primary shadow-lg shadow-primary/15 scale-105" 
                      : "bg-white border-outline-variant text-on-surface hover:bg-surface-container-low"
                  }`}
                >
                  {cat.label}
                </button>
              );
            })}
          </div>

          {/* Grid of Creators */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {filteredCreators.length > 0 ? (
              filteredCreators.map((creator) => (
                <div 
                  key={creator.id} 
                  className="bg-white rounded-3xl border border-outline-variant/60 overflow-hidden shadow-sm flex flex-col hover:shadow-xl hover:-translate-y-2 transition-all duration-300"
                >
                  {/* Photo area */}
                  <div className="relative h-56 w-full">
                    <img 
                      src={creator.img} 
                      alt={creator.name} 
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute top-3 right-3 bg-white/90 backdrop-blur-md px-3 py-1 rounded-full text-xs font-extrabold font-sans text-primary border border-primary/10 flex items-center gap-1">
                      <Sparkles className="w-3 h-3" />
                      {creator.score} Uyum
                    </div>
                    <span className="absolute bottom-3 left-3 bg-black/50 backdrop-blur-sm text-white px-3 py-1 rounded-full text-xs font-semibold font-sans">
                      {creator.category}
                    </span>
                  </div>

                  {/* Body information */}
                  <div className="p-6 flex-1 flex flex-col justify-between text-left space-y-4">
                    <div className="space-y-2">
                      <h3 className="font-sans font-bold text-lg text-on-surface">{creator.name}</h3>
                      <p className="font-sans text-xs md:text-sm text-on-surface-variant line-clamp-2">
                        {creator.desc}
                      </p>
                    </div>

                    {/* Meta stats */}
                    <div className="grid grid-cols-2 gap-2 pt-4 border-t border-surface-container-low">
                      <div className="text-left">
                        <p className="text-[10px] text-on-surface-variant font-sans uppercase tracking-wider">Takipçi</p>
                        <p className="font-sans font-extrabold text-base text-primary">{creator.followers}</p>
                      </div>
                      <div className="text-left">
                        <p className="text-[10px] text-on-surface-variant font-sans uppercase tracking-wider">Etkileşim</p>
                        <p className="font-sans font-extrabold text-base text-on-surface">{creator.engagement}</p>
                      </div>
                    </div>

                    {/* Trigger message on card */}
                    <button 
                      onClick={() => handleRoleRegister("marka")}
                      className="w-full bg-surface-container-low hover:bg-primary/10 hover:text-primary py-2.5 rounded-xl font-sans font-bold text-xs transition-colors cursor-pointer text-center"
                    >
                      İş Birliği Başlat
                    </button>
                  </div>
                </div>
              ))
            ) : (
              <div className="col-span-full py-16 bg-white rounded-3xl border border-dashed border-outline-variant/80 text-center">
                <p className="font-sans text-on-surface-variant text-base">Aradığınız kriterlere uygun kreatif bulunamadı.</p>
                <button 
                  onClick={() => { setActiveCategory("all"); setSearchQuery(""); }} 
                  className="mt-3 text-sm text-primary font-bold underline cursor-pointer"
                >
                  Filtreleri Sıfırla
                </button>
              </div>
            )}
          </div>

        </div>
      </section>

      {/* Bottom CTA Banner */}
      <section className="py-20 px-6 md:px-16 max-w-[1280px] mx-auto">
        <div className="bg-primary text-white rounded-[40px] px-8 py-16 md:p-16 text-center space-y-8 relative overflow-hidden shadow-2xl">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_70%_20%,rgba(255,255,255,0.15)_0%,transparent_60%)] pointer-events-none" />
          
          <div className="space-y-4 max-w-2xl mx-auto relative z-10">
            <h2 className="font-sans font-extrabold text-3xl md:text-5xl leading-tight">
              Başarıya giden yolu birlikte yürüyelim.
            </h2>
            <p className="font-sans text-white/80 text-base md:text-lg">
              İster markasını büyütmek isteyen bir işletme olun, ister kitlesine değer katmak isteyen bir kreatif. Aradığınız her şey tek bir platformda.
            </p>
          </div>

          <div className="flex flex-wrap justify-center gap-4 relative z-10 pt-4">
            <button
              onClick={() => handleRoleRegister("marka")}
              className="bg-[#F9F871] text-on-surface px-8 py-4 rounded-full font-sans font-bold text-base hover:scale-105 active:scale-95 transition-all shadow-lg cursor-pointer"
            >
              Marka Olarak Üye Ol
            </button>
            <button
              onClick={() => handleRoleRegister("creator")}
              className="bg-white/10 border border-white/20 text-white px-8 py-4 rounded-full font-sans font-semibold text-base hover:bg-white/20 transition-all cursor-pointer"
            >
              Influencer Olarak Üye Ol
            </button>
          </div>
        </div>
      </section>
    </div>
  );
}




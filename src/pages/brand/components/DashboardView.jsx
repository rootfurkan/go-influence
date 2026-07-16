/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */
import { Rocket, UserPlus, Clock, Wallet, TrendingUp, MoreHorizontal, BadgeCheck, BarChart3 } from "lucide-react";
function DashboardView({
  creators,
  campaigns,
  offers,
  onNavigateToTab,
  onSendOffer
}) {
  const activeCampaigns = campaigns.filter((c) => c.status === "Aktif").length;
  const pendingOffersCount = offers.filter((o) => o.status === "Beklemede").length;
  const topMatches = creators.slice(0, 3);
  return <div className="space-y-8 animate-in fade-in duration-500">
      
      {
    /* Summary Cards Bento Grid */
  }
      <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        
        {
    /* Card 1: Active Campaigns */
  }
        <div className="bento-card p-6 rounded-3xl">
          <div className="flex items-center justify-between mb-4">
            <div className="p-3 bg-primary-container/10 rounded-2xl text-primary">
              <Rocket size={22} className="stroke-[2.5]" />
            </div>
            <span className="text-xs font-bold text-green-500 bg-green-50 px-2.5 py-1 rounded-full">+12%</span>
          </div>
          <p className="text-on-surface-variant text-sm font-semibold">Aktif Kampanyalar</p>
          <h3 className="font-sans font-extrabold text-3xl mt-1 text-on-surface">{activeCampaigns}</h3>
        </div>

        {
    /* Card 2: New Matches */
  }
        <div className="bento-card p-6 rounded-3xl">
          <div className="flex items-center justify-between mb-4">
            <div className="p-3 bg-secondary-container rounded-2xl text-secondary">
              <UserPlus size={22} className="stroke-[2.5]" />
            </div>
            <span className="text-xs font-bold text-primary bg-primary-container/10 px-2.5 py-1 rounded-full">Yeni</span>
          </div>
          <p className="text-on-surface-variant text-sm font-semibold">Yeni Eşleşmeler</p>
          <h3 className="font-sans font-extrabold text-3xl mt-1 text-on-surface">{creators.length * 3}</h3>
        </div>

        {
    /* Card 3: Pending Offers */
  }
        <div className="bento-card p-6 rounded-3xl">
          <div className="flex items-center justify-between mb-4">
            <div className="p-3 bg-yellow-500/10 rounded-2xl text-yellow-600">
              <Clock size={22} className="stroke-[2.5]" />
            </div>
            <span className="text-xs font-bold text-orange-500 bg-orange-50 px-2.5 py-1 rounded-full">
              {pendingOffersCount} Bekleyen
            </span>
          </div>
          <p className="text-on-surface-variant text-sm font-semibold">Bekleyen Teklifler</p>
          <h3 className="font-sans font-extrabold text-3xl mt-1 text-on-surface">{offers.length}</h3>
        </div>

        {
    /* Card 4: Budget */
  }
        <div className="bento-card p-6 rounded-3xl">
          <div className="flex items-center justify-between mb-4">
            <div className="p-3 bg-surface-container-high rounded-2xl text-on-surface">
              <Wallet size={22} className="stroke-[2.5]" />
            </div>
          </div>
          <p className="text-on-surface-variant text-sm font-semibold">Toplam Bütçe</p>
          <h3 className="font-sans font-extrabold text-3xl mt-1 text-on-surface">₺840k</h3>
        </div>

      </section>

      {
    /* Main Content Layout Grid */
  }
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {
    /* Left Column: Recent Matches */
  }
        <div className="lg:col-span-2 space-y-6">
          <div className="flex items-center justify-between">
            <h2 className="font-sans font-bold text-xl text-on-surface">Son Eslesmeler</h2>
            <button
    onClick={() => onNavigateToTab("matches")}
    className="text-primary font-bold text-sm hover:underline cursor-pointer"
  >
              Tümünü Gör
            </button>
          </div>

          <div className="space-y-4">
            {topMatches.map((creator) => <div
    key={creator.id}
    className="bento-card p-4 rounded-3xl flex flex-col sm:flex-row items-center justify-between gap-4 group"
  >
                <div className="flex items-center gap-4 self-start sm:self-center">
                  <div className="w-16 h-16 rounded-2xl overflow-hidden bg-surface-container-low shrink-0 relative">
                    <img
    src={creator.avatarUrl}
    alt={creator.name}
    className="w-full h-full object-cover"
    referrerPolicy="no-referrer"
  />
                    {creator.isVerified && <span className="absolute bottom-1 right-1 bg-yellow-400 p-0.5 rounded-full border border-white flex items-center justify-center">
                        <BadgeCheck size={12} className="text-black fill-current" />
                      </span>}
                  </div>
                  <div>
                    <h4 className="font-bold text-lg text-on-surface flex items-center gap-1.5">
                      {creator.name}
                    </h4>
                    <p className="text-xs text-on-surface-variant mb-1.5">@{creator.username}</p>
                    <div className="flex gap-2">
                      {creator.categoryTags.map((t, idx) => <span
    key={idx}
    className="bg-surface-container-high text-on-surface-variant text-[9px] uppercase tracking-wider font-bold px-2 py-0.5 rounded-full"
  >
                          {t}
                        </span>)}
                    </div>
                  </div>
                </div>

                <div className="flex items-center justify-between w-full sm:w-auto gap-6 sm:gap-8 border-t sm:border-t-0 pt-3 sm:pt-0">
                  <div className="text-center sm:text-right">
                    <p className="text-[9px] text-on-surface-variant font-extrabold uppercase tracking-widest mb-1">
                      Uyum Skoru
                    </p>
                    <span className="text-primary font-extrabold text-lg bg-primary-container/10 px-3 py-1.5 rounded-xl">
                      %{creator.matchScore}
                    </span>
                  </div>
                  <button
    onClick={() => onSendOffer(creator)}
    className="bg-primary text-white px-5 py-2.5 rounded-full font-bold text-xs hover:scale-105 active:scale-95 transition-transform cursor-pointer"
  >
                    Detayları Gör
                  </button>
                </div>
              </div>)}
          </div>
        </div>

        {
    /* Right Column: Campaign status side section */
  }
        <aside className="space-y-6">
          <div className="flex items-center justify-between">
            <h2 className="font-sans font-bold text-xl text-on-surface">Kampanya Durumları</h2>
            <MoreHorizontal className="text-on-surface-variant cursor-pointer hover:text-primary transition-colors" />
          </div>

          <div className="bento-card p-6 rounded-3xl space-y-6">
            
            {
    /* Camp 1 Status */
  }
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-sm font-extrabold text-on-surface">Yaz Sezonu Koleksiyonu</span>
                <span className="text-xs font-bold text-green-500">%80 Dolu</span>
              </div>
              <div className="h-2 w-full bg-surface-container-high rounded-full overflow-hidden">
                <div className="h-full bg-primary rounded-full transition-all duration-1000" style={{ width: "80%" }} />
              </div>
              <p className="text-xs text-on-surface-variant font-medium">12 Influencer aktif, 2 beklemede.</p>
            </div>

            {
    /* Camp 2 Status */
  }
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-sm font-extrabold text-on-surface">Black Friday Hazırlık</span>
                <span className="text-xs font-bold text-primary">%35 Dolu</span>
              </div>
              <div className="h-2 w-full bg-surface-container-high rounded-full overflow-hidden">
                <div className="h-full bg-primary-container rounded-full transition-all duration-1000" style={{ width: "35%" }} />
              </div>
              <p className="text-xs text-on-surface-variant font-medium">Yeni influencer arayışı aktif olarak devam ediyor.</p>
            </div>

            {
    /* Camp 3 Status */
  }
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-sm font-extrabold text-on-surface">Yılbaşı Özel</span>
                <span className="text-xs font-semibold text-on-surface-variant">Planlama</span>
              </div>
              <div className="h-2 w-full bg-surface-container-high rounded-full overflow-hidden">
                <div className="h-full bg-outline-variant rounded-full" style={{ width: "5%" }} />
              </div>
            </div>

            <button
    onClick={() => onNavigateToTab("new_campaign")}
    className="w-full py-3.5 mt-2 rounded-2xl border-2 border-primary-container text-primary font-bold text-xs hover:bg-primary-container/5 transition-colors cursor-pointer"
  >
              Yeni Kampanya Oluştur
            </button>
          </div>

          {
    /* Performance Insight Card */
  }
          <div className="bg-secondary-fixed rounded-3xl p-6 text-on-secondary-fixed relative overflow-hidden">
            <div className="relative z-10 space-y-2">
              <h4 className="font-extrabold text-base text-secondary flex items-center gap-1.5">
                <BarChart3 size={18} />
                Performans Analizi
              </h4>
              <p className="text-sm text-on-secondary-fixed-variant font-semibold leading-relaxed">
                Geçen aya göre marka etkileşim oranınız %24 arttı! Sürdürülebilir işbirlikleri kazandırıyor.
              </p>
              <div className="flex gap-2">
                <span className="text-primary font-extrabold text-xs bg-white/60 px-3 py-1 rounded-full flex items-center gap-1">
                  <TrendingUp size={14} />
                  %24 artış
                </span>
              </div>
            </div>
          </div>

        </aside>

      </div>
    </div>;
}
export {
  DashboardView as default
};


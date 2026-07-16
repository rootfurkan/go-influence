import { useState } from "react";
import { List, Download, Rocket, Hourglass, Wallet, Zap, Flower, Laptop, Utensils, ExternalLink, RefreshCw } from "lucide-react";
function CampaignsTab({
  campaigns,
  selectedCampaignId,
  offers,
  onSelectCampaign,
  onOfferAction,
  onShowToast,
  searchQuery
}) {
  const [filterStatus, setFilterStatus] = useState("Active");
  const filteredCampaigns = campaigns.filter((c) => {
    const matchStatus = filterStatus === "Active" ? c.status === "Aktif" : c.status === "Tamamland\u0131";
    const matchesSearch = c.name.toLowerCase().includes(searchQuery.toLowerCase()) || c.brand.toLowerCase().includes(searchQuery.toLowerCase());
    return matchStatus && matchesSearch;
  });
  const selectedCampaign = campaigns.find((c) => c.id === selectedCampaignId) || campaigns[0];
  const visibleOffers = offers || [];
  const handleCampaignRowClick = (id) => {
    onSelectCampaign(id);
    onShowToast(`${campaigns.find((c) => c.id === id)?.name} detaylar\u0131 y\xFCklendi.`);
  };
  const handleOfferAction = (id, action) => {
    onOfferAction(id, action === "accept" ? "Accepted" : "Rejected");
  };
  const getCampaignIcon = (cat) => {
    if (cat.includes("Beauty") || cat.includes("G\xFCzellik")) return Flower;
    if (cat.includes("Tech") || cat.includes("Teknoloji")) return Laptop;
    return Utensils;
  };
  return <div className="space-y-8 animate-fade-in select-none">
      {
    /* Header and Filter Switches */
  }
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-4 mb-6">
        <div>
          <h2 className="text-3xl font-extrabold text-on-surface tracking-tight">Kampanyalar &amp; Teklifler</h2>
          <p className="text-sm text-on-surface-variant/80 mt-1 max-w-2xl">Tüm aktif influencer kampanyalarını ve bekleyen teklifleri gerçek zamanlı yönetin.</p>
        </div>
        
        <div className="flex bg-surface-container-high p-1 rounded-2xl border border-outline-variant/10 shadow-inner">
          <button
    onClick={() => setFilterStatus("Active")}
    className={`px-6 py-2 rounded-xl text-xs font-bold tracking-wide cursor-pointer transition-all ${filterStatus === "Active" ? "bg-white text-primary shadow-sm scale-100" : "text-on-surface-variant"}`}
  >
            Aktif
          </button>
          <button
    onClick={() => setFilterStatus("Completed")}
    className={`px-6 py-2 rounded-xl text-xs font-bold tracking-wide cursor-pointer transition-all ${filterStatus === "Completed" ? "bg-white text-primary shadow-sm scale-100" : "text-on-surface-variant"}`}
  >
            Tamamlanan
          </button>
        </div>
      </div>

      {
    /* Statistics Bento Row */
  }
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6">
        <div className="bg-white p-5 rounded-3xl border border-[#F1F1F1] shadow-[0px_10px_30px_rgba(176,38,255,0.04)] hover:scale-[1.02] transition-transform duration-200 flex flex-col justify-between h-36">
          <div className="flex justify-between items-start">
            <span className="text-xs text-on-surface-variant/70 font-bold uppercase tracking-wider">Toplam Aktif</span>
            <div className="p-2 bg-secondary-container rounded-full text-on-secondary-container">
              <Rocket className="w-4 h-4" />
            </div>
          </div>
          <div>
            <div className="text-2xl font-extrabold text-on-surface">24</div>
            <div className="text-[11px] text-primary flex items-center gap-1 font-bold mt-1">
              <RefreshCw className="w-3.5 h-3.5 animate-spin" /> Bu ay +12%
            </div>
          </div>
        </div>

        <div className="bg-white p-5 rounded-3xl border border-[#F1F1F1] shadow-[0px_10px_30px_rgba(176,38,255,0.04)] hover:scale-[1.02] transition-transform duration-200 flex flex-col justify-between h-36">
          <div className="flex justify-between items-start">
            <span className="text-xs text-on-surface-variant/70 font-bold uppercase tracking-wider">Bekleyen Teklifler</span>
            <div className="p-2 bg-[#ffd8e9] rounded-full text-[#755565]">
              <Hourglass className="w-4 h-4" />
            </div>
          </div>
          <div>
            <div className="text-2xl font-extrabold text-on-surface">148</div>
            <div className="text-[11px] text-tertiary-container text-[#cdcc4a] font-bold mt-1">İşlem gerekiyor</div>
          </div>
        </div>

        <div className="bg-white p-5 rounded-3xl border border-[#F1F1F1] shadow-[0px_10px_30px_rgba(176,38,255,0.04)] hover:scale-[1.02] transition-transform duration-200 flex flex-col justify-between h-36">
          <div className="flex justify-between items-start">
            <span className="text-xs text-on-surface-variant/70 font-bold uppercase tracking-wider">Toplam Bütçe</span>
            <div className="p-2 bg-primary-container/10 rounded-full text-primary">
              <Wallet className="w-4 h-4" />
            </div>
          </div>
          <div>
            <div className="text-2xl font-extrabold text-on-surface">₺4.2M</div>
            <div className="text-[11px] text-on-surface-variant/60 font-medium mt-1">3. çeyrek için ayrıldı</div>
          </div>
        </div>

        <div className="bg-white p-5 rounded-3xl border border-[#F1F1F1] shadow-[0px_10px_30px_rgba(176,38,255,0.04)] hover:scale-[1.02] transition-transform duration-200 flex flex-col justify-between h-36 relative overflow-hidden group">
          <div className="flex justify-between items-start">
            <span className="text-xs text-on-surface-variant/70 font-bold uppercase tracking-wider">Etkileşim Oranı</span>
            <div className="p-2 bg-on-background text-white rounded-full">
              <Zap className="w-4 h-4 text-[#e9e963]" />
            </div>
          </div>
          <div>
            <div className="text-2xl font-extrabold text-on-surface">6.8%</div>
            <div className="text-[11px] text-[#cdcc4a] font-bold mt-1">Ortalama platform performansı</div>
          </div>
        </div>
      </div>

      {
    /* Main Split Layout: Table left, Panel right */
  }
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        
        {
    /* Campaign Table container (8/12 width) */
  }
        <div className="lg:col-span-8 bg-white rounded-3xl border border-[#F1F1F1] shadow-[0px_10px_30px_rgba(176,38,255,0.04)] overflow-hidden">
          <div className="p-6 border-b border-outline-variant/30 flex justify-between items-center bg-surface-container-lowest">
            <h3 className="font-bold text-on-surface flex items-center gap-2 text-sm">
              <List className="w-5 h-5 text-primary" />
              Tüm Kampanyalar
            </h3>
            <button
    onClick={() => onShowToast("Kampanya verileri excel format\u0131nda d\u0131\u015Fa aktar\u0131l\u0131yor...")}
    className="text-xs font-bold text-primary flex items-center gap-1 hover:underline cursor-pointer"
  >
              Verileri Dışa Aktar <Download className="w-4 h-4" />
            </button>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-surface-container-low text-on-surface-variant text-[11px] font-bold uppercase tracking-widest">
                  <th className="px-6 py-4">Kampanya Adı</th>
                  <th className="px-6 py-4">Marka</th>
                  <th className="px-6 py-4">Bütçe Aralığı</th>
                  <th className="px-6 py-4">Durum</th>
                  <th className="px-6 py-4">İçerik Üreticiler</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#F1F1F1]">
                {filteredCampaigns.map((c) => {
    const Icon = getCampaignIcon(c.category);
    const isSelected = c.id === selectedCampaignId;
    return <tr
      key={c.id}
      onClick={() => handleCampaignRowClick(c.id)}
      className={`hover:bg-surface-container-low/50 cursor-pointer transition-colors ${isSelected ? "bg-secondary-container/30" : ""}`}
    >
                      <td className="px-6 py-5">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-2xl bg-secondary-container/50 flex items-center justify-center text-primary shrink-0 border border-outline-variant/10">
                            <Icon className="w-4.5 h-4.5" />
                          </div>
                          <div>
                            <div className="font-extrabold text-sm text-on-surface">{c.name}</div>
                            <div className="text-[11px] font-bold text-on-surface-variant/70 mt-0.5">{c.category}</div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-5 text-sm font-semibold text-on-surface-variant/80">
                        {c.brand}
                      </td>
                      <td className="px-6 py-5">
                        <span className="px-3 py-1 bg-surface-container rounded-full text-xs font-bold text-on-surface-variant">
                          {c.budgetRange}
                        </span>
                      </td>
                      <td className="px-6 py-5">
                        <span className="px-3 py-1 bg-secondary-container text-on-secondary-container rounded-3xl text-xs font-extrabold flex items-center gap-1.5 w-fit">
                          <span className={`w-1.5 h-1.5 rounded-full bg-secondary ${c.status === "Aktif" ? "animate-pulse" : ""}`} />
                          {c.status}
                        </span>
                      </td>
                      <td className="px-6 py-5">
                        <div className="flex -space-x-2">
                          {(c.creatorAvatars || []).map((av, index) => <img
      key={index}
      referrerPolicy="no-referrer"
      className="w-7 h-7 rounded-full border-2 border-white object-cover"
      src={av}
      alt="Creator"
    />)}
                          <div className="w-7 h-7 rounded-full border-2 border-white bg-surface-container-high flex items-center justify-center text-[9px] font-extrabold text-on-surface-variant">
                            +{c.creatorCount}
                          </div>
                        </div>
                      </td>
                    </tr>;
  })}
              </tbody>
            </table>
          </div>
        </div>

        {
    /* Selected Campaign Drawer / Info Pane (4/12 width) */
  }
        <div className="lg:col-span-4 space-y-6">
          <div className="bg-white rounded-3xl border border-[#F1F1F1] shadow-[0px_10px_30px_rgba(176,38,255,0.04)] p-6 space-y-6">
            <div>
              <span className="bg-[#b026ff]/10 text-primary px-3 py-1 rounded-full text-[10px] font-extrabold uppercase tracking-widest border border-[#b026ff]/10">
                Seçili Kampanya
              </span>
              <h4 className="text-xl font-extrabold text-on-surface mt-3 tracking-tight">
                {selectedCampaign?.name || "Kampanya seçilmedi"}
              </h4>
              <p className="text-on-surface-variant/80 text-sm font-medium mt-0.5">
                {selectedCampaign?.brand || "Listeden bir kampanya seçin"}
              </p>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="bg-surface-container-low p-4 rounded-2xl border border-outline-variant/10">
                <div className="text-[10px] text-on-surface-variant/70 font-extrabold uppercase tracking-widest">Süre</div>
                <div className="font-extrabold text-sm text-on-surface mt-1">1 Haz - 31 Ağu</div>
              </div>
              <div className="bg-surface-container-low p-4 rounded-2xl border border-outline-variant/10">
                <div className="text-[10px] text-on-surface-variant/70 font-extrabold uppercase tracking-widest">Hedef ROI</div>
                <div className="font-extrabold text-sm text-on-surface mt-1">3.5x</div>
              </div>
            </div>

            {
    /* Offer Bids Review Panel */
  }
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h5 className="font-extrabold text-xs text-on-surface-variant/90 uppercase tracking-widest">Son Teklifler</h5>
                <span className="text-[11px] font-bold text-primary hover:underline cursor-pointer">Tümünü Gör</span>
              </div>
              
              <div className="space-y-3">
                {!visibleOffers.length && <div className="p-4 rounded-2xl border border-dashed border-outline-variant/40 text-xs font-bold text-on-surface-variant">
                    Bu kampanyaya henüz teklif verilmedi.
                  </div>}
                {visibleOffers.map((off) => <div key={off.id} className="flex items-center justify-between p-3 border border-[#F1F1F1] rounded-2xl hover:bg-surface-container-low/50 transition-colors group">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full overflow-hidden border border-outline-variant/10 shadow-sm shrink-0">
                        <img referrerPolicy="no-referrer" className="w-full h-full object-cover" src={off.avatar} alt={off.name} />
                      </div>
                      <div>
                        <div className="font-extrabold text-sm text-on-surface leading-tight">{off.name}</div>
                        <div className="text-xs text-on-surface-variant/70 font-bold mt-1">₺{off.amount.toLocaleString("tr-TR")}</div>
                      </div>
                    </div>
                    
                    <div className="flex flex-col items-end gap-1.5">
                      <span
    className={`px-3 py-1 rounded-full text-[9px] font-extrabold uppercase tracking-wider ${off.status === "Accepted" ? "bg-secondary-container text-on-secondary-container" : off.status === "Pending" ? "bg-[#F9F871] text-black" : "bg-surface-container-highest text-on-surface-variant"}`}
  >
                        {off.status === "Accepted" ? "Onaylandı" : off.status === "Pending" ? "Bekliyor" : off.status === "Rejected" ? "Reddedildi" : "Görüşülüyor"}
                      </span>
                      {off.status === "Pending" && <div className="flex gap-1.5">
                          <button
    onClick={() => handleOfferAction(off.id, "reject")}
    className="text-[10px] font-bold text-error hover:underline cursor-pointer"
  >
                            Red
                          </button>
                          <span className="text-[10px] text-outline">|</span>
                          <button
    onClick={() => handleOfferAction(off.id, "accept")}
    className="text-[10px] font-bold text-primary hover:underline cursor-pointer"
  >
                            Onayla
                          </button>
                        </div>}
                    </div>
                  </div>)}
              </div>
            </div>

            <button
    onClick={() => onShowToast("Kat\u0131l\u0131mc\u0131 y\xF6netim paneli a\xE7\u0131l\u0131yor...")}
    className="w-full bg-primary text-white font-extrabold rounded-2xl py-4 hover:brightness-110 active:scale-[0.98] transition-all cursor-pointer flex items-center justify-center gap-2 text-sm shadow-md"
  >
              Katılımcıları Yönet
              <ExternalLink className="w-4 h-4" />
            </button>
          </div>

          {
    /* Campaign insights panel */
  }
          <div className="bg-on-background text-white rounded-3xl p-6 relative overflow-hidden shadow-xl border border-outline-variant/10 group">
            <div className="absolute top-0 right-0 w-32 h-32 bg-primary/20 rounded-full -translate-y-1/2 translate-x-1/2 blur-2xl group-hover:scale-150 transition-transform duration-700" />
            <div className="relative z-10 space-y-4">
              <h5 className="text-lg font-bold tracking-tight">Kampanya İçgörüleri</h5>
              <p className="text-xs text-surface-variant/80 leading-relaxed font-medium">
                Kampanya verileri, daha yuksek ROI icin wellness kategorisindeki mikro influencer butcesinin artirilmasini oneriyor.
              </p>
              <button
    onClick={() => onShowToast("Detayli kampanya analiz raporu hazirlaniyor...")}
    className="px-6 py-2.5 bg-primary-container text-on-primary-container rounded-full text-xs font-extrabold hover:scale-105 active:scale-95 transition-transform cursor-pointer"
  >
                Raporu Gör
              </button>
            </div>
          </div>
        </div>

      </div>
    </div>;
}
export {
  CampaignsTab as default
};



import { useState } from "react";
import { formatMoney, getCurrencyCode } from "../../../utils/currency";

function OffersScreen({ offers: externalOffers = [], profile, onShowToast, onOfferStatusChange }) {
  const [activeFilter, setActiveFilter] = useState("all");
  const shownOffers = externalOffers;
  const currency = getCurrencyCode(profile);

  const handleAcceptOffer = async (id, brandName) => {
    await onOfferStatusChange?.(id, "Accepted");
    onShowToast(`${brandName} teklifi basariyla kabul edildi.`, "success");
  };

  const handleRejectOffer = async (id, brandName) => {
    await onOfferStatusChange?.(id, "Rejected");
    onShowToast(`${brandName} teklifi reddedildi.`, "error");
  };

  const filteredOffers = shownOffers.filter((offer) => {
    if (activeFilter === "all") return true;
    return offer.status === activeFilter;
  });

  return <div className="relative min-h-screen pb-16">
      <div className="bg-blob bg-primary-fixed/20 w-[600px] h-[600px] -top-24 -right-24" />
      <div className="bg-blob bg-secondary-container/20 w-[600px] h-[600px] -bottom-24 -left-24" />

      <header className="flex justify-between items-center mb-10">
        <div id="offers-header-text">
          <h1 className="text-3xl font-extrabold tracking-tight text-on-surface">Gelen Teklifler</h1>
          <p className="text-on-surface-variant text-base mt-2">
            Bugun icin {shownOffers.filter((offer) => offer.status === "pending").length} yeni marka teklifiniz var.
          </p>
        </div>
        <div className="flex items-center space-x-4" id="offers-header-actions">
          <button
            type="button"
            onClick={() => onShowToast("Bekleyen bildiriminiz bulunmuyor.", "info")}
            className="w-12 h-12 flex items-center justify-center rounded-full bg-white border border-outline-variant/30 text-on-surface-variant hover:scale-105 transition-transform active:scale-95 shadow-sm"
          >
            <span className="material-symbols-outlined">notifications</span>
          </button>
          <div className="w-12 h-12 rounded-full border-2 border-primary p-0.5 shadow-md">
            <img
              className="w-full h-full rounded-full object-cover"
              alt="Profil resmi"
              src={profile?.profileImageUrl || "https://placehold.co/120x120?text=GI"}
              referrerPolicy="no-referrer"
            />
          </div>
        </div>
      </header>

      <section className="flex flex-wrap gap-3 mb-8" id="offers-filter-tabs">
        <FilterButton active={activeFilter === "all"} onClick={() => setActiveFilter("all")}>
          Tumu ({shownOffers.length})
        </FilterButton>
        <FilterButton active={activeFilter === "pending"} onClick={() => setActiveFilter("pending")}>
          Bekleyenler ({shownOffers.filter((offer) => offer.status === "pending").length})
        </FilterButton>
        <FilterButton active={activeFilter === "approved"} onClick={() => setActiveFilter("approved")}>
          Onaylananlar ({shownOffers.filter((offer) => offer.status === "approved").length})
        </FilterButton>
        <FilterButton active={activeFilter === "rejected"} onClick={() => setActiveFilter("rejected")}>
          Reddedilenler ({shownOffers.filter((offer) => offer.status === "rejected").length})
        </FilterButton>
      </section>

      {filteredOffers.length === 0 ? <div className="bg-white rounded-3xl p-12 text-center border border-[#F1F1F1] soft-glow">
          <span className="material-symbols-outlined text-primary text-5xl mb-4">local_offer</span>
          <h3 className="text-lg font-bold text-on-surface">Teklif bulunamadi</h3>
          <p className="text-sm text-on-surface-variant mt-2">Secili filtreye uygun teklif bulunmuyor.</p>
        </div> : <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6" id="offers-cards-grid">
          {filteredOffers.map((offer) => <article
            key={offer.id}
            className="bg-white rounded-3xl p-6 border border-outline-variant/20 soft-glow flex flex-col hover:scale-[1.01] transition-all duration-300 group"
          >
            <div className="flex justify-between items-start mb-6">
              <div className="flex items-center space-x-4">
                <div className="w-14 h-14 rounded-2xl overflow-hidden bg-surface-container-low border border-outline-variant/10">
                  <img
                    className="w-full h-full object-cover"
                    alt={offer.brandName}
                    src={offer.logoUrl}
                    referrerPolicy="no-referrer"
                  />
                </div>
                <div>
                  <h3 className="font-bold text-on-surface group-hover:text-primary transition-colors text-base truncate max-w-[120px]">{offer.brandName}</h3>
                  <p className="text-[10px] font-bold text-on-surface-variant uppercase tracking-wider">{offer.category}</p>
                </div>
              </div>
              <OfferStatusBadge status={offer.status} />
            </div>

            <div className="space-y-3 mb-6">
              <InfoRow icon="movie" label="Kampanya tipi" value={offer.type} />
              <div className="flex items-center justify-between p-3 bg-surface-container-low rounded-2xl border border-[#F1F1F1]">
                <span className="text-on-surface-variant text-[11px] font-bold uppercase tracking-wider flex items-center gap-2">
                  <span className="material-symbols-outlined text-base">payments</span>
                  Teklif tutari
                </span>
                <span className={`font-extrabold text-base ${offer.status === "rejected" ? "text-on-surface-variant/50 line-through" : "text-primary"}`}>
                  {formatMoney(offer.budget, currency)}
                </span>
              </div>
            </div>

            {offer.status === "pending" && <div className="mt-auto grid grid-cols-2 gap-3">
                <button
                  type="button"
                  onClick={() => handleAcceptOffer(offer.id, offer.brandName)}
                  className="py-3.5 rounded-2xl bg-primary text-white font-bold text-xs shadow-[0px_8px_16px_rgba(144,0,215,0.2)] hover:scale-[1.02] active:scale-95 transition-all"
                >
                  Kabul Et
                </button>
                <button
                  type="button"
                  onClick={() => handleRejectOffer(offer.id, offer.brandName)}
                  className="py-3.5 rounded-2xl border-2 border-outline-variant/30 text-on-surface-variant font-bold text-xs hover:border-primary/40 transition-all"
                >
                  Reddet
                </button>
              </div>}

            {offer.status === "approved" && <div className="mt-auto">
                <button
                  type="button"
                  onClick={() => onShowToast("Is birligi detaylar paneline yonlendiriliyorsunuz.", "info")}
                  className="w-full py-3.5 rounded-2xl border-2 border-primary text-primary font-bold text-xs flex items-center justify-center gap-2 hover:bg-primary hover:text-white transition-all"
                >
                  Detaylari Goruntule
                  <span className="material-symbols-outlined text-xs">arrow_forward</span>
                </button>
              </div>}

            {offer.status === "rejected" && <div className="mt-auto">
                <button
                  type="button"
                  disabled
                  className="w-full py-3.5 rounded-2xl bg-surface-container-high text-on-surface-variant/50 font-bold text-xs cursor-not-allowed"
                >
                  Teklif Gecersiz
                </button>
              </div>}
          </article>)}
        </div>}
    </div>;
}

function FilterButton({ active, onClick, children }) {
  return <button
      type="button"
      onClick={onClick}
      className={`px-6 py-2.5 rounded-full font-semibold text-sm transition-all ${active ? "bg-primary text-white shadow-md" : "bg-white border border-outline-variant/30 text-on-surface-variant hover:border-primary"}`}
    >
      {children}
    </button>;
}

function OfferStatusBadge({ status }) {
  if (status === "approved") {
    return <span className="px-3 py-1 rounded-full bg-green-100 text-green-700 font-bold text-[11px] flex items-center gap-1 border border-green-200">
        <span className="w-1.5 h-1.5 rounded-full bg-green-600" />
        Onaylandi
      </span>;
  }

  if (status === "rejected") {
    return <span className="px-3 py-1 rounded-full bg-error-container text-on-error-container font-bold text-[11px] flex items-center gap-1 border border-error/20">
        <span className="w-1.5 h-1.5 rounded-full bg-error" />
        Reddedildi
      </span>;
  }

  return <span className="px-3 py-1 rounded-full bg-[#F9F871]/20 text-[#626200] font-bold text-[11px] flex items-center gap-1 border border-[#F9F871]/50">
      <span className="w-1.5 h-1.5 rounded-full bg-tertiary animate-pulse" />
      Bekliyor
    </span>;
}

function InfoRow({ icon, label, value }) {
  return <div className="flex items-center justify-between p-3 bg-surface-container-low rounded-2xl border border-[#F1F1F1]">
      <span className="text-on-surface-variant text-[11px] font-bold uppercase tracking-wider flex items-center gap-2">
        <span className="material-symbols-outlined text-base">{icon}</span>
        {label}
      </span>
      <span className="font-bold text-on-surface text-xs">{value}</span>
    </div>;
}

export {
  OffersScreen as default,
};

/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */
import { useState } from "react";
import { CheckCircle, ChevronLeft, ChevronRight, DollarSign, Eye, MessageSquare, Plus, Send } from "lucide-react";

const ALL_FILTER = "Tumu";

function OffersView({ offers, onOpenNewOfferModal, onOpenChat }) {
  const [filter, setFilter] = useState(ALL_FILTER);
  const filteredOffers = offers.filter((offer) => {
    if (filter === ALL_FILTER) return true;
    return normalizeOfferStatus(offer.status) === filter;
  });

  return <div className="space-y-8 animate-in fade-in duration-500">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-2">
        <div>
          <h1 className="font-sans font-extrabold text-3xl md:text-4xl text-on-surface">Teklifler</h1>
          <p className="text-on-surface-variant font-semibold text-sm md:text-base mt-1">
            Gonderdiginiz influencer tekliflerini buradan takip edin.
          </p>
        </div>

        <div className="flex gap-2.5">
          <select
            value={filter}
            onChange={(event) => setFilter(event.target.value)}
            className="bg-white text-on-surface border border-[#F1F1F1] rounded-full px-4 py-2 text-xs font-bold shadow-sm outline-none cursor-pointer"
          >
            <option value={ALL_FILTER}>Filtrele: Tumu</option>
            <option value="Beklemede">Beklemede</option>
            <option value="Kabul Edildi">Kabul Edildi</option>
            <option value="Reddedildi">Reddedildi</option>
          </select>

          <button
            type="button"
            onClick={onOpenNewOfferModal}
            className="bg-primary text-white px-5 py-2.5 rounded-full font-bold text-xs flex items-center gap-1.5 hover:scale-[1.02] transition-transform shadow-md cursor-pointer"
          >
            <Plus size={16} />
            <span>Yeni Teklif</span>
          </button>
        </div>
      </div>

      <div className="bg-white rounded-3xl border border-[#F1F1F1] shadow-[0px_10px_30px_rgba(176,38,255,0.06)] overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full border-collapse">
            <thead>
              <tr className="bg-surface-container-low text-left">
                <th className="px-6 py-5 font-bold text-xs text-on-surface-variant uppercase tracking-wider border-b border-surface-container">Influencer</th>
                <th className="px-6 py-5 font-bold text-xs text-on-surface-variant uppercase tracking-wider border-b border-surface-container">Kampanya Adi</th>
                <th className="px-6 py-5 font-bold text-xs text-on-surface-variant uppercase tracking-wider border-b border-surface-container">Teklif Tutari</th>
                <th className="px-6 py-5 font-bold text-xs text-on-surface-variant uppercase tracking-wider border-b border-surface-container">Durum</th>
                <th className="px-6 py-5 font-bold text-xs text-on-surface-variant uppercase tracking-wider border-b border-surface-container text-right">Islemler</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-surface-container-low">
              {filteredOffers.length > 0 ? filteredOffers.map((offer) => {
                const status = normalizeOfferStatus(offer.status);

                return <tr key={offer.id} className="hover:bg-surface-container-lowest/50 transition-colors group">
                    <td className="px-6 py-5">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full overflow-hidden shrink-0 relative">
                          <img
                            src={offer.avatarUrl}
                            alt={offer.creatorName}
                            className="w-full h-full object-cover"
                            referrerPolicy="no-referrer"
                          />
                        </div>
                        <div>
                          <p className="font-extrabold text-xs text-on-surface">{offer.creatorName}</p>
                          <p className="text-[10px] text-on-surface-variant font-medium">@{offer.creatorUsername}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-5 text-on-surface font-semibold text-xs md:text-sm">{offer.campaignTitle}</td>
                    <td className="px-6 py-5 text-on-surface font-bold text-xs md:text-sm">{formatCurrency(offer.amount)}</td>
                    <td className="px-6 py-5">
                      <span className={`px-3 py-1 rounded-full text-[10px] font-bold border ${getStatusStyle(status)}`}>
                        {status}
                      </span>
                    </td>
                    <td className="px-6 py-5 text-right">
                      <div className="flex justify-end gap-1.5">
                        <button
                          type="button"
                          onClick={() => alert(`Teklif Ayrintisi:\nCreator: ${offer.creatorName}\nButce: ${formatCurrency(offer.amount)}\nKampanya: ${offer.campaignTitle}\nDurum: ${status}`)}
                          className="p-2 text-primary hover:bg-primary-fixed rounded-full transition-all cursor-pointer"
                          title="Detaylari Gor"
                        >
                          <Eye size={16} />
                        </button>
                        <button
                          type="button"
                          onClick={() => onOpenChat(offer.creatorId)}
                          className="p-2 text-primary hover:bg-primary-fixed rounded-full transition-all cursor-pointer"
                          title="Mesaj Gonder"
                        >
                          <MessageSquare size={16} />
                        </button>
                      </div>
                    </td>
                  </tr>;
              }) : <tr>
                  <td colSpan={5} className="px-6 py-12 text-center text-outline font-semibold">
                    Secilen filtreye uygun teklif bulunmamaktadir.
                  </td>
                </tr>}
            </tbody>
          </table>
        </div>

        <div className="px-6 py-4 bg-surface-container-low border-t border-surface-container flex items-center justify-between">
          <p className="text-[11px] text-on-surface-variant font-bold">
            {filteredOffers.length} teklif listelendi
          </p>
          <div className="flex gap-1.5">
            <button type="button" className="w-8 h-8 flex items-center justify-center rounded-full border border-surface-variant text-on-surface hover:bg-surface-container-high transition-colors cursor-pointer">
              <ChevronLeft size={16} />
            </button>
            <button type="button" className="w-8 h-8 flex items-center justify-center rounded-full bg-primary text-white font-bold text-xs">1</button>
            <button type="button" className="w-8 h-8 flex items-center justify-center rounded-full border border-transparent text-on-surface hover:bg-surface-container-high transition-colors font-bold text-xs cursor-pointer">2</button>
            <button type="button" className="w-8 h-8 flex items-center justify-center rounded-full border border-surface-variant text-on-surface hover:bg-surface-container-high transition-colors cursor-pointer">
              <ChevronRight size={16} />
            </button>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <SummaryCard icon={<Send size={20} />} title="Toplam Gonderilen" value={offers.length} tone="primary" />
        <SummaryCard icon={<CheckCircle size={20} />} title="Kabul Orani" value={calculateAcceptedRate(offers)} tone="secondary" />
        <SummaryCard icon={<DollarSign size={20} />} title="Aktif Butce" value={formatCurrency(sumActiveBudget(offers))} tone="yellow" />
      </div>
    </div>;
}

function SummaryCard({ icon, title, value, tone }) {
  const toneClass = tone === "secondary"
    ? "bg-secondary-container text-secondary"
    : tone === "yellow"
      ? "bg-[#e9e963]/30 text-yellow-800"
      : "bg-primary-fixed text-primary";

  return <div className="bg-white p-6 rounded-3xl border border-[#F1F1F1] shadow-[0px_10px_30px_rgba(176,38,255,0.06)] flex items-center gap-4 hover:translate-y-[-2px] transition-transform">
      <div className={`w-12 h-12 rounded-2xl flex items-center justify-center ${toneClass}`}>
        {icon}
      </div>
      <div>
        <p className="text-on-surface-variant text-[11px] font-bold uppercase tracking-wider">{title}</p>
        <p className="text-xl font-extrabold text-on-surface">{value}</p>
      </div>
    </div>;
}

function normalizeOfferStatus(status) {
  if (status === "Accepted" || status === "approved" || status === "Kabul Edildi") return "Kabul Edildi";
  if (status === "Rejected" || status === "rejected" || status === "Reddedildi") return "Reddedildi";
  return "Beklemede";
}

function getStatusStyle(status) {
  switch (status) {
    case "Kabul Edildi":
      return "bg-green-100 text-green-800 border-green-200";
    case "Reddedildi":
      return "bg-red-100 text-red-800 border-red-200";
    default:
      return "bg-yellow-100 text-yellow-800 border-yellow-200";
  }
}

function calculateAcceptedRate(offers) {
  if (!offers.length) return "0%";
  const accepted = offers.filter((offer) => normalizeOfferStatus(offer.status) === "Kabul Edildi").length;
  return `${Math.round((accepted / offers.length) * 100)}%`;
}

function sumActiveBudget(offers) {
  return offers
    .filter((offer) => normalizeOfferStatus(offer.status) !== "Reddedildi")
    .reduce((total, offer) => total + Number(offer.amount || 0), 0);
}

function formatCurrency(value) {
  return new Intl.NumberFormat("tr-TR", {
    style: "currency",
    currency: "TRY",
    maximumFractionDigits: 0,
  }).format(Number(value || 0));
}

export {
  OffersView as default,
};

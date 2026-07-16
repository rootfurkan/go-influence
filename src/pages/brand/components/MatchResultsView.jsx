/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */
import { useMemo, useState } from "react";
import { BadgeCheck, Sliders } from "lucide-react";

const ALL_LOCATIONS = "Tumu";

function MatchResultsView({
  creators,
  campaigns = [],
  selectedCampaignId = "",
  onCampaignChange,
  onSendOffer,
  onOpenProfile,
}) {
  const [followerFilter, setFollowerFilter] = useState(1e6);
  const [engagementFilter, setEngagementFilter] = useState(null);
  const [locationFilter, setLocationFilter] = useState(ALL_LOCATIONS);
  const selectedCampaign = campaigns.find((campaign) => campaign.id === selectedCampaignId) || campaigns[0];
  const locationOptions = useMemo(() => {
    const values = creators.map((creator) => creator.location).filter(Boolean);
    return [ALL_LOCATIONS, ...new Set(values)];
  }, [creators]);

  const filteredCreators = creators.filter((creator) => {
    if (creator.followersCount > followerFilter) return false;
    if (engagementFilter && creator.engagementRate < engagementFilter) return false;
    if (locationFilter !== ALL_LOCATIONS && creator.location !== locationFilter) return false;
    return true;
  });

  return <div className="space-y-8 animate-in fade-in duration-500">
      <header className="mb-6">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
          <div>
            <h1 className="font-sans font-extrabold text-3xl md:text-4xl text-on-surface mb-2">
              Eslesme Sonuclari
            </h1>
            <p className="text-on-surface-variant font-medium text-base md:text-lg">
              Secili kampanya icin ilgi alani ve hizmet kategorisine gore {filteredCreators.length} creator listeleniyor.
            </p>
          </div>

          <div className="flex flex-wrap gap-2 md:justify-end">
            {campaigns.length > 0 && <select
              value={selectedCampaignId || selectedCampaign?.id || ""}
              onChange={(event) => onCampaignChange?.(event.target.value)}
              className="bg-white border border-outline-variant rounded-2xl px-3.5 py-2 text-xs font-bold text-on-surface outline-none focus:border-primary"
            >
              {campaigns.map((campaign) => <option key={campaign.id} value={campaign.id}>
                {campaign.title || campaign.name}
              </option>)}
            </select>}
            <SummaryPill>{selectedCampaign?.category || selectedCampaign?.categories?.[0] || "Kategori"}</SummaryPill>
            <SummaryPill>
              {formatBudget(selectedCampaign?.budgetMin)} - {formatBudget(selectedCampaign?.budgetMax)}
            </SummaryPill>
            <SummaryPill>{selectedCampaign?.targetGender || "Hedef kitle"}</SummaryPill>
          </div>
        </div>
      </header>

      <div className="flex flex-col lg:flex-row gap-8">
        <aside className="w-full lg:w-72 shrink-0">
          <div className="bg-white p-6 rounded-3xl shadow-[0px_10px_30px_rgba(176,38,255,0.06)] border border-[#F1F1F1] sticky top-24 space-y-6">
            <div className="flex items-center justify-between">
              <h3 className="font-bold text-base text-on-surface">Filtrele</h3>
              <Sliders size={18} className="text-primary" />
            </div>

            <div className="space-y-5">
              <div>
                <label className="font-bold text-xs text-on-surface uppercase tracking-wider block mb-2">
                  Maks takipci sayisi
                </label>
                <input
                  type="range"
                  min={1e5}
                  max={1e6}
                  step={5e4}
                  value={followerFilter}
                  onChange={(event) => setFollowerFilter(Number(event.target.value))}
                  className="w-full h-2 bg-surface-container rounded-lg appearance-none cursor-pointer accent-primary"
                />
                <div className="flex justify-between text-[11px] font-bold text-outline mt-1.5">
                  <span>100K</span>
                  <span className="text-primary">{(followerFilter / 1e3).toFixed(0)}K</span>
                  <span>1M+</span>
                </div>
              </div>

              <div>
                <label className="font-bold text-xs text-on-surface uppercase tracking-wider block mb-2">
                  Etkilesim orani
                </label>
                <div className="grid grid-cols-2 gap-2">
                  {[4, 6].map((value) => <button
                    key={value}
                    type="button"
                    onClick={() => setEngagementFilter(engagementFilter === value ? null : value)}
                    className={`px-3 py-2 rounded-xl border text-xs font-bold cursor-pointer transition-colors ${engagementFilter === value ? "bg-primary text-white border-primary" : "bg-surface-container-low border-outline-variant text-on-surface-variant hover:border-primary"}`}
                  >
                    %{value}+
                  </button>)}
                </div>
              </div>

              <div>
                <label className="font-bold text-xs text-on-surface uppercase tracking-wider block mb-2">
                  Lokasyon
                </label>
                <select
                  value={locationFilter}
                  onChange={(event) => setLocationFilter(event.target.value)}
                  className="w-full bg-[#F8F9FA] border border-outline-variant focus:border-primary rounded-2xl py-2.5 px-3 text-xs font-bold outline-none"
                >
                  {locationOptions.map((location) => <option key={location} value={location}>
                    {location}
                  </option>)}
                </select>
              </div>
            </div>
          </div>
        </aside>

        <div className="flex-grow">
          {filteredCreators.length === 0 ? <EmptyMatches /> : <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {filteredCreators.map((creator) => <CreatorMatchCard
                key={creator.matchId || creator.id}
                creator={creator}
                onOpenProfile={onOpenProfile}
                onSendOffer={onSendOffer}
              />)}
            </div>}
        </div>
      </div>
    </div>;
}

function CreatorMatchCard({ creator, onOpenProfile, onSendOffer }) {
  return <div className="bg-white rounded-3xl p-6 shadow-[0px_10px_30px_rgba(176,38,255,0.06)] border border-[#F1F1F1] hover:scale-[1.01] transition-all duration-300 flex flex-col justify-between">
      <div>
        <div className="flex justify-between items-start mb-4">
          <div className="flex gap-3">
            <div className="relative">
              <img
                src={creator.avatarUrl}
                alt={creator.name}
                className="w-14 h-14 rounded-2xl object-cover ring-2 ring-primary/10"
                referrerPolicy="no-referrer"
              />
              {creator.isVerified && <div className="absolute -bottom-1 -right-1 bg-[#F9F871] w-5 h-5 rounded-full flex items-center justify-center border-2 border-white">
                  <BadgeCheck size={12} className="text-black fill-current" />
                </div>}
            </div>

            <div>
              <h4 className="font-bold text-base text-on-surface line-clamp-1">{creator.name}</h4>
              <p className="text-[10px] font-bold text-on-surface-variant mt-0.5">@{creator.username}</p>
              <div className="flex gap-1 mt-1.5 flex-wrap">
                {creator.categoryTags.slice(0, 3).map((tag) => <span
                  key={tag}
                  className="bg-secondary-container/50 px-2 py-0.5 rounded-lg text-[9px] font-extrabold text-on-secondary-container uppercase tracking-wider"
                >
                  {tag}
                </span>)}
              </div>
            </div>
          </div>

          <div className="flex flex-col items-center">
            <div
              className="relative w-12 h-12 rounded-full match-score-gradient flex items-center justify-center shadow-inner"
              style={{ "--percentage": creator.matchScore }}
            >
              <div className="absolute inset-1 bg-white rounded-full flex items-center justify-center">
                <span className="text-primary font-black text-xs">%{creator.matchScore}</span>
              </div>
            </div>
            <span className="text-[9px] text-primary font-bold mt-1 tracking-wider uppercase">Uyum</span>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4 mb-4 py-3 border-y border-[#F1F1F1]">
          <div>
            <p className="text-on-surface-variant text-[11px] font-bold uppercase tracking-wider">Takipci</p>
            <p className="font-bold text-base mt-0.5">{creator.followers}</p>
          </div>
          <div>
            <p className="text-on-surface-variant text-[11px] font-bold uppercase tracking-wider">Etkilesim</p>
            <p className="font-bold text-base text-primary mt-0.5">%{creator.engagementRate}</p>
          </div>
        </div>

        <p className="text-on-surface-variant italic font-medium text-xs mb-6 leading-relaxed">
          "{creator.description}"
        </p>
      </div>

      <div className="flex gap-3 pt-2">
        <button
          type="button"
          onClick={() => onOpenProfile(creator)}
          className="flex-1 bg-[#F8F9FA] border border-outline-variant hover:border-primary text-on-surface font-bold text-xs py-3 rounded-2xl transition-all cursor-pointer text-center"
        >
          Profili Incele
        </button>
        <button
          type="button"
          onClick={() => onSendOffer(creator)}
          className="flex-1 bg-primary text-white font-bold text-xs py-3 rounded-2xl shadow-[0_0_10px_rgba(176,38,255,0.2)] hover:scale-[1.02] active:scale-95 transition-all cursor-pointer text-center"
        >
          Teklif Gonder
        </button>
      </div>
    </div>;
}

function EmptyMatches() {
  return <div className="bg-white rounded-3xl border border-dashed border-outline-variant p-10 text-center">
      <div className="mx-auto mb-4 w-12 h-12 rounded-full bg-primary/10 text-primary flex items-center justify-center">
        <span className="material-symbols-outlined">category</span>
      </div>
      <h3 className="font-sans font-extrabold text-xl text-on-surface">Henuz eslesme yok</h3>
      <p className="text-on-surface-variant text-sm font-medium mt-2 max-w-md mx-auto">
        Kampanyanin kategorileriyle uyumlu onayli creator bulundugunda burada listelenecek.
      </p>
    </div>;
}

function SummaryPill({ children }) {
  return <div className="bg-secondary-container px-3.5 py-1.5 rounded-full flex items-center gap-1.5 text-xs font-bold text-on-secondary-container">
      <span>{children}</span>
    </div>;
}

function formatBudget(value) {
  return `TL ${Number(value || 0).toLocaleString("tr-TR")}`;
}

export {
  MatchResultsView as default,
};

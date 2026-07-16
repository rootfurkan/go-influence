import { useMemo, useState } from "react";
import { formatMoneyRange, getCurrencyCode } from "../../../utils/currency";

const ALL_FILTER = "Tumu";
const BUDGET_FILTERS = ["5k - 20k TL", "20k - 50k TL", "50k+ TL"];

function NeedsScreen({ needs: externalNeeds = [], profile, onShowToast, onApplyToCampaign }) {
  const [draftFilters, setDraftFilters] = useState({
    category: ALL_FILTER,
    budgetRange: ALL_FILTER,
    campaignType: ALL_FILTER,
  });
  const [appliedFilters, setAppliedFilters] = useState(draftFilters);
  const [activeDetailsNeed, setActiveDetailsNeed] = useState(null);
  const [applyingIds, setApplyingIds] = useState([]);
  const shownNeeds = externalNeeds;
  const currency = getCurrencyCode(profile);
  const minimumMatchScore = Number(profile?.settings?.minimumMatchScore ?? 0);
  const categoryOptions = useMemo(() => buildUniqueOptions(shownNeeds.flatMap((need) => getNeedCategories(need))), [shownNeeds]);
  const campaignTypeOptions = useMemo(() => buildUniqueOptions(shownNeeds.flatMap((need) => getNeedContentTypes(need))), [shownNeeds]);

  const handleFilterChange = (key, value) => {
    setDraftFilters((current) => ({ ...current, [key]: value }));
  };

  const handleApplyFilters = () => {
    setAppliedFilters(draftFilters);
    onShowToast("Filtreler basariyla uygulandi.", "info");
  };

  const handleResetFilters = () => {
    const resetFilters = {
      category: ALL_FILTER,
      budgetRange: ALL_FILTER,
      campaignType: ALL_FILTER,
    };
    setDraftFilters(resetFilters);
    setAppliedFilters(resetFilters);
  };

  const handleInterest = async (need) => {
    if (applyingIds.includes(need.id)) return;

    setApplyingIds((current) => [...current, need.id]);
    try {
      await onApplyToCampaign?.(need);
      onShowToast(`"${need.title}" kampanyasi icin basvurunuz basariyla markaya iletildi.`, "success");
    } catch (error) {
      console.error("Campaign application could not be sent.", error);
      onShowToast("Basvuru gonderilemedi. Lutfen tekrar deneyin.", "error");
    } finally {
      setApplyingIds((current) => current.filter((id) => id !== need.id));
    }
  };

  const filteredNeeds = shownNeeds.filter((need) => {
    if (minimumMatchScore && Number(need.matchScore || 0) < minimumMatchScore) {
      return false;
    }
    if (appliedFilters.category !== ALL_FILTER && !getNeedCategories(need).includes(appliedFilters.category)) {
      return false;
    }
    if (appliedFilters.campaignType !== ALL_FILTER && !getNeedContentTypes(need).includes(appliedFilters.campaignType)) {
      return false;
    }
    if (appliedFilters.budgetRange !== ALL_FILTER) {
      const avgBudget = (Number(need.budgetMin || 0) + Number(need.budgetMax || 0)) / 2;
      if (appliedFilters.budgetRange === "5k - 20k TL" && (avgBudget < 5e3 || avgBudget > 2e4)) return false;
      if (appliedFilters.budgetRange === "20k - 50k TL" && (avgBudget < 2e4 || avgBudget > 5e4)) return false;
      if (appliedFilters.budgetRange === "50k+ TL" && avgBudget < 5e4) return false;
    }
    return true;
  });

  return <div className="relative min-h-screen pb-16">
      <div className="bg-blob bg-tertiary-fixed w-[400px] h-[400px] top-1/3 -left-20" />
      <div className="bg-blob bg-primary-fixed-dim w-[300px] h-[300px] bottom-12 right-1/4 opacity-30" />

      <div className="mb-8 flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <h1 className="text-3xl font-extrabold tracking-tight text-on-surface mb-2">Marka Ihtiyaclari</h1>
          <p className="text-lg font-medium text-on-surface-variant">Profilinizdeki ilgi alanlari ve hizmetlere gore uygun kampanyalari kesfedin.</p>
        </div>
        <div className="flex items-center space-x-2 bg-tertiary-fixed text-on-tertiary-fixed px-4 py-2 rounded-full self-start md:self-auto shadow-sm">
          <span className="material-symbols-outlined text-[20px]">category</span>
          <span className="text-xs font-bold uppercase tracking-wider">Kategori Eslesmesi</span>
        </div>
      </div>

      <div className="bg-white p-6 rounded-3xl shadow-[0px_10px_30px_rgba(176,38,255,0.06)] border border-[#F1F1F1] mb-8 grid grid-cols-1 md:grid-cols-4 gap-6 items-end" id="campaigns-filter-bar">
        <FilterSelect
          label="Kategori"
          value={draftFilters.category}
          options={[ALL_FILTER, ...categoryOptions]}
          onChange={(value) => handleFilterChange("category", value)}
        />
        <FilterSelect
          label="Butce Araligi"
          value={draftFilters.budgetRange}
          options={[ALL_FILTER, ...BUDGET_FILTERS]}
          onChange={(value) => handleFilterChange("budgetRange", value)}
        />
        <FilterSelect
          label="Icerik Istegi"
          value={draftFilters.campaignType}
          options={[ALL_FILTER, ...campaignTypeOptions]}
          onChange={(value) => handleFilterChange("campaignType", value)}
        />
        <div>
          <button
            type="button"
            onClick={handleApplyFilters}
            className="w-full bg-primary text-on-primary py-3.5 rounded-2xl font-bold text-sm hover:bg-primary-container transition-colors active:scale-95 shadow-sm"
          >
            Filtreleri Uygula
          </button>
        </div>
      </div>

      {filteredNeeds.length === 0 ? <div className="bg-white rounded-3xl p-12 text-center border border-[#F1F1F1] soft-glow" id="no-campaigns-found">
          <span className="material-symbols-outlined text-primary text-5xl mb-4">search_off</span>
          <h3 className="text-lg font-bold text-on-surface">Eslesen Kampanya Bulunamadi</h3>
          <p className="text-sm text-on-surface-variant mt-2 max-w-md mx-auto">Filtrelerinizi esneterek daha fazla marka ve is birligi firsatini goruntuleyebilirsiniz.</p>
          <button
            type="button"
            onClick={handleResetFilters}
            className="mt-6 px-6 py-2.5 bg-primary text-white rounded-full text-xs font-bold shadow-md hover:brightness-110 active:scale-95 transition-all"
          >
            Filtreleri Sifirla
          </button>
        </div> : <div className="grid grid-cols-1 lg:grid-cols-2 gap-6" id="campaigns-grid">
          {filteredNeeds.map((need) => {
            const contentTypes = getNeedContentTypes(need);
            const isApplying = applyingIds.includes(need.id);

            return <article
              key={need.id}
              className="bg-white border border-outline-variant/20 rounded-3xl overflow-hidden hover:scale-[1.01] transition-transform duration-300 shadow-[0px_10px_30px_rgba(176,38,255,0.06)] group flex flex-col justify-between"
            >
              <div className="relative h-44 bg-surface-container-low">
                {need.bannerUrl ? <img
                  className="w-full h-full object-cover"
                  alt={`${need.title} kampanya banneri`}
                  src={need.bannerUrl}
                  referrerPolicy="no-referrer"
                /> : <div className="w-full h-full bg-gradient-to-br from-primary/10 via-secondary-container/70 to-tertiary-fixed/70 flex items-center justify-center">
                    <span className="text-primary font-extrabold text-xs uppercase tracking-widest">Go Influence</span>
                  </div>}
                <div className="absolute inset-0 bg-gradient-to-t from-black/65 via-black/10 to-transparent" />
                <div className="absolute left-5 right-5 bottom-4 flex items-end justify-between gap-4">
                  <div className="min-w-0">
                    <p className="text-white/80 text-[10px] font-extrabold uppercase tracking-wider truncate">{need.brandName}</p>
                    <h3 className="text-white font-extrabold text-lg truncate">{need.title}</h3>
                  </div>
                  <div className="bg-primary-container text-on-primary-container px-3 py-1.5 rounded-full flex items-center space-x-1 neon-glow shrink-0">
                    <span className="material-symbols-outlined text-[18px]">bolt</span>
                    <span className="text-xs font-bold">%{need.matchScore} Uyum</span>
                  </div>
                </div>
              </div>

              <div className="p-6 flex flex-col flex-1">
                <div className="flex flex-wrap gap-2 mb-4">
                  {getNeedCategories(need).map((category) => <span key={category} className="bg-tertiary-fixed text-on-tertiary-fixed text-[10px] font-extrabold px-2.5 py-0.5 rounded-full uppercase tracking-wider">{category}</span>)}
                </div>
                <p className="text-xs leading-relaxed text-on-surface-variant mb-4 line-clamp-2">
                  {need.description}
                </p>
                <div className="flex flex-wrap gap-2 mb-5">
                  {contentTypes.map((contentType) => <ContentTypeChip key={contentType} value={contentType} />)}
                </div>
                <div className="bg-primary-fixed/20 p-3.5 rounded-2xl mb-6">
                  <p className="text-[11px] text-on-primary-fixed-variant leading-relaxed">
                    <span className="font-bold">Eslesme Notu:</span> {need.matchNote}
                  </p>
                </div>

                <div className="mt-auto">
                  <div className="grid grid-cols-2 gap-3 py-4 border-t border-dashed border-outline-variant/30 mb-4">
                    <InfoMini label="Tahmini Butce" value={formatMoneyRange(need.budgetMin, need.budgetMax, currency)} strong />
                    <InfoMini label="Sure" value={need.duration} alignRight />
                    <InfoMini label="Hedef Kitle" value={`${need.targetAgeMin}-${need.targetAgeMax} / ${need.targetGender}`} />
                    <InfoMini label="Lokasyon" value={need.location || "Belirtilmedi"} alignRight />
                  </div>
                  <div className="flex gap-3">
                    <button
                      type="button"
                      onClick={() => setActiveDetailsNeed(need)}
                      className="flex-1 py-3 px-4 border-2 border-primary text-primary font-bold text-xs rounded-2xl hover:bg-primary-fixed/20 transition-all active:scale-95"
                    >
                      Detaylari Incele
                    </button>
                    <button
                      type="button"
                      onClick={() => handleInterest(need)}
                      disabled={isApplying}
                      className="flex-1 py-3 px-4 bg-primary text-white font-bold text-xs rounded-2xl neon-glow hover:scale-[1.02] active:scale-95 transition-all disabled:opacity-60 disabled:hover:scale-100"
                    >
                      {isApplying ? "Gonderiliyor..." : "Hemen Basvur"}
                    </button>
                  </div>
                </div>
              </div>
            </article>;
          })}
        </div>}

      <div className="lg:col-span-2 bg-secondary-container/30 rounded-3xl p-8 flex flex-col md:flex-row items-center gap-8 border-2 border-secondary-container/50 mt-8">
        <div className="flex-1">
          <h2 className="text-2xl font-extrabold text-on-secondary-fixed-variant mb-4 font-sans">Kampanya Secerken Dikkat Edilmesi Gerekenler</h2>
          <p className="text-xs leading-relaxed text-on-secondary-fixed-variant/80 mb-6">
            Eslesme oranlari, markanin ihtiyac kategorileri ile sizin ilgi alanlarinizin ve sundugunuz icerik hizmetlerinin ne kadar uyustugunu gosterir.
          </p>
          <div className="flex flex-wrap gap-3">
            <div className="bg-white/80 px-4 py-2.5 rounded-2xl flex items-center space-x-2 shadow-sm border border-[#F1F1F1]">
              <span className="material-symbols-outlined text-primary text-[18px]">verified</span>
              <span className="text-xs font-bold text-on-surface">Onayli Markalar</span>
            </div>
            <div className="bg-white/80 px-4 py-2.5 rounded-2xl flex items-center space-x-2 shadow-sm border border-[#F1F1F1]">
              <span className="material-symbols-outlined text-primary text-[18px]">category</span>
              <span className="text-xs font-bold text-on-surface">Kategori Bazli Eslesme</span>
            </div>
          </div>
        </div>
        <div className="w-full md:w-1/3 aspect-video md:aspect-square bg-white rounded-2xl shadow-xl overflow-hidden relative shrink-0">
          <img
            className="w-full h-full object-cover"
            alt="Kampanya secimi"
            src="https://lh3.googleusercontent.com/aida-public/AB6AXuDwEupG6ptfVPruNRC8lGHqLDFasvG7GcQER1ETlSM25B6Tp7o_0xATZzUuvMoROgZKqunA0FvXSbzi6RynAS79eEivW785WQGAbfiQEZay0ms8Kr2UyPBZjQfm_QyoFZ3I95Oj4sNFv74FCDCZkkLp-AW_Zvrxl42awvJbAk8hldIGRf2RcmrUTy3DIzU-S1s1x6-f9srvKRMd4SHB9kEBtm4Lfln5oCGL45TT-z18VEuYO6rsAkxc"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-primary/20 to-transparent" />
        </div>
      </div>

      {activeDetailsNeed && <CampaignDetailsModal
        need={activeDetailsNeed}
        currency={currency}
        isApplying={applyingIds.includes(activeDetailsNeed.id)}
        onClose={() => setActiveDetailsNeed(null)}
        onApply={() => {
          handleInterest(activeDetailsNeed);
          setActiveDetailsNeed(null);
        }}
      />}
    </div>;
}

function CampaignDetailsModal({ need, currency, isApplying, onClose, onApply }) {
  const contentTypes = getNeedContentTypes(need);

  return <div className="fixed inset-0 bg-on-surface/40 backdrop-blur-sm z-[100] flex items-center justify-center p-4">
      <div className="bg-white rounded-3xl max-w-3xl w-full max-h-[90vh] overflow-y-auto shadow-2xl border border-[#F1F1F1]">
        <div className="relative h-56 bg-surface-container-low">
          {need.bannerUrl ? <img
            src={need.bannerUrl}
            alt={`${need.title} kampanya banneri`}
            className="w-full h-full object-cover"
            referrerPolicy="no-referrer"
          /> : <div className="w-full h-full bg-gradient-to-br from-primary/10 via-secondary-container/70 to-tertiary-fixed/70" />}
          <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-black/20 to-transparent" />
          <button
            type="button"
            onClick={onClose}
            className="absolute top-4 right-4 w-10 h-10 rounded-full bg-white/90 text-on-surface-variant hover:text-primary transition-colors flex items-center justify-center"
          >
            <span className="material-symbols-outlined text-xl">close</span>
          </button>
          <div className="absolute left-6 right-6 bottom-5">
            <p className="text-white/75 text-[10px] font-extrabold uppercase tracking-wider">{need.brandName}</p>
            <h3 className="text-2xl font-extrabold text-white mt-1">{need.title}</h3>
          </div>
        </div>

        <div className="p-8 space-y-6">
          <div className="flex flex-wrap gap-2">
            {getNeedCategories(need).map((category) => <span key={category} className="bg-tertiary-fixed text-on-tertiary-fixed text-[10px] font-extrabold px-2.5 py-0.5 rounded-full uppercase tracking-wider">{category}</span>)}
          </div>

          <p className="text-sm text-on-surface-variant leading-relaxed">{need.description}</p>

          <section>
            <h4 className="text-xs font-extrabold text-primary uppercase tracking-wider mb-3">Markanin Istedigi Icerikler</h4>
            <div className="flex flex-wrap gap-2">
              {contentTypes.map((contentType) => <ContentTypeChip key={contentType} value={contentType} />)}
            </div>
          </section>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <DetailBox label="Kampanya Butcesi" value={formatMoneyRange(need.budgetMin, need.budgetMax, currency)} />
            <DetailBox label="Kampanya Suresi" value={need.duration} />
            <DetailBox label="Hedef Yas" value={`${need.targetAgeMin}-${need.targetAgeMax}`} />
            <DetailBox label="Hedef Cinsiyet" value={need.targetGender} />
            <DetailBox label="Lokasyon" value={need.location || "Belirtilmedi"} />
            <DetailBox label="Durum" value={need.statusLabel || "Aktif"} />
          </div>

          <div className="bg-primary-fixed/20 p-4 rounded-2xl space-y-2">
            <h5 className="text-xs font-bold text-on-primary-fixed-variant flex items-center gap-1">
              <span className="material-symbols-outlined text-[16px]">category</span>
              Eslesme Raporu
            </h5>
            <p className="text-[11px] text-on-primary-fixed-variant leading-relaxed">{need.matchNote}</p>
          </div>

          <div className="flex gap-3 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 py-3.5 border-2 border-outline-variant/30 text-on-surface-variant font-bold text-xs rounded-2xl hover:bg-surface-container-low transition-colors"
            >
              Kapat
            </button>
            <button
              type="button"
              onClick={onApply}
              disabled={isApplying}
              className="flex-1 py-3.5 bg-primary text-white font-bold text-xs rounded-2xl hover:scale-[1.02] transition-transform shadow-md hover:bg-primary-container disabled:opacity-60 disabled:hover:scale-100"
            >
              {isApplying ? "Gonderiliyor..." : "Hemen Basvur"}
            </button>
          </div>
        </div>
      </div>
    </div>;
}

function FilterSelect({ label, value, options, onChange }) {
  return <div className="space-y-1.5">
      <label className="text-xs font-bold text-on-surface-variant px-1 block">{label}</label>
      <select
        value={value}
        onChange={(event) => onChange(event.target.value)}
        className="w-full bg-surface-container-low border-none rounded-2xl focus:ring-2 focus:ring-primary text-sm p-3.5 font-bold text-on-surface"
      >
        {options.map((option) => <option key={option} value={option}>{option}</option>)}
      </select>
    </div>;
}

function ContentTypeChip({ value }) {
  return <span className="inline-flex items-center gap-1 px-3 py-1.5 rounded-full bg-primary/10 text-primary text-[10px] font-extrabold uppercase tracking-wider">
      <span className="material-symbols-outlined text-[14px]">{getContentTypeIcon(value)}</span>
      {value}
    </span>;
}

function InfoMini({ label, value, alignRight = false, strong = false }) {
  return <div className={`flex flex-col ${alignRight ? "text-right" : ""}`}>
      <span className="text-[10px] font-bold text-on-surface-variant uppercase tracking-wider">{label}</span>
      <span className={`text-xs font-bold ${strong ? "text-primary" : "text-on-surface"}`}>{value}</span>
    </div>;
}

function DetailBox({ label, value }) {
  return <div className="p-4 bg-surface-container-low rounded-2xl border border-[#F1F1F1]">
      <div className="text-[10px] font-bold text-on-surface-variant uppercase tracking-wider">{label}</div>
      <div className="text-sm font-extrabold text-on-surface mt-1">{value}</div>
    </div>;
}

function buildUniqueOptions(values) {
  return [...new Set(values.filter(Boolean).map((value) => String(value).trim()).filter(Boolean))];
}

function getNeedCategories(need) {
  return need.categories?.length ? need.categories : [need.category || "Genel"];
}

function getNeedContentTypes(need) {
  const values = need.contentTypes?.length ? need.contentTypes : [need.type || "Icerik"];
  return values.filter(Boolean);
}

function getContentTypeIcon(value) {
  const normalized = String(value || "").toLocaleLowerCase("tr-TR");
  if (normalized.includes("story") || normalized.includes("hikaye")) return "auto_stories";
  if (normalized.includes("reels") || normalized.includes("video")) return "movie";
  if (normalized.includes("post")) return "photo_camera";
  return "campaign";
}

export {
  NeedsScreen as default
};

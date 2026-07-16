import { useEffect, useMemo, useState } from "react";
import { Image, Percent, Save, Search, SlidersHorizontal, UserCog } from "lucide-react";

function SettingsTab({
  platformSettings,
  approvedInfluencers,
  onSavePlatformSettings,
  onSaveInfluencerCommission,
  onShowToast,
}) {
  const [brandName, setBrandName] = useState(platformSettings.brandName || "Go Influence");
  const [logoUrl, setLogoUrl] = useState(platformSettings.logoUrl || "");
  const [globalCommissionRate, setGlobalCommissionRate] = useState(platformSettings.globalCommissionRate || 10);
  const [selectedInfluencerId, setSelectedInfluencerId] = useState("");
  const [influencerRate, setInfluencerRate] = useState(10);
  const [searchQuery, setSearchQuery] = useState("");
  const [isSavingPlatform, setIsSavingPlatform] = useState(false);
  const [isSavingInfluencer, setIsSavingInfluencer] = useState(false);

  useEffect(() => {
    setBrandName(platformSettings.brandName || "Go Influence");
    setLogoUrl(platformSettings.logoUrl || "");
    setGlobalCommissionRate(platformSettings.globalCommissionRate || 10);
  }, [platformSettings]);

  useEffect(() => {
    const selectedCommission = platformSettings.influencerCommissions?.[selectedInfluencerId];
    if (selectedCommission?.rate !== undefined) {
      setInfluencerRate(Number(selectedCommission.rate));
    } else {
      setInfluencerRate(Number(platformSettings.globalCommissionRate || 10));
    }
  }, [platformSettings, selectedInfluencerId]);

  const filteredInfluencers = useMemo(() => {
    const normalizedQuery = searchQuery.toLowerCase();
    return approvedInfluencers.filter((influencer) => {
      const name = influencer.displayName || influencer.email || influencer.id;
      return name.toLowerCase().includes(normalizedQuery);
    });
  }, [approvedInfluencers, searchQuery]);

  const selectedInfluencer = approvedInfluencers.find((item) => item.id === selectedInfluencerId);

  const handleSavePlatform = async () => {
    setIsSavingPlatform(true);
    try {
      await onSavePlatformSettings({
        brandName: brandName.trim() || "Go Influence",
        logoUrl: logoUrl.trim(),
        globalCommissionRate: Number(globalCommissionRate),
      });
      onShowToast("Ayarlar kaydedildi. Logo ve komisyon oranı güncellendi.");
    } catch (error) {
      onShowToast(error.message || "Ayarlar kaydedilemedi. Firestore izinlerini kontrol edin.");
    } finally {
      setIsSavingPlatform(false);
    }
  };

  const handleSaveInfluencer = async () => {
    if (!selectedInfluencer) {
      onShowToast("Komisyon tanımlamak için bir influencer seçin.");
      return;
    }

    setIsSavingInfluencer(true);
    try {
      await onSaveInfluencerCommission(selectedInfluencer.id, {
        rate: Number(influencerRate),
        displayName: selectedInfluencer.displayName || selectedInfluencer.email || selectedInfluencer.id,
        email: selectedInfluencer.email || "",
      });
      onShowToast(`${selectedInfluencer.displayName || selectedInfluencer.email || "Influencer"} için komisyon kaydedildi.`);
    } catch (error) {
      onShowToast(error.message || "Influencer komisyonu kaydedilemedi. Firestore izinlerini kontrol edin.");
    } finally {
      setIsSavingInfluencer(false);
    }
  };

  return <div className="space-y-8 animate-fade-in select-none">
      <div>
        <h2 className="text-3xl font-extrabold text-on-background tracking-tight">Ayarlar</h2>
        <p className="text-sm text-on-surface-variant/80 mt-1">
          Site logosu, genel komisyon ve influencer bazlı komisyon oranlarını yönetin.
        </p>
      </div>

      <section className="grid grid-cols-1 xl:grid-cols-3 gap-8">
        <div className="xl:col-span-2 bg-white rounded-3xl border border-[#F1F1F1] shadow-[0px_10px_30px_rgba(176,38,255,0.04)] p-8 space-y-6">
          <div className="flex items-center gap-3">
            <span className="w-11 h-11 rounded-2xl bg-primary/10 text-primary flex items-center justify-center">
              <Image className="w-5 h-5" />
            </span>
            <div>
              <h3 className="text-xl font-extrabold text-on-surface">Marka ve Logo</h3>
              <p className="text-xs text-on-surface-variant/70 font-medium">Bu logo web sitesi ve panellerde kullanılır.</p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-[1fr_160px] gap-6 items-start">
            <div className="space-y-5">
              <label className="block space-y-2">
                <span className="text-xs font-bold text-on-surface-variant uppercase tracking-wider">Marka Adı</span>
                <input
                  value={brandName}
                  onChange={(event) => setBrandName(event.target.value)}
                  className="w-full bg-surface-container-low border border-outline-variant/40 rounded-2xl px-4 py-3 text-sm font-bold focus:outline-none focus:ring-2 focus:ring-primary/20"
                />
              </label>
              <label className="block space-y-2">
                <span className="text-xs font-bold text-on-surface-variant uppercase tracking-wider">Logo URL</span>
                <input
                  value={logoUrl}
                  onChange={(event) => setLogoUrl(event.target.value)}
                  placeholder="https://..."
                  className="w-full bg-surface-container-low border border-outline-variant/40 rounded-2xl px-4 py-3 text-sm font-bold focus:outline-none focus:ring-2 focus:ring-primary/20"
                />
              </label>
            </div>

            <div className="rounded-3xl border border-outline-variant/30 bg-surface-container-low p-5 flex flex-col items-center justify-center text-center min-h-40">
              {logoUrl ? <img src={logoUrl} alt="Go Influence Logo" className="max-h-20 max-w-full object-contain" /> : <div className="w-20 h-20 rounded-3xl bg-primary text-white flex items-center justify-center font-extrabold text-2xl">
                  {(brandName || "G").charAt(0).toUpperCase()}
                </div>}
              <p className="mt-3 text-xs font-extrabold text-on-surface">{brandName || "Go Influence"}</p>
            </div>
          </div>

          <div className="border-t border-outline-variant/30 pt-6 space-y-4">
            <div className="flex items-center gap-3">
              <span className="w-11 h-11 rounded-2xl bg-secondary-container text-on-secondary-container flex items-center justify-center">
                <Percent className="w-5 h-5" />
              </span>
              <div>
                <h3 className="text-xl font-extrabold text-on-surface">Genel Komisyon Oranı</h3>
                <p className="text-xs text-on-surface-variant/70 font-medium">Influencer özel oranı yoksa bu oran uygulanır.</p>
              </div>
            </div>

            <div className="flex flex-col md:flex-row md:items-center gap-6">
              <input
                type="range"
                min="0"
                max="40"
                value={globalCommissionRate}
                onChange={(event) => setGlobalCommissionRate(Number(event.target.value))}
                className="w-full h-2 bg-secondary-container rounded-lg appearance-none cursor-pointer accent-primary"
              />
              <div className="w-full md:w-28 bg-primary-fixed text-primary rounded-2xl py-3 text-center font-extrabold">
                %{globalCommissionRate}
              </div>
            </div>
          </div>

          <button
            onClick={handleSavePlatform}
            disabled={isSavingPlatform}
            className="bg-primary text-white font-extrabold px-7 py-3.5 rounded-3xl shadow-lg shadow-primary-container/20 hover:scale-[1.02] active:scale-[0.98] disabled:opacity-60 transition-all cursor-pointer text-sm flex items-center gap-2"
          >
            <Save className="w-4 h-4" />
            {isSavingPlatform ? "Kaydediliyor..." : "Genel Ayarları Kaydet"}
          </button>
        </div>

        <div className="bg-white rounded-3xl border border-[#F1F1F1] shadow-[0px_10px_30px_rgba(176,38,255,0.04)] p-8 space-y-6">
          <div className="flex items-center gap-3">
            <span className="w-11 h-11 rounded-2xl bg-tertiary-fixed text-on-tertiary-fixed-variant flex items-center justify-center">
              <UserCog className="w-5 h-5" />
            </span>
            <div>
              <h3 className="text-xl font-extrabold text-on-surface">Influencer Komisyonu</h3>
              <p className="text-xs text-on-surface-variant/70 font-medium">Seçili influencer için özel oran belirleyin.</p>
            </div>
          </div>

          <div className="relative">
            <Search className="w-4 h-4 absolute left-4 top-1/2 -translate-y-1/2 text-on-surface-variant/60" />
            <input
              value={searchQuery}
              onChange={(event) => setSearchQuery(event.target.value)}
              placeholder="Influencer ara..."
              className="w-full bg-surface-container-low border border-outline-variant/40 rounded-2xl pl-11 pr-4 py-3 text-sm font-bold focus:outline-none focus:ring-2 focus:ring-primary/20"
            />
          </div>

          <select
            value={selectedInfluencerId}
            onChange={(event) => setSelectedInfluencerId(event.target.value)}
            className="w-full bg-surface-container-low border border-outline-variant/40 rounded-2xl px-4 py-3 text-sm font-bold focus:outline-none focus:ring-2 focus:ring-primary/20"
          >
            <option value="">Influencer seçin</option>
            {filteredInfluencers.map((influencer) => <option key={influencer.id} value={influencer.id}>
                {influencer.displayName || influencer.email || influencer.id}
              </option>)}
          </select>

          <div className="rounded-3xl bg-surface-container-low border border-outline-variant/20 p-5 space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs font-bold text-on-surface-variant/70 uppercase tracking-wider">Özel Oran</p>
                <p className="text-3xl font-extrabold text-primary mt-1">%{influencerRate}</p>
              </div>
              <SlidersHorizontal className="w-8 h-8 text-primary/50" />
            </div>
            <input
              type="range"
              min="0"
              max="40"
              value={influencerRate}
              onChange={(event) => setInfluencerRate(Number(event.target.value))}
              className="w-full h-2 bg-secondary-container rounded-lg appearance-none cursor-pointer accent-primary"
            />
          </div>

          <button
            onClick={handleSaveInfluencer}
            disabled={isSavingInfluencer}
            className="w-full bg-on-background text-white font-extrabold px-7 py-3.5 rounded-3xl hover:scale-[1.02] active:scale-[0.98] disabled:opacity-60 transition-all cursor-pointer text-sm flex items-center justify-center gap-2"
          >
            <Save className="w-4 h-4" />
            {isSavingInfluencer ? "Kaydediliyor..." : "Influencer Oranını Kaydet"}
          </button>
        </div>
      </section>
    </div>;
}

export default SettingsTab;

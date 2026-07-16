/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */
import { useRef, useState } from "react";
import { Rocket, MapPin, Calendar, Eye, Film, Image as ImageIcon, Link2, UploadCloud, X } from "lucide-react";

const DEFAULT_BANNER_URL = "https://lh3.googleusercontent.com/aida-public/AB6AXuAcTJsOfC7Zdg6wHbDFDTTpu9TGbRskRr6CJu0Pw4SLZSnr2WU-eO-_QN0jlpZTY0IWuO4Y4Pp2UtG_nrAIp8bj1FHFc336PWLAUBkugfwb-FnObO3dLjYeoo-HKvFTiA_ndNcEWmz204uBc8o0h-CdI4qNn_mFx2VljnfeeWxjK0wBtxGCtEx72gbUDC-IH8Nbp0Xl1c6R_vaYkW8x_2-uTBL2zxnbw97Kd88SMHU9vncVToQmm0SU";
const MAX_INLINE_BANNER_LENGTH = 650000;
const TODAY_INPUT_VALUE = formatDateForInput(new Date());
const TODAY_DISPLAY_VALUE = formatDisplayDate(TODAY_INPUT_VALUE);

function CampaignCreatorView({ onCreateCampaign, brandName, initialCampaign = null, mode = "create", onCancel }) {
  const isEditing = mode === "edit";
  const [title, setTitle] = useState(initialCampaign?.title || initialCampaign?.name || "");
  const [description, setDescription] = useState(initialCampaign?.description || "");
  const [selectedCats, setSelectedCats] = useState(initialCampaign?.categories?.length ? initialCampaign.categories : ["Moda"]);
  const [targetAge, setTargetAge] = useState(Number(initialCampaign?.targetAgeMax || 25));
  const [targetGender, setTargetGender] = useState(initialCampaign?.targetGender || "Hepsi");
  const [location, setLocation] = useState(initialCampaign?.location || "Istanbul, Turkey");
  const [budgetMin, setBudgetMin] = useState(initialCampaign?.budgetMin || "");
  const [budgetMax, setBudgetMax] = useState(initialCampaign?.budgetMax || "");
  const [contentTypes, setContentTypes] = useState(initialCampaign?.contentType?.length ? initialCampaign.contentType : ["Reels"]);
  const [startDate] = useState(initialCampaign?.startDate || TODAY_DISPLAY_VALUE);
  const [endDateInput, setEndDateInput] = useState(parseDisplayDateToInput(initialCampaign?.endDate) || "");
  const [bannerUrl, setBannerUrl] = useState(initialCampaign?.bannerSource === "url" ? initialCampaign.bannerUrl || "" : "");
  const [bannerPreview, setBannerPreview] = useState(initialCampaign?.bannerUrl || DEFAULT_BANNER_URL);
  const [bannerFile, setBannerFile] = useState(null);
  const [bannerDataUrl, setBannerDataUrl] = useState("");
  const [submitError, setSubmitError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const endDatePickerRef = useRef(null);
  const endDate = endDateInput ? formatDisplayDate(endDateInput) : "";
  const categories = ["Moda", "Teknoloji", "G\xFCzellik", "Ya\u015Fam Tarz\u0131", "Seyahat", "Spor"];
  const toggleCategory = (cat) => {
    if (selectedCats.includes(cat)) {
      if (selectedCats.length > 1) {
        setSelectedCats(selectedCats.filter((c) => c !== cat));
      }
    } else {
      setSelectedCats([...selectedCats, cat]);
    }
  };
  const toggleContentType = (type) => {
    if (contentTypes.includes(type)) {
      if (contentTypes.length > 1) {
        setContentTypes(contentTypes.filter((t) => t !== type));
      }
    } else {
      setContentTypes([...contentTypes, type]);
    }
  };

  const handleBannerFileChange = async (event) => {
    const file = event.target.files?.[0];
    if (!file) return;

    setBannerFile(file);
    setBannerUrl("");
    setBannerDataUrl("");
    setSubmitError("");

    const reader = new FileReader();
    reader.onload = () => {
      setBannerPreview(String(reader.result || DEFAULT_BANNER_URL));
    };
    reader.readAsDataURL(file);

    try {
      const compactDataUrl = await createCompactBannerDataUrl(file);
      setBannerDataUrl(compactDataUrl);
    } catch {
      setBannerDataUrl("");
    }
  };

  const handleBannerUrlChange = (value) => {
    setBannerUrl(value);
    setBannerFile(null);
    setBannerDataUrl("");
    setSubmitError("");
    setBannerPreview(value.trim() || DEFAULT_BANNER_URL);
  };

  const clearBanner = () => {
    setBannerUrl("");
    setBannerFile(null);
    setBannerDataUrl("");
    setSubmitError("");
    setBannerPreview(DEFAULT_BANNER_URL);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!title) return;
    setSubmitError("");
    let nextBannerDataUrl = bannerDataUrl;

    if (bannerFile && !nextBannerDataUrl) {
      try {
        nextBannerDataUrl = await createCompactBannerDataUrl(bannerFile);
        setBannerDataUrl(nextBannerDataUrl);
      } catch {
        setSubmitError("Banner gorseli islenemedi. Daha kucuk bir gorsel secin veya URL olarak ekleyin.");
        return;
      }
    }

    if (bannerFile && !nextBannerDataUrl) {
      setSubmitError("Banner gorseli Firestore icin cok buyuk. Daha kucuk bir gorsel secin veya URL olarak ekleyin.");
      return;
    }

    const newCamp = {
      id: initialCampaign?.id || `camp_${Date.now()}`,
      title,
      description: description || "Kampanya hedeflerinizden ve influencerlardan beklentilerinizden bahsedin...",
      categories: selectedCats,
      budgetMin: Number(budgetMin) || 15e3,
      budgetMax: Number(budgetMax) || 4e4,
      targetAgeMin: 18,
      targetAgeMax: targetAge,
      targetGender,
      location,
      contentType: contentTypes,
      startDate,
      endDate,
      bannerUrl: bannerFile ? "" : bannerPreview,
      status: initialCampaign?.status || "Aktif",
      interestedCount: Number(initialCampaign?.interestedCount || 12),
      creatorAvatars: initialCampaign?.creatorAvatars || [],
      creatorCount: Number(initialCampaign?.creatorCount || 0)
    };
    setIsSubmitting(true);
    try {
      await onCreateCampaign(newCamp, { bannerDataUrl: nextBannerDataUrl });
    } catch (error) {
      setSubmitError(error.message || "Kampanya kaydedilirken bir hata oluştu.");
    } finally {
      setIsSubmitting(false);
    }
  };
  return <div className="space-y-8 animate-in fade-in duration-500">
      
      {
    /* Header */
  }
      <header className="mb-6">
        <h1 className="font-sans font-extrabold text-3xl md:text-4xl text-on-surface tracking-tight mb-2">
          {isEditing ? "Kampanyayı Düzenle" : "Yeni Kampanya Oluştur"}
        </h1>
        <p className="text-on-surface-variant font-medium text-base md:text-lg">
          {isEditing
            ? "Kampanya bilgilerini güncelleyin; sağdaki önizleme değişiklikleri anlık gösterir."
            : "Markanızın enerjisini en iyi yansıtacak influencer'larla tanışmaya hazır olun."}
        </p>
      </header>

      {
    /* Main Grid: Form Left, Real-time Preview Right */
  }
      <div className="grid grid-cols-1 xl:grid-cols-12 gap-8 items-start">
        
        {
    /* Form Section */
  }
        <section className="xl:col-span-7 bg-white p-6 md:p-8 rounded-3xl shadow-[0px_10px_30px_rgba(176,38,255,0.06)] border border-[#F1F1F1]">
          <form onSubmit={handleSubmit} className="space-y-6">
            
            {
    /* Basic Info */
  }
            <div className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-on-surface-variant mb-2 uppercase tracking-wider">
                  Kampanya Başlığı
                </label>
                <input
    required
    type="text"
    value={title}
    onChange={(e) => setTitle(e.target.value)}
    placeholder="Örn: Yaz Koleksiyonu 2024 Tanıtımı"
    className="w-full bg-[#F8F9FA] border border-transparent focus:border-primary focus:ring-1 focus:ring-primary rounded-2xl p-4 transition-all outline-none"
  />
              </div>
              <div>
                <label className="block text-xs font-bold text-on-surface-variant mb-2 uppercase tracking-wider">
                  Açıklama
                </label>
                <textarea
    required
    rows={4}
    value={description}
    onChange={(e) => setDescription(e.target.value)}
    placeholder="Kampanya hedeflerinizden ve influencerlardan beklentilerinizden bahsedin..."
    className="w-full bg-[#F8F9FA] border border-transparent focus:border-primary focus:ring-1 focus:ring-primary rounded-2xl p-4 transition-all outline-none resize-none"
  />
              </div>
            </div>

            <div className="space-y-3">
              <label className="block text-xs font-bold text-on-surface-variant mb-2 uppercase tracking-wider">
                Kampanya Banner
              </label>
              <div className="grid grid-cols-1 md:grid-cols-[1fr_auto] gap-3">
                <label className="min-h-28 border-2 border-dashed border-primary/20 hover:border-primary/50 rounded-3xl bg-[#F8F9FA] cursor-pointer transition-all flex flex-col items-center justify-center gap-2 px-4 text-center">
                  <UploadCloud size={22} className="text-primary" />
                  <span className="text-sm font-extrabold text-on-surface">Gorsel yukle</span>
                  <span className="text-[11px] font-semibold text-on-surface-variant">JPG, PNG veya WebP banner secin</span>
                  <input
    type="file"
    accept="image/*"
    onChange={handleBannerFileChange}
    className="sr-only"
  />
                </label>

                <button
    type="button"
    onClick={clearBanner}
    className="md:w-12 h-12 md:h-auto rounded-2xl bg-white border border-outline-variant/50 text-on-surface-variant hover:text-error hover:border-error/30 flex items-center justify-center transition-colors cursor-pointer"
    aria-label="Banneri temizle"
  >
                  <X size={18} />
                </button>
              </div>

              <div className="relative">
                <Link2 size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-on-surface-variant opacity-50" />
                <input
    type="url"
    value={bannerUrl}
    onChange={(e) => handleBannerUrlChange(e.target.value)}
    placeholder="Veya banner gorsel URL'si yapistirin"
    className="w-full bg-[#F8F9FA] border border-transparent focus:border-primary focus:ring-1 focus:ring-primary rounded-2xl p-4 pl-11 transition-all outline-none text-sm"
  />
              </div>

              <p className="text-[11px] font-semibold text-on-surface-variant">
                Secilen banner sagdaki influencer onizleme kartinda anlik guncellenir ve kampanya kaydinda saklanir.
              </p>
              {bannerFile && !bannerDataUrl && <p className="text-[11px] font-bold text-error">
                  Banner onizlemesi hazir, ancak dosya cok buyukse Storage hatasinda Firestore yedegi kullanilamayabilir.
                </p>}
            </div>

            {
    /* Categories */
  }
            <div>
              <label className="block text-xs font-bold text-on-surface-variant mb-3 uppercase tracking-wider">
                Kategoriler (Birden fazla seçilebilir)
              </label>
              <div className="flex flex-wrap gap-2">
                {categories.map((cat) => {
    const isSelected = selectedCats.includes(cat);
    return <button
      type="button"
      key={cat}
      onClick={() => toggleCategory(cat)}
      className={`px-4 py-2.5 rounded-full border-2 font-bold text-xs transition-all active:scale-95 cursor-pointer ${isSelected ? "border-primary text-primary bg-primary/5" : "border-primary/20 text-on-surface-variant hover:border-primary/50"}`}
    >
                      {cat}
                    </button>;
  })}
              </div>
            </div>

            {
    /* Target Audience (Grey Box) */
  }
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 p-6 bg-surface-container-low rounded-3xl">
              <div className="space-y-4">
                <label className="block text-xs font-bold text-on-surface-variant uppercase tracking-wider">
                  Yaş Aralığı: <span className="text-primary font-bold">18 - {targetAge}</span>
                </label>
                <input
    type="range"
    min={18}
    max={65}
    value={targetAge}
    onChange={(e) => setTargetAge(Number(e.target.value))}
    className="w-full h-2 bg-white rounded-lg appearance-none cursor-pointer accent-primary"
  />

                <label className="block text-xs font-bold text-on-surface-variant uppercase tracking-wider mt-4">
                  Hedef Cinsiyet
                </label>
                <div className="flex gap-2">
                  {["Kad\u0131n", "Erkek", "Hepsi"].map((g) => <button
    type="button"
    key={g}
    onClick={() => setTargetGender(g)}
    className={`flex-1 py-2.5 rounded-xl font-bold text-xs border-2 transition-all cursor-pointer ${targetGender === g ? "bg-primary text-white border-primary" : "bg-white text-on-surface-variant border-transparent hover:border-primary/30"}`}
  >
                      {g}
                    </button>)}
                </div>
              </div>

              <div className="space-y-4">
                <label className="block text-xs font-bold text-on-surface-variant uppercase tracking-wider">
                  Konum
                </label>
                <div className="relative">
                  <MapPin size={16} className="absolute left-3 top-3.5 text-on-surface-variant opacity-50" />
                  <input
    type="text"
    value={location}
    onChange={(e) => setLocation(e.target.value)}
    placeholder="Şehir veya Ülke"
    className="w-full bg-white border-transparent focus:border-primary focus:ring-1 focus:ring-primary rounded-2xl p-3 pl-9 text-sm outline-none"
  />
                </div>
                {
    /* Simulated Map image */
  }
                <div className="mt-2 h-20 rounded-2xl overflow-hidden grayscale opacity-60 border border-white/50">
                  <img
    className="w-full h-full object-cover"
    src="https://lh3.googleusercontent.com/aida-public/AB6AXuCa54vxGlH6AxiMv9wsHDY0GX0D8NI53v07q-Sqm_XBEO3LFdF7UGzRAdL8nFuT8I3xiWt5iF5y5mODEON1CVJlkF-I2ZbGzX84D1_c_afsFz4gNJSHVKcf8lt1Xnr0ANJJvMkG4hmjhJw8kW-Ill1Ewxb8nKXy9ByKX0JufG8E5xEqVIat7cg2TT7NXCMkP1Mf8x2gR-kT-UGe8wh889ONPMifcs51wcivvkC1Hse22Pyy_UR1FKDT"
    alt="Istanbul Map preview"
    referrerPolicy="no-referrer"
  />
                </div>
              </div>
            </div>

            {
    /* Budget and Types */
  }
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-xs font-bold text-on-surface-variant mb-2 uppercase tracking-wider">
                  Bütçe Aralığı (₺)
                </label>
                <div className="flex items-center gap-3">
                  <input
    type="number"
    value={budgetMin}
    onChange={(e) => setBudgetMin(e.target.value === "" ? "" : Number(e.target.value))}
    placeholder="Min"
    className="w-full bg-[#F8F9FA] border-transparent focus:border-primary focus:ring-1 focus:ring-primary rounded-2xl p-4 transition-all outline-none"
  />
                  <span className="text-on-surface-variant font-bold">-</span>
                  <input
    type="number"
    value={budgetMax}
    onChange={(e) => setBudgetMax(e.target.value === "" ? "" : Number(e.target.value))}
    placeholder="Max"
    className="w-full bg-[#F8F9FA] border-transparent focus:border-primary focus:ring-1 focus:ring-primary rounded-2xl p-4 transition-all outline-none"
  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-on-surface-variant mb-2 uppercase tracking-wider">
                  Kampanya Türü
                </label>
                <div className="grid grid-cols-3 gap-2">
                  <button
    type="button"
    onClick={() => toggleContentType("Post")}
    className={`p-2 rounded-xl border-2 flex flex-col items-center gap-1 transition-all cursor-pointer ${contentTypes.includes("Post") ? "border-primary bg-primary/5 text-primary" : "border-primary/10 text-on-surface-variant hover:bg-primary/5"}`}
  >
                    <ImageIcon size={18} />
                    <span className="text-[10px] font-bold">Post</span>
                  </button>
                  <button
    type="button"
    onClick={() => toggleContentType("Story")}
    className={`p-2 rounded-xl border-2 flex flex-col items-center gap-1 transition-all cursor-pointer ${contentTypes.includes("Story") ? "border-primary bg-primary/5 text-primary" : "border-primary/10 text-on-surface-variant hover:bg-primary/5"}`}
  >
                    <Calendar size={18} />
                    <span className="text-[10px] font-bold">Story</span>
                  </button>
                  <button
    type="button"
    onClick={() => toggleContentType("Reels")}
    className={`p-2 rounded-xl border-2 flex flex-col items-center gap-1 transition-all cursor-pointer ${contentTypes.includes("Reels") ? "border-primary bg-primary/5 text-primary" : "border-primary/10 text-on-surface-variant hover:bg-primary/5"}`}
  >
                    <Film size={18} />
                    <span className="text-[10px] font-bold">Reels</span>
                  </button>
                </div>
              </div>
            </div>

            {
    /* Duration Dates */
  }
            <div>
              <label className="block text-xs font-bold text-on-surface-variant mb-2 uppercase tracking-wider">
                Kampanya Süresi
              </label>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                <div className="bg-[#F8F9FA] border border-transparent rounded-2xl p-4 flex items-center gap-3">
                  <div className="w-10 h-10 rounded-2xl bg-white text-primary flex items-center justify-center shadow-sm">
                    <Calendar size={18} />
                  </div>
                  <div>
                    <p className="text-[10px] font-extrabold text-on-surface-variant uppercase tracking-wider">Başlangıç</p>
                    <p className="text-sm font-extrabold text-on-surface">{startDate}</p>
                  </div>
                </div>

                <button
    type="button"
    onClick={() => {
      const picker = endDatePickerRef.current;
      if (picker?.showPicker) picker.showPicker();
      else picker?.focus();
    }}
    className="relative bg-white border border-outline-variant/60 hover:border-primary/60 rounded-2xl p-4 flex items-center gap-3 text-left transition-all cursor-pointer shadow-sm"
  >
                  <div className="w-10 h-10 rounded-2xl bg-primary/10 text-primary flex items-center justify-center">
                    <Calendar size={18} />
                  </div>
                  <div className="min-w-0">
                    <p className="text-[10px] font-extrabold text-on-surface-variant uppercase tracking-wider">Bitiş</p>
                    <p className={`text-sm font-extrabold truncate ${endDate ? "text-on-surface" : "text-on-surface-variant/60"}`}>
                      {endDate || "Bitiş tarihi seç"}
                    </p>
                  </div>
                  <input
    ref={endDatePickerRef}
    type="date"
    min={isEditing && endDateInput && endDateInput < TODAY_INPUT_VALUE ? endDateInput : TODAY_INPUT_VALUE}
    value={endDateInput}
    onChange={(e) => setEndDateInput(e.target.value)}
    className="absolute inset-0 opacity-0 cursor-pointer"
    aria-label="Bitiş tarihi seç"
  />
                </button>
                </div>
            </div>

            {
    /* Form Submit Button */
  }
            {submitError && <div className="rounded-2xl border border-error/20 bg-error-container px-4 py-3 text-sm font-bold text-error">
                {submitError}
              </div>}

            <div className="flex flex-col sm:flex-row gap-3">
              {onCancel && <button
    type="button"
    onClick={onCancel}
    disabled={isSubmitting}
    className="sm:w-44 py-5 bg-white border border-outline-variant text-on-surface-variant rounded-3xl font-extrabold text-sm hover:border-primary hover:text-primary active:scale-95 transition-all cursor-pointer disabled:opacity-60"
  >
                Vazgeç
              </button>}

              <button
    type="submit"
    disabled={isSubmitting}
    className="flex-1 py-5 bg-primary text-white rounded-3xl font-extrabold text-lg shadow-[0px_10px_20px_rgba(144,0,215,0.2)] hover:scale-[1.01] active:scale-95 transition-all flex items-center justify-center gap-3 cursor-pointer disabled:opacity-60 disabled:cursor-not-allowed disabled:hover:scale-100"
  >
                <span>{isSubmitting ? "Kampanya kaydediliyor..." : isEditing ? "Değişiklikleri Kaydet" : "Kampanyayı Oluştur ve Eşleşmeleri Gör"}</span>
                <Rocket size={18} />
              </button>
            </div>

          </form>
        </section>

        {
    /* Live Preview Side Panel (Right) */
  }
        <aside className="xl:col-span-5 sticky top-24 space-y-4">
          <div className="bg-[#F9F871] text-on-surface px-6 py-3.5 rounded-t-3xl font-extrabold flex items-center gap-2 shadow-sm uppercase tracking-wider text-xs">
            <Eye size={16} />
            Influencer Önizlemesi
          </div>
          
          <div className="bg-white rounded-b-3xl shadow-xl overflow-hidden border-x border-b border-[#F1F1F1] transition-transform duration-300">
            {
    /* Banner block image with overlay text */
  }
            <div className="relative h-64 bg-surface-container-low">
              <div
    className="w-full h-full bg-cover bg-center"
    style={{ backgroundImage: `url("${bannerPreview}")` }}
  />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
              {bannerFile && <div className="absolute top-4 left-4 right-4 bg-white/90 text-on-surface text-[10px] font-extrabold px-3 py-1.5 rounded-full shadow-sm truncate">
                  {bannerFile.name}
                </div>}
              
              <div className="absolute bottom-4 left-6 right-6 flex justify-between items-end">
                <div className="space-y-1.5">
                  <span className="bg-secondary-container text-[#795a69] text-[9px] font-extrabold px-2.5 py-1 rounded-full uppercase tracking-wider inline-block">
                    {selectedCats.join(" & ") || "Kategori"}
                  </span>
                  <h2 className="text-white font-extrabold text-2xl tracking-tight line-clamp-1">
                    {title || "Yeni Kampanya Ba\u015Fl\u0131\u011F\u0131"}
                  </h2>
                </div>
                
                <div className="text-right">
                  <p className="text-white/70 text-[9px] font-extrabold uppercase tracking-wider">Tahmini Bütçe</p>
                  <p className="text-white font-extrabold text-lg">
                    ₺{budgetMin ? budgetMin : "25K"} - ₺{budgetMax ? budgetMax : "40K"}
                  </p>
                </div>
              </div>
            </div>

            {
    /* Campaign details body */
  }
            <div className="p-8 space-y-6">
              
              {
    /* Brand Profile Card */
  }
              <div className="flex gap-4">
                <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center text-primary font-bold text-lg">
                  {brandName ? brandName[0].toUpperCase() : "M"}
                </div>
                <div>
                  <p className="text-on-surface font-extrabold text-sm">{brandName || "Markan\u0131z Ltd. \u015Eti."}</p>
                  <p className="text-on-surface-variant text-xs font-semibold">Onaylanmış Partner</p>
                </div>
              </div>

              {
    /* Description */
  }
              <p className="text-on-surface-variant text-sm leading-relaxed line-clamp-3 font-medium">
                {description || "Yeni sezon yaz koleksiyonumuz i\xE7in enerjik ve yarat\u0131c\u0131 i\xE7erik \xFCreticileri ar\u0131yoruz! Modern, minimal ve trend belirleyici stilinizi takip\xE7ilerinizle payla\u015F\u0131n."}
              </p>

              {
    /* Stats & demographics tags */
  }
              <div className="grid grid-cols-2 gap-4">
                <div className="bg-surface-container-low p-4 rounded-2xl">
                  <p className="text-[10px] font-extrabold text-on-surface-variant opacity-60 uppercase mb-1">Hedef Kitle</p>
                  <p className="text-xs font-extrabold text-on-surface">18-{targetAge} Yaş, Türkiye</p>
                </div>
                <div className="bg-surface-container-low p-4 rounded-2xl">
                  <p className="text-[10px] font-extrabold text-on-surface-variant opacity-60 uppercase mb-1">İçerik Tipi</p>
                  <div className="flex gap-1.5 mt-1 text-on-surface-variant">
                    {contentTypes.includes("Reels") && <Film size={14} />}
                    {contentTypes.includes("Post") && <ImageIcon size={14} />}
                    {contentTypes.includes("Story") && <Calendar size={14} />}
                  </div>
                </div>
              </div>

              {
    /* Interest footer preview */
  }
              <div className="pt-4 border-t border-surface-container-low flex items-center justify-between">
                <div className="flex -space-x-2">
                  <div className="w-8 h-8 rounded-full border-2 border-white bg-slate-200" />
                  <div className="w-8 h-8 rounded-full border-2 border-white bg-slate-300" />
                  <div className="w-8 h-8 rounded-full border-2 border-white bg-slate-400" />
                  <div className="w-8 h-8 rounded-full border-2 border-white flex items-center justify-center bg-secondary-container text-[10px] font-extrabold text-on-secondary-container">
                    +12
                  </div>
                </div>
                <p className="text-[11px] font-bold text-on-surface-variant italic">
                  Şimdiden 12 influencer ilgilendi!
                </p>
              </div>

            </div>
          </div>
        </aside>

      </div>
    </div>;
}
export {
  CampaignCreatorView as default
};

function createCompactBannerDataUrl(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();

    reader.onerror = reject;
    reader.onload = () => {
      const image = new Image();

      image.onerror = reject;
      image.onload = () => {
        const maxWidth = 1100;
        const scale = Math.min(1, maxWidth / image.width);
        const canvas = document.createElement("canvas");
        canvas.width = Math.max(1, Math.round(image.width * scale));
        canvas.height = Math.max(1, Math.round(image.height * scale));

        const context = canvas.getContext("2d");
        if (!context) {
          reject(new Error("Banner gorseli islenemedi."));
          return;
        }

        context.drawImage(image, 0, 0, canvas.width, canvas.height);
        const dataUrl = canvas.toDataURL("image/jpeg", 0.68);
        resolve(dataUrl.length <= MAX_INLINE_BANNER_LENGTH ? dataUrl : "");
      };

      image.src = String(reader.result || "");
    };

    reader.readAsDataURL(file);
  });
}

function formatDateForInput(date) {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}

function formatDisplayDate(inputValue) {
  if (!inputValue) return "";
  const [year, month, day] = inputValue.split("-").map(Number);
  const date = new Date(year, month - 1, day);
  if (Number.isNaN(date.getTime())) return "";

  return new Intl.DateTimeFormat("tr-TR", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  }).format(date);
}

function parseDisplayDateToInput(value) {
  if (!value) return "";
  if (/^\d{4}-\d{2}-\d{2}$/.test(value)) return value;

  const parsed = new Date(value);
  if (!Number.isNaN(parsed.getTime())) return formatDateForInput(parsed);

  const monthMap = {
    oca: 0,
    şub: 1,
    sub: 1,
    mar: 2,
    nis: 3,
    may: 4,
    haz: 5,
    tem: 6,
    ağu: 7,
    agu: 7,
    eyl: 8,
    eki: 9,
    kas: 10,
    ara: 11,
  };
  const match = String(value).toLocaleLowerCase("tr-TR").match(/(\d{1,2})\s+([a-zçğıöşü]{3})\.?\s+(\d{4})/i);
  if (!match) return "";

  const day = Number(match[1]);
  const month = monthMap[match[2].normalize("NFC")];
  const year = Number(match[3]);
  if (!Number.isFinite(day) || month === undefined || !Number.isFinite(year)) return "";

  return formatDateForInput(new Date(year, month, day));
}

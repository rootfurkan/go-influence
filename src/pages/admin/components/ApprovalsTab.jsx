import { useState } from "react";
import { Filter, Users as UsersIcon, Wallet, X, Globe, Video, AtSign, CheckCircle2, ChevronLeft, ChevronRight, Maximize2 } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
function ApprovalsTab({
  pendingApprovals,
  onApprove,
  onReject,
  onShowToast,
  searchQuery
}) {
  const [selectedProfile, setSelectedProfile] = useState(null);
  const [galleryIndex, setGalleryIndex] = useState(null);
  const [filterCategory, setFilterCategory] = useState("T\xFCm\xFC");
  const filteredApprovals = pendingApprovals.filter((p) => {
    const matchesSearch = p.name.toLowerCase().includes(searchQuery.toLowerCase()) || p.handle.toLowerCase().includes(searchQuery.toLowerCase());
    if (filterCategory === "T\xFCm\xFC") return matchesSearch;
    const matchesCategory = p.categories.some((cat) => cat.toLowerCase() === filterCategory.toLowerCase());
    return matchesSearch && matchesCategory;
  });
  const handleApproveAction = (profile) => {
    onApprove(profile.id);
    setSelectedProfile(null);
    setGalleryIndex(null);
    onShowToast(`${profile.name} ba\u015Fvurusu onayland\u0131 ve sisteme eklendi.`);
  };
  const handleRejectAction = (profile) => {
    if (window.confirm(`${profile.name} ba\u015Fvurusunu reddetmek istedi\u011Finize emin misiniz?`)) {
      onReject(profile.id);
      setSelectedProfile(null);
      setGalleryIndex(null);
      onShowToast(`${profile.name} ba\u015Fvurusu reddedildi.`);
    }
  };
  const portfolioImages = selectedProfile?.portfolioImages?.filter(Boolean) || [];
  const activeGalleryImage = galleryIndex === null ? null : portfolioImages[galleryIndex];
  const closeProfileDrawer = () => {
    setSelectedProfile(null);
    setGalleryIndex(null);
  };
  const openGallery = (index) => {
    if (portfolioImages[index]) {
      setGalleryIndex(index);
    }
  };
  const showPreviousImage = () => {
    setGalleryIndex((current) => {
      if (current === null || portfolioImages.length === 0) return current;
      return current === 0 ? portfolioImages.length - 1 : current - 1;
    });
  };
  const showNextImage = () => {
    setGalleryIndex((current) => {
      if (current === null || portfolioImages.length === 0) return current;
      return current === portfolioImages.length - 1 ? 0 : current + 1;
    });
  };
  return <div className="space-y-6 select-none">
      {
    /* Header & Main Controls */
  }
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-4 mb-8">
        <div>
          <h2 className="text-3xl font-extrabold text-on-background tracking-tight">Influencer Onayları</h2>
          <p className="text-sm text-on-surface-variant/80 mt-1">
            Sistemde inceleme bekleyen{" "}
            <span className="text-primary font-bold">{pendingApprovals.length}</span> yeni profil bulunmaktadır.
          </p>
        </div>

        <div className="flex gap-4">
          <div className="flex items-center gap-2">
            <span className="text-xs font-bold text-on-surface-variant/60 uppercase tracking-wider">Kategori:</span>
            <select
    value={filterCategory}
    onChange={(e) => setFilterCategory(e.target.value)}
    className="bg-white border border-[#E1E3E4] rounded-2xl text-xs font-bold py-2 px-4 cursor-pointer focus:ring-2 focus:ring-primary/20"
  >
              <option value="Tümü">Tümü</option>
              <option value="Moda">Moda</option>
              <option value="Lüks">Lüks</option>
              <option value="Teknoloji">Teknoloji</option>
              <option value="Oyun">Oyun</option>
              <option value="Sağlık">Sağlık</option>
              <option value="Yoga">Yoga</option>
            </select>
          </div>

          <button
    onClick={() => onShowToast("Filtre se\xE7enekleri g\xFCncellendi.")}
    className="flex items-center gap-2 px-6 py-2.5 rounded-3xl bg-surface-container-high text-on-surface hover:bg-surface-variant transition-all font-bold text-xs tracking-wide cursor-pointer"
  >
            <Filter className="w-4 h-4" />
            Filtrele
          </button>
        </div>
      </div>

      {
    /* Approval Table */
  }
      {filteredApprovals.length === 0 ? <div className="bg-white rounded-3xl p-12 text-center border border-[#F1F1F1] shadow-sm">
          <CheckCircle2 className="w-12 h-12 text-primary/30 mx-auto mb-4" />
          <p className="text-on-surface-variant font-bold">Onay bekleyen başvuru bulunmamaktadır.</p>
          <p className="text-xs text-on-surface-variant/60 mt-1">Arama terimini değiştirerek tekrar deneyebilirsiniz.</p>
        </div> : <div className="bg-white rounded-3xl shadow-[0px_10px_30px_rgba(176,38,255,0.04)] overflow-hidden border border-gray-100">
          <table className="w-full text-left">
            <thead className="bg-surface-container-lowest border-b border-outline-variant/30">
              <tr>
                <th className="px-8 py-5 text-xs font-bold text-on-surface-variant/80 uppercase tracking-widest">INFLUENCER</th>
                <th className="px-6 py-5 text-xs font-bold text-on-surface-variant/80 uppercase tracking-widest">KATEGORİLER</th>
                <th className="px-6 py-5 text-xs font-bold text-on-surface-variant/80 uppercase tracking-widest">TAKİPÇİ ÖZETİ</th>
                <th className="px-6 py-5 text-xs font-bold text-on-surface-variant/80 uppercase tracking-widest">KAYIT TARİHİ</th>
                <th className="px-8 py-5 text-xs font-bold text-on-surface-variant/80 uppercase tracking-widest text-right">İŞLEM</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {filteredApprovals.map((profile) => <tr key={profile.id} className="hover:bg-surface-container-low transition-colors group">
                  <td className="px-8 py-4.5">
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 rounded-2xl overflow-hidden shadow-sm shrink-0 border border-outline-variant/30">
                        <img referrerPolicy="no-referrer" className="w-full h-full object-cover" src={profile.avatarUrl} alt={profile.name} />
                      </div>
                      <div>
                        <div className="font-extrabold text-on-background text-sm">{profile.name}</div>
                        <div className="text-xs text-on-surface-variant/70 font-medium mt-0.5">{profile.handle}</div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4.5">
                    <div className="flex flex-wrap gap-2">
                      {profile.categories.map((cat, idx) => <span
    key={cat}
    className={`px-3 py-1 rounded-full text-[11px] font-bold ${idx === 0 ? "bg-secondary-container text-on-secondary-container" : "bg-surface-container-high text-on-surface-variant"}`}
  >
                          {cat}
                        </span>)}
                    </div>
                  </td>
                  <td className="px-6 py-4.5">
                    <div className="flex items-center gap-3">
                      <div className="flex items-center gap-1 font-sans">
                        <UsersIcon className="w-4 h-4 text-primary shrink-0" />
                        <span className="font-extrabold text-sm">{profile.followers}</span>
                      </div>
                      <div className="text-[11px] text-tertiary font-extrabold bg-[#e9e963]/30 px-2.5 py-1 rounded-lg">
                        {profile.engagementRate}
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4.5">
                    <div className="text-xs font-bold text-on-surface-variant">{profile.signupDate}</div>
                  </td>
                  <td className="px-8 py-4.5 text-right">
                    <button
    onClick={() => setSelectedProfile(profile)}
    className="px-6 py-2 bg-primary-fixed text-primary font-extrabold text-xs tracking-wide rounded-2xl hover:bg-primary-container hover:text-white hover:scale-105 active:scale-95 transition-all cursor-pointer shadow-sm border border-primary/10"
  >
                      İncele
                    </button>
                  </td>
                </tr>)}
            </tbody>
          </table>
        </div>}

      {
    /* Slide-in Detail Modal/Drawer */
  }
      <AnimatePresence>
        {selectedProfile && <div className="fixed inset-0 z-[100] flex justify-end overflow-hidden">
            {
    /* Dark overlay backdrop */
  }
            <motion.div
    initial={{ opacity: 0 }}
    animate={{ opacity: 0.4 }}
    exit={{ opacity: 0 }}
    onClick={closeProfileDrawer}
    className="absolute inset-0 bg-on-background cursor-pointer"
  />

            {
    /* Drawer Body */
  }
            <motion.aside
    initial={{ x: "100%" }}
    animate={{ x: 0 }}
    exit={{ x: "100%" }}
    transition={{ type: "spring", damping: 25, stiffness: 220 }}
    className="relative ml-auto h-dvh max-h-dvh w-full max-w-[840px] bg-surface-container-lowest shadow-2xl flex flex-col z-10 border-l border-outline-variant/20"
  >
              {
    /* Modal Header */
  }
              <div className="shrink-0 p-6 md:p-8 border-b border-outline-variant/30 flex justify-between items-center gap-4 bg-white shadow-sm">
                <div className="flex items-center gap-4">
                  <button
    onClick={closeProfileDrawer}
    className="w-10 h-10 flex items-center justify-center rounded-full hover:bg-surface-container-low transition-colors cursor-pointer text-on-surface"
    title="Kapat"
  >
                    <X className="w-5 h-5" />
                  </button>
                  <h3 className="text-xl font-extrabold text-on-background tracking-tight">Profil Detayları</h3>
                </div>
                <span className="px-4 py-1.5 bg-[#e9e963]/40 text-[#626200] text-xs font-extrabold rounded-full tracking-wider uppercase">
                  Yeni Başvuru
                </span>
              </div>

              {
    /* Modal Body Scroll Area */
  }
              <div className="flex-1 min-h-0 overflow-y-auto p-6 md:p-8 space-y-8 custom-scrollbar">
                {
    /* Profile Identity Card */
  }
                <div className="flex flex-col sm:flex-row gap-6 items-center sm:items-start text-center sm:text-left">
                  <div className="w-28 h-28 rounded-3xl overflow-hidden ring-4 ring-primary-fixed shrink-0 shadow-lg">
                    <img referrerPolicy="no-referrer" className="w-full h-full object-cover" src={selectedProfile.avatarUrl} alt={selectedProfile.name} />
                  </div>
                  <div className="flex-1 space-y-3">
                    <div>
                      <h4 className="text-2xl font-extrabold text-on-background tracking-tight">{selectedProfile.name}</h4>
                      <p className="text-primary font-bold text-sm tracking-wide mt-1">{selectedProfile.handle}</p>
                    </div>
                    
                    <div className="flex gap-4 justify-center sm:justify-start pt-1">
                      <div className="bg-surface-container-low px-5 py-2.5 rounded-2xl text-center min-w-[100px] border border-outline-variant/10">
                        <p className="text-[10px] text-on-surface-variant/70 font-bold uppercase tracking-widest">Takipçi</p>
                        <p className="text-lg font-extrabold text-on-background mt-0.5">{selectedProfile.followers}</p>
                      </div>
                      <div className="bg-surface-container-low px-5 py-2.5 rounded-2xl text-center min-w-[100px] border border-outline-variant/10">
                        <p className="text-[10px] text-on-surface-variant/70 font-bold uppercase tracking-widest">Erişim</p>
                        <p className="text-lg font-extrabold text-on-background mt-0.5">2.1M</p>
                      </div>
                    </div>
                  </div>
                </div>

                {
    /* Bio & Socials */
  }
                <section className="space-y-4">
                  <h5 className="font-extrabold text-on-surface-variant/80 uppercase text-xs tracking-widest border-b border-outline-variant/20 pb-1.5">
                    Hakkında & Sosyal Medya
                  </h5>
                  <p className="text-sm text-on-surface/80 leading-relaxed font-medium">
                    {selectedProfile.bio}
                  </p>
                  
                  <div className="flex gap-3 pt-2 justify-center sm:justify-start">
                    <a href="#" className="w-11 h-11 flex items-center justify-center rounded-2xl bg-secondary-container text-on-secondary-container transition-transform hover:scale-110 shadow-sm" title="Instagram">
                      <Globe className="w-4.5 h-4.5" />
                    </a>
                    <a href="#" className="w-11 h-11 flex items-center justify-center rounded-2xl bg-secondary-container text-on-secondary-container transition-transform hover:scale-110 shadow-sm" title="TikTok">
                      <Video className="w-4.5 h-4.5" />
                    </a>
                    <a href="#" className="w-11 h-11 flex items-center justify-center rounded-2xl bg-secondary-container text-on-secondary-container transition-transform hover:scale-110 shadow-sm" title="E-posta iletişimi">
                      <AtSign className="w-4.5 h-4.5" />
                    </a>
                  </div>
                </section>

                {
    /* Portfolio Bento Grid - Asymmetrical precisely styled */
  }
                <section className="space-y-4">
                  <div className="flex justify-between items-center border-b border-outline-variant/20 pb-1.5">
                    <h5 className="font-extrabold text-on-surface-variant/80 uppercase text-xs tracking-widest">
                      Portfolyo Örnekleri
                    </h5>
                    <button
    type="button"
    onClick={() => openGallery(0)}
    disabled={portfolioImages.length === 0}
    className="text-primary font-bold text-xs hover:underline cursor-pointer disabled:cursor-not-allowed disabled:opacity-40"
  >
                      Tümünü Gör
                    </button>
                  </div>
                  
                  {
    /* Asymmetric Bento Layout: big left, 2 stacked right */
  }
                  <div className="grid grid-cols-2 gap-4 h-[320px]">
                    <button
    type="button"
    onClick={() => openGallery(0)}
    className="group relative rounded-3xl overflow-hidden shadow-md border border-[#eee] h-full cursor-pointer bg-surface-container"
  >
                      <img
    referrerPolicy="no-referrer"
    className="w-full h-full object-cover hover:scale-105 transition-transform duration-500"
    src={portfolioImages[0]}
    alt="Portfolio Big"
  />
                      <span className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors" />
                      <span className="absolute right-4 bottom-4 w-10 h-10 rounded-full bg-white/90 text-primary flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity shadow-lg">
                        <Maximize2 className="w-4 h-4" />
                      </span>
                    </button>
                    
                    <div className="grid grid-rows-2 gap-4 h-full">
                      <button
    type="button"
    onClick={() => openGallery(1)}
    className="group relative rounded-3xl overflow-hidden shadow-md border border-[#eee] cursor-pointer bg-surface-container"
  >
                        <img
    referrerPolicy="no-referrer"
    className="w-full h-full object-cover hover:scale-105 transition-transform duration-500"
    src={portfolioImages[1]}
    alt="Portfolio Small 1"
  />
                        <span className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors" />
                        <span className="absolute right-3 bottom-3 w-9 h-9 rounded-full bg-white/90 text-primary flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity shadow-lg">
                          <Maximize2 className="w-4 h-4" />
                        </span>
                      </button>
                      <button
    type="button"
    onClick={() => openGallery(2)}
    className="group relative rounded-3xl overflow-hidden shadow-md border border-[#eee] cursor-pointer bg-surface-container"
  >
                        <img
    referrerPolicy="no-referrer"
    className="w-full h-full object-cover hover:scale-105 transition-transform duration-500"
    src={portfolioImages[2]}
    alt="Portfolio Small 2"
  />
                        <span className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors" />
                        <span className="absolute right-3 bottom-3 w-9 h-9 rounded-full bg-white/90 text-primary flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity shadow-lg">
                          <Maximize2 className="w-4 h-4" />
                        </span>
                      </button>
                    </div>
                  </div>
                </section>

                {
    /* Price Range Badge */
  }
                <div className="hidden">
                  <div>
                    <p className="text-xs font-bold text-on-surface-variant/70 uppercase tracking-widest">İş Birliği Ücret Skalası</p>
                    <p className="text-2xl font-extrabold text-primary mt-1">
                      ₺{selectedProfile.priceRangeMin.toLocaleString("tr-TR")} - ₺{selectedProfile.priceRangeMax.toLocaleString("tr-TR")}
                    </p>
                  </div>
                  <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center">
                    <Wallet className="text-primary w-6 h-6 opacity-75 animate-bounce" />
                  </div>
                </div>
              </div>

              {
    /* Modal Footer (Sticky Action Bar) */
  }
              <div className="shrink-0 p-5 md:p-6 border-t border-outline-variant/30 bg-white space-y-4 shadow-[0_-12px_30px_rgba(15,23,42,0.06)]">
                <div className="bg-surface-container p-4 rounded-3xl flex justify-between items-center border border-outline-variant/10">
                  <div>
                    <p className="text-xs font-bold text-on-surface-variant/70 uppercase tracking-widest">İş Birliği Ücret Skalası</p>
                    <p className="text-xl font-extrabold text-primary mt-1">
                      ₺{selectedProfile.priceRangeMin.toLocaleString("tr-TR")} - ₺{selectedProfile.priceRangeMax.toLocaleString("tr-TR")}
                    </p>
                  </div>
                  <div className="w-11 h-11 rounded-full bg-primary/10 flex items-center justify-center">
                    <Wallet className="text-primary w-5 h-5 opacity-75" />
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4 md:gap-6">
                <button
    onClick={() => handleRejectAction(selectedProfile)}
    className="py-4 rounded-3xl border-2 border-error-container text-on-error-container font-extrabold text-sm tracking-wide hover:bg-error-container/25 transition-all cursor-pointer text-center hover:scale-[1.01] active:scale-[0.98]"
  >
                  Reddet
                </button>
                <button
    onClick={() => handleApproveAction(selectedProfile)}
    className="py-4 rounded-3xl bg-primary-container text-white font-extrabold text-sm tracking-wide shadow-lg shadow-primary-container/20 hover:scale-[1.01] active:scale-[0.98] hover:brightness-110 transition-all cursor-pointer text-center"
  >
                  Onayla
                </button>
                </div>
              </div>
            </motion.aside>
            <AnimatePresence>
              {activeGalleryImage && <motion.div
    initial={{ opacity: 0 }}
    animate={{ opacity: 1 }}
    exit={{ opacity: 0 }}
    className="fixed inset-0 z-[130] bg-black/85 backdrop-blur-sm flex items-center justify-center p-6"
    onClick={() => setGalleryIndex(null)}
  >
                  <button
    type="button"
    onClick={(event) => {
      event.stopPropagation();
      setGalleryIndex(null);
    }}
    className="absolute top-6 right-6 w-11 h-11 rounded-full bg-white/15 text-white hover:bg-white/25 flex items-center justify-center transition-colors cursor-pointer"
    title="Galeriyi kapat"
  >
                    <X className="w-5 h-5" />
                  </button>

                  {portfolioImages.length > 1 && <button
    type="button"
    onClick={(event) => {
      event.stopPropagation();
      showPreviousImage();
    }}
    className="absolute left-6 top-1/2 -translate-y-1/2 w-12 h-12 rounded-full bg-white/15 text-white hover:bg-white/25 flex items-center justify-center transition-colors cursor-pointer"
    title="Önceki görsel"
  >
                      <ChevronLeft className="w-7 h-7" />
                    </button>}

                  <motion.img
    key={activeGalleryImage}
    initial={{ scale: 0.96, opacity: 0 }}
    animate={{ scale: 1, opacity: 1 }}
    exit={{ scale: 0.96, opacity: 0 }}
    referrerPolicy="no-referrer"
    src={activeGalleryImage}
    alt={`${selectedProfile.name} portfolyo ${galleryIndex + 1}`}
    className="max-h-[86vh] max-w-[82vw] object-contain rounded-3xl shadow-2xl bg-white"
    onClick={(event) => event.stopPropagation()}
  />

                  {portfolioImages.length > 1 && <button
    type="button"
    onClick={(event) => {
      event.stopPropagation();
      showNextImage();
    }}
    className="absolute right-6 top-1/2 -translate-y-1/2 w-12 h-12 rounded-full bg-white/15 text-white hover:bg-white/25 flex items-center justify-center transition-colors cursor-pointer"
    title="Sonraki görsel"
  >
                      <ChevronRight className="w-7 h-7" />
                    </button>}

                  <div className="absolute bottom-6 left-1/2 -translate-x-1/2 rounded-full bg-white/15 px-4 py-2 text-white text-xs font-extrabold tracking-wider">
                    {galleryIndex + 1} / {portfolioImages.length}
                  </div>
                </motion.div>}
            </AnimatePresence>
          </div>}
      </AnimatePresence>
    </div>;
}
export {
  ApprovalsTab as default
};

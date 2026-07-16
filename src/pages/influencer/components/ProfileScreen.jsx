import { useEffect, useState } from "react";
import { updateInfluencerProfile } from "../../../features/auth/authService";

const FALLBACK_AVATAR = "https://placehold.co/240x240?text=GI";
const DEFAULT_CATEGORIES = ["Teknoloji", "Yaşam Tarzı", "Moda", "Güzellik", "Seyahat", "Spor", "Eğitim", "Oyun"];

function ProfileScreen({ profile, user, onShowToast }) {
  const [saveStatus, setSaveStatus] = useState("idle");
  const [formData, setFormData] = useState(() => buildFormData(profile, user));

  useEffect(() => {
    setFormData(buildFormData(profile, user));
  }, [profile, user]);

  const handleFieldChange = (field, value) => {
    setFormData((current) => ({ ...current, [field]: value }));
  };

  const toggleCategory = (category) => {
    setFormData((current) => {
      const categories = current.categories.includes(category)
        ? current.categories.filter((item) => item !== category)
        : [...current.categories, category];

      return { ...current, categories };
    });
  };

  const handleSave = async () => {
    if (!user?.uid) return;

    setSaveStatus("saving");
    try {
      await updateInfluencerProfile(user.uid, formData);
      setSaveStatus("saved");
      onShowToast?.("Profil bilgileri kaydedildi.", "success");
      setTimeout(() => setSaveStatus("idle"), 2000);
    } catch (error) {
      setSaveStatus("idle");
      onShowToast?.(error.message || "Profil kaydedilemedi.", "error");
    }
  };

  const totalFollowers = Object.values(profile?.socialAccounts || {}).reduce((total, account) => (
    total + Number(account?.followers || 0)
  ), 0);

  return <div className="relative min-h-screen pb-16">
      <div className="bg-blob bg-primary-fixed/20 w-[500px] h-[500px] -top-24 -left-24" />
      <div className="bg-blob bg-secondary-container/20 w-[500px] h-[500px] -bottom-24 -right-24" />

      <div className="mb-8" id="profile-edit-header">
        <h1 className="text-3xl font-extrabold tracking-tight text-on-surface mb-2">Profil Düzenle</h1>
        <p className="text-base text-on-surface-variant">Influencer kimliğinizi markalara en iyi şekilde yansıtın.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6" id="profile-bento-grid">
        <div className="lg:col-span-1 space-y-6 flex flex-col">
          <div className="bg-white p-8 rounded-3xl border border-[#F1F1F1] shadow-[0px_10px_30px_rgba(176,38,255,0.06)] hover:scale-[1.01] transition-transform duration-300">
            <div className="flex flex-col items-center">
              <div className="w-32 h-32 rounded-full overflow-hidden border-4 border-primary-container">
                <img
    className="w-full h-full object-cover"
    alt={formData.displayName}
    src={formData.profileImageUrl || FALLBACK_AVATAR}
    referrerPolicy="no-referrer"
  />
              </div>
              <h2 className="mt-4 font-bold text-xl text-on-surface text-center">{formData.displayName || "İsimsiz profil"}</h2>
              <p className="text-on-surface-variant text-xs font-semibold uppercase tracking-wider mt-1 text-center">
                {formData.categories.length ? formData.categories.join(" & ") : "Kategori eklenmedi"}
              </p>
            </div>
          </div>

          <div className="bg-primary text-on-primary p-8 rounded-3xl shadow-lg relative overflow-hidden flex-1 min-h-[160px] flex flex-col justify-between">
            <div className="relative z-10">
              <div className="flex items-center space-x-2 mb-4">
                <span className="bg-tertiary-fixed text-black px-3 py-1 rounded-full text-[10px] font-extrabold uppercase tracking-widest">
                  {profile?.status === "approved" ? "ONAYLI" : "İNCELEMEDE"}
                </span>
              </div>
              <div className="text-4xl font-extrabold">{compactNumber(totalFollowers)}</div>
              <p className="text-xs font-bold opacity-90 mt-1 uppercase tracking-wider">Toplam Takipçi</p>
            </div>
            <div className="absolute right-[-20px] bottom-[-20px] opacity-15">
              <span className="material-symbols-outlined" style={{ fontSize: "120px" }}>query_stats</span>
            </div>
          </div>
        </div>

        <div className="lg:col-span-2 space-y-6">
          <div className="bg-white p-8 rounded-3xl border border-[#F1F1F1] shadow-[0px_10px_30px_rgba(176,38,255,0.06)]">
            <h3 className="font-bold text-lg text-on-surface mb-6 flex items-center gap-2">
              <span className="material-symbols-outlined text-primary">badge</span> Temel Bilgiler
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <label className="block text-xs font-bold text-on-surface-variant px-1">Görünen İsim</label>
                <input
    type="text"
    value={formData.displayName}
    onChange={(event) => handleFieldChange("displayName", event.target.value)}
    className="w-full bg-[#F8F9FA] border border-outline-variant rounded-2xl p-4 focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-all text-on-surface text-sm font-medium"
  />
              </div>
              <div className="space-y-2">
                <label className="block text-xs font-bold text-on-surface-variant px-1">Lokasyon</label>
                <div className="relative">
                  <input
    type="text"
    value={formData.location}
    onChange={(event) => handleFieldChange("location", event.target.value)}
    className="w-full bg-[#F8F9FA] border border-outline-variant rounded-2xl p-4 pl-12 focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-all text-on-surface text-sm font-medium"
  />
                  <span className="material-symbols-outlined absolute left-4 top-4 text-on-surface-variant text-[20px]">location_on</span>
                </div>
              </div>
              <div className="md:col-span-2 space-y-2">
                <label className="block text-xs font-bold text-on-surface-variant px-1">Profil Fotoğrafı URL</label>
                <input
    type="url"
    value={formData.profileImageUrl}
    onChange={(event) => handleFieldChange("profileImageUrl", event.target.value)}
    className="w-full bg-[#F8F9FA] border border-outline-variant rounded-2xl p-4 focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-all text-on-surface text-sm font-medium"
  />
              </div>
              <div className="md:col-span-2 space-y-2">
                <label className="block text-xs font-bold text-on-surface-variant px-1">Biyografi</label>
                <textarea
    rows={4}
    value={formData.bio}
    onChange={(event) => handleFieldChange("bio", event.target.value)}
    className="w-full bg-[#F8F9FA] border border-outline-variant rounded-2xl p-4 focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-all text-on-surface text-sm font-medium resize-none leading-relaxed"
  />
              </div>
            </div>
          </div>

          <div className="bg-white p-8 rounded-3xl border border-[#F1F1F1] shadow-[0px_10px_30px_rgba(176,38,255,0.06)]">
            <h3 className="font-bold text-lg text-on-surface mb-6 flex items-center gap-2">
              <span className="material-symbols-outlined text-primary">auto_awesome</span> İlgi Alanları & Kategoriler
            </h3>
            <div className="flex flex-wrap gap-3 mb-6" id="profile-interests-chips">
              {DEFAULT_CATEGORIES.map((category) => {
    const selected = formData.categories.includes(category);
    return <button
      type="button"
      key={category}
      onClick={() => toggleCategory(category)}
      className={`px-4 py-2 rounded-full border text-xs font-bold transition-colors ${selected ? "bg-primary/10 text-primary border-primary/20" : "border-outline-variant text-on-surface-variant hover:border-primary hover:text-primary"}`}
    >
                    {category}
                  </button>;
  })}
            </div>
          </div>

          <div className="flex flex-col md:flex-row items-center justify-end space-y-4 md:space-y-0 md:space-x-4 pt-4" id="profile-action-bar">
            <button
    onClick={() => setFormData(buildFormData(profile, user))}
    className="w-full md:w-auto px-8 py-4 border-2 border-primary text-primary rounded-3xl font-bold text-xs hover:bg-primary/5 transition-colors"
  >
              Vazgeç
            </button>
            <button
    onClick={handleSave}
    className="w-full md:w-auto px-12 py-4 bg-primary text-on-primary rounded-3xl font-bold text-xs hover:scale-[1.03] active:scale-95 transition-all neon-shadow flex items-center justify-center space-x-2"
  >
              {saveStatus === "idle" && <>
                  <span>Değişiklikleri Kaydet</span>
                  <span className="material-symbols-outlined text-base">save</span>
                </>}
              {saveStatus === "saving" && <>
                  <span>Kaydediliyor...</span>
                  <span className="material-symbols-outlined text-base animate-spin">sync</span>
                </>}
              {saveStatus === "saved" && <>
                  <span>Kaydedildi!</span>
                  <span className="material-symbols-outlined text-base">check_circle</span>
                </>}
            </button>
          </div>
        </div>
      </div>
    </div>;
}

function buildFormData(profile, user) {
  return {
    displayName: profile?.displayName || user?.email?.split("@")[0] || "",
    location: profile?.location || "",
    bio: profile?.bio || "",
    profileImageUrl: profile?.profileImageUrl || profile?.profileImage || "",
    categories: profile?.categories || [],
    socialAccounts: profile?.socialAccounts || {},
    pricing: profile?.pricing || {},
    portfolio: profile?.portfolio || [],
  };
}

function compactNumber(value) {
  return new Intl.NumberFormat("tr-TR", {
    notation: "compact",
    maximumFractionDigits: 1,
  }).format(Number(value || 0));
}

export {
  ProfileScreen as default
};

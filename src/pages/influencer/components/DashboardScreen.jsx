import { formatMoneyRange, getCurrencyCode } from "../../../utils/currency";

const FALLBACK_AVATAR = "https://placehold.co/160x160?text=GI";

function DashboardScreen({ onNavigate, profile, offers = [], needs = [] }) {
  const displayName = profile?.displayName || profile?.name || profile?.email?.split("@")[0] || "Influencer";
  const firstName = displayName.split(" ")[0] || displayName;
  const avatarUrl = profile?.profileImageUrl || profile?.profileImage || FALLBACK_AVATAR;
  const activeOffers = offers.filter((offer) => offer.status === "pending").length;
  const approvedOffers = offers.filter((offer) => offer.status === "approved").length;
  const recommendedNeeds = needs.slice(0, 2);
  const currency = getCurrencyCode(profile);

  return <div className="relative min-h-screen pb-16">
      <div className="bg-blob bg-secondary-container w-[500px] h-[500px] -top-24 -left-24" />
      <div className="bg-blob bg-tertiary-fixed w-[400px] h-[400px] bottom-0 -right-20" />
      <div className="bg-blob bg-primary-fixed/30 w-[300px] h-[300px] top-1/2 left-1/3 opacity-30" />

      <header className="flex justify-between items-center mb-10">
        <div id="dashboard-header-text">
          <h1 className="text-3xl font-extrabold tracking-tight text-on-surface">Merhaba, {firstName}</h1>
          <p className="text-on-surface-variant text-base mt-1">Bugün harika fırsatlar seni bekliyor.</p>
        </div>
        <div className="flex items-center gap-4" id="dashboard-header-actions">
          <button
    id="notification-btn"
    className="w-12 h-12 flex items-center justify-center rounded-full bg-white soft-glow text-on-surface-variant hover:text-primary transition-colors relative"
  >
            <span className="material-symbols-outlined">notifications</span>
            {!!activeOffers && <span className="absolute top-3 right-3 w-2.5 h-2.5 bg-error rounded-full border-2 border-white" />}
          </button>
          <div
    id="profile-avatar-clickable"
    onClick={() => onNavigate("profile")}
    className="w-12 h-12 rounded-full overflow-hidden border-2 border-primary-fixed soft-glow cursor-pointer hover:scale-105 transition-transform"
  >
            <img className="w-full h-full object-cover" alt={displayName} src={avatarUrl} referrerPolicy="no-referrer" />
          </div>
        </div>
      </header>

      <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-12" id="summary-cards">
        <StatCard icon="mail" value={activeOffers} label="Bekleyen Teklifler" onClick={() => onNavigate("offers")} tone="secondary" />
        <StatCard icon="handshake" value={approvedOffers} label="Aktif İşbirlikleri" tone="primary" />
        <StatCard icon="visibility" value={profile?.profileViews || 0} label="Profil Görüntülenme" tone="surface" />
        <StatCard icon="celebration" value={needs.length} label="Uygun Kampanyalar" onClick={() => onNavigate("needs")} tone="tertiary" />
      </section>

      <section id="recommended-brand-needs">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold text-on-surface">Sana Uygun Marka İhtiyaçları</h2>
          <button
    id="view-all-needs-btn"
    onClick={() => onNavigate("needs")}
    className="text-primary font-bold hover:underline flex items-center gap-1 text-sm"
  >
            Tümünü Gör <span className="material-symbols-outlined text-sm">arrow_forward</span>
          </button>
        </div>

        {!recommendedNeeds.length ? <div className="bg-white p-8 rounded-3xl soft-glow border border-surface-container text-center">
            <h3 className="font-bold text-lg text-on-surface">Şu an uygun kampanya yok</h3>
            <p className="text-on-surface-variant text-sm mt-2">Aktif marka kampanyaları yayınlandığında burada görünecek.</p>
          </div> : <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {recommendedNeeds.map((need) => <div
      key={need.id}
      className="bg-white p-8 rounded-3xl soft-glow border border-surface-container flex flex-col md:flex-row gap-6 hover:translate-y-[-4px] transition-all duration-300 relative overflow-hidden group"
    >
                <div className="absolute top-4 right-4 bg-tertiary-fixed text-on-tertiary-fixed px-4 py-1.5 rounded-full text-xs font-bold flex items-center gap-1 neon-purple-shadow z-10">
                  <span className="material-symbols-outlined text-sm">category</span>
                  %{need.matchScore} Uyum
                </div>
                <div className="w-24 h-24 rounded-2xl bg-surface-container-low flex-shrink-0 flex items-center justify-center overflow-hidden">
                  <img className="w-full h-full object-cover" alt={need.brandName} src={need.logoUrl} referrerPolicy="no-referrer" />
                </div>
                <div className="flex-1">
                  <div className="flex justify-between items-start mb-2 gap-4">
                    <h3 className="font-bold text-lg text-on-surface">{need.brandName}</h3>
                    <span className="text-primary font-extrabold text-sm md:text-base whitespace-nowrap">{formatMoneyRange(need.budgetMin, need.budgetMax, currency)}</span>
                  </div>
                  <p className="text-on-surface-variant text-sm mb-4 line-clamp-2">{need.description}</p>
                  <button
      onClick={() => onNavigate("needs")}
      className="w-full py-3 px-6 rounded-2xl bg-primary-container text-white font-bold neon-purple-shadow hover:scale-105 transition-transform active:scale-95 text-sm"
    >
                    Detayları Gör
                  </button>
                </div>
              </div>)}
          </div>}
      </section>
    </div>;
}

function StatCard({ icon, value, label, onClick, tone }) {
  const toneClasses = {
    secondary: "bg-secondary-container text-on-secondary-container",
    primary: "bg-primary-fixed text-on-primary-fixed-variant",
    surface: "bg-surface-container-low text-on-surface",
    tertiary: "bg-tertiary-fixed text-on-tertiary-fixed",
  };

  return <div
    onClick={onClick}
    className={`p-6 rounded-3xl ${toneClasses[tone] || toneClasses.surface} soft-glow flex flex-col gap-2 hover:scale-[1.02] transition-transform ${onClick ? "cursor-pointer" : "cursor-default"}`}
  >
      <span className="material-symbols-outlined text-primary text-2xl">{icon}</span>
      <div className="text-3xl font-extrabold">{String(value).padStart(2, "0")}</div>
      <div className="text-[12px] font-bold opacity-80 uppercase tracking-wider">{label}</div>
    </div>;
}

export {
  DashboardScreen as default
};

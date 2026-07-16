import { LayoutDashboard, CheckSquare, Users, Megaphone, Banknote, Plus, Settings } from "lucide-react";
function Sidebar({ activeTab, setActiveTab, onNewCampaignClick, platformSettings }) {
  const navItems = [
    { id: "dashboard", label: "Kontrol Paneli", icon: LayoutDashboard },
    { id: "approvals", label: "Onaylar", icon: CheckSquare },
    { id: "users", label: "Kullanıcılar", icon: Users },
    { id: "campaigns", label: "Kampanyalar", icon: Megaphone },
    { id: "payments", label: "Ödemeler", icon: Banknote },
    { id: "settings", label: "Ayarlar", icon: Settings }
  ];
  return <aside className="fixed left-0 top-0 h-screen w-64 flex flex-col border-r border-outline-variant bg-surface-container-lowest z-50 select-none">
      <div className="px-6 py-8 flex items-center gap-3">
        {platformSettings?.logoUrl && <img src={platformSettings.logoUrl} alt="Go Influence Logo" className="w-10 h-10 rounded-2xl object-contain bg-surface-container-low border border-outline-variant/30 p-1" />}
        <div>
        <h1 className="font-sans text-[24px] font-extrabold text-primary tracking-tight">{platformSettings?.brandName || "Go Influence"}</h1>
        <p className="font-sans text-xs font-semibold text-on-surface-variant/70 tracking-wider">Yönetim Paneli</p>
        </div>
      </div>

      <nav className="flex-1 px-4 space-y-2 overflow-y-auto scrollbar-hide">
        {navItems.map((item) => {
    const isActive = activeTab === item.id;
    const Icon = item.icon;
    return <button
      key={item.id}
      onClick={() => setActiveTab(item.id)}
      className={`w-full flex items-center gap-3 px-5 py-3.5 rounded-3xl transition-all duration-200 cursor-pointer ${isActive ? "bg-secondary-container text-on-secondary-container font-extrabold active-glow scale-[1.02]" : "text-on-surface-variant hover:bg-surface-container-high hover:scale-[1.01] font-medium"}`}
    >
              <Icon className={`w-5 h-5 ${isActive ? "stroke-[2.5px]" : "stroke-[2px]"}`} />
              <span className="text-sm tracking-wide">{item.label}</span>
            </button>;
  })}

        <div className="pt-6 pb-4">
          <button
    onClick={onNewCampaignClick}
    className="w-full bg-primary-container text-on-primary-container font-extrabold py-3.5 rounded-3xl shadow-lg shadow-primary-container/20 hover:scale-[1.02] hover:brightness-110 active:scale-[0.98] transition-all duration-200 flex items-center justify-center gap-2 cursor-pointer text-sm"
  >
            <Plus className="w-5 h-5" />
            Yeni Kampanya
          </button>
        </div>
      </nav>

      <div className="px-4 py-6 border-t border-outline-variant bg-surface-container-lowest" />
    </aside>;
}
export {
  Sidebar as default
};

import usePlatformSettings from "../../../features/settings/usePlatformSettings";

function Sidebar({ activeScreen, onNavigate }) {
  const platformSettings = usePlatformSettings();
  const menuItems = [
    { screen: "dashboard", label: "Kontrol Paneli", icon: "dashboard" },
    { screen: "offers", label: "Gelen Teklifler", icon: "local_offer" },
    { screen: "needs", label: "Marka \u0130htiya\xE7lar\u0131", icon: "campaign" },
    { screen: "profile", label: "Profilim", icon: "person" },
    { screen: "portfolio", label: "Portfolyo", icon: "photo_library" },
    { screen: "messages", label: "Mesajlar", icon: "forum" }
  ];
  return <aside className="hidden md:flex flex-col w-72 glass-nav fixed h-full z-40 p-6 border-r border-outline-variant/20 shadow-sm">
      <div className="mb-12 cursor-pointer" onClick={() => onNavigate("dashboard")}>
        <span className="font-sans text-2xl font-extrabold text-primary tracking-tight flex items-center gap-2">
          {platformSettings.logoUrl && <img src={platformSettings.logoUrl} alt="Go Influence Logo" className="w-8 h-8 object-contain" />}
          {platformSettings.brandName || "Go Influence"}
        </span>
      </div>

      <nav className="flex-1 space-y-2">
        {menuItems.map((item) => {
    const isActive = activeScreen === item.screen;
    return <button
      key={item.screen}
      onClick={() => onNavigate(item.screen)}
      className={`w-full flex items-center gap-3 px-4 py-3.5 rounded-2xl transition-all duration-200 group text-left ${isActive ? "bg-primary text-white font-bold shadow-md" : "text-on-surface-variant hover:bg-surface-container-high hover:text-primary"}`}
    >
              <span
      className="material-symbols-outlined text-[22px]"
      style={{ fontVariationSettings: isActive ? "'FILL' 1" : "'FILL' 0" }}
    >
                {item.icon}
              </span>
              <span className="text-sm font-semibold">{item.label}</span>
            </button>;
  })}
      </nav>

      <div className="pt-6 border-t border-outline-variant/30">
        <button
    onClick={() => onNavigate("settings")}
    className={`w-full flex items-center gap-3 px-4 py-3 rounded-2xl transition-all duration-200 text-left ${activeScreen === "settings" ? "bg-primary text-white font-bold shadow-md" : "text-on-surface-variant hover:bg-surface-container-high hover:text-primary"}`}
  >
          <span
    className="material-symbols-outlined text-[22px]"
    style={{ fontVariationSettings: activeScreen === "settings" ? "'FILL' 1" : "'FILL' 0" }}
  >
            settings
          </span>
          <span className="text-sm font-semibold">Ayarlar</span>
        </button>
      </div>
    </aside>;
}
export {
  Sidebar as default
};

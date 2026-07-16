function MobileNav({ activeScreen, onNavigate }) {
  return <nav className="md:hidden fixed bottom-0 left-0 right-0 bg-white/95 backdrop-blur-lg px-4 py-3 flex justify-between items-center z-50 border-t border-outline-variant/20 rounded-t-3xl shadow-lg">
      <button
    onClick={() => onNavigate("dashboard")}
    className={`flex flex-col items-center flex-1 py-1 ${activeScreen === "dashboard" ? "text-primary" : "text-on-surface-variant"}`}
  >
        <span className="material-symbols-outlined text-[24px]" style={{ fontVariationSettings: activeScreen === "dashboard" ? "'FILL' 1" : "'FILL' 0" }}>
          dashboard
        </span>
        <span className="text-[10px] font-bold mt-1">Panel</span>
      </button>

      <button
    onClick={() => onNavigate("offers")}
    className={`flex flex-col items-center flex-1 py-1 ${activeScreen === "offers" ? "text-primary" : "text-on-surface-variant"}`}
  >
        <span className="material-symbols-outlined text-[24px]" style={{ fontVariationSettings: activeScreen === "offers" ? "'FILL' 1" : "'FILL' 0" }}>
          local_offer
        </span>
        <span className="text-[10px] font-bold mt-1">Teklifler</span>
      </button>

      {
    /* Prominent center campaign button (Keşfet/İhtiyaçlar) */
  }
      <div className="relative -top-5 px-2">
        <button
    onClick={() => onNavigate("needs")}
    className="w-12 h-12 bg-primary text-white rounded-full flex items-center justify-center shadow-lg neon-glow active:scale-90 transition-transform"
  >
          <span className="material-symbols-outlined text-[24px]">campaign</span>
        </button>
      </div>

      <button
    onClick={() => onNavigate("messages")}
    className={`flex flex-col items-center flex-1 py-1 ${activeScreen === "messages" ? "text-primary" : "text-on-surface-variant"}`}
  >
        <span className="material-symbols-outlined text-[24px]" style={{ fontVariationSettings: activeScreen === "messages" ? "'FILL' 1" : "'FILL' 0" }}>
          forum
        </span>
        <span className="text-[10px] font-bold mt-1">Mesajlar</span>
      </button>

      <button
    onClick={() => onNavigate("profile")}
    className={`flex flex-col items-center flex-1 py-1 ${activeScreen === "profile" ? "text-primary" : "text-on-surface-variant"}`}
  >
        <span className="material-symbols-outlined text-[24px]" style={{ fontVariationSettings: activeScreen === "profile" ? "'FILL' 1" : "'FILL' 0" }}>
          person
        </span>
        <span className="text-[10px] font-bold mt-1">Profil</span>
      </button>
    </nav>;
}
export {
  MobileNav as default
};

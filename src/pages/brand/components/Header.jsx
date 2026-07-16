/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */
import { useState } from "react";
import { Bell, HelpCircle, LogOut, Search, Settings, UserCircle } from "lucide-react";
import { logoutUser } from "../../../features/auth/authService";
import usePlatformSettings from "../../../features/settings/usePlatformSettings";

function Header({
  brandProfile,
  searchQuery = "",
  searchResults = [],
  onSearchChange,
  onSearchResultClick,
  onNavigateToSettings
}) {
  const platformSettings = usePlatformSettings();
  const [showNotifications, setShowNotifications] = useState(false);
  const [unreadNotifications, setUnreadNotifications] = useState(true);
  const [showProfileMenu, setShowProfileMenu] = useState(false);
  const notifications = [
    { id: 1, text: "Melis Ay\u015Fe teklifinizi g\xF6r\xFCnt\xFCledi.", time: "5 dk \xF6nce" },
    { id: 2, text: "Derin Aksoy yeni bir mesaj g\xF6nderdi.", time: "12 dk \xF6nce" },
    { id: 3, text: "Can Demir teklifinizi kabul etti! \u{1F389}", time: "1 sa \xF6nce" }
  ];
  const goToSettings = () => {
    setShowProfileMenu(false);
    onNavigateToSettings();
  };
  const handleLogout = async () => {
    setShowProfileMenu(false);
    await logoutUser();
  };
  const hasSearchResults = searchQuery.trim().length > 0 && searchResults.length > 0;

  return <header className="fixed top-0 right-0 left-0 lg:left-72 h-20 glass-nav z-50 flex items-center justify-between px-6 md:px-12">
      <div className="flex items-center gap-3 lg:hidden">
        <span className="font-sans font-extrabold text-primary text-xl tracking-tighter flex items-center gap-2">
          {platformSettings.logoUrl && <img src={platformSettings.logoUrl} alt="Go Influence Logo" className="w-7 h-7 object-contain" />}
          {platformSettings.brandName || "Go Influence"}
        </span>
      </div>
      
      <div className="hidden lg:block">
        <h1 className="font-sans font-bold text-xl text-on-surface">
          Merhaba, {brandProfile.name || "Trendyol"} 👋
        </h1>
      </div>

      <div className="flex items-center gap-4 md:gap-6">
        <div className="relative hidden xl:block w-80">
          <Search className="w-4 h-4 absolute left-4 top-1/2 -translate-y-1/2 text-on-surface-variant/70" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => onSearchChange?.(e.target.value)}
            placeholder="Panelde ara..."
            className="w-full bg-surface-container border border-transparent rounded-2xl pl-12 pr-4 py-2.5 text-sm font-semibold outline-none focus:border-primary/40 focus:ring-2 focus:ring-primary-container transition-all text-on-surface placeholder:text-on-surface-variant/50"
          />
          {searchQuery.trim() && <div className="absolute left-0 right-0 top-12 rounded-3xl border border-outline-variant/40 bg-white shadow-2xl shadow-primary/10 overflow-hidden z-50">
              {hasSearchResults ? <div className="max-h-80 overflow-y-auto py-2">
                  {searchResults.map((result) => <button
        key={`${result.type}-${result.id}`}
        type="button"
        onMouseDown={(event) => event.preventDefault()}
        onClick={() => onSearchResultClick?.(result)}
        className="w-full px-4 py-3 text-left hover:bg-surface-container-low transition-colors flex items-start gap-3"
      >
                      <span className="mt-1 h-2 w-2 rounded-full bg-primary shrink-0" />
                      <span className="min-w-0">
                        <span className="block text-[10px] font-extrabold uppercase tracking-wider text-primary">{result.group}</span>
                        <span className="block text-sm font-bold text-on-surface truncate">{result.title}</span>
                        {result.description && <span className="block text-xs font-medium text-on-surface-variant truncate">{result.description}</span>}
                      </span>
                    </button>)}
                </div> : <div className="px-4 py-4 text-sm font-bold text-on-surface-variant">
                  Sonuç Bulunamadı
                </div>}
            </div>}
        </div>
        {
    /* Help Button */
  }
        <button className="flex items-center gap-2 text-on-surface-variant hover:text-primary transition-colors cursor-pointer p-1">
          <HelpCircle size={20} className="stroke-[2]" />
          <span className="font-semibold text-sm hidden md:inline">Yardım</span>
        </button>

        {
    /* Notification Bell */
  }
        <div className="relative">
          <button
    onClick={() => {
      setShowNotifications(!showNotifications);
      setUnreadNotifications(false);
    }}
    className="relative p-2 text-on-surface-variant hover:text-primary transition-colors rounded-full hover:bg-surface-container-low cursor-pointer"
  >
            <Bell size={22} className="stroke-[2]" />
            {unreadNotifications && <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-primary rounded-full border border-surface" />}
          </button>

          {showNotifications && <div className="absolute right-0 mt-3 w-80 bg-white rounded-2xl shadow-xl border border-outline-variant/30 py-3 z-50 animate-in fade-in slide-in-from-top-2 duration-200">
              <div className="px-4 pb-2 border-b border-surface-container flex justify-between items-center">
                <span className="font-bold text-sm text-on-surface">Bildirimler</span>
                <button
    onClick={() => setShowNotifications(false)}
    className="text-xs text-primary hover:underline font-semibold"
  >
                  Kapat
                </button>
              </div>
              <div className="divide-y divide-surface-container-low max-h-64 overflow-y-auto">
                {notifications.map((n) => <div key={n.id} className="p-3 hover:bg-surface-container-lowest transition-colors">
                    <p className="text-xs text-on-surface font-medium">{n.text}</p>
                    <span className="text-[10px] text-outline mt-1 block">{n.time}</span>
                  </div>)}
              </div>
            </div>}
        </div>

        {
    /* User Account / Profile Widget */
  }
        <div className="relative pl-4 border-l border-outline-variant/30">
          <button
    type="button"
    onClick={() => setShowProfileMenu((value) => !value)}
    className="flex items-center gap-3 cursor-pointer group focus:outline-none"
  >
            <div className="text-right hidden sm:block">
              <p className="font-semibold text-sm text-on-surface group-hover:text-primary transition-colors">
                {brandProfile.name ? `${brandProfile.name} Group` : "Trendyol Group"}
              </p>
              <p className="text-xs text-on-surface-variant">Yönetici</p>
            </div>
            <div className="w-10 h-10 rounded-full overflow-hidden border border-primary-container bg-surface-container-low transition-transform group-hover:scale-105">
              {brandProfile.logoUrl ? <img
      src={brandProfile.logoUrl}
      alt="Marka Logosu"
      className="w-full h-full object-cover"
      referrerPolicy="no-referrer"
    /> : <div className="w-full h-full flex items-center justify-center bg-primary-container text-white font-extrabold text-sm">
                  {brandProfile.name ? brandProfile.name[0].toUpperCase() : "T"}
                </div>}
            </div>
          </button>

          {showProfileMenu && <div className="absolute right-0 top-14 w-64 rounded-3xl border border-outline-variant/40 bg-white p-2 shadow-2xl shadow-primary/10 z-50">
              <div className="px-3 py-3 border-b border-outline-variant/30">
                <p className="text-sm font-extrabold text-on-surface">{brandProfile.name || "Trendyol Group"}</p>
                <p className="text-[11px] font-bold uppercase tracking-wider text-on-surface-variant/70">Marka Hesabı</p>
              </div>
              <button
    type="button"
    onClick={goToSettings}
    className="mt-2 w-full flex items-center gap-3 rounded-2xl px-3 py-2.5 text-sm font-bold text-on-surface-variant hover:bg-surface-container-high transition-colors cursor-pointer"
  >
                <UserCircle className="w-4 h-4" />
                Profilim
              </button>
              <button
    type="button"
    onClick={goToSettings}
    className="w-full flex items-center gap-3 rounded-2xl px-3 py-2.5 text-sm font-bold text-on-surface-variant hover:bg-surface-container-high transition-colors cursor-pointer"
  >
                <Settings className="w-4 h-4" />
                Ayarlar
              </button>
              <button
    type="button"
    onClick={handleLogout}
    className="w-full flex items-center gap-3 rounded-2xl px-3 py-2.5 text-sm font-extrabold text-error hover:bg-error-container/20 transition-colors cursor-pointer"
  >
                <LogOut className="w-4 h-4" />
                Çıkış Yap
              </button>
            </div>}
        </div>
      </div>
    </header>;
}
export {
  Header as default
};

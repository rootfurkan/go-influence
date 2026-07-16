import { useState } from "react";
import { Search, Bell, Mail, MessageSquare, Settings, LogOut } from "lucide-react";
import { logoutUser } from "../../../features/auth/authService";

const ADMIN_AVATAR_URL = "https://lh3.googleusercontent.com/aida-public/AB6AXuAedcHqHnitTkQO2icOziHLy-ReiBiUvOiJlCpbzMev_2wf7LFKsVOuW5oLp9gQnO16gWrsDnZTvjPZ4Gxfm3aGPUaSbkQOnQ_Q1-zzj4Q96fq8_aX6dbf6VrdrYReq6dZXhqhsPEz9hjUt0Ll948ce_qH2qAYjC4eXcv2xTNc2K8RAxu0aqV54gbmqozjC_iG_z1Gx_9b4Z6j8XTnDYsgxCrKdjC5ZfxiYbCPH1lqjoIMRiC_e70DC";

function Header({
  title,
  searchPlaceholder,
  searchVal,
  onSearchChange,
  searchResults = [],
  onSearchResultClick,
  onOpenNotifications,
  onOpenInbox,
  onOpenSettings
}) {
  const [isProfileMenuOpen, setIsProfileMenuOpen] = useState(false);
  const hasSearchResults = searchVal.trim().length > 0 && searchResults.length > 0;

  const handleLogout = async () => {
    setIsProfileMenuOpen(false);
    await logoutUser();
  };

  return <header className="fixed top-0 right-0 left-64 h-16 glass-nav flex justify-between items-center px-8 z-40">
      <div className="flex items-center gap-4 w-1/3">
        <div className="relative w-full max-w-sm">
          <Search className="w-4 h-4 absolute left-4 top-1/2 -translate-y-1/2 text-on-surface-variant/70" />
          <input
    type="text"
    value={searchVal}
    onChange={(e) => onSearchChange(e.target.value)}
    className="w-full bg-surface-container border-none rounded-2xl pl-12 pr-4 py-2.5 text-sm tracking-wide focus:ring-2 focus:ring-primary-container transition-all text-on-surface placeholder:text-on-surface-variant/50"
    placeholder={searchPlaceholder}
  />
          {searchVal.trim() && <div className="absolute left-0 right-0 top-12 rounded-3xl border border-outline-variant/40 bg-white shadow-2xl shadow-primary/10 overflow-hidden z-50">
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
                        <span className="block text-[11px] font-extrabold uppercase tracking-wider text-primary">{result.group}</span>
                        <span className="block text-sm font-bold text-on-surface truncate">{result.title}</span>
                        {result.description && <span className="block text-xs font-medium text-on-surface-variant truncate">{result.description}</span>}
                      </span>
                    </button>)}
                </div> : <div className="px-4 py-4 text-sm font-bold text-on-surface-variant">
                  Sonuç Bulunamadı
                </div>}
            </div>}
        </div>
      </div>

      <div className="flex items-center gap-6">
        <h3 className="hidden xl:block text-xs font-bold text-on-surface-variant/60 tracking-wider">
          {title}
        </h3>

        <div className="flex items-center gap-2 bg-surface-container-highest p-1 rounded-full border border-outline-variant/50">
          <button
    onClick={onOpenNotifications}
    className="p-2.5 hover:bg-surface-container-low rounded-full transition-colors text-on-surface-variant relative cursor-pointer"
    title="Bildirimler"
  >
            <Bell className="w-4.5 h-4.5" />
            <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-error-container rounded-full ring-2 ring-white" />
          </button>
          
          <button
    onClick={onOpenInbox}
    className="p-2.5 hover:bg-surface-container-low rounded-full transition-colors text-on-surface-variant cursor-pointer"
    title="Mesajlar"
  >
            <Mail className="w-4.5 h-4.5" />
          </button>
          
          <button
    className="p-2.5 hover:bg-surface-container-low rounded-full transition-colors text-on-surface-variant cursor-pointer"
    title="Canlı Destek"
  >
            <MessageSquare className="w-4.5 h-4.5" />
          </button>

          <div className="relative ml-2">
            <button
    type="button"
    onClick={() => setIsProfileMenuOpen((value) => !value)}
    className="w-8 h-8 rounded-full overflow-hidden border border-outline-variant shadow-sm cursor-pointer focus:outline-none focus:ring-2 focus:ring-primary/30"
    title="Admin menüsü"
  >
              <img
    referrerPolicy="no-referrer"
    className="w-full h-full object-cover"
    src={ADMIN_AVATAR_URL}
    alt="Avatar"
  />
            </button>

            {isProfileMenuOpen && <div className="absolute right-0 top-12 w-56 rounded-3xl border border-outline-variant/40 bg-white p-2 shadow-2xl shadow-primary/10 z-50">
                <div className="px-3 py-3 border-b border-outline-variant/30">
                  <p className="text-sm font-extrabold text-on-background">Go Influence Admin</p>
                  <p className="text-[11px] font-bold uppercase tracking-wider text-on-surface-variant/70">Süper Admin</p>
                </div>
                <button
    type="button"
    onClick={() => {
      setIsProfileMenuOpen(false);
      onOpenSettings?.();
    }}
    className="mt-2 w-full flex items-center gap-3 rounded-2xl px-3 py-2.5 text-sm font-bold text-on-surface-variant hover:bg-surface-container-high transition-colors cursor-pointer"
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
      </div>
    </header>;
}
export {
  Header as default
};

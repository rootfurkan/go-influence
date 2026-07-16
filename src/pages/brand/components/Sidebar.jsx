/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */
import {
  LayoutDashboard,
  Megaphone,
  PlusCircle,
  BarChart2,
  FileText,
  Mail,
  Settings,
  Headphones,
  Menu,
  X
} from "lucide-react";
import usePlatformSettings from "../../../features/settings/usePlatformSettings";
function Sidebar({ currentTab, onTabChange, isOpen, onToggle }) {
  const platformSettings = usePlatformSettings();
  const menuItems = [
    { id: "dashboard", label: "Kontrol Paneli", icon: LayoutDashboard },
    { id: "campaigns", label: "Kampanyalar\u0131m", icon: Megaphone },
    { id: "new_campaign", label: "Yeni Kampanya Olu\u015Ftur", icon: PlusCircle },
    { id: "matches", label: "E\u015Fle\u015Fme Sonu\xE7lar\u0131", icon: BarChart2 },
    { id: "offers", label: "Teklifler", icon: FileText },
    { id: "messages", label: "Mesajlar", icon: Mail }
  ];
  const handleItemClick = (id) => {
    onTabChange(id);
    if (isOpen) {
      onToggle();
    }
  };
  const renderSidebarContent = () => <div className="p-8 h-full flex flex-col justify-between">
      <div>
        {
    /* Brand Logo */
  }
        <span className="font-sans font-extrabold text-primary text-2xl tracking-tighter mb-12 flex items-center gap-2">
          {platformSettings.logoUrl && <img src={platformSettings.logoUrl} alt="Go Influence Logo" className="w-8 h-8 object-contain" />}
          {platformSettings.brandName || "Go Influence"}
        </span>

        {
    /* Primary Navigation */
  }
        <nav className="space-y-2">
          {menuItems.map((item) => {
    const Icon = item.icon;
    const isActive = currentTab === item.id;
    return <button
      key={item.id}
      onClick={() => handleItemClick(item.id)}
      className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all font-semibold text-sm cursor-pointer text-left ${isActive ? "bg-secondary-container text-primary font-bold" : "text-on-surface-variant hover:bg-surface-container-high hover:text-on-surface"}`}
    >
                <Icon size={18} className="stroke-[2.5]" />
                <span>{item.label}</span>
              </button>;
  })}
        </nav>

        {
    /* Separator and Settings */
  }
        <div className="mt-8 pt-6 border-t border-outline-variant/30 space-y-2">
          <button
    onClick={() => handleItemClick("settings")}
    className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all font-semibold text-sm cursor-pointer text-left ${currentTab === "settings" ? "bg-secondary-container text-primary font-bold" : "text-on-surface-variant hover:bg-surface-container-high"}`}
  >
            <Settings size={18} className="stroke-[2]" />
            <span>Ayarlar</span>
          </button>
        </div>
      </div>

      {
    /* Support Banner Card */
  }
      <div className="mt-auto pt-6">
        <div
    onClick={() => handleItemClick("messages")}
    className="bg-primary-container p-5 rounded-3xl text-on-primary-container relative overflow-hidden group cursor-pointer transition-all hover:scale-[1.02]"
  >
          <div className="relative z-10">
            <p className="font-semibold text-[10px] opacity-80 uppercase tracking-wider mb-1">Destek Hattı</p>
            <p className="font-bold text-sm leading-tight">Bir sorun mu var? Canlı destekle görüş.</p>
          </div>
          <Headphones
    size={64}
    className="absolute -bottom-2 -right-2 text-white opacity-20 transform group-hover:rotate-12 transition-transform"
  />
        </div>
      </div>
    </div>;
  return <>
      {
    /* Mobile Toggle Trigger Button */
  }
      <button
    onClick={onToggle}
    className="lg:hidden fixed top-5 left-5 z-99 p-2.5 bg-white shadow-md border border-outline-variant/30 rounded-xl cursor-pointer text-primary"
  >
        {isOpen ? <X size={20} /> : <Menu size={20} />}
      </button>

      {
    /* Desktop Sidebar (Permanent) */
  }
      <aside className="fixed left-0 top-0 h-screen w-72 bg-surface-container-lowest border-r border-outline-variant/20 hidden lg:flex flex-col z-[60]">
        {renderSidebarContent()}
      </aside>

      {
    /* Mobile Sidebar Slide-Over Drawer */
  }
      {isOpen && <div
    className="fixed inset-0 bg-black/40 z-[70] lg:hidden"
    onClick={onToggle}
  />}
      
      <aside
    className={`fixed left-0 top-0 h-screen w-72 bg-surface-container-lowest border-r border-outline-variant/20 flex flex-col z-[80] lg:hidden transition-transform duration-300 ease-in-out ${isOpen ? "translate-x-0" : "-translate-x-full"}`}
  >
        {renderSidebarContent()}
      </aside>
    </>;
}
export {
  Sidebar as default
};

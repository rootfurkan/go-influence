import React, { useState } from "react";
import { Menu, X, ArrowRight } from "lucide-react";
import usePlatformSettings from "../../../features/settings/usePlatformSettings";

export default function Navbar({ currentPage, navigateTo, currentUser, onGoToPanel }) {
  const [isOpen, setIsOpen] = useState(false);
  const platformSettings = usePlatformSettings();

  const links = [
    { id: "how-it-works", label: "Nasıl Çalışır" },
    { id: "brands", label: "Markalar İçin" },
    { id: "influencers", label: "Influencerlar İçin" },
    { id: "contact", label: "İletişim" },
  ];

  const handleLinkClick = (id) => {
    navigateTo(id);
    setIsOpen(false);
  };

  return (
    <nav className="fixed top-0 w-full z-50 bg-white/70 backdrop-blur-xl border-b border-white/20 shadow-[0px_10px_30px_rgba(176,38,255,0.06)]">
      <div className="max-w-[1280px] mx-auto px-6 md:px-16 py-4 flex justify-between items-center h-20">
        {/* Logo */}
        <div 
          onClick={() => handleLinkClick("home")}
          className="font-sans text-2xl font-extrabold text-primary cursor-pointer hover:opacity-90 select-none tracking-tight flex items-center gap-2"
        >
          {platformSettings.logoUrl && <img src={platformSettings.logoUrl} alt="Go Influence Logo" className="w-8 h-8 object-contain" />}
          {platformSettings.brandName || "Go Influence"}
        </div>

        {/* Desktop Navigation */}
        <div className="hidden md:flex items-center gap-8">
          {links.map((link) => {
            const isActive = currentPage === link.id;
            return (
              <button
                key={link.id}
                onClick={() => handleLinkClick(link.id)}
                className={`font-sans text-base transition-all duration-200 cursor-pointer pb-1 border-b-2 hover:text-primary ${
                  isActive
                    ? "text-primary font-bold border-primary"
                    : "text-on-surface-variant hover:border-transparent border-transparent"
                }`}
              >
                {link.label}
              </button>
            );
          })}
        </div>

        {/* Action Buttons */}
        <div className="hidden md:flex items-center gap-4">
          {currentUser ? (
            <button
              onClick={onGoToPanel}
              className="bg-primary-container text-white px-6 py-2.5 rounded-full font-sans font-semibold text-sm hover:scale-105 active:scale-95 transition-all shadow-lg hover:shadow-primary/20 cursor-pointer flex items-center gap-1.5"
            >
              Panele Git
              <ArrowRight className="w-4 h-4" />
            </button>
          ) : (
            <>
              <button
                onClick={() => handleLinkClick("login")}
                className="text-on-surface-variant font-sans font-medium text-base hover:text-primary transition-colors cursor-pointer"
              >
                Giriş Yap
              </button>
              <button
                onClick={() => handleLinkClick("register")}
                className="bg-primary-container text-white px-6 py-2.5 rounded-full font-sans font-semibold text-sm hover:scale-105 active:scale-95 transition-all shadow-lg hover:shadow-primary/20 cursor-pointer flex items-center gap-1.5"
              >
                Ücretsiz Başla
                <ArrowRight className="w-4 h-4" />
              </button>
            </>
          )}
        </div>

        {/* Mobile menu button */}
        <div className="md:hidden flex items-center gap-3">
          <button
            onClick={() => currentUser ? onGoToPanel() : handleLinkClick("register")}
            className="bg-primary-container text-white px-4 py-1.5 rounded-full font-sans font-semibold text-xs hover:scale-105 transition-all shadow-sm cursor-pointer"
          >
            {currentUser ? "Panel" : "Başla"}
          </button>
          <button
            onClick={() => setIsOpen(!isOpen)}
            className="text-on-surface hover:text-primary transition-colors p-1 cursor-pointer"
            aria-label="Toggle Menu"
          >
            {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer */}
      {isOpen && (
        <div className="md:hidden bg-white border-b border-surface-container-low px-6 py-6 space-y-4 animate-in fade-in slide-in-from-top-4 duration-200">
          <div className="flex flex-col gap-4">
            {links.map((link) => {
              const isActive = currentPage === link.id;
              return (
                <button
                  key={link.id}
                  onClick={() => handleLinkClick(link.id)}
                  className={`text-left font-sans text-base py-2 border-l-4 pl-3 transition-colors ${
                    isActive
                      ? "text-primary font-bold border-primary bg-primary/5"
                      : "text-on-surface-variant border-transparent hover:text-primary hover:bg-surface/50"
                  }`}
                >
                  {link.label}
                </button>
              );
            })}
            <hr className="border-surface-container-low my-1" />
            <div className="flex items-center justify-between pt-2">
              {currentUser ? (
                <button
                  onClick={() => {
                    onGoToPanel();
                    setIsOpen(false);
                  }}
                  className="bg-primary text-white px-5 py-2 rounded-full font-sans font-semibold text-sm hover:scale-105 transition-all shadow-md cursor-pointer flex items-center gap-1.5"
                >
                  Panele Git
                  <ArrowRight className="w-4 h-4" />
                </button>
              ) : (
                <>
                  <button
                    onClick={() => handleLinkClick("login")}
                    className="text-on-surface-variant font-sans font-medium text-base hover:text-primary py-2 cursor-pointer"
                  >
                    Giriş Yap
                  </button>
                  <button
                    onClick={() => handleLinkClick("register")}
                    className="bg-primary text-white px-5 py-2 rounded-full font-sans font-semibold text-sm hover:scale-105 transition-all shadow-md cursor-pointer"
                  >
                    Hesap Oluştur
                  </button>
                </>
              )}
            </div>
          </div>
        </div>
      )}
    </nav>
  );
}

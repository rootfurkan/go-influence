import React from "react";
import { Youtube, Instagram, Twitter, Linkedin, Heart } from "lucide-react";

export default function Footer({ navigateTo }) {
  const currentYear = new Date().getFullYear();

  const handleLinkClick = (id) => {
    navigateTo(id);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <footer className="bg-white border-t border-surface-container-low pt-16 pb-12">
      <div className="max-w-[1280px] mx-auto px-6 md:px-16 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-6 gap-10">
        
        {/* Brand Description Column */}
        <div className="lg:col-span-2 space-y-6">
          <div 
            onClick={() => handleLinkClick("home")}
            className="text-2xl font-extrabold text-primary cursor-pointer hover:opacity-90 tracking-tight"
          >
            Go Influence
          </div>
          <p className="text-on-surface-variant font-sans text-sm leading-relaxed max-w-sm">
            Türkiye'nin öncü influencer marketing platformu. Akıllı eşleştirme algoritmalarıyla doğru markaları, doğru kreatiflerle bir araya getiriyoruz.
          </p>
          <div className="flex items-center gap-4 text-on-surface-variant">
            <a href="#" className="hover:text-primary transition-colors p-2 bg-surface rounded-full" aria-label="Instagram">
              <Instagram className="w-5 h-5" />
            </a>
            <a href="#" className="hover:text-primary transition-colors p-2 bg-surface rounded-full" aria-label="Twitter">
              <Twitter className="w-5 h-5" />
            </a>
            <a href="#" className="hover:text-primary transition-colors p-2 bg-surface rounded-full" aria-label="LinkedIn">
              <Linkedin className="w-5 h-5" />
            </a>
            <a href="#" className="hover:text-primary transition-colors p-2 bg-surface rounded-full" aria-label="YouTube">
              <Youtube className="w-5 h-5" />
            </a>
          </div>
        </div>

        {/* Column 2: Kurumsal */}
        <div>
          <h4 className="font-sans font-bold text-sm text-on-surface uppercase tracking-wider mb-5">Kurumsal</h4>
          <ul className="space-y-3 font-sans text-sm text-on-surface-variant">
            <li><a href="#" className="hover:text-primary transition-colors">Hakkımızda</a></li>
            <li><a href="#" className="hover:text-primary transition-colors">Kariyer</a></li>
            <li><a href="#" className="hover:text-primary transition-colors">Basın Kiti</a></li>
            <li>
              <button onClick={() => handleLinkClick("contact")} className="hover:text-primary transition-colors text-left cursor-pointer">
                İletişim
              </button>
            </li>
          </ul>
        </div>

        {/* Column 3: Ürün */}
        <div>
          <h4 className="font-sans font-bold text-sm text-on-surface uppercase tracking-wider mb-5">Platform</h4>
          <ul className="space-y-3 font-sans text-sm text-on-surface-variant">
            <li>
              <button onClick={() => handleLinkClick("brands")} className="hover:text-primary transition-colors text-left cursor-pointer">
                Markalar İçin
              </button>
            </li>
            <li>
              <button onClick={() => handleLinkClick("influencers")} className="hover:text-primary transition-colors text-left cursor-pointer">
                Influencerlar İçin
              </button>
            </li>
            <li>
              <button onClick={() => handleLinkClick("how-it-works")} className="hover:text-primary transition-colors text-left cursor-pointer">
                Nasıl Çalışır?
              </button>
            </li>
            <li><a href="#" className="hover:text-primary transition-colors">Başarı Hikayeleri</a></li>
          </ul>
        </div>

        {/* Column 4: Kaynaklar */}
        <div>
          <h4 className="font-sans font-bold text-sm text-on-surface uppercase tracking-wider mb-5">Kaynaklar</h4>
          <ul className="space-y-3 font-sans text-sm text-on-surface-variant">
            <li><a href="#" className="hover:text-primary transition-colors">Blog</a></li>
            <li><a href="#" className="hover:text-primary transition-colors">Akademi</a></li>
            <li><a href="#" className="hover:text-primary transition-colors">SSS</a></li>
            <li><a href="#" className="hover:text-primary transition-colors">Topluluk</a></li>
          </ul>
        </div>

        {/* Column 5: Yasal */}
        <div>
          <h4 className="font-sans font-bold text-sm text-on-surface uppercase tracking-wider mb-5">Yasal</h4>
          <ul className="space-y-3 font-sans text-sm text-on-surface-variant">
            <li><a href="#" className="hover:text-primary transition-colors">Kullanım Koşulları</a></li>
            <li><a href="#" className="hover:text-primary transition-colors">Gizlilik Politikası</a></li>
            <li><a href="#" className="hover:text-primary transition-colors">KVKK Aydınlatma</a></li>
            <li><a href="#" className="hover:text-primary transition-colors">Çerez Politikası</a></li>
          </ul>
        </div>

      </div>

      <div className="max-w-[1280px] mx-auto px-6 md:px-16 mt-16 pt-8 border-t border-surface-container-low flex flex-col md:flex-row justify-between items-center gap-4 text-on-surface-variant text-sm font-sans">
        <div>
          &copy; {currentYear} Go Influence. Tüm hakları saklıdır.
        </div>
        <div className="flex items-center gap-1.5 text-xs text-on-surface-variant/70">
          İstanbul, Türkiye ile <Heart className="w-3.5 h-3.5 text-red-500 fill-red-500" /> geliştirildi.
        </div>
      </div>
    </footer>
  );
}

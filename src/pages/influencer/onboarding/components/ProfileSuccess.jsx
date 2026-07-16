import React, { useState } from 'react';
import { 
  CheckCircle2, MapPin, Instagram, Video, Youtube, Twitter, Copy, RotateCcw, Share2 
} from 'lucide-react';


export default function ProfileSuccess({ formData, currencySelected, onReset }) {
  const [copied, setCopied] = useState(false);
  const [sharedNetwork, setSharedNetwork] = useState(null);

  const handleCopyLink = () => {
    setCopied(true);
    navigator.clipboard?.writeText(window.location.href);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleShareSimulate = (network) => {
    setSharedNetwork(network);
    setTimeout(() => setSharedNetwork(null), 3000);
  };

  return (
    <div className="space-y-8 animate-page-fade">
      {/* Header Congratulations */}
      <div className="text-center max-w-xl mx-auto space-y-3">
        <div className="inline-flex items-center justify-center w-16 h-16 bg-green-100 text-green-600 rounded-full mb-2 shadow-sm">
          <CheckCircle2 size={36} className="font-bold text-green-600 animate-bounce" />
        </div>
        <h2 className="text-3xl font-display font-extrabold text-on-surface tracking-tight">
          Profiliniz Onaya Gönderildi!
        </h2>
        <p className="text-on-surface-variant text-base">
          Tebrikler <strong>{formData.displayName}</strong>, kaydınız başarıyla alındı. Markalarla eşleşmeye hazırsınız! Sizin için hazırlanan önizleme kartını inceleyebilirsiniz.
        </p>
      </div>

      {/* Main Two-Column view: Left is Profile Card, Right is Action Items */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* Creator Profile Live Preview Card */}
        <div className="lg:col-span-7 bg-white rounded-3xl border border-surface-container-high shadow-[0_12px_40px_rgba(176,38,255,0.06)] overflow-hidden">
          {/* Header Banner Background */}
          <div className="h-32 bg-gradient-to-r from-primary to-primary-container relative">
            <div className="absolute top-4 right-4 bg-white/20 backdrop-blur-md px-3 py-1 rounded-full text-xs text-white font-bold tracking-wider flex items-center gap-1">
              <span className="w-2 h-2 bg-green-400 rounded-full animate-pulse" />
              AKTİF PROFİL
            </div>
          </div>

          {/* Profile Details Container */}
          <div className="p-6 md:p-8 -mt-14 relative space-y-6">
            {/* Avatar and Name */}
            <div className="flex flex-col sm:flex-row items-center sm:items-end gap-4 text-center sm:text-left">
              <div className="w-24 h-24 rounded-full border-4 border-white shadow-md overflow-hidden bg-surface-container-low">
                <img 
                  src={formData.profileImage || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=256&h=256'} 
                  alt="Avatar" 
                  className="w-full h-full object-cover"
                  referrerPolicy="no-referrer"
                />
              </div>
              <div className="mb-2">
                <h3 className="text-2xl font-display font-extrabold text-on-surface tracking-tight">
                  {formData.displayName || 'İsimsiz İçerik Üreticisi'}
                </h3>
                <p className="text-xs text-on-surface-variant font-medium flex items-center justify-center sm:justify-start gap-1">
                  <MapPin size={14} className="text-primary" />
                  {formData.location}
                </p>
              </div>
            </div>

            {/* Biography */}
            <div className="space-y-2">
              <h4 className="text-[10px] uppercase tracking-wider text-on-surface-variant font-bold">Hakkımda</h4>
              <p className="text-sm text-on-surface-variant leading-relaxed bg-surface-container-low p-4 rounded-2xl">
                {formData.bio || 'Henüz bir biyografi eklenmedi.'}
              </p>
            </div>

            {/* Selected Categories */}
            <div className="space-y-2">
              <h4 className="text-[10px] uppercase tracking-wider text-on-surface-variant font-bold">Kategoriler</h4>
              <div className="flex flex-wrap gap-2">
                {formData.interests.map(interestId => (
                  <span 
                    key={interestId}
                    className="bg-primary/5 text-primary border border-primary/10 text-xs px-3.5 py-1.5 rounded-full font-bold uppercase tracking-wide"
                  >
                    #{interestId}
                  </span>
                ))}
              </div>
            </div>

            {/* Connected Socials */}
            <div className="space-y-3">
              <h4 className="text-[10px] uppercase tracking-wider text-on-surface-variant font-bold">Sosyal Medya Kanalları</h4>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {Object.keys(formData.socials).map(platformId => {
                  const s = formData.socials[platformId];
                  const details = {
                    instagram: { icon: <Instagram size={16} />, name: 'Instagram', bg: 'bg-secondary-container/30 text-secondary' },
                    tiktok: { icon: <Video size={16} />, name: 'TikTok', bg: 'bg-primary-fixed text-primary' },
                    youtube: { icon: <Youtube size={16} />, name: 'YouTube', bg: 'bg-error-container/30 text-error' },
                    twitter: { icon: <Twitter size={16} />, name: 'X', bg: 'bg-tertiary-fixed text-on-tertiary-fixed-variant' }
                  }[platformId] || { icon: <Share2 size={16} />, name: 'Social', bg: 'bg-surface-container' };

                  return (
                    <div key={platformId} className="flex items-center justify-between p-3.5 bg-surface-container-low rounded-2xl border border-surface-container">
                      <div className="flex items-center gap-2.5">
                        <div className={`w-8 h-8 rounded-full flex items-center justify-center ${details.bg}`}>
                          {details.icon}
                        </div>
                        <div>
                          <p className="text-xs font-bold text-on-surface">{details.name}</p>
                          <p className="text-[11px] text-on-surface-variant font-medium">{s.handle}</p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="text-xs font-extrabold text-primary">{s.followers}</p>
                        <p className="text-[10px] text-on-surface-variant font-bold">TAKİPÇİ</p>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Estimated Pricing */}
            <div className="space-y-3 pt-4 border-t border-surface-container">
              <h4 className="text-[10px] uppercase tracking-wider text-on-surface-variant font-bold">Fiyatlandırma</h4>
              <div className="grid grid-cols-3 gap-3">
                <div className="p-3 bg-primary/[0.02] border border-primary/5 rounded-2xl text-center">
                  <p className="text-[10px] text-on-surface-variant font-bold uppercase">Post</p>
                  <p className="text-sm font-extrabold text-primary mt-1">
                    {formData.pricing.post.min || '2K'} - {formData.pricing.post.max || '5K'} {currencySelected}
                  </p>
                </div>
                <div className="p-3 bg-primary/[0.02] border border-primary/5 rounded-2xl text-center">
                  <p className="text-[10px] text-on-surface-variant font-bold uppercase">Story</p>
                  <p className="text-sm font-extrabold text-primary mt-1">
                    {formData.pricing.story.min || '1K'} - {formData.pricing.story.max || '3K'} {currencySelected}
                  </p>
                </div>
                <div className="p-3 bg-primary/[0.02] border border-primary/5 rounded-2xl text-center">
                  <p className="text-[10px] text-on-surface-variant font-bold uppercase">Reels</p>
                  <p className="text-sm font-extrabold text-primary mt-1">
                    {formData.pricing.reels.min || '3K'} - {formData.pricing.reels.max || '8K'} {currencySelected}
                  </p>
                </div>
              </div>
            </div>

            {/* Portfolio Carousel / Bento */}
            {formData.portfolio.length > 0 && (
              <div className="space-y-3">
                <h4 className="text-[10px] uppercase tracking-wider text-on-surface-variant font-bold">Portfolyo</h4>
                <div className="grid grid-cols-3 gap-2">
                  {formData.portfolio.slice(0, 3).map((img, i) => (
                    <div key={i} className="aspect-square rounded-2xl overflow-hidden shadow-sm border border-surface-container">
                      <img 
                        src={img} 
                        alt="work" 
                        className="w-full h-full object-cover" 
                        referrerPolicy="no-referrer"
                      />
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Action Panel & Simulated Matching Opportunities */}
        <div className="lg:col-span-5 space-y-6">
          
          {/* Quick Actions Card */}
          <div className="glass-card rounded-3xl p-6 border-white/40 space-y-4 shadow-sm">
            <h3 className="font-display font-bold text-lg text-on-surface">İşlemler</h3>
            
            <div className="space-y-3">
              {/* Copy Profile Link */}
              <button
                type="button"
                onClick={handleCopyLink}
                className="w-full py-4 px-5 bg-primary text-white rounded-2xl font-bold text-sm shadow-md hover:scale-[1.01] transition-transform flex items-center justify-center gap-2.5 cursor-pointer"
              >
                {copied ? <CheckCircle2 size={16} /> : <Copy size={16} />}
                {copied ? 'Profil Linki Kopyalandı!' : 'Profil Linkini Paylaş'}
              </button>
              {/* Re-create / Edit Profile button */}
              <button
                type="button"
                onClick={onReset}
                className="w-full py-4 px-5 bg-surface-container text-on-surface-variant hover:text-on-surface hover:bg-surface-container-high rounded-2xl font-bold text-sm transition-all flex items-center justify-center gap-2.5 cursor-pointer"
              >
                <RotateCcw size={16} />
                Profili Yeniden Düzenle / Yeni Profil
              </button>
            </div>
          </div>
          {/* Social Share Badges */}
          <div className="text-center space-y-2">
            <span className="text-[10px] uppercase tracking-wider text-on-surface-variant font-bold">
              KOLAY PAYLAŞIM
            </span>
            {sharedNetwork && (
              <div className="text-xs text-green-600 font-bold bg-green-50 py-1.5 px-3 rounded-full animate-fade-in inline-block">
                {sharedNetwork} üzerinde paylaşım bağlantısı simüle edildi!
              </div>
            )}
            <div className="flex justify-center gap-3">
              {['Facebook', 'Twitter', 'LinkedIn', 'WhatsApp'].map(network => (
                <button
                  key={network}
                  type="button"
                  onClick={() => handleShareSimulate(network)}
                  className="w-10 h-10 rounded-full bg-surface-container-low border border-surface-container-high hover:border-primary hover:text-primary hover:scale-105 transition-all text-on-surface-variant text-xs font-bold flex items-center justify-center cursor-pointer"
                  title={`${network}'ta paylaş`}
                >
                  <Share2 size={16} />
                </button>
              ))}
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}



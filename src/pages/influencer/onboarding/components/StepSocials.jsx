import React, { useState } from 'react';
import { 
  Instagram, Video, Youtube, Twitter, CheckCircle2, BarChart3, Info, AlertTriangle, ArrowLeft, ArrowRight 
} from 'lucide-react';

const SOCIAL_PLATFORMS = [
  { id: 'instagram', label: 'Instagram', description: 'Görsel & Reels İçerikleri', color: 'bg-secondary-container text-secondary border-secondary/20', accent: 'instagram' },
  { id: 'tiktok', label: 'TikTok', description: 'Kısa Video & Trendler', color: 'bg-primary-fixed text-primary border-primary-fixed-dim', accent: 'tiktok' },
  { id: 'youtube', label: 'YouTube', description: 'Uzun Format & Vlog', color: 'bg-error-container text-error border-error-container', accent: 'youtube' },
  { id: 'twitter', label: 'X (Twitter)', description: 'Gündem & Etkileşim', color: 'bg-tertiary-fixed text-on-tertiary-fixed-variant border-tertiary-fixed-dim', accent: 'twitter' },
];

const renderPlatformIcon = (platformId) => {
  switch (platformId) {
    case 'instagram': return <Instagram size={24} />;
    case 'tiktok': return <Video size={24} />;
    case 'youtube': return <Youtube size={24} />;
    case 'twitter': return <Twitter size={24} />;
    default: return <Instagram size={24} />;
  }
};

export default function StepSocials({ formData, setFormData, onNext, onPrev }) {
  const [analyzingPlatform, setAnalyzingPlatform] = useState(null);
  const [analysisResults, setAnalysisResults] = useState({});
  const [showError, setShowError] = useState(false);

  const handlePlatformToggle = (platformId) => {
    setShowError(false);
    const existing = formData.socials[platformId];
    if (existing) {
      // Toggle off / disable
      const copy = { ...formData.socials };
      delete copy[platformId];
      setFormData(prev => ({ ...prev, socials: copy }));
      
      // Clear analysis if any
      const analysisCopy = { ...analysisResults };
      delete analysisCopy[platformId];
      setAnalysisResults(analysisCopy);
    } else {
      // Toggle on
      setFormData(prev => ({
        ...prev,
        socials: {
          ...prev.socials,
          [platformId]: { handle: '', followers: '' }
        }
      }));
    }
  };

  const handleInputChange = (platformId, field, value) => {
    setFormData(prev => ({
      ...prev,
      socials: {
        ...prev.socials,
        [platformId]: {
          ...prev.socials[platformId],
          [field]: value
        }
      }
    }));
  };

  const simulateAnalysis = (platformId) => {
    const accountData = formData.socials[platformId];
    if (!accountData || !accountData.handle) return;

    setAnalyzingPlatform(platformId);

    setTimeout(() => {
      const followersNum = parseFloat(accountData.followers) || 12.5;
      const fakeEngagement = (Math.random() * 4 + 2.1).toFixed(2); // 2.1% - 6.1%
      const fakeAvgViews = Math.round(followersNum * (Math.random() * 0.4 + 0.1) * 1000);
      const countries = ['Türkiye', 'Almanya', 'Azerbaycan', 'Global'];
      const topCountry = countries[Math.floor(Math.random() * countries.length)];

      setAnalysisResults(prev => ({
        ...prev,
        [platformId]: {
          engagement: `${fakeEngagement}%`,
          avgViews: fakeAvgViews > 0 ? `${(fakeAvgViews / 1000).toFixed(1)}K` : '7.5K',
          audience: topCountry,
          verified: true
        }
      }));
      setAnalyzingPlatform(null);
    }, 1200);
  };

  const handleNext = () => {
    const activeKeys = Object.keys(formData.socials);
    if (activeKeys.length === 0) {
      setShowError(true);
      return;
    }

    // Check if at least one platform is filled correctly
    const isAtLeastOneFilled = activeKeys.some(key => {
      const p = formData.socials[key];
      return p && p.handle.trim() !== '' && p.followers.trim() !== '';
    });

    if (!isAtLeastOneFilled) {
      setShowError(true);
    } else {
      setShowError(false);
      onNext();
    }
  };

  return (
    <div className="space-y-6">
      {/* Upper Description */}
      <div className="text-center max-w-lg mx-auto">
        <h2 className="text-3xl font-display font-extrabold text-on-surface tracking-tight">Sosyal Medya Adreslerin</h2>
        <p className="text-on-surface-variant text-base mt-2">
          Aktif kullandığınız platformları seçip bağlayın. En az bir aktif platform doldurmanız zorunludur.
        </p>
      </div>

      {/* Grid of platforms */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {SOCIAL_PLATFORMS.map((platform) => {
          const isActive = !!formData.socials[platform.id];
          const data = formData.socials[platform.id] || { handle: '', followers: '' };
          const analysis = analysisResults[platform.id];
          const isAnalyzing = analyzingPlatform === platform.id;

          return (
            <div 
              key={platform.id}
              className={`social-card bg-white p-6 rounded-3xl border transition-all duration-300 relative ${
                isActive 
                  ? 'border-primary ring-2 ring-primary/5 shadow-md' 
                  : 'border-surface-container-high shadow-sm hover:border-outline-variant hover:scale-[1.01]'
              }`}
            >
              {/* Top Row: Info & Enable toggle */}
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-3">
                  <div className={`w-12 h-12 rounded-full flex items-center justify-center ${platform.color}`}>
                    {renderPlatformIcon(platform.id)}
                  </div>
                  <div>
                    <h3 className="font-display font-bold text-lg leading-tight text-on-surface">
                      {platform.label}
                    </h3>
                    <p className="text-xs text-on-surface-variant">
                      {platform.description}
                    </p>
                  </div>
                </div>

                {/* Switch button */}
                <button
                  type="button"
                  onClick={() => handlePlatformToggle(platform.id)}
                  className={`w-12 h-7 rounded-full transition-colors relative flex items-center ${
                    isActive ? 'bg-primary' : 'bg-surface-container-highest'
                  }`}
                >
                  <span className={`w-5 h-5 bg-white rounded-full absolute shadow transition-transform ${
                    isActive ? 'translate-x-6' : 'translate-x-1'
                  }`} />
                </button>
              </div>

              {/* Input forms if enabled */}
              {isActive && (
                <div className="space-y-4 pt-2 border-t border-surface-container animate-fade-in">
                  <div className="grid grid-cols-2 gap-4">
                    {/* Username input */}
                    <div className="space-y-1">
                      <label className="text-[10px] uppercase tracking-wider text-on-surface-variant font-bold block ml-1">
                        Kullanıcı Adı
                      </label>
                      <input 
                        type="text"
                        value={data.handle}
                        onChange={(e) => handleInputChange(platform.id, 'handle', e.target.value)}
                        className="w-full bg-surface-container-low border border-transparent rounded-2xl px-4 py-3 text-sm focus:ring-2 focus:ring-primary focus:border-transparent outline-none font-medium text-on-surface"
                        placeholder="@kullanici_adi"
                      />
                    </div>

                    {/* Followers count input */}
                    <div className="space-y-1">
                      <label className="text-[10px] uppercase tracking-wider text-on-surface-variant font-bold block ml-1">
                        Takipçi Sayısı
                      </label>
                      <input 
                        type="text"
                        value={data.followers}
                        onChange={(e) => handleInputChange(platform.id, 'followers', e.target.value)}
                        className="w-full bg-surface-container-low border border-transparent rounded-2xl px-4 py-3 text-sm focus:ring-2 focus:ring-primary focus:border-transparent outline-none font-medium text-on-surface"
                        placeholder="Örn: 24.5K"
                      />
                    </div>
                  </div>

                  {/* Simulator analysis helper */}
                  <div className="pt-2">
                    {analysis ? (
                      <div className="p-3 bg-primary/[0.03] border border-primary/10 rounded-2xl space-y-1 animate-scale-in text-xs">
                        <div className="flex justify-between text-on-surface-variant">
                          <span>Etkileşim Oranı:</span>
                          <span className="font-bold text-primary">{analysis.engagement}</span>
                        </div>
                        <div className="flex justify-between text-on-surface-variant">
                          <span>Ort. İzlenme / Erişim:</span>
                          <span className="font-bold text-primary">{analysis.avgViews}</span>
                        </div>
                        <div className="flex justify-between text-on-surface-variant">
                          <span>En Yoğun Kitle Lokasyonu:</span>
                          <span className="font-bold text-primary">{analysis.audience}</span>
                        </div>
                        <div className="flex items-center gap-1 text-[10px] text-green-600 font-bold mt-1 pt-1 border-t border-primary/5">
                          <CheckCircle2 size={12} className="text-green-600" />
                          Hesap İstatistikleri Doğrulandı
                        </div>
                      </div>
                    ) : (
                      <button
                        type="button"
                        onClick={() => simulateAnalysis(platform.id)}
                        disabled={isAnalyzing || !data.handle || !data.followers}
                        className={`w-full py-3 rounded-2xl text-xs font-bold transition-all flex items-center justify-center gap-2 ${
                          isAnalyzing 
                            ? 'bg-surface-container-low text-on-surface-variant cursor-not-allowed'
                            : (!data.handle || !data.followers)
                              ? 'bg-surface-container-low text-on-surface-variant/40 cursor-not-allowed'
                              : 'bg-primary-container/[0.08] text-primary border border-primary/10 hover:bg-primary-container/[0.12] cursor-pointer'
                        }`}
                      >
                        {isAnalyzing ? (
                          <>
                            <span className="animate-spin w-4 h-4 border-2 border-primary border-t-transparent rounded-full" />
                            İstatistikler Analiz Ediliyor...
                          </>
                        ) : (
                          <>
                            <BarChart3 size={16} />
                            Profil İstatistiklerini Analiz Et & Doğrula
                          </>
                        )}
                      </button>
                    )}
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Helper notice */}
      <div className="flex items-center gap-2.5 p-4 bg-secondary-container/20 border border-secondary/15 rounded-2xl">
        <Info size={18} className="text-secondary" />
        <p className="text-xs text-on-secondary-container font-medium">
          En az 1 adet sosyal medya platformunu aktif yapıp kullanıcı adı ve takipçi sayısını girmelisiniz.
        </p>
      </div>

      {/* Danger alert */}
      {showError && (
        <div className="p-4 bg-error-container/50 border border-error/20 rounded-2xl flex items-center gap-3 animate-shake">
          <AlertTriangle size={18} className="text-error" />
          <p className="text-xs text-error font-semibold">
            Lütfen en az bir platform seçip Kullanıcı Adı ve Takipçi bilgilerini giriniz.
          </p>
        </div>
      )}

      {/* Stepper controls */}
      <div className="flex flex-col md:flex-row items-center justify-between gap-4 pt-4 border-t border-surface-container">
        <button
          type="button"
          onClick={onPrev}
          className="order-2 md:order-1 flex items-center justify-center gap-2 text-on-surface-variant font-bold hover:text-primary transition-colors group py-3"
        >
          <ArrowLeft size={16} className="transition-transform group-hover:-translate-x-1" />
          Önceki Adım
        </button>
        <button
          type="button"
          onClick={handleNext}
          className="order-1 md:order-2 w-full md:w-auto px-12 py-4 bg-primary text-white rounded-full font-sans font-bold text-lg shadow-lg shadow-primary/25 hover:scale-[1.02] active:scale-95 transition-all flex items-center justify-center gap-2"
        >
          Devam Et
          <ArrowRight size={16} />
        </button>
      </div>
    </div>
  );
}


import React, { useRef } from 'react';
import { Camera, Pencil, Plus, ArrowRight } from 'lucide-react';

// Pre-made high quality avatar presets for creators
const AVATAR_PRESETS = [
  { id: 'avatar1', url: 'https://lh3.googleusercontent.com/aida-public/AB6AXuAr0lcA9WoLaWQJCFJl5eBfw7TsOQLgiJOmK-gL1LNfKUvqxEUUTXvOZJ1h_Qk2hvSvoMWSXvODbe5Qotyc3kjFta8dUriShX0MYqnnm8QtvKxcFVOMjjFxL5YXRVpLpdMurXrbwZOB1Q_KYA3cZh4FWjLGY3GrYSPiAve1wISiJPnHCSSKb16drK3XxYWsPMcLfYrOiDu47RtIEPht4WrsA2p0jcw7TL86LUhLVPYv24hn78k308qj', label: 'Doğal / Lifestyle' },
  { id: 'avatar2', url: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=256&h=256', label: 'Moda / Portre' },
  { id: 'avatar3', url: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=256&h=256', label: 'Teknoloji / Erkek' },
  { id: 'avatar4', url: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&q=80&w=256&h=256', label: 'Kozmetik / Güleryüz' },
  { id: 'avatar5', url: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&q=80&w=256&h=256', label: 'Minimalist' }
];

export default function StepPersonal({ formData, setFormData, onNext }) {
  const fileInputRef = useRef(null);

  const handleTextChange = (field, val) => {
    setFormData(prev => ({ ...prev, [field]: val }));
  };

  const handleAvatarSelect = (url) => {
    setFormData(prev => ({ ...prev, profileImage: url }));
  };

  const handleFileUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setFormData(prev => ({ ...prev, profileImage: reader.result }));
      };
      reader.readAsDataURL(file);
    }
  };

  const isFormValid = formData.displayName.trim().length >= 2 && formData.bio.trim().length >= 10;

  return (
    <div className="space-y-6">
      {/* Upper description */}
      <div className="text-center max-w-lg mx-auto">
        <h2 className="text-3xl font-display font-extrabold text-on-surface tracking-tight">Kişisel Bilgiler</h2>
        <p className="text-on-surface-variant text-base mt-2">
          Profilinizi oluşturalım. Markalar sizi bu bilgilerle tanıyacak ve ilk izlenim çok önemlidir.
        </p>
      </div>

      {/* Avatar selection container */}
      <div className="bg-white/80 p-6 rounded-3xl border border-surface-container-high shadow-[0_8px_30px_rgb(176,38,255,0.03)] space-y-4">
        <span className="text-xs uppercase tracking-wider text-on-surface-variant font-bold block text-center md:text-left">
          Profil Fotoğrafı Seçin veya Yükleyin
        </span>
        
        <div className="flex flex-col md:flex-row items-center gap-6 justify-center md:justify-start">
          {/* Active Avatar Frame */}
          <div className="relative group cursor-pointer" onClick={() => fileInputRef.current?.click()}>
            <div className="w-28 h-28 rounded-full border-4 border-primary/20 overflow-hidden bg-surface-container flex items-center justify-center transition-all group-hover:border-primary duration-300">
              {formData.profileImage ? (
                <img 
                  src={formData.profileImage} 
                  alt="Profil" 
                  className="w-full h-full object-cover"
                  referrerPolicy="no-referrer"
                />
              ) : (
                <Camera size={40} className="text-outline-variant" />
              )}
            </div>
            <div className="absolute bottom-1 right-1 bg-primary p-2 rounded-full text-white shadow-lg group-hover:scale-110 transition-transform duration-200 flex items-center justify-center">
              <Pencil size={12} />
            </div>
            <input 
              type="file" 
              ref={fileInputRef} 
              onChange={handleFileUpload} 
              accept="image/*" 
              className="hidden" 
            />
          </div>

          {/* Quick presets picker */}
          <div className="flex-1 space-y-2 text-center md:text-left">
            <span className="text-xs text-on-surface-variant">Önerilen hazır portrelerden seçin:</span>
            <div className="flex flex-wrap gap-3 justify-center md:justify-start">
              {AVATAR_PRESETS.map((preset) => {
                const isSelected = formData.profileImage === preset.url;
                return (
                  <button
                    key={preset.id}
                    type="button"
                    onClick={() => handleAvatarSelect(preset.url)}
                    className={`w-12 h-12 rounded-full overflow-hidden border-2 transition-all hover:scale-105 duration-200 ${
                      isSelected ? 'border-primary ring-2 ring-primary-container shadow-md scale-105' : 'border-surface-container-high'
                    }`}
                    title={preset.label}
                  >
                    <img 
                      src={preset.url} 
                      alt={preset.label} 
                      className="w-full h-full object-cover"
                      referrerPolicy="no-referrer"
                    />
                  </button>
                );
              })}
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                className="w-12 h-12 rounded-full bg-surface-container-low border border-dashed border-outline-variant flex items-center justify-center text-primary hover:bg-primary/5 transition-colors duration-200"
                title="Kendi Dosyanızı Yükleyin"
              >
                <Plus size={16} className="font-bold" />
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Main form details */}
      <div className="bg-white/80 p-6 rounded-3xl border border-surface-container-high shadow-[0_8px_30px_rgb(176,38,255,0.03)] space-y-5">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Display Name Input */}
          <div className="space-y-2">
            <div className="flex justify-between items-center px-1">
              <label className="text-xs uppercase tracking-wider text-on-surface-variant font-bold">
                Görünen İsim <span className="text-primary">*</span>
              </label>
              <span className="text-xs text-on-surface-variant font-medium">
                {formData.displayName.length} / 30
              </span>
            </div>
            <input 
              type="text"
              value={formData.displayName}
              maxLength={30}
              onChange={(e) => handleTextChange('displayName', e.target.value)}
              className="w-full bg-surface-container-low border border-transparent rounded-2xl px-5 py-4 focus:ring-2 focus:ring-primary focus:border-transparent transition-all outline-none text-on-surface font-medium"
              placeholder="Örn: Elif Aksoy Digital"
            />
          </div>

          {/* Location selector */}
          <div className="space-y-2">
            <label className="text-xs uppercase tracking-wider text-on-surface-variant font-bold block px-1">
              Bulunduğunuz Lokasyon
            </label>
            <select
              value={formData.location}
              onChange={(e) => handleTextChange('location', e.target.value)}
              className="w-full bg-surface-container-low border border-transparent rounded-2xl px-5 py-4 focus:ring-2 focus:ring-primary focus:border-transparent transition-all outline-none text-on-surface font-medium appearance-none cursor-pointer"
            >
              <option value="İstanbul, Türkiye">İstanbul, Türkiye</option>
              <option value="Ankara, Türkiye">Ankara, Türkiye</option>
              <option value="İzmir, Türkiye">İzmir, Türkiye</option>
              <option value="Antalya, Türkiye">Antalya, Türkiye</option>
              <option value="Uzaktan / Global">Uzaktan / Global</option>
            </select>
          </div>
        </div>

        {/* Biography text */}
        <div className="space-y-2">
          <div className="flex justify-between items-center px-1">
            <label className="text-xs uppercase tracking-wider text-on-surface-variant font-bold">
              Kısa Biyografi <span className="text-primary">*</span>
            </label>
            <span className={`text-xs font-medium ${formData.bio.length < 10 ? 'text-error' : 'text-on-surface-variant'}`}>
              {formData.bio.length} / 300
            </span>
          </div>
          <textarea 
            value={formData.bio}
            maxLength={300}
            onChange={(e) => handleTextChange('bio', e.target.value)}
            className="w-full bg-surface-container-low border border-transparent rounded-2xl px-5 py-4 focus:ring-2 focus:ring-primary focus:border-transparent transition-all outline-none text-on-surface font-medium resize-none"
            placeholder="Kendinizden, içerik tarzınızdan ve markalarla yaptığınız iş birliklerinden bahsedin..."
            rows={4}
          />
          <span className="text-xs text-on-surface-variant/75 block px-1">
            En az 10 karakter giriniz.
          </span>
        </div>
      </div>

      {/* Button controls */}
      <div className="flex justify-end pt-4">
        <button
          type="button"
          onClick={onNext}
          disabled={!isFormValid}
          className={`w-full md:w-auto px-12 py-4 rounded-full font-sans font-bold text-lg shadow-lg hover:scale-[1.02] active:scale-95 transition-all flex items-center justify-center gap-2 ${
            isFormValid 
              ? 'bg-primary text-white shadow-primary/20 cursor-pointer' 
              : 'bg-surface-container-highest text-on-surface-variant opacity-60 cursor-not-allowed'
          }`}
        >
          Devam Et
          <ArrowRight size={16} />
        </button>
      </div>
    </div>
  );
}


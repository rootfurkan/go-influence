import React, { useRef, useState } from 'react';
import { 
  Image as ImageIcon, UploadCloud, X, Plus, Coins, Info, TrendingUp, Send, ArrowLeft 
} from 'lucide-react';

export default function StepPortfolio({ formData, setFormData, onSubmit, onPrev }) {
  const fileInputRef = useRef(null);
  const [dragActive, setDragActive] = useState(false);
  const [currency, setCurrency] = useState('₺');

  const handlePriceChange = (service, type, value) => {
    setFormData(prev => ({
      ...prev,
      pricing: {
        ...prev.pricing,
        [service]: {
          ...prev.pricing[service],
          [type]: value
        }
      }
    }));
  };

  const handleFileUpload = (e) => {
    const files = Array.from(e.target.files || []);
    addFilesToPortfolio(files);
  };

  const addFilesToPortfolio = (files) => {
    files.forEach(file => {
      if (file.type.startsWith('image/')) {
        const reader = new FileReader();
        reader.onloadend = () => {
          setFormData(prev => ({
            ...prev,
            portfolio: [...prev.portfolio, reader.result]
          }));
        };
        reader.readAsDataURL(file);
      }
    });
  };

  const removePortfolioItem = (index) => {
    setFormData(prev => {
      const copy = [...prev.portfolio];
      copy.splice(index, 1);
      return { ...prev, portfolio: copy };
    });
  };

  // Drag and drop event handlers
  const handleDrag = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      addFilesToPortfolio(Array.from(e.dataTransfer.files));
    }
  };

  return (
    <div className="space-y-8">
      {/* Description */}
      <div className="text-center max-w-lg mx-auto">
        <h2 className="text-3xl font-display font-extrabold text-on-surface tracking-tight">Görsel Gücünü Ortaya Koy</h2>
        <p className="text-on-surface-variant text-base mt-2">
          En iyi çalışmalarınızı yükleyin ve markaların ilgisini çekmek için bütçe aralıklarınızı belirleyin.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Bento Grid Portfolio Gallery */}
        <section className="lg:col-span-7 space-y-4">
          <h3 className="font-display font-bold text-lg text-on-surface flex items-center gap-2">
            <ImageIcon size={18} className="text-primary" />
            Portfolyo Galerin ({formData.portfolio.length})
          </h3>

          <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
            {/* Upload Drag & Drop Trigger */}
            <div 
              onDragEnter={handleDrag}
              onDragOver={handleDrag}
              onDragLeave={handleDrag}
              onDrop={handleDrop}
              onClick={() => fileInputRef.current?.click()}
              className={`group relative aspect-square rounded-3xl border-2 border-dashed flex flex-col items-center justify-center cursor-pointer transition-all duration-300 select-none overflow-hidden ${
                dragActive 
                  ? 'border-primary bg-primary/10 scale-105 shadow-md' 
                  : 'border-primary/30 bg-primary/[0.02] hover:bg-primary/[0.05]'
              }`}
            >
              <div className="flex flex-col items-center text-center p-4">
                <UploadCloud size={40} className="text-primary mb-2 transition-transform duration-300 group-hover:scale-110" />
                <span className="text-sm font-bold text-primary">Fotoğraf Yükle</span>
                <p className="text-[10px] text-on-surface-variant mt-1 leading-tight">
                  Sürükle-bırak veya tıklat (PNG, JPG)
                </p>
              </div>
              <input 
                type="file" 
                multiple
                ref={fileInputRef} 
                onChange={handleFileUpload} 
                accept="image/*" 
                className="hidden" 
              />
            </div>

            {/* Render Portfolio Items */}
            {formData.portfolio.map((imgSrc, idx) => (
              <div 
                key={idx}
                className="aspect-square rounded-3xl bg-white border border-[#F1F1F1] shadow-[0px_8px_24px_rgba(176,38,255,0.04)] hover:scale-[1.03] transition-transform duration-300 relative group overflow-hidden"
              >
                <img 
                  src={imgSrc} 
                  alt={`Portfolio ${idx}`} 
                  className="w-full h-full object-cover rounded-3xl"
                  referrerPolicy="no-referrer"
                />
                
                {/* Delete button */}
                <button
                  type="button"
                  onClick={() => removePortfolioItem(idx)}
                  className="absolute top-3 right-3 w-8 h-8 rounded-full bg-white/90 backdrop-blur-md flex items-center justify-center text-error opacity-0 group-hover:opacity-100 transition-opacity shadow-sm hover:bg-white duration-200"
                  title="Görseli Kaldır"
                >
                  <X size={14} className="font-bold" />
                </button>
              </div>
            ))}

            {/* Empty boxes placeholder for bento layout rhythm */}
            {formData.portfolio.length < 5 && Array.from({ length: 5 - formData.portfolio.length }).map((_, i) => (
              <div 
                key={i}
                className="aspect-square rounded-3xl bg-white border border-surface-container-high border-dashed flex items-center justify-center text-surface-container-highest"
              >
                <Plus size={30} className="opacity-50 text-outline-variant" />
              </div>
            ))}
          </div>
        </section>

        {/* Pricing Panel */}
        <aside className="lg:col-span-5 space-y-4">
          <div className="glass-card rounded-3xl p-6 shadow-[0_8px_30px_rgb(176,38,255,0.02)] border-white/40 space-y-6">
            <div className="flex justify-between items-center pb-2 border-b border-surface-container">
              <h3 className="font-display font-bold text-lg text-on-surface flex items-center gap-2">
                <Coins size={18} className="text-primary" />
                Tahmini Ücretler
              </h3>

              {/* Interactive Currency selector */}
              <div className="flex bg-surface-container rounded-full p-0.5 border border-surface-container-high">
                {['₺', '$', '€'].map(curr => (
                  <button
                    key={curr}
                    type="button"
                    onClick={() => setCurrency(curr)}
                    className={`w-7 h-7 rounded-full text-xs font-extrabold transition-all cursor-pointer ${
                      currency === curr 
                        ? 'bg-primary text-white shadow-sm' 
                        : 'text-on-surface-variant hover:text-on-surface'
                    }`}
                  >
                    {curr}
                  </button>
                ))}
              </div>
            </div>

            <div className="space-y-4">
              {/* Instagram Post Price */}
              <div className="flex flex-col gap-1.5">
                <label className="text-xs uppercase tracking-wider text-on-surface-variant font-bold flex justify-between">
                  <span>Instagram Post</span>
                  <span className="text-primary font-extrabold">{currency}</span>
                </label>
                <div className="grid grid-cols-2 gap-3">
                  <input 
                    type="number"
                    value={formData.pricing.post.min}
                    onChange={(e) => handlePriceChange('post', 'min', e.target.value)}
                    className="bg-surface-container-low border border-transparent rounded-2xl p-3.5 focus:ring-2 focus:ring-primary focus:bg-white outline-none font-medium text-sm transition-all text-on-surface"
                    placeholder="Min" 
                  />
                  <input 
                    type="number"
                    value={formData.pricing.post.max}
                    onChange={(e) => handlePriceChange('post', 'max', e.target.value)}
                    className="bg-surface-container-low border border-transparent rounded-2xl p-3.5 focus:ring-2 focus:ring-primary focus:bg-white outline-none font-medium text-sm transition-all text-on-surface"
                    placeholder="Max" 
                  />
                </div>
              </div>

              {/* Instagram Story Price */}
              <div className="flex flex-col gap-1.5">
                <label className="text-xs uppercase tracking-wider text-on-surface-variant font-bold flex justify-between">
                  <span>Instagram Story</span>
                  <span className="text-primary font-extrabold">{currency}</span>
                </label>
                <div className="grid grid-cols-2 gap-3">
                  <input 
                    type="number"
                    value={formData.pricing.story.min}
                    onChange={(e) => handlePriceChange('story', 'min', e.target.value)}
                    className="bg-surface-container-low border border-transparent rounded-2xl p-3.5 focus:ring-2 focus:ring-primary focus:bg-white outline-none font-medium text-sm transition-all text-on-surface"
                    placeholder="Min" 
                  />
                  <input 
                    type="number"
                    value={formData.pricing.story.max}
                    onChange={(e) => handlePriceChange('story', 'max', e.target.value)}
                    className="bg-surface-container-low border border-transparent rounded-2xl p-3.5 focus:ring-2 focus:ring-primary focus:bg-white outline-none font-medium text-sm transition-all text-on-surface"
                    placeholder="Max" 
                  />
                </div>
              </div>

              {/* Reels Price */}
              <div className="flex flex-col gap-1.5">
                <label className="text-xs uppercase tracking-wider text-on-surface-variant font-bold flex justify-between">
                  <span>Reels / Video</span>
                  <span className="text-primary font-extrabold">{currency}</span>
                </label>
                <div className="grid grid-cols-2 gap-3">
                  <input 
                    type="number"
                    value={formData.pricing.reels.min}
                    onChange={(e) => handlePriceChange('reels', 'min', e.target.value)}
                    className="bg-surface-container-low border border-transparent rounded-2xl p-3.5 focus:ring-2 focus:ring-primary focus:bg-white outline-none font-medium text-sm transition-all text-on-surface"
                    placeholder="Min" 
                  />
                  <input 
                    type="number"
                    value={formData.pricing.reels.max}
                    onChange={(e) => handlePriceChange('reels', 'max', e.target.value)}
                    className="bg-surface-container-low border border-transparent rounded-2xl p-3.5 focus:ring-2 focus:ring-primary focus:bg-white outline-none font-medium text-sm transition-all text-on-surface"
                    placeholder="Max" 
                  />
                </div>
              </div>
            </div>

            {/* Dynamic disclaimer advice */}
            <div className="p-4 bg-tertiary-fixed/15 rounded-2xl border border-tertiary-fixed/30 flex items-start gap-3">
              <Info size={16} className="text-primary mt-0.5 flex-shrink-0" />
              <p className="text-[11px] text-on-tertiary-fixed-variant leading-relaxed font-medium">
                Markalar bu aralıkları baz alarak size teklif gönderir. Gelen teklifleri daha sonra kabul edebilir veya reddedebilirsiniz.
              </p>
            </div>
          </div>

          {/* Social Proof Stats Badge */}
          <div className="bg-[#F9F871] p-4 rounded-2xl flex items-center gap-3 border border-yellow-200 shadow-sm">
            <TrendingUp size={20} className="text-primary flex-shrink-0" />
            <span className="text-xs text-on-tertiary-fixed-variant font-bold leading-tight">
              Portfolyo galerisini dolduran içerik üreticileri %80 daha fazla iş teklifi alıyor!
            </span>
          </div>
        </aside>
      </div>

      {/* Complete Button Footer */}
      <div className="pt-6 border-t border-surface-container flex flex-col items-center gap-4">
        <button
          type="button"
          onClick={() => onSubmit(currency)}
          className="w-full max-w-md py-5 px-10 bg-primary hover:bg-primary-container text-white rounded-full font-display font-extrabold text-xl shadow-[0px_10px_30px_rgba(144,0,215,0.3)] transition-all active:scale-95 flex items-center justify-center gap-3 cursor-pointer hover:shadow-primary/40 duration-300"
        >
          Profili Tamamla ve Onaya Gönder
          <Send size={18} />
        </button>

        <button
          type="button"
          onClick={onPrev}
          className="flex items-center gap-1.5 text-on-surface-variant hover:text-primary transition-colors font-bold text-sm py-2"
        >
          <ArrowLeft size={16} />
          Geri Dön
        </button>
      </div>
    </div>
  );
}

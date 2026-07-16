import React, { useState } from 'react';
import { 
  Sparkles, Laptop, Dumbbell, Utensils, Gamepad2, Brush, Plane, Film, Palette, TrendingUp, Baby, Camera, Search, X, AlertTriangle, ArrowLeft, ArrowRight 
} from 'lucide-react';

const CATEGORY_ITEMS = [
  { id: 'moda', name: 'Moda & Stil', icon: 'style' },
  { id: 'teknoloji', name: 'Teknoloji & Bilim', icon: 'devices' },
  { id: 'fitness', name: 'Fitness & Spor', icon: 'fitness_center' },
  { id: 'yemek', name: 'Mutfak & Yemek', icon: 'restaurant' },
  { id: 'oyun', name: 'Oyun & E-Spor', icon: 'sports_esports' },
  { id: 'guzellik', name: 'Güzellik & Bakım', icon: 'brush' },
  { id: 'seyahat', name: 'Seyahat & Gezi', icon: 'flight' },
  { id: 'eglence', name: 'Eğlence & Mizah', icon: 'movie' },
  { id: 'sanat', name: 'Tasarım & Sanat', icon: 'palette' },
  { id: 'finans', name: 'Finans & Yatırım', icon: 'trending_up' },
  { id: 'annebebek', name: 'Anne & Çocuk', icon: 'child_care' },
  { id: 'fotograf', name: 'Fotoğrafçılık', icon: 'photo_camera' },
];

const renderCatIcon = (iconName, isActive) => {
  const iconColor = "text-primary";
  switch (iconName) {
    case 'style': return <Sparkles size={36} className={iconColor} />;
    case 'devices': return <Laptop size={36} className={iconColor} />;
    case 'fitness_center': return <Dumbbell size={36} className={iconColor} />;
    case 'restaurant': return <Utensils size={36} className={iconColor} />;
    case 'sports_esports': return <Gamepad2 size={36} className={iconColor} />;
    case 'brush': return <Brush size={36} className={iconColor} />;
    case 'flight': return <Plane size={36} className={iconColor} />;
    case 'movie': return <Film size={36} className={iconColor} />;
    case 'palette': return <Palette size={36} className={iconColor} />;
    case 'trending_up': return <TrendingUp size={36} className={iconColor} />;
    case 'child_care': return <Baby size={36} className={iconColor} />;
    case 'photo_camera': return <Camera size={36} className={iconColor} />;
    default: return <Sparkles size={36} className={iconColor} />;
  }
};

export default function StepInterests({ formData, setFormData, onNext, onPrev }) {
  const [searchQuery, setSearchQuery] = useState('');
  const [showError, setShowError] = useState(false);

  const toggleCategory = (id) => {
    setShowError(false);
    const currentlySelected = formData.interests.includes(id);
    let updated;
    if (currentlySelected) {
      updated = formData.interests.filter(item => item !== id);
    } else {
      updated = [...formData.interests, id];
    }
    setFormData(prev => ({ ...prev, interests: updated }));
  };

  const handleNext = () => {
    if (formData.interests.length === 0) {
      setShowError(true);
    } else {
      setShowError(false);
      onNext();
    }
  };

  const filteredCategories = CATEGORY_ITEMS.filter(cat => 
    cat.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="space-y-6">
      {/* Upper Description */}
      <div className="text-center max-w-lg mx-auto">
        <h2 className="text-3xl font-display font-extrabold text-on-surface tracking-tight">Seni Ne Heyecanlandırır?</h2>
        <p className="text-on-surface-variant text-base mt-2">
          En az 1 kategori seçmelisiniz. Bu, size en uygun markaları bulmamıza yardımcı olur.
        </p>
      </div>

      {/* Interactive Toolbar */}
      <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
        {/* Search Bar */}
        <div className="relative w-full md:max-w-xs">
          <Search size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-on-surface-variant" />
          <input 
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-white border border-surface-container-high rounded-full pl-11 pr-5 py-3 outline-none focus:ring-2 focus:ring-primary text-sm font-medium transition-all shadow-sm"
            placeholder="Kategori ara..."
          />
          {searchQuery && (
            <button 
              type="button"
              onClick={() => setSearchQuery('')}
              className="absolute right-4 top-1/2 -translate-y-1/2 text-on-surface-variant hover:text-on-surface"
            >
              <X size={16} />
            </button>
          )}
        </div>

        {/* Counter Info */}
        <div className="text-xs font-bold uppercase tracking-wider text-on-surface-variant">
          Seçilen: <span className="text-primary text-sm font-extrabold">{formData.interests.length}</span> / {CATEGORY_ITEMS.length}
        </div>
      </div>

      {/* Bento Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
        {filteredCategories.length > 0 ? (
          filteredCategories.map((cat) => {
            const isActive = formData.interests.includes(cat.id);
            return (
              <button
                key={cat.id}
                type="button"
                onClick={() => toggleCategory(cat.id)}
                className={`category-pill relative flex flex-col items-center justify-center p-6 border rounded-3xl cursor-pointer shadow-sm select-none hover:scale-[1.05] hover:shadow-lg group duration-300 ${
                  isActive 
                    ? 'border-primary bg-primary-fixed text-primary font-bold ring-2 ring-primary/10' 
                    : 'bg-white border-surface-container-high text-on-surface-variant hover:border-outline-variant hover:bg-surface-container-low'
                }`}
              >
                {/* Checkmark badge */}
                {isActive && (
                  <span className="absolute top-3 right-3 w-5 h-5 bg-primary text-white rounded-full flex items-center justify-center text-[10px] font-extrabold animate-scale-in">
                    ✓
                  </span>
                )}
                
                <div className="mb-3 transition-transform duration-300 group-hover:rotate-12">
                  {renderCatIcon(cat.icon, isActive)}
                </div>
                <span className={`text-sm font-semibold tracking-tight text-center ${isActive ? 'text-primary' : 'text-on-surface'}`}>
                  {cat.name}
                </span>
              </button>
            );
          })
        ) : (
          <div className="col-span-full py-12 text-center text-on-surface-variant bg-white/50 border border-dashed border-outline-variant rounded-3xl">
            <p className="text-sm">Aradığınız kategoriye uygun sonuç bulunamadı.</p>
          </div>
        )}
      </div>

      {/* Danger alert for missing interest */}
      {showError && (
        <div className="p-4 bg-error-container/50 border border-error/20 rounded-2xl flex items-center gap-3">
          <AlertTriangle size={18} className="text-error animate-bounce" />
          <p className="text-xs text-error font-semibold">
            En az bir kategori seçerek devam etmelisiniz.
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

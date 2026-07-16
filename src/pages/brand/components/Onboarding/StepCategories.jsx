/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */
import { useState } from "react";
import { motion } from "motion/react";
import { ArrowLeft, ArrowRight, CheckCircle2, AlertCircle, Sparkles } from "lucide-react";
function StepCategories({
  selectedCategories,
  onCategoriesChange,
  budget,
  onBudgetChange,
  onNext,
  onBack
}) {
  const [error, setError] = useState(false);
  const categories = [
    "Moda",
    "Teknoloji",
    "Fitness",
    "Yemek",
    "Oyun",
    "G\xFCzellik",
    "Seyahat",
    "Anne-Bebek",
    "Otomotiv"
  ];
  const toggleCategory = (cat) => {
    setError(false);
    if (selectedCategories.includes(cat)) {
      onCategoriesChange(selectedCategories.filter((c) => c !== cat));
    } else {
      onCategoriesChange([...selectedCategories, cat]);
    }
  };
  const handleNextClick = () => {
    if (selectedCategories.length === 0) {
      setError(true);
      return;
    }
    onNext();
  };
  const formatCurrency = (val) => {
    return new Intl.NumberFormat("tr-TR", {
      style: "currency",
      currency: "TRY",
      maximumFractionDigits: 0
    }).format(val);
  };
  return <motion.div
    initial={{ opacity: 0, y: 15 }}
    animate={{ opacity: 1, y: 0 }}
    exit={{ opacity: 0, y: -15 }}
    className="w-full max-w-[720px] space-y-8"
  >
      {
    /* Step Header */
  }
      <div className="text-center">
        <h1 className="font-sans font-extrabold text-3xl md:text-5xl text-primary tracking-tight mb-3">
          Markanız Hangi Sektörde?
        </h1>
        <p className="font-medium text-on-surface-variant text-base md:text-lg">
          Size en uygun içerik üreticilerini eşleştirebilmemiz için lütfen markanızın faaliyet gösterdiği kategorileri seçin.
        </p>
      </div>

      {
    /* Onboarding Card Wrapper */
  }
      <div className="bg-white rounded-xl shadow-[0px_10px_30px_rgba(176,38,255,0.06)] border border-[#F1F1F1] overflow-hidden">
        <div className="flex flex-col lg:flex-row">
          
          {
    /* Inner Sidebar Shell */
  }
          <div className="lg:w-64 bg-surface-container-low p-6 md:p-8 flex flex-col gap-6 border-r border-[#F1F1F1]">
            <div>
              <h3 className="font-bold text-lg text-primary">Onboarding</h3>
              <p className="font-semibold text-xs text-on-surface-variant opacity-70 mt-1">Adım 2 / 3</p>
            </div>
            
            <nav className="flex flex-col gap-1">
              <div className="flex items-center gap-3 p-3 text-on-surface-variant opacity-60">
                <span className="w-2 h-2 rounded-full bg-outline" />
                <span className="font-bold text-xs">Profil Kurulumu</span>
              </div>
              <div className="flex items-center gap-3 p-3 text-primary font-extrabold bg-secondary-container rounded-xl">
                <span className="w-2 h-2 rounded-full bg-primary animate-ping" />
                <span className="font-extrabold text-xs">Sektör & Kategori</span>
              </div>
              <div className="flex items-center gap-3 p-3 text-on-surface-variant opacity-30">
                <span className="w-2 h-2 rounded-full bg-outline" />
                <span className="font-bold text-xs">Marka Kimliği</span>
              </div>
            </nav>

            <div className="mt-auto pt-8">
              <button
    type="button"
    onClick={onBack}
    className="w-full py-2.5 px-4 rounded-full bg-primary/10 text-primary font-bold text-xs hover:bg-primary hover:text-white transition-all cursor-pointer"
  >
                Geri Dön
              </button>
            </div>
          </div>

          {
    /* Form Content Area */
  }
          <div className="flex-1 p-6 md:p-8 space-y-8">
            
            {
    /* Category Select Section */
  }
            <div>
              <div className="flex justify-between items-center mb-4">
                <label className="font-bold text-xs text-on-surface uppercase tracking-wider block">
                  Kategoriler
                </label>
                {error && <span className="text-[12px] text-error font-bold flex items-center gap-1 animate-bounce">
                    <AlertCircle size={14} />
                    En az 1 kategori seçmelisin
                  </span>}
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                {categories.map((cat) => {
    const isSelected = selectedCategories.includes(cat);
    return <button
      type="button"
      key={cat}
      onClick={() => toggleCategory(cat)}
      className={`p-3 rounded-2xl border-2 font-bold text-xs transition-all flex items-center justify-center gap-2 cursor-pointer ${isSelected ? "border-primary bg-primary text-white shadow-md scale-[1.02]" : "border-primary-container/20 text-on-surface-variant bg-surface hover:border-primary-container hover:bg-surface-container-low"}`}
    >
                      {isSelected && <CheckCircle2 size={14} className="stroke-[2.5]" />}
                      <span>{cat}</span>
                    </button>;
  })}
              </div>
            </div>

            {
    /* Budget Range Section */
  }
            <div className="pt-6 border-t border-[#F1F1F1] space-y-4">
              <label className="font-bold text-xs text-on-surface uppercase tracking-wider block">
                Genel Bütçe Aralığı
              </label>
              
              <div className="px-2 space-y-4">
                <input
    type="range"
    min={1e3}
    max={1e5}
    step={1e3}
    value={budget}
    onChange={(e) => onBudgetChange(Number(e.target.value))}
    className="w-full h-2 bg-surface-container rounded-lg appearance-none cursor-pointer accent-primary"
  />
                
                <div className="flex justify-between gap-4">
                  <div className="bg-surface-container-low border border-outline-variant rounded-2xl px-4 py-3 w-[45%] flex flex-col">
                    <span className="text-[10px] font-bold text-on-surface-variant uppercase">Min Bütçe</span>
                    <span className="font-extrabold text-base text-on-surface">₺1.000</span>
                  </div>
                  
                  <div className="bg-surface-container-low border border-primary/40 ring-1 ring-primary/20 rounded-2xl px-4 py-3 w-[45%] flex flex-col">
                    <span className="text-[10px] font-bold text-primary uppercase">Güncel Seçim</span>
                    <span className="font-extrabold text-base text-primary">
                      {formatCurrency(budget)}
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {
    /* Form Actions */
  }
            <div className="flex items-center justify-between pt-6 border-t border-[#F1F1F1]">
              <button
    type="button"
    onClick={onBack}
    className="font-bold text-sm text-on-surface-variant hover:text-primary transition-colors flex items-center gap-1 group cursor-pointer"
  >
                <ArrowLeft size={16} className="group-hover:-translate-x-0.5 transition-transform" />
                <span>Geri Dön</span>
              </button>
              
              <button
    type="button"
    onClick={handleNextClick}
    className="bg-primary text-white font-bold text-sm px-8 py-4 rounded-3xl shadow-lg hover:scale-105 active:scale-95 transition-all flex items-center gap-2 cursor-pointer"
  >
                <span>Devam Et</span>
                <ArrowRight size={16} />
              </button>
            </div>

          </div>

        </div>
      </div>

      {
    /* Trust Signal Indicator */
  }
      <div className="text-center">
        <p className="font-bold text-xs text-on-surface-variant/60 flex items-center justify-center gap-1">
          <Sparkles size={14} className="text-primary" />
          <span>Dünya çapında 500+ marka Go Influence ile hızla büyüyor.</span>
        </p>
      </div>
    </motion.div>;
}
export {
  StepCategories as default
};

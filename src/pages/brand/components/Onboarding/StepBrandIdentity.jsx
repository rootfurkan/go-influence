/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */
import { useState, useRef } from "react";
import { motion } from "motion/react";
import { Upload, Info, ArrowRight, CheckCircle2 } from "lucide-react";
function StepBrandIdentity({ profile, onChange, onSubmit, onBack }) {
  const [dragActive, setDragActive] = useState(false);
  const fileInputRef = useRef(null);
  const colors = [
    "#9000D7",
    // Default Neon Purple
    "#3B82F6",
    // Blue
    "#10B981",
    // Emerald Green
    "#F43F5E",
    // Rose Pink
    "#F59E0B"
    // Amber Yellow
  ];
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
      handleFile(e.dataTransfer.files[0]);
    }
  };
  const handleFileInputChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      handleFile(e.target.files[0]);
    }
  };
  const handleFile = (file) => {
    const reader = new FileReader();
    reader.onload = (event) => {
      if (event.target?.result) {
        onChange({ logoUrl: event.target.result });
      }
    };
    reader.readAsDataURL(file);
  };
  const triggerFileSelect = () => {
    fileInputRef.current?.click();
  };
  return <motion.div
    initial={{ opacity: 0, y: 15 }}
    animate={{ opacity: 1, y: 0 }}
    exit={{ opacity: 0, y: -15 }}
    className="w-full max-w-[640px] space-y-8"
  >
      {
    /* Progress Header Desktop */
  }
      <div className="w-full mb-6">
        <div className="flex items-center justify-between relative">
          <div className="absolute top-1/2 left-0 w-full h-[2px] bg-surface-container-highest -z-10 -translate-y-1/2" />
          
          <div className="flex flex-col items-center gap-1.5 bg-background px-3">
            <div className="w-9 h-9 rounded-full flex items-center justify-center bg-primary text-white font-extrabold text-xs">
              <CheckCircle2 size={16} />
            </div>
            <span className="font-bold text-[10px] text-on-surface-variant uppercase tracking-wider">Şirket</span>
          </div>

          <div className="flex flex-col items-center gap-1.5 bg-background px-3">
            <div className="w-9 h-9 rounded-full flex items-center justify-center bg-primary text-white font-extrabold text-xs">
              <CheckCircle2 size={16} />
            </div>
            <span className="font-bold text-[10px] text-on-surface-variant uppercase tracking-wider">Kategori</span>
          </div>

          <div className="flex flex-col items-center gap-1.5 bg-background px-3">
            <div className="w-9 h-9 rounded-full flex items-center justify-center border-2 border-primary bg-white ring-4 ring-primary/10 text-primary font-extrabold text-xs">
              3
            </div>
            <span className="font-extrabold text-[10px] text-primary uppercase tracking-wider">Kimlik</span>
          </div>
        </div>
      </div>

      {
    /* Main Onboarding Card */
  }
      <div className="bg-white rounded-xl shadow-[0px_10px_30px_rgba(176,38,255,0.06)] p-6 md:p-10 border border-[#F1F1F1] hover:scale-[1.01] transition-all duration-500">
        <div className="text-center mb-8">
          <h1 className="font-sans font-extrabold text-2xl md:text-3xl text-on-surface mb-2">
            Marka Kimliğini Oluştur
          </h1>
          <p className="text-sm font-medium text-on-surface-variant">
            Potansiyel iş ortaklarınızın sizi tanıması için marka görsellerinizi yükleyin.
          </p>
        </div>

        <form onSubmit={(e) => {
    e.preventDefault();
    onSubmit();
  }} className="space-y-6">
          
          {
    /* Logo Upload Area */
  }
          <div className="flex flex-col items-center gap-3">
            <label className="font-bold text-xs text-on-surface-variant self-start uppercase tracking-wider">
              Marka Logosu
            </label>
            
            <div
    onDragEnter={handleDrag}
    onDragOver={handleDrag}
    onDragLeave={handleDrag}
    onDrop={handleDrop}
    onClick={triggerFileSelect}
    className={`relative group cursor-pointer w-44 h-44 bg-surface-container-low rounded-3xl border-2 border-dashed flex flex-col items-center justify-center overflow-hidden transition-all duration-300 ${dragActive ? "border-primary bg-primary/5" : "border-outline-variant hover:border-primary"}`}
  >
              <input
    ref={fileInputRef}
    type="file"
    accept="image/*"
    onChange={handleFileInputChange}
    className="hidden"
  />

              {profile.logoUrl ? <div className="w-full h-full relative group">
                  <img
    src={profile.logoUrl}
    alt="Brand Logo Preview"
    className="w-full h-full object-cover"
    referrerPolicy="no-referrer"
  />
                  <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                    <span className="text-white text-xs font-bold bg-primary px-3 py-1.5 rounded-full">Değiştir</span>
                  </div>
                </div> : <div className="flex flex-col items-center text-center p-4 text-on-surface-variant group-hover:text-primary transition-colors">
                  <Upload size={32} className="mb-2" />
                  <span className="font-bold text-xs">Logo Yükle</span>
                  <span className="text-[10px] opacity-60 mt-1">PNG, JPG veya SVG (Max 5MB)</span>
                </div>}
            </div>
          </div>

          {
    /* Brand Color Palette */
  }
          <div className="space-y-3">
            <div className="flex justify-between items-end">
              <label className="font-bold text-xs text-on-surface-variant uppercase tracking-wider block">
                Marka Rengi (Birincil)
              </label>
              <span className="font-bold text-xs text-primary">{profile.primaryColor}</span>
            </div>
            
            <div className="flex flex-wrap gap-3">
              {colors.map((color) => {
    const isChecked = profile.primaryColor.toLowerCase() === color.toLowerCase();
    return <button
      type="button"
      key={color}
      onClick={() => onChange({ primaryColor: color })}
      style={{ backgroundColor: color }}
      className={`w-12 h-12 rounded-xl border-2 cursor-pointer transition-transform hover:scale-110 ${isChecked ? "border-primary ring-2 ring-primary/20 scale-105" : "border-transparent"}`}
    />;
  })}

              {
    /* Custom Hex Color Input */
  }
              <div className="flex-grow min-w-[120px] h-12 bg-surface-container-low rounded-xl border border-outline-variant flex items-center px-4">
                <span className="text-on-surface-variant mr-1 font-bold">#</span>
                <input
    type="text"
    maxLength={6}
    value={profile.primaryColor.replace("#", "")}
    onChange={(e) => onChange({ primaryColor: `#${e.target.value.slice(0, 6)}` })}
    placeholder="9000D7"
    className="bg-transparent border-none focus:ring-0 p-0 font-bold text-sm w-full text-on-surface outline-none uppercase"
  />
              </div>
            </div>
          </div>

          {
    /* Success Info Banner */
  }
          <div className="flex items-start gap-3 p-4 bg-secondary-container rounded-xl border border-secondary/10">
            <Info size={20} className="text-secondary shrink-0 mt-0.5" />
            <p className="font-bold text-xs text-on-secondary-container leading-relaxed">
              Harika gidiyorsun! Bu adım sonrası profilin tamamlanacak ve Go Influence Marketplace'e ilk adımını atacaksın.
            </p>
          </div>

          {
    /* Action Buttons */
  }
          <div className="pt-4 flex flex-col gap-4">
            <button
    type="submit"
    className="w-full h-14 bg-primary text-white font-bold rounded-3xl shadow-[0px_10px_20px_rgba(144,0,215,0.25)] hover:bg-primary/90 hover:scale-[1.01] active:scale-95 transition-all flex items-center justify-center gap-2 group cursor-pointer"
  >
              <span>Profili Tamamla ve Panele Geç</span>
              <ArrowRight size={18} className="group-hover:translate-x-0.5 transition-transform" />
            </button>
            
            <button
    type="button"
    onClick={onBack}
    className="text-center font-bold text-xs text-on-surface-variant hover:text-primary transition-colors py-2 cursor-pointer"
  >
              Geri Dön
            </button>
          </div>

        </form>
      </div>
    </motion.div>;
}
export {
  StepBrandIdentity as default
};

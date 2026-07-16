import { useState } from "react";
import { X, Target, Briefcase, Award } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
function NewCampaignModal({ isOpen, onClose, onSubmit }) {
  const [name, setName] = useState("");
  const [brand, setBrand] = useState("");
  const [category, setCategory] = useState("Moda & G\xFCzellik");
  const [budgetRange, setBudgetRange] = useState("\u20BA50.000 - \u20BA100.000");
  const [status, setStatus] = useState("Aktif");
  const handleSubmit = (e) => {
    e.preventDefault();
    if (!name || !brand) {
      alert("L\xFCtfen t\xFCm alanlar\u0131 doldurun.");
      return;
    }
    onSubmit({
      name,
      brand,
      category,
      budgetRange,
      status
    });
    setName("");
    setBrand("");
    setCategory("Moda & G\xFCzellik");
    setBudgetRange("\u20BA50.000 - \u20BA100.000");
    setStatus("Aktif");
    onClose();
  };
  return <AnimatePresence>
      {isOpen && <div className="fixed inset-0 z-[120] flex items-center justify-center">
          {
    /* Backdrop blur */
  }
          <motion.div
    initial={{ opacity: 0 }}
    animate={{ opacity: 0.6 }}
    exit={{ opacity: 0 }}
    onClick={onClose}
    className="absolute inset-0 bg-on-background/80 backdrop-blur-sm cursor-pointer"
  />

          {
    /* Modal box */
  }
          <motion.div
    initial={{ scale: 0.9, opacity: 0, y: 20 }}
    animate={{ scale: 1, opacity: 1, y: 0 }}
    exit={{ scale: 0.9, opacity: 0, y: 20 }}
    transition={{ type: "spring", duration: 0.4 }}
    className="relative bg-surface-container-lowest w-full max-w-lg rounded-[2.5rem] shadow-2xl overflow-hidden border border-outline-variant/30 z-10 p-8 m-4"
  >
            {
    /* Header */
  }
            <div className="flex justify-between items-center mb-6">
              <div>
                <h3 className="text-2xl font-extrabold text-on-surface tracking-tight flex items-center gap-2">
                  <Award className="w-6 h-6 text-primary" /> Yeni Kampanya Başlat
                </h3>
                <p className="text-xs text-on-surface-variant/70 mt-1">Platform üzerinde yayınlanacak yeni bir iş birliği kurgulayın.</p>
              </div>
              <button
    onClick={onClose}
    className="p-2 hover:bg-surface-container-high rounded-full transition-colors cursor-pointer text-on-surface"
  >
                <X className="w-5 h-5" />
              </button>
            </div>

            {
    /* Form */
  }
            <form onSubmit={handleSubmit} className="space-y-5">
              <div>
                <label className="block text-[11px] font-bold text-on-surface-variant uppercase tracking-widest mb-1.5">Kampanya Adı</label>
                <div className="relative">
                  <Briefcase className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-on-surface-variant/60" />
                  <input
    type="text"
    required
    value={name}
    onChange={(e) => setName(e.target.value)}
    placeholder="örn. Lüks Deri Çanta Lansmanı"
    className="w-full bg-surface-container rounded-2xl py-3 pl-11 pr-4 text-xs font-bold tracking-wide focus:ring-2 focus:ring-primary-container"
  />
                </div>
              </div>

              <div>
                <label className="block text-[11px] font-bold text-on-surface-variant uppercase tracking-widest mb-1.5">Marka / Şirket</label>
                <div className="relative">
                  <Target className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-on-surface-variant/60" />
                  <input
    type="text"
    required
    value={brand}
    onChange={(e) => setBrand(e.target.value)}
    placeholder="örn. Louis Vuitton Türkiye"
    className="w-full bg-surface-container rounded-2xl py-3 pl-11 pr-4 text-xs font-bold tracking-wide focus:ring-2 focus:ring-primary-container"
  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-[11px] font-bold text-on-surface-variant uppercase tracking-widest mb-1.5">Kategori</label>
                  <select
    value={category}
    onChange={(e) => setCategory(e.target.value)}
    className="w-full bg-surface-container border-none rounded-2xl py-3 px-4 text-xs font-bold tracking-wide focus:ring-2 focus:ring-primary-container cursor-pointer"
  >
                    <option value="Moda & Güzellik">Moda & Güzellik</option>
                    <option value="Lüks & Stil">Lüks & Stil</option>
                    <option value="Teknoloji & Tasarım">Teknoloji & Tasarım</option>
                    <option value="Oyun & Gençlik">Oyun & Gençlik</option>
                    <option value="Sağlık & Yaşam">Sağlık & Yaşam</option>
                  </select>
                </div>

                <div>
                  <label className="block text-[11px] font-bold text-on-surface-variant uppercase tracking-widest mb-1.5">Bütçe Aralığı</label>
                  <select
    value={budgetRange}
    onChange={(e) => setBudgetRange(e.target.value)}
    className="w-full bg-surface-container border-none rounded-2xl py-3 px-4 text-xs font-bold tracking-wide focus:ring-2 focus:ring-primary-container cursor-pointer"
  >
                    <option value="₺10.000 - ₺25.000">₺10.000 - ₺25.000</option>
                    <option value="₺25.000 - ₺50.000">₺25.000 - ₺50.000</option>
                    <option value="₺50.000 - ₺100.000">₺50.000 - ₺100.000</option>
                    <option value="₺100.000 - ₺250.000">₺100.000 - ₺250.000</option>
                    <option value="₺250.000+">₺250.000+</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-[11px] font-bold text-on-surface-variant uppercase tracking-widest mb-1.5">Yayın Durumu</label>
                <div className="flex gap-4">
                  <label className="flex-1 bg-surface-container p-3 rounded-2xl border border-transparent hover:border-primary/20 flex items-center gap-3 cursor-pointer">
                    <input
    type="radio"
    name="campaign_status"
    checked={status === "Aktif"}
    onChange={() => setStatus("Aktif")}
    className="accent-primary"
  />
                    <div>
                      <p className="text-xs font-bold text-on-surface">Aktif</p>
                      <p className="text-[10px] text-on-surface-variant/70 mt-0.5">Hemen yayına al</p>
                    </div>
                  </label>

                  <label className="flex-1 bg-surface-container p-3 rounded-2xl border border-transparent hover:border-primary/20 flex items-center gap-3 cursor-pointer">
                    <input
    type="radio"
    name="campaign_status"
    checked={status === "Tamamland\u0131"}
    onChange={() => setStatus("Tamamland\u0131")}
    className="accent-primary"
  />
                    <div>
                      <p className="text-xs font-bold text-on-surface">Arşiv/Planlı</p>
                      <p className="text-[10px] text-on-surface-variant/70 mt-0.5">Daha sonra yayınla</p>
                    </div>
                  </label>
                </div>
              </div>

              <div className="pt-4 flex gap-4">
                <button
    type="button"
    onClick={onClose}
    className="flex-1 py-3.5 rounded-2xl border-2 border-outline-variant text-on-surface-variant font-extrabold text-xs uppercase tracking-wider hover:bg-surface-container transition-colors cursor-pointer text-center"
  >
                  Vazgeç
                </button>
                <button
    type="submit"
    className="flex-1 py-3.5 bg-primary text-white font-extrabold text-xs uppercase tracking-wider rounded-2xl shadow-lg shadow-primary/20 hover:scale-[1.01] active:scale-[0.98] transition-all cursor-pointer text-center"
  >
                  Kampanya Oluştur
                </button>
              </div>
            </form>
          </motion.div>
        </div>}
    </AnimatePresence>;
}
export {
  NewCampaignModal as default
};

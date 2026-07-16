import { useState } from "react";
import { Store, Star, Zap, Clock, Wallet, Banknote, UserPlus, FileEdit, Download, Check } from "lucide-react";
import { motion } from "motion/react";
const defaultDashboardStats = {
  totalBrands: 0,
  totalInfluencers: 0,
  activeCampaigns: 0,
  pendingApprovals: 0,
  grossVolume: 0,
  commissionVolume: 0,
};

function DashboardTab({ logs, stats = defaultDashboardStats, onShowToast, onNavigateToTab }) {
  const [chartFilter, setChartFilter] = useState("Son 30 G\xFCn");
  const [isDownloading, setIsDownloading] = useState(false);
  const [showMatchDetails, setShowMatchDetails] = useState(false);
  const getChartPath = () => {
    switch (chartFilter) {
      case "Son 7 G\xFCn":
        return "M0,220 Q150,50 300,180 T600,60 T900,140 T1200,80";
      case "Bu Y\u0131l":
        return "M0,260 Q200,120 400,200 T800,90 T1200,120";
      case "Son 30 G\xFCn":
      default:
        return "M0,250 Q100,220 200,240 T400,180 T600,210 T800,100 T1200,140";
    }
  };
  const getChartGradientPath = () => {
    const base = getChartPath();
    return `${base} L1200,300 L0,300 Z`;
  };
  const handleDownloadReport = () => {
    setIsDownloading(true);
    setTimeout(() => {
      setIsDownloading(false);
      onShowToast("B\xFCy\xFCme Raporu ba\u015Far\u0131yla indirildi (PDF).");
    }, 1500);
  };
  const getLogIcon = (type) => {
    switch (type) {
      case "user_add":
        return {
          icon: UserPlus,
          bg: "bg-secondary-container text-on-secondary-container"
        };
      case "payment":
        return {
          icon: Banknote,
          bg: "bg-primary-fixed text-on-primary-fixed-variant"
        };
      case "campaign":
        return {
          icon: Zap,
          bg: "bg-tertiary-fixed text-on-tertiary-fixed-variant"
        };
      case "alert":
        return {
          icon: Clock,
          bg: "bg-error-container text-on-error-container"
        };
      case "settings":
      default:
        return {
          icon: FileEdit,
          bg: "bg-surface-container-high text-on-surface-variant"
        };
    }
  };
  return <div className="space-y-8 animate-fade-in select-none">
      {
    /* Overview Cards Grid */
  }
      <section className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-6">
        {
    /* Card 1 */
  }
        <div className="bg-primary-fixed p-6 rounded-3xl shadow-[0px_10px_30px_rgba(176,38,255,0.03)] hover:scale-[1.02] transition-transform duration-200 border border-white/40 flex flex-col justify-between h-36">
          <div className="flex justify-between items-start">
            <Store className="w-6 h-6 text-primary" />
            <span className="text-xs font-bold text-on-primary-fixed-variant bg-white/40 px-2 py-0.5 rounded-full">Canlı</span>
          </div>
          <div>
            <h3 className="text-xs font-bold text-on-primary-fixed-variant uppercase tracking-wider">Toplam Marka</h3>
            <p className="text-3xl font-extrabold text-on-primary-fixed mt-1">{formatNumber(stats.totalBrands)}</p>
          </div>
        </div>

        {
    /* Card 2 */
  }
        <div className="bg-secondary-fixed p-6 rounded-3xl shadow-[0px_10px_30px_rgba(176,38,255,0.03)] hover:scale-[1.02] transition-transform duration-200 border border-white/40 flex flex-col justify-between h-36">
          <div className="flex justify-between items-start">
            <Star className="w-6 h-6 text-secondary" />
            <span className="text-xs font-bold text-on-secondary-fixed-variant bg-white/40 px-2 py-0.5 rounded-full">Canlı</span>
          </div>
          <div>
            <h3 className="text-xs font-bold text-on-secondary-fixed-variant uppercase tracking-wider">Influencerlar</h3>
            <p className="text-3xl font-extrabold text-on-secondary-fixed mt-1">{formatNumber(stats.totalInfluencers)}</p>
          </div>
        </div>

        {
    /* Card 3 */
  }
        <div className="bg-tertiary-fixed p-6 rounded-3xl shadow-[0px_10px_30px_rgba(176,38,255,0.03)] hover:scale-[1.02] transition-transform duration-200 border border-white/40 flex flex-col justify-between h-36">
          <div className="flex justify-between items-start">
            <Zap className="w-6 h-6 text-tertiary" />
            <span className="text-xs font-bold text-on-tertiary-fixed-variant bg-white/40 px-2 py-0.5 rounded-full font-sans">Aktif</span>
          </div>
          <div>
            <h3 className="text-xs font-bold text-on-tertiary-fixed-variant uppercase tracking-wider">Kampanyalar</h3>
            <p className="text-3xl font-extrabold text-on-tertiary-fixed mt-1">{formatNumber(stats.activeCampaigns)}</p>
          </div>
        </div>

        {
    /* Card 4 */
  }
        <div className="bg-error-container p-6 rounded-3xl shadow-[0px_10px_30px_rgba(176,38,255,0.03)] hover:scale-[1.02] transition-transform duration-200 border border-white/40 flex flex-col justify-between h-36">
          <div className="flex justify-between items-start">
            <Clock className="w-6 h-6 text-on-error-container" />
            <span className="text-xs font-bold text-on-error-container bg-white/40 px-2 py-0.5 rounded-full font-sans">Acil</span>
          </div>
          <div>
            <h3 className="text-xs font-bold text-on-error-container uppercase tracking-wider">Bekleyen</h3>
            <p className="text-3xl font-extrabold text-on-error-container mt-1">{formatNumber(stats.pendingApprovals)}</p>
          </div>
        </div>

        {
    /* Card 5 */
  }
        <div className="bg-surface-container-high p-6 rounded-3xl shadow-[0px_10px_30px_rgba(176,38,255,0.03)] hover:scale-[1.02] transition-transform duration-200 border border-[#eee] flex flex-col justify-between h-36">
          <div className="flex justify-between items-start">
            <Wallet className="w-6 h-6 text-on-surface" />
          </div>
          <div>
            <h3 className="text-xs font-bold text-on-surface-variant uppercase tracking-wider">Hacim (30 Gün)</h3>
            <p className="text-3xl font-extrabold text-on-surface mt-1">{formatCurrencyCompact(stats.grossVolume)}</p>
          </div>
        </div>

        {
    /* Card 6 */
  }
        <div className="bg-primary-fixed-dim p-6 rounded-3xl shadow-[0px_10px_30px_rgba(176,38,255,0.03)] hover:scale-[1.02] transition-transform duration-200 border border-white/30 flex flex-col justify-between h-36">
          <div className="flex justify-between items-start">
            <Banknote className="w-6 h-6 text-primary" />
          </div>
          <div>
            <h3 className="text-xs font-bold text-on-primary-fixed-variant uppercase tracking-wider">Komisyon</h3>
            <p className="text-3xl font-extrabold text-on-primary-fixed mt-1">{formatCurrencyCompact(stats.commissionVolume)}</p>
          </div>
        </div>
      </section>

      {
    /* Main Trends Chart & Recent Activities Bento Grid */
  }
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
        
        {
    /* Trends Chart Section */
  }
        <section className="lg:col-span-2 bg-white rounded-3xl p-8 border border-[#F1F1F1] shadow-[0px_10px_30px_rgba(176,38,255,0.05)]">
          <div className="flex justify-between items-center mb-8">
            <div>
              <h3 className="text-xl font-bold text-on-surface tracking-tight">Komisyon Trendleri</h3>
              <p className="text-sm text-on-surface-variant/70 mt-1">Son 30 günlük gelir akışı</p>
            </div>
            
            <select
    value={chartFilter}
    onChange={(e) => setChartFilter(e.target.value)}
    className="bg-surface-container-low border-none rounded-2xl text-on-surface-variant font-bold text-xs tracking-wide py-2 px-4 focus:ring-2 focus:ring-primary/20 cursor-pointer"
  >
              <option value="Son 30 Gün">Son 30 Gün</option>
              <option value="Son 7 Gün">Son 7 Gün</option>
              <option value="Bu Yıl">Bu Yıl</option>
            </select>
          </div>

          {
    /* SVG Spline Chart representation */
  }
          <div className="relative w-full h-[320px] flex flex-col justify-end">
            <div className="absolute inset-0 flex items-end justify-between pt-4 overflow-hidden">
              <svg className="w-full h-full" preserveAspectRatio="none" viewBox="0 0 1200 300">
                <defs>
                  <linearGradient id="chartLineGradient" x1="0" x2="0" y1="0" y2="1">
                    <stop offset="0%" stopColor="#9000d7" stopOpacity="0.2" />
                    <stop offset="100%" stopColor="#9000d7" stopOpacity="0" />
                  </linearGradient>
                </defs>
                {
    /* Simulated dynamic line utilizing state updates */
  }
                <motion.path
    animate={{ d: getChartPath() }}
    transition={{ type: "spring", stiffness: 80, damping: 15 }}
    fill="none"
    stroke="#9000d7"
    strokeLinecap="round"
    strokeWidth="5"
  />
                <motion.path
    animate={{ d: getChartGradientPath() }}
    transition={{ type: "spring", stiffness: 80, damping: 15 }}
    fill="url(#chartLineGradient)"
    opacity="0.8"
  />
              </svg>
            </div>

            {
    /* Chart Axis Labels */
  }
            <div className="flex justify-between mt-4 text-[10px] font-bold text-on-surface-variant/40 uppercase tracking-widest border-t border-outline-variant/30 pt-4">
              <span>01 Ara</span>
              <span>08 Ara</span>
              <span>15 Ara</span>
              <span>22 Ara</span>
              <span>30 Ara</span>
            </div>
          </div>
        </section>

        {
    /* Recent Activities Section */
  }
        <section className="bg-white rounded-3xl p-8 border border-[#F1F1F1] shadow-[0px_10px_30px_rgba(176,38,255,0.05)] flex flex-col justify-between h-full min-h-[440px]">
          <div>
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-xl font-bold text-on-surface tracking-tight">Son Aktiviteler</h3>
              <button
    onClick={() => onNavigateToTab("approvals")}
    className="text-primary font-bold text-xs hover:underline cursor-pointer"
  >
                Tümünü Gör
              </button>
            </div>

            <div className="space-y-5">
              {logs.map((log) => {
    const spec = getLogIcon(log.type);
    const Icon = spec.icon;
    return <div key={log.id} className="flex gap-4 items-start pb-4 border-b border-surface-container/50 last:border-b-0">
                    <div className={`w-9 h-9 rounded-full ${spec.bg} flex items-center justify-center shrink-0 shadow-sm`}>
                      <Icon className="w-4 h-4" />
                    </div>
                    <div className="flex-1">
                      <p className="text-sm text-on-surface leading-tight">
                        <span className="font-extrabold">{log.name}</span> {log.action}
                      </p>
                      <span className="text-[11px] text-on-surface-variant/60 font-medium block mt-1">{log.timeAgo}</span>
                    </div>
                  </div>;
  })}
            </div>
          </div>
        </section>

      </div>

      {
    /* Secondary Insights / Quick Actions */
  }
      <section className="grid grid-cols-1 md:grid-cols-2 gap-8 pb-12">
        {
    /* Growth Report Download Card */
  }
        <div className="group relative bg-on-background rounded-3xl p-8 overflow-hidden min-h-[220px] flex items-center shadow-lg border border-outline-variant/10">
          <div className="relative z-10 space-y-4">
            <h4 className="text-white text-xl font-bold tracking-tight">Büyüme Raporunu İndir</h4>
            <p className="text-white/60 text-sm max-w-xs leading-relaxed">
              Aralık ayı performans verilerini PDF veya Excel formatında dışa aktarın.
            </p>
            <button
    onClick={handleDownloadReport}
    disabled={isDownloading}
    className="bg-primary text-white font-extrabold px-6 py-3.5 rounded-2xl flex items-center gap-2 hover:bg-primary-container active:scale-[0.98] transition-all duration-200 cursor-pointer text-sm shadow-md"
  >
              {isDownloading ? <>
                  <svg className="animate-spin h-4 w-4 text-white" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                  </svg>
                  <span>Hazırlanıyor...</span>
                </> : <>
                  <Download className="w-4.5 h-4.5" />
                  <span>Raporu Al</span>
                </>}
            </button>
          </div>
          {
    /* Subtle glowing abstract shape in background */
  }
          <div className="absolute right-0 top-0 h-full w-1/2 opacity-20 pointer-events-none bg-gradient-to-l from-primary via-transparent to-transparent" />
        </div>

        {
    /* Category matching feature card */
  }
        <div className="bg-[#F9F871]/5 rounded-3xl p-8 border-2 border-dashed border-[#F9F871]/40 flex flex-col justify-center space-y-4 shadow-[0px_10px_30px_rgba(249,248,113,0.02)]">
          <div className="flex items-center gap-3">
            <div className="bg-[#F9F871] text-black px-3 py-1 rounded-full font-extrabold text-[10px] uppercase tracking-wider">
              Yeni Özellik
            </div>
            <h4 className="font-bold text-lg text-on-surface tracking-tight flex items-center gap-1.5">
              <UserPlus className="w-4 h-4 text-[#9000d7]" /> Kategori Eşleştirme
            </h4>
          </div>
          
          <p className="text-sm text-on-surface-variant/80 leading-relaxed">
            Kategori ve hizmet bazlı eşleşme yapısı markaları doğru influencer profilleriyle daha hızlı buluşturur.
          </p>

          <div className="flex gap-4 pt-2">
            <button
    onClick={() => setShowMatchDetails(!showMatchDetails)}
    className="bg-on-background text-white font-bold px-6 py-3 rounded-2xl text-xs tracking-wide hover:bg-on-background/90 active:scale-[0.98] transition-transform cursor-pointer"
  >
              {showMatchDetails ? "Gizle" : "Daha Fazla Bilgi"}
            </button>
            <button
    onClick={() => onShowToast("Kategori eslestirme onerileri aktif edildi.")}
    className="bg-white/50 border border-outline-variant text-on-surface font-bold px-6 py-3 rounded-2xl text-xs tracking-wide hover:bg-surface-container-high transition-colors cursor-pointer"
  >
              Etkinleştir
            </button>
          </div>

          {showMatchDetails && <motion.div
    initial={{ opacity: 0, height: 0 }}
    animate={{ opacity: 1, height: "auto" }}
    exit={{ opacity: 0, height: 0 }}
    className="mt-3 p-4 bg-white rounded-2xl border border-[#F1F1F1] text-xs leading-relaxed text-on-surface shadow-sm space-y-2"
  >
              <p className="font-extrabold text-primary">Eşleşme Nasıl Çalışıyor?</p>
              <p>Platform, kampanya kategorilerini influencer ilgi alanları ve sunduğu içerik hizmetleriyle karşılaştırır; en uyumlu profilleri üstte listeler.</p>
              <p className="font-semibold text-tertiary flex items-center gap-1">
                <Check className="w-3.5 h-3.5" /> Eşleşme Oranı En Yüksek 3 Kategori: Moda, Güzellik, Teknoloji.
              </p>
            </motion.div>}
        </div>
      </section>
    </div>;
}
export {
  DashboardTab as default
};

function formatNumber(value) {
  return new Intl.NumberFormat("tr-TR", {
    notation: Number(value) >= 10000 ? "compact" : "standard",
    maximumFractionDigits: 1,
  }).format(Number(value || 0));
}

function formatCurrency(value) {
  return new Intl.NumberFormat("tr-TR", {
    style: "currency",
    currency: "TRY",
    maximumFractionDigits: 0,
  }).format(Number(value || 0));
}

function formatCurrencyCompact(value) {
  return new Intl.NumberFormat("tr-TR", {
    style: "currency",
    currency: "TRY",
    notation: Number(value) >= 10000 ? "compact" : "standard",
    maximumFractionDigits: 1,
  }).format(Number(value || 0));
}


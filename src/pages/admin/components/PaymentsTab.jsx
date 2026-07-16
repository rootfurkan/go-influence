import { useEffect, useState } from "react";
import { Clock, CheckCircle2, PieChart, Landmark, Send, FileSpreadsheet, ChevronLeft, ChevronRight, Coins } from "lucide-react";
function PaymentsTab({
  transactions,
  globalCommissionRate,
  onShowToast,
  onUpdateCommissionRate,
  onTriggerPayout,
  searchQuery
}) {
  const [commissionRate, setCommissionRate] = useState(globalCommissionRate || 10);
  const [tableSearch, setTableSearch] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  useEffect(() => {
    setCommissionRate(globalCommissionRate || 10);
  }, [globalCommissionRate]);
  const handleSaveCommission = () => {
    onUpdateCommissionRate(commissionRate);
    onShowToast(`Global komisyon oran\u0131 %${commissionRate} olarak g\xFCncellendi.`);
  };
  const filteredTransactions = transactions.filter((tx) => {
    const searchString = (searchQuery || tableSearch).toLowerCase();
    return tx.campaignName.toLowerCase().includes(searchString) || tx.brandName.toLowerCase().includes(searchString) || tx.influencerHandle.toLowerCase().includes(searchString);
  });
  const itemsPerPage = 3;
  const totalPages = Math.ceil(filteredTransactions.length / itemsPerPage) || 1;
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedTx = filteredTransactions.slice(startIndex, startIndex + itemsPerPage);
  const totalPendingVal = transactions.filter((t) => t.status === "Pending").reduce((acc, t) => acc + (t.grossAmount - t.grossAmount * t.feePercent / 100), 0);
  const totalCompletedVal = transactions.filter((t) => t.status === "Paid to Influencer").reduce((acc, t) => acc + (t.grossAmount - t.grossAmount * t.feePercent / 100), 0);
  const totalCommissionVal = transactions.reduce((acc, t) => acc + t.grossAmount * t.feePercent / 100, 0);
  const handlePayoutAction = (tx) => {
    if (tx.status === "Pending") {
      onTriggerPayout(tx.id, "Paid to Platform");
      onShowToast(`${tx.influencerHandle} i\xE7in \xF6deme Platform Havuzuna \xE7ekildi.`);
    } else if (tx.status === "Paid to Platform") {
      onTriggerPayout(tx.id, "Paid to Influencer");
      onShowToast(`\xD6deme ${tx.influencerHandle} hesab\u0131na transfer edildi.`);
    }
  };
  return <div className="space-y-8 animate-fade-in select-none">
      {
    /* Summary Stats Bento Grid */
  }
      <section className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {
    /* Pending payments */
  }
        <div className="bg-white p-6 rounded-3xl shadow-[0px_10px_30px_rgba(176,38,255,0.04)] border border-[#F1F1F1] hover:scale-[1.01] transition-transform duration-200">
          <div className="flex justify-between items-start mb-4">
            <span className="p-3 bg-secondary-container text-on-secondary-container rounded-2xl">
              <Clock className="w-5 h-5 text-on-secondary-container" />
            </span>
            <span className="text-xs font-bold text-on-surface-variant/50 uppercase tracking-widest">GÜNCEL HAVUZ</span>
          </div>
          <p className="text-on-surface-variant font-bold text-xs tracking-wide">Bekleyen Ödemeler</p>
          <h3 className="text-2xl font-extrabold text-on-surface mt-1">
            ₺{totalPendingVal.toLocaleString("tr-TR", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
          </h3>
          <div className="mt-4 flex items-center gap-2 text-error font-bold text-xs">
            <TrendingUp className="w-3.5 h-3.5" />
            <span>Geçen haftadan beri %12</span>
          </div>
        </div>

        {
    /* Completed Payments */
  }
        <div className="bg-white p-6 rounded-3xl shadow-[0px_10px_30px_rgba(176,38,255,0.04)] border border-[#F1F1F1] hover:scale-[1.01] transition-transform duration-200">
          <div className="flex justify-between items-start mb-4">
            <span className="p-3 bg-primary-fixed text-primary rounded-2xl">
              <CheckCircle2 className="w-5 h-5 text-on-primary-fixed-variant" />
            </span>
            <span className="text-xs font-bold text-on-surface-variant/50 uppercase tracking-widest">TÜM ZAMANLAR</span>
          </div>
          <p className="text-on-surface-variant font-bold text-xs tracking-wide">Tamamlanan Ödemeler</p>
          <h3 className="text-2xl font-extrabold text-on-surface mt-1">
            ₺{(totalCompletedVal + 284e4).toLocaleString("tr-TR")}
          </h3>
          <div className="mt-4 flex items-center gap-2 text-primary font-bold text-xs">
            <CheckCircle2 className="w-3.5 h-3.5" />
            <span>Tüm influencer ödemeleri tamamlandı</span>
          </div>
        </div>

        {
    /* Platform commission */
  }
        <div className="bg-white p-6 rounded-3xl shadow-[0px_10px_30px_rgba(176,38,255,0.04)] border border-[#F1F1F1] hover:scale-[1.01] transition-transform duration-200">
          <div className="flex justify-between items-start mb-4">
            <span className="p-3 bg-tertiary-fixed text-on-tertiary-fixed-variant rounded-2xl">
              <PieChart className="w-5 h-5" />
            </span>
            <span className="text-xs font-bold text-on-surface-variant/50 uppercase tracking-widest">PLATFORM GELİRİ</span>
          </div>
          <p className="text-on-surface-variant font-bold text-xs tracking-wide">Aylık Komisyon</p>
          <h3 className="text-2xl font-extrabold text-on-surface mt-1">
            ₺{(totalCommissionVal + 28400).toLocaleString("tr-TR", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
          </h3>
          <div className="mt-4 flex items-center gap-2 text-tertiary font-bold text-xs">
            <Coins className="w-3.5 h-3.5" />
            <span>Ortalama %10 hedef yakalandı</span>
          </div>
        </div>
      </section>

      {
    /* Global Commission Control Row */
  }
      <div className="bg-white rounded-3xl shadow-[0px_10px_30px_rgba(176,38,255,0.04)] border border-[#F1F1F1] p-8 flex flex-col md:flex-row items-center justify-between gap-8">
        <div className="flex-1 space-y-2">
          <h4 className="text-xl font-extrabold text-on-surface tracking-tight">Genel Komisyon Oranı</h4>
          <p className="text-on-surface-variant/80 text-sm leading-relaxed font-medium">Tüm yeni kampanya sözleşmeleri için varsayılan platform komisyonunu belirleyin.</p>
        </div>

        <div className="flex items-center gap-8 w-full md:w-auto">
          <div className="flex flex-col gap-2 w-full md:w-64">
            <div className="flex justify-between px-1">
              <span className="text-[10px] font-bold text-on-surface-variant/50 uppercase tracking-wider">0%</span>
              <span className="text-xl font-extrabold text-primary" id="commissionValueDisplay">
                {commissionRate}%
              </span>
              <span className="text-[10px] font-bold text-on-surface-variant/50 uppercase tracking-wider">30%</span>
            </div>
            
            {
    /* Range input */
  }
            <input
    type="range"
    min="0"
    max="30"
    value={commissionRate}
    onChange={(e) => setCommissionRate(Number(e.target.value))}
    className="w-full h-2 bg-secondary-container rounded-lg appearance-none cursor-pointer accent-primary"
  />
          </div>

          <button
    onClick={handleSaveCommission}
    className="bg-primary text-white font-extrabold px-8 py-3.5 rounded-3xl shadow-lg shadow-primary-container/20 hover:scale-105 active:scale-95 transition-all cursor-pointer text-xs uppercase tracking-wider"
  >
            Kaydet
          </button>
        </div>
      </div>

      {
    /* Transactions Table */
  }
      <div className="bg-white rounded-3xl shadow-[0px_10px_30px_rgba(176,38,255,0.04)] border border-[#F1F1F1] overflow-hidden">
        <div className="px-8 py-6 flex flex-col sm:flex-row justify-between items-center gap-4 border-b border-outline-variant/30 bg-white">
          <h4 className="text-lg font-extrabold text-on-surface tracking-tight">Son İşlemler</h4>
          
          <div className="flex gap-2">
            <div className="relative">
              <input
    type="text"
    value={tableSearch}
    onChange={(e) => {
      setTableSearch(e.target.value);
      setCurrentPage(1);
    }}
    placeholder="İşlemlerde ara..."
    className="bg-surface-container-low border-none text-xs font-bold text-on-surface rounded-2xl pl-4 pr-10 py-2.5 focus:ring-1 focus:ring-primary-container"
  />
            </div>
            
            <button
    onClick={() => onShowToast("Son i\u015Flemler CSV format\u0131nda d\u0131\u015Fa aktar\u0131ld\u0131.")}
    className="flex items-center gap-2 px-4 py-2 border border-outline-variant rounded-2xl font-bold text-xs tracking-wide hover:bg-surface-container-low transition-colors cursor-pointer"
  >
              <FileSpreadsheet className="w-4 h-4 text-on-surface-variant" />
              CSV Dışa Aktar
            </button>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead className="bg-surface-container-lowest text-on-surface-variant font-bold text-[10px] uppercase tracking-widest border-b border-outline-variant/15">
              <tr>
                <th className="px-8 py-4">Kampanya &amp; Marka</th>
                <th className="px-6 py-4">Influencer</th>
                <th className="px-6 py-4 text-right">Brüt Tutar</th>
                <th className="px-6 py-4 text-center">Oran</th>
                <th className="px-6 py-4 text-right">Komisyon</th>
                <th className="px-6 py-4 text-right">Net Ödeme</th>
                <th className="px-6 py-4">Durum</th>
                <th className="px-8 py-4 text-center">İşlemler</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-outline-variant/30">
              {paginatedTx.length === 0 ? <tr>
                  <td colSpan={8} className="px-8 py-10 text-center text-on-surface-variant/60 font-medium">
                    Arama kriterine uygun finansal işlem kaydı bulunamadı.
                  </td>
                </tr> : paginatedTx.map((tx) => {
    const commissionAmount = tx.grossAmount * tx.feePercent / 100;
    const netPayment = tx.grossAmount - commissionAmount;
    return <tr key={tx.id} className="hover:bg-surface-container-low/40 transition-colors">
                      <td className="px-8 py-6">
                        <div className="flex flex-col">
                          <span className="font-extrabold text-sm text-on-surface">{tx.campaignName}</span>
                          <span className="text-xs font-bold text-on-surface-variant/60 mt-0.5">{tx.brandName}</span>
                        </div>
                      </td>
                      <td className="px-6 py-6">
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 rounded-full overflow-hidden border border-outline-variant/10 shadow-sm shrink-0">
                            <img referrerPolicy="no-referrer" className="w-full h-full object-cover" src={tx.influencerAvatar} alt={tx.influencerHandle} />
                          </div>
                          <span className="text-sm font-extrabold text-on-surface">{tx.influencerHandle}</span>
                        </div>
                      </td>
                      <td className="px-6 py-6 text-right font-extrabold text-sm text-on-surface">
                        ₺{tx.grossAmount.toLocaleString("tr-TR")}
                      </td>
                      <td className="px-6 py-6 text-center">
                        <span className="bg-surface-container-low border border-outline-variant/15 px-2.5 py-1 rounded-lg text-[10px] font-bold text-on-surface-variant">
                          {tx.feePercent}%
                        </span>
                      </td>
                      <td className="px-6 py-6 text-right font-extrabold text-sm text-primary">
                        ₺{commissionAmount.toLocaleString("tr-TR")}
                      </td>
                      <td className="px-6 py-6 text-right font-extrabold text-sm text-on-surface">
                        ₺{netPayment.toLocaleString("tr-TR")}
                      </td>
                      <td className="px-6 py-6">
                        <span
      className={`px-3 py-1 rounded-full text-[9px] font-extrabold uppercase tracking-wider inline-block ${tx.status === "Pending" ? "bg-[#F9F871] text-black" : tx.status === "Paid to Platform" ? "bg-secondary-container text-on-secondary-container" : "bg-primary-fixed text-primary"}`}
    >
                          {tx.status === "Pending" ? "Bekliyor" : tx.status === "Paid to Platform" ? "Platforma Aktarıldı" : "Influencer'a Ödendi"}
                        </span>
                      </td>
                      <td className="px-8 py-6 text-center">
                        {tx.status !== "Paid to Influencer" ? <button
      onClick={() => handlePayoutAction(tx)}
      className="p-2 text-primary hover:bg-primary/10 rounded-full transition-colors cursor-pointer"
      title={tx.status === "Pending" ? "\xD6demeyi Platform Havuzuna Al" : "Influencer Hesab\u0131na Aktar"}
    >
                            {tx.status === "Pending" ? <Landmark className="w-4.5 h-4.5" /> : <Send className="w-4.5 h-4.5" />}
                          </button> : <span className="text-[10px] font-extrabold text-on-surface-variant/40">TAMAMLANDI</span>}
                      </td>
                    </tr>;
  })}
            </tbody>
          </table>
        </div>

        {
    /* Pagination */
  }
        <div className="px-8 py-4 bg-surface-container-low flex justify-between items-center text-xs border-t border-outline-variant/15">
          <p className="text-on-surface-variant/80 font-bold">
            Toplam {filteredTransactions.length} işlem kaydından {filteredTransactions.length === 0 ? 0 : startIndex + 1}-{Math.min(startIndex + itemsPerPage, filteredTransactions.length)} arası gösteriliyor
          </p>
          <div className="flex gap-2">
            <button
    onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
    disabled={currentPage === 1}
    className="w-8 h-8 flex items-center justify-center rounded-lg border border-outline-variant/30 hover:bg-surface-container transition-colors disabled:opacity-30 cursor-pointer"
  >
              <ChevronLeft className="w-4 h-4" />
            </button>
            {Array.from({ length: totalPages }).map((_, index) => {
    const pg = index + 1;
    return <button
      key={pg}
      onClick={() => setCurrentPage(pg)}
      className={`w-8 h-8 flex items-center justify-center rounded-lg font-bold transition-all cursor-pointer ${currentPage === pg ? "bg-primary text-white" : "hover:bg-surface-container border border-transparent"}`}
    >
                  {pg}
                </button>;
  })}
            <button
    onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
    disabled={currentPage === totalPages}
    className="w-8 h-8 flex items-center justify-center rounded-lg border border-outline-variant/30 hover:bg-surface-container transition-colors disabled:opacity-30 cursor-pointer"
  >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    </div>;
}
function TrendingUp({ className }) {
  return <svg className={className} fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 18L9 11.25l4.306 4.307a11.95 11.95 0 015.814-5.519l2.74-1.22m0 0l-5.94-2.28m5.94 2.28l-2.28 5.941" />
    </svg>;
}
export {
  PaymentsTab as default
};

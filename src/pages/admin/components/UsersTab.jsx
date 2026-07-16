import { useState } from "react";
import { Download, Search, Eye, ChevronLeft, ChevronRight, TrendingUp, ClipboardCheck, Ban, CheckCircle2 } from "lucide-react";
function UsersTab({
  brandUsers,
  influencerUsers,
  onToggleUserStatus,
  onShowToast,
  onNavigateToTab,
  searchQuery
}) {
  const [subTab, setSubTab] = useState("brands");
  const [filterCategory, setFilterCategory] = useState("T\xFCm\xFC");
  const [filterStatus, setFilterStatus] = useState("T\xFCm\xFC");
  const [currentPage, setCurrentPage] = useState(1);
  const [tableSearch, setTableSearch] = useState("");
  const activeUsersList = subTab === "brands" ? brandUsers : influencerUsers;
  const filteredUsers = activeUsersList.filter((u) => {
    const searchString = (searchQuery || tableSearch).toLowerCase();
    const matchesSearch = u.name.toLowerCase().includes(searchString) || u.email.toLowerCase().includes(searchString);
    const matchesCategory = filterCategory === "T\xFCm\xFC" || u.category.toLowerCase().includes(filterCategory.toLowerCase());
    const matchesStatus = filterStatus === "T\xFCm\xFC" || filterStatus === "Aktif" && u.status === "Aktif" || filterStatus === "Ask\u0131ya Al\u0131nm\u0131\u015F" && u.status === "Ask\u0131ya Al\u0131nm\u0131\u015F";
    return matchesSearch && matchesCategory && matchesStatus;
  });
  const itemsPerPage = 4;
  const totalPages = Math.ceil(filteredUsers.length / itemsPerPage) || 1;
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedUsers = filteredUsers.slice(startIndex, startIndex + itemsPerPage);
  const handleToggleStatus = (user) => {
    const isBrand = subTab === "brands";
    onToggleUserStatus(user.id, isBrand);
    const nextStatus = user.status === "Aktif" ? "ask\u0131ya al\u0131nd\u0131" : "tekrar aktif edildi";
    onShowToast(`${user.name} hesab\u0131 ${nextStatus}.`);
  };
  const handleExportData = () => {
    onShowToast(`${subTab === "brands" ? "Markalar" : "Influencerlar"} verisi CSV olarak d\u0131\u015Fa aktar\u0131ld\u0131.`);
  };
  return <div className="space-y-8 animate-fade-in select-none">
      {
    /* Top Header Controls */
  }
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-end gap-4 mb-6">
        <div>
          <h2 className="text-3xl font-extrabold text-on-background tracking-tight">Kullanıcı Yönetimi</h2>
          <p className="text-sm text-on-surface-variant/80 mt-1">Platformdaki tüm marka ve influencer hesaplarını buradan yönetin.</p>
        </div>
        <button
    onClick={handleExportData}
    className="flex items-center gap-2 px-5 py-2.5 border-2 border-primary text-primary hover:bg-primary-fixed-dim/40 rounded-3xl font-bold text-xs tracking-wide transition-colors cursor-pointer"
  >
          <Download className="w-4 h-4" />
          Dışa Aktar
        </button>
      </div>

      {
    /* Main Tabs Selection */
  }
      <div className="flex border-b border-outline-variant/30 relative">
        <button
    onClick={() => {
      setSubTab("brands");
      setCurrentPage(1);
    }}
    className={`relative px-8 py-4 font-bold text-sm tracking-wide cursor-pointer transition-colors ${subTab === "brands" ? "text-primary" : "text-on-surface-variant hover:text-primary"}`}
  >
          Markalar
          {subTab === "brands" && <div className="absolute bottom-0 left-0 right-0 h-1 bg-primary rounded-t-full" />}
        </button>
        <button
    onClick={() => {
      setSubTab("influencers");
      setCurrentPage(1);
    }}
    className={`relative px-8 py-4 font-bold text-sm tracking-wide cursor-pointer transition-colors ${subTab === "influencers" ? "text-primary" : "text-on-surface-variant hover:text-primary"}`}
  >
          Influencerlar
          {subTab === "influencers" && <div className="absolute bottom-0 left-0 right-0 h-1 bg-primary rounded-t-full" />}
        </button>
      </div>

      {
    /* Filter Bento Card */
  }
      <div className="bg-surface-container-lowest rounded-3xl p-6 ambient-shadow border border-[#F1F1F1] flex flex-wrap gap-4 items-center">
        <div className="flex-1 min-w-[200px]">
          <label className="block text-[11px] font-bold text-on-surface-variant mb-1 uppercase tracking-widest">Arama</label>
          <div className="relative">
            <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-on-surface-variant/60" />
            <input
    type="text"
    value={tableSearch}
    onChange={(e) => {
      setTableSearch(e.target.value);
      setCurrentPage(1);
    }}
    className="w-full bg-background border-none rounded-xl py-2 pl-10 pr-4 text-xs font-bold tracking-wide focus:ring-1 focus:ring-primary-container"
    placeholder="İsim veya şirket adı..."
  />
          </div>
        </div>

        <div className="w-48">
          <label className="block text-[11px] font-bold text-on-surface-variant mb-1 uppercase tracking-widest">Kategori</label>
          <select
    value={filterCategory}
    onChange={(e) => {
      setFilterCategory(e.target.value);
      setCurrentPage(1);
    }}
    className="w-full bg-background border-none rounded-xl py-2 px-4 text-xs font-bold tracking-wide focus:ring-1 focus:ring-primary-container cursor-pointer"
  >
            <option value="Tümü">Tümü</option>
            {subTab === "brands" ? <>
                <option value="SaaS">SaaS & Teknoloji</option>
                <option value="Pazarlama">Pazarlama Ajansı</option>
                <option value="Sürdürülebilirlik">Sürdürülebilirlik</option>
                <option value="Güzellik">Güzellik & Bakım</option>
              </> : <>
                <option value="Moda">Moda & Lüks</option>
                <option value="Teknoloji">Teknoloji & Oyun</option>
                <option value="Sağlık">Sağlık & Yoga</option>
                <option value="Yaşam Tarzı">Yaşam Tarzı</option>
              </>}
          </select>
        </div>

        <div className="w-48">
          <label className="block text-[11px] font-bold text-on-surface-variant mb-1 uppercase tracking-widest">Durum</label>
          <select
    value={filterStatus}
    onChange={(e) => {
      setFilterStatus(e.target.value);
      setCurrentPage(1);
    }}
    className="w-full bg-background border-none rounded-xl py-2 px-4 text-xs font-bold tracking-wide focus:ring-1 focus:ring-primary-container cursor-pointer"
  >
            <option value="Tümü">Tümü</option>
            <option value="Aktif">Aktif</option>
            <option value="Askıya Alınmış">Askıya Alınmış</option>
          </select>
        </div>

        <div className="self-end">
          <button
    onClick={() => onShowToast("Filtreleme kriterleri uyguland\u0131.")}
    className="h-10 px-6 bg-[#755565] text-white rounded-xl font-bold text-xs tracking-wide flex items-center gap-2 hover:scale-[1.02] transition-transform cursor-pointer shadow-sm"
  >
            <Search className="w-4 h-4" />
            Filtrele
          </button>
        </div>
      </div>

      {
    /* User Table (Bento Style Card) */
  }
      <div className="bg-surface-container-lowest rounded-3xl overflow-hidden border border-[#F1F1F1] ambient-shadow">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-surface-container-low text-on-surface-variant border-b border-outline-variant/30">
              <th className="px-6 py-4.5 text-xs font-bold uppercase tracking-widest">İsim / Şirket</th>
              <th className="px-6 py-4.5 text-xs font-bold uppercase tracking-widest">E-posta</th>
              <th className="px-6 py-4.5 text-xs font-bold uppercase tracking-widest">Kayıt Tarihi</th>
              <th className="px-6 py-4.5 text-xs font-bold uppercase tracking-widest">Durum</th>
              <th className="px-6 py-4.5 text-xs font-bold uppercase tracking-widest text-right">İşlemler</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-outline-variant/30">
            {paginatedUsers.length === 0 ? <tr>
                <td colSpan={5} className="px-6 py-12 text-center text-on-surface-variant/60 font-medium">
                  Kriterlere uygun kullanıcı bulunamadı.
                </td>
              </tr> : paginatedUsers.map((user) => <tr key={user.id} className="hover:bg-background transition-colors">
                  <td className="px-6 py-5">
                    <div className="flex items-center gap-3">
                      {
    /* Generates placeholder letters logo exactly as spec */
  }
                      <div className="w-10 h-10 rounded-2xl bg-secondary-container flex items-center justify-center text-primary font-extrabold text-sm shadow-inner shrink-0">
                        {user.logoLetters}
                      </div>
                      <div>
                        <p className="font-extrabold text-on-background text-sm">{user.name}</p>
                        <p className="text-[11px] font-bold text-on-surface-variant/80 mt-0.5">{user.category}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-5 text-sm text-on-surface/80 font-medium">{user.email}</td>
                  <td className="px-6 py-5 text-sm text-on-surface/80 font-medium">{user.signupDate}</td>
                  <td className="px-6 py-5">
                    <span
    className={`inline-flex items-center px-3.5 py-1 rounded-full text-[10px] font-extrabold uppercase tracking-wide ${user.status === "Aktif" ? "bg-[#f9f871]/45 text-[#303000]" : "bg-error-container text-on-error-container"}`}
  >
                      {user.status}
                    </span>
                  </td>
                  <td className="px-6 py-5 text-right">
                    <div className="flex justify-end gap-1">
                      <button
    onClick={() => onShowToast(`${user.name} detaylar\u0131 y\xFCkleniyor...`)}
    className="p-2.5 hover:bg-surface-container-high rounded-xl transition-colors text-primary cursor-pointer"
    title="Detay"
  >
                        <Eye className="w-4 h-4" />
                      </button>
                      <button
    onClick={() => handleToggleStatus(user)}
    className={`p-2.5 rounded-xl transition-colors cursor-pointer ${user.status === "Aktif" ? "hover:bg-error-container text-error" : "hover:bg-secondary-container text-primary"}`}
    title={user.status === "Aktif" ? "Ask\u0131ya Al" : "Aktif Et"}
  >
                        {user.status === "Aktif" ? <Ban className="w-4 h-4" /> : <CheckCircle2 className="w-4 h-4" />}
                      </button>
                    </div>
                  </td>
                </tr>)}
          </tbody>
        </table>

        {
    /* Table Pagination */
  }
        <div className="px-6 py-4 bg-surface-container-low flex flex-col sm:flex-row justify-between items-center gap-4 border-t border-outline-variant/30 text-xs">
          <p className="text-on-surface-variant/80 font-bold">
            Toplam {filteredUsers.length} {subTab === "brands" ? "marka" : "influencer"} arasından{" "}
            {filteredUsers.length === 0 ? 0 : startIndex + 1}-{Math.min(startIndex + itemsPerPage, filteredUsers.length)} gösteriliyor
          </p>
          
          <div className="flex gap-1 items-center">
            <button
    onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
    disabled={currentPage === 1}
    className="w-8 h-8 flex items-center justify-center rounded-lg hover:bg-surface-container transition-colors disabled:opacity-30 cursor-pointer"
  >
              <ChevronLeft className="w-4 h-4" />
            </button>
            
            {Array.from({ length: totalPages }).map((_, index) => {
    const pg = index + 1;
    return <button
      key={pg}
      onClick={() => setCurrentPage(pg)}
      className={`w-8 h-8 flex items-center justify-center rounded-lg font-bold transition-all cursor-pointer ${currentPage === pg ? "bg-primary text-white shadow-sm" : "hover:bg-surface-container"}`}
    >
                  {pg}
                </button>;
  })}

            <button
    onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
    disabled={currentPage === totalPages}
    className="w-8 h-8 flex items-center justify-center rounded-lg hover:bg-surface-container transition-colors disabled:opacity-30 cursor-pointer"
  >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      {
    /* Quick Insight Stats (Asymmetric Bento) */
  }
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-12 pb-6">
        <div className="bg-primary-container p-6 rounded-3xl text-on-primary-container ambient-shadow flex flex-col justify-between h-44 border border-primary-container/20 group">
          <div>
            <TrendingUp className="w-8 h-8 mb-4 stroke-[2.5px] text-white/90 group-hover:scale-110 transition-transform" />
            <h3 className="text-4xl font-extrabold text-white tracking-tight">+24%</h3>
          </div>
          <p className="text-sm font-bold text-white/90 tracking-wide">Bu ay yeni marka kaydı</p>
        </div>

        <div className="bg-surface-container-highest p-6 rounded-3xl ambient-shadow border border-[#F1F1F1] col-span-1 md:col-span-2 flex justify-between items-center h-44">
          <div className="space-y-2 max-w-md">
            <h3 className="text-on-surface font-extrabold text-lg tracking-tight">Onay Bekleyenler</h3>
            <p className="text-on-surface-variant/80 text-sm leading-relaxed">Şu anda incelenmeyi bekleyen yeni hesap başvuruları bulunmaktadır.</p>
            <button
    onClick={() => onNavigateToTab("approvals")}
    className="mt-3 px-6 py-2 bg-on-surface text-surface-container-lowest font-extrabold text-xs tracking-wider uppercase rounded-3xl hover:scale-105 active:scale-95 transition-transform cursor-pointer"
  >
              İncelemeye Başla
            </button>
          </div>
          <div className="hidden md:block">
            <ClipboardCheck className="w-20 h-20 text-primary/10 stroke-[1.5px] animate-pulse" />
          </div>
        </div>
      </div>
    </div>;
}
export {
  UsersTab as default
};

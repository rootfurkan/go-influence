import { useDispatch, useSelector } from "react-redux";
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Sidebar from "./components/Sidebar";
import MobileNav from "./components/MobileNav";
import Header from "./components/Header";
import DashboardScreen from "./components/DashboardScreen";
import OffersScreen from "./components/OffersScreen";
import NeedsScreen from "./components/NeedsScreen";
import ProfileScreen from "./components/ProfileScreen";
import PortfolioScreen from "./components/PortfolioScreen";
import MessagesScreen from "./components/MessagesScreen";
import SettingsScreen from "./components/SettingsScreen";
import Toast from "./components/Toast";
import {
  addInfluencerToast,
  removeInfluencerToast,
  setInfluencerActiveScreen,
  setInfluencerChatThreads,
  setInfluencerNeeds,
  setInfluencerOffers,
  setInfluencerProfile,
  setInfluencerSearchQuery,
} from "../../features/influencer/influencerPanelSlice";
import { subscribeToInfluencerProfile } from "../../features/auth/authService";
import {
  createCampaignOffer,
  ensureChatThread,
  sendChatMessage,
  subscribeToChatThreads,
  subscribeToInfluencerCampaignMatches,
  subscribeToInfluencerOffers,
  updateCampaignOfferStatus,
} from "../../features/admin/adminService";

const influencerScreenRoutes = {
  dashboard: "/influencer-panel",
  offers: "/influencer-panel/offers",
  needs: "/influencer-panel/needs",
  profile: "/influencer-panel/profile",
  portfolio: "/influencer-panel/portfolio",
  messages: "/influencer-panel/messages",
  settings: "/influencer-panel/settings",
};

function App({ initialScreen = "dashboard" }) {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { user, profile } = useSelector((state) => state.auth);
  const { activeScreen, searchQuery, offers, needs, chatThreads, profile: influencerProfile, toasts } = useSelector((state) => state.influencerPanel);
  const searchResults = buildInfluencerSearchResults(searchQuery);
  const currentProfile = influencerProfile || profile;

  useEffect(() => {
    dispatch(setInfluencerActiveScreen(initialScreen));
  }, [dispatch, initialScreen]);
  useEffect(() => {
    const unsubscribe = subscribeToInfluencerCampaignMatches(
      user?.uid,
      currentProfile?.settings?.minimumMatchScore ?? 0,
      (items) => dispatch(setInfluencerNeeds(
        items.map(mapCampaignMatchToNeed),
      )),
      () => showToast("Marka ihtiyaçları alınamadı.", "error"),
    );

    return unsubscribe;
  }, [dispatch, user?.uid, currentProfile?.settings?.minimumMatchScore]);
  useEffect(() => {
    const unsubscribe = subscribeToInfluencerProfile(
      user?.uid,
      (data) => dispatch(setInfluencerProfile(data)),
      () => showToast("Profil bilgileri alınamadı.", "error"),
    );

    return unsubscribe;
  }, [dispatch, user?.uid]);
  useEffect(() => {
    const unsubscribe = subscribeToInfluencerOffers(
      user?.uid,
      (items) => dispatch(setInfluencerOffers(items.map(mapOfferToInfluencerOffer))),
      () => showToast("Gelen teklifler alınamadı.", "error"),
    );

    return unsubscribe;
  }, [dispatch, user?.uid]);
  useEffect(() => {
    const unsubscribe = subscribeToChatThreads(
      user?.uid,
      (items) => dispatch(setInfluencerChatThreads(items.map(mapThreadToInfluencerChannel))),
      () => showToast("Mesajlar alınamadı.", "error"),
    );

    return unsubscribe;
  }, [dispatch, user?.uid]);

  const navigateToScreen = (screen) => {
    dispatch(setInfluencerActiveScreen(screen));
    navigate(influencerScreenRoutes[screen] || "/influencer-panel");
  };
  const handleSearchResultClick = (result) => {
    navigateToScreen(result.screen);
    dispatch(setInfluencerSearchQuery(result.title));
  };
  const showToast = (message, type = "success") => {
    const id = Date.now().toString();
    dispatch(addInfluencerToast({ id, message, type }));
    setTimeout(() => {
      dispatch(removeInfluencerToast(id));
    }, 4000);
  };
  const removeToast = (id) => {
    dispatch(removeInfluencerToast(id));
  };
  const renderActiveScreen = () => {
    switch (activeScreen) {
      case "dashboard":
        return <DashboardScreen
          onNavigate={navigateToScreen}
          profile={currentProfile}
          offers={offers}
          needs={needs}
        />;
      case "offers":
        return <OffersScreen
          offers={offers}
          profile={currentProfile}
          onShowToast={showToast}
          onOfferStatusChange={async (offerId, nextStatus) => {
            await updateCampaignOfferStatus(offerId, nextStatus);
          }}
        />;
      case "needs":
        return <NeedsScreen
          needs={needs}
          profile={currentProfile}
          onShowToast={showToast}
          onApplyToCampaign={async (need) => {
            if (!user?.uid) throw new Error("Oturum bilgisi bulunamadı.");

            await createCampaignOffer({
              campaignId: need.id,
              brandUid: need.brandUid,
              brandName: need.brandName,
              campaignTitle: need.title,
              creatorId: user?.uid,
              influencerUid: user?.uid,
              creatorName: currentProfile?.displayName || user?.email || "Influencer",
              creatorUsername: currentProfile?.email || user?.email || "",
              avatarUrl: currentProfile?.profileImageUrl || "",
              campaignBannerUrl: isInlineDataUrl(need.bannerUrl) ? "" : need.bannerUrl || "",
              category: need.category,
              type: need.type,
              amount: need.budgetMin,
              status: "Pending",
              message: `${need.title} kampanyası için başvuru yapıldı.`,
            });

            try {
              await ensureChatThread({
                brandUid: need.brandUid,
                influencerUid: user?.uid,
                brandName: need.brandName,
                influencerName: currentProfile?.displayName || user?.email || "Influencer",
                brandAvatar: isInlineDataUrl(need.logoUrl) ? "" : need.logoUrl,
                influencerAvatar: currentProfile?.profileImageUrl || "",
                category: need.category,
                lastMessageText: `${need.title} kampanyası için başvuru yaptım.`,
                initialMessage: {
                  id: `msg_${Date.now()}`,
                  sender: "user",
                  text: `${need.title} kampanyası için başvuru yaptım. Detayları konuşabiliriz.`,
                  timestamp: new Date().toISOString(),
                },
              });
            } catch (error) {
              console.warn("Application was created, but chat thread could not be created.", error);
            }
          }}
        />;
      case "profile":
        return <ProfileScreen
          profile={currentProfile}
          user={user}
          onShowToast={showToast}
        />;
      case "portfolio":
        return <PortfolioScreen
          profile={currentProfile}
          user={user}
          onShowToast={showToast}
        />;
      case "messages":
        return <MessagesScreen
          channels={chatThreads}
          onShowToast={showToast}
          onSendMessage={async (threadId, text) => {
            await sendChatMessage(threadId, { sender: "user", text });
          }}
        />;
      case "settings":
        return <SettingsScreen
          onShowToast={showToast}
          profile={currentProfile}
          user={user}
        />;
      default:
        return <DashboardScreen
          onNavigate={navigateToScreen}
          profile={currentProfile}
          offers={offers}
          needs={needs}
        />;
    }
  };
  return <div className="flex min-h-screen text-on-surface bg-background antialiased selection:bg-primary-fixed selection:text-on-primary-fixed">
      {
    /* Sidebar Navigation */
  }
      <Sidebar activeScreen={activeScreen} onNavigate={navigateToScreen} />

      {
    /* Main Container */
  }
      <div className="flex-1 md:ml-72 flex flex-col min-h-screen">
        <Header
          profile={currentProfile}
          user={user}
          searchQuery={searchQuery}
          searchResults={searchResults}
          onSearchChange={(value) => dispatch(setInfluencerSearchQuery(value))}
          onSearchResultClick={handleSearchResultClick}
          onNavigateToProfile={() => navigateToScreen("profile")}
          onNavigateToSettings={() => navigateToScreen("settings")}
          pendingOfferCount={offers.filter((offer) => offer.status === "pending").length}
        />
        {
    /* Main Content Area */
  }
        <main className="flex-grow pt-28 pb-12 px-6 md:px-12 lg:px-16">
          <div className="max-w-7xl mx-auto w-full">
            <div className="hidden">
              <span className="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-primary text-[20px]">search</span>
              <input
                type="text"
                value={searchQuery}
                onChange={(event) => dispatch(setInfluencerSearchQuery(event.target.value))}
                placeholder="Panelde ara..."
                className="w-full bg-white border border-outline-variant/30 rounded-2xl pl-12 pr-4 py-3 text-sm font-semibold outline-none focus:border-primary/40 focus:ring-2 focus:ring-primary-container transition-all text-on-surface placeholder:text-on-surface-variant/50 shadow-sm"
              />
              {searchQuery.trim() && <div className="absolute left-0 right-0 top-14 rounded-3xl border border-outline-variant/40 bg-white shadow-2xl shadow-primary/10 overflow-hidden z-50">
                  {searchResults.length ? <div className="max-h-80 overflow-y-auto py-2">
                      {searchResults.map((result) => <button
            key={result.screen}
            type="button"
            onMouseDown={(event) => event.preventDefault()}
            onClick={() => handleSearchResultClick(result)}
            className="w-full px-4 py-3 text-left hover:bg-surface-container-low transition-colors flex items-start gap-3"
          >
                          <span className="mt-1 h-2 w-2 rounded-full bg-primary shrink-0" />
                          <span className="min-w-0">
                            <span className="block text-[10px] font-extrabold uppercase tracking-wider text-primary">{result.group}</span>
                            <span className="block text-sm font-bold text-on-surface truncate">{result.title}</span>
                            <span className="block text-xs font-medium text-on-surface-variant truncate">{result.description}</span>
                          </span>
                        </button>)}
                    </div> : <div className="px-4 py-4 text-sm font-bold text-on-surface-variant">
                      Sonuç Bulunamadı
                    </div>}
                </div>}
            </div>
            {renderActiveScreen()}
          </div>
        </main>

        {
    /* Global Footer */
  }
        <footer className="w-full bg-surface-container-low py-8 border-t border-outline-variant/10 mt-auto">
          <div className="max-w-7xl mx-auto px-6 md:px-12 flex flex-col md:flex-row justify-between items-center gap-4">
            <div className="font-sans text-xl font-bold text-primary">Go Influence</div>
            <div className="flex space-x-6">
              <a href="#" className="text-xs font-semibold text-on-surface-variant hover:text-primary transition-colors">Privacy Policy</a>
              <a href="#" className="text-xs font-semibold text-on-surface-variant hover:text-primary transition-colors">Terms of Service</a>
              <a href="#" className="text-xs font-semibold text-on-surface-variant hover:text-primary transition-colors">Destek ile İletişime Geç</a>
            </div>
            <div className="text-xs text-on-surface-variant">© 2026 Go Influence. Tüm hakları saklıdır.</div>
          </div>
        </footer>
      </div>

      {
    /* Toast Notifications */
  }
      <Toast toasts={toasts} onClose={removeToast} />

      {
    /* Mobile Bottom Navigation */
  }
      <MobileNav activeScreen={activeScreen} onNavigate={navigateToScreen} />
    </div>;
}
export {
  App as default
};

function buildInfluencerSearchResults(query) {
  const normalizedQuery = normalizeSearch(query);
  if (!normalizedQuery) return [];

  return [
    { screen: "dashboard", group: "Panel", title: "Kontrol Paneli", description: "Genel istatistikler ve özet" },
    { screen: "offers", group: "Teklifler", title: "Gelen Teklifler", description: "Markalardan gelen iş birlikleri" },
    { screen: "needs", group: "Marka İhtiyaçları", title: "Marka İhtiyaçları", description: "Açık kampanya ve marka talepleri" },
    { screen: "profile", group: "Profil", title: "Profilim", description: "Influencer profil bilgileri" },
    { screen: "portfolio", group: "Portfolyo", title: "Portfolyo", description: "Galeri ve iş birliği ücretleri" },
    { screen: "messages", group: "Mesajlar", title: "Mesajlar", description: "Markalarla görüşmeler" },
    { screen: "settings", group: "Ayarlar", title: "Ayarlar", description: "Hesap ve bildirim tercihleri" },
  ].filter((item) => matchesSearch(normalizedQuery, item.group, item.title, item.description));
}

function mapCampaignMatchToNeed(match) {
  const need = mapCampaignToNeed({
    ...(match.campaign || {}),
    id: match.campaignId || match.campaign?.id,
    brandUid: match.brandUid || match.campaign?.brandUid,
    brandName: match.brandName || match.campaign?.brandName,
    brand: match.brandName || match.campaign?.brand,
    title: match.campaignTitle || match.campaign?.title,
    name: match.campaignTitle || match.campaign?.name,
    matchScore: match.score,
    matchNote: match.reasons?.length ? match.reasons.join(" ") : match.campaign?.matchNote,
  });

  return {
    ...need,
    matchId: match.id,
    matchScore: Number(match.score || need.matchScore || 0),
    matchReasons: match.reasons || [],
    matchBreakdown: match.breakdown || {},
  };
}

function mapCampaignToNeed(campaign) {
  const { min, max } = parseBudgetRange(campaign.budgetRange);
  const contentTypes = normalizeContentTypes(campaign.contentType || campaign.contentTypes || campaign.type);
  const categories = campaign.categories?.length ? campaign.categories : [campaign.category || "Genel"];

  return {
    id: campaign.id,
    brandUid: campaign.brandUid || campaign.brandId || campaign.ownerUid || campaign.createdBy || campaign.userId || "",
    brandName: campaign.brand || campaign.brandName || "-",
    logoUrl: campaign.logoUrl || campaign.brandLogoUrl || campaign.bannerUrl || "https://placehold.co/120x120?text=GI",
    bannerUrl: campaign.bannerUrl || "",
    title: campaign.name || campaign.title || "Kampanya",
    budgetMin: Number(campaign.budgetMin || min || 0),
    budgetMax: Number(campaign.budgetMax || max || 0),
    duration: campaign.endDate ? `${campaign.startDate || "Bugün"} - ${campaign.endDate}` : campaign.duration || "Belirtilmedi",
    matchScore: campaign.matchScore || 85,
    category: categories[0] || "Genel",
    categories,
    type: contentTypes.join(" / ") || "İçerik",
    contentTypes,
    startDate: campaign.startDate || "",
    endDate: campaign.endDate || "",
    targetAgeMin: Number(campaign.targetAgeMin || 18),
    targetAgeMax: Number(campaign.targetAgeMax || 65),
    targetGender: campaign.targetGender || "Hepsi",
    location: campaign.location || "",
    statusLabel: campaign.statusLabel || campaign.status || "Aktif",
    description: campaign.description || "Bu marka yeni içerik üreticileriyle iş birliği yapmak istiyor.",
    matchNote: campaign.matchNote || buildCampaignMatchNote(campaign, contentTypes),
  };
}

function normalizeContentTypes(value) {
  if (Array.isArray(value)) return value.filter(Boolean);
  if (!value) return [];
  return String(value)
    .split(/[,/]+/)
    .map((item) => item.trim())
    .filter(Boolean);
}

function buildCampaignMatchNote(campaign, contentTypes) {
  const contentText = contentTypes.length ? contentTypes.join(", ") : "icerik";
  const audience = `${campaign.targetAgeMin || 18}-${campaign.targetAgeMax || 65} yas / ${campaign.targetGender || "hepsi"}`;
  return `Marka ${contentText} uretimi istiyor. Kategori ve hizmet bilgileriniz kampanya ihtiyaclariyla karsilastirildi. Hedef kitle: ${audience}.`;
}

function mapOfferToInfluencerOffer(offer) {
  return {
    id: offer.id,
    brandName: offer.brandName || offer.campaignTitle || "Marka",
    logoUrl: offer.logoUrl || "https://placehold.co/120x120?text=GI",
    category: offer.category || "Kampanya",
    status: normalizeOfferStatus(offer.status),
    type: offer.type || offer.campaignTitle || "İş birliği",
    budget: Number(offer.amount || 0),
  };
}

function mapThreadToInfluencerChannel(thread) {
  return {
    id: thread.id,
    brandName: thread.brandName,
    logoUrl: thread.brandAvatar,
    category: thread.category,
    lastMessage: thread.lastMessageText,
    unreadCount: 0,
    messages: (thread.messages || []).map((message) => ({
      id: message.id,
      sender: message.sender === "brand" ? "brand" : "user",
      text: message.text,
      timestamp: formatThreadTime(message.timestamp),
    })),
  };
}

function formatThreadTime(value) {
  const date = value?.toDate?.() || (value ? new Date(value) : null);
  if (!date || Number.isNaN(date.getTime())) return "";
  return date.toLocaleTimeString("tr-TR", { hour: "2-digit", minute: "2-digit" });
}

function normalizeOfferStatus(status) {
  if (status === "Accepted") return "approved";
  if (status === "Rejected") return "rejected";
  return "pending";
}

function parseBudgetRange(value) {
  const numbers = String(value || "")
    .match(/\d[\d.,]*/g)
    ?.map((item) => Number(item.replace(/\./g, "").replace(",", ".")))
    .filter((item) => Number.isFinite(item)) || [];

  if (!numbers.length) return { min: 0, max: 0 };
  if (numbers.length === 1) return { min: numbers[0], max: numbers[0] };
  return { min: Math.min(...numbers), max: Math.max(...numbers) };
}

function matchesSearch(normalizedQuery, ...values) {
  return values.some((value) => normalizeSearch(value).includes(normalizedQuery));
}

function normalizeSearch(value) {
  return String(value || "").toLocaleLowerCase("tr-TR").trim();
}

function isInlineDataUrl(value) {
  return String(value || "").startsWith("data:");
}


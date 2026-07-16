/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { AnimatePresence, motion } from "motion/react";
import { PlusCircle } from "lucide-react";
import { completeBrandOnboarding } from "../../features/auth/authService";
import {
  createCampaign as createFirestoreCampaign,
  createCampaignMatchesForCampaign,
  createCampaignOffer,
  ensureChatThread,
  sendChatMessage,
  subscribeToApprovedInfluencers,
  subscribeToBrandOffers,
  subscribeToBrandCampaigns,
  subscribeToCampaignMatches,
  subscribeToChatThreads,
  updateCampaign as updateFirestoreCampaign,
} from "../../features/admin/adminService";
import {
  addBrandChatMessage,
  openBrandChat,
  setActiveBrandChatThread,
  setBrandAppMode,
  setBrandBudget,
  setBrandCategories,
  setBrandCampaigns,
  setBrandCreators,
  setBrandOffers,
  setBrandCurrentTab,
  setBrandOfferModalCreator,
  setBrandOnboardingSaving,
  setBrandSearchQuery,
  setBrandChatThreads,
  toggleBrandMobileSidebar,
  updateBrandCampaign,
  updateBrandProfile,
} from "../../features/brand/brandPanelSlice";
import BrandSignUpView from "./components/BrandSignUpView";
import StepCompanyInfo from "./components/Onboarding/StepCompanyInfo";
import StepCategories from "./components/Onboarding/StepCategories";
import StepBrandIdentity from "./components/Onboarding/StepBrandIdentity";
import Sidebar from "./components/Sidebar";
import Header from "./components/Header";
import DashboardView from "./components/DashboardView";
import CampaignCreatorView from "./components/CampaignCreatorView";
import MatchResultsView from "./components/MatchResultsView";
import OffersView from "./components/OffersView";
import MessagesView from "./components/MessagesView";
import SendOfferModal from "./components/SendOfferModal";
const brandTabRoutes = {
  dashboard: "/brand",
  campaigns: "/brand/campaigns",
  new_campaign: "/brand/new-campaign",
  matches: "/brand/matches",
  offers: "/brand/offers",
  messages: "/brand/messages",
  settings: "/brand/settings",
};

function App({ initialMode = "MAIN", initialTab = "dashboard" }) {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.auth);
  const [editingCampaign, setEditingCampaign] = useState(null);
  const [selectedMatchCampaignId, setSelectedMatchCampaignId] = useState("");
  const [campaignMatchCreators, setCampaignMatchCreators] = useState([]);
  const {
    appMode,
    brandProfile,
    brandCategories,
    brandBudget,
    onboardingSaving,
    currentTab,
    searchQuery,
    mobileSidebarOpen,
    campaigns,
    offers,
    chatThreads,
    creators,
    activeChatThreadId,
    offerModalCreator,
  } = useSelector((state) => state.brandPanel);

  useEffect(() => {
    dispatch(setBrandAppMode(initialMode));
  }, [dispatch, initialMode]);
  useEffect(() => {
    if (initialMode === "MAIN") dispatch(setBrandCurrentTab(initialTab));
  }, [dispatch, initialMode, initialTab]);
  useEffect(() => {
    const unsubscribe = subscribeToChatThreads(
      user?.uid,
      (items) => dispatch(setBrandChatThreads(items.map(mapThreadToBrandThread))),
      () => {},
    );

    return unsubscribe;
  }, [dispatch, user?.uid]);
  useEffect(() => {
    const unsubscribe = subscribeToBrandCampaigns(
      user?.uid,
      (items) => dispatch(setBrandCampaigns(items)),
      (error) => console.error("Brand campaigns could not be loaded.", error),
    );

    return unsubscribe;
  }, [dispatch, user?.uid]);
  useEffect(() => {
    const unsubscribe = subscribeToBrandOffers(
      user?.uid,
      (items) => dispatch(setBrandOffers(items.map(mapOfferToBrandOffer))),
      (error) => console.error("Brand offers could not be loaded.", error),
    );

    return unsubscribe;
  }, [dispatch, user?.uid]);
  useEffect(() => {
    const unsubscribe = subscribeToApprovedInfluencers(
      (items) => dispatch(setBrandCreators(items.map(mapInfluencerToCreator))),
      (error) => console.error("Approved influencers could not be loaded.", error),
    );

    return unsubscribe;
  }, [dispatch]);
  useEffect(() => {
    if (!campaigns.length) {
      setSelectedMatchCampaignId("");
      return;
    }

    if (!selectedMatchCampaignId || !campaigns.some((campaign) => campaign.id === selectedMatchCampaignId)) {
      setSelectedMatchCampaignId(campaigns[0].id);
    }
  }, [campaigns, selectedMatchCampaignId]);
  useEffect(() => {
    const unsubscribe = subscribeToCampaignMatches(
      selectedMatchCampaignId,
      user?.uid,
      (items) => setCampaignMatchCreators(items.map(mapCampaignMatchToCreator)),
      (error) => console.error("Campaign matches could not be loaded.", error),
    );

    return unsubscribe;
  }, [selectedMatchCampaignId, user?.uid]);

  const changeTab = (tab) => {
    dispatch(setBrandCurrentTab(tab));
    navigate(brandTabRoutes[tab] || "/brand");
  };
  const searchResults = buildBrandSearchResults(searchQuery, {
    campaigns,
    creators,
    offers,
    chatThreads,
  });
  const handleSearchResultClick = (result) => {
    changeTab(result.tab);
    dispatch(setBrandSearchQuery(result.title));
    if (result.chatThreadId) dispatch(setActiveBrandChatThread(result.chatThreadId));
  };

  const handleSignUpComplete = (fullName, email) => {
    dispatch(updateBrandProfile({
      name: fullName.split(" ")[0] || "Markan\u0131z"
    }));
    dispatch(setBrandAppMode("ONBOARDING_STEP1"));
  };
  const handleProfileUpdate = (updates) => {
    dispatch(updateBrandProfile(updates));
  };
  const handleCreateCampaign = async (newCamp, options = {}) => {
    const bannerUrl = options.bannerDataUrl || newCamp.bannerUrl;
    const bannerSource = options.bannerDataUrl ? "inline" : bannerUrl ? "url" : "default";

    const campaignToSave = {
      ...newCamp,
      bannerUrl,
      bannerSource,
      brandUid: user?.uid,
      name: newCamp.title,
      title: newCamp.title,
      brand: brandProfile.name,
      brandName: brandProfile.name,
      category: newCamp.categories?.[0] || "Genel",
      budgetRange: `₺${Number(newCamp.budgetMin || 0).toLocaleString("tr-TR")} - ₺${Number(newCamp.budgetMax || 0).toLocaleString("tr-TR")}`,
      status: newCamp.status || "Aktif",
      creatorAvatars: [],
      creatorCount: 0,
    };

    const savedCampaign = await createFirestoreCampaign(campaignToSave);
    setSelectedMatchCampaignId(savedCampaign.id);
    createCampaignMatchesForCampaign(savedCampaign).catch((error) => {
      console.warn("Campaign matches could not be generated.", error);
    });
    dispatch(setBrandCurrentTab("matches"));
    navigate("/brand/matches");
  };

  const handleUpdateCampaign = async (updatedCamp, options = {}) => {
    const bannerUrl = options.bannerDataUrl || updatedCamp.bannerUrl;
    const bannerSource = options.bannerDataUrl ? "inline" : bannerUrl ? "url" : "default";
    const campaignToSave = {
      ...editingCampaign,
      ...updatedCamp,
      bannerUrl,
      bannerSource,
      brandUid: user?.uid,
      name: updatedCamp.title,
      title: updatedCamp.title,
      brand: brandProfile.name,
      brandName: brandProfile.name,
      category: updatedCamp.categories?.[0] || "Genel",
      budgetRange: `₺${Number(updatedCamp.budgetMin || 0).toLocaleString("tr-TR")} - ₺${Number(updatedCamp.budgetMax || 0).toLocaleString("tr-TR")}`,
      status: updatedCamp.status || "Aktif",
    };

    const savedCampaign = await updateFirestoreCampaign(editingCampaign.id, campaignToSave);
    setSelectedMatchCampaignId(savedCampaign.id);
    createCampaignMatchesForCampaign({
      ...campaignToSave,
      id: savedCampaign.id,
    }).catch((error) => {
      console.warn("Campaign matches could not be regenerated.", error);
    });
    dispatch(updateBrandCampaign({
      ...campaignToSave,
      id: savedCampaign.id,
    }));
    setEditingCampaign(null);
    navigate("/brand/campaigns");
  };

  const handleEditCampaign = (campaign) => {
    setEditingCampaign(campaign);
    dispatch(setBrandCurrentTab("new_campaign"));
    navigate("/brand/new-campaign");
  };

  const handleCancelCampaignEdit = () => {
    setEditingCampaign(null);
    navigate("/brand/campaigns");
    dispatch(setBrandCurrentTab("campaigns"));
  };
  const handleBrandOnboardingSubmit = async () => {
    if (!user?.uid) return;

    dispatch(setBrandOnboardingSaving(true));
    await completeBrandOnboarding(user.uid, {
      ...brandProfile,
      categories: brandCategories,
      budget: brandBudget
    });
    dispatch(setBrandOnboardingSaving(false));
    dispatch(setBrandAppMode("MAIN"));
    navigate("/brand", { replace: true });
  };
  const handleOpenOfferModal = (creator) => {
    dispatch(setBrandOfferModalCreator(creator));
  };
  const handleOfferSubmit = async (amount, campaignId) => {
    if (!offerModalCreator) return;
    const selectedCampaign = campaigns.find((campaign) => campaign.id === campaignId)
      || campaigns.find((campaign) => campaign.title === campaignId)
      || campaigns[0];
    const campaignTitle = selectedCampaign?.title || selectedCampaign?.name || "Kampanya";
    const newOffer = {
      id: `off_${Date.now()}`,
      creatorId: offerModalCreator.id,
      influencerUid: offerModalCreator.id,
      creatorName: offerModalCreator.name,
      creatorUsername: offerModalCreator.username,
      avatarUrl: offerModalCreator.avatarUrl,
      campaignTitle,
      amount,
      status: "Beklemede",
      updatedAt: "Bug\xFCn"
    };
    const savedOffer = await createCampaignOffer({
      ...newOffer,
      brandUid: user?.uid,
      brandName: brandProfile.name,
      campaignId: selectedCampaign?.id,
      campaignTitle,
      status: "Pending",
    });
    dispatch(setBrandOfferModalCreator(null));
    dispatch(setBrandCurrentTab("offers"));
    await ensureChatThread({
      brandUid: user?.uid,
      influencerUid: offerModalCreator.id,
      brandName: brandProfile.name,
      influencerName: offerModalCreator.name,
      brandAvatar: brandProfile.logoUrl,
      influencerAvatar: offerModalCreator.avatarUrl,
      category: campaignTitle,
      lastMessageText: `${campaignTitle} için teklif gönderildi.`,
      initialMessage: {
        id: `msg_${Date.now()}`,
        sender: "brand",
        text: `${campaignTitle} için ₺${Number(amount || 0).toLocaleString("tr-TR")} teklif gönderdik.`,
        timestamp: new Date().toISOString(),
      },
    });
    navigate("/brand/offers");
  };
  const handleSendMessage = async (threadId, text) => {
    const newMsg = {
      id: `msg_${Date.now()}`,
      sender: "brand",
      text,
      timestamp: (/* @__PURE__ */ new Date()).toLocaleTimeString("tr-TR", { hour: "2-digit", minute: "2-digit" })
    };
    dispatch(addBrandChatMessage({ threadId, message: newMsg, lastMessageText: text }));
    await sendChatMessage(threadId, { sender: "brand", text });
  };
  const handleOpenChat = (creatorId) => {
    const threadId = String(creatorId || "").includes("_") ? creatorId : `${user?.uid}_${creatorId}`;
    dispatch(openBrandChat(threadId));
    navigate("/brand/messages");
  };
  const renderTabContent = () => {
    switch (currentTab) {
      case "dashboard":
        return <DashboardView
          creators={creators}
          campaigns={campaigns}
          offers={offers}
          onNavigateToTab={changeTab}
          onSendOffer={handleOpenOfferModal}
        />;
      case "campaigns":
        return <div className="space-y-6 animate-in fade-in duration-500">
            <header className="flex justify-between items-center mb-6">
              <div>
                <h2 className="font-sans font-extrabold text-2xl md:text-3xl text-on-surface">Kampanyalarım</h2>
                <p className="text-on-surface-variant font-medium text-xs md:text-sm mt-1">Oluşturduğunuz kampanyaların durumunu takip edin.</p>
              </div>
              <button
          onClick={() => {
            setEditingCampaign(null);
            changeTab("new_campaign");
          }}
          className="bg-primary text-white font-bold text-xs px-5 py-3 rounded-full shadow-md hover:scale-105 transition-transform flex items-center gap-1.5 cursor-pointer"
        >
                <PlusCircle size={16} />
                <span>Yeni Kampanya</span>
              </button>
            </header>

            {!campaigns.length && <div className="bg-white border border-dashed border-outline-variant rounded-3xl p-10 text-center shadow-sm">
                <div className="mx-auto mb-4 w-12 h-12 rounded-full bg-primary/10 text-primary flex items-center justify-center">
                  <PlusCircle size={22} />
                </div>
                <h3 className="font-sans font-extrabold text-xl text-on-surface">Henüz kampanya yok</h3>
                <p className="text-on-surface-variant text-sm font-medium mt-2 max-w-md mx-auto">
                  Yayına aldığınız kampanyalar burada sadece veritabanından listelenecek.
                </p>
                <button
          onClick={() => {
            setEditingCampaign(null);
            changeTab("new_campaign");
          }}
          className="mt-6 bg-primary text-white font-bold text-xs px-5 py-3 rounded-full shadow-md hover:scale-105 transition-transform inline-flex items-center gap-1.5 cursor-pointer"
        >
                  <PlusCircle size={16} />
                  <span>İlk Kampanyayı Oluştur</span>
                </button>
              </div>}

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {campaigns.map((camp) => {
    const campaignExpired = Boolean(camp.isExpired);
    const badgeLabel = campaignExpired ? "Süresi geçmiş" : camp.statusLabel || camp.status;
    const badgeClass = campaignExpired
      ? "bg-surface-container-highest text-on-surface-variant"
      : camp.status === "Aktif"
        ? "bg-green-100 text-green-800"
        : "bg-yellow-100 text-yellow-800";

    return <div key={camp.id} className={`bg-white rounded-3xl border border-[#F1F1F1] shadow-sm transition-all flex flex-col justify-between overflow-hidden ${campaignExpired ? "opacity-70 grayscale-[0.25]" : "hover:scale-[1.01]"}`}>
                  <div className="relative h-40 bg-surface-container-low">
                    {camp.bannerUrl ? <img
                      src={camp.bannerUrl}
                      alt={camp.title || "Kampanya banner"}
                      className="w-full h-full object-cover"
                      referrerPolicy="no-referrer"
                    /> : <div className="w-full h-full bg-gradient-to-br from-primary/10 via-secondary-container/70 to-[#F9F871]/70 flex items-center justify-center">
                        <span className="text-primary font-extrabold text-xs uppercase tracking-widest">Go Influence</span>
                      </div>}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/55 via-black/5 to-transparent" />
                    <div className="absolute bottom-4 left-4 right-4 flex items-end justify-between gap-3">
                      <span className={`px-2.5 py-1 rounded-full text-[10px] font-bold ${badgeClass}`}>
                        {badgeLabel}
                      </span>
                      <span className="text-[10px] text-white font-extrabold drop-shadow">{camp.startDate} - {camp.endDate}</span>
                    </div>
                  </div>
                  <div className="p-6 flex flex-col flex-1 justify-between">
                  <div>
                    <h3 className="font-sans font-extrabold text-lg text-on-surface mb-2">{camp.title}</h3>
                    <p className="text-on-surface-variant text-xs line-clamp-2 leading-relaxed mb-4">{camp.description}</p>
                    
                    <div className="flex flex-wrap gap-1.5 mb-4">
                      {(camp.categories?.length ? camp.categories : [camp.category || "Genel"]).map((c, idx) => <span key={idx} className="bg-secondary-container text-on-secondary-container px-2.5 py-0.5 rounded-full text-[9px] font-extrabold uppercase tracking-wider">
                          {c}
                        </span>)}
                    </div>
                  </div>

                  <div className="pt-4 border-t border-surface-container flex justify-between items-center text-xs">
                    <div>
                      <span className="text-outline font-bold">Bütçe:</span>
                      <span className="text-primary font-black ml-1">₺{Number(camp.budgetMin || 0).toLocaleString("tr-TR")} - ₺{Number(camp.budgetMax || 0).toLocaleString("tr-TR")}</span>
                    </div>
                    <div className="flex items-center gap-3">
                      <button
            onClick={() => handleEditCampaign(camp)}
            className="text-on-surface-variant font-bold hover:text-primary hover:underline cursor-pointer"
          >
                        Düzenle
                      </button>
                      <button
            onClick={() => {
              setSelectedMatchCampaignId(camp.id);
              changeTab("matches");
            }}
            className="text-primary font-bold hover:underline cursor-pointer"
          >
                        Creator Bul
                      </button>
                    </div>
                  </div>
                  </div>
                </div>;
  })}
            </div>
          </div>;
      case "new_campaign":
        return <CampaignCreatorView
          key={editingCampaign?.id || "new-campaign"}
          mode={editingCampaign ? "edit" : "create"}
          initialCampaign={editingCampaign}
          onCreateCampaign={editingCampaign ? handleUpdateCampaign : handleCreateCampaign}
          onCancel={editingCampaign ? handleCancelCampaignEdit : undefined}
          brandName={brandProfile.name}
        />;
      case "matches":
        return <MatchResultsView
          creators={campaignMatchCreators}
          campaigns={campaigns}
          selectedCampaignId={selectedMatchCampaignId}
          onCampaignChange={setSelectedMatchCampaignId}
          onSendOffer={handleOpenOfferModal}
          onOpenProfile={(creator) => {
            handleOpenChat(creator.id);
          }}
        />;
      case "offers":
        return <OffersView
          offers={offers}
          onOpenNewOfferModal={() => changeTab("matches")}
          onOpenChat={handleOpenChat}
        />;
      case "messages":
        return <MessagesView
          threads={chatThreads}
          activeThreadId={activeChatThreadId}
          onSelectThread={(id) => dispatch(setActiveBrandChatThread(id))}
          onSendMessage={handleSendMessage}
        />;
      case "settings":
        return <div className="bg-white rounded-3xl p-6 md:p-8 shadow-sm border border-[#F1F1F1] max-w-xl animate-in fade-in duration-500 space-y-6">
            <h2 className="font-sans font-extrabold text-xl text-on-surface">Şirket Profili Ayarları</h2>
            
            <div className="grid grid-cols-1 gap-4">
              <div>
                <label className="block text-xs font-bold text-on-surface-variant uppercase tracking-wider mb-1.5">Şirket Adı</label>
                <input
          type="text"
          value={brandProfile.name}
          onChange={(e) => handleProfileUpdate({ name: e.target.value })}
          className="w-full bg-[#F8F9FA] border border-[#d2c1d7] focus:border-primary rounded-xl p-3.5 text-xs font-bold outline-none"
        />
              </div>

              <div>
                <label className="block text-xs font-bold text-on-surface-variant uppercase tracking-wider mb-1.5">Web Sitesi</label>
                <input
          type="text"
          value={brandProfile.website}
          onChange={(e) => handleProfileUpdate({ website: e.target.value })}
          className="w-full bg-[#F8F9FA] border border-[#d2c1d7] focus:border-primary rounded-xl p-3.5 text-xs font-bold outline-none"
        />
              </div>

              <div>
                <label className="block text-xs font-bold text-on-surface-variant uppercase tracking-wider mb-1.5">Kısa Açıklama</label>
                <textarea
          rows={3}
          value={brandProfile.description}
          onChange={(e) => handleProfileUpdate({ description: e.target.value })}
          className="w-full bg-[#F8F9FA] border border-[#d2c1d7] focus:border-primary rounded-xl p-3.5 text-xs font-semibold outline-none resize-none"
        />
              </div>

              <div>
                <label className="block text-xs font-bold text-on-surface-variant uppercase tracking-wider mb-1.5">Lokasyon</label>
                <input
          type="text"
          value={brandProfile.location}
          onChange={(e) => handleProfileUpdate({ location: e.target.value })}
          className="w-full bg-[#F8F9FA] border border-[#d2c1d7] focus:border-primary rounded-xl p-3.5 text-xs font-bold outline-none"
        />
              </div>
            </div>

            <button
          onClick={() => alert("Profil ayarlar\u0131n\u0131z ba\u015Far\u0131yla kaydedildi!")}
          className="bg-primary text-white font-bold text-xs px-6 py-3 rounded-2xl shadow-md hover:scale-105 active:scale-95 transition-transform cursor-pointer"
        >
              Değişiklikleri Kaydet
            </button>
          </div>;
      default:
        return null;
    }
  };
  return <div className="min-h-screen bg-background text-on-surface overflow-x-hidden flex flex-col">
      
      {
    /* Viewport Decorative Ambient Glow Blurs */
  }
      <div className="fixed inset-0 pointer-events-none overflow-hidden -z-10">
        <div className="blur-orb bg-primary-container w-[400px] h-[400px] top-[-100px] left-[-100px] opacity-30" />
        <div className="blur-orb bg-primary w-[300px] h-[300px] bottom-[-50px] right-[-50px] opacity-20" />
        
        {
    /* Floating elements present on welcome signup */
  }
        {appMode === "SIGNUP" && <>
            <div className="absolute w-32 h-32 bg-secondary-fixed rounded-lg top-[20%] right-[10%] opacity-35 rotate-12 animate-bounce duration-[10000ms]" />
            <div className="absolute w-24 h-24 bg-tertiary-fixed rounded-full bottom-[15%] left-[8%] opacity-25 -rotate-12 animate-pulse" />
          </>}
      </div>

      {
    /* Screen Mode Router */
  }
      <AnimatePresence mode="wait">
        
        {appMode === "SIGNUP" && <motion.main
    key="signup"
    className="flex-1 flex items-center justify-center p-6 min-h-screen"
  >
            <BrandSignUpView onSignUpComplete={handleSignUpComplete} />
          </motion.main>}

        {appMode === "ONBOARDING_STEP1" && <motion.main
    key="onboarding1"
    className="flex-1 flex items-center justify-center p-6 md:p-12 min-h-screen"
  >
            <StepCompanyInfo
    profile={brandProfile}
    onChange={handleProfileUpdate}
    onNext={() => dispatch(setBrandAppMode("ONBOARDING_STEP2"))}
  />
          </motion.main>}

        {appMode === "ONBOARDING_STEP2" && <motion.main
    key="onboarding2"
    className="flex-1 flex items-center justify-center p-6 md:p-12 min-h-screen"
  >
            <StepCategories
    selectedCategories={brandCategories}
    onCategoriesChange={(categories) => dispatch(setBrandCategories(categories))}
    budget={brandBudget}
    onBudgetChange={(budget) => dispatch(setBrandBudget(budget))}
    onNext={() => dispatch(setBrandAppMode("ONBOARDING_STEP3"))}
    onBack={() => dispatch(setBrandAppMode("ONBOARDING_STEP1"))}
  />
          </motion.main>}

        {appMode === "ONBOARDING_STEP3" && <motion.main
    key="onboarding3"
    className="flex-1 flex items-center justify-center p-6 md:p-12 min-h-screen"
  >
            <StepBrandIdentity
    profile={brandProfile}
    onChange={handleProfileUpdate}
    onSubmit={handleBrandOnboardingSubmit}
    onBack={() => dispatch(setBrandAppMode("ONBOARDING_STEP2"))}
  />
            {onboardingSaving && <p className="mt-4 text-center text-xs font-bold text-primary">Profil kaydediliyor...</p>}
          </motion.main>}

        {appMode === "MAIN" && <motion.div
    key="main"
    className="min-h-screen flex flex-col"
  >
            {
    /* Platform Sidebar */
  }
            <Sidebar
    currentTab={currentTab}
    onTabChange={changeTab}
    isOpen={mobileSidebarOpen}
    onToggle={() => dispatch(toggleBrandMobileSidebar())}
  />

            {
    /* Platform Main Shell */
  }
            <div className="lg:pl-72 flex-1 flex flex-col">
              
              {
    /* Platform Header */
  }
              <Header
    brandProfile={brandProfile}
    searchQuery={searchQuery}
    searchResults={searchResults}
    onSearchChange={(value) => dispatch(setBrandSearchQuery(value))}
    onSearchResultClick={handleSearchResultClick}
    onNavigateToSettings={() => changeTab("settings")}
  />

              {
    /* Dynamic Content Panel */
  }
              <main className="flex-1 pt-28 pb-12 px-6 md:px-12 max-w-container-max w-full mx-auto">
                {renderTabContent()}
              </main>

            </div>
          </motion.div>}

      </AnimatePresence>

      {
    /* Global Interactive Send Offer Modal Popups */
  }
      {offerModalCreator && <SendOfferModal
    creator={offerModalCreator}
    campaigns={campaigns}
    onClose={() => dispatch(setBrandOfferModalCreator(null))}
    onSubmit={handleOfferSubmit}
  />}

    </div>;
}
export {
  App as default
};

function buildBrandSearchResults(query, data) {
  const normalizedQuery = normalizeSearch(query);
  if (!normalizedQuery) return [];

  const results = [];
  const pushResult = (item) => {
    if (results.length < 10) results.push(item);
  };

  data.creators.forEach((creator) => {
    if (!matchesSearch(normalizedQuery, creator.name, creator.username, creator.categoryTags?.join(" "), creator.description)) return;
    pushResult({
      id: creator.id,
      type: "creator",
      tab: "matches",
      group: "Eşleşmeler",
      title: creator.name,
      description: `@${creator.username}`,
    });
  });

  data.campaigns.forEach((campaign) => {
    if (!matchesSearch(normalizedQuery, campaign.title, campaign.description, campaign.categories?.join(" "), campaign.status)) return;
    pushResult({
      id: campaign.id,
      type: "campaign",
      tab: "campaigns",
      group: "Kampanyalar",
      title: campaign.title,
      description: campaign.status,
    });
  });

  data.offers.forEach((offer) => {
    if (!matchesSearch(normalizedQuery, offer.creatorName, offer.creatorUsername, offer.campaignTitle, offer.status)) return;
    pushResult({
      id: offer.id,
      type: "offer",
      tab: "offers",
      group: "Teklifler",
      title: offer.creatorName,
      description: offer.campaignTitle,
    });
  });

  data.chatThreads.forEach((thread) => {
    if (!matchesSearch(normalizedQuery, thread.creatorName, thread.creatorUsername, thread.lastMessageText)) return;
    pushResult({
      id: thread.creatorId,
      type: "message",
      tab: "messages",
      chatThreadId: thread.creatorId,
      group: "Mesajlar",
      title: thread.creatorName,
      description: thread.lastMessageText,
    });
  });

  return results;
}

function mapThreadToBrandThread(thread) {
  return {
    creatorId: thread.id,
    influencerUid: thread.influencerUid,
    creatorName: thread.influencerName,
    creatorUsername: thread.influencerUid ? `@${thread.influencerUid}` : "",
    avatarUrl: thread.influencerAvatar,
    lastMessageText: thread.lastMessageText,
    lastMessageTime: formatThreadTime(thread.lastMessageTime),
    unreadCount: 0,
    messages: (thread.messages || []).map((message) => ({
      id: message.id,
      sender: message.sender === "brand" ? "brand" : "creator",
      text: message.text,
      timestamp: formatThreadTime(message.timestamp),
    })),
  };
}

function mapOfferToBrandOffer(offer) {
  return {
    id: offer.id,
    creatorId: offer.influencerUid || offer.creatorId,
    creatorName: offer.creatorName || offer.name || "Influencer",
    creatorUsername: offer.creatorUsername || offer.handle || "",
    avatarUrl: offer.avatarUrl || offer.avatar || "https://placehold.co/120x120?text=GI",
    campaignTitle: offer.campaignTitle || "Kampanya",
    amount: Number(offer.amount || 0),
    status: mapBrandOfferStatus(offer.status),
    updatedAt: formatThreadTime(offer.updatedAt || offer.createdAt) || "",
  };
}

function mapBrandOfferStatus(status) {
  if (status === "Accepted" || status === "approved" || status === "Kabul Edildi") return "Kabul Edildi";
  if (status === "Rejected" || status === "rejected" || status === "Reddedildi") return "Reddedildi";
  return "Beklemede";
}

function mapInfluencerToCreator(influencer) {
  const displayName = influencer.displayName || influencer.name || influencer.email || "Influencer";
  const username = influencer.username
    || influencer.handle
    || influencer.socialAccounts?.instagram?.username
    || influencer.email?.split("@")[0]
    || influencer.id;
  const followerCount = Number(influencer.followersCount || influencer.socialAccounts?.instagram?.followers || 0);
  const engagementRate = Number(influencer.engagementRate || influencer.socialAccounts?.instagram?.engagementRate || 0);

  return {
    id: influencer.uid || influencer.id,
    name: displayName,
    username,
    avatarUrl: influencer.profileImageUrl || influencer.profileImage || "https://placehold.co/120x120?text=GI",
    categoryTags: influencer.categories || influencer.interests || [],
    followers: followerCount ? Intl.NumberFormat("tr-TR", { notation: "compact" }).format(followerCount) : "-",
    followersCount: followerCount,
    engagementRate,
    matchScore: Number(influencer.matchScore || 85),
    description: influencer.bio || "Onaylı influencer profili.",
    isVerified: influencer.status === "approved",
    profileVisibility: influencer.profileVisibility,
  };
}

function mapCampaignMatchToCreator(match) {
  const influencer = match.influencer || {};
  const displayName = influencer.displayName || influencer.name || "Influencer";
  const username = influencer.username || match.influencerUid || match.id;
  const followerCount = Number(influencer.followersCount || 0);
  const engagementRate = Number(influencer.engagementRate || 0);
  const reasons = match.reasons || influencer.matchReasons || [];

  return {
    id: match.influencerUid || influencer.id || match.id,
    campaignId: match.campaignId,
    matchId: match.id,
    name: displayName,
    username,
    avatarUrl: influencer.profileImageUrl || influencer.profileImage || "https://placehold.co/120x120?text=GI",
    categoryTags: influencer.categories || influencer.services || [],
    followers: followerCount ? Intl.NumberFormat("tr-TR", { notation: "compact" }).format(followerCount) : "-",
    followersCount: followerCount,
    engagementRate,
    matchScore: Number(match.score || influencer.matchScore || 0),
    description: reasons.length ? reasons.join(" ") : influencer.bio || "Kategori eslesme sonucu.",
    isVerified: true,
    location: influencer.location || "",
  };
}

function formatThreadTime(value) {
  const date = value?.toDate?.() || (value ? new Date(value) : null);
  if (!date || Number.isNaN(date.getTime())) return "";
  return date.toLocaleTimeString("tr-TR", { hour: "2-digit", minute: "2-digit" });
}

function matchesSearch(normalizedQuery, ...values) {
  return values.some((value) => normalizeSearch(value).includes(normalizedQuery));
}

function normalizeSearch(value) {
  return String(value || "").toLocaleLowerCase("tr-TR").trim();
}

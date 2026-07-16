import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import Sidebar from "./components/Sidebar";
import Header from "./components/Header";
import Toast from "./components/Toast";
import NewCampaignModal from "./components/NewCampaignModal";
import DashboardTab from "./components/DashboardTab";
import ApprovalsTab from "./components/ApprovalsTab";
import UsersTab from "./components/UsersTab";
import CampaignsTab from "./components/CampaignsTab";
import PaymentsTab from "./components/PaymentsTab";
import SettingsTab from "./components/SettingsTab";
import {
  addCampaign,
  addInfluencerUser,
  addLog,
  hideAdminToast,
  setActiveTab,
  setApprovedInfluencers,
  setCampaignModalOpen,
  setCampaignOffers,
  setCampaigns,
  setPendingApprovals,
  setSearchQuery,
  setSelectedCampaignId,
  showAdminToast,
  updateBrandUsers,
  updateInfluencerUsers,
  updatePendingTransactionCommission,
  updateTransactions,
  updateTransactionStatus,
  updateCampaignOfferStatus as updateCampaignOfferStatusInStore,
} from "../../features/admin/adminSlice";
import {
  approveInfluencer,
  createTransaction,
  createCampaign,
  rejectInfluencer,
  saveInfluencerCommission,
  savePlatformSettings,
  subscribeToApprovedInfluencers,
  subscribeToCampaignOffers,
  subscribeToCampaigns,
  subscribeToTransactions,
  subscribeToUsers,
  subscribeToPendingInfluencers,
  subscribeToPlatformSettings,
  updateCampaignOfferStatus,
  updateTransactionStatusInDb,
  updateUserAccountStatus,
} from "../../features/admin/adminService";
import {
  influencerCommissionUpdated,
  platformSettingsFailed,
  platformSettingsReceived,
  platformSettingsUpdated,
} from "../../features/settings/platformSettingsSlice";

const adminTabRoutes = {
  dashboard: "/admin",
  approvals: "/admin/approvals",
  users: "/admin/users",
  campaigns: "/admin/campaigns",
  payments: "/admin/payments",
  settings: "/admin/settings",
};

function AdminPage({ initialTab = "dashboard" }) {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const {
    activeTab,
    searchQuery,
    toast,
    isCampaignModalOpen,
    campaigns,
    selectedCampaignId,
    campaignOffers,
    pendingApprovals,
    brandUsers,
    influencerUsers,
    logs,
    transactions,
    approvedInfluencers,
  } = useSelector((state) => state.admin);
  const platformSettings = useSelector((state) => state.platformSettings.data);

  useEffect(() => {
    dispatch(setActiveTab(initialTab));
  }, [dispatch, initialTab]);

  const triggerToast = (msg) => {
    dispatch(showAdminToast(msg));
    setTimeout(() => dispatch(hideAdminToast()), 3500);
  };

  useEffect(() => {
    const unsubscribe = subscribeToPendingInfluencers(
      (items) => dispatch(setPendingApprovals(items.map(mapInfluencerToApproval))),
      (error) => triggerToast(error.message || "Bekleyen influencer başvuruları alınamadı."),
    );

    return unsubscribe;
  }, [dispatch]);

  useEffect(() => {
    const unsubscribe = subscribeToCampaigns(
      (items) => dispatch(setCampaigns(items)),
      (error) => triggerToast(error.message || "Kampanyalar alınamadı."),
    );

    return unsubscribe;
  }, [dispatch]);

  useEffect(() => {
    const unsubscribe = subscribeToCampaignOffers(
      selectedCampaignId,
      (items) => dispatch(setCampaignOffers(items)),
      (error) => triggerToast(error.message || "Kampanya teklifleri alınamadı."),
    );

    return unsubscribe;
  }, [dispatch, selectedCampaignId]);

  useEffect(() => {
    const unsubscribe = subscribeToUsers(
      ({ brands, influencers }) => {
        dispatch(updateBrandUsers(brands));
        dispatch(updateInfluencerUsers(influencers));
      },
      (error) => triggerToast(error.message || "Kullanıcılar alınamadı."),
    );

    return unsubscribe;
  }, [dispatch]);

  useEffect(() => {
    const unsubscribe = subscribeToTransactions(
      (items) => dispatch(updateTransactions(items)),
      (error) => triggerToast(error.message || "Ödeme işlemleri alınamadı."),
    );

    return unsubscribe;
  }, [dispatch]);

  useEffect(() => {
    const unsubscribeSettings = subscribeToPlatformSettings(
      (settings) => dispatch(platformSettingsReceived(settings)),
      (error) => {
        dispatch(platformSettingsFailed(error.message));
        triggerToast(error.message || "Platform ayarları alınamadı.");
      },
    );

    const unsubscribeInfluencers = subscribeToApprovedInfluencers(
      (items) => dispatch(setApprovedInfluencers(items)),
      (error) => triggerToast(error.message || "Onaylı influencer listesi alınamadı."),
    );

    return () => {
      unsubscribeSettings();
      unsubscribeInfluencers();
    };
  }, [dispatch]);

  useEffect(() => {
    dispatch(updateTransactions(transactions.map((tx) => {
      if (tx.status !== "Pending") return tx;
      return {
        ...tx,
        feePercent: getCommissionRateForTransaction(tx, platformSettings),
      };
    })));
  }, [dispatch, platformSettings]);

  const handleApproveApplicant = async (id) => {
    const applicant = pendingApprovals.find((a) => a.id === id);
    if (!applicant) return;

    await approveInfluencer(id);
    dispatch(addInfluencerUser({
      id: applicant.id,
      name: applicant.name,
      email: applicant.email,
      signupDate: applicant.signupDate,
      status: "Aktif",
      category: applicant.categories.join(", "),
      logoLetters: applicant.name.split(" ").map((n) => n[0]).join("").substring(0, 2).toUpperCase(),
    }));
    dispatch(addLog({
      id: `log_${Date.now()}`,
      name: applicant.name,
      action: "başvurusu sistem yöneticisi tarafından onaylandı.",
      timeAgo: "Az önce",
      type: "user_add",
    }));
  };

  const handleRejectApplicant = async (id) => {
    const applicant = pendingApprovals.find((a) => a.id === id);
    if (!applicant) return;

    await rejectInfluencer(id);
    dispatch(addLog({
      id: `log_${Date.now()}`,
      name: applicant.name,
      action: "başvurusu reddedildi.",
      timeAgo: "Az önce",
      type: "alert",
    }));
  };

  const handleToggleUserStatus = (id, isBrand) => {
    const users = isBrand ? brandUsers : influencerUsers;
    const updatedUsers = users.map((user) => {
      if (user.id !== id) return user;
      return {
        ...user,
        status: user.status === "Aktif" ? "Askıya Alınmış" : "Aktif",
      };
    });
    const updatedUser = updatedUsers.find((user) => user.id === id);

    if (isBrand) dispatch(updateBrandUsers(updatedUsers));
    else dispatch(updateInfluencerUsers(updatedUsers));

    if (updatedUser) {
      dispatch(addLog({
        id: `log_${Date.now()}`,
        name: updatedUser.name,
        action: `hesap durumu güncellendi: ${updatedUser.status}`,
        timeAgo: "Az önce",
        type: "settings",
      }));
    }
  };

  const handleCreateCampaign = async (newCamp) => {
    const constructedCampaign = {
      ...newCamp,
      creatorAvatars: [
        "https://lh3.googleusercontent.com/aida-public/AB6AXuCXNc7nNzKGMitTfAgkK3Pcsg0WxvCRANLHXo3bfVQj7giBF-lFKpWs2ag99NKepYximxOqS1D65P2Hd1ccXcaI1zB1V2T2YgtmYjCrp_qvlfsI6APG4b2d1OzOnj46hjC3aLmBozlDWCha_FhB9Bxpw0yHwGh209-B1VZxpHFL8GNzMHSWgmF9-_d1xLbS819zAtjUwgNmJmHeB-6LhMEbDqqv-JQ70mnBddUjUwqpyRJQIfu5kzsI",
      ],
      creatorCount: 0,
    };

    const savedCampaign = await createCampaign(constructedCampaign);

    dispatch(addCampaign(savedCampaign));
    dispatch(addLog({
      id: `log_${Date.now()}`,
      name: newCamp.brand,
      action: `tarafından "${newCamp.name}" kampanyası başlatıldı.`,
      timeAgo: "Az önce",
      type: "campaign",
    }));
    triggerToast(`"${newCamp.name}" kampanyası başarıyla oluşturuldu.`);
  };

  const handleSelectCampaign = (campaignId) => {
    dispatch(setSelectedCampaignId(campaignId));
  };

  const handleCampaignOfferAction = async (offerId, nextStatus) => {
    dispatch(updateCampaignOfferStatusInStore({ id: offerId, status: nextStatus }));
    await updateCampaignOfferStatus(offerId, nextStatus);
    triggerToast(`Teklif ${nextStatus === "Accepted" ? "onaylandı" : "reddedildi"}.`);
  };

  const handleTriggerPayout = (id, newStatus) => {
    const matchedTx = transactions.find((tx) => tx.id === id);
    dispatch(updateTransactionStatus({ id, status: newStatus }));

    if (matchedTx) {
      dispatch(addLog({
        id: `log_${Date.now()}`,
        name: matchedTx.brandName,
        action: `üzerinden ${matchedTx.influencerHandle} için ödeme yapıldı.`,
        timeAgo: "Az önce",
        type: "payment",
      }));
    }
  };

  const handleToggleUserStatusDb = async (id, isBrand) => {
    const users = isBrand ? brandUsers : influencerUsers;
    const currentUser = users.find((user) => user.id === id);
    if (!currentUser) return;

    const nextUiStatus = currentUser.status === "Aktif" ? "Askıya Alınmış" : "Aktif";
    const nextDbStatus = nextUiStatus === "Aktif" ? "active" : "suspended";
    const updatedUsers = users.map((user) => (
      user.id === id ? { ...user, status: nextUiStatus } : user
    ));

    if (isBrand) dispatch(updateBrandUsers(updatedUsers));
    else dispatch(updateInfluencerUsers(updatedUsers));

    await updateUserAccountStatus(id, nextDbStatus);
    dispatch(addLog({
      id: `log_${Date.now()}`,
      name: currentUser.name,
      action: `hesap durumu güncellendi: ${nextUiStatus}`,
      timeAgo: "Az önce",
      type: "settings",
    }));
  };

  const handleCampaignOfferActionDb = async (offerId, nextStatus) => {
    const offer = campaignOffers.find((item) => item.id === offerId);
    const campaign = campaigns.find((item) => item.id === selectedCampaignId);

    dispatch(updateCampaignOfferStatusInStore({ id: offerId, status: nextStatus }));
    await updateCampaignOfferStatus(offerId, nextStatus);

    if (nextStatus === "Accepted" && offer && campaign) {
      await createTransaction({
        campaignId: campaign.id,
        campaignName: campaign.name,
        brandName: campaign.brand,
        influencerUid: offer.influencerUid || offer.creatorId,
        influencerHandle: offer.handle || offer.creatorUsername || offer.name,
        influencerAvatar: offer.avatar,
        grossAmount: offer.amount,
        feePercent: platformSettings.globalCommissionRate,
        status: "Pending",
      });
    }

    triggerToast(`Teklif ${nextStatus === "Accepted" ? "onaylandı" : "reddedildi"}.`);
  };

  const handleTriggerPayoutDb = async (id, newStatus) => {
    const matchedTx = transactions.find((tx) => tx.id === id);
    dispatch(updateTransactionStatus({ id, status: newStatus }));
    await updateTransactionStatusInDb(id, newStatus);

    if (matchedTx) {
      dispatch(addLog({
        id: `log_${Date.now()}`,
        name: matchedTx.brandName,
        action: `üzerinden ${matchedTx.influencerHandle} için ödeme yapıldı.`,
        timeAgo: "Az önce",
        type: "payment",
      }));
    }
  };

  const handleUpdateCommissionRate = async (rate) => {
    const nextSettings = {
      ...platformSettings,
      globalCommissionRate: Number(rate),
    };
    dispatch(platformSettingsUpdated(nextSettings));
    await savePlatformSettings(nextSettings);
    dispatch(updatePendingTransactionCommission({ rate: Number(rate) }));
  };

  const handleSavePlatformSettings = async (settings) => {
    const nextSettings = {
      ...platformSettings,
      ...settings,
    };
    dispatch(platformSettingsUpdated(nextSettings));
    await savePlatformSettings(nextSettings);
    return nextSettings;
  };

  const handleSaveInfluencerCommission = async (influencerUid, data) => {
    const nextCommission = {
      ...data,
      updatedAt: new Date().toISOString(),
    };
    dispatch(influencerCommissionUpdated({ influencerUid, data: nextCommission }));
    await saveInfluencerCommission(influencerUid, data);
    return nextCommission;
  };

  const selectTab = (tab) => {
    dispatch(setActiveTab(tab));
    navigate(adminTabRoutes[tab] || "/admin");
  };
  const headerDetails = getHeaderProps(activeTab);
  const searchResults = buildAdminSearchResults(searchQuery, {
    pendingApprovals,
    brandUsers,
    influencerUsers,
    campaigns,
    transactions,
    approvedInfluencers,
  });
  const dashboardStats = buildDashboardStats({
    brandUsers,
    influencerUsers,
    campaigns,
    pendingApprovals,
    transactions,
  });
  const handleSearchResultClick = (result) => {
    selectTab(result.tab);
    dispatch(setSearchQuery(result.title));
  };

  return <div className="min-h-screen bg-background text-on-background antialiased font-sans">
      <Sidebar
        activeTab={activeTab}
        platformSettings={platformSettings}
        setActiveTab={selectTab}
        onNewCampaignClick={() => dispatch(setCampaignModalOpen(true))}
      />

      <div className="pl-64 flex flex-col min-h-screen">
        <Header
          title={headerDetails.title}
          searchPlaceholder={headerDetails.placeholder}
          searchVal={searchQuery}
          onSearchChange={(value) => dispatch(setSearchQuery(value))}
          searchResults={searchResults}
          onSearchResultClick={handleSearchResultClick}
          onOpenNotifications={() => triggerToast("Bildirim merkezi güncel. Bekleyen sistem uyarısı bulunmuyor.")}
          onOpenInbox={() => triggerToast("Yeni gelen mesaj bulunmamaktadır.")}
          onOpenSettings={() => selectTab("settings")}
        />

        <main className="flex-1 mt-16 px-10 py-10 overflow-y-auto">
          {activeTab === "dashboard" && <DashboardTab
            logs={logs}
            stats={dashboardStats}
            onShowToast={triggerToast}
            onNavigateToTab={selectTab}
          />}

          {activeTab === "approvals" && <ApprovalsTab
            pendingApprovals={pendingApprovals}
            onApprove={handleApproveApplicant}
            onReject={handleRejectApplicant}
            onShowToast={triggerToast}
            searchQuery={searchQuery}
          />}

          {activeTab === "users" && <UsersTab
            brandUsers={brandUsers}
            influencerUsers={influencerUsers}
            onToggleUserStatus={handleToggleUserStatusDb}
            onShowToast={triggerToast}
            onNavigateToTab={selectTab}
            searchQuery={searchQuery}
          />}

          {activeTab === "campaigns" && <CampaignsTab
            campaigns={campaigns}
            selectedCampaignId={selectedCampaignId}
            offers={campaignOffers}
            onSelectCampaign={handleSelectCampaign}
            onOfferAction={handleCampaignOfferActionDb}
            onShowToast={triggerToast}
            searchQuery={searchQuery}
          />}

          {activeTab === "payments" && <PaymentsTab
            transactions={transactions}
            globalCommissionRate={platformSettings.globalCommissionRate}
            onShowToast={triggerToast}
            onUpdateCommissionRate={handleUpdateCommissionRate}
            onTriggerPayout={handleTriggerPayoutDb}
            searchQuery={searchQuery}
          />}

          {activeTab === "settings" && <SettingsTab
            platformSettings={platformSettings}
            approvedInfluencers={approvedInfluencers}
            onSavePlatformSettings={handleSavePlatformSettings}
            onSaveInfluencerCommission={handleSaveInfluencerCommission}
            onShowToast={triggerToast}
          />}
        </main>
      </div>

      <Toast message={toast.message} isVisible={toast.isVisible} onClose={() => dispatch(hideAdminToast())} />

      <NewCampaignModal
        isOpen={isCampaignModalOpen}
        onClose={() => dispatch(setCampaignModalOpen(false))}
        onSubmit={handleCreateCampaign}
      />
    </div>;
}

export { AdminPage as default };

function getHeaderProps(activeTab) {
  switch (activeTab) {
    case "approvals":
      return { title: "Onay Bekleyen Başvurular", placeholder: "Başvurularda ara..." };
    case "users":
      return { title: "Kullanıcı Veritabanı", placeholder: "Marka veya Influencer ara..." };
    case "campaigns":
      return { title: "Kampanyalar Paneli", placeholder: "Kampanya veya Marka ara..." };
    case "payments":
      return { title: "Komisyon & Finans", placeholder: "Ödeme ve kampanya ara..." };
    case "settings":
      return { title: "Platform Ayarları", placeholder: "Ayarlarda ara..." };
    case "dashboard":
    default:
      return { title: "Sistem Genel Bakış", placeholder: "Konsol üzerinde ara..." };
  }
}

function buildAdminSearchResults(query, data) {
  const normalizedQuery = normalizeSearch(query);
  if (!normalizedQuery) return [];

  const results = [];
  const pushResult = (item) => {
    if (results.length < 10) results.push(item);
  };

  data.pendingApprovals.forEach((user) => {
    if (!matchesSearch(normalizedQuery, user.name, user.handle, user.email, user.categories?.join(" "))) return;
    pushResult({
      id: user.id,
      type: "approval",
      tab: "approvals",
      group: "Onaylar",
      title: user.name,
      description: `${user.handle} - Onay bekliyor`,
    });
  });

  [...data.brandUsers, ...data.influencerUsers].forEach((user) => {
    if (!matchesSearch(normalizedQuery, user.name, user.email, user.category, user.status)) return;
    pushResult({
      id: user.id,
      type: "user",
      tab: "users",
      group: "Kullanıcılar",
      title: user.name,
      description: user.email,
    });
  });

  data.campaigns.forEach((campaign) => {
    if (!matchesSearch(normalizedQuery, campaign.name, campaign.brand, campaign.status)) return;
    pushResult({
      id: campaign.id,
      type: "campaign",
      tab: "campaigns",
      group: "Kampanyalar",
      title: campaign.name,
      description: campaign.brand,
    });
  });

  data.transactions.forEach((transaction) => {
    if (!matchesSearch(normalizedQuery, transaction.campaignName, transaction.brandName, transaction.influencerHandle, transaction.status)) return;
    pushResult({
      id: transaction.id,
      type: "payment",
      tab: "payments",
      group: "Ödemeler",
      title: transaction.campaignName,
      description: `${transaction.brandName} - ${transaction.influencerHandle}`,
    });
  });

  data.approvedInfluencers.forEach((influencer) => {
    if (!matchesSearch(normalizedQuery, influencer.displayName, influencer.email, influencer.uid)) return;
    pushResult({
      id: influencer.uid || influencer.id,
      type: "commission",
      tab: "settings",
      group: "Ayarlar",
      title: influencer.displayName || influencer.email,
      description: "Influencer komisyon ayarı",
    });
  });

  return results;
}

function buildDashboardStats({ brandUsers, influencerUsers, campaigns, pendingApprovals, transactions }) {
  const grossVolume = transactions.reduce((total, transaction) => (
    total + Number(transaction.grossAmount || 0)
  ), 0);
  const commissionVolume = transactions.reduce((total, transaction) => (
    total + Number(transaction.grossAmount || 0) * Number(transaction.feePercent || 0) / 100
  ), 0);
  const activeCampaigns = campaigns.filter((campaign) => (
    String(campaign.status || "").toLocaleLowerCase("tr-TR") === "aktif"
    || String(campaign.status || "").toLocaleLowerCase("tr-TR") === "active"
  )).length;

  return {
    totalBrands: brandUsers.length,
    totalInfluencers: influencerUsers.length,
    activeCampaigns,
    pendingApprovals: pendingApprovals.length,
    grossVolume,
    commissionVolume,
  };
}

function matchesSearch(normalizedQuery, ...values) {
  return values.some((value) => normalizeSearch(value).includes(normalizedQuery));
}

function normalizeSearch(value) {
  return String(value || "").toLocaleLowerCase("tr-TR").trim();
}

function mapInfluencerToApproval(influencer) {
  const socials = influencer.socialAccounts || {};
  const socialValues = Object.values(socials);
  const primarySocial = socialValues.find((item) => item?.handle || item?.followers) || {};
  const followers = socialValues.reduce((total, item) => total + Number(item?.followers || 0), 0);
  const portfolioImages = normalizePortfolio(influencer.portfolio);

  return {
    id: influencer.uid || influencer.id,
    name: influencer.displayName || "İsimsiz profil",
    handle: formatHandle(primarySocial.handle || influencer.displayName || "influencer"),
    avatarUrl: influencer.profileImageUrl || portfolioImages[0],
    categories: influencer.categories?.length ? influencer.categories : ["Genel"],
    followers: followers ? compactNumber(followers) : "0",
    engagementRate: primarySocial.engagementRate ? `%${primarySocial.engagementRate} ER` : "%0 ER",
    signupDate: formatDate(influencer.createdAt || influencer.updatedAt),
    bio: influencer.bio || "Bio girilmemiş.",
    portfolioImages,
    priceRangeMin: Number(influencer.priceRange?.min || 0),
    priceRangeMax: Number(influencer.priceRange?.max || 0),
    email: influencer.email || "-",
  };
}

function normalizePortfolio(portfolio = []) {
  const fallback = "https://placehold.co/800x1000?text=Portfolio";
  const images = portfolio.length ? portfolio : [fallback];

  return [images[0] || fallback, images[1] || images[0] || fallback, images[2] || images[0] || fallback];
}

function formatHandle(value) {
  const normalized = String(value).trim().replace(/^@/, "");
  return `@${normalized || "influencer"}`;
}

function compactNumber(value) {
  return Intl.NumberFormat("tr-TR", {
    notation: "compact",
    maximumFractionDigits: 1,
  }).format(value);
}

function getCommissionRateForTransaction(transaction, platformSettings) {
  const commissions = Object.entries(platformSettings.influencerCommissions || {});
  const handle = String(transaction.influencerHandle || "").toLowerCase().replace(/^@/, "");
  const influencerUid = transaction.influencerUid || transaction.influencerId;
  const matchedCommission = commissions.find(([uid, data]) => {
    if (influencerUid && uid === influencerUid) return true;
    const displayHandle = String(data.displayName || "").toLowerCase().replace(/\s+/g, "").replace(/^@/, "");
    const emailHandle = String(data.email || "").split("@")[0].toLowerCase();
    return handle && (handle === displayHandle || handle === emailHandle);
  });

  return Number(matchedCommission?.[1]?.rate ?? platformSettings.globalCommissionRate ?? 10);
}

function formatDate(value) {
  if (!value) return "Bugün";
  const date = typeof value.toDate === "function" ? value.toDate() : new Date(value);
  if (Number.isNaN(date.getTime())) return "Bugün";
  return date.toLocaleDateString("tr-TR");
}

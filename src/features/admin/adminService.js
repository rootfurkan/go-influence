import {
  arrayUnion,
  collection,
  doc,
  addDoc,
  getDoc,
  getDocs,
  onSnapshot,
  orderBy,
  query,
  serverTimestamp,
  setDoc,
  updateDoc,
  where,
  writeBatch,
} from 'firebase/firestore';
import { getDownloadURL, ref, uploadBytes } from 'firebase/storage';
import { db, storage } from '../../firebaseConfig';
import { getCampaignLifecycle } from '../../utils/campaignStatus';
import { serializeFirestoreData } from '../../utils/firestoreSerializers';
import { buildInterestMatchDocument } from '../../utils/interestMatchingEngine';

export const DEFAULT_PLATFORM_SETTINGS = {
  brandName: 'Go Influence',
  logoUrl: '',
  globalCommissionRate: 10,
  influencerCommissions: {},
};

const platformSettingsRef = doc(db, 'settings', 'platform');
const PLATFORM_SETTINGS_STORAGE_KEY = 'goInfluencePlatformSettings';

export function readCachedPlatformSettings() {
  try {
    const rawValue = window.localStorage.getItem(PLATFORM_SETTINGS_STORAGE_KEY);
    return rawValue ? JSON.parse(rawValue) : {};
  } catch {
    return {};
  }
}

function cachePlatformSettings(settings) {
  try {
    window.localStorage.setItem(
      PLATFORM_SETTINGS_STORAGE_KEY,
      JSON.stringify({
        ...DEFAULT_PLATFORM_SETTINGS,
        ...settings,
      }),
    );
  } catch {
    // Cache is best-effort; Firestore remains the source of truth.
  }
}

export function subscribeToPlatformSettings(callback, onError) {
  callback({
    ...DEFAULT_PLATFORM_SETTINGS,
    ...readCachedPlatformSettings(),
  });

  return onSnapshot(
    platformSettingsRef,
    (snapshot) => {
      const settings = {
        ...DEFAULT_PLATFORM_SETTINGS,
        ...(snapshot.exists() ? serializeFirestoreData(snapshot.data()) : {}),
      };
      cachePlatformSettings(settings);
      callback(settings);
    },
    (error) => {
      callback({
        ...DEFAULT_PLATFORM_SETTINGS,
        ...readCachedPlatformSettings(),
      });
      onError?.(error);
    },
  );
}

export async function savePlatformSettings(settings) {
  const nextSettings = {
    ...DEFAULT_PLATFORM_SETTINGS,
    ...readCachedPlatformSettings(),
    ...settings,
  };

  cachePlatformSettings(nextSettings);
  await setDoc(
    platformSettingsRef,
    {
      ...nextSettings,
      updatedAt: serverTimestamp(),
    },
    { merge: true },
  );
  return nextSettings;
}

export async function saveInfluencerCommission(influencerUid, data) {
  let currentSettings = {
    ...DEFAULT_PLATFORM_SETTINGS,
    ...readCachedPlatformSettings(),
  };

  try {
    const snapshot = await getDoc(platformSettingsRef);
    currentSettings = {
      ...currentSettings,
      ...(snapshot.exists() ? snapshot.data() : {}),
    };
  } catch {
    // If read is blocked, still attempt write with cached values.
  }

  const nextSettings = {
    ...currentSettings,
    influencerCommissions: {
      ...(currentSettings.influencerCommissions || {}),
      [influencerUid]: {
        ...data,
        updatedAt: new Date().toISOString(),
      },
    },
  };

  cachePlatformSettings(nextSettings);
  await setDoc(
    platformSettingsRef,
    {
      influencerCommissions: nextSettings.influencerCommissions,
      updatedAt: serverTimestamp(),
    },
    { merge: true },
  );
  return nextSettings;
}

export function subscribeToApprovedInfluencers(callback, onError) {
  const approvedInfluencersQuery = query(
    collection(db, 'influencers'),
    where('status', '==', 'approved'),
  );

  return onSnapshot(
    approvedInfluencersQuery,
    (snapshot) => {
      callback(snapshot.docs
        .map((item) => ({ id: item.id, ...serializeFirestoreData(item.data()) }))
        .filter(isInfluencerVisibleToBrands));
    },
    onError,
  );
}

export function subscribeToPendingInfluencers(callback, onError) {
  const pendingInfluencersQuery = query(
    collection(db, 'influencers'),
    where('status', '==', 'pending'),
  );

  return onSnapshot(
    pendingInfluencersQuery,
    (snapshot) => {
      const influencers = snapshot.docs.map((item) => ({
        id: item.id,
        ...serializeFirestoreData(item.data()),
      }));

      callback(influencers);
    },
    onError,
  );
}

export function subscribeToUsers(callback, onError) {
  return onSnapshot(
    collection(db, 'users'),
    (snapshot) => {
      const users = snapshot.docs.map((item) => normalizeUserDoc(item.id, serializeFirestoreData(item.data())));
      callback({
        brands: users.filter((user) => user.role === 'brand'),
        influencers: users.filter((user) => user.role === 'influencer'),
      });
    },
    onError,
  );
}

export async function updateUserAccountStatus(uid, status) {
  await updateDoc(doc(db, 'users', uid), {
    status,
    updatedAt: serverTimestamp(),
  });
}

export async function approveInfluencer(influencerUid) {
  await Promise.all([
    updateDoc(doc(db, 'influencers', influencerUid), {
      status: 'approved',
      reviewedAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
    }),
    updateDoc(doc(db, 'users', influencerUid), {
      status: 'approved',
      updatedAt: serverTimestamp(),
    }),
  ]);

  createCampaignMatchesForInfluencer(influencerUid).catch((error) => {
    console.warn('Campaign matches could not be generated for influencer.', error);
  });
}

export async function rejectInfluencer(influencerUid) {
  await Promise.all([
    updateDoc(doc(db, 'influencers', influencerUid), {
      status: 'rejected',
      reviewedAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
    }),
    updateDoc(doc(db, 'users', influencerUid), {
      status: 'rejected',
      updatedAt: serverTimestamp(),
    }),
  ]);
}

export function subscribeToCampaigns(callback, onError) {
  const campaignsQuery = query(collection(db, 'campaigns'), orderBy('createdAt', 'desc'));

  return onSnapshot(
    campaignsQuery,
    (snapshot) => {
      callback(snapshot.docs.map((item) => normalizeCampaignDoc(item.id, serializeFirestoreData(item.data()))));
    },
    onError,
  );
}

export function subscribeToBrandCampaigns(brandUid, callback, onError) {
  if (!brandUid) {
    callback([]);
    return () => {};
  }

  const campaignsQuery = query(
    collection(db, 'campaigns'),
    where('brandUid', '==', brandUid),
  );

  return onSnapshot(
    campaignsQuery,
    (snapshot) => {
      callback(
        snapshot.docs
          .map((item) => normalizeCampaignDoc(item.id, serializeFirestoreData(item.data())))
          .sort((a, b) => getTimestampMs(b.createdAt) - getTimestampMs(a.createdAt)),
      );
    },
    onError,
  );
}

export async function createCampaign(campaign) {
  const budgetMin = Number(campaign.budgetMin || 0);
  const budgetMax = Number(campaign.budgetMax || 0);
  const payload = {
    brandUid: campaign.brandUid || '',
    name: campaign.name || campaign.title || '',
    title: campaign.title || campaign.name || '',
    description: campaign.description || '',
    brand: campaign.brand || campaign.brandName || '',
    brandName: campaign.brandName || campaign.brand || '',
    categories: campaign.categories || (campaign.category ? [campaign.category] : []),
    category: campaign.category || campaign.categories?.[0] || '',
    budgetMin,
    budgetMax,
    budgetRange: campaign.budgetRange || formatBudgetRange({ budgetMin, budgetMax }),
    targetAgeMin: Number(campaign.targetAgeMin || 18),
    targetAgeMax: Number(campaign.targetAgeMax || campaign.targetAge || 65),
    targetGender: campaign.targetGender || 'Hepsi',
    location: campaign.location || '',
    contentType: campaign.contentType || campaign.contentTypes || [],
    startDate: campaign.startDate || '',
    endDate: campaign.endDate || '',
    bannerUrl: campaign.bannerUrl || '',
    bannerSource: campaign.bannerSource || '',
    status: campaign.status || 'Aktif',
    interestedCount: Number(campaign.interestedCount || 0),
    creatorAvatars: campaign.creatorAvatars || [],
    creatorCount: Number(campaign.creatorCount || 0),
    createdAt: serverTimestamp(),
    updatedAt: serverTimestamp(),
  };

  const ref = await addDoc(collection(db, 'campaigns'), payload);
  return {
    id: ref.id,
    ...payload,
    createdAt: null,
    updatedAt: null,
  };
}

export async function updateCampaign(campaignId, campaign) {
  const budgetMin = Number(campaign.budgetMin || 0);
  const budgetMax = Number(campaign.budgetMax || 0);
  const payload = {
    brandUid: campaign.brandUid || '',
    name: campaign.name || campaign.title || '',
    title: campaign.title || campaign.name || '',
    description: campaign.description || '',
    brand: campaign.brand || campaign.brandName || '',
    brandName: campaign.brandName || campaign.brand || '',
    categories: campaign.categories || (campaign.category ? [campaign.category] : []),
    category: campaign.category || campaign.categories?.[0] || '',
    budgetMin,
    budgetMax,
    budgetRange: campaign.budgetRange || formatBudgetRange({ budgetMin, budgetMax }),
    targetAgeMin: Number(campaign.targetAgeMin || 18),
    targetAgeMax: Number(campaign.targetAgeMax || campaign.targetAge || 65),
    targetGender: campaign.targetGender || 'Hepsi',
    location: campaign.location || '',
    contentType: campaign.contentType || campaign.contentTypes || [],
    startDate: campaign.startDate || '',
    endDate: campaign.endDate || '',
    bannerUrl: campaign.bannerUrl || '',
    bannerSource: campaign.bannerSource || '',
    status: campaign.status || 'Aktif',
    interestedCount: Number(campaign.interestedCount || 0),
    creatorAvatars: campaign.creatorAvatars || [],
    creatorCount: Number(campaign.creatorCount || 0),
    createdAt: campaign.createdAt || serverTimestamp(),
    updatedAt: serverTimestamp(),
  };

  await setDoc(doc(db, 'campaigns', campaignId), payload, { merge: true });

  return {
    id: campaignId,
    ...payload,
    updatedAt: null,
  };
}

export async function createCampaignMatchesForCampaign(campaign) {
  if (!campaign?.id) return [];

  const influencersSnapshot = await getDocs(query(
    collection(db, 'influencers'),
    where('status', '==', 'approved'),
  ));
  const influencers = influencersSnapshot.docs
    .map((item) => ({ id: item.id, ...serializeFirestoreData(item.data()) }))
    .filter(isInfluencerVisibleToBrands);

  if (!influencers.length) return [];

  const batch = writeBatch(db);
  const matchDocs = influencers.map((influencer) => {
    const matchDoc = {
      ...buildInterestMatchDocument({ influencer, campaign }),
      updatedAt: serverTimestamp(),
      createdAt: serverTimestamp(),
    };
    if (Number(matchDoc.score || 0) <= 0) return null;
    const matchId = matchDoc.id || `${campaign.id}_${influencer.uid || influencer.id}`;
    batch.set(doc(db, 'campaignMatches', matchId), matchDoc, { merge: true });
    return {
      ...matchDoc,
      id: matchId,
      createdAt: null,
      updatedAt: null,
    };
  }).filter(Boolean);

  if (!matchDocs.length) return [];

  await batch.commit();
  return matchDocs;
}

export async function createCampaignMatchesForInfluencer(influencerUid) {
  if (!influencerUid) return [];

  const influencerSnapshot = await getDoc(doc(db, 'influencers', influencerUid));
  if (!influencerSnapshot.exists()) return [];

  const influencer = {
    id: influencerSnapshot.id,
    ...serializeFirestoreData(influencerSnapshot.data()),
    uid: influencerSnapshot.data().uid || influencerSnapshot.id,
    status: 'approved',
  };

  if (!isInfluencerVisibleToBrands(influencer)) return [];

  const campaignsSnapshot = await getDocs(collection(db, 'campaigns'));
  const campaigns = campaignsSnapshot.docs
    .map((item) => normalizeCampaignDoc(item.id, serializeFirestoreData(item.data())))
    .filter((campaign) => campaign.isActive);

  if (!campaigns.length) return [];

  const batch = writeBatch(db);
  const matchDocs = campaigns.map((campaign) => {
    const matchDoc = {
      ...buildInterestMatchDocument({ influencer, campaign }),
      updatedAt: serverTimestamp(),
      createdAt: serverTimestamp(),
    };
    if (Number(matchDoc.score || 0) <= 0) return null;
    const matchId = matchDoc.id || `${campaign.id}_${influencerUid}`;
    batch.set(doc(db, 'campaignMatches', matchId), matchDoc, { merge: true });
    return {
      ...matchDoc,
      id: matchId,
      createdAt: null,
      updatedAt: null,
    };
  }).filter(Boolean);

  if (!matchDocs.length) return [];

  await batch.commit();
  return matchDocs;
}

export function subscribeToInfluencerCampaignMatches(influencerUid, minimumScore, callback, onError) {
  if (!influencerUid) {
    callback([]);
    return () => {};
  }

  const matchesQuery = query(
    collection(db, 'campaignMatches'),
    where('influencerUid', '==', influencerUid),
  );

  return onSnapshot(
    matchesQuery,
    (snapshot) => {
      const minScore = Number(minimumScore || 0);
      callback(
        snapshot.docs
          .map((item) => normalizeCampaignMatchDoc(item.id, serializeFirestoreData(item.data())))
          .filter((item) => item.visibleToInfluencer !== false)
          .filter((item) => Number(item.score || 0) > 0)
          .filter((item) => Number(item.score || 0) >= minScore)
          .sort((a, b) => Number(b.score || 0) - Number(a.score || 0)),
      );
    },
    onError,
  );
}

export function subscribeToCampaignMatches(campaignId, brandUid, callback, onError) {
  if (!campaignId || !brandUid) {
    callback([]);
    return () => {};
  }

  const matchesQuery = query(
    collection(db, 'campaignMatches'),
    where('campaignId', '==', campaignId),
    where('brandUid', '==', brandUid),
  );

  return onSnapshot(
    matchesQuery,
    (snapshot) => {
      callback(
        snapshot.docs
          .map((item) => normalizeCampaignMatchDoc(item.id, serializeFirestoreData(item.data())))
          .filter((item) => Number(item.score || 0) > 0)
          .sort((a, b) => Number(b.score || 0) - Number(a.score || 0)),
      );
    },
    onError,
  );
}

export async function uploadCampaignBanner({ file, brandUid, campaignId }) {
  if (!file) return '';

  const extension = file.name?.split('.').pop()?.toLowerCase() || 'jpg';
  const safeCampaignId = String(campaignId || Date.now()).replace(/[^a-zA-Z0-9_-]/g, '-');
  const safeBrandUid = String(brandUid || 'unknown-brand').replace(/[^a-zA-Z0-9_-]/g, '-');
  const storageRef = ref(storage, `campaign-banners/${safeBrandUid}/${safeCampaignId}.${extension}`);

  await uploadBytes(storageRef, file, {
    contentType: file.type || 'image/jpeg',
  });

  return getDownloadURL(storageRef);
}

export async function createCampaignOffer(offer) {
  const payload = buildCampaignOfferPayload(offer, { includeInfluencerUid: true });

  try {
    const ref = await addDoc(collection(db, 'campaignOffers'), payload);
    return {
      id: ref.id,
      ...payload,
      createdAt: null,
      updatedAt: null,
    };
  } catch (error) {
    if (error?.code !== 'permission-denied') throw error;

    const legacyPayload = buildCampaignOfferPayload(offer, { includeInfluencerUid: false });
    const ref = await addDoc(collection(db, 'campaignOffers'), legacyPayload);
    return {
      id: ref.id,
      ...legacyPayload,
      createdAt: null,
      updatedAt: null,
    };
  }
}

function buildCampaignOfferPayload(offer, { includeInfluencerUid }) {
  const payload = {
    campaignId: offer.campaignId || '',
    brandUid: offer.brandUid || '',
    brandName: offer.brandName || '',
    campaignTitle: offer.campaignTitle || '',
    creatorId: offer.creatorId || '',
    creatorName: offer.creatorName || offer.name || '',
    creatorUsername: offer.creatorUsername || offer.handle || '',
    avatarUrl: offer.avatarUrl || offer.avatar || '',
    amount: Number(offer.amount || 0),
    status: offer.status || 'Pending',
    message: offer.message || '',
    createdAt: serverTimestamp(),
    updatedAt: serverTimestamp(),
  };

  if (includeInfluencerUid) {
    payload.influencerUid = offer.influencerUid || offer.creatorId || '';
  }

  return payload;
}

export async function ensureChatThread(thread) {
  if (!thread.brandUid || !thread.influencerUid) return null;

  const threadId = `${thread.brandUid}_${thread.influencerUid}`;
  const payload = {
    id: threadId,
    participants: [thread.brandUid, thread.influencerUid],
    brandUid: thread.brandUid,
    influencerUid: thread.influencerUid,
    brandName: thread.brandName || 'Marka',
    influencerName: thread.influencerName || 'Influencer',
    brandAvatar: thread.brandAvatar || '',
    influencerAvatar: thread.influencerAvatar || '',
    category: thread.category || 'İş Birliği',
    lastMessageText: thread.lastMessageText || 'Sohbet başlatıldı.',
    lastMessageTime: new Date().toISOString(),
    messages: thread.initialMessage ? [thread.initialMessage] : [],
    updatedAt: serverTimestamp(),
    createdAt: serverTimestamp(),
  };

  await setDoc(doc(db, 'chatThreads', threadId), payload, { merge: true });
  return payload;
}

export function subscribeToChatThreads(userUid, callback, onError) {
  if (!userUid) {
    callback([]);
    return () => {};
  }

  const threadsQuery = query(
    collection(db, 'chatThreads'),
    where('participants', 'array-contains', userUid),
  );

  return onSnapshot(
    threadsQuery,
    (snapshot) => {
      callback(
        snapshot.docs
          .map((item) => normalizeChatThreadDoc(item.id, serializeFirestoreData(item.data())))
          .sort((a, b) => getTimestampMs(b.updatedAt || b.lastMessageTime) - getTimestampMs(a.updatedAt || a.lastMessageTime)),
      );
    },
    onError,
  );
}

export async function sendChatMessage(threadId, message) {
  const nextMessage = {
    id: `msg_${Date.now()}`,
    sender: message.sender || 'user',
    text: message.text || '',
    timestamp: new Date().toISOString(),
  };

  await updateDoc(doc(db, 'chatThreads', threadId), {
    messages: arrayUnion(nextMessage),
    lastMessageText: nextMessage.text,
    lastMessageTime: nextMessage.timestamp,
    updatedAt: serverTimestamp(),
  });

  return nextMessage;
}

export function subscribeToCampaignOffers(campaignId, callback, onError) {
  if (!campaignId) {
    callback([]);
    return () => {};
  }

  const offersQuery = query(
    collection(db, 'campaignOffers'),
    where('campaignId', '==', campaignId),
  );

  return onSnapshot(
    offersQuery,
    (snapshot) => {
      callback(
        snapshot.docs
          .map((item) => normalizeCampaignOfferDoc(item.id, serializeFirestoreData(item.data())))
          .sort((a, b) => getTimestampMs(b.createdAt) - getTimestampMs(a.createdAt)),
      );
    },
    onError,
  );
}

export function subscribeToBrandOffers(brandUid, callback, onError) {
  if (!brandUid) {
    callback([]);
    return () => {};
  }

  const offersQuery = query(
    collection(db, 'campaignOffers'),
    where('brandUid', '==', brandUid),
  );

  return onSnapshot(
    offersQuery,
    (snapshot) => {
      callback(
        snapshot.docs
          .map((item) => normalizeCampaignOfferDoc(item.id, serializeFirestoreData(item.data())))
          .sort((a, b) => getTimestampMs(b.createdAt) - getTimestampMs(a.createdAt)),
      );
    },
    onError,
  );
}

export function subscribeToInfluencerOffers(influencerUid, callback, onError) {
  if (!influencerUid) {
    callback([]);
    return () => {};
  }

  const byInfluencerUidQuery = query(
    collection(db, 'campaignOffers'),
    where('influencerUid', '==', influencerUid),
  );
  const byCreatorIdQuery = query(
    collection(db, 'campaignOffers'),
    where('creatorId', '==', influencerUid),
  );
  let byInfluencerUidItems = [];
  let byCreatorIdItems = [];

  const emit = () => {
    callback(
      mergeById([...byInfluencerUidItems, ...byCreatorIdItems])
        .sort((a, b) => getTimestampMs(b.createdAt) - getTimestampMs(a.createdAt)),
    );
  };

  const unsubscribeInfluencerUid = onSnapshot(
    byInfluencerUidQuery,
    (snapshot) => {
      byInfluencerUidItems = snapshot.docs.map((item) => normalizeCampaignOfferDoc(item.id, serializeFirestoreData(item.data())));
      emit();
    },
    onError,
  );
  const unsubscribeCreatorId = onSnapshot(
    byCreatorIdQuery,
    (snapshot) => {
      byCreatorIdItems = snapshot.docs.map((item) => normalizeCampaignOfferDoc(item.id, serializeFirestoreData(item.data())));
      emit();
    },
    onError,
  );

  return () => {
    unsubscribeInfluencerUid();
    unsubscribeCreatorId();
  };
}

function mergeById(items) {
  return [...new Map(items.map((item) => [item.id, item])).values()];
}

function getTimestampMs(value) {
  if (!value) return 0;
  if (typeof value.toMillis === 'function') return value.toMillis();
  return new Date(value).getTime() || 0;
}

export async function updateCampaignOfferStatus(offerId, status) {
  await updateDoc(doc(db, 'campaignOffers', offerId), {
    status,
    updatedAt: serverTimestamp(),
  });
}

export function subscribeToTransactions(callback, onError) {
  const transactionsQuery = query(collection(db, 'transactions'), orderBy('createdAt', 'desc'));

  return onSnapshot(
    transactionsQuery,
    (snapshot) => {
      callback(snapshot.docs.map((item) => normalizeTransactionDoc(item.id, serializeFirestoreData(item.data()))));
    },
    onError,
  );
}

export async function createTransaction(transaction) {
  const payload = {
    campaignId: transaction.campaignId || '',
    campaignName: transaction.campaignName || '',
    brandName: transaction.brandName || '',
    influencerUid: transaction.influencerUid || '',
    influencerHandle: transaction.influencerHandle || '',
    influencerAvatar: transaction.influencerAvatar || '',
    grossAmount: Number(transaction.grossAmount || 0),
    feePercent: Number(transaction.feePercent || 10),
    status: transaction.status || 'Pending',
    createdAt: serverTimestamp(),
    updatedAt: serverTimestamp(),
  };

  const ref = await addDoc(collection(db, 'transactions'), payload);
  return {
    id: ref.id,
    ...payload,
    createdAt: null,
    updatedAt: null,
  };
}

export async function updateTransactionStatusInDb(transactionId, status) {
  await updateDoc(doc(db, 'transactions', transactionId), {
    status,
    updatedAt: serverTimestamp(),
  });
}

function normalizeUserDoc(id, data) {
  const name = data.displayName || data.companyName || data.email || 'İsimsiz Kullanıcı';
  const category = data.role === 'brand' ? 'Marka' : 'Influencer';
  const status = data.status === 'suspended' ? 'Askıya Alınmış' : 'Aktif';

  return {
    id: data.uid || id,
    name,
    logoLetters: buildLogoLetters(name),
    category,
    email: data.email || '-',
    signupDate: formatDate(data.createdAt),
    status,
    role: data.role,
  };
}

function isInfluencerVisibleToBrands(influencer) {
  return influencer.profileVisibility !== false
    && influencer.settings?.profileVisibility !== false;
}

function normalizeTransactionDoc(id, data) {
  return {
    id,
    campaignName: data.campaignName || 'İsimsiz Kampanya',
    brandName: data.brandName || '-',
    influencerHandle: data.influencerHandle || '-',
    influencerAvatar: data.influencerAvatar || 'https://placehold.co/120x120?text=GI',
    grossAmount: Number(data.grossAmount || 0),
    feePercent: Number(data.feePercent || 10),
    status: data.status || 'Pending',
    ...data,
  };
}

function normalizeCampaignDoc(id, data) {
  const baseCampaign = {
    ...data,
    id,
    name: data.name || data.title || 'İsimsiz Kampanya',
    title: data.title || data.name || 'İsimsiz Kampanya',
    description: data.description || '',
    brand: data.brand || data.brandName || '-',
    brandName: data.brandName || data.brand || '-',
    categories: data.categories || (data.category ? [data.category] : []),
    category: data.category || data.categories?.[0] || 'Genel',
    budgetRange: data.budgetRange || formatBudgetRange(data),
    budgetMin: Number(data.budgetMin || 0),
    budgetMax: Number(data.budgetMax || 0),
    targetAgeMin: Number(data.targetAgeMin || 18),
    targetAgeMax: Number(data.targetAgeMax || 65),
    targetGender: data.targetGender || 'Hepsi',
    location: data.location || '',
    contentType: data.contentType || [],
    startDate: data.startDate || '',
    endDate: data.endDate || '',
    bannerUrl: data.bannerUrl || '',
    bannerSource: data.bannerSource || '',
    status: data.status || 'Aktif',
    interestedCount: Number(data.interestedCount || 0),
    creatorAvatars: data.creatorAvatars || [],
    creatorCount: Number(data.creatorCount || 0),
  };
  const lifecycle = getCampaignLifecycle(baseCampaign);

  return {
    ...baseCampaign,
    isExpired: lifecycle.isExpired,
    isActive: lifecycle.isActive,
    statusLabel: lifecycle.label,
  };
}

function normalizeCampaignMatchDoc(id, data) {
  const campaignSnapshot = data.campaignSnapshot || {};
  const influencerSnapshot = data.influencerSnapshot || {};

  return {
    id,
    ...data,
    campaignId: data.campaignId || campaignSnapshot.id || '',
    influencerUid: data.influencerUid || '',
    brandUid: data.brandUid || campaignSnapshot.brandUid || '',
    brandName: data.brandName || campaignSnapshot.brandName || campaignSnapshot.brand || '',
    campaignTitle: data.campaignTitle || campaignSnapshot.title || campaignSnapshot.name || '',
    score: Number(data.score || 0),
    reasons: data.reasons || [],
    breakdown: data.breakdown || {},
    influencer: {
      id: data.influencerUid || '',
      ...influencerSnapshot,
      matchScore: Number(data.score || 0),
      matchReasons: data.reasons || [],
      matchBreakdown: data.breakdown || {},
    },
    campaign: {
      id: data.campaignId || campaignSnapshot.id || '',
      ...campaignSnapshot,
      brandUid: data.brandUid || campaignSnapshot.brandUid || '',
      brandName: data.brandName || campaignSnapshot.brandName || campaignSnapshot.brand || '',
      title: data.campaignTitle || campaignSnapshot.title || campaignSnapshot.name || '',
      matchScore: Number(data.score || 0),
      matchNote: (data.reasons || []).join(' '),
    },
  };
}

function normalizeCampaignOfferDoc(id, data) {
  return {
    id,
    campaignId: data.campaignId,
    brandUid: data.brandUid || '',
    brandName: data.brandName || '',
    influencerUid: data.influencerUid || data.creatorId,
    name: data.name || data.creatorName || data.influencerName || 'İsimsiz Influencer',
    handle: data.handle || data.creatorUsername || data.influencerHandle || '',
    avatar: data.avatar || data.avatarUrl || data.influencerAvatar || 'https://placehold.co/120x120?text=GI',
    amount: Number(data.amount || data.grossAmount || 0),
    status: data.status || 'Pending',
    message: data.message || '',
    ...data,
  };
}

function normalizeChatThreadDoc(id, data) {
  return {
    id,
    participants: data.participants || [],
    brandUid: data.brandUid || '',
    influencerUid: data.influencerUid || '',
    brandName: data.brandName || 'Marka',
    influencerName: data.influencerName || 'Influencer',
    brandAvatar: data.brandAvatar || 'https://placehold.co/120x120?text=GI',
    influencerAvatar: data.influencerAvatar || 'https://placehold.co/120x120?text=GI',
    category: data.category || 'İş Birliği',
    lastMessageText: data.lastMessageText || '',
    lastMessageTime: data.lastMessageTime || '',
    messages: data.messages || [],
    updatedAt: data.updatedAt,
  };
}

function formatBudgetRange(data) {
  const min = Number(data.budgetMin || 0);
  const max = Number(data.budgetMax || 0);
  if (!min && !max) return 'Belirtilmedi';
  if (min && max) return `₺${min.toLocaleString('tr-TR')} - ₺${max.toLocaleString('tr-TR')}`;
  return `₺${(min || max).toLocaleString('tr-TR')}+`;
}

function buildLogoLetters(value) {
  return String(value || 'GI')
    .split(' ')
    .filter(Boolean)
    .map((part) => part[0])
    .join('')
    .substring(0, 2)
    .toUpperCase();
}

function formatDate(value) {
  const date = typeof value?.toDate === 'function' ? value.toDate() : value ? new Date(value) : null;
  if (!date || Number.isNaN(date.getTime())) return '-';
  return new Intl.DateTimeFormat('tr-TR', {
    day: '2-digit',
    month: 'long',
    year: 'numeric',
  }).format(date);
}

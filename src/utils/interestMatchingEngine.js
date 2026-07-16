const WEIGHTS = {
  category: 70,
  contentType: 30,
};

export function calculateInterestMatchScore(influencer = {}, campaign = {}) {
  const categoryScore = calculateOverlapScore(getInfluencerCategories(influencer), getCampaignCategories(campaign));
  const contentTypeScore = calculateOverlapScore(getInfluencerServices(influencer), getCampaignContentTypes(campaign));

  const score = Math.round(
    categoryScore * WEIGHTS.category
    + contentTypeScore * WEIGHTS.contentType,
  );

  return {
    score: clamp(score, 0, 100),
    reasons: buildReasons({
      categoryScore,
      contentTypeScore,
    }),
    breakdown: {
      categoryScore: Math.round(categoryScore * 100),
      contentTypeScore: Math.round(contentTypeScore * 100),
    },
  };
}

export function buildInterestMatchDocument({
  influencer = {},
  campaign = {},
  match = calculateInterestMatchScore(influencer, campaign),
}) {
  const influencerUid = influencer.uid || influencer.id || '';
  const campaignId = campaign.id || '';
  const followersCount = Number(influencer.followersCount || influencer.socialAccounts?.instagram?.followers || 0);
  const engagementRate = Number(influencer.engagementRate || influencer.socialAccounts?.instagram?.engagementRate || 0);

  return {
    id: campaignId && influencerUid ? `${campaignId}_${influencerUid}` : '',
    campaignId,
    influencerUid,
    brandUid: campaign.brandUid || '',
    brandName: campaign.brandName || campaign.brand || '',
    campaignTitle: campaign.title || campaign.name || '',
    score: match.score,
    reasons: match.reasons,
    breakdown: match.breakdown,
    visibleToInfluencer: influencer.profileVisibility !== false && influencer.settings?.profileVisibility !== false,
    influencerSnapshot: {
      displayName: influencer.displayName || influencer.name || '',
      username: influencer.username || influencer.handle || influencer.socialAccounts?.instagram?.username || influencer.email?.split('@')[0] || '',
      bio: influencer.bio || '',
      profileImageUrl: influencer.profileImageUrl || influencer.profileImage || '',
      categories: getInfluencerCategories(influencer),
      services: getInfluencerServices(influencer),
      followersCount,
      engagementRate,
      location: influencer.location || '',
    },
    campaignSnapshot: {
      id: campaignId,
      title: campaign.title || campaign.name || '',
      name: campaign.name || campaign.title || '',
      description: campaign.description || '',
      brand: campaign.brand || campaign.brandName || '',
      brandName: campaign.brandName || campaign.brand || '',
      brandUid: campaign.brandUid || '',
      logoUrl: campaign.logoUrl || campaign.brandLogoUrl || '',
      bannerUrl: campaign.bannerUrl || '',
      categories: getCampaignCategories(campaign),
      category: getCampaignCategories(campaign)[0] || 'Genel',
      contentType: getCampaignContentTypes(campaign),
      budgetMin: Number(campaign.budgetMin || 0),
      budgetMax: Number(campaign.budgetMax || 0),
      targetAgeMin: Number(campaign.targetAgeMin || 18),
      targetAgeMax: Number(campaign.targetAgeMax || 65),
      targetGender: campaign.targetGender || 'Hepsi',
      location: campaign.location || '',
      startDate: campaign.startDate || '',
      endDate: campaign.endDate || '',
      status: campaign.status || 'Aktif',
      statusLabel: campaign.statusLabel || campaign.status || 'Aktif',
    },
  };
}

export function getInfluencerCategories(influencer = {}) {
  return normalizeList(influencer.categories || influencer.interests || influencer.serviceCategories);
}

export function getInfluencerServices(influencer = {}) {
  const pricingServices = Object.keys(influencer.pricing || {});
  return normalizeList(influencer.services || influencer.contentTypes || pricingServices);
}

export function getCampaignCategories(campaign = {}) {
  return normalizeList(campaign.categories || campaign.category);
}

export function getCampaignContentTypes(campaign = {}) {
  return normalizeList(campaign.contentType || campaign.contentTypes || campaign.type);
}

function calculateOverlapScore(sourceValues, targetValues) {
  if (!sourceValues.length || !targetValues.length) return 0;
  const source = sourceValues.map(normalizeText);
  const target = targetValues.map(normalizeText);
  const matches = target.filter((targetItem) => source.some((sourceItem) => isSimilar(sourceItem, targetItem))).length;
  return clamp(matches / target.length, 0, 1);
}

function buildReasons(scores) {
  const reasons = [];
  if (scores.categoryScore >= 0.65) reasons.push('Ilgi alanlari kampanya kategorisiyle uyumlu.');
  if (scores.contentTypeScore >= 0.65) reasons.push('Istenen icerik formatlari influencer hizmetleriyle eslesiyor.');
  if (!reasons.length) reasons.push('Kategori veya icerik hizmeti uyumu dusuk.');
  return reasons;
}

function normalizeList(value) {
  const list = Array.isArray(value) ? value : String(value || '').split(/[,/]+/);
  return list.map((item) => String(item || '').trim()).filter(Boolean);
}

function normalizeText(value) {
  return String(value || '')
    .toLocaleLowerCase('tr-TR')
    .normalize('NFD')
    .replace(/\p{Diacritic}/gu, '')
    .trim();
}

function isSimilar(sourceItem, targetItem) {
  return sourceItem === targetItem
    || sourceItem.includes(targetItem)
    || targetItem.includes(sourceItem);
}

function clamp(value, min, max) {
  return Math.min(max, Math.max(min, value));
}

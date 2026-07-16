const TURKISH_MONTHS = {
  oca: 0,
  ocak: 0,
  sub: 1,
  şub: 1,
  subat: 1,
  şubat: 1,
  mar: 2,
  mart: 2,
  nis: 3,
  nisan: 3,
  may: 4,
  mayis: 4,
  mayıs: 4,
  haz: 5,
  haziran: 5,
  tem: 6,
  temmuz: 6,
  agu: 7,
  ağu: 7,
  agustos: 7,
  ağustos: 7,
  eyl: 8,
  eylul: 8,
  eylül: 8,
  eki: 9,
  ekim: 9,
  kas: 10,
  kasim: 10,
  kasım: 10,
  ara: 11,
  aralik: 11,
  aralık: 11,
};

export function parseCampaignDate(value) {
  if (!value) return null;
  if (typeof value.toDate === 'function') return value.toDate();

  const rawValue = String(value).trim();
  if (!rawValue) return null;

  const inputMatch = rawValue.match(/^(\d{4})-(\d{2})-(\d{2})$/);
  if (inputMatch) {
    return new Date(Number(inputMatch[1]), Number(inputMatch[2]) - 1, Number(inputMatch[3]));
  }

  const displayMatch = rawValue
    .toLocaleLowerCase('tr-TR')
    .replace(/\./g, '')
    .match(/(\d{1,2})\s+([a-zçğıöşü]+)\s+(\d{4})/i);

  if (displayMatch) {
    const month = TURKISH_MONTHS[displayMatch[2]];
    if (month !== undefined) {
      return new Date(Number(displayMatch[3]), month, Number(displayMatch[1]));
    }
  }

  const parsed = new Date(rawValue);
  return Number.isNaN(parsed.getTime()) ? null : parsed;
}

export function isCampaignExpired(campaign, now = new Date()) {
  const endDate = parseCampaignDate(campaign?.endDate);
  if (!endDate) return false;

  const endOfDay = new Date(endDate);
  endOfDay.setHours(23, 59, 59, 999);

  return endOfDay.getTime() < now.getTime();
}

export function getCampaignLifecycle(campaign) {
  if (isCampaignExpired(campaign)) {
    return {
      isExpired: true,
      isActive: false,
      label: 'Süresi geçmiş',
      status: 'expired',
    };
  }

  const normalizedStatus = String(campaign?.status || '').toLocaleLowerCase('tr-TR');
  const isActive = normalizedStatus === 'aktif' || normalizedStatus === 'active';

  return {
    isExpired: false,
    isActive,
    label: campaign?.status || 'Aktif',
    status: normalizedStatus || 'aktif',
  };
}

export function isCampaignVisibleToInfluencers(campaign) {
  return getCampaignLifecycle(campaign).isActive;
}

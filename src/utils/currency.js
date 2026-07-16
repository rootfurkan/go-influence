export const CURRENCY_OPTIONS = {
  TRY: { symbol: '₺', label: 'Türk Lirası' },
  USD: { symbol: '$', label: 'Amerikan Doları' },
  EUR: { symbol: '€', label: 'Euro' },
};

export function getCurrencyCode(profile) {
  return profile?.settings?.currencyPreference || profile?.currencyPreference || 'TRY';
}

export function getCurrencySymbol(currency = 'TRY') {
  return CURRENCY_OPTIONS[currency]?.symbol || CURRENCY_OPTIONS.TRY.symbol;
}

export function formatMoney(value, currency = 'TRY') {
  const amount = Number(value || 0).toLocaleString('tr-TR');
  return `${getCurrencySymbol(currency)}${amount}`;
}

export function formatMoneyRange(min, max, currency = 'TRY') {
  return `${formatMoney(min, currency)} - ${formatMoney(max, currency)}`;
}

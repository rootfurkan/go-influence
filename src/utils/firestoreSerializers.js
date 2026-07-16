export function serializeFirestoreData(value) {
  if (!value) return value;

  if (typeof value.toDate === 'function') {
    return value.toDate().toISOString();
  }

  if (Array.isArray(value)) {
    return value.map((item) => serializeFirestoreData(item));
  }

  if (typeof value === 'object') {
    return Object.fromEntries(
      Object.entries(value).map(([key, item]) => [key, serializeFirestoreData(item)]),
    );
  }

  return value;
}

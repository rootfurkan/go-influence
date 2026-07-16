# PROJECT.md — Proje Tanımı

## 1. Ne İnşa Ediyoruz

Markaların ihtiyaçlarına (kategori, bütçe, hedef kitle, kampanya tipi) uygun influencerları; influencerların ilgi alanlarına göre uygun markalarla **AI destekli skorlama** ile eşleştiren bir web platformu.

**Üç ana parça:**
- Tanıtıcı anasayfa (public)
- Marka paneli (kampanya oluşturma, AI eşleşme sonuçları, teklif yönetimi)
- Influencer paneli (profil/portfolyo, gelen teklifler, marka ihtiyaçları)

## 2. Teknoloji Yığını

| Katman | Teknoloji |
|---|---|
| Frontend | React (Vite) |
| State | Redux Toolkit + RTK Query |
| Routing | React Router |
| Backend/DB | Firebase (Firestore + Authentication + Cloud Functions) |
| Görsel Depolama | Cloudinary (unsigned upload) |
| AI | Anthropic API — yalnızca Cloud Function üzerinden |
| Stil | Tailwind CSS |
| Form | React Hook Form + Zod |
| Deploy | Vercel/Netlify (frontend) |

## 3. Kullanıcı Rolleri

- `brand` — marka hesabı
- `influencer` — influencer hesabı
- `admin` — platform yöneticisi (marka ve influencer panellerini denetler, ödeme/komisyon süreçlerini yönetir)

Rol, `users` koleksiyonunda tutulur ve tüm route guard/security rule kararları buna göre verilir. `admin` rolündeki kullanıcılar Firestore'da manuel olarak (Firebase Console üzerinden) atanır, kayıt formundan admin rolü seçilemez.

## 4. Onboarding ve Onay Akışları

### Influencer Akışı
1. Kayıt ol
2. **Zorunlu** çok adımlı profil formu: Kişisel Bilgiler → İlgi Alanları/Kategoriler → Sosyal Medya Hesapları → Portfolyo & Fiyatlandırma
3. Form tamamlanınca "Onay Bekleniyor" ekranına düşer (`status: pending`)
4. Yönetici onayı sonrası (`status: approved`) tam panel erişimi açılır

### Marka Akışı
1. Kayıt ol
2. **Zorunlu** çok adımlı profil formu: Şirket Bilgileri → Sektör/Kategori → Marka Kimliği
3. Şu an için ek bir onay adımı **yok** — form tamamlanınca doğrudan panele geçer (ileride influencer'daki gibi bir onay adımı eklenebilir, bu durumda önce bu dosya güncellenmeli)

> Her iki akışta da onboarding tamamlanmadan/onay verilmeden kullanıcı ana panele erişememeli. Route guard bu durumu kontrol etmeli.

### Admin Akışı
- Admin hesabı kayıt formu ile oluşturulmaz; Firestore'da `users/{uid}.role = "admin"` olarak manuel atanır.
- Admin girişinde onboarding/onay akışı yoktur, doğrudan admin paneline yönlendirilir.
- Admin paneli üzerinden yapılabilecek işlemler:
  - Bekleyen influencer profillerini onaylama/reddetme (`influencers.status`)
  - Aktif kampanya ve teklifleri izleme
  - Tamamlanan işbirlikleri için **komisyon oranını** belirleme/güncelleme ve ödeme akışını (marka → platform → influencer) takip etme
  - Kullanıcı (marka/influencer) hesaplarını askıya alma
  - Genel platform istatistiklerini görüntüleme (toplam işlem hacmi, komisyon geliri, aktif kullanıcı sayısı)

## 5. Veri Modeli (Firestore)

### `users`
```json
{ "uid": "string", "role": "brand | influencer", "email": "string", "createdAt": "timestamp" }
```

### `brands`
```json
{
  "uid": "string",
  "companyName": "string",
  "sector": "string",
  "categories": ["string"],
  "logoUrl": "string",
  "description": "string",
  "website": "string",
  "location": "string"
}
```

### `influencers`
```json
{
  "uid": "string",
  "displayName": "string",
  "bio": "string",
  "categories": ["string"],
  "profileImageUrl": "string",
  "location": "string",
  "socialAccounts": {
    "instagram": { "handle": "string", "followers": 0, "engagementRate": 0 },
    "tiktok": { "handle": "string", "followers": 0, "engagementRate": 0 },
    "youtube": { "handle": "string", "followers": 0 },
    "twitter": { "handle": "string", "followers": 0 }
  },
  "priceRange": { "min": 0, "max": 0 },
  "portfolio": ["string"],
  "status": "pending | approved | rejected"
}
```

### `campaigns`
```json
{
  "id": "string",
  "brandUid": "string",
  "title": "string",
  "description": "string",
  "category": "string",
  "targetAudience": { "ageRange": "string", "gender": "string", "location": "string" },
  "budgetRange": { "min": 0, "max": 0 },
  "campaignType": "post | story | reels | urun_gonderimi",
  "startDate": "timestamp",
  "endDate": "timestamp",
  "status": "active | closed",
  "createdAt": "timestamp"
}
```

### `matches`
```json
{
  "campaignId": "string",
  "influencerUid": "string",
  "score": 0,
  "reasoning": "string",
  "createdAt": "timestamp"
}
```

### `offers`
```json
{
  "campaignId": "string",
  "brandUid": "string",
  "influencerUid": "string",
  "status": "pending | accepted | rejected | negotiating",
  "message": "string",
  "proposedPrice": 0,
  "commissionRate": 0.1,
  "createdAt": "timestamp"
}
```

### `payments`
```json
{
  "id": "string",
  "offerId": "string",
  "campaignId": "string",
  "brandUid": "string",
  "influencerUid": "string",
  "grossAmount": 0,
  "commissionRate": 0.1,
  "commissionAmount": 0,
  "netAmountToInfluencer": 0,
  "status": "pending | paid_to_platform | paid_to_influencer | refunded",
  "createdAt": "timestamp",
  "paidAt": "timestamp"
}
```

> `commissionAmount = grossAmount * commissionRate`, `netAmountToInfluencer = grossAmount - commissionAmount`. Komisyon oranı varsayılan olarak platform genelinde sabit bir değer olabilir (örn. `%10`) ya da admin panelinden kampanya/işbirliği bazında override edilebilir — hangisi tercih edilirse `project.md` bu bölümden güncellenmeli.

## 6. Ana Özellikler (Panel Bazlı)

### Marka Paneli
- Dashboard (özet kartlar, son eşleşmeler)
- Kampanya oluşturma formu
- AI eşleşme sonuçları (skorlu influencer listesi + filtreleme)
- Teklif gönderme/takip
- Şirket profili düzenleme

### Influencer Paneli
- Dashboard (özet kartlar, uygun marka ihtiyaçları)
- Profil ve portfolyo yönetimi
- Gelen teklifler (kabul/red/pazarlık)
- Marka ihtiyaçları/eşleşme listesi

### Admin Paneli
- Dashboard: platform geneli istatistikler (toplam marka/influencer sayısı, aktif kampanya, toplam işlem hacmi, toplam komisyon geliri)
- Influencer onay kuyruğu: bekleyen profilleri inceleme, onaylama/reddetme
- Kullanıcı yönetimi: marka/influencer hesaplarını listeleme, detay görüntüleme, askıya alma
- Kampanya/teklif izleme: tüm platformdaki aktif ve geçmiş kampanya/teklifleri görüntüleme
- Ödeme & komisyon yönetimi: `payments` koleksiyonu üzerinden ödeme durumlarını takip etme, komisyon oranını görüntüleme/güncelleme, ödeme onaylama (marka → platform → influencer akışını işaretleme)

## 7. AI Eşleştirme Mantığı (Özet)

1. **Kural bazlı ön filtreleme**: kategori, bütçe, lokasyon uyumu (kod ile, AI'sız)
2. **Ağırlıklı skorlama**: kategori %40, bütçe %20, kitle %20, engagement/performans %20
3. **LLM gerekçelendirme**: filtrelenmiş kısa listeyi Cloud Function üzerinden Anthropic API'ye gönderip her influencer için doğal dilde kısa açıklama üretme

Uygulama detayı için `skills.md` → "AI Eşleştirme Cloud Function" bölümüne bak.

## 8. Yol Haritası (Fazlar)

1. Temel iskelet + mock veri (json-server) ile UI
2. Firebase entegrasyonu (Auth, Firestore, Security Rules)
3. Cloudinary görsel yükleme entegrasyonu
4. Panel fonksiyonları (kampanya, profil, teklif akışları)
5. AI eşleştirme (Cloud Function + Anthropic API)
6. Cilalama, deploy
7. (Opsiyonel) Instagram/TikTok API entegrasyonu, fraud detection, rating sistemi

## 9. Tasarım Sistemi (Özet)

- Light tema, pastel pembe (#FFD6E8) + limon sarısı (#FFF59D) blok renkleri
- Neon mor (#B026FF / #C77DFF) CTA/vurgu rengi + dekoratif radial blur arka plan
- Rounded-2xl/3xl kartlar, soft shadow, samimi yuvarlak sans-serif tipografi (Poppins/Quicksand/Nunito)
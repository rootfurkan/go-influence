# AGENTS.md — Kod Asistanı Talimatları

Bu dosya, bu repo üzerinde çalışan AI kod asistanları (Claude Code, Cursor, Copilot Agent vb.) için genel davranış kurallarını tanımlar. Kod üretirken/düzenlerken bu kurallara uy.

---

## 1. Proje Bağlamı

Bu proje bir **influencer-marka eşleştirme platformu**dur. Detaylı proje tanımı için `project.md`, teknik uygulama kalıpları için `skills.md` dosyasına bak. Herhangi bir kod değişikliği yapmadan önce bu iki dosyayı oku.

## 2. Genel Kurallar

- **Dil**: Kod içi değişken/fonksiyon isimleri İngilizce, kullanıcıya gösterilen metinler (UI strings) Türkçe olacak.
- **Teknoloji sınırları**: Bu projede backend olarak sadece **Firebase** (Auth, Firestore, Storage gereksinimi yoksa Cloudinary tercih edilir) kullanılıyor. Ayrı bir Node/Express backend **oluşturma**.
- **State yönetimi**: Tüm sunucu verisi (Firestore/Cloudinary) **RTK Query** üzerinden yönetilir. Component içinde doğrudan `fetch` veya Firebase SDK çağrısı yazma — bunun yerine ilgili `*Api.ts` dosyasına endpoint ekle.
- **Component yapısı**: Fonksiyonel component + hooks kullan. Class component yazma.
- **Stil**: Tailwind CSS class'ları kullan, inline style yazma (zorunlu dinamik değerler hariç).
- **Dosya boyutu**: Bir component dosyası ~200 satırı geçiyorsa, alt component'lere böl.

## 3. Admin Paneli ve Komisyon Kuralları

- Admin rolü kayıt formundan seçilemez; sadece Firestore'da manuel atanır. Kayıt/onboarding kodunda `role: "admin"` seçeneği **asla** UI'da gösterilmemeli.
- Komisyon hesaplaması (`commissionAmount`, `netAmountToInfluencer`) client tarafında değil, mümkünse Cloud Function içinde hesaplanmalı; client sadece görüntüler, hesaplamaz.
- Ödeme durumu (`payments.status`) değişiklikleri sadece admin rolündeki kullanıcı tarafından tetiklenebilir — bu kural Firestore Security Rules'da da yansıtılmalı.
- Admin panel route'ları, `role !== "admin"` olan kullanıcılar için tamamen erişilemez olmalı (guard + security rule ikisi birden).

## 4. Güvenlik Kuralları (KRİTİK)

- **Hiçbir API key'i** (Anthropic, Cloudinary secret, Firebase config hariç) frontend kodunda hardcode etme. `.env` dosyasından oku.
- Anthropic API çağrıları **sadece** Firebase Cloud Functions içinden yapılır, asla frontend'den doğrudan yapılmaz.
- Cloudinary yüklemeleri **unsigned upload preset** ile yapılır, API secret frontend'de kullanılmaz.
- Firestore Security Rules'u değiştirirken her zaman `role` (brand/influencer) kontrolünü koru, kuralları gevşetme.

## 5. Firebase Kullanım Kuralları

- Firestore koleksiyon isimleri ve alan adları `project.md`'deki veri modeliyle birebir uyumlu olmalı, keyfi yeni alan/koleksiyon ekleme; gerekirse önce `project.md`'yi güncelle.
- Firestore sorgularında gereksiz `getDocs(collection(...))` (tüm koleksiyonu çekme) kullanmaktan kaçın, mümkün olduğunca `where()` ile filtrelenmiş sorgu yaz.
- Yeni bir Cloud Function eklerken fonksiyonu `functions/` klasörü altında, mantıksal olarak gruplanmış dosyalarda tut (örn. `functions/matching/`, `functions/notifications/`).

## 6. Yeni Özellik Eklerken İzlenecek Sıra

1. `project.md`'de ilgili özelliğin tanımlı olup olmadığını kontrol et.
2. Veri modelinde değişiklik gerekiyorsa önce onu `project.md`'ye yansıt.
3. RTK Query endpoint'i ekle/güncelle (`skills.md`'deki Firebase baseQuery kalıbını kullan).
4. UI component'ini oluştur, mevcut tasarım sistemine (pastel pembe/limon sarısı/neon mor, rounded kartlar) sadık kal.
5. Firestore Security Rules gerekiyorsa güncelle.
6. Değişikliği küçük, tek amaçlı commit'ler halinde yap.

## 7. Yapılmaması Gerekenler

- localStorage/sessionStorage'a hassas veri (token, kullanıcı verisi) yazma.
- Marka ve influencer verilerini aynı component/slice içinde karıştırma — `features/brand` ve `features/influencer` ayrımını koru.
- Mock veriyi (json-server) production kodun içine gömülü bırakma; Firebase entegrasyonu tamamlandıktan sonra mock data path'lerini temizle.
- Onboarding tamamlanmadan kullanıcıyı ana panele yönlendirecek route/guard yazma (bkz. `project.md` — onay akışı).
- Komisyon oranını veya ödeme durumunu marka/influencer panelinden değiştirilebilir şekilde açık bırakma — bu yalnızca admin paneli üzerinden yapılabilir.

## 8. Belirsizlik Durumunda

Bir talimat veya özellik net değilse, varsayım yapıp ilerlemek yerine kısaca hangi varsayımı yaptığını belirt ve mevcut `project.md`/`skills.md` ile tutarlı en makul seçeneği uygula.
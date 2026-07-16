# Go Influence

Go Influence, markalar ile influencer/kreatifleri ayni platformda bulusturan bir influencer marketing panelidir. Sistem; marka kampanyasi olusturma, kategori bazli eslesme, teklif gonderme, basvuru alma, mesajlasma, admin onayi, kampanya ve odeme sureclerini tek bir Firebase tabanli uygulamada toplar.

## Projenin Amaci

Bu projenin temel amaci markalarin kampanya ihtiyaclarini veritabanina kaydedip, influencer profillerindeki ilgi alanlari ve hizmet kategorileriyle manuel olarak eslestirmektir. Influencer tarafinda yalnizca aktif, onayli ve profil gorunurlugu acik kullanicilar markalarin onune cikar. Kampanya suresi gecen ilanlar pasif kabul edilir ve influencer panelinde gorunmez.

Platform uc ana kullanici deneyimi uzerine kurulu:

- Marka paneli: kampanya olusturma/duzenleme, eslesen creatorlari goruntuleme, teklif gonderme, mesajlasma.
- Influencer paneli: profil/portfolyo/ayar yonetimi, marka ihtiyaclarini goruntuleme, kampanyaya basvurma, teklifleri kabul/reddetme, mesajlasma.
- Admin paneli: kullanici onaylari, kampanya/teklif takibi, odeme ve platform ayarlari.

## Kullanilan Teknolojiler

- React 19
- Vite 6
- Redux Toolkit
- React Redux
- React Router DOM
- Firebase Auth
- Firebase Firestore
- Firebase Storage
- Firebase Admin SDK
- Tailwind CSS 4
- Lucide React ikonlari
- Motion React animasyonlari

## Genel Mantik

Uygulama rol bazli calisir. Kullanici giris yaptiginda Firebase Auth ile kimlik dogrulanir, `users/{uid}` dokumanindan rol ve durum bilgisi okunur. Role gore ilgili panele yonlendirme yapilir.

Marka kampanya olusturdugunda kampanya `campaigns` koleksiyonuna kaydedilir. Ardindan sistem onayli ve gorunur influencer profillerini tarar, kampanya kategorileri ile influencer ilgi alanlari/hizmetleri arasinda manuel uyum skoru uretir ve sonucu `campaignMatches` koleksiyonuna yazar.

Influencer panelindeki Marka Ihtiyaclari sayfasi, kendi `campaignMatches` kayitlarini okur. Kullanici ayarlarindaki `minimumMatchScore` degeri, hangi minimum uyum oraninin gosterilecegini belirler.

## Eslesme Sistemi

Yapay zeka entegrasyonu projeden kaldirildi. Eslesme artik tamamen manuel kural bazlidir.

Eslesme motoru:

- Dosya: `src/utils/interestMatchingEngine.js`
- Kampanya kategorileri ile influencer kategorilerini karsilastirir.
- Kampanya icerik ihtiyaci ile influencer hizmetlerini karsilastirir.
- Skoru 0 olan eslesmeler ekranda gosterilmez.
- Eslesme nedenleri `reasons` alaninda saklanir.

Skor agirliklari:

- Kategori/ilgi alani uyumu: %70
- Icerik hizmeti uyumu: %30

## Firebase Veri Yapisi

Ana koleksiyonlar:

- `users`: kullanici rol, durum ve temel hesap bilgileri.
- `brands`: marka profil bilgileri.
- `influencers`: influencer profil, kategori, portfolyo, fiyat ve ayar bilgileri.
- `campaigns`: marka kampanyalari.
- `campaignMatches`: kampanya ve influencer eslesme kayitlari.
- `campaignOffers`: marka teklifleri ve influencer basvurulari.
- `chatThreads`: marka-influencer mesajlasma kayitlari.
- `transactions`: odeme/komisyon kayitlari.
- `settings`: platform genel ayarlari.

Firestore kurallari `firestore.rules` dosyasindadir. Kurallar genel olarak sunlari saglar:

- Kullanici kendi `users/{uid}` dokumanini okuyup guncelleyebilir.
- Admin tum temel kayitlari yonetebilir.
- Marka sadece kendi kampanyasini olusturup guncelleyebilir.
- Influencer sadece kendi adina basvuru yapabilir.
- Mesajlasma sadece thread katilimcilari tarafindan okunup guncellenebilir.

## Klasor Yapisi

```text
src/
  app/
    store.js                      Redux store kurulumu

  components/
    common/                       Ortak UI bilesenleri
    guards/                       Route guard ve rol kontrol katmani

  features/
    admin/                        Admin servisleri ve Redux slice
    auth/                         Auth servisleri, bootstrap ve auth slice
    brand/                        Marka panel Redux state'i
    influencer/                   Influencer panel Redux state'i
    landing/                      Landing state'i
    settings/                     Platform ayarlari

  pages/
    admin/                        Admin panel sayfalari
    auth/                         Onay bekleme vb. auth sayfalari
    brand/                        Marka paneli ve onboarding
    influencer/                   Influencer paneli ve onboarding
    landing/                      Public landing, login, register

  styles/
    admin.css
    brand.css
    influencer.css
    influencer-onboarding.css
    landing.css

  utils/
    campaignStatus.js             Kampanya aktif/pasif/suresi gecmis kontrolleri
    currency.js                   Para birimi yardimcilari
    firestoreSerializers.js       Firestore timestamp/data normalize islemleri
    interestMatchingEngine.js     Manuel kategori bazli eslesme motoru
```

## Kurulum

```bash
npm install
```

`.env` dosyasinda Firebase bilgileri bulunmalidir:

```env
VITE_FIREBASE_API_KEY=
VITE_FIREBASE_AUTH_DOMAIN=
VITE_FIREBASE_PROJECT_ID=
VITE_FIREBASE_STORAGE_BUCKET=
VITE_FIREBASE_MESSAGING_SENDER_ID=
VITE_FIREBASE_APP_ID=
```

## Calistirma

Gelistirme sunucusu:

```bash
npm run dev
```

Varsayilan adres:

```text
http://localhost:3001
```

Production build:

```bash
npm run build
```

Build sonucu `dist/` klasorune uretilir.

Preview:

```bash
npm run preview
```

## Demo Veri Uretimi

Demo marka, influencer, kampanya ve eslesme verilerini olusturmak icin:

```bash
npm run seed:demo-data
```

Seed influencer hesaplarini aktif/onayli hale getirmek icin:

```bash
npm run seed:activate-influencers
```

Seed scriptleri Firebase Admin SDK kullandigi icin `service-account.json` dosyasinin ve `.env` icindeki `FIREBASE_SERVICE_ACCOUNT_PATH` degerinin dogru olmasi gerekir.

## Firebase Rules Deploy

Firebase CLI ile Firestore rules deploy etmek icin:

```bash
firebase deploy --only firestore:rules --project go-influence
```

Aktif proje ayarlamak istenirse:

```bash
firebase use --add
```

## Panel Ozellikleri

### Marka Paneli

- Kampanya olusturma ve duzenleme
- Kampanya banner ekleme ve onizleme
- Kampanyalari DB'den listeleme
- Suresi gecen kampanyalari pasif/badge ile gosterme
- Kategori bazli creator eslesmelerini gorme
- Influencer'a teklif gonderme
- Teklifleri listeleme
- Mesajlasma

### Influencer Paneli

- Gercek DB profil bilgilerini okuma
- Marka ihtiyaclarini eslesme skoruna gore listeleme
- Filtreleri butonla uygulama
- Kampanya detaylarini gorme
- Kampanyaya basvurma
- Gelen teklifleri kabul/reddetme
- Mesajlasma
- Profil, portfolyo ve fiyat bilgilerini kaydetme
- Bildirim, para birimi, profil gorunurlugu ve minimum uyum filtresini DB'ye kaydetme
- Sifre degistirme ve otomatik cikis

### Admin Paneli

- Kullanici ve influencer onay surecleri
- Kampanya ve teklif takibi
- Platform ayarlari
- Komisyon/odeme kayitlari icin temel yapi

## Demo Hesaplar
Admin : furkan@go.com -> 123456
Marka Hesabı : brand1@seed.go-influence.local -> 123456
Influencer Hesabı : influencer1@seed.go-influence.local -> 123456


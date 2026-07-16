# SKILLS.md — Teknik Uygulama Kalıpları

Bu dosya, kod asistanının bu projede tekrar tekrar kullanacağı somut kod kalıplarını içerir. Yeni kod yazarken önce burada uygun bir kalıp olup olmadığını kontrol et, varsa onu temel al.

---

## 1. Firebase Kurulumu

```javascript
// src/firebaseConfig.js
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: import.meta.env.VITE_FIREBASE_APP_ID,
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);
```

> Tüm değerler `.env` dosyasından okunur, asla kod içine yazılmaz. `.env` dosyası `.gitignore`'da olmalı.

## 2. RTK Query — Firebase için Custom BaseQuery Kalıbı

```javascript
// app/api/baseApi.ts
import { createApi, fakeBaseQuery } from "@reduxjs/toolkit/query/react";

export const baseApi = createApi({
  reducerPath: "api",
  baseQuery: fakeBaseQuery(),
  tagTypes: ["Campaigns", "Influencers", "Brands", "Offers", "Matches"],
  endpoints: () => ({}),
});
```

```javascript
// app/api/campaignsApi.ts
import { baseApi } from "./baseApi";
import { collection, addDoc, getDocs, query, where } from "firebase/firestore";
import { db } from "../../firebaseConfig";

export const campaignsApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getCampaignsByBrand: builder.query({
      async queryFn(brandUid) {
        try {
          const q = query(
            collection(db, "campaigns"),
            where("brandUid", "==", brandUid),
          );
          const snapshot = await getDocs(q);
          const data = snapshot.docs.map((d) => ({ id: d.id, ...d.data() }));
          return { data };
        } catch (error) {
          return { error };
        }
      },
      providesTags: ["Campaigns"],
    }),
    createCampaign: builder.mutation({
      async queryFn(campaignData) {
        try {
          const docRef = await addDoc(
            collection(db, "campaigns"),
            campaignData,
          );
          return { data: { id: docRef.id, ...campaignData } };
        } catch (error) {
          return { error };
        }
      },
      invalidatesTags: ["Campaigns"],
    }),
  }),
});

export const { useGetCampaignsByBrandQuery, useCreateCampaignMutation } =
  campaignsApi;
```

**Kural**: Her yeni koleksiyon için ayrı bir `*Api.ts` dosyası oluştur (`brandsApi.ts`, `influencersApi.ts`, `offersApi.ts`, `matchesApi.ts`), hepsi `baseApi.injectEndpoints` ile genişletilir.

## 3. Firebase Authentication — Rol Bazlı Kayıt

```javascript
// features/auth/authService.js
import { createUserWithEmailAndPassword } from "firebase/auth";
import { doc, setDoc } from "firebase/firestore";
import { auth, db } from "../../firebaseConfig";

export async function registerUser(email, password, role) {
  const userCredential = await createUserWithEmailAndPassword(
    auth,
    email,
    password,
  );
  const uid = userCredential.user.uid;

  await setDoc(doc(db, "users", uid), {
    uid,
    role, // "brand" | "influencer"
    email,
    createdAt: new Date().toISOString(),
  });

  return uid;
}
```

## 4. Route Guard — Onboarding/Onay Kontrolü

```javascript
// components/guards/RequireOnboarding.jsx
import { Navigate } from "react-router-dom";
import { useSelector } from "react-redux";

export function RequireOnboarding({ children }) {
  const { role, onboardingComplete, status } = useSelector(
    (state) => state.auth,
  );

  if (!onboardingComplete) {
    return <Navigate to="/onboarding" replace />;
  }

  if (role === "influencer" && status !== "approved") {
    return <Navigate to="/pending-approval" replace />;
  }

  return children;
}
```

> Bu guard, panel route'larının etrafını sarmalı. Marka için `status` kontrolü şu an yok (bkz. `project.md` § 4), ileride eklenirse burada da güncellenmeli.

## 5. Cloudinary Görsel Yükleme

```javascript
// utils/uploadToCloudinary.js
export async function uploadImage(file) {
  const formData = new FormData();
  formData.append("file", file);
  formData.append(
    "upload_preset",
    import.meta.env.VITE_CLOUDINARY_UPLOAD_PRESET,
  );

  const res = await fetch(
    `https://api.cloudinary.com/v1_1/${import.meta.env.VITE_CLOUDINARY_CLOUD_NAME}/image/upload`,
    { method: "POST", body: formData },
  );

  if (!res.ok) throw new Error("Görsel yüklenemedi");

  const data = await res.json();
  return data.secure_url;
}
```

**Kural**: Yüklenen `secure_url`, ilgili RTK Query mutation'ı ile Firestore dokümanına yazılır (örn. `profileImageUrl`, `portfolio` array'i, `logoUrl`).

## 6. AI Eşleştirme Cloud Function

```javascript
// functions/matching/generateMatchReasoning.js
const functions = require("firebase-functions");

exports.generateMatchReasoning = functions.https.onCall(
  async (data, context) => {
    if (!context.auth) {
      throw new functions.https.HttpsError("unauthenticated", "Giriş gerekli");
    }

    const { campaign, shortlistedInfluencers } = data;

    const response = await fetch("https://api.anthropic.com/v1/messages", {
      method: "POST",
      headers: {
        "x-api-key": process.env.ANTHROPIC_API_KEY,
        "content-type": "application/json",
        "anthropic-version": "2023-06-01",
      },
      body: JSON.stringify({
        model: "claude-sonnet-4-6",
        max_tokens: 1000,
        messages: [
          {
            role: "user",
            content: `Kampanya: ${JSON.stringify(campaign)}
Influencer adayları: ${JSON.stringify(shortlistedInfluencers)}
Her influencer için 1-2 cümlelik, markaya neden uygun olduğunu açıklayan bir gerekçe üret. Sadece JSON formatında dön: [{"influencerId": "...", "reasoning": "..."}]`,
          },
        ],
      }),
    });

    const result = await response.json();
    return result;
  },
);
```

**Kural**: `ANTHROPIC_API_KEY`, Firebase Functions ortam değişkeni olarak (`firebase functions:config:set` veya `.env` — kullandığın Firebase SDK versiyonuna göre) saklanır, asla repoya commitlenmez.

## 7. Komisyon Hesaplama — Cloud Function

```javascript
// functions/payments/createPayment.js
const functions = require("firebase-functions");
const admin = require("firebase-admin");
const db = admin.firestore();

const DEFAULT_COMMISSION_RATE = 0.1; // %10 — platform genel varsayılanı

exports.createPayment = functions.https.onCall(async (data, context) => {
  if (!context.auth) {
    throw new functions.https.HttpsError("unauthenticated", "Giriş gerekli");
  }

  const { offerId, grossAmount, commissionRate } = data;
  const rate = commissionRate ?? DEFAULT_COMMISSION_RATE;
  const commissionAmount = Math.round(grossAmount * rate * 100) / 100;
  const netAmountToInfluencer = grossAmount - commissionAmount;

  const paymentRef = await db.collection("payments").add({
    offerId,
    grossAmount,
    commissionRate: rate,
    commissionAmount,
    netAmountToInfluencer,
    status: "pending",
    createdAt: admin.firestore.FieldValue.serverTimestamp(),
  });

  return { paymentId: paymentRef.id, commissionAmount, netAmountToInfluencer };
});
```

> **Kural**: Komisyon hesaplaması burada, yani sunucu tarafında yapılır. Client sadece `grossAmount` ve (opsiyonel) admin tarafından belirlenmiş `commissionRate`'i gönderir, sonucu hesaplamaz.

## 7.1 Admin Onay/Ödeme İşlemleri — Firestore Güncelleme Kalıbı

```javascript
// features/admin/adminActions.js
import { doc, updateDoc } from "firebase/firestore";
import { db } from "../../firebaseConfig";

export async function approveInfluencer(influencerUid) {
  await updateDoc(doc(db, "influencers", influencerUid), {
    status: "approved",
  });
}

export async function markPaymentAsPaid(paymentId, nextStatus) {
  // nextStatus: "paid_to_platform" | "paid_to_influencer" | "refunded"
  await updateDoc(doc(db, "payments", paymentId), {
    status: nextStatus,
    paidAt: new Date().toISOString(),
  });
}
```

## 8. Kural Bazlı Ön Filtreleme (Skorlama Öncesi)

```javascript
// utils/matchingRules.js
export function preFilterInfluencers(campaign, influencers) {
  return influencers.filter(
    (inf) =>
      inf.status === "approved" &&
      inf.categories.includes(campaign.category) &&
      inf.priceRange.min <= campaign.budgetRange.max &&
      (campaign.targetAudience.location === "any" ||
        inf.location === campaign.targetAudience.location),
  );
}

export function scoreInfluencer(campaign, influencer) {
  let score = 0;
  if (influencer.categories.includes(campaign.category)) score += 40;
  if (influencer.priceRange.min <= campaign.budgetRange.max) score += 20;
  if (influencer.location === campaign.targetAudience.location) score += 20;
  score += Math.min(
    influencer.socialAccounts?.instagram?.engagementRate ?? 0,
    20,
  );
  return score;
}
```

## 9. Firestore Security Rules — Temel Kalıp

```
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {

    match /users/{userId} {
      allow read: if request.auth.uid == userId;
      allow write: if request.auth.uid == userId;
    }

    match /campaigns/{campaignId} {
      allow read: if request.auth != null;
      allow write: if request.auth.uid == resource.data.brandUid;
      allow create: if request.auth.uid == request.resource.data.brandUid;
    }

    match /influencers/{influencerId} {
      allow read: if request.auth != null;
      allow write: if request.auth.uid == influencerId;
    }

    match /offers/{offerId} {
      allow read: if request.auth.uid == resource.data.brandUid ||
                     request.auth.uid == resource.data.influencerUid ||
                     get(/databases/$(database)/documents/users/$(request.auth.uid)).data.role == 'admin';
      allow write: if request.auth.uid == resource.data.brandUid ||
                      request.auth.uid == resource.data.influencerUid;
    }

    match /payments/{paymentId} {
      allow read: if request.auth.uid == resource.data.brandUid ||
                     request.auth.uid == resource.data.influencerUid ||
                     get(/databases/$(database)/documents/users/$(request.auth.uid)).data.role == 'admin';
      // Ödeme durumu sadece admin tarafından değiştirilebilir
      allow write: if get(/databases/$(database)/documents/users/$(request.auth.uid)).data.role == 'admin';
    }
  }
}
```

## 10. Klasör Yapısı Referansı

```
src/
  app/
    store.ts
    api/
      baseApi.ts
      brandsApi.ts
      influencersApi.ts
      campaignsApi.ts
      offersApi.ts
      matchesApi.ts
      paymentsApi.ts
  features/
    auth/
    brand/
    influencer/
    admin/
  components/
    ui/
    guards/
  utils/
    uploadToCloudinary.js
    matchingRules.js
  pages/
functions/
  matching/
    generateMatchReasoning.js
  payments/
    createPayment.js
```

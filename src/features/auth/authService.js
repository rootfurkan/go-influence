import {
  createUserWithEmailAndPassword,
  browserLocalPersistence,
  EmailAuthProvider,
  onAuthStateChanged,
  reauthenticateWithCredential,
  setPersistence,
  signInWithEmailAndPassword,
  signOut,
  updatePassword,
} from 'firebase/auth';
import {
  doc,
  getDoc,
  onSnapshot,
  serverTimestamp,
  setDoc,
  updateDoc,
} from 'firebase/firestore';
import { auth, db } from '../../firebaseConfig';
import { serializeFirestoreData } from '../../utils/firestoreSerializers';

const roleMap = {
  marka: 'brand',
  brand: 'brand',
  creator: 'influencer',
  influencer: 'influencer',
};

export function normalizeRole(role) {
  return roleMap[role] || 'brand';
}

export async function registerUser({ email, password, role, displayName }) {
  await setPersistence(auth, browserLocalPersistence);
  const normalizedRole = normalizeRole(role);
  const userCredential = await createUserWithEmailAndPassword(auth, email, password);
  const { uid } = userCredential.user;

  const userDoc = {
    uid,
    email,
    displayName,
    role: normalizedRole,
    onboardingComplete: false,
    status: 'active',
    createdAt: serverTimestamp(),
    updatedAt: serverTimestamp(),
  };

  await setDoc(doc(db, 'users', uid), userDoc);

  return {
    ...userDoc,
    createdAt: null,
    updatedAt: null,
  };
}

export async function loginUser({ email, password }) {
  await setPersistence(auth, browserLocalPersistence);
  const userCredential = await signInWithEmailAndPassword(auth, email, password);
  return getUserProfile(userCredential.user.uid);
}

export async function logoutUser() {
  await signOut(auth);
}

export async function changeCurrentUserPassword({ currentPassword, newPassword }) {
  const currentUser = auth.currentUser;
  if (!currentUser?.email) {
    throw new Error('Oturum bilgisi bulunamadı.');
  }

  const credential = EmailAuthProvider.credential(currentUser.email, currentPassword);
  await reauthenticateWithCredential(currentUser, credential);
  await updatePassword(currentUser, newPassword);
  try {
    await Promise.all([
      setDoc(doc(db, 'users', currentUser.uid), {
        passwordUpdatedAt: serverTimestamp(),
        updatedAt: serverTimestamp(),
      }, { merge: true }),
      setDoc(doc(db, 'influencers', currentUser.uid), {
        passwordUpdatedAt: serverTimestamp(),
        updatedAt: serverTimestamp(),
      }, { merge: true }),
    ]);
  } catch (error) {
    console.warn('Password audit timestamp could not be saved.', error);
  }
  await signOut(auth);
}

export function subscribeToAuthChanges(callback) {
  let unsubscribeProfile = null;

  const unsubscribeAuth = onAuthStateChanged(auth, async (firebaseUser) => {
    if (unsubscribeProfile) {
      unsubscribeProfile();
      unsubscribeProfile = null;
    }

    if (!firebaseUser) {
      callback({ firebaseUser: null, profile: null });
      return;
    }

    unsubscribeProfile = onSnapshot(doc(db, 'users', firebaseUser.uid), (snapshot) => {
      callback({
        firebaseUser,
        profile: snapshot.exists() ? serializeFirestoreData(snapshot.data()) : null,
      });
    });
  });

  return () => {
    if (unsubscribeProfile) unsubscribeProfile();
    unsubscribeAuth();
  };
}

export async function getUserProfile(uid) {
  const snapshot = await getDoc(doc(db, 'users', uid));
  if (!snapshot.exists()) return null;
  return serializeFirestoreData(snapshot.data());
}

export async function getInfluencerProfile(uid) {
  const snapshot = await getDoc(doc(db, 'influencers', uid));
  if (!snapshot.exists()) return null;
  return serializeFirestoreData(snapshot.data());
}

export function subscribeToInfluencerProfile(uid, callback, onError) {
  if (!uid) {
    callback(null);
    return () => {};
  }

  return onSnapshot(
    doc(db, 'influencers', uid),
    (snapshot) => {
      callback(snapshot.exists() ? serializeFirestoreData(snapshot.data()) : null);
    },
    onError,
  );
}

export async function updateInfluencerProfile(uid, profile) {
  const displayName = profile.displayName || '';
  const payload = {
    displayName,
    bio: profile.bio || '',
    location: profile.location || '',
    categories: profile.categories || [],
    profileImageUrl: profile.profileImageUrl || '',
    socialAccounts: profile.socialAccounts || {},
    pricing: profile.pricing || {},
    portfolio: profile.portfolio || [],
    updatedAt: serverTimestamp(),
  };

  await setDoc(doc(db, 'influencers', uid), payload, { merge: true });

  if (displayName) {
    await updateDoc(doc(db, 'users', uid), {
      displayName,
      updatedAt: serverTimestamp(),
    });
  }

  return {
    ...payload,
    updatedAt: new Date().toISOString(),
  };
}

export async function updateInfluencerSettings(uid, settings) {
  const normalizedSettings = {
    emailNotifications: Boolean(settings.emailNotifications),
    pushNotifications: Boolean(settings.pushNotifications),
    minimumMatchScore: Number(settings.minimumMatchScore ?? 80),
    currencyPreference: settings.currencyPreference || 'TRY',
    profileVisibility: settings.profileVisibility !== false,
  };

  await setDoc(
    doc(db, 'influencers', uid),
    {
      settings: normalizedSettings,
      profileVisibility: normalizedSettings.profileVisibility,
      updatedAt: serverTimestamp(),
    },
    { merge: true },
  );

  return normalizedSettings;
}

export async function completeBrandOnboarding(uid, profile) {
  await setDoc(
    doc(db, 'brands', uid),
    {
      uid,
      companyName: profile.name || '',
      sector: profile.sector || '',
      categories: profile.categories || [],
      logoUrl: profile.logoUrl || '',
      description: profile.description || '',
      website: profile.website || '',
      location: profile.location || '',
      primaryColor: profile.primaryColor || '#9000D7',
      updatedAt: serverTimestamp(),
    },
    { merge: true },
  );

  await updateDoc(doc(db, 'users', uid), {
    onboardingComplete: true,
    status: 'active',
    updatedAt: serverTimestamp(),
  });
}

export async function completeInfluencerOnboarding(uid, profile) {
  await setDoc(
    doc(db, 'influencers', uid),
    {
      uid,
      displayName: profile.displayName || '',
      bio: profile.bio || '',
      categories: profile.interests || [],
      profileImageUrl: profile.profileImage || '',
      location: profile.location || '',
      socialAccounts: profile.socials || {},
      pricing: profile.pricing || {},
      priceRange: extractInfluencerPriceRange(profile.pricing),
      portfolio: profile.portfolio || [],
      profileVisibility: true,
      settings: {
        emailNotifications: true,
        pushNotifications: true,
        minimumMatchScore: 80,
        currencyPreference: normalizeCurrencyPreference(profile.currency),
        profileVisibility: true,
      },
      status: 'pending',
      updatedAt: serverTimestamp(),
    },
    { merge: true },
  );

  await updateDoc(doc(db, 'users', uid), {
    onboardingComplete: true,
    status: 'pending',
    updatedAt: serverTimestamp(),
  });
}

function extractInfluencerPriceRange(pricing = {}) {
  const values = Object.values(pricing)
    .flatMap((item) => [Number(item?.min), Number(item?.max)])
    .filter((value) => Number.isFinite(value) && value > 0);

  if (!values.length) return { min: 0, max: 0 };

  return {
    min: Math.min(...values),
    max: Math.max(...values),
  };
}

function normalizeCurrencyPreference(currency) {
  if (currency === '$' || currency === 'USD') return 'USD';
  if (currency === '€' || currency === 'EUR') return 'EUR';
  return 'TRY';
}

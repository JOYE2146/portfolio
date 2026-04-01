import type { FirebaseOptions } from "firebase/app";

/**
 * True when required web SDK keys are present (non-empty). When false, the app uses
 * static data and skips Firestore/Auth init — no thrown errors on the home page.
 */
export function isFirebaseConfigured(): boolean {
  const apiKey = String(import.meta.env.VITE_FIREBASE_API_KEY ?? "").trim();
  const projectId = String(import.meta.env.VITE_FIREBASE_PROJECT_ID ?? "").trim();
  return Boolean(apiKey && projectId);
}

/**
 * Firebase client config from Vite env (prefix VITE_).
 * Never hardcode keys in source — copy values from Firebase Console → Project settings → Your apps.
 * @throws if {@link isFirebaseConfigured} is false — call that first for optional Firebase.
 */
export function getFirebaseOptions(): FirebaseOptions {
  const {
    VITE_FIREBASE_API_KEY,
    VITE_FIREBASE_AUTH_DOMAIN,
    VITE_FIREBASE_PROJECT_ID,
    VITE_FIREBASE_STORAGE_BUCKET,
    VITE_FIREBASE_MESSAGING_SENDER_ID,
    VITE_FIREBASE_APP_ID,
    VITE_FIREBASE_MEASUREMENT_ID,
  } = import.meta.env;

  if (!isFirebaseConfigured()) {
    throw new Error(
      "Firebase is not configured. Copy frontend/.env.example to .env and set VITE_FIREBASE_API_KEY and VITE_FIREBASE_PROJECT_ID."
    );
  }

  return {
    apiKey: VITE_FIREBASE_API_KEY,
    authDomain: VITE_FIREBASE_AUTH_DOMAIN,
    projectId: VITE_FIREBASE_PROJECT_ID,
    storageBucket: VITE_FIREBASE_STORAGE_BUCKET,
    messagingSenderId: VITE_FIREBASE_MESSAGING_SENDER_ID,
    appId: VITE_FIREBASE_APP_ID,
    ...(VITE_FIREBASE_MEASUREMENT_ID
      ? { measurementId: VITE_FIREBASE_MEASUREMENT_ID }
      : {}),
  };
}

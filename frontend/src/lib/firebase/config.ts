import type { FirebaseOptions } from "firebase/app";

/**
 * Firebase client config from Vite env (prefix VITE_).
 * Never hardcode keys in source — copy values from Firebase Console → Project settings → Your apps.
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

  if (!VITE_FIREBASE_API_KEY || !VITE_FIREBASE_PROJECT_ID) {
    throw new Error(
      "Missing Firebase env vars. Create frontend/.env from .env.example and add your web app config."
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

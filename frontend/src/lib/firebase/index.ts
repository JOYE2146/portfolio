import { getApp, getApps, initializeApp, type FirebaseApp } from "firebase/app";
import { getAnalytics, isSupported, type Analytics } from "firebase/analytics";
import { getAuth, type Auth } from "firebase/auth";
import { getFirestore, type Firestore } from "firebase/firestore";
import { getFirebaseOptions } from "./config";

let app: FirebaseApp | null = null;

/** Singleton Firebase app (safe with Vite HMR: reuses existing instance). */
export function getFirebaseApp(): FirebaseApp {
  if (app) return app;
  const options = getFirebaseOptions();
  if (getApps().length > 0) {
    app = getApp();
    return app;
  }
  app = initializeApp(options);
  return app;
}

/** Firestore — enable in Firebase Console → Build → Firestore Database. */
export function getFirebaseDb(): Firestore {
  return getFirestore(getFirebaseApp());
}

/** Auth — enable sign-in methods in Firebase Console → Build → Authentication. */
export function getFirebaseAuth(): Auth {
  return getAuth(getFirebaseApp());
}

let analyticsPromise: Promise<Analytics | null> | null = null;

/**
 * Analytics only runs in the browser and when supported (not in some privacy modes).
 * Call once after the app mounts (e.g. from App.tsx).
 */
export function initFirebaseAnalytics(): Promise<Analytics | null> {
  if (typeof window === "undefined") return Promise.resolve(null);
  if (analyticsPromise) return analyticsPromise;

  analyticsPromise = (async () => {
    const supported = await isSupported().catch(() => false);
    if (!supported) return null;
    const options = getFirebaseOptions();
    if (!options.measurementId) return null;
    return getAnalytics(getFirebaseApp());
  })();

  return analyticsPromise;
}

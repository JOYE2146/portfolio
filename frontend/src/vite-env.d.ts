/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_FIREBASE_API_KEY: string;
  readonly VITE_FIREBASE_AUTH_DOMAIN: string;
  readonly VITE_FIREBASE_PROJECT_ID: string;
  readonly VITE_FIREBASE_STORAGE_BUCKET: string;
  readonly VITE_FIREBASE_MESSAGING_SENDER_ID: string;
  readonly VITE_FIREBASE_APP_ID: string;
  /** Optional — enables Firebase Analytics when set */
  readonly VITE_FIREBASE_MEASUREMENT_ID?: string;
  /** Optional — canonical URLs for SEO (e.g. https://yoursite.com) */
  readonly VITE_PUBLIC_SITE_URL?: string;
  /** Optional — full LinkedIn profile URL */
  readonly VITE_LINKEDIN_URL?: string;
  /** Optional — EmailJS (https://www.emailjs.com/docs/) */
  readonly VITE_EMAILJS_SERVICE_ID?: string;
  readonly VITE_EMAILJS_TEMPLATE_ID?: string;
  readonly VITE_EMAILJS_PUBLIC_KEY?: string;
  /** Optional — Plausible Analytics domain as registered in Plausible (manual SPA pageviews) */
  readonly VITE_PLAUSIBLE_DOMAIN?: string;
  /** Optional — standalone GA4 measurement ID (G-…) when not using Firebase Analytics */
  readonly VITE_GA_MEASUREMENT_ID?: string;
  /** Optional — default Open Graph / Twitter image (absolute URL or site path e.g. /og.png) */
  readonly VITE_OG_IMAGE_URL?: string;
  /** Optional — Twitter @handle for twitter:site meta */
  readonly VITE_TWITTER_SITE?: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}

import { getFirebaseApp, isFirebaseConfigured } from "@/lib/firebase";
import { useEffect, useRef } from "react";
import { useLocation } from "react-router-dom";

declare global {
  interface Window {
    plausible?: ((event: string, options?: Record<string, unknown>) => void) & { q?: unknown[][] };
    dataLayer?: unknown[];
    gtag?: (...args: unknown[]) => void;
  }
}

/** Plausible manual mode: queue pageviews until the script loads. */
function ensurePlausibleQueue() {
  if (typeof window === "undefined") return;
  if (window.plausible) return;
  const stub = ((...args: unknown[]) => {
    stub.q!.push(args);
  }) as ((...args: unknown[]) => void) & { q: unknown[][] };
  stub.q = [];
  window.plausible = stub as Window["plausible"];
}

function injectPlausibleManual(domain: string) {
  if (document.querySelector('script[src="https://plausible.io/js/script.manual.js"]')) return;
  const s = document.createElement("script");
  s.defer = true;
  s.dataset.domain = domain;
  s.src = "https://plausible.io/js/script.manual.js";
  document.head.appendChild(s);
}

function injectGtag(measurementId: string) {
  const existing = document.querySelector(`script[src*="googletagmanager.com/gtag/js"]`);
  if (existing) return;

  window.dataLayer = window.dataLayer || [];
  window.gtag = function gtag(...args: unknown[]) {
    window.dataLayer!.push(args);
  };

  const gtagScript = document.createElement("script");
  gtagScript.async = true;
  gtagScript.src = `https://www.googletagmanager.com/gtag/js?id=${encodeURIComponent(measurementId)}`;
  gtagScript.onload = () => {
    window.gtag?.("js", new Date());
    window.gtag?.("config", measurementId, { send_page_view: false });
  };
  document.head.appendChild(gtagScript);
}

/**
 * Loads Plausible (manual pageviews), standalone GA4 (gtag), and/or logs SPA
 * `page_view` to Firebase Analytics when a measurement ID is configured.
 */
export function RouteAnalytics() {
  const location = useLocation();
  const plausibleDomain = import.meta.env.VITE_PLAUSIBLE_DOMAIN?.trim();
  const standaloneGaId = import.meta.env.VITE_GA_MEASUREMENT_ID?.trim();
  const firebaseMeasurementId = String(import.meta.env.VITE_FIREBASE_MEASUREMENT_ID ?? "").trim();
  const scriptsReady = useRef(false);

  useEffect(() => {
    if (scriptsReady.current) return;
    scriptsReady.current = true;

    const plausible = import.meta.env.VITE_PLAUSIBLE_DOMAIN?.trim();
    const gaId = import.meta.env.VITE_GA_MEASUREMENT_ID?.trim();
    const firebaseMid = String(import.meta.env.VITE_FIREBASE_MEASUREMENT_ID ?? "").trim();

    if (plausible) {
      ensurePlausibleQueue();
      injectPlausibleManual(plausible);
      return;
    }

    if (gaId && !firebaseMid) {
      injectGtag(gaId);
    }
  }, []);

  useEffect(() => {
    const path = `${location.pathname}${location.search}`;
    const title = typeof document !== "undefined" ? document.title : "";

    if (plausibleDomain) {
      window.plausible?.("pageview");
    }

    if (standaloneGaId && !plausibleDomain && !firebaseMeasurementId) {
      window.gtag?.("config", standaloneGaId, {
        page_path: path,
        page_title: title,
      });
    }

    if (firebaseMeasurementId && isFirebaseConfigured()) {
      void (async () => {
        try {
          const { getAnalytics, isSupported, logEvent } = await import("firebase/analytics");
          const ok = await isSupported().catch(() => false);
          if (!ok) return;
          const analytics = getAnalytics(getFirebaseApp());
          logEvent(analytics, "page_view", {
            page_path: path,
            page_title: title,
            page_location: typeof window !== "undefined" ? window.location.href : path,
          });
        } catch {
          /* analytics unavailable (no measurement ID, privacy mode, etc.) */
        }
      })();
    }
  }, [
    location.pathname,
    location.search,
    plausibleDomain,
    standaloneGaId,
    firebaseMeasurementId,
  ]);

  return null;
}

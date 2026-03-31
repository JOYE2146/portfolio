import { useEffect, useState } from "react";
import { getFirebaseApp, initFirebaseAnalytics } from "@/lib/firebase";

type Status = "loading" | "ok" | "error";

export function FirebaseStatus() {
  const [status, setStatus] = useState<Status>("loading");
  const [analytics, setAnalytics] = useState<"on" | "off" | "unsupported">("off");
  const [message, setMessage] = useState("");

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const fb = getFirebaseApp();
        const a = await initFirebaseAnalytics();
        if (cancelled) return;
        setStatus("ok");
        setMessage(fb.options.projectId ?? "");
        setAnalytics(a ? "on" : "unsupported");
      } catch (e) {
        if (cancelled) return;
        setStatus("error");
        setMessage(e instanceof Error ? e.message : "Firebase init failed");
      }
    })();
    return () => {
      cancelled = true;
    };
  }, []);

  if (status === "loading") {
    return (
      <p className="firebase-status firebase-status--loading" role="status">
        Connecting to Firebase…
      </p>
    );
  }

  if (status === "error") {
    return (
      <p className="firebase-status firebase-status--error" role="alert">
        {message}
      </p>
    );
  }

  return (
    <p className="firebase-status firebase-status--ok" role="status">
      Firebase: <strong>{message}</strong>
      {" · "}
      Analytics:{" "}
      <strong>
        {analytics === "on" ? "active" : analytics === "unsupported" ? "unavailable" : "off"}
      </strong>
    </p>
  );
}

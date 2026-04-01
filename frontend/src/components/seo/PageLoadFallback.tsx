/**
 * Shown while lazy route chunks load — short, accessible, matches site chrome.
 */
export function PageLoadFallback() {
  return (
    <div
      className="flex min-h-[min(50vh,28rem)] flex-col items-center justify-center gap-4 px-6 py-16"
      role="status"
      aria-live="polite"
      aria-busy="true"
    >
      <div
        className="h-9 w-9 animate-spin rounded-full border-2 border-accent/30 border-t-accent"
        aria-hidden
      />
      <p className="text-sm font-medium text-muted">Loading page…</p>
    </div>
  );
}

/**
 * First focusable control for keyboard users — jumps past chrome to #main-content.
 */
export function SkipLink() {
  return (
    <a
      href="#main-content"
      className={[
        "sr-only focus:not-sr-only",
        "focus:fixed focus:left-4 focus:top-4 focus:z-[100]",
        "focus:rounded-md focus:bg-elevated focus:px-4 focus:py-3",
        "focus:text-foreground focus:shadow-lg focus:outline focus:outline-2 focus:outline-accent",
      ].join(" ")}
    >
      Skip to main content
    </a>
  );
}

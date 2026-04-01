import { useTheme } from "@/hooks/theme";
import { useCallback, useId, type KeyboardEvent } from "react";

const labels: Record<string, string> = {
  light: "Light theme",
  dark: "Dark theme",
  system: "Match system theme",
};

/**
 * Cycles light → dark → system. Single control keeps toolbar compact;
 * for a menu with three explicit options, swap to a disclosure pattern.
 */
export function ThemeToggle() {
  const { preference, cyclePreference } = useTheme();
  const labelId = useId();

  const onKeyDown = useCallback(
    (e: KeyboardEvent<HTMLButtonElement>) => {
      if (e.key === " " || e.key === "Enter") {
        e.preventDefault();
        cyclePreference();
      }
    },
    [cyclePreference]
  );

  return (
    <div className="flex items-center gap-2">
      <span id={labelId} className="sr-only">
        Color theme
      </span>
      <button
        type="button"
        aria-labelledby={labelId}
        aria-label={`Theme: ${labels[preference]}. Click to change.`}
        onClick={cyclePreference}
        onKeyDown={onKeyDown}
        className={[
          "inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-md border border-border",
          "bg-elevated text-foreground shadow-sm transition-colors",
          "hover:bg-background hover:text-accent",
          "focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent",
        ].join(" ")}
      >
        <span aria-hidden className="text-lg leading-none">
          {preference === "light" ? "☀" : preference === "dark" ? "☾" : "◐"}
        </span>
      </button>
      <span
        className="hidden text-xs text-muted sm:inline"
        aria-hidden
      >
        {preference}
      </span>
    </div>
  );
}

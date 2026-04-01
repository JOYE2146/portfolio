import {
  createContext,
  createElement,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";

/**
 * No JSX in this file: `tsconfig` uses `erasableSyntaxOnly`, and `.ts` must not
 * contain JSX (use `createElement` or rename to `.tsx` without erasable conflicts).
 */
/** Keep identical to the inline script in index.html */
export const THEME_STORAGE_KEY = "portfolio-theme-preference";

export type ThemePreference = "light" | "dark" | "system";

function getSystemIsDark(): boolean {
  return window.matchMedia("(prefers-color-scheme: dark)").matches;
}

export function applyThemeClass(preference: ThemePreference): void {
  const root = document.documentElement;
  const dark =
    preference === "dark" || (preference === "system" && getSystemIsDark());
  root.classList.toggle("dark", dark);
}

function readStoredPreference(): ThemePreference {
  try {
    const v = localStorage.getItem(THEME_STORAGE_KEY);
    if (v === "light" || v === "dark" || v === "system") return v;
  } catch {
    /* private mode */
  }
  return "system";
}

export type ThemeContextValue = {
  preference: ThemePreference;
  resolvedTheme: "light" | "dark";
  setPreference: (p: ThemePreference) => void;
  cyclePreference: () => void;
};

const ThemeContext = createContext<ThemeContextValue | null>(null);

export function ThemeProvider({ children }: { children: ReactNode }) {
  const [preference, setPreferenceState] = useState<ThemePreference>(readStoredPreference);
  /** Bumps when OS theme changes while preference === "system" so resolvedTheme recomputes */
  const [systemTick, setSystemTick] = useState(0);

  const resolvedTheme: "light" | "dark" = useMemo(() => {
    if (preference === "system") return getSystemIsDark() ? "dark" : "light";
    return preference;
  }, [preference, systemTick]);

  const setPreference = useCallback((next: ThemePreference) => {
    try {
      localStorage.setItem(THEME_STORAGE_KEY, next);
    } catch {
      /* ignore */
    }
    setPreferenceState(next);
  }, []);

  const cyclePreference = useCallback(() => {
    const order: ThemePreference[] = ["light", "dark", "system"];
    const next = order[(order.indexOf(preference) + 1) % order.length]!;
    setPreference(next);
  }, [preference, setPreference]);

  useEffect(() => {
    applyThemeClass(preference);
  }, [preference]);

  useEffect(() => {
    const onStorage = (e: StorageEvent) => {
      if (e.key === THEME_STORAGE_KEY || e.key === null) {
        setPreferenceState(readStoredPreference());
      }
    };
    window.addEventListener("storage", onStorage);
    return () => window.removeEventListener("storage", onStorage);
  }, []);

  useEffect(() => {
    if (preference !== "system") return;
    const mq = window.matchMedia("(prefers-color-scheme: dark)");
    const onChange = () => {
      applyThemeClass("system");
      setSystemTick((t) => t + 1);
    };
    mq.addEventListener("change", onChange);
    return () => mq.removeEventListener("change", onChange);
  }, [preference]);

  const value = useMemo(
    () => ({
      preference,
      resolvedTheme,
      setPreference,
      cyclePreference,
    }),
    [preference, resolvedTheme, setPreference, cyclePreference]
  );

  return createElement(ThemeContext.Provider, { value }, children);
}

export function useTheme(): ThemeContextValue {
  const ctx = useContext(ThemeContext);
  if (!ctx) {
    throw new Error("useTheme must be used within ThemeProvider");
  }
  return ctx;
}

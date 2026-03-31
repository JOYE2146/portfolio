/** Join class names; omit false/null/undefined (no dependency version of clsx). */
export function cn(
  ...parts: Array<string | number | false | null | undefined>
): string {
  return parts.filter((p) => p != null && p !== false && p !== "").join(" ");
}

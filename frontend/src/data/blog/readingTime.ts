/** ~200 words per minute for technical prose */
const WPM = 200;

export function estimateReadingTimeMinutes(markdownBody: string): number {
  const text = markdownBody.replace(/```[\s\S]*?```/g, " ").replace(/[#>*_[\]`(-]/g, " ");
  const words = text.trim().split(/\s+/).filter(Boolean).length;
  return Math.max(1, Math.round(words / WPM));
}

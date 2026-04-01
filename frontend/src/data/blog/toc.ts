import Slugger from "github-slugger";
import type { TocItem } from "./types";

/**
 * Aligns with `rehype-slug` (GitHub-style heading ids) for in-page anchors.
 */
export function buildTocFromMarkdown(markdown: string): TocItem[] {
  const slugger = new Slugger();
  const toc: TocItem[] = [];
  const lines = markdown.split(/\r?\n/);
  for (const line of lines) {
    const trimmed = line.trim();
    const m = /^(#{2,3})\s+(.+)$/.exec(trimmed);
    if (!m) continue;
    const depth = m[1].length as 2 | 3;
    if (depth !== 2 && depth !== 3) continue;
    const text = m[2].replace(/\s+#+\s*$/, "").trim();
    if (!text) continue;
    toc.push({ id: slugger.slug(text), text, depth });
  }
  return toc;
}

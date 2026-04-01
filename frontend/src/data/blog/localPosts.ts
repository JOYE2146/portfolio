import { parse as parseYaml } from "yaml";
import type { ContentKind, LoadedPost, PostFrontmatter } from "./types";
import { estimateReadingTimeMinutes } from "./readingTime";

type RawModules = Record<string, string>;

function slugFromPath(path: string): string {
  const base = path.split("/").pop() ?? "";
  return base.replace(/\.md$/i, "");
}

function splitFrontmatter(raw: string): { yamlBlock: string | null; body: string } {
  const text = raw.replace(/^\uFEFF/, "");
  const m = /^---\r?\n([\s\S]*?)\r?\n---\r?\n?([\s\S]*)$/.exec(text);
  if (!m) return { yamlBlock: null, body: text };
  return { yamlBlock: m[1] ?? null, body: m[2] ?? "" };
}

function parseMarkdownDocument(raw: string): { data: unknown; content: string } {
  const { yamlBlock, body } = splitFrontmatter(raw);
  if (!yamlBlock) return { data: {}, content: body };
  try {
    return { data: parseYaml(yamlBlock), content: body };
  } catch {
    return { data: {}, content: body };
  }
}

function parseModules(modules: RawModules, defaultType: ContentKind): LoadedPost[] {
  const out: LoadedPost[] = [];
  const isProd = import.meta.env.PROD;

  for (const [path, raw] of Object.entries(modules)) {
    const { data, content } = parseMarkdownDocument(raw);
    const fm = data as Partial<PostFrontmatter>;
    if (isProd && fm.draft) continue;

    const title = String(fm.title ?? "").trim();
    const date = String(fm.date ?? "").trim();
    const summary = String(fm.summary ?? "").trim();
    const tags = Array.isArray(fm.tags) ? fm.tags.map((t) => String(t)) : [];
    const type = fm.type === "case-study" || fm.type === "blog" ? fm.type : defaultType;

    if (!title || !date || !summary) continue;

    const slug = String(fm.slug ?? "").trim() || slugFromPath(path);
    const readingTimeMinutes =
      typeof fm.readingTimeMinutes === "number" && fm.readingTimeMinutes > 0
        ? Math.round(fm.readingTimeMinutes)
        : estimateReadingTimeMinutes(content);

    const meta: PostFrontmatter = {
      title,
      date,
      tags,
      summary,
      type,
      draft: Boolean(fm.draft),
      readingTimeMinutes,
      ...(fm.author ? { author: String(fm.author) } : {}),
    };

    out.push({
      slug,
      body: content.trim(),
      meta,
      readingTimeMinutes,
      _path: path,
    });
  }

  return out;
}

const blogModules = import.meta.glob<string>("../../content/blog/*.md", {
  query: "?raw",
  import: "default",
  eager: true,
}) as RawModules;

const caseStudyModules = import.meta.glob<string>("../../content/case-studies/*.md", {
  query: "?raw",
  import: "default",
  eager: true,
}) as RawModules;

const allParsed: LoadedPost[] = [
  ...parseModules(blogModules, "blog"),
  ...parseModules(caseStudyModules, "case-study"),
].sort((a, b) => new Date(b.meta.date).getTime() - new Date(a.meta.date).getTime());

export function getAllPosts(): LoadedPost[] {
  return allParsed;
}

export function getPostBySlug(slug: string): LoadedPost | undefined {
  return allParsed.find((p) => p.slug === slug);
}

export function getAllTags(): string[] {
  const set = new Set<string>();
  for (const p of allParsed) {
    for (const t of p.meta.tags) {
      if (t.trim()) set.add(t.trim());
    }
  }
  return [...set].sort((a, b) => a.localeCompare(b));
}

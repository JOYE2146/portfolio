export type ContentKind = "blog" | "case-study";

export type PostFrontmatter = {
  title: string;
  /** ISO 8601 date */
  date: string;
  tags: string[];
  summary: string;
  type: ContentKind;
  draft?: boolean;
  slug?: string;
  /** Override auto word-count estimate */
  readingTimeMinutes?: number;
  author?: string;
};

export type LoadedPost = {
  slug: string;
  body: string;
  meta: PostFrontmatter;
  readingTimeMinutes: number;
  /** Source path key for debugging */
  _path: string;
};

export type TocItem = {
  id: string;
  text: string;
  depth: 2 | 3;
};

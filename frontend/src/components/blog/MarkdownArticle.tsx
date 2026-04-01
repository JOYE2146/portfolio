import { useTheme } from "@/hooks/theme";
import { cn } from "@/utils/cn";
import type { Components } from "react-markdown";
import ReactMarkdown from "react-markdown";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import oneDark from "react-syntax-highlighter/dist/esm/styles/prism/one-dark.js";
import oneLight from "react-syntax-highlighter/dist/esm/styles/prism/one-light.js";
import rehypeAutolinkHeadings from "rehype-autolink-headings";
import rehypeSlug from "rehype-slug";
import remarkGfm from "remark-gfm";
import type { ReactNode } from "react";

const proseHeading = "scroll-mt-[calc(var(--space-header-h)+0.75rem)] font-semibold tracking-tight text-foreground";
const proseLink =
  "font-medium text-accent underline decoration-accent/35 underline-offset-4 hover:decoration-accent";

type MarkdownArticleProps = {
  markdown: string;
  className?: string;
};

export function MarkdownArticle({ markdown, className }: MarkdownArticleProps) {
  const { resolvedTheme } = useTheme();
  const codeStyle = resolvedTheme === "dark" ? oneDark : oneLight;

  const components: Components = {
    h1: ({ children, ...props }) => (
      <h1 className={cn(proseHeading, "mt-0 text-3xl")} {...props}>
        {children}
      </h1>
    ),
    h2: ({ children, ...props }) => (
      <h2 className={cn(proseHeading, "mt-10 border-b border-border pb-2 text-2xl")} {...props}>
        {children}
      </h2>
    ),
    h3: ({ children, ...props }) => (
      <h3 className={cn(proseHeading, "mt-8 text-xl")} {...props}>
        {children}
      </h3>
    ),
    p: ({ children, ...props }) => (
      <p className="my-4 max-w-none leading-relaxed text-muted" {...props}>
        {children}
      </p>
    ),
    ul: ({ children, ...props }) => (
      <ul className="my-4 list-disc space-y-2 pl-6 text-muted" {...props}>
        {children}
      </ul>
    ),
    ol: ({ children, ...props }) => (
      <ol className="my-4 list-decimal space-y-2 pl-6 text-muted" {...props}>
        {children}
      </ol>
    ),
    li: ({ children, ...props }) => (
      <li className="leading-relaxed [&>p]:my-1" {...props}>
        {children}
      </li>
    ),
    blockquote: ({ children, ...props }) => (
      <blockquote
        className="my-4 border-l-4 border-accent/40 bg-accent/[0.06] py-2 pl-4 pr-3 text-sm text-foreground/90 italic"
        {...props}
      >
        {children}
      </blockquote>
    ),
    a: ({ href, children, ...props }) => {
      const external = href?.startsWith("http");
      return (
        <a
          href={href}
          className={proseLink}
          {...(external ? { target: "_blank", rel: "noreferrer noopener" } : {})}
          {...props}
        >
          {children}
        </a>
      );
    },
    hr: (props) => <hr className="my-10 border-border" {...props} />,
    strong: ({ children, ...props }) => (
      <strong className="font-semibold text-foreground" {...props}>
        {children}
      </strong>
    ),
    table: ({ children, ...props }) => (
      <div className="my-6 overflow-x-auto rounded-xl border border-border bg-elevated/40">
        <table className="w-full min-w-[32rem] border-collapse text-sm" {...props}>
          {children}
        </table>
      </div>
    ),
    thead: ({ children, ...props }) => (
      <thead className="border-b border-border bg-elevated/80" {...props}>
        {children}
      </thead>
    ),
    th: ({ children, ...props }) => (
      <th className="px-3 py-2 text-left font-semibold text-foreground" {...props}>
        {children}
      </th>
    ),
    td: ({ children, ...props }) => (
      <td className="border-t border-border px-3 py-2 text-muted" {...props}>
        {children}
      </td>
    ),
    pre: ({ children }) => <>{children}</>,
    code(props) {
      const { children, className, ...rest } = props;
      const match = /language-([\w-+]+)/.exec(className ?? "");
      const codeString = String(children).replace(/\n$/, "");
      if (match) {
        const language = (match[1] ?? "tsx").toLowerCase();
        return (
          <SyntaxHighlighter
            language={language}
            style={codeStyle}
            PreTag="div"
            className="!my-6 !rounded-xl !border !border-border !bg-transparent !p-0 [&>code]:!text-[0.8125rem]"
            customStyle={{
              margin: 0,
              borderRadius: "0.75rem",
              padding: "1rem 1.125rem",
              fontSize: "0.8125rem",
              lineHeight: 1.55,
            }}
            codeTagProps={{
              className: "font-mono",
            }}
          >
            {codeString}
          </SyntaxHighlighter>
        );
      }
      return (
        <code
          className={cn(
            "rounded-md border border-border bg-elevated px-1.5 py-0.5 font-mono text-[0.875em] text-accent",
            className
          )}
          {...rest}
        >
          {children as ReactNode}
        </code>
      );
    },
  };

  return (
    <div className={cn("prose-blog max-w-none", className)}>
      <ReactMarkdown
        remarkPlugins={[remarkGfm]}
        rehypePlugins={[
          rehypeSlug,
          [
            rehypeAutolinkHeadings,
            {
              behavior: "wrap",
              properties: {
                className: ["heading-anchor"],
              },
            },
          ],
        ]}
        components={components}
      >
        {markdown}
      </ReactMarkdown>
    </div>
  );
}

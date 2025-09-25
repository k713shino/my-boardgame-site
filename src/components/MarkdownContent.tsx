import ReactMarkdown from "react-markdown";
import remarkBreaks from "remark-breaks";
import remarkGfm from "remark-gfm";

type MarkdownContentProps = {
  source?: string;
  className?: string;
};

export default function MarkdownContent({ source, className }: MarkdownContentProps) {
  if (!source) return null;

  const containerClassName = ["prose", "max-w-none", className].filter(Boolean).join(" ") || undefined;

  return (
    <div className={containerClassName}>
      <ReactMarkdown
        remarkPlugins={[remarkGfm, remarkBreaks]}
        components={{
          a: ({ href, ...props }) => {
            const isLocal = typeof href === "string" && href.startsWith("/");
            return (
              <a
                {...props}
                href={href}
                target={isLocal ? undefined : "_blank"}
                rel={isLocal ? undefined : "noreferrer"}
              />
            );
          },
        }}
      >
        {source}
      </ReactMarkdown>
    </div>
  );
}

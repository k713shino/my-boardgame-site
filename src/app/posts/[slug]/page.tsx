import { notFound } from "next/navigation";
import { getPostBySlug } from "@/lib/content";
import MarkdownContent from "@/components/MarkdownContent";

function formatDate(iso: string) {
  if (!iso) return "";
  const date = new Date(iso);
  if (Number.isNaN(date.getTime())) return iso;
  return date.toLocaleDateString("ja-JP", {
    timeZone: "Asia/Tokyo",
    year: "numeric",
    month: "short",
    day: "numeric",
  });
}

export default function PostDetail({ params }: { params: { slug: string } }) {
  const post = getPostBySlug(params.slug);
  if (!post) return notFound();

  const category = post.category ? " / " + post.category : "";
  const date = formatDate(post.date);

  return (
    <article className="space-y-6">
      <header className="space-y-3 text-center sm:text-left">
        <span className="text-xs font-semibold uppercase tracking-[0.28em] text-rose-500 sm:tracking-[0.35em]">Article</span>
        <h1 className="text-3xl font-black tracking-tight text-[color:var(--fg-body)] sm:text-4xl">
          {post.title}
        </h1>
        <div className="text-sm text-muted">
          {date}
          {category}
        </div>
        {Array.isArray(post.tags) && post.tags.length ? (
          <div className="flex flex-wrap justify-center gap-2 text-xs uppercase tracking-[0.2em] text-rose-400 sm:justify-start">
            {post.tags.slice(0, 5).map((tag) => (
              <span key={tag} className="rounded-full bg-rose-500/10 px-2 py-1 text-[0.65rem] font-semibold">
                {"#" + tag}
              </span>
            ))}
          </div>
        ) : null}
      </header>
      <MarkdownContent source={post.body} />
    </article>
  );
}

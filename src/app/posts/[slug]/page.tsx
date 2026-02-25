import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { getPostBySlug, getAllPosts } from "@/lib/content";
import MarkdownContent from "@/components/MarkdownContent";

const BASE_URL = "https://my-boardgame-site.vercel.app";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const post = getPostBySlug(slug);
  if (!post) return {};
  const description = post.excerpt ?? post.title;
  return {
    title: post.title,
    description,
    openGraph: {
      title: post.title + " | Dice Journal",
      description,
      type: "article",
      publishedTime: post.date,
      url: `${BASE_URL}/posts/${slug}`,
      locale: "ja_JP",
    },
    twitter: {
      card: "summary_large_image",
      title: post.title,
      description,
    },
  };
}

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

export async function generateStaticParams() {
  const posts = getAllPosts();
  return posts.map((post) => ({
    slug: post.slug,
  }));
}

export default async function PostDetail({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const post = getPostBySlug(slug);
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

import Link from "next/link";
import { getAllPosts } from "@/lib/content";

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

export default function PostsPage() {
  const posts = getAllPosts();
  return (
    <div className="space-y-8">
      <header className="flex flex-col gap-3 text-center sm:text-left">
        <span className="text-[0.75rem] font-semibold uppercase tracking-[0.28em] text-rose-500 sm:tracking-[0.35em]">
          Journal
        </span>
        <h1 className="text-3xl font-black uppercase tracking-tight text-[color:var(--fg-body)]">
          最新記事
        </h1>
        <p className="text-sm text-muted sm:text-base">レビューやエッセイ、イベントレポートをこちらでまとめています。</p>
      </header>
      <ul className="space-y-3">
        {posts.map((p) => (
          <li key={p.slug}>
            <Link
              href={"/posts/" + p.slug}
              className="group surface-card flex flex-col gap-2 rounded-2xl px-5 py-4 sm:px-6 sm:py-5 transition hover:-translate-y-1 hover:border-rose-400/70 hover:shadow-[0_30px_80px_-50px_rgba(244,114,182,0.6)]"
            >
              <span className="text-xs font-semibold uppercase tracking-[0.28em] text-muted sm:tracking-[0.35em]">
                {formatDate(p.date)}
                {p.category ? " ・ " + p.category : ""}
              </span>
              <span className="text-lg font-semibold tracking-tight text-[color:var(--fg-body)] transition group-hover:text-rose-500 sm:text-xl">
                {p.title}
              </span>
              {p.excerpt ? <span className="text-sm text-muted">{p.excerpt}</span> : null}
              {Array.isArray(p.tags) && p.tags.length ? (
                <div className="flex flex-wrap gap-2 text-[0.65rem] font-semibold uppercase tracking-[0.2em] text-rose-400">
                  {p.tags.slice(0, 4).map((tag) => (
                    <span key={tag} className="rounded-full bg-rose-500/10 px-2 py-1">
                      {"#" + tag}
                    </span>
                  ))}
                </div>
              ) : null}
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}

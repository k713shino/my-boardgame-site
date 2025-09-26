import Link from "next/link";
import { getAllPosts } from "@/lib/content";

export default function TagPage({ params }: { params: { name: string } }) {
  const name = decodeURIComponent(params.name);
  const posts = getAllPosts().filter((p) => (p.tags ?? []).includes(name));
  return (
    <div className="space-y-6">
      <header className="space-y-2 text-center sm:text-left">
        <span className="text-xs font-semibold uppercase tracking-[0.28em] text-rose-500 sm:tracking-[0.35em]">Tag</span>
        <h1 className="text-3xl font-black tracking-tight text-[color:var(--fg-body)] sm:text-4xl">#{name}</h1>
        <p className="text-sm text-muted sm:text-base">このタグが付いている投稿一覧です。</p>
      </header>
      {posts.length ? (
        <ul className="space-y-3">
          {posts.map((p) => (
            <li key={p.slug}>
              <Link
                href={"/posts/" + p.slug}
                className="group surface-card flex flex-col gap-2 rounded-2xl px-5 py-4 sm:px-6 sm:py-5 transition hover:-translate-y-1 hover:border-rose-400/70 hover:shadow-[0_30px_80px_-50px_rgba(244,114,182,0.6)]"
              >
                <span className="text-xs font-semibold uppercase tracking-[0.28em] text-muted sm:tracking-[0.35em]">{p.date}</span>
                <span className="text-lg font-semibold tracking-tight text-[color:var(--fg-body)] transition group-hover:text-rose-500 sm:text-xl">{p.title}</span>
              </Link>
            </li>
          ))}
        </ul>
      ) : (
        <p className="text-sm text-muted">このタグの投稿はまだありません。</p>
      )}
    </div>
  );
}

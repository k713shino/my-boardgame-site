import Link from "next/link";
import { getAllTags } from "@/lib/content";

export default function Tags() {
  const tags = getAllTags();
  return (
    <div className="space-y-6">
      <header className="space-y-3 text-center sm:text-left">
        <span className="text-xs font-semibold uppercase tracking-[0.28em] text-rose-500 sm:tracking-[0.35em]">Tags</span>
        <h1 className="text-3xl font-black uppercase tracking-tight text-[color:var(--fg-body)]">タグ一覧</h1>
        <p className="text-sm text-muted sm:text-base">よく使うタグから投稿を探せます。</p>
      </header>
      <div className="flex flex-wrap gap-2">
        {tags.map((t) => (
          <Link
            key={t}
            href={"/tags/" + encodeURIComponent(t)}
            className="surface-card inline-flex items-center justify-center rounded-full px-3 py-2 text-sm font-semibold uppercase tracking-[0.2em] text-rose-500 transition hover:-translate-y-0.5 hover:border-rose-400 hover:text-rose-400 dark:text-rose-300"
          >
            {"#" + t}
          </Link>
        ))}
      </div>
    </div>
  );
}

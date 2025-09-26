import Link from "next/link";
import { getAllCategories } from "@/lib/content";

export default function Categories() {
  const cats = getAllCategories();
  return (
    <div className="space-y-6">
      <header className="space-y-3 text-center sm:text-left">
        <span className="text-xs font-semibold uppercase tracking-[0.28em] text-indigo-500 sm:tracking-[0.35em]">Categories</span>
        <h1 className="text-3xl font-black uppercase tracking-tight text-[color:var(--fg-body)]">カテゴリ一覧</h1>
        <p className="text-sm text-muted sm:text-base">テーマ別の記事をチェック。タップすると該当カテゴリの記事を表示します。</p>
      </header>
      <ul className="flex flex-wrap gap-3">
        {cats.map((c) => (
          <li key={c}>
            <Link
              className="surface-card inline-flex items-center justify-center rounded-full px-4 py-2 text-sm font-semibold uppercase tracking-[0.2em] text-indigo-600 transition hover:-translate-y-0.5 hover:border-indigo-400 hover:text-indigo-500 dark:text-indigo-300"
              href={"/categories/" + encodeURIComponent(c)}
            >
              {c}
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}

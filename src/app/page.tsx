import Link from "next/link";
import { getAllPosts, getAllPlays, getAllGames } from "@/lib/content";

function formatDate(iso: string) {
  const date = new Date(iso);
  if (Number.isNaN(date.getTime())) return iso;
  return date.toLocaleDateString("ja-JP", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
}

export default function Home() {
  const posts = getAllPosts().slice(0, 3);
  const plays = getAllPlays().slice(0, 5);
  const games = getAllGames().slice(0, 6);

  return (
    <div className="space-y-12">
      <section className="relative overflow-hidden rounded-3xl border border-indigo-200/60 bg-white/80 px-8 py-12 shadow-2xl ring-1 ring-indigo-100/70 transition dark:border-indigo-500/30 dark:bg-slate-900/60 dark:ring-indigo-500/20">
        <div className="pointer-events-none absolute -right-20 -top-24 h-64 w-64 rounded-full bg-indigo-400/30 blur-3xl dark:bg-indigo-400/40" aria-hidden />
        <div className="pointer-events-none absolute -left-24 bottom-[-30%] h-72 w-72 rounded-full bg-pink-400/20 blur-3xl dark:bg-emerald-400/30" aria-hidden />
        <div className="relative space-y-6">
          <p className="inline-flex items-center gap-2 rounded-full border border-indigo-200/70 bg-white/80 px-4 py-1 text-sm font-medium text-indigo-700 shadow-sm dark:border-indigo-400/30 dark:bg-slate-900/70 dark:text-indigo-200">
            🎲 ボードゲームの魅力を深く・広く
          </p>
          <h1 className="text-4xl font-bold tracking-tight text-slate-900 sm:text-5xl dark:text-white">
            Boardgame Labで、次の一手を探そう
          </h1>
          <p className="max-w-2xl text-base text-slate-600 dark:text-slate-300">
            記事やプレイログ、コレクションをまとめて管理。気になる作品をチェックして、戦術研究やイベント情報まで一気にキャッチアップしましょう。
          </p>
          <div className="flex flex-wrap gap-3">
            <Link
              href="/posts"
              className="inline-flex items-center gap-2 rounded-full bg-indigo-600 px-5 py-2 text-sm font-semibold text-white shadow-lg shadow-indigo-600/40 transition hover:-translate-y-0.5 hover:bg-indigo-500"
            >
              最新記事を読む
              <span aria-hidden>→</span>
            </Link>
            <Link
              href="/games"
              className="inline-flex items-center gap-2 rounded-full border border-slate-300/70 bg-white/80 px-5 py-2 text-sm font-semibold text-slate-700 shadow-sm transition hover:-translate-y-0.5 hover:border-indigo-500 hover:text-indigo-600 dark:border-slate-700/60 dark:bg-slate-900/70 dark:text-slate-100 dark:hover:border-indigo-400 dark:hover:text-indigo-300"
            >
              コレクションを見る
            </Link>
          </div>
        </div>
      </section>

      <div className="grid gap-8 lg:grid-cols-2">
        <section className="rounded-3xl border border-slate-200/70 bg-white/80 p-6 shadow-xl ring-1 ring-slate-200/60 dark:border-slate-700/60 dark:bg-slate-900/60 dark:ring-slate-800/60">
          <div className="flex items-center justify-between gap-4">
            <h2 className="text-lg font-semibold text-slate-900 dark:text-white">最新記事</h2>
            <Link href="/posts" className="text-sm font-medium text-indigo-600 hover:text-indigo-500 dark:text-indigo-300 dark:hover:text-indigo-200">
              一覧を見る
            </Link>
          </div>
          <ul className="mt-6 space-y-4">
            {posts.map((p) => (
              <li key={p.slug} className="group rounded-2xl border border-transparent bg-white/40 p-4 transition hover:border-indigo-400/60 hover:shadow-md dark:bg-slate-900/40 dark:hover:border-indigo-400/40">
                <Link href={`/posts/${p.slug}`} className="flex flex-col gap-1">
                  <span className="text-base font-semibold text-slate-900 group-hover:text-indigo-600 dark:text-white dark:group-hover:text-indigo-300">
                    {p.title}
                  </span>
                  <span className="text-xs uppercase tracking-wide text-slate-500 dark:text-slate-400">
                    {formatDate(p.date)}
                    {p.category ? ` ・ ${p.category}` : ""}
                  </span>
                  {p.excerpt ? (
                    <span className="text-sm text-slate-600 dark:text-slate-300">{p.excerpt}</span>
                  ) : null}
                  {p.tags?.length ? (
                    <span className="text-xs text-indigo-500 dark:text-indigo-300">#{p.tags.slice(0, 3).join(" #")}</span>
                  ) : null}
                </Link>
              </li>
            ))}
          </ul>
        </section>

        <section className="rounded-3xl border border-slate-200/70 bg-white/80 p-6 shadow-xl ring-1 ring-slate-200/60 dark:border-slate-700/60 dark:bg-slate-900/60 dark:ring-slate-800/60">
          <div className="flex items-center justify-between gap-4">
            <h2 className="text-lg font-semibold text-slate-900 dark:text-white">最近のプレイ</h2>
            <Link href="/plays" className="text-sm font-medium text-indigo-600 hover:text-indigo-500 dark:text-indigo-300 dark:hover:text-indigo-200">
              一覧を見る
            </Link>
          </div>
          <ul className="mt-6 space-y-4">
            {plays.map((pl) => (
              <li key={pl.id}>
                <Link
                  href={`/plays/${pl.id}`}
                  className="group flex flex-col gap-1 rounded-2xl border border-transparent bg-white/40 p-4 transition hover:border-emerald-400/50 hover:shadow-md dark:bg-slate-900/40 dark:hover:border-emerald-400/40"
                >
                  <span className="text-base font-semibold text-slate-900 group-hover:text-emerald-600 dark:text-white dark:group-hover:text-emerald-300">
                    {pl.gameId}
                  </span>
                  <span className="text-xs uppercase tracking-wide text-slate-500 dark:text-slate-400">
                    {formatDate(pl.date)}
                    {pl.location ? ` ・ ${pl.location}` : ""}
                  </span>
                  {pl.tags?.length ? (
                    <span className="text-xs text-emerald-500 dark:text-emerald-300">#{pl.tags.slice(0, 3).join(" #")}</span>
                  ) : null}
                </Link>
              </li>
            ))}
          </ul>
        </section>
      </div>

      <section className="rounded-3xl border border-slate-200/70 bg-white/80 p-6 shadow-xl ring-1 ring-slate-200/60 dark:border-slate-700/60 dark:bg-slate-900/60 dark:ring-slate-800/60">
        <div className="flex items-center justify-between gap-4">
          <h2 className="text-lg font-semibold text-slate-900 dark:text-white">コレクション</h2>
          <Link href="/games" className="text-sm font-medium text-indigo-600 hover:text-indigo-500 dark:text-indigo-300 dark:hover:text-indigo-200">
            すべて表示
          </Link>
        </div>
        <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {games.map((g) => (
            <Link
              key={g.id}
              href={`/games/${g.id}`}
              className="group relative overflow-hidden rounded-2xl border border-slate-200/60 bg-white/70 p-5 shadow-md transition hover:-translate-y-1 hover:border-indigo-400/60 hover:shadow-lg dark:border-slate-700/70 dark:bg-slate-900/70 dark:hover:border-indigo-400/40"
            >
              <span className="absolute -right-6 -top-6 h-16 w-16 rounded-full bg-indigo-400/30 blur-2xl transition group-hover:scale-125 dark:bg-indigo-400/40" aria-hidden />
              <div className="relative flex flex-col gap-2">
                <span className="text-base font-semibold text-slate-900 dark:text-white">{g.title}</span>
                {g.designer ? (
                  <span className="text-xs text-slate-500 dark:text-slate-400">Designer: {g.designer}</span>
                ) : null}
                {g.tags?.length ? (
                  <span className="text-xs text-indigo-500 dark:text-indigo-300">#{g.tags.slice(0, 3).join(" #")}</span>
                ) : null}
              </div>
            </Link>
          ))}
        </div>
      </section>
    </div>
  );
}

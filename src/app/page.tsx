import Link from "next/link";
import { getAllPosts, getAllPlays, getAllGames } from "@/lib/content";
import { fetchRemotePlays } from "@/lib/remote";

function formatDate(iso: string) {
  const date = new Date(iso);
  if (Number.isNaN(date.getTime())) return iso;
  return date.toLocaleDateString("ja-JP", {
    timeZone: "Asia/Tokyo",
    year: "numeric",
    month: "short",
    day: "numeric",
  });
}

function toDateString(value: unknown): string {
  if (!value) return "";
  if (typeof value === "string") return value;
  if (value instanceof Date) return value.toISOString().slice(0, 10);
  return String(value);
}

type PlayListItem = {
  id: string;
  date: string;
  gameId: string;
  location?: string;
  tags?: string[];
};

export default async function Home() {
  const posts = getAllPosts().slice(0, 3);
  const games = getAllGames().slice(0, 6);
  const localPlays = getAllPlays().map<PlayListItem>(({ id, date, gameId, location, tags }) => ({
    id,
    date,
    gameId,
    location,
    tags,
  }));

  let remotePlays: PlayListItem[] = [];
  try {
    const remote = await fetchRemotePlays({ page: 1, size: 50 });
    remotePlays = remote.items.map((item) => ({
      id: String(item.id),
      date: toDateString(item.date),
      gameId: item.gameId,
      location: item.location,
      tags: item.tags,
    }));
  } catch (err) {
    console.warn("Failed to fetch remote plays for home", err);
  }

  const mergedMap = new Map<string, PlayListItem>();
  [...localPlays, ...remotePlays].forEach((play) => {
    if (!play.id) return;
    mergedMap.set(play.id, play);
  });

  const plays = Array.from(mergedMap.values())
    .filter((play) => play.date)
    .sort((a, b) => b.date.localeCompare(a.date))
    .slice(0, 4);

  return (
    <div className="w-full space-y-12 sm:space-y-16">
      <section className="surface-card relative isolate flex flex-col items-center gap-8 justify-center overflow-hidden rounded-[24px] px-6 py-12 sm:px-10 sm:py-16 text-center ring-1 ring-slate-200/40 dark:ring-slate-800/40">
        <div className="pointer-events-none absolute -top-32 left-1/2 h-72 w-72 -translate-x-1/2 rounded-full bg-rose-400/30 blur-[120px] dark:bg-rose-500/40" aria-hidden />
        <div className="pointer-events-none absolute bottom-[-30%] right-[-10%] h-72 w-72 rounded-full bg-indigo-400/25 blur-[120px] dark:bg-indigo-500/30" aria-hidden />
        <div className="pointer-events-none absolute inset-x-16 top-10 h-px bg-gradient-to-r from-transparent via-slate-300/50 to-transparent dark:via-slate-600/50" aria-hidden />
        <div className="relative mx-auto flex max-w-3xl flex-col items-center gap-8 text-center">
          <span className="text-[0.7rem] font-semibold uppercase tracking-[0.45em] text-muted">
            Special Issue Vol.01
          </span>
          <h1 className="text-4xl font-black uppercase leading-tight tracking-tight text-[color:var(--fg-body)] sm:text-6xl">
            Sound of Strategy
            <span className="text-rose-500">.</span>
          </h1>
          <p className="max-w-2xl text-sm text-muted sm:text-base">
            ボードゲームの盤面からインスピレーションを受けたプレイログとレビューを、軽快なリズムでお届けします。次号のテーマやイベント情報もここからチェック。
          </p>
          <div className="flex flex-col gap-3 sm:flex-row sm:flex-wrap sm:justify-center sm:gap-4">
            <Link
              href="/posts"
              className="inline-flex w-full items-center justify-center gap-3 sm:w-auto rounded-full bg-rose-500 px-6 py-3 text-sm font-semibold uppercase tracking-[0.2em] sm:tracking-[0.25em] text-white shadow-lg shadow-rose-500/40 transition hover:-translate-y-0.5 hover:bg-rose-400"
            >
              Read Articles
              <span aria-hidden>→</span>
            </Link>
            <Link
              href="/games"
              className="inline-flex w-full items-center justify-center gap-3 sm:w-auto rounded-full border border-slate-400/70 bg-white/80 px-6 py-3 text-sm font-semibold uppercase tracking-[0.2em] sm:tracking-[0.25em] text-slate-700 shadow-sm transition hover:-translate-y-0.5 hover:border-rose-400 hover:text-rose-500 dark:border-slate-600/70 dark:bg-slate-900/70 dark:text-slate-200 dark:hover:border-rose-400 dark:hover:text-rose-300"
            >
              View Collection
            </Link>
          </div>
          <div className="grid w-full gap-3 pt-6 text-center sm:grid-cols-3">
            <div className="surface-card flex flex-col items-center gap-1 rounded-xl px-5 py-4 text-xs uppercase tracking-[0.28em] sm:tracking-[0.35em] text-muted">
              <span className="text-[0.6rem] text-rose-500">Feature</span>
              最新記事のピックアップ
            </div>
            <div className="surface-card flex flex-col items-center gap-1 rounded-xl px-5 py-4 text-xs uppercase tracking-[0.28em] sm:tracking-[0.35em] text-muted">
              <span className="text-[0.6rem] text-indigo-500">Live</span>
              プレイセッション速報
            </div>
            <div className="surface-card flex flex-col items-center gap-1 rounded-xl px-5 py-4 text-xs uppercase tracking-[0.28em] sm:tracking-[0.35em] text-muted">
              <span className="text-[0.6rem] text-teal-500">Archive</span>
              コレクションギャラリー
            </div>
          </div>
        </div>
      </section>

      <section className="space-y-8">
        <div className="flex flex-col items-center gap-3 text-center">
          <span className="text-[0.75rem] font-semibold uppercase tracking-[0.45em] text-rose-500">
            Latest Stories
          </span>
          <h2 className="text-3xl font-black uppercase tracking-tight text-[color:var(--fg-body)]">
            最新記事
          </h2>
          <Link href="/posts" className="text-xs font-semibold uppercase tracking-[0.28em] sm:tracking-[0.35em] text-muted underline decoration-dotted underline-offset-4">
            一覧を見る
          </Link>
        </div>
        <div className="space-y-4 text-left">
          {posts.map((p) => (
            <Link
              key={p.slug}
              href={`/posts/${p.slug}`}
              className="group surface-card flex flex-col gap-3 rounded-2xl px-5 py-5 sm:px-6 sm:py-6 transition hover:-translate-y-1 hover:border-rose-400/70 hover:shadow-[0_30px_80px_-50px_rgba(244,114,182,0.6)]"
            >
              <span className="text-xs font-semibold uppercase tracking-[0.3em] sm:tracking-[0.4em] text-muted">
                {formatDate(p.date)}{p.category ? ` ・ ${p.category}` : ""}
              </span>
              <span className="text-xl font-black tracking-tight sm:text-2xl text-[color:var(--fg-body)] transition group-hover:text-rose-500">
                {p.title}
              </span>
              {p.excerpt ? <span className="text-sm leading-relaxed text-muted">{p.excerpt}</span> : null}
              {p.tags?.length ? (
                <span className="text-xs uppercase tracking-[0.28em] sm:tracking-[0.35em] text-rose-400">#{p.tags.slice(0, 3).join(" #")}</span>
              ) : null}
            </Link>
          ))}
        </div>
      </section>

      <section className="space-y-8">
        <div className="flex flex-col items-center gap-3 text-center">
          <span className="text-[0.75rem] font-semibold uppercase tracking-[0.45em] text-indigo-500">
            Live Session Log
          </span>
          <h2 className="text-3xl font-black uppercase tracking-tight text-[color:var(--fg-body)]">
            最近のプレイ
          </h2>
          <Link href="/plays" className="text-xs font-semibold uppercase tracking-[0.28em] sm:tracking-[0.35em] text-muted underline decoration-dotted underline-offset-4">
            一覧を見る
          </Link>
        </div>
        <div className="grid gap-4 text-left sm:grid-cols-2">
          {plays.map((pl) => (
            <Link
              key={pl.id}
              href={`/plays/${pl.id}`}
              className="group surface-card flex flex-col gap-3 rounded-2xl px-5 py-5 sm:px-6 sm:py-6 transition hover:-translate-y-1 hover:border-indigo-400/70 hover:shadow-[0_30px_80px_-50px_rgba(129,140,248,0.5)]"
            >
              <span className="text-xs font-semibold uppercase tracking-[0.3em] sm:tracking-[0.4em] text-muted">
                {formatDate(pl.date)}{pl.location ? ` ・ ${pl.location}` : ""}
              </span>
              <span className="text-xl font-black tracking-tight text-[color:var(--fg-body)] transition group-hover:text-indigo-500">
                {pl.gameId}
              </span>
              {pl.tags?.length ? (
                <span className="text-xs uppercase tracking-[0.28em] sm:tracking-[0.35em] text-indigo-400">#{pl.tags.slice(0, 3).join(" #")}</span>
              ) : null}
            </Link>
          ))}
        </div>
      </section>

      <section className="space-y-8">
        <div className="flex flex-col items-center gap-3 text-center">
          <span className="text-[0.75rem] font-semibold uppercase tracking-[0.45em] text-teal-500">
            Collection Gallery
          </span>
          <h2 className="text-3xl font-black uppercase tracking-tight text-[color:var(--fg-body)]">
            コレクション
          </h2>
          <Link href="/games" className="text-xs font-semibold uppercase tracking-[0.28em] sm:tracking-[0.35em] text-muted underline decoration-dotted underline-offset-4">
            すべて表示
          </Link>
        </div>
        <div className="grid gap-4 sm:grid-cols-2">
          {games.map((g) => (
            <Link
              key={g.id}
              href={`/games/${g.id}`}
              className="group surface-card flex flex-col gap-3 rounded-2xl px-6 py-6 text-left transition hover:-translate-y-1 hover:border-teal-400/70 hover:shadow-[0_30px_80px_-50px_rgba(45,212,191,0.45)]"
            >
              <span className="text-xs font-semibold uppercase tracking-[0.28em] sm:tracking-[0.35em] text-muted">
                {g.tags?.length ? g.tags[0] : "Featured"}
              </span>
              <span className="text-xl font-black tracking-tight text-[color:var(--fg-body)] transition group-hover:text-teal-500">
                {g.title}
              </span>
              {g.designer ? (
                <span className="text-xs uppercase tracking-[0.3em] text-muted">Designer: {g.designer}</span>
              ) : null}
              {g.tags?.length ? (
                <span className="text-xs uppercase tracking-[0.28em] sm:tracking-[0.35em] text-teal-400">#{g.tags.slice(0, 3).join(" #")}</span>
              ) : null}
            </Link>
          ))}
        </div>
      </section>
    </div>
  );
}

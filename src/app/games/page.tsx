import Link from "next/link";
import { getAllGames } from "@/lib/content";

function formatPlayers(min?: number | null, max?: number | null) {
  if (min && max) return min + "–" + max + "人";
  if (min) return String(min) + "人";
  if (max) return String(max) + "人";
  return "人数不明";
}

function formatPlayTime(minutes?: number | null) {
  if (!minutes) return "時間不明";
  return String(minutes) + "分";
}

export default function GamesPage() {
  const games = getAllGames();
  return (
    <div className="space-y-8">
      <header className="flex flex-col items-center gap-3 text-center sm:items-start sm:text-left">
        <span className="text-[0.75rem] font-semibold uppercase tracking-[0.28em] sm:tracking-[0.35em] text-indigo-500">
          Collection
        </span>
        <h1 className="text-3xl font-black uppercase tracking-tight text-[color:var(--fg-body)]">
          ゲームコレクション
        </h1>
        <p className="max-w-2xl text-sm text-muted sm:text-base">
          所持・プレイしているボードゲームの概要です。気になるタイトルは詳細ページからレビューをチェック。
        </p>
      </header>
      <ul className="grid gap-4 sm:grid-cols-2">
        {games.map((g) => (
          <li key={g.id}>
            <Link
              href={"/games/" + g.id}
              className="group surface-card flex h-full flex-col gap-4 rounded-2xl px-5 py-5 sm:px-6 sm:py-6 transition hover:-translate-y-1 hover:border-indigo-400/70 hover:shadow-[0_30px_80px_-50px_rgba(99,102,241,0.6)]"
            >
              <div className="flex items-baseline justify-between gap-3">
                <h2 className="text-xl font-bold tracking-tight text-[color:var(--fg-body)] transition group-hover:text-indigo-500 sm:text-2xl">
                  {g.title}
                </h2>
                <span className="text-[0.65rem] uppercase tracking-[0.28em] sm:tracking-[0.35em] text-muted">
                  #{g.id}
                </span>
              </div>
              <div className="flex flex-wrap gap-2 text-[0.7rem] font-semibold uppercase tracking-[0.2em]">
                <span className="rounded-full border border-rose-300/60 px-2 py-1 text-rose-500 dark:border-rose-500/40">
                  {formatPlayers(g.minPlayers, g.maxPlayers)}
                </span>
                <span className="rounded-full border border-indigo-300/60 px-2 py-1 text-indigo-500 dark:border-indigo-500/40">
                  {formatPlayTime(g.playTime)}
                </span>
                {g.weight ? (
                  <span className="rounded-full border border-teal-300/60 px-2 py-1 text-teal-500 dark:border-teal-500/40">
                    重さ {g.weight}
                  </span>
                ) : null}
              </div>
              {g.tags?.length ? (
                <div className="flex flex-wrap gap-2 text-xs uppercase tracking-[0.2em] text-rose-400">
                  {g.tags.slice(0, 6).map((tag) => (
                    <span
                      key={tag}
                      className="rounded-full bg-rose-500/10 px-2 py-1 text-[0.65rem] font-semibold text-rose-400"
                    >
                      #{tag}
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

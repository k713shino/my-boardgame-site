import Link from "next/link";
import { getAllPlays } from "@/lib/content";
import { fetchRemotePlays } from "@/lib/remote";

type PlayListItem = {
  id: string;
  date: string;
  gameId: string;
  location?: string;
  tags?: string[];
};

function toDateString(value: unknown): string {
  if (!value) return "";
  if (typeof value === "string") return value;
  if (value instanceof Date) return value.toISOString().slice(0, 10);
  return String(value);
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

export default async function PlaysPage() {
  const localPlays = getAllPlays().map<PlayListItem>(({ id, date, gameId, tags, location }) => ({
    id,
    date,
    gameId,
    tags,
    location,
  }));

  let remotePlays: PlayListItem[] = [];
  try {
    const remote = await fetchRemotePlays({ page: 1, size: 200 });
    remotePlays = remote.items.map((item) => ({
      id: String(item.id),
      date: toDateString(item.date),
      gameId: item.gameId,
      tags: item.tags,
      location: item.location,
    }));
  } catch (err) {
    console.warn("Failed to fetch remote plays", err);
  }

  const mergedMap = new Map<string, PlayListItem>();
  [...localPlays, ...remotePlays].forEach((play) => {
    if (!play.id) return;
    mergedMap.set(play.id, play);
  });

  const plays = Array.from(mergedMap.values()).sort((a, b) => b.date.localeCompare(a.date));

  return (
    <div className="space-y-8">
      <header className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div className="flex flex-col gap-3 text-center sm:text-left">
          <span className="text-[0.75rem] font-semibold uppercase tracking-[0.28em] text-teal-500 sm:tracking-[0.35em]">
            Session Log
          </span>
          <h1 className="text-3xl font-black uppercase tracking-tight text-[color:var(--fg-body)]">
            プレイ記録
          </h1>
          <p className="text-sm text-muted sm:text-base">
            直近のセッションをまとめています。タイトルをタップして詳細レポートをチェック。
          </p>
        </div>
        <Link
          href="/plays/new"
          className="inline-flex items-center justify-center gap-2 self-center rounded-full border border-teal-400/60 px-4 py-2 text-sm font-semibold uppercase tracking-[0.2em] text-teal-600 transition hover:-translate-y-0.5 hover:border-teal-400 hover:bg-teal-400/10 dark:text-teal-300"
        >
          + 新規追加
        </Link>
      </header>
      <ul className="space-y-3">
        {plays.map((pl) => {
          const chipTags = Array.isArray(pl.tags) ? pl.tags.slice(0, 4) : [];
          return (
            <li key={pl.id}>
              <Link
                href={"/plays/" + encodeURIComponent(pl.id)}
                className="group surface-card flex flex-col gap-3 rounded-2xl px-5 py-4 sm:px-6 sm:py-5 transition hover:-translate-y-1 hover:border-teal-400/70 hover:shadow-[0_30px_80px_-50px_rgba(45,212,191,0.45)]"
              >
                <div className="flex flex-wrap items-center justify-between gap-2 text-xs font-semibold uppercase tracking-[0.28em] text-muted sm:tracking-[0.35em]">
                  <span>{formatDate(pl.date)}</span>
                  {pl.location ? <span className="text-[0.65rem] text-teal-500">{pl.location}</span> : null}
                </div>
                <div className="text-lg font-semibold tracking-tight text-[color:var(--fg-body)] transition group-hover:text-teal-500 sm:text-xl">
                  {pl.gameId}
                </div>
                {chipTags.length ? (
                  <div className="flex flex-wrap gap-2 text-[0.65rem] font-semibold uppercase tracking-[0.2em] text-teal-400">
                    {chipTags.map((tag) => (
                      <span key={tag} className="rounded-full bg-teal-500/10 px-2 py-1">
                        {"#" + tag}
                      </span>
                    ))}
                  </div>
                ) : null}
              </Link>
            </li>
          );
        })}
      </ul>
    </div>
  );
}

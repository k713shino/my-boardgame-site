import { notFound } from "next/navigation";
import Image from "next/image";
import { getPlayById } from "@/lib/content";
import { fetchRemotePlays, type RemotePlay } from "@/lib/remote";
import MarkdownContent from "@/components/MarkdownContent";

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

async function getRemotePlay(id: string): Promise<RemotePlay | null> {
  try {
    const data = await fetchRemotePlays({ page: 1, size: 500 });
    return data.items.find((p) => String(p.id) === id) ?? null;
  } catch (err) {
    console.warn("Failed to fetch remote play", err);
    return null;
  }
}

export default async function PlayDetail({ params }: { params: { id: string } }) {
  const playId = decodeURIComponent(params.id);
  const localPlay = getPlayById(playId);
  const remotePlay = localPlay ? null : await getRemotePlay(playId);
  const play = localPlay ?? remotePlay;
  if (!play) return notFound();

  const date = formatDate(toDateString(play.date));
  const rawDate = toDateString(play.date);
  const gameId = play.gameId;
  const location = play.location ?? "-";
  const tags = Array.isArray(play.tags) ? play.tags : [];
  const players = play.players ?? [];
  const rawNotes = "body" in play && typeof play.body === "string" ? play.body : play.notes;
  const notes = typeof rawNotes === "string" ? rawNotes : "";
  const image = "image" in play ? (play.image as string | undefined) : undefined;

  return (
    <article className="space-y-8">
      <header className="space-y-4">
        <div className="flex flex-col gap-2 text-center sm:text-left">
          <span className="text-xs font-semibold uppercase tracking-[0.28em] text-teal-500 sm:tracking-[0.35em]">
            Play Report
          </span>
          <h1 className="text-3xl font-black tracking-tight text-[color:var(--fg-body)] sm:text-4xl">
            {date} / {gameId}
          </h1>
          <div className="flex flex-wrap justify-center gap-2 text-[0.75rem] font-semibold uppercase tracking-[0.2em] text-muted sm:justify-start">
            <span className="rounded-full border border-teal-300/60 px-3 py-1 text-teal-500 dark:border-teal-500/40">{location}</span>
            <span className="rounded-full border border-slate-300/60 px-3 py-1 text-slate-600 dark:border-slate-600/60 dark:text-slate-300">ID {playId}</span>
          </div>
          {tags.length ? (
            <div className="flex flex-wrap justify-center gap-2 text-xs uppercase tracking-[0.2em] text-teal-400 sm:justify-start">
              {tags.map((tag) => (
                <span key={tag} className="rounded-full bg-teal-500/10 px-2 py-1 text-[0.65rem] font-semibold text-teal-400">
                  {"#" + tag}
                </span>
              ))}
            </div>
          ) : null}
          {rawDate ? (
            <span className="text-xs text-muted">記録日: {rawDate}</span>
          ) : null}
        </div>
      </header>

      {image ? (
        <div className="overflow-hidden rounded-2xl border border-slate-200 shadow-sm dark:border-slate-700">
          <Image
            src={image}
            alt={gameId + " session photo"}
            width={960}
            height={540}
            className="h-auto w-full object-cover"
            priority
          />
        </div>
      ) : null}

      <dl className="surface-card grid gap-4 rounded-2xl px-5 py-5 sm:grid-cols-2 sm:px-6 sm:py-6">
        <div>
          <dt className="text-xs font-semibold uppercase tracking-[0.28em] text-muted sm:tracking-[0.35em]">ゲーム</dt>
          <dd className="text-lg font-semibold text-[color:var(--fg-body)]">{gameId}</dd>
        </div>
        <div>
          <dt className="text-xs font-semibold uppercase tracking-[0.28em] text-muted sm:tracking-[0.35em]">場所</dt>
          <dd className="text-lg font-semibold text-[color:var(--fg-body)]">{location}</dd>
        </div>
        <div className="sm:col-span-2">
          <dt className="text-xs font-semibold uppercase tracking-[0.28em] text-muted sm:tracking-[0.35em]">タグ</dt>
          <dd className="text-sm text-muted">{tags.length ? tags.join(", ") : "-"}</dd>
        </div>
      </dl>

      {players.length ? (
        <section className="space-y-3">
          <h2 className="text-lg font-semibold tracking-tight text-[color:var(--fg-body)]">プレイヤー</h2>
          <ul className="grid gap-2 sm:grid-cols-2">
            {players.map((p, i) => (
              <li key={i} className="surface-card rounded-xl px-4 py-3 text-sm">
                <div className="flex items-center justify-between">
                  <span className="font-semibold text-[color:var(--fg-body)]">{p.name}</span>
                  <span className="text-base">{p.win ? "🏆" : ""}</span>
                </div>
                <div className="text-xs text-muted">{p.score !== undefined && p.score !== null ? "Score: " + p.score : ""}</div>
              </li>
            ))}
          </ul>
        </section>
      ) : null}

      {notes ? (
        <section className="space-y-4">
          <h2 className="text-lg font-semibold tracking-tight text-[color:var(--fg-body)]">メモ</h2>
          <MarkdownContent source={notes} />
        </section>
      ) : null}
    </article>
  );
}

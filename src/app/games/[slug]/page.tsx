import { notFound } from "next/navigation";
import Image from "next/image";
import { getGameById } from "@/lib/content";
import MarkdownContent from "@/components/MarkdownContent";

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

function formatWeight(weight?: number | null) {
  if (weight === null || weight === undefined) return "不明";
  return String(weight);
}

export default function GameDetail({ params }: { params: { slug: string } }) {
  const game = getGameById(params.slug);
  if (!game) return notFound();

  const tags = Array.isArray(game.tags) ? game.tags : [];

  return (
    <article className="space-y-8">
      <header className="space-y-4">
        <div className="flex flex-col gap-2 text-center sm:text-left">
          <span className="text-xs font-semibold uppercase tracking-[0.28em] text-indigo-500 sm:tracking-[0.35em]">
            Game Profile
          </span>
          <h1 className="text-3xl font-black tracking-tight text-[color:var(--fg-body)] sm:text-4xl">
            {game.title}
          </h1>
          <div className="flex flex-wrap justify-center gap-2 text-[0.75rem] font-semibold uppercase tracking-[0.2em] sm:justify-start">
            <span className="rounded-full border border-rose-300/60 px-3 py-1 text-rose-500 dark:border-rose-500/40">
              {formatPlayers(game.minPlayers, game.maxPlayers)}
            </span>
            <span className="rounded-full border border-indigo-300/60 px-3 py-1 text-indigo-500 dark:border-indigo-500/40">
              {formatPlayTime(game.playTime)}
            </span>
            <span className="rounded-full border border-teal-300/60 px-3 py-1 text-teal-500 dark:border-teal-500/40">
              重さ {formatWeight(game.weight)}
            </span>
          </div>
          {tags.length ? (
            <div className="flex flex-wrap justify-center gap-2 text-xs uppercase tracking-[0.2em] text-rose-400 sm:justify-start">
              {tags.map((tag) => (
                <span key={tag} className="rounded-full bg-rose-500/10 px-2 py-1 text-[0.65rem] font-semibold text-rose-400">
                  #{tag}
                </span>
              ))}
            </div>
          ) : null}
        </div>
      </header>

      {game.image ? (
        <div className="overflow-hidden rounded-2xl border border-slate-200 shadow-sm dark:border-slate-700">
          <Image
            src={game.image}
            alt={game.title}
            width={960}
            height={540}
            className="h-auto w-full object-cover"
            priority
          />
        </div>
      ) : null}

      <dl className="surface-card grid gap-4 rounded-2xl px-5 py-5 sm:grid-cols-2 sm:px-6 sm:py-6">
        <div>
          <dt className="text-xs font-semibold uppercase tracking-[0.28em] text-muted sm:tracking-[0.35em]">人数</dt>
          <dd className="text-lg font-semibold text-[color:var(--fg-body)]">{formatPlayers(game.minPlayers, game.maxPlayers)}</dd>
        </div>
        <div>
          <dt className="text-xs font-semibold uppercase tracking-[0.28em] text-muted sm:tracking-[0.35em]">時間</dt>
          <dd className="text-lg font-semibold text-[color:var(--fg-body)]">{formatPlayTime(game.playTime)}</dd>
        </div>
        <div>
          <dt className="text-xs font-semibold uppercase tracking-[0.28em] text-muted sm:tracking-[0.35em]">重さ</dt>
          <dd className="text-lg font-semibold text-[color:var(--fg-body)]">{formatWeight(game.weight)}</dd>
        </div>
        <div>
          <dt className="text-xs font-semibold uppercase tracking-[0.28em] text-muted sm:tracking-[0.35em]">タグ</dt>
          <dd className="text-sm text-muted">
            {tags.length ? tags.join(", ") : "-"}
          </dd>
        </div>
      </dl>

      <MarkdownContent source={game.body} />
    </article>
  );
}

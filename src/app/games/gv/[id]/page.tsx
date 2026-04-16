import { notFound } from "next/navigation";
import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { fetchGVGameById } from "@/lib/gamevault";

const STATUS_LABEL: Record<string, string> = {
  owned: "所持",
  wishlist: "欲しい",
  lent: "貸出中",
};

const STATUS_COLOR: Record<string, string> = {
  owned: "border-teal-300/60 text-teal-500 dark:border-teal-500/40",
  wishlist: "border-amber-300/60 text-amber-500 dark:border-amber-500/40",
  lent: "border-rose-300/60 text-rose-500 dark:border-rose-500/40",
};

const PLAY_STATUS_LABEL: Record<string, string> = {
  played: "プレイ済み",
  interested: "興味あり",
  favorite: "お気に入り",
};

function formatPlayers(min?: number | null, max?: number | null) {
  if (min && max) return `${min}–${max}人`;
  if (min) return `${min}人`;
  if (max) return `${max}人`;
  return "不明";
}

function formatPlayTime(minutes?: number | null) {
  if (!minutes) return "不明";
  return `${minutes}分`;
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ id: string }>;
}): Promise<Metadata> {
  const { id } = await params;
  const game = await fetchGVGameById(id);
  if (!game) return {};
  return {
    title: game.title,
    description: game.memo ?? `${game.title}のゲーム情報`,
    openGraph: {
      title: `${game.title} | Dice Journal`,
      type: "article",
      locale: "ja_JP",
      ...(game.image_url ? { images: [{ url: game.image_url, alt: game.title }] } : {}),
    },
  };
}

export default async function GVGameDetail({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const game = await fetchGVGameById(id);
  if (!game) return notFound();

  const isSupabaseUrl = game.image_url?.startsWith("https://mzlzlvsbrfudpxqfhgtx.supabase.co");

  return (
    <article className="space-y-8">
      <header className="space-y-4">
        <div className="flex flex-col gap-2 text-center sm:text-left">
          <Link
            href="/games"
            className="text-xs font-semibold uppercase tracking-[0.28em] sm:tracking-[0.35em] text-muted underline decoration-dotted underline-offset-4"
          >
            ← コレクション一覧
          </Link>
          <span className="mt-2 text-xs font-semibold uppercase tracking-[0.28em] sm:tracking-[0.35em] text-teal-500">
            Game Profile
          </span>
          <h1 className="text-3xl font-black tracking-tight text-(--fg-body) sm:text-4xl">
            {game.title}
          </h1>
          <div className="flex flex-wrap justify-center gap-2 text-[0.75rem] font-semibold uppercase tracking-[0.2em] sm:justify-start">
            <span className="rounded-full border border-rose-300/60 px-3 py-1 text-rose-500 dark:border-rose-500/40">
              {formatPlayers(game.player_count_min, game.player_count_max)}
            </span>
            <span className="rounded-full border border-indigo-300/60 px-3 py-1 text-indigo-500 dark:border-indigo-500/40">
              {formatPlayTime(game.play_time)}
            </span>
            <span className={`rounded-full border px-3 py-1 ${STATUS_COLOR[game.status] ?? ""}`}>
              {STATUS_LABEL[game.status] ?? game.status}
            </span>
            {game.play_status ? (
              <span className="rounded-full border border-violet-300/60 px-3 py-1 text-violet-500 dark:border-violet-500/40">
                {PLAY_STATUS_LABEL[game.play_status] ?? game.play_status}
              </span>
            ) : null}
          </div>
        </div>
      </header>

      {game.image_url ? (
        <div className="overflow-hidden rounded-2xl border border-slate-200 shadow-sm dark:border-slate-700">
          <Image
            src={game.image_url}
            alt={game.title}
            width={960}
            height={540}
            className="h-auto w-full object-cover"
            priority
            unoptimized={!isSupabaseUrl}
          />
        </div>
      ) : null}

      <dl className="surface-card grid gap-4 rounded-2xl px-5 py-5 sm:grid-cols-2 sm:px-6 sm:py-6">
        <div>
          <dt className="text-xs font-semibold uppercase tracking-[0.28em] sm:tracking-[0.35em] text-muted">人数</dt>
          <dd className="text-lg font-semibold text-(--fg-body)">
            {formatPlayers(game.player_count_min, game.player_count_max)}
          </dd>
        </div>
        <div>
          <dt className="text-xs font-semibold uppercase tracking-[0.28em] sm:tracking-[0.35em] text-muted">時間</dt>
          <dd className="text-lg font-semibold text-(--fg-body)">{formatPlayTime(game.play_time)}</dd>
        </div>
        {game.category ? (
          <div>
            <dt className="text-xs font-semibold uppercase tracking-[0.28em] sm:tracking-[0.35em] text-muted">カテゴリ</dt>
            <dd className="text-lg font-semibold text-(--fg-body)">{game.category}</dd>
          </div>
        ) : null}
        <div>
          <dt className="text-xs font-semibold uppercase tracking-[0.28em] sm:tracking-[0.35em] text-muted">所持状況</dt>
          <dd className="text-lg font-semibold text-(--fg-body)">
            {STATUS_LABEL[game.status] ?? game.status}
          </dd>
        </div>
      </dl>

      {game.memo ? (
        <section className="surface-card rounded-2xl px-5 py-5 sm:px-6 sm:py-6">
          <h2 className="mb-3 text-xs font-semibold uppercase tracking-[0.28em] sm:tracking-[0.35em] text-muted">
            メモ
          </h2>
          <p className="whitespace-pre-wrap text-sm leading-relaxed text-(--fg-body)">
            {game.memo}
          </p>
        </section>
      ) : null}
    </article>
  );
}

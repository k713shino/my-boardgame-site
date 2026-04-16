"use client";

import { useMemo } from "react";
import Link from "next/link";
import Image from "next/image";
import type { GVGame } from "@/lib/gamevault";

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

function formatPlayers(min?: number | null, max?: number | null) {
  if (min && max) return `${min}–${max}人`;
  if (min) return `${min}人`;
  if (max) return `${max}人`;
  return null;
}

function shuffle<T>(arr: T[]): T[] {
  const copy = [...arr];
  for (let i = copy.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [copy[i], copy[j]] = [copy[j], copy[i]];
  }
  return copy;
}

export default function HomeCollectionSection({ games }: { games: GVGame[] }) {
  const picked = useMemo(() => shuffle(games).slice(0, 6), [games]);

  if (picked.length === 0) return null;

  return (
    <div className="grid gap-4 sm:grid-cols-2">
      {picked.map((g) => (
        <Link
          key={g.id}
          href={`/games/gv/${g.id}`}
          className="group surface-card flex flex-col gap-3 rounded-2xl px-6 py-6 text-left transition hover:-translate-y-1 hover:border-teal-400/70 hover:shadow-[0_30px_80px_-50px_rgba(45,212,191,0.45)]"
        >
          <div className="flex items-start gap-4">
            {g.image_url ? (
              <Image
                src={g.image_url}
                alt={g.title}
                width={56}
                height={56}
                className="h-14 w-14 shrink-0 rounded-xl object-cover"
                unoptimized={!g.image_url.startsWith("https://mzlzlvsbrfudpxqfhgtx.supabase.co")}
              />
            ) : null}
            <div className="min-w-0 flex-1">
              <span className="text-xs font-semibold uppercase tracking-[0.28em] sm:tracking-[0.35em] text-muted">
                {g.category ?? "Featured"}
              </span>
              <p className="mt-1 text-xl font-black tracking-tight text-(--fg-body) transition group-hover:text-teal-500">
                {g.title}
              </p>
            </div>
          </div>
          <div className="flex flex-wrap gap-2 text-[0.7rem] font-semibold uppercase tracking-[0.2em]">
            {formatPlayers(g.player_count_min, g.player_count_max) ? (
              <span className="rounded-full border border-rose-300/60 px-2 py-1 text-rose-500 dark:border-rose-500/40">
                {formatPlayers(g.player_count_min, g.player_count_max)}
              </span>
            ) : null}
            {g.play_time ? (
              <span className="rounded-full border border-indigo-300/60 px-2 py-1 text-indigo-500 dark:border-indigo-500/40">
                {g.play_time}分
              </span>
            ) : null}
            <span className={`rounded-full border px-2 py-1 ${STATUS_COLOR[g.status] ?? ""}`}>
              {STATUS_LABEL[g.status] ?? g.status}
            </span>
          </div>
        </Link>
      ))}
    </div>
  );
}

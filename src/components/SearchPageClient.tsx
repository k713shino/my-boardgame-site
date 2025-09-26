"use client";

import { useMemo, useState } from "react";
import Fuse from "fuse.js";
import Link from "next/link";

export type SearchRow =
  | { type: "post"; title: string; slug: string; date: string; tags?: string[]; category?: string }
  | { type: "game"; title: string; id: string; tags?: string[] }
  | { type: "play"; id: string; date: string; gameId: string; tags?: string[] };

type SearchPageClientProps = {
  dataset: SearchRow[];
};

export function SearchPageClient({ dataset }: SearchPageClientProps) {
  const [q, setQ] = useState("");
  const fuse = useMemo(
    () =>
      new Fuse(dataset, {
        keys: ["title", "slug", "date", "tags", "category", "id", "gameId"],
        threshold: 0.35,
        ignoreLocation: true,
      }),
    [dataset],
  );

  const results = q ? fuse.search(q).map((r) => r.item) : [];

  return (
    <div className="space-y-6">
      <header className="space-y-3 text-center sm:text-left">
        <span className="text-xs font-semibold uppercase tracking-[0.28em] text-indigo-500 sm:tracking-[0.35em]">Search</span>
        <h1 className="text-3xl font-black tracking-tight text-[color:var(--fg-body)] sm:text-4xl">サイト内検索</h1>
        <p className="text-sm text-muted sm:text-base">キーワード、タグ、ゲームIDなどで横断検索できます。</p>
      </header>
      <div className="surface-card space-y-4 rounded-2xl px-5 py-5 sm:px-6 sm:py-6">
        <label htmlFor="site-search" className="text-sm font-medium">
          検索ワード
        </label>
        <input
          id="site-search"
          value={q}
          onChange={(e) => setQ(e.target.value)}
          className="w-full rounded-xl border border-slate-300/60 bg-white/80 px-3 py-2 text-sm shadow-sm focus:border-indigo-400 focus:outline-none focus:ring-0 dark:border-slate-600/60 dark:bg-slate-900/70 dark:text-slate-100"
          placeholder="キーワード、タグ、ゲームIDなどで検索"
        />
      </div>
      <div className="space-y-3">
        {results.length ? (
          results.map((r) => {
            if (r.type === "post") {
              const tags = Array.isArray(r.tags) ? r.tags : [];
              return (
                <Link
                  key={"post-" + r.slug}
                  href={"/posts/" + r.slug}
                  className="group surface-card block rounded-2xl px-5 py-4 sm:px-6 sm:py-5 transition hover:-translate-y-1 hover:border-rose-400/70 hover:shadow-[0_30px_80px_-50px_rgba(244,114,182,0.6)]"
                >
                  <span className="text-xs font-semibold uppercase tracking-[0.28em] text-muted sm:tracking-[0.35em]">
                    記事 / {r.date}
                    {r.category ? " ・ " + r.category : ""}
                  </span>
                  <span className="mt-1 block text-lg font-semibold tracking-tight text-[color:var(--fg-body)] transition group-hover:text-rose-500 sm:text-xl">
                    {r.title}
                  </span>
                  {tags.length ? (
                    <div className="mt-2 flex flex-wrap gap-2 text-[0.65rem] font-semibold uppercase tracking-[0.2em] text-rose-400">
                      {tags.slice(0, 4).map((tag) => (
                        <span key={tag} className="rounded-full bg-rose-500/10 px-2 py-1">
                          {"#" + tag}
                        </span>
                      ))}
                    </div>
                  ) : null}
                </Link>
              );
            }
            if (r.type === "game") {
              const tags = Array.isArray(r.tags) ? r.tags : [];
              return (
                <Link
                  key={"game-" + r.id}
                  href={"/games/" + r.id}
                  className="group surface-card block rounded-2xl px-5 py-4 sm:px-6 sm:py-5 transition hover:-translate-y-1 hover:border-indigo-400/70 hover:shadow-[0_30px_80px_-50px_rgba(99,102,241,0.6)]"
                >
                  <span className="text-xs font-semibold uppercase tracking-[0.28em] text-muted sm:tracking-[0.35em]">ゲーム</span>
                  <span className="mt-1 block text-lg font-semibold tracking-tight text-[color:var(--fg-body)] transition group-hover:text-indigo-500 sm:text-xl">
                    {r.title}
                  </span>
                  {tags.length ? (
                    <div className="mt-2 flex flex-wrap gap-2 text-[0.65rem] font-semibold uppercase tracking-[0.2em] text-indigo-400">
                      {tags.slice(0, 4).map((tag) => (
                        <span key={tag} className="rounded-full bg-indigo-500/10 px-2 py-1">
                          {"#" + tag}
                        </span>
                      ))}
                    </div>
                  ) : null}
                </Link>
              );
            }
            const tags = Array.isArray(r.tags) ? r.tags : [];
            return (
              <Link
                key={"play-" + r.id}
                href={"/plays/" + encodeURIComponent(r.id)}
                className="group surface-card block rounded-2xl px-5 py-4 sm:px-6 sm:py-5 transition hover:-translate-y-1 hover:border-teal-400/70 hover:shadow-[0_30px_80px_-50px_rgba(45,212,191,0.45)]"
              >
                <span className="text-xs font-semibold uppercase tracking-[0.28em] text-muted sm:tracking-[0.35em]">プレイ記録 / {r.date}</span>
                <span className="mt-1 block text-lg font-semibold tracking-tight text-[color:var(--fg-body)] transition group-hover:text-teal-500 sm:text-xl">
                  {r.gameId}
                </span>
                {tags.length ? (
                  <div className="mt-2 flex flex-wrap gap-2 text-[0.65rem] font-semibold uppercase tracking-[0.2em] text-teal-400">
                    {tags.slice(0, 4).map((tag) => (
                      <span key={tag} className="rounded-full bg-teal-500/10 px-2 py-1">
                        {"#" + tag}
                      </span>
                    ))}
                  </div>
                ) : null}
              </Link>
            );
          })
        ) : q ? (
          <p className="text-sm text-muted">該当する結果が見つかりませんでした。</p>
        ) : (
          <p className="text-sm text-muted">検索ワードを入力してください。</p>
        )}
      </div>
    </div>
  );
}

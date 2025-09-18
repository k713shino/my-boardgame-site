"use client";

import { useMemo, useState } from "react";
import Fuse from "fuse.js";

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
    <div>
      <h1 className="mb-4 text-2xl font-bold">検索</h1>
      <input
        value={q}
        onChange={(e) => setQ(e.target.value)}
        className="w-full rounded border px-3 py-2"
        placeholder="キーワード、タグ、ゲームIDなどで検索"
      />
      <ul className="mt-4 space-y-2">
        {results.map((r) => {
          if (r.type === "post") {
            return (
              <li key={`post-${r.slug}`} className="rounded border p-3">
                <a className="underline" href={`/posts/${r.slug}`}>
                  [記事] {r.title}
                </a>
                <div className="text-sm text-gray-500">
                  {r.date} {r.category ? ` / ${r.category}` : ""} {(r.tags ?? []).join(", ")}
                </div>
              </li>
            );
          }
          if (r.type === "game") {
            return (
              <li key={`game-${r.id}`} className="rounded border p-3">
                <a className="underline" href={`/games/${r.id}`}>
                  [ゲーム] {r.title}
                </a>
                <div className="text-sm text-gray-500">{(r.tags ?? []).join(", ")}</div>
              </li>
            );
          }
          return (
            <li key={`play-${r.id}`} className="rounded border p-3">
              <a className="underline" href={`/plays/${r.id}`}>
                [プレイ記録] {r.date} / {r.gameId}
              </a>
              <div className="text-sm text-gray-500">{(r.tags ?? []).join(", ")}</div>
            </li>
          );
        })}
      </ul>
    </div>
  );
}

"use client";

import { useMemo, useState } from "react";
import Fuse from "fuse.js";

// SSR時に fs 参照関数は使えないので、必要情報だけを埋め込む
import { getAllPosts, getAllGames, getAllPlays } from "@/lib/content";

type Row =
  | { type: "post"; title: string; slug: string; date: string; tags?: string[]; category?: string; }
  | { type: "game"; title: string; id: string; tags?: string[]; }
  | { type: "play"; id: string; date: string; gameId: string; tags?: string[]; };

export default function SearchPage() {
  // サーバー関数を呼んで静的データを作る（App Routerは同一ファイル内でOK）
  const dataset: Row[] = useMemo(() => {
    const posts = getAllPosts().map((p): Row => ({
      type: "post",
      title: p.title,
      slug: p.slug,
      date: p.date,
      tags: p.tags,
      category: p.category,
    }));
    const games = getAllGames().map((g): Row => ({
      type: "game",
      title: g.title,
      id: g.id,
      tags: g.tags,
    }));
    const plays = getAllPlays().map((pl): Row => ({
      type: "play",
      id: pl.id,
      date: pl.date,
      gameId: pl.gameId,
      tags: pl.tags,
    }));
    return [...posts, ...games, ...plays];
  }, []);

  const [q, setQ] = useState("");
  const fuse = useMemo(() => new Fuse(dataset, {
    keys: [
      "title", "slug", "date", "tags", "category",
      "id", "gameId"
    ],
    threshold: 0.35, // あいまい度：小さいほど厳密
    ignoreLocation: true,
  }), [dataset]);

  const results = q ? fuse.search(q).map(r => r.item) : [];

  return (
    <div>
      <h1 className="text-2xl font-bold mb-4">検索</h1>
      <input
        value={q}
        onChange={(e) => setQ(e.target.value)}
        className="w-full border rounded px-3 py-2"
        placeholder="キーワード、タグ、ゲームIDなどで検索"
      />
      <ul className="mt-4 space-y-2">
        {results.map((r) => {
          if (r.type === "post") {
            return (
              <li key={`post-${r.slug}`} className="border rounded p-3">
                <a className="underline" href={`/posts/${r.slug}`}>[記事] {r.title}</a>
                <div className="text-sm text-gray-500">{r.date} {r.category ? ` / ${r.category}` : ""} {(r.tags ?? []).join(", ")}</div>
              </li>
            );
          }
          if (r.type === "game") {
            return (
              <li key={`game-${r.id}`} className="border rounded p-3">
                <a className="underline" href={`/games/${r.id}`}>[ゲーム] {r.title}</a>
                <div className="text-sm text-gray-500">{(r.tags ?? []).join(", ")}</div>
              </li>
            );
          }
          return (
            <li key={`play-${r.id}`} className="border rounded p-3">
              <a className="underline" href={`/plays/${r.id}`}>[プレイ記録] {r.date} / {r.gameId}</a>
              <div className="text-sm text-gray-500">{(r.tags ?? []).join(", ")}</div>
            </li>
          );
        })}
      </ul>
    </div>
  );
}

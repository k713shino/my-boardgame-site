"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import type { SavedRoster } from "../builder/BuilderClient";

const ROLE_ORDER = ["HQ", "Battleline", "Transport", "Other", "Heavy"] as const;

export function RostersClient() {
  const [rosters, setRosters] = useState<SavedRoster[]>([]);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    const raw = localStorage.getItem("wh40k_rosters");
    if (raw) {
      try {
        setRosters(JSON.parse(raw));
      } catch {
        setRosters([]);
      }
    }
    setLoaded(true);
  }, []);

  const deleteRoster = (id: string) => {
    if (!confirm("このロスターを削除しますか？")) return;
    const updated = rosters.filter((r) => r.id !== id);
    setRosters(updated);
    localStorage.setItem("wh40k_rosters", JSON.stringify(updated));
  };

  if (!loaded) {
    return (
      <div className="py-20 text-center text-muted text-sm">読み込み中…</div>
    );
  }

  return (
    <div className="mx-auto max-w-3xl space-y-8 px-4 py-10">
      <div className="flex items-center justify-between">
        <div>
          <Link href="/wh40k" className="text-xs text-muted hover:text-rose-500 transition">
            ← WH40K
          </Link>
          <h1 className="mt-1 text-2xl font-black uppercase tracking-tight">
            My Rosters
          </h1>
          <p className="text-xs text-muted">{rosters.length} 件保存済み</p>
        </div>
        <Link
          href="/wh40k/builder"
          className="rounded-full bg-rose-500 px-5 py-2 text-xs font-bold text-white transition hover:bg-rose-400"
        >
          ＋ 新規作成
        </Link>
      </div>

      {rosters.length === 0 ? (
        <div className="surface-card rounded-2xl px-6 py-16 text-center">
          <p className="text-3xl">⚔️</p>
          <p className="mt-3 text-sm text-muted">
            保存されたロスターがありません
          </p>
          <Link
            href="/wh40k/builder"
            className="mt-4 inline-block rounded-full bg-rose-500 px-6 py-2 text-xs font-bold text-white transition hover:bg-rose-400"
          >
            ロスターを作成する
          </Link>
        </div>
      ) : (
        <div className="space-y-3">
          {[...rosters].reverse().map((roster) => {
            const total = roster.units.reduce((s, u) => s + u.pts, 0);
            const isOver = total > roster.pointsLimit;
            return (
              <div
                key={roster.id}
                className="surface-card rounded-2xl px-5 py-4 space-y-3"
              >
                <div className="flex items-start justify-between gap-3">
                  <div className="min-w-0">
                    <h2 className="truncate text-sm font-bold">{roster.name}</h2>
                    <p className="text-[0.65rem] text-muted">
                      {new Date(roster.savedAt).toLocaleDateString("ja-JP")} ·{" "}
                      <span className="capitalize">{roster.faction}</span> ·{" "}
                      {roster.pointsLimit}pt制
                      {roster.detachment && ` · ${roster.detachment}`}
                      {roster.isPublic ? " · Public" : ""}
                    </p>
                  </div>
                  <div className="shrink-0 text-right">
                    <p
                      className={`text-lg font-black ${isOver ? "text-red-500" : "text-[color:var(--accent-primary)]"}`}
                    >
                      {total}
                      <span className="text-xs font-normal text-muted">
                        /{roster.pointsLimit}
                      </span>
                    </p>
                    {isOver && (
                      <p className="text-[0.6rem] text-red-500">超過</p>
                    )}
                  </div>
                </div>

                {/* Unit summary by role */}
                <div className="flex flex-wrap gap-1.5 text-[0.65rem]">
                  {ROLE_ORDER.map((role) => {
                    const count = roster.units.filter((u) => u.role === role).length;
                    if (!count) return null;
                    return (
                      <span
                        key={role}
                        className="rounded-full border border-slate-200 bg-white/90 px-2 py-0.5 text-[0.65rem] dark:border-white/30 dark:bg-white/85 dark:text-slate-800"
                      >
                        {role} ×{count}
                      </span>
                    );
                  })}
                </div>

                <div className="flex gap-2">
                  <Link
                    href={`/wh40k/rosters/${roster.id}`}
                    className="flex-1 rounded-full border border-slate-300/60 py-1.5 text-center text-xs font-semibold transition hover:border-rose-400/60 dark:border-slate-600/60"
                  >
                    詳細を見る
                  </Link>
                  <button
                    onClick={() => deleteRoster(roster.id)}
                    className="rounded-full border border-slate-300/60 px-4 py-1.5 text-xs text-muted transition hover:border-red-400/60 hover:text-red-400 dark:border-slate-600/60"
                  >
                    削除
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}

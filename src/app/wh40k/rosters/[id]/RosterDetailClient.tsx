"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import type { SavedRoster, RosterEntry } from "../../builder/BuilderClient";
import type { UnitRole } from "../../types";

/** ユニット詳細URLを生成（全陣営対応）
 * Unit.slug = "aeldari-craftworlds--guardian-defenders" をそのままパスに使用
 * 旧データ（slug なし）は faction + 名前からハイフン区切りのスラッグを再現
 */
function unitDetailUrl(entry: RosterEntry, faction: string): string | null {
  // 新形式: slug フィールドがある場合はそのまま使用
  if (entry.slug) {
    return `/wh40k/units/${entry.slug}`;
  }

  // 旧形式: slug なし → faction + 名前から再現
  // faction id はアンダースコア（例: "aeldari_craftworlds"）→ ハイフンに変換
  const factionSlug = faction.replace(/_/g, "-");
  const unitCode = entry.name
    .toLowerCase()
    .replace(/['''\u2018\u2019`]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");
  return `/wh40k/units/${factionSlug}--${unitCode}`;
}

const ROLES: UnitRole[] = ["HQ", "Battleline", "Transport", "Other", "Heavy"];

const ROLE_META: Record<UnitRole, { label: string; text: string; border: string }> = {
  HQ: { label: "Character", text: "text-rose-500 dark:text-rose-400", border: "border-rose-400/40" },
  Battleline: { label: "Battleline", text: "text-emerald-500 dark:text-emerald-400", border: "border-emerald-400/40" },
  Transport: { label: "Dedicated Transport", text: "text-amber-500 dark:text-amber-400", border: "border-amber-400/40" },
  Other: { label: "Other", text: "text-sky-500 dark:text-sky-400", border: "border-sky-400/40" },
  Heavy: { label: "Heavy", text: "text-red-500 dark:text-red-400", border: "border-red-400/40" },
};

function groupByRole(units: RosterEntry[]) {
  const map = Object.fromEntries(
    ROLES.map((r) => [r, [] as RosterEntry[]])
  ) as Record<UnitRole, RosterEntry[]>;
  for (const u of units) map[u.role]?.push(u);
  return map;
}

export function RosterDetailClient({ id }: { id: string }) {
  const [roster, setRoster] = useState<SavedRoster | null>(null);
  const [loaded, setLoaded] = useState(false);
  const [notFound, setNotFound] = useState(false);

  useEffect(() => {
    // Try localStorage first
    const raw = localStorage.getItem("wh40k_rosters");
    if (raw) {
      try {
        const rosters: SavedRoster[] = JSON.parse(raw);
        const found = rosters.find((r) => r.id === id);
        if (found) {
          setRoster(found);
          setLoaded(true);
          return;
        }
      } catch {
        // continue
      }
    }
    // Not found
    setNotFound(true);
    setLoaded(true);
  }, [id]);

  const shareRoster = () => {
    if (!roster) return;
    const data = {
      name: roster.name,
      faction: roster.faction,
      pointsLimit: roster.pointsLimit,
      units: roster.units,
    };
    const encoded = btoa(encodeURIComponent(JSON.stringify(data)));
    const url = `${window.location.origin}/wh40k/rosters/share?d=${encoded}`;
    navigator.clipboard
      ?.writeText(url)
      .then(() => alert("✅ 共有URLをクリップボードにコピーしました"))
      .catch(() => prompt("共有URL:", url));
  };

  if (!loaded) {
    return (
      <div className="py-20 text-center text-sm text-muted">読み込み中…</div>
    );
  }

  if (notFound || !roster) {
    return (
      <div className="mx-auto max-w-2xl px-4 py-20 text-center">
        <p className="text-4xl">⚔️</p>
        <p className="mt-4 text-sm text-muted">ロスターが見つかりません</p>
        <Link
          href="/wh40k/rosters"
          className="mt-4 inline-block text-xs text-rose-500 underline"
        >
          ← ロスター一覧に戻る
        </Link>
      </div>
    );
  }

  const byRole = groupByRole(roster.units);
  const total = roster.units.reduce((s, u) => s + u.pts, 0);
  const isOver = total > roster.pointsLimit;

  return (
    <div className="mx-auto max-w-2xl space-y-6 px-4 py-10">
      {/* Back */}
      <Link
        href="/wh40k/rosters"
        className="text-xs text-muted transition hover:text-rose-500"
      >
        ← ロスター一覧
      </Link>

      {/* Header */}
      <div className="surface-card rounded-2xl p-5 space-y-4">
        <div className="flex items-start justify-between gap-3">
          <div>
            <h1 className="text-xl font-black">{roster.name}</h1>
            <p className="mt-0.5 text-[0.65rem] text-muted">
              {new Date(roster.savedAt).toLocaleDateString("ja-JP")} ·{" "}
              <span className="capitalize">{roster.faction}</span> ·{" "}
              {roster.pointsLimit}pt制
              {roster.detachment && ` · ${roster.detachment}`}
            </p>
          </div>
          <div className="shrink-0 text-right">
            <p
              className={`text-3xl font-black ${isOver ? "text-red-500" : "text-[color:var(--accent-primary)]"}`}
            >
              {total}
              <span className="text-sm font-normal text-muted">
                /{roster.pointsLimit}pt
              </span>
            </p>
            {isOver && (
              <p className="text-xs font-bold text-red-500">⚠️ ポイント超過</p>
            )}
          </div>
        </div>

        {/* Point bar */}
        <div className="space-y-1">
          <div className="h-2 w-full overflow-hidden rounded-full bg-slate-200 dark:bg-slate-700">
            <div
              className={`h-full rounded-full ${
                isOver
                  ? "bg-red-500"
                  : total / roster.pointsLimit > 0.9
                    ? "bg-amber-400"
                    : "bg-gradient-to-r from-sky-500 to-indigo-500"
              }`}
              style={{
                width: `${Math.min(100, (total / roster.pointsLimit) * 100)}%`,
              }}
            />
          </div>
        </div>

        {/* Actions */}
        <div className="flex gap-2">
          <Link
            href="/wh40k/builder"
            className="flex-1 rounded-full border border-slate-300/60 py-2 text-center text-xs font-semibold transition hover:border-rose-400/60 dark:border-slate-600/60"
          >
            ✏️ 新規作成
          </Link>
          <button
            onClick={shareRoster}
            className="flex-1 rounded-full bg-rose-500 py-2 text-xs font-bold text-white transition hover:bg-rose-400"
          >
            🔗 共有URLをコピー
          </button>
        </div>
      </div>

      {/* Units by role */}
      {ROLES.map((role) => {
        const entries = byRole[role];
        if (!entries.length) return null;
        const meta = ROLE_META[role];
        const rolePts = entries.reduce((s, u) => s + u.pts, 0);
        return (
          <section key={role} className="space-y-2">
            <div className="flex items-center gap-2">
              <h2 className={`text-[0.65rem] font-bold uppercase tracking-widest ${meta.text}`}>
                {meta.label}
              </h2>
              <span className="text-[0.65rem] text-muted">{rolePts}pt</span>
            </div>
            <div className="space-y-1.5">
              {entries.map((entry) => (
                <div
                  key={entry.entryId}
                  className={`surface-card rounded-xl border px-4 py-2.5 ${meta.border}`}
                >
                  <div className="flex items-center gap-3">
                    <div className="min-w-0 flex-1">
                      {unitDetailUrl(entry, roster.faction) ? (
                        <Link
                          href={unitDetailUrl(entry, roster.faction)!}
                          className={`block truncate text-xs font-semibold underline decoration-dotted underline-offset-2 transition hover:opacity-70 ${meta.text}`}
                        >
                          {entry.name}
                        </Link>
                      ) : (
                        <p className={`truncate text-xs font-semibold ${meta.text}`}>
                          {entry.name}
                        </p>
                      )}
                      {entry.nameJa && (
                        <p className="truncate text-[0.6rem] text-muted">
                          {entry.nameJa}
                        </p>
                      )}
                    </div>
                    <span className={`shrink-0 text-xs font-bold ${meta.text}`}>
                      {entry.pts}pt
                    </span>
                  </div>
                  {entry.weaponSelections && entry.weaponSelections.length > 0 && (
                    <ul className="mt-1.5 space-y-0.5 border-t border-slate-200/60 pt-1.5 dark:border-slate-700/60">
                      {entry.weaponSelections.map((ws) => (
                        <li key={ws.groupId} className="flex items-baseline gap-1 text-[0.6rem] text-muted">
                          <span className="shrink-0 opacity-50">↳</span>
                          <span>
                            <span className="opacity-60">{ws.groupName}:</span>{" "}
                            <span className="font-medium text-foreground/70">
                              {ws.selectedNames.join(" / ")}
                            </span>
                            {ws.pointsDelta !== 0 && (
                              <span className={`ml-1 ${ws.pointsDelta > 0 ? "text-amber-500" : "text-emerald-500"}`}>
                                ({ws.pointsDelta > 0 ? "+" : ""}{ws.pointsDelta}pt)
                              </span>
                            )}
                          </span>
                        </li>
                      ))}
                    </ul>
                  )}
                </div>
              ))}
            </div>
          </section>
        );
      })}

      {/* Disclaimer */}
      <p className="rounded-xl border border-amber-300/40 bg-amber-50/50 px-4 py-3 text-[0.65rem] leading-relaxed text-amber-700 dark:border-amber-500/20 dark:bg-amber-500/5 dark:text-amber-400">
        ⚠️ 大会使用前は必ず GW 公式 <strong>Munitorum Field Manual</strong> でポイントを確認してください。
      </p>
    </div>
  );
}

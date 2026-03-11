"use client";

import { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import type { RosterEntry } from "../../builder/BuilderClient";
import type { UnitRole } from "../../types";

type SharedData = {
  name: string;
  faction: string;
  detachment?: string;
  pointsLimit: number;
  units: RosterEntry[];
};

const ROLES: UnitRole[] = ["HQ", "Battleline", "Transport", "Other", "Heavy"];
const ROLE_META: Record<UnitRole, { label: string; text: string; border: string }> = {
  HQ: { label: "Character", text: "text-rose-500 dark:text-rose-400", border: "border-rose-400/40" },
  Battleline: { label: "Battleline", text: "text-emerald-500 dark:text-emerald-400", border: "border-emerald-400/40" },
  Transport: { label: "Dedicated Transport", text: "text-amber-500 dark:text-amber-400", border: "border-amber-400/40" },
  Other: { label: "Other", text: "text-sky-500 dark:text-sky-400", border: "border-sky-400/40" },
  Heavy: { label: "Heavy", text: "text-red-500 dark:text-red-400", border: "border-red-400/40" },
};

export function SharedRosterClient() {
  const searchParams = useSearchParams();
  const [roster, setRoster] = useState<SharedData | null>(null);
  const [error, setError] = useState(false);

  useEffect(() => {
    const d = searchParams.get("d");
    if (!d) { setError(true); return; }
    try {
      const decoded = JSON.parse(decodeURIComponent(atob(d)));
      setRoster(decoded);
    } catch {
      setError(true);
    }
  }, [searchParams]);

  if (error) {
    return (
      <div className="mx-auto max-w-2xl px-4 py-20 text-center">
        <p className="text-4xl">⚔️</p>
        <p className="mt-4 text-sm text-muted">ロスターデータが無効です</p>
        <Link href="/wh40k" className="mt-4 inline-block text-xs text-rose-500 underline">
          ← WH40K Hub に戻る
        </Link>
      </div>
    );
  }

  if (!roster) {
    return <div className="py-20 text-center text-sm text-muted">読み込み中…</div>;
  }

  const total = roster.units.reduce((s, u) => s + u.pts, 0);
  const isOver = total > roster.pointsLimit;
  const byRole = Object.fromEntries(
    ROLES.map((r) => [r, roster.units.filter((u) => u.role === r)])
  ) as Record<UnitRole, RosterEntry[]>;

  return (
    <div className="mx-auto max-w-2xl space-y-6 px-4 py-10">
      <Link href="/wh40k" className="text-xs text-muted hover:text-rose-500 transition">
        ← WH40K Hub
      </Link>

      <div className="surface-card rounded-2xl p-5 space-y-3">
        <div className="flex items-start justify-between gap-3">
          <div>
            <p className="text-[0.65rem] font-semibold uppercase tracking-widest text-rose-500">
              共有ロスター
            </p>
            <h1 className="text-xl font-black">{roster.name}</h1>
            <p className="text-[0.65rem] text-muted capitalize">
              {roster.faction} · {roster.pointsLimit}pt制
              {roster.detachment && ` · ${roster.detachment}`}
            </p>
          </div>
          <p
            className={`text-3xl font-black ${isOver ? "text-red-500" : "text-[color:var(--accent-primary)]"}`}
          >
            {total}
            <span className="text-sm font-normal text-muted">/{roster.pointsLimit}pt</span>
          </p>
        </div>

        <div className="h-2 w-full overflow-hidden rounded-full bg-slate-200 dark:bg-slate-700">
          <div
            className={`h-full rounded-full ${
              isOver ? "bg-red-500" : "bg-gradient-to-r from-sky-500 to-indigo-500"
            }`}
            style={{ width: `${Math.min(100, (total / roster.pointsLimit) * 100)}%` }}
          />
        </div>

        <Link
          href="/wh40k/builder"
          className="block w-full rounded-full bg-rose-500 py-2 text-center text-xs font-bold text-white transition hover:bg-rose-400"
        >
          ⚔️ 自分のロスターを作る
        </Link>
      </div>

      {ROLES.map((role) => {
        const entries = byRole[role];
        if (!entries.length) return null;
        const meta = ROLE_META[role];
        return (
          <section key={role} className="space-y-2">
            <h2 className={`text-[0.65rem] font-bold uppercase tracking-widest ${meta.text}`}>
              {meta.label}
            </h2>
            <div className="space-y-1.5">
              {entries.map((entry) => (
                <div
                  key={entry.entryId}
                  className={`surface-card rounded-xl border px-4 py-2.5 ${meta.border}`}
                >
                  <div className="flex items-center gap-3">
                    <div className="min-w-0 flex-1">
                      <p className={`truncate text-xs font-semibold ${meta.text}`}>
                        {entry.name}
                      </p>
                      {entry.nameJa && (
                        <p className="truncate text-[0.6rem] text-muted">{entry.nameJa}</p>
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
    </div>
  );
}

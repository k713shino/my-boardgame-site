"use client";

import { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import type { RosterEntry } from "../../builder/BuilderClient";
import {
  groupByRole,
  resolveUnitDetailUrl,
  RosterMetaBar,
  RosterUnitsSection,
  ROSTER_ROLES,
} from "../../components/RosterViewParts";

type SharedData = {
  name: string;
  faction: string;
  detachment?: string;
  pointsLimit: number;
  units: RosterEntry[];
};

export function SharedRosterClient() {
  const searchParams = useSearchParams();
  const [roster, setRoster] = useState<SharedData | null>(null);
  const [error, setError] = useState(false);

  useEffect(() => {
    const dataParam = searchParams.get("d");
    if (!dataParam) {
      setError(true);
      return;
    }

    try {
      const decoded = JSON.parse(decodeURIComponent(atob(dataParam)));
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

  const total = roster.units.reduce((sum, unit) => sum + unit.pts, 0);
  const byRole = groupByRole(roster.units);
  const summary = ROSTER_ROLES
    .map((role) => ({ role, count: byRole[role].length }))
    .filter((row) => row.count > 0);

  return (
    <div className="mx-auto max-w-3xl space-y-6 px-4 py-8 sm:py-10">
      <nav className="flex flex-wrap items-center gap-2 text-xs text-muted">
        <Link href="/wh40k" className="transition hover:text-rose-500">
          WH40K
        </Link>
        <span>/</span>
        <span className="text-[color:var(--fg-body)]">共有ロスター</span>
      </nav>

      <header className="surface-card rounded-2xl p-5 space-y-4 sm:p-6">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
          <div className="space-y-1">
            <p className="text-[0.62rem] font-semibold uppercase tracking-[0.25em] text-rose-500">Shared Roster</p>
            <h1 className="text-xl font-black sm:text-2xl">{roster.name}</h1>
            <p className="text-[0.68rem] capitalize text-muted">
              {roster.faction} · {roster.pointsLimit}pt
              {roster.detachment ? ` · ${roster.detachment}` : ""}
            </p>
          </div>

          <Link
            href="/wh40k/builder"
            className="rounded-full bg-rose-500 px-4 py-2 text-center text-xs font-bold text-white transition hover:bg-rose-400"
          >
            Builderで複製して編集
          </Link>
        </div>

        <RosterMetaBar total={total} limit={roster.pointsLimit} summary={summary} />
      </header>

      <section className="space-y-2">
        <h2 className="text-[0.65rem] font-bold uppercase tracking-widest text-muted">Units</h2>
        <RosterUnitsSection
          byRole={byRole}
          resolveHref={(entry) => resolveUnitDetailUrl(entry, roster.faction)}
        />
      </section>
    </div>
  );
}

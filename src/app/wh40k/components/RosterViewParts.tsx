import Link from "next/link";
import type { RosterEntry } from "../builder/BuilderClient";
import type { UnitRole } from "../types";
import { getDetachmentBattlelineIds } from "@/data/wh40k-detachment-battlelines";

export const ROSTER_ROLES: UnitRole[] = ["HQ", "Battleline", "Transport", "Other", "Heavy"];

export const ROSTER_ROLE_META: Record<
  UnitRole,
  { label: string; text: string; border: string; chip: string }
> = {
  HQ: {
    label: "Character",
    text: "text-rose-500 dark:text-rose-400",
    border: "border-rose-400/40",
    chip: "bg-rose-500/10 text-rose-500 dark:text-rose-400",
  },
  Battleline: {
    label: "Battleline",
    text: "text-emerald-500 dark:text-emerald-400",
    border: "border-emerald-400/40",
    chip: "bg-emerald-500/10 text-emerald-500 dark:text-emerald-400",
  },
  Transport: {
    label: "Dedicated Transport",
    text: "text-amber-500 dark:text-amber-400",
    border: "border-amber-400/40",
    chip: "bg-amber-500/10 text-amber-500 dark:text-amber-400",
  },
  Other: {
    label: "Other",
    text: "text-sky-500 dark:text-sky-400",
    border: "border-sky-400/40",
    chip: "bg-sky-500/10 text-sky-500 dark:text-sky-400",
  },
  Heavy: {
    label: "Heavy",
    text: "text-red-500 dark:text-red-400",
    border: "border-red-400/40",
    chip: "bg-red-500/10 text-red-500 dark:text-red-400",
  },
};

export function resolveUnitDetailUrl(entry: RosterEntry, faction: string): string | null {
  if (entry.slug) {
    return `/wh40k/units/${entry.slug}`;
  }

  const factionSlug = faction.replace(/_/g, "-");
  const unitCode = entry.name
    .toLowerCase()
    .replace(/['''\u2018\u2019`]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");

  if (!unitCode) return null;
  return `/wh40k/units/${factionSlug}--${unitCode}`;
}

export function groupByRole(
  units: RosterEntry[],
  factionId?: string,
  detachmentName?: string
): Record<UnitRole, RosterEntry[]> {
  const map = Object.fromEntries(
    ROSTER_ROLES.map((role) => [role, [] as RosterEntry[]])
  ) as Record<UnitRole, RosterEntry[]>;

  const extraBattlelineIds =
    factionId && detachmentName
      ? getDetachmentBattlelineIds(factionId, detachmentName)
      : new Set<string>();

  for (const unit of units) {
    const effectiveRole =
      unit.role !== "Battleline" && extraBattlelineIds.has(unit.unitId)
        ? "Battleline"
        : unit.role;
    map[effectiveRole]?.push(unit);
  }

  return map;
}

export function RosterMetaBar({
  total,
  limit,
  summary,
}: {
  total: number;
  limit: number;
  summary: { role: UnitRole; count: number }[];
}) {
  const isOver = total > limit;
  const ratio = Math.min(100, (total / limit) * 100);

  return (
    <div className="space-y-3 rounded-xl border border-slate-200/70 bg-white/80 p-3 dark:border-slate-700/70 dark:bg-slate-900/50">
      <div className="flex items-end justify-between gap-3">
        <div>
          <p className="text-[0.62rem] font-semibold uppercase tracking-[0.25em] text-muted">Roster Summary</p>
          <p className={`text-2xl font-black ${isOver ? "text-red-500" : "text-[color:var(--accent-primary)]"}`}>
            {total}
            <span className="ml-1 text-sm font-medium text-muted">/ {limit}pt</span>
          </p>
        </div>
        <p className={`text-[0.65rem] font-semibold ${isOver ? "text-red-500" : "text-muted"}`}>
          {isOver ? `+${total - limit}pt over` : `${limit - total}pt remaining`}
        </p>
      </div>

      <div className="h-2 w-full overflow-hidden rounded-full bg-slate-200 dark:bg-slate-700">
        <div
          className={`h-full rounded-full ${isOver ? "bg-red-500" : ratio > 90 ? "bg-amber-400" : "bg-gradient-to-r from-sky-500 to-indigo-500"}`}
          style={{ width: `${ratio}%` }}
        />
      </div>

      {summary.length > 0 && (
        <div className="flex flex-wrap gap-1.5">
          {summary.map((row) => (
            <span
              key={row.role}
              className={`rounded-full px-2.5 py-0.5 text-[0.62rem] font-semibold ${ROSTER_ROLE_META[row.role].chip}`}
            >
              {ROSTER_ROLE_META[row.role].label}: {row.count}
            </span>
          ))}
        </div>
      )}
    </div>
  );
}

export function RosterUnitsSection({
  byRole,
  resolveHref,
  onRemoveEntry,
  onSetWarlord,
  warlordEntryId,
  compact = false,
}: {
  byRole: Record<UnitRole, RosterEntry[]>;
  resolveHref?: (entry: RosterEntry) => string | null;
  onRemoveEntry?: (entryId: string) => void;
  onSetWarlord?: (entryId: string | null) => void;
  warlordEntryId?: string | null;
  compact?: boolean;
}) {
  return (
    <div className={compact ? "space-y-3" : "space-y-5"}>
      {ROSTER_ROLES.map((role) => {
        const entries = byRole[role];
        if (!entries.length) return null;

        const meta = ROSTER_ROLE_META[role];
        const rolePts = entries.reduce((sum, entry) => sum + entry.pts, 0);

        return (
          <section key={role} className={compact ? "space-y-1.5" : "space-y-2"}>
            <div className="flex items-center gap-2">
              <h2 className={`${compact ? "text-[0.58rem]" : "text-[0.65rem]"} font-bold uppercase tracking-widest ${meta.text}`}>
                {meta.label}
              </h2>
              <span className={`${compact ? "text-[0.58rem]" : "text-[0.65rem]"} text-muted`}>
                {entries.length} units / {rolePts}pt
              </span>
            </div>

            <div className={compact ? "space-y-1" : "space-y-1.5"}>
              {entries.map((entry) => {
                const href = resolveHref?.(entry) ?? null;
                const isWarlord = warlordEntryId === entry.entryId;
                return (
                  <article
                    key={entry.entryId}
                    className={`surface-card rounded-xl border ${compact ? "px-3 py-2" : "px-4 py-2.5"} ${isWarlord ? "border-yellow-400/60 bg-yellow-500/5" : meta.border}`}
                  >
                    <div className="flex items-center gap-3">
                      <div className="min-w-0 flex-1">
                        <div className="flex items-center gap-1.5">
                          {isWarlord && (
                            <span className="shrink-0 text-[0.65rem]" title="Warlord">👑</span>
                          )}
                          {href ? (
                            <Link
                              href={href}
                              className={`block truncate ${compact ? "text-[0.7rem]" : "text-xs"} font-semibold underline decoration-dotted underline-offset-2 transition hover:opacity-70 ${meta.text}`}
                            >
                              {entry.name}
                            </Link>
                          ) : (
                            <p className={`truncate ${compact ? "text-[0.7rem]" : "text-xs"} font-semibold ${meta.text}`}>{entry.name}</p>
                          )}
                        </div>
                        {entry.nameJa && <p className={`${compact ? "text-[0.55rem]" : "text-[0.6rem]"} truncate text-muted`}>{entry.nameJa}</p>}
                      </div>

                      <span className={`shrink-0 ${compact ? "text-[0.68rem]" : "text-xs"} font-bold ${meta.text}`}>{entry.pts}pt</span>
                      {onSetWarlord && entry.role === "HQ" && (
                        <button
                          onClick={() => onSetWarlord(isWarlord ? null : entry.entryId)}
                          className={`shrink-0 text-[0.7rem] transition ${isWarlord ? "text-yellow-500 hover:text-yellow-400" : "text-muted hover:text-yellow-500"}`}
                          title={isWarlord ? "Warlord解除" : "Warlordに指定"}
                        >
                          👑
                        </button>
                      )}
                      {onRemoveEntry && (
                        <button
                          onClick={() => onRemoveEntry(entry.entryId)}
                          className="shrink-0 text-xs text-muted transition hover:text-red-400"
                          title="削除"
                        >
                          ✕
                        </button>
                      )}
                    </div>

                    {(entry.weaponSelections ?? []).length > 0 && (
                      <ul className="mt-1.5 space-y-0.5 border-t border-slate-200/60 pt-1.5 dark:border-slate-700/60">
                        {entry.weaponSelections.map((ws) => (
                          <li key={ws.groupId} className="flex items-baseline gap-1 text-[0.6rem] text-muted">
                            <span className="shrink-0 opacity-50">↳</span>
                            <span>
                              <span className="opacity-60">{ws.groupName}:</span>{" "}
                              <span className="font-medium text-foreground/70">{ws.selectedNames.join(" / ")}</span>
                              {ws.pointsDelta !== 0 && (
                                <span className={`ml-1 ${ws.pointsDelta > 0 ? "text-amber-500" : "text-emerald-500"}`}>
                                  ({ws.pointsDelta > 0 ? "+" : ""}
                                  {ws.pointsDelta}pt)
                                </span>
                              )}
                            </span>
                          </li>
                        ))}
                      </ul>
                    )}
                  </article>
                );
              })}
            </div>
          </section>
        );
      })}
    </div>
  );
}

"use client";

import { useState, useMemo, useCallback, useId } from "react";
import type { Faction, RosterUnit, UnitRole, FactionGroup } from "./types";

// ─── constants ────────────────────────────────────────────────────────────────

const ROLE_ORDER: UnitRole[] = ["HQ", "Battleline", "Other", "Transport", "Heavy"];

const ROLE_META: Record<UnitRole, { label: string; icon: string; color: string }> = {
  HQ:         { label: "HQ",         icon: "👑", color: "rose" },
  Battleline: { label: "Battleline", icon: "🛡️",  color: "emerald" },
  Other:      { label: "Other",      icon: "⚔️", color: "sky" },
  Transport:  { label: "Transport",  icon: "🚁", color: "amber" },
  Heavy:      { label: "Heavy",      icon: "💥", color: "red" },
};

const GROUP_ORDER: FactionGroup[] = ["Imperium", "Chaos", "Xenos"];
const GROUP_COLOR: Record<FactionGroup, string> = {
  Imperium: "text-amber-500 dark:text-amber-400",
  Chaos:    "text-rose-500 dark:text-rose-400",
  Xenos:    "text-sky-500 dark:text-sky-400",
};
const GROUP_BADGE: Record<FactionGroup, string> = {
  Imperium: "bg-amber-500/10 text-amber-600 dark:bg-amber-400/10 dark:text-amber-300",
  Chaos:    "bg-rose-500/10 text-rose-600 dark:bg-rose-400/10 dark:text-rose-300",
  Xenos:    "bg-sky-500/10 text-sky-600 dark:bg-sky-400/10 dark:text-sky-300",
};

const POINT_LIMITS = [500, 750, 1000, 1500, 2000, 2500, 3000];

const NOTABLE_CATS = [
  "Character","Epic Hero","Infantry","Mounted","Vehicle","Monster","Walker",
  "Fly","Aircraft","Psyker","Battleline","Dedicated Transport","Wraith Construct",
  "Aspect Warrior","Phoenix Lord","Primarch","Daemon","Titanic","Jump Pack",
];

// ─── Wahapedia リンク ──────────────────────────────────────────────────────────

/** 種族ID → Wahapedia の faction スラグ */
const WAHAPEDIA_SLUG: Record<string, string> = {
  // Aeldari
  aeldari_craftworlds:    "aeldari",
  drukhari:               "drukhari",
  ynnari:                 "ynnari",
  // Chaos
  chaos_space_marines:    "chaos-space-marines",
  death_guard:            "death-guard",
  emperor_s_children:     "emperors-children",
  thousand_sons:          "thousand-sons",
  world_eaters:           "world-eaters",
  chaos_daemons:          "chaos-daemons",
  chaos_knights:          "chaos-knights",
  // Xenos
  genestealer_cults:      "genestealer-cults",
  leagues_of_votann:      "leagues-of-votann",
  necrons:                "necrons",
  orks:                   "orks",
  t_au_empire:            "tau-empire",
  tyranids:               "tyranids",
  // Imperium
  adepta_sororitas:       "adepta-sororitas",
  adeptus_custodes:       "adeptus-custodes",
  adeptus_mechanicus:     "adeptus-mechanicus",
  astra_militarum:        "astra-militarum",
  agents_of_the_imperium: "agents-of-the-imperium",
  black_templars:         "black-templars",
  blood_angels:           "blood-angels",
  dark_angels:            "dark-angels",
  deathwatch:             "deathwatch",
  grey_knights:           "grey-knights",
  imperial_fists:         "imperial-fists",
  imperial_knights:       "imperial-knights",
  iron_hands:             "iron-hands",
  raven_guard:            "raven-guard",
  salamanders:            "salamanders",
  space_marines:          "space-marines",
  space_wolves:           "space-wolves",
  ultramarines:           "ultramarines",
  white_scars:            "white-scars",
};

/**
 * ユニット名を Wahapedia URL スラグに変換する。
 * 例: "Farseer Skyrunner" → "Farseer-Skyrunner"
 *     "Gaunt's Ghosts"    → "Gaunts-Ghosts"
 */
function toWahapediaUnitSlug(name: string): string {
  return name
    .replace(/['']/g, "")
    .replace(/\s+/g, "-")
    .replace(/[^a-zA-Z0-9-]/g, "");
}

function wahapediaUrl(factionId: string, unitName: string): string | null {
  const slug = WAHAPEDIA_SLUG[factionId];
  if (!slug) return null;
  return `https://wahapedia.ru/wh40k10ed/factions/${slug}/${toWahapediaUnitSlug(unitName)}`;
}

// ─── helpers ──────────────────────────────────────────────────────────────────

function roleBorderClass(role: UnitRole): string {
  const map: Record<UnitRole, string> = {
    HQ:         "border-rose-400/40 dark:border-rose-500/30",
    Battleline: "border-emerald-400/40 dark:border-emerald-500/30",
    Other:      "border-sky-400/40 dark:border-sky-500/30",
    Transport:  "border-amber-400/40 dark:border-amber-500/30",
    Heavy:      "border-red-400/40 dark:border-red-500/30",
  };
  return map[role];
}
function roleTextClass(role: UnitRole): string {
  const map: Record<UnitRole, string> = {
    HQ:         "text-rose-500 dark:text-rose-400",
    Battleline: "text-emerald-500 dark:text-emerald-400",
    Other:      "text-sky-500 dark:text-sky-400",
    Transport:  "text-amber-500 dark:text-amber-400",
    Heavy:      "text-red-500 dark:text-red-400",
  };
  return map[role];
}
function roleActiveBg(role: UnitRole): string {
  const map: Record<UnitRole, string> = {
    HQ:         "bg-rose-500/10 dark:bg-rose-500/10",
    Battleline: "bg-emerald-500/10 dark:bg-emerald-500/10",
    Other:      "bg-sky-500/10 dark:bg-sky-500/10",
    Transport:  "bg-amber-500/10 dark:bg-amber-500/10",
    Heavy:      "bg-red-500/10 dark:bg-red-500/10",
  };
  return map[role];
}

// ─── sub-components ───────────────────────────────────────────────────────────

function PointBar({ used, limit }: { used: number; limit: number }) {
  const uid = useId();
  const pct = Math.min(100, (used / limit) * 100);
  const isOver = used > limit;
  const remaining = limit - used;

  const barClass = isOver
    ? "bg-gradient-to-r from-red-500 to-rose-600"
    : pct > 90
    ? "bg-gradient-to-r from-amber-400 to-orange-500"
    : "bg-gradient-to-r from-sky-500 to-indigo-500";

  return (
    <div className="space-y-1.5">
      <div className="flex items-center justify-between text-xs">
        <span className="text-muted font-medium">
          {used} / {limit}pt
        </span>
        <span className={isOver ? "font-bold text-red-500" : "text-muted"}>
          {isOver ? `⚠️ ${Math.abs(remaining)}pt over` : `${remaining}pt remaining`}
        </span>
      </div>
      <div className="h-1.5 w-full overflow-hidden rounded-full bg-slate-200 dark:bg-white/20">
        {/* eslint-disable-next-line react/no-danger */}
        <style>{`[data-bar-id="${uid}"] { width: ${pct}% }`}</style>
        <div
          data-bar-id={uid}
          className={`h-full rounded-full transition-all duration-300 ${barClass}`}
        />
      </div>
    </div>
  );
}

// ─── main component ───────────────────────────────────────────────────────────

export function RosterBuilder({ factions }: { factions: Faction[] }) {
  // State
  const [selectedFactionId, setSelectedFactionId] = useState<string | null>(null);
  const [roster, setRoster] = useState<RosterUnit[]>([]);
  const [pointLimit, setPointLimit] = useState(1000);
  const [tab, setTab] = useState<"faction" | "units" | "roster">("faction");
  const [search, setSearch] = useState("");
  const [filterRole, setFilterRole] = useState<UnitRole | "ALL">("ALL");
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editVal, setEditVal] = useState("");

  // Derived
  const groupedFactions = useMemo(() => {
    const g: Record<FactionGroup, Faction[]> = { Imperium: [], Chaos: [], Xenos: [] };
    for (const f of factions) {
      g[f.group]?.push(f);
    }
    return g;
  }, [factions]);

  const selectedFaction = useMemo(
    () => factions.find((f) => f.id === selectedFactionId) ?? null,
    [factions, selectedFactionId]
  );

  const filteredUnits = useMemo(() => {
    if (!selectedFaction) return [];
    return selectedFaction.units.filter((u) => {
      if (filterRole !== "ALL" && u.role !== filterRole) return false;
      if (search) {
        const q = search.toLowerCase();
        return (
          u.name.toLowerCase().includes(q) ||
          (u.nameJa != null && u.nameJa.includes(search)) ||
          u.categories.some((c) => c.toLowerCase().includes(q))
        );
      }
      return true;
    });
  }, [selectedFaction, filterRole, search]);

  const unitsByRole = useMemo(
    () =>
      ROLE_ORDER.reduce(
        (acc, role) => {
          acc[role] = filteredUnits.filter((u) => u.role === role);
          return acc;
        },
        {} as Record<UnitRole, typeof filteredUnits>
      ),
    [filteredUnits]
  );

  const rosterByRole = useMemo(
    () =>
      ROLE_ORDER.reduce(
        (acc, role) => {
          acc[role] = roster.filter((u) => u.role === role);
          return acc;
        },
        {} as Record<UnitRole, RosterUnit[]>
      ),
    [roster]
  );

  const totalPts = useMemo(
    () => roster.reduce((s, u) => s + u.rosterPts, 0),
    [roster]
  );
  const isOver = totalPts > pointLimit;

  // Handlers
  const countInRoster = useCallback(
    (unitId: string) => roster.filter((u) => u.id === unitId).length,
    [roster]
  );

  const addUnit = useCallback((unit: (typeof filteredUnits)[0]) => {
    const rosterId = `${unit.id}_${Date.now()}_${Math.random().toString(36).slice(2, 6)}`;
    setRoster((prev) => [...prev, { ...unit, rosterId, rosterPts: unit.pts }]);
  }, []);

  const removeOneUnit = useCallback((unitId: string) => {
    setRoster((prev) => {
      const lastIdx = [...prev].reverse().findIndex((u) => u.id === unitId);
      if (lastIdx === -1) return prev;
      const realIdx = prev.length - 1 - lastIdx;
      return prev.filter((_, i) => i !== realIdx);
    });
  }, []);

  const removeUnit = useCallback((rosterId: string) => {
    setRoster((prev) => prev.filter((u) => u.rosterId !== rosterId));
  }, []);

  const startEdit = useCallback((rosterId: string, pts: number) => {
    setEditingId(rosterId);
    setEditVal(String(pts));
  }, []);

  const commitEdit = useCallback(
    (rosterId: string) => {
      const v = parseInt(editVal, 10);
      if (!isNaN(v) && v >= 0) {
        setRoster((prev) =>
          prev.map((u) => (u.rosterId === rosterId ? { ...u, rosterPts: v } : u))
        );
      }
      setEditingId(null);
    },
    [editVal]
  );

  const selectFaction = (factionId: string) => {
    setSelectedFactionId(factionId);
    setSearch("");
    setFilterRole("ALL");
    setTab("units");
  };

  const clearRoster = () => {
    if (confirm("ロスターをリセットしますか？")) setRoster([]);
  };

  const exportRoster = () => {
    const lines = [
      `=== WH40K Roster [${selectedFaction?.name ?? ""}] ===`,
      `上限: ${pointLimit}pt`,
      "",
    ];
    for (const role of ROLE_ORDER) {
      const units = rosterByRole[role];
      if (!units.length) continue;
      lines.push(`【${role}】`);
      for (const u of units) lines.push(`  ・${u.name}  ${u.rosterPts}pt`);
    }
    lines.push("", `合計: ${totalPts}pt / ${pointLimit}pt`);
    lines.push(
      "",
      "⚠️ BSData/wh40k-10e より自動抽出。大会前に GW公式 MFM で要確認。"
    );
    const text = lines.join("\n");
    navigator.clipboard
      ?.writeText(text)
      .then(() => alert("✅ クリップボードにコピーしました！"))
      .catch(() => alert(text));
  };

  // ─── render ─────────────────────────────────────────────────────────────────

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="surface-card rounded-2xl px-5 py-5 sm:px-6 sm:py-6 bg-white/95 dark:bg-white/90">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
          <div>
            <span className="text-[0.65rem] font-semibold uppercase tracking-[0.4em] text-rose-500">
              Tools
            </span>
            <h1 className="mt-1 text-2xl font-black uppercase tracking-tight sm:text-3xl">
              WH40K Roster Builder
            </h1>
            <p className="mt-1 text-xs text-muted">
              10th Edition · 全種族対応 · BSData powered
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            {/* Point limit */}
            <label className="flex items-center gap-1.5">
              <span className="text-[0.65rem] font-semibold uppercase tracking-widest text-muted">
                上限
              </span>
              <select
                value={pointLimit}
                onChange={(e) => setPointLimit(Number(e.target.value))}
                className="rounded-full border border-slate-300/70 bg-white/80 px-3 py-1 text-xs font-bold text-slate-700 shadow-sm transition hover:border-rose-400 dark:border-white/40 dark:bg-white dark:text-slate-800"
              >
                {POINT_LIMITS.map((p) => (
                  <option key={p} value={p}>
                    {p}pt
                  </option>
                ))}
              </select>
            </label>

            {/* Selected faction badge */}
            {selectedFaction && (
              <span
                className={`rounded-full px-3 py-1 text-[0.65rem] font-bold uppercase tracking-widest ${GROUP_BADGE[selectedFaction.group]}`}
              >
                {selectedFaction.name}
              </span>
            )}
          </div>
        </div>

        {/* Point bar */}
        {roster.length > 0 && (
          <div className="mt-4">
            <PointBar used={totalPts} limit={pointLimit} />
          </div>
        )}

        {/* Tabs */}
        <div className="mt-4 flex gap-0 border-b border-slate-100/80 dark:border-slate-700/60">
          {(
            [
              ["faction", "① 種族選択"],
              ["units", "② ユニット追加"],
              ["roster", `③ ロスター (${roster.length})`],
            ] as const
          ).map(([t, label]) => (
            <button
              key={t}
              onClick={() => setTab(t)}
              className={`px-4 py-2 text-xs font-semibold uppercase tracking-[0.18em] transition border-b-2 -mb-px ${
                tab === t
                  ? "border-rose-500 text-rose-500"
                  : "border-transparent text-muted hover:text-rose-400"
              }`}
            >
              {label}
            </button>
          ))}
        </div>
      </div>

      {/* ① FACTION TAB */}
      {tab === "faction" && (
        <div className="space-y-6">
          {GROUP_ORDER.map((group) => {
            const groupFactions = groupedFactions[group];
            if (!groupFactions?.length) return null;
            return (
              <div key={group} className="space-y-3">
                <h2
                  className={`text-[0.7rem] font-bold uppercase tracking-[0.35em] ${GROUP_COLOR[group]}`}
                >
                  {group}
                </h2>
                <div className="grid gap-2 sm:grid-cols-2 lg:grid-cols-3">
                  {groupFactions.map((f) => (
                    <button
                      key={f.id}
                      onClick={() => selectFaction(f.id)}
                      className={`surface-card flex items-center justify-between rounded-2xl px-4 py-3 text-left transition hover:-translate-y-0.5 hover:border-rose-400/70 ${
                        selectedFactionId === f.id
                          ? "ring-1 ring-rose-400/60"
                          : ""
                      }`}
                    >
                      <div className="min-w-0">
                        <span className="text-sm font-bold tracking-tight">
                          {f.name}
                        </span>
                        {f.nameJa && (
                          <p className="truncate text-[0.65rem] text-muted">{f.nameJa}</p>
                        )}
                      </div>
                      <span className="ml-2 shrink-0 text-xs text-muted">{f.units.length}</span>
                    </button>
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* ② UNITS TAB */}
      {tab === "units" && (
        <div className="space-y-4">
          {!selectedFaction ? (
            <div className="surface-card rounded-2xl px-6 py-12 text-center text-muted">
              <p className="text-sm">
                「① 種族選択」タブで種族を選んでください
              </p>
            </div>
          ) : (
            <>
              {/* Search & filter bar */}
              <div className="surface-card flex flex-col gap-2 rounded-2xl px-4 py-3 sm:flex-row sm:items-center">
                <input
                  type="text"
                  aria-label="ユニット名・キーワード検索"
                  placeholder="🔍 ユニット名・キーワード検索…"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="flex-1 rounded-full border border-slate-300/60 bg-transparent px-3 py-1.5 text-xs outline-none placeholder:text-muted focus:border-rose-400/70 dark:border-white/30"
                />
                <select
                  aria-label="ロールでフィルター"
                  value={filterRole}
                  onChange={(e) =>
                    setFilterRole(e.target.value as UnitRole | "ALL")
                  }
                  className="rounded-full border border-slate-300/60 bg-white/80 px-3 py-1.5 text-xs dark:border-white/30 dark:bg-white dark:text-slate-800"
                >
                  <option value="ALL">全ロール</option>
                  {ROLE_ORDER.map((r) => (
                    <option key={r} value={r}>
                      {ROLE_META[r].icon} {r}
                    </option>
                  ))}
                </select>
              </div>

              {/* Unit cards by role */}
              {ROLE_ORDER.map((role) => {
                const units = unitsByRole[role];
                if (!units.length) return null;
                const meta = ROLE_META[role];
                return (
                  <div key={role} className="space-y-2">
                    <div className="flex items-center gap-2">
                      <span>{meta.icon}</span>
                      <span
                        className={`text-[0.65rem] font-bold uppercase tracking-[0.3em] ${roleTextClass(role)}`}
                      >
                        {role}
                      </span>
                      <span className="text-[0.65rem] text-muted">
                        {units.length}
                      </span>
                    </div>
                    <div className="grid gap-1.5 sm:grid-cols-2">
                      {units.map((unit) => {
                        const count = countInRoster(unit.id);
                        const active = count > 0;
                        const wUrl = selectedFactionId ? wahapediaUrl(selectedFactionId, unit.name) : null;
                        return (
                          <div
                            key={unit.id}
                            className={`flex items-center rounded-xl border transition ${
                              active
                                ? `${roleActiveBg(role)} ${roleBorderClass(role)}`
                                : "surface-card border-transparent"
                            }`}
                          >
                            {/* ユニット名（Wahapedia リンク）+ カテゴリ */}
                            <div className="min-w-0 flex-1 px-4 py-2.5">
                              {wUrl ? (
                                <a
                                  href={wUrl}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className={`block truncate text-xs font-semibold underline decoration-dotted underline-offset-2 transition hover:opacity-70 ${
                                    active ? roleTextClass(role) : "text-[color:var(--fg-body)]"
                                  }`}
                                  title="Wahapedia でデータシートを見る"
                                >
                                  {unit.name}
                                </a>
                              ) : (
                                <span className={`block truncate text-xs font-semibold ${
                                  active ? roleTextClass(role) : "text-[color:var(--fg-body)]"
                                }`}>
                                  {unit.name}
                                </span>
                              )}
                              {unit.nameJa && (
                                <div className="truncate text-[0.6rem] text-muted">
                                  {unit.nameJa}
                                </div>
                              )}
                              <div className="mt-0.5 flex flex-wrap gap-1">
                                {unit.categories
                                  .filter((c) => NOTABLE_CATS.includes(c))
                                  .slice(0, 3)
                                  .map((c) => (
                                    <span key={c} className="text-[0.6rem] text-muted">
                                      {c}
                                    </span>
                                  ))}
                              </div>
                            </div>

                            {/* ポイント + 個数コントロール */}
                            <div className="flex shrink-0 items-center gap-1 pr-3">
                              <span className={`text-xs font-bold ${active ? roleTextClass(role) : "text-muted"}`}>
                                {unit.pts}pt
                              </span>
                              {active && (
                                <>
                                  <button
                                    onClick={() => removeOneUnit(unit.id)}
                                    className="flex h-5 w-5 items-center justify-center rounded-full text-[0.7rem] text-muted transition hover:bg-red-500/10 hover:text-red-400"
                                    title="1つ削除"
                                  >
                                    −
                                  </button>
                                  <span className={`min-w-[1rem] text-center text-xs font-black ${roleTextClass(role)}`}>
                                    {count}
                                  </span>
                                </>
                              )}
                              <button
                                onClick={() => addUnit(unit)}
                                className={`flex h-5 w-5 items-center justify-center rounded-full text-[0.7rem] font-bold transition ${
                                  active
                                    ? `${roleTextClass(role)} hover:opacity-70`
                                    : "text-muted hover:text-[color:var(--fg-body)]"
                                }`}
                                title="ロスターに追加"
                              >
                                ＋
                              </button>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                );
              })}
            </>
          )}
        </div>
      )}

      {/* ③ ROSTER TAB */}
      {tab === "roster" && (
        <div className="space-y-4">
          {roster.length === 0 ? (
            <div className="surface-card rounded-2xl px-6 py-12 text-center text-muted">
              <p className="text-2xl">⚔️</p>
              <p className="mt-2 text-sm">
                「② ユニット追加」タブからユニットを選択してください
              </p>
            </div>
          ) : (
            <>
              {/* Roster cards by role */}
              {ROLE_ORDER.map((role) => {
                const units = rosterByRole[role];
                if (!units.length) return null;
                const rolePts = units.reduce((s, u) => s + u.rosterPts, 0);
                return (
                  <div key={role} className="space-y-1.5">
                    <div className="flex items-center gap-2">
                      <span>{ROLE_META[role].icon}</span>
                      <span
                        className={`text-[0.65rem] font-bold uppercase tracking-[0.3em] ${roleTextClass(role)}`}
                      >
                        {role}
                      </span>
                      <span className="text-[0.65rem] text-muted">
                        {rolePts}pt
                      </span>
                    </div>
                    {units.map((u) => (
                      <div
                        key={u.rosterId}
                        className={`surface-card flex items-center gap-3 rounded-xl border px-4 py-2.5 ${roleBorderClass(u.role)}`}
                      >
                        <div className="flex-1 min-w-0">
                          <p className="truncate text-xs font-semibold">
                            {u.name}
                          </p>
                          {u.nameJa && (
                            <p className="truncate text-[0.6rem] text-muted">
                              {u.nameJa}
                            </p>
                          )}
                        </div>

                        {/* Wahapedia link */}
                        {selectedFactionId && wahapediaUrl(selectedFactionId, u.name) && (
                          <a
                            href={wahapediaUrl(selectedFactionId, u.name)!}
                            target="_blank"
                            rel="noopener noreferrer"
                            title="Wahapedia でデータシートを見る"
                            className="shrink-0 text-[0.7rem] text-muted transition hover:text-sky-500"
                          >
                            📖
                          </a>
                        )}

                        {/* Pts editor */}
                        {editingId === u.rosterId ? (
                          <input
                            autoFocus
                            aria-label={`${u.name} のポイント数`}
                            value={editVal}
                            onChange={(e) => setEditVal(e.target.value)}
                            onBlur={() => commitEdit(u.rosterId)}
                            onKeyDown={(e) => {
                              if (e.key === "Enter") commitEdit(u.rosterId);
                              if (e.key === "Escape") setEditingId(null);
                            }}
                            className={`w-16 rounded border bg-transparent px-2 py-0.5 text-right text-xs font-bold outline-none ${roleBorderClass(u.role)} ${roleTextClass(u.role)}`}
                          />
                        ) : (
                          <button
                            onClick={() => startEdit(u.rosterId, u.rosterPts)}
                            title="クリックで編集"
                            className={`rounded border px-2 py-0.5 text-xs font-bold transition hover:opacity-70 ${roleBorderClass(u.role)} ${roleTextClass(u.role)}`}
                          >
                            {u.rosterPts}pt
                          </button>
                        )}

                        <button
                          onClick={() => removeUnit(u.rosterId)}
                          className="shrink-0 rounded-full px-2 py-0.5 text-[0.65rem] text-muted transition hover:text-red-500"
                          title="削除"
                        >
                          ✕
                        </button>
                      </div>
                    ))}
                  </div>
                );
              })}

              {/* Summary */}
              <div
                className={`surface-card rounded-2xl px-5 py-5 ${
                  isOver
                    ? "ring-1 ring-red-400/60"
                    : "ring-1 ring-emerald-400/30"
                }`}
              >
                <div className="mb-4 grid grid-cols-3 gap-4 text-center">
                  <div>
                    <p className="text-[0.6rem] uppercase tracking-widest text-muted">
                      ユニット
                    </p>
                    <p className="mt-0.5 text-2xl font-black text-[color:var(--accent-primary)]">
                      {roster.length}
                    </p>
                  </div>
                  <div>
                    <p className="text-[0.6rem] uppercase tracking-widest text-muted">
                      合計
                    </p>
                    <p
                      className={`mt-0.5 text-2xl font-black ${
                        isOver ? "text-red-500" : "text-emerald-500 dark:text-emerald-400"
                      }`}
                    >
                      {totalPts}
                    </p>
                  </div>
                  <div>
                    <p className="text-[0.6rem] uppercase tracking-widest text-muted">
                      {isOver ? "超過" : "残り"}
                    </p>
                    <p
                      className={`mt-0.5 text-2xl font-black ${
                        isOver ? "text-red-500" : "text-sky-500"
                      }`}
                    >
                      {isOver
                        ? `-${Math.abs(pointLimit - totalPts)}`
                        : pointLimit - totalPts}
                    </p>
                  </div>
                </div>

                <PointBar used={totalPts} limit={pointLimit} />

                <div className="mt-4 flex flex-col gap-2 sm:flex-row">
                  <button
                    onClick={exportRoster}
                    className="flex-1 rounded-full bg-rose-500 px-5 py-2.5 text-xs font-bold uppercase tracking-[0.2em] text-white shadow-lg shadow-rose-500/30 transition hover:-translate-y-0.5 hover:bg-rose-400"
                  >
                    📋 コピー
                  </button>
                  <button
                    onClick={clearRoster}
                    className="flex-1 rounded-full border border-slate-300/70 px-5 py-2.5 text-xs font-semibold uppercase tracking-[0.2em] text-muted transition hover:border-red-400/70 hover:text-red-400 dark:border-slate-600/70"
                  >
                    🗑 リセット
                  </button>
                </div>
              </div>

              {/* Warning */}
              <p className="rounded-xl border border-amber-300/40 bg-amber-50/50 px-4 py-3 text-[0.65rem] leading-relaxed text-amber-700 dark:border-amber-500/20 dark:bg-amber-500/5 dark:text-amber-400">
                ⚠️ ポイントデータは更新遅れ・誤りがある場合があります。
                大会使用前は必ず GW 公式{" "}
                <strong>Munitorum Field Manual</strong>（無料 PDF）で確認してください。
              </p>
            </>
          )}
        </div>
      )}
    </div>
  );
}

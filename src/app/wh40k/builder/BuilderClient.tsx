"use client";

import { useState, useMemo, useCallback, useEffect, useRef } from "react";
import Link from "next/link";
import type { UnitRole } from "../types";

// ─── Types ─────────────────────────────────────────────────────────────────

export type FactionListItem = {
  id: string;
  name: string;
  nameJa: string | null;
  slug: string;
  group: "Imperium" | "Chaos" | "Xenos";
  unitCount: number;
};

export type BuilderUnit = {
  id: string;
  unitCode: string;
  name: string;
  nameJa: string | null;
  slug: string;
  role: UnitRole;
  basePoints: number;
  categories: string[];
};

export type WeaponOption = {
  id: string;
  name: string;
  pointsDelta: number;
  sortOrder: number;
};

export type WeaponGroup = {
  id: string;
  name: string;
  minChoices: number;
  maxChoices: number;
  sortOrder: number;
  options: WeaponOption[];
};

export type WeaponSelection = {
  groupId: string;
  groupName: string;
  selectedNames: string[]; // maxChoices > 1 の場合は複数
  pointsDelta: number;
};

export type RosterEntry = {
  entryId: string;
  unitId: string;
  slug?: string; // "{factionSlug}--{unitCode}" 形式（旧データとの後方互換で省略可）
  name: string;
  nameJa: string | null;
  role: UnitRole;
  pts: number;
  weaponSelections: WeaponSelection[];
};

export type SavedRoster = {
  id: string;
  name: string;
  faction: string;
  factionName: string;
  pointsLimit: number;
  units: RosterEntry[];
  savedAt: string;
};

// ─── Constants ──────────────────────────────────────────────────────────────

const POINTS_LIMITS = [500, 1000, 1500, 2000, 2500, 3000];
const ROLES: UnitRole[] = ["HQ", "Battleline", "Transport", "Other", "Heavy"];

const ROLE_META: Record<
  UnitRole,
  { label: string; text: string; bg: string; border: string }
> = {
  HQ:         { label: "Character",           text: "text-rose-500 dark:text-rose-400",       bg: "bg-rose-500/10",    border: "border-rose-400/40" },
  Battleline: { label: "Battleline",          text: "text-emerald-500 dark:text-emerald-400", bg: "bg-emerald-500/10", border: "border-emerald-400/40" },
  Transport:  { label: "Dedicated Transport", text: "text-amber-500 dark:text-amber-400",     bg: "bg-amber-500/10",   border: "border-amber-400/40" },
  Other:      { label: "Other",               text: "text-sky-500 dark:text-sky-400",         bg: "bg-sky-500/10",     border: "border-sky-400/40" },
  Heavy:      { label: "Heavy",               text: "text-red-500 dark:text-red-400",         bg: "bg-red-500/10",     border: "border-red-400/40" },
};

const GROUP_META: Record<
  "Imperium" | "Chaos" | "Xenos",
  { text: string; badge: string }
> = {
  Imperium: { text: "text-amber-600 dark:text-amber-400", badge: "bg-amber-500/10 text-amber-600 dark:text-amber-300" },
  Chaos:    { text: "text-rose-600 dark:text-rose-400",   badge: "bg-rose-500/10 text-rose-600 dark:text-rose-300" },
  Xenos:    { text: "text-sky-600 dark:text-sky-400",     badge: "bg-sky-500/10 text-sky-600 dark:text-sky-300" },
};

// ─── PointBar ────────────────────────────────────────────────────────────────

function PointBar({ used, limit }: { used: number; limit: number }) {
  const pct = Math.min(100, (used / limit) * 100);
  const isOver = used > limit;
  return (
    <div className="space-y-1">
      <div className="flex justify-between text-xs">
        <span className="text-muted">{used} / {limit}pt</span>
        <span className={isOver ? "font-bold text-red-500" : "text-muted"}>
          {isOver ? `⚠️ ${used - limit}pt超過` : `残り${limit - used}pt`}
        </span>
      </div>
      <div className="h-2 w-full overflow-hidden rounded-full bg-slate-200 dark:bg-slate-700">
        <div
          className={`h-full rounded-full transition-all duration-300 ${
            isOver ? "bg-red-500" : pct > 90 ? "bg-amber-400" : "bg-gradient-to-r from-sky-500 to-indigo-500"
          }`}
          style={{ width: `${pct}%` }}
        />
      </div>
    </div>
  );
}

// ─── Weapon Selection Modal ──────────────────────────────────────────────────

type ModalState = {
  unit: BuilderUnit;
  groups: WeaponGroup[];
  /** groupId → 選択中のオプション名リスト */
  selections: Map<string, string[]>;
};

function WeaponModal({
  state,
  onConfirm,
  onCancel,
}: {
  state: ModalState;
  onConfirm: (selections: Map<string, string[]>) => void;
  onCancel: () => void;
}) {
  const [selections, setSelections] = useState<Map<string, string[]>>(() => {
    // 初期値：minChoices > 0 のグループのみ最初のオプションを選択済みにする
    const init = new Map<string, string[]>();
    for (const g of state.groups) {
      if (g.options.length > 0 && g.minChoices > 0) {
        init.set(g.id, [g.options[0].name]);
      }
    }
    return init;
  });

  const toggle = (group: WeaponGroup, optionName: string) => {
    setSelections((prev) => {
      const next = new Map(prev);
      const cur = next.get(group.id) ?? [];

      if (group.maxChoices === 1) {
        // ラジオ
        next.set(group.id, [optionName]);
      } else {
        // チェックボックス（同じ選択肢を複数回選択可）
        const count = cur.filter((n) => n === optionName).length;
        if (count > 0 && (count >= group.maxChoices || cur.length >= group.maxChoices)) {
          // 同じ選択肢のインスタンスを1つ削除
          const idx = cur.lastIndexOf(optionName);
          next.set(group.id, cur.filter((_, i) => i !== idx));
        } else if (cur.length < group.maxChoices) {
          // スロットが空いていれば追加（同じ選択肢でも可）
          next.set(group.id, [...cur, optionName]);
        }
      }
      return next;
    });
  };

  const totalDelta = useMemo(() => {
    let d = 0;
    for (const g of state.groups) {
      const sel = selections.get(g.id) ?? [];
      for (const optName of sel) {
        d += g.options.find((o) => o.name === optName)?.pointsDelta ?? 0;
      }
    }
    return d;
  }, [selections, state.groups]);

  return (
    <div
      className="fixed inset-0 z-50 flex items-end justify-center sm:items-center p-4"
      onClick={onCancel}
    >
      {/* Backdrop */}
      <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" />

      {/* Modal */}
      <div
        className="relative w-full max-w-md rounded-2xl bg-white dark:bg-slate-900 shadow-2xl overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-start justify-between gap-3 border-b border-slate-200/60 dark:border-slate-700/60 px-5 py-4">
          <div>
            <p className="text-[0.6rem] font-semibold uppercase tracking-widest text-muted">
              武器・装備を選択
            </p>
            <h3 className="text-base font-black">{state.unit.name}</h3>
            {state.unit.nameJa && (
              <p className="text-[0.65rem] text-muted">{state.unit.nameJa}</p>
            )}
          </div>
          <div className="text-right shrink-0">
            <p className="text-xl font-black text-[color:var(--accent-primary)]">
              {state.unit.basePoints + totalDelta}pt
            </p>
            {totalDelta !== 0 && (
              <p className="text-[0.6rem] text-muted">
                基本 {state.unit.basePoints}pt {totalDelta > 0 ? `+${totalDelta}` : totalDelta}pt
              </p>
            )}
          </div>
        </div>

        {/* Groups */}
        <div className="max-h-[60vh] overflow-y-auto px-5 py-4 space-y-5">
          {state.groups.map((group) => {
            const cur = selections.get(group.id) ?? [];
            const isMulti = group.maxChoices > 1;
            return (
              <div key={group.id} className="space-y-2">
                <div className="flex items-center gap-2">
                  <h4 className="text-xs font-bold text-[color:var(--fg-body)]">
                    {group.name}
                  </h4>
                  <span className="text-[0.6rem] text-muted">
                    {isMulti
                      ? `最大${group.maxChoices}つ選択`
                      : "1つ選択"}
                  </span>
                </div>
                <div className="space-y-1.5">
                  {group.options.map((opt) => {
                    const count = cur.filter((n) => n === opt.name).length;
                    const selected = count > 0;
                    return (
                      <button
                        key={opt.id}
                        onClick={() => toggle(group, opt.name)}
                        className={`w-full flex items-center gap-3 rounded-xl border px-3 py-2.5 text-left transition ${
                          selected
                            ? "border-rose-400/60 bg-rose-500/10"
                            : "border-slate-200/60 hover:border-slate-300 dark:border-slate-700/60"
                        }`}
                      >
                        {/* Radio / Checkbox indicator */}
                        <span
                          className={`flex h-4 w-4 shrink-0 items-center justify-center ${
                            isMulti ? "rounded" : "rounded-full"
                          } border-2 transition ${
                            selected
                              ? "border-rose-500 bg-rose-500"
                              : "border-slate-300 dark:border-slate-600"
                          }`}
                        >
                          {selected && (
                            <span className="text-white text-[0.55rem] font-black">
                              {isMulti ? "✓" : "●"}
                            </span>
                          )}
                        </span>
                        <span className={`flex-1 text-xs font-medium ${selected ? "text-rose-600 dark:text-rose-400" : ""}`}>
                          {opt.name}
                          {count > 1 && (
                            <span className="ml-1 text-[0.6rem] font-bold">×{count}</span>
                          )}
                        </span>
                        {opt.pointsDelta !== 0 && (
                          <span className={`shrink-0 text-[0.65rem] font-bold ${opt.pointsDelta > 0 ? "text-rose-500" : "text-emerald-500"}`}>
                            {opt.pointsDelta > 0 ? `+${opt.pointsDelta}` : opt.pointsDelta}pt
                          </span>
                        )}
                      </button>
                    );
                  })}
                </div>
              </div>
            );
          })}
        </div>

        {/* Footer */}
        <div className="flex gap-2 border-t border-slate-200/60 dark:border-slate-700/60 px-5 py-4">
          <button
            onClick={onCancel}
            className="flex-1 rounded-full border border-slate-300/60 py-2 text-xs font-semibold transition hover:border-slate-400/60 dark:border-slate-600/60"
          >
            キャンセル
          </button>
          <button
            onClick={() => onConfirm(selections)}
            className="flex-1 rounded-full bg-rose-500 py-2 text-xs font-bold text-white transition hover:bg-rose-400"
          >
            ロスターに追加 ({state.unit.basePoints + totalDelta}pt)
          </button>
        </div>
      </div>
    </div>
  );
}

// ─── FactionPicker ───────────────────────────────────────────────────────────

function FactionPicker({
  factions,
  onSelect,
}: {
  factions: FactionListItem[];
  onSelect: (f: FactionListItem) => void;
}) {
  const [search, setSearch] = useState("");

  const grouped = useMemo(() => {
    const q = search.toLowerCase();
    const result: Record<"Imperium" | "Chaos" | "Xenos", FactionListItem[]> = {
      Imperium: [], Chaos: [], Xenos: [],
    };
    for (const f of factions) {
      if (q && !f.name.toLowerCase().includes(q) && !(f.nameJa?.includes(search))) continue;
      result[f.group].push(f);
    }
    return result;
  }, [factions, search]);

  return (
    <div className="mx-auto max-w-3xl space-y-6 px-4 py-8">
      <div className="space-y-1">
        <h2 className="text-xl font-black uppercase tracking-tight">陣営を選択</h2>
        <p className="text-xs text-muted">プレイする陣営（Faction）を選んでください</p>
      </div>
      <input
        type="text"
        placeholder="🔍 陣営名で検索…"
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        className="w-full rounded-xl border border-slate-300/60 bg-transparent px-4 py-2.5 text-sm outline-none placeholder:text-muted focus:border-rose-400/60 dark:border-slate-600/60"
      />
      {(["Imperium", "Chaos", "Xenos"] as const).map((group) => {
        const items = grouped[group];
        if (!items.length) return null;
        const meta = GROUP_META[group];
        return (
          <div key={group} className="space-y-2">
            <h3 className={`text-[0.65rem] font-bold uppercase tracking-[0.3em] ${meta.text}`}>{group}</h3>
            <div className="grid gap-2 sm:grid-cols-2">
              {items.map((f) => (
                <button
                  key={f.id}
                  onClick={() => onSelect(f)}
                  className="surface-card flex items-center justify-between rounded-2xl px-4 py-3 text-left transition hover:-translate-y-0.5 hover:border-rose-400/60 active:scale-95"
                >
                  <div className="min-w-0">
                    <p className="truncate text-sm font-bold">{f.name}</p>
                    {f.nameJa && <p className="truncate text-[0.65rem] text-muted">{f.nameJa}</p>}
                  </div>
                  <span className={`ml-3 shrink-0 rounded-full px-2 py-0.5 text-[0.6rem] font-bold ${meta.badge}`}>
                    {f.unitCount}
                  </span>
                </button>
              ))}
            </div>
          </div>
        );
      })}
    </div>
  );
}

// ─── Main: BuilderClient ─────────────────────────────────────────────────────

export function BuilderClient({ factions }: { factions: FactionListItem[] }) {
  const [selectedFaction, setSelectedFaction] = useState<FactionListItem | null>(null);
  const [units, setUnits] = useState<BuilderUnit[]>([]);
  const [loadingUnits, setLoadingUnits] = useState(false);

  const [rosterName, setRosterName] = useState("My Roster");
  const [pointsLimit, setPointsLimit] = useState(1000);
  const [roster, setRoster] = useState<RosterEntry[]>([]);
  const [search, setSearch] = useState("");
  const [filterRole, setFilterRole] = useState<UnitRole | "ALL">("ALL");
  const [saveStatus, setSaveStatus] = useState<"idle" | "saved">("idle");

  // 武器オプションキャッシュ（unitId → WeaponGroup[]）
  const weaponCache = useRef<Map<string, WeaponGroup[]>>(new Map());

  // 武器選択モーダル
  const [weaponModal, setWeaponModal] = useState<ModalState | null>(null);

  // 陣営選択時にユニットを取得
  useEffect(() => {
    if (!selectedFaction) return;
    setLoadingUnits(true);
    setUnits([]);
    setRoster([]);
    setSearch("");
    setFilterRole("ALL");
    weaponCache.current.clear();

    fetch(`/api/wh40k/factions/${selectedFaction.id}/units`)
      .then((r) => r.json())
      .then((data: BuilderUnit[]) => setUnits(data))
      .catch(console.error)
      .finally(() => setLoadingUnits(false));
  }, [selectedFaction]);

  // ─── Derived ──────────────────────────────────────────────────────────────

  const filteredUnits = useMemo(() => {
    return units.filter((u) => {
      if (filterRole !== "ALL" && u.role !== filterRole) return false;
      if (search) {
        const q = search.toLowerCase();
        return (
          u.name.toLowerCase().includes(q) ||
          (u.nameJa?.includes(search) ?? false) ||
          u.categories.some((c) => c.toLowerCase().includes(q))
        );
      }
      return true;
    });
  }, [units, search, filterRole]);

  const unitsByRole = useMemo(() => {
    const map = Object.fromEntries(ROLES.map((r) => [r, [] as BuilderUnit[]])) as Record<UnitRole, BuilderUnit[]>;
    for (const u of filteredUnits) map[u.role]?.push(u);
    return map;
  }, [filteredUnits]);

  const rosterByRole = useMemo(() => {
    const map = Object.fromEntries(ROLES.map((r) => [r, [] as RosterEntry[]])) as Record<UnitRole, RosterEntry[]>;
    for (const u of roster) map[u.role]?.push(u);
    return map;
  }, [roster]);

  const totalPts = useMemo(() => roster.reduce((s, u) => s + u.pts, 0), [roster]);
  const isOver = totalPts > pointsLimit;

  const countInRoster = useCallback(
    (unitId: string) => roster.filter((r) => r.unitId === unitId).length,
    [roster]
  );

  // ─── Handlers ─────────────────────────────────────────────────────────────

  const commitAddUnit = useCallback(
    (unit: BuilderUnit, weaponSelections: WeaponSelection[]) => {
      const weaponDelta = weaponSelections.reduce((s, ws) => s + ws.pointsDelta, 0);
      const entryId = `${unit.id}_${Date.now()}_${Math.random().toString(36).slice(2, 5)}`;
      setRoster((prev) => [
        ...prev,
        {
          entryId,
          unitId: unit.id,
          slug: unit.slug,
          name: unit.name,
          nameJa: unit.nameJa,
          role: unit.role,
          pts: unit.basePoints + weaponDelta,
          weaponSelections,
        },
      ]);
    },
    []
  );

  const handleAddUnit = useCallback(
    async (unit: BuilderUnit) => {
      // キャッシュ確認
      if (!weaponCache.current.has(unit.id)) {
        const res = await fetch(`/api/wh40k/units/${unit.id}/weapons`);
        const groups: WeaponGroup[] = await res.json();
        weaponCache.current.set(unit.id, groups);
      }
      const groups = weaponCache.current.get(unit.id)!;

      if (groups.length === 0) {
        // 武器オプションなし → 直接追加
        commitAddUnit(unit, []);
      } else {
        // モーダルを開く
        setWeaponModal({ unit, groups, selections: new Map() });
      }
    },
    [commitAddUnit]
  );

  const handleModalConfirm = useCallback(
    (selections: Map<string, string[]>) => {
      if (!weaponModal) return;
      const { unit, groups } = weaponModal;
      const weaponSelections: WeaponSelection[] = [];
      for (const g of groups) {
        const names = selections.get(g.id) ?? [];
        if (names.length === 0) continue;
        const delta = names.reduce(
          (s, n) => s + (g.options.find((o) => o.name === n)?.pointsDelta ?? 0),
          0
        );
        weaponSelections.push({
          groupId: g.id,
          groupName: g.name,
          selectedNames: names,
          pointsDelta: delta,
        });
      }
      commitAddUnit(unit, weaponSelections);
      setWeaponModal(null);
    },
    [weaponModal, commitAddUnit]
  );

  const removeLastUnit = useCallback((unitId: string) => {
    setRoster((prev) => {
      const reversed = [...prev].reverse();
      const idx = reversed.findIndex((u) => u.unitId === unitId);
      if (idx === -1) return prev;
      return prev.filter((_, i) => i !== prev.length - 1 - idx);
    });
  }, []);

  const removeEntry = useCallback((entryId: string) => {
    setRoster((prev) => prev.filter((u) => u.entryId !== entryId));
  }, []);

  const resetRoster = () => {
    if (roster.length === 0) return;
    if (confirm("ロスターをリセットしますか？")) { setRoster([]); setSaveStatus("idle"); }
  };

  const saveRoster = () => {
    if (!selectedFaction || roster.length === 0) return;
    const id = `roster_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`;
    const saved: SavedRoster = {
      id,
      name: rosterName || "Unnamed Roster",
      faction: selectedFaction.id,
      factionName: selectedFaction.name,
      pointsLimit,
      units: roster,
      savedAt: new Date().toISOString(),
    };
    const existing: SavedRoster[] = JSON.parse(localStorage.getItem("wh40k_rosters") ?? "[]");
    localStorage.setItem("wh40k_rosters", JSON.stringify([...existing, saved]));
    setSaveStatus("saved");
    setTimeout(() => setSaveStatus("idle"), 2500);
  };

  const shareRoster = () => {
    if (!selectedFaction || roster.length === 0) return;
    const data = { name: rosterName, faction: selectedFaction.id, factionName: selectedFaction.name, pointsLimit, units: roster };
    const encoded = btoa(encodeURIComponent(JSON.stringify(data)));
    const url = `${window.location.origin}/wh40k/rosters/share?d=${encoded}`;
    navigator.clipboard?.writeText(url)
      .then(() => alert("✅ 共有URLをクリップボードにコピーしました"))
      .catch(() => prompt("共有URL:", url));
  };

  // ─── 陣営未選択 ──────────────────────────────────────────────────────────

  if (!selectedFaction) {
    return (
      <div className="flex min-h-screen flex-col">
        <div className="border-b border-white/70 bg-white shadow-[0_18px_36px_-28px_rgba(15,23,42,0.38)] dark:border-white/20 dark:bg-white/90">
          <div className="mx-auto max-w-[1400px] px-4 py-3">
            <div className="flex items-center gap-3 rounded-2xl border border-white/80 bg-white px-4 py-3 shadow-[0_18px_36px_-30px_rgba(15,23,42,0.35)] dark:border-white/30 dark:bg-white dark:shadow-none">
              <Link href="/wh40k" className="text-xs text-slate-500 hover:text-rose-500 transition">← WH40K</Link>
              <h1 className="text-base font-black uppercase tracking-tight text-slate-700">Army Builder</h1>
            </div>
          </div>
        </div>
        <div className="flex-1">
          <FactionPicker factions={factions} onSelect={setSelectedFaction} />
        </div>
      </div>
    );
  }

  // ─── 陣営選択済み ─────────────────────────────────────────────────────────

  const groupMeta = GROUP_META[selectedFaction.group];

  return (
    <div className="flex min-h-screen flex-col">
      {/* 武器選択モーダル */}
      {weaponModal && (
        <WeaponModal
          state={weaponModal}
          onConfirm={handleModalConfirm}
          onCancel={() => setWeaponModal(null)}
        />
      )}

      {/* ── Header ── */}
      <div className="sticky top-0 z-20 border-b border-white/70 bg-white shadow-[0_18px_36px_-28px_rgba(15,23,42,0.38)] dark:border-white/20 dark:bg-white/90">
        <div className="mx-auto max-w-[1400px] px-4 py-3">
          <div className="rounded-2xl border border-white/80 bg-white px-4 py-3 shadow-[0_18px_40px_-34px_rgba(15,23,42,0.45)] supports-[backdrop-filter]:backdrop-blur-sm dark:border-white/30 dark:bg-white dark:shadow-none">
            <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
              <div className="flex flex-wrap items-center gap-2">
                <Link href="/wh40k" className="text-xs text-slate-500 hover:text-rose-500 transition">← WH40K</Link>
                <h1 className="text-base font-black uppercase tracking-tight text-slate-700">Army Builder</h1>
                <button
                  onClick={() => {
                    if (roster.length === 0 || confirm("陣営を変更するとロスターがリセットされます。よろしいですか？")) {
                      setSelectedFaction(null);
                    }
                  }}
                  className={`rounded-full px-2.5 py-0.5 text-[0.65rem] font-bold transition hover:opacity-70 ${groupMeta.badge}`}
                  title="クリックで陣営を変更"
                >
                  {selectedFaction.name} ▾
                </button>
                <select
                  value={pointsLimit}
                  onChange={(e) => setPointsLimit(Number(e.target.value))}
                  className="rounded-full border border-slate-300/70 bg-white/90 px-3 py-1 text-xs font-bold text-slate-800 shadow-sm dark:border-white/40 dark:bg-white dark:text-slate-800"
                >
                  {POINTS_LIMITS.map((p) => <option key={p} value={p}>{p}pt</option>)}
                </select>
              </div>
              <div className="flex flex-wrap items-center gap-2">
                <input
                  value={rosterName}
                  onChange={(e) => setRosterName(e.target.value)}
                  className="min-w-[130px] rounded-lg border border-slate-300/70 bg-white px-3 py-1 text-xs text-slate-800 outline-none shadow-sm focus:border-rose-400/70 dark:border-white/40 dark:bg-white dark:text-slate-800"
                  placeholder="Roster Name"
                />
                <button onClick={saveRoster} disabled={roster.length === 0}
                  className="rounded-full bg-rose-500 px-4 py-1.5 text-xs font-bold text-white transition hover:bg-rose-400 disabled:opacity-40">
                  {saveStatus === "saved" ? "✅ 保存済み" : "💾 保存"}
                </button>
                <button onClick={shareRoster} disabled={roster.length === 0}
                  className="rounded-full border border-slate-300/60 px-4 py-1.5 text-xs font-semibold transition hover:border-rose-400/60 disabled:opacity-40 dark:border-slate-600/60">
                  🔗 共有
                </button>
                <button onClick={resetRoster} disabled={roster.length === 0}
                  className="rounded-full border border-slate-300/60 px-4 py-1.5 text-xs font-semibold text-muted transition hover:border-red-400/60 hover:text-red-400 disabled:opacity-40 dark:border-slate-600/60">
                  🗑 リセット
                </button>
              </div>
            </div>
            {roster.length > 0 && <div className="mt-2"><PointBar used={totalPts} limit={pointsLimit} /></div>}
          </div>
        </div>
      </div>

      {/* ── Loading ── */}
      {loadingUnits && (
        <div className="flex flex-1 items-center justify-center py-20 text-sm text-muted">
          ユニット読み込み中…
        </div>
      )}

      {/* ── 3-Column Body ── */}
      {!loadingUnits && (
        <div className="mx-auto w-full max-w-[1400px] flex-1 px-4 py-4">
          <div className="grid grid-cols-1 gap-4 md:grid-cols-[200px_1fr_260px]">

            {/* ── Left: Filter Panel ── */}
            <aside className="space-y-3 md:sticky md:top-[90px] md:self-start">
              <div className="surface-card rounded-2xl p-4 space-y-3">
                <h2 className="text-[0.65rem] font-bold uppercase tracking-widest text-muted">フィルター</h2>
                <input
                  type="text"
                  placeholder="🔍 ユニット名で検索…"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="w-full rounded-xl border border-slate-300/60 bg-transparent px-3 py-2 text-xs outline-none placeholder:text-muted focus:border-rose-400/60 dark:border-slate-600/60"
                />
                <div className="space-y-0.5">
                  <button
                    onClick={() => setFilterRole("ALL")}
                    className={`w-full rounded-lg px-3 py-1.5 text-left text-xs font-medium transition ${filterRole === "ALL" ? "bg-rose-500/10 text-rose-500" : "text-muted hover:text-[color:var(--fg-body)]"}`}
                  >全ロール</button>
                  {ROLES.map((role) => {
                    const meta = ROLE_META[role];
                    const count = units.filter((u) => u.role === role).length;
                    return (
                      <button key={role} onClick={() => setFilterRole(role)}
                        className={`w-full flex items-center justify-between rounded-lg px-3 py-1.5 text-xs font-medium transition ${filterRole === role ? `${meta.bg} ${meta.text}` : "text-muted hover:text-[color:var(--fg-body)]"}`}>
                        <span>{meta.label}</span>
                        <span className="text-[0.6rem]">{count}</span>
                      </button>
                    );
                  })}
                </div>
              </div>
            </aside>

            {/* ── Center: Unit List ── */}
            <main className="min-w-0 space-y-4">
              {ROLES.map((role) => {
                const roleUnits = unitsByRole[role];
                if (!roleUnits.length) return null;
                const meta = ROLE_META[role];
                return (
                  <section key={role} className="space-y-2">
                    <div className="flex items-center gap-2">
                      <span className={`text-[0.65rem] font-bold uppercase tracking-widest ${meta.text}`}>{meta.label}</span>
                      <span className="text-[0.65rem] text-muted">{roleUnits.length}</span>
                    </div>
                    <div className="space-y-1.5">
                      {roleUnits.map((unit) => {
                        const count = countInRoster(unit.id);
                        const active = count > 0;
                        return (
                          <div key={unit.id}
                            className={`flex items-center rounded-xl border px-4 py-2.5 transition ${active ? `${meta.bg} ${meta.border}` : "surface-card border-transparent"}`}>
                            <div className="min-w-0 flex-1">
                              <Link
                                href={`/wh40k/units/${unit.slug}`}
                                target="_blank"
                                rel="noopener noreferrer"
                                onClick={(e) => e.stopPropagation()}
                                className={`truncate text-xs font-semibold underline decoration-dotted underline-offset-2 transition hover:opacity-70 ${active ? meta.text : ""}`}
                              >
                                {unit.name}
                              </Link>
                              {unit.nameJa && <p className="truncate text-[0.6rem] text-muted">{unit.nameJa}</p>}
                              <div className="mt-0.5 flex flex-wrap gap-1">
                                {unit.categories.slice(0, 3).map((c) => (
                                  <span key={c} className="text-[0.55rem] text-muted">{c}</span>
                                ))}
                              </div>
                            </div>
                            <div className="ml-2 flex shrink-0 items-center gap-1">
                              <span className={`text-xs font-bold ${active ? meta.text : "text-muted"}`}>
                                {unit.basePoints}pt
                              </span>
                              {active && (
                                <>
                                  <button onClick={() => removeLastUnit(unit.id)}
                                    className="flex h-6 w-6 items-center justify-center rounded-full text-sm text-muted hover:bg-red-500/10 hover:text-red-400"
                                    title="1つ削除">−</button>
                                  <span className={`min-w-[1rem] text-center text-xs font-black ${meta.text}`}>{count}</span>
                                </>
                              )}
                              <button onClick={() => handleAddUnit(unit)}
                                className={`flex h-6 w-6 items-center justify-center rounded-full text-sm font-bold transition ${active ? `${meta.text} hover:opacity-70` : "text-muted hover:text-[color:var(--fg-body)]"}`}
                                title="ロスターに追加">＋</button>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </section>
                );
              })}
              {filteredUnits.length === 0 && units.length > 0 && (
                <div className="surface-card rounded-2xl px-6 py-12 text-center text-sm text-muted">ユニットが見つかりません</div>
              )}
            </main>

            {/* ── Right: Roster Panel ── */}
            <aside className="space-y-3 md:sticky md:top-[90px] md:self-start">
              <div className="surface-card rounded-2xl p-4 space-y-4">
                <div className="flex items-center justify-between border-b border-slate-200/70 pb-2 dark:border-slate-700/60">
                  <h2 className="text-sm font-black uppercase tracking-[0.25em] text-[color:var(--fg-body)]">ロスター</h2>
                  <span className="text-[0.7rem] font-semibold text-muted">{roster.length}ユニット</span>
                </div>

                <div className={`rounded-xl p-3 text-center ${isOver ? "bg-red-500/10" : "bg-slate-100/60 dark:bg-white/20"}`}>
                  <p className={`text-2xl font-black ${isOver ? "text-red-500" : "text-[color:var(--accent-primary)]"}`}>
                    {totalPts}<span className="text-sm font-normal text-muted"> / {pointsLimit}pt</span>
                  </p>
                  {isOver && <p className="mt-0.5 text-xs font-bold text-red-500">⚠️ ポイント超過</p>}
                </div>

                {roster.length > 0 && (
                  <div className="space-y-0.5 text-xs">
                    {ROLES.map((role) => {
                      const count = rosterByRole[role].length;
                      if (!count) return null;
                      return (
                        <div key={role} className="flex justify-between">
                          <span className="text-muted">{ROLE_META[role].label}</span>
                          <span className={ROLE_META[role].text}>{count}</span>
                        </div>
                      );
                    })}
                  </div>
                )}

                {roster.length === 0 ? (
                  <p className="py-6 text-center text-[0.7rem] text-muted">ユニットを追加してください</p>
                ) : (
                  <div className="space-y-2">
                    {ROLES.map((role) => {
                      const entries = rosterByRole[role];
                      if (!entries.length) return null;
                      const meta = ROLE_META[role];
                      return (
                        <div key={role}>
                          <p className={`mb-1 text-[0.6rem] font-bold uppercase tracking-wider ${meta.text}`}>{meta.label}</p>
                          {entries.map((entry) => (
                            <div key={entry.entryId}
                              className={`mb-1.5 rounded-xl border px-2.5 py-2 ${meta.border}`}>
                              <div className="flex items-center gap-2">
                                <span className="min-w-0 flex-1 truncate text-xs font-semibold">{entry.name}</span>
                                <span className={`shrink-0 text-xs font-bold ${meta.text}`}>{entry.pts}pt</span>
                                <button onClick={() => removeEntry(entry.entryId)}
                                  className="shrink-0 text-xs text-muted hover:text-red-400" title="削除">✕</button>
                              </div>
                              {/* 選択された武器を表示 */}
                              {entry.weaponSelections.length > 0 && (
                                <div className="mt-1.5 space-y-0.5">
                                  {entry.weaponSelections.map((ws) => (
                                    <div key={ws.groupId} className="flex items-start gap-1">
                                      <span className="text-[0.55rem] text-muted shrink-0 mt-0.5">↳</span>
                                      <span className="text-[0.6rem] text-muted leading-relaxed">
                                        {ws.selectedNames.join(", ")}
                                      </span>
                                    </div>
                                  ))}
                                </div>
                              )}
                            </div>
                          ))}
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>
            </aside>
          </div>
        </div>
      )}
    </div>
  );
}

"use client";

import { useState, useMemo, useCallback, useEffect, useRef } from "react";
import Link from "next/link";
import {
  trackRosterSave,
  trackRosterCreate,
  trackRosterShare,
  trackArmySelect,
  trackDetachmentSelect,
  trackPointsChange,
} from "@/lib/gtag";
import type { UnitRole } from "../types";
import { DETACHMENTS } from "@/data/wh40k-detachments";
import {
  groupByRole,
  RosterMetaBar,
  RosterUnitsSection,
  ROSTER_ROLES,
} from "../components/RosterViewParts";

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
  /** 同盟ユニットの場合に元の陣営IDを格納 */
  allyFaction?: string;
};

export type SavedRoster = {
  id: string;
  name: string;
  faction: string;
  factionName: string;
  detachment?: string;
  pointsLimit: number;
  units: RosterEntry[];
  warlordEntryId?: string;
  savedAt: string;
  isPublic?: boolean;
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

// ──────────────────────────────────────────────────────────────────────────────
// Imperium 同盟ルール（10th Edition）
// ・Agents of the Imperium: Imperium全陣営が使用可（agents_of_the_imperium本人を除く）
//   - Incursion(≤1000pt): Retinue×1 + Character×1 + Requisitioned×1 = 計3
//   - Strike Force(≤2000pt): Retinue×2 + Character×2 + Requisitioned×1 = 計5
//   - Onslaught(>2000pt):  Retinue×3 + Character×3 + Requisitioned×2 = 計8
// ・Imperial Knights Freeblades: Imperium全陣営が使用可（imperial_knights本人を除く）
//   - 1 TITANIC モデル、または ARMIGER モデル最大3体（どちらか一方）
// ──────────────────────────────────────────────────────────────────────────────

/** agents_of_the_imperium / imperial_knights を同盟として使える陣営の除外リスト */
const ALLY_EXCLUDED_IDS = new Set(["agents_of_the_imperium", "imperial_knights"]);

/** ポイント上限からAgentsの最大ユニット数を返す */
function getAllyAgentsLimit(pointsLimit: number): number {
  if (pointsLimit <= 1000) return 3;  // Incursion
  if (pointsLimit <= 2000) return 5;  // Strike Force
  return 8;                           // Onslaught
}

// スペースマリーン章ファクションID（baseの space_marines を先頭に、以降は各章）
const SPACE_MARINES_IDS = new Set([
  "space_marines",
  "black_templars",
  "blood_angels",
  "dark_angels",
  "deathwatch",
  "grey_knights",
  "imperial_fists",
  "iron_hands",
  "raven_guard",
  "salamanders",
  "space_wolves",
  "ultramarines",
  "white_scars",
]);

type BrowseTab = "all" | "owned";
type SortMode = "points" | "name";
type QuickFilterId = "anti-infantry" | "anti-tank" | "fast" | "core";

const BROWSE_TAB_LABEL: Record<BrowseTab, string> = {
  all: "すべて",
  owned: "所持済み",
};

const SORT_LABEL: Record<SortMode, string> = {
  points: "ポイント順",
  name: "名前順",
};

const QUICK_FILTERS: { id: QuickFilterId; label: string }[] = [
  { id: "anti-infantry", label: "対歩兵" },
  { id: "anti-tank", label: "対戦車" },
  { id: "fast", label: "高速" },
  { id: "core", label: "主力候補" },
];

function hasCategory(unit: BuilderUnit, keywords: string[]): boolean {
  const words = keywords.map((k) => k.toLowerCase());
  return unit.categories.some((c) => words.some((w) => c.toLowerCase().includes(w)));
}

function quickFilterMatch(unit: BuilderUnit, quickFilter: QuickFilterId | null): boolean {
  if (!quickFilter) return true;
  if (quickFilter === "anti-infantry") {
    return hasCategory(unit, ["infantry", "battleline", "aspect"]);
  }
  if (quickFilter === "anti-tank") {
    return hasCategory(unit, ["vehicle", "monster", "wraith", "heavy", "tank"]);
  }
  if (quickFilter === "fast") {
    return hasCategory(unit, ["fly", "mounted", "bike", "jump", "jetbike"]);
  }
  return unit.role === "HQ" || unit.role === "Battleline" || hasCategory(unit, ["character", "wraith"]);
}


function unitHint(unit: BuilderUnit): string {
  if (unit.role === "HQ") return "編成の軸になりやすい指揮ユニット";
  if (unit.role === "Battleline") return "初心者でも扱いやすい主力候補";
  if (unit.role === "Transport") return "主力を前線へ届ける支援枠";
  if (hasCategory(unit, ["fly", "mounted", "jump"])) return "機動力でサイドや後衛に圧力";
  if (hasCategory(unit, ["wraith", "monster", "vehicle"])) return "耐久を活かして盤面を支える";
  return "役割に合わせて編成しやすい汎用枠";
}

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
  /** 同盟ユニットの場合に元の陣営ID */
  allyFaction?: string;
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
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      onClick={onCancel}
    >
      {/* Backdrop */}
      <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" />

      {/* Modal */}
      <div
        className="surface-card relative w-full max-w-md rounded-2xl overflow-hidden max-h-[90vh] flex flex-col"
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
        <div className="flex-1 overflow-y-auto px-5 py-4 space-y-5">
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

// ─── Roster Text Format ──────────────────────────────────────────────────────

const ROLE_TEXT_LABEL: Record<string, string> = {
  HQ: "Character",
  Battleline: "Battleline",
  Transport: "Dedicated Transport",
  Other: "Other",
  Heavy: "Heavy",
};

function formatRosterText(params: {
  name: string;
  factionName: string;
  detachment?: string;
  pointsLimit: number;
  units: RosterEntry[];
  warlordEntryId?: string;
}): string {
  const total = params.units.reduce((s, u) => s + u.pts, 0);
  const lines: string[] = [];
  lines.push(`【${params.name}】`);
  lines.push(`${params.factionName}${params.detachment ? ` / ${params.detachment}` : ""} | ${params.pointsLimit}pt制限`);
  lines.push("");
  for (const role of ["HQ", "Battleline", "Transport", "Other", "Heavy"] as const) {
    const roleUnits = params.units.filter((u) => u.role === role);
    if (roleUnits.length === 0) continue;
    lines.push(`■ ${ROLE_TEXT_LABEL[role]}`);
    for (const u of roleUnits) {
      const isWarlord = params.warlordEntryId === u.entryId;
      lines.push(`  ・${u.nameJa ?? u.name} (${u.pts}pt)${isWarlord ? " 【Warlord】" : ""}`);
      for (const ws of u.weaponSelections ?? []) {
        const delta = ws.pointsDelta !== 0 ? ` (${ws.pointsDelta > 0 ? "+" : ""}${ws.pointsDelta}pt)` : "";
        lines.push(`    └ ${ws.groupName}: ${ws.selectedNames.join(" / ")}${delta}`);
      }
    }
    lines.push("");
  }
  lines.push(`合計: ${total}pt / ${params.pointsLimit}pt`);
  return lines.join("\n").trimEnd();
}

// ─── Save / Share Controls ───────────────────────────────────────────────────

function SaveShareControls({
  disabled,
  saveStatus,
  publicSaveStatus,
  onSave,
  onPublicSave,
  onShare,
  onCopyRoster,
  onReset,
}: {
  disabled: boolean;
  saveStatus: "idle" | "saved";
  publicSaveStatus: "idle" | "saving" | "published";
  onSave: () => void;
  onPublicSave: () => void;
  onShare: () => void;
  onCopyRoster: () => void;
  onReset: () => void;
}) {
  return (
    <div className="flex flex-wrap items-center gap-2">
      <button
        onClick={onSave}
        disabled={disabled}
        className="rounded-full bg-rose-500 px-4 py-1.5 text-xs font-bold text-white transition hover:bg-rose-400 disabled:opacity-40"
      >
        {saveStatus === "saved" ? "✅ 保存済み" : "💾 保存"}
      </button>
      <button
        onClick={onPublicSave}
        disabled={disabled || publicSaveStatus === "saving"}
        className="rounded-full border border-emerald-400/50 bg-emerald-500/10 px-4 py-1.5 text-xs font-bold text-emerald-700 transition hover:bg-emerald-500/15 disabled:opacity-40 dark:text-emerald-300"
      >
        {publicSaveStatus === "saving"
          ? "公開中..."
          : publicSaveStatus === "published"
            ? "公開済み"
            : "公開保存"}
      </button>
      <button
        onClick={onShare}
        disabled={disabled}
        className="rounded-full border border-slate-300/60 px-4 py-1.5 text-xs font-semibold transition hover:border-rose-400/60 disabled:opacity-40 dark:border-slate-600/60"
      >
        🔗 共有
      </button>
      <button
        onClick={onCopyRoster}
        disabled={disabled}
        className="rounded-full border border-slate-300/60 px-4 py-1.5 text-xs font-semibold transition hover:border-sky-400/60 disabled:opacity-40 dark:border-slate-600/60"
      >
        📋 コピー
      </button>
      <button
        onClick={onReset}
        disabled={disabled}
        className="rounded-full border border-slate-300/60 px-4 py-1.5 text-xs font-semibold text-muted transition hover:border-red-400/60 hover:text-red-400 disabled:opacity-40 dark:border-slate-600/60"
      >
        🗑 リセット
      </button>
    </div>
  );
}

// ─── Builder Header ──────────────────────────────────────────────────────────

type BuilderHeaderProps = {
  selectedFaction: FactionListItem;
  detachmentOptions: { name: string; nameJa: string }[];
  rosterName: string;
  pointsLimit: number;
  detachment: string;
  saveStatus: "idle" | "saved";
  publicSaveStatus: "idle" | "saving" | "published";
  rosterCount: number;
  totalPts: number;
  onRosterNameChange: (value: string) => void;
  onPointsLimitChange: (value: number) => void;
  onDetachmentChange: (value: string) => void;
  onFactionChange: () => void;
  onSave: () => void;
  onPublicSave: () => void;
  onShare: () => void;
  onCopyRoster: () => void;
  onReset: () => void;
};

function BuilderHeader({
  selectedFaction,
  detachmentOptions,
  rosterName,
  pointsLimit,
  detachment,
  saveStatus,
  publicSaveStatus,
  rosterCount,
  totalPts,
  onRosterNameChange,
  onPointsLimitChange,
  onDetachmentChange,
  onFactionChange,
  onSave,
  onPublicSave,
  onShare,
  onCopyRoster,
  onReset,
}: BuilderHeaderProps) {
  const groupMeta = GROUP_META[selectedFaction.group];
  return (
    <div className="sticky top-0 z-20 border-b border-white/70 bg-white shadow-[0_18px_36px_-28px_rgba(15,23,42,0.38)] dark:border-white/20 dark:bg-white/90">
      <div className="mx-auto max-w-[1400px] px-4 py-3">
        <div className="rounded-2xl border border-white/80 bg-white px-4 py-3 shadow-[0_18px_40px_-34px_rgba(15,23,42,0.45)] supports-[backdrop-filter]:backdrop-blur-sm dark:border-white/30 dark:bg-white dark:shadow-none">
          <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
            <div className="flex flex-wrap items-center gap-2">
              <Link href="/wh40k" className="text-xs text-slate-500 transition hover:text-rose-500">
                ← WH40K
              </Link>
              <h1 className="text-base font-black uppercase tracking-tight text-slate-700">
                Army Builder
              </h1>
              <button
                onClick={onFactionChange}
                className={`rounded-full px-2.5 py-0.5 text-[0.65rem] font-bold transition hover:opacity-70 ${groupMeta.badge}`}
                title="陣営を変更"
              >
                {selectedFaction.name} ▾
              </button>
              <select
                value={pointsLimit}
                onChange={(e) => onPointsLimitChange(Number(e.target.value))}
                className="rounded-full border border-slate-300/70 bg-white/90 px-3 py-1 text-xs font-bold text-slate-800 shadow-sm dark:border-white/40 dark:bg-white dark:text-slate-800"
              >
                {POINTS_LIMITS.map((p) => (
                  <option key={p} value={p}>
                    {p}pt
                  </option>
                ))}
              </select>
              {detachmentOptions.length > 0 ? (
                <select
                  value={detachment}
                  onChange={(e) => onDetachmentChange(e.target.value)}
                  className="rounded-full border border-slate-300/70 bg-white/90 px-3 py-1 text-xs font-bold text-slate-800 shadow-sm dark:border-white/40 dark:bg-white dark:text-slate-800"
                >
                  <option value="">デタッチメント</option>
                  {detachmentOptions.map((d) => (
                    <option key={d.name} value={d.name}>
                      {d.nameJa}
                    </option>
                  ))}
                </select>
              ) : (
                <input
                  value={detachment}
                  onChange={(e) => onDetachmentChange(e.target.value)}
                  placeholder="デタッチメント"
                  className="rounded-full border border-slate-300/70 bg-white/90 px-3 py-1 text-xs text-slate-800 shadow-sm outline-none focus:border-rose-400/70 dark:border-white/40 dark:bg-white dark:text-slate-800"
                />
              )}
            </div>
            <div className="flex flex-1 flex-wrap items-center gap-2 md:justify-end">
              <input
                value={rosterName}
                onChange={(e) => onRosterNameChange(e.target.value)}
                className="min-w-[160px] flex-1 rounded-lg border border-slate-300/70 bg-white px-3 py-1 text-xs text-slate-800 outline-none shadow-sm focus:border-rose-400/70 dark:border-white/40 dark:bg-white dark:text-slate-800"
                placeholder="Roster Name"
              />
              <SaveShareControls
                disabled={rosterCount === 0}
                saveStatus={saveStatus}
                publicSaveStatus={publicSaveStatus}
                onSave={onSave}
                onPublicSave={onPublicSave}
                onShare={onShare}
                onCopyRoster={onCopyRoster}
                onReset={onReset}
              />
            </div>
          </div>
          {rosterCount > 0 && (
            <div className="mt-2">
              <PointBar used={totalPts} limit={pointsLimit} />
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

// ─── Filter Sidebar ──────────────────────────────────────────────────────────

type FilterSidebarProps = {
  className?: string;
  search: string;
  filterRole: UnitRole | "ALL";
  units: BuilderUnit[];
  availableTags: string[];
  selectedTags: string[];
  quickFilter: QuickFilterId | null;
  sortMode: SortMode;
  onSearchChange: (value: string) => void;
  onFilterRoleChange: (role: UnitRole | "ALL") => void;
  onToggleTag: (tag: string) => void;
  onQuickFilterChange: (filter: QuickFilterId | null) => void;
  onSortModeChange: (sortMode: SortMode) => void;
  onClearTagFilter: () => void;
};

function FilterSidebar({
  className,
  search,
  filterRole,
  units,
  availableTags,
  selectedTags,
  quickFilter,
  sortMode,
  onSearchChange,
  onFilterRoleChange,
  onToggleTag,
  onQuickFilterChange,
  onSortModeChange,
  onClearTagFilter,
}: FilterSidebarProps) {
  return (
    <aside className={`space-y-3 md:sticky md:top-[90px] md:self-start ${className ?? ""}`}>
      <div className="surface-card rounded-2xl p-4 space-y-4">
        <h2 className="text-[0.65rem] font-bold uppercase tracking-widest text-muted">
          フィルター
        </h2>
        <input
          type="text"
          placeholder="🔍 ユニット名で検索…"
          value={search}
          onChange={(e) => onSearchChange(e.target.value)}
          className="w-full rounded-xl border border-slate-300/60 bg-transparent px-3 py-2 text-xs outline-none placeholder:text-muted focus:border-rose-400/60 dark:border-slate-600/60"
        />
        <div className="space-y-0.5">
          <button
            onClick={() => onFilterRoleChange("ALL")}
            className={`w-full rounded-lg px-3 py-1.5 text-left text-xs font-medium transition ${
              filterRole === "ALL"
                ? "bg-rose-500/10 text-rose-500"
                : "text-muted hover:text-[color:var(--fg-body)]"
            }`}
          >
            全ロール
          </button>
          {ROLES.map((role) => {
            const meta = ROLE_META[role];
            const count = units.filter((u) => u.role === role).length;
            return (
              <button
                key={role}
                onClick={() => onFilterRoleChange(role)}
                className={`w-full flex items-center justify-between rounded-lg px-3 py-1.5 text-xs font-medium transition ${
                  filterRole === role
                    ? `${meta.bg} ${meta.text}`
                    : "text-muted hover:text-[color:var(--fg-body)]"
                }`}
              >
                <span>{meta.label}</span>
                <span className="text-[0.6rem]">{count}</span>
              </button>
            );
          })}
        </div>

        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <p className="text-[0.62rem] font-bold uppercase tracking-widest text-muted">Tags</p>
            {selectedTags.length > 0 && (
              <button
                onClick={onClearTagFilter}
                className="text-[0.6rem] font-semibold text-rose-500 transition hover:opacity-80"
              >
                解除
              </button>
            )}
          </div>
          <div className="flex flex-wrap gap-1.5">
            {availableTags.slice(0, 10).map((tag) => {
              const active = selectedTags.includes(tag);
              return (
                <button
                  key={tag}
                  onClick={() => onToggleTag(tag)}
                  className={`rounded-full border px-2.5 py-1 text-[0.62rem] font-semibold transition ${
                    active
                      ? "border-rose-400/70 bg-rose-500/10 text-rose-500"
                      : "border-slate-300/60 text-muted hover:border-slate-400/60 dark:border-slate-700/60"
                  }`}
                >
                  {active ? "✓ " : ""}
                  {tag}
                </button>
              );
            })}
          </div>
        </div>

        <div className="space-y-2">
          <p className="text-[0.62rem] font-bold uppercase tracking-widest text-muted">Quick Filters</p>
          <div className="flex flex-wrap gap-1.5">
            {QUICK_FILTERS.map((f) => {
              const active = quickFilter === f.id;
              return (
                <button
                  key={f.id}
                  onClick={() => onQuickFilterChange(active ? null : f.id)}
                  className={`rounded-full border px-2.5 py-1 text-[0.62rem] font-semibold transition ${
                    active
                      ? "border-indigo-400/70 bg-indigo-500/10 text-indigo-500 dark:text-indigo-400"
                      : "border-slate-300/60 text-muted hover:border-slate-400/60 dark:border-slate-700/60"
                  }`}
                >
                  {f.label}
                </button>
              );
            })}
          </div>
        </div>

        <div className="space-y-1.5">
          <p className="text-[0.62rem] font-bold uppercase tracking-widest text-muted">Sort</p>
          {(Object.keys(SORT_LABEL) as SortMode[]).map((mode) => (
            <button
              key={mode}
              onClick={() => onSortModeChange(mode)}
              className={`w-full rounded-lg px-3 py-1.5 text-left text-xs font-medium transition ${
                sortMode === mode
                  ? "bg-indigo-500/10 text-indigo-500 dark:text-indigo-400"
                  : "text-muted hover:text-[color:var(--fg-body)]"
              }`}
            >
              {sortMode === mode ? "● " : "○ "}
              {SORT_LABEL[mode]}
            </button>
          ))}
        </div>
      </div>
    </aside>
  );
}

// ─── Unit Card List ──────────────────────────────────────────────────────────

type UnitCardListProps = {
  className?: string;
  unitsByRole: Record<UnitRole, BuilderUnit[]>;
  filteredUnitsCount: number;
  totalUnitsCount: number;
  browseTab: BrowseTab;
  tabCounts: Record<BrowseTab, number>;
  countInRoster: (unitId: string) => number;
  onAddUnit: (unit: BuilderUnit) => void;
  onRemoveUnit: (unitId: string) => void;
  onBrowseTabChange: (tab: BrowseTab) => void;
  // 同盟ユニット
  allyAgents?: BuilderUnit[];
  allyKnights?: BuilderUnit[];
  allyAgentsInRoster?: number;
  allyAgentsLimit?: number;
  allyKnightsInRoster?: number;
  onAddAllyUnit?: (unit: BuilderUnit, allyFaction: string) => void;
  onRemoveAllyUnit?: (unitId: string) => void;
};

function UnitCardList({
  className,
  unitsByRole,
  filteredUnitsCount,
  totalUnitsCount,
  browseTab,
  tabCounts,
  countInRoster,
  onAddUnit,
  onRemoveUnit,
  onBrowseTabChange,
  allyAgents = [],
  allyKnights = [],
  allyAgentsInRoster = 0,
  allyAgentsLimit = 0,
  allyKnightsInRoster = 0,
  onAddAllyUnit,
  onRemoveAllyUnit,
}: UnitCardListProps) {
  const [allyExpanded, setAllyExpanded] = useState(false);
  const hasAllies = allyAgents.length > 0 || allyKnights.length > 0;

  return (
    <main className={`min-w-0 space-y-4 ${className ?? ""}`}>
      <div className="surface-card rounded-2xl p-3">
        <div className="flex flex-wrap gap-1.5">
          {(Object.keys(BROWSE_TAB_LABEL) as BrowseTab[]).map((tab) => {
            const active = browseTab === tab;
            return (
              <button
                key={tab}
                onClick={() => onBrowseTabChange(tab)}
                className={`rounded-full px-3 py-1 text-xs font-semibold transition ${
                  active
                    ? "bg-rose-500/10 text-rose-500 dark:text-rose-400"
                    : "text-muted hover:bg-slate-100 dark:hover:bg-slate-800/60"
                }`}
              >
                {BROWSE_TAB_LABEL[tab]} ({tabCounts[tab]})
              </button>
            );
          })}
        </div>
      </div>

      {ROLES.map((role) => {
        const roleUnits = unitsByRole[role];
        if (!roleUnits.length) return null;
        const meta = ROLE_META[role];
        return (
          <section key={role} className="space-y-2">
            <div className="flex items-center gap-2">
              <span className={`text-[0.65rem] font-bold uppercase tracking-widest ${meta.text}`}>
                {meta.label}
              </span>
              <span className="text-[0.65rem] text-muted">{roleUnits.length}</span>
            </div>
            <div className="space-y-1.5">
              {roleUnits.map((unit) => {
                const count = countInRoster(unit.id);
                const active = count > 0;
                return (
                  <div
                    key={unit.id}
                    className={`flex items-center rounded-xl border px-4 py-2.5 transition ${
                      active ? `${meta.bg} ${meta.border}` : "surface-card border-transparent"
                    }`}
                  >
                    <div className="min-w-0 flex-1">
                      <Link
                        href={`/wh40k/units/${unit.slug}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        onClick={(e) => e.stopPropagation()}
                        className={`truncate text-xs font-semibold underline decoration-dotted underline-offset-2 transition hover:opacity-70 ${
                          active ? meta.text : ""
                        }`}
                      >
                        {unit.name}
                      </Link>
                      {unit.nameJa && (
                        <p className="truncate text-[0.6rem] text-muted">{unit.nameJa}</p>
                      )}
                      <p className="mt-1 text-[0.68rem] text-muted">{unitHint(unit)}</p>
                      <div className="mt-1 flex flex-wrap gap-1">
                        {unit.categories.slice(0, 3).map((c) => (
                          <span
                            key={c}
                            className="rounded-full border border-slate-300/60 px-2 py-0.5 text-[0.55rem] text-muted dark:border-slate-700/60"
                          >
                            {c}
                          </span>
                        ))}
                      </div>
                    </div>
                    <div className="ml-2 flex shrink-0 items-center gap-1">
                      <span className={`text-xs font-bold ${active ? meta.text : "text-muted"}`}>
                        {unit.basePoints}pt
                      </span>
                      {active && (
                        <>
                          <button
                            onClick={() => onRemoveUnit(unit.id)}
                            className="flex h-6 w-6 items-center justify-center rounded-full text-sm text-muted hover:bg-red-500/10 hover:text-red-400"
                            title="1つ削除"
                          >
                            −
                          </button>
                          <span className={`min-w-[1rem] text-center text-xs font-black ${meta.text}`}>
                            {count}
                          </span>
                        </>
                      )}
                      <button
                        onClick={() => onAddUnit(unit)}
                        className={`flex h-6 w-6 items-center justify-center rounded-full text-sm font-bold transition ${
                          active ? `${meta.text} hover:opacity-70` : "text-muted hover:text-[color:var(--fg-body)]"
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
          </section>
        );
      })}
      {filteredUnitsCount === 0 && totalUnitsCount > 0 && (
        <div className="surface-card rounded-2xl px-6 py-12 text-center text-sm text-muted">
          条件に一致するユニットが見つかりません
        </div>
      )}

      {/* ── Allied Units セクション ── */}
      {hasAllies && (
        <div className="rounded-2xl border border-amber-400/25 bg-amber-500/5">
          {/* ヘッダー（折りたたみトグル） */}
          <button
            onClick={() => setAllyExpanded((v) => !v)}
            className="flex w-full items-center justify-between px-4 py-3 text-left"
          >
            <div className="flex items-center gap-2">
              <span className="text-[0.65rem] font-bold uppercase tracking-widest text-amber-600 dark:text-amber-400">
                Allied Units / 同盟ユニット
              </span>
              <span className="rounded-full bg-amber-500/15 px-2 py-0.5 text-[0.6rem] font-bold text-amber-600 dark:text-amber-300">
                {allyAgentsInRoster + allyKnightsInRoster}
              </span>
            </div>
            <span className="text-[0.65rem] text-muted">
              {allyExpanded ? "▲ 閉じる" : "▼ 開く"}
            </span>
          </button>

          {allyExpanded && (
            <div className="space-y-4 border-t border-amber-400/20 px-4 pb-4 pt-3">
              {/* Agents of the Imperium */}
              {allyAgents.length > 0 && (
                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <span className="text-[0.6rem] font-bold uppercase tracking-widest text-amber-500">
                      Agents of the Imperium
                    </span>
                    <span className={`text-[0.6rem] font-bold ${allyAgentsInRoster > allyAgentsLimit ? "text-red-500" : "text-muted"}`}>
                      {allyAgentsInRoster}/{allyAgentsLimit}
                    </span>
                    <span className="text-[0.55rem] text-muted">（ポイント制限に応じた上限）</span>
                  </div>
                  <div className="space-y-1.5">
                    {allyAgents.map((unit) => {
                      const count = countInRoster(unit.id);
                      const active = count > 0;
                      return (
                        <div
                          key={unit.id}
                          className={`flex items-center rounded-xl border px-4 py-2.5 transition ${
                            active
                              ? "border-amber-400/40 bg-amber-500/10"
                              : "surface-card border-transparent"
                          }`}
                        >
                          <div className="min-w-0 flex-1">
                            <p className={`truncate text-xs font-semibold ${active ? "text-amber-600 dark:text-amber-400" : ""}`}>
                              {unit.name}
                            </p>
                            {unit.nameJa && <p className="truncate text-[0.6rem] text-muted">{unit.nameJa}</p>}
                          </div>
                          <div className="ml-2 flex shrink-0 items-center gap-1">
                            <span className={`text-xs font-bold ${active ? "text-amber-600 dark:text-amber-400" : "text-muted"}`}>
                              {unit.basePoints}pt
                            </span>
                            {active && (
                              <>
                                <button
                                  onClick={() => onRemoveAllyUnit?.(unit.id)}
                                  className="flex h-6 w-6 items-center justify-center rounded-full text-sm text-muted hover:bg-red-500/10 hover:text-red-400"
                                  title="1つ削除"
                                >−</button>
                                <span className="min-w-[1rem] text-center text-xs font-black text-amber-600 dark:text-amber-400">
                                  {count}
                                </span>
                              </>
                            )}
                            <button
                              onClick={() => onAddAllyUnit?.(unit, "agents_of_the_imperium")}
                              className={`flex h-6 w-6 items-center justify-center rounded-full text-sm font-bold transition ${
                                active ? "text-amber-600 hover:opacity-70 dark:text-amber-400" : "text-muted hover:text-[color:var(--fg-body)]"
                              }`}
                              title="ロスターに追加"
                            >＋</button>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}

              {/* Imperial Knights Freeblades */}
              {allyKnights.length > 0 && (
                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <span className="text-[0.6rem] font-bold uppercase tracking-widest text-amber-500">
                      Imperial Knights Freeblades
                    </span>
                    <span className={`text-[0.6rem] font-bold ${allyKnightsInRoster > 3 ? "text-red-500" : "text-muted"}`}>
                      {allyKnightsInRoster}
                    </span>
                    <span className="text-[0.55rem] text-muted">（1 Titanic または Armiger×3まで）</span>
                  </div>
                  <div className="space-y-1.5">
                    {allyKnights.map((unit) => {
                      const count = countInRoster(unit.id);
                      const active = count > 0;
                      const isTitanic = unit.categories.some((c) => c.toLowerCase() === "titanic");
                      return (
                        <div
                          key={unit.id}
                          className={`flex items-center rounded-xl border px-4 py-2.5 transition ${
                            active
                              ? "border-amber-400/40 bg-amber-500/10"
                              : "surface-card border-transparent"
                          }`}
                        >
                          <div className="min-w-0 flex-1">
                            <p className={`truncate text-xs font-semibold ${active ? "text-amber-600 dark:text-amber-400" : ""}`}>
                              {unit.name}
                              {isTitanic && (
                                <span className="ml-1.5 rounded-full border border-amber-400/50 px-1.5 py-0.5 text-[0.5rem] font-bold text-amber-500">
                                  TITANIC
                                </span>
                              )}
                            </p>
                            {unit.nameJa && <p className="truncate text-[0.6rem] text-muted">{unit.nameJa}</p>}
                          </div>
                          <div className="ml-2 flex shrink-0 items-center gap-1">
                            <span className={`text-xs font-bold ${active ? "text-amber-600 dark:text-amber-400" : "text-muted"}`}>
                              {unit.basePoints}pt
                            </span>
                            {active && (
                              <>
                                <button
                                  onClick={() => onRemoveAllyUnit?.(unit.id)}
                                  className="flex h-6 w-6 items-center justify-center rounded-full text-sm text-muted hover:bg-red-500/10 hover:text-red-400"
                                  title="1つ削除"
                                >−</button>
                                <span className="min-w-[1rem] text-center text-xs font-black text-amber-600 dark:text-amber-400">
                                  {count}
                                </span>
                              </>
                            )}
                            <button
                              onClick={() => onAddAllyUnit?.(unit, "imperial_knights")}
                              className={`flex h-6 w-6 items-center justify-center rounded-full text-sm font-bold transition ${
                                active ? "text-amber-600 hover:opacity-70 dark:text-amber-400" : "text-muted hover:text-[color:var(--fg-body)]"
                              }`}
                              title="ロスターに追加"
                            >＋</button>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      )}
    </main>
  );
}

// ─── Roster Sidebar ──────────────────────────────────────────────────────────

type RosterSidebarProps = {
  className?: string;
  roster: RosterEntry[];
  rosterByRole: Record<UnitRole, RosterEntry[]>;
  pointsLimit: number;
  totalPts: number;
  onRemoveEntry: (entryId: string) => void;
  warlordEntryId: string | null;
  onSetWarlord: (entryId: string | null) => void;
  allyAgentsInRoster?: number;
  allyAgentsLimit?: number;
  allyKnightsInRoster?: number;
};

function RosterSidebar({
  className,
  roster,
  rosterByRole,
  pointsLimit,
  totalPts,
  onRemoveEntry,
  warlordEntryId,
  onSetWarlord,
  allyAgentsInRoster = 0,
  allyAgentsLimit = 0,
  allyKnightsInRoster = 0,
}: RosterSidebarProps) {
  const roleSummary = ROSTER_ROLES
    .map((role) => ({ role, count: rosterByRole[role].length }))
    .filter((row) => row.count > 0);

  const showAlly = allyAgentsLimit > 0;
  const agentsOver = allyAgentsInRoster > allyAgentsLimit;
  const knightsOver = allyKnightsInRoster > 3;

  return (
    <aside className={`space-y-3 md:sticky md:top-[90px] md:self-start ${className ?? ""}`}>
      <div className="surface-card rounded-2xl p-4 space-y-4">
        <div className="flex items-center justify-between border-b border-slate-200/70 pb-2 dark:border-slate-700/60">
          <h2 className="text-sm font-black uppercase tracking-[0.25em] text-[color:var(--fg-body)]">
            ロスター
          </h2>
          <span className="text-[0.7rem] font-semibold text-muted">{roster.length}ユニット</span>
        </div>
        <RosterMetaBar total={totalPts} limit={pointsLimit} summary={roleSummary} />
        {roster.length === 0 ? (
          <p className="py-6 text-center text-[0.7rem] text-muted">ユニットを追加してください</p>
        ) : (
          <RosterUnitsSection byRole={rosterByRole} onRemoveEntry={onRemoveEntry} onSetWarlord={onSetWarlord} warlordEntryId={warlordEntryId} compact />
        )}
      </div>

      {/* 同盟ユニット サマリー */}
      {showAlly && (
        <div className="surface-card rounded-2xl p-3 space-y-2">
          <p className="text-[0.6rem] font-bold uppercase tracking-widest text-amber-600 dark:text-amber-400">
            Allied Units
          </p>
          <div className="space-y-1">
            <div className="flex items-center justify-between text-[0.65rem]">
              <span className="text-muted">Agents of the Imperium</span>
              <span className={`font-bold ${agentsOver ? "text-red-500" : "text-amber-600 dark:text-amber-400"}`}>
                {allyAgentsInRoster}/{allyAgentsLimit}
                {agentsOver && " ⚠"}
              </span>
            </div>
            <div className="flex items-center justify-between text-[0.65rem]">
              <span className="text-muted">Knights Freeblades</span>
              <span className={`font-bold ${knightsOver ? "text-red-500" : "text-amber-600 dark:text-amber-400"}`}>
                {allyKnightsInRoster}
                {knightsOver && " ⚠ 上限超過"}
              </span>
            </div>
            <p className="text-[0.55rem] text-muted leading-relaxed pt-0.5">
              Titanic×1 または Armiger×3 まで
            </p>
          </div>
        </div>
      )}
    </aside>
  );
}

// ─── FactionPicker ───────────────────────────────────────────────────────────

function FactionCard({
  f,
  badge,
  onSelect,
}: {
  f: FactionListItem;
  badge: string;
  onSelect: (f: FactionListItem) => void;
}) {
  return (
    <button
      onClick={() => onSelect(f)}
      className="surface-card flex items-center justify-between rounded-2xl px-4 py-3 text-left transition hover:-translate-y-0.5 hover:border-rose-400/60 active:scale-95"
    >
      <div className="min-w-0">
        <p className="truncate text-sm font-bold">{f.name}</p>
        {f.nameJa && <p className="truncate text-[0.65rem] text-muted">{f.nameJa}</p>}
      </div>
      <span className={`ml-3 shrink-0 rounded-full px-2 py-0.5 text-[0.6rem] font-bold ${badge}`}>
        {f.unitCount}
      </span>
    </button>
  );
}

function FactionPicker({
  factions,
  onSelect,
}: {
  factions: FactionListItem[];
  onSelect: (f: FactionListItem) => void;
}) {
  const [search, setSearch] = useState("");
  const [smExpanded, setSmExpanded] = useState(false);

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

  // 検索中は強制展開
  const isSearching = search.trim().length > 0;

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

        if (group === "Imperium") {
          // Space Marines章とその他に分割
          const smBase = items.find((f) => f.id === "space_marines");
          const smChapters = items.filter((f) => f.id !== "space_marines" && SPACE_MARINES_IDS.has(f.id));
          const otherImperium = items.filter((f) => !SPACE_MARINES_IDS.has(f.id));
          const showSm = isSearching || smExpanded;

          return (
            <div key={group} className="space-y-3">
              <h3 className={`text-[0.65rem] font-bold uppercase tracking-[0.3em] ${meta.text}`}>{group}</h3>

              {/* スペースマリーン群 */}
              <div className="rounded-2xl border border-amber-400/20 bg-amber-500/5 p-3 space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-[0.65rem] font-bold uppercase tracking-widest text-amber-600 dark:text-amber-400">
                    Space Marines
                  </span>
                  {!isSearching && (
                    <button
                      onClick={() => setSmExpanded((v) => !v)}
                      className="text-[0.65rem] text-muted hover:text-amber-500 transition"
                    >
                      {smExpanded ? "▲ 折りたたむ" : `▼ 章を選ぶ (${smChapters.length + (smBase ? 1 : 0)})`}
                    </button>
                  )}
                </div>
                <div className="grid gap-2 sm:grid-cols-2">
                  {/* ベースSMを常に表示 */}
                  {smBase && (
                    <FactionCard f={smBase} badge={meta.badge} onSelect={onSelect} />
                  )}
                  {/* 各章は展開時のみ表示 */}
                  {showSm && smChapters.map((f) => (
                    <FactionCard key={f.id} f={f} badge={meta.badge} onSelect={onSelect} />
                  ))}
                </div>
              </div>

              {/* その他のImperium陣営 */}
              {otherImperium.length > 0 && (
                <div className="grid gap-2 sm:grid-cols-2">
                  {otherImperium.map((f) => (
                    <FactionCard key={f.id} f={f} badge={meta.badge} onSelect={onSelect} />
                  ))}
                </div>
              )}
            </div>
          );
        }

        return (
          <div key={group} className="space-y-2">
            <h3 className={`text-[0.65rem] font-bold uppercase tracking-[0.3em] ${meta.text}`}>{group}</h3>
            <div className="grid gap-2 sm:grid-cols-2">
              {items.map((f) => (
                <FactionCard key={f.id} f={f} badge={meta.badge} onSelect={onSelect} />
              ))}
            </div>
          </div>
        );
      })}
    </div>
  );
}

// ─── Main: BuilderClient ─────────────────────────────────────────────────────

export function BuilderClient({
  factions,
  editId,
  addFaction,
  addUnitSlug,
}: {
  factions: FactionListItem[];
  editId?: string;
  addFaction?: string;
  addUnitSlug?: string;
}) {
  const [selectedFaction, setSelectedFaction] = useState<FactionListItem | null>(
    () => (addFaction ? (factions.find((f) => f.id === addFaction) ?? null) : null)
  );
  const [units, setUnits] = useState<BuilderUnit[]>([]);
  const [allyUnits, setAllyUnits] = useState<{ agents: BuilderUnit[]; knights: BuilderUnit[] }>({ agents: [], knights: [] });
  const [loadingUnits, setLoadingUnits] = useState(false);

  const [rosterName, setRosterName] = useState("My Roster");
  const [pointsLimit, setPointsLimit] = useState(1000);
  const [detachment, setDetachment] = useState("");
  const [roster, setRoster] = useState<RosterEntry[]>([]);
  const [search, setSearch] = useState("");
  const [filterRole, setFilterRole] = useState<UnitRole | "ALL">("ALL");
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [quickFilter, setQuickFilter] = useState<QuickFilterId | null>(null);
  const [sortMode, setSortMode] = useState<SortMode>("points");
  const [browseTab, setBrowseTab] = useState<BrowseTab>("all");
  const [warlordEntryId, setWarlordEntryId] = useState<string | null>(null);
  const [saveStatus, setSaveStatus] = useState<"idle" | "saved">("idle");
  const [publicSaveStatus, setPublicSaveStatus] = useState<"idle" | "saving" | "published">("idle");

  // 武器オプションキャッシュ（unitId → WeaponGroup[]）
  const weaponCache = useRef<Map<string, WeaponGroup[]>>(new Map());

  // 武器選択モーダル
  const [weaponModal, setWeaponModal] = useState<ModalState | null>(null);

  // 編集モード: 陣営変更時のロスタークリアをスキップするフラグ
  const skipRosterClear = useRef(false);

  // ユニットページからの「Builderで追加」: ユニット読込後に追加するslugを保持
  const pendingAddSlug = useRef<string | null>(addUnitSlug ?? null);

  // 編集モード: localStorage から既存ロスターをロード
  useEffect(() => {
    if (!editId) return;
    const raw = localStorage.getItem("wh40k_rosters");
    if (!raw) return;
    try {
      const saved: SavedRoster[] = JSON.parse(raw);
      const target = saved.find((r) => r.id === editId);
      if (!target) return;
      const faction = factions.find((f) => f.id === target.faction);
      if (!faction) return;
      skipRosterClear.current = true;
      setSelectedFaction(faction);
      setRosterName(target.name);
      setPointsLimit(target.pointsLimit);
      setDetachment(target.detachment ?? "");
      setRoster(target.units);
      setWarlordEntryId(target.warlordEntryId ?? null);
    } catch {
      // no-op
    }
  // editId と factions は初回のみ参照。factions はサーバーから渡す静的データ
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [editId]);

  // 陣営選択時にユニットを取得
  useEffect(() => {
    if (!selectedFaction) return;
    setLoadingUnits(true);
    setUnits([]);
    setAllyUnits({ agents: [], knights: [] });
    if (!skipRosterClear.current) {
      setRoster([]);
      setDetachment("");
      setWarlordEntryId(null);
    }
    skipRosterClear.current = false;
    setSearch("");
    setFilterRole("ALL");
    setSelectedTags([]);
    setQuickFilter(null);
    setSortMode("points");
    setBrowseTab("all");
    weaponCache.current.clear();

    // Space Marines章の場合はベースSMユニットも合わせて取得
    const isSmChapter =
      selectedFaction.id !== "space_marines" && SPACE_MARINES_IDS.has(selectedFaction.id);

    // Imperium陣営かつ同盟除外リスト以外なら ally ユニットを取得
    const canUseAllies =
      selectedFaction.group === "Imperium" && !ALLY_EXCLUDED_IDS.has(selectedFaction.id);

    const mainFetch = fetch(`/api/wh40k/factions/${selectedFaction.id}/units`).then((r) => r.json() as Promise<BuilderUnit[]>);
    const smFetch = isSmChapter
      ? fetch(`/api/wh40k/factions/space_marines/units`).then((r) => r.json() as Promise<BuilderUnit[]>)
      : Promise.resolve(null);
    const agentsFetch = canUseAllies
      ? fetch(`/api/wh40k/factions/agents_of_the_imperium/units`).then((r) => r.json() as Promise<BuilderUnit[]>)
      : Promise.resolve(null);
    const knightsFetch = canUseAllies
      ? fetch(`/api/wh40k/factions/imperial_knights/units`).then((r) => r.json() as Promise<BuilderUnit[]>)
      : Promise.resolve(null);

    Promise.all([mainFetch, smFetch, agentsFetch, knightsFetch])
      .then(([chapterUnits, smUnits, agentsUnits, knightsUnits]) => {
        // メインユニット（SM章マージ）
        if (smUnits) {
          const seen = new Set(chapterUnits.map((u) => u.id));
          setUnits([...chapterUnits, ...smUnits.filter((u) => !seen.has(u.id))]);
        } else {
          setUnits(chapterUnits);
        }
        // 同盟ユニット
        if (agentsUnits || knightsUnits) {
          setAllyUnits({ agents: agentsUnits ?? [], knights: knightsUnits ?? [] });
        }
      })
      .catch(console.error)
      .finally(() => setLoadingUnits(false));
  }, [selectedFaction]);

  // ─── Derived ──────────────────────────────────────────────────────────────

  const countInRoster = useCallback(
    (unitId: string) => roster.filter((r) => r.unitId === unitId).length,
    [roster]
  );

  const availableTags = useMemo(() => {
    const tagCounts = new Map<string, number>();
    for (const unit of units) {
      for (const tag of unit.categories) {
        tagCounts.set(tag, (tagCounts.get(tag) ?? 0) + 1);
      }
    }
    return [...tagCounts.entries()]
      .sort((a, b) => b[1] - a[1] || a[0].localeCompare(b[0]))
      .map(([tag]) => tag);
  }, [units]);

  const baseFilteredUnits = useMemo(() => {
    return units.filter((u) => {
      if (filterRole !== "ALL" && u.role !== filterRole) return false;
      if (selectedTags.length > 0 && !selectedTags.every((tag) => u.categories.includes(tag))) return false;
      if (!quickFilterMatch(u, quickFilter)) return false;
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
  }, [units, search, filterRole, selectedTags, quickFilter]);

  const tabCounts = useMemo(() => {
    const ownedCount = baseFilteredUnits.filter((u) => countInRoster(u.id) > 0).length;
    return {
      all: baseFilteredUnits.length,
      owned: ownedCount,
    };
  }, [baseFilteredUnits, countInRoster]);

  const filteredUnits = useMemo(() => {
    const tabFiltered = baseFilteredUnits.filter((u) => {
      if (browseTab === "owned") return countInRoster(u.id) > 0;
      return true;
    });
    const sorted = [...tabFiltered].sort((a, b) => {
      if (sortMode === "name") return a.name.localeCompare(b.name);
      return a.basePoints - b.basePoints || a.name.localeCompare(b.name);
    });
    return sorted;
  }, [baseFilteredUnits, browseTab, sortMode, countInRoster]);

  const unitsByRole = useMemo(() => {
    const map = Object.fromEntries(ROLES.map((r) => [r, [] as BuilderUnit[]])) as Record<UnitRole, BuilderUnit[]>;
    for (const u of filteredUnits) map[u.role]?.push(u);
    return map;
  }, [filteredUnits]);

  const rosterByRole = useMemo(() => groupByRole(roster), [roster]);

  const totalPts = useMemo(() => roster.reduce((s, u) => s + u.pts, 0), [roster]);

  // 同盟ユニットのロスター内カウント
  const allyAgentsInRoster = useMemo(
    () => roster.filter((r) => r.allyFaction === "agents_of_the_imperium").length,
    [roster]
  );
  const allyKnightsInRoster = useMemo(
    () => roster.filter((r) => r.allyFaction === "imperial_knights").length,
    [roster]
  );
  const allyAgentsLimit = useMemo(
    () => (allyUnits.agents.length > 0 ? getAllyAgentsLimit(pointsLimit) : 0),
    [allyUnits.agents.length, pointsLimit]
  );

  // ─── Handlers ─────────────────────────────────────────────────────────────

  const commitAddUnit = useCallback(
    (unit: BuilderUnit, weaponSelections: WeaponSelection[], allyFaction?: string) => {
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
          ...(allyFaction ? { allyFaction } : {}),
        },
      ]);
    },
    []
  );

  const handleAddUnit = useCallback(
    async (unit: BuilderUnit, allyFaction?: string) => {
      // キャッシュ確認
      if (!weaponCache.current.has(unit.id)) {
        const res = await fetch(`/api/wh40k/units/${unit.id}/weapons`);
        const groups: WeaponGroup[] = await res.json();
        weaponCache.current.set(unit.id, groups);
      }
      const groups = weaponCache.current.get(unit.id)!;

      if (groups.length === 0) {
        // 武器オプションなし → 直接追加
        commitAddUnit(unit, [], allyFaction);
      } else {
        // モーダルを開く
        setWeaponModal({ unit, groups, selections: new Map(), allyFaction });
      }
    },
    [commitAddUnit]
  );

  // ユニット読み込み完了後、pendingAddSlug が残っていれば自動追加
  useEffect(() => {
    if (!pendingAddSlug.current || units.length === 0) return;
    const slug = pendingAddSlug.current;
    const target = units.find((u) => u.slug === slug);
    if (target) {
      pendingAddSlug.current = null;
      handleAddUnit(target);
    }
  // handleAddUnit は useCallback なので安定しているが、units 変化時のみ実行
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [units]);

  const handleModalConfirm = useCallback(
    (selections: Map<string, string[]>) => {
      if (!weaponModal) return;
      const { unit, groups, allyFaction } = weaponModal;
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
      commitAddUnit(unit, weaponSelections, allyFaction);
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
    setWarlordEntryId((prev) => (prev === entryId ? null : prev));
  }, []);

  const resetRoster = () => {
    if (roster.length === 0) return;
    if (confirm("ロスターをリセットしますか？")) {
      setRoster([]);
      setWarlordEntryId(null);
      setSaveStatus("idle");
      setPublicSaveStatus("idle");
    }
  };

  const saveRoster = () => {
    if (!selectedFaction || roster.length === 0) return;
    const id = `roster_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`;
    const saved: SavedRoster = {
      id,
      name: rosterName || "Unnamed Roster",
      faction: selectedFaction.id,
      factionName: selectedFaction.name,
      detachment: detachment || undefined,
      pointsLimit,
      units: roster,
      warlordEntryId: warlordEntryId ?? undefined,
      savedAt: new Date().toISOString(),
      isPublic: false,
    };
    const existing: SavedRoster[] = JSON.parse(localStorage.getItem("wh40k_rosters") ?? "[]");
    localStorage.setItem("wh40k_rosters", JSON.stringify([...existing, saved]));
    trackRosterSave({ faction: selectedFaction.id, points: totalPts, unit_count: roster.length });
    setSaveStatus("saved");
    setTimeout(() => setSaveStatus("idle"), 2500);
  };

  const savePublicRoster = useCallback(async () => {
    if (!selectedFaction || roster.length === 0) return;

    setPublicSaveStatus("saving");

    try {
      const payload = {
        name: rosterName || "Unnamed Roster",
        faction: selectedFaction.id,
        detachment: detachment || undefined,
        pointsLimit,
        units: roster,
        isPublic: true,
      };

      const res = await fetch("/api/wh40k/rosters", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (!res.ok) {
        throw new Error("failed_to_save_public_roster");
      }

      const created = (await res.json()) as { id: string; detailUrl: string };
      const saved: SavedRoster = {
        id: created.id,
        name: rosterName || "Unnamed Roster",
        faction: selectedFaction.id,
        factionName: selectedFaction.name,
        detachment: detachment || undefined,
        pointsLimit,
        units: roster,
        savedAt: new Date().toISOString(),
        isPublic: true,
      };

      const existing: SavedRoster[] = JSON.parse(localStorage.getItem("wh40k_rosters") ?? "[]");
      localStorage.setItem(
        "wh40k_rosters",
        JSON.stringify([...existing.filter((entry) => entry.id !== saved.id), saved])
      );

      trackRosterCreate({ faction: selectedFaction.id, points: totalPts, unit_count: roster.length, is_public: true });
      setPublicSaveStatus("published");
      window.location.href = created.detailUrl;
    } catch {
      setPublicSaveStatus("idle");
      alert("公開ロスターの保存に失敗しました。DB 接続を確認してください。");
    }
  }, [detachment, pointsLimit, roster, rosterName, selectedFaction]);

  const shareRoster = () => {
    if (!selectedFaction || roster.length === 0) return;
    const data = { name: rosterName, faction: selectedFaction.id, factionName: selectedFaction.name, detachment: detachment || undefined, pointsLimit, units: roster, warlordEntryId: warlordEntryId ?? undefined };
    const encoded = btoa(encodeURIComponent(JSON.stringify(data)));
    const url = `${window.location.origin}/wh40k/rosters/share?d=${encoded}`;
    navigator.clipboard?.writeText(url)
      .then(() => {
        trackRosterShare({ roster_id: "builder", faction: selectedFaction.id });
        alert("✅ 共有URLをクリップボードにコピーしました");
      })
      .catch(() => prompt("共有URL:", url));
  };

  const copyRosterText = () => {
    if (!selectedFaction || roster.length === 0) return;
    const text = formatRosterText({
      name: rosterName,
      factionName: selectedFaction.nameJa ?? selectedFaction.name,
      detachment: detachment || undefined,
      pointsLimit,
      units: roster,
      warlordEntryId: warlordEntryId ?? undefined,
    });
    navigator.clipboard?.writeText(text)
      .then(() => alert("✅ ロスターをクリップボードにコピーしました"))
      .catch(() => prompt("ロスターテキスト:", text));
  };

  const toggleTag = useCallback((tag: string) => {
    setSelectedTags((prev) =>
      prev.includes(tag) ? prev.filter((t) => t !== tag) : [...prev, tag]
    );
  }, []);

  const clearTagFilter = useCallback(() => {
    setSelectedTags([]);
  }, []);

  const handleFactionChange = useCallback(() => {
    if (roster.length === 0 || confirm("陣営を変更するとロスターがリセットされます。よろしいですか？")) {
      setSelectedFaction(null);
    }
  }, [roster.length]);

  const handleFactionSelect = useCallback((faction: FactionListItem) => {
    setSelectedFaction(faction);
    trackArmySelect({ faction: faction.id });
  }, []);

  const handleDetachmentChange = useCallback((d: string) => {
    setDetachment(d);
    if (d && selectedFaction) trackDetachmentSelect({ faction: selectedFaction.id, detachment: d });
  }, [selectedFaction]);

  const handlePointsLimitChange = useCallback((pts: number) => {
    setPointsLimit(pts);
    trackPointsChange({ points_limit: pts });
  }, []);

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
          <FactionPicker factions={factions} onSelect={handleFactionSelect} />
        </div>
      </div>
    );
  }

  // ─── 陣営選択済み ─────────────────────────────────────────────────────────

  const detachmentOptions = DETACHMENTS[selectedFaction.id] ?? [];

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

      <BuilderHeader
        selectedFaction={selectedFaction}
        detachmentOptions={detachmentOptions}
        rosterName={rosterName}
        pointsLimit={pointsLimit}
        detachment={detachment}
        saveStatus={saveStatus}
        publicSaveStatus={publicSaveStatus}
        rosterCount={roster.length}
        totalPts={totalPts}
        onRosterNameChange={setRosterName}
        onPointsLimitChange={handlePointsLimitChange}
        onDetachmentChange={handleDetachmentChange}
        onFactionChange={handleFactionChange}
        onSave={saveRoster}
        onPublicSave={savePublicRoster}
        onShare={shareRoster}
        onCopyRoster={copyRosterText}
        onReset={resetRoster}
      />

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

            <FilterSidebar
              className="order-2 md:order-1"
              search={search}
              filterRole={filterRole}
              units={units}
              availableTags={availableTags}
              selectedTags={selectedTags}
              quickFilter={quickFilter}
              sortMode={sortMode}
              onSearchChange={setSearch}
              onFilterRoleChange={setFilterRole}
              onToggleTag={toggleTag}
              onQuickFilterChange={setQuickFilter}
              onSortModeChange={setSortMode}
              onClearTagFilter={clearTagFilter}
            />

            <UnitCardList
              className="order-3 md:order-2"
              unitsByRole={unitsByRole}
              filteredUnitsCount={filteredUnits.length}
              totalUnitsCount={units.length}
              browseTab={browseTab}
              tabCounts={tabCounts}
              countInRoster={countInRoster}
              onAddUnit={handleAddUnit}
              onRemoveUnit={removeLastUnit}
              onBrowseTabChange={setBrowseTab}
              allyAgents={allyUnits.agents}
              allyKnights={allyUnits.knights}
              allyAgentsInRoster={allyAgentsInRoster}
              allyAgentsLimit={allyAgentsLimit}
              allyKnightsInRoster={allyKnightsInRoster}
              onAddAllyUnit={(unit, allyFaction) => handleAddUnit(unit, allyFaction)}
              onRemoveAllyUnit={removeLastUnit}
            />

            <RosterSidebar
              className="order-1 md:order-3"
              roster={roster}
              rosterByRole={rosterByRole}
              pointsLimit={pointsLimit}
              totalPts={totalPts}
              onRemoveEntry={removeEntry}
              warlordEntryId={warlordEntryId}
              onSetWarlord={setWarlordEntryId}
              allyAgentsInRoster={allyAgentsInRoster}
              allyAgentsLimit={allyAgentsLimit}
              allyKnightsInRoster={allyKnightsInRoster}
            />
          </div>
        </div>
      )}
    </div>
  );
}

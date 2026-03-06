"use client";

// src/app/wh40k/aeldari/AeldariReference.tsx

import { useState, useMemo } from "react";
import type { AeldariUnit, Weapon, Ability } from "./types";
import type { UnitRole } from "../types";

// ─── 定数 ─────────────────────────────────────────────────────────────────────

const ROLE_ORDER: UnitRole[] = ["HQ", "Battleline", "Other", "Transport", "Heavy"];

const ROLE_META: Record<UnitRole, { icon: string; colorClass: string; textClass: string; borderClass: string; bgClass: string }> = {
  HQ:         { icon: "👑", colorClass: "text-rose-400",    textClass: "text-rose-400",    borderClass: "border-rose-500/30",    bgClass: "bg-rose-500/10" },
  Battleline: { icon: "🛡",  colorClass: "text-emerald-400", textClass: "text-emerald-400", borderClass: "border-emerald-500/30", bgClass: "bg-emerald-500/10" },
  Other:      { icon: "⚔",  colorClass: "text-sky-400",     textClass: "text-sky-400",     borderClass: "border-sky-500/30",     bgClass: "bg-sky-500/10" },
  Transport:  { icon: "🚁", colorClass: "text-amber-400",   textClass: "text-amber-400",   borderClass: "border-amber-500/30",   bgClass: "bg-amber-500/10" },
  Heavy:      { icon: "💥", colorClass: "text-red-400",     textClass: "text-red-400",     borderClass: "border-red-500/30",     bgClass: "bg-red-500/10" },
};

// ─── StatBlock ────────────────────────────────────────────────────────────────

function StatBlock({ stats, invuln }: { stats: AeldariUnit["stats"]; invuln?: string }) {
  const entries = Object.entries(stats) as [string, string | number][];
  const allEntries: [string, string | number][] = invuln
    ? [...entries, ["Inv", invuln]]
    : entries;
  return (
    <div
      className="grid overflow-hidden rounded-lg border border-sky-900/40"
      style={{ gridTemplateColumns: `repeat(${allEntries.length}, 1fr)` }}
    >
      {/* ヘッダー行 */}
      {allEntries.map(([key]) => (
        <div
          key={`h-${key}`}
          className={`border-r border-sky-900/30 py-1 text-center font-mono text-[9px] font-bold uppercase tracking-widest last:border-r-0 ${
            key === "Inv" ? "bg-violet-950/60 text-violet-400" : "bg-black/50 text-slate-500"
          }`}
        >
          {key}
        </div>
      ))}
      {/* 値行 */}
      {allEntries.map(([key, val]) => (
        <div
          key={`v-${key}`}
          className={`border-r border-sky-900/30 bg-slate-950/60 py-2 text-center font-mono text-lg font-black last:border-r-0 ${
            key === "Inv" ? "text-violet-300" : "text-sky-100"
          }`}
        >
          {val}
        </div>
      ))}
    </div>
  );
}

// ─── WeaponsTable ─────────────────────────────────────────────────────────────

const WEAPON_COLS = ["武器名", "射程", "回数", "射", "攻", "貫通", "ダメージ", "特殊"] as const;

function WeaponRow({ w }: { w: Weapon }) {
  return (
    <tr className="border-t border-sky-900/10">
      <td className="py-1.5 pl-3 pr-2">
        <div className="text-xs font-semibold text-sky-100">{w.nameJa}</div>
        {w.nameJa !== w.name && (
          <div className="text-[10px] text-slate-600">{w.name}</div>
        )}
      </td>
      <td className="px-2 py-1.5 text-center text-xs text-slate-400">{w.range}</td>
      <td className="px-2 py-1.5 text-center text-sm font-bold text-amber-400">{w.A}</td>
      <td className="px-2 py-1.5 text-center text-xs text-slate-400">{w.skill}</td>
      <td className="px-2 py-1.5 text-center text-sm font-bold text-sky-200">{w.S}</td>
      <td className="px-2 py-1.5 text-center text-sm font-bold text-red-400">{w.AP}</td>
      <td className="px-2 py-1.5 text-center text-sm font-bold text-emerald-400">{w.D}</td>
      <td className="py-1.5 pl-2 pr-3 text-[10px] text-slate-600">{w.abilities.join(", ") || "—"}</td>
    </tr>
  );
}

function WeaponsTable({ weapons }: { weapons: Weapon[] }) {
  const ranged = weapons.filter((w) => w.type === "Ranged");
  const melee  = weapons.filter((w) => w.type === "Melee");

  const TableHead = () => (
    <thead>
      <tr className="bg-black/40">
        {WEAPON_COLS.map((c) => (
          <th
            key={c}
            className={`py-1 text-[9px] font-bold uppercase tracking-widest text-slate-600 ${
              c === "武器名" ? "pl-3 pr-2 text-left" : "px-2 text-center"
            }`}
          >
            {c}
          </th>
        ))}
      </tr>
    </thead>
  );

  return (
    <div className="overflow-x-auto">
      {ranged.length > 0 && (
        <div className="mb-3">
          <p className="mb-1 text-[10px] font-bold uppercase tracking-[0.25em] text-sky-500">
            📡 遠距離武器
          </p>
          <table className="w-full border-collapse text-xs">
            <TableHead />
            <tbody>
              {ranged.map((w, i) => <WeaponRow key={i} w={w} />)}
            </tbody>
          </table>
        </div>
      )}
      {melee.length > 0 && (
        <div>
          <p className="mb-1 text-[10px] font-bold uppercase tracking-[0.25em] text-rose-400">
            ⚔ 近接武器
          </p>
          <table className="w-full border-collapse text-xs">
            <TableHead />
            <tbody>
              {melee.map((w, i) => <WeaponRow key={i} w={w} />)}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

// ─── AbilityCard ──────────────────────────────────────────────────────────────

function AbilityCard({ ab }: { ab: Ability }) {
  return (
    <div className="rounded-lg border border-sky-900/20 bg-black/20 p-3">
      <div className="mb-1 flex items-baseline gap-2">
        <span className="text-xs font-bold text-sky-100">{ab.nameJa}</span>
        <span className="text-[10px] text-slate-600">{ab.name}</span>
      </div>
      <p className="text-xs leading-relaxed text-slate-400">{ab.desc}</p>
    </div>
  );
}

// ─── SectionDivider ───────────────────────────────────────────────────────────

function SectionDivider({ children }: { children: React.ReactNode }) {
  return (
    <div className="mb-2 flex items-center gap-2">
      <span className="h-px flex-1 bg-sky-900/30" />
      <span className="text-[9px] font-bold uppercase tracking-[0.3em] text-slate-600">
        {children}
      </span>
      <span className="h-px flex-1 bg-sky-900/30" />
    </div>
  );
}

// ─── UnitDetail ───────────────────────────────────────────────────────────────

function UnitDetail({ unit }: { unit: AeldariUnit | null }) {
  if (!unit) {
    return (
      <div className="flex min-h-[300px] flex-col items-center justify-center gap-3 text-slate-700">
        <span className="text-4xl opacity-30">⟡</span>
        <span className="text-sm">ユニットを選択してください</span>
      </div>
    );
  }

  const rm = ROLE_META[unit.role];
  const wahUrl = `https://wahapedia.ru/wh40k10ed/factions/aeldari/${unit.name
    .replace(/['']/g, "")
    .replace(/\s+/g, "-")}`;

  return (
    <div className="h-full overflow-y-auto p-5 lg:p-6">
      {/* ユニットヘッダー */}
      <div className="mb-5 border-b border-sky-900/30 pb-5">
        <div className="flex flex-wrap items-start justify-between gap-3">
          <div>
            <div className="mb-1.5 flex flex-wrap items-center gap-2">
              <span className={`text-[10px] font-bold uppercase tracking-[0.3em] ${rm.colorClass}`}>
                {rm.icon} {unit.role}
              </span>
              <span className="rounded bg-amber-500/10 px-2 py-0.5 text-[11px] font-bold text-amber-400">
                {unit.pts}pts
              </span>
            </div>
            <h2 className="font-serif text-2xl font-black tracking-tight text-sky-50 lg:text-3xl">
              {unit.name}
            </h2>
            <p className="mt-0.5 text-sm text-slate-500">{unit.nameJa}</p>
          </div>
          <a
            href={wahUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="shrink-0 rounded-md border border-sky-700/40 px-3 py-1.5 text-[10px] font-bold uppercase tracking-widest text-sky-400 transition hover:border-sky-500/60 hover:text-sky-300"
          >
            Wahapedia ↗
          </a>
        </div>

        {unit.fluff && (
          <blockquote className="mt-3 border-l-2 border-sky-600/40 pl-3 text-xs italic leading-relaxed text-slate-500">
            {unit.fluff}
          </blockquote>
        )}
      </div>

      {/* ステータス */}
      <div className="mb-5">
        <SectionDivider>基本ステータス</SectionDivider>
        <StatBlock stats={unit.stats} invuln={unit.invuln} />
      </div>

      {/* キーワード */}
      <div className="mb-5">
        <SectionDivider>キーワード</SectionDivider>
        <div className="flex flex-wrap gap-1.5">
          {unit.keywords.map((k) => (
            <span
              key={k}
              className="rounded border border-sky-900/30 px-2 py-0.5 text-[10px] tracking-wide text-slate-600"
            >
              {k}
            </span>
          ))}
        </div>
      </div>

      {/* 武器 */}
      <div className="mb-5">
        <SectionDivider>武器</SectionDivider>
        <div className="overflow-hidden rounded-lg border border-sky-900/20 bg-black/20">
          <WeaponsTable weapons={unit.weapons} />
        </div>
      </div>

      {/* アビリティ */}
      {unit.abilities.length > 0 && (
        <div>
          <SectionDivider>アビリティ</SectionDivider>
          <div className="flex flex-col gap-2">
            {unit.abilities.map((ab, i) => (
              <AbilityCard key={i} ab={ab} />
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

// ─── UnitListItem ─────────────────────────────────────────────────────────────

function UnitListItem({
  unit,
  selected,
  onClick,
}: {
  unit: AeldariUnit;
  selected: boolean;
  onClick: () => void;
}) {
  const rm = ROLE_META[unit.role];
  return (
    <button
      onClick={onClick}
      className={`w-full rounded-lg px-3 py-2.5 text-left transition hover:bg-white/[0.03] ${
        selected
          ? "border border-sky-600/40 bg-sky-950/40"
          : "border border-transparent"
      }`}
    >
      <div className="flex items-start justify-between gap-2">
        <div className="min-w-0 flex-1">
          <p className={`truncate text-[13px] font-semibold ${selected ? "text-sky-100" : "text-slate-400"}`}>
            {unit.name}
          </p>
          <p className="truncate text-[11px] text-slate-600">{unit.nameJa}</p>
        </div>
        <div className="flex shrink-0 flex-col items-end gap-1">
          <span className={`text-[9px] font-bold uppercase tracking-wide ${rm.colorClass}`}>
            {rm.icon} {unit.role}
          </span>
          <span className="text-[11px] font-bold text-slate-600">{unit.pts}pt</span>
        </div>
      </div>
    </button>
  );
}

// ─── Main: AeldariReference ───────────────────────────────────────────────────

export function AeldariReference({ units }: { units: AeldariUnit[] }) {
  const [selected, setSelected] = useState<AeldariUnit | null>(units[0] ?? null);
  const [search, setSearch] = useState("");
  const [roleFilter, setRoleFilter] = useState<UnitRole | "ALL">("ALL");
  const [subfaction, setSubfaction] = useState<"ALL" | "ASURYANI" | "HARLEQUINS" | "YNNARI">("ALL");

  const SUBFACTION_META = {
    ALL:        { label: "全派閥", color: "text-slate-400", border: "border-slate-700/40", bg: "bg-slate-800/20" },
    ASURYANI:   { label: "クラフトワールド", color: "text-sky-400", border: "border-sky-600/40", bg: "bg-sky-900/20" },
    HARLEQUINS: { label: "ハーレクイン", color: "text-violet-400", border: "border-violet-600/40", bg: "bg-violet-900/20" },
    YNNARI:     { label: "ヤナーリ", color: "text-rose-400", border: "border-rose-600/40", bg: "bg-rose-900/20" },
  } as const;

  const getSubfaction = (u: AeldariUnit): "ASURYANI" | "HARLEQUINS" | "YNNARI" => {
    const cats = u.categories.map(c => c.toLowerCase());
    if (cats.includes("harlequins")) return "HARLEQUINS";
    if (cats.some(c => c.includes("ynnari") || c.includes("ynnear"))) return "YNNARI";
    if (u.id.startsWith("ynnari_") || u.id === "yvraine" || u.id === "the_visarch" || u.id === "the_yncarne") return "YNNARI";
    return "ASURYANI";
  };

  const filtered = useMemo(() => {
    return units.filter((u) => {
      if (roleFilter !== "ALL" && u.role !== roleFilter) return false;
      if (subfaction !== "ALL" && getSubfaction(u) !== subfaction) return false;
      if (search) {
        const q = search.toLowerCase();
        return (
          u.name.toLowerCase().includes(q) ||
          u.nameJa.includes(search) ||
          u.categories.some((c) => c.toLowerCase().includes(q))
        );
      }
      return true;
    });
  }, [units, search, roleFilter, subfaction]);

  const grouped = useMemo(() => {
    const g: Partial<Record<UnitRole, AeldariUnit[]>> = {};
    for (const role of ROLE_ORDER) {
      const list = filtered.filter((u) => u.role === role);
      if (list.length) g[role] = list;
    }
    return g;
  }, [filtered]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-950 to-sky-950/20 text-sky-100">
      {/* ヘッダー */}
      <header className="border-b border-sky-900/30 px-4 py-6 sm:px-6">
        <div className="mx-auto max-w-7xl">
          <p className="mb-1 text-[9px] font-bold uppercase tracking-[0.5em] text-sky-600">
            ⟡ Warhammer 40,000 · 10th Edition · Craftworlds
          </p>
          <div className="flex flex-wrap items-end justify-between gap-4">
            <div>
              <h1 className="font-serif text-3xl font-black tracking-tight sm:text-4xl">
                <span className="bg-gradient-to-r from-sky-200 via-sky-300 to-violet-300 bg-clip-text text-transparent">
                  アエルダリ（クラフトワールド）
                </span>
              </h1>
              <p className="mt-1 text-[11px] uppercase tracking-[0.2em] text-slate-600">
                Aeldari Craftworlds · ユニットリファレンス（日本語）
              </p>
            </div>
            <div className="text-right">
              <p className="text-[10px] text-slate-700">BSData / wh40k-10e</p>
              <p className="text-2xl font-black text-amber-400">
                {units.length}{" "}
                <span className="text-sm font-normal text-slate-600">ユニット収録</span>
              </p>
            </div>
          </div>
        </div>
      </header>

      {/* メインレイアウト */}
      <div className="mx-auto max-w-7xl px-4 py-4 sm:px-6">
        <div className="flex gap-4 lg:gap-6">
          {/* ── 左カラム: ユニット一覧 ── */}
          <aside className="w-64 shrink-0 lg:w-72">
            {/* サブファクション */}
            <div className="mb-3 grid grid-cols-2 gap-1.5">
              {(Object.entries(SUBFACTION_META) as [keyof typeof SUBFACTION_META, typeof SUBFACTION_META[keyof typeof SUBFACTION_META]][]).map(([key, meta]) => (
                <button
                  key={key}
                  onClick={() => setSubfaction(key)}
                  className={`rounded border px-2 py-1.5 text-[9px] font-bold transition ${
                    subfaction === key
                      ? `${meta.border} ${meta.bg} ${meta.color}`
                      : "border-sky-900/20 text-slate-700 hover:text-slate-500"
                  }`}
                >
                  {meta.label}
                </button>
              ))}
            </div>

            {/* 検索 */}
            <input
              type="text"
              placeholder="🔍 名前・カテゴリで検索…"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="mb-2 w-full rounded-lg border border-sky-900/40 bg-black/30 px-3 py-2 text-xs text-sky-100 placeholder:text-slate-700 focus:border-sky-700/60 focus:outline-none"
            />

            {/* ロールフィルター */}
            <div className="mb-4 flex flex-wrap gap-1.5">
              <button
                onClick={() => setRoleFilter("ALL")}
                className={`rounded px-2 py-1 text-[9px] font-bold uppercase tracking-wide transition ${
                  roleFilter === "ALL"
                    ? "border border-sky-600/50 bg-sky-900/30 text-sky-300"
                    : "border border-sky-900/30 text-slate-600 hover:text-slate-400"
                }`}
              >
                ALL
              </button>
              {ROLE_ORDER.map((r) => {
                const active = roleFilter === r;
                const rm = ROLE_META[r];
                return (
                  <button
                    key={r}
                    onClick={() => setRoleFilter(active ? "ALL" : r)}
                    className={`rounded border px-2 py-1 text-[9px] font-bold uppercase tracking-wide transition ${
                      active
                        ? `${rm.borderClass} ${rm.bgClass} ${rm.textClass}`
                        : "border-sky-900/30 text-slate-600 hover:text-slate-400"
                    }`}
                  >
                    {rm.icon} {r}
                  </button>
                );
              })}
            </div>

            {/* グループ別一覧 */}
            <div className="flex flex-col gap-4">
              {Object.entries(grouped).map(([role, unitList]) => {
                const rm = ROLE_META[role as UnitRole];
                return (
                  <div key={role}>
                    <p className={`mb-1 px-1 text-[9px] font-bold uppercase tracking-[0.3em] ${rm.colorClass}`}>
                      {rm.icon} {role}
                      <span className="ml-1.5 font-normal text-slate-700">({unitList.length})</span>
                    </p>
                    {unitList.map((u) => (
                      <UnitListItem
                        key={u.id}
                        unit={u}
                        selected={selected?.id === u.id}
                        onClick={() => setSelected(u)}
                      />
                    ))}
                  </div>
                );
              })}
              {Object.keys(grouped).length === 0 && (
                <p className="px-2 py-5 text-center text-xs text-slate-700">
                  該当するユニットなし
                </p>
              )}
            </div>
          </aside>

          {/* ── 右カラム: ユニット詳細 ── */}
          <main className="min-h-[500px] flex-1 overflow-hidden rounded-xl border border-sky-900/30 bg-gradient-to-b from-slate-950/90 to-black/80 shadow-xl shadow-black/40">
            <UnitDetail unit={selected} />
          </main>
        </div>

        {/* フッター */}
        <footer className="mt-6 flex flex-wrap justify-between gap-2 border-t border-sky-900/20 py-4 text-[10px] text-slate-800">
          <span>⚠ データはBSData/wh40k-10eより。参考用。大会前はGW公式MFMで確認。</span>
          <span>DICE JOURNAL · my-boardgame-site.vercel.app</span>
        </footer>
      </div>
    </div>
  );
}

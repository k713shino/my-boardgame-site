"use client";

import { useState } from "react";
import {
  STRATAGEMS,
  PHASE_LABELS,
  PHASE_COLORS,
  FILTER_PHASES,
  type Phase,
} from "./stratagemData";

type Filter = Phase | "all";

export default function StratagemClient() {
  const [filter, setFilter] = useState<Filter>("all");

  const filtered =
    filter === "all"
      ? STRATAGEMS
      : STRATAGEMS.filter(
          (s) => s.phases.includes(filter) || s.phases.includes("any"),
        );

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap gap-2">
        <FilterButton active={filter === "all"} onClick={() => setFilter("all")}>
          すべて
        </FilterButton>
        {FILTER_PHASES.map((phase) => (
          <FilterButton
            key={phase}
            active={filter === phase}
            activeClass={PHASE_COLORS[phase]}
            onClick={() => setFilter(phase)}
          >
            {PHASE_LABELS[phase]}
          </FilterButton>
        ))}
      </div>

      <div className="grid gap-3 sm:grid-cols-2">
        {filtered.map((s) => (
          <div key={s.id} className="surface-card rounded-2xl px-5 py-4 space-y-3">
            <div className="flex items-start justify-between gap-3">
              <div className="min-w-0">
                <p className="text-sm font-black tracking-tight text-(--fg-body) truncate">
                  {s.name}
                </p>
                <p className="text-[0.65rem] text-muted">{s.nameJa}</p>
              </div>
              <span className="shrink-0 rounded-full border border-rose-400/60 bg-rose-500/10 px-2.5 py-1 text-sm font-black tabular-nums text-rose-500 dark:border-rose-500/40">
                {s.cp}CP
              </span>
            </div>

            <div className="flex flex-wrap gap-1.5">
              {s.phases.map((phase) => (
                <span
                  key={phase}
                  className={`rounded-full border px-2 py-0.5 text-[0.6rem] font-bold uppercase tracking-wider ${PHASE_COLORS[phase]}`}
                >
                  {PHASE_LABELS[phase]}
                </span>
              ))}
            </div>

            <div className="space-y-2">
              <div>
                <p className="text-[0.6rem] font-bold uppercase tracking-widest text-muted mb-0.5">
                  いつ
                </p>
                <p className="text-xs leading-relaxed text-(--fg-body)">{s.when}</p>
              </div>
              <div>
                <p className="text-[0.6rem] font-bold uppercase tracking-widest text-muted mb-0.5">
                  効果
                </p>
                <p className="text-xs leading-relaxed text-(--fg-body)">{s.effect}</p>
              </div>
            </div>
          </div>
        ))}
      </div>

      <p className="text-center text-[0.6rem] text-muted">
        ※ コアストラテジェームのみ掲載。内容は参考程度に。正確なルールは公式ルールブックをご確認ください。
      </p>
    </div>
  );
}

function FilterButton({
  active,
  activeClass,
  onClick,
  children,
}: {
  active: boolean;
  activeClass?: string;
  onClick: () => void;
  children: React.ReactNode;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`rounded-full border px-3 py-1 text-[0.65rem] font-bold uppercase tracking-widest transition ${
        active
          ? activeClass ??
            "border-slate-700 bg-slate-800 text-white dark:border-slate-200 dark:bg-slate-100 dark:text-slate-900"
          : "border-slate-300/60 text-muted hover:border-slate-400/80 dark:border-slate-600/60 dark:hover:border-slate-500"
      }`}
    >
      {children}
    </button>
  );
}

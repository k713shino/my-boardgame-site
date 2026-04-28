"use client";

import { useState, useMemo } from "react";
import {
  KEYWORDS,
  CATEGORY_LABELS,
  CATEGORY_COLORS,
  type KeywordCategory,
} from "./keywordData";

const ALL = "all" as const;
type FilterTab = typeof ALL | KeywordCategory;

export default function KeywordClient() {
  const [query, setQuery] = useState("");
  const [tab, setTab] = useState<FilterTab>(ALL);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return KEYWORDS.filter((kw) => {
      if (tab !== ALL && kw.category !== tab) return false;
      if (!q) return true;
      return (
        kw.name.toLowerCase().includes(q) ||
        kw.nameJa.toLowerCase().includes(q) ||
        kw.summary.includes(q) ||
        kw.detail.includes(q)
      );
    });
  }, [query, tab]);

  const tabs: { value: FilterTab; label: string }[] = [
    { value: ALL, label: "全て" },
    { value: "weapon", label: CATEGORY_LABELS.weapon },
    { value: "unit", label: CATEGORY_LABELS.unit },
  ];

  return (
    <div className="space-y-5">
      {/* Search */}
      <input
        type="search"
        placeholder="キーワードを検索…"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        className="w-full rounded-xl border border-slate-300/60 bg-white/60 px-4 py-2.5 text-sm text-(--fg-body) placeholder:text-slate-400 outline-none focus:border-rose-400/60 dark:border-slate-600/60 dark:bg-slate-800/60 dark:placeholder:text-slate-500"
      />

      {/* Category tabs */}
      <div className="flex gap-2 flex-wrap">
        {tabs.map(({ value, label }) => (
          <button
            key={value}
            type="button"
            onClick={() => setTab(value)}
            className={`rounded-full px-3 py-1 text-[0.65rem] font-bold transition-colors ${
              tab === value
                ? "bg-rose-500 text-white"
                : "bg-slate-100 text-slate-500 hover:bg-slate-200 dark:bg-slate-800 dark:text-slate-400 dark:hover:bg-slate-700"
            }`}
          >
            {label}
          </button>
        ))}
      </div>

      {/* Count */}
      <p className="text-[0.62rem] text-muted tabular-nums">
        {filtered.length} / {KEYWORDS.length} 件
      </p>

      {/* Cards */}
      {filtered.length === 0 ? (
        <p className="py-10 text-center text-sm text-muted">該当なし</p>
      ) : (
        <div className="space-y-2">
          {filtered.map((kw) => (
            <div key={kw.id} className="surface-card rounded-2xl px-5 py-4 space-y-2">
              <div className="flex flex-wrap items-start justify-between gap-2">
                <div>
                  <p className="text-sm font-black text-(--fg-body) leading-tight">
                    {kw.nameJa}
                  </p>
                  <p className="text-[0.62rem] text-muted mt-0.5">{kw.name}</p>
                </div>
                <span
                  className={`shrink-0 rounded-full border px-2 py-0.5 text-[0.58rem] font-bold ${CATEGORY_COLORS[kw.category]}`}
                >
                  {CATEGORY_LABELS[kw.category]}
                </span>
              </div>

              <p className="text-xs font-semibold text-(--fg-body)">{kw.summary}</p>

              <p className="text-[0.68rem] text-muted leading-relaxed">{kw.detail}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

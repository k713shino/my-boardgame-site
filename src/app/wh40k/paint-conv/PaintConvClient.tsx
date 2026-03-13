"use client";

import { useState, useMemo } from "react";
import { PAINT_DATA, CATEGORIES, type PaintCategory, type PaintEntry } from "./paintData";

// ── helpers ───────────────────────────────────────────────────────────────────

const CAT_META: Record<PaintCategory | "All", { label: string; color: string }> = {
  All:       { label: "すべて",   color: "bg-slate-500/10 text-slate-600 dark:text-slate-400 ring-slate-400/40" },
  Base:      { label: "Base",    color: "bg-rose-500/10 text-rose-600 dark:text-rose-400 ring-rose-400/40" },
  Layer:     { label: "Layer",   color: "bg-sky-500/10 text-sky-600 dark:text-sky-400 ring-sky-400/40" },
  Shade:     { label: "Shade",   color: "bg-slate-600/10 text-slate-700 dark:text-slate-300 ring-slate-400/40" },
  Dry:       { label: "Dry",     color: "bg-amber-500/10 text-amber-700 dark:text-amber-400 ring-amber-400/40" },
  Contrast:  { label: "Contrast",color: "bg-purple-500/10 text-purple-700 dark:text-purple-400 ring-purple-400/40" },
  Technical: { label: "Technical",color: "bg-emerald-500/10 text-emerald-700 dark:text-emerald-400 ring-emerald-400/40" },
};

function CategoryChip({ cat }: { cat: PaintCategory }) {
  const m = CAT_META[cat];
  return (
    <span className={`inline-block shrink-0 rounded-full px-2 py-0.5 text-[0.58rem] font-semibold ring-1 ring-inset ${m.color}`}>
      {m.label}
    </span>
  );
}

function ColorDot({ hex }: { hex?: string }) {
  if (!hex) return <span className="inline-block h-3 w-3 shrink-0 rounded-full bg-slate-200 dark:bg-slate-700" />;
  return (
    <span
      className="inline-block h-3 w-3 shrink-0 rounded-full ring-1 ring-inset ring-black/10"
      style={{ backgroundColor: hex }}
    />
  );
}

// ── main ──────────────────────────────────────────────────────────────────────

export function PaintConvClient() {
  const [query, setQuery] = useState("");
  const [category, setCategory] = useState<PaintCategory | "All">("All");
  const [showVallejo, setShowVallejo] = useState(true);
  const [showGundam, setShowGundam] = useState(true);

  const filtered = useMemo<PaintEntry[]>(() => {
    const q = query.toLowerCase();
    return PAINT_DATA.filter((p) => {
      if (category !== "All" && p.category !== category) return false;
      if (!q) return true;
      if (p.citadel.toLowerCase().includes(q)) return true;
      if (p.vallejo?.some((v) => v.name.toLowerCase().includes(q) || v.code.includes(q))) return true;
      if (p.gundam?.some((g) => g.name.toLowerCase().includes(q) || g.code.toLowerCase().includes(q))) return true;
      return false;
    });
  }, [query, category]);

  return (
    <div className="mx-auto max-w-3xl space-y-6 px-4 py-8 sm:py-10">
      {/* Breadcrumb */}
      <nav className="flex flex-wrap items-center gap-2 text-xs text-muted">
        <a href="/wh40k" className="transition hover:text-rose-500">WH40K</a>
        <span>/</span>
        <span className="text-[color:var(--fg-body)]">Paint Conversion</span>
      </nav>

      <header className="space-y-1">
        <p className="text-[0.62rem] font-semibold uppercase tracking-[0.25em] text-rose-500">Painting Tools</p>
        <h1 className="text-2xl font-black sm:text-3xl">塗料変換ツール</h1>
        <p className="text-xs text-muted">
          Citadel カラーに対応する Vallejo / ガンダムアッセンブルカラーを検索できます。
        </p>
      </header>

      {/* Controls */}
      <div className="surface-card space-y-4 rounded-2xl p-4">
        {/* Search */}
        <input
          type="search"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="塗料名で検索 … 例: Mephiston / Black Wash / 72.051"
          className="w-full rounded-xl border border-slate-300/60 bg-transparent px-4 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-rose-400 dark:border-slate-600/60"
        />

        {/* Category tabs */}
        <div className="flex flex-wrap gap-1.5">
          {(["All", ...CATEGORIES] as (PaintCategory | "All")[]).map((cat) => (
            <button
              key={cat}
              onClick={() => setCategory(cat)}
              className={`rounded-full px-3 py-1 text-[0.65rem] font-semibold transition ring-1 ring-inset ${
                category === cat
                  ? `${CAT_META[cat].color} opacity-100`
                  : "ring-slate-300/50 text-muted hover:ring-slate-400/60 dark:ring-slate-600/50"
              }`}
            >
              {CAT_META[cat].label}
            </button>
          ))}
        </div>

        {/* Column toggles */}
        <div className="flex flex-wrap items-center gap-4 border-t border-slate-200/60 pt-3 dark:border-slate-700/60">
          <p className="text-[0.6rem] font-semibold uppercase tracking-widest text-muted">表示列</p>
          {[
            { label: "Vallejo", value: showVallejo, set: setShowVallejo },
            { label: "ガンダム", value: showGundam, set: setShowGundam },
          ].map(({ label, value, set }) => (
            <label key={label} className="flex cursor-pointer items-center gap-1.5 text-xs">
              <span
                onClick={() => set(!value)}
                className={`relative inline-block h-4 w-7 rounded-full transition ${value ? "bg-rose-500" : "bg-slate-300 dark:bg-slate-600"}`}
              >
                <span className={`absolute top-0.5 left-0.5 h-3 w-3 rounded-full bg-white shadow transition-transform ${value ? "translate-x-3" : ""}`} />
              </span>
              <span className="text-[0.7rem] text-muted">{label}</span>
            </label>
          ))}
          <span className="ml-auto text-[0.62rem] text-muted">{filtered.length} 件</span>
        </div>
      </div>

      {/* Table */}
      <div className="surface-card overflow-hidden rounded-2xl">
        {filtered.length === 0 ? (
          <p className="py-12 text-center text-sm text-muted">該当する塗料が見つかりません</p>
        ) : (
          <div className="divide-y divide-slate-200/60 dark:divide-slate-700/60">
            {/* Header */}
            <div className={`grid gap-2 px-4 py-2 text-[0.58rem] font-semibold uppercase tracking-widest text-muted ${
              showVallejo && showGundam ? "grid-cols-[1fr_1fr_1fr]" :
              showVallejo || showGundam ? "grid-cols-[1fr_1fr]" : "grid-cols-1"
            }`}>
              <span>Citadel</span>
              {showVallejo && <span>Vallejo</span>}
              {showGundam && <span>ガンダム AC</span>}
            </div>

            {/* Rows */}
            {filtered.map((p) => (
              <div
                key={p.id}
                className={`grid items-start gap-2 px-4 py-3 transition hover:bg-slate-50/50 dark:hover:bg-slate-800/30 ${
                  showVallejo && showGundam ? "grid-cols-[1fr_1fr_1fr]" :
                  showVallejo || showGundam ? "grid-cols-[1fr_1fr]" : "grid-cols-1"
                }`}
              >
                {/* Citadel */}
                <div className="flex items-start gap-2">
                  <ColorDot hex={p.hex} />
                  <div className="min-w-0">
                    <p className="truncate text-xs font-semibold">{p.citadel}</p>
                    <CategoryChip cat={p.category} />
                  </div>
                </div>

                {/* Vallejo */}
                {showVallejo && (
                  <div className="space-y-1">
                    {p.vallejo && p.vallejo.length > 0 ? (
                      p.vallejo.map((v) => (
                        <div key={v.code}>
                          <p className={`text-[0.68rem] font-medium leading-tight ${v.approx ? "text-amber-600 dark:text-amber-400" : ""}`}>
                            {v.name}
                            {v.approx && <span className="ml-1 opacity-60 text-[0.55rem]">~</span>}
                          </p>
                          <p className="text-[0.58rem] text-muted">{v.line} {v.code}</p>
                        </div>
                      ))
                    ) : (
                      <p className="text-[0.65rem] text-muted/50">—</p>
                    )}
                  </div>
                )}

                {/* Gundam */}
                {showGundam && (
                  <div className="space-y-1">
                    {p.gundam && p.gundam.length > 0 ? (
                      p.gundam.map((g) => (
                        <div key={g.code}>
                          <p className={`text-[0.68rem] font-medium leading-tight ${g.approx ? "text-amber-600 dark:text-amber-400" : ""}`}>
                            {g.name}
                            {g.approx && <span className="ml-1 opacity-60 text-[0.55rem]">~</span>}
                          </p>
                          <p className="text-[0.58rem] text-muted">{g.code}</p>
                        </div>
                      ))
                    ) : (
                      <p className="text-[0.65rem] text-muted/50">—</p>
                    )}
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Legend & notes */}
      <div className="space-y-2 text-[0.62rem] text-muted">
        <div className="flex flex-wrap items-center gap-3">
          <span className="font-semibold">凡例:</span>
          <span><span className="text-amber-600 dark:text-amber-400">オレンジ名 ~</span> = 近似色（完全一致ではない）</span>
          <span><span className="font-medium text-foreground/70">白/黒名</span> = ほぼ同等色</span>
        </div>
        <p>• Vallejo <strong>GC</strong> = Game Color、<strong>MC</strong> = Model Color、<strong>Wash</strong> = Model Wash</p>
        <p>• ガンダムアッセンブルカラーは近似色のみ掲載。完全互換ではありません。</p>
        <p className="rounded-lg border border-amber-300/30 bg-amber-50/40 px-3 py-2 dark:border-amber-500/20 dark:bg-amber-500/5 text-amber-700 dark:text-amber-400">
          ⚠️ 変換データはコミュニティ情報に基づきます。仕上がりはロット・塗布方法により異なります。
        </p>
      </div>
    </div>
  );
}

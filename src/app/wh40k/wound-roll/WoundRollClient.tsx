"use client";

import { useState } from "react";

type Roll = "2+" | "3+" | "4+" | "5+" | "6+";

const ROLL_TEXT: Record<Roll, string> = {
  "2+": "text-emerald-600 dark:text-emerald-400",
  "3+": "text-sky-600 dark:text-sky-400",
  "4+": "text-yellow-600 dark:text-yellow-500",
  "5+": "text-orange-600 dark:text-orange-400",
  "6+": "text-rose-600 dark:text-rose-400",
};

const ROLL_CELL: Record<Roll, string> = {
  "2+": "bg-emerald-500/15 text-emerald-600 dark:text-emerald-400",
  "3+": "bg-sky-500/15 text-sky-600 dark:text-sky-400",
  "4+": "bg-yellow-500/15 text-yellow-600 dark:text-yellow-500",
  "5+": "bg-orange-500/15 text-orange-600 dark:text-orange-400",
  "6+": "bg-rose-500/15 text-rose-600 dark:text-rose-400",
};

const ROLL_BADGE: Record<Roll, string> = {
  "2+": "border-emerald-500/40 bg-emerald-500/10 text-emerald-600 dark:text-emerald-400",
  "3+": "border-sky-500/40 bg-sky-500/10 text-sky-600 dark:text-sky-400",
  "4+": "border-yellow-500/40 bg-yellow-500/10 text-yellow-600 dark:text-yellow-500",
  "5+": "border-orange-500/40 bg-orange-500/10 text-orange-600 dark:text-orange-400",
  "6+": "border-rose-500/40 bg-rose-500/10 text-rose-600 dark:text-rose-400",
};

const ROLL_LABELS: Record<Roll, string> = {
  "2+": "S ≥ 2×T",
  "3+": "S > T",
  "4+": "S = T",
  "5+": "S < T かつ 2S > T",
  "6+": "2S ≤ T",
};

function getWoundRoll(s: number, t: number): Roll {
  if (s >= t * 2) return "2+";
  if (s > t) return "3+";
  if (s === t) return "4+";
  if (s * 2 > t) return "5+";
  return "6+";
}

const RANGE = Array.from({ length: 12 }, (_, i) => i + 1);

export default function WoundRollClient() {
  const [selS, setSelS] = useState<number | null>(null);
  const [selT, setSelT] = useState<number | null>(null);

  const activeRoll =
    selS !== null && selT !== null ? getWoundRoll(selS, selT) : null;

  const toggleS = (s: number) => setSelS((p) => (p === s ? null : s));
  const toggleT = (t: number) => setSelT((p) => (p === t ? null : t));

  return (
    <div className="space-y-5">
      {/* Result / rule reference card */}
      <div className="surface-card rounded-2xl px-5 py-4">
        {activeRoll ? (
          <div className="flex items-center justify-between">
            <div>
              <p className="text-[0.6rem] font-bold uppercase tracking-widest text-muted">
                結果
              </p>
              <p className="text-xs text-muted mt-0.5">
                攻{selS} vs 耐{selT} — {ROLL_LABELS[activeRoll]}
              </p>
            </div>
            <span
              className={`text-5xl font-black tabular-nums leading-none ${ROLL_TEXT[activeRoll]}`}
            >
              {activeRoll}
            </span>
          </div>
        ) : (
          <>
            <p className="text-[0.6rem] font-bold uppercase tracking-widest text-muted mb-2.5">
              ウーンズロールの条件
            </p>
            <div className="space-y-1.5">
              {(["2+", "3+", "4+", "5+", "6+"] as Roll[]).map((roll) => (
                <div key={roll} className="flex items-center gap-2.5">
                  <span
                    className={`shrink-0 rounded-full border px-2 py-0.5 text-[0.6rem] font-black ${ROLL_BADGE[roll]}`}
                  >
                    {roll}
                  </span>
                  <span className="text-[0.68rem] text-muted">
                    {ROLL_LABELS[roll]}
                  </span>
                </div>
              ))}
            </div>
          </>
        )}
      </div>

      {/* Table */}
      <div className="overflow-x-auto">
        <table className="border-separate border-spacing-0.5 text-center select-none">
          <thead>
            <tr>
              <th className="w-7 text-[0.5rem] font-bold text-muted pr-0.5 align-bottom pb-1 text-right leading-tight">
                攻(S)↓<br />耐(T)→
              </th>
              {RANGE.map((t) => (
                <th key={t} className="w-7 p-0">
                  <button
                    type="button"
                    onClick={() => toggleT(t)}
                    className={`w-7 h-7 rounded text-[0.65rem] font-black transition-colors ${
                      selT === t
                        ? "bg-slate-700 text-white dark:bg-slate-200 dark:text-slate-900"
                        : "text-muted hover:text-(--fg-body)"
                    }`}
                  >
                    {t}
                  </button>
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {RANGE.map((s) => (
              <tr key={s}>
                <th className="p-0">
                  <button
                    type="button"
                    onClick={() => toggleS(s)}
                    className={`w-7 h-7 rounded text-[0.65rem] font-black transition-colors ${
                      selS === s
                        ? "bg-slate-700 text-white dark:bg-slate-200 dark:text-slate-900"
                        : "text-muted hover:text-(--fg-body)"
                    }`}
                  >
                    {s}
                  </button>
                </th>
                {RANGE.map((t) => {
                  const roll = getWoundRoll(s, t);
                  const noSel = selS === null && selT === null;
                  const inRow = selS === s;
                  const inCol = selT === t;
                  const isActive = inRow && inCol;
                  const isRelated = inRow || inCol;

                  const opacityClass = noSel
                    ? "opacity-100"
                    : isActive
                      ? "opacity-100 scale-125 z-10 relative shadow-sm"
                      : isRelated
                        ? "opacity-75"
                        : "opacity-15";

                  return (
                    <td key={t} className="p-0">
                      <div
                        className={`w-7 h-7 rounded flex items-center justify-center text-[0.6rem] font-black tabular-nums transition-all ${ROLL_CELL[roll]} ${opacityClass}`}
                      >
                        {roll}
                      </div>
                    </td>
                  );
                })}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <p className="text-center text-[0.6rem] text-muted">
        攻(S)=強度 / 耐(T)=耐久力。値は 1〜12 を掲載。それ以上も同じルールで計算。
      </p>
    </div>
  );
}

"use client";

import { useState } from "react";

type SaveResult = "2+" | "3+" | "4+" | "5+" | "6+" | "失敗";

const RESULT_CELL: Record<SaveResult, string> = {
  "2+": "bg-emerald-500/15 text-emerald-600 dark:text-emerald-400",
  "3+": "bg-sky-500/15 text-sky-600 dark:text-sky-400",
  "4+": "bg-yellow-500/15 text-yellow-600 dark:text-yellow-500",
  "5+": "bg-orange-500/15 text-orange-600 dark:text-orange-400",
  "6+": "bg-rose-500/15 text-rose-600 dark:text-rose-400",
  "失敗": "bg-slate-500/10 text-slate-400 dark:text-slate-500",
};

const RESULT_TEXT: Record<SaveResult, string> = {
  "2+": "text-emerald-600 dark:text-emerald-400",
  "3+": "text-sky-600 dark:text-sky-400",
  "4+": "text-yellow-600 dark:text-yellow-500",
  "5+": "text-orange-600 dark:text-orange-400",
  "6+": "text-rose-600 dark:text-rose-400",
  "失敗": "text-slate-400 dark:text-slate-500",
};

const SV_VALUES = [2, 3, 4, 5, 6];
const AP_VALUES = [0, -1, -2, -3, -4, -5, -6];

function getEffectiveSave(sv: number, ap: number): SaveResult {
  const effective = sv + Math.abs(ap);
  if (effective > 6) return "失敗";
  return `${effective}+` as SaveResult;
}

// カバー +1 to save roll = AP を 1 緩和（AP0 のときは sv を超えて改善しない）
function getCoverSave(sv: number, ap: number): SaveResult {
  return getEffectiveSave(sv, Math.max(0, Math.abs(ap) - 1));
}

export default function SavingThrowClient() {
  const [selSv, setSelSv] = useState<number | null>(null);
  const [selAp, setSelAp] = useState<number | null>(null);

  const activeResult =
    selSv !== null && selAp !== null ? getEffectiveSave(selSv, selAp) : null;

  const coverResult =
    selSv !== null && selAp !== null ? getCoverSave(selSv, selAp) : null;

  const toggleSv = (sv: number) => setSelSv((p) => (p === sv ? null : sv));
  const toggleAp = (ap: number) => setSelAp((p) => (p === ap ? null : ap));

  return (
    <div className="space-y-5">
      {/* Result / info card */}
      <div className="surface-card rounded-2xl px-5 py-4">
        {activeResult && coverResult ? (
          <div className="flex items-center justify-between gap-4">
            <div className="space-y-1">
              <p className="text-[0.6rem] font-bold uppercase tracking-widest text-muted">
                実質セーヴ値
              </p>
              <p className="text-xs text-muted">
                防{selSv}+ × 貫{selAp}
              </p>
              {coverResult !== activeResult && (
                <p className="text-xs text-muted">
                  カバーあり →{" "}
                  <span className={`font-black ${RESULT_TEXT[coverResult]}`}>
                    {coverResult}
                  </span>
                </p>
              )}
            </div>
            <span
              className={`text-5xl font-black tabular-nums leading-none shrink-0 ${RESULT_TEXT[activeResult]}`}
            >
              {activeResult}
            </span>
          </div>
        ) : (
          <>
            <p className="text-[0.6rem] font-bold uppercase tracking-widest text-muted mb-2.5">
              セービングのルール
            </p>
            <div className="space-y-1.5 text-[0.68rem] text-muted leading-relaxed">
              <p>実質セーヴ値 = 基本Sv + |AP|（7以上で自動失敗）</p>
              <p>不滅セーヴはAPを無視してそのまま使用</p>
              <p>カバー：APを1緩和（基本Svより良くはならない）</p>
            </div>
          </>
        )}
      </div>

      {/* Table */}
      <div className="overflow-x-auto">
        <table className="border-separate border-spacing-0.5 text-center select-none">
          <thead>
            <tr>
              <th className="text-[0.5rem] font-bold text-muted pr-1 align-bottom pb-1 text-right leading-tight whitespace-nowrap">
                防(Sv)↓<br />貫(AP)→
              </th>
              {AP_VALUES.map((ap) => (
                <th key={ap} className="w-10 p-0">
                  <button
                    type="button"
                    onClick={() => toggleAp(ap)}
                    className={`w-10 h-8 rounded text-[0.65rem] font-black transition-colors ${
                      selAp === ap
                        ? "bg-slate-700 text-white dark:bg-slate-200 dark:text-slate-900"
                        : "text-muted hover:text-(--fg-body)"
                    }`}
                  >
                    {ap === 0 ? "0" : ap}
                  </button>
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {SV_VALUES.map((sv) => (
              <tr key={sv}>
                <th className="p-0 pr-1">
                  <button
                    type="button"
                    onClick={() => toggleSv(sv)}
                    className={`w-10 h-10 rounded text-[0.65rem] font-black transition-colors ${
                      selSv === sv
                        ? "bg-slate-700 text-white dark:bg-slate-200 dark:text-slate-900"
                        : "text-muted hover:text-(--fg-body)"
                    }`}
                  >
                    {sv}+
                  </button>
                </th>
                {AP_VALUES.map((ap) => {
                  const result = getEffectiveSave(sv, ap);
                  const noSel = selSv === null && selAp === null;
                  const inRow = selSv === sv;
                  const inCol = selAp === ap;
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
                    <td key={ap} className="p-0">
                      <div
                        className={`w-10 h-10 rounded flex items-center justify-center text-[0.65rem] font-black tabular-nums transition-all ${RESULT_CELL[result]} ${opacityClass}`}
                      >
                        {result}
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
        防(Sv)=基本セーヴ値 / 貫(AP)=装甲貫通値。不滅セーヴはAPを無視して使用可。
      </p>
    </div>
  );
}

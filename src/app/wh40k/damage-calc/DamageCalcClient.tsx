"use client";

import { useState, useMemo } from "react";

// ── math ──────────────────────────────────────────────────────────────────────

function parseDice(expr: string): number {
  const s = expr.trim().toUpperCase();
  if (!s) return NaN;
  const n = Number(s);
  if (!isNaN(n)) return n;
  const m = s.match(/^(\d*)D(\d+)([+-]\d+)?$/);
  if (!m) return NaN;
  const count = m[1] ? parseInt(m[1]) : 1;
  const sides = parseInt(m[2]);
  const mod = m[3] ? parseInt(m[3]) : 0;
  return (count * (sides + 1)) / 2 + mod;
}

function pRoll(needed: number): number {
  if (needed <= 1) return 1;
  if (needed > 6) return 0;
  return (7 - needed) / 6;
}

function woundNeeded(s: number, t: number): number {
  if (s >= t * 2) return 2;
  if (s > t) return 3;
  if (s === t) return 4;
  if (s * 2 <= t) return 6;
  return 5;
}

interface Inputs {
  attacks: string;
  skillNeeded: number;
  strength: number;
  ap: number;
  damage: string;
  toughness: number;
  save: number;    // 2-6; 7 = no save
  invuln: number;  // 2-6; 7 = none
  fnp: number;     // 4-6; 7 = none
  rerollHits1: boolean;
  rerollWounds1: boolean;
  sustainedHits1: boolean;
}

interface Result {
  expHits: number;
  expWounds: number;
  expUnsaved: number;
  expDamage: number;
  woundRoll: number;
  effectiveSaveRoll: number;
  valid: boolean;
}

function calculate(i: Inputs): Result {
  const expA = parseDice(i.attacks);
  const expD = parseDice(i.damage);
  const blank: Result = {
    expHits: 0, expWounds: 0, expUnsaved: 0, expDamage: 0,
    woundRoll: 4, effectiveSaveRoll: 3, valid: false,
  };
  if (isNaN(expA) || expA <= 0 || isNaN(expD) || expD <= 0) return blank;

  // To hit
  let pHit = pRoll(i.skillNeeded);
  if (i.rerollHits1) pHit = pHit * (7 / 6);

  // To wound
  const wn = woundNeeded(i.strength, i.toughness);
  let pWound = pRoll(wn);
  if (i.rerollWounds1) pWound = pWound * (7 / 6);

  // Save
  const modSave = i.save + Math.abs(i.ap);
  const pNormSave = i.save <= 6 ? pRoll(modSave) : 0;
  const pInvSave = i.invuln <= 6 ? pRoll(i.invuln) : 0;
  const pSave = Math.max(pNormSave, pInvSave);
  const effectiveSaveRoll = pNormSave >= pInvSave ? modSave : i.invuln;

  // Feel No Pain
  const pFNP = i.fnp <= 6 ? pRoll(i.fnp) : 0;

  // Expected values
  let expHits = expA * pHit;
  if (i.sustainedHits1) expHits += expA * (1 / 6);
  const expWounds = expHits * pWound;
  const expUnsaved = expWounds * (1 - pSave);
  const expDamage = expUnsaved * expD * (1 - pFNP);

  return { expHits, expWounds, expUnsaved, expDamage, woundRoll: wn, effectiveSaveRoll, valid: true };
}

// ── components ────────────────────────────────────────────────────────────────

const fieldCls =
  "w-full rounded-lg border border-slate-300/60 bg-transparent px-3 py-1.5 text-sm focus:outline-none focus:ring-1 focus:ring-rose-400 dark:border-slate-600/60";

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="space-y-1">
      <p className="text-[0.62rem] font-semibold uppercase tracking-[0.2em] text-muted">{label}</p>
      {children}
    </div>
  );
}

function SelectField({
  label, value, onChange, options,
}: {
  label: string;
  value: number;
  onChange: (v: number) => void;
  options: { value: number; label: string }[];
}) {
  return (
    <Field label={label}>
      <select
        value={value}
        onChange={(e) => onChange(parseInt(e.target.value))}
        className={fieldCls}
      >
        {options.map((o) => (
          <option key={o.value} value={o.value}>{o.label}</option>
        ))}
      </select>
    </Field>
  );
}

function NumField({
  label, value, onChange, min = 1, max = 12,
}: {
  label: string; value: number; onChange: (v: number) => void; min?: number; max?: number;
}) {
  return (
    <Field label={label}>
      <input
        type="number"
        value={value}
        onChange={(e) => onChange(Math.max(min, Math.min(max, parseInt(e.target.value) || min)))}
        min={min}
        max={max}
        className={fieldCls}
      />
    </Field>
  );
}

function TextDiceField({
  label, value, onChange, placeholder,
}: {
  label: string; value: string; onChange: (v: string) => void; placeholder?: string;
}) {
  const invalid = isNaN(parseDice(value));
  return (
    <Field label={label}>
      <input
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className={`${fieldCls} ${invalid ? "ring-1 ring-red-400" : ""}`}
      />
    </Field>
  );
}

function Toggle({ label, checked, onChange }: { label: string; checked: boolean; onChange: (v: boolean) => void }) {
  return (
    <label className="flex cursor-pointer items-center gap-2 text-xs">
      <span
        onClick={() => onChange(!checked)}
        className={`relative inline-block h-4 w-7 rounded-full transition ${checked ? "bg-rose-500" : "bg-slate-300 dark:bg-slate-600"}`}
      >
        <span
          className={`absolute top-0.5 left-0.5 h-3 w-3 rounded-full bg-white shadow transition-transform ${checked ? "translate-x-3" : ""}`}
        />
      </span>
      <span className="text-[0.7rem] text-muted">{label}</span>
    </label>
  );
}

function ResultNum({ label, value, sub }: { label: string; value: number; sub?: string }) {
  return (
    <div className="flex flex-col items-center gap-0.5 text-center">
      <p className="text-2xl font-black tabular-nums text-rose-500">{value.toFixed(2)}</p>
      <p className="text-[0.6rem] font-semibold uppercase tracking-widest text-muted">{label}</p>
      {sub && <p className="text-[0.55rem] text-muted/60">{sub}</p>}
    </div>
  );
}

const rollOpts = (min: number, max: number, noneLabel?: string) => {
  const opts = Array.from({ length: max - min + 1 }, (_, i) => ({
    value: i + min,
    label: `${i + min}+`,
  }));
  if (noneLabel) opts.push({ value: 7, label: noneLabel });
  return opts;
};

// ── main ──────────────────────────────────────────────────────────────────────

export function DamageCalcClient() {
  // Weapon
  const [attacks, setAttacks] = useState("3");
  const [skillNeeded, setSkillNeeded] = useState(3);
  const [strength, setStrength] = useState(4);
  const [ap, setAp] = useState(0);
  const [damage, setDamage] = useState("1");
  // Target
  const [toughness, setToughness] = useState(4);
  const [save, setSave] = useState(3);
  const [invuln, setInvuln] = useState(7);
  const [fnp, setFnp] = useState(7);
  // Abilities
  const [rerollHits1, setRerollHits1] = useState(false);
  const [rerollWounds1, setRerollWounds1] = useState(false);
  const [sustainedHits1, setSustainedHits1] = useState(false);

  const result = useMemo(
    () =>
      calculate({ attacks, skillNeeded, strength, ap, damage, toughness, save, invuln, fnp, rerollHits1, rerollWounds1, sustainedHits1 }),
    [attacks, skillNeeded, strength, ap, damage, toughness, save, invuln, fnp, rerollHits1, rerollWounds1, sustainedHits1]
  );

  const apOpts = [0, -1, -2, -3, -4, -5, -6].map((v) => ({
    value: v,
    label: v === 0 ? "AP 0" : `AP ${v}`,
  }));

  const saveOpts = [...rollOpts(2, 6), { value: 7, label: "なし" }];
  const invulnOpts = [{ value: 7, label: "なし" }, ...rollOpts(2, 6)];
  const fnpOpts = [{ value: 7, label: "なし" }, ...rollOpts(4, 6)];

  return (
    <div className="mx-auto max-w-3xl space-y-6 px-4 py-8 sm:py-10">
      {/* Breadcrumb */}
      <nav className="flex flex-wrap items-center gap-2 text-xs text-muted">
        <a href="/wh40k" className="transition hover:text-rose-500">WH40K</a>
        <span>/</span>
        <span className="text-[color:var(--fg-body)]">Damage Calculator</span>
      </nav>

      <header className="space-y-1">
        <p className="text-[0.62rem] font-semibold uppercase tracking-[0.25em] text-rose-500">WH40K 10th Edition</p>
        <h1 className="text-2xl font-black sm:text-3xl">期待ダメージ計算機</h1>
        <p className="text-xs text-muted">
          武器スペックと対象の防御値を入力すると、1フェイズの期待ダメージを算出します。
        </p>
      </header>

      {/* Input panels */}
      <div className="grid gap-4 sm:grid-cols-2">
        {/* Weapon panel */}
        <div className="surface-card space-y-4 rounded-2xl p-5">
          <p className="text-[0.62rem] font-bold uppercase tracking-[0.25em] text-rose-500">Weapon Stats</p>
          <div className="grid grid-cols-2 gap-3">
            <TextDiceField label="Attacks (A)" value={attacks} onChange={setAttacks} placeholder="例: 3 / D6 / 2D6" />
            <SelectField label="Skill (BS/WS)" value={skillNeeded} onChange={setSkillNeeded} options={rollOpts(2, 6)} />
            <NumField label="Strength (S)" value={strength} onChange={setStrength} min={1} max={20} />
            <SelectField label="AP" value={ap} onChange={setAp} options={apOpts} />
            <div className="col-span-2">
              <TextDiceField label="Damage (D)" value={damage} onChange={setDamage} placeholder="例: 1 / D3 / D6+1" />
            </div>
          </div>
        </div>

        {/* Target panel */}
        <div className="surface-card space-y-4 rounded-2xl p-5">
          <p className="text-[0.62rem] font-bold uppercase tracking-[0.25em] text-sky-500">Target Stats</p>
          <div className="grid grid-cols-2 gap-3">
            <NumField label="Toughness (T)" value={toughness} onChange={setToughness} min={1} max={20} />
            <SelectField label="Save (Sv)" value={save} onChange={setSave} options={saveOpts} />
            <SelectField label="Invuln Save" value={invuln} onChange={setInvuln} options={invulnOpts} />
            <SelectField label="Feel No Pain" value={fnp} onChange={setFnp} options={fnpOpts} />
          </div>
        </div>
      </div>

      {/* Abilities */}
      <div className="surface-card rounded-2xl p-5">
        <p className="mb-3 text-[0.62rem] font-bold uppercase tracking-[0.25em] text-amber-500">Weapon Abilities</p>
        <div className="flex flex-wrap gap-4">
          <Toggle label="Reroll Hit Rolls of 1" checked={rerollHits1} onChange={setRerollHits1} />
          <Toggle label="Reroll Wound Rolls of 1" checked={rerollWounds1} onChange={setRerollWounds1} />
          <Toggle label="Sustained Hits 1" checked={sustainedHits1} onChange={setSustainedHits1} />
        </div>
      </div>

      {/* Results */}
      <div className={`surface-card rounded-2xl p-5 transition-opacity ${result.valid ? "" : "opacity-40"}`}>
        <p className="mb-4 text-[0.62rem] font-bold uppercase tracking-[0.25em] text-emerald-500">Expected Results</p>

        {/* Step indicators */}
        <div className="mb-4 flex items-center gap-1 overflow-x-auto pb-1 text-[0.6rem] text-muted">
          <span className="shrink-0 rounded bg-slate-200/60 px-1.5 py-0.5 dark:bg-slate-700/60">
            Wound on {result.woundRoll}+
          </span>
          <span className="text-muted/40">·</span>
          <span className="shrink-0 rounded bg-slate-200/60 px-1.5 py-0.5 dark:bg-slate-700/60">
            {result.effectiveSaveRoll <= 6 ? `Save on ${result.effectiveSaveRoll}+` : "No Save"}
          </span>
        </div>

        {/* Big numbers */}
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
          <ResultNum label="Expected Hits" value={result.expHits} />
          <ResultNum label="Expected Wounds" value={result.expWounds} />
          <ResultNum label="Unsaved Wounds" value={result.expUnsaved} />
          <ResultNum label="Expected Damage" value={result.expDamage} sub="最終ダメージ" />
        </div>

        {/* Flow bar */}
        <div className="mt-5 space-y-2">
          {(
            [
              { label: "Attacks", value: parseDice(attacks) || 0, color: "bg-slate-400" },
              { label: "Hits", value: result.expHits, color: "bg-amber-400" },
              { label: "Wounds", value: result.expWounds, color: "bg-orange-500" },
              { label: "Unsaved", value: result.expUnsaved, color: "bg-rose-500" },
              { label: "Damage", value: result.expDamage, color: "bg-red-600" },
            ] as const
          ).map(({ label, value, color }) => {
            const base = parseDice(attacks) || 1;
            const pct = Math.min(100, (value / base) * 100);
            return (
              <div key={label} className="flex items-center gap-2">
                <p className="w-14 shrink-0 text-right text-[0.58rem] text-muted">{label}</p>
                <div className="h-1.5 flex-1 overflow-hidden rounded-full bg-slate-200 dark:bg-slate-700">
                  <div className={`h-full rounded-full transition-all ${color}`} style={{ width: `${pct}%` }} />
                </div>
                <p className="w-10 shrink-0 text-[0.6rem] tabular-nums text-muted">{value.toFixed(2)}</p>
              </div>
            );
          })}
        </div>
      </div>

      {/* Notes */}
      <div className="space-y-2 text-[0.62rem] text-muted">
        <p>• <strong>D3</strong> = 期待値 2、<strong>D6</strong> = 3.5、<strong>D3+1</strong> = 3、<strong>2D6</strong> = 7 として計算します。</p>
        <p>• Sustained Hits 1: ヒットロールで自然6が出ると追加ヒット +1。</p>
        <p>• Lethal Hits / Devastating Wounds などの複合アビリティは非対応です。</p>
        <p className="rounded-lg border border-amber-300/30 bg-amber-50/40 px-3 py-2 dark:border-amber-500/20 dark:bg-amber-500/5 text-amber-700 dark:text-amber-400">
          ⚠️ あくまで確率的な期待値です。実際のダイス結果とは異なります。
        </p>
      </div>
    </div>
  );
}

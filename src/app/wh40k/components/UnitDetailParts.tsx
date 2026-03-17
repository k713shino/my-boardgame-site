import Link from "next/link";
import type { UnitRole } from "../types";

type UnitMeta = { label: string; text: string; bg: string };

type UnitHeaderData = {
  name: string;
  nameJa: string | null;
  basePoints: number;
  factionId: string;
  unitSlug: string;
  factionName: string;
  factionNameJa: string | null;
  roleMeta: UnitMeta;
  categoryNames: string[];
};

type UnitProfileRow = {
  id: string;
  modelName: string;
  move: string;
  toughness: string;
  save: string;
  wounds: string;
  leadership: string;
  oc: string;
};

type UnitWeaponRow = {
  id: string;
  name: string;
  nameJa: string | null;
  range: string;
  attacks: string;
  skill: string;
  strength: string;
  ap: string;
  damage: string;
  keywords: string;
  keywordsJa: string | null;
};

type UnitWeaponGroup = {
  id: string;
  name: string;
  groupType: string;
  minChoices: number;
  maxChoices: number;
  options: { id: string; name: string; pointsDelta: number }[];
};

type UnitAbilityRow = {
  id: string;
  name: string;
  nameJa: string | null;
  description: string;
  descriptionJa: string | null;
};

type SynergyUnitItem = {
  slug: string;
  name: string;
  nameJa: string | null;
  reason: string;
};

type RelatedRosterItem = {
  title: string;
  description: string;
  href: string;
  actionLabel: string;
  badge?: string;
};

export function UnitHero({ data }: { data: UnitHeaderData }) {
  return (
    <header className="surface-card rounded-2xl p-5 space-y-4 sm:p-6">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <span className={`rounded-full px-2.5 py-0.5 text-[0.65rem] font-bold ${data.roleMeta.bg} ${data.roleMeta.text}`}>
            {data.roleMeta.label}
          </span>
          <h1 className="mt-2 text-2xl font-black sm:text-3xl">{data.name}</h1>
          {data.nameJa && <p className="text-sm text-muted">{data.nameJa}</p>}
          <p className="mt-1 text-[0.65rem] text-muted">
            {data.factionNameJa ?? data.factionName}
          </p>
        </div>

        <div className="text-left sm:text-right">
          <p className={`text-3xl font-black ${data.roleMeta.text}`}>{data.basePoints}</p>
          <p className="text-xs text-muted">pts</p>
        </div>
      </div>

      {data.categoryNames.length > 0 && (
        <div className="flex flex-wrap gap-1.5">
          {data.categoryNames.map((name) => (
            <span
              key={name}
              className="rounded-full border border-slate-200/80 px-2.5 py-0.5 text-[0.62rem] text-muted dark:border-slate-700/80"
            >
              {name}
            </span>
          ))}
        </div>
      )}

      <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
        <Link
          href={`/wh40k/builder?faction=${data.factionId}&add=${data.unitSlug}`}
          className="rounded-full bg-rose-500 px-5 py-2 text-center text-xs font-bold text-white transition hover:bg-rose-400"
        >
          Builderで追加してみる
        </Link>
        <Link
          href="/wh40k/rosters"
          className="rounded-full border border-slate-300/60 px-5 py-2 text-center text-xs font-semibold transition hover:border-rose-400/60 dark:border-slate-600/60"
        >
          関連ロスターを見る
        </Link>
      </div>
    </header>
  );
}

export function UnitOverviewSection({
  role,
  invuln,
  profiles,
}: {
  role: UnitRole;
  invuln: string | null;
  profiles: UnitProfileRow[];
}) {
  if (profiles.length === 0) return null;

  const roleHint: Record<UnitRole, string> = {
    HQ: "盤面全体の指揮とシナジーの起点になりやすい枠です。",
    Battleline: "序盤から中盤の盤面維持に向いた主力枠です。",
    Transport: "主力ユニットを安全に前進させる支援枠です。",
    Other: "任務・牽制・火力補助などで柔軟に採用される枠です。",
    Heavy: "高打点・高耐久で中盤以降の主導権を握る枠です。",
  };

  return (
    <section className="surface-card rounded-2xl p-5 space-y-3">
      <div className="flex flex-wrap items-center gap-2">
        <h2 className="text-[0.65rem] font-bold uppercase tracking-widest text-muted">概要</h2>
        {invuln && (
          <span className="rounded-full bg-indigo-500/10 px-2 py-0.5 text-[0.65rem] font-bold text-indigo-500 dark:text-indigo-400">
            スペシャルセーヴ {invuln}
          </span>
        )}
      </div>

      <p className="text-xs leading-relaxed text-muted">{roleHint[role]}</p>

      <div className="overflow-x-auto">
        <table className="w-full text-xs">
          <thead>
            <tr className="border-b border-slate-200/60 dark:border-slate-700/60">
              {["モデル", "移", "耐", "防", "傷", "統", "確"].map((h) => (
                <th
                  key={h}
                  className="py-1.5 pr-3 text-left text-[0.6rem] font-bold uppercase tracking-wider text-muted first:pl-0"
                >
                  {h}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
            {profiles.map((pr) => (
              <tr key={pr.id}>
                <td className="py-2 pr-3 font-semibold">{pr.modelName}</td>
                <td className="py-2 pr-3">{pr.move}</td>
                <td className="py-2 pr-3">{pr.toughness}</td>
                <td className="py-2 pr-3">{pr.save}</td>
                <td className="py-2 pr-3">{pr.wounds}</td>
                <td className="py-2 pr-3">{pr.leadership}</td>
                <td className="py-2 pr-3">{pr.oc}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </section>
  );
}

export function UnitWeaponTable({
  title,
  weapons,
  skillLabel,
}: {
  title: string;
  weapons: UnitWeaponRow[];
  skillLabel: string;
}) {
  if (weapons.length === 0) return null;

  return (
    <section className="surface-card rounded-2xl p-5 space-y-3">
      <h2 className="text-[0.65rem] font-bold uppercase tracking-widest text-muted">{title}</h2>
      <div className="overflow-x-auto">
        <table className="w-full text-xs">
          <thead>
            <tr className="border-b border-slate-200/60 dark:border-slate-700/60">
              {["武器名", "射程", "回", skillLabel, "攻", "貫通", "ダ", "特殊"].map((h) => (
                <th
                  key={h}
                  className="py-1.5 pr-3 text-left text-[0.6rem] font-bold uppercase tracking-wider text-muted first:pl-0"
                >
                  {h}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
            {weapons.map((weapon) => (
              <tr key={weapon.id}>
                <td className="py-2 pr-3 font-semibold">
                  {weapon.nameJa ?? weapon.name}
                  {weapon.nameJa && <span className="ml-1 text-[0.55rem] font-normal text-muted">{weapon.name}</span>}
                </td>
                <td className="py-2 pr-3">{weapon.range}</td>
                <td className="py-2 pr-3">{weapon.attacks}</td>
                <td className="py-2 pr-3">{weapon.skill}</td>
                <td className="py-2 pr-3">{weapon.strength}</td>
                <td className="py-2 pr-3">{weapon.ap}</td>
                <td className="py-2 pr-3">{weapon.damage}</td>
                <td className="py-2 text-[0.6rem] text-muted">
                  {weapon.keywordsJa ?? (weapon.keywords === "-" ? "" : weapon.keywords)}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </section>
  );
}

const WEAPON_SECTION_META: Record<string, { label: string; color: string }> = {
  WEAPON:      { label: "武器オプション",   color: "text-rose-500" },
  ENHANCEMENT: { label: "エンハンスメント", color: "text-violet-500" },
  WARGEAR:     { label: "装備オプション",   color: "text-amber-500" },
  OPTION:      { label: "その他オプション", color: "text-sky-500" },
};

export function UnitWeaponOptionsSection({ groups }: { groups: UnitWeaponGroup[] }) {
  if (groups.length === 0) return null;

  const sectionTypes = ["WEAPON", "ENHANCEMENT", "WARGEAR", "OPTION"] as const;

  return (
    <section className="surface-card rounded-2xl p-5 space-y-4">
      <h2 className="text-[0.65rem] font-bold uppercase tracking-widest text-muted">武器・装備選択肢</h2>
      {sectionTypes.map((sectionType) => {
        const sectionGroups = groups.filter((g) => (g.groupType ?? "WEAPON") === sectionType);
        if (sectionGroups.length === 0) return null;
        const meta = WEAPON_SECTION_META[sectionType];
        return (
          <div key={sectionType} className="space-y-2">
            <p className={`text-[0.6rem] font-bold uppercase tracking-widest ${meta.color}`}>{meta.label}</p>
            <div className="space-y-2">
              {sectionGroups.map((group) => (
                <div key={group.id}>
                  <p className="text-xs font-semibold">
                    {group.name}
                    <span className="ml-1.5 text-[0.6rem] font-normal text-muted">
                      {group.minChoices === group.maxChoices
                        ? `${group.maxChoices}つ選択`
                        : `${group.minChoices}〜${group.maxChoices}つ選択`}
                    </span>
                  </p>
                  <ul className="mt-1 flex flex-wrap gap-1.5">
                    {group.options.map((option) => (
                      <li
                        key={option.id}
                        className="flex items-center gap-1 rounded-full border border-slate-200/80 px-2.5 py-0.5 text-[0.65rem] dark:border-slate-700/80"
                      >
                        <span>{option.name}</span>
                        {option.pointsDelta !== 0 && (
                          <span className={option.pointsDelta > 0 ? "text-amber-500" : "text-emerald-500"}>
                            ({option.pointsDelta > 0 ? "+" : ""}
                            {option.pointsDelta}pt)
                          </span>
                        )}
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </div>
        );
      })}
    </section>
  );
}

export function UnitAbilitiesSection({ abilities }: { abilities: UnitAbilityRow[] }) {
  if (abilities.length === 0) return null;

  return (
    <section className="surface-card rounded-2xl p-5 space-y-3">
      <h2 className="text-[0.65rem] font-bold uppercase tracking-widest text-muted">アビリティ</h2>
      <div className="space-y-3">
        {abilities.map((ability) => (
          <div key={ability.id}>
            <p className="text-xs font-bold">
              {ability.nameJa ?? ability.name}
              {ability.nameJa && <span className="ml-1.5 text-[0.55rem] font-normal text-muted">{ability.name}</span>}
            </p>
            <p className="mt-0.5 whitespace-pre-line text-xs leading-relaxed text-muted">
              {ability.descriptionJa ?? ability.description}
            </p>
            {ability.descriptionJa && (
              <details className="mt-1">
                <summary className="cursor-pointer select-none text-[0.55rem] text-muted/60">原文を表示</summary>
                <p className="mt-1 whitespace-pre-line text-[0.6rem] leading-relaxed text-muted/50">{ability.description}</p>
              </details>
            )}
          </div>
        ))}
      </div>
    </section>
  );
}

export function UnitKeywordsSection({ categoryNames }: { categoryNames: string[] }) {
  if (categoryNames.length === 0) return null;

  return (
    <section className="surface-card rounded-2xl p-5 space-y-2">
      <h2 className="text-[0.65rem] font-bold uppercase tracking-widest text-muted">キーワード</h2>
      <div className="flex flex-wrap gap-1.5">
        {categoryNames.map((name) => (
          <span
            key={name}
            className="rounded-full border border-slate-200 bg-white/90 px-2.5 py-0.5 text-[0.65rem] dark:border-white/30 dark:bg-white/85 dark:text-slate-800"
          >
            {name}
          </span>
        ))}
      </div>
    </section>
  );
}

export function UnitSynergySection({ items }: { items: SynergyUnitItem[] }) {
  if (items.length === 0) return null;

  return (
    <section className="surface-card rounded-2xl p-5 space-y-3">
      <h2 className="text-[0.65rem] font-bold uppercase tracking-widest text-muted">相性の良いユニット</h2>
      <div className="space-y-1.5">
        {items.map((item) => (
          <article key={item.slug} className="rounded-xl border border-slate-200/70 px-3 py-2 dark:border-slate-700/70">
            <div className="flex items-start justify-between gap-2">
              <div className="min-w-0">
                <Link
                  href={`/wh40k/units/${item.slug}`}
                  className="block truncate text-xs font-semibold text-rose-500 underline decoration-dotted underline-offset-2 transition hover:opacity-80"
                >
                  {item.name}
                </Link>
                {item.nameJa && <p className="truncate text-[0.6rem] text-muted">{item.nameJa}</p>}
              </div>
              <span className="rounded-full bg-rose-500/10 px-2 py-0.5 text-[0.55rem] font-semibold text-rose-500">
                Synergy
              </span>
            </div>
            <p className="mt-1 text-[0.65rem] leading-relaxed text-muted">{item.reason}</p>
          </article>
        ))}
      </div>
    </section>
  );
}

export function RelatedRostersSection({ items }: { items: RelatedRosterItem[] }) {
  if (items.length === 0) return null;

  return (
    <section className="surface-card rounded-2xl p-5 space-y-3">
      <h2 className="text-[0.65rem] font-bold uppercase tracking-widest text-muted">関連ロスター</h2>
      <div className="space-y-2">
        {items.map((item) => (
          <article
            key={`${item.title}-${item.href}`}
            className="rounded-xl border border-slate-200/70 px-3 py-2.5 dark:border-slate-700/70"
          >
            <div className="flex items-start justify-between gap-2">
              <h3 className="text-xs font-semibold">{item.title}</h3>
              {item.badge && (
                <span className="rounded-full bg-rose-500/10 px-2 py-0.5 text-[0.55rem] font-semibold text-rose-500">
                  {item.badge}
                </span>
              )}
            </div>
            <p className="mt-0.5 text-[0.65rem] leading-relaxed text-muted">{item.description}</p>
            <Link
              href={item.href}
              className="mt-2 inline-block rounded-full border border-slate-300/60 px-3 py-1 text-[0.65rem] font-semibold transition hover:border-rose-400/70 hover:text-rose-500 dark:border-slate-600/60"
            >
              {item.actionLabel}
            </Link>
          </article>
        ))}
      </div>
    </section>
  );
}

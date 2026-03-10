import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import { prisma } from "@/lib/prisma";
import type { UnitRole } from "../../types";

const ROLE_META: Record<UnitRole, { label: string; text: string; bg: string }> = {
  HQ:         { label: "Character",           text: "text-rose-500",    bg: "bg-rose-500/10" },
  Battleline: { label: "Battleline",           text: "text-emerald-500", bg: "bg-emerald-500/10" },
  Transport:  { label: "Dedicated Transport",  text: "text-amber-500",   bg: "bg-amber-500/10" },
  Other:      { label: "Other",                text: "text-sky-500",     bg: "bg-sky-500/10" },
  Heavy:      { label: "Heavy",                text: "text-red-500",     bg: "bg-red-500/10" },
};

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const unit = await prisma.unit.findUnique({
    where: { slug },
    include: { faction: { select: { name: true } } },
  });
  if (!unit) return { title: "Unit Not Found | WH40K" };
  return {
    title: `${unit.name} | WH40K ${unit.faction.name}`,
    description: `${unit.nameJa ?? unit.name}（${unit.name}）のデータシート。`,
  };
}

export default async function UnitPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;

  const unit = await prisma.unit.findUnique({
    where: { slug },
    include: {
      faction: true,
      profiles:       { orderBy: { sortOrder: "asc" } },
      weaponProfiles: { orderBy: { sortOrder: "asc" } },
      abilities:      { orderBy: { sortOrder: "asc" } },
      weaponGroups:   {
        include: { options: { orderBy: { sortOrder: "asc" } } },
        orderBy: { sortOrder: "asc" },
      },
      categories: { select: { name: true } },
    },
  });
  if (!unit) notFound();

  const meta = ROLE_META[unit.role as UnitRole];
  const rangedWeapons = unit.weaponProfiles.filter((w) => w.isRanged);
  const meleeWeapons  = unit.weaponProfiles.filter((w) => !w.isRanged);

  return (
    <div className="mx-auto max-w-3xl space-y-6 px-4 py-10">
      {/* Breadcrumb */}
      <nav className="flex flex-wrap gap-1.5 text-xs text-muted">
        <Link href="/wh40k" className="hover:text-rose-500 transition">WH40K</Link>
        <span>/</span>
        <span>{unit.faction.nameJa ?? unit.faction.name}</span>
        <span>/</span>
        <span className="text-[color:var(--fg-body)]">{unit.name}</span>
      </nav>

      {/* Header */}
      <div className="surface-card rounded-2xl p-6 space-y-3">
        <div className="flex items-start justify-between gap-3">
          <div>
            <span className={`rounded-full px-2.5 py-0.5 text-[0.65rem] font-bold ${meta.bg} ${meta.text}`}>
              {meta.label}
            </span>
            <h1 className="mt-2 text-2xl font-black">{unit.name}</h1>
            {unit.nameJa && <p className="text-sm text-muted">{unit.nameJa}</p>}
            <p className="mt-0.5 text-[0.65rem] text-muted">
              {unit.faction.nameJa ?? unit.faction.name}
            </p>
          </div>
          <div className="shrink-0 text-right">
            <p className={`text-3xl font-black ${meta.text}`}>{unit.basePoints}</p>
            <p className="text-xs text-muted">pts</p>
          </div>
        </div>

        <Link
          href="/wh40k/builder"
          className="inline-block rounded-full bg-rose-500 px-5 py-2 text-xs font-bold text-white transition hover:bg-rose-400"
        >
          ⚔️ ビルダーに追加
        </Link>
      </div>

      {/* Stats */}
      {unit.profiles.length > 0 && (
        <section className="surface-card rounded-2xl p-5 space-y-3">
          <div className="flex items-center gap-3">
            <h2 className="text-[0.65rem] font-bold uppercase tracking-widest text-muted">
              ステータス
            </h2>
            {unit.invuln && (
              <span className="rounded-full bg-indigo-500/10 px-2 py-0.5 text-[0.65rem] font-bold text-indigo-500 dark:text-indigo-400">
                インヴルネラブル {unit.invuln}
              </span>
            )}
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-xs">
              <thead>
                <tr className="border-b border-slate-200/60 dark:border-slate-700/60">
                  {["モデル", "M", "T", "Sv", "W", "Ld", "OC"].map((h) => (
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
                {unit.profiles.map((pr) => (
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
      )}

      {/* Ranged Weapons */}
      {rangedWeapons.length > 0 && (
        <WeaponTable title="射撃武器" weapons={rangedWeapons} skillLabel="BS" />
      )}

      {/* Melee Weapons */}
      {meleeWeapons.length > 0 && (
        <WeaponTable title="近接武器" weapons={meleeWeapons} skillLabel="WS" />
      )}

      {/* Weapon Selection Groups */}
      {unit.weaponGroups.length > 0 && (
        <section className="surface-card rounded-2xl p-5 space-y-4">
          <h2 className="text-[0.65rem] font-bold uppercase tracking-widest text-muted">
            武器選択肢
          </h2>
          <div className="space-y-3">
            {unit.weaponGroups.map((g) => (
              <div key={g.id}>
                <p className="text-xs font-semibold">
                  {g.name}
                  <span className="ml-1.5 text-[0.6rem] font-normal text-muted">
                    {g.minChoices === g.maxChoices
                      ? `${g.maxChoices}つ選択`
                      : `${g.minChoices}〜${g.maxChoices}つ選択`}
                  </span>
                </p>
                <ul className="mt-1 flex flex-wrap gap-1.5">
                  {g.options.map((opt) => (
                    <li
                      key={opt.id}
                      className="flex items-center gap-1 rounded-full border border-slate-200/80 px-2.5 py-0.5 text-[0.65rem] dark:border-slate-700/80"
                    >
                      <span>{opt.name}</span>
                      {opt.pointsDelta !== 0 && (
                        <span className={opt.pointsDelta > 0 ? "text-amber-500" : "text-emerald-500"}>
                          ({opt.pointsDelta > 0 ? "+" : ""}{opt.pointsDelta}pt)
                        </span>
                      )}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Abilities */}
      {unit.abilities.length > 0 && (
        <section className="surface-card rounded-2xl p-5 space-y-3">
          <h2 className="text-[0.65rem] font-bold uppercase tracking-widest text-muted">
            アビリティ
          </h2>
          <div className="space-y-3">
            {unit.abilities.map((a) => (
              <div key={a.id}>
                <p className="text-xs font-bold">
                  {a.nameJa ?? a.name}
                  {a.nameJa && (
                    <span className="ml-1.5 text-[0.55rem] font-normal text-muted">{a.name}</span>
                  )}
                </p>
                <p className="mt-0.5 text-xs text-muted leading-relaxed whitespace-pre-line">
                  {a.descriptionJa ?? a.description}
                </p>
                {a.descriptionJa && (
                  <details className="mt-1">
                    <summary className="cursor-pointer text-[0.55rem] text-muted/60 select-none">
                      原文を表示
                    </summary>
                    <p className="mt-1 text-[0.6rem] text-muted/50 leading-relaxed whitespace-pre-line">
                      {a.description}
                    </p>
                  </details>
                )}
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Keywords */}
      {unit.categories.length > 0 && (
        <section className="space-y-2">
          <h2 className="text-[0.65rem] font-bold uppercase tracking-widest text-muted">
            キーワード
          </h2>
          <div className="flex flex-wrap gap-1.5">
            {unit.categories.map((c) => (
              <span
                key={c.name}
                className="rounded-full border border-slate-200 bg-white/90 px-2.5 py-0.5 text-[0.65rem] dark:border-white/30 dark:bg-white/85 dark:text-slate-800"
              >
                {c.name}
              </span>
            ))}
          </div>
        </section>
      )}

      {/* Disclaimer */}
      <p className="rounded-xl border border-amber-300/40 bg-amber-50/50 px-4 py-3 text-[0.65rem] leading-relaxed text-amber-700 dark:border-amber-500/20 dark:bg-amber-500/5 dark:text-amber-400">
        ⚠️ 大会使用前は必ず GW 公式 <strong>Munitorum Field Manual</strong> でポイントを確認してください。
      </p>
    </div>
  );
}

// ─── 武器テーブル コンポーネント ────────────────────────────────────────────────

type WeaponProfileRow = {
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

function WeaponTable({
  title,
  weapons,
  skillLabel,
}: {
  title: string;
  weapons: WeaponProfileRow[];
  skillLabel: string;
}) {
  return (
    <section className="surface-card rounded-2xl p-5 space-y-3">
      <h2 className="text-[0.65rem] font-bold uppercase tracking-widest text-muted">
        {title}
      </h2>
      <div className="overflow-x-auto">
        <table className="w-full text-xs">
          <thead>
            <tr className="border-b border-slate-200/60 dark:border-slate-700/60">
              {["武器名", "Range", "A", skillLabel, "S", "AP", "D", "特殊"].map((h) => (
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
            {weapons.map((w) => (
              <tr key={w.id}>
                <td className="py-2 pr-3 font-semibold">
                  {w.nameJa ?? w.name}
                  {w.nameJa && (
                    <span className="ml-1 text-[0.55rem] text-muted font-normal">{w.name}</span>
                  )}
                </td>
                <td className="py-2 pr-3">{w.range}</td>
                <td className="py-2 pr-3">{w.attacks}</td>
                <td className="py-2 pr-3">{w.skill}</td>
                <td className="py-2 pr-3">{w.strength}</td>
                <td className="py-2 pr-3">{w.ap}</td>
                <td className="py-2 pr-3">{w.damage}</td>
                <td className="py-2 text-[0.6rem] text-muted">
                  {w.keywordsJa ?? (w.keywords === "-" ? "" : w.keywords)}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </section>
  );
}

import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import { prisma } from "@/lib/prisma";
import type { UnitRole } from "../../types";
import {
  RelatedRostersSection,
  UnitAbilitiesSection,
  UnitHero,
  UnitKeywordsSection,
  UnitOverviewSection,
  UnitSynergySection,
  UnitWeaponOptionsSection,
  UnitWeaponTable,
} from "../../components/UnitDetailParts";
import { DatasheetTracker } from "./DatasheetTracker";

const ROLE_META: Record<UnitRole, { label: string; text: string; bg: string }> = {
  HQ: { label: "Character", text: "text-rose-500", bg: "bg-rose-500/10" },
  Battleline: { label: "Battleline", text: "text-emerald-500", bg: "bg-emerald-500/10" },
  Transport: { label: "Dedicated Transport", text: "text-amber-500", bg: "bg-amber-500/10" },
  Other: { label: "Other", text: "text-sky-500", bg: "bg-sky-500/10" },
  Heavy: { label: "Heavy", text: "text-red-500", bg: "bg-red-500/10" },
};

function hasKeyword(categories: string[], keywords: string[]): boolean {
  const lowered = categories.map((c) => c.toLowerCase());
  return keywords.some((k) => lowered.some((c) => c.includes(k.toLowerCase())));
}

function synergyReasonFor(role: UnitRole, categories: string[]): string {
  if (role === "HQ") return "指揮オーラやバフで主力の効率を底上げできます。";
  if (role === "Transport") return "前進力を補い、主力ユニットを安全に展開できます。";
  if (role === "Battleline") return "盤面維持と任務達成を安定させる中核枠です。";
  if (hasKeyword(categories, ["wraith", "monster", "vehicle"])) {
    return "高耐久ユニットとして中央維持や圧力役を補完します。";
  }
  if (hasKeyword(categories, ["fly", "mounted", "jump"])) {
    return "機動力を活かして側面展開や後衛への圧力を担えます。";
  }
  return "火力・任務・牽制の穴を埋める柔軟な補完枠です。";
}

const GENERIC_SYNERGY_CATEGORIES = new Set([
  "aeldari",
  "character",
  "infantry",
  "vehicle",
  "monster",
  "grenades",
  "epic hero",
]);

type RosterWithUnits = {
  id: string;
  title: string;
  pointsLimit: number;
  totalPoints: number;
  updatedAt: Date;
};

type SynergyCandidate = {
  id: string;
  slug: string;
  name: string;
  nameJa: string | null;
  role: UnitRole;
  categories: { name: string }[];
};

function isUnknownIsPublicError(error: unknown): boolean {
  if (!error || typeof error !== "object") return false;
  const maybeMessage = (error as { message?: unknown }).message;
  const message = typeof maybeMessage === "string" ? maybeMessage : "";
  return message.includes("Unknown argument `isPublic`");
}

async function findRelatedRosters(params: {
  factionId: string;
  unitId?: string;
  excludeIds?: string[];
  take: number;
}): Promise<RosterWithUnits[]> {
  const where = {
    factionId: params.factionId,
    ...(params.unitId ? { rosterUnits: { some: { unitId: params.unitId } } } : {}),
    ...(params.excludeIds && params.excludeIds.length > 0 ? { id: { notIn: params.excludeIds } } : {}),
  };

  const orderBy = [{ updatedAt: "desc" as const }];
  const select = {
    id: true,
    title: true,
    pointsLimit: true,
    totalPoints: true,
    updatedAt: true,
  };

  try {
    const withPublicFilter = await prisma.roster.findMany({
      where: { ...where, isPublic: true } as typeof where & { isPublic: boolean },
      select,
      orderBy,
      take: params.take,
    });
    return withPublicFilter as unknown as RosterWithUnits[];
  } catch (error) {
    if (!isUnknownIsPublicError(error)) throw error;

    // Prisma Client が isPublic を未認識の環境では、既存データ互換でフォールバック。
    const fallback = await prisma.roster.findMany({
      where,
      select,
      orderBy,
      take: params.take,
    });
    return fallback as unknown as RosterWithUnits[];
  }
}

function buildSynergyCategoryPool(categoryNames: string[]): string[] {
  return categoryNames
    .filter((name) => {
      const normalized = name.trim().toLowerCase();
      return normalized.length > 0 && !GENERIC_SYNERGY_CATEGORIES.has(normalized);
    })
    .slice(0, 8);
}

function preferredSynergyRoles(role: UnitRole): UnitRole[] {
  if (role === "Battleline") return ["HQ", "Transport"];
  if (role === "HQ") return ["Battleline", "Heavy"];
  if (role === "Heavy") return ["HQ", "Battleline"];
  if (role === "Transport") return ["Battleline", "Other"];
  return ["HQ", "Battleline"];
}

async function findSynergyUnits(params: {
  factionId: string;
  unitId: string;
  role: UnitRole;
  categoryNames: string[];
  take: number;
}) {
  const priorityCategoryNames = buildSynergyCategoryPool(params.categoryNames);
  const preferredRoles = preferredSynergyRoles(params.role);
  const select = {
    id: true,
    slug: true,
    name: true,
    nameJa: true,
    role: true,
    categories: { select: { name: true } },
  } as const;

  const primaryCandidates = await prisma.unit.findMany({
    where: {
      factionId: params.factionId,
      NOT: { id: params.unitId },
      OR: [
        ...(priorityCategoryNames.length > 0
          ? [{ categories: { some: { name: { in: priorityCategoryNames } } } }]
          : []),
        { role: { in: preferredRoles } },
      ],
    },
    select,
    take: Math.max(params.take * 3, 12),
  });

  const primaryIds = new Set(primaryCandidates.map((candidate) => candidate.id));
  const fallbackCandidates =
    primaryCandidates.length >= params.take * 2
      ? []
      : await prisma.unit.findMany({
          where: {
            factionId: params.factionId,
            NOT: {
              id: { in: [params.unitId, ...primaryIds] },
            },
          },
          select,
          take: params.take * 2 - primaryCandidates.length,
        });

  return [...primaryCandidates, ...fallbackCandidates] as SynergyCandidate[];
}

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
    select: {
      id: true,
      name: true,
      nameJa: true,
      role: true,
      basePoints: true,
      invuln: true,
      factionId: true,
      faction: {
        select: {
          name: true,
          nameJa: true,
        },
      },
      categories: {
        select: { name: true },
      },
    },
  });

  if (!unit) notFound();

  const meta = ROLE_META[unit.role as UnitRole];
  const categoryNames = unit.categories.map((c) => c.name);
  const [profiles, weaponProfiles, abilities, weaponGroups, synergyCandidates, directRosters] = await Promise.all([
    prisma.unitProfile.findMany({
      where: { unitId: unit.id },
      orderBy: { sortOrder: "asc" },
    }),
    prisma.unitWeaponProfile.findMany({
      where: { unitId: unit.id },
      orderBy: { sortOrder: "asc" },
    }),
    prisma.unitAbility.findMany({
      where: { unitId: unit.id },
      orderBy: { sortOrder: "asc" },
    }),
    prisma.unitWeaponGroup.findMany({
      where: { unitId: unit.id },
      include: { options: { orderBy: { sortOrder: "asc" } } },
      orderBy: { sortOrder: "asc" },
    }),
    findSynergyUnits({
      factionId: unit.factionId,
      unitId: unit.id,
      role: unit.role as UnitRole,
      categoryNames,
      take: 4,
    }),
    findRelatedRosters({
      factionId: unit.factionId,
      unitId: unit.id,
      take: 3,
    }),
  ]);
  const rangedWeapons = weaponProfiles.filter((weapon) => weapon.isRanged);
  const meleeWeapons = weaponProfiles.filter((weapon) => !weapon.isRanged);

  const synergyUnits = synergyCandidates
    .map((candidate) => {
      const candidateCategories = candidate.categories.map((c) => c.name);
      const overlap = candidateCategories.filter((c) => categoryNames.includes(c)).length;
      let score = overlap * 2;

      if (unit.role === "Battleline" && (candidate.role === "HQ" || candidate.role === "Transport")) score += 3;
      if (unit.role === "HQ" && candidate.role === "Battleline") score += 3;
      if (unit.role === "Heavy" && candidate.role === "HQ") score += 2;
      if (hasKeyword(categoryNames, ["wraith"]) && hasKeyword(candidateCategories, ["wraith", "psyker"])) score += 2;
      if (hasKeyword(categoryNames, ["infantry"]) && hasKeyword(candidateCategories, ["transport"])) score += 2;
      if (hasKeyword(candidateCategories, ["fly", "mounted", "jump"])) score += 1;

      return {
        slug: candidate.slug,
        name: candidate.name,
        nameJa: candidate.nameJa,
        score,
        reason: synergyReasonFor(candidate.role as UnitRole, candidateCategories),
      };
    })
    .sort((a, b) => b.score - a.score || a.name.localeCompare(b.name))
    .slice(0, 4);

  const directIds = new Set(directRosters.map((r) => r.id));
  const additionalRosters =
    directRosters.length < 3
      ? await findRelatedRosters({
          factionId: unit.factionId,
          excludeIds: [...directIds],
          take: 3 - directRosters.length,
        })
      : [];

  const relatedRosters = [...directRosters, ...additionalRosters].map((roster) => {
    const includesCurrent = directIds.has(roster.id);

    return {
      title: roster.title,
      description: `${roster.totalPoints}/${roster.pointsLimit}pt · ${new Date(roster.updatedAt).toLocaleDateString("ja-JP")}`,
      href: `/wh40k/rosters/${roster.id}`,
      actionLabel: "このロスターを見る",
      badge: includesCurrent ? "採用中" : "同陣営",
    };
  });

  return (
    <div className="mx-auto max-w-3xl space-y-6 px-4 py-8 sm:py-10">
      <DatasheetTracker unitSlug={slug} unitName={unit.name} faction={unit.factionId} />
      <nav className="flex flex-wrap items-center gap-1.5 text-xs text-muted">
        <Link href="/wh40k" className="transition hover:text-rose-500">
          WH40K
        </Link>
        <span>/</span>
        <span>{unit.faction.nameJa ?? unit.faction.name}</span>
        <span>/</span>
        <span className="text-[color:var(--fg-body)]">{unit.name}</span>
      </nav>

      <UnitHero
        data={{
          name: unit.name,
          nameJa: unit.nameJa,
          basePoints: unit.basePoints,
          factionName: unit.faction.name,
          factionNameJa: unit.faction.nameJa,
          roleMeta: meta,
          categoryNames,
        }}
      />

      <UnitOverviewSection role={unit.role as UnitRole} invuln={unit.invuln} profiles={profiles} />
      <UnitWeaponTable title="射撃武器" weapons={rangedWeapons} skillLabel="BS" />
      <UnitWeaponTable title="白兵戦武器" weapons={meleeWeapons} skillLabel="WS" />
      <UnitWeaponOptionsSection groups={weaponGroups} />
      <UnitAbilitiesSection abilities={abilities} />
      <UnitSynergySection items={synergyUnits} />
      <RelatedRostersSection items={relatedRosters} />
      <UnitKeywordsSection categoryNames={categoryNames} />

      <p className="rounded-xl border border-amber-300/40 bg-amber-50/50 px-4 py-3 text-[0.65rem] leading-relaxed text-amber-700 dark:border-amber-500/20 dark:bg-amber-500/5 dark:text-amber-400">
        ⚠️ 大会使用前は必ず GW 公式 <strong>Munitorum Field Manual</strong> でポイントを確認してください。
      </p>
    </div>
  );
}

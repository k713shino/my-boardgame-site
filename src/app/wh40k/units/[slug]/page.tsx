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

/** thisRole の視点から見た候補ユニットとの相性理由を返す */
function synergyReasonForPair(
  thisRole: UnitRole,
  thisCategories: string[],
  candidateRole: UnitRole,
  candidateCategories: string[],
  leaderFlags: { iLeadCandidate: boolean; candidateLeadsMe: boolean }
): string {
  if (leaderFlags.iLeadCandidate)
    return "このユニットにアタッチ（合流）して指揮能力・戦闘バフを付与できます。";
  if (leaderFlags.candidateLeadsMe)
    return "このユニットに合流できるLeaderです。アタッチで指揮能力・戦闘バフを受けられます。";
  if (thisRole === "HQ" && candidateRole === "Battleline")
    return "CharacterがアタッチしてBattlelineの戦闘力・生存率を高めます。";
  if (thisRole === "HQ" && candidateRole === "Heavy")
    return "オーラ効果で重火力ユニットの射撃性能を底上げします。";
  if (thisRole === "Battleline" && candidateRole === "HQ")
    return "このBattlelineにアタッチして指揮能力と戦闘力を付与できます。";
  if (thisRole === "Battleline" && candidateRole === "Transport")
    return "搭乗展開することで生存率を保ちつつ前線に到達できます。";
  if (thisRole === "Transport" && (candidateRole === "Battleline" || candidateRole === "Other"))
    return "このTransportに搭乗して安全に前線へ展開できます。";
  if (thisRole === "Heavy" && candidateRole === "HQ")
    return "CharacterのオーラやLeaderルールで重火力の命中・攻撃力を強化します。";
  if (thisRole === "Heavy" && candidateRole === "Battleline")
    return "前衛で敵を引きつける間、後方から火力支援します。";
  if (thisRole === "Other" && candidateRole === "HQ")
    return "Characterのオーラやバフを活用して本来の性能を発揮します。";
  if (hasKeyword(thisCategories, ["wraith"]) && hasKeyword(candidateCategories, ["wraith", "psyker"]))
    return "同じWraithシナジーで相乗効果を生む組み合わせです。";
  if (hasKeyword(thisCategories, ["infantry"]) && hasKeyword(candidateCategories, ["transport"]))
    return "このTransportに搭乗して前線へ展開できます。";
  if (hasKeyword(candidateCategories, ["fly", "mounted", "jump", "jetbike"]))
    return "高機動力で側面制圧や後衛圧力を担い、主力を補完します。";
  if (candidateRole === "HQ")
    return "Characterのオーラや指揮効果で編成全体の効率を高めます。";
  return "同陣営で役割を補い合える組み合わせです。";
}


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
    // isPublic カラム未対応環境では表示しない
    return [];
  }
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
  const preferredRoles = preferredSynergyRoles(params.role);
  const select = {
    id: true,
    slug: true,
    name: true,
    nameJa: true,
    role: true,
    categories: { select: { name: true } },
  } as const;

  // ロール優先で候補を取得（フォールバックは廃止: 無関係ユニットを出さないため）
  const candidates = await prisma.unit.findMany({
    where: {
      factionId: params.factionId,
      NOT: { id: params.unitId },
      role: { in: preferredRoles },
    },
    select,
    take: Math.max(params.take * 4, 16),
  });

  return candidates as SynergyCandidate[];
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
  const thisRole = unit.role as UnitRole;

  // ── Stage 1: アビリティ取得（Leader合流先を解析するため先行取得）──────────
  const abilities = await prisma.unitAbility.findMany({
    where: { unitId: unit.id },
    orderBy: { sortOrder: "asc" },
  });

  // Leader アビリティの合流先ユニット名リストを解析
  const myLeaderAbility = abilities.find((a) => a.description.includes("can be attached to the following"));
  const myLeaderTargetNames: string[] = myLeaderAbility
    ? [...myLeaderAbility.description.matchAll(/■\s*([^\n]+)/g)].map((m) => m[1].trim())
    : [];
  const myLeaderTargetNamesLower = new Set(myLeaderTargetNames.map((n) => n.toLowerCase()));

  // ── Stage 2: 残りデータを並行取得 ──────────────────────────────────────────
  const unitSynergySelect = {
    id: true, slug: true, name: true, nameJa: true, role: true,
    categories: { select: { name: true } },
  } as const;

  const [profiles, weaponProfiles, weaponGroups, roleCandidates, leaderTargetUnits, leaderAbilityRefs, directRosters] = await Promise.all([
    prisma.unitProfile.findMany({ where: { unitId: unit.id }, orderBy: { sortOrder: "asc" } }),
    prisma.unitWeaponProfile.findMany({ where: { unitId: unit.id }, orderBy: { sortOrder: "asc" } }),
    prisma.unitWeaponGroup.findMany({
      where: { unitId: unit.id },
      include: { options: { orderBy: { sortOrder: "asc" } } },
      orderBy: { sortOrder: "asc" },
    }),
    // ロール補完候補（HQ以外でのバックアップ）
    findSynergyUnits({ factionId: unit.factionId, unitId: unit.id, role: thisRole, categoryNames, take: 4 }),
    // 現ユニットの Leader アビリティが指定する合流先ユニットを名前で明示取得
    myLeaderTargetNames.length > 0
      ? prisma.unit.findMany({
          where: { factionId: unit.factionId, name: { in: myLeaderTargetNames }, NOT: { id: unit.id } },
          select: unitSynergySelect,
        })
      : Promise.resolve([]),
    // 現ユニットに合流できる Leader ユニット（他ユニットのアビリティに現ユニット名が列挙されているもの）
    prisma.unitAbility.findMany({
      where: {
        unit: { factionId: unit.factionId },
        description: { contains: `■ ${unit.name}` },
      },
      select: { unit: { select: unitSynergySelect } },
    }),
    findRelatedRosters({ factionId: unit.factionId, unitId: unit.id, take: 3 }),
  ]);

  const rangedWeapons = weaponProfiles.filter((weapon) => weapon.isRanged);
  const meleeWeapons = weaponProfiles.filter((weapon) => !weapon.isRanged);

  // 現ユニットに合流できる Leader ユニット一覧（重複除去）
  const leaderUnitsForMe = leaderAbilityRefs
    .map((r) => r.unit as SynergyCandidate)
    .filter((u, i, arr) => arr.findIndex((x) => x.id === u.id) === i);
  const leaderUnitIdSet = new Set(leaderUnitsForMe.map((u) => u.id));

  // 全候補をマージ（Leader関連を優先、重複除去）
  const seen = new Set<string>([unit.id]);
  const allCandidates: SynergyCandidate[] = [];
  for (const u of [
    ...(leaderTargetUnits as SynergyCandidate[]),  // 合流先（最優先）
    ...leaderUnitsForMe,                            // 合流できるLeader
    ...(roleCandidates as SynergyCandidate[]),       // ロール補完
  ]) {
    if (!seen.has(u.id)) {
      seen.add(u.id);
      allCandidates.push(u);
    }
  }

  const synergyUnits = allCandidates
    .map((candidate) => {
      const candidateCategories = candidate.categories.map((c) => c.name);
      const candidateRole = candidate.role as UnitRole;
      let score = 0;

      // Leader アビリティによる合流シナジー（最優先）
      const iLeadCandidate = myLeaderTargetNamesLower.has(candidate.name.toLowerCase());
      const candidateLeadsMe = leaderUnitIdSet.has(candidate.id);
      if (iLeadCandidate) score += 10;
      if (candidateLeadsMe) score += 10;

      // ロール直接シナジー
      if (thisRole === "HQ" && (candidateRole === "Battleline" || candidateRole === "Heavy")) score += 5;
      if (thisRole === "Battleline" && (candidateRole === "HQ" || candidateRole === "Transport")) score += 5;
      if (thisRole === "Transport" && (candidateRole === "Battleline" || candidateRole === "Other")) score += 5;
      if (thisRole === "Heavy" && candidateRole === "HQ") score += 5;
      if (thisRole === "Other" && candidateRole === "HQ") score += 4;
      if (thisRole === "Heavy" && candidateRole === "Battleline") score += 2;

      // キーワードシナジー
      if (hasKeyword(categoryNames, ["wraith"]) && hasKeyword(candidateCategories, ["wraith", "psyker"])) score += 3;
      if (hasKeyword(categoryNames, ["infantry"]) && hasKeyword(candidateCategories, ["transport"])) score += 3;
      if (hasKeyword(candidateCategories, ["fly", "mounted", "jump", "jetbike"])) score += 1;

      return {
        slug: candidate.slug,
        name: candidate.name,
        nameJa: candidate.nameJa,
        score,
        reason: synergyReasonForPair(thisRole, categoryNames, candidateRole, candidateCategories, { iLeadCandidate, candidateLeadsMe }),
      };
    })
    .filter((u) => u.score > 0)
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

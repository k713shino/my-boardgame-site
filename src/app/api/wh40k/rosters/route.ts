import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

type WeaponSelectionInput = {
  groupId: string;
  groupName: string;
  selectedNames: string[];
  pointsDelta: number;
};

type CreateRosterUnitInput = {
  unitId?: unknown;
  pts?: unknown;
  weaponSelections?: unknown;
};

type CreateRosterBody = {
  name?: unknown;
  faction?: unknown;
  detachment?: unknown;
  pointsLimit?: unknown;
  isPublic?: unknown;
  units?: unknown;
};

/** DB上の全公開ロスターを返す */
export async function GET() {
  try {
    const rosters = await prisma.roster.findMany({
      where: { isPublic: true } as { isPublic: boolean },
      select: {
        id: true,
        title: true,
        factionId: true,
        faction: { select: { name: true, nameJa: true } },
        detachment: true,
        pointsLimit: true,
        totalPoints: true,
        updatedAt: true,
        rosterUnits: {
          select: {
            points: true,
            unit: { select: { role: true } },
          },
        },
      },
      orderBy: { updatedAt: "desc" },
    });

    return NextResponse.json({
      rosters: rosters.map((r) => ({
        id: r.id,
        name: r.title,
        faction: r.factionId,
        factionName: (r.faction as { nameJa?: string | null; name: string }).nameJa ?? (r.faction as { name: string }).name,
        detachment: (r as { detachment?: string | null }).detachment ?? undefined,
        pointsLimit: r.pointsLimit,
        savedAt: r.updatedAt.toISOString(),
        units: r.rosterUnits.map((u) => ({
          entryId: "",
          unitId: "",
          name: "",
          nameJa: null,
          role: u.unit.role,
          pts: u.points,
          weaponSelections: [],
        })),
      })),
    });
  } catch {
    return NextResponse.json({ rosters: [], ids: [] });
  }
}

export async function POST(req: Request) {
  const body = (await req.json().catch(() => null)) as CreateRosterBody | null;

  if (!body || typeof body !== "object") {
    return NextResponse.json({ error: "invalid_body" }, { status: 400 });
  }

  const title = typeof body.name === "string" && body.name.trim() ? body.name.trim() : "Unnamed Roster";
  const factionId = typeof body.faction === "string" ? body.faction : "";
  const detachment = typeof body.detachment === "string" && body.detachment.trim() ? body.detachment.trim() : null;
  const pointsLimit = typeof body.pointsLimit === "number" ? body.pointsLimit : Number(body.pointsLimit);
  const rawUnits = Array.isArray(body.units) ? body.units : [];

  const units = rawUnits
    .map((entry) => {
      const unit = entry as CreateRosterUnitInput;
      const rawWeapons = Array.isArray(unit.weaponSelections) ? unit.weaponSelections : [];
      const weaponSelections: WeaponSelectionInput[] = rawWeapons
        .filter(
          (ws): ws is WeaponSelectionInput =>
            ws !== null &&
            typeof ws === "object" &&
            typeof ws.groupId === "string" &&
            typeof ws.groupName === "string" &&
            Array.isArray(ws.selectedNames) &&
            typeof ws.pointsDelta === "number"
        );
      return {
        unitId: typeof unit.unitId === "string" ? unit.unitId : "",
        points: typeof unit.pts === "number" ? unit.pts : Number(unit.pts),
        weaponSelections,
      };
    })
    .filter((entry) => entry.unitId && Number.isFinite(entry.points));

  if (!factionId || !Number.isFinite(pointsLimit) || units.length === 0) {
    return NextResponse.json({ error: "invalid_payload" }, { status: 400 });
  }

  const faction = await prisma.faction.findUnique({
    where: { id: factionId },
    select: { id: true },
  });

  if (!faction) {
    return NextResponse.json({ error: "faction_not_found" }, { status: 404 });
  }

  const totalPoints = units.reduce((sum, unit) => sum + unit.points, 0);

  // weaponSelectionsJson カラムが存在しない場合（db push 未実行時）の fallback
  const tryCreate = async (withWeapons: boolean) =>
    prisma.roster.create({
      data: {
        title,
        factionId,
        detachment,
        pointsLimit,
        totalPoints,
        isPublic: true,
        rosterUnits: {
          create: units.map((unit) => ({
            unitId: unit.unitId,
            points: unit.points,
            ...(withWeapons ? { weaponSelectionsJson: unit.weaponSelections } : {}),
          })),
        },
      } as Parameters<typeof prisma.roster.create>[0]["data"],
      select: { id: true, isPublic: true },
    });

  try {
    let roster;
    try {
      roster = await tryCreate(true);
    } catch {
      // カラムが未追加の場合は weaponSelections なしで再試行
      roster = await tryCreate(false);
    }

    return NextResponse.json({
      id: roster.id,
      isPublic: roster.isPublic,
      detailUrl: `/wh40k/rosters/${roster.id}`,
    });
  } catch (error) {
    console.error("Failed to create roster", error);
    return NextResponse.json({ error: "failed_to_create_roster" }, { status: 500 });
  }
}

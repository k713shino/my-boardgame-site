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
  pointsLimit?: unknown;
  isPublic?: unknown;
  units?: unknown;
};

/** DB上の全公開ロスターIDを返す（クライアント側のクリーンアップ用） */
export async function GET() {
  try {
    const rosters = await prisma.roster.findMany({
      where: { isPublic: true } as { isPublic: boolean },
      select: { id: true },
    });
    return NextResponse.json({ ids: rosters.map((r) => r.id) });
  } catch {
    // isPublic 未対応環境では空配列を返す
    return NextResponse.json({ ids: [] });
  }
}

export async function POST(req: Request) {
  const body = (await req.json().catch(() => null)) as CreateRosterBody | null;

  if (!body || typeof body !== "object") {
    return NextResponse.json({ error: "invalid_body" }, { status: 400 });
  }

  const title = typeof body.name === "string" && body.name.trim() ? body.name.trim() : "Unnamed Roster";
  const factionId = typeof body.faction === "string" ? body.faction : "";
  const pointsLimit = typeof body.pointsLimit === "number" ? body.pointsLimit : Number(body.pointsLimit);
  const isPublic = body.isPublic === true;
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
        pointsLimit,
        totalPoints,
        isPublic,
        rosterUnits: {
          create: units.map((unit) => ({
            unitId: unit.unitId,
            points: unit.points,
            ...(withWeapons ? { weaponSelectionsJson: unit.weaponSelections } : {}),
          })),
        },
      },
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

import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

type CreateRosterUnitInput = {
  unitId?: unknown;
  pts?: unknown;
};

type CreateRosterBody = {
  name?: unknown;
  faction?: unknown;
  pointsLimit?: unknown;
  isPublic?: unknown;
  units?: unknown;
};

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
      return {
        unitId: typeof unit.unitId === "string" ? unit.unitId : "",
        points: typeof unit.pts === "number" ? unit.pts : Number(unit.pts),
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

  try {
    const roster = await prisma.roster.create({
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
          })),
        },
      },
      select: { id: true, isPublic: true },
    });

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

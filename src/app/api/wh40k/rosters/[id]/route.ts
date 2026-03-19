import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import type { WeaponSelection } from "@/app/wh40k/builder/BuilderClient";

export async function GET(
  _req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;

  if (!id) {
    return NextResponse.json({ error: "missing_id" }, { status: 400 });
  }

  try {
    const roster = await prisma.roster.findUnique({
      where: { id },
      include: {
        faction: true,
        rosterUnits: {
          include: {
            unit: {
              select: {
                id: true,
                name: true,
                nameJa: true,
                role: true,
                slug: true,
              },
            },
          },
          orderBy: { id: "asc" },
        },
      },
    });

    if (!roster) {
      return NextResponse.json({ error: "not_found" }, { status: 404 });
    }

    return NextResponse.json({
      id: roster.id,
      name: roster.title,
      faction: roster.factionId,
      factionName: roster.faction.nameJa ?? roster.faction.name,
      detachment: (roster as { detachment?: string | null }).detachment ?? undefined,
      pointsLimit: roster.pointsLimit,
      savedAt: roster.updatedAt.toISOString(),
      isPublic: roster.isPublic,
      units: roster.rosterUnits.map((entry) => ({
        entryId: entry.id,
        unitId: entry.unitId,
        slug: entry.unit.slug,
        name: entry.unit.name,
        nameJa: entry.unit.nameJa,
        role: entry.unit.role,
        pts: entry.points,
        weaponSelections: Array.isArray(entry.weaponSelectionsJson)
          ? (entry.weaponSelectionsJson as unknown as WeaponSelection[])
          : [],
      })),
    });
  } catch {
    return NextResponse.json({ error: "internal_error" }, { status: 500 });
  }
}

export async function DELETE(
  _req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;

  if (!id) {
    return NextResponse.json({ error: "missing_id" }, { status: 400 });
  }

  try {
    await prisma.roster.delete({ where: { id } });
    return NextResponse.json({ ok: true });
  } catch {
    // レコードが存在しない場合も正常扱い（既に削除済み）
    return NextResponse.json({ ok: true });
  }
}

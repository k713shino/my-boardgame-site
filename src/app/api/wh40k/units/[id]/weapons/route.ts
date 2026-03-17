import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(
  _req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;

  const groups = await prisma.unitWeaponGroup.findMany({
    where: { unitId: id },
    include: {
      options: {
        orderBy: { sortOrder: "asc" },
      },
    },
    orderBy: { sortOrder: "asc" },
  });

  return NextResponse.json(groups);
}

/**
 * POST /api/wh40k/units/[id]/weapons
 * 新しい武器グループを追加する（管理用）
 * Body: { name, groupType, minChoices, maxChoices, options: [{ name, pointsDelta }] }
 */
export async function POST(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;

  const body = await req.json();
  const { name, groupType = "WEAPON", minChoices = 1, maxChoices = 1, options = [] } = body;

  if (!name) {
    return NextResponse.json({ error: "name is required" }, { status: 400 });
  }

  // 現在の最大sortOrderを取得
  const last = await prisma.unitWeaponGroup.findFirst({
    where: { unitId: id },
    orderBy: { sortOrder: "desc" },
    select: { sortOrder: true },
  });
  const nextSort = (last?.sortOrder ?? -1) + 1;

  const group = await prisma.unitWeaponGroup.create({
    data: {
      unitId: id,
      name,
      groupType,
      minChoices,
      maxChoices,
      sortOrder: nextSort,
      options: {
        create: options.map((opt: { name: string; pointsDelta?: number }, i: number) => ({
          name: opt.name,
          pointsDelta: opt.pointsDelta ?? 0,
          sortOrder: i,
        })),
      },
    },
    include: { options: true },
  });

  return NextResponse.json(group, { status: 201 });
}

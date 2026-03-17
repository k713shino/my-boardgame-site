import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

/**
 * PUT /api/wh40k/units/[id]/weapons/[groupId]
 * 既存グループを更新（groupType, name, minChoices, maxChoices, options）
 */
export async function PUT(
  req: Request,
  { params }: { params: Promise<{ id: string; groupId: string }> }
) {
  const { id, groupId } = await params;

  const body = await req.json();
  const { name, groupType, minChoices, maxChoices, options } = body;

  const existing = await prisma.unitWeaponGroup.findFirst({
    where: { id: groupId, unitId: id },
  });
  if (!existing) {
    return NextResponse.json({ error: "not found" }, { status: 404 });
  }

  // グループ本体を更新
  const updated = await prisma.unitWeaponGroup.update({
    where: { id: groupId },
    data: {
      ...(name !== undefined && { name }),
      ...(groupType !== undefined && { groupType }),
      ...(minChoices !== undefined && { minChoices }),
      ...(maxChoices !== undefined && { maxChoices }),
    },
  });

  // options が指定された場合は全置換
  if (Array.isArray(options)) {
    await prisma.unitWeaponOption.deleteMany({ where: { groupId } });
    await prisma.unitWeaponOption.createMany({
      data: options.map((opt: { name: string; pointsDelta?: number }, i: number) => ({
        groupId,
        name: opt.name,
        pointsDelta: opt.pointsDelta ?? 0,
        sortOrder: i,
      })),
    });
  }

  const result = await prisma.unitWeaponGroup.findUnique({
    where: { id: groupId },
    include: { options: { orderBy: { sortOrder: "asc" } } },
  });

  return NextResponse.json(result);
}

/**
 * DELETE /api/wh40k/units/[id]/weapons/[groupId]
 * グループを削除
 */
export async function DELETE(
  _req: Request,
  { params }: { params: Promise<{ id: string; groupId: string }> }
) {
  const { id, groupId } = await params;

  const existing = await prisma.unitWeaponGroup.findFirst({
    where: { id: groupId, unitId: id },
  });
  if (!existing) {
    return NextResponse.json({ error: "not found" }, { status: 404 });
  }

  await prisma.unitWeaponGroup.delete({ where: { id: groupId } });

  return NextResponse.json({ ok: true });
}

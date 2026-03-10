import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(
  _req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;

  const units = await prisma.unit.findMany({
    where: { factionId: id },
    include: { categories: { select: { name: true } } },
    orderBy: [{ role: "asc" }, { name: "asc" }],
  });

  const data = units.map((u) => ({
    id: u.id,
    unitCode: u.unitCode,
    name: u.name,
    nameJa: u.nameJa,
    slug: u.slug,
    role: u.role,
    basePoints: u.basePoints,
    categories: u.categories.map((c) => c.name),
  }));

  return NextResponse.json(data);
}

import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(
  _req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  if (!id) return NextResponse.json({ error: "missing_id" }, { status: 400 });

  const link = await prisma.shareLink.findUnique({ where: { id } });
  if (!link) return NextResponse.json({ error: "not_found" }, { status: 404 });

  return NextResponse.json({ data: link.data });
}

import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

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

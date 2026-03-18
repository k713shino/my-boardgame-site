import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

// ロスターJSONを受け取り、短いIDを返す
export async function POST(req: Request) {
  let data: string;
  try {
    const body = await req.json();
    if (typeof body?.data !== "string" || body.data.length === 0) {
      return NextResponse.json({ error: "invalid_body" }, { status: 400 });
    }
    data = body.data;
  } catch {
    return NextResponse.json({ error: "invalid_json" }, { status: 400 });
  }

  // 10MB 上限チェック
  if (data.length > 10 * 1024 * 1024) {
    return NextResponse.json({ error: "too_large" }, { status: 413 });
  }

  const link = await prisma.shareLink.create({ data: { data } });
  return NextResponse.json({ id: link.id });
}

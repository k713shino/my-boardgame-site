import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const endpoint = process.env.GAS_ENDPOINT;
    if (!endpoint) {
      return NextResponse.json({ ok: false, error: "GAS_ENDPOINT not set" }, { status: 500 });
    }

    // 簡易トークン（任意）：GAS側で検証しても良い
    const payload = { ...body, token: process.env.SECRET_TOKEN || "" };

    const res = await fetch(endpoint, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
      // 追加ヘッダでUAやIPを渡したければここに
    });

    const json = await res.json();
    return NextResponse.json(json, { status: res.ok ? 200 : 500 });
  } catch (err: unknown) {
    return NextResponse.json({ ok: false, error: String(err) }, { status: 500 });
  }
}

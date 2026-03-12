import { cookies } from "next/headers";
import { NextResponse } from "next/server";

export async function GET() {
  const cookieStore = await cookies();
  const authCookie = cookieStore.get("wh40k_auth");
  return NextResponse.json({ authenticated: Boolean(authCookie?.value) });
}

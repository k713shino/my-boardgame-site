import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

const AUTH_COOKIE = "wh40k_auth";

// /wh40k/full/* と /wh40k/units/* は認証必須
// 認証ページ自体 (/wh40k/full/auth, /wh40k/auth) は除外
const FULL_AUTH_PATH = "/wh40k/full/auth";
const LEGACY_AUTH_PATH = "/wh40k/auth";

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // 認証ページは制限しない（noindex のみ付与）
  if (pathname.startsWith(FULL_AUTH_PATH) || pathname.startsWith(LEGACY_AUTH_PATH)) {
    const response = NextResponse.next();
    response.headers.set("X-Robots-Tag", "noindex, nofollow");
    return response;
  }

  const isRestricted =
    pathname.startsWith("/wh40k/full") || pathname.startsWith("/wh40k/units");

  if (!isRestricted) return NextResponse.next();

  // Cookie 確認
  const authCookie = request.cookies.get(AUTH_COOKIE);
  if (!authCookie?.value) {
    const url = request.nextUrl.clone();
    url.pathname = FULL_AUTH_PATH;
    url.searchParams.set("from", pathname);
    return NextResponse.redirect(url);
  }

  // 認証済み: noindex を付与して通過
  const response = NextResponse.next();
  response.headers.set("X-Robots-Tag", "noindex, nofollow");
  return response;
}

export const config = {
  matcher: ["/wh40k/:path*"],
};

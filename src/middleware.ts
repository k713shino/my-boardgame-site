import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

// 認証が必要なパスのプレフィックス
const RESTRICTED_PREFIXES = [
  "/wh40k/units",
  // 将来追加予定
  "/wh40k/reference",
  "/wh40k/datasheets",
];

const AUTH_COOKIE = "wh40k_auth";
const AUTH_PATH = "/wh40k/auth";

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // 認証ページ自体は制限しない（無限リダイレクト防止）
  // noindex ヘッダーのみ付与
  if (pathname.startsWith(AUTH_PATH)) {
    const response = NextResponse.next();
    response.headers.set("X-Robots-Tag", "noindex, nofollow");
    return response;
  }

  const isRestricted = RESTRICTED_PREFIXES.some((prefix) =>
    pathname.startsWith(prefix)
  );
  if (!isRestricted) return NextResponse.next();

  // Cookie 確認
  const authCookie = request.cookies.get(AUTH_COOKIE);
  if (!authCookie?.value) {
    const url = request.nextUrl.clone();
    url.pathname = AUTH_PATH;
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

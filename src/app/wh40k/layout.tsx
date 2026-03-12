import { cookies } from "next/headers";
import { LogoutButton } from "./auth/LogoutButton";

// WH40K 全ページ共通レイアウト
// 認証済みのときコンテンツ最上部にステータスバーを表示する
export default async function WH40KLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const cookieStore = await cookies();
  const isAuthenticated = cookieStore.has("wh40k_auth");

  return (
    <>
      {isAuthenticated && (
        <div
          className="mb-4 flex items-center justify-between gap-4 rounded-xl px-4 py-2.5"
          style={{
            background: "var(--surface-primary)",
            border: "1px solid var(--surface-border)",
          }}
        >
          <span
            className="flex items-center gap-1.5 text-[0.65rem] font-semibold uppercase tracking-[0.2em]"
            style={{ color: "var(--fg-muted)" }}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 16 16"
              fill="currentColor"
              className="h-3 w-3 opacity-70"
              aria-hidden
            >
              <path
                fillRule="evenodd"
                d="M8 1a3.5 3.5 0 0 0-3.5 3.5V7A1.5 1.5 0 0 0 3 8.5v5A1.5 1.5 0 0 0 4.5 15h7a1.5 1.5 0 0 0 1.5-1.5v-5A1.5 1.5 0 0 0 11 7V4.5A3.5 3.5 0 0 0 8 1Zm2 6V4.5a2 2 0 1 0-4 0V7h4Z"
                clipRule="evenodd"
              />
            </svg>
            コミュニティ限定
          </span>
          <LogoutButton />
        </div>
      )}
      {children}
    </>
  );
}

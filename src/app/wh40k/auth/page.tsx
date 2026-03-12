import type { Metadata } from "next";
import { cookies } from "next/headers";
import Link from "next/link";
import { AuthForm } from "./AuthForm";
import { logout } from "./actions";

export const metadata: Metadata = {
  title: "コミュニティ認証 | WH40K",
  robots: { index: false, follow: false },
};

export default async function AuthPage({
  searchParams,
}: {
  searchParams: Promise<{ from?: string }>;
}) {
  const { from } = await searchParams;
  const cookieStore = await cookies();
  const isAuthenticated = cookieStore.has("wh40k_auth");

  return (
    <div className="mx-auto max-w-md space-y-8 px-4 py-16">
      {/* ヘッダー */}
      <div className="space-y-2">
        <span className="text-[0.65rem] font-semibold uppercase tracking-[0.4em] text-rose-500">
          Warhammer 40,000
        </span>
        <h1 className="text-2xl font-black uppercase tracking-tight">
          Community Access
        </h1>
        <p className="text-xs text-muted">
          コミュニティメンバー向けリファレンスページです。
        </p>
      </div>

      {/* フォーム or ログアウト */}
      {isAuthenticated ? (
        <div className="space-y-4 rounded-2xl border border-slate-200/60 p-6 dark:border-slate-700/60">
          <p className="text-sm font-medium">認証済みです。</p>
          <div className="flex gap-3">
            <Link
              href={from || "/wh40k"}
              className="flex-1 rounded-xl border border-rose-400/40 bg-rose-500/5 px-4 py-2.5 text-center text-sm font-bold text-rose-500 transition hover:bg-rose-500/10"
            >
              ページに戻る
            </Link>
            <form action={logout}>
              <button
                type="submit"
                className="rounded-xl border border-slate-300/60 px-4 py-2.5 text-sm font-medium transition hover:border-rose-400/60 hover:text-rose-500 dark:border-slate-600/60"
              >
                ログアウト
              </button>
            </form>
          </div>
        </div>
      ) : (
        <div className="rounded-2xl border border-slate-200/60 p-6 dark:border-slate-700/60">
          <AuthForm from={from} />
        </div>
      )}

      {/* コミュニティ注意書き */}
      <p className="rounded-xl border border-amber-300/40 bg-amber-50/50 px-4 py-3 text-[0.65rem] leading-relaxed text-amber-700 dark:border-amber-500/20 dark:bg-amber-500/5 dark:text-amber-400">
        このページはコミュニティ内参考用です。
        <br />
        問題があれば修正または削除します。
      </p>
    </div>
  );
}

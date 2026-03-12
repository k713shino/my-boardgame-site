"use client";

import { useActionState } from "react";
import { login } from "./actions";
import type { LoginState } from "./actions";

export function AuthForm({ from }: { from?: string }) {
  const [state, formAction, isPending] = useActionState<LoginState, FormData>(
    login,
    null
  );

  return (
    <form action={formAction} className="space-y-4">
      <input type="hidden" name="from" value={from || "/wh40k"} />

      <div className="space-y-2">
        <label
          htmlFor="password"
          className="block text-xs font-medium text-muted"
        >
          パスワード
        </label>
        <input
          id="password"
          name="password"
          type="password"
          required
          autoFocus
          autoComplete="current-password"
          className="w-full rounded-xl border border-slate-300/60 bg-transparent px-4 py-2.5 text-sm outline-none transition focus:border-rose-400/60 dark:border-slate-600/60"
          placeholder="コミュニティパスワードを入力"
        />
      </div>

      {state?.error && (
        <p className="rounded-lg border border-red-300/40 bg-red-50/50 px-3 py-2 text-xs text-red-600 dark:border-red-500/20 dark:bg-red-500/5 dark:text-red-400">
          {state.error}
        </p>
      )}

      <button
        type="submit"
        disabled={isPending}
        className="w-full rounded-xl bg-rose-500 px-4 py-2.5 text-sm font-bold text-white transition hover:bg-rose-600 disabled:opacity-60"
      >
        {isPending ? "認証中..." : "入室する"}
      </button>
    </form>
  );
}

"use client";

import { logout } from "./actions";

export function LogoutButton() {
  return (
    <form action={logout}>
      <button
        type="submit"
        className="rounded-full border px-3 py-1 text-[0.65rem] font-semibold uppercase tracking-[0.15em] transition"
        style={{
          borderColor: "var(--surface-border)",
          color: "var(--fg-muted)",
        }}
        onMouseOver={(e) => {
          e.currentTarget.style.color = "var(--accent-primary)";
          e.currentTarget.style.borderColor = "var(--accent-primary)";
        }}
        onMouseOut={(e) => {
          e.currentTarget.style.color = "var(--fg-muted)";
          e.currentTarget.style.borderColor = "var(--surface-border)";
        }}
      >
        ログアウト
      </button>
    </form>
  );
}

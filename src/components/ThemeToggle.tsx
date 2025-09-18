"use client";

import { useEffect, useState } from "react";

type Theme = "light" | "dark";

const storageKey = "theme";

function applyTheme(theme: Theme) {
  const root = document.documentElement;
  root.classList.remove("light", "dark");
  root.classList.add(theme);
  try {
    localStorage.setItem(storageKey, theme);
  } catch {
    // ignore write errors (private mode, etc.)
  }
}

export function ThemeToggle() {
  const [theme, setTheme] = useState<Theme>("light");
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    const root = document.documentElement;
    const initial: Theme = root.classList.contains("dark") ? "dark" : "light";
    setTheme(initial);
    setMounted(true);
  }, []);

  const handleToggle = () => {
    const next: Theme = theme === "light" ? "dark" : "light";
    setTheme(next);
    applyTheme(next);
  };

  const icon = theme === "dark" ? "🌙" : "☀️";
  const label = theme === "dark" ? "ダークモード" : "ライトモード";
  const ariaLabel = mounted ? `${label}に切り替え` : "ライトモードに切り替え";

  return (
    <button
      type="button"
      onClick={handleToggle}
      className="relative flex items-center gap-2 rounded-full border border-slate-900/10 bg-slate-900 px-4 py-2 text-[0.7rem] font-semibold uppercase tracking-[0.3em] text-slate-100 shadow-lg transition hover:-translate-y-0.5 hover:bg-slate-800 hover:shadow-xl dark:border-white/10 dark:bg-slate-100 dark:text-slate-900 dark:hover:bg-white"
      aria-label={ariaLabel}
    >
      <span className="text-lg" aria-hidden="true">
        {mounted ? icon : "☀️"}
      </span>
      <span className="hidden sm:inline">{mounted ? label : "ライト"}</span>
    </button>
  );
}

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
      className="relative flex items-center gap-2 rounded-full border border-slate-300/60 bg-white/80 px-3 py-1.5 text-sm font-medium text-slate-700 shadow-sm transition hover:-translate-y-0.5 hover:shadow-md dark:border-slate-700/70 dark:bg-slate-900/70 dark:text-slate-100"
      aria-label={ariaLabel}
    >
      <span className="text-base" aria-hidden="true">
        {mounted ? icon : "☀️"}
      </span>
      <span className="hidden sm:inline">{mounted ? label : "ライトモード"}</span>
    </button>
  );
}

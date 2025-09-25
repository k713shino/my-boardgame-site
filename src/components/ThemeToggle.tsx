"use client";

import { useEffect, useState } from "react";

type Theme = "light" | "dark";

const storageKey = "theme";

function applyTheme(theme: Theme) {
  const root = document.documentElement;
  root.classList.remove("light", "dark");
  root.classList.add(theme);
  root.dataset.theme = theme;
  try {
    localStorage.setItem(storageKey, theme);
  } catch {
    // ignore write errors (private mode, etc.)
  }
  try {
    const url = new URL(window.location.href);
    url.searchParams.set("theme", theme);
    window.history.replaceState(null, "", url.toString());
  } catch {
    // ignore URL update issues (e.g. file protocol)
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
      className="theme-toggle relative flex items-center gap-2 rounded-full px-4 py-2 text-[0.7rem] font-semibold uppercase tracking-[0.3em] shadow-lg transition-transform duration-200 hover:-translate-y-0.5"
      aria-label={ariaLabel}
    >
      <span className="text-lg" aria-hidden="true">
        {mounted ? icon : "☀️"}
      </span>
      <span className="hidden sm:inline">{mounted ? label : "ライト"}</span>
    </button>
  );
}

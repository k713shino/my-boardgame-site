"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { ThemeToggle } from "./ThemeToggle";

type NavLink = {
  href: string;
  label: string;
};

const NAV_LINKS: NavLink[] = [
  { href: "/games", label: "Games" },
  { href: "/plays", label: "Plays" },
  { href: "/posts", label: "Blog" },
  { href: "/events", label: "Events" },
  { href: "/survey", label: "Survey" },
];

export function SiteHeader() {
  const pathname = usePathname() || "/";
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    setMenuOpen(false);
  }, [pathname]);

  const navItems = useMemo(() => {
    return NAV_LINKS.map(({ href, label }) => {
      const active = pathname === href || pathname.startsWith(href + "/");
      const linkClasses = [
        "nav-link",
        "rounded-full",
        "px-3",
        "py-2",
        "text-xs",
        "font-semibold",
        "uppercase",
        "tracking-[0.2em]",
        "transition",
        "hover:-translate-y-0.5",
        "hover:bg-rose-500/10",
        "sm:px-4",
      ];
      if (active) {
        linkClasses.push("bg-rose-500/15", "text-rose-500", "dark:bg-rose-500/15");
      }
      return (
        <Link key={href} href={href} className={linkClasses.join(" ")}>
          {label}
        </Link>
      );
    });
  }, [pathname]);

  const navClassName = [
    "mt-4",
    "flex",
    "flex-col",
    "items-center",
    "gap-2",
    "border-t",
    "border-slate-200/60",
    "pt-4",
    "text-center",
    "dark:border-slate-700/60",
    "sm:mt-6",
    "sm:flex-row",
    "sm:flex-wrap",
    "sm:items-center",
    "sm:justify-center",
    "sm:border-none",
    "sm:pt-0",
    menuOpen ? "flex" : "hidden sm:flex",
  ].join(" ");

  return (
    <header className="surface-card w-full max-w-4xl rounded-[24px] px-4 py-5 sm:px-6 sm:py-6">
      <div className="flex w-full flex-col gap-4">
        <div className="relative flex w-full items-center justify-center">
          <Link
            href="/"
            className="brand-link flex flex-col items-center gap-2 text-center"
          >
            <span className="brand-subtitle text-[0.6rem] font-semibold uppercase tracking-[0.28em]">
              Boardgame culture journal
            </span>
            <span className="flex items-center justify-center gap-3 text-2xl font-black uppercase tracking-[0.16em] sm:text-3xl sm:tracking-[0.2em]">
              <Image
                src="/images/icon.svg"
                alt=""
                width={48}
                height={48}
                className="h-9 w-9 text-rose-500 sm:h-10 sm:w-10"
                aria-hidden
                priority
              />
              <span>Boardgame Lab</span>
              <Image
                src="/images/icon.svg"
                alt=""
                width={48}
                height={48}
                className="hidden h-9 w-9 text-rose-500 sm:block"
                aria-hidden
                priority
              />
            </span>
          </Link>
          <div className="absolute right-0 flex items-center gap-3">
            <ThemeToggle />
            <button
              type="button"
              onClick={() => setMenuOpen((prev) => !prev)}
              className="flex h-10 w-10 items-center justify-center rounded-full border border-slate-300/70 bg-white/90 text-lg text-slate-600 shadow-sm transition hover:border-rose-400 hover:text-rose-500 dark:border-slate-600/70 dark:bg-slate-900/70 dark:text-slate-200 sm:hidden"
              aria-expanded={menuOpen ? "true" : "false"}
              aria-controls="global-nav"
              aria-label="メニュー"
            >
              ☰
            </button>
          </div>
        </div>
      </div>
      <nav id="global-nav" className={navClassName}>
        {navItems}
      </nav>
    </header>
  );
}
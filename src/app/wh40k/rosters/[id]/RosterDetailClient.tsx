"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import type { SavedRoster } from "../../builder/BuilderClient";
import {
  groupByRole,
  resolveUnitDetailUrl,
  RosterMetaBar,
  RosterUnitsSection,
  ROSTER_ROLES,
} from "../../components/RosterViewParts";
import { trackRosterShare } from "@/lib/gtag";

export function RosterDetailClient({
  id,
  initialRoster = null,
  showDatasheetLinks = false,
  builderPath = "/wh40k/builder",
  shareBasePath = "/wh40k/rosters/share",
  authPath = "/wh40k/auth",
}: {
  id: string;
  initialRoster?: SavedRoster | null;
  showDatasheetLinks?: boolean;
  builderPath?: string;
  shareBasePath?: string;
  authPath?: string;
}) {
  const router = useRouter();
  const [roster, setRoster] = useState<SavedRoster | null>(initialRoster);
  const [loaded, setLoaded] = useState(Boolean(initialRoster));
  const [notFound, setNotFound] = useState(false);

  useEffect(() => {
    if (initialRoster) {
      // DBから取得済み（武器選択含む）
      setRoster(initialRoster);
      setLoaded(true);
      return;
    }

    // localStorageから読み込み
    const raw = localStorage.getItem("wh40k_rosters");
    if (raw) {
      try {
        const rosters: SavedRoster[] = JSON.parse(raw);
        const found = rosters.find((r) => r.id === id);
        if (found) {
          if (authPath && found.isPublic === false) {
            // 非公開ロスターは認証Cookieをサーバー側で検証
            fetch("/api/wh40k/auth/check")
              .then((res) => res.json())
              .then(({ authenticated }: { authenticated: boolean }) => {
                if (!authenticated) {
                  router.replace(`${authPath}?from=${window.location.pathname}`);
                } else {
                  setRoster(found);
                  setLoaded(true);
                }
              })
              .catch(() => {
                // 通信エラー時は念のため認証ページへ
                router.replace(`${authPath}?from=${window.location.pathname}`);
              });
            return;
          }
          setRoster(found);
          setLoaded(true);
          return;
        }
      } catch {
        // no-op
      }
    }

    setNotFound(true);
    setLoaded(true);
  }, [id, initialRoster, router]);

  const shareRoster = () => {
    if (!roster) return;
    const data = {
      name: roster.name,
      faction: roster.faction,
      detachment: roster.detachment,
      pointsLimit: roster.pointsLimit,
      units: roster.units,
    };
    const encoded = btoa(encodeURIComponent(JSON.stringify(data)));
    const url = `${window.location.origin}${shareBasePath}?d=${encoded}`;
    navigator.clipboard
      ?.writeText(url)
      .then(() => {
        trackRosterShare({ roster_id: roster.id, faction: roster.faction });
        alert("✅ 共有URLをクリップボードにコピーしました");
      })
      .catch(() => prompt("共有URL:", url));
  };

  const copyRosterText = () => {
    if (!roster) return;
    const roleOrder = ["HQ", "Battleline", "Transport", "Other", "Heavy"] as const;
    const roleLabel: Record<string, string> = {
      HQ: "Character", Battleline: "Battleline",
      Transport: "Dedicated Transport", Other: "Other", Heavy: "Heavy",
    };
    const total = roster.units.reduce((s, u) => s + u.pts, 0);
    const lines: string[] = [];
    lines.push(`【${roster.name}】`);
    lines.push(`${roster.factionName}${roster.detachment ? ` / ${roster.detachment}` : ""} | ${roster.pointsLimit}pt制限`);
    lines.push("");
    for (const role of roleOrder) {
      const units = roster.units.filter((u) => u.role === role);
      if (units.length === 0) continue;
      lines.push(`■ ${roleLabel[role]}`);
      for (const u of units) {
        lines.push(`  ・${u.nameJa ?? u.name} (${u.pts}pt)`);
        for (const ws of u.weaponSelections ?? []) {
          const delta = ws.pointsDelta !== 0 ? ` (${ws.pointsDelta > 0 ? "+" : ""}${ws.pointsDelta}pt)` : "";
          lines.push(`    └ ${ws.groupName}: ${ws.selectedNames.join(" / ")}${delta}`);
        }
      }
      lines.push("");
    }
    lines.push(`合計: ${total}pt / ${roster.pointsLimit}pt`);
    const text = lines.join("\n").trimEnd();
    navigator.clipboard
      ?.writeText(text)
      .then(() => alert("✅ ロスターをクリップボードにコピーしました"))
      .catch(() => prompt("ロスターテキスト:", text));
  };

  if (!loaded) {
    return <div className="py-20 text-center text-sm text-muted">読み込み中…</div>;
  }

  if (notFound || !roster) {
    return (
      <div className="mx-auto max-w-2xl px-4 py-20 text-center">
        <p className="text-4xl">⚔️</p>
        <p className="mt-4 text-sm text-muted">ロスターが見つかりません</p>
        <Link href="/wh40k/rosters" className="mt-4 inline-block text-xs text-rose-500 underline">
          ← ロスター一覧に戻る
        </Link>
      </div>
    );
  }

  const byRole = groupByRole(roster.units);
  const total = roster.units.reduce((sum, unit) => sum + unit.pts, 0);
  const summary = ROSTER_ROLES
    .map((role) => ({ role, count: byRole[role].length }))
    .filter((row) => row.count > 0);

  return (
    <div className="mx-auto max-w-3xl space-y-6 px-4 py-8 sm:py-10">
      <nav className="flex flex-wrap items-center gap-2 text-xs text-muted">
        <Link href="/wh40k" className="transition hover:text-rose-500">
          WH40K
        </Link>
        <span>/</span>
        <Link href="/wh40k/rosters" className="transition hover:text-rose-500">
          保存ロスター
        </Link>
        <span>/</span>
        <span className="text-[color:var(--fg-body)]">{roster.name}</span>
      </nav>

      <header className="surface-card rounded-2xl p-5 space-y-4 sm:p-6">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
          <div className="space-y-1">
            <p className="text-[0.62rem] font-semibold uppercase tracking-[0.25em] text-rose-500">保存ロスター</p>
            <div className="flex flex-wrap items-center gap-2">
              <h1 className="text-xl font-black sm:text-2xl">{roster.name}</h1>
            </div>
            <p className="text-[0.68rem] text-muted">
              {new Date(roster.savedAt).toLocaleDateString("ja-JP")} · {roster.factionName} · {roster.pointsLimit}pt
              {roster.detachment ? ` · ${roster.detachment}` : ""}
            </p>
          </div>

          <div className="grid grid-cols-2 gap-2 sm:w-auto sm:grid-cols-1">
            <Link
              href={`${builderPath}?edit=${roster.id}`}
              className="rounded-full border border-slate-300/60 px-4 py-2 text-center text-xs font-semibold transition hover:border-rose-400/60 dark:border-slate-600/60"
            >
              Builderで編集
            </Link>
            <button
              onClick={shareRoster}
              className="rounded-full bg-rose-500 px-4 py-2 text-xs font-bold text-white transition hover:bg-rose-400"
            >
              共有URLをコピー
            </button>
            <button
              onClick={copyRosterText}
              className="rounded-full border border-slate-300/60 px-4 py-2 text-xs font-semibold transition hover:border-sky-400/60 dark:border-slate-600/60"
            >
              📋 テキストコピー
            </button>
          </div>
        </div>

        <RosterMetaBar total={total} limit={roster.pointsLimit} summary={summary} />
      </header>

      <section className="space-y-2">
        <h2 className="text-[0.65rem] font-bold uppercase tracking-widest text-muted">Units</h2>
        <RosterUnitsSection
          byRole={byRole}
          resolveHref={showDatasheetLinks ? (entry) => resolveUnitDetailUrl(entry, roster.faction) : undefined}
        />
      </section>

      <p className="rounded-xl border border-amber-300/40 bg-amber-50/50 px-4 py-3 text-[0.65rem] leading-relaxed text-amber-700 dark:border-amber-500/20 dark:bg-amber-500/5 dark:text-amber-400">
        ⚠️ 大会使用前は必ず GW 公式 <strong>Munitorum Field Manual</strong> でポイントを確認してください。
      </p>
    </div>
  );
}

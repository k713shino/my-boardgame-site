"use client";

import { useEffect } from "react";
import { trackDatasheetOpen } from "@/lib/gtag";

export function DatasheetTracker({
  unitSlug,
  unitName,
  faction,
}: {
  unitSlug: string;
  unitName: string;
  faction: string;
}) {
  useEffect(() => {
    trackDatasheetOpen({ unit_slug: unitSlug, unit_name: unitName, faction });

    // localStorage にない公開ロスターをDBから削除（ユニットページ訪問時にも実行）
    try {
      const raw = localStorage.getItem("wh40k_rosters");
      const localRosters = raw ? JSON.parse(raw) : [];
      const localPublicIds = new Set(
        localRosters.filter((r: { isPublic?: boolean }) => r.isPublic).map((r: { id: string }) => r.id)
      );
      fetch("/api/wh40k/rosters")
        .then((res) => res.json())
        .then(({ ids }: { ids: string[] }) => {
          ids
            .filter((id) => !localPublicIds.has(id))
            .forEach((id) => {
              fetch(`/api/wh40k/rosters/${id}`, { method: "DELETE" }).catch(() => {});
            });
        })
        .catch(() => {});
    } catch {
      // localStorage が使えない環境ではスキップ
    }
  // unitSlug が変わる（別ユニットに移動する）ときのみ再実行
  }, [unitSlug, unitName, faction]);

  return null;
}

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
  }, [unitSlug, unitName, faction]);

  return null;
}

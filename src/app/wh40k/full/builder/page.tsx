import type { Metadata } from "next";
import { prisma } from "@/lib/prisma";
import { BuilderClient } from "../../builder/BuilderClient";
import type { FactionListItem } from "../../builder/BuilderClient";

export const metadata: Metadata = {
  title: "Army Builder | WH40K Full",
  robots: { index: false, follow: false },
};

export default async function FullBuilderPage({
  searchParams,
}: {
  searchParams: Promise<{ edit?: string; faction?: string; add?: string }>;
}) {
  const { edit, faction, add } = await searchParams;

  const factions = await prisma.faction.findMany({
    include: { _count: { select: { units: true } } },
    orderBy: [{ group: "asc" }, { name: "asc" }],
  });

  const factionList: FactionListItem[] = factions.map((f) => ({
    id: f.id,
    name: f.name,
    nameJa: f.nameJa,
    slug: f.slug,
    group: f.group as "Imperium" | "Chaos" | "Xenos",
    unitCount: f._count.units,
  }));

  return (
    <BuilderClient
      factions={factionList}
      editId={edit}
      addFaction={faction}
      addUnitSlug={add}
      showDatasheetLinks={true}
      shareBasePath="/wh40k/full/rosters/share"
      rosterBasePath="/wh40k/full/rosters"
    />
  );
}

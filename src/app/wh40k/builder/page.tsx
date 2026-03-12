import type { Metadata } from "next";
import { prisma } from "@/lib/prisma";
import { BuilderClient } from "./BuilderClient";
import type { FactionListItem } from "./BuilderClient";

export const metadata: Metadata = {
  title: "Army Builder | WH40K",
  description:
    "Warhammer 40,000 10th Edition 全陣営対応ロスタービルダー。ポイント計算・保存・共有対応。",
};

export default async function BuilderPage({
  searchParams,
}: {
  searchParams: Promise<{ edit?: string }>;
}) {
  const { edit } = await searchParams;

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

  return <BuilderClient factions={factionList} editId={edit} />;
}

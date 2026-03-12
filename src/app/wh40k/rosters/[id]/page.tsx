import { prisma } from "@/lib/prisma";
import { RosterDetailClient } from "./RosterDetailClient";

export default async function RosterDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  const roster = await prisma.roster.findUnique({
    where: { id },
    include: {
      faction: true,
      rosterUnits: {
        include: {
          unit: {
            select: {
              id: true,
              name: true,
              nameJa: true,
              role: true,
              slug: true,
            },
          },
        },
        orderBy: { id: "asc" },
      },
    },
  });

  const initialRoster =
    roster && roster.isPublic
      ? {
          id: roster.id,
          name: roster.title,
          faction: roster.factionId,
          factionName: roster.faction.nameJa ?? roster.faction.name,
          pointsLimit: roster.pointsLimit,
          units: roster.rosterUnits.map((entry) => ({
            entryId: entry.id,
            unitId: entry.unitId,
            slug: entry.unit.slug,
            name: entry.unit.name,
            nameJa: entry.unit.nameJa,
            role: entry.unit.role,
            pts: entry.points,
            weaponSelections: [],
          })),
          savedAt: roster.updatedAt.toISOString(),
          isPublic: true,
        }
      : null;

  return <RosterDetailClient id={id} initialRoster={initialRoster} />;
}

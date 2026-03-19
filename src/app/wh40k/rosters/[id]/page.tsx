import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { RosterDetailClient } from "./RosterDetailClient";
import type { WeaponSelection } from "../../builder/BuilderClient";

const AUTH_COOKIE = "wh40k_auth";

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

  // 非公開DBロスターは認証Cookie必須
  if (roster && !roster.isPublic) {
    const cookieStore = await cookies();
    const authCookie = cookieStore.get(AUTH_COOKIE);
    if (!authCookie?.value) {
      redirect(`/wh40k/auth?from=/wh40k/rosters/${id}`);
    }
  }

  const initialRoster = roster
    ? {
        id: roster.id,
        name: roster.title,
        faction: roster.factionId,
        factionName: roster.faction.nameJa ?? roster.faction.name,
        detachment: (roster as { detachment?: string | null }).detachment ?? undefined,
        pointsLimit: roster.pointsLimit,
        units: roster.rosterUnits.map((entry) => ({
          entryId: entry.id,
          unitId: entry.unitId,
          slug: entry.unit.slug,
          name: entry.unit.name,
          nameJa: entry.unit.nameJa,
          role: entry.unit.role,
          pts: entry.points,
          weaponSelections: Array.isArray(entry.weaponSelectionsJson)
            ? (entry.weaponSelectionsJson as unknown as WeaponSelection[])
            : [],
        })),
        savedAt: roster.updatedAt.toISOString(),
        isPublic: roster.isPublic,
      }
    : null;

  return <RosterDetailClient id={id} initialRoster={initialRoster} showDatasheetLinks={false} authPath="" />;
}

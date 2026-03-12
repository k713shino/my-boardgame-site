// src/app/wh40k/aeldari/page.tsx

import type { Metadata } from "next";
import { prisma } from "@/lib/prisma";
import { AeldariReference } from "./AeldariReference";
import type { AeldariUnit, Weapon, Ability } from "./types";

export const metadata: Metadata = {
  title: "アエルダリ ユニットリファレンス | WH40K",
  description:
    "Warhammer 40,000 10th Edition アエルダリ（クラフトワールド）の全ユニットデータシート日本語リファレンス。ステータス・武器・アビリティ一覧。BSDataデータ使用。",
};

export default async function AeldariPage() {
  const dbUnits = await prisma.unit.findMany({
    where: { factionId: "aeldari_craftworlds" },
    include: {
      categories: true,
      profiles: { orderBy: { sortOrder: "asc" } },
      weaponProfiles: { orderBy: { sortOrder: "asc" } },
      abilities: { orderBy: { sortOrder: "asc" } },
    },
    orderBy: [{ role: "asc" }, { name: "asc" }],
  });

  const units: AeldariUnit[] = dbUnits.map((u) => {
    const profile = u.profiles[0];
    const categoryNames = u.categories.map((c) => c.name);

    const weapons: Weapon[] = u.weaponProfiles.map((wp) => ({
      name: wp.name,
      nameJa: wp.nameJa ?? wp.name,
      type: wp.isRanged ? "Ranged" : "Melee",
      range: wp.range,
      A: wp.attacks,
      skill: wp.skill,
      S: wp.strength,
      AP: parseInt(wp.ap, 10) || 0,
      D: wp.damage,
      abilities: wp.keywords
        ? wp.keywords.split(",").map((k) => k.trim()).filter(Boolean)
        : [],
    }));

    const abilities: Ability[] = u.abilities.map((ab) => ({
      name: ab.name,
      nameJa: ab.nameJa ?? ab.name,
      desc: ab.descriptionJa ?? ab.description,
    }));

    return {
      id: u.id,
      name: u.name,
      nameJa: u.nameJa ?? u.name,
      pts: u.basePoints,
      role: u.role,
      categories: categoryNames,
      keywords: categoryNames,
      invuln: u.invuln ?? undefined,
      stats: {
        M: profile?.move ?? "—",
        T: parseInt(profile?.toughness ?? "0", 10),
        Sv: profile?.save ?? "—",
        W: parseInt(profile?.wounds ?? "0", 10),
        Ld: profile?.leadership ?? "—",
        OC: parseInt(profile?.oc ?? "0", 10),
      },
      weapons,
      abilities,
      fluff: "",
    };
  });

  return <AeldariReference units={units} />;
}

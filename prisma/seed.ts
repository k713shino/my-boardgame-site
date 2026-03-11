/**
 * prisma/seed.ts
 * wh40k-units.json のデータを Faction / Unit / UnitCategory テーブルにシードする。
 *
 * 実行: npx prisma db seed
 *
 * 設計:
 *   Unit.slug = "{factionSlug}--{unitCode}"
 *   同一ユニットが複数陣営に属す場合も、陣営ごとに別レコードとして管理する。
 */

import fs from "fs";
import path from "path";
import { PrismaClient } from "@prisma/client";
import unitsJson from "../src/data/wh40k-units.json";

// .env.local が存在すれば読み込み、DATABASE_URL を上書き（Next.js と同じ優先順位にする）
const envLocalPath = path.resolve(process.cwd(), ".env.local");
if (fs.existsSync(envLocalPath)) {
  for (const line of fs.readFileSync(envLocalPath, "utf-8").split("\n")) {
    const match = line.match(/^([^#=]+)=(.*)$/);
    if (match) process.env[match[1].trim()] = match[2].trim().replace(/^["']|["']$/g, "");
  }
}

const prisma = new PrismaClient();

type RawUnit = {
  id: string;
  name: string;
  nameJa: string;
  pts: number;
  role: string;
  categories: string[];
};

type RawFaction = {
  id: string;
  name: string;
  nameJa: string;
  group: string;
  units: RawUnit[];
};

const VALID_ROLES = new Set(["HQ", "Battleline", "Transport", "Other", "Heavy"]);
const VALID_GROUPS = new Set(["Imperium", "Chaos", "Xenos"]);

function toSlug(id: string): string {
  return id.replace(/_/g, "-").toLowerCase();
}

async function main() {
  const factions = Object.values(unitsJson) as RawFaction[];

  console.log(`Seeding ${factions.length} factions…`);

  let unitCount = 0;
  let skipCount = 0;

  for (const f of factions) {
    if (!VALID_GROUPS.has(f.group)) {
      console.warn(`  ⚠️  Skipping faction "${f.name}" — unknown group: ${f.group}`);
      continue;
    }

    const factionSlug = toSlug(f.id);

    // Upsert Faction
    await prisma.faction.upsert({
      where: { id: f.id },
      create: {
        id: f.id,
        name: f.name,
        nameJa: f.nameJa ?? null,
        slug: factionSlug,
        group: f.group as "Imperium" | "Chaos" | "Xenos",
      },
      update: {
        name: f.name,
        nameJa: f.nameJa ?? null,
        group: f.group as "Imperium" | "Chaos" | "Xenos",
      },
    });

    // Upsert Units
    for (const u of f.units) {
      if (!VALID_ROLES.has(u.role)) {
        console.warn(`    ⚠️  Skipping "${u.name}" — unknown role: ${u.role}`);
        skipCount++;
        continue;
      }

      // slug = "{factionSlug}--{unitCode}" で陣営をまたいでもユニーク
      const slug = `${factionSlug}--${toSlug(u.id)}`;

      const unit = await prisma.unit.upsert({
        where: { slug },
        create: {
          unitCode: u.id,
          name: u.name,
          nameJa: u.nameJa ?? null,
          slug,
          role: u.role as "HQ" | "Battleline" | "Transport" | "Other" | "Heavy",
          basePoints: u.pts,
          factionId: f.id,
        },
        update: {
          name: u.name,
          nameJa: u.nameJa ?? null,
          role: u.role as "HQ" | "Battleline" | "Transport" | "Other" | "Heavy",
          basePoints: u.pts,
        },
      });

      // Re-create categories
      await prisma.unitCategory.deleteMany({ where: { unitId: unit.id } });
      if (u.categories.length > 0) {
        await prisma.unitCategory.createMany({
          data: u.categories.map((cat) => ({ unitId: unit.id, name: cat })),
        });
      }

      unitCount++;
    }

    console.log(`  ✅ ${f.name} (${f.units.length} units)`);
  }

  console.log(`\n🎉 Seed complete: ${unitCount} units, ${skipCount} skipped`);
}

main()
  .catch((e) => {
    console.error("Seed failed:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });

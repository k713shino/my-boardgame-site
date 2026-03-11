/**
 * prisma/seed-datasheets.ts
 *
 * BSData/wh40k-10e の .cat ファイルから全陣営のデータシート情報を解析し、
 * UnitProfile / UnitWeaponProfile / UnitAbility テーブルにシードする。
 *
 * 前提:
 *   - ../wh40k-10e/ に BSData リポジトリがクローンされていること
 *   - prisma db seed で Unit テーブルが既にシード済みであること
 *
 * 実行:
 *   node_modules/.bin/tsx prisma/seed-datasheets.ts
 */

import { PrismaClient } from "@prisma/client";
import { XMLParser } from "fast-xml-parser";
import { existsSync, readFileSync } from "fs";
import { join, resolve } from "path";

// .env.local が存在すれば読み込み、DATABASE_URL を上書き（Next.js と同じ優先順位にする）
const envLocalPath = resolve(process.cwd(), ".env.local");
if (existsSync(envLocalPath)) {
  for (const line of readFileSync(envLocalPath, "utf-8").split("\n")) {
    const match = line.match(/^([^#=]+)=(.*)$/);
    if (match) process.env[match[1].trim()] = match[2].trim().replace(/^["']|["']$/g, "");
  }
}

const prisma = new PrismaClient();
const BSDATA_DIR = resolve(process.cwd(), "..", "wh40k-10e");

// faction id → .cat ファイル名のマッピング（seed-weapons.ts と同じ）
const FACTION_CAT_MAP: Record<string, { cat: string; library?: string }> = {
  aeldari_craftworlds:    { cat: "Aeldari - Aeldari Library" },
  drukhari:               { cat: "Aeldari - Drukhari",        library: "Aeldari - Aeldari Library" },
  ynnari:                 { cat: "Aeldari - Ynnari",          library: "Aeldari - Aeldari Library" },
  chaos_daemons:          { cat: "Chaos - Chaos Daemons Library" },
  chaos_knights:          { cat: "Chaos - Chaos Knights Library" },
  chaos_space_marines:    { cat: "Chaos - Chaos Space Marines" },
  death_guard:            { cat: "Chaos - Death Guard" },
  emperor_s_children:     { cat: "Chaos - Emperor's Children" },
  thousand_sons:          { cat: "Chaos - Thousand Sons" },
  world_eaters:           { cat: "Chaos - World Eaters" },
  genestealer_cults:      { cat: "Genestealer Cults" },
  leagues_of_votann:      { cat: "Leagues of Votann" },
  necrons:                { cat: "Necrons" },
  orks:                   { cat: "Orks" },
  t_au_empire:            { cat: "T'au Empire" },
  tyranids:               { cat: "Tyranids" },
  adepta_sororitas:       { cat: "Imperium - Adepta Sororitas" },
  adeptus_custodes:       { cat: "Imperium - Adeptus Custodes" },
  adeptus_mechanicus:     { cat: "Imperium - Adeptus Mechanicus" },
  agents_of_the_imperium: { cat: "Imperium - Agents of the Imperium" },
  astra_militarum:        { cat: "Imperium - Astra Militarum - Library" },
  black_templars:         { cat: "Imperium - Black Templars" },
  blood_angels:           { cat: "Imperium - Blood Angels" },
  dark_angels:            { cat: "Imperium - Dark Angels" },
  deathwatch:             { cat: "Imperium - Deathwatch" },
  grey_knights:           { cat: "Imperium - Grey Knights" },
  imperial_fists:         { cat: "Imperium - Imperial Fists" },
  imperial_knights:       { cat: "Imperium - Imperial Knights - Library" },
  iron_hands:             { cat: "Imperium - Iron Hands" },
  raven_guard:            { cat: "Imperium - Raven Guard" },
  salamanders:            { cat: "Imperium - Salamanders" },
  space_marines:          { cat: "Imperium - Space Marines" },
  space_wolves:           { cat: "Imperium - Space Wolves" },
  ultramarines:           { cat: "Imperium - Ultramarines" },
  white_scars:            { cat: "Imperium - White Scars" },
};

// ─── XML Parser ────────────────────────────────────────────────────────────────

function makeParser() {
  return new XMLParser({
    ignoreAttributes: false,
    attributeNamePrefix: "",
    isArray: (name) =>
      [
        "selectionEntry", "selectionEntryGroup", "categoryLink",
        "cost", "entryLink", "profile", "characteristic",
        "modifier", "infoLink", "rule", "catalogueLink",
      ].includes(name),
  });
}

function parseCat(catName: string): any {
  const path = join(BSDATA_DIR, `${catName}.cat`);
  try {
    const xml = readFileSync(path, "utf-8");
    const parsed = makeParser().parse(xml);
    return parsed.catalogue ?? parsed.gameSystem ?? Object.values(parsed)[0];
  } catch {
    return null;
  }
}

// ─── Types ─────────────────────────────────────────────────────────────────────

type StatRow = {
  modelName: string;
  move: string;
  toughness: string;
  save: string;
  wounds: string;
  leadership: string;
  oc: string;
};

type WeaponRow = {
  name: string;
  isRanged: boolean;
  range: string;
  attacks: string;
  skill: string;
  strength: string;
  ap: string;
  damage: string;
  keywords: string;
};

type AbilityRow = {
  name: string;
  description: string;
};

// ─── Shared maps（processFaction内でセット）──────────────────────────────────

let sharedEntryMap = new Map<string, any>();
let sharedProfileMap = new Map<string, any>();

// ─── Helpers ───────────────────────────────────────────────────────────────────

function charVal(chars: any[], name: string): string {
  const lower = name.toLowerCase();
  const c = chars.find((ch) => (ch.name ?? "").toLowerCase() === lower);
  return c ? String(c["#text"] ?? "").trim() : "";
}

/** プロファイル一覧からステータス行を取得 */
function parseStatProfile(p: any): StatRow | null {
  const typeName: string = p.typeName ?? "";
  if (typeName !== "Unit") return null;
  const chars: any[] = p.characteristics?.characteristic ?? [];
  const move = charVal(chars, "M");
  if (!move) return null;
  return {
    modelName: p.name ?? "",
    move,
    toughness: charVal(chars, "T"),
    save:      charVal(chars, "SV") || charVal(chars, "Sv") || charVal(chars, "Save"),
    wounds:    charVal(chars, "W"),
    leadership:charVal(chars, "LD") || charVal(chars, "Ld"),
    oc:        charVal(chars, "OC"),
  };
}

/** プロファイル一覧から武器行を取得 */
function parseWeaponProfile(p: any): WeaponRow | null {
  const typeName: string = p.typeName ?? "";
  const isRanged = typeName === "Ranged Weapons";
  const isMelee  = typeName === "Melee Weapons";
  if (!isRanged && !isMelee) return null;
  const chars: any[] = p.characteristics?.characteristic ?? [];
  const range = charVal(chars, "Range");
  if (!range) return null;
  return {
    name:     (p.name ?? "").replace(/^[➤►] ?/, "").trim(),
    isRanged,
    range,
    attacks:  charVal(chars, "A"),
    skill:    charVal(chars, "BS") || charVal(chars, "WS"),
    strength: charVal(chars, "S"),
    ap:       charVal(chars, "AP"),
    damage:   charVal(chars, "D"),
    keywords: charVal(chars, "Keywords"),
  };
}

/** プロファイルからアビリティ行を取得 */
function parseAbilityProfile(p: any): AbilityRow | null {
  const typeName: string = p.typeName ?? "";
  if (typeName !== "Abilities") return null;
  const chars: any[] = p.characteristics?.characteristic ?? [];
  const desc = charVal(chars, "Description");
  if (!desc) return null;
  return { name: p.name ?? "", description: desc };
}

/**
 * エントリ（ユニット/モデル/武器アップグレード等）から
 * stats / weapons / abilities を再帰的に収集する。
 *
 * 探索対象:
 *   1. entry.profiles (直接)
 *   2. entry.selectionEntries (子エントリ)
 *   3. entry.selectionEntryGroups > selectionEntries (モデルが入ったSEG)
 *   4. entry.entryLinks → sharedEntryMap (共有エントリへの参照)
 *   5. entry.infoLinks type="profile" → sharedProfileMap
 */
function collectProfiles(
  entry: any,
  depth = 0,
  visited = new Set<string>(),
): { stats: StatRow[]; weapons: WeaponRow[]; abilities: AbilityRow[] } {
  const stats: StatRow[] = [];
  const weapons: WeaponRow[] = [];
  const abilities: AbilityRow[] = [];

  if (depth > 5) return { stats, weapons, abilities };

  const id: string = entry.id ?? "";
  if (id && visited.has(id)) return { stats, weapons, abilities };
  if (id) visited.add(id);

  // 1. 直接プロファイル
  for (const p of entry.profiles?.profile ?? []) {
    const s = parseStatProfile(p);    if (s) stats.push(s);
    const w = parseWeaponProfile(p);  if (w) weapons.push(w);
    const a = parseAbilityProfile(p); if (a) abilities.push(a);
  }

  // 2. 子 selectionEntries（type="model" は stat/ability のみ、upgrade は weapon も）
  for (const se of entry.selectionEntries?.selectionEntry ?? []) {
    const child = collectProfiles(se, depth + 1, visited);
    stats.push(...child.stats);
    weapons.push(...child.weapons);
    abilities.push(...child.abilities);
  }

  // 3. selectionEntryGroups を再帰的に処理
  //    SEG 内に SEG がネストされている場合（Wraithknight の Left Arm/Right Arm 等）も対応
  function traverseSEG(seg: any) {
    // SEG 直下の selectionEntries（モデル、武器など）
    for (const se of seg.selectionEntries?.selectionEntry ?? []) {
      const child = collectProfiles(se, depth + 1, visited);
      stats.push(...child.stats);
      weapons.push(...child.weapons);
      abilities.push(...child.abilities);
    }
    // SEG の entryLinks（共有モデル/武器への参照）
    for (const el of seg.entryLinks?.entryLink ?? []) {
      if (el.type === "selectionEntry") {
        const resolved = sharedEntryMap.get(el.targetId ?? "");
        if (resolved) {
          const child = collectProfiles(resolved, depth + 1, visited);
          stats.push(...child.stats);
          weapons.push(...child.weapons);
          abilities.push(...child.abilities);
        }
      }
    }
    // ネストされた SEG（Wraithknight の Wargear > Left Arm 等）
    for (const nestedSeg of seg.selectionEntryGroups?.selectionEntryGroup ?? []) {
      traverseSEG(nestedSeg);
    }
  }

  for (const seg of entry.selectionEntryGroups?.selectionEntryGroup ?? []) {
    traverseSEG(seg);
  }

  // 4. entryLinks → sharedEntryMap（武器や共有モデルへの参照）
  for (const el of entry.entryLinks?.entryLink ?? []) {
    if (el.type !== "selectionEntry") continue;
    const resolved = sharedEntryMap.get(el.targetId ?? "");
    if (resolved) {
      const child = collectProfiles(resolved, depth + 1, visited);
      // entryLink 先は主に武器なので weapons のみ追加（stats は重複リスクあり）
      weapons.push(...child.weapons);
      // ただし depth=0 のときはモデル参照の可能性があるため stats/abilities も取得
      if (depth === 0) {
        stats.push(...child.stats);
        abilities.push(...child.abilities);
      }
    }
  }

  // 5. infoLinks type="profile" → sharedProfileMap
  for (const il of entry.infoLinks?.infoLink ?? []) {
    if (il.type !== "profile") continue;
    const p = sharedProfileMap.get(il.targetId ?? "");
    if (!p) continue;
    const s = parseStatProfile(p);    if (s) stats.push(s);
    const w = parseWeaponProfile(p);  if (w) weapons.push(w);
    const a = parseAbilityProfile(p); if (a) abilities.push(a);
  }

  return { stats, weapons, abilities };
}

/** スペシャルセーヴをアビリティ一覧から抽出（例: "4+"）*/
function extractInvuln(abilities: AbilityRow[]): string | null {
  for (const a of abilities) {
    // "Invulnerable Save" 系のアビリティを探す
    if (!a.name.toLowerCase().includes("invulnerable")) continue;
    const m = a.description.match(/(\d+)\+\s*[Ii]nvulnerable/);
    if (m) return `${m[1]}+`;
    // "has a X+ invulnerable save" パターン
    const m2 = a.description.match(/(\d+)\+\s*invulnerable\s*save/i);
    if (m2) return `${m2[1]}+`;
    // "X+ invulnerable" だけの場合
    const m3 = a.description.match(/(\d+)\+/);
    if (m3) return `${m3[1]}+`;
  }
  return null;
}

function slugifyName(name: string): string {
  return name
    .toLowerCase()
    .replace(/['''\u2018\u2019`]/g, "")
    .replace(/[^a-z0-9]+/g, "_")
    .replace(/^_|_$/g, "");
}

// ─── Main ──────────────────────────────────────────────────────────────────────

async function processFaction(
  factionId: string,
  catName: string,
  libraryName?: string,
): Promise<{ units: number }> {
  const catalogue = parseCat(catName);
  if (!catalogue) {
    console.warn(`  ⚠️  .cat not found: ${catName}`);
    return { units: 0 };
  }

  // ライブラリの sharedSelectionEntries を解決に使う
  const libraryEntryMap = new Map<string, any>();
  let libCat: any = null;
  if (libraryName) {
    libCat = parseCat(libraryName);
    if (libCat) {
      for (const e of libCat.sharedSelectionEntries?.selectionEntry ?? []) {
        if (e.id)   libraryEntryMap.set(e.id, e);
        if (e.name) libraryEntryMap.set(e.name.trim(), e);
      }
    }
  }

  // sharedEntryMap を構築（カタログ + ライブラリ）
  sharedEntryMap = new Map<string, any>();
  for (const src of [catalogue, libCat].filter(Boolean)) {
    for (const e of src.sharedSelectionEntries?.selectionEntry ?? []) {
      if (e.id)   sharedEntryMap.set(e.id, e);
      if (e.name) sharedEntryMap.set(e.name.trim(), e);
    }
  }

  // sharedProfileMap を構築（カタログ + ライブラリ）
  sharedProfileMap = new Map<string, any>();
  for (const src of [catalogue, libCat].filter(Boolean)) {
    for (const p of src.sharedProfiles?.profile ?? []) {
      if (p.id)   sharedProfileMap.set(p.id, p);
      if (p.name) sharedProfileMap.set(p.name.trim(), p);
    }
  }

  // unit/model エントリを収集
  const unitEntries: any[] = [
    ...(catalogue.selectionEntries?.selectionEntry ?? []),
    ...(catalogue.sharedSelectionEntries?.selectionEntry ?? []),
  ].filter((e) => e.type === "unit" || e.type === "model");

  // Drukhari/Ynnari など entryLinks のみの場合
  if (unitEntries.length === 0) {
    for (const el of catalogue.entryLinks?.entryLink ?? []) {
      const linked =
        sharedEntryMap.get(el.targetId ?? "") ??
        sharedEntryMap.get(el.name?.trim() ?? "");
      if (linked && (linked.type === "unit" || linked.type === "model")) {
        unitEntries.push(linked);
      }
    }
  }

  // DB のユニット一覧（名前 → id マッピング）
  const dbUnits = await prisma.unit.findMany({
    where: { factionId },
    select: { id: true, name: true, unitCode: true },
  });
  const dbUnitById = new Map<string, { id: string; name: string }>();
  for (const u of dbUnits) {
    dbUnitById.set(u.name.toLowerCase(), u);
    dbUnitById.set(slugifyName(u.name), u);
    dbUnitById.set(u.unitCode.toLowerCase(), u);
  }

  let unitCount = 0;

  for (const entry of unitEntries) {
    const unitName: string = (entry.name ?? "").trim();
    if (!unitName) continue;

    const dbUnit =
      dbUnitById.get(unitName.toLowerCase()) ??
      dbUnitById.get(slugifyName(unitName));
    if (!dbUnit) continue;

    const { stats, weapons, abilities } = collectProfiles(entry);

    // 重複除去
    const seenStats    = new Set<string>();
    const seenWeapons  = new Set<string>();
    const seenAbilities = new Set<string>();

    const uniqueStats = stats.filter((s) => {
      const k = s.modelName.toLowerCase();
      if (seenStats.has(k)) return false;
      seenStats.add(k);
      return true;
    });
    const uniqueWeapons = weapons.filter((w) => {
      const k = w.name.toLowerCase();
      if (seenWeapons.has(k)) return false;
      seenWeapons.add(k);
      return true;
    });
    const uniqueAbilities = abilities.filter((a) => {
      const k = a.name.toLowerCase();
      // スペシャルセーヴ系は abilities から除外（invuln フィールドへ）
      if (k.includes("invulnerable")) return false;
      if (seenAbilities.has(k)) return false;
      seenAbilities.add(k);
      return true;
    });

    const invuln = extractInvuln(abilities);

    // 既存データを削除して再挿入
    await prisma.$transaction([
      prisma.unitProfile.deleteMany({ where: { unitId: dbUnit.id } }),
      prisma.unitWeaponProfile.deleteMany({ where: { unitId: dbUnit.id } }),
      prisma.unitAbility.deleteMany({ where: { unitId: dbUnit.id } }),
    ]);

    if (uniqueStats.length > 0) {
      await prisma.unitProfile.createMany({
        data: uniqueStats.map((s, i) => ({ ...s, unitId: dbUnit.id, sortOrder: i })),
      });
    }
    if (uniqueWeapons.length > 0) {
      await prisma.unitWeaponProfile.createMany({
        data: uniqueWeapons.map((w, i) => ({ ...w, unitId: dbUnit.id, sortOrder: i })),
      });
    }
    if (uniqueAbilities.length > 0) {
      await prisma.unitAbility.createMany({
        data: uniqueAbilities.map((a, i) => ({ ...a, unitId: dbUnit.id, sortOrder: i })),
      });
    }
    if (invuln !== null) {
      await prisma.unit.update({ where: { id: dbUnit.id }, data: { invuln } });
    }

    unitCount++;
  }

  return { units: unitCount };
}

async function main() {
  console.log("Seeding datasheets from BSData...\n");
  let total = 0;

  for (const [factionId, { cat, library }] of Object.entries(FACTION_CAT_MAP)) {
    const { units } = await processFaction(factionId, cat, library);
    const label = cat.split(" - ").pop()!;
    if (units > 0) {
      console.log(`  ✅ ${label} — ${units} units`);
    } else {
      console.log(`  ·  ${label} — (no match)`);
    }
    total += units;
  }

  console.log(`\n🎉 Done: ${total} units updated`);
}

main()
  .catch((e) => { console.error(e); process.exit(1); })
  .finally(() => prisma.$disconnect());

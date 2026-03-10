/**
 * prisma/seed-weapons.ts
 *
 * BSData/wh40k-10e の .cat ファイルから武器選択オプションを解析し、
 * UnitWeaponGroup / UnitWeaponOption テーブルにシードする。
 *
 * 前提:
 *   - ../wh40k-10e/ に BSData リポジトリがクローンされていること
 *   - prisma db seed で Unit テーブルが既にシード済みであること
 *
 * 実行:
 *   node_modules/.bin/tsx prisma/seed-weapons.ts
 */

import { PrismaClient } from "@prisma/client";
import { XMLParser } from "fast-xml-parser";
import { readFileSync } from "fs";
import { join, resolve } from "path";

const prisma = new PrismaClient();

const BSDATA_DIR = resolve(process.cwd(), "..", "wh40k-10e");

// faction id → .cat ファイル名のマッピング
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

// 武器グループ名として除外するキーワード（完全一致 or 後方一致）
const SKIP_GROUP_NAMES = new Set([
  "crusade", "crusade options", "battle honours", "weapon modifications",
  "experience", "blackstone fragments", "crusade: battle honours",
  "crusade: experience", "crusade: weapon modifications",
]);

// 除外する部分一致キーワード（グループ名にこれらが含まれる場合スキップ）
const SKIP_GROUP_KEYWORDS = [
  "enhancements", "enhancement", "warlord traits", "warlord trait",
  "relics", "stratagems", "battle tactic", "epic deed",
  "requisition", "out of action", "saga of", "forgefather",
];

function shouldSkipGroup(name: string): boolean {
  const lower = name.toLowerCase();
  if (SKIP_GROUP_NAMES.has(lower)) return true;
  return SKIP_GROUP_KEYWORDS.some((kw) => lower.includes(kw));
}

// ─── XML Parser ──────────────────────────────────────────────────────────────

function makeParser() {
  return new XMLParser({
    ignoreAttributes: false,
    attributeNamePrefix: "",
    isArray: (name) =>
      [
        "selectionEntry", "selectionEntryGroup", "categoryLink",
        "cost", "entryLink", "constraint", "profile",
        "characteristic", "modifier", "infoLink",
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

// ─── Types ───────────────────────────────────────────────────────────────────

type WeaponGroup = {
  name: string;
  minChoices: number;
  maxChoices: number;
  options: string[];
};

// ─── Helpers ─────────────────────────────────────────────────────────────────

function getConstraintVal(constraints: any[], type: string, fallback: number): number {
  if (!Array.isArray(constraints)) return fallback;
  const c = constraints.find((x) => x.type === type);
  if (!c) return fallback;
  const v = parseInt(c.value ?? String(fallback), 10);
  return isNaN(v) ? fallback : v;
}

/** selectionEntryGroup から選択肢を収集（entryLinks + selectionEntries 両対応） */
function getGroupOptions(seg: any): string[] {
  const options: string[] = [];
  // entryLinks (Space Marines など多くの陣営)
  for (const el of seg.entryLinks?.entryLink ?? []) {
    const name: string = el.name?.trim();
    if (name && el.hidden !== "true" && !name.toLowerCase().includes("crusade") && !name.toLowerCase().includes("weapon modif")) {
      options.push(name);
    }
  }
  // selectionEntries（Aeldari など）
  for (const se of seg.selectionEntries?.selectionEntry ?? []) {
    const name: string = se.name?.trim();
    if (name && se.hidden !== "true" && se.type !== "model" && se.type !== "unit") {
      options.push(name);
    }
  }
  return [...new Set(options)]; // deduplicate
}

// sharedSelectionEntryGroups の Map（processFaction 内でセットされる）
let sharedGroupMapGlobal = new Map<string, any>();

/** 要素のすべての武器グループを再帰的に収集 */
function extractWeaponGroups(element: any, depth = 0): WeaponGroup[] {
  if (depth > 4) return [];
  const groups: WeaponGroup[] = [];

  // 直接の selectionEntryGroups
  for (const seg of element.selectionEntryGroups?.selectionEntryGroup ?? []) {
    const groupName: string = seg.name?.trim() ?? "";
    if (shouldSkipGroup(groupName)) continue;

    const constraints: any[] = seg.constraints?.constraint ?? [];
    const min = getConstraintVal(constraints, "min", 1);
    const max = getConstraintVal(constraints, "max", 1);
    const options = getGroupOptions(seg);

    if (options.length >= 2) {
      groups.push({ name: groupName || "Weapon Options", minChoices: min, maxChoices: max, options });
    }

    // サブグループも探索（Necrons などの入れ子構造）
    groups.push(...extractWeaponGroups(seg, depth + 1));
  }

  // 直接の selectionEntries（model/unit 以外も含む upgrade など）
  for (const se of element.selectionEntries?.selectionEntry ?? []) {
    if (se.type === "model" || se.type === "unit") {
      // モデル内部の武器グループを再帰探索
      groups.push(...extractWeaponGroups(se, depth + 1));
    }
  }

  // entryLinks で参照される selectionEntryGroup（Guardian Defenders の Heavy Weapon Platform など）
  for (const el of element.entryLinks?.entryLink ?? []) {
    if (el.type === "selectionEntryGroup") {
      const resolved = sharedGroupMapGlobal.get(el.targetId ?? "") ?? sharedGroupMapGlobal.get(el.name?.trim() ?? "");
      if (resolved) {
        const groupName: string = resolved.name?.trim() ?? el.name?.trim() ?? "";
        if (shouldSkipGroup(groupName)) continue;
        const constraints: any[] = resolved.constraints?.constraint ?? [];
        const min = getConstraintVal(constraints, "min", 1);
        const max = getConstraintVal(constraints, "max", 1);
        const options = getGroupOptions(resolved);
        if (options.length >= 2) {
          groups.push({ name: groupName || "Weapon Options", minChoices: min, maxChoices: max, options });
        }
        groups.push(...extractWeaponGroups(resolved, depth + 1));
      }
    }
  }

  return groups;
}

function slugifyName(name: string): string {
  return name
    .toLowerCase()
    .replace(/['''`]/g, "")
    .replace(/[^a-z0-9]+/g, "_")
    .replace(/^_|_$/g, "");
}

// ─── Main ─────────────────────────────────────────────────────────────────────

async function processFaction(factionId: string, catName: string, libraryName?: string) {
  const catalogue = parseCat(catName);
  if (!catalogue) {
    console.warn(`  ⚠️  .cat not found: ${catName}`);
    return { units: 0, groups: 0 };
  }

  // ライブラリの sharedSelectionEntries を ID/name で引ける Map を作成
  const libraryMap = new Map<string, any>();
  let libCatParsed: any = null;
  if (libraryName) {
    libCatParsed = parseCat(libraryName);
    if (libCatParsed) {
      for (const e of libCatParsed.sharedSelectionEntries?.selectionEntry ?? []) {
        if (e.id) libraryMap.set(e.id, e);
        if (e.name) libraryMap.set(e.name.trim(), e);
      }
    }
  }

  // sharedSelectionEntryGroups を グローバルマップにセット（extractWeaponGroups から参照）
  sharedGroupMapGlobal = new Map<string, any>();
  const groupSources = [catalogue, libCatParsed].filter(Boolean);
  for (const src of groupSources) {
    for (const g of src.sharedSelectionEntryGroups?.selectionEntryGroup ?? []) {
      if (g.id) sharedGroupMapGlobal.set(g.id, g);
      if (g.name) sharedGroupMapGlobal.set(g.name.trim(), g);
    }
  }

  // このカタログ自身の sharedSelectionEntries
  const sharedMap = new Map<string, any>();
  for (const e of catalogue.sharedSelectionEntries?.selectionEntry ?? []) {
    if (e.id) sharedMap.set(e.id, e);
    if (e.name) sharedMap.set(e.name.trim(), e);
  }

  // unit/model 型の selectionEntry を収集（catalogue + sharedSelectionEntries）
  // type="unit" は複数モデル編成、type="model" は単体ユニット（キャラ・乗り物等）
  const unitEntries: any[] = [
    ...(catalogue.selectionEntries?.selectionEntry ?? []),
    ...(catalogue.sharedSelectionEntries?.selectionEntry ?? []),
  ].filter((e) => e.type === "unit" || e.type === "model");

  // カタログのトップレベル entryLinks を解決（Drukhari/Ynnari のようにすべてライブラリ参照の陣営用）
  if (unitEntries.length === 0) {
    for (const el of catalogue.entryLinks?.entryLink ?? []) {
      const linked =
        sharedMap.get(el.targetId ?? "") ??
        sharedMap.get(el.name?.trim() ?? "") ??
        libraryMap.get(el.targetId ?? "") ??
        libraryMap.get(el.name?.trim() ?? "");
      if (linked && (linked.type === "unit" || linked.type === "model")) {
        unitEntries.push(linked);
      }
    }
  }

  // DB のユニット一覧（名前→id マッピング）
  const dbUnits = await prisma.unit.findMany({
    where: { factionId },
    select: { id: true, name: true, unitCode: true },
  });
  const dbUnitByName = new Map<string, string>();
  for (const u of dbUnits) {
    dbUnitByName.set(u.name.toLowerCase(), u.id);
    dbUnitByName.set(slugifyName(u.name), u.id);
    dbUnitByName.set(u.unitCode.toLowerCase(), u.id);
  }

  let unitCount = 0;
  let groupCount = 0;

  for (const entry of unitEntries) {
    const unitName: string = entry.name?.trim() ?? "";
    if (!unitName) continue;

    const dbId =
      dbUnitByName.get(unitName.toLowerCase()) ??
      dbUnitByName.get(slugifyName(unitName));
    if (!dbId) continue;

    // 武器グループを抽出
    let groups = extractWeaponGroups(entry);

    // selectionEntry タイプの entryLinks からライブラリ/shared エントリを解決して追加探索
    // （selectionEntryGroup タイプは extractWeaponGroups 内で処理済み）
    for (const el of entry.entryLinks?.entryLink ?? []) {
      if (el.type && el.type !== "selectionEntry") continue;
      const linked =
        sharedMap.get(el.targetId ?? "") ??
        sharedMap.get(el.name?.trim() ?? "") ??
        libraryMap.get(el.targetId ?? "") ??
        libraryMap.get(el.name?.trim() ?? "");
      if (linked && linked !== entry) groups.push(...extractWeaponGroups(linked));
    }

    // グループ名の重複を除去
    const seen = new Set<string>();
    groups = groups.filter((g) => {
      const key = g.name.toLowerCase();
      if (seen.has(key)) return false;
      seen.add(key);
      return true;
    });

    // 既存グループを削除（groups が 0 の場合も削除して古いデータをクリア）
    await prisma.unitWeaponGroup.deleteMany({ where: { unitId: dbId } });

    if (groups.length === 0) continue;

    for (let i = 0; i < groups.length; i++) {
      const g = groups[i];
      await prisma.unitWeaponGroup.create({
        data: {
          unitId: dbId,
          name: g.name,
          minChoices: g.minChoices,
          maxChoices: g.maxChoices,
          sortOrder: i,
          options: {
            create: g.options.map((name, j) => ({ name, pointsDelta: 0, sortOrder: j })),
          },
        },
      });
      groupCount++;
    }

    unitCount++;
  }

  return { units: unitCount, groups: groupCount };
}

async function main() {
  console.log("Seeding weapon options from BSData...\n");

  let totalUnits = 0;
  let totalGroups = 0;

  for (const [factionId, { cat, library }] of Object.entries(FACTION_CAT_MAP)) {
    const result = await processFaction(factionId, cat, library);
    const label = cat.split(" - ").pop()!;
    if (result.units > 0) {
      console.log(`  ✅ ${label} — ${result.units} units, ${result.groups} groups`);
    } else {
      console.log(`  ·  ${label} — (no options)`);
    }
    totalUnits += result.units;
    totalGroups += result.groups;
  }

  console.log(`\n🎉 Done: ${totalUnits} units with weapon options, ${totalGroups} weapon groups total`);
}

main()
  .catch((e) => { console.error(e); process.exit(1); })
  .finally(() => prisma.$disconnect());

#!/usr/bin/env node
/**
 * scripts/parse-bsdata.mjs
 *
 * BSData / wh40k-10e の .cat ファイルを解析し、
 * src/data/wh40k-units.json を生成するスクリプト。
 *
 * 使い方:
 *   1. このリポジトリと同階層に wh40k-10e をクローン
 *      git clone https://github.com/BSData/wh40k-10e.git ../wh40k-10e
 *   2. 実行
 *      npm run generate:wh40k
 *
 * npm run generate:wh40k は package.json の scripts に追加済み。
 */

import { readFileSync, writeFileSync, mkdirSync, readdirSync } from "fs";
import { join, basename } from "path";

// ─── fast-xml-parser は devDependency として必要 ────────────────────────────
// npm install -D fast-xml-parser
let XMLParser;
try {
  ({ XMLParser } = await import("fast-xml-parser"));
} catch {
  console.error(
    "❌ fast-xml-parser が見つかりません。\n" +
      "   npm install -D fast-xml-parser を実行してください。"
  );
  process.exit(1);
}

// ─── 設定 ─────────────────────────────────────────────────────────────────────

const BSDATA_DIR = join(process.cwd(), "..", "wh40k-10e");
const OUTPUT_PATH = join(process.cwd(), "src", "data", "wh40k-units.json");

const FACTION_MAP = {
  "Aeldari - Aeldari Library":   { name: "Aeldari (Craftworlds)", group: "Xenos",    libMode: "asuryani" },
  "Aeldari - Drukhari":          { name: "Drukhari",              group: "Xenos",    libMode: null },
  "Chaos - Chaos Daemons Library":{ name: "Chaos Daemons",        group: "Chaos",    libMode: null },
  "Chaos - Chaos Knights Library":{ name: "Chaos Knights",        group: "Chaos",    libMode: null },
  "Chaos - Chaos Space Marines": { name: "Chaos Space Marines",   group: "Chaos",    libMode: null },
  "Chaos - Death Guard":         { name: "Death Guard",           group: "Chaos",    libMode: null },
  "Chaos - Emperor's Children":  { name: "Emperor's Children",    group: "Chaos",    libMode: null },
  "Chaos - Thousand Sons":       { name: "Thousand Sons",         group: "Chaos",    libMode: null },
  "Chaos - World Eaters":        { name: "World Eaters",          group: "Chaos",    libMode: null },
  "Genestealer Cults":           { name: "Genestealer Cults",     group: "Xenos",    libMode: null },
  "Imperium - Adepta Sororitas": { name: "Adepta Sororitas",      group: "Imperium", libMode: null },
  "Imperium - Adeptus Custodes": { name: "Adeptus Custodes",      group: "Imperium", libMode: null },
  "Imperium - Adeptus Mechanicus":{ name: "Adeptus Mechanicus",   group: "Imperium", libMode: null },
  "Imperium - Astra Militarum":  { name: "Astra Militarum",       group: "Imperium", libMode: null },
  "Imperium - Black Templars":   { name: "Black Templars",        group: "Imperium", libMode: null },
  "Imperium - Blood Angels":     { name: "Blood Angels",          group: "Imperium", libMode: null },
  "Imperium - Dark Angels":      { name: "Dark Angels",           group: "Imperium", libMode: null },
  "Imperium - Deathwatch":       { name: "Deathwatch",            group: "Imperium", libMode: null },
  "Imperium - Grey Knights":     { name: "Grey Knights",          group: "Imperium", libMode: null },
  "Imperium - Imperial Knights - Library":{ name: "Imperial Knights", group: "Imperium", libMode: null },
  "Imperium - Space Marines":    { name: "Space Marines",         group: "Imperium", libMode: null },
  "Imperium - Space Wolves":     { name: "Space Wolves",          group: "Imperium", libMode: null },
  "Imperium - Ultramarines":     { name: "Ultramarines",          group: "Imperium", libMode: null },
  "Leagues of Votann":           { name: "Leagues of Votann",     group: "Xenos",    libMode: null },
  "Necrons":                     { name: "Necrons",               group: "Xenos",    libMode: null },
  "Orks":                        { name: "Orks",                  group: "Xenos",    libMode: null },
  "T'au Empire":                 { name: "T'au Empire",           group: "Xenos",    libMode: null },
  "Tyranids":                    { name: "Tyranids",              group: "Xenos",    libMode: null },
};

const SKIP_CAT_PREFIXES = ["Chaos Weapons", "Drukhari Weapons"];
const IGNORED_CAT_PREFIXES = [
  "Faction:", "Attacks", "Damage", "Extra", "Ranged", "Melee",
  "Psychic", "Torrent", "Assault", "Smoke",
];

// ─── ヘルパー ─────────────────────────────────────────────────────────────────

function slugify(str) {
  return str.toLowerCase().replace(/[^a-z0-9]+/g, "_").replace(/^_|_$/g, "");
}

function getRole(cats) {
  const s = new Set(cats);
  if (s.has("Character")) return "HQ";
  if (s.has("Battleline")) return "Battleline";
  if (s.has("Dedicated Transport") || (s.has("Transport") && s.has("Vehicle"))) return "Transport";
  if ((s.has("Vehicle") || s.has("Monster") || s.has("Walker")) && !s.has("Character")) return "Heavy";
  return "Other";
}

function parseCat(filepath) {
  const xml = readFileSync(filepath, "utf-8");
  const parser = new XMLParser({
    ignoreAttributes: false,
    attributeNamePrefix: "@_",
    isArray: (name) =>
      ["selectionEntry", "categoryLink", "cost", "entryLink"].includes(name),
  });
  const parsed = parser.parse(xml);
  const catalogue = parsed.catalogue;
  if (!catalogue) return [];

  const results = [];

  function processEntries(entries) {
    if (!Array.isArray(entries)) return;
    for (const entry of entries) {
      const name = entry["@_name"] ?? "";
      const type = entry["@_type"] ?? "";
      const hidden = entry["@_hidden"] ?? "false";
      if (hidden === "true") continue;
      if (!["model", "unit"].includes(type)) continue;
      if (name.includes("[Legends]")) continue;

      // Points
      let pts = 0;
      const costs = entry.costs?.cost ?? [];
      for (const cost of costs) {
        if (cost["@_name"] === "pts") {
          pts = Math.round(parseFloat(cost["@_value"] ?? "0") || 0);
          break;
        }
      }
      if (pts <= 0) continue;

      // Categories
      const cats = (entry.categoryLinks?.categoryLink ?? [])
        .map((cl) => cl["@_name"] ?? "")
        .filter((c) => c && !IGNORED_CAT_PREFIXES.some((p) => c.startsWith(p)));

      results.push({
        id: slugify(name),
        name,
        nameJa: "",
        pts,
        role: getRole(cats),
        categories: cats,
      });
    }
  }

  processEntries(catalogue.selectionEntries?.selectionEntry);
  return results;
}

// ─── メイン ───────────────────────────────────────────────────────────────────

const output = {};
const catFiles = readdirSync(BSDATA_DIR).filter((f) => f.endsWith(".cat"));

for (const filename of catFiles.sort()) {
  const key = filename.replace(/\.cat$/, "");
  const info = FACTION_MAP[key];
  if (!info) continue;

  const filepath = join(BSDATA_DIR, filename);
  const units = parseCat(filepath);

  // De-duplicate
  const seen = new Set();
  const deduped = units.filter((u) => {
    if (seen.has(u.name)) return false;
    seen.add(u.name);
    return true;
  });

  // Ensure unique IDs
  const idCount = {};
  for (const u of deduped) {
    const base = u.id;
    if (idCount[base] !== undefined) {
      idCount[base]++;
      u.id = `${base}_${idCount[base]}`;
    } else {
      idCount[base] = 0;
    }
  }

  if (!deduped.length) continue;

  const factionId = slugify(info.name);
  output[factionId] = {
    id: factionId,
    name: info.name,
    nameJa: "",
    group: info.group,
    units: deduped,
  };
  console.log(`✓ ${info.name}: ${deduped.length} units`);
}

console.log(`\nTotal factions: ${Object.keys(output).length}`);
console.log(`Total units: ${Object.values(output).reduce((s, f) => s + f.units.length, 0)}`);

mkdirSync(join(process.cwd(), "src", "data"), { recursive: true });
writeFileSync(OUTPUT_PATH, JSON.stringify(output, null, 2), "utf-8");
console.log(`\n✅ Saved to ${OUTPUT_PATH}`);

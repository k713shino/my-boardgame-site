#!/usr/bin/env node

import { readFileSync, writeFileSync } from "fs";
import { join } from "path";

const DATA_PATH = join(process.cwd(), "src", "data", "wh40k-units.json");
const OUT_PATH = join(process.cwd(), "src", "data", "wh40k-name-ja-audit.json");

const data = JSON.parse(readFileSync(DATA_PATH, "utf-8"));
const findings = [];

function reasons(name, nameJa) {
  const out = [];
  if (!nameJa || !nameJa.trim()) out.push("empty");
  if (/[A-Za-z]/.test(nameJa)) out.push("contains_latin");
  if (/w\//i.test(name) && !/(ウィズ|（)/.test(nameJa)) out.push("unresolved_w_slash");
  if (/ヲ/.test(nameJa)) out.push("contains_wo");
  if (name.length >= 6 && nameJa.replace(/[・（）()／\s0-9IVX]/g, "").length <= 3) out.push("too_short");
  return out;
}

for (const faction of Object.values(data)) {
  for (const unit of faction.units ?? []) {
    const rs = reasons(unit.name, unit.nameJa ?? "");
    if (rs.length) {
      findings.push({
        faction: faction.name,
        name: unit.name,
        nameJa: unit.nameJa ?? "",
        reasons: rs,
      });
    }
  }
}

findings.sort((a, b) => b.reasons.length - a.reasons.length || a.name.localeCompare(b.name));

writeFileSync(
  OUT_PATH,
  JSON.stringify(
    {
      flaggedCount: findings.length,
      generatedAt: new Date().toISOString(),
      findings,
    },
    null,
    2
  ) + "\n",
  "utf-8"
);

console.log(`Flagged: ${findings.length}`);
console.log(`Saved: ${OUT_PATH}`);

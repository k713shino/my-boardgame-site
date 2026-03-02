#!/usr/bin/env node

import { readFileSync, writeFileSync } from "fs";
import { join } from "path";

const DATA_PATH = join(process.cwd(), "src", "data", "wh40k-units.json");

const raw = JSON.parse(readFileSync(DATA_PATH, "utf-8"));

for (const faction of Object.values(raw)) {
  faction.nameJa = typeof faction.nameJa === "string" ? faction.nameJa : "";
  for (const unit of faction.units ?? []) {
    unit.nameJa = typeof unit.nameJa === "string" ? unit.nameJa : "";
  }
}

writeFileSync(DATA_PATH, JSON.stringify(raw, null, 2) + "\n", "utf-8");
console.log(`Updated nameJa fields in ${DATA_PATH}`);

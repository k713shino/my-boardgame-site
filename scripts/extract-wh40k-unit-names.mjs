#!/usr/bin/env node

import { readFileSync, writeFileSync } from "fs";
import { join } from "path";

const DATA_PATH = join(process.cwd(), "src", "data", "wh40k-units.json");
const OUTPUT_PATH = join(process.cwd(), "src", "data", "wh40k-unit-names.json");

const raw = JSON.parse(readFileSync(DATA_PATH, "utf-8"));
const names = Object.values(raw)
  .flatMap((faction) => faction.units ?? [])
  .map((unit) => unit.name)
  .filter((name) => typeof name === "string" && name.trim().length > 0);

const uniqueSorted = [...new Set(names)].sort((a, b) => a.localeCompare(b));

writeFileSync(OUTPUT_PATH, JSON.stringify(uniqueSorted, null, 2) + "\n", "utf-8");
console.log(`Extracted ${uniqueSorted.length} unit names -> ${OUTPUT_PATH}`);

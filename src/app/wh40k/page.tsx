import type { Metadata } from "next";
import { RosterBuilder } from "./RosterBuilder";
import factionsRaw from "@/data/wh40k-units.json";
import type { Faction } from "./types";

export const metadata: Metadata = {
  title: "WH40K Roster Builder",
  description:
    "Warhammer 40,000 10th Edition 全種族対応ロスタービルダー。BSDataデータ使用。",
};

export default function WH40KPage() {
  const factions = Object.values(factionsRaw) as Faction[];
  return <RosterBuilder factions={factions} />;
}

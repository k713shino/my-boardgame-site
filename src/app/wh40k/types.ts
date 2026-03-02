export type UnitRole = "HQ" | "Battleline" | "Other" | "Transport" | "Heavy";
export type FactionGroup = "Imperium" | "Chaos" | "Xenos";

export interface Unit {
  id: string;
  name: string;
  nameJa: string;
  pts: number;
  role: UnitRole;
  categories: string[];
}

export interface Faction {
  id: string;
  name: string;
  nameJa: string;
  group: FactionGroup;
  units: Unit[];
}

export interface RosterUnit extends Unit {
  rosterId: string;  // unique per roster entry (allows duplicates)
  rosterPts: number; // manually overridden pts
}

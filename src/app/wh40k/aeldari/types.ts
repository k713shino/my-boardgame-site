// src/app/wh40k/aeldari/types.ts
// アエルダリ リファレンス用の拡張型定義

import type { UnitRole } from "../types";

export type WeaponType = "Ranged" | "Melee";

export interface Weapon {
  name: string;
  nameJa: string;
  type: WeaponType;
  range: string;
  A: string | number;
  skill: string;
  S: string | number;
  AP: number;
  D: string | number;
  abilities: string[];
}

export interface Ability {
  name: string;
  nameJa: string;
  desc: string;
}

export interface AeldariUnit {
  id: string;
  name: string;
  nameJa: string;
  pts: number;
  role: UnitRole;
  categories: string[];
  stats: {
    M: string;
    T: number;
    Sv: string;
    W: number;
    Ld: string;
    OC: number;
  };
  /** スペシャルセーヴ（省略可） */
  invuln?: string;
  weapons: Weapon[];
  abilities: Ability[];
  keywords: string[];
  fluff: string;
}

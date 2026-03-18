/**
 * デタッチメントによって追加でBATTLELINEキーワードを得るユニットのマッピング
 *
 * ソース: BSData/wh40k-10e (.catファイルのデタッチメントルール)
 * 対象: デフォルトのroleがBattlelineでないユニットのみ記載
 *
 * 構造: { [factionId]: { [detachmentName]: string[] (unit ids) } }
 */
export const DETACHMENT_BATTLELINES: Record<string, Record<string, string[]>> = {
  aeldari_craftworlds: {
    // Windrider Host: ^^Windriders^^ units gain the ^^Battleline^^ keyword
    "Windrider Host": ["windriders"],
    // Spirit Conclave: Wraithblades and Wraithguard gain the Battleline keyword
    "Spirit Conclave": ["wraithblades", "wraithguard"],
    // Ghosts of the Webway: ^^Troupe^^ units gain the ^^Battleline^^ keyword
    "Ghosts of the Webway": ["troupe"],
    // Serpent's Brood: ^^Troupe^^ units gain the ^^Battleline^^ keyword
    "Serpent's Brood": ["troupe"],
  },
  drukhari: {
    // Ghosts of the Webway: ^^Troupe^^ units gain the ^^Battleline^^ keyword
    "Ghosts of the Webway": ["troupe"],
    // Serpent's Brood: ^^Troupe^^ units gain the ^^Battleline^^ keyword
    "Serpent's Brood": ["troupe"],
  },
  ynnari: {
    // Windrider Host: ^^Windriders^^ units gain the ^^Battleline^^ keyword
    "Windrider Host": ["windriders"],
    // Spirit Conclave: Wraithblades and Wraithguard gain the Battleline keyword
    "Spirit Conclave": ["wraithblades", "wraithguard"],
    // Ghosts of the Webway: ^^Troupe^^ units gain the ^^Battleline^^ keyword
    "Ghosts of the Webway": ["troupe"],
    // Serpent's Brood: ^^Troupe^^ units gain the ^^Battleline^^ keyword
    "Serpent's Brood": ["troupe"],
  },
  death_guard: {
    // Shamblerot Vectorium: ^^Poxwalkers^^ gain the ^^Battleline^^ keyword
    "Shamblerot Vectorium": ["poxwalkers"],
  },
  thousand_sons: {
    // Warpmeld Pact: ^^Tzaangors^^ have the Battleline keyword
    "Warpmeld Pact": ["tzaangors"],
  },
  astra_militarum: {
    // Bridgehead Strike: Tempestus Scions gain the Battleline keyword
    // (条件: Militarum Tempestus Officer がWarlordの場合)
    "Bridgehead Strike": ["tempestus_scions"],
  },
  imperial_knights: {
    // Spearhead-At-Arms: Armiger models gain the Battleline keyword
    "Spearhead-At-Arms": [
      "armiger_warglaive",
      "armiger_helverin",
      "armiger_moirax",
    ],
  },
  space_marines: {
    // Company of Hunters: ^^Outrider Squad^^ gain the ^^Battleline^^ keyword
    "Company of Hunters": ["outrider_squad"],
  },
  tyranids: {
    // Warrior Bioform Onslaught: Tyranid Warriors (both) gain the Battleline keyword
    "Warrior Bioform Onslaught": [
      "tyranid_warriors_with_ranged_bio_weapons",
      "tyranid_warriors_with_melee_bio_weapons",
    ],
  },
  orks: {
    // Dread Mob: ^^Gretchin^^ gain the ^^Battleline^^ keyword
    "Dread Mob": ["gretchin"],
    // Taktikal Brigade: ^^Stormboyz^^ gain the ^^Battleline^^ keyword
    "Taktikal Brigade": ["stormboyz"],
  },
  chaos_knights: {
    // Houndpack Lance: War Dog units have the Battleline keyword
    "Houndpack Lance": [
      "war_dog_executioner",
      "war_dog_stalker",
      "war_dog_karnivore",
      "war_dog_brigand",
      "war_dog_huntsman",
      "war_dog_moirax",
    ],
  },
};

/**
 * 指定した陣営・デタッチメントで追加Battlelaine扱いになるユニットIDセットを返す
 */
export function getDetachmentBattlelineIds(
  factionId: string,
  detachmentName: string
): Set<string> {
  const ids = DETACHMENT_BATTLELINES[factionId]?.[detachmentName] ?? [];
  return new Set(ids);
}

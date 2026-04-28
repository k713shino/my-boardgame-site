export type KeywordCategory = "weapon" | "unit";

export type Keyword = {
  id: string;
  name: string;
  nameJa: string;
  category: KeywordCategory;
  summary: string;
  detail: string;
};

export const CATEGORY_LABELS: Record<KeywordCategory, string> = {
  weapon: "武器アビリティ",
  unit: "ユニットアビリティ",
};

export const CATEGORY_COLORS: Record<KeywordCategory, string> = {
  weapon: "border-orange-400/60 bg-orange-500/10 text-orange-600 dark:text-orange-400",
  unit: "border-sky-400/60 bg-sky-500/10 text-sky-600 dark:text-sky-400",
};

export const KEYWORDS: Keyword[] = [
  // ── 武器アビリティ ──────────────────────────────────────
  {
    id: "assault",
    name: "Assault",
    nameJa: "アサルト",
    category: "weapon",
    summary: "全力移動後も射撃可能",
    detail:
      "装備者が属するユニットが全力移動を行なっていた場合でも、このターンの射撃フェイズ中に射撃を行なえる。ただしアサルト武器による攻撃のみ解決できる。",
  },
  {
    id: "rapid-fire",
    name: "Rapid Fire X",
    nameJa: "ラピッドファイア X",
    category: "weapon",
    summary: "半射程以内で攻撃回数＋X",
    detail:
      "射程の半分以内にいるユニットを攻撃対象にした場合、武器の攻撃回数が「X」回増加する。",
  },
  {
    id: "torrent",
    name: "Torrent",
    nameJa: "噴射",
    category: "weapon",
    summary: "自動命中（ヒットロール不要）",
    detail: "噴射武器による攻撃は対象に自動的にヒットする。",
  },
  {
    id: "twin-linked",
    name: "Twin-linked",
    nameJa: "ツインリンク",
    category: "weapon",
    summary: "ウーンズロールをリロール可能",
    detail: "この武器による攻撃は、ウーンズロールをリロールできる。",
  },
  {
    id: "pistol",
    name: "Pistol",
    nameJa: "ピストル",
    category: "weapon",
    summary: "敵の接敵範囲内でも射撃可能",
    detail:
      "ピストルを装備している兵が1体以上いるユニットは、敵ユニットの接敵範囲内にいる場合にも射撃を行なえる。その場合ピストルによる射撃のみ解決でき、接敵範囲内にいる敵ユニット1個以上のみを攻撃対象に選択できる。",
  },
  {
    id: "heavy",
    name: "Heavy",
    nameJa: "ヘヴィ",
    category: "weapon",
    summary: "静止状態ならヒットロール＋1",
    detail:
      "ヘヴィ武器で攻撃を行なう際、装備者が属するユニットがこのターン中に静止状態である場合、その攻撃のヒットロールは+1の修正を受ける。",
  },
  {
    id: "indirect-fire",
    name: "Indirect Fire",
    nameJa: "間接射撃",
    category: "weapon",
    summary: "視認なしで射撃可能（ヒット-1、遮蔽ボーナス付与）",
    detail:
      "攻撃側の兵から攻撃対象が視認されていない場合でも攻撃を行なえる。攻撃対象のいかなる兵も視認されていない場合、ヒットロールに-1の修正を受け、さらに攻撃対象は遮蔽物ボーナスを得る。",
  },
  {
    id: "lethal-hits",
    name: "Lethal Hits",
    nameJa: "会心ヒット",
    category: "weapon",
    summary: "クリティカルヒットで自動ウーンズ",
    detail:
      "この武器の攻撃がクリティカルヒット（修正前の出目6）となった場合、その攻撃は対象に自動的にウーンズする（ウーンズロール不要）。",
  },
  {
    id: "devastating-wounds",
    name: "Devastating Wounds",
    nameJa: "会心ウーンズ",
    category: "weapon",
    summary: "クリティカルウーンズでダメージ量分の致命的ダメージに変換",
    detail:
      "クリティカルウーンズ（修正前の出目6のウーンズロール）が出た場合、その攻撃は通常のダメージの代わりに、武器のダメージ量に等しい数の致命的ダメージを対象に与えて攻撃手順が終了する。通常のセーヴィングは不可（スペシャルセーヴ値は有効）。",
  },
  {
    id: "sustained-hits",
    name: "Sustained Hits X",
    nameJa: "連続命中 X",
    category: "weapon",
    summary: "クリティカルヒットで追加X回ヒット",
    detail:
      "クリティカルヒット（修正前の出目6）が出た場合、その攻撃は攻撃対象に追加で「X」回のヒットをもたらす。",
  },
  {
    id: "lance",
    name: "Lance",
    nameJa: "ランス",
    category: "weapon",
    summary: "突撃後ウーンズロール＋1",
    detail:
      "この武器で攻撃を行なう際、装備者がこのターン中に突撃移動を行なっていたならば、その攻撃のウーンズロール結果は+1の修正を受ける。",
  },
  {
    id: "precision",
    name: "Precision",
    nameJa: "精密攻撃",
    category: "weapon",
    summary: "合流ユニット内のキャラクターへ攻撃を割り振れる",
    detail:
      "この武器による攻撃が合流ユニットに対するウーンズロールに成功した際、そのユニット内のキャラクターの兵が視認されているならば、攻撃側プレイヤーはそのキャラクターに攻撃を割り振ることを選択できる。",
  },
  {
    id: "blast",
    name: "Blast",
    nameJa: "ブラスト",
    category: "weapon",
    summary: "攻撃対象の兵数5体ごとに攻撃回数＋1",
    detail:
      "攻撃回数を決定する際、攻撃対象ユニット内の兵5体につき（端数切り捨て）、武器の攻撃回数が+1の修正を受ける。味方ユニットの接敵範囲内にいる敵に対しては使用不可。",
  },
  {
    id: "melta",
    name: "Melta X",
    nameJa: "メルタ X",
    category: "weapon",
    summary: "半射程以内でダメージ量＋X",
    detail:
      "この武器の射程の半分以内にいる攻撃対象に攻撃を行なった場合、その攻撃のダメージ量が「X」ポイント増加する。",
  },
  {
    id: "hazardous",
    name: "Hazardous",
    nameJa: "暴発",
    category: "weapon",
    summary: "使用後、出目1で装備者撃破（または致命的ダメージ3）",
    detail:
      "ユニットが射撃もしくは白兵戦を宣言するごとに、使用した暴発武器の数だけD6をロールする。出目1が出るたびに暴発武器を装備している兵1体が撃破される（キャラクター・モンスター・ビークルは代わりに3ポイントの致命的ダメージを受ける）。",
  },
  {
    id: "ignores-cover",
    name: "Ignores Cover",
    nameJa: "遮蔽無効",
    category: "weapon",
    summary: "攻撃対象は遮蔽物ボーナスを得られない",
    detail:
      "この武器による攻撃に対して、攻撃対象は遮蔽物ボーナスを得ることができない。",
  },
  // ── ユニットアビリティ ──────────────────────────────────
  {
    id: "invuln-save",
    name: "Invulnerable Save",
    nameJa: "スペシャルセーヴ値 X+",
    category: "unit",
    summary: "APの影響を受けないセーヴィング",
    detail:
      "攻撃が割り振られるたびに、通常のアーマーセーヴ値またはスペシャルセーヴ値のどちらを使うか選択できる。スペシャルセーヴィングは攻撃の貫通値（AP）による修正を受けない。",
  },
  {
    id: "feel-no-pain",
    name: "Feel No Pain X+",
    nameJa: "痛みを知らぬ者 X+",
    category: "unit",
    summary: "負傷限界が減少するたびX+のロールで無効化",
    detail:
      "このアビリティを持つ兵がダメージ（致命的ダメージを含む）を受けて負傷限界が1ポイント減少することになるたびにD6を1個ロールし、ロール結果が「X」以上である場合、そのダメージは無効化され負傷限界は失われない。",
  },
  {
    id: "deadly-demise",
    name: "Deadly Demise X",
    nameJa: "恐るべき最期 X",
    category: "unit",
    summary: "撃破時D6ロール、6で周囲にXポイントの致命的ダメージ",
    detail:
      "この兵が撃破されたとき、バトルから除外する前にD6を1個ロールする。ロール結果が6ならば、この兵の6mv以内にいる各ユニットはそれぞれ「X」ポイントの致命的ダメージを受ける。",
  },
  {
    id: "stealth",
    name: "Stealth",
    nameJa: "隠密能力",
    category: "unit",
    summary: "このユニットへの射撃のヒットロールに−1",
    detail:
      "ユニット内のすべての兵がこのアビリティを持っている場合、そのユニットに対する射撃攻撃はヒットロール結果に-1の修正を受ける。",
  },
  {
    id: "deep-strike",
    name: "Deep Strike",
    nameJa: "縦深攻撃",
    category: "unit",
    summary: "予備戦力として配置し、移動フェイズに敵から9mv以上離れた地点に登場",
    detail:
      "戦闘陣形の宣言ステップで、ユニット内のすべての兵がこのアビリティを有している場合、そのユニットを予備戦力として配置できる。任意の自軍側移動フェイズの増援ステップ中に、あらゆる敵兵から水平方向に9mvより遠く離れた戦場の任意の地点に配置できる。",
  },
  {
    id: "scouts",
    name: "Scouts X\"",
    nameJa: "斥候 Xmv",
    category: "unit",
    summary: "第1バトルラウンド先攻ターン前に最大Xmvの通常移動",
    detail:
      "ユニット内のすべての兵がこのアビリティを有する場合、第1バトルラウンド開始時・先攻ターン開始前に最大Xmvの通常移動を行なえる。移動はあらゆる敵兵から9mvより遠く離れた地点で終了しなければならない。",
  },
  {
    id: "infiltrators",
    name: "Infiltrators",
    nameJa: "浸透戦術",
    category: "unit",
    summary: "敵初期配置ゾーンおよび敵から9mv以上の任意の地点に配置可能",
    detail:
      "初期配置中、ユニット内のすべての兵がこのアビリティを有している場合、そのユニットを敵軍側初期配置ゾーンおよびあらゆる敵兵から水平方向に9mvより遠く離れた任意の地点に配置できる。",
  },
  {
    id: "leader",
    name: "Leader",
    nameJa: "指揮官",
    category: "unit",
    summary: "護衛ユニットに合流し、合流ユニットを形成",
    detail:
      "このキャラクター・ユニットは、データシートに記載された護衛ユニット1個に合流して合流ユニットを形成できる。合流ユニットはルール上1個のユニットとして扱われ、合流ユニット内のキャラクターの兵は最後の護衛が撃破されるまで攻撃対象に選択されない。",
  },
  {
    id: "fights-first",
    name: "Fights First",
    nameJa: "先手",
    category: "unit",
    summary: "白兵戦フェイズの先手ステップで戦闘を行なう",
    detail:
      "ユニット内のすべての兵がこのアビリティを有しており、白兵戦を行なえる状態である場合、このユニットは白兵戦フェイズの先手ステップ中に白兵戦を行なう（通常のユニットより先に戦闘できる）。",
  },
];

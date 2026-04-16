type GVGame = {
  id: string;
  title: string;
  image_url: string | null;
  player_count_min: number | null;
  player_count_max: number | null;
  play_time: number | null;
  category: string | null;
  status: "owned" | "wishlist" | "lent";
  play_status: "played" | "interested" | "favorite" | null;
};

const STATUS_LABEL: Record<string, string> = {
  owned: "所持",
  wishlist: "欲しい",
  lent: "貸出中",
};

const STATUS_COLOR: Record<string, string> = {
  owned: "border-teal-300/60 text-teal-500 dark:border-teal-500/40",
  wishlist: "border-amber-300/60 text-amber-500 dark:border-amber-500/40",
  lent: "border-rose-300/60 text-rose-500 dark:border-rose-500/40",
};

const PLAY_STATUS_LABEL: Record<string, string> = {
  played: "プレイ済み",
  interested: "興味あり",
  favorite: "お気に入り",
};

async function getGameVaultGames(): Promise<GVGame[]> {
  const url = process.env.GAMEVAULT_API_URL;
  if (!url) return [];
  try {
    const res = await fetch(url, { next: { revalidate: 60 } });
    if (!res.ok) return [];
    const json = await res.json();
    return Array.isArray(json.games) ? json.games : [];
  } catch {
    return [];
  }
}

function formatPlayers(min?: number | null, max?: number | null) {
  if (min && max) return min + "–" + max + "人";
  if (min) return String(min) + "人";
  if (max) return String(max) + "人";
  return "人数不明";
}

function formatPlayTime(minutes?: number | null) {
  if (!minutes) return "時間不明";
  return String(minutes) + "分";
}

export default async function GamesPage() {
  const games = await getGameVaultGames();

  return (
    <div className="space-y-8">
      <header className="flex flex-col items-center gap-3 text-center sm:items-start sm:text-left">
        <span className="text-[0.75rem] font-semibold uppercase tracking-[0.28em] sm:tracking-[0.35em] text-indigo-500">
          Collection
        </span>
        <h1 className="text-3xl font-black uppercase tracking-tight text-(--fg-body)">
          ゲームコレクション
        </h1>
        <p className="max-w-2xl text-sm text-muted sm:text-base">
          所持・プレイしているボードゲームの概要です。気になるタイトルはGameVaultで詳細をチェック。
        </p>
      </header>
      <ul className="grid gap-4 sm:grid-cols-2">
        {games.map((g) => (
          <li key={g.id}>
            <div className="group surface-card flex h-full flex-col gap-4 rounded-2xl px-5 py-5 sm:px-6 sm:py-6">
              <div className="flex items-start gap-4">
                {g.image_url ? (
                  <img
                    src={g.image_url}
                    alt={g.title}
                    className="h-16 w-16 shrink-0 rounded-xl object-cover"
                  />
                ) : null}
                <div className="flex min-w-0 flex-1 flex-col gap-1">
                  <h2 className="text-xl font-bold tracking-tight text-(--fg-body) sm:text-2xl">
                    {g.title}
                  </h2>
                  {g.category ? (
                    <span className="text-xs text-muted">{g.category}</span>
                  ) : null}
                </div>
              </div>
              <div className="flex flex-wrap gap-2 text-[0.7rem] font-semibold uppercase tracking-[0.2em]">
                <span className="rounded-full border border-rose-300/60 px-2 py-1 text-rose-500 dark:border-rose-500/40">
                  {formatPlayers(g.player_count_min, g.player_count_max)}
                </span>
                <span className="rounded-full border border-indigo-300/60 px-2 py-1 text-indigo-500 dark:border-indigo-500/40">
                  {formatPlayTime(g.play_time)}
                </span>
                <span
                  className={`rounded-full border px-2 py-1 ${STATUS_COLOR[g.status] ?? ""}`}
                >
                  {STATUS_LABEL[g.status] ?? g.status}
                </span>
                {g.play_status ? (
                  <span className="rounded-full border border-violet-300/60 px-2 py-1 text-violet-500 dark:border-violet-500/40">
                    {PLAY_STATUS_LABEL[g.play_status] ?? g.play_status}
                  </span>
                ) : null}
              </div>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}

export type GVGame = {
  id: string;
  title: string;
  image_url: string | null;
  player_count_min: number | null;
  player_count_max: number | null;
  play_time: number | null;
  category: string | null;
  status: "owned" | "wishlist" | "lent";
  play_status: "played" | "interested" | "favorite" | null;
  memo?: string | null;
};

const BASE = process.env.GAMEVAULT_API_URL?.replace(/\/+$/, "") ??
  "https://gamevault-beta.vercel.app/api/public/games";

export async function fetchAllGVGames(): Promise<GVGame[]> {
  try {
    const res = await fetch(BASE, { cache: "no-store" });
    if (!res.ok) return [];
    const json = await res.json();
    return Array.isArray(json.games) ? json.games : [];
  } catch {
    return [];
  }
}

export async function fetchGVGameById(id: string): Promise<GVGame | null> {
  try {
    const res = await fetch(`${BASE}/${id}`, { cache: "no-store" });
    if (!res.ok) return null;
    const json = await res.json();
    return json.game ?? null;
  } catch {
    return null;
  }
}

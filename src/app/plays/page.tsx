import Link from "next/link";
import { getAllPlays } from "@/lib/content";
import { fetchRemotePlays } from "@/lib/remote";

type PlayListItem = {
  id: string;
  date: string;
  gameId: string;
  tags?: string[];
};

function toDateString(value: unknown): string {
  if (!value) return "";
  if (typeof value === "string") return value;
  if (value instanceof Date) return value.toISOString().slice(0, 10);
  return String(value);
}

export default async function PlaysPage() {
  const localPlays = getAllPlays().map<PlayListItem>(({ id, date, gameId, tags }) => ({
    id,
    date,
    gameId,
    tags,
  }));

  let remotePlays: PlayListItem[] = [];
  try {
    const remote = await fetchRemotePlays({ page: 1, size: 200 });
    remotePlays = remote.items.map((item) => ({
      id: String(item.id),
      date: toDateString(item.date),
      gameId: item.gameId,
      tags: item.tags,
    }));
  } catch (err) {
    console.warn("Failed to fetch remote plays", err);
  }

  const mergedMap = new Map<string, PlayListItem>();
  [...localPlays, ...remotePlays].forEach((play) => {
    if (!play.id) return;
    mergedMap.set(play.id, play);
  });

  const plays = Array.from(mergedMap.values()).sort((a, b) => b.date.localeCompare(a.date));

  return (
    <div>
      <div className="mb-4 flex items-center justify-between">
        <h1 className="text-2xl font-bold">Plays</h1>
        <Link href="/plays/new" className="underline">
          + 新規追加
        </Link>
      </div>
      <ul className="space-y-2">
        {plays.map((pl) => (
          <li key={pl.id}>
            <Link href={`/plays/${encodeURIComponent(pl.id)}`} className="underline">
              {pl.date} / {pl.gameId}
            </Link>
            {pl.tags?.length ? (
              <span className="text-sm text-gray-500"> — {pl.tags.join(", ")}</span>
            ) : null}
          </li>
        ))}
      </ul>
    </div>
  );
}

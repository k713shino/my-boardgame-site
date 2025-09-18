import Link from "next/link";
import { getAllGames } from "@/lib/content";

export default function GamesPage() {
  const games = getAllGames();
  return (
    <div>
      <h1 className="text-2xl font-bold mb-4">Games</h1>
      <ul className="space-y-2">
        {games.map(g => (
          <li key={g.id}>
            <Link href={`/games/${g.id}`} className="underline">{g.title}</Link>
            <span className="text-gray-500 text-sm">（{g.minPlayers ?? "?"}–{g.maxPlayers ?? "?"}人 / {g.playTime ?? "?"}分）</span>
          </li>
        ))}
      </ul>
    </div>
  );
}

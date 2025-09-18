import Link from "next/link";
import { getAllPlays } from "@/lib/content";

export default function PlaysPage() {
  const plays = getAllPlays();
  return (
    <div>
      <div className="flex items-center justify-between mb-4">
        <h1 className="text-2xl font-bold">Plays</h1>
        <Link href="/plays/new" className="underline">+ 新規追加</Link>
      </div>

      <ul className="space-y-2">
        {plays.map((pl) => (
          <li key={pl.id}>
            <Link href={`/plays/${pl.id}`} className="underline">
              {pl.date} / {pl.gameId}
            </Link>
            {pl.tags?.length ? (
              <span className="text-gray-500 text-sm"> — {pl.tags.join(", ")}</span>
            ) : null}
          </li>
        ))}
      </ul>
    </div>
  );
}

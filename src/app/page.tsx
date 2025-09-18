import Link from "next/link";
import { getAllPosts, getAllPlays, getAllGames } from "@/lib/content";

export default function Home() {
  const posts = getAllPosts().slice(0,3);
  const plays = getAllPlays().slice(0,5);
  const games = getAllGames().slice(0,6);

  return (
    <div className="space-y-10">
      <section>
        <h2 className="text-xl font-semibold mb-3">最新記事</h2>
        <ul className="list-disc pl-5">
          {posts.map(p => (
            <li key={p.slug}>
              <Link href={`/posts/${p.slug}`}>{p.title}</Link> <span className="text-gray-500 text-sm">({p.date})</span>
            </li>
          ))}
        </ul>
      </section>

      <section>
        <h2 className="text-xl font-semibold mb-3">最近のプレイ</h2>
        <ul className="list-disc pl-5">
          {plays.map(pl => (
            <li key={pl.id}>
              <Link href={`/plays/${pl.id}`}>{pl.date} / {pl.gameId}</Link>
            </li>
          ))}
        </ul>
      </section>

      <section>
        <h2 className="text-xl font-semibold mb-3">コレクション</h2>
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
          {games.map(g => (
            <Link key={g.id} href={`/games/${g.id}`} className="rounded border p-3 hover:bg-gray-50">
              <div className="font-medium">{g.title}</div>
              {g.tags?.length ? <div className="text-xs text-gray-500">{g.tags.join(", ")}</div> : null}
            </Link>
          ))}
        </div>
      </section>
    </div>
  );
}

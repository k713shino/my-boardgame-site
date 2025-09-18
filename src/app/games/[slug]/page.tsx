import { notFound } from "next/navigation";
import { getGameById } from "@/lib/content";

export default function GameDetail({ params }: { params: { slug: string } }) {
  const game = getGameById(params.slug);
  if (!game) return notFound();
  return (
    <article className="prose max-w-none">
      <h1>{game.title}</h1>
      <ul>
        <li>人数: {game.minPlayers}–{game.maxPlayers}</li>
        <li>時間: {game.playTime}分</li>
        <li>重さ: {game.weight ?? "-"}</li>
        <li>タグ: {game.tags?.join(", ")}</li>
      </ul>
      <hr />
      <div>{game.body}</div>
    </article>
  );
}

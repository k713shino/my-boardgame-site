import { notFound } from "next/navigation";
import Image from "next/image";
import { getGameById } from "@/lib/content";
import MarkdownContent from "@/components/MarkdownContent";

export default function GameDetail({ params }: { params: { slug: string } }) {
  const game = getGameById(params.slug);
  if (!game) return notFound();
  return (
    <article className="max-w-none">
      <h1>{game.title}</h1>
      {game.image ? (
        <div className="my-6">
          <Image
            src={game.image}
            alt={game.title}
            width={960}
            height={540}
            className="h-auto w-full rounded-xl border border-slate-200 shadow-sm"
            priority
          />
        </div>
      ) : null}
      <ul>
        <li>人数: {game.minPlayers}–{game.maxPlayers}</li>
        <li>時間: {game.playTime}分</li>
        <li>重さ: {game.weight ?? "-"}</li>
        <li>タグ: {game.tags?.join(", ")}</li>
      </ul>
      <hr className="my-6" />
      <MarkdownContent source={game.body} />
    </article>
  );
}



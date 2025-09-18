import { notFound } from "next/navigation";
import { getPlayById } from "@/lib/content";

export default function PlayDetail({ params }: { params: { id: string } }) {
  const play = getPlayById(params.id);
  if (!play) return notFound();

  return (
    <article className="prose max-w-none">
      <h1>{play.date} / {play.gameId}</h1>
      <ul>
        <li>場所: {play.location ?? "-"}</li>
        <li>タグ: {(play.tags ?? []).join(", ") || "-"}</li>
      </ul>

      {play.players?.length ? (
        <div>
          <h2>プレイヤー</h2>
          <ul>
            {play.players.map((p, i) => (
              <li key={i}>
                {p.name} {p.win ? "🏆" : ""} {p.score ?? ""}
              </li>
            ))}
          </ul>
        </div>
      ) : null}

      <hr />
      <div>{play.body}</div>
    </article>
  );
}

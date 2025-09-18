import { getAllPosts, getAllGames, getAllPlays } from "@/lib/content";
import { SearchPageClient, type SearchRow } from "@/components/SearchPageClient";

export default function SearchPage() {
  const posts = getAllPosts().map((p): SearchRow => ({
    type: "post",
    title: p.title,
    slug: p.slug,
    date: p.date,
    tags: p.tags,
    category: p.category,
  }));

  const games = getAllGames().map((g): SearchRow => ({
    type: "game",
    title: g.title,
    id: g.id,
    tags: g.tags,
  }));

  const plays = getAllPlays().map((pl): SearchRow => ({
    type: "play",
    id: pl.id,
    date: pl.date,
    gameId: pl.gameId,
    tags: pl.tags,
  }));

  const dataset: SearchRow[] = [...posts, ...games, ...plays];

  return <SearchPageClient dataset={dataset} />;
}

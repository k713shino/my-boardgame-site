import type { MetadataRoute } from "next";
import { getAllPosts, getAllGames, getAllPlays } from "@/lib/content";

const BASE_URL = "https://my-boardgame-site.vercel.app";

export default function sitemap(): MetadataRoute.Sitemap {
  const posts = getAllPosts();
  const games = getAllGames();
  const plays = getAllPlays();

  const staticPages: MetadataRoute.Sitemap = [
    {
      url: BASE_URL,
      lastModified: new Date(),
      changeFrequency: "weekly",
      priority: 1.0,
    },
    {
      url: `${BASE_URL}/games`,
      lastModified: new Date(),
      changeFrequency: "weekly",
      priority: 0.8,
    },
    {
      url: `${BASE_URL}/posts`,
      lastModified: new Date(),
      changeFrequency: "daily",
      priority: 0.8,
    },
    {
      url: `${BASE_URL}/plays`,
      lastModified: new Date(),
      changeFrequency: "weekly",
      priority: 0.7,
    },
    {
      url: `${BASE_URL}/events`,
      lastModified: new Date(),
      changeFrequency: "weekly",
      priority: 0.7,
    },
  ];

  const postPages: MetadataRoute.Sitemap = posts.map((post) => ({
    url: `${BASE_URL}/posts/${post.slug}`,
    lastModified: post.date ? new Date(post.date) : new Date(),
    changeFrequency: "monthly" as const,
    priority: 0.6,
  }));

  const gamePages: MetadataRoute.Sitemap = games.map((game) => ({
    url: `${BASE_URL}/games/${game.id}`,
    lastModified: new Date(),
    changeFrequency: "monthly" as const,
    priority: 0.6,
  }));

  const playPages: MetadataRoute.Sitemap = plays.map((play) => ({
    url: `${BASE_URL}/plays/${play.id}`,
    lastModified: play.date ? new Date(play.date) : new Date(),
    changeFrequency: "never" as const,
    priority: 0.4,
  }));

  return [...staticPages, ...postPages, ...gamePages, ...playPages];
}

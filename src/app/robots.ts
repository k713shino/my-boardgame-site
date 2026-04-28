import type { MetadataRoute } from "next";

const BASE_URL = "https://my-boardgame-site.vercel.app";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: "*",
        allow: "/",
        disallow: ["/admin/", "/api/", "/plays/new"],
      },
    ],
    sitemap: `${BASE_URL}/sitemap.xml`,
  };
}

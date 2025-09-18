import Link from "next/link";
import { getAllPosts } from "@/lib/content";

export default function PostsPage() {
  const posts = getAllPosts();
  return (
    <div>
      <h1 className="text-2xl font-bold mb-4">Blog</h1>
      <ul className="space-y-2">
        {posts.map((p) => (
          <li key={p.slug}>
            <Link href={`/posts/${p.slug}`} className="underline">
              {p.title}
            </Link>
            <span className="text-gray-500 text-sm"> ({p.date})</span>
            {p.tags?.length ? (
              <span className="text-gray-500 text-sm"> — {p.tags.join(", ")}</span>
            ) : null}
          </li>
        ))}
      </ul>
    </div>
  );
}

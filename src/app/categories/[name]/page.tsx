import Link from "next/link";
import { getAllPosts } from "@/lib/content";

export default function CategoryPage({ params }: { params: { name: string } }) {
  const name = decodeURIComponent(params.name);
  const posts = getAllPosts().filter(p => p.category === name);
  return (
    <div>
      <h1 className="text-2xl font-bold mb-4">カテゴリ: {name}</h1>
      <ul className="list-disc pl-5">
        {posts.map(p => (
          <li key={p.slug}>
            <Link href={`/posts/${p.slug}`} className="underline">{p.title}</Link>
            <span className="text-gray-500 text-sm"> ({p.date})</span>
          </li>
        ))}
      </ul>
    </div>
  );
}

import Link from "next/link";
import { getAllCategories } from "@/lib/content";

export default function Categories() {
  const cats = getAllCategories();
  return (
    <div>
      <h1 className="text-2xl font-bold mb-4">カテゴリ</h1>
      <ul className="grid grid-cols-2 sm:grid-cols-3 gap-3">
        {cats.map(c => (
          <li key={c}><Link className="underline" href={`/categories/${encodeURIComponent(c)}`}>{c}</Link></li>
        ))}
      </ul>
    </div>
  );
}

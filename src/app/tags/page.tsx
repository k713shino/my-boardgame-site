import Link from "next/link";
import { getAllTags } from "@/lib/content";

export default function Tags() {
  const tags = getAllTags();
  return (
    <div>
      <h1 className="text-2xl font-bold mb-4">タグ</h1>
      <div className="flex flex-wrap gap-2">
        {tags.map(t => (
          <Link key={t} href={`/tags/${encodeURIComponent(t)}`} className="px-2 py-1 text-sm border rounded">{t}</Link>
        ))}
      </div>
    </div>
  );
}

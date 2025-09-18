import { notFound } from "next/navigation";
import { getPostBySlug } from "@/lib/content";

export default function PostDetail({ params }: { params: { slug: string } }) {
  const post = getPostBySlug(params.slug);
  if (!post) return notFound();

  return (
    <article className="prose max-w-none">
      <h1>{post.title}</h1>
      <div className="text-sm text-gray-500">
        {post.date}{post.category ? ` / ${post.category}` : ""}
      </div>
      <hr />
      <div>{post.body}</div>
    </article>
  );
}

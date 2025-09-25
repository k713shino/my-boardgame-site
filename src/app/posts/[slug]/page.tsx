import { notFound } from "next/navigation";
import { getPostBySlug } from "@/lib/content";
import MarkdownContent from "@/components/MarkdownContent";

export default function PostDetail({ params }: { params: { slug: string } }) {
  const post = getPostBySlug(params.slug);
  if (!post) return notFound();

  return (
    <article className="max-w-none">
      <h1 className="text-3xl font-semibold">{post.title}</h1>
      <div className="mt-2 text-sm text-gray-500">
        {post.date}
        {post.category ? ` / ${post.category}` : ""}
      </div>
      <hr className="my-6" />
      <MarkdownContent source={post.body} />
    </article>
  );
}

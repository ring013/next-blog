import Link from "next/link";
import { notFound } from "next/navigation";
import { getAllSlugs, getPostBySlug } from "@/lib/markdown";
import { formatJa } from "@/lib/utils";
import Image from "next/image";

export const revalidate = 3600; // SSG + ISR

// 事前に静的生成するパス
export async function generateStaticParams() {
  return getAllSlugs().map((slug) => ({ slug }));
}

export default async function PostPage({ params }: { params: { slug: string } }) {
  const post = await getPostBySlug(params.slug);
  if (!post || !post.published) notFound();

  return (
    <article className="max-w-3xl mx-auto p-4">
      {post.coverImage && (
        <Image
        src={post.coverImage}
        alt={post.title}
        width={1600}
        height={480}
        className="w-full h-60 md:h-80 object-cover rounded mb-6"
      />      
      )}

      <h1 className="text-4xl font-extrabold mb-2">{post.title}</h1>
      <p className="text-gray-300 mb-4">{formatJa(post.date)} ・ {post.author}</p>

      <div className="mb-4 flex flex-wrap gap-2">
        {post.tags.map((t) => (
          <Link
            key={t}
            href={`/blog/tag/${t}`}
            className="text-xs px-2 py-0.5 rounded bg-blue-100 text-blue-800"
          >
            #{t}
          </Link>
        ))}
      </div>

      {/* ダーク背景でも読みやすくするため prose を反転 */}
      <div
        className="prose prose-zinc prose-invert max-w-none"
        dangerouslySetInnerHTML={{ __html: post.contentHtml }}
      />
    </article>
  );
}

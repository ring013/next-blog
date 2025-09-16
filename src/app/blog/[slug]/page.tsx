import Link from "next/link";
import Image from "next/image";
import { notFound } from "next/navigation";
import { getAllSlugs, getPostBySlug } from "@/lib/markdown";
import { formatJa } from "@/lib/utils";
import TableOfContents from "@/components/blog/TableOfContents";

export const revalidate = 3600;

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

      <h1 className="text-4xl font-extrabold mb-2 text-white">{post.title}</h1>
      <p className="text-white/90 mb-4">{formatJa(post.date)} ・ {post.author}</p>

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

      {/* ここで目次を表示（本文中の h2/h3 を自動で拾う） */}
      <TableOfContents target="#post-article" />

      {/* 本文：見出しには rehype-slug で id が付与済み */}
      <div
        id="post-article"
        className="prose prose-zinc prose-invert max-w-none"
        dangerouslySetInnerHTML={{ __html: post.contentHtml }}
      />
    </article>
  );
}

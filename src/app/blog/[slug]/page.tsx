import Link from "next/link";
import Image from "next/image";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { getAllSlugs, getPostBySlug } from "@/lib/markdown";
import { formatJa } from "@/lib/utils";
import TableOfContents from "@/components/blog/TableOfContents";

export const revalidate = 3600;

// 静的生成するパス
export async function generateStaticParams() {
  return getAllSlugs().map((slug) => ({ slug }));
}

// 記事ごとの SEO メタデータ
export async function generateMetadata(
  { params }: { params: { slug: string } }
): Promise<Metadata> {
  const post = await getPostBySlug(params.slug);
  if (!post) return {};

  const base = process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000";
  const url = `${base}/blog/${post.slug}`;
  const og = `${base}/api/og?title=${encodeURIComponent(post.title)}`;

  return {
    title: post.title,
    description: post.excerpt || `${post.title} | Gira'sBlog`,
    alternates: { canonical: url },
    openGraph: {
      title: post.title,
      description: post.excerpt || "",
      url,
      type: "article",
      images: [{ url: og }],
    },
    twitter: {
      card: "summary_large_image",
      title: post.title,
      description: post.excerpt || "",
      images: [og],
    },
  };
}

export default async function PostPage({
  params,
}: {
  params: { slug: string };
}) {
  const post = await getPostBySlug(params.slug);
  if (!post || !post.published) notFound();

  return (
    <article className="max-w-3xl mx-auto p-4 md:p-6">
      {post.coverImage && (
        <div
          className="relative w-full overflow-hidden rounded mb-6"
          style={{ height: 320 }}
        >
          <Image
            src={post.coverImage}
            alt={post.title}
            fill
            className="object-cover"
            sizes="(max-width: 768px) 100vw, 960px"
            priority
          />
        </div>
      )}

      <h1 className="text-4xl font-extrabold mb-2">{post.title}</h1>

      <p className="text-white/80 mb-4">
        {formatJa(post.date)} ・ {post.author}
        {typeof post.readingMinutes === "number" && (
          <span className="ml-2 text-white/60">
            （約 {post.readingMinutes} 分）
          </span>
        )}
      </p>

      <div className="mb-4 flex flex-wrap gap-2">
        {post.tags.map((t) => (
          <Link
            key={t}
            href={`/blog/tag/${encodeURIComponent(t)}`}
            className="text-xs px-2 py-0.5 rounded bg-blue-100 text-blue-800"
          >
            #{t}
          </Link>
        ))}
      </div>

      {/* 目次（本文中の h2/h3 を自動抽出） */}
      <TableOfContents target="#post-article" />

      {/* 本文（rehype-slug で id が付与済み） */}
      <div
        id="post-article"
        className="prose prose-zinc max-w-none mt-6"
        dangerouslySetInnerHTML={{ __html: post.contentHtml }}
      />

      {/* 下部ナビ */}
      <div className="mt-10 flex gap-3">
        <Link
          href="/blog"
          className="rounded border border-white/15 px-4 py-2 hover:bg-white/5"
        >
          記事一覧へ
        </Link>
        <Link
          href="/"
          className="rounded bg-blue-600 px-4 py-2 text-white hover:opacity-90"
        >
          このサイトについて
        </Link>
      </div>
    </article>
  );
}

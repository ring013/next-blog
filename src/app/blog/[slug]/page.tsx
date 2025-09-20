// src/app/blog/[slug]/page.tsx
import Link from "next/link";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import Image from "next/image";
import { getAllSlugs, getPostBySlug } from "@/lib/markdown";
import { formatJa, readingTimeJa } from "@/lib/utils";

export const revalidate = 3600;

// SSG 対象
export async function generateStaticParams() {
  return getAllSlugs().map((slug) => ({ slug }));
}

// 個別メタデータ
export async function generateMetadata(
  { params }: { params: { slug: string } }
): Promise<Metadata> {
  const post = await getPostBySlug(params.slug);
  if (!post || !post.published) return {};

  const siteUrl =
    process.env.NEXT_PUBLIC_SITE_URL?.replace(/\/$/, "") || "http://localhost:3000";
  const url = `${siteUrl}/blog/${post.slug}`;
  const title = post.title;
  const description = post.excerpt || `${post.title} – ${post.author}`;
  const ogImage = `${siteUrl}/api/og?title=${encodeURIComponent(title)}`;

  return {
    title,
    description,
    alternates: { canonical: `/blog/${post.slug}` },
    openGraph: {
      type: "article",
      url,
      title,
      description,
      images: [{ url: ogImage, width: 1200, height: 630, alt: title }],
    },
  };
}

export default async function PostPage({ params }: { params: { slug: string } }) {
  const post = await getPostBySlug(params.slug);
  if (!post || !post.published) notFound();

  // HTMLから推定
  const timeLabel = readingTimeJa(post.contentHtml);

  return (
    <article className="max-w-3xl mx-auto p-4">
      {post.coverImage && (
        <div className="relative w-full overflow-hidden rounded mb-6" style={{ height: 320 }}>
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
      <p className="text-white/80 mb-2">
        {formatJa(post.date)} ・ {post.author} ・ {timeLabel}
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

      <div
        className="prose prose-invert max-w-none"
        dangerouslySetInnerHTML={{ __html: post.contentHtml }}
      />
    </article>
  );
}

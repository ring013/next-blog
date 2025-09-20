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

export async function generateMetadata({ params }: { params: { slug: string } }) {
  const post = await getPostBySlug(params.slug);
  if (!post || !post.published) return {};

  const base = process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000";
  const og = `${base}/api/og?title=${encodeURIComponent(post.title)}`;

  return {
    title: post.title,
    description: post.excerpt,
    openGraph: {
      title: post.title,
      description: post.excerpt,
      type: "article",
      url: `${base}/blog/${post.slug}`,
      images: [{ url: og, width: 1200, height: 630, alt: post.title }],
    },
    twitter: {
      card: "summary_large_image",
      title: post.title,
      description: post.excerpt,
      images: [og],
    },
  };
}

export default async function PostPage({ params }: { params: { slug: string } }) {
  const post = await getPostBySlug(params.slug);
  if (!post || !post.published) notFound();

  return (
    <article className="max-w-[1100px] mx-auto p-4">
      {/* カバー */}
      {post.coverImage && (
        <div className="relative w-full overflow-hidden rounded mb-6" style={{ height: 320 }}>
          <Image
            src={post.coverImage}
            alt={post.title}
            fill
            className="object-cover"
            sizes="(max-width: 768px) 100vw, 1100px"
            priority
          />
        </div>
      )}

      {/* タイトル & メタ */}
      <h1 className="text-4xl font-extrabold mb-2 text-white">{post.title}</h1>
      <p className="text-white/90 mb-4">{formatJa(post.date)} ・ {post.author}</p>
      <div className="mb-6 flex flex-wrap gap-2">
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

      {/* ---- レイアウト：lg以上は 2 カラム（本文 + 右サイド目次） ---- */}
      <div className="grid grid-cols-1 lg:grid-cols-[minmax(0,1fr)_280px] gap-8">
        {/* 本文 */}
        <div
          id="post-article"
          className="prose prose-zinc dark:prose-invert max-w-none"
          dangerouslySetInnerHTML={{ __html: post.contentHtml }}
        />

        {/* 目次：モバイルでは本文上に表示、lg以上で右サイドにsticky */}
        <aside className="order-first lg:order-none">
          {/* モバイルではカード風にして上に表示 */}
          <div className="block lg:hidden rounded border border-zinc-800 p-4 mb-4">
            <h2 className="text-sm font-semibold mb-2 text-white">目次</h2>
            <TableOfContents target="#post-article" />
          </div>

          {/* デスクトップ：右サイドに固定 */}
          <div className="hidden lg:block lg:sticky lg:top-24">
            <div className="rounded border border-zinc-800 p-4">
              <h2 className="text-sm font-semibold mb-2 text-white">目次</h2>
              <TableOfContents target="#post-article" />
            </div>
          </div>
        </aside>
      </div>
    </article>
  );
}

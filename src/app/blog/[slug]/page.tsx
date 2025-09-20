import Link from "next/link";
import Image from "next/image";
import { notFound } from "next/navigation";
import { getAllSlugs, getPostBySlug } from "@/lib/markdown";
import { formatJa } from "@/lib/utils";
import TableOfContents from "@/components/blog/TableOfContents";

export const revalidate = 3600;

// 静的生成パス
export async function generateStaticParams() {
  return getAllSlugs().map((slug) => ({ slug }));
}

export default async function PostPage({ params }: { params: { slug: string } }) {
  const post = await getPostBySlug(params.slug);
  if (!post || !post.published) notFound();

  return (
    <article className="max-w-5xl mx-auto p-4">
      {/* カバー画像（任意） */}
      {post.coverImage && (
        <Image
          src={post.coverImage}
          alt={post.title}
          width={1600}
          height={480}
          className="w-full h-60 md:h-80 object-cover rounded mb-6"
          priority
        />
      )}

      {/* タイトル */}
      <h1 className="text-4xl font-extrabold mb-2 text-white">{post.title}</h1>

      {/* メタ情報：日付・著者・読了時間 */}
      <p className="text-white/90 mb-4">
        {formatJa(post.date)} ・ {post.author} ・ 約{post.readingMinutes}分で読めます
      </p>

      {/* タグ */}
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

      {/* スマホ：本文上にTOC、PC：右サイド固定 */}
      <div className="lg:grid lg:grid-cols-[minmax(0,1fr)_280px] lg:gap-8">
        {/* 左カラム＝本文 */}
        <div>
          {/* モバイル表示のTOC（PCでは非表示） */}
          <div className="lg:hidden">
            <TableOfContents target="#post-article" />
          </div>

          {/* 本文 */}
          <div
            id="post-article"
            className="prose prose-zinc prose-invert max-w-none"
            dangerouslySetInnerHTML={{ __html: post.contentHtml }}
          />
        </div>

        {/* 右カラム＝固定TOC（PCのみ表示） */}
        <aside className="hidden lg:block">
          <TableOfContents target="#post-article" />
        </aside>
      </div>
    </article>
  );
}

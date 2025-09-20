// src/app/page.tsx
import Link from "next/link";
import Image from "next/image";
import { getAllPosts } from "@/lib/markdown";
import { formatJa } from "@/lib/utils";

export const revalidate = 3600;

export default async function HomePage() {
  const posts = (await getAllPosts()).slice(0, 3); // 最新3件

  return (
    <section className="max-w-[1000px] mx-auto px-5 py-12">
      {/* HERO */}
      <div className="relative overflow-hidden rounded-2xl border border-zinc-800 bg-[radial-gradient(1200px_400px_at_10%_-10%,rgba(37,99,235,.25),transparent)]">
        <div className="absolute inset-0 -z-10 opacity-20 bg-[linear-gradient(120deg,rgba(255,255,255,.08),transparent_40%)]" />
        <div className="px-8 py-12 md:px-12 md:py-16">
          <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight text-white">
            Gira&apos;sBlog
          </h1>
          <p className="mt-3 text-white/80 max-w-2xl">
            Next.js・Markdown・App Router・検索・RSS・OGPの
            “学びを形にする” コンパクトな技術ブログ。
          </p>
        </div>
      </div>

      {/* LATEST POSTS */}
      <h2 className="mt-12 mb-5 text-xl font-semibold text-white/90">最新の記事</h2>

      {posts.length === 0 ? (
        <p className="text-white/80">まだ記事がありません。</p>
      ) : (
        <ul className="grid gap-4 md:grid-cols-3">
          {posts.map((p) => (
            <li
              key={p.slug}
              className="group overflow-hidden rounded-xl border border-zinc-800 bg-zinc-900/40 hover:border-zinc-700 transition-colors"
            >
              {p.coverImage && (
                <div className="relative h-40 w-full">
                  <Image
                    src={p.coverImage}
                    alt={p.title}
                    fill
                    sizes="(max-width: 1000px) 100vw, 1000px"
                    className="object-cover"
                  />
                  <div className="absolute inset-0 bg-black/10 group-hover:bg-black/0 transition-colors" />
                </div>
              )}
              <div className="p-4">
                <Link
                  href={`/blog/${p.slug}`}
                  className="block text-base font-semibold text-white hover:opacity-90 leading-snug"
                >
                  {p.title}
                </Link>
                <div className="mt-1 text-xs text-white/70">
                  {formatJa(p.date)} ・ {p.author}
                </div>
                {p.excerpt && (
                  <p className="mt-2 text-sm text-white/80 line-clamp-3">{p.excerpt}</p>
                )}
                {p.tags?.length > 0 && (
                  <div className="mt-3 flex flex-wrap gap-2">
                    {p.tags.slice(0, 3).map((t) => (
                      <Link
                        key={t}
                        href={`/blog/tag/${t}`}
                        className="text-[11px] px-2 py-0.5 rounded bg-blue-100 text-blue-800"
                      >
                        #{t}
                      </Link>
                    ))}
                  </div>
                )}
              </div>
            </li>
          ))}
        </ul>
      )}

      {/* ACTIONS（一覧/このサイトについて）— 記事リストの下に配置 */}
      <div className="mt-10 flex flex-col gap-3 sm:flex-row">
        <Link
          href="/blog"
          className="inline-flex items-center justify-center rounded-lg bg-blue-600 px-4 py-2 text-white hover:opacity-90"
        >
          記事一覧へ
        </Link>
        <Link
          href="/about"
          className="inline-flex items-center justify-center rounded-lg border border-zinc-700 px-4 py-2 text-white hover:bg-zinc-800"
        >
          このサイトについて
        </Link>
      </div>
    </section>
  );
}

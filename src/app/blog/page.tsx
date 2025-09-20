// src/app/blog/page.tsx
import Link from "next/link";
import Image from "next/image";
import { getAllPosts } from "@/lib/markdown";
import { formatJa } from "@/lib/utils";
import SearchBox from "./SearchBox";
import Pagination from "@/components/ui/Pagination";

export const revalidate = 3600;

type Props = {
  searchParams: { page?: string };
};

export default async function BlogPage({ searchParams }: Props) {
  const posts = await getAllPosts();
  const perPage = 5;

  // ページ番号を安全に解釈（1未満やNaNは1、範囲外はクランプ）
  const raw = Number.parseInt(searchParams.page ?? "1", 10);
  const currentPage = Number.isFinite(raw) && raw > 0 ? raw : 1;
  const totalPages = Math.max(1, Math.ceil(posts.length / perPage));
  const page = Math.min(Math.max(1, currentPage), totalPages);

  const start = (page - 1) * perPage;
  const pagePosts = posts.slice(start, start + perPage);

  return (
    <section className="max-w-[960px] mx-auto p-4">
      <h1 className="text-3xl font-bold mb-4 text-white">ブログ記事</h1>

      {/* 検索（既存のもの） */}
      <SearchBox />

      {pagePosts.length === 0 ? (
        <p className="!text-white/90">まだ記事がありません。</p>
      ) : (
        <>
          <ul className="space-y-4">
            {pagePosts.map((p) => (
              <li key={p.slug} className="border rounded-lg p-4 text-white">
                {p.coverImage &&
                  (String(p.coverImage).endsWith(".svg") ? (
                    <div
                      className="w-full rounded mb-3 overflow-hidden"
                      style={{
                        height: 160,
                        backgroundImage: `url(${p.coverImage})`,
                        backgroundSize: "cover",
                        backgroundPosition: "center",
                        backgroundRepeat: "no-repeat",
                      }}
                      aria-label={p.title}
                      role="img"
                    />
                  ) : (
                    <div
                      className="relative w-full overflow-hidden rounded mb-3"
                      style={{ height: 160 }}
                    >
                      <Image
                        src={p.coverImage}
                        alt={p.title}
                        fill
                        className="object-cover"
                        sizes="(max-width: 960px) 100vw, 960px"
                      />
                    </div>
                  ))}

                <Link
                  href={`/blog/${p.slug}`}
                  className="text-lg font-semibold hover:opacity-90"
                >
                  {p.title}
                </Link>

                <div className="text-sm !text-white mt-0.5">
                  {formatJa(p.date)} ・ {p.author} ・ 約{p.readingMinutes}分
                </div>

                <p className="text-sm mt-1 !text-white/90">{p.excerpt}</p>

                <div className="mt-2 flex flex-wrap gap-2">
                  {p.tags.map((t) => (
                    <Link
                      key={t}
                      href={`/blog/tag/${t}`}
                      className="text-xs px-2 py-0.5 rounded bg-blue-100 text-blue-800"
                    >
                      #{t}
                    </Link>
                  ))}
                </div>
              </li>
            ))}
          </ul>

          {/* ページネーション */}
          <Pagination
            total={posts.length}
            perPage={perPage}
            currentPage={page}
            basePath="/blog"
          />
        </>
      )}
    </section>
  );
}

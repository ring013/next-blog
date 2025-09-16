import Link from "next/link";
import Image from "next/image";
import SearchBox from "./SearchBox"; // ← 相対パスに変更
import { getAllPosts } from "@/lib/markdown";
import { formatJa } from "@/lib/utils";

export const revalidate = 3600;

export default async function BlogPage() {
  const posts = await getAllPosts();

  return (
    <section className="max-w-[960px] mx-auto p-4">
      <h1 className="text-3xl font-bold mb-4 text-white">ブログ記事</h1>

      {/* 検索UI */}
      <SearchBox />

      {posts.length === 0 ? (
        <p className="!text-white/90">まだ記事がありません。</p>
      ) : (
        <ul className="space-y-4">
          {posts.map((p) => (
            <li key={p.slug} className="border rounded-lg p-4 text-white">
              {p.coverImage &&
                (String(p.coverImage).endsWith(".svg") ? (
                  // SVGは背景画像方式（高さを確実に固定）
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
                  // 画像は next/image（最適化）＋固定高さ
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

              {/* 日付・著者は白で固定して見やすく */}
              <div className="text-sm !text-white mt-0.5">
                {formatJa(p.date)} ・ {p.author}
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
      )}
    </section>
  );
}

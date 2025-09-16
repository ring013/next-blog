import Link from "next/link";
import { getAllPosts } from "@/lib/markdown";
import { formatJa } from "@/lib/utils";

export const revalidate = 3600;

export default async function BlogPage() {
  const posts = await getAllPosts();

  return (
    <section className="max-w-[960px] mx-auto p-4">
      <h1 className="text-3xl font-bold mb-6 text-white">ブログ記事</h1>

      {posts.length === 0 ? (
        <p className="!text-white/90">まだ記事がありません。</p>
      ) : (
        <ul className="space-y-4">
          {posts.map((p) => (
            <li key={p.slug} className="border rounded-lg p-4">
              {p.coverImage && (
                <img
                  src={p.coverImage}
                  alt={p.title}
                  className="w-full h-40 object-cover rounded mb-3"
                />
              )}

              <Link
                href={`/blog/${p.slug}`}
                className="text-lg font-semibold !text-white hover:opacity-90"
              >
                {p.title}
              </Link>

              {/* ← ここを“強制・白”に */}
              <div className="text-sm !text-white mt-0.5">
                {formatJa(p.date)} ・ {p.author}
              </div>

              {/* 要約もやや濃いめで固定 */}
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

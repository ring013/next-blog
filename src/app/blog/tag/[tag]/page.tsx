import Link from "next/link";
import { getPostsByTag } from "@/lib/markdown";
import { formatJa } from "@/lib/utils";

export const revalidate = 3600;

type Params = { params: { tag: string } };

// 静的生成するパスは既存の generateStaticParams があればOK。
// 無ければ必要に応じて追加してください。

export default async function TagPage({ params }: Params) {
  // /blog/tag/%E5%9E%8B%E5%AE%89%E5%85%A8 → "型安全" に復元
  const tag = decodeURIComponent(params.tag);
  const posts = await getPostsByTag(tag);

  return (
    <section className="max-w-[960px] mx-auto p-4">
      <h1 className="text-3xl font-extrabold mb-4">#{tag} の記事</h1>

      {posts.length === 0 ? (
        <p className="text-white/90">該当記事がありません。</p>
      ) : (
        <ul className="space-y-4">
          {posts.map((p) => (
            <li key={p.slug} className="border border-zinc-800 rounded-lg p-4">
              {p.coverImage && (
                <img
                  src={p.coverImage}
                  alt={p.title}
                  className="w-full h-40 object-cover rounded mb-3"
                />
              )}

              <Link
                href={`/blog/${p.slug}`}
                className="text-lg font-semibold hover:opacity-90"
              >
                {p.title}
              </Link>

              <div className="text-sm text-white/80 mt-0.5">
                {formatJa(p.date)} ・ {p.author}
              </div>

              {p.excerpt && <p className="text-sm mt-1 text-white/90">{p.excerpt}</p>}

              <div className="mt-2 flex flex-wrap gap-2">
                {p.tags.map((t) => (
                  <Link
                    key={t}
                    // ← 日本語タグはリンク側でエンコードしておく
                    href={`/blog/tag/${encodeURIComponent(t)}`}
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

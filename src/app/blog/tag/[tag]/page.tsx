import Link from "next/link";
import { getAllTags, getPostsByTag } from "@/lib/markdown";
import { formatJa } from "@/lib/utils";

export const revalidate = 3600;

export async function generateStaticParams() {
  const tags = await getAllTags();
  return tags.map((tag) => ({ tag }));
}

export default async function TagPage({ params }: { params: { tag: string } }) {
  const posts = await getPostsByTag(params.tag);

  return (
    <section className="max-w-[960px] mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4 text-white">#{params.tag} の記事</h1>

      {posts.length === 0 ? (
        <p className="!text-white/90">該当記事がありません。</p>
      ) : (
        <ul className="space-y-4">
          {posts.map((p) => (
            <li key={p.slug} className="border rounded-lg p-4">
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

              <p className="text-sm mt-1 !text-white/90">{p.excerpt}</p>
            </li>
          ))}
        </ul>
      )}
    </section>
  );
}

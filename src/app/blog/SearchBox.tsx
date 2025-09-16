"use client";

import Link from "next/link";
import { useState } from "react";

type Hit = {
  slug: string;
  title: string;
  excerpt: string;
  date: string;
  author: string;
  tags: string[];
  coverImage: string | null;
};

export default function SearchBox() {
  const [q, setQ] = useState("");
  const [hits, setHits] = useState<Hit[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError(null);
    try {
      const res = await fetch(`/api/search?q=${encodeURIComponent(q)}`);
      const data = await res.json();
      setHits(Array.isArray(data.results) ? data.results : []);
    } catch (err) {
      setError("検索に失敗しました");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="mb-6">
      <form onSubmit={onSubmit} className="flex gap-2">
        <input
          value={q}
          onChange={(e) => setQ(e.target.value)}
          placeholder="キーワードを入力（例: Next.js, Routing など）"
          className="flex-1 rounded border border-zinc-700 bg-zinc-900 px-3 py-2 text-white placeholder:text-zinc-400"
        />
        <button
          type="submit"
          className="rounded bg-blue-600 px-4 py-2 text-white hover:opacity-90"
        >
          検索
        </button>
      </form>

      {loading && <p className="mt-2 text-white/80">検索中…</p>}
      {error && <p className="mt-2 text-red-400">{error}</p>}

      {hits.length > 0 && (
        <ul className="mt-4 space-y-3">
          {hits.map((h) => (
            <li key={h.slug} className="rounded border border-zinc-700 p-3">
              <Link
                href={`/blog/${h.slug}`}
                className="font-semibold text-white hover:opacity-90"
              >
                {h.title}
              </Link>
              <div className="text-xs text-white/80 mt-0.5">
                {h.author} ・ {new Date(h.date).toLocaleDateString("ja-JP")}
              </div>
              {h.excerpt && (
                <p className="mt-1 text-sm text-white/90">{h.excerpt}</p>
              )}
              <div className="mt-2 flex flex-wrap gap-2">
                {h.tags?.map((t) => (
                  <span
                    key={t}
                    className="text-xs px-2 py-0.5 rounded bg-blue-100 text-blue-800"
                  >
                    #{t}
                  </span>
                ))}
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

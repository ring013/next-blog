"use client";

import { useEffect, useState } from "react";

type TocItem = { id: string; text: string; level: number };

// 日本語にもそこそこ対応した簡易 slugify
function slugify(s: string) {
  return s
    .trim()
    .toLowerCase()
    .replace(/[^\p{L}\p{N}\s-]/gu, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-");
}

export default function TableOfContents({ target = "#post-article" }: { target?: string }) {
  const [items, setItems] = useState<TocItem[]>([]);
  const [active, setActive] = useState<string>("");

  useEffect(() => {
    const root = document.querySelector(target);
    if (!root) return;

    const hs = Array.from(root.querySelectorAll<HTMLHeadingElement>("h1, h2, h3"));
    const list: TocItem[] = [];

    hs.forEach((h) => {
      if (!h.id) {
        const gen = slugify(h.textContent || "");
        if (gen) h.id = gen;
      }
      if (!h.id) return;
      list.push({ id: h.id, text: h.textContent || "", level: Number(h.tagName.substring(1)) });
    });

    setItems(list);

    // 現在位置ハイライト（下方向60%を“先読み”）
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (e.isIntersecting) {
            const id = (e.target as HTMLElement).id;
            if (id) setActive(id);
          }
        });
      },
      { rootMargin: "0px 0px -60% 0px", threshold: [0, 1] }
    );

    hs.forEach((h) => observer.observe(h));
    return () => observer.disconnect();
  }, [target]);

  if (items.length === 0) return null;

  return (
    <nav className="mb-6 rounded border border-zinc-700 p-3 text-sm lg:sticky lg:top-20">
      <div className="font-semibold mb-2 text-white">目次</div>
      <ul className="space-y-1">
        {items.map((it) => (
          <li key={it.id} className={it.level === 1 ? "" : it.level === 2 ? "ml-2" : "ml-5"}>
            <a
              href={`#${it.id}`}
              onClick={(e) => {
                e.preventDefault();
                document.getElementById(it.id)?.scrollIntoView({ behavior: "smooth", block: "start" });
                history.replaceState(null, "", `#${it.id}`);
              }}
              className={`hover:underline ${
                active === it.id ? "text-blue-400" : "text-white/90"
              }`}
            >
              {it.text}
            </a>
          </li>
        ))}
      </ul>
    </nav>
  );
}

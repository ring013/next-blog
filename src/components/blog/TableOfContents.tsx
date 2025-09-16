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
    // デバッグ用（ブラウザのDevToolsコンソールに出ます）
    console.log("[TOC] mounted. headings:", list.length);
  }, [target]);

  if (items.length === 0) return null;

  return (
    <nav className="mb-6 rounded border border-zinc-700 p-3 text-sm">
      <div className="font-semibold mb-2 text-white">目次</div>
      <ul className="space-y-1">
        {items.map((it) => (
          <li key={it.id} className={it.level === 1 ? "" : it.level === 2 ? "ml-2" : "ml-5"}>
            <a href={`#${it.id}`} className="hover:underline text-white/90">
              {it.text}
            </a>
          </li>
        ))}
      </ul>
    </nav>
  );
}

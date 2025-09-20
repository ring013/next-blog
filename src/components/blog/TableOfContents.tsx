"use client";

import { useEffect, useState } from "react";

type Item = {
  id: string;
  text: string;
  level: 2 | 3;
};

export default function TableOfContents({ target = "#post-article" }: { target?: string }) {
  const [items, setItems] = useState<Item[]>([]);
  const [activeId, setActiveId] = useState<string | null>(null);

  useEffect(() => {
    const el = document.querySelector(target);
    if (!el) return;

    // 本文内の h2 / h3 を収集
    const headings = Array.from(el.querySelectorAll<HTMLHeadingElement>("h2, h3"));
    const toc: Item[] = headings
      .filter((h) => !!h.id)
      .map((h) => ({
        id: h.id,
        text: h.textContent?.trim() || "",
        level: (h.tagName.toLowerCase() === "h2" ? 2 : 3) as 2 | 3,
      }));

    setItems(toc);

    // スクロールに応じて現在位置（active）を更新
    const observer = new IntersectionObserver(
      (entries) => {
        // 画面内に入っている見出しのうち最上部に近いものを active に
        const visible = entries
          .filter((e) => e.isIntersecting)
          .sort((a, b) => (a.target as HTMLElement).offsetTop - (b.target as HTMLElement).offsetTop);
        if (visible[0]) {
          setActiveId((visible[0].target as HTMLElement).id);
        }
      },
      { rootMargin: "0px 0px -70% 0px", threshold: 0.1 }
    );

    headings.forEach((h) => observer.observe(h));
    return () => observer.disconnect();
  }, [target]);

  if (items.length === 0) return null;

  return (
    <aside className="hidden lg:block sticky top-24 self-start">
      <div className="rounded-lg border border-zinc-800 bg-zinc-900/40 p-4">
        <p className="text-sm font-semibold mb-3">目次</p>
        <nav>
          <ul className="space-y-2 text-sm">
            {items.map((it) => (
              <li key={it.id} className={it.level === 3 ? "pl-4" : ""}>
                <a
                  href={`#${it.id}`}
                  className={[
                    "block hover:opacity-90",
                    activeId === it.id ? "text-indigo-400" : "text-zinc-300",
                  ].join(" ")}
                >
                  {it.text}
                </a>
              </li>
            ))}
          </ul>
        </nav>
      </div>
    </aside>
  );
}

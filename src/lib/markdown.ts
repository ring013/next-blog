// src/lib/markdown.ts
import fs from "fs";
import path from "path";
import matter from "gray-matter";
import { remark } from "remark";
import remarkRehype from "remark-rehype";
import rehypeStringify from "rehype-stringify";
import rehypeHighlight from "rehype-highlight";
import rehypeSlug from "rehype-slug";
import rehypeAutolinkHeadings from "rehype-autolink-headings";

export type Post = {
  slug: string;
  title: string;
  date: string;
  author: string;
  tags: string[];
  excerpt: string;
  coverImage?: string;
  published: boolean;
  contentHtml: string;
  readingMinutes: number; // ★ 追加
};

const POSTS_DIR = path.join(process.cwd(), "src/content/blog");

// 生文字列から読了時間をざっくり計算（日本語は文字数で推定）
function estimateReadingMinutes(raw: string): number {
  // コードブロックや記号を除いて、純粋な本文に近づける
  const withoutCode = raw.replace(/```[\s\S]*?```/g, ""); // ``` ～ ``` を除去
  const plain = withoutCode
    .replace(/\[(.*?)\]\(.*?\)/g, "$1")   // Markdownリンク → テキスト
    .replace(/[#>*_`~\-]+/g, " ")         // 見出し/箇条書き記号など
    .replace(/\s+/g, " ");                 // 連続空白整理
  const charCount = plain.replace(/\s/g, "").length;

  // ざっくり：日本語 500 文字 / 分 を基準にする（最低1分）
  const minutes = Math.max(1, Math.round(charCount / 500));
  return minutes;
}

export function getAllSlugs(): string[] {
  if (!fs.existsSync(POSTS_DIR)) return [];
  return fs
    .readdirSync(POSTS_DIR)
    .filter((f) => f.endsWith(".md"))
    .map((f) => f.replace(/\.md$/, ""));
}

export async function getPostBySlug(slug: string): Promise<Post> {
  const fullPath = path.join(POSTS_DIR, `${slug}.md`);
  const file = fs.readFileSync(fullPath, "utf8");
  const { data, content } = matter(file);

  const processed = await remark()
    .use(remarkRehype)
    .use(rehypeSlug)
    .use(rehypeAutolinkHeadings, { behavior: "wrap" })
    .use(rehypeHighlight)
    .use(rehypeStringify)
    .process(content);

  const html = processed.toString();
  const readingMinutes = estimateReadingMinutes(content); // ★ 追加

  return {
    slug,
    title: data.title as string,
    date: data.date as string,
    author: (data.author as string) ?? "",
    tags: (data.tags as string[]) ?? [],
    excerpt: (data.excerpt as string) ?? "",
    coverImage: data.coverImage as string | undefined,
    published: data.published ?? true,
    contentHtml: html,
    readingMinutes, // ★ 追加
  };
}

export async function getAllPosts(): Promise<Post[]> {
  const slugs = getAllSlugs();
  const posts = await Promise.all(slugs.map((s) => getPostBySlug(s)));
  return posts
    .filter((p) => p.published)
    .sort((a, b) => (a.date < b.date ? 1 : -1));
}

export async function getPostsByTag(tag: string) {
  const posts = await getAllPosts();
  return posts.filter((p) => p.tags.includes(tag));
}

export async function getAllTags(): Promise<string[]> {
  const posts = await getAllPosts();
  return Array.from(new Set(posts.flatMap((p) => p.tags)));
}

import fs from "fs";
import path from "path";
import matter from "gray-matter";
import { remark } from "remark";
import remarkRehype from "remark-rehype";
import rehypeHighlight from "rehype-highlight";
import rehypeStringify from "rehype-stringify";

export type PostMeta = {
  slug: string;
  title: string;
  date: string;
  author: string;
  tags: string[];
  excerpt: string;
  coverImage?: string;
  published: boolean;
};

export type Post = PostMeta & { contentHtml: string };

const POSTS_DIR = path.join(process.cwd(), "src/content/blog");

export function getAllSlugs(): string[] {
  return fs
    .readdirSync(POSTS_DIR)
    .filter((f) => f.endsWith(".md"))
    .map((f) => f.replace(/\.md$/, ""));
}

export async function getPostBySlug(slug: string): Promise<Post> {
  const fullPath = path.join(POSTS_DIR, `${slug}.md`);
  const raw = fs.readFileSync(fullPath, "utf8");
  const { data, content } = matter(raw);

  // Markdown -> HTML（rehype-highlightでコードに色を付ける）
  const processed = await remark()
    .use(remarkRehype)
    .use(rehypeHighlight)
    .use(rehypeStringify)
    .process(content);

  const contentHtml = processed.toString();

  const meta: PostMeta = {
    slug,
    title: data.title ?? slug,
    date: data.date ?? new Date().toISOString(),
    author: data.author ?? "unknown",
    tags: Array.isArray(data.tags) ? data.tags : [],
    excerpt: data.excerpt ?? "",
    coverImage: data.coverImage,
    published: data.published ?? true,
  };

  return { ...meta, contentHtml };
}

export async function getAllPosts(): Promise<Post[]> {
  const slugs = getAllSlugs();
  const posts = await Promise.all(slugs.map(getPostBySlug));
  return posts
    .filter((p) => p.published)
    .sort((a, b) => (a.date > b.date ? -1 : 1));
}

export async function getPostsByTag(tag: string): Promise<Post[]> {
  const posts = await getAllPosts();
  return posts.filter((p) => p.tags.includes(tag));
}

export async function getAllTags(): Promise<string[]> {
  const posts = await getAllPosts();
  return Array.from(new Set(posts.flatMap((p) => p.tags)));
}

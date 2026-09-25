import fs from "node:fs";
import path from "node:path";
import matter from "gray-matter";

const ROOT = path.join(process.cwd(), "content");

export type Service = {
  slug: string;
  title: string;
  short: string;
  summary: string;
  seoTitle?: string;
  seoDescription?: string;
  order: number;
  startingFrom?: string;
  deliverables: string[];
  stack: string[];
  faq: { q: string; a: string }[];
  body: string;
};

export type Work = {
  slug: string;
  title: string;
  client: string;
  summary: string;
  services: string[];
  stack: string[];
  year: string;
  order: number;
  featured?: boolean;
  /** Path under /public; when missing the UI shows an explicit screenshot slot */
  cover?: string;
  /** Portrait (phone) screenshot for tall tiles */
  coverTall?: string;
  url?: string;
  body: string;
};

export type Product = {
  slug: string;
  name: string;
  status: "live" | "soon";
  tagline: string;
  summary: string;
  order: number;
  url?: string;
  cover?: string;
  body: string;
};

function readCollection<T>(dir: string): T[] {
  const full = path.join(ROOT, dir);
  if (!fs.existsSync(full)) return [];
  return fs
    .readdirSync(full)
    .filter((f) => f.endsWith(".mdx"))
    .map((file) => {
      const raw = fs.readFileSync(path.join(full, file), "utf8");
      const { data, content } = matter(raw);
      return { slug: file.replace(/\.mdx$/, ""), ...data, body: content } as T;
    })
    .sort((a, b) => ((a as { order?: number }).order ?? 99) - ((b as { order?: number }).order ?? 99));
}

export const getServices = () => readCollection<Service>("services");
export const getService = (slug: string) => getServices().find((s) => s.slug === slug);

export const getWork = () => readCollection<Work>("work");
export const getWorkItem = (slug: string) => getWork().find((w) => w.slug === slug);

export const getProducts = () => readCollection<Product>("products");
export const getProduct = (slug: string) => getProducts().find((p) => p.slug === slug);

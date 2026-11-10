// Generates public/sitemap.xml from the typed data files.
// Usage: npm run sitemap   (Node 22+, uses --experimental-strip-types)
import { writeFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { site } from "../src/config/site.ts";
import { allCategories } from "../src/data/categories.ts";
import { products } from "../src/data/products.ts";
import { posts } from "../src/data/posts.ts";

const base = site.url.replace(/\/$/, "");
const today = new Date().toISOString().slice(0, 10);

const entries = [
  { path: "/", priority: "1.0", changefreq: "weekly" },
  { path: "/solutions", priority: "0.8", changefreq: "monthly" },
  { path: "/a-propos", priority: "0.6", changefreq: "monthly" },
  { path: "/blog", priority: "0.7", changefreq: "weekly" },
  { path: "/contact", priority: "0.7", changefreq: "monthly" },
  { path: "/mentions-legales", priority: "0.2", changefreq: "yearly" },
  { path: "/cgv", priority: "0.2", changefreq: "yearly" },
  ...allCategories.map((c) => ({
    path: `/categorie/${c.slug}`,
    priority: c.kind === "universe" ? "0.9" : "0.8",
    changefreq: "weekly",
  })),
  ...products.map((p) => ({ path: `/produit/${p.slug}`, priority: "0.7", changefreq: "monthly" })),
  ...posts.map((p) => ({ path: `/blog/${p.slug}`, priority: "0.6", changefreq: "monthly", lastmod: p.date })),
];

const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${entries
  .map(
    (e) => `  <url>
    <loc>${base}${e.path}</loc>
    <lastmod>${e.lastmod ?? today}</lastmod>
    <changefreq>${e.changefreq}</changefreq>
    <priority>${e.priority}</priority>
  </url>`,
  )
  .join("\n")}
</urlset>
`;

const out = fileURLToPath(new URL("../public/sitemap.xml", import.meta.url));
writeFileSync(out, xml, "utf-8");
console.log(`sitemap.xml: ${entries.length} URLs → ${out}`);

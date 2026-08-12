/**
 * fetch-ghost.mjs
 *
 * Build-time fetch of blog content from the Ghost (headless) Content API.
 * Maps Ghost posts onto the site's `BlogPost` shape and writes
 * `src/data/blogData.json`, which the app imports.
 *
 * Runs first in the `build` script, so `vite build` + `prerender.mjs` see the
 * latest content. Keeping content in a build-time file (not a runtime fetch)
 * means the site stays fully static and prerendered — best for SEO/performance.
 *
 * Ghost is the source of truth: whatever is *published* there appears on the
 * site after the next build. Nothing here is hand-edited.
 */

import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));

const GHOST_URL =
  process.env.GHOST_URL || "https://avenir-admissions.ghost.io";
const GHOST_CONTENT_KEY =
  process.env.GHOST_CONTENT_KEY || "55026f8fe74fd0980584558287";

const OUT = path.resolve(__dirname, "../src/data/blogData.json");

/** Format an ISO date as "June 18, 2025" (in UTC, so builds are deterministic). */
function humanDate(iso) {
  const d = new Date(iso);
  if (isNaN(d.getTime())) return iso ?? "";
  return d.toLocaleDateString("en-US", {
    timeZone: "UTC",
    year: "numeric",
    month: "long",
    day: "numeric",
  });
}

async function main() {
  const url =
    `${GHOST_URL}/ghost/api/content/posts/` +
    `?key=${GHOST_CONTENT_KEY}&limit=all&include=authors&formats=html`;

  const res = await fetch(url, { headers: { "Accept-Version": "v5.0" } });
  if (!res.ok) {
    throw new Error(`Ghost API returned ${res.status} ${res.statusText}`);
  }
  const json = await res.json();
  if (json.errors) {
    throw new Error(`Ghost API error: ${JSON.stringify(json.errors)}`);
  }
  const rawPosts = json.posts ?? [];
  if (rawPosts.length === 0) {
    throw new Error("Ghost returned 0 posts — refusing to overwrite blogData.json");
  }

  // Oldest first, so blogData[0] is the earliest post. The UI reverses this to
  // show newest first (Blogs.tsx / home Blog section rely on that ordering).
  rawPosts.sort((a, b) => new Date(a.published_at) - new Date(b.published_at));

  const posts = rawPosts.map((p, i) => ({
    id: i + 1,
    slug: p.slug,
    title: p.title ?? "",
    subTitle: p.custom_excerpt || p.excerpt || "",
    date: humanDate(p.published_at),
    author: p.primary_author?.name || "Avenir Admissions",
    excerpt: p.meta_description || p.excerpt || p.custom_excerpt || "",
    image: p.feature_image || "",
    content: p.html || "",
  }));

  // Write only after a successful fetch, so a network failure never blanks the
  // committed data. Pretty-printed for readable diffs.
  fs.writeFileSync(OUT, JSON.stringify(posts, null, 2) + "\n");
  console.log(`✅  Fetched ${posts.length} posts from Ghost → ${path.relative(process.cwd(), OUT)}`);
  console.log("   " + posts.map((p) => p.slug).join(", "));
}

main().catch((err) => {
  console.error(`❌  fetch-ghost failed: ${err.message}`);
  process.exit(1);
});

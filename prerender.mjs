/**
 * prerender.mjs
 *
 * Runs after `vite build` to generate static HTML for every route.
 * Uses react-dom/server + StaticRouter — no headless browser, no vulnerabilities.
 *
 * Each output file has:
 *  - Pre-rendered React content (for Google and fast initial paint)
 *  - <title> and all OG / Twitter meta tags baked into <head>
 *    (Facebook and Instagram scrapers don't execute JS, so these MUST
 *     be in the static HTML for link previews to work correctly)
 *
 * Usage (automated via package.json build script):
 *   node prerender.mjs
 */

import { execSync } from "node:child_process";
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));

// Central config — keep in sync with src/config.ts
const BASE_URL = "https://aveniradmissions.com";
const PHONE = "+17073479477";

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

/** Escape special HTML characters so they're safe inside attribute values. */
function esc(str) {
  return String(str)
    .replace(/&/g, "&amp;")
    .replace(/"/g, "&quot;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;");
}

/**
 * Attempts to convert "June 18th, 2025" → "2025-06-18" for Schema.org.
 * Falls back to the original string if parsing fails.
 */
function toIsoDate(dateStr) {
  const cleaned = dateStr.replace(/(\d+)(st|nd|rd|th)/, "$1");
  const parsed = new Date(cleaned);
  return isNaN(parsed.getTime()) ? dateStr : parsed.toISOString().split("T")[0];
}

/**
 * Build the JSON-LD <script> tag for a given route.
 * Returns an HTML string ready to be inserted before </head>, or "" for
 * routes that don't need structured data.
 */
function buildJsonLd(route, blogData) {
  let schema;

  if (route === "/") {
    schema = {
      "@context": "https://schema.org",
      "@type": "LocalBusiness",
      name: "Avenir Admissions",
      description: "Expert college admissions consulting",
      url: BASE_URL,
      telephone: PHONE,
      founder: { "@type": "Person", name: "Aiden Kjeldsen" },
      serviceType: "College Admissions Consulting",
      areaServed: "United States",
    };
  } else if (route.startsWith("/blog/")) {
    const slug = route.slice("/blog/".length);
    const post = blogData.find((p) => p.slug === slug);
    if (post) {
      schema = {
        "@context": "https://schema.org",
        "@type": "Article",
        headline: post.title,
        description: post.excerpt,
        image: post.image.startsWith("http") ? post.image : `${BASE_URL}${post.image}`,
        datePublished: toIsoDate(post.date),
        author: { "@type": "Person", name: post.author },
        publisher: {
          "@type": "Organization",
          name: "Avenir Admissions",
          url: BASE_URL,
          logo: { "@type": "ImageObject", url: `${BASE_URL}/logo.jpg` },
        },
        url: `${BASE_URL}${route}`,
      };
    }
  }

  if (!schema) return "";
  return `    <script type="application/ld+json">${JSON.stringify(schema)}</script>`;
}

/**
 * Build the <title> + all meta tag strings for a given route.
 * Returns { title, metaTags } where metaTags is an HTML string
 * ready to be inserted before </head>.
 */
function buildPageMeta(route, blogData) {
  let title, description, image, url, type;

  if (route === "/") {
    title       = "Avenir Admissions | Expert College Admissions Consulting";
    description = "Expert, personalized college admissions consulting led by Aiden Kjeldsen, M.S.Ed., UCLA Certified College Counselor. Helping students get into their dream schools.";
    image       = `${BASE_URL}/logo.jpg`;
    url         = BASE_URL;
    type        = "website";
  } else if (route === "/blogs") {
    title       = "The College Corner Blog | Avenir Admissions";
    description = "Your complete guide to college admissions, essays, and everything in between. Expert advice from Aiden Kjeldsen, UCLA Certified College Counselor.";
    image       = `${BASE_URL}/logo.jpg`;
    url         = `${BASE_URL}/blogs`;
    type        = "website";
  } else if (route === "/services") {
    title       = "Our Services | Avenir Admissions";
    description = "Expert college admissions consulting for 9th–12th grade students, transfer applicants, and international students. Personalized guidance at every stage.";
    image       = `${BASE_URL}/logo.jpg`;
    url         = `${BASE_URL}/services`;
    type        = "website";
  } else if (route === "/contact") {
    title       = "Contact Us | Avenir Admissions";
    description = "Get in touch with Avenir Admissions. Book a free consultation or send us a message — we'd love to hear from you.";
    image       = `${BASE_URL}/logo.jpg`;
    url         = `${BASE_URL}/contact`;
    type        = "website";
  } else if (route.startsWith("/blog/")) {
    const slug = route.slice("/blog/".length);
    const post = blogData.find((p) => p.slug === slug);
    if (post) {
      title       = `${post.title} | Avenir Admissions`;
      description = post.excerpt;
      image       = post.image.startsWith("http")
        ? post.image
        : `${BASE_URL}${post.image}`;
      url         = `${BASE_URL}${route}`;
      type        = "article";
    }
  }

  if (!title) return { title: "Avenir Admissions", metaTags: "" };

  const metaTags = `
    <link rel="canonical" href="${esc(url)}">
    <meta name="description" content="${esc(description)}">

    <!-- Open Graph (Facebook, Instagram, WhatsApp, LinkedIn) -->
    <meta property="og:title"       content="${esc(title)}">
    <meta property="og:description" content="${esc(description)}">
    <meta property="og:image"       content="${esc(image)}">
    <meta property="og:url"         content="${esc(url)}">
    <meta property="og:type"        content="${esc(type)}">
    <meta property="og:site_name"   content="Avenir Admissions">

    <!-- Twitter Card -->
    <meta name="twitter:card"        content="summary_large_image">
    <meta name="twitter:title"       content="${esc(title)}">
    <meta name="twitter:description" content="${esc(description)}">
    <meta name="twitter:image"       content="${esc(image)}">`.trimStart();

  return { title, metaTags };
}

// ---------------------------------------------------------------------------
// 1. Read slugs so we know which routes to render
// ---------------------------------------------------------------------------
const blogDataSrc = fs.readFileSync(
  path.resolve(__dirname, "src/data/blogData.ts"),
  "utf-8"
);
const slugs = [...blogDataSrc.matchAll(/slug:\s*["']([^"']+)["']/g)].map(
  (m) => m[1]
);

const routes = ["/", "/blogs", "/services", "/contact", ...slugs.map((s) => `/blog/${s}`)];
console.log(`\n🔨  Pre-rendering ${routes.length} routes...\n`);

// ---------------------------------------------------------------------------
// 2. Build the SSR bundle into .ssr-temp/
// ---------------------------------------------------------------------------
console.log("   Building SSR bundle...");
execSync("npx vite build --ssr src/entry-server.tsx", { stdio: "inherit" });

// ---------------------------------------------------------------------------
// 3. Import the freshly built SSR entry (includes render + blogData)
// ---------------------------------------------------------------------------
const ssrEntryPath = path.resolve(__dirname, ".ssr-temp/entry-server.js");
const { render, blogData } = await import(ssrEntryPath);

// ---------------------------------------------------------------------------
// 4. Read the client HTML template produced by `vite build`
// ---------------------------------------------------------------------------
const template = fs.readFileSync(
  path.resolve(__dirname, "dist/index.html"),
  "utf-8"
);

// ---------------------------------------------------------------------------
// 5. For each route: render content + inject title & meta → write index.html
// ---------------------------------------------------------------------------
let succeeded = 0;
let failed = 0;

for (const route of routes) {
  try {
    const appHtml = render(route);
    const { title, metaTags } = buildPageMeta(route, blogData);
    const jsonLd = buildJsonLd(route, blogData);

    // Combine meta tags + JSON-LD (skip blank lines between absent blocks)
    const headInjection = [metaTags, jsonLd].filter(Boolean).join("\n");

    const html = template
      // Replace the generic <title> from index.html with the page-specific one
      .replace(/<title>[^<]*<\/title>/, `<title>${esc(title)}</title>`)
      // Inject OG / Twitter meta tags + JSON-LD just before </head>
      .replace("</head>", `${headInjection}\n  </head>`)
      // Inject the pre-rendered React HTML
      .replace('<div id="root"></div>', `<div id="root">${appHtml}</div>`);

    const routeDir =
      route === "/"
        ? path.resolve(__dirname, "dist")
        : path.resolve(__dirname, "dist", route.slice(1));

    fs.mkdirSync(routeDir, { recursive: true });
    fs.writeFileSync(path.resolve(routeDir, "index.html"), html);

    console.log(`   ✓  ${route}`);
    succeeded++;
  } catch (err) {
    console.warn(`   ⚠  ${route} — ${err.message}`);
    failed++;
  }
}

// ---------------------------------------------------------------------------
// 6. Generate dist/sitemap.xml
//    Built from blogData so it never goes stale when posts are added.
// ---------------------------------------------------------------------------
const today = new Date().toISOString().split("T")[0];

const staticUrls = [
  { loc: `${BASE_URL}/`,      lastmod: today,  priority: "1.0" },
  { loc: `${BASE_URL}/blogs`, lastmod: today,  priority: "0.8" },
];

const blogUrls = blogData.map((post) => ({
  loc:      `${BASE_URL}/blog/${post.slug}`,
  lastmod:  toIsoDate(post.date),
  priority: "0.7",
}));

const urlEntries = [...staticUrls, ...blogUrls]
  .map(
    ({ loc, lastmod, priority }) =>
      `  <url>\n    <loc>${loc}</loc>\n    <lastmod>${lastmod}</lastmod>\n    <priority>${priority}</priority>\n  </url>`
  )
  .join("\n");

const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urlEntries}
</urlset>`;

fs.writeFileSync(path.resolve(__dirname, "dist/sitemap.xml"), sitemap);
console.log("   ✓  dist/sitemap.xml");

// ---------------------------------------------------------------------------
// 7. Clean up the temporary SSR bundle
// ---------------------------------------------------------------------------
fs.rmSync(path.resolve(__dirname, ".ssr-temp"), { recursive: true, force: true });

console.log(
  `\n✅  Pre-rendering complete — ${succeeded} succeeded, ${failed} failed.\n`
);

if (failed > 0) process.exit(1);

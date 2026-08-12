# Avenir Admissions

Marketing and blog site for **Avenir Admissions**, a college admissions consulting
practice. Live at **[www.aveniradmissions.com](https://www.aveniradmissions.com)**.

It's a React single-page app that is **prerendered to static HTML** at build time (for
SEO and fast loads) and served from **AWS S3 + CloudFront**. Blog content is managed in
**Ghost** (a headless CMS) and pulled in at build time, so the marketing team publishes
posts without touching code.

---

## Tech stack

| | |
|---|---|
| Framework | React 19 + TypeScript |
| Build | Vite 8, prerendered via `react-dom/server` (`prerender.mjs`) |
| Styling | Tailwind CSS 4 |
| Routing | React Router 7 |
| CMS | Ghost (headless) — content pulled via the Content API at build time |
| Hosting | AWS S3 + CloudFront |
| CI/CD | GitHub Actions (`.github/workflows/deploy.yml`) |
| Analytics | Google Analytics 4 |
| Forms / booking | Formspree (contact form), Cal.com (consultation booking) |

## How it works

```
Ghost (headless CMS)
      │  build-time fetch (Content API)
      ▼
src/data/blogData.json ──▶ Vite build + prerender ──▶ dist/ ──deploy──▶ S3 + CloudFront ──▶ visitors
```

- Blog posts live in **Ghost**, not in the repo. At build time, `scripts/fetch-ghost.mjs`
  fetches all published posts and writes `src/data/blogData.json`. The app and the
  prerenderer read from that file.
- `npm run build` runs: **fetch from Ghost → TypeScript build → Vite build → prerender**.
  Prerendering emits a static `index.html` for every route (home, services, contact,
  blog index, and each post), plus `sitemap.xml`, a branded `404.html`, and redirect
  stubs for a handful of legacy mixed-case blog URLs.
- The site is fully static once built — there are no runtime API calls to Ghost, which
  keeps it fast and resilient.

## Content & publishing

The marketing team writes posts in Ghost. Because the site is static, a new post appears
after a **rebuild + redeploy**. That happens automatically via GitHub Actions, triggered by:

- **Daily schedule** — a cron rebuild (3pm PST) picks up whatever is published in Ghost.
- **Git push** to `main` — deploys code changes.
- **Manual** — the "Run workflow" button in the Actions tab publishes on demand.
- **Instant on publish** *(optional)* — a small AWS Lambda relay turns a Ghost "publish"
  webhook into a deploy, so posts go live within minutes. See
  [`infra/ghost-webhook-relay/`](infra/ghost-webhook-relay/README.md).

## Local development

```bash
npm install
npm run dev        # start the dev server (http://localhost:5173)
```

Other scripts:

```bash
npm run fetch:ghost   # refresh src/data/blogData.json from Ghost
npm run build         # fetch + typecheck + build + prerender → dist/
npm run preview       # serve the production build locally
npm run lint          # eslint
```

The Ghost URL and (read-only, public-safe) Content API key have defaults baked into
`scripts/fetch-ghost.mjs`, so a fresh clone builds without extra setup. Override them with
`GHOST_URL` / `GHOST_CONTENT_KEY` env vars if needed.

## Deployment

Pushing to `main` (or any of the triggers above) runs
[`.github/workflows/deploy.yml`](.github/workflows/deploy.yml), which builds the site,
syncs `dist/` to the S3 bucket, and invalidates the CloudFront cache.

The workflow needs two repository secrets — `AWS_ACCESS_KEY_ID` and
`AWS_SECRET_ACCESS_KEY` — for an IAM user with permission to write to the bucket and create
CloudFront invalidations. The bucket, region, and distribution ID are set in the workflow
file (they aren't secret).

CloudFront is configured to serve `/404.html` on `403`/`404` errors, so removed or
mistyped URLs show the branded not-found page.

## Project structure

```
src/
  pages/            route-level pages (Home, Services, Blogs, Blog, Contact, 404)
  sections/home/    home-page sections (hero, about, services, testimonials, blog, contact)
  components/       shared UI (Navbar, Footer, SEO, Analytics, BlogCard, …)
  data/             blogData.json (generated from Ghost), service & testimonial data
  config.ts         site constants (base URL, phone, Formspree, Cal.com, GA id)
scripts/
  fetch-ghost.mjs   build-time Ghost → blogData.json
prerender.mjs       post-build static prerender (HTML, sitemap, 404, redirects)
infra/
  ghost-webhook-relay/   AWS Lambda relay for instant-publish (optional)
```

## Notes

- **SEO** is baked in at prerender time: per-page `<title>`, meta, Open Graph, Twitter
  cards, JSON-LD structured data, `sitemap.xml`, and canonical URLs — all present in the
  static HTML, not injected by JS.
- **Blog slugs** are lowercase (Ghost's format); old mixed-case URLs 301-redirect to them.

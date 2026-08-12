# Ghost Pro (Headless) Setup for Avenir Admissions

A step-by-step guide to using **Ghost Pro** (managed hosting) as a **headless CMS**,
wired into the existing React + Vite site that deploys to S3.

- **Aiden** logs into Ghost and writes posts in a clean editor.
- **The site** stays on S3 — a build fetches posts from Ghost's Content API,
  prerenders them, and deploys. Your design and SEO are unchanged.
- **Ghost Pro** runs the server, updates, backups, SSL, uptime, **and email delivery** — **no maintenance on your end.**
- **Email now** uses Ghost's built-in newsletter. Delivery (Mailgun) is **included and managed by Ghost Pro** — no separate Mailgun account or bill.
- A possible **future move** to self-hosted Ghost + **MailerLite** (to cut cost) is outlined at the end.

---

## What this will cost

| Item | Cost |
|------|------|
| Ghost Pro **Starter** (managed hosting) | ~$9/mo (billed annually) |
| Domain / DNS | already owned |
| Server / maintenance | **$0** — Ghost handles it |
| Email newsletter (Mailgun, **included & managed by Ghost Pro**) | included, up to your plan's monthly email limit |
| Google Analytics | free |
| **Total now** | **~$9/mo** — email included |

> The separate ~$15+/mo Mailgun bill only applies to the **future self-hosted** path, where you bring
> your own Mailgun. On Ghost Pro it's bundled. (Do check your plan's monthly email-send limit — very
> high volumes can cost more.)

> Starter's main limitation (no custom themes) **doesn't affect you** — your public blog is
> rendered by your React site, not a Ghost theme. So the cheapest tier is all you need.

---

## Before you start — decisions & prerequisites

- [ ] **Ghost Pro account** owned by the client's/Aiden's email (so they own the content long-term).
- [ ] **Custom domain for the CMS?** Optional. The default `youraccount.ghost.io` URL is fine for headless (the public never sees it). Only set up `cms.aveniradmissions.com` if you prefer a branded admin URL — needs one DNS record (Part 2).
- [ ] Your existing **S3 bucket name + region** and **CloudFront distribution ID** (for the deploy step).

---

## Part 1 — Sign up for Ghost Pro

1. Go to **[ghost.org](https://ghost.org)** → **Get started** → choose the **Starter** plan.
2. Create your publication — this provisions a hosted Ghost site at `youraccount.ghost.io`.
3. Set the **owner account** to **Aiden's email** and the site title to **Avenir Admissions**.

That's the entire "hosting" step — Ghost Pro has already set up the server, database, and HTTPS for you.

Aiden can now write posts at `https://youraccount.ghost.io/ghost`. This is the only screen they ever need.

---

## Part 2 — (Optional) Use a custom CMS domain

Skip this unless you want the admin at `cms.aveniradmissions.com` instead of `youraccount.ghost.io`.

1. In Ghost Admin → **Settings → Domain**, start the custom-domain flow.
2. In your DNS provider, add the **CNAME** record Ghost gives you:


   | Type | Name | Value |
   |------|------|-------|
   | CNAME | `cms` | *(the target Ghost shows, e.g. `youraccount.ghost.io`)* |

3. Ghost auto-issues SSL once DNS propagates.

---

## Part 3 — Create the Content API key (headless connection)

1. In Ghost Admin → **Settings → Integrations → Add custom integration**.
2. Name it **Website** and save.
3. Copy two values — you'll give these to the site build:
   - **Content API Key**
   - **API URL** → your Ghost URL (`https://youraccount.ghost.io` or your custom domain)

> The Content API key is **read-only** — safe to use in the build.

---

## Part 4 — Migrate the 13 existing posts

The current posts are already HTML, so this is quick. Two options:

- **Manual (simplest):** In Ghost, create each post, paste the content, set the title/excerpt/feature image.
- **Bulk import:** I can generate a Ghost-format JSON from the existing `src/data/blogData.ts` and import it via **Settings → Import/Export**. Images get uploaded to Ghost and re-hosted on its CDN.

*(I'll handle whichever you prefer — this step is on me, not Aiden.)*

---

## Part 5 — Wire Ghost into the site *(developer task — I do this)*

1. Add the Ghost values to the build environment (`.env` / CI secrets):
   ```
   GHOST_URL=https://youraccount.ghost.io
   GHOST_CONTENT_KEY=xxxxxxxxxxxxxxxxxxxxxx
   ```
2. Replace `src/data/blogData.ts` as the source: the build fetches from
   `GET {GHOST_URL}/ghost/api/content/posts/?key={KEY}&include=authors&formats=html`.
3. Map Ghost fields → the existing `BlogPost` shape:

   | Site field | Ghost field |
   |-----------|-------------|
   | `title` | `title` |
   | `slug` | `slug` |
   | `excerpt` | `excerpt` (or `custom_excerpt`) |
   | `subTitle` | `custom_excerpt` *(or make optional)* |
   | `image` | `feature_image` |
   | `date` | `published_at` |
   | `author` | `primary_author.name` |
   | `content` | `html` *(drops straight into the current `dangerouslySetInnerHTML` render)* |

4. `prerender.mjs` reads the same fetched list to prerender each `/blog/:slug`, the sitemap, and JSON-LD — no other changes.
5. Minor CSS: Ghost wraps some content in `kg-*` classes; tune the `prose` styles if needed.

---

## Part 6 — Automate publishing (so posts go live on their own)

Because the site is prerendered on S3, a new post needs a **rebuild + redeploy**. Two ways:

**Option A — Scheduled rebuild (simplest, recommended to start)**
A GitHub Actions cron job rebuilds and deploys on a schedule (e.g. hourly):

```yaml
# .github/workflows/rebuild.yml
on:
  schedule:
    - cron: '0 * * * *'   # top of every hour
  workflow_dispatch:        # lets Aiden trigger manually too
jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with: { node-version: 18 }
      - run: npm ci && npm run build
        env:
          GHOST_URL: ${{ secrets.GHOST_URL }}
          GHOST_CONTENT_KEY: ${{ secrets.GHOST_CONTENT_KEY }}
      - uses: aws-actions/configure-aws-credentials@v4
        with:
          aws-access-key-id: ${{ secrets.AWS_ACCESS_KEY_ID }}
          aws-secret-access-key: ${{ secrets.AWS_SECRET_ACCESS_KEY }}
          aws-region: ${{ secrets.AWS_REGION }}
      - run: aws s3 sync dist/ s3://${{ secrets.S3_BUCKET }} --delete
      - run: aws cloudfront create-invalidation --distribution-id ${{ secrets.CF_DIST_ID }} --paths "/*"
```

A new post is live within the hour, and Aiden (or you) can hit **Run workflow** to publish instantly.

**Option B — Instant on publish (advanced)**
Add a Ghost **webhook** (Settings → Integrations → your integration → Add webhook, event *"Post published"*) pointing at a tiny relay (AWS Lambda / Cloudflare Worker) that calls GitHub's `repository_dispatch` to trigger the same workflow. Do this later if the hourly delay ever feels too slow.

**Secrets to add in GitHub** (repo → Settings → Secrets → Actions):
`GHOST_URL`, `GHOST_CONTENT_KEY`, `AWS_ACCESS_KEY_ID`, `AWS_SECRET_ACCESS_KEY`, `AWS_REGION`, `S3_BUCKET`, `CF_DIST_ID`.

---

## Part 7 — Email with Ghost's newsletter (Mailgun included)

Ghost has a built-in newsletter (members + email), so Aiden can email subscribers straight from the
post editor. On **Ghost Pro, email delivery is bundled** — Mailgun runs under the hood but Ghost Pro
manages it, so there's **no separate Mailgun account to create or pay for** (within your plan's monthly
email limit).

Setup:

1. In Ghost Admin → **Settings → Email newsletter**, confirm the newsletter is enabled.
2. Set the **sender name/address** (e.g. `Aiden <aiden@aveniradmissions.com>`).
3. *(Optional)* To send from your own domain rather than Ghost's default, add the **DNS records** Ghost
   shows you (SPF/DKIM) — improves deliverability but isn't required to start.

**Headless caveat — how people subscribe:** Ghost's signup UI (its "Portal") is built for the
Ghost-rendered site. Because your public blog is headless (React on S3), we wire the **subscribe form
on your site to Ghost's Members API** (or embed Ghost's Portal script) so visitors can join the list.
*I'll handle that integration.*

Once set up, publishing a post in Ghost can email subscribers automatically — all from one screen.

---

## Future option — self-hosted Ghost + MailerLite (to cut cost)

When you're ready to reduce the recurring bill, the planned migration is:

- **Self-host Ghost** on a small server (~$7–12/mo, no Ghost Pro fee). Trade-off: you take on
  server maintenance — updates, backups, security.
- **Switch email to [MailerLite](https://www.mailerlite.com)** (free ≤1,000 subscribers) via an
  **RSS campaign** instead of Mailgun. Ghost publishes an RSS feed at `{GHOST_URL}/rss/`, which
  MailerLite watches and auto-emails on each new post — no Mailgun, no paid delivery layer.

Ghost's content exports cleanly (**Settings → Export**), so the blog migrates without re-doing posts,
and the site's Content-API wiring (Part 5) is unchanged — only the Ghost URL + key swap over.
I can provide a dedicated self-hosting guide when that time comes.

---

## Part 8 — Google Analytics (free)

Separate from Ghost, and free:

1. Aiden creates a **GA4 property** at [analytics.google.com](https://analytics.google.com) with a **Web data stream** for `https://www.aveniradmissions.com`.
2. He sends you the **Measurement ID** (`G-XXXXXXXXXX`).
3. I add the gtag snippet to `index.html` (so it's in every prerendered page) plus a small route-change tracker so SPA navigation counts as page views, and optionally track "Book a Free Consultation" clicks + form submits as conversions.

---

## Maintenance

**None on the server side** — Ghost Pro handles updates, security, backups, SSL, and uptime.
Your only ongoing pieces are the site's own GitHub Actions deploy (Part 6) and, if added, the
MailerLite list. This is the main thing you're paying ~$9/mo for.

---

## Quick checklist

- [ ] Ghost Pro **Starter** account, owner = Aiden's email
- [ ] *(optional)* custom domain `cms.aveniradmissions.com` via CNAME
- [ ] Content API key + API URL → give to build
- [ ] Migrate 13 posts
- [ ] Wire site build to Ghost API *(me)*
- [ ] GitHub Actions rebuild + deploy, with secrets *(me)*
- [ ] Enable newsletter + set sender in Ghost (email delivery already included on Pro)
- [ ] *(optional)* add SPF/DKIM DNS to send from your own domain
- [ ] Subscribe form wired to Ghost Members API *(me)*
- [ ] GA4 Measurement ID → wired in *(me)*
- [ ] *(future)* migrate to self-hosted Ghost + MailerLite to cut cost

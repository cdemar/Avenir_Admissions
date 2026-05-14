import { useEffect } from "react";
import { BASE_URL } from "../config";

interface SEOProps {
  /** Full page title — will be used for document.title, og:title, and twitter:title */
  title: string;
  description: string;
  /** Absolute URL or root-relative path (e.g. "/logo.jpg") */
  image?: string;
  /** Absolute URL or root-relative path (e.g. "/blogs") */
  url?: string;
  type?: "website" | "article";
}


/**
 * Finds an existing <meta> element by attribute+value or creates a new one,
 * then sets its content attribute.
 */
function setMeta(
  attribute: "name" | "property",
  value: string,
  content: string
): void {
  let el = document.querySelector<HTMLMetaElement>(
    `meta[${attribute}="${value}"]`
  );
  if (!el) {
    el = document.createElement("meta");
    el.setAttribute(attribute, value);
    document.head.appendChild(el);
  }
  el.setAttribute("content", content);
}

const SEO = ({
  title,
  description,
  image = "/logo.jpg",
  url = "/",
  type = "website",
}: SEOProps) => {
  useEffect(() => {
    const absoluteImage = image.startsWith("http")
      ? image
      : `${BASE_URL}${image}`;
    const absoluteUrl = url.startsWith("http") ? url : `${BASE_URL}${url}`;

    // ── Document title ────────────────────────────────────────────────────
    document.title = title;

    // ── Canonical link ───────────────────────────────────────────────────
    let canonical = document.querySelector<HTMLLinkElement>('link[rel="canonical"]');
    if (!canonical) {
      canonical = document.createElement("link");
      canonical.setAttribute("rel", "canonical");
      document.head.appendChild(canonical);
    }
    canonical.setAttribute("href", absoluteUrl);

    // ── Standard meta ────────────────────────────────────────────────────
    setMeta("name", "description", description);

    // ── Open Graph ───────────────────────────────────────────────────────
    setMeta("property", "og:title", title);
    setMeta("property", "og:description", description);
    setMeta("property", "og:image", absoluteImage);
    setMeta("property", "og:url", absoluteUrl);
    setMeta("property", "og:type", type);
    setMeta("property", "og:site_name", "Avenir Admissions");

    // ── Twitter Card ─────────────────────────────────────────────────────
    setMeta("name", "twitter:card", "summary_large_image");
    setMeta("name", "twitter:title", title);
    setMeta("name", "twitter:description", description);
    setMeta("name", "twitter:image", absoluteImage);
  }, [title, description, image, url, type]);

  return null;
};

export default SEO;

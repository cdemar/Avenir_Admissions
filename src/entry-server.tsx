import { renderToString } from "react-dom/server";
import { StaticRouter } from "react-router";
import { AppContent } from "./AppContent";

/**
 * Renders the app to an HTML string for a given URL.
 * Called by prerender.mjs at build time — never runs in the browser.
 */
export function render(url: string): string {
  return renderToString(
    <StaticRouter location={url}>
      <AppContent />
    </StaticRouter>
  );
}

// Exported so prerender.mjs can build per-post OG/Twitter meta tags
// without re-parsing TypeScript source files.
export { blogData } from "./data/blogData";

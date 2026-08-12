import { useEffect } from "react";
import { useLocation } from "react-router-dom";

declare global {
  interface Window {
    gtag?: (...args: unknown[]) => void;
  }
}

/**
 * Sends a Google Analytics `page_view` on every client-side route change.
 *
 * The gtag snippet in index.html loads GA with `send_page_view: false`, so this
 * hook is the single source of page views — one per navigation, no double counts.
 * We track pathname + search only (not hash), so in-page anchor jumps like
 * "/#about" don't register as separate page views.
 *
 * SSR/prerender safe: the effect never runs during `renderToString`, and the
 * `window.gtag` guard covers the brief window before the GA script loads.
 */
const Analytics = () => {
  const { pathname, search } = useLocation();

  useEffect(() => {
    if (typeof window.gtag !== "function") return;
    window.gtag("event", "page_view", {
      page_path: pathname + search,
      page_location: window.location.href,
      page_title: document.title,
    });
  }, [pathname, search]);

  return null;
};

export default Analytics;
